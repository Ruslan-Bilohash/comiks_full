/*
 * Тематичні слова, частина 4 — те, чого бракувало в перших трьох:
 * алергії та склад їжі, знижки й цінники, кімнати житла, самопочуття,
 * прибирання, сусіди, аптека без рецепта, дрібний ремонт.
 *
 * Чому саме ці теми: перші три частини добре покривають «що це» (меблі, одяг,
 * професії), але майже не дають слів для «що з цим робити» — сказати про
 * алергію, спитати про знижку, пояснити, що тече кран. Саме цих слів бракує
 * в розмові, а не назв предметів.
 *
 * Формат той самий: [норвезькою (з артиклем), uk, en, emoji].
 * Файл лише дописує теми в кінець WORDS.themes — сторінка «Слова», тести й
 * картки підхоплять їх самі.
 */
(() => {
  'use strict';
  if (!window.WORDS || !Array.isArray(window.WORDS.themes)) return;
  window.WORDS.themes.push(
    { id: 'allergi', icon: '🥜', level: 'B1', no: 'Allergi og innhold', uk: 'Алергія та склад', en: 'Allergies and ingredients', words: [
      ['en allergi', 'алергія', 'an allergy', '🤧'], ['å tåle', 'переносити', 'to tolerate', '✅'], ['å inneholde', 'містити', 'to contain', '📦'],
      ['ei nøtt', 'горіх', 'a nut', '🥜'], ['ei valnøtt', 'волоський горіх', 'a walnut', '🌰'], ['et egg', 'яйце', 'an egg', '🥚'],
      ['ei melk', 'молоко', 'milk', '🥛'], ['et gluten', 'глютен', 'gluten', '🌾'], ['ei laktose', 'лактоза', 'lactose', '🧃'],
      ['et skalldyr', 'морепродукт', 'shellfish', '🦐'], ['ei soya', 'соя', 'soy', '🫘'], ['et innhold', 'склад, вміст', 'contents', '📋'],
      ['ei merking', 'маркування', 'labelling', '🏷️'], ['et spor', 'слід (домішка)', 'a trace', '🔍'], ['å bytte ut', 'замінити', 'to swap out', '🔁'],
      ['ei dressing', 'заправка', 'a dressing', '🥗'], ['et redskap', 'начиння, інструмент', 'a tool', '🍴'], ['trygg', 'безпечний', 'safe', '🛡️'],
      ['å si fra', 'попередити', 'to let know', '🗣️'], ['å ta på alvor', 'ставитися серйозно', 'to take seriously', '❗'],
      ['ei krysskontaminering', 'перехресне забруднення', 'cross-contamination', '⚠️'], ['ei reaksjon', 'реакція', 'a reaction', '🚨']
    ] },
    { id: 'tilbud', icon: '🏷️', level: 'A2', no: 'Tilbud og priser', uk: 'Знижки й ціни', en: 'Offers and prices', words: [
      ['et tilbud', 'акція, знижка', 'an offer', '🏷️'], ['ei kilopris', 'ціна за кілограм', 'a price per kilo', '⚖️'], ['ei rabatt', 'знижка', 'a discount', '💸'],
      ['en prosent', 'відсоток', 'a per cent', '％'], ['et medlemskort', 'картка покупця', 'a membership card', '💳'], ['å spare', 'заощаджувати', 'to save', '🐷'],
      ['billig', 'дешевий', 'cheap', '🪙'], ['dyr', 'дорогий', 'expensive', '💰'], ['ei holdbarhetsdato', 'термін придатності', 'a use-by date', '📅'],
      ['å gå ut', 'псуватися', 'to go off', '🗑️'], ['å holde', 'бути придатним', 'to last', '⏳'], ['ei pose', 'пакет', 'a bag', '🛍️'],
      ['ei kvittering', 'чек', 'a receipt', '🧾'], ['å bytte', 'обміняти', 'to exchange', '🔄'], ['ei vare', 'товар', 'an item', '📦'],
      ['ei kasse', 'каса', 'a till', '🧮'], ['et pant', 'застава за тару', 'a deposit', '♻️'], ['ei handleliste', 'список покупок', 'a shopping list', '📝'],
      ['å gjelde', 'стосуватися, діяти', 'to apply', '✔️'], ['frukt og grønt', 'фрукти й овочі', 'fruit and vegetables', '🥦']
    ] },
    { id: 'rom', icon: '🛋️', level: 'A1', no: 'Rom i hjemmet', uk: 'Кімнати вдома', en: 'Rooms at home', words: [
      ['ei leilighet', 'квартира', 'a flat', '🏢'], ['et kjøkken', 'кухня', 'a kitchen', '🍳'], ['ei stue', 'вітальня', 'a living room', '🛋️'],
      ['et soverom', 'спальня', 'a bedroom', '🛏️'], ['et bad', 'ванна кімната', 'a bathroom', '🛁'], ['en gang', 'передпокій', 'a hallway', '🚪'],
      ['en balkong', 'балкон', 'a balcony', '🪴'], ['en kjeller', 'підвал', 'a basement', '🪜'], ['et loft', 'горище', 'an attic', '🪟'],
      ['ei bod', 'комірчина', 'a storage room', '📦'], ['et vindu', 'вікно', 'a window', '🪟'], ['ei dør', 'двері', 'a door', '🚪'],
      ['et gulv', 'підлога', 'a floor', '🧹'], ['et tak', 'стеля, дах', 'a ceiling, roof', '🏠'], ['en vegg', 'стіна', 'a wall', '🧱'],
      ['ei trapp', 'сходи', 'stairs', '🪜'], ['en sofa', 'диван', 'a sofa', '🛋️'], ['et bord', 'стіл', 'a table', '🪑'],
      ['ei seng', 'ліжко', 'a bed', '🛏️'], ['et skap', 'шафа', 'a cupboard', '🚪'], ['å bo', 'жити', 'to live', '🏡']
    ] },
    { id: 'helse3', icon: '🤒', level: 'A1', no: 'Når du er syk', uk: 'Коли ти хворий', en: 'When you are ill', words: [
      ['syk', 'хворий', 'ill', '🤒'], ['frisk', 'здоровий', 'healthy', '💪'], ['en feber', 'температура', 'a fever', '🌡️'],
      ['å ha vondt', 'боліти', 'to be in pain', '😣'], ['ei forkjølelse', 'застуда', 'a cold', '🤧'], ['en hoste', 'кашель', 'a cough', '😷'],
      ['en snue', 'нежить', 'a runny nose', '🤧'], ['ei halsbetennelse', 'ангіна', 'a sore throat', '🗣️'], ['ei kvalme', 'нудота', 'nausea', '🤢'],
      ['ei hvile', 'відпочинок', 'rest', '😴'], ['å bli hjemme', 'лишитися вдома', 'to stay home', '🏠'], ['ei sykmelding', 'лікарняний', 'a sick note', '📄'],
      ['et legekontor', 'лікарський кабінет', 'a doctor’s office', '🏥'], ['ei timebestilling', 'запис на прийом', 'an appointment', '📅'],
      ['ei smerte', 'біль', 'pain', '💢'], ['ei pille', 'таблетка', 'a pill', '💊'], ['ei salve', 'мазь', 'an ointment', '🧴'],
      ['ei dråpe', 'крапля', 'a drop', '💧'], ['å måle', 'міряти', 'to measure', '📏'], ['bedre', 'краще', 'better', '🙂']
    ] },
    { id: 'rydding', icon: '🧽', level: 'A2', no: 'Rydding og vedlikehold', uk: 'Прибирання й дрібний ремонт', en: 'Cleaning and small repairs', words: [
      ['å rydde', 'прибирати', 'to tidy', '🧹'], ['å vaske', 'мити, прати', 'to wash', '🧼'], ['å tørke', 'витирати', 'to wipe', '🧽'],
      ['å støvsuge', 'пилососити', 'to vacuum', '🧹'], ['et støv', 'пил', 'dust', '💨'], ['ei søppelbøtte', 'смітник', 'a bin', '🗑️'],
      ['å kaste', 'викидати', 'to throw away', '🚮'], ['å sortere', 'сортувати', 'to sort', '♻️'], ['ei vaskemaskin', 'пральна машина', 'a washing machine', '🌀'],
      ['en oppvask', 'миття посуду', 'the washing-up', '🍽️'], ['ei kran', 'кран', 'a tap', '🚰'], ['å lekke', 'протікати', 'to leak', '💧'],
      ['å tette', 'закупорити, усунути течу', 'to seal', '🔧'], ['ei pære', 'лампочка', 'a light bulb', '💡'], ['å skifte', 'міняти', 'to change', '🔁'],
      ['en sikring', 'запобіжник', 'a fuse', '⚡'], ['ei skrue', 'гвинт', 'a screw', '🔩'], ['en skrutrekker', 'викрутка', 'a screwdriver', '🪛'],
      ['å henge opp', 'повісити', 'to hang up', '🖼️'], ['ødelagt', 'зламаний', 'broken', '💔'], ['å reparere', 'лагодити', 'to repair', '🔨']
    ] },
    { id: 'naboer', icon: '👋', level: 'B1', no: 'Naboer og fellesskap', uk: 'Сусіди й спільнота', en: 'Neighbours and community', words: [
      ['en nabo', 'сусід', 'a neighbour', '👋'], ['et borettslag', 'житловий кооператив', 'a housing co-op', '🏘️'], ['et sameie', 'спільна власність', 'a joint ownership', '🏢'],
      ['ei dugnad', 'спільна толока', 'a communal work day', '🧤'], ['et fellesareal', 'спільна територія', 'a common area', '🌳'],
      ['ei husordensregel', 'правило внутрішнього розпорядку', 'a house rule', '📜'], ['ei nattero', 'нічна тиша', 'quiet hours', '🌙'],
      ['ei klage', 'скарга', 'a complaint', '📣'], ['å banke på', 'постукати', 'to knock', '✊'], ['å låne', 'позичати', 'to borrow', '🤝'],
      ['ei bøtte', 'відро', 'a bucket', '🪣'], ['ei trappevask', 'прибирання сходів', 'stairwell cleaning', '🧹'],
      ['et styre', 'правління', 'a board', '🪑'], ['et årsmøte', 'річні збори', 'an annual meeting', '🗓️'],
      ['ei avstemning', 'голосування', 'a vote', '🗳️'], ['et vedtak', 'рішення', 'a decision', '✅'],
      ['ei fellesutgift', 'спільні витрати', 'a shared cost', '💳'], ['hensynsfull', 'тактовний', 'considerate', '🙏'],
      ['å ta hensyn', 'зважати', 'to be considerate', '💛'], ['ei gjensidig hjelp', 'взаємодопомога', 'mutual help', '🤲']
    ] }
  );
})();
