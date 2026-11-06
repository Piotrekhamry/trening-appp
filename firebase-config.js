/* Konfiguracja Firebase (logowanie Google + historia w chmurze).
   Te dane są publiczne z założenia – bezpieczeństwo zapewniają reguły Firestore,
   które pozwalają każdemu użytkownikowi czytać i zapisywać tylko własne dane. */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDT3YYFrU4aQFNVmvMMAsKfjPXwp9gCo5I",
  authDomain: "gory-sila-55f90.firebaseapp.com",
  projectId: "gory-sila-55f90",
  storageBucket: "gory-sila-55f90.firebasestorage.app",
  messagingSenderId: "270718581466",
  appId: "1:270718581466:web:22fb5539e7273d872a43e3",
  // Logowanie przez własną domenę (przekierowanie /__/auth w vercel.json) –
  // potrzebne, żeby logowanie działało w zainstalowanej aplikacji na iPhonie.
  useOwnDomain: true
};
