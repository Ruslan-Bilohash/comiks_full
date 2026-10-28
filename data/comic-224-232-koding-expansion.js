window.COMICS = window.COMICS || [];

/* Nine complete lessons bring the children's coding curriculum to 50 comics.
   Each lesson has six illustrated panels, trilingual dialogue, concept tests
   and a focused vocabulary list. */
(() => {
  const tri = value => value.split('|');
  const lessons = [
    {
      id: 'p224', level: 'A2', track: 'web', term: 'tilgjengelighet',
      title: 'En nettside for alle|Сайт для кожного|A website for everyone',
      summary: 'Nora gjør en nettside tydelig for tastatur, skjermleser og ulike synsevner.|Нора робить сайт зручним для клавіатури, читача екрана та людей із різним зором.|Nora makes a website clear for keyboards, screen readers and different visual abilities.',
      scenes: [
        ['browser','h1 + nav + main','Vi bygger siden med tydelige deler.|Будуємо сторінку з чіткими частинами.|We build the page with clear sections.','Semantisk HTML forteller hva innholdet betyr.|Семантичний HTML пояснює значення вмісту.|Semantic HTML explains what the content means.'],
        ['codecard','alt="Robo vinker"','Bildet trenger en kort beskrivelse.|Зображенню потрібен короткий опис.|The image needs a short description.','Alt-tekst hjelper når bildet ikke kan sees.|Alt-текст допомагає, коли зображення не видно.|Alt text helps when the image cannot be seen.'],
        ['csscard','kontrast 7:1','Lyse bokstaver på hvitt er vanskelige å lese.|Світлі літери на білому важко читати.|Light letters on white are hard to read.','God kontrast gjør teksten tydeligere.|Хороший контраст робить текст чіткішим.|Good contrast makes text clearer.'],
        ['browser','Tab → fokus','Jeg kan nå alle knappene uten mus.|Я можу дістатися всіх кнопок без миші.|I can reach every button without a mouse.','Synlig fokus viser hvor tastaturet er.|Видимий фокус показує позицію клавіатури.|Visible focus shows where the keyboard is.'],
        ['codecard','label + input','Skjemafeltet får en synlig etikett.|Поле форми отримує видиму мітку.|The form field gets a visible label.','Da vet alle hva de skal skrive.|Тоді кожен знає, що вводити.|Then everyone knows what to enter.'],
        ['datashield','test med flere brukere','Vi tester siden med tastatur og skjermleser.|Тестуємо сайт клавіатурою та читачем екрана.|We test the site with a keyboard and screen reader.','Tilgjengelig design hjelper mange mennesker.|Доступний дизайн допомагає багатьом людям.|Accessible design helps many people.']
      ],
      tasks: [
        ['Hva gjør alt-tekst?|Що робить alt-текст?|What does alt text do?','Beskriver bildet|Описує зображення|Describes the image','Endrer passordet|Змінює пароль|Changes the password','Starter spillet|Запускає гру|Starts the game','Sletter CSS|Видаляє CSS|Deletes CSS'],
        ['Hvorfor trenger vi synlig fokus?|Навіщо потрібен видимий фокус?|Why do we need visible focus?','For å vise tastaturposisjonen|Щоб показати позицію клавіатури|To show the keyboard position','For å skjule knapper|Щоб приховати кнопки|To hide buttons','For å lagre data|Щоб зберігати дані|To store data','For å gjøre teksten mindre|Щоб зменшити текст|To make text smaller'],
        ['Hva gir god kontrast?|Що дає хороший контраст?|What does good contrast provide?','Tydeligere tekst|Чіткіший текст|Clearer text','Flere annonser|Більше реклами|More adverts','Raskere SQL|Швидший SQL|Faster SQL','Et nytt passord|Новий пароль|A new password']
      ],
      vocab: ['tilgjengelighet|доступність|accessibility','semantisk HTML|семантичний HTML|semantic HTML','alt-tekst|альтернативний текст|alt text','en skjermleser|читач екрана|a screen reader','kontrast|контраст|contrast','et tastatur|клавіатура|a keyboard','fokus|фокус|focus','en etikett|мітка|a label','et skjemafelt|поле форми|a form field','synlig|видимий|visible','tydelig|чіткий|clear','å teste|тестувати|to test']
    },
    {
      id: 'p225', level: 'A2', track: 'game', term: 'en spilltilstand',
      title: 'Start, pause og spill igjen|Старт, пауза і нова гра|Start, pause and play again',
      summary: 'Robo organiserer spillet i tydelige tilstander for meny, spill, pause og resultat.|Робо впорядковує гру за станами меню, гри, паузи та результату.|Robo organises the game into clear menu, play, pause and result states.',
      scenes: [
        ['gameview','MENY','Spillet åpner med en startknapp.|Гра відкривається кнопкою старту.|The game opens with a start button.','Meny er den første spilltilstanden.|Меню — перший стан гри.|The menu is the first game state.'],
        ['codecard','tilstand = SPILL','Når jeg trykker start, bytter vi tilstand.|Коли натискаю старт, ми змінюємо стан.|When I press start, we change state.','Nå beveger figuren seg og tiden går.|Тепер персонаж рухається, а час іде.|Now the character moves and time runs.'],
        ['gameview','PAUSE','Jeg må stoppe et øyeblikk.|Мені треба зупинитися на мить.|I need to stop for a moment.','Pause fryser spillet uten å miste fremgangen.|Пауза зупиняє гру без втрати прогресу.|Pause freezes the game without losing progress.'],
        ['codecard','hvis liv == 0','Figuren har ingen liv igjen.|У персонажа не залишилося життів.|The character has no lives left.','Da går spillet til GAME OVER.|Тоді гра переходить у GAME OVER.|Then the game enters GAME OVER.'],
        ['gameview','RESULTAT: 12','Resultatskjermen viser poeng og beste forsøk.|Екран результатів показує бали й найкращу спробу.|The result screen shows the score and best attempt.','Spilleren forstår hva som skjedde.|Гравець розуміє, що сталося.|The player understands what happened.'],
        ['codecard','start på nytt','Knappen nullstiller poeng, liv og posisjon.|Кнопка скидає бали, життя й позицію.|The button resets score, lives and position.','En tydelig løkke lar oss spille igjen.|Чіткий цикл дозволяє зіграти знову.|A clear loop lets us play again.']
      ],
      tasks: [
        ['Hva er en spilltilstand?|Що таке стан гри?|What is a game state?','En bestemt del av spillet|Певна частина гри|A particular part of the game','En CSS-farge|Колір CSS|A CSS colour','En databasekolonne|Стовпець бази|A database column','Et passord|Пароль|A password'],
        ['Hva gjør pause?|Що робить пауза?|What does pause do?','Fryser spillet midlertidig|Тимчасово зупиняє гру|Freezes the game temporarily','Sletter hele spillet|Видаляє всю гру|Deletes the whole game','Dobler poengene|Подвоює бали|Doubles the score','Skjuler menyen for alltid|Назавжди приховує меню|Hides the menu forever'],
        ['Hva nullstilles ved ny start?|Що скидається під час нового старту?|What resets on a new start?','Poeng, liv og posisjon|Бали, життя й позиція|Score, lives and position','Skjermens størrelse|Розмір екрана|The screen size','Internett|Інтернет|The internet','HTML-koden|HTML-код|The HTML code']
      ],
      vocab: ['en spilltilstand|стан гри|a game state','en meny|меню|a menu','å starte|починати|to start','å pause|ставити на паузу|to pause','å fryse|зупиняти|to freeze','en fremgang|прогрес|progress','et liv|життя|a life','game over|кінець гри|game over','et resultat|результат|a result','et forsøk|спроба|an attempt','å nullstille|скидати|to reset','å spille igjen|грати знову|to play again']
    },
    {
      id: 'p226', level: 'B1', track: 'blender', term: 'et UV-kart',
      title: 'Mønster på roboten|Візерунок на роботі|A pattern on the robot',
      summary: 'Nora pakker ut en 3D-modell, legger på tekstur og kontrollerer resultatet i lyset.|Нора розгортає 3D-модель, додає текстуру та перевіряє результат при освітленні.|Nora unwraps a 3D model, adds a texture and checks the result under lighting.',
      scenes: [
        ['blender','3D-form','Roboten er modellert, men den er helt grå.|Робота змодельовано, але він увесь сірий.|The robot is modelled, but it is completely grey.','Nå skal overflaten få farge og mønster.|Тепер поверхня отримає колір і візерунок.|Now the surface will get colour and a pattern.'],
        ['blender','markér sømmer','Vi markerer hvor modellen kan åpnes.|Позначаємо місця, де модель можна розгорнути.|We mark where the model can open.','Sømmer hjelper oss å pakke ut formen.|Шви допомагають розгорнути форму.|Seams help us unwrap the shape.'],
        ['blender','UV unwrap','3D-overflaten blir et flatt kart.|3D-поверхня стає пласкою картою.|The 3D surface becomes a flat map.','Det kalles et UV-kart.|Це називається UV-картою.|This is called a UV map.'],
        ['csscard','tekstur.png','Vi plasserer farger på kartet.|Розміщуємо кольори на карті.|We place colours on the map.','Teksturen følger delene tilbake på modellen.|Текстура повертається на відповідні частини моделі.|The texture follows the parts back onto the model.'],
        ['blender','materiale + tekstur','Materialet bestemmer hvordan lyset treffer overflaten.|Матеріал визначає, як світло падає на поверхню.|The material decides how light hits the surface.','Teksturen gir detaljer og mønster.|Текстура додає деталі й візерунок.|The texture adds detail and pattern.'],
        ['blender','render','Vi roterer modellen og ser etter strekk.|Обертаємо модель і шукаємо розтягнення.|We rotate the model and look for stretching.','Et ryddig UV-kart gir et pent resultat.|Охайна UV-карта дає гарний результат.|A tidy UV map gives a neat result.']
      ],
      tasks: [
        ['Hva er et UV-kart?|Що таке UV-карта?|What is a UV map?','Et flatt kart av 3D-overflaten|Пласка карта 3D-поверхні|A flat map of the 3D surface','En spillmeny|Ігрове меню|A game menu','En SQL-tabell|SQL-таблиця|An SQL table','Et passord|Пароль|A password'],
        ['Hva gir teksturen?|Що дає текстура?|What does the texture provide?','Detaljer og mønster|Деталі й візерунок|Detail and pattern','Tyngdekraft|Гравітацію|Gravity','En nettadresse|Вебадресу|A web address','Flere liv|Більше життів|More lives'],
        ['Hvorfor roterer vi modellen til slutt?|Навіщо наприкінці обертати модель?|Why do we rotate the model at the end?','For å finne strekk og feil|Щоб знайти розтягнення й помилки|To find stretching and errors','For å slette lyset|Щоб видалити світло|To delete the light','For å åpne databasen|Щоб відкрити базу|To open the database','For å starte nettleseren|Щоб запустити браузер|To start the browser']
      ],
      vocab: ['et UV-kart|UV-карта|a UV map','en overflate|поверхня|a surface','en søm|шов|a seam','å pakke ut|розгортати|to unwrap','flat|плаский|flat','en tekstur|текстура|a texture','et mønster|візерунок|a pattern','et materiale|матеріал|a material','lys|світло|light','å rotere|обертати|to rotate','strekk|розтягнення|stretching','en render|рендер|a render']
    },
    {
      id: 'p227', level: 'B1', track: 'unity', term: 'et skript',
      title: 'Unity lytter til hendelser|Unity слухає події|Unity listens for events',
      summary: 'Et skript reagerer på start, oppdatering og kollisjon og sender poeng til brukergrensesnittet.|Скрипт реагує на старт, оновлення та зіткнення й передає бали інтерфейсу.|A script reacts to start, update and collision and sends the score to the interface.',
      scenes: [
        ['unity','Player + Script','Vi legger et skript på spillerens GameObject.|Додаємо скрипт до GameObject гравця.|We add a script to the player GameObject.','Skriptet blir en komponent med oppførsel.|Скрипт стає компонентом поведінки.|The script becomes a behaviour component.'],
        ['codecard','Start()','Start kjører én gang når objektet blir klart.|Start виконується один раз, коли об’єкт готовий.|Start runs once when the object is ready.','Her setter vi poeng til null.|Тут встановлюємо бали на нуль.|Here we set the score to zero.'],
        ['codecard','Update()','Update kjører for hvert bilde i spillet.|Update виконується для кожного кадру гри.|Update runs for every game frame.','Her kan vi lese input og flytte spilleren.|Тут можна читати введення й рухати гравця.|Here we can read input and move the player.'],
        ['unity','OnCollisionEnter','Spilleren treffer en stjerne.|Гравець торкається зірки.|The player hits a star.','Kollisjonshendelsen forteller hvilket objekt vi møtte.|Подія зіткнення повідомляє, який об’єкт зустріли.|The collision event tells us which object we met.'],
        ['codecard','score += 1','Skriptet øker poengene og sender et signal.|Скрипт збільшує бали й надсилає сигнал.|The script increases the score and sends a signal.','Resultatteksten oppdateres med en gang.|Текст результату одразу оновлюється.|The score text updates immediately.'],
        ['unity','test i Play Mode','Vi tester start, bevegelse og treff.|Тестуємо старт, рух і зіткнення.|We test start, movement and collisions.','Console viser meldinger hvis noe går galt.|Console показує повідомлення, якщо щось не так.|The Console shows messages if something goes wrong.']
      ],
      tasks: [
        ['Når kjører Start?|Коли виконується Start?|When does Start run?','Én gang når objektet blir klart|Один раз, коли об’єкт готовий|Once when the object is ready','For hvert bilde|Для кожного кадру|For every frame','Bare etter kollisjon|Лише після зіткнення|Only after a collision','Aldri|Ніколи|Never'],
        ['Hva brukes Update til?|Для чого використовують Update?|What is Update used for?','Input og løpende endringer|Введення й постійні зміни|Input and ongoing changes','Å lage en database|Створення бази|Making a database','Å skrive CSS|Написання CSS|Writing CSS','Å lagre passord|Зберігання паролів|Storing passwords'],
        ['Hva forteller en kollisjonshendelse?|Що повідомляє подія зіткнення?|What does a collision event tell us?','Hvilket objekt som ble truffet|Який об’єкт було зачеплено|Which object was hit','Skjermens pris|Ціну екрана|The screen price','Nettstedets domene|Домен сайту|The website domain','Brukerens passord|Пароль користувача|The user password']
      ],
      vocab: ['et skript|скрипт|a script','en komponent|компонент|a component','oppførsel|поведінка|behaviour','Start|Start|Start','Update|Update|Update','et bilde|кадр|a frame','input|введення|input','en kollisjon|зіткнення|a collision','en hendelse|подія|an event','et signal|сигнал|a signal','Play Mode|режим гри|Play Mode','Console|консоль|Console']
    },
    {
      id: 'p228', level: 'B1', track: 'data', term: 'en relasjon',
      title: 'Tabellene blir venner|Таблиці стають друзями|The tables become friends',
      summary: 'Nora kobler elever og kurs med nøkler og henter sammenhengende data uten kopier.|Нора зв’язує учнів і курси ключами та отримує пов’язані дані без дублювання.|Nora links pupils and courses with keys and retrieves related data without duplication.',
      scenes: [
        ['database','elever','Den første tabellen har elev_id og navn.|Перша таблиця має student_id та ім’я.|The first table has pupil_id and name.','Hver elev får en unik primærnøkkel.|Кожен учень отримує унікальний первинний ключ.|Each pupil gets a unique primary key.'],
        ['database','kurs','Den andre tabellen beskriver kurs.|Друга таблиця описує курси.|The second table describes courses.','Også hvert kurs har sin egen ID.|Кожен курс також має власний ID.|Each course also has its own ID.'],
        ['database','påmelding','Hvordan viser vi hvilket kurs Nora går på?|Як показати, на який курс ходить Нора?|How do we show which course Nora attends?','En påmelding kobler elev_id til kurs_id.|Запис пов’язує student_id із course_id.|An enrolment links pupil_id to course_id.'],
        ['codecard','FOREIGN KEY','En fremmednøkkel peker til en annen tabell.|Зовнішній ключ посилається на іншу таблицю.|A foreign key points to another table.','Databasen kan kontrollere at ID-en finnes.|База може перевірити, що ID існує.|The database can check that the ID exists.'],
        ['codecard','JOIN','JOIN henter navn og kurs i ett resultat.|JOIN отримує ім’я та курс в одному результаті.|JOIN retrieves the name and course in one result.','Vi slipper å skrive samme navn mange ganger.|Не треба багато разів записувати те саме ім’я.|We avoid writing the same name many times.'],
        ['database','én kilde per opplysning','Ryddige relasjoner reduserer feil og kopier.|Охайні зв’язки зменшують помилки й дублікати.|Tidy relationships reduce errors and duplicates.','Da er data lettere å oppdatere.|Тоді дані легше оновлювати.|Then data is easier to update.']
      ],
      tasks: [
        ['Hva er en primærnøkkel?|Що таке первинний ключ?|What is a primary key?','En unik ID i tabellen|Унікальний ID у таблиці|A unique ID in the table','En CSS-farge|Колір CSS|A CSS colour','Et spillnivå|Ігровий рівень|A game level','Et bilde|Зображення|An image'],
        ['Hva gjør en fremmednøkkel?|Що робить зовнішній ключ?|What does a foreign key do?','Peker til en annen tabell|Посилається на іншу таблицю|Points to another table','Sletter alle rader|Видаляє всі рядки|Deletes all rows','Starter Unity|Запускає Unity|Starts Unity','Endrer et passord|Змінює пароль|Changes a password'],
        ['Hva gjør JOIN?|Що робить JOIN?|What does JOIN do?','Kombinerer relaterte data|Об’єднує пов’язані дані|Combines related data','Tegner en kube|Малює куб|Draws a cube','Pauser spillet|Ставить гру на паузу|Pauses the game','Lager alt-tekst|Створює alt-текст|Creates alt text']
      ],
      vocab: ['en relasjon|зв’язок|a relationship','en primærnøkkel|первинний ключ|a primary key','en fremmednøkkel|зовнішній ключ|a foreign key','unik|унікальний|unique','en påmelding|запис на курс|an enrolment','å koble|пов’язувати|to link','å peke|посилатися|to point','JOIN|JOIN|JOIN','relatert|пов’язаний|related','en kopi|дублікат|a duplicate','å oppdatere|оновлювати|to update','en opplysning|відомість|a piece of information']
    },
    {
      id: 'p229', level: 'A2', track: 'personal-safety', term: 'et møtested',
      title: 'Møtestedet på skoleturen|Місце зустрічі на екскурсії|The meeting point on the school trip',
      summary: 'Klassen avtaler møtested, går to og to og vet hva de skal gjøre hvis gruppen blir borte.|Клас домовляється про місце зустрічі, ходить парами й знає, що робити, якщо група зникне.|The class agrees a meeting point, walks in pairs and knows what to do if the group disappears.',
      scenes: [
        ['browser','rød informasjonstavle','Læreren viser et tydelig møtested.|Учитель показує помітне місце зустрічі.|The teacher shows a clear meeting point.','Alle gjentar hvor og når de skal møtes.|Усі повторюють, де й коли зустрічаються.|Everyone repeats where and when to meet.'],
        ['datashield','to og to','Jeg går sammen med læringspartneren min.|Я йду разом зі своїм напарником.|I walk with my learning partner.','Vi sier fra før vi går til et nytt område.|Ми повідомляємо перед переходом у нове місце.|We tell someone before moving to a new area.'],
        ['phone','lærerens nummer','Kontaktkortet ligger trygt i sekken.|Контактна картка безпечно лежить у рюкзаку.|The contact card is safe in the bag.','Der står lærerens nummer og skolens navn.|Там є номер учителя й назва школи.|It has the teacher’s number and school name.'],
        ['browser','gruppen er borte','Plutselig ser vi ikke resten av klassen.|Раптом ми не бачимо решту класу.|Suddenly we cannot see the rest of the class.','Vi løper ikke tilfeldig rundt.|Ми не бігаємо навмання.|We do not run around at random.'],
        ['datashield','til møtestedet','Vi går rolig tilbake til den røde tavlen.|Спокійно повертаємося до червоної стійки.|We calmly return to the red sign.','Der venter vi synlig sammen.|Там чекаємо разом на видному місці.|We wait there together in a visible place.'],
        ['phone','funnet igjen','Læreren ringer og finner oss på planen.|Учитель телефонує й знаходить нас за планом.|The teacher calls and finds us according to the plan.','Et avtalt møtested gjør situasjonen tryggere.|Домовлене місце робить ситуацію безпечнішою.|An agreed meeting point makes the situation safer.']
      ],
      tasks: [
        ['Hva avtaler klassen først?|Про що клас домовляється спочатку?|What does the class agree first?','Et tydelig møtested|Помітне місце зустрічі|A clear meeting point','Et spillpassord|Пароль гри|A game password','En hemmelig snarvei|Таємний короткий шлях|A secret shortcut','En nettprofil|Профіль у мережі|An online profile'],
        ['Hva gjør du hvis gruppen er borte?|Що робити, якщо групи немає?|What do you do if the group is gone?','Går rolig til møtestedet|Спокійно йду до місця зустрічі|Calmly go to the meeting point','Løper tilfeldig|Бігаю навмання|Run around at random','Følger en fremmed|Іду за незнайомцем|Follow a stranger','Gjemmer meg|Ховаюся|Hide'],
        ['Hva står på kontaktkortet?|Що є на контактній картці?|What is on the contact card?','Lærerens nummer og skolens navn|Номер учителя й назва школи|The teacher’s number and school name','Bankkortnummeret|Номер банківської картки|A bank card number','Et passord|Пароль|A password','En annonsekode|Рекламний код|An advert code']
      ],
      vocab: ['et møtested|місце зустрічі|a meeting point','en skoletur|шкільна екскурсія|a school trip','å avtale|домовлятися|to agree','tydelig|помітний|clear','en læringspartner|напарник|a learning partner','et område|місце|an area','et kontaktkort|контактна картка|a contact card','en sekk|рюкзак|a bag','tilfeldig|навмання|at random','å vente|чекати|to wait','synlig|на видному місці|visible','rolig|спокійно|calmly']
    },
    {
      id: 'p230', level: 'A2', track: 'cyber-safety', term: 'å blokkere',
      title: 'Trygg i spillchatten|Безпека в ігровому чаті|Safe in the game chat',
      summary: 'Nora beskytter personopplysninger, stopper ubehagelige meldinger og bruker blokkering og rapportering.|Нора захищає особисті дані, зупиняє неприємні повідомлення та використовує блокування і скаргу.|Nora protects personal information, stops upsetting messages and uses blocking and reporting.',
      scenes: [
        ['gameview','brukernavn: NordStjerne','Jeg bruker ikke hele navnet mitt i spillet.|Я не використовую повне ім’я в грі.|I do not use my full name in the game.','Et nøytralt brukernavn beskytter privatlivet.|Нейтральне ім’я користувача захищає приватність.|A neutral username protects privacy.'],
        ['phone','hvor bor du?','En spiller spør hvor jeg bor og går på skole.|Гравець питає, де я живу й навчаюся.|A player asks where I live and go to school.','Personopplysninger hører ikke hjemme i spillchatten.|Особистим даним не місце в ігровому чаті.|Personal information does not belong in game chat.'],
        ['datashield','ikke svar','Jeg slutter å svare på private spørsmål.|Я перестаю відповідати на приватні запитання.|I stop answering private questions.','Du skylder ingen fremmed en forklaring.|Ти не зобов’язаний щось пояснювати незнайомцю.|You do not owe a stranger an explanation.'],
        ['phone','blokker','Meldingene blir stygge og truende.|Повідомлення стають образливими й загрозливими.|The messages become nasty and threatening.','Jeg blokkerer spilleren så kontakten stopper.|Я блокую гравця, щоб контакт припинився.|I block the player so contact stops.'],
        ['datashield','rapporter + skjermbilde','Jeg lagrer bevis uten å dele det offentlig.|Я зберігаю доказ, не публікуючи його.|I keep evidence without sharing it publicly.','Så rapporterer jeg kontoen til spillet.|Потім скаржуся на обліковий запис у грі.|Then I report the account to the game.'],
        ['phone','fortell en voksen','Jeg viser hendelsen til en voksen jeg stoler på.|Я показую подію дорослому, якому довіряю.|I show the event to an adult I trust.','Hjelp er viktig når noe føles truende.|Допомога важлива, коли щось здається загрозливим.|Help matters when something feels threatening.']
      ],
      tasks: [
        ['Hva bør ikke deles i spillchat?|Чим не слід ділитися в ігровому чаті?|What should not be shared in game chat?','Adresse og skole|Адреса й школа|Address and school','Spillets poengsum|Ігровий рахунок|The game score','Figurens farge|Колір персонажа|The character colour','Navnet på nivået|Назва рівня|The level name'],
        ['Hva gjør blokkering?|Що робить блокування?|What does blocking do?','Stopper kontakten fra kontoen|Зупиняє контакт з облікового запису|Stops contact from the account','Deler passordet|Передає пароль|Shares the password','Sletter spillet|Видаляє гру|Deletes the game','Kjøper poeng|Купує бали|Buys points'],
        ['Hvem bør du fortelle om trusler?|Кому розповісти про погрози?|Whom should you tell about threats?','En voksen du stoler på|Дорослому, якому довіряєш|An adult you trust','Den samme fremmede|Тому самому незнайомцю|The same stranger','Ingen|Нікому|Nobody','Alle offentlig|Усім публічно|Everyone publicly']
      ],
      vocab: ['en spillchat|ігровий чат|a game chat','et brukernavn|ім’я користувача|a username','nøytral|нейтральний|neutral','personopplysninger|особисті дані|personal information','privatliv|приватність|privacy','ubehagelig|неприємний|upsetting','truende|загрозливий|threatening','å blokkere|блокувати|to block','å rapportere|скаржитися|to report','et skjermbilde|знімок екрана|a screenshot','et bevis|доказ|evidence','å stole på|довіряти|to trust']
    },
    {
      id: 'p231', level: 'B1', track: 'scam-awareness', term: 'en deepfake',
      title: 'Stemmen som ikke var ekte|Голос, який був несправжнім|The voice that was not real',
      summary: 'En falsk stemme ber om penger, men Nora stopper og bekrefter historien gjennom en kjent kanal.|Підроблений голос просить гроші, але Нора зупиняється й перевіряє історію через знайомий канал.|A fake voice asks for money, but Nora stops and verifies the story through a known channel.',
      scenes: [
        ['phone','Hjelp! Send penger nå!','Telefonen spiller av stemmen til onkelen min.|Телефон відтворює голос мого дядька.|The phone plays my uncle’s voice.','Men nummeret er ukjent og meldingen haster.|Але номер невідомий, а повідомлення квапить.|But the number is unknown and the message is urgent.'],
        ['datashield','stopp ved hastverk','Sterke følelser kan få oss til å handle fort.|Сильні емоції можуть змусити діяти швидко.|Strong feelings can make us act quickly.','Svindlere bruker frykt og tidspress.|Шахраї використовують страх і тиск часу.|Scammers use fear and time pressure.'],
        ['codecard','deepfake-stemme','Kunstig intelligens kan etterligne en stemme.|Штучний інтелект може імітувати голос.|Artificial intelligence can imitate a voice.','En kjent lyd er derfor ikke bevis alene.|Тому знайомий звук сам по собі не є доказом.|A familiar sound is therefore not proof by itself.'],
        ['phone','ring kjent nummer','Jeg ringer onkelen på nummeret jeg allerede har.|Я телефоную дядькові за номером, який уже маю.|I call my uncle on the number I already have.','Ikke bruk nummeret eller lenken i meldingen.|Не використовуй номер чи посилання з повідомлення.|Do not use the number or link in the message.'],
        ['datashield','familieord','Familien har et avtalt kontrollspørsmål.|У родини є домовлене контрольне запитання.|The family has an agreed check question.','Det hjelper oss å bekrefte personen.|Воно допомагає підтвердити особу.|It helps us verify the person.'],
        ['phone','ingen penger sendt','Onkelen er trygg og sendte aldri meldingen.|Дядько в безпеці й не надсилав повідомлення.|My uncle is safe and never sent the message.','Stopp, bekreft og rapporter den falske kontakten.|Зупинись, перевір і поскаржся на фальшивий контакт.|Stop, verify and report the fake contact.']
      ],
      tasks: [
        ['Hva er et faresignal i meldingen?|Яка ознака небезпеки в повідомленні?|What is a warning sign in the message?','Ukjent nummer og sterkt tidspress|Невідомий номер і сильний тиск часу|An unknown number and strong time pressure','Rolig språk|Спокійна мова|Calm language','Et kjent nummer|Знайомий номер|A known number','Ingen pengeforespørsel|Відсутність прохання про гроші|No request for money'],
        ['Hvordan bekrefter du historien?|Як перевірити історію?|How do you verify the story?','Ringer et kjent nummer|Телефоную за відомим номером|Call a known number','Bruker lenken i meldingen|Використовую посилання з повідомлення|Use the link in the message','Sender penger først|Спочатку надсилаю гроші|Send money first','Deler kortnummeret|Передаю номер картки|Share the card number'],
        ['Kan en kjent stemme være falsk?|Чи може знайомий голос бути підробленим?|Can a familiar voice be fake?','Ja, en deepfake kan etterligne den|Так, deepfake може її імітувати|Yes, a deepfake can imitate it','Nei, aldri|Ні, ніколи|No, never','Bare i spill|Лише в іграх|Only in games','Bare uten internett|Лише без інтернету|Only without internet']
      ],
      vocab: ['en deepfake|діпфейк|a deepfake','en stemme|голос|a voice','å etterligne|імітувати|to imitate','kunstig intelligens|штучний інтелект|artificial intelligence','et tidspress|тиск часу|time pressure','frykt|страх|fear','et bevis|доказ|proof','å bekrefte|підтверджувати|to verify','en kjent kanal|знайомий канал|a known channel','et kontrollspørsmål|контрольне запитання|a check question','falsk|фальшивий|fake','å rapportere|скаржитися|to report']
    },
    {
      id: 'p232', level: 'B1', track: 'secure-coding', term: 'en API-nøkkel',
      title: 'Den skjulte API-nøkkelen|Прихований API-ключ|The hidden API key',
      summary: 'Nora lærer at hemmelige nøkler skal ligge på serveren, ha begrensede rettigheter og kunne byttes.|Нора дізнається, що секретні ключі мають зберігатися на сервері, мати обмежені права й легко замінюватися.|Nora learns that secret keys belong on the server, need limited permissions and must be replaceable.',
      scenes: [
        ['codecard','const KEY = "abc..."','API-nøkkelen står direkte i nettsidens kode.|API-ключ записаний прямо в коді сторінки.|The API key is written directly in the page code.','Alt i nettleseren kan leses av brukeren.|Усе в браузері може прочитати користувач.|Everything in the browser can be read by the user.'],
        ['browser','Vis kilde','Skjult tekst i JavaScript er ikke en hemmelighet.|Прихований текст у JavaScript не є секретом.|Hidden text in JavaScript is not a secret.','Nøkkelen må bort fra klienten.|Ключ треба прибрати з клієнта.|The key must leave the client.'],
        ['datashield','server','Nettleseren ber vår server om data.|Браузер просить дані в нашого сервера.|The browser asks our server for data.','Serveren bruker nøkkelen uten å sende den tilbake.|Сервер використовує ключ, не надсилаючи його назад.|The server uses the key without sending it back.'],
        ['database','miljøvariabel','Nøkkelen lagres i en beskyttet innstilling.|Ключ зберігається в захищеному налаштуванні.|The key is stored in a protected setting.','Kodearkivet inneholder bare et eksempelnavn.|У репозиторії коду є лише приклад назви.|The code repository contains only an example name.'],
        ['datashield','minste rettighet','Nøkkelen får bare tilgang til det den trenger.|Ключ отримує доступ лише до необхідного.|The key gets access only to what it needs.','Begrensning reduserer skade ved lekkasje.|Обмеження зменшує шкоду в разі витоку.|Limiting it reduces damage if it leaks.'],
        ['codecard','roter nøkkel','Hvis nøkkelen lekker, deaktiverer vi den.|Якщо ключ витече, ми його деактивуємо.|If the key leaks, we deactivate it.','Så lager vi en ny nøkkel og sjekker loggene.|Потім створюємо новий ключ і перевіряємо журнали.|Then we create a new key and check the logs.']
      ],
      tasks: [
        ['Hvor skal en hemmelig API-nøkkel ligge?|Де має зберігатися секретний API-ключ?|Where should a secret API key live?','På serveren i beskyttet konfigurasjon|На сервері в захищеній конфігурації|On the server in protected configuration','I offentlig JavaScript|У публічному JavaScript|In public JavaScript','I HTML-tittelen|У заголовку HTML|In the HTML title','I et skjermbilde|На знімку екрана|In a screenshot'],
        ['Hva betyr minste rettighet?|Що означає мінімум прав?|What does least privilege mean?','Bare tilgang til det som trengs|Доступ лише до необхідного|Access only to what is needed','Tilgang til alt|Доступ до всього|Access to everything','Ingen logging|Відсутність журналів|No logging','Samme nøkkel for alle|Один ключ для всіх|One key for everyone'],
        ['Hva gjør du hvis nøkkelen lekker?|Що робити, якщо ключ витік?|What do you do if the key leaks?','Deaktiverer og erstatter den|Деактивую й замінюю його|Deactivate and replace it','Publiserer den igjen|Публікую його знову|Publish it again','Ignorerer hendelsen|Ігнорую подію|Ignore the event','Sender den i chat|Надсилаю його в чат|Send it in chat']
      ],
      vocab: ['en API-nøkkel|API-ключ|an API key','hemmelig|секретний|secret','en klient|клієнт|a client','en server|сервер|a server','en miljøvariabel|змінна середовища|an environment variable','en konfigurasjon|конфігурація|a configuration','et kodearkiv|репозиторій коду|a code repository','en rettighet|право доступу|a permission','minste rettighet|мінімум прав|least privilege','en lekkasje|витік|a leak','å deaktivere|деактивувати|to deactivate','en logg|журнал|a log']
    }
  ];

  const words = { no: {}, en: {} };
  lessons.flatMap(lesson => lesson.vocab).map(tri).forEach(([no, uk, en]) => {
    words.no[no] = uk;
    words.en[no] = en;
  });
  const makeTask = row => {
    const [question, answer, ...wrong] = row;
    return { type: 'concept', q: tri(question), answer: tri(answer), wrong: wrong.map(tri) };
  };
  const makePanel = (row, index) => {
    const [visual, label, first, second] = row;
    return {
      art: {
        bg: index % 2 ? 'room' : 'lab',
        code: [label],
        chars: [
          { id: 'nora', x: 58, mood: index === 0 ? 'think' : 'happy', pose: index % 2 ? 'talk' : 'point' },
          { id: 'robo', x: 342, mood: 'grin', pose: 'point', flip: true }
        ],
        props: [{ type: visual, x: 200, y: 278, label, text: label }]
      },
      lines: [
        (() => { const [no, uk, en] = tri(first); return { who: 'nora', no, uk, en }; })(),
        (() => { const [no, uk, en] = tri(second); return { who: 'robo', no, uk, en }; })()
      ]
    };
  };

  lessons.forEach(lesson => {
    const [title, titleUk, titleEn] = tri(lesson.title);
    const [summaryNo, summaryUk, summaryEn] = tri(lesson.summary);
    COMICS.push({
      id: lesson.id,
      category: 'koding',
      style: 'code',
      cover: 4,
      level: lesson.level,
      track: lesson.track,
      term: lesson.term,
      title, titleUk, titleEn,
      summaryNo, summaryUk, summaryEn,
      words,
      panels: lesson.scenes.map(makePanel),
      tasks: lesson.tasks.map(makeTask),
      vocab: lesson.vocab.map(tri)
    });
  });
})();
