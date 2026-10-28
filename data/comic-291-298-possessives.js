window.COMICS = window.COMICS || [];

/* Eight original story lessons that turn Norwegian possessives into concrete
   choices. The grammar follows NTNU LearnNoW: min/din/vår agree with the owned
   noun; hans/hennes/deres do not; noun + possessive normally uses definite form. */
(() => {
  const tri = value => value.split('|');
  const source = ['NTNU LearnNoW — Possessiver', 'https://www.ntnu.edu/learnnow2-hs/5/grammatikk/'];
  const common = [
    'å eie|володіти|to own','en eier|власник|an owner','en ting|річ|an item','å tilhøre|належати|to belong',
    'entall|однина|singular','flertall|множина|plural','hankjønn|чоловічий рід|masculine','hunkjønn|жіночий рід|feminine',
    'intetkjønn|середній рід|neuter','bestemt form|означена форма|definite form'
  ];
  const wrong = [
    tri('Velg et tilfeldig ord|Обрати випадкове слово|Choose a random word'),
    tri('Se bare på personen|Дивитися лише на особу|Look only at the person'),
    tri('Bruk alltid samme form|Завжди вживати одну форму|Always use the same form')
  ];
  const specs = [
    {
      id:'p291', level:'A1', category:'hverdag', term:'min, mi, mitt, mine|мій, моя, моє, мої|my',
      title:'Kofferten på ferga|Валіза на поромі|The suitcase on the ferry',
      summary:'Mia sorterer ting fra en åpen koffert og lærer å velge min, mi, mitt og mine etter tingen hun eier.|Мія сортує речі з відкритої валізи й вчиться вибирати min, mi, mitt і mine за родом та числом речі.|Mia sorts items from an open suitcase and learns to choose min, mi, mitt and mine from the gender and number of the owned item.',
      vocab:['en koffert|валіза|a suitcase','en genser|светр|a jumper','ei lue|шапка|a hat','et pass|паспорт|a passport','sko|черевики|shoes','genseren min|мій светр|my jumper','lua mi|моя шапка|my hat','passet mitt|мій паспорт|my passport'],
      scenes:[
        ['ÅPEN KOFFERT','En koffert åpner seg på ferga, og tingene triller ut.|На поромі відкривається валіза, і речі висипаються.|A suitcase opens on the ferry and the items roll out.','Mia må vise hvilke ting som er hennes.|Мія має показати, які речі належать їй.|Mia has to show which items are hers.'],
        ['EN','«Genseren min», sier Mia om en genser.|«Genseren min», — каже Мія про светр.|“Genseren min,” Mia says about a jumper.','Et hankjønnsord får min.|Іменник чоловічого роду отримує min.|A masculine noun takes min.'],
        ['EI','«Lua mi» passer til ei lue.|«Lua mi» підходить до слова ei lue.|“Lua mi” matches ei lue.','Et hunkjønnsord kan få mi.|Іменник жіночого роду може отримати mi.|A feminine noun can take mi.'],
        ['ET','«Passet mitt» passer til et pass.|«Passet mitt» підходить до слова et pass.|“Passet mitt” matches et pass.','Et intetkjønnsord får mitt.|Іменник середнього роду отримує mitt.|A neuter noun takes mitt.'],
        ['FLERE','«Skoene mine» handler om flere sko.|«Skoene mine» означає кілька черевиків.|“Skoene mine” refers to several shoes.','Flertall får mine, uansett kjønn.|Множина отримує mine незалежно від роду.|Plural takes mine, regardless of gender.'],
        ['ALT PÅ PLASS','Mia får alle tingene tilbake i kofferten sin.|Мія повертає всі речі до своєї валізи.|Mia gets all the items back into her suitcase.','Hun ser på tingen: en→min, ei→mi, et→mitt, flere→mine.|Вона дивиться на річ: en→min, ei→mi, et→mitt, кілька→mine.|She checks the item: en→min, ei→mi, et→mitt, several→mine.']
      ],
      tasks:[
        ['Hva passer: genseren __?|Що підходить: genseren __?|What fits: genseren __?','min|мій|min','mitt|моє|mitt','mine|мої|mine','meg|мене|meg'],
        ['Hva passer: lua __?|Що підходить: lua __?|What fits: lua __?','mi|моя|mi','min|мій|min','mitt|моє|mitt','mine|мої|mine'],
        ['Hva passer: passet __?|Що підходить: passet __?|What fits: passet __?','mitt|моє|mitt','min|мій|min','mi|моя|mi','mine|мої|mine'],
        ['Hva passer: skoene __?|Що підходить: skoene __?|What fits: skoene __?','mine|мої|mine','min|мій|min','mi|моя|mi','mitt|моє|mitt']
      ]
    },
    {
      id:'p292', level:'A1', category:'skole', term:'din, di, ditt, dine|твій, твоя, твоє, твої|your',
      title:'Etter svømmetimen|Після уроку плавання|After swimming class',
      summary:'Leo hjelper til i garderoben og finner riktig eier ved å bruke din, di, ditt og dine.|Лео допомагає в роздягальні й знаходить власників речей за допомогою din, di, ditt і dine.|Leo helps in the changing room and finds the right owners by using din, di, ditt and dine.',
      vocab:['en sekk|рюкзак|a backpack','ei flaske|пляшка|a bottle','et håndkle|рушник|a towel','svømmebriller|окуляри для плавання|goggles','sekken din|твій рюкзак|your backpack','flaska di|твоя пляшка|your bottle','håndkleet ditt|твій рушник|your towel','brillene dine|твої окуляри|your goggles'],
      scenes:[
        ['GJENGLEMT','Fire ting ligger igjen etter svømmetimen.|Після плавання залишилися чотири речі.|Four items are left after swimming class.','Leo spør hver elev i stedet for å gjette.|Лео питає кожного учня, а не вгадує.|Leo asks each student instead of guessing.'],
        ['DIN','«Er dette sekken din?» spør han Amir.|«Er dette sekken din?» — питає він Аміра.|“Er dette sekken din?” he asks Amir.','En sekk passer med din.|Слово en sekk узгоджується з din.|En sekk matches din.'],
        ['DI','«Er flaska di blå?» spør han Nora.|«Er flaska di blå?» — питає він Нору.|“Er flaska di blå?” he asks Nora.','Ei flaske passer med di.|Слово ei flaske узгоджується з di.|Ei flaske matches di.'],
        ['DITT','«Håndkleet ditt er her!» sier Leo.|«Håndkleet ditt er her!» — каже Лео.|“Håndkleet ditt er her!” Leo says.','Et håndkle passer med ditt.|Слово et håndkle узгоджується з ditt.|Et håndkle matches ditt.'],
        ['DINE','«Svømmebrillene dine ligger på benken.»|«Svømmebrillene dine лежать на лавці».|“Svømmebrillene dine are on the bench.”','Flertall passer med dine.|Множина узгоджується з dine.|Plural matches dine.'],
        ['RYDDIG','Alle får riktig ting tilbake.|Усі отримують свої речі.|Everyone gets the right item back.','Spørsmålet blir lett når Leo ser på substantivet.|Запитання стає легким, коли Лео дивиться на іменник.|The question becomes easy when Leo looks at the noun.']
      ],
      tasks:[
        ['Er dette sekken __?|Це твій рюкзак?|Is this your backpack?','din|твій|din','ditt|твоє|ditt','dine|твої|dine','deg|тебе|deg'],
        ['Hvor er flaska __?|Де твоя пляшка?|Where is your bottle?','di|твоя|di','din|твій|din','ditt|твоє|ditt','dine|твої|dine'],
        ['Håndkleet __ er tørt.|Твій рушник сухий.|Your towel is dry.','ditt|твоє|ditt','din|твій|din','di|твоя|di','dine|твої|dine'],
        ['Brillene __ ligger her.|Твої окуляри лежать тут.|Your goggles are here.','dine|твої|dine','din|твій|din','di|твоя|di','ditt|твоє|ditt']
      ]
    },
    {
      id:'p293', level:'A1', category:'bolig', term:'vår, vårt, våre|наш, наше, наші|our',
      title:'Kartet over nabolaget vårt|Карта нашого району|The map of our neighbourhood',
      summary:'Familien lager et kart og øver på vår, vårt og våre med steder i det nye nabolaget.|Родина створює карту й тренує vår, vårt і våre з місцями нового району.|The family makes a map and practises vår, vårt and våre with places in the new neighbourhood.',
      vocab:['et nabolag|район|a neighbourhood','en vei|дорога|a road','ei gate|вулиця|a street','et hus|будинок|a house','naboer|сусіди|neighbours','veien vår|наша дорога|our road','huset vårt|наш будинок|our house','naboene våre|наші сусіди|our neighbours'],
      scenes:[
        ['NYTT STED','Familien har flyttet og tegner et kart sammen.|Родина переїхала й разом малює карту.|The family has moved and draws a map together.','De vil forklare hvor alt ligger.|Вони хочуть пояснити, де все розташовано.|They want to explain where everything is.'],
        ['VÅR','«Veien vår går til parken.»|«Veien vår веде до парку».|“Veien vår leads to the park.”','En vei får vår.|Слово en vei отримує vår.|En vei takes vår.'],
        ['VÅR OGSÅ','«Gata vår har mange trær.»|«Gata vår має багато дерев».|“Gata vår has many trees.”','Vår brukes også med hunkjønnsord.|Vår також уживається з жіночим родом.|Vår is also used with feminine nouns.'],
        ['VÅRT','«Huset vårt har en rød dør.»|«Huset vårt має червоні двері».|“Huset vårt has a red door.”','Et hus får vårt.|Слово et hus отримує vårt.|Et hus takes vårt.'],
        ['VÅRE','«Naboene våre heter Liv og Per.»|«Наших сусідів звати Лів і Пер».|“Naboene våre are called Liv and Per.”','Flertall får våre.|Множина отримує våre.|Plural takes våre.'],
        ['FERDIG KART','Nå kan alle beskrive nabolaget sitt.|Тепер усі можуть описати свій район.|Now everyone can describe their neighbourhood.','Vår, vårt eller våre følger det vi eier sammen.|Vår, vårt або våre залежить від того, чим ми володіємо разом.|Vår, vårt or våre follows what we own together.']
      ],
      tasks:[
        ['Veien __ er smal.|Наша дорога вузька.|Our road is narrow.','vår|наша|vår','vårt|наше|vårt','våre|наші|våre','oss|нас|oss'],
        ['Gata __ har trær.|Наша вулиця має дерева.|Our street has trees.','vår|наша|vår','vårt|наше|vårt','våre|наші|våre','vi|ми|vi'],
        ['Huset __ er gult.|Наш будинок жовтий.|Our house is yellow.','vårt|наше|vårt','vår|наша|vår','våre|наші|våre','oss|нас|oss'],
        ['Naboene __ er hyggelige.|Наші сусіди привітні.|Our neighbours are friendly.','våre|наші|våre','vår|наша|vår','vårt|наше|vårt','vi|ми|vi']
      ]
    },
    {
      id:'p294', level:'A2', category:'skole', term:'hans, hennes, deres|його, її, їхній|his, her, their',
      title:'Tre prosjekter på samme bord|Три проєкти на одному столі|Three projects on one table',
      summary:'På utstillingen skiller klassen mellom Leos, Noras og tvillingenes arbeid med hans, hennes og deres.|На виставці клас розрізняє роботу Лео, Нори й близнюків за допомогою hans, hennes і deres.|At the exhibition, the class distinguishes Leo’s, Nora’s and the twins’ work using hans, hennes and deres.',
      vocab:['en utstilling|виставка|an exhibition','et prosjekt|проєкт|a project','en modell|модель|a model','en plakat|плакат|a poster','tvillinger|близнюки|twins','prosjektet hans|його проєкт|his project','modellen hennes|її модель|her model','plakaten deres|їхній плакат|their poster'],
      scenes:[
        ['UTSTILLING','Tre prosjekter står uten navnelapper.|Три проєкти стоять без підписів.|Three projects are displayed without name labels.','Læreren ber klassen finne eierne.|Учитель просить клас знайти власників.|The teacher asks the class to find the owners.'],
        ['HANS','Leo bygde roboten. Det er prosjektet hans.|Лео збудував робота. Це його проєкт.|Leo built the robot. It is his project.','Hans endrer seg ikke etter ordet.|Hans не змінюється залежно від слова.|Hans does not change with the noun.'],
        ['HENNES','Nora laget byen. Modellen hennes lyser.|Нора створила місто. Її модель світиться.|Nora made the city. Her model lights up.','Hennes har samme form i entall og flertall.|Hennes має ту саму форму в однині й множині.|Hennes has the same form in singular and plural.'],
        ['DERES','Tvillingene tegnet plakaten. Fargene deres er sterke.|Близнюки намалювали плакат. Їхні кольори яскраві.|The twins drew the poster. Their colours are strong.','Deres brukes når flere eier noe.|Deres уживають, коли власників кілька.|Deres is used when several people own something.'],
        ['INGEN BØYING','Vi sier huset hans, boka hans og bildene hans.|Кажемо huset hans, boka hans і bildene hans.|We say huset hans, boka hans and bildene hans.','Det er eieren, ikke kjønnet på tingen, som velger ordet.|Слово визначає власник, а не рід речі.|The owner, rather than the noun gender, selects the word.'],
        ['NAVNELAPPER','Alle prosjektene får riktig navnelapp.|Усі проєкти отримують правильні підписи.|Every project gets the right name label.','Hans, hennes og deres gjør eieren tydelig.|Hans, hennes і deres чітко показують власника.|Hans, hennes and deres make the owner clear.']
      ],
      tasks:[
        ['Leo har et prosjekt. Det er prosjektet __.|У Лео є проєкт. Це його проєкт.|Leo has a project. It is __ project.','hans|його|hans','hennes|її|hennes','deres|їхній|deres','sin|свій|sin'],
        ['Nora har en modell. Modellen __ lyser.|У Нори є модель. Її модель світиться.|Nora has a model. __ model lights up.','hennes|її|hennes','hans|його|hans','deres|їхній|deres','henne|її|henne'],
        ['Tvillingene har en plakat. Plakaten __ er stor.|У близнюків є плакат. Їхній плакат великий.|The twins have a poster. __ poster is large.','deres|їхній|deres','hans|його|hans','hennes|її|hennes','dem|їх|dem'],
        ['Hvilket av ordene bøyes ikke etter tingen?|Яке слово не змінюється за родом речі?|Which word does not agree with the owned item?','hans|його|hans','min|мій|min','mitt|моє|mitt','mine|мої|mine']
      ]
    },
    {
      id:'p295', level:'A2', category:'familie', term:'sin, si, sitt, sine|свій, своя, своє, свої|one’s own',
      title:'Max fant jakka si|Макс знайшов свою куртку|Max found his own jacket',
      summary:'En tur i regnet viser forskjellen mellom sin egen ting og en annen persons ting.|Прогулянка під дощем показує різницю між власною річчю підмета та річчю іншої особи.|A walk in the rain shows the difference between the subject’s own item and another person’s item.',
      vocab:['en regnjakke|дощовик|a rain jacket','et halsbånd|нашийник|a collar','en hund|собака|a dog','en eier|власник|an owner','sin egen|свій власний|one’s own','jakka si|своя куртка|one’s own jacket','halsbåndet sitt|свій нашийник|one’s own collar','lekene sine|свої іграшки|one’s own toys'],
      scenes:[
        ['REGNVÆR','Leo og Nora rydder våte klær etter turen.|Лео й Нора прибирають мокрий одяг після прогулянки.|Leo and Nora tidy wet clothes after the walk.','Hunden Max snuser på en liten regnjakke.|Собака Макс нюхає маленький дощовик.|The dog Max sniffs a small rain jacket.'],
        ['SI','Max finner jakka si, altså sin egen jakke.|Макс знаходить свою куртку, тобто власну.|Max finds jakka si, meaning his own jacket.','Si viser tilbake til Max, som er subjekt.|Si вказує назад на Макса, який є підметом.|Si points back to Max, the subject.'],
        ['SITT','Max tar på halsbåndet sitt.|Макс одягає свій нашийник.|Max puts on halsbåndet sitt.','Et halsbånd gjør at vi velger sitt.|Et halsbånd означає, що обираємо sitt.|Et halsbånd makes us choose sitt.'],
        ['SINE','Så samler Max lekene sine.|Потім Макс збирає свої іграшки.|Then Max collects lekene sine.','Flertall gjør at vi velger sine.|Множина означає, що обираємо sine.|Plural makes us choose sine.'],
        ['HENNES','Max bærer jakka hennes til Nora.|Макс несе її куртку Норі.|Max carries jakka hennes to Nora.','Hennes betyr at jakka tilhører en annen kvinne, ikke subjektet Max.|Hennes означає, що куртка належить іншій жінці, не підмету Максу.|Hennes means the jacket belongs to another female person, not the subject Max.'],
        ['HVEM EIER?','Spør først hvem som er subjekt og hvem som eier tingen.|Спочатку запитай, хто підмет і хто власник речі.|First ask who the subject is and who owns the item.','Da blir forskjellen mellom sin og hans eller hennes tydelig.|Тоді різниця між sin та hans або hennes стає зрозумілою.|Then the difference between sin and hans or hennes becomes clear.']
      ],
      tasks:[
        ['Max finner jakka __. (Max sin egen)|Макс знаходить свою куртку.|Max finds __ own jacket.','si|свою|si','hennes|її|hennes','sitt|своє|sitt','sine|свої|sine'],
        ['Max tar på halsbåndet __.|Макс одягає свій нашийник.|Max puts on __ own collar.','sitt|свій|sitt','sin|свій|sin','si|свою|si','sine|свої|sine'],
        ['Max samler lekene __.|Макс збирає свої іграшки.|Max gathers __ own toys.','sine|свої|sine','sin|свій|sin','si|свою|si','sitt|своє|sitt'],
        ['Max bærer jakka __ til Nora. (Noras jakke)|Макс несе її куртку Норі.|Max carries __ jacket to Nora.','hennes|її|hennes','si|свою|si','sin|свій|sin','sitt|своє|sitt']
      ]
    },
    {
      id:'p296', level:'A2', category:'butikk', term:'bilen min eller min bil|моя машина: два порядки|my car: two word orders',
      title:'Skiltverkstedet|Майстерня табличок|The sign workshop',
      summary:'Nora lager butikkskilt og oppdager hvorfor vi sier bilen min, men min bil.|Нора робить магазинні таблички й з’ясовує, чому кажемо bilen min, але min bil.|Nora makes shop signs and discovers why Norwegian says bilen min but min bil.',
      vocab:['et skilt|табличка|a sign','en form|форма|a form','ubestemt form|неозначена форма|indefinite form','etter substantivet|після іменника|after the noun','før substantivet|перед іменником|before the noun','bilen min|моя машина|my car','min bil|моя машина з наголосом|MY car','huset vårt|наш будинок|our house'],
      scenes:[
        ['TO MØNSTRE','Nora skriver både «sykkelen min» og «min sykkel».|Нора пише і «sykkelen min», і «min sykkel».|Nora writes both “sykkelen min” and “min sykkel”.','Begge er riktige, men substantivets form er forskjellig.|Обидва варіанти правильні, але форма іменника різна.|Both are correct, but the noun form differs.'],
        ['ETTER','Når eiendomsordet står etter, bruker vi bestemt form.|Коли присвійне слово стоїть після іменника, вживаємо означену форму.|When the possessive follows, we use the definite form.','Derfor sier vi «bilen min».|Тому кажемо «bilen min».|That is why we say “bilen min”.'],
        ['FØR','Når eiendomsordet står først, bruker vi ubestemt form.|Коли присвійне слово стоїть першим, уживаємо неозначену форму.|When the possessive comes first, we use the indefinite form.','Derfor sier vi «min bil».|Тому кажемо «min bil».|That is why we say “min bil”.'],
        ['VANLIG','Etterstilling er svært vanlig: boka di, huset vårt.|Позиція після іменника дуже поширена: boka di, huset vårt.|Post-position is very common: boka di, huset vårt.','Førstilling kan gi ekstra trykk: Det er min kopp!|Позиція перед іменником може додавати наголос: Це моя чашка!|Front position can add emphasis: It is my cup!'],
        ['RETT SKILT','Nora retter «bil min» til «bilen min».|Нора виправляє «bil min» на «bilen min».|Nora corrects “bil min” to “bilen min”.','Hun retter «min bilen» til «min bil».|Вона виправляє «min bilen» на «min bil».|She corrects “min bilen” to “min bil”.'],
        ['FERDIG','Skiltene blir både riktige og tydelige.|Таблички стають правильними й зрозумілими.|The signs become both correct and clear.','Plassen til eiendomsordet bestemmer substantivformen.|Місце присвійного слова визначає форму іменника.|The position of the possessive determines the noun form.']
      ],
      tasks:[
        ['Hvilket uttrykk er riktig?|Який вираз правильний?|Which phrase is correct?','bilen min|моя машина|bilen min','bil min|моя машина|bil min','min bilen|моя машина|min bilen','bilen mitt|моя машина|bilen mitt'],
        ['Hva står etter possessivet i «min bil»?|Що стоїть після присвійного слова в «min bil»?|What follows the possessive in “min bil”?','Ubestemt form|Неозначена форма|Indefinite form','Bestemt form|Означена форма|Definite form','Et verb|Дієслово|A verb','Alltid flertall|Завжди множина|Always plural'],
        ['Hvilket uttrykk er riktig?|Який вираз правильний?|Which phrase is correct?','huset vårt|наш будинок|huset vårt','hus vårt|наш будинок|hus vårt','vårt huset|наш будинок|vårt huset','huset våre|наш будинок|huset våre'],
        ['Når kan «min bil» få ekstra trykk?|Коли «min bil» може мати додатковий наголос?|When can “min bil” add emphasis?','Når vi understreker hvem som eier bilen|Коли підкреслюємо власника машини|When stressing who owns the car','Når vi spør om været|Коли питаємо про погоду|When asking about weather','Bare i flertall|Лише в множині|Only in plural','Aldri|Ніколи|Never']
      ]
    },
    {
      id:'p297', level:'A2', category:'kultur', term:'hvem sin?|чий?|whose?',
      title:'Loppemarkedets eierdetektiver|Детективи власників на барахолці|The flea-market ownership detectives',
      summary:'På et loppemarked bruker barna alle eiendomsordene for å finne hvem tingene tilhører.|На барахолці діти використовують усі присвійні слова, щоб визначити, кому належать речі.|At a flea market, the children use all the possessives to work out who the items belong to.',
      vocab:['et loppemarked|барахолка|a flea market','hvem sin?|чий?|whose?','en merkelapp|ярлик|a label','en kurv|кошик|a basket','en bamse|плюшевий ведмедик|a teddy bear','kurven vår|наш кошик|our basket','bamsen hennes|її ведмедик|her teddy bear','bøkene deres|їхні книжки|their books'],
      scenes:[
        ['UTEN LAPP','Noen merkelapper faller av på loppemarkedet.|На барахолці з кількох речей відпадають ярлики.|Some labels fall off at the flea market.','Barna blir eierdetektiver.|Діти стають детективами власників.|The children become ownership detectives.'],
        ['MIN ELLER DIN','Leo spør: «Er dette koppen din?»|Лео питає: «Це твоя чашка?»|Leo asks: “Is this your cup?”','Nora svarer: «Nei, koppen min er gul.»|Нора відповідає: «Ні, моя чашка жовта».|Nora replies: “No, my cup is yellow.”'],
        ['VÅR','Kurven til hele klassen er kurven vår.|Кошик усього класу — наш кошик.|The whole class’s basket is kurven vår.','Flere eiere kan si vår, vårt eller våre.|Кілька власників можуть сказати vår, vårt або våre.|Several owners can say vår, vårt or våre.'],
        ['HENNES','Mia kjenner igjen bamsen til Nora.|Мія впізнає ведмедика Нори.|Mia recognises Nora’s teddy bear.','«Det er bamsen hennes», sier hun.|«Det er bamsen hennes», — каже вона.|“Det er bamsen hennes,” she says.'],
        ['DERES','To søsken eier en kasse med bøker.|Двоє братів і сестер мають коробку книжок.|Two siblings own a box of books.','Det er bøkene deres.|Це їхні книжки.|They are bøkene deres.'],
        ['ALLE FUNNET','Hver ting får en ny og tydelig merkelapp.|Кожна річ отримує новий чіткий ярлик.|Each item gets a new, clear label.','Spør «hvem eier?» og «hva slags substantiv?»|Запитай: «хто власник?» і «який це іменник?»|Ask “who owns it?” and “what kind of noun is it?”']
      ],
      tasks:[
        ['Nora snakker til Leo: «Er dette koppen __?»|Нора питає Лео: «Це твоя чашка?»|Nora asks Leo: “Is this __ cup?”','din|твоя|din','min|моя|min','hennes|її|hennes','vår|наша|vår'],
        ['Klassen eier en kurv. Det er kurven __.|Клас має кошик. Це наш кошик.|The class owns a basket. It is __ basket.','vår|наш|vår','mitt|мій|mitt','hennes|її|hennes','deres|їхній|deres'],
        ['Bamsen til Nora er bamsen __.|Ведмедик Нори — її ведмедик.|Nora’s teddy bear is __ teddy bear.','hennes|її|hennes','hans|його|hans','sitt|свій|sitt','dine|твої|dine'],
        ['Bøkene til søsknene er bøkene __.|Книжки брата й сестри — їхні книжки.|The siblings’ books are __ books.','deres|їхні|deres','hennes|її|hennes','hans|його|hans','vårt|наше|vårt']
      ]
    },
    {
      id:'p298', level:'B1', category:'bolig', term:'eiendomsord i sammenheng|присвійні слова в контексті|possessives in context',
      title:'Flyttedagen: Hvem sin er den?|День переїзду: чия це річ?|Moving day: whose is it?',
      summary:'Under en travel flytting må familien bruke både samsvar, ordstilling og sin/hans riktig for å unngå forvekslinger.|Під час метушливого переїзду родина правильно використовує узгодження, порядок слів і sin/hans, щоб нічого не переплутати.|During a busy move, the family must use agreement, word order and sin/hans correctly to avoid mix-ups.',
      vocab:['en flyttedag|день переїзду|moving day','en eske|коробка|a box','et møbel|меблі|a piece of furniture','å blande|плутати|to mix up','en navnelapp|іменний ярлик|a name label','eska mi|моя коробка|my box','møbelet vårt|наші меблі|our piece of furniture','rommet sitt|своя кімната|one’s own room'],
      scenes:[
        ['MANGE ESKER','Flyttebilen er full av esker uten romnavn.|Вантажівка повна коробок без назв кімнат.|The moving van is full of boxes without room names.','Familien må beskrive både eier og sted presist.|Родина має точно описати власника й місце.|The family must describe both owner and place precisely.'],
        ['SAMSVAR','Mia sier «eska mi», men «bordet mitt».|Мія каже «eska mi», але «bordet mitt».|Mia says “eska mi” but “bordet mitt”.','Formen følger tingen, ikke personen Mia.|Форма залежить від речі, а не від Мії.|The form follows the item, not Mia.'],
        ['FELLES','Foreldrene peker på møbelet vårt og stolene våre.|Батьки вказують на наш предмет меблів і наші стільці.|The parents point to møbelet vårt and stolene våre.','Vårt er intetkjønn; våre er flertall.|Vårt — середній рід, våre — множина.|Vårt is neuter; våre is plural.'],
        ['SIN EGEN','Leo bærer senga si til rommet sitt.|Лео несе своє ліжко до своєї кімнати.|Leo carries his own bed to his own room.','Si og sitt viser tilbake til subjektet Leo.|Si і sitt вказують назад на підмет Лео.|Si and sitt point back to the subject Leo.'],
        ['HANS','Mia bærer senga hans til Leo.|Мія несе його ліжко Лео.|Mia carries his bed to Leo.','Hans viser til Leo, ikke til subjektet Mia.|Hans вказує на Лео, а не на підмет Мію.|Hans refers to Leo, not the subject Mia.'],
        ['RYDDIG HJEM','Navnelapper og presise setninger løser forvirringen.|Ярлики й точні речення усувають плутанину.|Labels and precise sentences solve the confusion.','Familien kan nå forklare hvem som eier hva.|Тепер родина може пояснити, кому що належить.|The family can now explain who owns what.']
      ],
      tasks:[
        ['Mia snakker om ei eske: «Dette er eska __.»|Мія говорить про коробку: «Це моя коробка».|Mia speaks about a box: “This is __ box.”','mi|моя|mi','mitt|моє|mitt','mine|мої|mine','meg|мене|meg'],
        ['Familien eier et møbel. Det er møbelet __.|Родина має предмет меблів. Це наш предмет.|The family owns a piece of furniture. It is __ piece.','vårt|наш|vårt','vår|наша|vår','våre|наші|våre','oss|нас|oss'],
        ['Leo bærer sin egen seng. Leo bærer senga __.|Лео несе своє ліжко.|Leo carries his own bed. Leo carries __ bed.','si|своє|si','hans|його|hans','hennes|її|hennes','sitt|своє|sitt'],
        ['Mia bærer Leos seng. Mia bærer senga __.|Мія несе ліжко Лео.|Mia carries Leo’s bed. Mia carries __ bed.','hans|його|hans','si|своє|si','sitt|своє|sitt','sin|свій|sin']
      ]
    }
  ];

  const makeLine = (who, value) => { const [no, uk, en] = tri(value); return { who, no, uk, en }; };
  const props = ['docs','phone','codecard','browser','docs','datashield'];
  for (const spec of specs) {
    const [title,titleUk,titleEn] = tri(spec.title);
    const [summaryNo,summaryUk,summaryEn] = tri(spec.summary);
    const panels = spec.scenes.map((scene, index) => ({
      art:{ bg:index % 2 ? 'home' : 'office', board:index === 0 ? title : undefined,
        code:[scene[0], index + 1], chars:[{id:index % 2 ? 'nora':'leo',x:75,mood:index === 0 ? 'surprised':'normal',pose:'point',s:.82},{id:index % 2 ? 'morten':'mia',x:325,mood:'happy',pose:'hold',s:.82,flip:true}],
        props:[{type:props[index],x:200,y:278,text:scene[0],label:scene[0]}] },
      lines:[makeLine(index % 2 ? 'nora':'leo',scene[1]),makeLine(index % 2 ? 'morten':'mia',scene[2])]
    }));
    const tasks = spec.tasks.map(task => ({ type:'concept', q:tri(task[0]), answer:tri(task[1]), wrong:task.slice(2).map(tri) }));
    const vocab = [...common, ...spec.vocab].map(tri);
    const words = { no:{}, en:{} }; for (const [no,uk,en] of vocab) { words.no[no]=uk; words.en[no]=en; }
    COMICS.push({ id:spec.id, level:spec.level, category:spec.category, term:tri(spec.term)[0], cover:4,
      title,titleUk,titleEn,summaryNo,summaryUk,summaryEn,panels,tasks,vocab,words,
      sources:[{ title:source[0], url:source[1] }] });
  }
})();
