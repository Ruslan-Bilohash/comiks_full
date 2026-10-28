p = 'assets/i18n-eu.js'
s = open(p, encoding='utf-8').read()
blk = open('tools/.i18n/pt-work/i18n-pt-block.js', encoding='utf-8').read()
a = "  /* Розділи з окремих модулів"
assert s.count(a) == 1
s = s.replace(a, blk + a)
a2 = r"""      rating: ['\u{1F3C6}', 'Reitingas', 'Kas pirmauja: žvaigždutės iš testų ir žaidimų']
    }
  };"""
b2 = r"""      rating: ['\u{1F3C6}', 'Reitingas', 'Kas pirmauja: žvaigždutės iš testų ir žaidimų']
    },
    pt: {
      race: ['\u{1F3C1}', 'Corrida de lógica', 'Os heróis apostam corrida — vence quem resolve o enigma mais rápido'],
      math: ['\u{1F9EE}', 'Matemática', 'Tabuada, contas e Math Rocket'],
      english: ['\u{1F1EC}\u{1F1E7}', 'Inglês', 'Um curso à parte: quadrinhos e testes em inglês'],
      game: ['\u{1F3AE}', 'Jogar juntos', 'Salas com QR code para a turma e os amigos'],
      rating: ['\u{1F3C6}', 'Ranking', 'Quem está na frente: estrelas dos testes e jogos']
    }
  };"""
assert s.count(a2) == 1, 'sec'
s = s.replace(a2, b2)
s = s.replace("Object.assign(window.I18N, { de, pl, tr, lt });", "Object.assign(window.I18N, { de, pl, tr, lt, pt });")
n = s.count("for (const l of ['de', 'pl', 'tr', 'lt']) {")
assert n == 2, n
s = s.replace("for (const l of ['de', 'pl', 'tr', 'lt']) {", "for (const l of ['de', 'pl', 'tr', 'lt', 'pt']) {")
s = s.replace("/* Комікс·Lab — інтерфейс німецькою, польською, турецькою та литовською.", "/* Комікс·Lab — інтерфейс німецькою, польською, турецькою, литовською та бразильською португальською.", 1)
open(p, 'w', encoding='utf-8').write(s)
print('ok')
