"""Вбудовані переклади в модулях: після запису lt дописуємо pt (у тому самому об'єкті)."""
import re

def patch(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        assert n == 1, (path, n, old[:80])
        s = s.replace(old, new)
    open(path, 'w', encoding='utf-8').write(s)

def after(lt_text, pt_text, sep=',\n      '):
    return (lt_text, lt_text + sep + pt_text)

patch('assets/app.js', [
    ("lt: 'lt-LT', en: 'en-GB' };", "lt: 'lt-LT', pt: 'pt-BR', en: 'en-GB' };"),
    ("lt: ['LT', ' lt'] };", "lt: ['LT', ' lt'], pt: ['BR', ' pt'] };"),
    after("lt: ['Klausyti kadro', 'Sustabdyti', 'Skaityti istoriją']", "pt: ['Ouvir este quadro', 'Parar', 'Ler a história']"),
    ("lt: ['Ko mokausi', '🇳🇴 Norvegų', '🇬🇧 Anglų'] };", "lt: ['Ko mokausi', '🇳🇴 Norvegų', '🇬🇧 Anglų'], pt: ['O que estou aprendendo', '🇳🇴 Norueguês', '🇬🇧 Inglês'] };"),
    after("lt: { no: 'Mokomės norvegų', en: 'Mokomės anglų' }", "pt: { no: 'Aprender norueguês', en: 'Aprender inglês' }", ',\n    '),
    after("paths: n => `${n} kryptys`, lessons: n => `${n} komiksai`, badge: 'Profilis ir ženkleliai' }",
          "pt: { fresh: 'NOVIDADE', title: 'Programação para crianças', desc: 'Um curso básico explica comandos, algoritmos, sites, jogos, bancos de dados e segurança digital com quadrinhos curtos e testes.', profile: 'No seu perfil aparecem as lições concluídas, os resultados dos testes, as medalhas e o próximo passo.', try: 'Experimentar o curso', progress: 'Seu progresso', paths: n => `${n} trilhas`, lessons: n => `${n} quadrinhos`, badge: 'Perfil e medalhas' }", ',\n    '),
    ('"lt":"Visi skyriai"}', '"lt":"Visi skyriai","pt":"Todas as seções"}'),
    after("lt: ['🌍 Vertimo kalbos komiksuose', 'Pažymėk visas kalbas, kurias nori matyti užuominoje — jos rodomos kartu, viena po kita. Numatyta: sąsajos kalba ir anglų.']",
          "pt: ['🌍 Idiomas de tradução nos quadrinhos', 'Marque todos os idiomas que você quer ver na dica — eles aparecem juntos, um embaixo do outro. Padrão: o idioma da interface e o inglês.']"),
    ("lt: '🇱🇹 Lietuvių' };", "lt: '🇱🇹 Lietuvių', pt: '🇧🇷 Português (Brasil)' };"),
])

patch('assets/art.js', [
    ("lt: 'LT' };", "lt: 'LT', pt: 'BR' };"),
])

patch('assets/auth.js', [
    after("lt: ['Užklausa gauta. Patikrinkite paštą ir šlamšto aplanką. Jei laiškas neateina, palaukite arba prisijunkite slaptažodžiu.', 'El. paštas patvirtintas. Paskyra aktyvi, o pažanga saugoma serveryje.']",
          "pt: ['Pedido recebido. Confira sua caixa de entrada e a pasta de spam. Se o e-mail não chegar, aguarde ou entre com sua senha.', 'Seu e-mail foi confirmado. A conta está ativa e o progresso fica salvo no servidor.']", ',\n    '),
    ("lt: 'arba', ar: 'أو' };", "lt: 'arba', pt: 'ou', ar: 'أو' };"),
    after("lt: 'Dar neturite paskyros? Ji bus sukurta pagal jau priimtas naudojimo sąlygas.'",
          "pt: 'Ainda não tem conta? Ela será criada de acordo com os termos de uso que você já aceitou.'", ',\n    '),
])

patch('assets/extras.js', [
    after("lt: { play: 'Atsisiųsti iš Google Play', ms: 'Atsisiųsti iš Microsoft Store', ios: 'iPhone — netrukus' }",
          "pt: { play: 'Disponível no Google Play', ms: 'Baixe na Microsoft Store', ios: 'iPhone — em breve' }", ',\n    '),
    after("lt: ['Sukurk savo veikėją', 'Kaip žaisti kartu', 'Atidaryti kambarį', 'Pridėti draugų']",
          "pt: ['Crie seu herói', 'Como jogar juntos', 'Abrir uma sala', 'Adicionar amigos']"),
])

patch('assets/news.js', [
    after("lt: { title: '✨ Kas naujo', intro: 'Trumpas naujausių Komiks·Lab atnaujinimų žurnalas. Viskas veikia iš karto — nieko nereikia diegti.', new: 'NAUJA', older: 'Ankstesni atnaujinimai', back: '← Pagrindinis' }",
          "pt: { title: '✨ Novidades', intro: 'Um registro curto das últimas atualizações do Komiks·Lab. Tudo funciona na hora — não é preciso instalar nada.', new: 'NOVO', older: 'Atualizações anteriores', back: '← Início' }", ',\n    '),
    ("lt: 'Pažiūrėkite' }[ui]", "lt: 'Pažiūrėkite', pt: 'Dar uma olhada' }[ui]"),
])
print('ok')
