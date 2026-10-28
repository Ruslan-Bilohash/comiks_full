/*
 * Тематичні слова: 🔨 будівельні інструменти (Verktøy) — з ФОТО замість емодзі.
 * Фото лежать у img/tools/<файл>.webp; KomiksPics.addPhotos() прив'язує їх до слова,
 * тож картки, тест «Hva er dette?», «Пари» й «Гра разом» показують саме фото.
 * Формат слова той самий: [норвезькою (з артиклем), uk, en, emoji — запасний].
 */
(() => {
  'use strict';
  if (!window.WORDS || !Array.isArray(window.WORDS.themes)) return;
  const T = [
    ['en hammer', 'молоток', 'a hammer', '🔨', 'hammer'],
    ['en drill', 'шуруповерт', 'a cordless drill', '🔋', 'batteridrill'],
    ['en boremaskin', 'дриль', 'a power drill', '🔌', 'boremaskin'],
    ['en borhammer', 'перфоратор', 'a rotary hammer', '⚒️', 'borhammer'],
    ['en vinkelsliper', 'болгарка (кутова шліфмашина)', 'an angle grinder', '⚙️', 'vinkelsliper'],
    ['ei stikksag', 'електролобзик', 'a jigsaw', '🪚', 'stikksag'],
    ['ei sirkelsag', 'циркулярна пила', 'a circular saw', '⭕', 'sirkelsag'],
    ['et målebånd', 'рулетка', 'a tape measure', '📏', 'malebaand'],
    ['et vater', 'рівень (ватерпас)', 'a spirit level', '📐', 'vater'],
    ['ei tang', 'плоскогубці', 'pliers', '🗜️', 'tang'],
    ['en skrutrekker', 'викрутка', 'a screwdriver', '🪛', 'skrutrekker'],
    ['en fastnøkkel', 'гайковий ключ', 'a spanner', '🔧', 'fastnokkel'],
    ['en skiftenøkkel', 'розвідний ключ', 'an adjustable spanner', '🔩', 'skiftenokkel'],
    ['ei håndsag', 'ножівка', 'a handsaw', '🌲', 'handsag'],
    ['et stemjern', 'стамеска', 'a chisel', '🪵', 'stemjern'],
    ['en sparkel', 'шпатель', 'a putty knife', '🎨', 'sparkel'],
    ['ei murskje', 'кельма', 'a trowel', '🧱', 'murskje'],
    ['en tapetkniv', 'будівельний ніж', 'a utility knife', '🔪', 'tapetkniv'],
    ['en slipemaskin', 'шліфувальна машина', 'a sander', '🌀', 'slipemaskin'],
    ['et laservater', 'лазерний рівень', 'a laser level', '🟩', 'laservater']
  ];
  window.WORDS.themes.push({ id: 'verktoy', icon: '🔨', level: 'A2', no: 'Verktøy', uk: 'Будівельні інструменти', en: 'Tools', words: T.map(w => w.slice(0, 4)) });
  if (window.KomiksPics && window.KomiksPics.addPhotos) {
    const map = {};
    for (const [no, , , , file] of T) map[no.replace(/^(en|ei|et)\s+/, '')] = `img/tools/${file}.webp`;
    window.KomiksPics.addPhotos(map);
  }
  // лічильник «понад N слів» на головній — з урахуванням цієї теми
  if (window.KomiksWords && window.KomiksWords.liveCount) window.KomiksWords.liveCount();
})();
