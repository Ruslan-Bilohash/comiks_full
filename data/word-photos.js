/*
 * Картинки-іконки замість емодзі для наявних тем слів (img/words/<тема>/<файл>.webp).
 * Ключ — слово без артикля, як у KomiksPics; файли — латиницею (å→a, ø→o).
 * Картки, тест «Hva er dette?», «Пари» й «Гра разом» показують їх самі.
 * Слова без файлу (у naboer — dugnad, husordensregel, årsmøte: у наданому архіві вони
 * зіпсовані) лишаються з емодзі.
 */
(() => {
  'use strict';
  if (!window.KomiksPics || !window.KomiksPics.addPhotos) return;
  const SETS = {
    naboer: { 'nabo': 'nabo', 'borettslag': 'borettslag', 'sameie': 'sameie', 'fellesareal': 'fellesareal', 'nattero': 'nattero',
      'klage': 'klage', 'banke på': 'banke_pa', 'låne': 'lane', 'bøtte': 'botte', 'trappevask': 'trappevask', 'styre': 'styre',
      'avstemning': 'avstemning', 'vedtak': 'vedtak', 'fellesutgift': 'fellesutgift', 'hensynsfull': 'hensynsfull',
      'ta hensyn': 'ta_hensyn', 'gjensidig hjelp': 'gjensidig_hjelp' },
    familie: { 'mor': 'mor', 'far': 'far', 'bror': 'bror', 'søster': 'soster', 'sønn': 'sonn', 'datter': 'datter', 'bestemor': 'bestemor',
      'bestefar': 'bestefar', 'onkel': 'onkel', 'tante': 'tante', 'fetter': 'fetter', 'kusine': 'kusine', 'mann': 'mann', 'kone': 'kone',
      'barn': 'barn', 'baby': 'baby', 'foreldre': 'foreldre', 'søsken': 'sosken', 'kjæreste': 'kjaereste', 'barnebarn': 'barnebarn' },
    klaer: { 'jakke': 'jakke', 'genser': 'genser', 'bukse': 'bukse', 'skjørt': 'skjort', 'kjole': 'kjole', 't-skjorte': 't_skjorte',
      'skjorte': 'skjorte', 'sko': 'sko', 'støvel': 'stovel', 'sokk': 'sokk', 'lue': 'lue', 'skjerf': 'skjerf', 'vott': 'vott', 'hatt': 'hatt',
      'regnjakke': 'regnjakke', 'pyjamas': 'pyjamas', 'badedrakt': 'badedrakt', 'sekk': 'sekk', 'belte': 'belte', 'bunad': 'bunad' },
    kropp: { 'hode': 'hode', 'hår': 'har', 'øye': 'oye', 'øre': 'ore', 'nese': 'nese', 'munn': 'munn', 'tann': 'tann', 'hals': 'hals',
      'arm': 'arm', 'hånd': 'hand', 'finger': 'finger', 'mage': 'mage', 'rygg': 'rygg', 'bein': 'bein', 'fot': 'fot', 'kne': 'kne',
      'hjerte': 'hjerte', 'ansikt': 'ansikt' },
    /* is і vann мають інші значення в інших темах (лід у «Погоді», озеро в «Природі») — тому
       [файл, значення]: фото лише там, де переклад «морозиво» / «вода». */
    mat: { 'brød': 'brod', 'ost': 'ost', 'pølse': 'polse', 'egg': 'egg', 'fisk': 'fisk', 'kjøtt': 'kjott', 'kylling': 'kylling',
      'pizza': 'pizza', 'suppe': 'suppe', 'ris': 'ris', 'pasta': 'pasta', 'kake': 'kake', 'is': ['is', 'морозиво'], 'smør': 'smor',
      'melk': 'melk', 'kaffe': 'kaffe', 'te': 'te', 'juice': 'juice', 'vann': ['vann', 'вода'], 'sjokolade': 'sjokolade', 'vaffel': 'vaffel',
      'frokost': 'frokost', 'lunsj': 'lunsj', 'middag': 'middag' },
    frukt: { 'eple': 'eple', 'banan': 'banan', 'appelsin': 'appelsin', 'pære': ['paere', 'груша'], 'drue': 'drue', 'jordbær': 'jordbaer',
      'blåbær': 'blabaer', 'sitron': 'sitron', 'melon': 'melon', 'ananas': 'ananas', 'gulrot': 'gulrot', 'potet': 'potet', 'tomat': 'tomat',
      'agurk': 'agurk', 'løk': 'lok', 'paprika': 'paprika', 'sopp': 'sopp', 'mais': 'mais', 'brokkoli': 'brokkoli', 'salat': 'salat' },
    /* fisk — уже є з теми «Mat»; mus — лише «миша», не комп'ютерна мишка. */
    dyr: { 'hund': 'hund', 'hest': 'hest', 'gris': 'gris', 'sau': 'sau', 'høne': 'hone', 'fugl': 'fugl', 'mus': ['mus', 'миша'],
      'kanin': 'kanin', 'elg': 'elg', 'bjørn': 'bjorn', 'rev': 'rev', 'hval': 'hval', 'ugle': 'ugle', 'løve': 'love', 'elefant': 'elefant',
      'slange': 'slange', 'sommerfugl': 'sommerfugl', 'katt': 'katt', 'ku': 'ku', 'geit': 'geit', 'ulv': 'ulv', 'reinsdyr': 'reinsdyr', 'sel': 'sel' },
    // dusj і toalett в архіві зіпсовані (білі частини стерто разом із тлом) — поки з емодзі
    hjem: { 'hus': 'hus', 'leilighet': 'leilighet', 'rom': 'rom', 'kjøkken': 'kjokken', 'stue': 'stue', 'soverom': 'soverom', 'bad': 'bad',
      'dør': 'dor', 'vindu': 'vindu', 'bord': 'bord', 'stol': 'stol', 'seng': 'seng', 'sofa': 'sofa', 'lampe': 'lampe',
      'kjøleskap': 'kjoleskap', 'komfyr': 'komfyr', 'nøkkel': 'nokkel', 'hage': 'hage' },
    /* saks, lekse, prøve — в архіві зіпсовані (лезо й аркуш стерто, «lekse» = той самий олівець), pult —
       шахівниця між ніжками (лишається мальована іконка pics.js), sekk — уже є з теми «Klær». */
    skole: { 'lærer': 'lrer', 'elev': 'elev', 'klasserom': 'klasserom', 'tavle': 'tavle', 'bok': 'bok', 'blyant': 'blyant', 'penn': 'penn',
      'viskelær': 'viskelr', 'linjal': 'linjal', 'friminutt': 'friminutt', 'matte': 'matte', 'norsk': 'norsk', 'gym': 'gym',
      'datamaskin': 'datamaskin', 'timeplan': 'timeplan' },
    // is тут — «лід» (морозиво — у темі «Mat»)
    vaer: { 'sol': 'sol', 'regn': 'regn', 'snø': 'sno', 'vind': 'vind', 'tåke': 'take', 'torden': 'torden', 'lyn': 'lyn', 'regnbue': 'regnbue',
      'skye': 'skye', 'varm': 'varm', 'kald': 'kald', 'våt': 'vat', 'vinter': 'vinter', 'vår': 'var', 'sommer': 'sommer', 'høst': 'host',
      'grad': 'grad', 'is': ['is', 'лід'], 'nordlys': 'nordlys', 'storm': 'storm' },
    farger: { 'rød': 'rod', 'blå': 'bla', 'gul': 'gul', 'grønn': 'gronn', 'svart': 'svart', 'hvit': 'hvit', 'brun': 'brun', 'oransje': 'oransje',
      'lilla': 'lilla', 'rosa': 'rosa', 'grå': 'gra', 'lyseblå': 'lysebla', 'mørk': 'mork', 'lys': 'lys', 'gull': 'gull', 'sølv': 'solv' },
    // fredag, i går, år — в архіві зіпсовані, поки з емодзі
    tid: { 'mandag': 'mandag', 'tirsdag': 'tirsdag', 'onsdag': 'onsdag', 'torsdag': 'torsdag', 'lørdag': 'lordag', 'søndag': 'sondag',
      'januar': 'januar', 'februar': 'februar', 'mars': 'mars', 'april': 'april', 'mai': 'mai', 'juni': 'juni', 'juli': 'juli', 'august': 'august',
      'september': 'september', 'oktober': 'oktober', 'november': 'november', 'desember': 'desember', 'i dag': 'i_dag', 'i morgen': 'i_morgen', 'uke': 'uke' },
    /* В архіві friluft картинки зсунуті на одну позицію й частина зіпсована (обрізані шматки) — беремо лише ті,
       що справді показують слово: компас = allemannsretten, вітерець = frisk luft. Решта — з емодзі. */
    friluft: { 'fjelltur': 'fjelltur', 'hytte': 'hytte', 'bål': 'bal', 'telt': 'telt', 'matpakke': 'matpakke', 'termos': 'termos',
      'løype': 'loype', 'bær': 'baer', 'allemannsretten': 'allemannsretten', 'frisk luft': 'frisk_luft' }
  };
  // кожну тему окремо: одне слово з різними значеннями в різних темах (is) не затирає попереднє
  for (const [theme, words] of Object.entries(SETS)) {
    const map = {};
    for (const [w, f] of Object.entries(words)) {
      const src = `img/words/${theme}/${Array.isArray(f) ? f[0] : f}.webp`;
      map[w] = Array.isArray(f) ? { src, uk: f[1] } : src;
    }
    window.KomiksPics.addPhotos(map);
  }
})();
