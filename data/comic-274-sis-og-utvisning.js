window.COMICS = window.COMICS || [];

/* p274 — B1: neutral civic information about SIS, return decisions and expulsion.
   The story explains terms and rights without replacing individual legal advice.
   Facts checked against UDI, Politiet and the European Commission, 2026-10-26. */
(() => {
  const vocab = [
    ['Schengen informasjonssystem (SIS)', 'Шенгенська інформаційна система (SIS)', 'the Schengen Information System (SIS)'],
    ['et register', 'реєстр', 'a register'],
    ['et vedtak', 'офіційне рішення', 'an official decision'],
    ['en utreiseplikt', 'обов’язок виїхати', 'an obligation to leave'],
    ['en utreisefrist', 'строк для виїзду', 'a deadline for departure'],
    ['en bortvisning', 'відмова у в’їзді або перебуванні', 'a refusal of entry or stay'],
    ['en utvisning', 'видворення із забороною на в’їзд', 'an expulsion with an entry ban'],
    ['et innreiseforbud', 'заборона на в’їзд', 'an entry ban'],
    ['en uttransportering', 'примусове вивезення поліцією', 'a removal carried out by the police'],
    ['å registrere utreisen', 'зареєструвати виїзд', 'to register the departure'],
    ['en grensekontroll', 'прикордонний контроль', 'border control'],
    ['et reisedokument', 'проїзний документ', 'a travel document'],
    ['en dokumentasjon', 'підтверджувальні документи', 'documentation'],
    ['et innsyn', 'доступ до власних даних', 'access to one’s data'],
    ['å rette', 'виправляти', 'to correct'],
    ['å slette', 'видаляти', 'to delete'],
    ['å klage', 'оскаржувати', 'to appeal'],
    ['en klagefrist', 'строк оскарження', 'an appeal deadline'],
    ['en advokat', 'адвокат', 'a lawyer'],
    ['en tolk', 'перекладач', 'an interpreter'],
    ['en myndighet', 'орган влади', 'an authority'],
    ['individuell', 'індивідуальний', 'individual']
  ];
  const words = { no:{}, en:{} };
  for (const [no, uk, en] of vocab) { words.no[no] = uk; words.en[no] = en; }
  const task = (q, answer, wrong) => ({ type:'concept', q, answer, wrong });

  COMICS.push({
    id:'p274', level:'B1', category:'kultur', cover:4,
    title:'SIS, utvisning og veien videre',
    titleUk:'SIS, депортація та наступні кроки',
    titleEn:'SIS, expulsion and what to do next',
    summaryNo:'Alina får et vanskelig brev. Sammen med rådgiver Morten lærer hun hva SIS, utreiseplikt, utvisning og innreiseforbud betyr, og hvilke rettigheter hun har.',
    summaryUk:'Аліна отримує складний лист. Разом із консультантом Мортеном вона з’ясовує, що означають SIS, обов’язок виїхати, видворення та заборона на в’їзд і які права має людина.',
    summaryEn:'Alina receives a difficult letter. With adviser Morten, she learns what SIS, an obligation to leave, expulsion and an entry ban mean, and what rights a person has.',
    sources:[
      { title:'UDI — Schengen informasjonssystem (SIS)', url:'https://www.udi.no/ord-og-begreper/schengen-informasjonssystem-sis/' },
      { title:'UDI — Utvisning og oppheving av innreiseforbud', url:'https://www.udi.no/har-fatt-svar/har-blitt-utvist/' },
      { title:'Politiet — Innsyn i Schengen informasjonssystem', url:'https://www.politiet.no/en/kontakt-politiet/innsyn-og-offentleg-journal/innsyn-i-schengen-informasjonssystem' },
      { title:'European Commission — SIS questions and answers', url:'https://home-affairs.ec.europa.eu/policies/schengen/schengen-information-system/questions-and-answers_en' }
    ],
    panels:[
      { art:{ bg:'office', sign:'VEDTAK', chars:[{id:'alina',x:105,mood:'sad',pose:'hold',s:.88},{id:'morten',x:300,mood:'normal',pose:'point',s:.88,flip:true}], props:[{type:'docs',x:170,y:230}] }, lines:[
        { who:'alina', no:'Jeg har fått et vedtak med ordene «utreiseplikt» og «SIS». Betyr det at jeg er dømt for noe?', uk:'Я отримала рішення зі словами «обов’язок виїхати» та «SIS». Це означає, що мене за щось засудили?', en:'I received a decision containing the words “obligation to leave” and “SIS”. Does that mean I was convicted of something?' },
        { who:'morten', no:'Nei. SIS er et digitalt register som Schengen-landenes myndigheter bruker. Les først nøyaktig hvilket vedtak du har fått.', uk:'Ні. SIS — це цифровий реєстр, яким користуються органи країн Шенгену. Спочатку уважно прочитай, яке саме рішення ти отримала.', en:'No. SIS is a digital register used by the authorities of Schengen countries. First read exactly which decision you have received.' }
      ]},
      { art:{ bg:'lab', code:['SIS','utreiseplikt','innreiseforbud'], chars:[{id:'morten',x:82,mood:'normal',pose:'point',s:.84},{id:'alina',x:320,mood:'think',s:.84,flip:true}], props:[{type:'database',x:205,y:278,label:'SIS',rows:[['1','UTREISE','!'],['2','FORBUD','!'],['3','RETT','✓']]}] }, lines:[
        { who:'morten', no:'En utreiseplikt kan registreres i SIS, slik at landene kan kontrollere om personen har reist ut av Schengenområdet.', uk:'Обов’язок виїхати можуть зареєструвати в SIS, щоб країни могли перевірити, чи людина залишила Шенгенську зону.', en:'An obligation to leave may be recorded in SIS so the countries can check whether the person has left the Schengen Area.' },
        { who:'morten', no:'Et innreiseforbud kan også registreres. Da viser vedtaket hvor forbudet gjelder og hvor lenge det varer.', uk:'У SIS також можуть зареєструвати заборону на в’їзд. У рішенні вказано, де вона діє і скільки триває.', en:'An entry ban may also be recorded. The decision states where the ban applies and how long it lasts.' }
      ]},
      { art:{ bg:'school', board:'4 ulike ord', chars:[{id:'morten',x:92,mood:'normal',pose:'point',s:.86},{id:'alina',x:310,mood:'surprised',pose:'hold',s:.86,flip:true}], props:[{type:'codecard',x:200,y:260,text:'bortvisning ≠ utvisning',label:'bortvisning ≠ utvisning'}] }, lines:[
        { who:'morten', no:'Bortvisning betyr at du nektes innreise eller opphold og må reise. Utvisning gir også et innreiseforbud.', uk:'Bortvisning означає відмову у в’їзді або перебуванні та обов’язок виїхати. Utvisning також передбачає заборону на в’їзд.', en:'Bortvisning means refusal of entry or stay and an obligation to leave. Utvisning also includes an entry ban.' },
        { who:'morten', no:'Uttransportering betyr at politiet gjennomfører reisen ut. Ordene er forskjellige, så bruk ordet som står i vedtaket.', uk:'Uttransportering означає, що поліція здійснює примусове вивезення. Це різні поняття, тому вживай слово зі свого рішення.', en:'Uttransportering means that the police carry out the removal. The terms are different, so use the word written in the decision.' }
      ]},
      { art:{ bg:'street', flags:true, chars:[{id:'alina',x:105,mood:'normal',pose:'hold',s:.86},{id:'morten',x:305,mood:'normal',pose:'point',s:.86,flip:true}], props:[{type:'passport',x:195,y:250},{type:'clock',x:250,y:190,time:'12:00'}] }, lines:[
        { who:'morten', no:'Hvis vedtaket har en utreisefrist, må du følge fristen og sørge for at utreisen blir registrert ved grensekontrollen.', uk:'Якщо в рішенні є строк для виїзду, його треба дотриматися й подбати, щоб виїзд зареєстрували на прикордонному контролі.', en:'If the decision has a departure deadline, you must follow it and make sure the departure is registered at border control.' },
        { who:'alina', no:'Hvis utreisen ikke ble registrert, kan jeg sende dokumentasjon til myndigheten som behandler saken.', uk:'Якщо виїзд не зареєстрували, я можу надіслати підтвердження органу, який розглядає справу.', en:'If the departure was not registered, I can send documentation to the authority handling the case.' }
      ]},
      { art:{ bg:'office', sign:'DINE RETTIGHETER', chars:[{id:'alina',x:105,mood:'think',pose:'point',s:.86},{id:'morten',x:305,mood:'happy',pose:'hold',s:.86,flip:true}], props:[{type:'datashield',x:205,y:270,label:'INNSYN'}] }, lines:[
        { who:'alina', no:'Kan jeg få vite hvilke opplysninger om meg som finnes i SIS?', uk:'Чи можу я дізнатися, які дані про мене є в SIS?', en:'Can I find out what information about me is held in SIS?' },
        { who:'morten', no:'Ja. Du kan be om innsyn. Du kan også kreve å rette feil data eller slette opplysninger som er lagret ulovlig.', uk:'Так. Ти можеш запросити доступ. Також можна вимагати виправити помилкові дані або видалити інформацію, збережену незаконно.', en:'Yes. You can request access. You may also demand correction of inaccurate data or deletion of information stored unlawfully.' }
      ]},
      { art:{ bg:'office', sign:'LES · SPØR · HANDLE', chars:[{id:'alina',x:105,mood:'happy',pose:'hold',s:.86},{id:'morten',x:305,mood:'happy',pose:'point',s:.86,flip:true}], props:[{type:'docs',x:168,y:232},{type:'phone',x:235,y:230}], fx:'stars' }, lines:[
        { who:'morten', no:'Vedtaket forteller hvordan og innen hvilken frist du kan klage. En klage stopper ikke alltid utreiseplikten, så spør UDI, politiet eller en advokat.', uk:'У рішенні написано, як і до якого строку його оскаржити. Скарга не завжди зупиняє обов’язок виїхати, тому звернися до UDI, поліції або адвоката.', en:'The decision explains how and by what deadline you may appeal. An appeal does not always suspend the obligation to leave, so ask UDI, the police or a lawyer.' },
        { who:'alina', no:'Jeg følger mitt eget vedtak, bruker offisielle kilder og ber om tolk hvis jeg ikke forstår. Generell informasjon erstatter ikke individuell hjelp.', uk:'Я дію за власним рішенням, користуюся офіційними джерелами й прошу перекладача, якщо не розумію. Загальна інформація не замінює індивідуальної допомоги.', en:'I follow my own decision, use official sources and ask for an interpreter if I do not understand. General information does not replace individual help.' }
      ]}
    ],
    vocab, words,
    tasks:[
      task(['Hva er SIS?','Що таке SIS?','What is SIS?'], ['Et digitalt register som Schengen-landenes myndigheter bruker','Цифровий реєстр, яким користуються органи країн Шенгену','A digital register used by the authorities of Schengen countries'], [
        ['En offentlig liste på sosiale medier','Публічний список у соцмережах','A public list on social media'],['En domstol som avsier straff','Суд, який призначає покарання','A court that imposes sentences'],['Et privat reisebyrå','Приватна туристична агенція','A private travel agency']
      ]),
      task(['Hva følger normalt med en utvisning?','Що зазвичай супроводжує видворення utvisning?','What normally accompanies an expulsion (utvisning)?'], ['Et innreiseforbud','Заборона на в’їзд','An entry ban'], [
        ['Et nytt pass','Новий паспорт','A new passport'],['Automatisk statsborgerskap','Автоматичне громадянство','Automatic citizenship'],['En gratis flybillett','Безкоштовний авіаквиток','A free plane ticket']
      ]),
      task(['Hva bør du gjøre når du reiser innen fristen?','Що слід зробити, виїжджаючи у встановлений строк?','What should you do when leaving by the deadline?'], ['Sørge for at utreisen blir registrert','Подбати, щоб виїзд зареєстрували','Make sure the departure is registered'], [
        ['Kaste vedtaket','Викинути рішення','Throw away the decision'],['Skjule reisedokumentet','Сховати проїзний документ','Hide the travel document'],['Stole på et rykte på nettet','Повірити чуткам у мережі','Trust an online rumour']
      ]),
      task(['Hva kan du kreve hvis SIS-data om deg er feil?','Чого можна вимагати, якщо дані про вас у SIS помилкові?','What may you request if SIS data about you are inaccurate?'], ['Innsyn og retting, eller sletting når data er lagret ulovlig','Доступ і виправлення або видалення незаконно збережених даних','Access and correction, or deletion when data are stored unlawfully'], [
        ['At hele SIS stenges','Щоб закрили всю SIS','That all of SIS be shut down'],['At fristen ignoreres automatisk','Щоб строк автоматично ігнорували','That the deadline be ignored automatically'],['At et sosialt medium avgjør saken','Щоб справу вирішила соцмережа','That a social network decide the case']
      ]),
      task(['Hvor finner du reglene for å klage?','Де знайти правила оскарження?','Where do you find the appeal rules?'], ['I vedtaket og hos ansvarlig myndighet','У рішенні та в компетентному органі','In the decision and from the responsible authority'], [
        ['I en tilfeldig kommentar','У випадковому коментарі','In a random comment'],['Hos en ukjent profil','У незнайомого профілю','From an unknown profile'],['På en reklameplakat','На рекламному плакаті','On an advertising poster']
      ])
    ]
  });
})();
