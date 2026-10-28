<?php
/* Комікс·Lab — 📬 лист «Нагадування про навчання + у нас багато нового» (admin.php → 🛠️ Дії).
 * Мовою акаунта (8 мов): особистий підсумок (днів навчання, серія, коли був востаннє) і три
 * останні записи «Що нового» з data/updates.json. Надсилає лише адмін кнопкою, і лише тим, хто
 * підтвердив пошту й не відписався (перевіряє admin.php). */
declare(strict_types=1);
if (!defined('KOMIKS_API')) exit;

function remind_mail_text(string $lang): array {
  $T = [
    'uk' => ['📚 Час повчитися? У Комікс·Lab багато нового', 'Сумуємо за тобою в Комікс·Lab', 'Вітаю, %s! Нагадуємо про навчання: навіть 10 хвилин на день із коміксом чи тестом дають помітний результат. А в нас щодня з’являється щось нове — ось кілька свіжих новин.', 'Продовжити навчання', 'Відкрий «Сьогодні» — там план на день, слово дня й твоя серія.', 'Твій прогрес', 'днів навчання', 'серія', 'востаннє', 'Що нового', 'дн. тому', 'ще не починали'],
    'en' => ['📚 Time to practise? Lots of new things at Komiks·Lab', 'We miss you at Komiks·Lab', 'Hi %s! A friendly reminder to keep learning: even 10 minutes a day with a comic or a test makes a real difference. And something new appears here every day — here are a few fresh updates.', 'Continue learning', 'Open “Today” for your daily plan, the word of the day and your streak.', 'Your progress', 'days of learning', 'streak', 'last seen', 'What’s new', 'days ago', 'not started yet'],
    'no' => ['📚 Tid for å øve? Mye nytt i Komiks·Lab', 'Vi savner deg i Komiks·Lab', 'Hei %s! En vennlig påminnelse om å fortsette å lære: bare 10 minutter om dagen med en tegneserie eller en test gjør en stor forskjell. Og hos oss kommer det noe nytt hver dag – her er noen ferske nyheter.', 'Fortsett å lære', 'Åpne «I dag» for dagens plan, dagens ord og rekken din.', 'Din fremgang', 'dager med læring', 'rekke', 'sist aktiv', 'Hva er nytt', 'dager siden', 'ikke startet ennå'],
    'ar' => ['📚 حان وقت التعلّم؟ الكثير من الجديد في Komiks·Lab', 'نفتقدك في Komiks·Lab', 'مرحبًا %s! تذكير لطيف بمواصلة التعلّم: حتى 10 دقائق يوميًا مع قصة مصوّرة أو اختبار تصنع فرقًا حقيقيًا. وكل يوم يظهر لدينا شيء جديد — إليك بعض الأخبار.', 'واصل التعلّم', 'افتح «اليوم» لترى خطة اليوم وكلمة اليوم وسلسلتك.', 'تقدّمك', 'أيام تعلّم', 'السلسلة', 'آخر نشاط', 'ما الجديد', 'يومًا مضت', 'لم تبدأ بعد'],
    'de' => ['📚 Zeit zum Üben? Viel Neues bei Komiks·Lab', 'Wir vermissen dich bei Komiks·Lab', 'Hallo %s! Eine kleine Erinnerung ans Lernen: Schon 10 Minuten am Tag mit einem Comic oder einem Test machen einen echten Unterschied. Und bei uns gibt es jeden Tag etwas Neues – hier ein paar frische Neuigkeiten.', 'Weiterlernen', 'Öffne „Heute“ für deinen Tagesplan, das Wort des Tages und deine Serie.', 'Dein Fortschritt', 'Lerntage', 'Serie', 'zuletzt aktiv', 'Was ist neu', 'Tage her', 'noch nicht begonnen'],
    'pl' => ['📚 Czas na naukę? Mnóstwo nowości w Komiks·Lab', 'Tęsknimy za Tobą w Komiks·Lab', 'Cześć %s! Przypominamy o nauce: nawet 10 minut dziennie z komiksem albo testem robi prawdziwą różnicę. A u nas codziennie pojawia się coś nowego – oto kilka świeżych nowości.', 'Kontynuuj naukę', 'Otwórz „Dzisiaj”, aby zobaczyć plan dnia, słowo dnia i swoją serię.', 'Twoje postępy', 'dni nauki', 'seria', 'ostatnio', 'Co nowego', 'dni temu', 'jeszcze nie zaczęto'],
    'tr' => ['📚 Çalışma zamanı mı? Komiks·Lab’de pek çok yenilik var', 'Komiks·Lab’de seni özledik', 'Merhaba %s! Öğrenmeye devam etmen için küçük bir hatırlatma: bir çizgi roman ya da testle günde 10 dakika bile gerçek bir fark yaratır. Bizde her gün yeni bir şey çıkıyor — işte birkaç taze haber.', 'Öğrenmeye devam et', 'Günün planı, günün kelimesi ve serin için “Bugün” sayfasını aç.', 'İlerlemen', 'öğrenme günü', 'seri', 'son görülme', 'Yenilikler', 'gün önce', 'henüz başlanmadı'],
    'lt' => ['📚 Laikas pasimokyti? Komiks·Lab daug naujienų', 'Pasiilgome jūsų Komiks·Lab', 'Sveiki, %s! Primename apie mokymąsi: net 10 minučių per dieną su komiksu ar testu duoda tikrą rezultatą. O pas mus kasdien atsiranda kažkas naujo – štai kelios šviežios naujienos.', 'Tęsti mokymąsi', 'Atidarykite „Šiandien“: dienos planas, dienos žodis ir jūsų serija.', 'Jūsų pažanga', 'mokymosi dienų', 'serija', 'paskutinį kartą', 'Kas naujo', 'd. prieš', 'dar nepradėta'],
    'pt' => ['📚 Hora de praticar? Muita novidade no Komiks·Lab', 'Sentimos a sua falta no Komiks·Lab', 'Oi, %s! Um lembrete amigo para continuar estudando: só 10 minutos por dia com um quadrinho ou um teste já fazem uma diferença real. E aqui aparece algo novo todos os dias — veja algumas novidades fresquinhas.', 'Continuar estudando', 'Abra o “Hoje” para ver o plano do dia, a palavra do dia e a sua sequência.', 'O seu progresso', 'dias de estudo', 'sequência', 'última visita', 'Novidades', 'dias atrás', 'ainda não começou'],
  ];
  $r = $T[$lang] ?? $T['en'];
  return ['subject' => $r[0], 'title' => $r[1], 'intro' => $r[2], 'btn' => $r[3], 'after' => $r[4],
    'progress' => $r[5], 'days' => $r[6], 'streak' => $r[7], 'last' => $r[8], 'news' => $r[9], 'dd' => $r[10], 'none' => $r[11]];
}

