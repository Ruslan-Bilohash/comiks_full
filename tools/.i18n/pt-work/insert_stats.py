p = 'tools/build.js'
s = open(p, encoding='utf-8').read()

PRE = r"""  /* Сторінки поза коміксами — «Що нового», пошукові сторінки, листи й політика
     приватності. Їх теж видно в адмінці («Переклади»), щоб нова мова не
     виглядала готовою, поки половина сайту лишається англійською. */
  const EXTRA = (() => {
    const out = { upd: [], updTr: {}, pagesEn: [], mail: {}, priv: {} };
    try { const w = {}; new Function('window', rd('data/updates.js'))(w); new Function('window', rd('data/updates-lang.js'))(w); out.upd = w.KOMIKS_UPDATES || []; out.updTr = w.KOMIKS_UPDATES_TR || {}; } catch (e) { /* ignore */ }
    const flat = (o, pre = '') => Object.entries(o || {}).flatMap(([k, v]) => k.startsWith('_') ? [] : (v && typeof v === 'object' ? flat(v, pre + k + '.') : [[pre + k, String(v)]]));
    try { out.pagesEn = flat(JSON.parse(rd('tools/lang/pages-en.json'))).map(([k]) => k); } catch (e) { /* ignore */ }
    out.pages = lang => { try { return new Set(flat(JSON.parse(rd(`tools/lang/pages/${lang}.json`))).filter(([, v]) => v.trim()).map(([k]) => k)); } catch (e) { return new Set(); } };
    try {
      const lib = rd('api/lib.php'), i = lib.indexOf('function mail_texts'), j = lib.indexOf('\n}\n', i);
      const body = lib.slice(i, j);
      const re = /\n    '([a-z]{2})' => \[\n([\s\S]*?)\n    \],/g;
      for (let m; (m = re.exec(body));) out.mail[m[1]] = (m[2].match(/^\s*'[a-z_]+' => /gm) || []).length;
    } catch (e) { /* ignore */ }
    try {
      const html = rd('privacy.html');
      const re = /<section id="([a-z]{2})"[^>]*>([\s\S]*?)<\/section>/g;
      for (let m; (m = re.exec(html));) out.priv[m[1]] = (m[2].match(/<(h2|h3|p|li|th|td)\b/g) || []).length;
    } catch (e) { /* ignore */ }
    return out;
  })();
  for (const lang of LANGS_ALL) {"""
a = "  for (const lang of LANGS_ALL) {\n    const pack = packs[lang] || null;"
assert s.count(a) == 1
s = s.replace(a, PRE + "\n    const pack = packs[lang] || null;", 1)

GROUPS = r"""    /* 8. «Що нового»: рядки журналу оновлень. */
    {
      let total = 0, has = 0; const miss = [];
      for (const u of EXTRA.upd) {
        const n = (u.en || []).length; if (!n) continue;
        total += n;
        const got = (u[lang] && u[lang].length) ? u[lang] : ((EXTRA.updTr[lang] || {})[u.id] || []);
        const ok = got.filter(x => typeof x === 'string' && x.trim()).length;
        has += Math.min(n, ok);
        if (ok < n && miss.length < 40) miss.push(`${u.id} · ${String(u.en[0]).slice(0, 60)}`);
      }
      add('news', 'Що нового', total, has, miss);
    }
    /* 9. пошукові сторінки: тексти сторінок коміксів, тестів і новин */
    if (EXTRA.pagesEn.length) {
      const total = EXTRA.pagesEn.length;
      const have = BUILTIN.has(lang) ? null : EXTRA.pages(lang);
      const has = have ? EXTRA.pagesEn.filter(k => have.has(k)).length : total;
      add('pages', 'Пошукові сторінки', total, has, have ? EXTRA.pagesEn.filter(k => !have.has(k)).slice(0, 40) : []);
    }
    /* 10. листи з сервера (mail_texts у api/lib.php) */
    if (EXTRA.mail.en) {
      const total = EXTRA.mail.en, has = Math.min(total, EXTRA.mail[lang] || 0);
      add('mail', 'Листи', total, has, has < total ? [`api/lib.php → mail_texts('${lang}'): ${total - has} з ${total}`] : []);
    }
    /* 11. політика приватності (privacy.html, розділ мови) */
    if (EXTRA.priv.en) {
      const total = EXTRA.priv.en, has = Math.min(total, EXTRA.priv[lang] || 0);
      add('privacy', 'Приватність', total, has, has < total ? [`privacy.html → <section id="${lang}">: ${total - has} блоків`] : []);
    }

    const total = Object.values(groups).reduce((s2, g) => s2 + g.total, 0);"""
b = "\n    const total = Object.values(groups).reduce((s2, g) => s2 + g.total, 0);"
assert s.count(b) == 1
s = s.replace(b, "\n" + GROUPS, 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
