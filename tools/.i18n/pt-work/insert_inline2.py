def patch(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        assert n >= 1, (path, n, old[:80])
        s = s.replace(old, new)
    open(path, 'w', encoding='utf-8').write(s)

patch('assets/app.js', [
    ("lt: 'Tėvams ir mokytojams'", "lt: 'Tėvams ir mokytojams', pt: 'Para pais e professores'"),
    ("lt: 'Statistika' }", "lt: 'Statistika', pt: 'Estatísticas' }"),
    ("{ uk: 'Відгук', en: 'Feedback', no: 'Tilbakemelding', ar: 'ملاحظات' }", "{ uk: 'Відгук', en: 'Feedback', no: 'Tilbakemelding', ar: 'ملاحظات', pt: 'Comentários' }"),
    ("{ uk: 'Застосунок', en: 'Get the app', no: 'Få appen', ar: 'التطبيق' }", "{ uk: 'Застосунок', en: 'Get the app', no: 'Få appen', ar: 'التطبيق', pt: 'Baixe o app' }"),
    ("{ uk: 'Для вчителів', en: 'For teachers', no: 'For lærere', ar: 'للمعلّمين' }", "{ uk: 'Для вчителів', en: 'For teachers', no: 'For lærere', ar: 'للمعلّمين', pt: 'Para professores' }"),
])

# сторінка завантажень: pt після en
s = open('assets/downloads.js', encoding='utf-8').read()
en = "    en: ['Learning Norwegian — get the app',"
i = s.index(en)
j = s.index('\n', i)
pt = "    pt: ['Learning Norwegian — baixe o app', 'Estude no Android e no Windows. Experimente o app e ajude a melhorá-lo.', 'Baixe no', 'iPhone / App Store — em breve', 'Ajude a testar! Deixe uma avaliação sincera e sugestões no Google Play e na Microsoft Store, ou mande um e-mail para nós.', 'Enviar comentário', 'Opções de download', 'Os recursos online precisam de internet. A disponibilidade depende do seu país e do canal de lançamento.', 'Guias de download em ucraniano'],"
s = s[:j + 1] + pt + '\n' + s[j + 1:]
open('assets/downloads.js', 'w', encoding='utf-8').write(s)
print('ok')