/** Особистий блок і новини для листа. $days — список дат YYYY-MM-DD з ключа «days» акаунта. */
function remind_mail_extra(string $lang, array $days): string {
  $R = remind_mail_text($lang);
  $e = fn($s) => htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
  $days = array_values(array_unique(array_filter($days, fn($d) => is_string($d) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $d))));
  sort($days);
  $set = array_flip($days); $streak = 0;
  $x = isset($set[date('Y-m-d')]) ? date('Y-m-d') : date('Y-m-d', strtotime('-1 day'));
  while (isset($set[$x])) { $streak++; $x = date('Y-m-d', strtotime($x . ' -1 day')); }
  $last = $days ? end($days) : '';
  $ago = $last ? max(0, (int)floor((time() - strtotime($last)) / 86400)) : null;
  $tile = fn($n, $label) => '<td style="padding:10px 6px;text-align:center;border:2px solid #141414;border-radius:12px;background:#fff8e1">'
    . '<div style="font-size:24px;font-weight:900">' . $e($n) . '</div><div style="font-size:12px;color:#5d5346">' . $e($label) . '</div></td>';
  $html = '<h3 style="margin:18px 0 8px;font-size:17px">' . $e($R['progress']) . '</h3>'
    . '<table role="presentation" cellspacing="6" style="width:100%;border-collapse:separate"><tr>'
    . $tile(count($days), $R['days']) . $tile($streak ? '🔥 ' . $streak : '—', $R['streak'])
    . $tile($ago === null ? $R['none'] : ($ago === 0 ? '✓' : $ago . ' ' . $R['dd']), $R['last']) . '</tr></table>';
  // три останні записи «Що нового» мовою людини (запасна — англійська)
  $raw = @file_get_contents(__DIR__ . '/../data/updates.json');
  $list = is_string($raw) ? (json_decode($raw, true) ?: []) : [];
  $items = '';
  foreach (array_slice($list, 0, 3) as $u) {
    $L = $u['langs'][$lang] ?? $u['langs']['en'] ?? null;
    if (!$L || empty($L['lines'][0])) continue;
    $href = site_url() . ($u['link'] ?? '#/whatsnew');
    $items .= '<li style="margin:0 0 10px"><a href="' . $e($href) . '" style="color:#141414;text-decoration:none;line-height:1.45">' . $e($L['lines'][0]) . '</a></li>';
  }
  if ($items !== '') $html .= '<h3 style="margin:18px 0 8px;font-size:17px">✨ ' . $e($R['news']) . '</h3><ul style="padding-left:18px;margin:0">' . $items . '</ul>';
  return $html;
}
