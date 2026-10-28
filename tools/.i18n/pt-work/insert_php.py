def patch(path, pairs):
    s = open(path, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        assert n == 1, (path, n, old[:90])
        s = s.replace(old, new)
    open(path, 'w', encoding='utf-8').write(s)

LT_BADGES = "    'lt' => ['📲 Komiks·Lab telefone ir kompiuteryje', 'Android — Google Play', 'Windows — Microsoft Store', 'iPhone — netrukus'],"
LT_APP = "    'lt' => ['📲 Komiks·Lab dabar yra programėlė',"
LT_DEL = "    'lt' => ['Paskyros ištrynimo kodas — Komiks·Lab',"

s = open('api/lib.php', encoding='utf-8').read()
def after_line(src, start_marker, new_line):
    i = src.index(start_marker)
    j = src.index('\n', i)
    return src[:j + 1] + new_line + '\n' + src[j + 1:]
assert s.count(LT_BADGES) == 1 and s.count(LT_APP) == 1 and s.count(LT_DEL) == 1
s = after_line(s, LT_BADGES, "    'pt' => ['📲 Komiks·Lab no celular e no computador', 'Android — Google Play', 'Windows — Microsoft Store', 'iPhone — em breve'],")
s = after_line(s, LT_APP, "    'pt' => ['📲 O Komiks·Lab agora é um app', 'Instale o Komiks·Lab no celular ou no computador', 'Oi, %s! Agora você pode instalar o Komiks·Lab como app: no Android pelo Google Play e no Windows pela Microsoft Store. A versão para iPhone vem em breve! O seu progresso, as suas palavras e os seus amigos continuam os mesmos — é só entrar na sua conta.', 'Baixar o app', 'Os links para todas as versões estão abaixo. No iPhone você já pode adicionar o site à tela de início: Safari → Compartilhar → “Adicionar à Tela de Início”.'],")
s = after_line(s, LT_DEL, "    'pt' => ['Código para excluir a conta — Komiks·Lab', 'Excluir a conta', 'Oi, %s! Alguém (esperamos que você) quer excluir uma conta do Komiks·Lab. Digite este código na página da conta:', 'Código', 'Abrir a minha conta', 'O código vale por 15 minutos. Se não foi você, ignore este e-mail — a sua conta continua como está.'],")
s = s.replace("const KL_LANGS = ['en', 'no', 'uk', 'ar', 'de', 'pl', 'tr', 'lt'];", "const KL_LANGS = ['en', 'no', 'uk', 'ar', 'de', 'pl', 'tr', 'lt', 'pt'];", 1)
s = s.replace("'de' => 'German', 'pl' => 'Polish', 'tr' => 'Turkish', 'lt' => 'Lithuanian'];", "'de' => 'German', 'pl' => 'Polish', 'tr' => 'Turkish', 'lt' => 'Lithuanian', 'pt' => 'Brazilian Portuguese'];", 1)
open('api/lib.php', 'w', encoding='utf-8').write(s)

patch('api/mail-studio.php', [
    ("    'lt' => ['✨ Kas naujo Komiks·Lab', 'Kas naujo Komiks·Lab', 'Sveiki, {{name}}! Štai kas pasikeitė Komiks·Lab:', 'Peržiūrėti naujienas', 'Komiks·Lab komanda'],",
     "    'lt' => ['✨ Kas naujo Komiks·Lab', 'Kas naujo Komiks·Lab', 'Sveiki, {{name}}! Štai kas pasikeitė Komiks·Lab:', 'Peržiūrėti naujienas', 'Komiks·Lab komanda'],\n    'pt' => ['✨ Novidades do Komiks·Lab', 'O que há de novo no Komiks·Lab', 'Oi, {{name}}! Veja o que mudou no Komiks·Lab:', 'Ver as novidades', 'Equipe Komiks·Lab'],"),
    ("'lt' => 'Skaityti straipsnį svetainėje'][$lang]", "'lt' => 'Skaityti straipsnį svetainėje', 'pt' => 'Ler o artigo no site'][$lang]"),
    ("'lt'=>'Atsisakyti prenumeratos'][$t['lang']]", "'lt'=>'Atsisakyti prenumeratos','pt'=>'Cancelar a inscrição'][$t['lang']]"),
])
patch('api/remind-mail.php', [
    ("'Kas naujo', 'd. prieš', 'dar nepradėta'],", "'Kas naujo', 'd. prieš', 'dar nepradėta'],\n    'pt' => ['📚 Hora de praticar? Muita novidade no Komiks·Lab', 'Sentimos a sua falta no Komiks·Lab', 'Oi, %s! Um lembrete amigo para continuar estudando: só 10 minutos por dia com um quadrinho ou um teste já fazem uma diferença real. E aqui aparece algo novo todos os dias — veja algumas novidades fresquinhas.', 'Continuar estudando', 'Abra o “Hoje” para ver o plano do dia, a palavra do dia e a sua sequência.', 'O seu progresso', 'dias de estudo', 'sequência', 'última visita', 'Novidades', 'dias atrás', 'ainda não começou'],"),
])
patch('api/admin-dash.php', [
    ("'lt' => '🇱🇹 Lietuvių'];", "'lt' => '🇱🇹 Lietuvių', 'pt' => '🇧🇷 Português'];"),
])
patch('api/mail-studio-view.php', [
    ("'tr'=>'Türkçe','ar'=>'العربية'];}", "'tr'=>'Türkçe','pt'=>'Português','ar'=>'العربية'];}"),
])
print('ok')
