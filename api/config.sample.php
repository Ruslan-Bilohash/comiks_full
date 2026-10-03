<?php
/* Комікс·Lab — налаштування API. Скопіюйте цей файл як config.php (на сервері, у папці comiks/api/)
 * і заповніть. config.php НЕ входить у збірку dist і не перезаписується при оновленнях.
 *
 * Hostinger:
 *  1) hPanel → Databases → MySQL Databases: створіть базу й користувача — впишіть назву, логін і пароль нижче
 *     (хост зазвичай «localhost»).
 *  2) hPanel → Emails: створіть скриньку, напр. no-reply@bilohash.com — впишіть її в mail.from та mail.user,
 *     пароль — у mail.pass. SMTP Hostinger: smtp.hostinger.com, порт 465, ssl.
 *  3) secret — довгий випадковий рядок (наприклад, 64 символи), не змінюйте його після запуску.
 */
return [
  'site_url' => 'https://bilohash.com/comiks/',
  'secret'   => 'ЗАМІНІТЬ-НА-ДОВГИЙ-ВИПАДКОВИЙ-РЯДОК-64-СИМВОЛИ',
  'db' => [
    'dsn'  => 'mysql:host=localhost;dbname=u000000000_komiks;charset=utf8mb4',
    'user' => 'u000000000_komiks',
    'pass' => 'ПАРОЛЬ_БАЗИ',
  ],
  'mail' => [
    'transport' => 'smtp',              // smtp | mail (функція PHP mail) | log (лише для тестів — пише листи у файли)
    'host'      => 'smtp.hostinger.com',
    'port'      => 465,
    'secure'    => 'ssl',               // ssl (465) або tls (587, STARTTLS)
    'user'      => 'no-reply@bilohash.com',
    'pass'      => 'ПАРОЛЬ_ПОШТИ',
    'from'      => 'no-reply@bilohash.com',
    'from_name' => 'Komiks·Lab',
    'reply_to'  => 'no-reply@bilohash.com',
  ],
  /* 💳 Преміум-підписка (Stripe). Ключі беріть у dashboard.stripe.com → Developers → API keys.
     ВАЖЛИВО: секретний ключ (sk_live_…) має бути ЛИШЕ тут, на сервері. Ніколи не надсилайте його
     в чати, листи чи репозиторій — якщо він десь «засвітився», одразу зробіть Roll key у Stripe.
     webhook: Developers → Webhooks → endpoint https://bilohash.com/comiks/api/stripe-webhook.php
     (події checkout.session.completed, invoice.paid, customer.subscription.deleted) → Signing secret whsec_… */
  'stripe' => [
    'secret'      => '',   // sk_live_… або sk_test_…
    'publishable' => '',   // pk_live_… (не секретний)
    'webhook'     => '',   // whsec_…
  ],
  /* 🤖 Телефонні дзвінки з ШІ (сторінка «📞 Дзвінок»). Без ключа дзвінки працюють за сценарієм,
     із ключем — це жива розмова норвезькою. Ключ лишається на сервері й у браузер не потрапляє.
     provider: openai | groq | xai (Grok) | anthropic | together | openrouter */
  'ai' => [
    'enabled'  => true, // false — вимкнути ШІ повністю: розмови, підказки, перевірку письма.
                        //         Сильніше за будь-яке налаштування в адмінці.
    'provider' => 'openai',
    'key'      => '',
    'model'    => '',   // порожньо — візьметься дешева модель за замовчуванням
  ],
  /* 🔊 Голос для живих реплік у дзвінках. Якщо провайдер ШІ — openai, окремий ключ не потрібен.
     provider: openai (голоси nova, alloy, shimmer…) | elevenlabs (voice — id голосу) | none */
  'tts' => [
    'enabled'  => true, // false — прибрати кнопки живого голосу з сайту. Саме прибрати,
                        //         а не підмінити голосом браузера: робот звучить гірше,
                        //         ніж його відсутність. Озвучені комікси (mp3 у /audio)
                        //         це не зачіпає — вони лежать файлами й ШІ не потребують.
    'provider' => '',
    'key'      => '',
    'voice'    => '',   // openai: nova · elevenlabs: id голосу
    'model'    => '',
  ],
  // хости для локальної розробки, з яких дозволені POST-запити (на сервері залиште порожнім)
  'dev_hosts' => [],
];
