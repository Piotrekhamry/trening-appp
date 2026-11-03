/* Baza ćwiczeń – Góry & Siła
   n = nazwa, d = dyscypliny (id), m = partia, tip = wskazówka techniki.
   Nazwy z domyślnych szablonów są tu bez zmian, żeby pasowały do historii. */
window.EXERCISE_GROUPS = ['Nogi', 'Pośladki', 'Plecy', 'Klatka', 'Barki', 'Ręce', 'Core', 'Całe ciało', 'Kondycja', 'Mobilność'];

window.EXERCISE_DB = [
  // ---------- Siłownia ----------
  { n: 'Przysiad ze sztangą z tyłu', d: ['silownia'], m: 'Nogi', tip: 'Stopy na szerokość barków, kolana idą w linii palców. Zejdź co najmniej do równoległości ud, plecy neutralne, wstawaj, pchając podłogę całą stopą.' },
  { n: 'Przysiad przedni', d: ['silownia'], m: 'Nogi', tip: 'Sztanga na przednich barkach, łokcie wysoko. Tułów bardziej pionowo niż w przysiadzie z tyłu – mocniej pracują czworogłowe.' },
  { n: 'Martwy ciąg', d: ['silownia'], m: 'Plecy', tip: 'Sztanga nad środkiem stopy, blisko piszczeli. Napnij brzuch i plecy, „odepchnij podłogę” nogami, biodra i barki rosną razem.' },
  { n: 'Martwy ciąg rumuński', d: ['silownia'], m: 'Pośladki', tip: 'Kolana lekko ugięte, biodra cofasz do tyłu, sztanga sunie po udach. Schodzisz do momentu mocnego rozciągnięcia tyłu ud.' },
  { n: 'Bułgarski przysiad', d: ['silownia', 'kettlebell'], m: 'Nogi', tip: 'Tylna stopa na ławce, przednia daleko. Schodź pionowo w dół. Świetne pod góry – siła jednej nogi i stabilizacja kolana.' },
  { n: 'Wejścia na skrzynię z obciążeniem', d: ['silownia', 'kettlebell'], m: 'Nogi', tip: 'Cała stopa na skrzyni, wchodź siłą przedniej nogi, nie odbijaj się tylną. Kontrolowane zejście – przygotowuje kolana do schodzenia ze szczytu.' },
  { n: 'Wykroki ze sztangą', d: ['silownia'], m: 'Nogi', tip: 'Długi krok, tylne kolano prawie dotyka podłogi, tułów prosto. Przednie kolano nad stopą.' },
  { n: 'Hip thrust', d: ['silownia'], m: 'Pośladki', tip: 'Łopatki na ławce, sztanga na biodrach. Wypchnij biodra do linii tułowia, mocno napnij pośladki na górze, broda przy klatce.' },
  { n: 'Wypychanie na suwnicy', d: ['silownia'], m: 'Nogi', tip: 'Lędźwia przyklejone do oparcia, nie prostuj kolan do końca na górze.' },
  { n: 'Wspięcia na palce', d: ['silownia', 'kalistenika'], m: 'Nogi', tip: 'Pełny zakres: pięta nisko pod stopniem, pauza na górze. Mocne łydki to mniej zmęczenia na długich podejściach.' },
  { n: 'Wyciskanie leżąc', d: ['silownia'], m: 'Klatka', tip: 'Łopatki ściągnięte, stopy w podłodze. Opuszczaj sztangę na dolną część klatki, łokcie ok. 45° od tułowia.' },
  { n: 'Wyciskanie hantli na skosie', d: ['silownia'], m: 'Klatka', tip: 'Ławka 30–45°. Hantle opuszczaj do boków klatki, wyciskaj lekko do środka.' },
  { n: 'Wyciskanie żołnierskie (OHP)', d: ['silownia'], m: 'Barki', tip: 'Napnij pośladki i brzuch, nie odchylaj się. Sztanga idzie pionowo, głowa „przechodzi” pod nią na górze.' },
  { n: 'Wyciskanie hantli siedząc', d: ['silownia'], m: 'Barki', tip: 'Plecy przy oparciu, hantle do wysokości uszu, wyciskaj bez blokowania łokci.' },
  { n: 'Unoszenie hantli bokiem', d: ['silownia'], m: 'Barki', tip: 'Lekki ciężar, łokcie minimalnie ugięte, unoś do wysokości barków bez bujania tułowiem.' },
  { n: 'Face pull', d: ['silownia'], m: 'Barki', tip: 'Linka na wysokości twarzy, ciągnij do czoła, rozchylając ręce. Zdrowe barki pod plecak.' },
  { n: 'Wiosłowanie sztangą w opadzie', d: ['silownia'], m: 'Plecy', tip: 'Tułów pochylony ok. 45°, plecy proste. Przyciągaj sztangę do pępka, ściągając łopatki.' },
  { n: 'Wiosłowanie hantlem jednorącz', d: ['silownia'], m: 'Plecy', tip: 'Ręka i kolano na ławce. Ciągnij hantel w stronę biodra, nie skręcaj tułowia.' },
  { n: 'Ściąganie drążka wyciągu do klatki', d: ['silownia'], m: 'Plecy', tip: 'Klatka do przodu, ściągaj drążek do górnej części mostka łokciami w dół.' },
  { n: 'Uginanie ramion ze sztangą', d: ['silownia'], m: 'Ręce', tip: 'Łokcie przy tułowiu, bez bujania. Powoli opuszczaj.' },
  { n: 'Prostowanie ramion na wyciągu', d: ['silownia'], m: 'Ręce', tip: 'Łokcie nieruchomo przy bokach, prostuj do końca, napnij triceps.' },
  { n: 'Spacer farmera', d: ['silownia', 'kettlebell'], m: 'Całe ciało', tip: 'Ciężkie hantle lub kettle w dłoniach, wyprostowana sylwetka, krótkie szybkie kroki. Chwyt i core jak przy noszeniu plecaka. Wpisz metry jako powtórzenia.' },

  // ---------- Kettlebell ----------
  { n: 'Kettlebell Swing (Oburącz)', d: ['kettlebell'], m: 'Pośladki', tip: 'To zawias biodrowy, nie przysiad. Wyrzut z bioder, ręce tylko prowadzą. Na górze napięte pośladki i brzuch, kettle do wysokości klatki.' },
  { n: 'Swing jednorącz', d: ['kettlebell'], m: 'Pośladki', tip: 'Jak swing oburącz, ale nie daj się skręcić tułowiowi. Zmieniaj ręce co serię.' },
  { n: 'TGU (Turkish Get-Up)', d: ['kettlebell'], m: 'Całe ciało', tip: 'Powoli, krok po kroku, wzrok na kettlu, ręka cały czas pionowo. Zacznij od lekkiego ciężaru albo buta na dłoni.' },
  { n: 'Goblet Squat', d: ['kettlebell', 'silownia'], m: 'Nogi', tip: 'Kettle przy klatce, łokcie między kolanami na dole. Tułów wyprostowany, pełny zakres.' },
  { n: 'Clean & Press (Zarzut i wyciskanie)', d: ['kettlebell'], m: 'Barki', tip: 'Zarzut z bioder do pozycji rack – kettle owija się wokół przedramienia, nie uderza. Potem wyciśnij nad głowę.' },
  { n: 'Snatch (Rwanie Kettlebell)', d: ['kettlebell'], m: 'Całe ciało', tip: 'Jednym ruchem z dołu nad głowę. Wyrzut z bioder, na górze „wbij” dłoń w rączkę, żeby kettle nie uderzało w przedramię.' },
  { n: 'Martwy ciąg z kettlebell', d: ['kettlebell'], m: 'Pośladki', tip: 'Kettle między stopami, biodra do tyłu, plecy proste. Dobry wstęp do swingu.' },
  { n: 'Wiosłowanie kettlebell', d: ['kettlebell'], m: 'Plecy', tip: 'Pozycja wykroku lub oparcie o ławkę, ciągnij kettle do biodra.' },
  { n: 'Przysiad z kettlebell w pozycji front rack', d: ['kettlebell'], m: 'Nogi', tip: 'Jeden lub dwa kettle w pozycji rack, łokcie blisko. Mocny core i pionowy tułów.' },
  { n: 'Windmill (Wiatrak)', d: ['kettlebell'], m: 'Core', tip: 'Kettle nad głową, wzrok na nim. Biodro w bok, schodzisz wolną ręką po nodze. Mobilność i stabilny bark.' },
  { n: 'Halo', d: ['kettlebell', 'wolne'], m: 'Mobilność', tip: 'Lekki kettle trzymany za rogi, krąż wokół głowy blisko szyi. Rozgrzewka barków.' },
  { n: 'Spacer walizkowy', d: ['kettlebell'], m: 'Core', tip: 'Ciężki kettle w jednej ręce, nie przechylaj się. Core pracuje jak przy nierównym obciążeniu w terenie. Wpisz metry jako powtórzenia.' },

  // ---------- Kalistenika ----------
  { n: 'Podciąganie na drążku (Nachwyt)', d: ['kalistenika'], m: 'Plecy', tip: 'Z pełnego zwisu, najpierw ściągnij łopatki, potem ciągnij brodą nad drążek. Bez bujania.' },
  { n: 'Podciąganie podchwytem', d: ['kalistenika'], m: 'Plecy', tip: 'Dłonie do siebie, na szerokość barków. Mocniej pracuje biceps – łatwiejsza wersja na start.' },
  { n: 'Australijskie podciąganie', d: ['kalistenika'], m: 'Plecy', tip: 'Drążek nisko, ciało proste jak deska, przyciągaj klatkę do drążka. Im bardziej poziomo, tym trudniej.' },
  { n: 'Pompki na poręczach (Dipy)', d: ['kalistenika'], m: 'Klatka', tip: 'Lekkie pochylenie do przodu, schodź do kąta 90° w łokciach. Barki nisko, z dala od uszu.' },
  { n: 'Pompki klasyczne', d: ['kalistenika'], m: 'Klatka', tip: 'Ciało w jednej linii, napięty brzuch i pośladki. Klatka prawie dotyka podłogi, łokcie ok. 45°.' },
  { n: 'Pompki diamentowe', d: ['kalistenika'], m: 'Ręce', tip: 'Dłonie złączone pod klatką (kciuki i palce wskazujące tworzą romb). Mocny triceps.' },
  { n: 'Pompki pike (na barki)', d: ['kalistenika'], m: 'Barki', tip: 'Biodra wysoko, ciało w kształcie odwróconego V. Opuszczaj głowę między dłonie.' },
  { n: 'Wznosy nóg w zwisie na drążku', d: ['kalistenika'], m: 'Core', tip: 'Bez bujania, unoś nogi siłą brzucha, na górze podwiń miednicę. Łatwiej: kolana do klatki.' },
  { n: 'Pistolety (Przysiady na jednej nodze)', d: ['kalistenika'], m: 'Nogi', tip: 'Druga noga wyprostowana z przodu, ręce do przodu dla balansu. Na start trzymaj się framugi albo schodź na skrzynię.' },
  { n: 'Przysiad skoczny', d: ['kalistenika'], m: 'Nogi', tip: 'Dynamiczny wyskok, miękkie lądowanie na całych stopach od razu w następny przysiad.' },
  { n: 'Wykroki chodzone', d: ['kalistenika'], m: 'Nogi', tip: 'Długie kroki do przodu, tylne kolano nisko. Można z plecakiem jako obciążeniem.' },
  { n: 'Plank (Deska)', d: ['kalistenika', 'wolne'], m: 'Core', tip: 'Przedramiona pod barkami, ciało w linii, napięte pośladki. Wpisz sekundy jako powtórzenia.' },
  { n: 'Deska boczna', d: ['kalistenika'], m: 'Core', tip: 'Łokieć pod barkiem, biodra wysoko. Wpisz sekundy jako powtórzenia, każda strona osobno.' },
  { n: 'Hollow body', d: ['kalistenika'], m: 'Core', tip: 'Leżąc na plecach, lędźwia dociśnięte do podłogi, ręce i nogi uniesione. Wpisz sekundy jako powtórzenia.' },
  { n: 'Burpees', d: ['kalistenika'], m: 'Kondycja', tip: 'Przysiad, wyrzut nóg do podporu, pompka, powrót i wyskok. Równe tempo zamiast szarpania.' },

  // ---------- Bieganie (czas) ----------
  { n: 'Rozgrzewkowy trucht', d: ['bieganie'], m: 'Kondycja', tip: 'Bardzo spokojnie, możesz swobodnie rozmawiać. 10 minut przed mocniejszą częścią.' },
  { n: 'Bieg spokojny w strefie 2', d: ['bieganie'], m: 'Kondycja', tip: 'Tempo konwersacyjne, ok. 60–70% tętna maks. Buduje wytrzymałość na długie dni w górach.' },
  { n: 'Długie wybieganie', d: ['bieganie'], m: 'Kondycja', tip: 'Najdłuższy bieg tygodnia, spokojne tempo. Wydłużaj o ok. 10% tygodniowo.' },
  { n: 'Rytmy / Przyspieszenia', d: ['bieganie'], m: 'Kondycja', tip: '6–8 × 20 s szybko, ale luźno, z pełnym odpoczynkiem marszem lub truchtem.' },
  { n: 'Podbiegi pod górę', d: ['bieganie'], m: 'Kondycja', tip: 'Krótkie kroki, praca rąk, wzrok przed siebie. Zbiegaj spokojnie – to przerwa.' },
  { n: 'Bieg tempowy (próg)', d: ['bieganie'], m: 'Kondycja', tip: 'Komfortowo ciężko – możesz powiedzieć kilka słów, ale nie rozmawiać. 15–30 minut.' },
  { n: 'Interwały 400 m', d: ['bieganie'], m: 'Kondycja', tip: 'Odcinki 400 m szybko, przerwa 200 m truchtem. Równe tempo na wszystkich odcinkach.' },
  { n: 'Fartlek', d: ['bieganie'], m: 'Kondycja', tip: 'Zabawa tempem: przyspieszasz do drzewa, słupa, końca ulicy, potem luźno. Bez zegarka.' },
  { n: 'Bieg terenowy (trail)', d: ['bieganie'], m: 'Kondycja', tip: 'Ścieżki, korzenie, podbiegi. Krótszy krok, pod stromo przejdź w marsz – tak jak w górach.' },
  { n: 'Bieg po schodach', d: ['bieganie', 'gory'], m: 'Kondycja', tip: 'Wbiegaj co stopień, schodź spokojnie. Świetny zamiennik podejść, gdy gór brak pod ręką.' },
  { n: 'Schłodzenie / Schodzenie z tętna', d: ['bieganie'], m: 'Kondycja', tip: 'Trucht przechodzący w marsz, aż oddech się uspokoi.' },

  // ---------- Góry (czas) ----------
  { n: 'Marsz pod górę z plecakiem', d: ['gory'], m: 'Kondycja', tip: 'Stałe tempo, w którym możesz mówić pełnymi zdaniami. Krótkie kroki na stromym, kijki odciążają kolana.' },
  { n: 'Podejście strome / Wspinaczka trailowa', d: ['gory'], m: 'Kondycja', tip: 'Ręce na udach lub kijki, stawiaj całą stopę. Rytm oddechu ważniejszy niż prędkość.' },
  { n: 'Trekking po płaskim / Granią', d: ['gory'], m: 'Kondycja', tip: 'Równe tempo, jedz i pij co godzinę. Na grani pilnuj pogody i czasu powrotu.' },
  { n: 'Schodzenie / Zejście ze szczytu', d: ['gory'], m: 'Nogi', tip: 'Kolana lekko ugięte, krótkie kroki, kijki wydłużone. Najwięcej urazów zdarza się w zejściu – nie pędź.' },
  { n: 'Marsz powrotny do schroniska', d: ['gory'], m: 'Kondycja', tip: 'Spokojny marsz na koniec dnia, uzupełnij płyny.' },
  { n: 'Marsz z kijkami (Nordic walking)', d: ['gory', 'bieganie'], m: 'Kondycja', tip: 'Kijek wbijasz przy pięcie przeciwnej nogi, odpychasz się do tyłu. Pracuje też góra ciała.' },
  { n: 'Marsz na bieżni pod kątem z plecakiem', d: ['gory'], m: 'Kondycja', tip: 'Nachylenie 10–15%, plecak 8–12 kg, bez trzymania poręczy. Najlepszy zamiennik podejść zimą.' },
  { n: 'Schody z plecakiem', d: ['gory'], m: 'Kondycja', tip: 'Klatka schodowa w bloku: w górę z plecakiem, w dół spokojnie. Licz piętra albo minuty.' },
  { n: 'Via ferrata', d: ['gory'], m: 'Całe ciało', tip: 'Zawsze wpięta przynajmniej jedna lonża, praca nóg zamiast ciągnięcia rękami.' },
  { n: 'Skitury – podejście', d: ['gory'], m: 'Kondycja', tip: 'Ślizgaj nartę, nie podnoś jej. Równe tempo i zakosy na stromym.' },

  // ---------- Wolne / Regeneracja ----------
  { n: 'Rolowanie piankowym wałkiem (Pianka)', d: ['wolne'], m: 'Mobilność', tip: 'Powoli, 30–60 s na partię: łydki, uda, pośladki, plecy. Na bolesnym punkcie zatrzymaj się i oddychaj.' },
  { n: 'Rozciąganie taśmy tylnej (Nogi i pośladki)', d: ['wolne'], m: 'Mobilność', tip: 'Skłon z prostymi plecami, ruch z bioder. 30–60 s bez sprężynowania.' },
  { n: 'Rozciąganie łydek i ścięgna Achillesa', d: ['wolne'], m: 'Mobilność', tip: 'O ścianę: noga z tyłu prosta, potem lekko ugięta. Ważne po bieganiu i zejściach.' },
  { n: 'Rozciąganie zginaczy bioder', d: ['wolne'], m: 'Mobilność', tip: 'Klęk jednonóż, podwiń miednicę i napnij pośladek tylnej nogi. Odciąża lędźwia po dniu siedzenia.' },
  { n: 'Mobilizacja stawu skokowego', d: ['wolne'], m: 'Mobilność', tip: 'Kolano nad palcami w stronę ściany, pięta na podłodze. Lepsza kostka to pewniejszy krok w terenie.' },
  { n: 'Mobilizacja bioder i klatki piersiowej', d: ['wolne'], m: 'Mobilność', tip: 'Krążenia bioder, „otwieranie książki” w leżeniu bokiem, rotacje w klęku podpartym.' },
  { n: 'Kot–krowa', d: ['wolne'], m: 'Mobilność', tip: 'Klęk podparty, na wydechu zaokrąglij plecy, na wdechu wygnij. Powoli, w rytm oddechu.' },
  { n: 'Joga / Stretches pod kręgosłup', d: ['wolne'], m: 'Mobilność', tip: 'Pozycja dziecka, skręty w leżeniu, pies z głową w dół. Bez bólu, z długim wydechem.' },
  { n: 'Oddychanie przeponowe', d: ['wolne'], m: 'Mobilność', tip: 'Dłoń na brzuchu, wdech nosem tak, żeby unosił się brzuch, długi wydech. 5 minut na wyciszenie.' },
  { n: 'Spacer regeneracyjny i ćwiczenia oddechowe', d: ['wolne'], m: 'Kondycja', tip: '30–45 minut spokojnego spaceru. Krążenie bez obciążania mięśni.' }
];
