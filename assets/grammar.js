/* Комікс·Lab — граматика: сторінка з правилами, тести «Velg riktig ord» і «Hva er klokka?».
   Дані — data/grammar.js (window.GRAMMAR). Тести — лише норвезькою, пояснення — мовою інтерфейсу. */
(() => {
  'use strict';

  const GX = {
    uk: {
      nav: 'Граматика', module: ['📐', 'Граматика', 'займенники, дієслова, порядок слів'],
      title: '📐 Норвезька граматика', intro: 'Короткі правила з таблицями та прикладами — від A1 до B2. Натисни 🔊, щоб почути приклад, наведи на слово — побачиш переклад. Після кожної теми — тест норвезькою.',
      rule: '📏 Правило', forms: '📋 Форми', examples: '💬 Приклади', test: '🧩 Тест з теми', mix_test: '🧩 Тест з усієї граматики', level: l => `Рівень ${l}`,
      tests: '📐 Граматика й годинник', clock: ['🕒', 'Котра година?', 'годинник норвезькою: halv, kvart over, kvart på'], step: x => `Граматика: ${x}`,
      clock_title: '🕒 Котра година? — Hva er klokka?', clock_rule: 'Норвежці рахують півгодини до НАСТУПНОЇ години: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Теми', q_grammar: 'Вибери правильне слово', q_clock: 'Котра година на годиннику?',
      cabinet: '🎓 Мій кабінет граматики', cabinet_d: 'Пройдені тести, найкращі бали та теми для повторення.',
      completed: 'Пройдено тестів', average: 'Середній найкращий бал', review_count: 'На повторення',
      history: '✅ Пройдені тести', history_empty: 'Ти ще не проходив граматичні тести. Почни з будь-якої теми нижче.',
      review: '🔁 Повторити зараз', review_empty: 'Чудово: слабких тем немає. Пройди змішаний тест для закріплення.',
      best: p => `Найкраще: ${p}%`, last: p => `Останній: ${p}%`, attempts: n => `${n} спроб`, repeat: '🔄 Повторити тест', mixed_review: '🧩 Змішане повторення', clock_name: 'Котра година?'
    },
    en: {
      nav: 'Grammar', module: ['📐', 'Grammar', 'pronouns, verbs, word order'],
      title: '📐 Norwegian grammar', intro: 'Short rules with tables and examples — from A1 to B2. Press 🔊 to hear an example and hover over a word to see its translation. Every topic ends with a test in Norwegian.',
      rule: '📏 Rule', forms: '📋 Forms', examples: '💬 Examples', test: '🧩 Topic test', mix_test: '🧩 Test on all grammar', level: l => `Level ${l}`,
      tests: '📐 Grammar and the clock', clock: ['🕒', 'What time is it?', 'telling the time in Norwegian: halv, kvart over, kvart på'], step: x => `Grammar: ${x}`,
      clock_title: '🕒 What time is it? — Hva er klokka?', clock_rule: 'Norwegians count the half hour towards the NEXT hour: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Topics', q_grammar: 'Choose the right word', q_clock: 'What time does the clock show?',
      cabinet: '🎓 My grammar dashboard', cabinet_d: 'Completed tests, best scores and topics ready for review.',
      completed: 'Tests completed', average: 'Average best score', review_count: 'Ready to review',
      history: '✅ Completed tests', history_empty: 'You have not completed a grammar test yet. Start with any topic below.',
      review: '🔁 Review now', review_empty: 'Great work: no weak topics. Try a mixed test to keep your skills fresh.',
      best: p => `Best: ${p}%`, last: p => `Latest: ${p}%`, attempts: n => `${n} attempts`, repeat: '🔄 Repeat test', mixed_review: '🧩 Mixed review', clock_name: 'What time is it?'
    },
    no: {
      nav: 'Grammatikk', module: ['📐', 'Grammatikk', 'pronomen, verb, ordstilling'],
      title: '📐 Norsk grammatikk', intro: 'Korte regler med tabeller og eksempler — fra A1 til B2. Trykk på 🔊 for å høre et eksempel. Hvert tema har en test på norsk.',
      rule: '📏 Regel', forms: '📋 Former', examples: '💬 Eksempler', test: '🧩 Test i temaet', mix_test: '🧩 Test i all grammatikk', level: l => `Nivå ${l}`,
      tests: '📐 Grammatikk og klokka', clock: ['🕒', 'Hva er klokka?', 'klokka på norsk: halv, kvart over, kvart på'], step: x => `Grammatikk: ${x}`,
      clock_title: '🕒 Hva er klokka?', clock_rule: 'Vi sier halv om halvtimen før NESTE time: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Temaer', q_grammar: 'Velg riktig ord', q_clock: 'Hva er klokka?',
      cabinet: '🎓 Mitt grammatikkpanel', cabinet_d: 'Fullførte tester, beste poeng og temaer du bør repetere.',
      completed: 'Tester fullført', average: 'Gjennomsnittlig beste poeng', review_count: 'Til repetisjon',
      history: '✅ Fullførte tester', history_empty: 'Du har ikke fullført en grammatikktest ennå. Start med et tema nedenfor.',
      review: '🔁 Repeter nå', review_empty: 'Flott: ingen svake temaer. Ta en blandet test for å holde kunnskapen ved like.',
      best: p => `Best: ${p}%`, last: p => `Sist: ${p}%`, attempts: n => `${n} forsøk`, repeat: '🔄 Ta testen på nytt', mixed_review: '🧩 Blandet repetisjon', clock_name: 'Hva er klokka?'
    },
    de: {
      nav: 'Grammatik', module: ['📐', 'Grammatik', 'Pronomen, Verben, Wortstellung'],
      title: '📐 Norwegische Grammatik', intro: 'Kurze Regeln mit Tabellen und Beispielen — von A1 bis B2. Drück 🔊, um ein Beispiel zu hören, und fahre über ein Wort für die Übersetzung. Jedes Thema endet mit einem Test auf Norwegisch.',
      rule: '📏 Regel', forms: '📋 Formen', examples: '💬 Beispiele', test: '🧩 Themen-Test', mix_test: '🧩 Test über die ganze Grammatik', level: l => `Stufe ${l}`,
      tests: '📐 Grammatik und die Uhr', clock: ['🕒', 'Wie spät ist es?', 'die Uhrzeit auf Norwegisch: halv, kvart over, kvart på'], step: x => `Grammatik: ${x}`,
      clock_title: '🕒 Wie spät ist es? — Hva er klokka?', clock_rule: 'Norweger zählen die halbe Stunde zur NÄCHSTEN Stunde: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Themen', q_grammar: 'Wähle das richtige Wort', q_clock: 'Wie viel Uhr zeigt die Uhr?',
      cabinet: '🎓 Mein Grammatikbereich', cabinet_d: 'Abgeschlossene Tests, Bestwerte und Themen zum Wiederholen.',
      completed: 'Tests abgeschlossen', average: 'Durchschnittlicher Bestwert', review_count: 'Zum Wiederholen',
      history: '✅ Abgeschlossene Tests', history_empty: 'Du hast noch keinen Grammatiktest abgeschlossen. Wähle unten ein Thema.',
      review: '🔁 Jetzt wiederholen', review_empty: 'Gut gemacht: Keine schwachen Themen. Probiere einen gemischten Test.',
      best: p => `Bestwert: ${p}%`, last: p => `Zuletzt: ${p}%`, attempts: n => `${n} Versuche`, repeat: '🔄 Test wiederholen', mixed_review: '🧩 Gemischte Wiederholung', clock_name: 'Wie spät ist es?'
    },
    pl: {
      nav: 'Gramatyka', module: ['📐', 'Gramatyka', 'zaimki, czasowniki, szyk zdania'],
      title: '📐 Gramatyka norweska', intro: 'Krótkie zasady z tabelami i przykładami — od A1 do B2. Naciśnij 🔊, aby usłyszeć przykład, i najedź na słowo, aby zobaczyć tłumaczenie. Każdy temat kończy się testem po norwesku.',
      rule: '📏 Zasada', forms: '📋 Formy', examples: '💬 Przykłady', test: '🧩 Test z tematu', mix_test: '🧩 Test z całej gramatyki', level: l => `Poziom ${l}`,
      tests: '📐 Gramatyka i zegar', clock: ['🕒', 'Która godzina?', 'godziny po norwesku: halv, kvart over, kvart på'], step: x => `Gramatyka: ${x}`,
      clock_title: '🕒 Która godzina? — Hva er klokka?', clock_rule: 'Norwegowie liczą pół godziny do NASTĘPNEJ godziny: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Tematy', q_grammar: 'Wybierz właściwe słowo', q_clock: 'Którą godzinę pokazuje zegar?',
      cabinet: '🎓 Mój panel gramatyki', cabinet_d: 'Ukończone testy, najlepsze wyniki i tematy do powtórki.',
      completed: 'Ukończone testy', average: 'Średni najlepszy wynik', review_count: 'Do powtórki',
      history: '✅ Ukończone testy', history_empty: 'Nie masz jeszcze ukończonych testów gramatycznych. Wybierz temat poniżej.',
      review: '🔁 Powtórz teraz', review_empty: 'Świetnie: brak słabych tematów. Spróbuj testu mieszanego.',
      best: p => `Najlepiej: ${p}%`, last: p => `Ostatnio: ${p}%`, attempts: n => `${n} prób`, repeat: '🔄 Powtórz test', mixed_review: '🧩 Powtórka mieszana', clock_name: 'Która godzina?'
    },
    tr: {
      nav: 'Dil bilgisi', module: ['📐', 'Dil bilgisi', 'zamirler, fiiller, sözcük sırası'],
      title: '📐 Norveççe dil bilgisi', intro: 'Tablolu ve örnekli kısa kurallar — A1’den B2’ye. Örneği duymak için 🔊 tuşuna bas, çeviriyi görmek için kelimenin üzerine gel. Her konu Norveççe bir testle biter.',
      rule: '📏 Kural', forms: '📋 Biçimler', examples: '💬 Örnekler', test: '🧩 Konu testi', mix_test: '🧩 Bütün dil bilgisi testi', level: l => `${l} seviyesi`,
      tests: '📐 Dil bilgisi ve saat', clock: ['🕒', 'Saat kaç?', 'Norveççe saat söyleme: halv, kvart over, kvart på'], step: x => `Dil bilgisi: ${x}`,
      clock_title: '🕒 Saat kaç? — Hva er klokka?', clock_rule: 'Norveçliler buçuğu BİR SONRAKİ saate göre sayar: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Konular', q_grammar: 'Doğru kelimeyi seç', q_clock: 'Saat kaçı gösteriyor?',
      cabinet: '🎓 Dil bilgisi panelim', cabinet_d: 'Tamamlanan testler, en iyi puanlar ve tekrar konuları.',
      completed: 'Tamamlanan testler', average: 'Ortalama en iyi puan', review_count: 'Tekrar edilecek',
      history: '✅ Tamamlanan testler', history_empty: 'Henüz bir dil bilgisi testi tamamlamadın. Aşağıdan bir konu seç.',
      review: '🔁 Şimdi tekrar et', review_empty: 'Harika: zayıf konu yok. Karma bir test çöz.',
      best: p => `En iyi: %${p}`, last: p => `Son: %${p}`, attempts: n => `${n} deneme`, repeat: '🔄 Testi tekrarla', mixed_review: '🧩 Karma tekrar', clock_name: 'Saat kaç?'
    },
    pt: {
      nav: 'Gramática', module: ['📐', 'Gramática', 'pronomes, verbos, ordem das palavras'],
      title: '📐 Gramática norueguesa', intro: 'Regras curtas com tabelas e exemplos — do A1 ao B2. Toque em 🔊 para ouvir um exemplo e passe o mouse sobre uma palavra para ver a tradução. Cada tema termina com um teste em norueguês.',
      rule: '📏 Regra', forms: '📋 Formas', examples: '💬 Exemplos', test: '🧩 Teste do tema', mix_test: '🧩 Teste de toda a gramática', level: l => `Nível ${l}`,
      tests: '📐 Gramática e relógio', clock: ['🕒', 'Que horas são?', 'as horas em norueguês: halv, kvart over, kvart på'], step: x => `Gramática: ${x}`,
      clock_title: '🕒 Que horas são? — Hva er klokka?', clock_rule: 'Os noruegueses contam a meia hora em direção à PRÓXIMA hora: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Temas', q_grammar: 'Escolha a palavra certa', q_clock: 'Que horas o relógio mostra?',
      cabinet: '🎓 Meu painel de gramática', cabinet_d: 'Testes concluídos, melhores resultados e temas prontos para revisar.',
      completed: 'Testes concluídos', average: 'Média dos melhores resultados', review_count: 'Prontos para revisar',
      history: '✅ Testes concluídos', history_empty: 'Você ainda não fez nenhum teste de gramática. Comece por qualquer tema abaixo.',
      review: '🔁 Revisar agora', review_empty: 'Ótimo trabalho: nenhum tema fraco. Faça um teste misto para manter a prática.',
      best: p => `Melhor: ${p}%`, last: p => `Último: ${p}%`, attempts: n => `${n} tentativas`, repeat: '🔄 Repetir o teste', mixed_review: '🧩 Revisão mista', clock_name: 'Que horas são?'
    },
    lt: {
      nav: 'Gramatika', module: ['📐', 'Gramatika', 'įvardžiai, veiksmažodžiai, žodžių tvarka'],
      title: '📐 Norvegų gramatika', intro: 'Trumpos taisyklės su lentelėmis ir pavyzdžiais — nuo A1 iki B2. Spausk 🔊, kad išgirstum pavyzdį, ir užvesk ant žodžio, kad pamatytum vertimą. Kiekviena tema baigiasi testu norvegiškai.',
      rule: '📏 Taisyklė', forms: '📋 Formos', examples: '💬 Pavyzdžiai', test: '🧩 Temos testas', mix_test: '🧩 Visos gramatikos testas', level: l => `${l} lygis`,
      tests: '📐 Gramatika ir laikrodis', clock: ['🕒', 'Kiek valandų?', 'laikas norvegiškai: halv, kvart over, kvart på'], step: x => `Gramatika: ${x}`,
      clock_title: '🕒 Kiek valandų? — Hva er klokka?', clock_rule: 'Norvegai pusvalandį skaičiuoja iki KITOS valandos: halv ni = 8:30. Kvart over tre = 3:15, kvart på fire = 3:45. Ti på halv fem = 4:20, fem over halv fem = 4:35.',
      topics: 'Temos', q_grammar: 'Pasirink teisingą žodį', q_clock: 'Kiek valandų rodo laikrodis?',
      cabinet: '🎓 Mano gramatikos skydelis', cabinet_d: 'Baigti testai, geriausi rezultatai ir temos kartojimui.',
      completed: 'Baigti testai', average: 'Geriausių rezultatų vidurkis', review_count: 'Kartoti',
      history: '✅ Baigti testai', history_empty: 'Dar nebaigei nė vieno gramatikos testo. Pasirink temą žemiau.',
      review: '🔁 Kartoti dabar', review_empty: 'Puiku: silpnų temų nėra. Išbandyk mišrų testą.',
      best: p => `Geriausias: ${p}%`, last: p => `Paskutinis: ${p}%`, attempts: n => `${n} bandymai`, repeat: '🔄 Kartoti testą', mixed_review: '🧩 Mišrus kartojimas', clock_name: 'Kiek valandų?'
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(GX, 'grammar.js:GX');
  if (window.I18N) for (const l of ['uk', 'en', 'no', 'de', 'pl', 'tr', 'lt', 'pt']) {
    const I = window.I18N[l]; if (!I) continue;
    I.nav = Object.assign({}, I.nav, { grammar: GX[l].nav });
    I.modules = Object.assign({}, I.modules, { grammar: GX[l].module, clock: GX[l].clock });
    if (l !== 'no') I.qtr = Object.assign({}, I.qtr, { grammar: GX[l].q_grammar, clock: GX[l].q_clock });
  }

  const C = () => window.KomiksCore;
  GX.ar = {
    nav: 'القواعد', module: ['📐', 'القواعد', 'الضمائر والأفعال وترتيب الكلمات'],
    title: '📐 قواعد اللغة النرويجية', intro: 'قواعد قصيرة مع جداول وأمثلة — من A1 إلى B2. اضغط 🔊 لتسمع مثالًا ومرّر فوق كلمة لترى ترجمتها. كل موضوع ينتهي باختبار بالنرويجية.',
    rule: '📏 القاعدة', forms: '📋 الصيغ', examples: '💬 أمثلة', test: '🧩 اختبار الموضوع', mix_test: '🧩 اختبار كل القواعد', level: l => `المستوى ${l}`,
    tests: '📐 القواعد والساعة', clock: ['🕒', 'كم الساعة؟', 'قول الوقت بالنرويجية: halv وkvart over وkvart på'], step: x => `القواعد: ${x}`,
    clock_title: '🕒 كم الساعة؟ — Hva er klokka?', clock_rule: 'يحسب النرويجيون نصف الساعة نحو الساعة التالية: halv ni = 8:30. Kvart over tre = 3:15، kvart på fire = 3:45. Ti på halv fem = 4:20، fem over halv fem = 4:35.',
    topics: 'المواضيع', q_grammar: 'اختر الكلمة الصحيحة', q_clock: 'كم الساعة على هذه الساعة؟'
  };
  const gx = (k, ...a) => { const tbl = GX[C().ui] || GX.en || GX.uk; const v = k in tbl ? tbl[k] : (GX.en || GX.uk)[k]; return typeof v === 'function' ? v(...a) : v; };
  const topics = () => (window.GRAMMAR || { topics: [] }).topics;
  const LEVELS = ['A1', 'A2', 'B1', 'B2'];
  const label = id => { const tp = topics().find(x => x.id === id); if (!tp) return id; const ui = C().ui; return ui === 'no' ? tp.no : `${tp.no} — ${tp[ui] || C().trText(tp.en, tp.uk, ui)}`; };
  const stars = key => (((C().store.get('progress', {}))[key]) || {}).stars || 0;

  function historyModel(topicList = [], quizlog = [], progress = {}) {
    const catalog = topicList.map(tp => ({
      key: 'grammar:' + tp.id, topic: tp.id, title: tp.no, level: tp.level,
      href: '#/quiz/grammar/' + tp.id
    })).concat([{ key: 'clock', topic: 'clock', title: 'Hva er klokka?', level: 'A1', href: '#/quiz/clock' }]);
    const pct = row => row && Number(row.total) > 0 ? Math.round(Number(row.score || 0) / Number(row.total) * 100) : 0;
    const items = catalog.map(item => {
      const attempts = quizlog.filter(row => row && row.key === item.key && Number(row.total) > 0);
      const saved = progress[item.key] || {};
      const bestPct = attempts.length ? Math.max(...attempts.map(pct)) : Number(saved.best || 0);
      const lastPct = attempts.length ? pct(attempts[0]) : null;
      return Object.assign({}, item, {
        attempts: attempts.length || Number(saved.plays || 0), bestPct, lastPct,
        completed: attempts.length > 0 || Number(saved.stars || 0) > 0 || Number(saved.plays || 0) > 0
      });
    });
    const completedItems = items.filter(item => item.completed);
    const reviewItems = completedItems.filter(item => item.bestPct < 80 || (item.lastPct !== null && item.lastPct < 80))
      .sort((a, b) => a.bestPct - b.bestPct || (a.lastPct ?? 101) - (b.lastPct ?? 101));
    return {
      total: catalog.length,
      completed: completedItems.length,
      average: completedItems.length ? Math.round(completedItems.reduce((sum, item) => sum + item.bestPct, 0) / completedItems.length) : 0,
      completedItems,
      reviewItems
    };
  }

  /* ---------------- завдання ---------------- */
  function makeQ(tp, [sent, answer, wrong], nOpt) {
    const K = C();
    const at = sent.indexOf('_');
    const options = K.shuffle([answer, ...K.sample(wrong, nOpt - 1)]);
    /* «Velg riktig setning:» — пропуску немає, вибирають ціле речення. Тоді
       інструкція стоїть перед пропуском, а озвучується сама відповідь. Раніше
       indexOf давав −1, і на екрані інструкція виходила двічі. */
    if (at < 0) return { type: 'grammar', topic: tp.id, sentence: answer, before: sent.trim() + ' ', after: '', answer, options };
    const sentence = sent.replace('_', answer).replace(/\s*\([^)]*\)\s*$/, '');
    return { type: 'grammar', topic: tp.id, sentence, before: sent.slice(0, at), after: sent.slice(at + 1), answer, options };
  }
  // filter: null — усі теми; 'level:A2' — теми до цього рівня включно; інакше — id теми
  function questions(filter, n) {
    const K = C();
    const nOpt = K.settings.level === 'kids' ? 3 : 4;
    let list = topics();
    if (filter && filter.startsWith('level:')) { const max = LEVELS.indexOf(filter.slice(6)); list = list.filter(tp => LEVELS.indexOf(tp.level) <= max); }
    else if (filter) list = list.filter(tp => tp.id === filter);
    const all = list.flatMap(tp => tp.items.map(it => [tp, it]));
    return K.shuffle(all).slice(0, n).map(([tp, it]) => makeQ(tp, it, nOpt));
  }
  const quizSize = () => (C().settings.level === 'kids' ? 10 : 14);
  const quiz = topic => questions(topic || null, quizSize());

  /* ---------------- годинник ---------------- */
  const HOURS = ['tolv', 'ett', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti', 'elleve'];
  function clockText(hh, mm) {
    const H = n => HOURS[((n % 12) + 12) % 12], cur = H(hh), nxt = H(hh + 1);
    return ({ 0: 'klokka ' + cur, 5: 'fem over ' + cur, 10: 'ti over ' + cur, 15: 'kvart over ' + cur, 20: 'ti på halv ' + nxt, 25: 'fem på halv ' + nxt,
      30: 'halv ' + nxt, 35: 'fem over halv ' + nxt, 40: 'ti over halv ' + nxt, 45: 'kvart på ' + nxt, 50: 'ti på ' + nxt, 55: 'fem på ' + nxt })[mm];
  }
  function clock(n, easy) {
    const K = C();
    const mins = easy ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const nOpt = K.settings.level === 'kids' ? 3 : 4;
    const seen = new Set();
    const out = [];
    for (let guard = 0; out.length < n && guard < n * 10; guard++) {
      const hh = 1 + Math.floor(Math.random() * 12), mm = K.pick(mins), answer = clockText(hh, mm);
      if (seen.has(answer)) continue; seen.add(answer);
      const pool = K.uniq([...mins.map(m => clockText(hh, m)), clockText(hh + 1, mm), clockText(hh - 1, mm), clockText(hh + 1, (mm + 30) % 60)]).filter(x => x !== answer);
      out.push({ type: 'clock', hh, mm, time: hh + ':' + String(mm).padStart(2, '0'), answer, sentence: 'Klokka er ' + answer.replace(/^klokka /, ''), options: K.shuffle([answer, ...K.sample(pool, nOpt - 1)]) });
    }
    return out;
  }
  const clockSVG = time => `<svg viewBox="-40 -76 80 80" xmlns="http://www.w3.org/2000/svg">${C().ART.propRaw('clock', { time })}</svg>`;

  /* ---------------- сторінка ---------------- */
  function render(focus) {
    const K = C(), { h } = K;
    const ui = K.ui;
    const say = (text, rate = 0.9) => () => K.claim().then(() => K.Speech.speak(text, 'narrator', { rate }));
    /* Переклад колонки — мовою інтерфейсу. Для мов, яких немає в самих даних
       (арабська, німецька, польська, турецька, литовська), його шукає словник
       за англійським рядком; доти німець бачив українську колонку. */
    const trCol = row => (K.trText ? K.trText(row[2], row[1], ui) : row[1]);
    const history = historyModel(topics(), K.store.get('quizlog', []), K.store.get('progress', {}));
    const itemTitle = item => item.topic === 'clock' ? gx('clock_name') : label(item.topic);
    const scoreTone = score => score >= 80 ? 'good' : score >= 60 ? 'mid' : 'low';
    const dashboard = h('section', { class: 'gram-cabinet box', 'aria-labelledby': 'gram-cabinet-title' },
      h('div', { class: 'gram-cabinet-head' },
        h('div', {}, h('h2', { id: 'gram-cabinet-title' }, gx('cabinet')), h('p', {}, gx('cabinet_d'))),
        h('a', { class: 'btn accent gram-mixed', href: '#/quiz/grammar' }, gx('mixed_review'))),
      h('div', { class: 'gram-cabinet-stats' },
        h('div', { class: 'gram-stat' }, h('strong', {}, `${history.completed}/${history.total}`), h('span', {}, gx('completed'))),
        h('div', { class: 'gram-stat' }, h('strong', {}, `${history.average}%`), h('span', {}, gx('average'))),
        h('div', { class: 'gram-stat' }, h('strong', {}, String(history.reviewItems.length)), h('span', {}, gx('review_count')))),
      h('div', { class: 'gram-review' }, h('h3', {}, gx('review')),
        history.reviewItems.length
          ? h('div', { class: 'gram-review-list' }, history.reviewItems.slice(0, 4).map(item => h('a', { class: 'gram-review-card', href: item.href },
            h('span', { class: 'gram-review-ico', 'aria-hidden': 'true' }, item.bestPct < 60 ? '🧠' : '✨'),
            h('span', {}, h('b', {}, itemTitle(item)), h('small', {}, gx('best', item.bestPct))),
            h('strong', { class: 'gram-score ' + scoreTone(item.bestPct) }, `${item.bestPct}%`))))
          : h('p', { class: 'gram-empty' }, gx('review_empty'))),
      h('div', { class: 'gram-history' }, h('h3', {}, gx('history')),
        history.completedItems.length
          ? h('div', { class: 'gram-history-list' }, history.completedItems.map(item => h('article', { class: 'gram-history-row' },
            h('div', { class: 'gram-history-main' }, h('b', {}, itemTitle(item)), h('span', { class: 'lvl lvl-' + item.level }, item.level)),
            h('div', { class: 'gram-history-meta' }, h('span', {}, gx('best', item.bestPct)), item.lastPct === null ? null : h('span', {}, gx('last', item.lastPct)), h('span', {}, gx('attempts', item.attempts))),
            h('a', { class: 'btn small', href: item.href }, gx('repeat')))))
          : h('p', { class: 'gram-empty' }, gx('history_empty'))));
    const topicEl = tp => h('article', { class: 'gram-topic box', id: 'g-' + tp.id },
      h('header', { class: 'gram-head' }, h('span', { class: 'gram-ico' }, tp.icon), h('div', {}, K.withTr(h('h3', {}, tp.no), K.both(tp.uk, tp.en)), ui !== 'no' ? h('small', {}, tp[ui] || C().trText(tp.en, tp.uk, ui)) : null),
        h('span', { class: 'lvl lvl-' + tp.level }, tp.level), K.stars(stars('grammar:' + tp.id))),
      h('h4', {}, gx('rule')), h('p', { class: 'gram-rule' }, tp.rule[ui] || (K.trText ? K.trText(tp.rule.en, tp.rule.uk, ui) : null) || tp.rule.en || tp.rule.uk),
      h('h4', {}, gx('forms')),
      h('div', { class: 'table-wrap' }, h('table', { class: 'gram-table' }, h('tbody', {}, tp.table.map(row => h('tr', {},
        h('td', {}, h('button', { class: 'play', type: 'button', 'aria-label': 'Lytt', onclick: say(row[0].replace(/→/g, ',').replace(/\+ inf\./, '')) }, '🔊')),
        K.withTr(h('td', { class: 'no-cell' }, row[0]), K.both(row[1], row[2])), h('td', { class: 'tr-cell' }, trCol(row))))))),
      h('h4', {}, gx('examples')),
      h('ul', { class: 'gram-ex' }, tp.examples.map(ex => h('li', {}, h('button', { class: 'play', type: 'button', 'aria-label': 'Lytt', onclick: say(ex[0]) }, '🔊'),
        K.withTr(h('span', { class: 'ex-no' }, K.wordSpans(null, ex[0])), K.both(ex[1], ex[2]))))),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/grammar/' + tp.id }, gx('test'))));
    const chips = h('div', { class: 'gram-chips' }, topics().map(tp => h('a', { class: 'chip lvl-' + tp.level, href: '#/grammar/' + tp.id }, tp.icon + ' ' + (ui === 'no' ? tp.no : tp[ui] || C().trText(tp.en, tp.uk, ui)))));
    const clockBox = h('article', { class: 'gram-topic box', id: 'g-clock' },
      h('header', { class: 'gram-head' }, h('span', { class: 'gram-ico' }, '🕒'), h('div', {}, h('h3', {}, gx('clock_title'))), h('span', { class: 'lvl lvl-A1' }, 'A1'), K.stars(stars('clock'))),
      h('p', { class: 'gram-rule' }, gx('clock_rule')),
      h('div', { class: 'clock-row' }, [['8:30', 'halv ni'], ['3:15', 'kvart over tre'], ['3:45', 'kvart på fire'], ['4:20', 'ti på halv fem'], ['4:35', 'fem over halv fem']].map(([tm, txt]) =>
        h('button', { class: 'clock-card', type: 'button', onclick: say('Klokka er ' + txt) }, h('span', { class: 'clock-svg' }, K.svgEl(clockSVG(tm))), h('b', {}, tm), h('span', {}, txt)))),
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/clock' }, gx('test'))));
    const root = h('section', { class: 'grammar' }, K.pageHead(gx('title')),
      h('p', { class: 'lead-p' }, gx('intro')),
      dashboard,
      h('div', { class: 'row-left' }, h('a', { class: 'btn accent', href: '#/quiz/grammar' }, gx('mix_test')), K.stars(stars('grammar'))),
      h('h3', { class: 'sec-sub' }, gx('topics')), chips,
      ...LEVELS.flatMap(l => { const list = topics().filter(tp => tp.level === l); return list.length ? [h('h3', { class: 'sec-sub' }, gx('level', l)), ...list.map(topicEl), l === 'A1' ? clockBox : null] : []; }));
    if (focus) setTimeout(() => { const el = document.getElementById('g-' + focus); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
    return root;
  }

  window.KomiksGrammar = { topics, label, questions, quiz, clock, clockText, clockSVG, render, text: gx, stars, historyModel };
})();
