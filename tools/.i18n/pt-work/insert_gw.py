import re
# ── grammar.js: таблиця GX.pt перед lt ──
p = 'assets/grammar.js'
s = open(p, encoding='utf-8').read()
GX_PT = r"""    pt: {
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
"""
m = re.search(r"\n    lt: \{\n", s)
assert m
s = s[:m.start() + 1] + GX_PT + s[m.start() + 1:]
a = "if (window.I18N) for (const l of ['uk', 'en', 'no', 'de', 'pl', 'tr', 'lt']) {"
assert s.count(a) == 1
s = s.replace(a, "if (window.I18N) for (const l of ['uk', 'en', 'no', 'de', 'pl', 'tr', 'lt', 'pt']) {")
open(p, 'w', encoding='utf-8').write(s)

# ── words.js: таблиця WX.pt перед lt ──
p = 'assets/words.js'
s = open(p, encoding='utf-8').read()
WX_PT = r"""    pt: {
      room: '🎮 Jogar juntos (QR)', room_hint: 'Crie uma sala com este tema: os alunos escaneiam o QR code e respondem no celular',
      nav: 'Palavras', module: ['📝', 'Palavras', 'mais de {n} palavras por tema, com áudio'],
      title: '📝 Palavras por tema', intro: 'As palavras norueguesas mais úteis: família, comida, roupas, animais, cidade, profissões, sentimentos… Toque num cartão para ouvir a palavra. Os substantivos mostram o gênero: en, ei ou et.',
      themes: '🗂️ Temas', words_n: n => `${n} palavras`, learn: '🙈 Esconder a tradução', show: '👀 Mostrar a tradução', play_all: '🔊 Ouvir todas', test: '🧩 Teste do tema',
      all_test: '🧩 Teste com todas as palavras', tip: 'Dica: esconda a tradução e tente lembrar o significado; depois toque no cartão para conferir.', back: '← Todos os temas', tests: '📝 Palavras por tema',
      step: x => `Palavras: ${x}`, gender: 'en — masculino, ei — feminino, et — neutro',
      say: 'Diga em voz alta', know: 'Eu sei', know_hint: 'Marque as palavras que você já sabe — o contador aparece na sua conta.', known_n: (a, b) => `✅ Sei: ${a} de ${b}`, known_all: n => `✅ Sei: ${n}`, reset_known: '↩️ Limpar as marcas deste tema'
    },
"""
m = re.search(r"\n    lt: \{\n", s)
assert m
s = s[:m.start() + 1] + WX_PT + s[m.start() + 1:]
a = "if (window.I18N) for (const l of ['uk', 'en', 'no', 'de', 'pl', 'tr', 'lt']) {"
assert s.count(a) == 1
s = s.replace(a, "if (window.I18N) for (const l of ['uk', 'en', 'no', 'de', 'pl', 'tr', 'lt', 'pt']) {")
a = "const PACK_UI = ['de', 'pl', 'tr', 'lt'];"
assert s.count(a) == 1
s = s.replace(a, "const PACK_UI = ['de', 'pl', 'tr', 'lt', 'pt'];")
open(p, 'w', encoding='utf-8').write(s)

# ── app.js ──
p = 'assets/app.js'
s = open(p, encoding='utf-8').read()
R = [
    ("['lt', '🇱🇹 Lietuvių'], ['ar', '🇸🇦 العربية']];", "['lt', '🇱🇹 Lietuvių'], ['pt', '🇧🇷 Português (Brasil)'], ['ar', '🇸🇦 العربية']];"),
    ("for (const l of ['de', 'pl', 'tr', 'lt']) { const v = packFor(l, en); if (v) tr[l] = v; }", "for (const l of ['de', 'pl', 'tr', 'lt', 'pt']) { const v = packFor(l, en); if (v) tr[l] = v; }"),
    ("const TR_ALL = ['uk', 'en', 'ar', 'de', 'pl', 'tr', 'lt'];", "const TR_ALL = ['uk', 'en', 'ar', 'de', 'pl', 'tr', 'lt', 'pt'];"),
    ("const TR_NAME = { uk: 'Українська', en: 'English', ar: 'العربية', de: 'Deutsch', pl: 'Polski', tr: 'Türkçe', lt: 'Lietuvių' };", "const TR_NAME = { uk: 'Українська', en: 'English', ar: 'العربية', de: 'Deutsch', pl: 'Polski', tr: 'Türkçe', lt: 'Lietuvių', pt: 'Português (Brasil)' };"),
    ("lt: 'data/lang-lt.js' };", "lt: 'data/lang-lt.js', pt: 'data/lang-pt.js' };"),
]
for a, b in R:
    assert s.count(a) == 1, a
    s = s.replace(a, b)
open(p, 'w', encoding='utf-8').write(s)

# ── boot.js ──
p = 'assets/boot.js'
s = open(p, encoding='utf-8').read()
a = "var PACK = ['de', 'pl', 'tr', 'lt', 'ar', 'no'];"
assert s.count(a) == 1
s = s.replace(a, "var PACK = ['de', 'pl', 'tr', 'lt', 'pt', 'ar', 'no'];")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
