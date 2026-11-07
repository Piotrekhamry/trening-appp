/* ============================================================
   Góry & Siła – synchronizacja z chmurą (Firebase)
   ------------------------------------------------------------
   - logowanie przez Google
   - każdy trening to osobny dokument: users/{uid}/workouts/{id}
   - ustawienia (szablony, grafik, cel, własne ćwiczenia, trening w toku):
     users/{uid}/meta/settings
   - działa offline: zapisy czekają w kolejce i wysyłają się po odzyskaniu zasięgu
   Aplikacja dalej zapisuje wszystko lokalnie; ten moduł obserwuje te zapisy
   i odzwierciedla je w chmurze, a zmiany z innych urządzeń wczytuje z powrotem.
   ============================================================ */
const cfg = window.FIREBASE_CONFIG;
const $ = (id) => document.getElementById(id);

if (!cfg || !cfg.apiKey) {
  // Chmura nieskonfigurowana – aplikacja działa lokalnie, karta konta ukryta.
  window.cloudSignIn = () => {};
  window.cloudSignOut = () => {};
  window.cloudDeleteAccount = () => {};
} else {
  initCloud().catch((e) => console.error('[cloud] init', e));
}

async function initCloud() {
  const V = '11.0.2';
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);

  // Logowanie przez własną domenę (przekierowanie /__/auth w vercel.json),
  // żeby działało też w zainstalowanej aplikacji na iPhonie.
  const isLocal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const authDomain = cfg.useOwnDomain && !isLocal ? location.host : cfg.authDomain;
  const app = initializeApp({ ...cfg, authDomain });
  const auth = A.getAuth(app);
  const db = F.initializeFirestore(app, {
    ignoreUndefinedProperties: true,
    localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() })
  });

  const SETTINGS_KEYS = ['gs_templates_v6', 'gs_monthly_plan_v3', 'gs_plan_start', 'gs_plan_disciplines',
    'gs_goal', 'gs_custom_exercises', 'gs_current_workout_v1', 'gs_profile'];
  const HISTORY_KEY = 'gs_history_v3';

  let user = null;
  let unsubs = [];
  let applyingRemote = false;      // true, gdy sami wpisujemy dane z chmury (bez odsyłania ich z powrotem)
  let syncedHashes = new Map();    // id treningu -> „odcisk” wersji, która jest w chmurze
  let pushTimer = null;
  let lastSettingsPush = 0;

  $('cloud-card').classList.remove('hidden');

  /* ---------- Status w karcie konta ---------- */
  function setStatus(text) { const el = $('cloud-status'); if (el) el.textContent = text; }
  function renderAccount() {
    $('cloud-signed-out').classList.toggle('hidden', !!user);
    $('cloud-signed-in').classList.toggle('hidden', !user);
    if (user) $('cloud-user').textContent = user.displayName || user.email || 'Zalogowano';
  }
  window.addEventListener('online', () => user && setStatus('Synchronizuję…'));
  window.addEventListener('offline', () => user && setStatus('Offline – zapisuję w telefonie, wyślę później'));

  /* ---------- Logowanie ---------- */
  const provider = new A.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  window.cloudSignIn = async () => {
    try {
      if (standalone || isMobile) await A.signInWithRedirect(auth, provider);
      else await A.signInWithPopup(auth, provider);
    } catch (e) {
      if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/cancelled-popup-request'].includes(e.code)) {
        await A.signInWithRedirect(auth, provider);
      } else if (e.code !== 'auth/popup-closed-by-user') {
        console.error('[cloud] sign-in', e);
        alert('Nie udało się zalogować: ' + (e.code || e.message));
      }
    }
  };

  window.cloudSignOut = async () => {
    if (!confirm('Wylogować? Dane zostaną w tym telefonie, ale przestaną się synchronizować.')) return;
    await A.signOut(auth);
  };

  /* ---------- Usunięcie konta i wszystkich danych ---------- */
  const PENDING_DELETE = 'gs_pending_account_delete';

  window.cloudDeleteAccount = async () => {
    if (!user) return;
    if (!confirm('Usunąć konto w Góry & Siła?\n\nZnikną wszystkie Twoje treningi, szablony i ustawienia – w chmurze i na tym urządzeniu. Tego nie da się cofnąć.')) return;
    if (!confirm('Na pewno? Ostatnie potwierdzenie – wszystkie dane zostaną trwale usunięte.')) return;
    await deleteEverything();
  };

  async function deleteEverything() {
    setStatus('Usuwam dane…');
    try {
      unsubs.forEach((f) => f()); unsubs = [];
      // 1) dane w chmurze
      const snap = await F.getDocs(workoutsCol());
      for (let i = 0; i < snap.docs.length; i += 400) {
        const batch = F.writeBatch(db);
        snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
      await F.deleteDoc(settingsDoc());
      // 2) samo konto logowania (Google wymaga świeżego zalogowania)
      try {
        await A.deleteUser(user);
      } catch (e) {
        if (e.code === 'auth/requires-recent-login') {
          localStorage.setItem(PENDING_DELETE, user.uid);
          alert('Dla bezpieczeństwa Google prosi o ponowne zalogowanie. Po zalogowaniu usuwanie dokończy się samo.');
          if (standalone || isMobile) return A.reauthenticateWithRedirect(user, provider);
          await A.reauthenticateWithPopup(user, provider);
          await A.deleteUser(user);
        } else throw e;
      }
      finishLocalWipe();
    } catch (e) {
      console.error('[cloud] delete', e);
      alert('Nie udało się usunąć wszystkiego: ' + (e.code || e.message) + '\nSpróbuj ponownie albo napisz do mnie przez „Zgłoś uwagi”.');
      setStatus('Błąd usuwania');
    }
  }

  function finishLocalWipe() {
    localStorage.removeItem(PENDING_DELETE);
    Object.keys(localStorage).filter((k) => k.startsWith('gs_')).forEach((k) => origRemove.call(localStorage, k));
    alert('Konto i wszystkie dane zostały usunięte.');
    location.reload();
  }

  A.getRedirectResult(auth).catch((e) => {
    if (e.code && e.code !== 'auth/no-auth-event') alert('Nie udało się zalogować: ' + e.code);
  });

  A.onAuthStateChanged(auth, async (u) => {
    unsubs.forEach((f) => f()); unsubs = [];
    user = u;
    renderAccount();
    if (!u) return;
    // Powrót po ponownym zalogowaniu w trakcie usuwania konta
    if (localStorage.getItem(PENDING_DELETE) === u.uid) {
      try { await A.deleteUser(u); finishLocalWipe(); }
      catch (e) { localStorage.removeItem(PENDING_DELETE); alert('Nie udało się usunąć konta: ' + (e.code || e.message)); }
      return;
    }
    setStatus('Synchronizuję…');
    try {
      await firstMerge();
      listen();
      setStatus(navigator.onLine ? '✓ Zsynchronizowano' : 'Offline – zapisuję w telefonie, wyślę później');
    } catch (e) {
      console.error('[cloud] sync', e);
      setStatus('Błąd synchronizacji – dane są bezpieczne w telefonie');
    }
  });

  /* ---------- Ścieżki ---------- */
  const workoutsCol = () => F.collection(db, 'users', user.uid, 'workouts');
  const workoutDoc = (id) => F.doc(db, 'users', user.uid, 'workouts', String(id));
  const settingsDoc = () => F.doc(db, 'users', user.uid, 'meta', 'settings');
  const hash = (o) => JSON.stringify(o);

  function readSettings() {
    return {
      templates: state.templates,
      monthlyPlan: state.monthlyPlan,
      planStart: state.planStart || null,
      planDisciplines: state.planDisciplines,
      goal: state.goal || null,
      customExercises: state.customExercises || [],
      profile: state.profile || null,
      draft: JSON.parse(localStorage.getItem('gs_current_workout_v1') || 'null')
    };
  }

  /* ---------- Pierwsze połączenie: łączymy dane z telefonu i z chmury ---------- */
  async function firstMerge() {
    const mergedFlag = 'gs_cloud_merged_' + user.uid;
    const snap = await F.getDocs(workoutsCol());
    const cloud = snap.docs.map((d) => d.data());
    syncedHashes = new Map(cloud.map((w) => [String(w.id), hash(w)]));

    if (!localStorage.getItem(mergedFlag)) {
      // Pierwsze logowanie na tym urządzeniu: suma obu historii
      const cloudIds = new Set(cloud.map((w) => String(w.id)));
      const localOnly = state.history.filter((h) => !cloudIds.has(String(h.id)));
      if (localOnly.length) {
        for (let i = 0; i < localOnly.length; i += 400) {
          const batch = F.writeBatch(db);
          localOnly.slice(i, i + 400).forEach((h) => batch.set(workoutDoc(h.id), h));
          await batch.commit();
        }
        localOnly.forEach((h) => syncedHashes.set(String(h.id), hash(h)));
      }
      applyHistory([...cloud, ...localOnly]);

      const s = await F.getDoc(settingsDoc());
      if (s.exists()) applySettings(s.data(), true);
      else await pushSettings();
      localStorage.setItem(mergedFlag, '1');
    } else {
      applyHistory(cloud);
    }
  }

  /* ---------- Nasłuch zmian z innych urządzeń ---------- */
  function listen() {
    unsubs.push(F.onSnapshot(workoutsCol(), { includeMetadataChanges: true }, (snap) => {
      const cloud = snap.docs.map((d) => d.data());
      syncedHashes = new Map(cloud.map((w) => [String(w.id), hash(w)]));
      applyHistory(cloud);
      if (!snap.metadata.hasPendingWrites && navigator.onLine) setStatus('✓ Zsynchronizowano');
      else if (snap.metadata.hasPendingWrites) setStatus(navigator.onLine ? 'Synchronizuję…' : 'Offline – zapisuję w telefonie, wyślę później');
    }));
    unsubs.push(F.onSnapshot(settingsDoc(), (snap) => {
      if (!snap.exists() || snap.metadata.hasPendingWrites) return;
      const d = snap.data();
      if ((d.updatedAt || 0) <= lastSettingsPush) return;   // to nasz własny zapis
      applySettings(d, false);
    }));
  }

  /* ---------- Wczytywanie danych z chmury do aplikacji ---------- */
  function withRemote(fn) { applyingRemote = true; try { fn(); } finally { applyingRemote = false; } }

  function applyHistory(list) {
    const byId = new Map();
    list.forEach((h) => byId.set(String(h.id), h));
    const next = [...byId.values()].sort((a, b) => (b.ts || b.id) - (a.ts || a.id));
    if (hash(next) === hash(state.history)) return;
    withRemote(() => {
      state.history = next;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    });
    if (typeof applySuggestion === 'function') applySuggestion();
    if (!$('tab-history').classList.contains('hidden')) renderHistory();
  }

  function applySettings(d, initial) {
    withRemote(() => {
      if (d.templates) { state.templates = d.templates; localStorage.setItem('gs_templates_v6', JSON.stringify(d.templates)); }
      if (d.monthlyPlan) { state.monthlyPlan = d.monthlyPlan; localStorage.setItem('gs_monthly_plan_v3', JSON.stringify(d.monthlyPlan)); }
      if (d.planStart) { state.planStart = d.planStart; localStorage.setItem('gs_plan_start', d.planStart); }
      if (d.planDisciplines) { state.planDisciplines = d.planDisciplines; localStorage.setItem('gs_plan_disciplines', JSON.stringify(d.planDisciplines)); }
      state.goal = d.goal || null;
      d.goal ? localStorage.setItem('gs_goal', JSON.stringify(d.goal)) : localStorage.removeItem('gs_goal');
      if (d.profile && typeof PROFILES !== 'undefined' && PROFILES[d.profile] && d.profile !== state.profile) {
        state.profile = d.profile; localStorage.setItem('gs_profile', d.profile);
        if (!state.dirty) applySuggestion(); else renderDisciplineSelector();
        closeProfilePicker();
      }
      if (Array.isArray(d.customExercises)) { state.customExercises = d.customExercises; localStorage.setItem('gs_custom_exercises', JSON.stringify(d.customExercises)); }

      // Trening w toku z innego urządzenia – tylko jeśli tu nic nie jest w toku
      if (d.draft && !state.dirty && d.draft.workout) {
        localStorage.setItem('gs_current_workout_v1', JSON.stringify(d.draft));
        if (restoreDraft()) {
          state.suggestion = getSuggestion();
          renderDisciplineSelector(); renderWorkout(); renderDraftBanner();
          if (!initial) showToast('Wczytano trening w toku z innego urządzenia.');
        }
      } else if (!d.draft && state.dirty && !initial) {
        // Trening zapisany na innym urządzeniu – tu go zamykamy, jeśli nic się nie zmieniło od tamtej pory
        const local = JSON.parse(localStorage.getItem('gs_current_workout_v1') || 'null');
        if (local && local.savedAt <= (d.updatedAt || 0)) { clearDraft(); applySuggestion(); }
      }
    });
    if (typeof renderGoal === 'function') renderGoal();
    if (!$('tab-plan').classList.contains('hidden')) renderMonthlyPlan();
  }

  /* ---------- Wysyłanie zmian z telefonu do chmury ---------- */
  async function pushHistory() {
    const local = new Map(state.history.map((h) => [String(h.id), h]));
    const ops = [];
    local.forEach((h, id) => { if (syncedHashes.get(id) !== hash(h)) ops.push(['set', id, h]); });
    syncedHashes.forEach((_, id) => { if (!local.has(id)) ops.push(['del', id]); });
    for (let i = 0; i < ops.length; i += 400) {
      const batch = F.writeBatch(db);
      ops.slice(i, i + 400).forEach(([op, id, h]) => op === 'set' ? batch.set(workoutDoc(id), h) : batch.delete(workoutDoc(id)));
      batch.commit().catch((e) => console.error('[cloud] history', e));   // offline: czeka w kolejce
    }
    ops.forEach(([op, id, h]) => op === 'set' ? syncedHashes.set(id, hash(h)) : syncedHashes.delete(id));
  }

  async function pushSettings() {
    lastSettingsPush = Date.now();
    F.setDoc(settingsDoc(), { ...readSettings(), updatedAt: lastSettingsPush })
      .catch((e) => console.error('[cloud] settings', e));
  }

  const dirtyKeys = new Set();
  function schedulePush(key) {
    if (!user || applyingRemote) return;
    dirtyKeys.add(key);
    clearTimeout(pushTimer);
    pushTimer = setTimeout(() => {
      const keys = [...dirtyKeys]; dirtyKeys.clear();
      if (keys.includes(HISTORY_KEY)) pushHistory();
      if (keys.some((k) => SETTINGS_KEYS.includes(k))) pushSettings();
      if (!navigator.onLine) setStatus('Offline – zapisuję w telefonie, wyślę później');
    }, 800);
  }

  // Obserwujemy zapisy aplikacji do pamięci telefonu
  const origSet = Storage.prototype.setItem, origRemove = Storage.prototype.removeItem;
  Storage.prototype.setItem = function (k, v) {
    origSet.call(this, k, v);
    if (this === window.localStorage && (k === HISTORY_KEY || SETTINGS_KEYS.includes(k))) schedulePush(k);
  };
  Storage.prototype.removeItem = function (k) {
    origRemove.call(this, k);
    if (this === window.localStorage && (k === HISTORY_KEY || SETTINGS_KEYS.includes(k))) schedulePush(k);
  };

  // Zanim telefon uśpi aplikację – wyślij od razu, co czeka
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && dirtyKeys.size) {
      clearTimeout(pushTimer);
      const keys = [...dirtyKeys]; dirtyKeys.clear();
      if (keys.includes(HISTORY_KEY)) pushHistory();
      if (keys.some((k) => SETTINGS_KEYS.includes(k))) pushSettings();
    }
  });
}
