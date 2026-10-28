"""data/seo.js: дописати pt у кожен об'єкт мов (CAT, COMIC, TRACK, WORDS, KIND)."""
import re
p = 'data/seo.js'
s = open(p, encoding='utf-8').read()
PT = {
    # CAT
    "en: 'everyday Norwegian'": 'norueguês do dia a dia',
    "en: 'Norwegian family vocabulary'": 'vocabulário de família em norueguês',
    "en: 'Norwegian for school'": 'norueguês para a escola',
    "en: 'Norwegian food words'": 'palavras de comida em norueguês',
    "en: 'nature and weather in Norwegian'": 'natureza e tempo em norueguês',
    "en: 'free time and hobbies in Norwegian'": 'lazer e hobbies em norueguês',
    "en: 'shopping in Norwegian'": 'fazer compras em norueguês',
    "en: 'Norwegian at the doctor and pharmacy'": 'norueguês no médico e na farmácia',
    "en: 'Norwegian for work'": 'norueguês para o trabalho',
    "en: 'housing in Norway: Norwegian words'": 'moradia na Noruega: palavras em norueguês',
    "en: 'Norwegian culture and traditions'": 'cultura e tradições norueguesas',
    "en: 'Norwegian grammar in context'": 'gramática norueguesa no contexto',
    "en: 'coding basics for kids'": 'noções de programação para crianças',
    # COMIC
    "en: 'What is coding? Programming for kids'": 'O que é programar? Programação para crianças',
    "en: 'What is an algorithm? For kids'": 'O que é um algoritmo? Para crianças',
    "en: 'Loops in coding for kids'": 'Laços na programação para crianças',
    "en: 'If-then-else conditions for kids'": 'Condições se–então–senão para crianças',
    "en: 'Variables in coding for kids'": 'Variáveis na programação para crianças',
    "en: 'Debugging: finding bugs, for kids'": 'Depuração: como encontrar bugs, para crianças',
    "en: 'Programming languages explained for kids'": 'Linguagens de programação explicadas para crianças',
    "en: 'Modelling and flowcharts for kids'": 'Modelagem e fluxogramas para crianças',
    "en: 'HTML basics for kids: your first web page'": 'HTML para crianças: a sua primeira página',
    # TRACK
    "en: 'programming foundations for children'": 'fundamentos de programação para crianças',
    "en: 'coding concepts for children'": 'conceitos de programação para crianças',
    "en: 'HTML, CSS and JavaScript for kids'": 'HTML, CSS e JavaScript para crianças',
    "en: 'game development for kids'": 'criação de jogos para crianças',
    "en: 'Blender and 3D modelling for kids'": 'Blender e modelagem 3D para crianças',
    "en: 'Unity game development for kids'": 'criação de jogos no Unity para crianças',
    "en: 'databases and SQL for kids'": 'bancos de dados e SQL para crianças',
    "en: 'everyday safety for children'": 'segurança no dia a dia para crianças',
    "en: 'online safety for children'": 'segurança na internet para crianças',
    "en: 'how children can spot scams'": 'como as crianças podem reconhecer golpes',
    "en: 'device security for children'": 'segurança de aparelhos para crianças',
    "en: 'secure coding for children'": 'programação segura para crianças',
    "en: 'hackers and cyber defence for kids'": 'hackers e defesa digital para crianças',
    # WORDS / KIND
    "en: 'Words'": 'Palavras',
    "en: 'Norwegian comic'": 'quadrinho em norueguês',
}
done = 0
for key, pt in PT.items():
    # знаходимо об'єкт { en: '…', … lt: '…' } і дописуємо pt перед закривною дужкою
    i = s.find('{ ' + key)
    assert i >= 0, key
    j = s.index('}', i)
    obj = s[i:j]
    assert 'pt:' not in obj, key
    s = s[:j].rstrip() + ", pt: '" + pt.replace("'", "\\'") + "' " + s[j:]
    done += 1
open(p, 'w', encoding='utf-8').write(s)
print('ok', done)
