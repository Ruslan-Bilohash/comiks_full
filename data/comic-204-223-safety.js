window.COMICS = window.COMICS || [];

/* Twenty child-friendly safety and secure-coding comics. The lessons teach
   recognition, prevention and help-seeking; they do not describe bypasses or
   offensive techniques. */
(() => {
  const tri = value => value.split('|');
  const lessons = [
    {
      id: 'p204', level: 'A1', track: 'personal-safety', term: 'en trygg vei',
      title: 'Den trygge veien hjem|Безпечна дорога додому|The safe way home',
      summary: 'Nora planlegger en synlig rute og vet hvem hun kan be om hjelp.|Нора планує людний маршрут і знає, до кого звернутися по допомогу.|Nora plans a visible route and knows whom to ask for help.',
      scenes: [
        ['datashield','planlegg ruten','Jeg går samme trygge vei hjem hver dag.|Я щодня йду додому тим самим безпечним шляхом.|I take the same safe way home every day.','En voksen hjemme kjenner ruten din.|Дорослий удома знає твій маршрут.|An adult at home knows your route.'],
        ['phone','si fra','Jeg sier fra når jeg går fra skolen.|Я повідомляю, коли виходжу зі школи.|I say when I leave school.','Da vet familien når de kan vente deg.|Тоді родина знає, коли тебе чекати.|Then your family knows when to expect you.'],
        ['browser','lys og folk','Velg gater med lys og andre mennesker.|Обирай освітлені вулиці, де є люди.|Choose streets with lights and other people.','Unngå øde snarveier alene.|Не йди сам безлюдними короткими шляхами.|Avoid lonely shortcuts by yourself.'],
        ['datashield','ukjent bil','En ukjent bil stopper ved siden av meg.|Поруч зупинилася незнайома машина.|An unknown car stops beside me.','Hold avstand og gå mot et trygt sted.|Тримай дистанцію та йди до безпечного місця.|Keep your distance and move towards a safe place.'],
        ['phone','ring en trygg voksen','Jeg ringer en voksen jeg stoler på.|Я телефоную дорослому, якому довіряю.|I call an adult I trust.','Gå inn i en butikk hvis du føler deg utrygg.|Зайди до магазину, якщо почуваєшся небезпечно.|Enter a shop if you feel unsafe.'],
        ['datashield','trygg hjemme','Nå er jeg trygt hjemme.|Тепер я безпечно вдома.|Now I am safely home.','En enkel plan gjør det lettere å handle rolig.|Простий план допомагає діяти спокійно.|A simple plan makes it easier to act calmly.']
      ],
      tasks: [
        ['Hva er en trygg rute?|Що таке безпечний маршрут?|What is a safe route?','En kjent vei med lys og folk|Знайомий шлях зі світлом і людьми|A familiar way with lights and people','En øde snarvei|Безлюдний короткий шлях|A lonely shortcut','En hemmelig vei|Таємна дорога|A secret road','En vei ingen kjenner|Шлях, якого ніхто не знає|A route nobody knows'],
        ['Hva gjør du ved en ukjent bil?|Що робити біля незнайомої машини?|What do you do near an unknown car?','Holder avstand og går til et trygt sted|Тримаю дистанцію й іду в безпечне місце|Keep distance and go to a safe place','Går nærmere|Підходжу ближче|Go closer','Setter meg inn|Сідаю в машину|Get inside','Følger etter|Іду слідом|Follow it'],
        ['Hvem kan du ringe?|Кому можна зателефонувати?|Whom can you call?','En voksen du stoler på|Дорослому, якому довіряєш|An adult you trust','En tilfeldig fremmed|Випадковому незнайомцю|A random stranger','Ingen|Нікому|Nobody','En falsk profil|Фальшивому профілю|A fake profile']
      ],
      vocab: ['en rute|маршрут|a route','trygg|безпечний|safe','kjent|знайомий|familiar','synlig|видимий|visible','et gatelys|вуличний ліхтар|a street light','en snarvei|короткий шлях|a shortcut','øde|безлюдний|lonely','en avstand|дистанція|a distance','en butikk|магазин|a shop','å stole på|довіряти|to trust','å si fra|повідомляти|to tell','rolig|спокійний|calm']
    },
    {
      id: 'p205', level: 'A1', track: 'personal-safety', term: 'en fremmed',
      title: 'Når en fremmed ber om hjelp|Коли незнайомець просить допомоги|When a stranger asks for help',
      summary: 'Barna lærer å holde avstand, si nei og hente en trygg voksen.|Діти вчаться тримати дистанцію, казати ні та кликати надійного дорослого.|Children learn to keep distance, say no and get a trusted adult.',
      scenes: [
        ['browser','kan du bli med?','En fremmed spør om jeg vil lete etter en hund.|Незнайомець просить допомогти шукати собаку.|A stranger asks me to help find a dog.','Barn skal ikke gå bort med ukjente voksne.|Діти не мають іти з незнайомими дорослими.|Children should not go away with unknown adults.'],
        ['datashield','stopp og avstand','Jeg blir stående flere skritt unna.|Я залишаюся на відстані кількох кроків.|I stay several steps away.','Avstand gir deg tid og oversikt.|Дистанція дає час і огляд.|Distance gives you time and awareness.'],
        ['codecard','nei, jeg henter en voksen','Jeg kan si tydelig nei.|Я можу чітко сказати ні.|I can say no clearly.','Du trenger ikke være høflig når noe føles galt.|Не треба бути ввічливим, коли щось здається небезпечним.|You do not need to be polite when something feels wrong.'],
        ['phone','gå mot folk','Jeg går mot læreren ved porten.|Я йду до вчителя біля воріт.|I walk towards the teacher at the gate.','Velg en kjent voksen eller en ansatt.|Обери знайомого дорослого або працівника.|Choose a known adult or a member of staff.'],
        ['datashield','fortell hva som skjedde','Jeg forteller hele hendelsen.|Я розповідаю про всю подію.|I tell them the whole event.','Det er aldri barnets feil at en voksen oppfører seg rart.|Дитина ніколи не винна, якщо дорослий поводиться дивно.|It is never the child’s fault when an adult behaves strangely.'],
        ['datashield','nei + gå + fortell','Jeg husker tre steg: nei, gå og fortell.|Я пам’ятаю три кроки: ні, піти, розповісти.|I remember three steps: no, go and tell.','Det er en sterk sikkerhetsplan.|Це надійний план безпеки.|That is a strong safety plan.']
      ],
      tasks: [
        ['Hva gjør du når en fremmed vil at du blir med?|Що робити, коли незнайомець кличе із собою?|What do you do when a stranger wants you to come along?','Sier nei og går til en trygg voksen|Кажу ні й іду до надійного дорослого|Say no and go to a trusted adult','Blir med alene|Іду сам|Go alone','Holder det hemmelig|Тримаю це в таємниці|Keep it secret','Går nær bilen|Підходжу до машини|Go near the car'],
        ['Hvorfor holder vi avstand?|Навіщо тримати дистанцію?|Why do we keep distance?','For å få tid og oversikt|Щоб мати час і огляд|To gain time and awareness','For å høre dårligere|Щоб гірше чути|To hear less','For å følge etter|Щоб піти слідом|To follow','For å gjemme telefonen|Щоб сховати телефон|To hide the phone'],
        ['Er det barnets feil?|Це провина дитини?|Is it the child’s fault?','Nei, aldri|Ні, ніколи|No, never','Ja, alltid|Так, завжди|Yes, always','Bare på skolen|Лише у школі|Only at school','Bare om kvelden|Лише ввечері|Only at night']
      ],
      vocab: ['en fremmed|незнайомець|a stranger','ukjent|незнайомий|unknown','å bli med|піти разом|to come along','å nekte|відмовлятися|to refuse','tydelig|чіткий|clear','en voksen|дорослий|an adult','en ansatt|працівник|a staff member','en hendelse|подія|an event','å fortelle|розповідати|to tell','en feil|провина|a fault','å oppføre seg|поводитися|to behave','en plan|план|a plan']
    },
    {
      id: 'p206', level: 'A1', track: 'personal-safety', term: 'å gå seg bort',
      title: 'Borte i kjøpesenteret|Загубився в торговому центрі|Lost in the shopping centre',
      summary: 'Nora stopper, blir på et synlig sted og ber en ansatt om hjelp.|Нора зупиняється, залишається на видному місці й просить працівника про допомогу.|Nora stops, stays visible and asks a member of staff for help.',
      scenes: [
        ['browser','hvor er familien?','Jeg ser ikke familien min lenger.|Я більше не бачу свою родину.|I cannot see my family any more.','Stopp først. Ikke løp tilfeldig rundt.|Спочатку зупинись. Не бігай навмання.|Stop first. Do not run around at random.'],
        ['datashield','bli på et synlig sted','Jeg blir ved den store informasjonstavlen.|Я залишаюся біля великої інформаційної стійки.|I stay by the large information desk.','Da er du lettere å finne.|Так тебе легше знайти.|That makes you easier to find.'],
        ['phone','finn en ansatt','Der er en ansatt med navneskilt.|Там працівниця з бейджем.|There is a staff member with a name badge.','Be henne kontakte familien eller vakten.|Попроси її зв’язатися з родиною або охороною.|Ask her to contact your family or security.'],
        ['codecard','navn + telefon','Jeg kan navnet og telefonnummeret til mamma.|Я знаю ім’я й номер телефону мами.|I know my mother’s name and phone number.','Lær ett kontaktnummer utenat.|Вивчи один контактний номер напам’ять.|Learn one contact number by heart.'],
        ['datashield','ikke gå ut','En ukjent tilbyr å følge meg til bilen.|Незнайомець пропонує провести мене до машини.|A stranger offers to take me to the car.','Bli hos den ansatte på det avtalte stedet.|Залишайся з працівником у домовленому місці.|Stay with the staff member at the agreed place.'],
        ['datashield','funnet igjen','Familien fant meg ved informasjonen.|Родина знайшла мене біля інформаційної стійки.|My family found me at the information desk.','Stopp, bli og be en ansatt om hjelp.|Зупинись, залишайся й попроси працівника про допомогу.|Stop, stay and ask a staff member for help.']
      ],
      tasks: [
        ['Hva gjør du først når du har gått deg bort?|Що зробити спочатку, коли загубився?|What do you do first when you are lost?','Stopper og ser meg rundt|Зупиняюся й озираюся|Stop and look around','Løper ut|Вибігаю назовні|Run outside','Gjemmer meg|Ховаюся|Hide','Følger en fremmed|Іду за незнайомцем|Follow a stranger'],
        ['Hvem er trygg å spørre?|Кого безпечно попросити?|Who is safe to ask?','En ansatt med navneskilt|Працівника з бейджем|A staff member with a name badge','En tilfeldig kunde|Випадкового покупця|A random shopper','En nettprofil|Профіль у мережі|An online profile','Ingen|Нікого|Nobody'],
        ['Hva bør du kunne utenat?|Що варто знати напам’ять?|What should you know by heart?','Et kontaktnummer|Контактний номер|A contact number','Et spillpassord|Пароль від гри|A game password','En reklamekode|Рекламний код|An advert code','Et kortnummer|Номер картки|A card number']
      ],
      vocab: ['å gå seg bort|загубитися|to get lost','et kjøpesenter|торговий центр|a shopping centre','synlig|видимий|visible','en informasjon|інформаційна стійка|an information desk','et navneskilt|бейдж|a name badge','en vakt|охоронець|a security guard','å kontakte|зв’язатися|to contact','et telefonnummer|номер телефону|a phone number','utenat|напам’ять|by heart','avtalt|домовлений|agreed','å finne|знайти|to find','å vente|чекати|to wait']
    },
    {
      id: 'p207', level: 'A2', track: 'personal-safety', term: 'et nødnummer',
      title: '112: Når er det nød?|112: коли це надзвичайна ситуація?|112: When is it an emergency?',
      summary: 'Barna lærer når de skal ringe 112 og hvilke opplysninger operatøren trenger.|Діти вчаться, коли телефонувати 112 і які дані потрібні оператору.|Children learn when to call 112 and what information the operator needs.',
      scenes: [
        ['phone','112','112 er for akutt fare og alvorlige hendelser.|112 — для негайної небезпеки та серйозних подій.|112 is for immediate danger and serious incidents.','Det er ikke et nummer for tull eller vanlige spørsmål.|Це не номер для жартів чи звичайних запитань.|It is not a number for jokes or ordinary questions.'],
        ['datashield','sjekk om stedet er trygt','Først går jeg bort fra fare.|Спочатку я відходжу від небезпеки.|First I move away from danger.','Hjelp uten å sette deg selv i fare.|Допомагай, не наражаючи себе на небезпеку.|Help without putting yourself in danger.'],
        ['phone','hva har skjedd?','Operatøren spør hva som har skjedd.|Оператор питає, що сталося.|The operator asks what happened.','Svar kort og sant.|Відповідай коротко й правдиво.|Answer briefly and truthfully.'],
        ['browser','hvor er du?','Jeg forteller adresse eller et tydelig landemerke.|Я називаю адресу або помітний орієнтир.|I give the address or a clear landmark.','Stedet er viktig for å sende hjelp.|Місце важливе, щоб надіслати допомогу.|The location is important for sending help.'],
        ['phone','lytt og ikke legg på','Jeg følger instruksjonene.|Я виконую інструкції.|I follow the instructions.','Ikke legg på før operatøren sier det.|Не клади слухавку, поки оператор не скаже.|Do not hang up until the operator says so.'],
        ['datashield','hjelpen kommer','Nødetaten finner riktig sted.|Екстрена служба знаходить потрібне місце.|The emergency service finds the right place.','Rolig informasjon kan redde tid.|Спокійна інформація може заощадити час.|Calm information can save time.']
      ],
      tasks: [
        ['Når ringer vi 112?|Коли телефонуємо 112?|When do we call 112?','Ved akutt fare eller alvorlig hendelse|За негайної небезпеки чи серйозної події|For immediate danger or a serious incident','For å spørre om lekser|Щоб спитати про домашнє завдання|To ask about homework','For å teste telefonen|Щоб перевірити телефон|To test the phone','For en spillkode|За кодом до гри|For a game code'],
        ['Hva forteller du om stedet?|Що сказати про місце?|What do you say about the place?','Adresse eller landemerke|Адресу або орієнтир|The address or a landmark','Passordet ditt|Свій пароль|Your password','Kortnummeret|Номер картки|The card number','Ingenting|Нічого|Nothing'],
        ['Når legger du på?|Коли класти слухавку?|When do you hang up?','Når operatøren sier det|Коли скаже оператор|When the operator says so','Med en gang|Одразу|Immediately','Før du sier stedet|До того, як назвеш місце|Before giving the location','Når du blir nervøs|Коли хвилюєшся|When you get nervous']
      ],
      vocab: ['et nødnummer|номер екстреної служби|an emergency number','akutt|негайний|urgent','en fare|небезпека|a danger','alvorlig|серйозний|serious','en operatør|оператор|an operator','en adresse|адреса|an address','et landemerke|орієнтир|a landmark','en instruksjon|інструкція|an instruction','å legge på|класти слухавку|to hang up','en nødetat|екстрена служба|an emergency service','sann|правдивий|truthful','å redde|рятувати|to save']
    },
    {
      id: 'p208', level: 'A2', track: 'cyber-safety', term: 'et sterkt passord',
      title: 'Det hemmelige passordet|Секретний пароль|The secret password',
      summary: 'Nora lager lange, unike passord og beskytter kontoen med tofaktor.|Нора створює довгі унікальні паролі й захищає обліковий запис двофакторною перевіркою.|Nora creates long unique passwords and protects the account with two-factor authentication.',
      scenes: [
        ['codecard','pus123','Det korte passordet mitt er lett å gjette.|Мій короткий пароль легко вгадати.|My short password is easy to guess.','Navn og fødselsdato er heller ikke gode valg.|Ім’я та дата народження теж не підходять.|Names and birthdays are not good choices either.'],
        ['datashield','lang passfrase','Jeg velger flere tilfeldige ord i en lang frase.|Я обираю кілька випадкових слів у довгій фразі.|I choose several random words in a long phrase.','Lengde gjør passordet sterkere.|Довжина робить пароль надійнішим.|Length makes the password stronger.'],
        ['database','unikt for hver konto','Kan jeg bruke samme passord overalt?|Чи можна всюди використовувати той самий пароль?|Can I use the same password everywhere?','Nei. Ett datainnbrudd skal ikke åpne alle kontoene.|Ні. Один витік не повинен відкрити всі облікові записи.|No. One breach should not open every account.'],
        ['datashield','passordbehandler','En passordbehandler husker unike passord.|Менеджер паролів пам’ятає унікальні паролі.|A password manager remembers unique passwords.','Beskytt den med ett sterkt hovedpassord.|Захисти його одним надійним головним паролем.|Protect it with one strong master password.'],
        ['phone','tofaktor','Nå ber kontoen også om en ekstra bekreftelse.|Тепер обліковий запис просить додаткове підтвердження.|Now the account also asks for an extra confirmation.','Del aldri engangskoden med andre.|Ніколи не передавай одноразовий код іншим.|Never share the one-time code with anyone.'],
        ['datashield','lang + unik + 2FA','Kontoen min har flere lag med beskyttelse.|Мій обліковий запис має кілька рівнів захисту.|My account has several layers of protection.','Lange unike passord og tofaktor virker sammen.|Довгі унікальні паролі й двофакторний захист працюють разом.|Long unique passwords and two-factor authentication work together.']
      ],
      tasks: [
        ['Hvilket passord er best?|Який пароль найкращий?|Which password is best?','En lang unik passfrase|Довга унікальна парольна фраза|A long unique passphrase','123456|123456|123456','Fornavnet ditt|Твоє ім’я|Your first name','Samme passord overalt|Той самий пароль усюди|The same password everywhere'],
        ['Hvorfor bruker vi unike passord?|Навіщо унікальні паролі?|Why do we use unique passwords?','Ett innbrudd åpner ikke alle kontoer|Один витік не відкриє всі облікові записи|One breach will not open all accounts','De er kortere|Вони коротші|They are shorter','De kan deles|Ними можна ділитися|They can be shared','De viser navnet ditt|Вони показують ім’я|They show your name'],
        ['Hva gjør du med en engangskode?|Що робити з одноразовим кодом?|What do you do with a one-time code?','Holder den hemmelig|Тримаю його в таємниці|Keep it secret','Sender den til en ukjent|Надсилаю незнайомцю|Send it to a stranger','Legger den ut|Публікую його|Post it','Bruker den som brukernavn|Використовую як ім’я|Use it as a username']
      ],
      vocab: ['et passord|пароль|a password','en passfrase|парольна фраза|a passphrase','tilfeldig|випадковий|random','unik|унікальний|unique','en konto|обліковий запис|an account','et datainnbrudd|витік даних|a data breach','en passordbehandler|менеджер паролів|a password manager','et hovedpassord|головний пароль|a master password','tofaktor|двофакторний захист|two-factor authentication','en engangskode|одноразовий код|a one-time code','et lag|рівень|a layer','beskyttelse|захист|protection']
    },
    {
      id: 'p209', level: 'A2', track: 'cyber-safety', term: 'nettfisking',
      title: 'Klikk ikke på fisken!|Не клікай на рибку!|Do not click the phish!',
      summary: 'Barna kjenner igjen nettfisking og kontrollerer meldingen i en kjent kanal.|Діти розпізнають фішинг і перевіряють повідомлення через відомий канал.|Children recognise phishing and verify the message through a known channel.',
      scenes: [
        ['phone','kontoen stenges nå!','Jeg fikk en skremmende melding med en lenke.|Я отримала страшне повідомлення з посиланням.|I received a frightening message with a link.','Sterkt hastverk er et vanlig faresignal.|Сильний поспіх — поширений сигнал небезпеки.|Extreme urgency is a common warning sign.'],
        ['browser','se på avsenderen','Navnet ser kjent ut, men adressen er rar.|Ім’я знайоме, але адреса дивна.|The name looks familiar, but the address is strange.','Kontroller hele avsenderadressen og domenet.|Перевір повну адресу відправника й домен.|Check the full sender address and domain.'],
        ['datashield','ikke klikk','Jeg stopper før jeg trykker.|Я зупиняюся перед натисканням.|I stop before tapping.','Ikke åpne lenker eller vedlegg du ikke stoler på.|Не відкривай підозрілі посилання чи вкладення.|Do not open links or attachments you do not trust.'],
        ['browser','åpne kjent nettsted','Jeg skriver selv adressen til tjenesten.|Я сама вводжу адресу сервісу.|I type the service address myself.','Da bruker du en kanal du allerede kjenner.|Так ти використовуєш уже відомий канал.|Then you use a channel you already know.'],
        ['phone','spør den ekte avsenderen','Jeg ringer nummeret jeg har lagret.|Я телефоную на збережений номер.|I call the number I already saved.','Den ekte avsenderen sier at meldingen er falsk.|Справжній відправник каже, що повідомлення фальшиве.|The real sender says the message is fake.'],
        ['datashield','blokker og rapporter','Jeg sletter, blokkerer og rapporterer meldingen.|Я видаляю, блокую та скаржуся на повідомлення.|I delete, block and report the message.','Stopp, sjekk og bruk en kjent kanal.|Зупинись, перевір і скористайся відомим каналом.|Stop, check and use a known channel.']
      ],
      tasks: [
        ['Hva er et faresignal i meldingen?|Що є сигналом небезпеки в повідомленні?|What is a warning sign in the message?','Krav om å handle straks|Вимога діяти негайно|A demand to act immediately','Rolig informasjon|Спокійна інформація|Calm information','En kjent samtale|Знайома розмова|A familiar conversation','Ingen lenke|Відсутність посилання|No link'],
        ['Hvordan kontrollerer du meldingen?|Як перевірити повідомлення?|How do you verify the message?','Bruker en kjent nettside eller lagret nummer|Через відомий сайт або збережений номер|Use a known site or saved number','Klikker på lenken|Натискаю посилання|Click the link','Svarer med passordet|Відповідаю паролем|Reply with the password','Sender engangskoden|Надсилаю одноразовий код|Send the one-time code'],
        ['Hva gjør du med nettfisking?|Що робити з фішингом?|What do you do with phishing?','Blokkerer og rapporterer|Блокую та скаржуся|Block and report it','Videresender til alle|Пересилаю всім|Forward it to everyone','Betaler raskt|Швидко плачу|Pay quickly','Lagrer vedlegget|Зберігаю вкладення|Save the attachment']
      ],
      vocab: ['nettfisking|фішинг|phishing','en avsender|відправник|a sender','en adresse|адреса|an address','et domene|домен|a domain','en lenke|посилання|a link','et vedlegg|вкладення|an attachment','hastverk|поспіх|urgency','et faresignal|сигнал небезпеки|a warning sign','falsk|фальшивий|fake','å kontrollere|перевіряти|to verify','å blokkere|блокувати|to block','å rapportere|скаржитися|to report']
    },
    {
      id: 'p210', level: 'A2', track: 'cyber-safety', term: 'en QR-kode',
      title: 'QR-koden på plakaten|QR-код на плакаті|The QR code on the poster',
      summary: 'En pålimt QR-kode kan skjule en falsk lenke, så Nora sjekker adressen før hun åpner.|Наклеєний QR-код може приховувати фальшиве посилання, тому Нора перевіряє адресу.|A pasted QR code can hide a fake link, so Nora checks the address before opening it.',
      scenes: [
        ['phone','skann og vinn','Plakaten lover en gratis premie.|Плакат обіцяє безкоштовний приз.|The poster promises a free prize.','Et godt tilbud kan fortsatt være falskt.|Вигідна пропозиція все одно може бути фальшивою.|A good offer can still be fake.'],
        ['browser','klistremerke over koden','Koden ser ut som et nytt klistremerke.|Код схожий на нову наліпку.|The code looks like a new sticker.','Noen kan ha limt en falsk kode over den ekte.|Хтось міг наклеїти фальшивий код поверх справжнього.|Someone may have pasted a fake code over the real one.'],
        ['phone','vis lenken først','Telefonen viser adressen før den åpnes.|Телефон показує адресу перед відкриттям.|The phone shows the address before opening it.','Les domenet nøye.|Уважно прочитай домен.|Read the domain carefully.'],
        ['datashield','ikke skriv inn data','Siden ber om passord og kortnummer.|Сторінка просить пароль і номер картки.|The page asks for a password and card number.','Stopp. En tilfeldig QR-kode skal ikke få slike data.|Зупинись. Випадковий QR-код не має отримувати такі дані.|Stop. A random QR code should not get such data.'],
        ['browser','finn offisiell side','Jeg finner tilbudet på arrangørens offisielle side.|Я знаходжу пропозицію на офіційному сайті організатора.|I find the offer on the organiser’s official site.','Det står ingenting om premien der.|Там нічого не сказано про приз.|There is nothing about the prize there.'],
        ['datashield','si fra','Jeg forteller en voksen og eieren av plakaten.|Я повідомляю дорослого й власника плаката.|I tell an adult and the poster owner.','Sjekk før du skanner, åpner eller skriver.|Перевіряй перед скануванням, відкриттям чи введенням даних.|Check before you scan, open or type.']
      ],
      tasks: [
        ['Hva sjekker du før du åpner en QR-lenke?|Що перевірити перед відкриттям QR-посилання?|What do you check before opening a QR link?','Adressen og domenet|Адресу й домен|The address and domain','Batterifargen|Колір батареї|The battery colour','Volumet|Гучність|The volume','Bakgrunnen|Тло|The background'],
        ['Hva er mistenkelig på plakaten?|Що підозріле на плакаті?|What is suspicious on the poster?','Et nytt klistremerke over koden|Нова наліпка поверх коду|A new sticker over the code','Tydelig åpningstid|Чіткий час роботи|Clear opening hours','Offisiell logo alene|Лише офіційний логотип|An official logo alone','Vanlig papir|Звичайний папір|Ordinary paper'],
        ['Hva gjør du når siden ber om kortnummer?|Що робити, якщо сторінка просить номер картки?|What do you do when the page asks for a card number?','Stopper og lukker siden|Зупиняюся й закриваю сторінку|Stop and close the page','Skriver det inn|Вводжу його|Type it in','Sender det til venner|Надсилаю друзям|Send it to friends','Tar skjermbilde og fortsetter|Роблю знімок і продовжую|Take a screenshot and continue']
      ],
      vocab: ['en QR-kode|QR-код|a QR code','en plakat|плакат|a poster','en premie|приз|a prize','et klistremerke|наліпка|a sticker','å lime|наклеювати|to paste','å skanne|сканувати|to scan','offisiell|офіційний|official','en arrangør|організатор|an organiser','et kortnummer|номер картки|a card number','mistenkelig|підозрілий|suspicious','å lukke|закривати|to close','å skrive inn|вводити|to enter']
    },
    {
      id: 'p211', level: 'A2', track: 'cyber-safety', term: 'et digitalt fotavtrykk',
      title: 'Bildet som avslørte for mye|Фото, яке розкрило забагато|The photo that revealed too much',
      summary: 'Nora ser etter sted, skolemerke og andre private detaljer før hun deler et bilde.|Нора перевіряє місце, емблему школи й інші приватні деталі перед публікацією фото.|Nora checks location, school badge and other private details before sharing a photo.',
      scenes: [
        ['phone','fint bilde!','Jeg vil legge ut et bilde fra skolegården.|Я хочу опублікувати фото зі шкільного подвір’я.|I want to post a photo from the schoolyard.','Se på hele bildet før du deler.|Переглянь усе фото перед публікацією.|Look at the whole image before sharing.'],
        ['browser','skilt + skolemerke','Skolens navn og gatenummer vises i bakgrunnen.|На тлі видно назву школи й номер будинку.|The school name and street number appear in the background.','De kan avsløre hvor du er.|Вони можуть розкрити, де ти перебуваєш.|They can reveal where you are.'],
        ['phone','posisjon på','Kameraet har også lagret posisjonen.|Камера також зберегла місцезнаходження.|The camera also saved the location.','Slå av steddata når de ikke trengs.|Вимикай геодані, коли вони не потрібні.|Turn off location data when it is not needed.'],
        ['datashield','spør før du deler','Vennen min er også med på bildet.|Мій друг теж є на фото.|My friend is also in the photo.','Spør om lov før du deler bilder av andre.|Запитай дозволу перед публікацією фото інших.|Ask permission before sharing photos of others.'],
        ['browser','beskjær + privat konto','Jeg beskjærer detaljene og velger en liten mottakergruppe.|Я обрізаю деталі й обираю мале коло одержувачів.|I crop the details and choose a small audience.','Personverninnstillinger hjelper, men tenk fortsatt før du deler.|Налаштування приватності допомагають, але все одно думай перед публікацією.|Privacy settings help, but still think before sharing.'],
        ['datashield','digitalt fotavtrykk','Et delt bilde kan kopieres videre.|Опубліковане фото можуть скопіювати далі.|A shared photo can be copied further.','Del bare det du kan stå for senere.|Публікуй лише те, за що відповідатимеш пізніше.|Share only what you can stand by later.']
      ],
      tasks: [
        ['Hva kan avsløre stedet ditt?|Що може розкрити твоє місце?|What can reveal your location?','Skilt, skolemerke og steddata|Вивіски, емблема школи й геодані|Signs, school badges and location data','En ensfarget vegg|Одноколірна стіна|A plain wall','En tegning|Малюнок|A drawing','Et kallenavn alene|Лише псевдонім|A nickname alone'],
        ['Hva gjør du før du deler bilde av en venn?|Що зробити перед публікацією фото друга?|What do you do before sharing a friend’s photo?','Spør om lov|Запитую дозволу|Ask permission','Deler straks|Одразу публікую|Share immediately','Tagger alle|Позначаю всіх|Tag everyone','Skriver adressen|Пишу адресу|Write the address'],
        ['Hva er et digitalt fotavtrykk?|Що таке цифровий слід?|What is a digital footprint?','Spor etter det du gjør på nettet|Сліди твоїх дій у мережі|Traces of what you do online','Et bilde av en sko|Фото взуття|A photo of a shoe','Et nytt passord|Новий пароль|A new password','En telefonmodell|Модель телефону|A phone model']
      ],
      vocab: ['å avsløre|розкривати|to reveal','en bakgrunn|тло|a background','et gatenummer|номер будинку|a street number','steddata|геодані|location data','en tillatelse|дозвіл|permission','å beskjære|обрізати|to crop','en mottaker|одержувач|a recipient','en personverninnstilling|налаштування приватності|a privacy setting','å kopiere|копіювати|to copy','å dele|публікувати|to share','et fotavtrykk|слід|a footprint','senere|пізніше|later']
    },
    {
      id: 'p212', level: 'A2', track: 'scam-awareness', term: 'en falsk premie',
      title: 'Du har vunnet!|Ви виграли!|You have won!',
      summary: 'En falsk premie prøver å få penger og persondata før gevinsten finnes.|Фальшивий приз намагається отримати гроші й персональні дані до того, як існує виграш.|A fake prize tries to get money and personal data before the prize exists.',
      scenes: [
        ['phone','GRATULERER!','Meldingen sier at jeg har vunnet en telefon.|Повідомлення каже, що я виграла телефон.|The message says I have won a phone.','Men du deltok aldri i en konkurranse.|Але ти не брала участі в конкурсі.|But you never entered a competition.'],
        ['browser','betal frakt først','De krever et lite gebyr før premien sendes.|Вони вимагають невелику плату перед надсиланням призу.|They demand a small fee before sending the prize.','Forskuddsbetaling er et vanlig svindeltegn.|Передоплата — поширена ознака шахрайства.|Upfront payment is a common scam sign.'],
        ['datashield','kort + fødselsdato','Skjemaet ber om svært private data.|Форма просить дуже приватні дані.|The form asks for very private data.','En ekte premie trenger ikke bankpassordet ditt.|Справжньому призу не потрібен твій банківський пароль.|A real prize does not need your bank password.'],
        ['browser','sjekk arrangøren','Jeg søker etter konkurransen på den offisielle siden.|Я шукаю конкурс на офіційному сайті.|I search for the competition on the official site.','Den finnes ikke der.|Там його немає.|It is not there.'],
        ['phone','ikke svar','Jeg lar være å svare eller betale.|Я не відповідаю й не плачу.|I do not reply or pay.','Et svar kan bekrefte at nummeret ditt er aktivt.|Відповідь може підтвердити, що твій номер активний.|A reply can confirm that your number is active.'],
        ['datashield','slett og rapporter','Jeg rapporterer den falske konkurransen.|Я скаржуся на фальшивий конкурс.|I report the fake competition.','Hvis du ikke deltok, har du sannsynligvis ikke vunnet.|Якщо ти не брав участі, то, ймовірно, не виграв.|If you did not enter, you probably did not win.']
      ],
      tasks: [
        ['Hva er mistenkelig ved premien?|Що підозріле в призі?|What is suspicious about the prize?','Du deltok aldri|Ти не брав участі|You never entered','Den har et bilde|Є зображення|It has a picture','Meldingen har tekst|У повідомленні є текст|The message has text','Telefonen lager lyd|Телефон видає звук|The phone makes a sound'],
        ['Hva er et vanlig svindeltegn?|Що є типовою ознакою шахрайства?|What is a common scam sign?','Krav om forskuddsbetaling|Вимога передоплати|A demand for upfront payment','En tydelig regel|Чітке правило|A clear rule','En kjent butikkadresse|Відома адреса магазину|A known shop address','Ingen betalingskrav|Відсутність оплати|No payment request'],
        ['Hvordan kontrollerer du konkurransen?|Як перевірити конкурс?|How do you verify the competition?','På arrangørens offisielle side|На офіційному сайті організатора|On the organiser’s official site','Via lenken i meldingen|Через посилання в повідомленні|Through the message link','Ved å sende kortnummer|Надіславши номер картки|By sending a card number','Ved å betale raskt|Швидко заплативши|By paying quickly']
      ],
      vocab: ['en gevinst|виграш|a prize','en konkurranse|конкурс|a competition','å delta|брати участь|to enter','et gebyr|плата|a fee','forskudd|передоплата|upfront payment','svindel|шахрайство|fraud','et tegn|ознака|a sign','persondata|персональні дані|personal data','et bankpassord|банківський пароль|a bank password','sannsynligvis|ймовірно|probably','aktiv|активний|active','å kreve|вимагати|to demand']
    },
    {
      id: 'p213', level: 'B1', track: 'scam-awareness', term: 'en klonet stemme',
      title: 'Stemmen som lignet pappa|Голос, схожий на тата|The voice that sounded like Dad',
      summary: 'En kunstig stemme skaper panikk, men familieord og tilbakeoppringing avslører svindelen.|Штучний голос створює паніку, але сімейне кодове слово й зворотний дзвінок викривають шахрайство.|An artificial voice creates panic, but a family code word and calling back expose the scam.',
      scenes: [
        ['phone','hjelp meg nå!','Stemmen høres ut som pappa og ber om penger.|Голос схожий на тата й просить гроші.|The voice sounds like Dad and asks for money.','Kunstig intelligens kan etterligne korte stemmeprøver.|Штучний інтелект може імітувати короткі зразки голосу.|Artificial intelligence can imitate short voice samples.'],
        ['datashield','stopp panikken','Meldingen prøver å gjøre meg redd og rask.|Повідомлення намагається налякати й підштовхнути до поспіху.|The message tries to make me scared and rushed.','Pust, stopp og ikke betal.|Вдихни, зупинись і не плати.|Breathe, stop and do not pay.'],
        ['codecard','familieord?','Jeg spør etter familiens hemmelige kodeord.|Я питаю сімейне секретне кодове слово.|I ask for the family’s secret code word.','Svindleren kjenner det ikke.|Шахрай його не знає.|The scammer does not know it.'],
        ['phone','ring kjent nummer','Samtalen brytes, og jeg ringer pappas lagrede nummer.|Дзвінок обривається, і я телефоную на збережений номер тата.|The call ends, and I call Dad’s saved number.','Bruk aldri nummeret den ukjente oppgir.|Не використовуй номер, який дає незнайомець.|Never use a number supplied by the stranger.'],
        ['phone','pappa er trygg','Pappa svarer og har det bra.|Тато відповідає, з ним усе гаразд.|Dad answers and is fine.','Stemmelikhet alene beviser ikke identitet.|Схожість голосу сама по собі не доводить особу.|A similar voice alone does not prove identity.'],
        ['datashield','kodeord + ring tilbake','Familien øver på en enkel plan.|Родина тренує простий план.|The family practises a simple plan.','Bekreft alltid pengekrav i en annen kjent kanal.|Завжди підтверджуй вимоги грошей через інший відомий канал.|Always verify money requests through another known channel.']
      ],
      tasks: [
        ['Hva kan en klonet stemme gjøre?|Що може клонований голос?|What can a cloned voice do?','Etterligne en kjent person|Імітувати знайому людину|Imitate a familiar person','Bevise identitet|Довести особу|Prove identity','Låse telefonen|Заблокувати телефон|Lock the phone','Finne adressen automatisk|Автоматично знайти адресу|Find the address automatically'],
        ['Hvordan bekrefter du personen?|Як підтвердити особу?|How do you verify the person?','Ringer et lagret nummer|Телефоную на збережений номер|Call a saved number','Betaler med en gang|Одразу плачу|Pay immediately','Bruker nummeret i meldingen|Використовую номер із повідомлення|Use the number in the message','Sender passordet|Надсилаю пароль|Send the password'],
        ['Hva hjelper familien å avtale?|Що корисно узгодити родині?|What is useful for a family to agree on?','Et hemmelig kodeord|Секретне кодове слово|A secret code word','Samme passord til alt|Один пароль для всього|The same password for everything','Kortnummer i chatten|Номер картки в чаті|A card number in chat','Åpne profiler|Відкриті профілі|Public profiles']
      ],
      vocab: ['å etterligne|імітувати|to imitate','en stemmeprøve|зразок голосу|a voice sample','kunstig intelligens|штучний інтелект|artificial intelligence','panikk|паніка|panic','å puste|дихати|to breathe','et kodeord|кодове слово|a code word','en svindler|шахрай|a scammer','å bryte|переривати|to end','lagret|збережений|saved','en identitet|особа|an identity','å bevise|доводити|to prove','et pengekrav|вимога грошей|a money request']
    },
    {
      id: 'p214', level: 'A2', track: 'scam-awareness', term: 'trygg netthandel',
      title: 'Den billige spillkonsollen|Дешева ігрова приставка|The cheap games console',
      summary: 'Nora vurderer selger, pris, betaling og møteplass før hun handler brukt.|Нора перевіряє продавця, ціну, оплату й місце зустрічі перед купівлею вживаного товару.|Nora checks the seller, price, payment and meeting place before buying second-hand.',
      scenes: [
        ['browser','nesten gratis','Denne nye konsollen koster nesten ingenting.|Ця нова приставка коштує майже нічого.|This new console costs almost nothing.','En pris som er for god til å være sann, kan være et lokkemiddel.|Надто вигідна ціна може бути приманкою.|A price too good to be true can be bait.'],
        ['browser','ny profil · ingen vurderinger','Selgerens profil ble laget i dag.|Профіль продавця створено сьогодні.|The seller’s profile was created today.','Se etter historikk, vurderinger og ekte bilder.|Шукай історію, відгуки та справжні фото.|Look for history, reviews and real photos.'],
        ['phone','betal utenfor appen','Selgeren vil ha betaling i en privat lenke.|Продавець хоче оплату через приватне посилання.|The seller wants payment through a private link.','Hold betalingen i markedsplassens sikre løsning.|Залишай оплату в безпечній системі майданчика.|Keep payment in the marketplace’s secure system.'],
        ['datashield','ta med en voksen','Jeg avtaler ikke et møte alene.|Я не домовляюся про зустріч сама.|I do not arrange a meeting alone.','Ta med en voksen og velg et offentlig sted.|Візьми дорослого й обери громадське місце.|Bring an adult and choose a public place.'],
        ['browser','sjekk varen','Vi tester varen før kjøpet når det er mulig.|Ми перевіряємо товар перед купівлею, коли це можливо.|We test the item before buying when possible.','Ikke la deg presse av en kunstig tidsfrist.|Не піддавайся штучному обмеженню часу.|Do not be pressured by an artificial deadline.'],
        ['datashield','avbryt handelen','Selgeren nekter trygg betaling, så vi avbryter.|Продавець відмовляється від безпечної оплати, тому ми скасовуємо угоду.|The seller refuses safe payment, so we cancel.','Det kommer andre tilbud.|Будуть інші пропозиції.|There will be other offers.']
      ],
      tasks: [
        ['Hva kan en utrolig lav pris være?|Чим може бути неймовірно низька ціна?|What can an incredibly low price be?','Et lokkemiddel|Приманкою|Bait','Alltid et kupp|Завжди вигідною покупкою|Always a bargain','Et sikkerhetsbevis|Доказом безпеки|Proof of safety','En garanti|Гарантією|A guarantee'],
        ['Hvor bør betalingen skje?|Де має відбуватися оплата?|Where should payment happen?','I markedsplassens sikre løsning|У безпечній системі майданчика|In the marketplace’s secure system','I en ukjent lenke|За невідомим посиланням|In an unknown link','Med gavekort|Подарунковою карткою|With gift cards','I en hemmelig chat|У таємному чаті|In a secret chat'],
        ['Hvordan møter et barn en selger?|Як дитині зустрічатися з продавцем?|How should a child meet a seller?','Med en voksen på et offentlig sted|З дорослим у громадському місці|With an adult in a public place','Alene hjemme|Самому вдома|Alone at home','Om natten|Уночі|At night','På et øde sted|У безлюдному місці|In a lonely place']
      ],
      vocab: ['en spillkonsoll|ігрова приставка|a games console','brukt|вживаний|second-hand','et lokkemiddel|приманка|bait','en selger|продавець|a seller','en vurdering|відгук|a review','en historikk|історія|a history','en markedsplass|торговий майданчик|a marketplace','en betaling|оплата|a payment','offentlig|громадський|public','en tidsfrist|кінцевий термін|a deadline','å avbryte|скасовувати|to cancel','et tilbud|пропозиція|an offer']
    },
    {
      id: 'p215', level: 'A2', track: 'scam-awareness', term: 'en falsk profil',
      title: 'Den falske profilen|Фальшивий профіль|The fake profile',
      summary: 'En kopiert profil ber om hemmeligheter, men Nora bekrefter vennen i en kjent kanal.|Скопійований профіль просить секретні дані, але Нора перевіряє друга через відомий канал.|A copied profile asks for secrets, but Nora verifies the friend through a known channel.',
      scenes: [
        ['phone','ny konto','En ny profil bruker navnet og bildet til vennen min.|Новий профіль використовує ім’я та фото мого друга.|A new profile uses my friend’s name and photo.','Bilder og navn kan kopieres.|Фото й імена можна скопіювати.|Photos and names can be copied.'],
        ['browser','send kode raskt','Profilen ber om en kode som kom på telefonen min.|Профіль просить код, що надійшов на мій телефон.|The profile asks for a code sent to my phone.','En ekte venn trenger aldri innloggingskoden din.|Справжньому другові ніколи не потрібен твій код входу.|A real friend never needs your login code.'],
        ['datashield','ikke del hemmeligheter','Jeg sender verken kode, passord eller private bilder.|Я не надсилаю код, пароль чи приватні фото.|I send neither codes, passwords nor private photos.','Hemmeligheter gir svindleren mer kontroll.|Секретні дані дають шахраю більше контролю.|Secrets give the scammer more control.'],
        ['phone','ring den ekte vennen','Jeg ringer vennen på nummeret jeg allerede har.|Я телефоную другові за номером, який уже маю.|I call my friend on the number I already have.','Han sier at den nye profilen er falsk.|Він каже, що новий профіль фальшивий.|He says the new profile is fake.'],
        ['browser','blokker + rapporter','Vi rapporterer profilen for etterligning.|Ми скаржимося на профіль за видавання себе за іншу особу.|We report the profile for impersonation.','Plattformen kan undersøke og fjerne den.|Платформа може перевірити й видалити його.|The platform can investigate and remove it.'],
        ['datashield','varsle venner','Vennen varsler kontaktene sine.|Друг попереджає свої контакти.|My friend warns his contacts.','Bekreft personen før du stoler på profilen.|Перевір людину, перш ніж довіряти профілю.|Verify the person before trusting the profile.']
      ],
      tasks: [
        ['Kan et profilbilde bevise identitet?|Чи доводить фото профілю особу?|Can a profile picture prove identity?','Nei, det kan kopieres|Ні, його можна скопіювати|No, it can be copied','Ja, alltid|Так, завжди|Yes, always','Bare i spill|Лише в іграх|Only in games','Bare om dagen|Лише вдень|Only in daytime'],
        ['Hva deler du aldri i chat?|Чим ніколи не ділитися в чаті?|What do you never share in chat?','Innloggingskode og passord|Кодом входу й паролем|Login codes and passwords','En offentlig værmelding|Публічним прогнозом погоди|A public weather report','En boktittel|Назвою книжки|A book title','En morsom gåte|Веселою загадкою|A funny riddle'],
        ['Hvordan bekrefter du vennen?|Як перевірити друга?|How do you verify the friend?','Ringer et kjent nummer|Телефоную на відомий номер|Call a known number','Spør den nye profilen|Питаю новий профіль|Ask the new profile','Sender koden|Надсилаю код|Send the code','Klikker på alle lenker|Натискаю всі посилання|Click every link']
      ],
      vocab: ['en profil|профіль|a profile','å kopiere|копіювати|to copy','en innloggingskode|код входу|a login code','en hemmelighet|секрет|a secret','privat|приватний|private','kontroll|контроль|control','å etterligne|видавати себе|to impersonate','en plattform|платформа|a platform','å undersøke|розслідувати|to investigate','å fjerne|видаляти|to remove','å varsle|попереджати|to warn','en kontakt|контакт|a contact']
    },
    {
      id: 'p216', level: 'A2', track: 'device-safety', term: 'en tillatelse',
      title: 'Appen vil ha alt|Застосунок хоче все|The app wants everything',
      summary: 'Nora gir bare appen tillatelser som er nødvendige for funksjonen hun bruker.|Нора надає застосунку лише дозволи, потрібні для використаної функції.|Nora gives the app only permissions needed for the feature she uses.',
      scenes: [
        ['phone','kamera · mikrofon · kontakter','Et enkelt lommelyktspill vil ha tilgang til alt.|Проста гра-ліхтарик хоче доступ до всього.|A simple torch game wants access to everything.','Spør hvorfor hver tillatelse er nødvendig.|Запитай, навіщо потрібен кожен дозвіл.|Ask why each permission is necessary.'],
        ['datashield','minst mulig','Spillet trenger ikke kontaktene mine.|Грі не потрібні мої контакти.|The game does not need my contacts.','Gi minst mulig tilgang.|Надавай мінімальний доступ.|Give the least access possible.'],
        ['phone','bare mens appen brukes','Kartet trenger posisjon når jeg navigerer.|Карті потрібне місцезнаходження під час навігації.|The map needs location while I navigate.','Velg bare mens appen er i bruk.|Обери лише під час використання застосунку.|Choose only while using the app.'],
        ['browser','sjekk utvikler og omtaler','Jeg ser hvem som har laget appen.|Я дивлюся, хто створив застосунок.|I check who made the app.','Last ned fra en offisiell butikk og les omtaler kritisk.|Завантажуй з офіційного магазину й критично читай відгуки.|Download from an official store and read reviews critically.'],
        ['phone','innstillinger → tillatelser','Jeg kan endre tillatelsene senere.|Я можу змінити дозволи пізніше.|I can change permissions later.','Fjern tilgang som ikke lenger trengs.|Прибери доступ, який більше не потрібен.|Remove access that is no longer needed.'],
        ['datashield','funksjon før tilgang','Nå virker kartet uten unødvendige data.|Тепер карта працює без зайвих даних.|Now the map works without unnecessary data.','En app bør forklare hva den samler inn.|Застосунок має пояснювати, що він збирає.|An app should explain what it collects.']
      ],
      tasks: [
        ['Hvor mye tilgang bør en app få?|Скільки доступу має отримати застосунок?|How much access should an app receive?','Bare det som er nødvendig|Лише необхідне|Only what is necessary','Alltid alt|Завжди все|Always everything','Alle kontakter|Усі контакти|All contacts','Kamera hele tiden|Камеру постійно|The camera all the time'],
        ['Når kan kartet få posisjon?|Коли карта може отримувати місцезнаходження?|When may a map access location?','Mens appen brukes|Під час використання застосунку|While the app is in use','Hele natten|Усю ніч|All night','Etter sletting|Після видалення|After deletion','Aldri uten grunn|Ніколи без причини|Never without reason'],
        ['Hvor laster du helst ned apper?|Звідки краще завантажувати застосунки?|Where should you preferably download apps?','Fra en offisiell butikk|З офіційного магазину|From an official store','Fra en tilfeldig lenke|За випадковим посиланням|From a random link','Fra et ukjent vedlegg|З невідомого вкладення|From an unknown attachment','Fra en reklamechat|З рекламного чату|From an advert chat']
      ],
      vocab: ['en tillatelse|дозвіл|a permission','tilgang|доступ|access','et kamera|камера|a camera','en mikrofon|мікрофон|a microphone','en kontaktliste|список контактів|a contact list','en posisjon|місцезнаходження|a location','å navigere|навігувати|to navigate','en utvikler|розробник|a developer','en omtale|відгук|a review','kritisk|критичний|critical','unødvendig|зайвий|unnecessary','å samle inn|збирати|to collect']
    },
    {
      id: 'p217', level: 'A2', track: 'device-safety', term: 'en sikkerhetsoppdatering',
      title: 'Oppdater på riktig måte|Оновлюй правильно|Update the right way',
      summary: 'Sikkerhetsoppdateringer tetter kjente feil når de kommer fra en offisiell kilde.|Оновлення безпеки закривають відомі помилки, якщо надходять з офіційного джерела.|Security updates fix known flaws when they come from an official source.',
      scenes: [
        ['phone','oppdater nå','Telefonen viser et vanlig systemvarsel.|Телефон показує звичайне системне сповіщення.|The phone shows a normal system notification.','Oppdateringer kan rette sikkerhetsfeil.|Оновлення можуть виправляти помилки безпеки.|Updates can fix security flaws.'],
        ['browser','last ned raskere her','En reklame tilbyr samme oppdatering på en ukjent side.|Реклама пропонує те саме оновлення на невідомому сайті.|An advert offers the same update on an unknown site.','Ikke installer systemfiler fra tilfeldige lenker.|Не встановлюй системні файли за випадковими посиланнями.|Do not install system files from random links.'],
        ['datashield','innstillinger eller butikk','Jeg åpner enhetens egne innstillinger.|Я відкриваю налаштування пристрою.|I open the device’s own settings.','Bruk operativsystemet eller den offisielle appbutikken.|Використовуй операційну систему або офіційний магазин.|Use the operating system or official app store.'],
        ['database','sikkerhetskopi først','Viktige filer er sikkerhetskopiert.|Важливі файли мають резервну копію.|Important files are backed up.','Da kan de gjenopprettes hvis noe går galt.|Тоді їх можна відновити, якщо щось піде не так.|Then they can be restored if something goes wrong.'],
        ['phone','strøm + nett','Jeg kobler til strøm og et pålitelig nett.|Я підключаю живлення й надійну мережу.|I connect power and a trusted network.','Ikke avbryt en systemoppdatering midtveis.|Не переривай системне оновлення посередині.|Do not interrupt a system update halfway.'],
        ['datashield','oppdatert','Enheten starter igjen med siste sikkerhetsrettelser.|Пристрій запускається з останніми виправленнями безпеки.|The device restarts with the latest security fixes.','Automatiske oppdateringer gjør det lettere å holde følge.|Автоматичні оновлення допомагають не відставати.|Automatic updates make it easier to keep up.']
      ],
      tasks: [
        ['Hvor henter du en systemoppdatering?|Звідки завантажувати системне оновлення?|Where do you get a system update?','Fra enhetens innstillinger|З налаштувань пристрою|From the device settings','Fra en tilfeldig reklame|З випадкової реклами|From a random advert','Fra en chatfil|З файлу в чаті|From a chat file','Fra en ukjent QR-kode|З невідомого QR-коду|From an unknown QR code'],
        ['Hva gjør oppdateringer ofte?|Що часто роблять оновлення?|What do updates often do?','Retter sikkerhetsfeil|Виправляють помилки безпеки|Fix security flaws','Deler passord|Передають паролі|Share passwords','Sletter alle kontoer|Видаляють усі облікові записи|Delete every account','Slår av tofaktor|Вимикають 2FA|Turn off two-factor authentication'],
        ['Hva gjør du før en stor oppdatering?|Що зробити перед великим оновленням?|What do you do before a major update?','Tar sikkerhetskopi|Роблю резервну копію|Make a backup','Deler kortnummer|Передаю номер картки|Share a card number','Sletter nettleseren|Видаляю браузер|Delete the browser','Slår av strømmen|Вимикаю живлення|Turn off the power']
      ],
      vocab: ['en oppdatering|оновлення|an update','en sikkerhetsfeil|помилка безпеки|a security flaw','en kilde|джерело|a source','å installere|встановлювати|to install','et operativsystem|операційна система|an operating system','en appbutikk|магазин застосунків|an app store','en systemfil|системний файл|a system file','pålitelig|надійний|trusted','å avbryte|переривати|to interrupt','midtveis|посередині|halfway','en rettelse|виправлення|a fix','automatisk|автоматичний|automatic']
    },
    {
      id: 'p218', level: 'B1', track: 'device-safety', term: 'et offentlig nettverk',
      title: 'Skolens åpne Wi-Fi|Відкритий Wi-Fi у школі|The school’s open Wi-Fi',
      summary: 'Nora skiller ekte nettverk fra kopier og unngår sensitive handlinger på åpne nett.|Нора відрізняє справжню мережу від копій і уникає чутливих дій у відкритих мережах.|Nora distinguishes the real network from copies and avoids sensitive actions on open networks.',
      scenes: [
        ['phone','School_Free + SchoolFree','To nettverk har nesten samme navn.|Дві мережі мають майже однакові назви.|Two networks have almost the same name.','Spør skolen hvilket navn som er riktig.|Запитай у школи правильну назву.|Ask the school which name is correct.'],
        ['datashield','åpent nettverk','Et åpent nett bruker ikke alltid god beskyttelse.|Відкрита мережа не завжди має належний захист.|An open network does not always use good protection.','Vær forsiktig med det du sender.|Будь обережним із тим, що надсилаєш.|Be careful with what you send.'],
        ['browser','https + riktig domene','Nettleseren viser en lås og HTTPS.|Браузер показує замок і HTTPS.|The browser shows a lock and HTTPS.','Kontroller også at domenet er riktig.|Також перевір правильність домену.|Also check that the domain is correct.'],
        ['phone','ingen bank eller passordbytte','Jeg venter med sensitive handlinger.|Я відкладаю чутливі дії.|I wait before doing sensitive tasks.','Bruk mobildata eller et betrodd nett når det haster.|Використовуй мобільні дані або надійну мережу, якщо терміново.|Use mobile data or a trusted network when urgent.'],
        ['datashield','glem nettverket','Telefonen skal ikke koble seg automatisk til senere.|Телефон не повинен підключатися автоматично пізніше.|The phone should not connect automatically later.','Velg glem nettverk når du er ferdig.|Обери забути мережу після завершення.|Choose forget network when finished.'],
        ['datashield','bekreft + begrens','Jeg bekrefter navnet og begrenser hva jeg gjør.|Я підтверджую назву й обмежую свої дії.|I verify the name and limit what I do.','Et kjent nett og HTTPS reduserer risikoen.|Відома мережа й HTTPS зменшують ризик.|A known network and HTTPS reduce risk.']
      ],
      tasks: [
        ['Hvordan finner du riktig skolenett?|Як знайти правильну шкільну мережу?|How do you find the correct school network?','Spør skolen om navnet|Питаю школу про назву|Ask the school for the name','Velger det første|Обираю перше|Choose the first one','Velger sterkest signal|Обираю найсильніший сигнал|Choose the strongest signal','Gjetter|Вгадую|Guess'],
        ['Hva bør du unngå på åpent Wi-Fi?|Чого уникати у відкритому Wi-Fi?|What should you avoid on open Wi-Fi?','Sensitive handlinger|Чутливих дій|Sensitive tasks','Å lese en offentlig side|Читання публічної сторінки|Reading a public page','Å sjekke klokkeslett|Перевірки часу|Checking the time','Å bruke kalkulator|Калькулятора|Using a calculator'],
        ['Hva sjekker du i nettleseren?|Що перевірити в браузері?|What do you check in the browser?','HTTPS og riktig domene|HTTPS і правильний домен|HTTPS and the correct domain','Bare fargen|Лише колір|Only the colour','Skjermstørrelsen|Розмір екрана|The screen size','Batteriet|Батарею|The battery']
      ],
      vocab: ['et nettverk|мережа|a network','åpen|відкритий|open','et nettverksnavn|назва мережі|a network name','å bekrefte|підтверджувати|to verify','sensitiv|чутливий|sensitive','mobildata|мобільні дані|mobile data','betrodd|надійний|trusted','HTTPS|HTTPS|HTTPS','en nettleserlås|замок браузера|a browser lock','automatisk|автоматично|automatically','å glemme|забувати|to forget','en risiko|ризик|a risk']
    },
    {
      id: 'p219', level: 'B1', track: 'device-safety', term: 'en sikkerhetskopi',
      title: 'Backup-redningen|Порятунок із резервної копії|The backup rescue',
      summary: 'Regelmessige, adskilte sikkerhetskopier hjelper når filer blir ødelagt eller låst.|Регулярні окремі резервні копії допомагають, коли файли пошкоджено або заблоковано.|Regular separate backups help when files are damaged or locked.',
      scenes: [
        ['database','bilder · skolearbeid','Datamaskinen har filer jeg ikke vil miste.|На комп’ютері є файли, які я не хочу втратити.|The computer has files I do not want to lose.','Da trenger du mer enn én kopi.|Тоді потрібна не одна копія.|Then you need more than one copy.'],
        ['datashield','3 kopier · 2 medier · 1 annet sted','Vi følger en enkel sikkerhetskopiplan.|Ми дотримуємося простого плану резервування.|We follow a simple backup plan.','En kopi skal være adskilt fra enheten.|Одна копія має бути окремо від пристрою.|One copy should be separate from the device.'],
        ['phone','filene kan ikke åpnes','Plutselig får alle filene rare navn.|Раптом усі файли отримали дивні назви.|Suddenly all the files have strange names.','Stopp og koble enheten fra nettverket.|Зупинись і від’єднай пристрій від мережі.|Stop and disconnect the device from the network.'],
        ['datashield','ikke betal eller eksperimenter','En melding krever penger for filene.|Повідомлення вимагає гроші за файли.|A message demands money for the files.','Be en voksen eller skolens IT-ansvarlige om hjelp.|Попроси допомоги в дорослого або шкільного ІТ-фахівця.|Ask an adult or the school IT lead for help.'],
        ['database','ren enhet + kontrollert kopi','En fagperson rydder enheten før gjenoppretting.|Фахівець очищає пристрій перед відновленням.|A professional cleans the device before recovery.','Ikke koble sikkerhetskopien til en usikker enhet.|Не підключай резервну копію до небезпечного пристрою.|Do not connect the backup to an unsafe device.'],
        ['datashield','filene er tilbake','Den adskilte kopien redder skolearbeidet.|Окрема копія рятує шкільні роботи.|The separate copy saves the schoolwork.','Test sikkerhetskopien jevnlig, ikke bare lag den.|Регулярно перевіряй резервну копію, а не лише створюй її.|Test the backup regularly, do not only create it.']
      ],
      tasks: [
        ['Hvor bør minst én kopi være?|Де має бути принаймні одна копія?|Where should at least one copy be?','Adskilt fra enheten|Окремо від пристрою|Separate from the device','I samme åpne mappe|У тій самій відкритій папці|In the same open folder','Bare i minnet|Лише в пам’яті|Only in memory','Ingen steder|Ніде|Nowhere'],
        ['Hva gjør du når mange filer plutselig låses?|Що робити, коли багато файлів раптом заблоковано?|What do you do when many files are suddenly locked?','Kobler fra nettet og ber om hjelp|Від’єдную мережу й прошу допомоги|Disconnect from the network and ask for help','Betaler straks|Одразу плачу|Pay immediately','Åpner flere filer|Відкриваю більше файлів|Open more files','Sender meldingen videre|Пересилаю повідомлення|Forward the message'],
        ['Hvorfor tester vi en backup?|Навіщо перевіряти резервну копію?|Why do we test a backup?','For å vite at den kan gjenopprettes|Щоб знати, що її можна відновити|To know it can be restored','For å dele passord|Щоб ділитися паролями|To share passwords','For å slå av oppdateringer|Щоб вимкнути оновлення|To disable updates','For å fylle disken|Щоб заповнити диск|To fill the disk']
      ],
      vocab: ['en sikkerhetskopi|резервна копія|a backup','adskilt|окремий|separate','et medium|носій|a medium','å miste|втрачати|to lose','å ødelegge|пошкоджувати|to damage','å låse|блокувати|to lock','å koble fra|від’єднувати|to disconnect','løsepengevirus|вірус-вимагач|ransomware','en IT-ansvarlig|ІТ-фахівець|an IT lead','å rydde|очищати|to clean','å gjenopprette|відновлювати|to restore','jevnlig|регулярно|regularly']
    },
    {
      id: 'p220', level: 'A2', track: 'secure-coding', term: 'en CAPTCHA',
      title: 'Er du et menneske?|Ти людина?|Are you human?',
      summary: 'CAPTCHA bremser automatisert misbruk, men må være tilgjengelig og bare ett lag av flere.|CAPTCHA уповільнює автоматизоване зловживання, але має бути доступною й лише одним із рівнів захисту.|CAPTCHA slows automated abuse, but must be accessible and only one of several protective layers.',
      scenes: [
        ['browser','mange falske skjema','Et program sender tusen skjema på få sekunder.|Програма надсилає тисячі форм за кілька секунд.|A program submits thousands of forms in seconds.','Automatisert misbruk kan fylle tjenesten med søppel.|Автоматизоване зловживання може заповнити сервіс сміттям.|Automated abuse can fill the service with junk.'],
        ['datashield','CAPTCHA','Nettstedet legger til en menneskesjekk.|Сайт додає перевірку на людину.|The site adds a human check.','CAPTCHA prøver å skille mennesker fra automatiske roboter.|CAPTCHA намагається відрізнити людей від автоматичних ботів.|CAPTCHA tries to tell humans from automated bots.'],
        ['browser','bilde eller enkel oppgave','Brukeren får en kort utfordring.|Користувач отримує коротке завдання.|The user gets a short challenge.','Den skal ikke samle mer persondata enn nødvendig.|Вона не повинна збирати більше даних, ніж потрібно.|It should not collect more personal data than necessary.'],
        ['phone','lyd + tilgjengelig valg','Hva om noen ikke kan se bildene?|Що, якщо хтось не бачить зображення?|What if someone cannot see the pictures?','Gi et tilgjengelig alternativ, for eksempel lyd eller annen kontroll.|Дай доступну альтернативу, наприклад звук або іншу перевірку.|Provide an accessible alternative, such as audio or another check.'],
        ['datashield','CAPTCHA er ikke nok alene','Kan vi stole bare på CAPTCHA?|Чи можна покладатися лише на CAPTCHA?|Can we rely only on CAPTCHA?','Nei. Bruk også grenser, logging og kontroll på serveren.|Ні. Також потрібні обмеження, журнали й перевірка на сервері.|No. Also use limits, logging and server checks.'],
        ['codecard','beskytt + respekter','En god CAPTCHA bremser misbruk uten å stenge mennesker ute.|Хороша CAPTCHA гальмує зловживання, не виключаючи людей.|A good CAPTCHA slows abuse without excluding people.','Del aldri bekreftelseskoder med fremmede.|Ніколи не передавай коди підтвердження незнайомцям.|Never share verification codes with strangers.']
      ],
      tasks: [
        ['Hva er formålet med CAPTCHA?|Яка мета CAPTCHA?|What is the purpose of CAPTCHA?','Å bremse automatisert misbruk|Уповільнити автоматизоване зловживання|To slow automated abuse','Å samle alle passord|Зібрати всі паролі|To collect every password','Å fjerne personvern|Прибрати приватність|To remove privacy','Å erstatte all sikkerhet|Замінити весь захист|To replace all security'],
        ['Hva trenger en tilgjengelig CAPTCHA?|Що потрібно доступній CAPTCHA?|What does an accessible CAPTCHA need?','Et alternativ til visuelle oppgaver|Альтернативу візуальним завданням|An alternative to visual tasks','Mindre tekst|Менше тексту|Less text','Bare musestyring|Лише керування мишею|Mouse control only','Ingen forklaring|Без пояснення|No explanation'],
        ['Er CAPTCHA nok alene?|Чи достатньо лише CAPTCHA?|Is CAPTCHA enough by itself?','Nei, den er ett lag|Ні, це лише один рівень|No, it is one layer','Ja, alltid|Так, завжди|Yes, always','Bare for barn|Лише для дітей|Only for children','Bare på mobil|Лише на телефоні|Only on mobile']
      ],
      vocab: ['en CAPTCHA|CAPTCHA|a CAPTCHA','automatisert|автоматизований|automated','misbruk|зловживання|abuse','et skjema|форма|a form','søppel|сміття|junk','en robot|бот|a bot','en utfordring|завдання|a challenge','tilgjengelig|доступний|accessible','et alternativ|альтернатива|an alternative','en grense|обмеження|a limit','logging|журналювання|logging','en bekreftelseskode|код підтвердження|a verification code']
    },
    {
      id: 'p221', level: 'B1', track: 'secure-coding', term: 'validering',
      title: 'Ikke stol på skjemaet|Не довіряй формі|Do not trust the form',
      summary: 'Programmet validerer data på serveren, bruker trygge spørringer og viser ufarlige feilmeldinger.|Програма перевіряє дані на сервері, використовує безпечні запити й показує безпечні повідомлення про помилки.|The program validates data on the server, uses safe queries and shows harmless error messages.',
      scenes: [
        ['browser','alder: banan','Skjemaet forventer et tall, men får et ord.|Форма очікує число, але отримує слово.|The form expects a number but receives a word.','All input må kontrolleres før den brukes.|Усі введені дані треба перевіряти перед використанням.|All input must be checked before use.'],
        ['codecard','klient + server','Nettleseren kan sjekke først for å hjelpe brukeren.|Браузер може перевірити спочатку, щоб допомогти користувачу.|The browser can check first to help the user.','Serveren må kontrollere på nytt fordi klienten kan endres.|Сервер має перевірити знову, бо клієнт можна змінити.|The server must check again because the client can be changed.'],
        ['datashield','type · lengde · format','Vi godtar bare forventet type, lengde og format.|Ми приймаємо лише очікуваний тип, довжину й формат.|We accept only the expected type, length and format.','Avvis ugyldige data med en tydelig melding.|Відхиляй недійсні дані з чітким повідомленням.|Reject invalid data with a clear message.'],
        ['database','parameterisert spørring','Data skal ikke bygges rett inn i databasespørringen.|Дані не слід вставляти прямо в запит до бази.|Data should not be built directly into the database query.','Bruk parameteriserte spørringer fra rammeverket.|Використовуй параметризовані запити фреймворку.|Use parameterised queries from the framework.'],
        ['codecard','trygg feilmelding','Brukeren trenger å vite hva som må rettes.|Користувачеві треба знати, що виправити.|The user needs to know what to correct.','Men vis ikke hemmelige serverdetaljer.|Але не показуй секретні деталі сервера.|But do not reveal secret server details.'],
        ['datashield','kontroller ved grensen','Nå slipper bare gyldige data inn.|Тепер проходять лише дійсні дані.|Now only valid data enters.','Validering beskytter både brukeren og systemet.|Перевірка захищає і користувача, і систему.|Validation protects both the user and the system.']
      ],
      tasks: [
        ['Hvor må input alltid valideres?|Де завжди треба перевіряти введення?|Where must input always be validated?','På serveren|На сервері|On the server','Bare i nettleseren|Лише в браузері|Only in the browser','Bare i CSS|Лише в CSS|Only in CSS','Bare i bildet|Лише в зображенні|Only in the image'],
        ['Hva kontrollerer vi?|Що ми перевіряємо?|What do we check?','Type, lengde og format|Тип, довжину й формат|Type, length and format','Bare fargen|Лише колір|Only the colour','Bare brukernavnet|Лише ім’я користувача|Only the username','Bare klokkeslettet|Лише час|Only the time'],
        ['Hva brukes mot usikre databasespørringer?|Що використовують для безпечних запитів?|What is used for safer database queries?','Parameteriserte spørringer|Параметризовані запити|Parameterised queries','Sammensatt tekst fra brukeren|Складений текст користувача|Concatenated user text','Et lengre passord|Довший пароль|A longer password','En større knapp|Більша кнопка|A larger button']
      ],
      vocab: ['validering|перевірка даних|validation','input|введення|input','en klient|клієнт|a client','en server|сервер|a server','en datatype|тип даних|a data type','en lengde|довжина|a length','et format|формат|a format','ugyldig|недійсний|invalid','å avvise|відхиляти|to reject','parameterisert|параметризований|parameterised','en feilmelding|повідомлення про помилку|an error message','en detalj|деталь|a detail']
    },
    {
      id: 'p222', level: 'B1', track: 'secure-coding', term: 'HTTPS',
      title: 'Låsen i nettleseren|Замок у браузері|The lock in the browser',
      summary: 'HTTPS krypterer forbindelsen, mens riktig domene bekrefter at brukeren er på ønsket nettsted.|HTTPS шифрує з’єднання, а правильний домен підтверджує потрібний сайт.|HTTPS encrypts the connection, while the correct domain confirms the intended website.',
      scenes: [
        ['browser','http://','En side uten HTTPS sender data uten moderne transportvern.|Сторінка без HTTPS передає дані без сучасного транспортного захисту.|A page without HTTPS sends data without modern transport protection.','Ikke skriv inn sensitive opplysninger der.|Не вводь там чутливі дані.|Do not enter sensitive information there.'],
        ['datashield','HTTPS + TLS','HTTPS bruker TLS til å kryptere forbindelsen.|HTTPS використовує TLS для шифрування з’єднання.|HTTPS uses TLS to encrypt the connection.','Andre på veien skal ikke kunne lese innholdet.|Інші на шляху не повинні читати вміст.|Others along the path should not be able to read the content.'],
        ['browser','sertifikat','Nettleseren kontrollerer nettstedets sertifikat.|Браузер перевіряє сертифікат сайту.|The browser checks the website certificate.','Et gyldig sertifikat knytter en nøkkel til et domene.|Дійсний сертифікат пов’язує ключ із доменом.|A valid certificate links a key to a domain.'],
        ['browser','bilohash.com ≠ bilohash-login.example','Begge sider kan vise en lås.|Обидві сторінки можуть показувати замок.|Both pages can show a lock.','Låsen betyr kryptert forbindelse, ikke at alt innhold er ærlig.|Замок означає зашифроване з’єднання, а не чесність усього вмісту.|The lock means an encrypted connection, not that all content is honest.'],
        ['datashield','les domenet','Jeg leser domenet fra høyre del før skråstreken.|Я читаю домен перед косою рискою.|I read the domain before the slash.','Små staveforskjeller kan føre til en falsk side.|Малі відмінності в написанні можуть вести на фальшивий сайт.|Small spelling differences can lead to a fake site.'],
        ['codecard','HTTPS + riktig domene','Begge kontrollene må passe.|Обидві перевірки мають збігатися.|Both checks must match.','Kryptering beskytter reisen, og domenet viser målet.|Шифрування захищає шлях, а домен показує пункт призначення.|Encryption protects the journey, and the domain shows the destination.']
      ],
      tasks: [
        ['Hva beskytter HTTPS?|Що захищає HTTPS?|What does HTTPS protect?','Forbindelsen mellom nettleser og nettsted|З’єднання між браузером і сайтом|The connection between browser and website','Alle ord på internett|Усі слова в інтернеті|Every word on the internet','Telefonbatteriet|Батарею телефону|The phone battery','Skjermens glass|Скло екрана|The screen glass'],
        ['Hva betyr nettleserlåsen?|Що означає замок браузера?|What does the browser lock mean?','Forbindelsen er kryptert|З’єднання зашифроване|The connection is encrypted','Alt innhold er sant|Увесь вміст правдивий|All content is true','Eieren er en venn|Власник — друг|The owner is a friend','Siden er gratis|Сайт безкоштовний|The site is free'],
        ['Hva må du også kontrollere?|Що ще треба перевірити?|What else must you check?','At domenet er riktig|Що домен правильний|That the domain is correct','At knappen er blå|Що кнопка синя|That the button is blue','At siden har bilder|Що є зображення|That the page has pictures','At teksten er lang|Що текст довгий|That the text is long']
      ],
      vocab: ['HTTPS|HTTPS|HTTPS','TLS|TLS|TLS','å kryptere|шифрувати|to encrypt','en forbindelse|з’єднання|a connection','transportvern|захист передавання|transport protection','et sertifikat|сертифікат|a certificate','gyldig|дійсний|valid','å knytte|пов’язувати|to link','et nettsted|сайт|a website','ærlig|чесний|honest','en staveforskjell|відмінність у написанні|a spelling difference','et mål|пункт призначення|a destination']
    },
    {
      id: 'p223', level: 'B1', track: 'secure-coding', term: 'passordhashing',
      title: 'Passord blir til hash|Паролі перетворюються на хеш|Passwords become hashes',
      summary: 'Tjenesten lagrer en saltet passordhash og sammenligner nye forsøk uten å lagre klartekst.|Сервіс зберігає хеш пароля із сіллю та порівнює нові спроби без збереження відкритого тексту.|The service stores a salted password hash and compares new attempts without storing plaintext.',
      scenes: [
        ['database','passord i klartekst','Her står alle passordene lesbart i databasen.|Тут усі паролі видно в базі даних.|Here all passwords are readable in the database.','Det er farlig hvis databasen lekker.|Це небезпечно, якщо база даних витече.|That is dangerous if the database leaks.'],
        ['codecard','passord → hash','En passordhash er et enveis resultat.|Хеш пароля — це односторонній результат.|A password hash is a one-way result.','Tjenesten trenger ikke å lagre selve passordet.|Сервісу не потрібно зберігати сам пароль.|The service does not need to store the password itself.'],
        ['datashield','unikt salt','Vi legger til et tilfeldig salt for hver konto.|Ми додаємо випадкову сіль для кожного облікового запису.|We add a random salt for every account.','Like passord får da forskjellige lagrede verdier.|Однакові паролі тоді мають різні збережені значення.|Identical passwords then get different stored values.'],
        ['database','langsom passordfunksjon','Vanlig rask hashing er ikke laget for passord.|Звичайне швидке хешування не створене для паролів.|Ordinary fast hashing is not designed for passwords.','Bruk en anerkjent passordfunksjon fra plattformen.|Використовуй визнану парольну функцію платформи.|Use a recognised password function from the platform.'],
        ['codecard','hash(forsøk) == lagret hash','Ved innlogging hashes forsøket på samme måte.|Під час входу спробу хешують так само.|At login the attempt is hashed in the same way.','Systemet sammenligner resultatene uten å vise passordet.|Система порівнює результати, не показуючи пароль.|The system compares the results without revealing the password.'],
        ['datashield','tilbakestill, ikke send tilbake','Hvis brukeren glemmer passordet, lager hun et nytt.|Якщо користувач забув пароль, він створює новий.|If the user forgets the password, they create a new one.','En trygg tjeneste sender ikke det gamle passordet tilbake.|Безпечний сервіс не надсилає старий пароль назад.|A safe service does not send the old password back.']
      ],
      tasks: [
        ['Hvordan bør en tjeneste lagre passord?|Як сервіс має зберігати паролі?|How should a service store passwords?','Som en saltet passordhash|Як хеш із сіллю|As a salted password hash','Som lesbar tekst|Як відкритий текст|As readable text','I en offentlig fil|У публічному файлі|In a public file','I nettlesertittelen|У заголовку браузера|In the browser title'],
        ['Hva gjør et unikt salt?|Що робить унікальна сіль?|What does a unique salt do?','Gir like passord forskjellige lagrede verdier|Дає однаковим паролям різні збережені значення|Gives identical passwords different stored values','Gjør passordet kortere|Робить пароль коротшим|Makes the password shorter','Sender passordet på e-post|Надсилає пароль електронною поштою|Emails the password','Fjerner tofaktor|Прибирає 2FA|Removes two-factor authentication'],
        ['Hva skjer når passordet glemmes?|Що робити, коли пароль забуто?|What happens when a password is forgotten?','Brukeren tilbakestiller og lager et nytt|Користувач скидає й створює новий|The user resets it and creates a new one','Tjenesten viser det gamle|Сервіс показує старий|The service reveals the old one','Alle får lese det|Усі можуть його прочитати|Everyone can read it','Salt fjernes|Сіль видаляється|The salt is removed']
      ],
      vocab: ['en hash|хеш|a hash','klartekst|відкритий текст|plaintext','en lekkasje|витік|a leak','enveis|односторонній|one-way','et salt|сіль|a salt','en lagret verdi|збережене значення|a stored value','en passordfunksjon|парольна функція|a password function','anerkjent|визнаний|recognised','et forsøk|спроба|an attempt','å sammenligne|порівнювати|to compare','å tilbakestille|скидати|to reset','å avsløre|розкривати|to reveal']
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
