<?php
declare(strict_types=1);

const ANDROID_TEST_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.bilohash.comiks';

/** Content for the Android testing invitation. Unknown languages fall back to English. */
function testing_mail_text(string $lang): array {
  $all = [
    'uk' => [
      'subject' => 'Посилання на Android-тестування — Learning Norwegian',
      'title' => 'Ваше Android-тестування готове 🤖',
      'intro' => 'Дякуємо, що допомагаєте тестувати Learning Norwegian від Komiks·Lab. Встановіть застосунок за посиланням нижче та перевірте комікси, озвучення, слова й тести на своєму Android-пристрої.',
      'btn' => 'Завантажити в Google Play',
      'after' => '<div style="margin:0 0 18px;padding:16px 18px;background:#fff8df;border:2px solid #141414;border-radius:14px"><b style="font-size:17px">Як пройти тестування:</b><ol style="margin:10px 0 0;padding-left:22px;line-height:1.65"><li>Відкрийте Google Play за кнопкою та встановіть або оновіть застосунок.</li><li>Увійдіть у Komiks·Lab і перевірте навчальні матеріали.</li><li><b>Відкривайте застосунок щодня 14 днів поспіль</b> і виконуйте хоча б одну коротку вправу.</li><li>Не виходьте з програми тестування в Google Play протягом цього періоду.</li></ol></div><p style="margin:0 0 14px;line-height:1.6"><b>Навіщо 14 днів?</b> Це допомагає зберегти участь у тестуванні та тестовий Premium-доступ, якщо він активований для вашого облікового запису, а нам — побачити, чи стабільно працює застосунок у щоденному використанні.</p><p style="margin:0 0 14px;line-height:1.6">Будемо вдячні за чесний відгук: що сподобалося, що було незрозуміло та що варто покращити. Якщо знайшли помилку, напишіть модель телефона й кроки, після яких вона з’явилася: <a href="mailto:email@bilohash.com">email@bilohash.com</a>.</p><p style="margin:0;line-height:1.55"><a href="' . ANDROID_TEST_PLAY_URL . '">Learning Norwegian у Google Play</a></p>',
      'plain' => "Ваше Android-тестування готове.\n\n1. Відкрийте Google Play і встановіть або оновіть застосунок.\n2. Увійдіть у Komiks·Lab і перевірте навчальні матеріали.\n3. Відкривайте застосунок щодня 14 днів поспіль і виконуйте хоча б одну коротку вправу.\n4. Не виходьте з програми тестування в Google Play протягом цього періоду.\n\nЦе допомагає зберегти участь у тестуванні та тестовий Premium-доступ, якщо він активований для вашого облікового запису, а нам — зробити застосунок кращим.\n\nНадішліть відгук на email@bilohash.com.\n\n" . ANDROID_TEST_PLAY_URL,
    ],
    'en' => [
      'subject' => 'Your Android testing link — Learning Norwegian',
      'title' => 'Your Android test is ready 🤖',
      'intro' => 'Thank you for helping us test Learning Norwegian by Komiks·Lab. Install the app using the link below and try the comics, audio, vocabulary and quizzes on your Android device.',
      'btn' => 'Download on Google Play',
      'after' => '<div style="margin:0 0 18px;padding:16px 18px;background:#fff8df;border:2px solid #141414;border-radius:14px"><b style="font-size:17px">How to complete the test:</b><ol style="margin:10px 0 0;padding-left:22px;line-height:1.65"><li>Open Google Play with the button and install or update the app.</li><li>Sign in to Komiks·Lab and try the learning materials.</li><li><b>Open the app every day for 14 days in a row</b> and complete at least one short activity.</li><li>Stay enrolled in the Google Play testing programme during this period.</li></ol></div><p style="margin:0 0 14px;line-height:1.6"><b>Why 14 days?</b> This helps keep your testing participation and test Premium access, if it is enabled for your account, and helps us check that the app works reliably in everyday use.</p><p style="margin:0 0 14px;line-height:1.6">We would appreciate honest feedback: what you liked, what was confusing and what we should improve. If you find a bug, include your phone model and the steps that caused it: <a href="mailto:email@bilohash.com">email@bilohash.com</a>.</p><p style="margin:0;line-height:1.55"><a href="' . ANDROID_TEST_PLAY_URL . '">Learning Norwegian on Google Play</a></p>',
      'plain' => "Your Android test is ready.\n\n1. Open Google Play and install or update the app.\n2. Sign in to Komiks·Lab and try the learning materials.\n3. Open the app every day for 14 days in a row and complete at least one short activity.\n4. Stay enrolled in the Google Play testing programme during this period.\n\nThis helps keep your testing participation and test Premium access, if it is enabled for your account, and helps us improve the app.\n\nSend feedback to email@bilohash.com.\n\n" . ANDROID_TEST_PLAY_URL,
    ],
    'no' => [
      'subject' => 'Lenken din til Android-testing — Learning Norwegian',
      'title' => 'Android-testen din er klar 🤖',
      'intro' => 'Takk for at du hjelper oss med å teste Learning Norwegian fra Komiks·Lab. Installer appen fra lenken under, og prøv tegneserier, lyd, ord og prøver på Android-enheten din.',
      'btn' => 'Last ned fra Google Play',
      'after' => '<div style="margin:0 0 18px;padding:16px 18px;background:#fff8df;border:2px solid #141414;border-radius:14px"><b style="font-size:17px">Slik fullfører du testen:</b><ol style="margin:10px 0 0;padding-left:22px;line-height:1.65"><li>Åpne Google Play med knappen og installer eller oppdater appen.</li><li>Logg inn på Komiks·Lab og prøv lærestoffet.</li><li><b>Åpne appen hver dag i 14 dager på rad</b> og gjør minst én kort oppgave.</li><li>Ikke forlat testprogrammet i Google Play i denne perioden.</li></ol></div><p style="margin:0 0 14px;line-height:1.6"><b>Hvorfor 14 dager?</b> Dette bidrar til å beholde deltakelsen i testen og Premium-testtilgangen, hvis den er aktivert for kontoen din, og hjelper oss å kontrollere at appen fungerer stabilt i daglig bruk.</p><p style="margin:0 0 14px;line-height:1.6">Vi setter pris på ærlige tilbakemeldinger: hva du likte, hva som var uklart, og hva vi bør forbedre. Hvis du finner en feil, ta med telefonmodell og trinnene som førte til feilen: <a href="mailto:email@bilohash.com">email@bilohash.com</a>.</p><p style="margin:0;line-height:1.55"><a href="' . ANDROID_TEST_PLAY_URL . '">Learning Norwegian på Google Play</a></p>',
      'plain' => "Android-testen din er klar.\n\n1. Åpne Google Play og installer eller oppdater appen.\n2. Logg inn på Komiks·Lab og prøv lærestoffet.\n3. Åpne appen hver dag i 14 dager på rad og gjør minst én kort oppgave.\n4. Ikke forlat testprogrammet i Google Play i denne perioden.\n\nDette bidrar til å beholde testdeltakelsen og Premium-testtilgangen, hvis den er aktivert for kontoen din, og hjelper oss å forbedre appen.\n\nSend tilbakemelding til email@bilohash.com.\n\n" . ANDROID_TEST_PLAY_URL,
    ],
  ];
  return $all[$lang] ?? $all['en'];
}

/** Returns sent, email or mail so the admin action can keep failed requests open. */
function send_android_testing_invite(array $feedback): string {
  $email = strtolower(trim((string)($feedback['email'] ?? '')));
  if (!valid_email($email)) return 'email';

  $lang = kl_lang((string)($feedback['lang'] ?? ''), 'en');
  $t = testing_mail_text($lang);
  $html = mail_layout(
    $lang,
    $t['title'],
    $t['intro'],
    $t['btn'],
    ANDROID_TEST_PLAY_URL,
    $t['after'],
    'Komiks·Lab · Learning Norwegian'
  );
  return send_mail($email, 'Komiks·Lab: ' . $t['subject'], $html, $t['plain']) ? 'sent' : 'mail';
}
