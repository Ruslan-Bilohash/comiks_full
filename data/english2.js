/*
 * Англійський курс, частина 2: 🗺 план граматики (window.ENGLISH.plan) та історії e9–e18.
 * Кожна історія вчить одну граматичну тему (поле grammar → id теми в плані), тож курс іде
 * сходинками: to be → have got → present simple → … → passive. Репліки { who, en, uk, no },
 * vocab [en, uk, no]. Частина 3 — data/english3.js (e19–e28).
 */
(function () {
  const E = window.ENGLISH = window.ENGLISH || { comics: [] };

  /* 🗺 План: теми в порядку вивчення. rule — коротке пояснення трьома мовами, ex — приклади,
     stories — історії, де тему видно в живих діалогах (у тому числі старі e1–e8). */
  E.plan = [
    { id: 'be', level: 'A1', en: 'To be: am / is / are', uk: 'Дієслово to be: am / is / are', no: 'Verbet to be: am / is / are',
      rule: { uk: 'I am, you/we/they are, he/she/it is. Заперечення — not (I am not), питання — дієслово на початку (Are you…?).', en: 'I am, you/we/they are, he/she/it is. Negative — add not; question — put the verb first (Are you…?).', no: 'I am, you/we/they are, he/she/it is. Nektelse med not, spørsmål med verbet først (Are you…?).' },
      ex: ['I am Leo.', 'She is nine years old.', 'We are a happy family.'], stories: ['e1', 'e9'] },
    { id: 'numbers', level: 'A1', en: 'Numbers and prices', uk: 'Числа й ціни', no: 'Tall og priser',
      rule: { uk: 'How much is…? — скільки коштує (одна річ). How many…? — скільки (штук). Ціни: two pounds fifty.', en: 'How much is…? asks about price, How many…? about the number of things. Prices: two pounds fifty.', no: 'How much is…? spør om pris, How many…? om antall. Priser: two pounds fifty.' },
      ex: ['How much is the bread?', 'It is two pounds fifty.', 'We need six apples.'], stories: ['e2'] },
    { id: 'have-got', level: 'A1', en: 'Have got / has got', uk: 'Have got / has got — мати', no: 'Have got / has got – å ha',
      rule: { uk: 'I/you/we/they have got, he/she/it has got. Заперечення: haven’t got / hasn’t got. Питання: Have you got…?', en: 'I/you/we/they have got, he/she/it has got. Negative: haven’t got / hasn’t got. Question: Have you got…?', no: 'I/you/we/they have got, he/she/it has got. Nektelse: haven’t got / hasn’t got. Spørsmål: Have you got…?' },
      ex: ['I have got a little dog.', 'He has got green eyes.', 'Have you got a pet?'], stories: ['e11'] },
    { id: 'routine', level: 'A1', en: 'Time and daily routine', uk: 'Час і розпорядок дня', no: 'Klokka og dagsrytme',
      rule: { uk: 'Present Simple для звичок: I get up at seven. Час: It is seven o’clock, half past seven.', en: 'Use the Present Simple for habits: I get up at seven. Time: It is seven o’clock, half past seven.', no: 'Present Simple for vaner: I get up at seven. Klokka: It is seven o’clock, half past seven.' },
      ex: ['What time is it?', 'It is twelve o\'clock.', 'I take this bus every morning.'], stories: ['e10'] },
    { id: 'there-is', level: 'A1', en: 'There is / there are', uk: 'There is / there are — є, знаходиться', no: 'There is / there are – det er',
      rule: { uk: 'There is + одна річ, there are + багато. Місце: in, on, under, behind, next to, near.', en: 'There is + one thing, there are + many. Place: in, on, under, behind, next to, near.', no: 'There is + én ting, there are + flere. Sted: in, on, under, behind, next to, near.' },
      ex: ['There is a big tree in the park.', 'There are two birds in the tree.', 'It is under the bench.'], stories: ['e13'] },
    { id: 'would-like', level: 'A1', en: 'Would like / can I have', uk: 'Would like / can I have — ввічливе прохання', no: 'Would like / can I have – høflige ønsker',
      rule: { uk: 'I would like… — я б хотів(ла). Can I have…, please? — можна мені… Would you like…? — чи хочете ви…?', en: 'I would like… is polite for “I want”. Can I have…, please? Would you like…? to offer.', no: 'I would like… er en høflig måte å si «jeg vil ha». Can I have…, please? Would you like…? når du tilbyr.' },
      ex: ['I would like a hot chocolate.', 'Can I have a waffle too?', 'Would you like something to eat?'], stories: ['e12'] },
    { id: 'weather', level: 'A1', en: 'Weather and seasons', uk: 'Погода й пори року', no: 'Vær og årstider',
      rule: { uk: 'It is + прикметник: It is cold / sunny / windy. Процес зараз: It is raining / snowing.', en: 'It is + adjective: It is cold / sunny / windy. Happening now: It is raining / snowing.', no: 'It is + adjektiv: It is cold / sunny / windy. Akkurat nå: It is raining / snowing.' },
      ex: ['It is snowing!', 'Winter is cold.', 'What’s the weather like?'], stories: ['e14'] },
    { id: 'present-simple', level: 'A2', en: 'Present Simple: he/she + -s, how often', uk: 'Present Simple: he/she + -s, як часто', no: 'Present Simple: he/she + -s, hvor ofte',
      rule: { uk: 'He/she/it додає -s: he gets up, she sleeps. Як часто: always, usually, often, sometimes, never — перед дієсловом.', en: 'He/she/it adds -s: he gets up, she sleeps. How often: always, usually, often, sometimes, never — before the verb.', no: 'He/she/it får -s: he gets up, she sleeps. Hvor ofte: always, usually, often, sometimes, never – foran verbet.' },
      ex: ['Musa gets up at six thirty.', 'She usually sleeps until seven.', 'The bus never waits.'], stories: ['e15'] },
    { id: 'present-continuous', level: 'A2', en: 'Present Continuous', uk: 'Present Continuous — дія просто зараз', no: 'Present Continuous – akkurat nå',
      rule: { uk: 'am/is/are + дієслово-ing: I am baking, it is raining. Для того, що відбувається в цей момент.', en: 'am/is/are + verb-ing: I am baking, it is raining. For things happening right now.', no: 'am/is/are + verb-ing: I am baking, it is raining. For det som skjer akkurat nå.' },
      ex: ['What are you doing right now?', 'I am baking a cake.', 'Something is burning!'], stories: ['e16', 'e3'] },
    { id: 'can', level: 'A2', en: 'Can / can’t', uk: 'Can / can’t — вміти, могти', no: 'Can / can’t – kan / kan ikke',
      rule: { uk: 'can + дієслово без to: I can run. Заперечення can’t, минуле could / couldn’t. Can I…? — прохання дозволу.', en: 'can + verb without to: I can run. Negative can’t, past could / couldn’t. Can I…? asks for permission.', no: 'can + verb uten to: I can run. Nektelse can’t, fortid could / couldn’t. Can I…? spør om lov.' },
      ex: ['I can jump very high.', 'I can’t kick the ball far.', 'Last year I couldn’t play at all.'], stories: ['e22', 'e4'] },
    { id: 'past-simple', level: 'A2', en: 'Past Simple', uk: 'Past Simple — минулий час', no: 'Past Simple – fortid',
      rule: { uk: 'Правильні дієслова + -ed (visited, painted), неправильні — своя форма (went, saw, made). Питання й заперечення — did / didn’t + базова форма.', en: 'Regular verbs + -ed (visited, painted), irregular verbs have their own form (went, saw, made). Questions and negatives use did / didn’t + base form.', no: 'Regelrette verb + -ed (visited, painted), uregelrette har egen form (went, saw, made). Spørsmål og nektelse med did / didn’t + grunnform.' },
      ex: ['I visited my brother.', 'We saw the whole city.', 'Did you go out? — No, I didn’t.'], stories: ['e17'] },
    { id: 'comparatives', level: 'A2', en: 'Comparatives and superlatives', uk: 'Ступені порівняння', no: 'Gradbøying',
      rule: { uk: 'Короткі слова: faster, the fastest. Довгі: more expensive, the most popular. Особливі: good → better → the best.', en: 'Short words: faster, the fastest. Long words: more expensive, the most popular. Irregular: good → better → the best.', no: 'Korte ord: faster, the fastest. Lange ord: more expensive, the most popular. Uregelrett: good → better → the best.' },
      ex: ['This bike is faster than my old one.', 'It is the most popular bike.', 'The red one is the best!'], stories: ['e18'] },
    { id: 'imperatives', level: 'A2', en: 'Imperatives and directions', uk: 'Наказовий спосіб і дорога', no: 'Imperativ og veibeskrivelse',
      rule: { uk: 'Прохання й інструкції — базова форма: Go straight on. Turn left. Заперечення: Don’t… Ввічливо: Please…', en: 'Instructions use the base form: Go straight on. Turn left. Negative: Don’t… Polite: Please…', no: 'Instrukser bruker grunnformen: Go straight on. Turn left. Nektelse: Don’t… Høflig: Please…' },
      ex: ['Turn left at the traffic lights.', 'Get off here and turn right.', 'Sit down and hold on!'], stories: ['e19', 'e8'] },
    { id: 'going-to', level: 'A2', en: 'Going to — plans', uk: 'Going to — плани', no: 'Going to – planer',
      rule: { uk: 'am/is/are going to + дієслово: про плани й те, що от-от станеться. We are going to sleep in a tent.', en: 'am/is/are going to + verb: for plans and things we can see coming. We are going to sleep in a tent.', no: 'am/is/are going to + verb: om planer og det som snart skjer. We are going to sleep in a tent.' },
      ex: ['We are going to have a picnic.', 'I am going to pack my backpack.', 'It is going to be sunny.'], stories: ['e6', 'e20'] },
    { id: 'some-any', level: 'A2', en: 'Some / any, how much / how many', uk: 'Some / any, how much / how many', no: 'Some / any, how much / how many',
      rule: { uk: 'some — у ствердженнях, any — у питаннях і запереченнях. How much + незлічуване (flour), how many + злічуване (eggs).', en: 'some in positive sentences, any in questions and negatives. How much + uncountable (flour), how many + countable (eggs).', no: 'some i bekreftende setninger, any i spørsmål og nektelser. How much + utellelig (flour), how many + tellelig (eggs).' },
      ex: ['Have we got any eggs?', 'How much flour do we need?', 'There is some milk.'], stories: ['e21'] },
    { id: 'should', level: 'A2', en: 'Should — advice', uk: 'Should — порада', no: 'Should – råd',
      rule: { uk: 'should + дієслово — порада: You should rest. Заперечення shouldn’t. Питання: Should I…?', en: 'should + verb gives advice: You should rest. Negative shouldn’t. Question: Should I…?', no: 'should + verb gir råd: You should rest. Nektelse shouldn’t. Spørsmål: Should I…?' },
      ex: ['Should I stay at home?', 'You should drink a lot of water.', 'I should put it in my bag.'], stories: ['e5', 'e26'] },
    { id: 'present-perfect', level: 'B1', en: 'Present Perfect', uk: 'Present Perfect — результат до тепер', no: 'Present Perfect – resultat til nå',
      rule: { uk: 'have/has + третя форма (done, finished, sent). Слова-підказки: already, just, yet, ever, never. Час не вказуємо.', en: 'have/has + past participle (done, finished, sent). Signal words: already, just, yet, ever, never. No exact time.', no: 'have/has + perfektum partisipp (done, finished, sent). Signalord: already, just, yet, ever, never. Ingen bestemt tid.' },
      ex: ['Have you finished the report yet?', 'I have just started.', 'Have you ever lost a report?'], stories: ['e23', 'e7'] },
    { id: 'past-continuous', level: 'B1', en: 'Past Continuous', uk: 'Past Continuous — тривала дія в минулому', no: 'Past Continuous – pågående fortid',
      rule: { uk: 'was/were + -ing — дія тривала в певний момент минулого. Часто з Past Simple: I was driving when it happened.', en: 'was/were + -ing for an action in progress in the past. Often with the Past Simple: I was driving when it happened.', no: 'was/were + -ing om noe som pågikk i fortiden. Ofte med Past Simple: I was driving when it happened.' },
      ex: ['Musa was driving home.', 'While he was singing, he didn’t see the sign.', 'What were you doing?'], stories: ['e24'] },
    { id: 'second-conditional', level: 'B1', en: 'Second conditional', uk: 'Умовний спосіб: if + past, would', no: 'Andre kondisjonal',
      rule: { uk: 'If + Past Simple, would + дієслово — уявна ситуація: If I won a million, I would travel. If I were you…', en: 'If + Past Simple, would + verb for imaginary situations: If I won a million, I would travel. If I were you…', no: 'If + Past Simple, would + verb om noe tenkt: If I won a million, I would travel. If I were you…' },
      ex: ['If I won a million, I would travel.', 'If I had more time, I would learn the piano.', 'If I were you, I would start today.'], stories: ['e25'] },
    { id: 'must', level: 'B1', en: 'Must / have to / mustn’t', uk: 'Must / have to / mustn’t — обов’язок', no: 'Must / have to / mustn’t – plikt',
      rule: { uk: 'must і have to — треба; mustn’t — не можна; don’t have to — не обов’язково. Питання: Do I have to…?', en: 'must and have to = it is necessary; mustn’t = it is not allowed; don’t have to = not necessary. Question: Do I have to…?', no: 'must og have to = det er nødvendig; mustn’t = det er ikke lov; don’t have to = ikke nødvendig. Spørsmål: Do I have to…?' },
      ex: ['We must call them right away.', 'Do I have to go today?', 'You mustn’t leave it on the seat.'], stories: ['e26'] },
    { id: 'will', level: 'B1', en: 'Will vs going to', uk: 'Will чи going to', no: 'Will eller going to',
      rule: { uk: 'will — рішення в момент мовлення, обіцянка, пропозиція (I will help you). going to — план, вирішений раніше.', en: 'will for decisions made now, promises and offers (I will help you). going to for plans made earlier.', no: 'will om beslutninger nå, løfter og tilbud (I will help you). going to om planer bestemt tidligere.' },
      ex: ['I will carry the heavy boxes.', 'We are going to have a party.', 'I will bring a cake!'], stories: ['e27'] },
    { id: 'passive', level: 'B1', en: 'Passive and relative clauses', uk: 'Пасив і підрядні з who / which / that', no: 'Passiv og relativsetninger',
      rule: { uk: 'Пасив: be + третя форма (was built, is used). Підрядні: who — про людей, which — про речі, that — про обох.', en: 'Passive: be + past participle (was built, is used). Relative clauses: who for people, which for things, that for both.', no: 'Passiv: be + perfektum partisipp (was built, is used). Relativsetninger: who om personer, which om ting, that om begge.' },
      ex: ['The building was built in 1900.', 'Morten, who teaches Norwegian, checks everything.', 'The course that starts on Monday is free.'], stories: ['e28'] },
  ];
  // старі історії теж отримують свою тему — план показує їх разом із новими
  const OLD = { e1: 'be', e2: 'numbers', e3: 'present-continuous', e4: 'can', e5: 'should', e6: 'going-to', e7: 'present-perfect', e8: 'imperatives' };
  E.comics.forEach(c => { if (OLD[c.id] && !c.grammar) c.grammar = OLD[c.id]; });

  E.comics.push(
    {
      id: 'e9', level: 'A1', category: 'familie', style: 'strip', grammar: 'be',
      title: 'This Is My Family', titleUk: 'Це моя родина', titleNo: 'Dette er familien min',
      summaryUk: 'Мія знайомить Лео з родиною: am / is / are, my / his / her.', summaryEn: 'Mia introduces Leo to her family: am / is / are, my / his / her.', summaryNo: 'Mia viser Leo familien sin: am / is / are, my / his / her.',
      cover: 1,
      panels: [
        { art: { bg: 'home', chars: [{ id: 'mia', x: 110, mood: 'happy', pose: 'wave' }, { id: 'leo', x: 300, mood: 'surprised' }], props: [{ type: 'sofa', x: 210 }] }, lines: [
          { who: 'mia', en: 'Come in, Leo! This is my house.', uk: 'Заходь, Лео! Це мій дім.', no: 'Kom inn, Leo! Dette er huset mitt.' },
          { who: 'leo', en: 'Wow, it is very big!', uk: 'Ого, він дуже великий!', no: 'Oi, det er veldig stort!' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'mamma', x: 300, mood: 'happy', pose: 'wave' }, { id: 'mia', x: 110, mood: 'happy', pose: 'point' }] }, lines: [
          { who: 'mia', en: 'This is my mum. She is a nurse.', uk: 'Це моя мама. Вона медсестра.', no: 'Dette er mamma. Hun er sykepleier.' },
          { who: 'mamma', en: 'Hello, Leo! Nice to meet you.', uk: 'Привіт, Лео! Приємно познайомитися.', no: 'Hei, Leo! Hyggelig å møte deg.' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'pappa', x: 220, mood: 'grin', pose: 'hold' }, { id: 'mia', x: 90, mood: 'happy', pose: 'point' }, { id: 'leo', x: 335, mood: 'happy' }] }, lines: [
          { who: 'mia', en: 'And this is my dad. He is a cook.', uk: 'А це мій тато. Він кухар.', no: 'Og dette er pappa. Han er kokk.' },
          { who: 'pappa', en: 'Are you hungry, Leo? The pizza is ready!', uk: 'Ти голодний, Лео? Піца готова!', no: 'Er du sulten, Leo? Pizzaen er klar!' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'bestemor', x: 300, mood: 'grin', pose: 'hold' }, { id: 'mia', x: 110, mood: 'happy' }], props: [{ type: 'book', x: 340, y: 250, front: true }] }, lines: [
          { who: 'mia', en: 'This is my grandma. She is seventy years old.', uk: 'Це моя бабуся. Їй сімдесят років.', no: 'Dette er bestemor. Hun er sytti år gammel.' },
          { who: 'bestemor', en: 'And I am still young at heart!', uk: 'І я все ще молода душею!', no: 'Og jeg er fortsatt ung til sinns!' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'leo', x: 90, mood: 'surprised', pose: 'point' }, { id: 'mia', x: 210, mood: 'grin' }, { id: 'pus', x: 330 }], props: [{ type: 'sofa', x: 320 }] }, lines: [
          { who: 'leo', en: 'Is that your cat?', uk: 'Це твій кіт?', no: 'Er det katten din?' },
          { who: 'mia', en: 'Yes, his name is Pus. He is very lazy!', uk: 'Так, його звати Пус. Він дуже ледачий!', no: 'Ja, han heter Pus. Han er veldig lat!' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'mamma', x: 70, mood: 'happy' }, { id: 'pappa', x: 160, mood: 'grin' }, { id: 'mia', x: 340, mood: 'happy', pose: 'cheer' }, { id: 'leo', x: 250, mood: 'grin' }], props: [{ type: 'table', x: 200 }] }, lines: [
          { who: 'leo', en: 'Your family is really nice.', uk: 'У тебе дуже гарна родина.', no: 'Familien din er veldig hyggelig.' },
          { who: 'mia', en: 'Thank you! We are a happy family.', uk: 'Дякую! Ми щаслива родина.', no: 'Takk! Vi er en glad familie.' }
        ]}
      ],
      vocab: [
        ['family', 'родина', 'familie'], ['house', 'дім', 'hus'], ['big', 'великий', 'stor'], ['mum', 'мама', 'mamma'], ['nurse', 'медсестра', 'sykepleier'],
        ['dad', 'тато', 'pappa'], ['cook', 'кухар', 'kokk'], ['hungry', 'голодний', 'sulten'], ['ready', 'готовий', 'klar'], ['grandma', 'бабуся', 'bestemor'],
        ['years old', 'років (про вік)', 'år gammel'], ['young at heart', 'молодий душею', 'ung til sinns'], ['cat', 'кіт', 'katt'], ['lazy', 'ледачий', 'lat'],
        ['nice', 'гарний, приємний', 'hyggelig'], ['happy', 'щасливий', 'glad'], ['this is', 'це (знайомлю)', 'dette er'], ['his', 'його', 'hans'], ['her', 'її', 'hennes']
      ]
    },
    {
      id: 'e10', level: 'A1', category: 'hverdag', style: 'strip', grammar: 'routine',
      title: 'What Time Is It?', titleUk: 'Котра година?', titleNo: 'Hva er klokka?',
      summaryUk: 'Один день Лео від будильника до сну: години й звички в Present Simple.', summaryEn: 'Leo’s day from the alarm clock to bedtime: telling the time and daily habits.', summaryNo: 'Leos dag fra vekkerklokka til leggetid: klokka og daglige vaner.',
      cover: 3,
      panels: [
        { art: { bg: 'home', chars: [{ id: 'mamma', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'sad' }], props: [{ type: 'clock', x: 210, y: 130, time: '07:00' }] }, lines: [
          { who: 'mamma', en: 'Wake up, Leo! It is seven o\'clock.', uk: 'Прокидайся, Лео! Сьома година.', no: 'Våkn opp, Leo! Klokka er sju.' },
          { who: 'leo', en: 'Five more minutes, please!', uk: 'Ще п’ять хвилин, будь ласка!', no: 'Fem minutter til, er du snill!' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'leo', x: 300, mood: 'happy', pose: 'hold' }, { id: 'mamma', x: 120, mood: 'happy' }], props: [{ type: 'bowl', x: 280, y: 250, front: true }, { type: 'milk', x: 330, y: 250, front: true }] }, lines: [
          { who: 'mamma', en: 'What do you want for breakfast?', uk: 'Що ти хочеш на сніданок?', no: 'Hva vil du ha til frokost?' },
          { who: 'leo', en: 'I always eat cereal with milk.', uk: 'Я завжди їм пластівці з молоком.', no: 'Jeg spiser alltid frokostblanding med melk.' }
        ]},
        { art: { bg: 'bus', sign: 'SCHOOL', chars: [{ id: 'kari', x: 110, mood: 'happy', pose: 'wave' }, { id: 'leo', x: 300, mood: 'happy' }] }, lines: [
          { who: 'kari', en: 'Good morning! The bus leaves at half past seven.', uk: 'Доброго ранку! Автобус рушає о пів на восьму.', no: 'God morgen! Bussen går halv åtte.' },
          { who: 'leo', en: 'I take this bus every morning.', uk: 'Я їжджу цим автобусом щоранку.', no: 'Jeg tar denne bussen hver morgen.' }
        ]},
        { art: { bg: 'school', board: 'LUNCH 12:00', chars: [{ id: 'laerer', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'grin', pose: 'cheer' }] }, lines: [
          { who: 'laerer', en: 'What time is it, Leo?', uk: 'Котра година, Лео?', no: 'Hva er klokka, Leo?' },
          { who: 'leo', en: 'It is twelve o\'clock. Time for lunch!', uk: 'Дванадцята година. Час обідати!', no: 'Klokka er tolv. Tid for lunsj!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'nora', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'ball', x: 210 }] }, lines: [
          { who: 'nora', en: 'Do you play football after school?', uk: 'Ти граєш у футбол після школи?', no: 'Spiller du fotball etter skolen?' },
          { who: 'leo', en: 'Yes, I play on Mondays and Fridays.', uk: 'Так, я граю по понеділках і п’ятницях.', no: 'Ja, jeg spiller på mandager og fredager.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'leo', x: 300, mood: 'sad', pose: 'wave' }, { id: 'mamma', x: 120, mood: 'happy' }], props: [{ type: 'clock', x: 210, y: 130, time: '09:00' }] }, lines: [
          { who: 'mamma', en: 'It is nine o\'clock. Time for bed!', uk: 'Дев’ята година. Час спати!', no: 'Klokka er ni. Nå er det leggetid!' },
          { who: 'leo', en: 'Goodnight, Mum. See you in the morning.', uk: 'На добраніч, мамо. Побачимося вранці.', no: 'God natt, mamma. Vi ses i morgen tidlig.' }
        ]}
      ],
      vocab: [
        ['wake up', 'прокидатися', 'våkne'], ['o\'clock', 'година (рівно)', 'klokka (hel time)'], ['minutes', 'хвилини', 'minutter'], ['breakfast', 'сніданок', 'frokost'],
        ['always', 'завжди', 'alltid'], ['cereal', 'пластівці', 'frokostblanding'], ['leaves', 'рушає, від’їжджає', 'går (om buss)'], ['half past seven', 'пів на восьму', 'halv åtte'],
        ['every morning', 'щоранку', 'hver morgen'], ['what time is it', 'котра година', 'hva er klokka'], ['lunch', 'обід', 'lunsj'], ['football', 'футбол', 'fotball'],
        ['after school', 'після школи', 'etter skolen'], ['Mondays', 'понеділки', 'mandager'], ['Fridays', 'п’ятниці', 'fredager'], ['time for bed', 'час спати', 'leggetid'], ['goodnight', 'на добраніч', 'god natt']
      ]
    },
    {
      id: 'e11', level: 'A1', category: 'skole', style: 'strip', grammar: 'have-got',
      title: 'Have You Got a Pet?', titleUk: 'У тебе є домашня тварина?', titleNo: 'Har du et kjæledyr?',
      summaryUk: 'Урок про домашніх тварин: have got / has got, кольори й частини тіла.', summaryEn: 'A lesson about pets: have got / has got, colours and body parts.', summaryNo: 'En time om kjæledyr: have got / has got, farger og kroppsdeler.',
      cover: 4,
      panels: [
        { art: { bg: 'school', board: 'PETS', chars: [{ id: 'laerer', x: 110, mood: 'happy', pose: 'point' }, { id: 'nora', x: 300, mood: 'happy', pose: 'wave' }] }, lines: [
          { who: 'laerer', en: 'Today we talk about pets. Have you got a pet, Nora?', uk: 'Сьогодні говоримо про домашніх тварин. У тебе є тварина, Норо?', no: 'I dag snakker vi om kjæledyr. Har du et kjæledyr, Nora?' },
          { who: 'nora', en: 'Yes, I have got a little dog. His name is Max.', uk: 'Так, у мене є маленький пес. Його звати Макс.', no: 'Ja, jeg har en liten hund. Han heter Max.' }
        ]},
        { art: { bg: 'school', board: 'PETS', chars: [{ id: 'humphrey', x: 110, mood: 'grin', pose: 'hold' }, { id: 'laerer', x: 300, mood: 'happy' }] }, lines: [
          { who: 'humphrey', en: 'I have got two fish. They are orange.', uk: 'У мене дві рибки. Вони помаранчеві.', no: 'Jeg har to fisker. De er oransje.' },
          { who: 'laerer', en: 'Lovely! Fish are quiet pets.', uk: 'Чудово! Рибки — тихі тварини.', no: 'Så fint! Fisker er rolige kjæledyr.' }
        ]},
        { art: { bg: 'school', board: 'PETS', chars: [{ id: 'mia', x: 110, mood: 'sad' }, { id: 'laerer', x: 300, mood: 'happy', pose: 'point' }] }, lines: [
          { who: 'mia', en: 'I haven\'t got a pet, but my grandma has got a cat.', uk: 'У мене немає тварини, але в моєї бабусі є кіт.', no: 'Jeg har ikke noe kjæledyr, men bestemor har en katt.' },
          { who: 'laerer', en: 'Has the cat got a name?', uk: 'А в кота є ім’я?', no: 'Har katten et navn?' }
        ]},
        { art: { bg: 'school', board: 'PETS', chars: [{ id: 'mia', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'laerer', x: 300, mood: 'surprised' }] }, lines: [
          { who: 'mia', en: 'Yes! He has got a funny name — Pus.', uk: 'Так! У нього смішне ім’я — Пус.', no: 'Ja! Han har et morsomt navn – Pus.' },
          { who: 'laerer', en: 'Has he got a long tail?', uk: 'У нього довгий хвіст?', no: 'Har han en lang hale?' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'bestemor', x: 320, mood: 'grin' }, { id: 'pus', x: 210 }, { id: 'mia', x: 90, mood: 'happy', pose: 'point' }] }, lines: [
          { who: 'mia', en: 'Look, he has got green eyes and a long tail!', uk: 'Дивись, у нього зелені очі й довгий хвіст!', no: 'Se, han har grønne øyne og en lang hale!' },
          { who: 'bestemor', en: 'And he has got a big appetite!', uk: 'А ще в нього великий апетит!', no: 'Og han har god appetitt!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'nora', x: 110, mood: 'happy', pose: 'wave' }, { id: 'mia', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'ball', x: 210 }] }, lines: [
          { who: 'nora', en: 'Come to the park with Max and me on Saturday!', uk: 'Приходь у парк зі мною й Максом у суботу!', no: 'Bli med Max og meg i parken på lørdag!' },
          { who: 'mia', en: 'Great! Animals make me happy.', uk: 'Чудово! Тварини роблять мене щасливою.', no: 'Så bra! Dyr gjør meg glad.' }
        ]}
      ],
      vocab: [
        ['pet', 'домашня тварина', 'kjæledyr'], ['have got', 'мати', 'ha'], ['dog', 'пес', 'hund'], ['little', 'маленький', 'liten'], ['fish', 'риба', 'fisk'],
        ['orange', 'помаранчевий', 'oransje'], ['quiet', 'тихий', 'rolig'], ['haven\'t got', 'не мати', 'ikke ha'], ['name', 'ім’я', 'navn'], ['funny', 'смішний', 'morsom'],
        ['long', 'довгий', 'lang'], ['tail', 'хвіст', 'hale'], ['green', 'зелений', 'grønn'], ['eyes', 'очі', 'øyne'], ['appetite', 'апетит', 'appetitt'],
        ['animals', 'тварини', 'dyr'], ['Saturday', 'субота', 'lørdag']
      ]
    },
    {
      id: 'e12', level: 'A1', category: 'mat', style: 'strip', grammar: 'would-like',
      title: 'At the Café', titleUk: 'У кав’ярні', titleNo: 'På kafeen',
      summaryUk: 'Гамфрі й Аліна замовляють у кав’ярні: would like, can I have, рахунок.', summaryEn: 'Humphrey and Alina order at a café: would like, can I have and the bill.', summaryNo: 'Humphrey og Alina bestiller på kafé: would like, can I have og regningen.',
      cover: 4,
      panels: [
        { art: { bg: 'shop', chars: [{ id: 'humphrey', x: 300, mood: 'happy', pose: 'wave' }, { id: 'kasserer', x: 110, mood: 'happy' }], props: [{ type: 'counter', x: 110 }] }, lines: [
          { who: 'kasserer', en: 'Hello! What would you like?', uk: 'Привіт! Що бажаєте?', no: 'Hei! Hva vil du ha?' },
          { who: 'humphrey', en: 'I would like a hot chocolate, please.', uk: 'Я б хотів гарячий шоколад, будь ласка.', no: 'Jeg vil gjerne ha en kakao, takk.' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'humphrey', x: 300, mood: 'grin', pose: 'point' }, { id: 'kasserer', x: 110, mood: 'happy', pose: 'hold' }], props: [{ type: 'counter', x: 110 }, { type: 'mug', x: 150, y: 215, front: true }] }, lines: [
          { who: 'kasserer', en: 'Small or large?', uk: 'Маленький чи великий?', no: 'Liten eller stor?' },
          { who: 'humphrey', en: 'Large, please. And can I have a waffle too?', uk: 'Великий, будь ласка. І можна мені ще вафлю?', no: 'Stor, takk. Og kan jeg få en vaffel også?' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'wave' }, { id: 'humphrey', x: 300, mood: 'happy' }], props: [{ type: 'table', x: 300 }] }, lines: [
          { who: 'alina', en: 'Hi, Humphrey! Can I sit here?', uk: 'Привіт, Гамфрі! Можна я тут сяду?', no: 'Hei, Humphrey! Kan jeg sitte her?' },
          { who: 'humphrey', en: 'Of course! Would you like something to eat?', uk: 'Звісно! Хочеш щось поїсти?', no: 'Selvfølgelig! Vil du ha noe å spise?' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'alina', x: 110, mood: 'happy', pose: 'point' }, { id: 'kasserer', x: 300, mood: 'happy' }], props: [{ type: 'counter', x: 300 }, { type: 'cheese', x: 270, y: 215, front: true }] }, lines: [
          { who: 'alina', en: 'I would like a cheese sandwich and a glass of water.', uk: 'Я б хотіла сендвіч із сиром і склянку води.', no: 'Jeg vil gjerne ha et ostesmørbrød og et glass vann.' },
          { who: 'kasserer', en: 'That is seven pounds, please.', uk: 'З вас сім фунтів, будь ласка.', no: 'Det blir sju pund, takk.' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'humphrey', x: 110, mood: 'grin', pose: 'hold' }, { id: 'alina', x: 300, mood: 'happy' }], props: [{ type: 'table', x: 210 }, { type: 'waffles', x: 170, y: 228, front: true }, { type: 'glass', x: 250, y: 228, front: true }] }, lines: [
          { who: 'humphrey', en: 'This waffle is delicious!', uk: 'Ця вафля просто смакота!', no: 'Denne vaffelen er nydelig!' },
          { who: 'alina', en: 'My sandwich is very good too.', uk: 'Мій сендвіч теж дуже смачний.', no: 'Smørbrødet mitt er også veldig godt.' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'humphrey', x: 110, mood: 'happy', pose: 'point' }, { id: 'kasserer', x: 300, mood: 'grin', pose: 'wave' }], props: [{ type: 'note', x: 210, y: 230, front: true }] }, lines: [
          { who: 'humphrey', en: 'Can we have the bill, please?', uk: 'Можна нам рахунок, будь ласка?', no: 'Kan vi få regningen, takk?' },
          { who: 'kasserer', en: 'Here you are. Have a nice day!', uk: 'Прошу. Гарного дня!', no: 'Vær så god. Ha en fin dag!' }
        ]}
      ],
      vocab: [
        ['would like', 'хотів би', 'vil gjerne ha'], ['hot chocolate', 'гарячий шоколад', 'kakao'], ['small', 'маленький', 'liten'], ['large', 'великий', 'stor'],
        ['can I have', 'можна мені', 'kan jeg få'], ['waffle', 'вафля', 'vaffel'], ['sit', 'сидіти', 'sitte'], ['something to eat', 'щось поїсти', 'noe å spise'],
        ['cheese', 'сир', 'ost'], ['sandwich', 'сендвіч', 'smørbrød'], ['glass of water', 'склянка води', 'et glass vann'], ['pounds', 'фунти', 'pund'],
        ['delicious', 'дуже смачний', 'nydelig'], ['bill', 'рахунок', 'regning'], ['here you are', 'прошу, ось', 'vær så god'], ['have a nice day', 'гарного дня', 'ha en fin dag']
      ]
    },
    {
      id: 'e13', level: 'A1', category: 'natur', style: 'strip', grammar: 'there-is',
      title: 'In the Park', titleUk: 'У парку', titleNo: 'I parken',
      summaryUk: 'Прогулянка з бабусею: there is / there are і де що знаходиться.', summaryEn: 'A walk with Grandma: there is / there are and where things are.', summaryNo: 'En tur med bestemor: there is / there are og hvor ting er.',
      cover: 4,
      panels: [
        { art: { bg: 'park', chars: [{ id: 'bestemor', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'surprised' }] }, lines: [
          { who: 'bestemor', en: 'There is a big tree in the middle of the park.', uk: 'Посеред парку є велике дерево.', no: 'Det er et stort tre midt i parken.' },
          { who: 'leo', en: 'And there are two birds in the tree!', uk: 'А на дереві дві пташки!', no: 'Og det er to fugler i treet!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'mia', x: 110, mood: 'sad' }, { id: 'leo', x: 300, mood: 'happy', pose: 'point' }], props: [{ type: 'ball', x: 40 }] }, lines: [
          { who: 'mia', en: 'Where is my ball?', uk: 'Де мій м’яч?', no: 'Hvor er ballen min?' },
          { who: 'leo', en: 'It is under the bench, behind you.', uk: 'Він під лавкою, позаду тебе.', no: 'Den er under benken, bak deg.' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'leo', x: 110, mood: 'surprised', pose: 'point' }, { id: 'bestemor', x: 300, mood: 'happy' }], props: [{ type: 'bike', x: 210 }] }, lines: [
          { who: 'leo', en: 'Is there a playground in this park?', uk: 'Чи є в цьому парку дитячий майданчик?', no: 'Er det en lekeplass i denne parken?' },
          { who: 'bestemor', en: 'Yes, there is one near the café.', uk: 'Так, є — біля кав’ярні.', no: 'Ja, det er en ved kafeen.' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'mia', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'leo', x: 300, mood: 'grin', pose: 'point' }] }, lines: [
          { who: 'mia', en: 'There are many children on the swings!', uk: 'На гойдалках багато дітей!', no: 'Det er mange barn på huskene!' },
          { who: 'leo', en: 'Let\'s go on the slide!', uk: 'Ходімо на гірку!', no: 'Kom, vi tar sklia!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'bestemor', x: 110, mood: 'happy', pose: 'hold' }, { id: 'mia', x: 300, mood: 'grin', pose: 'cheer' }], props: [{ type: 'icecream', x: 150, y: 215, front: true }] }, lines: [
          { who: 'bestemor', en: 'There is an ice cream van over there. Who wants ice cream?', uk: 'Он там фургон із морозивом. Хто хоче морозива?', no: 'Der borte står det en isbil. Hvem vil ha is?' },
          { who: 'mia', en: 'Me! Can I have strawberry, please?', uk: 'Я! Можна мені полуничне, будь ласка?', no: 'Jeg! Kan jeg få jordbæris?' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'leo', x: 90, mood: 'grin', pose: 'cheer' }, { id: 'bestemor', x: 210, mood: 'happy' }, { id: 'mia', x: 330, mood: 'happy', pose: 'wave' }] }, lines: [
          { who: 'leo', en: 'There isn\'t a better park in the city!', uk: 'Немає кращого парку в місті!', no: 'Det finnes ingen bedre park i byen!' },
          { who: 'bestemor', en: 'Let\'s come back next Sunday.', uk: 'Повернімося сюди наступної неділі.', no: 'La oss komme tilbake neste søndag.' }
        ]}
      ],
      vocab: [
        ['there is', 'є (одне)', 'det er'], ['there are', 'є (багато)', 'det er'], ['tree', 'дерево', 'tre'], ['in the middle of', 'посередині', 'midt i'], ['birds', 'птахи', 'fugler'],
        ['ball', 'м’яч', 'ball'], ['under', 'під', 'under'], ['bench', 'лавка', 'benk'], ['behind', 'позаду', 'bak'], ['playground', 'дитячий майданчик', 'lekeplass'],
        ['near', 'біля', 'ved, nær'], ['children', 'діти', 'barn'], ['swings', 'гойдалки', 'husker'], ['slide', 'гірка', 'sklie'], ['ice cream', 'морозиво', 'is'],
        ['over there', 'он там', 'der borte'], ['strawberry', 'полуниця', 'jordbær'], ['next Sunday', 'наступної неділі', 'neste søndag']
      ]
    },
    {
      id: 'e14', level: 'A1', category: 'natur', style: 'strip', grammar: 'weather',
      title: 'What’s the Weather Like?', titleUk: 'Яка сьогодні погода?', titleNo: 'Hvordan er været?',
      summaryUk: 'Сніг, дощ і сонце: погода, пори року й It is cold / It is raining.', summaryEn: 'Snow, rain and sun: weather, seasons and It is cold / It is raining.', summaryNo: 'Snø, regn og sol: vær, årstider og It is cold / It is raining.',
      cover: 1,
      panels: [
        { art: { bg: 'winter', chars: [{ id: 'nora', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'pappa', x: 300, mood: 'happy', pose: 'point' }] }, lines: [
          { who: 'nora', en: 'Dad, look! It is snowing!', uk: 'Тату, дивись! Падає сніг!', no: 'Pappa, se! Det snør!' },
          { who: 'pappa', en: 'Put on your hat and gloves. It is very cold.', uk: 'Вдягни шапку й рукавиці. Дуже холодно.', no: 'Ta på deg lue og votter. Det er veldig kaldt.' }
        ]},
        { art: { bg: 'winter', chars: [{ id: 'mia', x: 110, mood: 'happy', pose: 'point' }, { id: 'nora', x: 300, mood: 'grin', pose: 'hold' }], props: [{ type: 'snowman', x: 210 }, { type: 'snowball', x: 270, y: 240, front: true }] }, lines: [
          { who: 'mia', en: 'Let\'s make a snowman!', uk: 'Зліпімо сніговика!', no: 'Kom, vi lager en snømann!' },
          { who: 'nora', en: 'Yes! And then we can have a snowball fight.', uk: 'Так! А потім можемо погратися в сніжки.', no: 'Ja! Og så kan vi ha snøballkrig.' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'pappa', x: 110, mood: 'happy', pose: 'point' }, { id: 'nora', x: 300, mood: 'happy', pose: 'hold' }], props: [{ type: 'mug', x: 330, y: 230, front: true }] }, lines: [
          { who: 'pappa', en: 'Winter is cold, but summer is hot and sunny.', uk: 'Зима холодна, а літо спекотне й сонячне.', no: 'Vinteren er kald, men sommeren er varm og solrik.' },
          { who: 'nora', en: 'My favourite season is spring.', uk: 'Моя улюблена пора року — весна.', no: 'Favorittårstiden min er våren.' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'mia', x: 110, mood: 'sad', pose: 'hold' }, { id: 'nora', x: 300, mood: 'happy', pose: 'point' }], props: [{ type: 'umbrella', x: 300 }] }, lines: [
          { who: 'mia', en: 'It is raining today. Where is my umbrella?', uk: 'Сьогодні дощ. Де моя парасолька?', no: 'Det regner i dag. Hvor er paraplyen min?' },
          { who: 'nora', en: 'It is in your bag! And it is windy too.', uk: 'Вона в твоїй сумці! І ще вітряно.', no: 'Den er i sekken din! Og det blåser også.' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'pappa', x: 110, mood: 'happy' }, { id: 'mia', x: 300, mood: 'grin', pose: 'cheer' }] }, lines: [
          { who: 'pappa', en: 'What\'s the weather like tomorrow?', uk: 'Яка погода буде завтра?', no: 'Hvordan blir været i morgen?' },
          { who: 'mia', en: 'Tomorrow is sunny and warm, I think!', uk: 'Думаю, завтра сонячно й тепло!', no: 'I morgen blir det sol og varmt, tror jeg!' }
        ]},
        { art: { bg: 'park', chars: [{ id: 'nora', x: 90, mood: 'happy', pose: 'wave' }, { id: 'mia', x: 210, mood: 'grin' }, { id: 'pappa', x: 330, mood: 'happy', pose: 'hold' }] }, lines: [
          { who: 'nora', en: 'I love every season.', uk: 'Я люблю кожну пору року.', no: 'Jeg elsker alle årstidene.' },
          { who: 'pappa', en: 'Me too. Every day the weather is different.', uk: 'Я теж. Щодня погода інакша.', no: 'Jeg også. Været er forskjellig hver dag.' }
        ]}
      ],
      vocab: [
        ['weather', 'погода', 'vær'], ['snowing', 'падає сніг', 'det snør'], ['hat', 'шапка', 'lue'], ['gloves', 'рукавиці', 'votter'], ['cold', 'холодний', 'kald'],
        ['snowman', 'сніговик', 'snømann'], ['snowball fight', 'гра в сніжки', 'snøballkrig'], ['winter', 'зима', 'vinter'], ['summer', 'літо', 'sommer'], ['hot', 'спекотний', 'varm'],
        ['sunny', 'сонячний', 'solrik'], ['favourite', 'улюблений', 'favoritt'], ['season', 'пора року', 'årstid'], ['spring', 'весна', 'vår'], ['raining', 'іде дощ', 'det regner'],
        ['umbrella', 'парасолька', 'paraply'], ['windy', 'вітряно', 'det blåser'], ['tomorrow', 'завтра', 'i morgen'], ['warm', 'теплий', 'varm'], ['different', 'інший, різний', 'forskjellig']
      ]
    },
    {
      id: 'e15', level: 'A2', category: 'hverdag', style: 'strip', grammar: 'present-simple',
      title: 'Musa’s Busy Morning', titleUk: 'Метушливий ранок Муси', titleNo: 'Musas travle morgen',
      summaryUk: 'Ранок Муси і двох його доньок: he gets up, she sleeps, always / never.', summaryEn: 'Musa’s morning with his two daughters: he gets up, she sleeps, always / never.', summaryNo: 'Morgenen til Musa og de to døtrene hans: he gets up, she sleeps, always / never.',
      cover: 3,
      panels: [
        { art: { bg: 'kitchen', chars: [{ id: 'musa', x: 150, mood: 'happy', pose: 'hold', s: 0.9 }], props: [{ type: 'clock', x: 300, y: 130, time: '06:30' }, { type: 'mug', x: 190, y: 235, front: true }] }, lines: [
          { who: 'narrator', en: 'Musa gets up at six thirty every morning.', uk: 'Муса встає о шостій тридцять щоранку.', no: 'Musa står opp halv sju hver morgen.' },
          { who: 'musa', en: 'Coffee first, then everything else!', uk: 'Спочатку кава, а потім усе інше!', no: 'Kaffe først, så alt det andre!' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'musa', x: 110, mood: 'happy', pose: 'point', s: 0.9 }, { id: 'storesoster', x: 300, mood: 'angry' }], props: [{ type: 'bread', x: 210, y: 240, front: true }] }, lines: [
          { who: 'musa', en: 'Wake up, girls! The school bus never waits.', uk: 'Прокидайтеся, дівчата! Шкільний автобус ніколи не чекає.', no: 'Våkn opp, jenter! Skolebussen venter aldri.' },
          { who: 'storesoster', en: 'Dad, my sister always takes the bathroom first!', uk: 'Тату, сестра завжди першою займає ванну!', no: 'Pappa, søsteren min tar alltid badet først!' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'lillesoster', x: 110, mood: 'grin', pose: 'hold' }, { id: 'musa', x: 300, mood: 'surprised', s: 0.9 }], props: [{ type: 'bowl', x: 150, y: 245, front: true }] }, lines: [
          { who: 'lillesoster', en: 'She usually sleeps until seven.', uk: 'Вона зазвичай спить до сьомої.', no: 'Hun sover vanligvis til sju.' },
          { who: 'musa', en: 'Well, today she gets up now!', uk: 'Що ж, сьогодні вона встає вже зараз!', no: 'Vel, i dag står hun opp nå!' }
        ]},
        { art: { bg: 'street', chars: [{ id: 'musa', x: 170, mood: 'grin', pose: 'cheer', s: 0.9 }], props: [{ type: 'bike', x: 280 }] }, lines: [
          { who: 'narrator', en: 'Musa often rides his bike to work. He loves speed!', uk: 'Муса часто їздить на роботу велосипедом. Він обожнює швидкість!', no: 'Musa sykler ofte til jobben. Han elsker fart!' },
          { who: 'musa', en: 'It only takes ten minutes by bike.', uk: 'Велосипедом це лише десять хвилин.', no: 'Det tar bare ti minutter med sykkel.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'musa', x: 300, mood: 'happy', s: 0.9 }, { id: 'alina', x: 110, mood: 'happy', pose: 'wave' }], props: [{ type: 'computer', x: 210, y: 240 }] }, lines: [
          { who: 'alina', en: 'Good morning, Musa! You are early again.', uk: 'Доброго ранку, Мусо! Ти знову рано.', no: 'God morgen, Musa! Du er tidlig ute igjen.' },
          { who: 'musa', en: 'I sometimes arrive late, but never on Mondays!', uk: 'Іноді я спізнююся, але ніколи — по понеділках!', no: 'Noen ganger kommer jeg for sent, men aldri på mandager!' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'musa', x: 220, mood: 'happy', s: 0.9 }, { id: 'storesoster', x: 100, mood: 'happy' }, { id: 'lillesoster', x: 330, mood: 'grin', pose: 'cheer' }], props: [{ type: 'sofa', x: 200 }] }, lines: [
          { who: 'storesoster', en: 'Dad, do you ever rest?', uk: 'Тату, а ти колись відпочиваєш?', no: 'Pappa, hviler du noen gang?' },
          { who: 'musa', en: 'Yes! Every evening I relax with you two.', uk: 'Так! Щовечора я відпочиваю з вами двома.', no: 'Ja! Hver kveld slapper jeg av med dere to.' }
        ]}
      ],
      vocab: [
        ['gets up', 'встає', 'står opp'], ['every morning', 'щоранку', 'hver morgen'], ['coffee', 'кава', 'kaffe'], ['first', 'спочатку, першим', 'først'],
        ['never', 'ніколи', 'aldri'], ['waits', 'чекає', 'venter'], ['always', 'завжди', 'alltid'], ['bathroom', 'ванна кімната', 'bad'], ['usually', 'зазвичай', 'vanligvis'],
        ['until', 'до (часу)', 'til'], ['often', 'часто', 'ofte'], ['rides a bike', 'їздить на велосипеді', 'sykler'], ['speed', 'швидкість', 'fart'], ['early', 'рано', 'tidlig'],
        ['sometimes', 'іноді', 'noen ganger'], ['late', 'пізно, із запізненням', 'for sent'], ['rest', 'відпочивати', 'hvile'], ['relax', 'розслаблятися', 'slappe av'], ['evening', 'вечір', 'kveld']
      ]
    },
    {
      id: 'e16', level: 'A2', category: 'fritid', style: 'strip', grammar: 'present-continuous',
      title: 'What Are You Doing?', titleUk: 'Що ти зараз робиш?', titleNo: 'Hva gjør du?',
      summaryUk: 'Телефонна розмова, торт і трохи диму: Present Continuous — що відбувається просто зараз.', summaryEn: 'A phone call, a cake and a bit of smoke: the Present Continuous for things happening right now.', summaryNo: 'En telefonsamtale, en kake og litt røyk: Present Continuous om det som skjer akkurat nå.',
      cover: 3,
      panels: [
        { art: { bg: 'home', chars: [{ id: 'leo', x: 130, mood: 'happy', pose: 'hold' }, { id: 'pus', x: 300 }], props: [{ type: 'phone', x: 165, y: 205, front: true }, { type: 'sofa', x: 300 }] }, lines: [
          { who: 'narrator', en: 'Leo is calling his friend Nora.', uk: 'Лео телефонує своїй подрузі Норі.', no: 'Leo ringer til venninnen sin Nora.' },
          { who: 'leo', en: 'Hi, Nora! What are you doing right now?', uk: 'Привіт, Норо! Що ти зараз робиш?', no: 'Hei, Nora! Hva gjør du akkurat nå?' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'nora', x: 110, mood: 'happy', pose: 'hold' }, { id: 'mamma', x: 300, mood: 'grin' }], props: [{ type: 'flour', x: 200, y: 240, front: true }, { type: 'eggs', x: 250, y: 240, front: true }] }, lines: [
          { who: 'nora', en: 'I am baking a cake with my mum.', uk: 'Я печу торт із мамою.', no: 'Jeg baker en kake med mamma.' },
          { who: 'mamma', en: 'And we are making a big mess!', uk: 'І ми робимо великий безлад!', no: 'Og vi lager et stort rot!' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'leo', x: 110, mood: 'grin', pose: 'hold' }, { id: 'pappa', x: 300, mood: 'angry', pose: 'point' }], props: [{ type: 'phone', x: 145, y: 205, front: true }, { type: 'computer', x: 220, y: 240 }] }, lines: [
          { who: 'leo', en: 'Dad is watching football and shouting at the TV.', uk: 'Тато дивиться футбол і кричить на телевізор.', no: 'Pappa ser på fotball og roper til TV-en.' },
          { who: 'pappa', en: 'Come on! Why are they playing so slowly?', uk: 'Ну ж бо! Чому вони грають так повільно?', no: 'Kom igjen! Hvorfor spiller de så sakte?' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'nora', x: 300, mood: 'surprised' }, { id: 'mamma', x: 110, mood: 'surprised', pose: 'point' }], props: [{ type: 'cake', x: 210, y: 240, front: true }] }, lines: [
          { who: 'mamma', en: 'Oh no! Something is burning!', uk: 'Ой ні! Щось горить!', no: 'Å nei! Noe brenner seg!' },
          { who: 'nora', en: 'Leo, I am hanging up! The cake is burning!', uk: 'Лео, я кладу слухавку! Торт горить!', no: 'Leo, jeg legger på! Kaka brenner seg!' }
        ]},
        { art: { bg: 'home', chars: [{ id: 'leo', x: 120, mood: 'surprised', pose: 'hold' }, { id: 'pus', x: 300 }], props: [{ type: 'phone', x: 155, y: 205, front: true }, { type: 'sofa', x: 300 }] }, lines: [
          { who: 'leo', en: 'She is hanging up? What is happening over there?', uk: 'Вона кладе слухавку? Що там відбувається?', no: 'Legger hun på? Hva skjer der borte?' },
          { who: 'narrator', en: 'Pus is sleeping on the sofa and does not care.', uk: 'Пус спить на дивані, і йому байдуже.', no: 'Pus sover på sofaen og bryr seg ikke.' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'nora', x: 110, mood: 'grin', pose: 'hold' }, { id: 'mamma', x: 300, mood: 'happy' }], props: [{ type: 'cake', x: 160, y: 240, front: true }] }, lines: [
          { who: 'nora', en: 'The cake is a little black, but it is still tasty!', uk: 'Торт трохи чорний, але все одно смачний!', no: 'Kaka er litt svart, men den smaker fortsatt godt!' },
          { who: 'mamma', en: 'We are still learning, Nora!', uk: 'Ми ще вчимося, Норо!', no: 'Vi lærer fortsatt, Nora!' }
        ]}
      ],
      vocab: [
        ['calling', 'телефонує', 'ringer'], ['what are you doing', 'що ти робиш', 'hva gjør du'], ['right now', 'просто зараз', 'akkurat nå'], ['baking', 'пече', 'baker'],
        ['cake', 'торт', 'kake'], ['mess', 'безлад', 'rot'], ['watching', 'дивиться', 'ser på'], ['shouting', 'кричить', 'roper'], ['slowly', 'повільно', 'sakte'],
        ['burning', 'горить', 'brenner seg'], ['hanging up', 'кладе слухавку', 'legger på'], ['happening', 'відбувається', 'skjer'], ['sleeping', 'спить', 'sover'],
        ['sofa', 'диван', 'sofa'], ['does not care', 'байдуже', 'bryr seg ikke'], ['tasty', 'смачний', 'god'], ['still', 'все ще, все одно', 'fortsatt'], ['learning', 'вчимося', 'lærer']
      ]
    },
    {
      id: 'e17', level: 'A2', category: 'fritid', style: 'strip', grammar: 'past-simple',
      title: 'Last Weekend', titleUk: 'Минулі вихідні', titleNo: 'Sist helg',
      summaryUk: 'Марія й Денис розповідають про вихідні: Past Simple — visited, saw, went, didn’t.', summaryEn: 'Maria and Denys talk about their weekend: the Past Simple — visited, saw, went, didn’t.', summaryNo: 'Maria og Denys forteller om helgen: Past Simple – visited, saw, went, didn’t.',
      cover: 1,
      panels: [
        { art: { bg: 'office', chars: [{ id: 'maria', x: 110, mood: 'happy', pose: 'wave' }, { id: 'denys', x: 300, mood: 'grin' }], props: [{ type: 'computer', x: 210, y: 240 }] }, lines: [
          { who: 'maria', en: 'Hi, Denys! How was your weekend?', uk: 'Привіт, Денисе! Як минули вихідні?', no: 'Hei, Denys! Hvordan var helgen din?' },
          { who: 'denys', en: 'It was great! I visited my brother in Bergen.', uk: 'Чудово! Я їздив до брата в Берген.', no: 'Den var kjempefin! Jeg besøkte broren min i Bergen.' }
        ]},
        { art: { bg: 'mountain', chars: [{ id: 'denys', x: 170, mood: 'grin', pose: 'cheer' }] }, lines: [
          { who: 'denys', en: 'We walked up a mountain and saw the whole city.', uk: 'Ми піднялися на гору й побачили все місто.', no: 'Vi gikk opp på et fjell og så hele byen.' },
          { who: 'narrator', en: 'It rained a little, but the view was amazing.', uk: 'Трохи накрапав дощ, але краєвид був неймовірний.', no: 'Det regnet litt, men utsikten var fantastisk.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'denys', x: 110, mood: 'happy', pose: 'point' }, { id: 'maria', x: 300, mood: 'grin' }] }, lines: [
          { who: 'denys', en: 'What did you do?', uk: 'А ти що робила?', no: 'Hva gjorde du?' },
          { who: 'maria', en: 'I stayed at home and painted my kitchen.', uk: 'Я залишилася вдома й пофарбувала кухню.', no: 'Jeg var hjemme og malte kjøkkenet mitt.' }
        ]},
        { art: { bg: 'kitchen', chars: [{ id: 'maria', x: 150, mood: 'happy', pose: 'hold' }], props: [{ type: 'book', x: 200, y: 215, front: true }, { type: 'bowl', x: 290, y: 245, front: true }] }, lines: [
          { who: 'maria', en: 'Then I made soup and read a good book.', uk: 'Потім я зварила суп і прочитала гарну книжку.', no: 'Så lagde jeg suppe og leste en god bok.' },
          { who: 'narrator', en: 'On Sunday evening she felt very relaxed.', uk: 'У неділю ввечері вона почувалася дуже спокійно.', no: 'Søndag kveld følte hun seg veldig avslappet.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'denys', x: 110, mood: 'surprised' }, { id: 'maria', x: 300, mood: 'happy' }], props: [{ type: 'mug', x: 210, y: 240, front: true }] }, lines: [
          { who: 'denys', en: 'Did you go out on Saturday night?', uk: 'Ти кудись ходила в суботу ввечері?', no: 'Gikk du ut på lørdag kveld?' },
          { who: 'maria', en: 'No, I didn\'t. I went to bed early.', uk: 'Ні. Я рано лягла спати.', no: 'Nei, det gjorde jeg ikke. Jeg la meg tidlig.' }
        ]},
        { art: { bg: 'office', chars: [{ id: 'maria', x: 110, mood: 'grin', pose: 'cheer' }, { id: 'denys', x: 300, mood: 'grin' }] }, lines: [
          { who: 'maria', en: 'But last Friday I danced at a concert!', uk: 'Зате минулої п’ятниці я танцювала на концерті!', no: 'Men sist fredag danset jeg på en konsert!' },
          { who: 'denys', en: 'Wow! So you had a busy week after all.', uk: 'Ого! То в тебе все-таки був насичений тиждень.', no: 'Wow! Så du hadde en travel uke likevel.' }
        ]}
      ],
      vocab: [
        ['weekend', 'вихідні', 'helg'], ['was', 'був, була', 'var'], ['visited', 'відвідав', 'besøkte'], ['brother', 'брат', 'bror'], ['walked up', 'піднялися пішки', 'gikk opp'],
        ['mountain', 'гора', 'fjell'], ['saw', 'побачив', 'så'], ['whole', 'увесь', 'hele'], ['rained', 'ішов дощ', 'regnet'], ['view', 'краєвид', 'utsikt'], ['amazing', 'неймовірний', 'fantastisk'],
        ['stayed at home', 'залишився вдома', 'var hjemme'], ['painted', 'пофарбував', 'malte'], ['made', 'зробив, приготував', 'lagde'], ['soup', 'суп', 'suppe'],
        ['felt', 'почувався', 'følte seg'], ['went to bed', 'ліг спати', 'la seg'], ['last Friday', 'минулої п’ятниці', 'sist fredag'], ['danced', 'танцював', 'danset'], ['busy', 'зайнятий, насичений', 'travel']
      ]
    },
    {
      id: 'e18', level: 'A2', category: 'butikk', style: 'strip', grammar: 'comparatives',
      title: 'Which Bike Is Better?', titleUk: 'Який велосипед кращий?', titleNo: 'Hvilken sykkel er best?',
      summaryUk: 'Лео з татом обирають велосипед: faster than, more expensive, the best.', summaryEn: 'Leo and his dad choose a bike: faster than, more expensive, the best.', summaryNo: 'Leo og pappa velger sykkel: faster than, more expensive, the best.',
      cover: 0,
      panels: [
        { art: { bg: 'shop', chars: [{ id: 'leo', x: 90, mood: 'grin', pose: 'cheer' }, { id: 'pappa', x: 330, mood: 'happy' }], props: [{ type: 'bike', x: 210 }] }, lines: [
          { who: 'leo', en: 'Dad, this red bike is faster than my old one!', uk: 'Тату, цей червоний велосипед швидший за мій старий!', no: 'Pappa, denne røde sykkelen er raskere enn den gamle!' },
          { who: 'pappa', en: 'Yes, but it is also more expensive.', uk: 'Так, але він і дорожчий.', no: 'Ja, men den er også dyrere.' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 110, mood: 'happy', pose: 'point' }, { id: 'pappa', x: 300, mood: 'normal' }], props: [{ type: 'bike', x: 210 }] }, lines: [
          { who: 'kasserer', en: 'This blue bike is cheaper and lighter.', uk: 'Цей синій велосипед дешевший і легший.', no: 'Denne blå sykkelen er billigere og lettere.' },
          { who: 'pappa', en: 'Is it as strong as the red one?', uk: 'Він такий самий міцний, як червоний?', no: 'Er den like sterk som den røde?' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'kasserer', x: 110, mood: 'grin' }, { id: 'leo', x: 300, mood: 'surprised', pose: 'point' }], props: [{ type: 'bike', x: 210 }] }, lines: [
          { who: 'kasserer', en: 'It is the most popular bike in our shop.', uk: 'Це найпопулярніший велосипед у нашому магазині.', no: 'Det er den mest populære sykkelen i butikken vår.' },
          { who: 'leo', en: 'But the red one is the best!', uk: 'Але червоний — найкращий!', no: 'Men den røde er best!' }
        ]},
        { art: { bg: 'shop', chars: [{ id: 'pappa', x: 110, mood: 'happy', pose: 'point' }, { id: 'leo', x: 300, mood: 'sad' }], props: [{ type: 'coins', x: 210, y: 245, front: true }] }, lines: [
          { who: 'pappa', en: 'The red bike is too big for you. The blue one is smaller.', uk: 'Червоний завеликий для тебе. Синій менший.', no: 'Den røde sykkelen er for stor for deg. Den blå er mindre.' },
          { who: 'leo', en: 'Hmm, OK. Smaller is safer, I suppose.', uk: 'Гм, гаразд. Менший — безпечніший, мабуть.', no: 'Hm, ok. Mindre er tryggere, antar jeg.' }
        ]},
        { art: { bg: 'street', chars: [{ id: 'leo', x: 120, mood: 'grin', pose: 'cheer' }, { id: 'pappa', x: 310, mood: 'happy', pose: 'wave' }], props: [{ type: 'bike', x: 200 }] }, lines: [
          { who: 'leo', en: 'Wow, it is easier to ride than my old bike!', uk: 'Ого, на ньому їздити легше, ніж на старому!', no: 'Wow, den er lettere å sykle på enn den gamle!' },
          { who: 'pappa', en: 'And you are the happiest boy in the street!', uk: 'А ти — найщасливіший хлопчик на вулиці!', no: 'Og du er den lykkeligste gutten i gata!' }
        ]},
        { art: { bg: 'street', chars: [{ id: 'leo', x: 300, mood: 'grin' }, { id: 'nora', x: 110, mood: 'surprised', pose: 'point' }], props: [{ type: 'bike', x: 200 }] }, lines: [
          { who: 'nora', en: 'Is that your new bike? It is cooler than mine!', uk: 'Це твій новий велосипед? Він крутіший за мій!', no: 'Er det den nye sykkelen din? Den er kulere enn min!' },
          { who: 'leo', en: 'Thanks! But the best bike is the one you ride every day.', uk: 'Дякую! Але найкращий велосипед — той, на якому їздиш щодня.', no: 'Takk! Men den beste sykkelen er den du sykler på hver dag.' }
        ]}
      ],
      vocab: [
        ['bike', 'велосипед', 'sykkel'], ['red', 'червоний', 'rød'], ['faster than', 'швидший за', 'raskere enn'], ['old', 'старий', 'gammel'], ['more expensive', 'дорожчий', 'dyrere'],
        ['blue', 'синій', 'blå'], ['cheaper', 'дешевший', 'billigere'], ['lighter', 'легший', 'lettere'], ['as strong as', 'такий самий міцний, як', 'like sterk som'],
        ['the most popular', 'найпопулярніший', 'den mest populære'], ['the best', 'найкращий', 'best'], ['too big', 'завеликий', 'for stor'], ['smaller', 'менший', 'mindre'],
        ['safer', 'безпечніший', 'tryggere'], ['I suppose', 'мабуть', 'antar jeg'], ['easier', 'легший (простіший)', 'lettere'], ['the happiest', 'найщасливіший', 'den lykkeligste'], ['cooler', 'крутіший', 'kulere']
      ]
    }
  );
})();
