window.COMICS = window.COMICS || [];

/* Original A2 mini-series inspired by common Norwegian-course themes: finding
   housing, shopping and managing a busy morning. The plots and questions are
   new; only the language targets are shared with the photographed worksheet. */
(() => {
  const tri = value => value.split('|');
  const line = (who, value) => { const [no, uk, en] = tri(value); return { who, no, uk, en }; };
  const common = [
    'en hverdag|будні|an everyday routine','å planlegge|планувати|to plan','å sammenligne|порівнювати|to compare',
    'å bestemme seg|вирішувати|to decide','et budsjett|бюджет|a budget','en pris|ціна|a price',
    'en avtale|домовленість|an appointment','å rekke|встигати|to make it in time','heldigvis|на щастя|fortunately',
    'likevel|проте|nevertheless'
  ];
  const specs = [
    {
      id:'p299', category:'bolig', term:'bolig, inntekt og budsjett|житло, дохід і бюджет|housing, income and a budget',
      title:'Visningen ved elva|Перегляд біля річки|The viewing by the river',
      summary:'Nora og Leo hjelper tante Liv med å vurdere en ledig leilighet uten å glemme inntekt, sparing og oppussing.|Нора й Лео допомагають тітці Лів оцінити вільну квартиру, враховуючи дохід, заощадження та ремонт.|Nora and Leo help Aunt Liv assess an available flat while keeping income, savings and renovation in mind.',
      vocab:['ei inntekt|дохід|an income','å spare|заощаджувати|to save','å trives|добре почуватися|to feel at home','å leie|орендувати|to rent','å eie|володіти|to own','moderne|сучасний|modern','å pusse opp|ремонтувати|to renovate','å ha råd til|мати змогу оплатити|to be able to afford'],
      scenes:[
        ['ET NYTT HJEM','Tante Liv trives i området ved elva, men leiligheten hennes er blitt for liten.|Тітці Лів подобається район біля річки, але її квартира стала замалою.|Aunt Liv feels at home by the river, but her flat has become too small.','Nora finner en annonse for en ledig leilighet i samme område.|Нора знаходить оголошення про вільну квартиру в тому самому районі.|Nora finds an advert for an available flat in the same area.'],
        ['PÅ VISNING','Kjøkkenet er moderne, og stua har store vinduer.|Кухня сучасна, а у вітальні великі вікна.|The kitchen is modern and the living room has large windows.','Soverommet må pusses opp, men Leo sier at de kan male sammen.|Спальню треба відремонтувати, але Лео каже, що вони можуть фарбувати разом.|The bedroom needs renovating, but Leo says they can paint together.'],
        ['LEIE ELLER EIE','Liv vil gjerne eie en bolig en dag, men nå må hun leie.|Лів хотіла б колись мати власне житло, але зараз мусить орендувати.|Liv would like to own a home one day, but for now she has to rent.','Hun spør hva husleia er, og om strøm er inkludert.|Вона питає про орендну плату й чи включена електрика.|She asks about the rent and whether electricity is included.'],
        ['REGNE FØRST','Liv har fast inntekt, men hun vil vite om hun har råd til leiligheten.|У Лів стабільний дохід, але вона хоче знати, чи може дозволити собі квартиру.|Liv has a steady income, but she wants to know whether she can afford the flat.','De skriver husleie, strøm, mat og buss inn i et budsjett.|Вони записують оренду, електрику, їжу та автобус у бюджет.|They add rent, electricity, food and the bus to a budget.'],
        ['EN GOD PLAN','Budsjettet viser at Liv kan spare litt hver måned.|Бюджет показує, що Лів може щомісяця трохи заощаджувати.|The budget shows that Liv can save a little every month.','Likevel vil hun sove på det før hun bestemmer seg.|Проте вона хоче переспати з думкою, перш ніж вирішити.|Nevertheless, she wants to sleep on it before deciding.'],
        ['JA MED OVERSIKT','Neste dag takker Liv ja til leiligheten og beholder spareplanen.|Наступного дня Лів погоджується на квартиру й зберігає план заощаджень.|The next day Liv accepts the flat and keeps her savings plan.','Hun valgte med både hjertet og budsjettet.|Вона обрала і серцем, і з огляду на бюджет.|She chose with both her heart and her budget.']
      ],
      tasks:[
        ['Hvorfor ser Liv etter en ny bolig?|Чому Лів шукає нове житло?|Why is Liv looking for a new home?','Leiligheten hennes er blitt for liten.|Її квартира стала замалою.|Her flat has become too small.','Hun liker ikke området.|Їй не подобається район.|She dislikes the area.','Hun har mistet jobben.|Вона втратила роботу.|She has lost her job.','Hun vil bo på hotell.|Вона хоче жити в готелі.|She wants to live in a hotel.'],
        ['Hva må gjøres med soverommet?|Що треба зробити зі спальнею?|What needs to be done to the bedroom?','Det må pusses opp.|Його треба відремонтувати.|It needs renovating.','Det må selges.|Його треба продати.|It must be sold.','Det må låses.|Його треба замкнути.|It must be locked.','Det må flyttes.|Його треба пересунути.|It must be moved.'],
        ['Hva vil Liv gjerne gjøre en dag?|Що Лів хотіла б зробити колись?|What would Liv like to do one day?','Eie en bolig.|Мати власне житло.|Own a home.','Kjøpe en buss.|Купити автобус.|Buy a bus.','Bytte jobb hver måned.|Щомісяця змінювати роботу.|Change jobs every month.','Bo uten kjøkken.|Жити без кухні.|Live without a kitchen.'],
        ['Hvorfor lager de et budsjett?|Навіщо вони складають бюджет?|Why do they make a budget?','For å se om Liv har råd til leiligheten.|Щоб перевірити, чи Лів може дозволити собі квартиру.|To see whether Liv can afford the flat.','For å velge veggfarge.|Щоб обрати колір стін.|To choose a wall colour.','For å finne en ny jobb.|Щоб знайти нову роботу.|To find a new job.','For å måle vinduet.|Щоб виміряти вікно.|To measure the window.'],
        ['Hva betyr «ledig» i annonsen?|Що означає «ledig» в оголошенні?|What does “ledig” mean in the advert?','Leiligheten er tilgjengelig.|Квартира доступна.|The flat is available.','Leiligheten er gratis.|Квартира безкоштовна.|The flat is free of charge.','Leiligheten er mørk.|Квартира темна.|The flat is dark.','Leiligheten er solgt.|Квартира продана.|The flat is sold.'],
        ['Hva viser budsjettet?|Що показує бюджет?|What does the budget show?','Liv kan spare litt hver måned.|Лів може трохи заощаджувати щомісяця.|Liv can save a little every month.','Liv må flytte samme kveld.|Лів мусить переїхати того ж вечора.|Liv must move that evening.','Strømmen er gratis.|Електрика безкоштовна.|Electricity is free.','Leo skal betale alt.|Лео заплатить за все.|Leo will pay for everything.'],
        ['Hvilket uttrykk betyr «to be able to afford»?|Який вираз означає «мати змогу оплатити»?|Which expression means “to be able to afford”?','å ha råd til|мати змогу оплатити|to be able to afford','å trives|добре почуватися|to feel at home','å pusse opp|ремонтувати|to renovate','å leie|орендувати|to rent'],
        ['Hvorfor venter Liv til neste dag?|Чому Лів чекає до наступного дня?|Why does Liv wait until the next day?','Hun vil tenke før hun bestemmer seg.|Вона хоче подумати перед рішенням.|She wants to think before deciding.','Hun har glemt adressen.|Вона забула адресу.|She has forgotten the address.','Kjøkkenet er stengt.|Кухня зачинена.|The kitchen is closed.','Nora vil kjøpe leiligheten.|Нора хоче купити квартиру.|Nora wants to buy the flat.']
      ]
    },
    {
      id:'p300', category:'butikk', term:'butikk, størrelser og tilbud|магазин, розміри й знижки|shopping, sizes and offers',
      title:'Jakka til fjellturen|Куртка для походу|The jacket for the hike',
      summary:'Mia sammenligner størrelser og priser før skoleturen, mens Amir lærer hvorfor et tilbud ikke alltid er det beste valget.|Мія порівнює розміри й ціни перед шкільним походом, а Амір дізнається, чому знижка не завжди є найкращим вибором.|Mia compares sizes and prices before a school hike, while Amir learns why an offer is not always the best choice.',
      vocab:['et prøverom|примірочна|a fitting room','å kikke|дивитися|to have a look','en størrelse|розмір|a size','et tilbud|акційна пропозиція|an offer','å handle|робити покупки|to shop','å betale|платити|to pay','å spandere|пригощати|to treat someone','en kvittering|чек|a receipt'],
      scenes:[
        ['FØR FJELLTUREN','Mia trenger ei lett regnjakke til klassens fjelltur.|Мії потрібна легка дощова куртка для походу з класом.|Mia needs a light rain jacket for the class hike.','Amir blir med for å kikke og sammenligne priser.|Амір іде з нею подивитися й порівняти ціни.|Amir joins her to look around and compare prices.'],
        ['TRE STØRRELSER','Den ansatte viser jakka i tre størrelser.|Працівниця показує куртку у трьох розмірах.|The shop assistant shows the jacket in three sizes.','Mia tar med to av dem inn i prøverommet.|Мія бере два з них до примірочної.|Mia takes two of them into the fitting room.'],
        ['GOD PASSFORM','Den billigste jakka er for trang over skuldrene.|Найдешевша куртка затісна в плечах.|The cheapest jacket is too tight across the shoulders.','En annen størrelse passer og har plass til en varm genser.|Інший розмір підходить і має місце для теплого светра.|Another size fits and has room for a warm jumper.'],
        ['ET EKTE TILBUD','Butikken har tjue prosent tilbud på jakka som passer.|У магазині двадцятивідсоткова знижка на куртку, яка підходить.|The shop has a twenty percent offer on the jacket that fits.','Mia sjekker likevel pris og kvalitet før hun bestemmer seg.|Проте Мія перевіряє ціну та якість перед рішенням.|Nevertheless, Mia checks the price and quality before deciding.'],
        ['VED KASSA','Mia betaler med kort og legger kvitteringen i sekken.|Мія платить карткою й кладе чек у рюкзак.|Mia pays by card and puts the receipt in her backpack.','Hun vet at kvitteringen trengs hvis jakka må byttes.|Вона знає, що чек потрібен, якщо куртку доведеться обміняти.|She knows the receipt is needed if the jacket must be exchanged.'],
        ['EN LITEN PAUSE','Etter at de har handlet, spanderer Amir kakao.|Після покупок Амір пригощає какао.|After they have shopped, Amir treats them to cocoa.','Mia har kjøpt det hun trenger, ikke bare det som var billigst.|Мія купила те, що їй потрібно, а не просто найдешевше.|Mia has bought what she needs, rather than merely the cheapest item.']
      ],
      tasks:[
        ['Hva trenger Mia til fjellturen?|Що потрібно Мії для походу?|What does Mia need for the hike?','Ei lett regnjakke.|Легку дощову куртку.|A light rain jacket.','Et par ski.|Пару лиж.|A pair of skis.','En koffert.|Валізу.|A suitcase.','En skolebok.|Шкільну книжку.|A schoolbook.'],
        ['Hvorfor går Amir til butikken?|Чому Амір іде до магазину?|Why does Amir go to the shop?','For å hjelpe med å kikke og sammenligne.|Щоб допомогти подивитися й порівняти.|To help look around and compare.','For å jobbe i kassa.|Щоб працювати на касі.|To work at the till.','For å pusse opp butikken.|Щоб ремонтувати магазин.|To renovate the shop.','For å hente en buss.|Щоб забрати автобус.|To collect a bus.'],
        ['Hvor prøver Mia jakkene?|Де Мія приміряє куртки?|Where does Mia try on the jackets?','I prøverommet.|У примірочній.|In the fitting room.','På kaféen.|У кафе.|At the café.','På fjellet.|У горах.|On the mountain.','Ved bussholdeplassen.|На автобусній зупинці.|At the bus stop.'],
        ['Hvorfor velger hun ikke den billigste jakka?|Чому вона не обирає найдешевшу куртку?|Why does she not choose the cheapest jacket?','Den er for trang over skuldrene.|Вона затісна в плечах.|It is too tight across the shoulders.','Den er ikke på tilbud.|На неї немає знижки.|It is not on offer.','Den har ingen pris.|На ній немає ціни.|It has no price.','Amir vil ha den.|Амір хоче її.|Amir wants it.'],
        ['Hvor stort er tilbudet?|Яка величина знижки?|How large is the offer?','Tjue prosent.|Двадцять відсотків.|Twenty percent.','Fem prosent.|П’ять відсотків.|Five percent.','Halv pris på alt.|Пів ціни на все.|Half price on everything.','Ingen rabatt.|Без знижки.|No discount.'],
        ['Hvorfor tar Mia vare på kvitteringen?|Чому Мія зберігає чек?|Why does Mia keep the receipt?','Hun kan trenge den ved bytte.|Він може знадобитися для обміну.|She may need it for an exchange.','Den viser bussruten.|Він показує маршрут автобуса.|It shows the bus route.','Den er en billett til fjellet.|Це квиток у гори.|It is a ticket to the mountain.','Amir skal lese den høyt.|Амір прочитає його вголос.|Amir will read it aloud.'],
        ['Hva betyr «å spandere»?|Що означає «å spandere»?|What does “å spandere” mean?','Å betale noe for en annen.|Заплатити за когось.|To pay for something for another person.','Å prøve klær.|Приміряти одяг.|To try on clothes.','Å spare hver måned.|Заощаджувати щомісяця.|To save each month.','Å eie en butikk.|Володіти магазином.|To own a shop.'],
        ['Hva lærer Mia av handelen?|Чого Мія навчається під час покупки?|What does Mia learn from the shopping trip?','Passform og behov er viktigere enn lavest pris.|Посадка й потреба важливіші за найнижчу ціну.|Fit and need matter more than the lowest price.','Det dyreste er alltid best.|Найдорожче завжди найкраще.|The most expensive is always best.','Man trenger aldri kvittering.|Чек ніколи не потрібен.|You never need a receipt.','Alle størrelser er like.|Усі розміри однакові.|All sizes are the same.']
      ]
    },
    {
      id:'p301', category:'hverdag', term:'tid, avtaler og å finne ting|час, домовленості й пошук речей|time, appointments and finding things',
      title:'Morgenen som løp av gårde|Ранок, що помчав|The morning that ran away',
      summary:'Leo forsover seg før en travel skoledag og lærer å prioritere, be om hjelp og lete systematisk.|Лео просипає перед насиченим шкільним днем і вчиться визначати пріоритети, просити допомоги та шукати системно.|Leo oversleeps before a busy school day and learns to prioritise, ask for help and search systematically.',
      vocab:['å forsove seg|проспати|to oversleep','å hente|забирати|to collect','for sent|запізно|too late','å lete etter|шукати|to look for','å finne|знаходити|to find','opptatt|зайнятий|busy','ledig|вільний|available','en alarm|будильник|an alarm'],
      scenes:[
        ['ALARMEN TIER','Leo forsover seg fordi mobilen gikk tom for strøm om natta.|Лео просипає, бо телефон розрядився вночі.|Leo oversleeps because his phone ran out of power overnight.','Han må rekke skolen og hente lillesøsteren etter timen.|Йому треба встигнути до школи й забрати молодшу сестру після уроку.|He must make it to school and collect his little sister after class.'],
        ['FINN DET VIKTIGE','Leo leter etter busskortet, men finner bare en gammel billett.|Лео шукає проїзний, але знаходить лише старий квиток.|Leo looks for his travel card but only finds an old ticket.','Nora sier: «Sjekk ett sted om gangen.»|Нора каже: «Перевіряй по одному місцю».|Nora says, “Check one place at a time.”'],
        ['EN TYDELIG PLAN','De ser i jakkelomma, på skrivebordet og til slutt i sekken.|Вони перевіряють кишеню куртки, письмовий стіл і нарешті рюкзак.|They check the jacket pocket, the desk and finally the backpack.','Der finner Leo kortet ved siden av matboksen.|Там Лео знаходить картку біля ланчбокса.|There Leo finds the card next to his lunchbox.'],
        ['GI BESKJED','Leo blir for sent ute til den første bussen.|Лео запізнюється на перший автобус.|Leo is too late for the first bus.','Han sender læreren en kort melding i stedet for å late som ingenting.|Він надсилає вчителю коротке повідомлення замість удавати, що нічого не сталося.|He sends the teacher a short message instead of pretending nothing happened.'],
        ['HVEM KAN HJELPE?','Etter skolen er Nora opptatt, men bestefar er ledig.|Після школи Нора зайнята, але дідусь вільний.|After school Nora is busy, but Grandpa is available.','Bestefar kan hente lillesøsteren hvis Leo ikke rekker det.|Дідусь може забрати молодшу сестру, якщо Лео не встигне.|Grandpa can collect the little sister if Leo cannot make it.'],
        ['BEDRE I MORGEN','Leo kommer fram og holder begge avtalene med litt hjelp.|Лео дістається куди треба й виконує обидві домовленості з невеликою допомогою.|Leo arrives and keeps both appointments with a little help.','Om kvelden lader han mobilen og setter en ekstra alarmklokke.|Увечері він заряджає телефон і ставить додатковий будильник.|In the evening he charges the phone and sets an extra alarm clock.']
      ],
      tasks:[
        ['Hvorfor forsover Leo seg?|Чому Лео просипає?|Why does Leo oversleep?','Mobilen gikk tom for strøm.|Телефон розрядився.|His phone ran out of power.','Bussen kom for tidlig.|Автобус приїхав зарано.|The bus came too early.','Skolen er stengt.|Школа зачинена.|The school is closed.','Nora tok alarmen.|Нора забрала будильник.|Nora took the alarm.'],
        ['Hva leter Leo etter?|Що шукає Лео?|What is Leo looking for?','Busskortet.|Проїзний.|His travel card.','En regnjakke.|Дощову куртку.|A rain jacket.','En leilighet.|Квартиру.|A flat.','En kvittering.|Чек.|A receipt.'],
        ['Hvilket råd gir Nora?|Яку пораду дає Нора?|What advice does Nora give?','Sjekk ett sted om gangen.|Перевіряй по одному місцю.|Check one place at a time.','Kjøp et nytt kort med en gang.|Одразу купи нову картку.|Buy a new card immediately.','Ring alle i klassen.|Подзвони всім у класі.|Call everyone in the class.','Vent til i morgen.|Чекай до завтра.|Wait until tomorrow.'],
        ['Hvor finner Leo kortet?|Де Лео знаходить картку?|Where does Leo find the card?','I sekken ved matboksen.|У рюкзаку біля ланчбокса.|In the backpack next to the lunchbox.','I prøverommet.|У примірочній.|In the fitting room.','På bussen.|В автобусі.|On the bus.','Under senga til Nora.|Під ліжком Нори.|Under Nora’s bed.'],
        ['Hva gjør Leo når han blir forsinket?|Що робить Лео, коли запізнюється?|What does Leo do when he is delayed?','Han sender læreren en melding.|Він надсилає вчителю повідомлення.|He sends the teacher a message.','Han går tilbake til sengs.|Він повертається в ліжко.|He goes back to bed.','Han slår av mobilen.|Він вимикає телефон.|He turns off the phone.','Han avlyser skolen.|Він скасовує школу.|He cancels school.'],
        ['Hvem er ledig etter skolen?|Хто вільний після школи?|Who is available after school?','Bestefar.|Дідусь.|Grandpa.','Nora.|Нора.|Nora.','Læreren.|Учитель.|The teacher.','Bussjåføren.|Водій автобуса.|The bus driver.'],
        ['Hva betyr «opptatt» her?|Що тут означає «opptatt»?|What does “opptatt” mean here?','Ikke ledig.|Не вільний.|Not available.','Billig.|Дешевий.|Cheap.','Moderne.|Сучасний.|Modern.','Forsinket buss.|Запізнілий автобус.|A delayed bus.'],
        ['Hvordan forebygger Leo samme problem?|Як Лео запобігає такій самій проблемі?|How does Leo prevent the same problem?','Han lader mobilen og setter en ekstra alarm.|Він заряджає телефон і ставить додатковий будильник.|He charges the phone and sets an extra alarm.','Han kjøper ny sekk hver dag.|Він щодня купує новий рюкзак.|He buys a new backpack every day.','Han slutter å ta bussen.|Він перестає їздити автобусом.|He stops taking the bus.','Han legger kortet i prøverommet.|Він кладе картку в примірочній.|He puts the card in the fitting room.']
      ]
    }
  ];

  const props = ['phone','browser','docs','codecard','phone','docs'];
  for (const spec of specs) {
    const [title,titleUk,titleEn] = tri(spec.title);
    const [summaryNo,summaryUk,summaryEn] = tri(spec.summary);
    const panels = spec.scenes.map((scene, index) => ({
      art:{ bg:index % 3 === 0 ? 'home' : index % 3 === 1 ? 'shop' : 'street', board:index === 0 ? title : undefined,
        code:[scene[0], index + 1], chars:[{id:index % 2 ? 'nora':'leo',x:78,mood:index === 0 ? 'surprised':'normal',pose:index % 2 ? 'point':'hold',s:.82},{id:index % 2 ? 'mia':'morten',x:325,mood:index === 4 ? 'surprised':'happy',pose:'wave',s:.82,flip:true}],
        props:[{type:props[index],x:200,y:278,text:scene[0],label:scene[0]}] },
      lines:[line(index % 2 ? 'nora':'leo',scene[1]),line(index % 2 ? 'mia':'morten',scene[2])]
    }));
    const tasks = spec.tasks.map(task => ({ type:'concept', q:tri(task[0]), answer:tri(task[1]), wrong:task.slice(2).map(tri) }));
    const vocab = [...common, ...spec.vocab].map(tri);
    const words = { no:{}, en:{} };
    for (const [no,uk,en] of vocab) { words.no[no] = uk; words.en[no] = en; }
    COMICS.push({ id:spec.id, level:'A2', category:spec.category, term:tri(spec.term)[0], cover:4,
      title,titleUk,titleEn,summaryNo,summaryUk,summaryEn,panels,tasks,vocab,words,
      sources:[{title:'NTNU LearnNoW — derfor, likevel og for å',url:'https://www.ntnu.edu/learnnow2-hs/8/grammatikk/'}] });
  }
})();
