/* Комікс·Lab — серверні акаунти (api/auth.php, MySQL): реєстрація з підтвердженням пошти, лист-привітання,
   вхід, відновлення пароля, синхронізація прогресу між пристроями.
   Якщо сервер недоступний (файл, немає config.php) — сайт працює як раніше, з локальними акаунтами.
   Сторінки: #/login, #/register, #/verify-sent, #/welcome, #/verify-failed, #/forgot, #/reset/<токен>. */
(() => {
  'use strict';
  if (typeof document === 'undefined') return;
  const API = 'api/auth.php';
  const GLOBAL = new Set(['users', 'session', 'consent', 'welcomed', 'ui']);
  const S = { server: false, user: null, dirty: new Set(), timer: 0 };
  let readyDone; S.ready = new Promise(r => { readyDone = r; });
  const C = () => window.KomiksCore;
  const TX = {
    uk: {
      login_t: 'Вхід', login_d: 'Увійди, щоб прогрес зберігався на всіх пристроях.', email: 'Пошта', pass: 'Пароль', pass2: 'Повтори пароль', name: 'Ім’я або нікнейм', login_btn: 'Увійти', no_acc: 'Ще немає акаунта?', reg_link: 'Зареєструватися', forgot_link: 'Забули пароль?',
      demo_h: 'Спробуй без пароля', demo_sum: '👀 Подивитися чужим акаунтом', demo_d: 'Демо-учні для класу. Натисни ім’я — і одразу в грі.', demo_as: n => 'Грати як ' + n, demo_note: 'Це демо-акаунт без пароля. Його можуть відкрити інші в класі — не зберігай тут особисте.',
      reg_t: 'Створи акаунт', reg_d: 'Безкоштовно. Прогрес, аватар і друзі — на всіх твоїх пристроях.', reg_btn: 'Створити акаунт', have_acc: 'Уже є акаунт?', consent: 'Я погоджуюсь з умовами використання (за дитину погоджуються батьки).', terms: 'Умови', move: 'Перенести мій поточний прогрес у новий акаунт',
      strength: ['дуже слабкий', 'слабкий', 'непоганий', 'надійний', 'дуже надійний'], pass_hint: 'Щонайменше 8 символів. Краще — фраза з кількох слів.',
      sent_t: 'Перевір свою пошту 📬', sent_d: e => `Ми надіслали лист на <b>${e}</b>. Натисни в ньому кнопку «Підтвердити пошту» — і акаунт буде готовий.`, sent_tips: ['Лист зазвичай приходить за хвилину.', 'Не бачиш? Зазирни в «Спам» або «Промоакції».', 'Посилання діє 48 годин.'], resend: 'Надіслати ще раз', resend_in: s => `Надіслати ще раз через ${s} с`, resent: 'Готово! Перевір пошту ще раз.', wrong_email: 'Помилилися в адресі? Зареєструйтеся ще раз',
      welcome_t: n => `Пошту підтверджено! Ласкаво просимо, ${n}! 🎉`, welcome_d: 'Твій акаунт активний, а на пошту вже летить лист-привітання. Прогрес тепер зберігається на сервері й доступний на будь-якому пристрої.', next_t: 'З чого почати', steps: [['🎨', 'Створи героя', 'Обери тваринку, шапку й окуляри', '#/avatar'], ['📖', 'Перший комікс', 'Прочитай історію з живими голосами', '#/'], ['🔎', 'Знайди друзів', 'Змагайся з іншими гравцями', '#/players']], to_account: 'До кабінету',
      fail_t: 'Посилання не спрацювало 😕', fail_d: 'Посилання для підтвердження вже використане або застаріло. Введи пошту — надішлемо нове.', send_new: 'Надіслати нове посилання',
      tfa_t: '🔐 Двофакторна авторизація',
      tfa_off_d: 'Додатковий код із застосунку-автентифікатора під час входу. Навіть якщо хтось дізнається пароль або отримає доступ до пошти, увійти без вашого телефона він не зможе.',
      tfa_on_d: '✅ Увімкнено. Під час входу запитуємо код із застосунку.',
      tfa_start: 'Увімкнути', tfa_step1: '1. Відскануйте код у застосунку',
      tfa_apps: 'Підійде будь-який: Google Authenticator, Microsoft Authenticator, Authy, 2FAS, Aegis.',
      tfa_manual: 'Не скануєте? Введіть ключ руками:',
      tfa_step2: '2. Введіть шестизначний код із застосунку',
      tfa_confirm: 'Підтвердити', tfa_wrong: 'Код не підійшов. Перевірте, що час на телефоні точний.',
      tfa_saved: '✅ Готово — двофакторну ввімкнено.',
      tfa_backup_t: '🔑 Резервні коди — збережіть зараз',
      tfa_backup_d: 'Кожен працює один раз і виручить, якщо телефон загубиться. Більше ми їх не покажемо: у базі лежать лише згортки.',
      tfa_copy: 'Скопіювати', tfa_copied: 'Скопійовано',
      tfa_off: 'Вимкнути', tfa_off_ask: 'Введіть код із застосунку або резервний код, щоб вимкнути:',
      tfa_new_backup: 'Нові резервні коди', tfa_left: n => `Резервних кодів лишилось: ${n}`,
      tfa_login_t: 'Код підтвердження', tfa_login_d: 'Відкрийте застосунок-автентифікатор і введіть шестизначний код. Або скористайтеся резервним.',
      tfa_login_btn: 'Увійти',
      magic_link: 'Увійти без пароля →', pass_link: 'Увійти з паролем →', pass_t: 'Вхід із паролем',
      pass_d: 'Якщо ви вже маєте пароль — введіть пошту й пароль. Або поверніться й увійдіть за кодом із листа.',
      magic_t: 'Вхід за кодом з пошти', magic_d: 'Введіть пошту — надішлемо посилання й код. Пароль не потрібен.',
      magic_btn: 'Надіслати код', magic_sent: 'Якщо така пошта зареєстрована, лист уже в дорозі. Відкрийте посилання або введіть код нижче — діє 15 хвилин.',
      magic_code_l: 'Код із листа', magic_go: 'Увійти', magic_wrong: 'Код не підійшов або вже застарів. Надішліть новий.',
      magic_again: 'Надіслати ще раз', magic_wait: 'Заходимо…', magic_bad: 'Посилання застаріло або вже використане. Надішліть новий код.',
      forgot_t: 'Забули пароль?', forgot_d: 'Введи пошту акаунта — ми надішлемо посилання для нового пароля.', forgot_btn: 'Надіслати посилання', forgot_ok: 'Якщо така пошта зареєстрована, лист уже в дорозі. Посилання діє 1 годину.',
      reset_t: 'Новий пароль 🔑', reset_btn: 'Зберегти пароль', reset_ok: 'Пароль змінено — ти увійшов.',
      acc_t: '🔐 Акаунт і безпека', verified: '✅ Пошту підтверджено', change_pass: 'Змінити пароль', old_pass: 'Поточний пароль', new_pass: 'Новий пароль', save: 'Зберегти', saved: 'Збережено ✓', logout: '🚪 Вийти', del_t: 'Видалити акаунт', del_d: 'Буде видалено акаунт, прогрес, профіль і коментарі. Цю дію не можна скасувати.', del_btn: 'Видалити назавжди', del_confirm: 'Точно видалити акаунт і всі дані?', synced: '☁️ Прогрес синхронізується з сервером',
      err: { wrong: 'Неправильна пошта або пароль.', unverified: 'Пошту ще не підтверджено. Перевір лист або надішли його ще раз.', pass_short: 'Пароль закороткий — щонайменше 8 символів.', pass_weak: 'Цей пароль надто простий.', pass_long: 'Пароль задовгий.', name: 'Вкажи ім’я (2–30 символів, без посилань).', email: 'Перевір адресу пошти.', consent: 'Потрібна згода з умовами.', slow_down: 'Забагато спроб. Спробуй за кілька хвилин.', token: 'Посилання застаріло — запроси нове.', mismatch: 'Паролі не збігаються.', net: 'Немає зв’язку з сервером. Спробуй ще раз.', server: 'Помилка сервера. Спробуй пізніше.', csrf: 'Онови сторінку й спробуй ще раз.', blocked: 'Акаунт заблоковано. Напиши нам, якщо це помилка.', demo: 'Демо-акаунт не змінює пароль і не видаляється.' }
    },
    en: {
      login_t: 'Log in', login_d: 'Log in to keep your progress on all your devices.', email: 'Email', pass: 'Password', pass2: 'Repeat password', name: 'Name or nickname', login_btn: 'Log in', no_acc: 'No account yet?', reg_link: 'Sign up', forgot_link: 'Forgot password?',
      demo_h: 'Try without a password', demo_sum: '👀 Look around with a demo account', demo_d: 'Class demo pupils. Tap a name and you are in.', demo_as: n => 'Play as ' + n, demo_note: 'This is a shared demo account with no password. Do not store anything personal here.',
      reg_t: 'Create your account', reg_d: 'Free. Your progress, avatar and friends — on every device.', reg_btn: 'Create account', have_acc: 'Already have an account?', consent: 'I agree to the terms of use (a parent agrees for a child).', terms: 'Terms', move: 'Move my current progress into the new account',
      strength: ['very weak', 'weak', 'okay', 'strong', 'very strong'], pass_hint: 'At least 8 characters. A phrase of several words is best.',
      sent_t: 'Check your email 📬', sent_d: e => `We sent an email to <b>${e}</b>. Tap “Confirm my email” in it and your account will be ready.`, sent_tips: ['It usually arrives within a minute.', 'Can’t see it? Check Spam or Promotions.', 'The link works for 48 hours.'], resend: 'Send again', resend_in: s => `Send again in ${s} s`, resent: 'Done! Check your inbox again.', wrong_email: 'Wrong address? Sign up again',
      welcome_t: n => `Email confirmed! Welcome, ${n}! 🎉`, welcome_d: 'Your account is active and a welcome email is on its way. Your progress is now saved on the server and available on any device.', next_t: 'Where to start', steps: [['🎨', 'Create your hero', 'Pick an animal, a hat and glasses', '#/avatar'], ['📖', 'First comic', 'Read a story with real voices', '#/'], ['🔎', 'Find friends', 'Compete with other players', '#/players']], to_account: 'To my account',
      fail_t: 'That link didn’t work 😕', fail_d: 'The confirmation link has already been used or has expired. Enter your email and we will send a new one.', send_new: 'Send a new link',
      tfa_t: '🔐 Two-factor authentication',
      tfa_off_d: 'An extra code from an authenticator app at sign-in. Even if someone learns your password or gets into your email, they cannot sign in without your phone.',
      tfa_on_d: '✅ On. We ask for a code from your app at every sign-in.',
      tfa_start: 'Turn on', tfa_step1: '1. Scan this code in your app',
      tfa_apps: 'Any will do: Google Authenticator, Microsoft Authenticator, Authy, 2FAS, Aegis.',
      tfa_manual: 'Not scanning? Type the key by hand:',
      tfa_step2: '2. Enter the six-digit code from the app',
      tfa_confirm: 'Confirm', tfa_wrong: 'That code did not work. Check that the clock on your phone is exact.',
      tfa_saved: '✅ Done — two-factor is on.',
      tfa_backup_t: '🔑 Backup codes — save them now',
      tfa_backup_d: 'Each works once and saves you if the phone is lost. We will not show them again: only hashes are stored.',
      tfa_copy: 'Copy', tfa_copied: 'Copied',
      tfa_off: 'Turn off', tfa_off_ask: 'Enter a code from the app or a backup code to turn it off:',
      tfa_new_backup: 'New backup codes', tfa_left: n => `Backup codes left: ${n}`,
      tfa_login_t: 'Confirmation code', tfa_login_d: 'Open your authenticator app and enter the six-digit code. Or use a backup code.',
      tfa_login_btn: 'Sign in',
      magic_link: 'Sign in without a password →', pass_link: 'Sign in with a password →', pass_t: 'Sign in with a password',
      pass_d: 'If you already have a password, enter your email and password. Or go back and sign in with a code from the email.',
      magic_t: 'Sign in with a code', magic_d: 'Enter your email — we will send a link and a code. No password needed.',
      magic_btn: 'Send the code', magic_sent: 'If that email is registered, the message is on its way. Open the link or type the code below — it works for 15 minutes.',
      magic_code_l: 'Code from the email', magic_go: 'Sign in', magic_wrong: 'That code did not work or has expired. Send a new one.',
      magic_again: 'Send again', magic_wait: 'Signing you in…', magic_bad: 'The link has expired or was already used. Send a new code.',
      forgot_t: 'Forgot your password?', forgot_d: 'Enter your account email and we will send a link to set a new password.', forgot_btn: 'Send link', forgot_ok: 'If that email is registered, the message is on its way. The link works for 1 hour.',
      reset_t: 'New password 🔑', reset_btn: 'Save password', reset_ok: 'Password changed — you are logged in.',
      acc_t: '🔐 Account & security', verified: '✅ Email confirmed', change_pass: 'Change password', old_pass: 'Current password', new_pass: 'New password', save: 'Save', saved: 'Saved ✓', logout: '🚪 Log out', del_t: 'Delete account', del_d: 'Your account, progress, profile and comments will be deleted. This cannot be undone.', del_btn: 'Delete forever', del_confirm: 'Really delete your account and all data?', synced: '☁️ Progress syncs with the server',
      err: { wrong: 'Wrong email or password.', unverified: 'Your email is not confirmed yet. Check the email or send it again.', pass_short: 'The password is too short — at least 8 characters.', pass_weak: 'This password is too simple.', pass_long: 'The password is too long.', name: 'Enter a name (2–30 characters, no links).', email: 'Check the email address.', consent: 'Please accept the terms.', slow_down: 'Too many attempts. Try again in a few minutes.', token: 'The link has expired — request a new one.', mismatch: 'Passwords do not match.', net: 'No connection to the server. Please try again.', server: 'Server error. Please try later.', csrf: 'Refresh the page and try again.', blocked: 'This account is blocked. Contact us if this is a mistake.', demo: 'A demo account cannot change password or be deleted.' }
    },
    no: {
      login_t: 'Logg inn', login_d: 'Logg inn for å ha fremgangen på alle enhetene dine.', email: 'E-post', pass: 'Passord', pass2: 'Gjenta passord', name: 'Navn eller kallenavn', login_btn: 'Logg inn', no_acc: 'Har du ikke konto?', reg_link: 'Registrer deg', forgot_link: 'Glemt passord?',
      demo_h: 'Prøv uten passord', demo_sum: '👀 Se deg rundt med en demokonto', demo_d: 'Demo-elever til klassen. Trykk et navn — så er du inne.', demo_as: n => 'Spill som ' + n, demo_note: 'Dette er en felles demokonto uten passord. Ikke lagre noe personlig her.',
      reg_t: 'Lag en konto', reg_d: 'Gratis. Fremgang, avatar og venner – på alle enheter.', reg_btn: 'Lag konto', have_acc: 'Har du allerede konto?', consent: 'Jeg godtar vilkårene (for barn godtar foreldrene).', terms: 'Vilkår', move: 'Flytt fremgangen min til den nye kontoen',
      strength: ['svært svakt', 'svakt', 'greit', 'sterkt', 'svært sterkt'], pass_hint: 'Minst 8 tegn. En setning med flere ord er best.',
      sent_t: 'Sjekk e-posten din 📬', sent_d: e => `Vi har sendt en e-post til <b>${e}</b>. Trykk på «Bekreft e-posten» – så er kontoen klar.`, sent_tips: ['Den kommer vanligvis innen ett minutt.', 'Ser du den ikke? Sjekk søppelpost.', 'Lenken virker i 48 timer.'], resend: 'Send på nytt', resend_in: s => `Send på nytt om ${s} s`, resent: 'Ferdig! Sjekk innboksen igjen.', wrong_email: 'Feil adresse? Registrer deg på nytt',
      welcome_t: n => `E-posten er bekreftet! Velkommen, ${n}! 🎉`, welcome_d: 'Kontoen er aktiv, og en velkomst-e-post er på vei. Fremgangen lagres nå på serveren og er tilgjengelig på alle enheter.', next_t: 'Kom i gang', steps: [['🎨', 'Lag helten din', 'Velg dyr, lue og briller', '#/avatar'], ['📖', 'Første tegneserie', 'Les en historie med ekte stemmer', '#/'], ['🔎', 'Finn venner', 'Konkurrer med andre spillere', '#/players']], to_account: 'Til min side',
      fail_t: 'Lenken virket ikke 😕', fail_d: 'Bekreftelseslenken er brukt eller utløpt. Skriv inn e-posten, så sender vi en ny.', send_new: 'Send ny lenke',
      tfa_t: '🔐 Tofaktorpålogging',
      tfa_off_d: 'En ekstra kode fra en autentiseringsapp ved pålogging. Selv om noen får passordet ditt eller kommer inn i e-posten, kommer de ikke inn uten telefonen din.',
      tfa_on_d: '✅ På. Vi spør om kode fra appen hver gang du logger inn.',
      tfa_start: 'Slå på', tfa_step1: '1. Skann koden i appen',
      tfa_apps: 'Hvilken som helst: Google Authenticator, Microsoft Authenticator, Authy, 2FAS, Aegis.',
      tfa_manual: 'Skanner du ikke? Skriv nøkkelen manuelt:',
      tfa_step2: '2. Skriv den sekssifrede koden fra appen',
      tfa_confirm: 'Bekreft', tfa_wrong: 'Koden passet ikke. Sjekk at klokka på telefonen er riktig.',
      tfa_saved: '✅ Ferdig – tofaktor er på.',
      tfa_backup_t: '🔑 Reservekoder – lagre dem nå',
      tfa_backup_d: 'Hver virker én gang og redder deg om telefonen blir borte. Vi viser dem ikke igjen.',
      tfa_copy: 'Kopier', tfa_copied: 'Kopiert',
      tfa_off: 'Slå av', tfa_off_ask: 'Skriv en kode fra appen eller en reservekode for å slå av:',
      tfa_new_backup: 'Nye reservekoder', tfa_left: n => `Reservekoder igjen: ${n}`,
      tfa_login_t: 'Bekreftelseskode', tfa_login_d: 'Åpne autentiseringsappen og skriv den sekssifrede koden. Eller bruk en reservekode.',
      tfa_login_btn: 'Logg inn',
      magic_link: 'Logg inn uten passord →', pass_link: 'Logg inn med passord →', pass_t: 'Logg inn med passord',
      pass_d: 'Har du allerede et passord, skriv e-post og passord. Eller gå tilbake og logg inn med kode fra e-posten.',
      magic_t: 'Logg inn med kode', magic_d: 'Skriv e-posten din – vi sender en lenke og en kode. Du trenger ikke passord.',
      magic_btn: 'Send koden', magic_sent: 'Hvis e-posten er registrert, er meldingen på vei. Åpne lenken eller skriv koden under – den virker i 15 minutter.',
      magic_code_l: 'Kode fra e-posten', magic_go: 'Logg inn', magic_wrong: 'Koden passet ikke eller er utløpt. Send en ny.',
      magic_again: 'Send på nytt', magic_wait: 'Logger deg inn…', magic_bad: 'Lenken er utløpt eller allerede brukt. Send en ny kode.',
      forgot_t: 'Glemt passordet?', forgot_d: 'Skriv inn e-posten til kontoen, så sender vi en lenke for nytt passord.', forgot_btn: 'Send lenke', forgot_ok: 'Hvis e-posten er registrert, er meldingen på vei. Lenken virker i 1 time.',
      reset_t: 'Nytt passord 🔑', reset_btn: 'Lagre passord', reset_ok: 'Passordet er endret – du er logget inn.',
      acc_t: '🔐 Konto og sikkerhet', verified: '✅ E-posten er bekreftet', change_pass: 'Endre passord', old_pass: 'Nåværende passord', new_pass: 'Nytt passord', save: 'Lagre', saved: 'Lagret ✓', logout: '🚪 Logg ut', del_t: 'Slett konto', del_d: 'Kontoen, fremgangen, profilen og kommentarene slettes. Dette kan ikke angres.', del_btn: 'Slett for alltid', del_confirm: 'Vil du virkelig slette kontoen og alle data?', synced: '☁️ Fremgangen synkroniseres med serveren',
      err: { wrong: 'Feil e-post eller passord.', unverified: 'E-posten er ikke bekreftet ennå. Sjekk e-posten eller send den på nytt.', pass_short: 'Passordet er for kort – minst 8 tegn.', pass_weak: 'Dette passordet er for enkelt.', pass_long: 'Passordet er for langt.', name: 'Skriv et navn (2–30 tegn, uten lenker).', email: 'Sjekk e-postadressen.', consent: 'Du må godta vilkårene.', slow_down: 'For mange forsøk. Prøv igjen om noen minutter.', token: 'Lenken er utløpt – be om en ny.', mismatch: 'Passordene er ikke like.', net: 'Ingen forbindelse til serveren. Prøv igjen.', server: 'Serverfeil. Prøv senere.', csrf: 'Last inn siden på nytt og prøv igjen.', blocked: 'Kontoen er sperret. Kontakt oss hvis dette er en feil.', demo: 'Demokontoen kan ikke bytte passord eller slettes.' }
    }
  };
  if (window.KL_T_FILL) KL_T_FILL(TX, 'auth.js:TX');
  TX.ar = {
    login_t: 'تسجيل الدخول', login_d: 'سجّل الدخول ليُحفظ تقدّمك على كل أجهزتك.', email: 'البريد الإلكتروني', pass: 'كلمة المرور', pass2: 'أعد كتابة كلمة المرور', name: 'الاسم أو اللقب', login_btn: 'دخول', no_acc: 'ليس لديك حساب؟', reg_link: 'أنشئ حسابًا', forgot_link: 'نسيت كلمة المرور؟',
    demo_h: 'جرّب بلا كلمة مرور', demo_sum: '👀 تجوّل بحساب تجريبي', demo_d: 'تلاميذ تجريبيون للصف. اضغط الاسم وادخل.', demo_as: n => 'العب كـ ' + n, demo_note: 'حساب تجريبي مشترك بلا كلمة مرور. لا تحفظ فيه شيئًا شخصيًا.',
    reg_t: 'أنشئ حسابك', reg_d: 'مجانًا. تقدّمك وشخصيتك وأصدقاؤك — على كل أجهزتك.', reg_btn: 'إنشاء الحساب', have_acc: 'لديك حساب؟', consent: 'أوافق على شروط الاستخدام (عن الطفل يوافق أحد الوالدين).', terms: 'الشروط', move: 'انقل تقدّمي الحالي إلى الحساب الجديد',
    strength: ['ضعيفة جدًا', 'ضعيفة', 'مقبولة', 'قوية', 'قوية جدًا'], pass_hint: '8 أحرف على الأقل. الأفضل عبارة من عدة كلمات.',
    sent_t: 'تحقّق من بريدك 📬', sent_d: e => `أرسلنا رسالة إلى <b>${e}</b>. اضغط فيها على «تأكيد البريد» ويصبح حسابك جاهزًا.`, sent_tips: ['تصل الرسالة عادةً خلال دقيقة.', 'لا تراها؟ تحقّق من مجلد الرسائل غير المرغوب فيها.', 'الرابط صالح لمدة 48 ساعة.'], resend: 'أرسل مجددًا', resend_in: s => `أرسل مجددًا بعد ${s} ث`, resent: 'تم! تحقّق من بريدك مرة أخرى.', wrong_email: 'أخطأت في العنوان؟ سجّل من جديد',
    welcome_t: n => `تم تأكيد البريد! أهلًا بك يا ${n}! 🎉`, welcome_d: 'حسابك مفعّل، ورسالة ترحيب في طريقها إليك. يُحفظ تقدّمك الآن على الخادم ويمكنك الوصول إليه من أي جهاز.', next_t: 'من أين تبدأ', steps: [['🎨', 'أنشئ بطلك', 'اختر حيوانًا وقبعة ونظارة', '#/avatar'], ['📖', 'القصة الأولى', 'اقرأ قصة بأصوات حقيقية', '#/'], ['🔎', 'ابحث عن أصدقاء', 'تنافس مع لاعبين آخرين', '#/players']], to_account: 'إلى حسابي',
    fail_t: 'الرابط لم يعمل 😕', fail_d: 'رابط التأكيد مستخدم أو منتهي الصلاحية. اكتب بريدك وسنرسل رابطًا جديدًا.', send_new: 'أرسل رابطًا جديدًا',
    tfa_t: '🔐 المصادقة الثنائية',
    tfa_off_d: 'رمز إضافي من تطبيق مصادقة عند الدخول. حتى لو عرف أحد كلمة مرورك أو دخل بريدك، لن يدخل بلا هاتفك.',
    tfa_on_d: '✅ مفعّلة. نطلب رمزًا من التطبيق عند كل دخول.',
    tfa_start: 'تفعيل', tfa_step1: '١. امسح الرمز في التطبيق',
    tfa_apps: 'أي تطبيق يصلح: Google Authenticator أو Authy أو 2FAS.',
    tfa_manual: 'لا تمسح؟ اكتب المفتاح يدويًا:',
    tfa_step2: '٢. اكتب الرمز المكوّن من ست خانات',
    tfa_confirm: 'تأكيد', tfa_wrong: 'الرمز غير صحيح. تأكد من دقة ساعة الهاتف.',
    tfa_saved: '✅ تم تفعيل المصادقة الثنائية.',
    tfa_backup_t: '🔑 رموز احتياطية — احفظها الآن',
    tfa_backup_d: 'كل رمز يعمل مرة واحدة وينقذك إن ضاع الهاتف. لن نعرضها مرة أخرى.',
    tfa_copy: 'نسخ', tfa_copied: 'تم النسخ',
    tfa_off: 'إيقاف', tfa_off_ask: 'اكتب رمزًا من التطبيق أو رمزًا احتياطيًا للإيقاف:',
    tfa_new_backup: 'رموز احتياطية جديدة', tfa_left: n => `الرموز الاحتياطية المتبقية: ${n}`,
    tfa_login_t: 'رمز التأكيد', tfa_login_d: 'افتح تطبيق المصادقة واكتب الرمز. أو استخدم رمزًا احتياطيًا.',
    tfa_login_btn: 'دخول',
    magic_link: 'الدخول بلا كلمة مرور →', pass_link: 'الدخول بكلمة المرور →', pass_t: 'الدخول بكلمة المرور',
    pass_d: 'إن كانت لديك كلمة مرور فاكتب بريدك وكلمتك. أو ارجع وادخل برمز من الرسالة.',
    magic_t: 'الدخول برمز من البريد', magic_d: 'اكتب بريدك — سنرسل رابطًا ورمزًا. لا حاجة لكلمة مرور.',
    magic_btn: 'أرسل الرمز', magic_sent: 'إن كان البريد مسجّلًا فالرسالة في طريقها. افتح الرابط أو اكتب الرمز أدناه — صالح ١٥ دقيقة.',
    magic_code_l: 'الرمز من الرسالة', magic_go: 'دخول', magic_wrong: 'الرمز غير صحيح أو انتهت صلاحيته. أرسل رمزًا جديدًا.',
    magic_again: 'إرسال مرة أخرى', magic_wait: 'جارٍ الدخول…', magic_bad: 'انتهت صلاحية الرابط أو استُخدم. أرسل رمزًا جديدًا.',
    forgot_t: 'نسيت كلمة المرور؟', forgot_d: 'اكتب بريد حسابك وسنرسل رابطًا لتعيين كلمة مرور جديدة.', forgot_btn: 'أرسل الرابط', forgot_ok: 'إن كان هذا البريد مسجّلًا فالرسالة في طريقها. الرابط صالح لساعة واحدة.',
    reset_t: 'كلمة مرور جديدة 🔑', reset_btn: 'حفظ كلمة المرور', reset_ok: 'تم تغيير كلمة المرور — لقد سجّلت الدخول.',
    acc_t: '🔐 الحساب والأمان', verified: '✅ تم تأكيد البريد', change_pass: 'تغيير كلمة المرور', old_pass: 'كلمة المرور الحالية', new_pass: 'كلمة المرور الجديدة', save: 'حفظ', saved: 'تم الحفظ ✓', logout: '🚪 تسجيل الخروج', del_t: 'حذف الحساب', del_d: 'سيُحذف الحساب والتقدّم والملف الشخصي والتعليقات. لا يمكن التراجع عن ذلك.', del_btn: 'احذف نهائيًا', del_confirm: 'هل تريد حقًا حذف الحساب وكل البيانات؟', synced: '☁️ يُزامَن التقدّم مع الخادم',
    err: { wrong: 'بريد أو كلمة مرور خاطئة.', unverified: 'لم يُؤكَّد البريد بعد. تحقّق من الرسالة أو أرسلها مجددًا.', pass_short: 'كلمة المرور قصيرة جدًا — 8 أحرف على الأقل.', pass_weak: 'كلمة المرور هذه بسيطة جدًا.', pass_long: 'كلمة المرور طويلة جدًا.', name: 'اكتب اسمًا (2–30 حرفًا، بلا روابط).', email: 'تحقّق من عنوان البريد.', consent: 'يلزم الموافقة على الشروط.', slow_down: 'محاولات كثيرة. حاول بعد بضع دقائق.', token: 'انتهت صلاحية الرابط — اطلب رابطًا جديدًا.', mismatch: 'كلمتا المرور غير متطابقتين.', net: 'لا يوجد اتصال بالخادم. حاول مجددًا.', server: 'خطأ في الخادم. حاول لاحقًا.', csrf: 'حدّث الصفحة وحاول مجددًا.', blocked: 'هذا الحساب محظور. تواصل معنا إن كان ذلك خطأ.', demo: 'لا يمكن تغيير كلمة مرور الحساب التجريبي أو حذفه.' }
  };
  const PX3 = {
    uk: { share_t: '🔎 Показувати мене в пошуку гравців', share_d: 'Інші учні зможуть знайти тебе за ім’ям, побачити аватар і зірки та покликати грати. Пошта не показується ніколи. Змінити можна в «🔒 Конфіденційність».', inv_banner: n => `🎟 Тебе запросив(ла) ${n}! Цей акаунт буде безкоштовним назавжди 💎`, inv_bad: 'Це запрошення вже використане або застаріло — можна зареєструватися звичайно.',
      premium: '💎 Преміум — безкоштовно назавжди', staff: { admin: '👑 Адміністратор', moderator: '🛡 Модератор' }, inv_t: '🎟 Запросити друга', inv_d: 'Друзі, яких ти запросиш, отримають безкоштовний акаунт назавжди. Посилання одноразове й діє 30 днів.',
      inv_new: '🎟 Створити посилання', copy: '📋 Копіювати', copied: 'Скопійовано ✓', share: '📤 Поділитися', inv_used: n => `✅ ${n} приєднався(лася)`, inv_wait: d => `⏳ чекає до ${d}`, inv_old: '⌛ застаріло', inv_list: 'Мої запрошення',
      imp_t: '📥 Перенести прогрес з цього пристрою', imp_d: 'Зірки, пройдені тести, слова, аватар і код друга з локального акаунта перейдуть у серверний — найкращі результати зберігаються.', imp_guest: 'Гостьовий прогрес', imp_done: n => `Готово! Перенесено записів: ${n}. Оновлюємо сторінку…`,
      warn_t: 'Так писати не можна 🙅', warn_d: 'Модератор прибрав твій допис зі стіни. Будь добрим до інших — пиши те, що приємно читати.', ban_t: 'Пауза для стіни ⏸️', ban_d: 'Модератор прибрав твій допис і тимчасово заборонив писати на стінах. Грати й навчатися можна далі!', your_text: 'Твій допис:', understood: 'Зрозуміло 👍',
      note_t: 'Повідомлення від команди ✉️', note_d: 'Нам є що вам сказати:' },
    en: { share_t: '🔎 Show me in player search', share_d: 'Other learners can find you by name, see your avatar and stars and invite you to play. Your email is never shown. Change it any time in “🔒 Privacy”.', inv_banner: n => `🎟 ${n} invited you! This account will be free forever 💎`, inv_bad: 'This invitation is already used or expired — you can still sign up normally.',
      premium: '💎 Premium — free forever', staff: { admin: '👑 Administrator', moderator: '🛡 Moderator' }, inv_t: '🎟 Invite a friend', inv_d: 'Friends you invite get a free account forever. Each link works once and lasts 30 days.',
      inv_new: '🎟 Create a link', copy: '📋 Copy', copied: 'Copied ✓', share: '📤 Share', inv_used: n => `✅ ${n} joined`, inv_wait: d => `⏳ waiting until ${d}`, inv_old: '⌛ expired', inv_list: 'My invitations',
      imp_t: '📥 Move progress from this device', imp_d: 'Stars, finished tests, words, avatar and friend code from the local account move into your server account — the best results are kept.', imp_guest: 'Guest progress', imp_done: n => `Done! Records moved: ${n}. Reloading…`,
      warn_t: 'That is not OK 🙅', warn_d: 'A moderator removed your comment from a wall. Be kind to others — write things that are nice to read.', ban_t: 'Wall pause ⏸️', ban_d: 'A moderator removed your comment and paused your wall writing for a while. You can still play and learn!', your_text: 'Your comment:', understood: 'Got it 👍',
      note_t: 'A message from the team ✉️', note_d: 'We have something to tell you:' },
    no: { share_t: '🔎 Vis meg i spillersøket', share_d: 'Andre elever kan finne deg på navn, se avataren og stjernene dine og invitere deg til spill. E-posten vises aldri. Du kan endre dette i «🔒 Personvern».', inv_banner: n => `🎟 ${n} har invitert deg! Denne kontoen blir gratis for alltid 💎`, inv_bad: 'Invitasjonen er brukt eller utløpt – du kan registrere deg som vanlig.',
      premium: '💎 Premium – gratis for alltid', staff: { admin: '👑 Administrator', moderator: '🛡 Moderator' }, inv_t: '🎟 Inviter en venn', inv_d: 'Venner du inviterer, får en gratis konto for alltid. Hver lenke virker én gang i 30 dager.',
      inv_new: '🎟 Lag en lenke', copy: '📋 Kopier', copied: 'Kopiert ✓', share: '📤 Del', inv_used: n => `✅ ${n} ble med`, inv_wait: d => `⏳ venter til ${d}`, inv_old: '⌛ utløpt', inv_list: 'Mine invitasjoner',
      imp_t: '📥 Flytt fremgang fra denne enheten', imp_d: 'Stjerner, fullførte tester, ord, avatar og vennekode fra den lokale kontoen flyttes til serverkontoen – de beste resultatene beholdes.', imp_guest: 'Gjestefremgang', imp_done: n => `Ferdig! Flyttet ${n} poster. Laster inn på nytt …`,
      warn_t: 'Sånn kan vi ikke skrive 🙅', warn_d: 'En moderator fjernet innlegget ditt fra en vegg. Vær snill mot andre – skriv noe som er hyggelig å lese.', ban_t: 'Pause fra veggen ⏸️', ban_d: 'En moderator fjernet innlegget ditt og satte skriving på vegger på pause en stund. Du kan fortsatt spille og lære!', your_text: 'Innlegget ditt:', understood: 'Skjønner 👍',
      note_t: 'En melding fra oss ✉️', note_d: 'Vi har noe å si deg:' }
  };
  if (window.KL_T_FILL) KL_T_FILL(PX3, 'auth.js:PX3');
  PX3.ar = { share_t: '🔎 أظهرني في البحث عن اللاعبين', share_d: 'يمكن للمتعلّمين الآخرين إيجادك بالاسم ورؤية شخصيتك ونجومك ودعوتك للعب. لا يظهر بريدك أبدًا. يمكنك تغيير ذلك في «🔒 الخصوصية».', inv_banner: n => `🎟 دعاك ${n}! سيكون هذا الحساب مجانيًا إلى الأبد 💎`, inv_bad: 'هذه الدعوة مستخدمة أو منتهية — يمكنك التسجيل بشكل عادي.',
    premium: '💎 مميّز — مجاني إلى الأبد', staff: { admin: '👑 مدير', moderator: '🛡 مشرف' }, inv_t: '🎟 ادعُ صديقًا', inv_d: 'الأصدقاء الذين تدعوهم يحصلون على حساب مجاني إلى الأبد. كل رابط يُستخدم مرة واحدة ويصلح 30 يومًا.',
    inv_new: '🎟 أنشئ رابطًا', copy: '📋 نسخ', copied: 'تم النسخ ✓', share: '📤 مشاركة', inv_used: n => `✅ انضم ${n}`, inv_wait: d => `⏳ ينتظر حتى ${d}`, inv_old: '⌛ منتهية', inv_list: 'دعواتي',
    imp_t: '📥 انقل التقدّم من هذا الجهاز', imp_d: 'تنتقل النجوم والاختبارات المنجزة والكلمات والشخصية ورمز الصديق من الحساب المحلي إلى حسابك على الخادم — وتُحفظ أفضل النتائج.', imp_guest: 'تقدّم الزائر', imp_done: n => `تم! نُقل ${n} سجلًا. جارٍ تحديث الصفحة…`,
    warn_t: 'هذا غير مقبول 🙅', warn_d: 'أزال مشرف تعليقك من الجدار. كن لطيفًا مع الآخرين — اكتب ما يسعد قراءته.', ban_t: 'استراحة من الجدار ⏸️', ban_d: 'أزال مشرف تعليقك وأوقف الكتابة على الجدران لفترة. ما زال بإمكانك اللعب والتعلّم!', your_text: 'تعليقك:', understood: 'فهمت 👍' };
  const a3 = (k, ...a) => { const t = PX3[C().ui] || PX3.en; const v = t[k]; return typeof v === 'function' ? v(...a) : v; };
  // A successful request is not a delivery receipt; account existence remains private.
  const MAIL_REQUEST_TEXT = {
    uk: ['Запит прийнято. Перевірте пошту та папку «Спам». Якщо лист не надходить, зачекайте або скористайтеся входом із паролем.', 'Пошту підтверджено. Акаунт активний, прогрес зберігається на сервері.'],
    en: ['Request received. Check your inbox and spam folder. If no email arrives, wait or sign in with your password.', 'Your email is confirmed. Your account is active and progress is saved on the server.'],
    no: ['Forespørselen er mottatt. Sjekk innboksen og søppelpost. Hvis e-posten ikke kommer, vent eller logg inn med passord.', 'E-posten er bekreftet. Kontoen er aktiv, og fremgangen lagres på serveren.'],
    de: ['Anfrage erhalten. Prüfe deinen Posteingang und Spamordner. Wenn keine E-Mail ankommt, warte oder melde dich mit deinem Passwort an.', 'Deine E-Mail ist bestätigt. Dein Konto ist aktiv und dein Fortschritt wird auf dem Server gespeichert.'],
    pl: ['Prośba została przyjęta. Sprawdź skrzynkę i spam. Jeśli wiadomość nie dotrze, poczekaj lub zaloguj się hasłem.', 'Adres e-mail jest potwierdzony. Konto jest aktywne, a postępy są zapisywane na serwerze.'],
    lt: ['Užklausa gauta. Patikrinkite paštą ir šlamšto aplanką. Jei laiškas neateina, palaukite arba prisijunkite slaptažodžiu.', 'El. paštas patvirtintas. Paskyra aktyvi, o pažanga saugoma serveryje.'],
    pt: ['Pedido recebido. Confira sua caixa de entrada e a pasta de spam. Se o e-mail não chegar, aguarde ou entre com sua senha.', 'Seu e-mail foi confirmado. A conta está ativa e o progresso fica salvo no servidor.'],
    tr: ['İstek alındı. Gelen kutunuzu ve spam klasörünü kontrol edin. E-posta gelmezse bekleyin veya parolanızla giriş yapın.', 'E-postanız doğrulandı. Hesabınız etkin ve ilerlemeniz sunucuda kaydediliyor.'],
    ar: ['تم استلام الطلب. تحقّق من البريد الوارد ومجلد الرسائل غير المرغوب فيها. إذا لم تصل رسالة، انتظر أو سجّل الدخول بكلمة المرور.', 'تم تأكيد بريدك. حسابك نشط ويُحفظ تقدّمك على الخادم.']
  };
  for (const [lang, [message, welcome]] of Object.entries(MAIL_REQUEST_TEXT)) {
    TX[lang] = Object.assign({}, TX.en, TX[lang] || {}, { sent_d: e => `${message}<br><b>${e}</b>`, resent: message, forgot_ok: message, magic_sent: message, welcome_d: welcome });
  }
  const ax = (k, ...a) => { const t = TX[C().ui] || TX.en; const v = k in t ? t[k] : TX.en[k]; return typeof v === 'function' ? v(...a) : v; };
  const errText = e => (ax('err')[e] || ax('err').server);

  /* ---------- запити ---------- */
  const post = (action, body) => fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body: JSON.stringify(Object.assign({ action }, body || {})) })
    .then(r => r.json().catch(() => ({ ok: false, error: r.status >= 500 ? 'server' : 'net' }))).catch(() => ({ ok: false, error: 'net' }));
  const get = action => fetch(API + '?action=' + action, { credentials: 'same-origin', cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).catch(() => null);

  /* ---------- сесія ↔ локальне сховище ---------- */
  const sidOf = u => 's' + u.id;
  function applyUser(u, { pull = true } = {}) {
    const K = C();
    S.user = u;
    const cur = K.raw.get('comiks.session', null);
    if (!u) { if (cur && String(cur).startsWith('s')) { K.setSession(null); K.route(); } return Promise.resolve(); }
    const sid = sidOf(u);
    const all = K.raw.get('comiks.users', {});
    all[sid] = Object.assign({}, all[sid], { id: sid, name: u.name, email: u.email, created: u.created, server: true, verified: u.verified, demo: !!u.demo, premium: !!u.premium, founder: u.founder || null, role: u.role || 'user' });
    K.raw.set('comiks.users', all);
    const switched = cur !== sid;
    // з якого локального акаунта цього пристрою прийшли (для автоматичного перенесення прогресу)
    if (switched && cur && !String(cur).startsWith('s')) S.importFrom = String(cur);
    if (switched) K.setSession(sid);
    K.raw.set(`comiks.u.${sid}.friendCode`, u.friend_code); // один код друга на всіх пристроях
    /* Після входу — знайомство, але рівно один раз на акаунт. Чекаємо на
       pullData: позначка «вже бачив» лежить у даних акаунта, і до її
       завантаження вікно вискочило б удруге на кожному новому пристрої. */
    return (pull ? pullData(sid) : Promise.resolve()).then(() => {
      if (switched) K.route();
      if (K.tourIfNew) K.tourIfNew();
    });
  }
  /* ---- перенесення прогресу з пристрою в серверний акаунт: розумне злиття ---- */
  const GLOBAL_KEYS = GLOBAL;
  const SKIP_IMPORT = new Set(['friendCode', 'dirListed', 'wallWaitUntil', 'gameProfile', 'gameHistory', 'readHint', 'a11y', 'music']); // глобальні налаштування пристрою не переносимо
  function mergeVal(a, b, key) {
    if (a === undefined || a === null) return b;
    if (b === undefined || b === null) return a;
    if (typeof a === 'number' && typeof b === 'number') return Math.max(a, b); // рекорди, зірки, лічильники — найкраще
    if (Array.isArray(a) && Array.isArray(b)) {
      const seen = new Set(a.map(x => JSON.stringify(x))), out = a.slice();
      b.forEach(x => { const k = JSON.stringify(x); if (!seen.has(k)) { seen.add(k); out.push(x); } });
      if (key === 'quizlog') out.sort((x, y) => String(y.date || '').localeCompare(String(x.date || '')));
      return out.slice(0, 3000);
    }
    if (typeof a === 'object' && typeof b === 'object') { const o = Object.assign({}, a); for (const k of Object.keys(b)) o[k] = mergeVal(a[k], b[k], k); return o; }
    return a; // рядки (аватар, налаштування) — лишаємо поточні
  }
  /* Прочитані комікси — теж прогрес. Раніше перенесення пропонували лише тому,
     хто проходив тести, і людина, яка просто читала, втрачала все мовчки. */
  const guestHasData = () => {
    try {
      if (localStorage.getItem('comiks.stats') || localStorage.getItem('comiks.progress') || localStorage.getItem('comiks.guestReadKeys')) return true;
      for (let i = 0; i < localStorage.length; i++) if (/^comiks\.seen\./.test(localStorage.key(i) || '')) return true;
      return false;
    } catch { return false; }
  };
  // from: id локального акаунта ('u…') або '' — гостьовий прогрес
  async function importLocal(from, sid) {
    const K = C(), pre = from ? `comiks.u.${from}.` : 'comiks.';
    let n = 0;
    try {
      const keys = []; for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      for (const full of keys) {
        if (!full.startsWith(pre)) continue;
        const k = full.slice(pre.length);
        if (!from && (full.startsWith('comiks.u.') || GLOBAL_KEYS.has(k) || k === 'users')) continue;
        if (SKIP_IMPORT.has(k) || k.startsWith('wall.') || !/^[A-Za-z0-9._:-]{1,64}$/.test(k)) continue;
        let val; try { val = JSON.parse(localStorage.getItem(full)); } catch { continue; }
        const cur = K.raw.get(`comiks.u.${sid}.${k}`, null);
        const merged = mergeVal(cur, val, k);
        if (JSON.stringify(merged) !== JSON.stringify(cur)) { K.raw.set(`comiks.u.${sid}.${k}`, merged); S.dirty.add(k); n++; }
      }
    } catch { /* ignore */ }
    // старий код друга: друзі, стіна й картка в пошуку лишаються твоїми
    const oldCode = from ? K.raw.get(`comiks.u.${from}.friendCode`, null) : K.raw.get('comiks.friendCode', null);
    const secret = from ? K.raw.get(`comiks.u.${from}.wallSecret`, null) : K.raw.get('comiks.wallSecret', null);
    if (oldCode && S.user && oldCode !== S.user.friend_code) {
      const r = await post('adopt_code', { code: oldCode, secret: secret || '' });
      if (r.ok) { S.user.friend_code = r.friend_code; K.raw.set(`comiks.u.${sid}.friendCode`, r.friend_code); if (secret) { K.raw.set(`comiks.u.${sid}.wallSecret`, secret); S.dirty.add('wallSecret'); } }
    }
    // позначка «вже перенесено»: блок перенесення більше не з’являється
    const done = K.raw.get(`comiks.u.${sid}.imported`, []) || [];
    if (!done.includes(String(from))) { K.raw.set(`comiks.u.${sid}.imported`, [...done, String(from)]); S.dirty.add('imported'); schedule(300); }
    if (n) schedule(300);
    return n;
  }
  // локальні акаунти на цьому пристрої, з яких можна перенести прогрес
  const localAccounts = () => Object.values(C().raw.get('comiks.users', {})).filter(x => x && x.id && !String(x.id).startsWith('s'));
  function scopedKeys(sid) {
    const pre = `comiks.u.${sid}.`, out = [];
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(pre)) out.push(k.slice(pre.length)); } } catch { /* ignore */ }
    return out;
  }
  async function pullData(sid) {
    const K = C();
    const j = await get('data');
    if (!j || !j.ok) return;
    const keys = Object.keys(j.data || {});
    if (!keys.length) {
      // перший вхід на сервері: переносимо прогрес локального акаунта цього пристрою (або гостьовий) і відправляємо все
      if (S.importFrom) await importLocal(S.importFrom, sid);
      else if (!K.raw.get('comiks.session', null) || K.raw.get('comiks.session', null) === sid) { if (guestHasData()) await importLocal('', sid); }
      scopedKeys(sid).filter(k => /^[A-Za-z0-9._:-]{1,64}$/.test(k)).forEach(k => S.dirty.add(k));
      schedule(300);
      return;
    }
    keys.forEach(k => K.raw.set(`comiks.u.${sid}.${k}`, j.data[k]));
  }
  function schedule(ms = 2000) { clearTimeout(S.timer); S.timer = setTimeout(push, ms); }
  async function push(keepalive = false) {
    if (!S.server || !S.user || !S.dirty.size) return;
    const K = C(), items = {};
    [...S.dirty].slice(0, 80).forEach(k => { items[k] = K.store.get(k, null); S.dirty.delete(k); });
    const body = JSON.stringify({ action: 'data', items });
    if (keepalive) { try { fetch(API, { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body }); } catch { /* ignore */ } return; }
    const r = await fetch(API, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body }).then(x => x.json()).catch(() => null);
    if (!r || !r.ok) Object.keys(items).forEach(k => S.dirty.add(k)); // спробуємо пізніше
    if (S.dirty.size) schedule(r && r.ok ? 500 : 15000);
  }
  function hookStore() {
    const K = C(), st = K.store;
    const set = st.set, del = st.del;
    st.set = (k, v) => { set(k, v); if (S.server && S.user && !GLOBAL.has(k)) { S.dirty.add(k); schedule(); } };
    st.del = k => { del(k); if (S.server && S.user && !GLOBAL.has(k)) { S.dirty.add(k); schedule(); } };
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') push(true); });
  }

  /* ---------- дії ---------- */
  async function logout() {
    await push();
    await post('logout');
    S.user = null;
    C().setSession(null); location.hash = '#/'; C().route();
  }

  /* ---------- UI ---------- */
  const h = (...a) => C().h(...a);
  const field = (label, input, extra) => h('label', { class: 'au-field' }, h('span', {}, label), input, extra || null);
  const input = (type, attrs = {}) => h('input', Object.assign({ type, class: 'au-input' }, attrs));
  function strengthMeter(inp) {
    const bar = h('i'), txt = h('small', {});
    const box = h('div', { class: 'au-strength' }, h('span', { class: 'au-bar' }, bar), txt);
    const score = p => { let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[A-ZÆØÅ]/.test(p) && /[a-zæøå]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p) || p.split(/\s+/).length >= 3) s++; return Math.min(4, p.length < 8 ? Math.min(1, s) : s); };
    inp.addEventListener('input', () => { const s = inp.value ? score(inp.value) : -1; box.dataset.s = s; bar.style.width = ((s + 1) * 20) + '%'; txt.textContent = s >= 0 ? ax('strength')[s] : ''; });
    return box;
  }
  const shell = (cls, ...kids) => h('section', { class: 'au-wrap ' + cls }, h('div', { class: 'au-card' }, ...kids));
  /* Знак бренду замість емодзі: саме сюди дивиться людина, яка вперше
     вирішує, чи реєструватися. Емодзі ✨ не говорило про застосунок нічого. */
  const art = emoji => h('div', { class: 'au-art' + (emoji === 'logo' ? ' au-art-logo' : ''), 'aria-hidden': 'true' },
    emoji === 'logo' && window.KomiksLogo ? window.KomiksLogo.el({ size: 76 }) : h('span', {}, emoji === 'logo' ? '✨' : emoji));
  const msgEl = () => h('p', { class: 'au-msg', role: 'alert' });
  const busy = (btn, on) => { btn.disabled = on; btn.classList.toggle('busy', on); };

  const GOOGLE_TEXT = {
    uk: { login: 'Увійти через Google', signup: 'Зареєструватися через Google', link: 'Прив’язати Google', consent: 'Прийміть умови використання вище, щоб створити акаунт.', error: 'Вхід через Google не завершено. Спробуйте ще раз або увійдіть із паролем.', existing: 'Спочатку увійдіть у свій наявний акаунт із паролем або поштовим кодом. У кабінеті натисніть «Прив’язати Google», потім зможете входити через Google.', create: 'Спочатку відкрийте реєстрацію, прийміть умови та оберіть Google.', cancelled: 'Вхід через Google скасовано.', unavailable: 'Вхід через Google ще не налаштовано.', linked: 'Google прив’язано. Надалі можна входити через Google.' },
    en: { login: 'Sign in with Google', signup: 'Sign up with Google', link: 'Link Google', consent: 'Accept the terms above to create an account.', error: 'Google sign-in did not finish. Try again or use your password.', existing: 'First sign in to your existing account with your password or email code. Choose “Link Google” in your account to use Google next time.', create: 'Open registration, accept the terms and choose Google to create an account.', cancelled: 'Google sign-in was cancelled.', unavailable: 'Google sign-in is not configured yet.', linked: 'Google is linked. You can now sign in with Google.' },
    no: { login: 'Logg inn med Google', signup: 'Registrer deg med Google', link: 'Koble til Google', consent: 'Godta vilkårene ovenfor for å opprette en konto.', error: 'Google-innloggingen ble ikke fullført. Prøv igjen eller bruk passord.', existing: 'Logg først inn på den eksisterende kontoen med passord eller e-postkode. Velg «Koble til Google» på kontosiden.', create: 'Åpne registrering, godta vilkårene og velg Google.', cancelled: 'Google-innloggingen ble avbrutt.', unavailable: 'Google-innlogging er ikke konfigurert ennå.', linked: 'Google er koblet til. Du kan nå logge inn med Google.' }
  };
  if (window.KL_T_FILL) KL_T_FILL(GOOGLE_TEXT, 'auth.js:GOOGLE_TEXT');
  const gx = key => (GOOGLE_TEXT[C().ui] || GOOGLE_TEXT.en)[key];
  const OR = { uk: 'або', en: 'or', no: 'eller', de: 'oder', pl: 'lub', tr: 'veya', lt: 'arba', pt: 'ou', ar: 'أو' };
  /* Під кнопкою входу: людина має знати, що натиск може створити акаунт. */
  const GNOTE = {
    uk: 'Немає акаунта? Його буде створено на умовах використання, які ви вже прийняли.',
    en: 'No account yet? One will be created under the terms of use you have already accepted.',
    no: 'Ingen konto ennå? Den opprettes etter bruksvilkårene du allerede har godtatt.',
    de: 'Noch kein Konto? Es wird nach den Nutzungsbedingungen erstellt, die Sie bereits akzeptiert haben.',
    pl: 'Nie masz konta? Zostanie utworzone zgodnie z regulaminem, który już zaakceptowano.',
    tr: 'Hesabınız yok mu? Daha önce kabul ettiğiniz kullanım koşullarıyla oluşturulur.',
    lt: 'Dar neturite paskyros? Ji bus sukurta pagal jau priimtas naudojimo sąlygas.',
    pt: 'Ainda não tem conta? Ela será criada de acordo com os termos de uso que você já aceitou.',
    ar: 'ليس لديك حساب؟ سيُنشأ وفق شروط الاستخدام التي قبلتها بالفعل.',
  };
  /* Фірмова «G» без змін — так вимагають правила оформлення кнопок Google:
     логотип не перефарбовуємо й не обрізаємо, лише ставимо поруч із текстом. */
  function googleMark() {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 48 48'); svg.setAttribute('width', '20'); svg.setAttribute('height', '20'); svg.setAttribute('aria-hidden', 'true');
    for (const [fill, d] of [
      ['#EA4335', 'M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'],
      ['#4285F4', 'M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'],
      ['#FBBC05', 'M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'],
      ['#34A853', 'M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'],
    ]) { const p = document.createElementNS(NS, 'path'); p.setAttribute('fill', fill); p.setAttribute('d', d); svg.append(p); }
    return svg;
  }
  let googleStatus, googlePending;
  function googleBox(mode, consent = () => false) {
    const box = h('div', { class: 'au-google au-google--' + mode, hidden: true });
    /* У застосунку Google відкривається в системному браузері (вбудовані Google не пускає),
       а назад повертає одноразовий код через komikslab:// — див. appHandoff(). */
    const native = appShell();
    if (!location.protocol.startsWith('http') || (!native && /; wv\)|\bwv\b|KomiksApp/i.test(navigator.userAgent))) return box;
    if (native && mode === 'link') return box;
    const msg = msgEl(), button = h('button', { class: 'g-btn', type: 'button' }, googleMark(), h('span', {}, gx(mode)));
    /* «або» відділяє Google від форми пароля: на вході кнопка над формою, на
       реєстрації — під нею, тож і розділювач стоїть з відповідного боку. */
    const or = h('div', { class: 'au-or', role: 'separator' }, h('span', {}, OR[C().ui] || OR.en));
    /* На сторінці входу кнопка — «продовжити з Google»: заходить, а кого ще немає,
       реєструє. Новий акаунт можливий лише зі згодою з умовами, і тут вона та
       сама, що людина вже дала у вікні привітання; без неї — звичайний вхід. */
    const flow = () => (mode === 'login' && C().hasConsent && C().hasConsent() ? 'continue' : mode);
    const note = mode === 'login' ? h('p', { class: 'au-gnote' }, GNOTE[C().ui] || GNOTE.en) : null;
    button.addEventListener('click', async () => {
      if (mode === 'signup' && !consent()) { msg.textContent = gx('consent'); return; }
      busy(button, true); msg.textContent = '';
      const f = flow();
      const app_ch = native ? await appSecret().catch(() => '') : undefined;
      const result = await fetch('api/google-start.php', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', 'X-Komiks': '1' }, body: JSON.stringify({ mode: f, lang: C().ui, consent: f === 'continue' || (mode === 'signup' && consent()), app_ch }) }).then(r => r.json()).catch(() => ({ ok: false }));
      if (result.ok && typeof result.url === 'string' && result.url.startsWith('https://accounts.google.com/')) { location.assign(result.url); if (native) setTimeout(() => busy(button, false), 4000); return; }
      busy(button, false); msg.textContent = result.error === 'consent' ? gx('consent') : gx('error');
    });
    if (mode === 'login') box.append(button, flow() === 'continue' ? note : null, msg, or);
    else if (mode === 'signup') box.append(or, button, msg);
    else box.append(button, msg);
    (googleStatus ||= get('google_status')).then(result => { box.hidden = !result?.enabled; });
    return box;
  }
  /* Секрет застосунку для входу через Google: на сервер іде лише його sha256, сам він
     лежить тут і потрібен, щоб обміняти код повернення на сесію. */
  const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  async function appSecret() {
    const ver = hex(crypto.getRandomValues(new Uint8Array(32)));
    try { localStorage.setItem('kl.gAppVer', JSON.stringify({ v: ver, t: Date.now() })); } catch { /* ignore */ }
    return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ver)));
  }
  // застосунки, що вміють прийняти komikslab://: Android-оболонка (власний WebView) і Capacitor
  const appShell = () => !!window.Capacitor?.isNativePlatform?.() || /KomiksLabAndroid\//.test(navigator.userAgent);
  let handoffBusy = false;
  async function appHandoff(url) {
    const m = /^komikslab:\/\/google\?(.+)$/i.exec(url || '');
    if (!m || handoffBusy) return;
    const p = new URLSearchParams(m[1]);
    const err = p.get('e'), code = p.get('h');
    if (err) { location.hash = '#/login/' + (/^google-[a-z-]+$/.test(err) ? err : 'google-error'); return; }
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem('kl.gAppVer') || 'null'); localStorage.removeItem('kl.gAppVer'); } catch { /* ignore */ }
    if (!code || !saved || Date.now() - saved.t > 15 * 60000) { location.hash = '#/login/google-error'; return; }
    handoffBusy = true;
    const r = await post('google_handoff', { code, verifier: saved.v });
    handoffBusy = false;
    if (!r.ok) { location.hash = '#/login/' + (r.error === 'blocked' ? 'google-blocked' : 'google-error'); return; }
    S.server = true;
    if (r.need2fa) { location.hash = '#/login'; setTimeout(() => showTfa(r.ticket), 80); return; }
    await applyUser(r.user);
    location.hash = '#/account'; C().route();
  }
  // Android-оболонка передає повернення через адресу: #/login/gapp?h=…
  function hashHandoff() {
    const m = /^#\/login\/gapp\?([A-Za-z0-9=&_-]{1,200})$/.exec(location.hash);
    if (!m) return;
    history.replaceState(null, '', location.pathname + location.search + '#/login');
    appHandoff('komikslab://google?' + m[1]);
  }
  function listenHandoff() {
    hashHandoff();
    window.addEventListener('hashchange', hashHandoff);
    const A = window.Capacitor?.isNativePlatform?.() && window.Capacitor.Plugins?.App;
    if (!A) return;
    try { A.addListener('appUrlOpen', e => appHandoff(e && e.url)); } catch { /* старий застосунок без плагіна */ }
    try { A.getLaunchUrl?.().then(r => r && r.url && appHandoff(r.url)).catch(() => {}); } catch { /* ignore */ }
  }
  function googleReturn(arg) {
    if (!arg?.startsWith('google-')) return null;
    const note = msgEl();
    if (arg === 'google-2fa') {
      note.textContent = ax('tfa_login_d');
      (googlePending ||= post('google_pending')).then(r => { if (!location.hash.includes('/google-2fa')) return; if (r.ok) showTfa(r.ticket); else note.textContent = gx('error'); });
    } else note.textContent = gx(({ 'google-link-required': 'existing', 'google-signup': 'create', 'google-cancelled': 'cancelled', 'google-unavailable': 'unavailable' })[arg] || 'error');
    return note;
  }

  function loginView() {
    const K = C();
    const email = input('email', { autocomplete: 'email', required: true }), pass = input('password', { autocomplete: 'current-password', required: true });
    const msg = msgEl(), btn = h('button', { class: 'btn accent big', type: 'submit' }, ax('login_btn'));
    const extra = h('div', {});
    /* Демо-входи під спойлером: вони потрібні тому, хто лише дивиться, і
       заважають тому, хто прийшов у свій акаунт. Згорнутий блок лишає їх
       на відстані одного дотику, але не вдає, ніби це головний шлях. */
    const demos = h('details', { class: 'au-demos au-spoiler', hidden: true });
    const pickDemo = async (who, b) => {
      msg.textContent = ''; busy(b, true);
      const r = await post('demo', { who });
      busy(b, false);
      if (!r.ok) { msg.textContent = errText(r.error); return; }
      await applyUser(r.user);
      location.hash = '#/account'; K.route();
    };
    get('demos').then(j => {
      if (!j || !j.ok || !j.demos || !j.demos.length) return;
      demos.hidden = false;
      const Av = window.KomiksAvatars;
      demos.replaceChildren(
        h('summary', {}, ax('demo_sum') || ax('demo_h')),
        h('p', { class: 'au-hint' }, ax('demo_d')),
        h('div', { class: 'au-demo-grid' }, ...j.demos.map(d => h('button', { type: 'button', class: 'au-demo', title: ax('demo_as', d.name), onclick: ev => pickDemo(d.who, ev.currentTarget) },
          Av ? Av.el(d.avatar, { size: 52, mood: 'cheer' }) : h('span', {}, '🙂'),
          h('b', {}, d.name),
          h('small', {}, d.blurb || d.level))))
      );
    });
    const form = h('form', { class: 'au-form' }, field(ax('email'), email), field(ax('pass'), pass, h('a', { class: 'au-link', href: '#/forgot' }, ax('forgot_link'))), msg, extra, btn,
      h('p', { class: 'au-alt' }, h('a', { href: '#/login' }, ax('magic_link'))));
    form.addEventListener('submit', async e => {
      e.preventDefault(); msg.textContent = ''; extra.replaceChildren(); busy(btn, true);
      const r = await post('login', { email: email.value.trim(), password: pass.value });
      busy(btn, false);
      if (!r.ok) {
        msg.textContent = errText(r.error);
        if (r.error === 'unverified') extra.append(h('button', { class: 'btn', type: 'button', onclick: async ev => { busy(ev.target, true); const resent = await post('resend', { email: email.value.trim() }); busy(ev.target, false); if (!resent.ok) { msg.textContent = errText(resent.error); return; } try { sessionStorage.setItem('kl.pendingEmail', email.value.trim()); } catch { /* ignore */ } location.hash = '#/verify-sent'; } }, ax('resend')));
        return;
      }
      if (r.need2fa) { showTfa(r.ticket); return; }
      await applyUser(r.user);
      location.hash = '#/account'; K.route();
    });
    setTimeout(() => email.focus(), 50);
    return shell('au-login', art('🔐'), h('h2', {}, ax('login_t')), h('p', { class: 'au-lead' }, ax('login_d')), googleBox('login'), form, demos,
      h('p', { class: 'au-alt' }, ax('no_acc'), ' ', h('a', { href: '#/register' }, ax('reg_link'))));
  }
  function registerView(invite) {
    const K = C();
    const code = /^[a-f0-9]{24}$/.test(String(invite || '')) ? String(invite) : '';
    const banner = h('div', { class: 'au-invite', hidden: true });
    if (code) get('invite&code=' + code).then(j => { banner.hidden = false; banner.classList.toggle('bad', !(j && j.valid)); banner.textContent = j && j.valid ? a3('inv_banner', j.from) : a3('inv_bad'); });
    const name = input('text', { autocomplete: 'nickname', maxlength: 30, required: true }), email = input('email', { autocomplete: 'email', required: true });
    const pass = input('password', { autocomplete: 'new-password', required: true, minlength: 8 }), consent = h('input', { type: 'checkbox' }), move = h('input', { type: 'checkbox', checked: true });
    const share = h('input', { type: 'checkbox', checked: true });
    const msg = msgEl(), btn = h('button', { class: 'btn accent big', type: 'submit' }, ax('reg_btn'));
    const guestHasData = !K.currentUser() && (!!K.store.get('stats', null) || !!K.store.get('progress', null) || (K.store.get('guestReadKeys', []) || []).length > 0);
    const form = h('form', { class: 'au-form' }, field(ax('name'), name), field(ax('email'), email), field(ax('pass'), pass, h('small', { class: 'au-hint' }, ax('pass_hint'))), strengthMeter(pass),
      h('label', { class: 'au-check' }, consent, h('span', {}, ax('consent'), ' ', h('a', { href: '#/terms', target: '_blank' }, ax('terms')))),
      h('label', { class: 'au-check' }, share, h('span', {}, h('b', {}, a3('share_t')), h('small', {}, a3('share_d')))),
      guestHasData ? h('label', { class: 'au-check' }, move, h('span', {}, ax('move'))) : null, msg, btn);
    form.addEventListener('submit', async e => {
      e.preventDefault(); msg.textContent = '';
      if (!consent.checked) { msg.textContent = errText('consent'); return; }
      busy(btn, true);
      const r = await post('register', { name: name.value.trim(), email: email.value.trim(), password: pass.value, lang: K.ui, consent: true, invite: code || undefined });
      busy(btn, false);
      if (!r.ok) { msg.textContent = errText(r.error); return; }
      try { sessionStorage.setItem('kl.pendingEmail', email.value.trim()); sessionStorage.setItem('kl.moveGuest', guestHasData && move.checked ? '1' : ''); sessionStorage.setItem('kl.share', share.checked ? '1' : '0'); } catch { /* ignore */ }
      location.hash = '#/verify-sent';
    });
    setTimeout(() => name.focus(), 50);
    return shell('au-register', art(code ? '🎟' : 'logo'), h('h2', {}, ax('reg_t')), banner, h('p', { class: 'au-lead' }, ax('reg_d')), form, googleBox('signup', () => consent.checked),
      h('p', { class: 'au-alt' }, ax('have_acc'), ' ', h('a', { href: '#/login' }, ax('login_btn'))));
  }
  function resendButton(getEmail) {
    const btn = h('button', { class: 'btn', type: 'button' }, ax('resend'));
    const note = h('small', { class: 'au-hint' });
    let left = 0, t = 0;
    const tick = () => { if (left <= 0) { clearInterval(t); btn.disabled = false; btn.textContent = ax('resend'); return; } btn.textContent = ax('resend_in', left--); };
    btn.addEventListener('click', async () => { const e = getEmail(); if (!e) return; btn.disabled = true; const r = await post('resend', { email: e }); note.textContent = r.ok ? ax('resent') : errText(r.error); left = 60; tick(); t = setInterval(tick, 1000); });
    return h('div', { class: 'au-resend' }, btn, note);
  }
  function sentView() {
    let email = ''; try { email = sessionStorage.getItem('kl.pendingEmail') || ''; } catch { /* ignore */ }
    const safe = email.replace(/[<>&"]/g, '');
    const p = h('p', { class: 'au-lead' }); p.innerHTML = ax('sent_d', safe || '…');
    return shell('au-sent', h('div', { class: 'au-mail', 'aria-hidden': 'true' }, h('span', { class: 'env' }, '✉️'), h('i'), h('i'), h('i')), h('h2', {}, ax('sent_t')), p,
      h('ul', { class: 'au-tips' }, ax('sent_tips').map(x => h('li', {}, x))),
      resendButton(() => email), h('p', { class: 'au-alt' }, h('a', { href: '#/register' }, ax('wrong_email'))));
  }
  function welcomeView() {
    const K = C();
    const box = shell('au-welcome', h('div', { class: 'au-spinner' }));
    (async () => {
      const j = await get('me');
      if (!j || !j.user) { location.hash = '#/login'; return; }
      // перенести гостьовий прогрес, якщо користувач так вибрав під час реєстрації
      let move = ''; try { move = sessionStorage.getItem('kl.moveGuest') || ''; sessionStorage.removeItem('kl.moveGuest'); } catch { /* ignore */ }
      if (move && K.copyGuestProgressTo) K.copyGuestProgressTo(sidOf(j.user));
      let wantShare = null; try { wantShare = sessionStorage.getItem('kl.share'); sessionStorage.removeItem('kl.share'); } catch { /* ignore */ }
      await applyUser(j.user);
      if (wantShare !== null && window.KomiksPlayers) setTimeout(() => window.KomiksPlayers.setShare(wantShare === '1'), 400); // показ у пошуку — як обрав під час реєстрації
      const av = window.KomiksProfile ? window.KomiksProfile.avatar() : '🦊';
      box.querySelector('.au-card').replaceChildren(
        h('div', { class: 'au-hero' }, window.KomiksAvatars ? window.KomiksAvatars.el(av, { size: 150, mood: 'cheer' }) : h('span', {}, '🎉'), h('div', { class: 'au-rays', 'aria-hidden': 'true' })),
        h('h2', {}, ax('welcome_t', j.user.name)), h('p', { class: 'au-lead' }, ax('welcome_d')),
        h('h3', {}, ax('next_t')),
        h('div', { class: 'au-steps' }, ax('steps').map(([ic, t, d, href], i) => h('a', { class: 'au-step', href, style: { '--i': i } }, h('span', {}, ic), h('b', {}, t), h('small', {}, d)))),
        h('a', { class: 'btn accent big', href: '#/account' }, ax('to_account')));
      K.confetti(); K.Sfx.win();
    })();
    return box;
  }
  function failView() {
    const email = input('email', { autocomplete: 'email' });
    return shell('au-fail', art('🔗'), h('h2', {}, ax('fail_t')), h('p', { class: 'au-lead' }, ax('fail_d')), h('div', { class: 'au-form' }, field(ax('email'), email), resendButton(() => email.value.trim())));
  }
  function forgotView() {
    const email = input('email', { autocomplete: 'email', required: true });
    const msg = msgEl(), btn = h('button', { class: 'btn accent big', type: 'submit' }, ax('forgot_btn'));
    const form = h('form', { class: 'au-form' }, field(ax('email'), email), msg, btn);
    form.addEventListener('submit', async e => { e.preventDefault(); busy(btn, true); const r = await post('forgot', { email: email.value.trim() }); busy(btn, false); msg.textContent = r.ok ? ax('forgot_ok') : errText(r.error); msg.classList.toggle('ok', !!r.ok); });
    return shell('au-forgot', art('🔑'), h('h2', {}, ax('forgot_t')), h('p', { class: 'au-lead' }, ax('forgot_d')), form, h('p', { class: 'au-alt' }, h('a', { href: '#/login' }, ax('login_btn'))));
  }
  function resetView(token) {
    const K = C();
    const p1 = input('password', { autocomplete: 'new-password', minlength: 8, required: true }), p2 = input('password', { autocomplete: 'new-password', required: true });
    const msg = msgEl(), btn = h('button', { class: 'btn accent big', type: 'submit' }, ax('reset_btn'));
    const form = h('form', { class: 'au-form' }, field(ax('new_pass'), p1, h('small', { class: 'au-hint' }, ax('pass_hint'))), strengthMeter(p1), field(ax('pass2'), p2), msg, btn);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (p1.value !== p2.value) { msg.textContent = errText('mismatch'); return; }
      busy(btn, true);
      const r = await post('reset', { token: String(token || ''), password: p1.value });
      busy(btn, false);
      if (!r.ok) { msg.textContent = errText(r.error); return; }
      if (r.need2fa) { showTfa(r.ticket); return; }
      await applyUser(r.user);
      location.hash = '#/account'; K.route();
    });
    return shell('au-reset', art('🔑'), h('h2', {}, ax('reset_t')), form);
  }
  /* Вхід без пароля. Поле коду з'являється одразу після надсилання: лист часто
     приходить на телефон, а заходять із комп'ютера — переписати шість цифр
     швидше, ніж шукати, як перекинути посилання. */
  function magicView(googleArg) {
    const email = input('email', { autocomplete: 'email', required: true });
    const code = input('text', { inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 7, placeholder: '000 000' });
    const msg = msgEl();
    const btn = h('button', { class: 'btn accent big', type: 'submit' }, ax('magic_btn'));
    const step2 = h('div', { class: 'au-step2', hidden: true });

    const codeBtn = h('button', { class: 'btn accent big', type: 'button' }, ax('magic_go'));
    const again = h('button', { class: 'btn', type: 'button' }, ax('magic_again'));
    step2.append(field(ax('magic_code_l'), code), h('div', { class: 'row-center' }, codeBtn, again));

    const send = async target => {
      const mail = email.value.trim();
      if (!mail) return;
      busy(target, true);
      const r = await post('magic', { email: mail });
      busy(target, false);
      if (!r.ok) { msg.classList.remove('ok'); msg.textContent = errText(r.error); return; }
      msg.textContent = ax('magic_sent');
      msg.classList.add('ok');
      step2.hidden = false;
      try { sessionStorage.setItem('kl.pendingEmail', mail); } catch { /* приватний режим */ }
      setTimeout(() => code.focus(), 60);
    };

    const form = h('form', { class: 'au-form' }, field(ax('email'), email), msg, btn, step2);
    form.addEventListener('submit', e => { e.preventDefault(); send(btn); });
    again.addEventListener('click', () => send(again));
    codeBtn.addEventListener('click', async () => {
      const digits = code.value.replace(/\D+/g, '');
      if (digits.length !== 6) return;
      busy(codeBtn, true);
      const r = await post('magic_code', { email: email.value.trim(), code: digits });
      busy(codeBtn, false);
      if (!r.ok) { msg.classList.remove('ok'); msg.textContent = ax('magic_wrong'); return; }
      if (r.need2fa) { showTfa(r.ticket); return; }
      await applyUser(r.user);
      location.hash = '#/account'; K.route();
    });
    // шість цифр ділимо навпіл — так помилку видно одразу
    code.addEventListener('input', () => {
      const d = code.value.replace(/\D+/g, '').slice(0, 6);
      code.value = d.length > 3 ? d.slice(0, 3) + ' ' + d.slice(3) : d;
      if (d.length === 6) codeBtn.click();
    });
    setTimeout(() => email.focus(), 50);
    return shell('au-magic', art('🔑'), h('h2', {}, ax('magic_t')), h('p', { class: 'au-lead' }, ax('magic_d')), googleReturn(googleArg), googleBox('login'), form,
      h('p', { class: 'au-alt' }, h('a', { href: '#/login-pass' }, ax('pass_link'))),
      h('p', { class: 'au-alt' }, ax('no_acc'), ' ', h('a', { href: '#/register' }, ax('reg_link'))));
  }

  /* Перехід за посиланням із листа: нічого не питаємо, одразу заходимо. */
  function magicLinkView(token) {
    const msg = msgEl();
    msg.textContent = ax('magic_wait');
    const box = shell('au-magic', art('🔑'), h('h2', {}, ax('magic_t')), msg);
    post('magic_link', { token: token || '' }).then(async r => {
      if (!r.ok) {
        msg.classList.remove('ok');
        msg.textContent = ax('magic_bad');
        box.append(h('p', { class: 'au-alt' }, h('a', { href: '#/magic' }, ax('magic_again'))));
        return;
      }
      if (r.need2fa) { showTfa(r.ticket); return; }
      await applyUser(r.user);
      location.hash = '#/account'; K.route();
    });
    return box;
  }

  function render(view, arg) {
    if (view === 'login') return magicView(arg);     // callback notices share the existing login route
    if (view === 'login-pass') return loginView();   // пароль лишається для тих, хто його має
    if (view === 'register') return registerView(arg);
    if (view === 'verify-sent') return sentView();
    if (view === 'welcome') return welcomeView();
    if (view === 'verify-failed') return failView();
    if (view === 'forgot') return forgotView();
    if (view === 'magic') return arg ? magicLinkView(arg) : magicView();
    if (view === 'reset') return resetView(arg);
    return loginView();
  }
  // блок у кабінеті: пошта, зміна пароля, вихід, видалення акаунта
  /* Двофакторна: вмикається у три кроки — показати QR, підтвердити кодом,
     зберегти резервні. Підтвердження обов'язкове: без нього людина може
     замкнути себе, якщо застосунок не прочитав ключ. */
  /* Другий крок входу. Сесії ще немає — лише короткий квиток, тож у разі
     помилки сервер видає новий і пароль вводити наново не доводиться. */
  function showTfa(ticket) {
    const K = C(), { h } = K;
    const code = input('text', { inputmode: 'numeric', maxlength: 11, placeholder: '000 000', autocomplete: 'one-time-code' });
    const msg = msgEl();
    const btn = h('button', { class: 'btn accent big', type: 'submit' }, ax('tfa_login_btn'));
    let tk = ticket;
    const form = h('form', { class: 'au-form' }, field(ax('tfa_login_t'), code), msg, btn);
    const send = async () => {
      busy(btn, true);
      const r = await post('totp_login', { ticket: tk, code: code.value });
      busy(btn, false);
      if (!r.ok) { if (r.ticket) tk = r.ticket; msg.textContent = ax('tfa_wrong'); code.select(); return; }
      await applyUser(r.user);
      if (r.backupUsed) try { sessionStorage.setItem('kl.backupLeft', String(r.backupLeft)); } catch { /* ignore */ }
      location.hash = '#/account'; K.route();
    };
    form.addEventListener('submit', e => { e.preventDefault(); send(); });
    code.addEventListener('input', () => { if (code.value.replace(/\D+/g, '').length === 6) send(); });
    const box = shell('au-tfa-login', art('🔐'), h('h2', {}, ax('tfa_login_t')), h('p', { class: 'au-lead' }, ax('tfa_login_d')), form);
    const main = document.querySelector('main') || document.body;
    main.replaceChildren(box);
    setTimeout(() => code.focus(), 60);
  }

  function totpBox() {
    const K = C(), u = S.user;
    if (!u || u.demo) return null;
    const { h } = K;
    const wrap = h('div', { class: 'box au-tfa' });

    const draw = () => {
      wrap.replaceChildren(h('h3', {}, ax('tfa_t')));
      if (u.totp) {
        const code = input('text', { inputmode: 'numeric', maxlength: 9, placeholder: '000 000' });
        const msg = h('small', { class: 'au-hint' });
        const off = async () => {
          const r = await post('totp_disable', { code: code.value });
          if (!r.ok) { msg.textContent = ax('tfa_wrong'); return; }
          u.totp = false; await applyUser(u); draw();
        };
        const fresh = async () => {
          const r = await post('totp_backup', { code: code.value });
          if (!r.ok) { msg.textContent = ax('tfa_wrong'); return; }
          showBackup(r.backup);
        };
        wrap.append(h('p', { class: 'au-ok' }, ax('tfa_on_d')),
          h('details', { class: 'au-det' }, h('summary', {}, ax('tfa_off')),
            h('p', { class: 'au-hint' }, ax('tfa_off_ask')),
            field(ax('tfa_login_t'), code),
            h('div', { class: 'row-left' },
              h('button', { class: 'btn accent', type: 'button', onclick: off }, ax('tfa_off')),
              h('button', { class: 'btn', type: 'button', onclick: fresh }, ax('tfa_new_backup'))),
            msg));
        return;
      }
      wrap.append(h('p', { class: 'au-hint' }, ax('tfa_off_d')),
        h('button', { class: 'btn accent', type: 'button', onclick: start }, ax('tfa_start')));
    };

    const showBackup = codes => {
      const list = h('div', { class: 'tfa-codes' }, codes.map(c => h('code', {}, c)));
      const copyBtn = h('button', { class: 'btn', type: 'button' }, ax('tfa_copy'));
      copyBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(codes.join('\n')); } catch { /* приватний режим */ }
        copyBtn.textContent = ax('tfa_copied');
      });
      wrap.replaceChildren(h('h3', {}, ax('tfa_t')),
        h('p', { class: 'au-ok' }, ax('tfa_saved')),
        h('b', {}, ax('tfa_backup_t')),
        h('p', { class: 'au-hint' }, ax('tfa_backup_d')),
        list,
        h('div', { class: 'row-left' }, copyBtn,
          h('button', { class: 'btn accent', type: 'button', onclick: () => draw() }, ax('ok') || 'OK')));
    };

    const start = async () => {
      const r = await post('totp_init', {});
      if (!r.ok) return;
      const code = input('text', { inputmode: 'numeric', maxlength: 9, placeholder: '000 000', autocomplete: 'one-time-code' });
      const msg = h('small', { class: 'au-hint' });
      const qr = h('div', { class: 'tfa-qr' });
      /* QR малюємо тією самою бібліотекою, що й для запрошень — вона вже є. */
      try {
        const q = window.qrcode(0, 'M'); q.addData(r.uri); q.make();
        qr.append(K.svgEl(q.createSvgTag({ cellSize: 5, margin: 2, scalable: true })));
      } catch { qr.append(h('p', { class: 'au-hint' }, r.uri)); }
      const confirm = async () => {
        const res = await post('totp_enable', { code: code.value });
        if (!res.ok) { msg.textContent = ax('tfa_wrong'); return; }
        u.totp = true; await applyUser(u);
        showBackup(res.backup);
      };
      code.addEventListener('input', () => { if (code.value.replace(/\D+/g, '').length === 6) confirm(); });
      wrap.replaceChildren(h('h3', {}, ax('tfa_t')),
        h('b', {}, ax('tfa_step1')), h('p', { class: 'au-hint' }, ax('tfa_apps')),
        qr,
        h('p', { class: 'au-hint' }, ax('tfa_manual'), ' ', h('code', { class: 'tfa-secret' }, r.secret)),
        h('b', {}, ax('tfa_step2')), field(ax('tfa_login_t'), code),
        h('div', { class: 'row-left' }, h('button', { class: 'btn accent', type: 'button', onclick: confirm }, ax('tfa_confirm')), msg));
    };

    draw();
    return wrap;
  }

  /* Тексти кабінету: Google, видалення кодом. */
  const ACC = {
    uk: { g_t: 'Вхід через Google', g_on: '✅ Google підключено — можна входити однією кнопкою.', g_off: 'Підключіть Google, щоб входити без пароля.', g_unlink: 'Відв’язати Google', g_unlink_q: 'Відв’язати Google від акаунта? Прогрес не зміниться. Входити можна буде паролем або кодом на пошту.', g_unlinked: 'Google відв’язано ✓',
      del_how: 'Підтвердіть паролем або кодом із листа.', del_send: '📧 Надіслати код на пошту', del_sent: e => `Код надіслано на ${e}. Він діє 15 хвилин.`, del_code: 'Код з листа', del_pass: 'Пароль', del_or: 'або', forgot: 'Немає пароля? Задати його', del_wrong_c: 'Код не підходить або вже минув. Надішліть новий.', del_wrong_p: 'Пароль не підходить.', app_note: 'Google підключається в браузері: відкрийте bilohash.com/comiks.' },
    en: { g_t: 'Sign in with Google', g_on: '✅ Google is connected — sign in with one tap.', g_off: 'Connect Google to sign in without a password.', g_unlink: 'Disconnect Google', g_unlink_q: 'Disconnect Google from this account? Progress stays. You can sign in with your password or an email code.', g_unlinked: 'Google disconnected ✓',
      del_how: 'Confirm with your password or a code from email.', del_send: '📧 Email me a code', del_sent: e => `Code sent to ${e}. It works for 15 minutes.`, del_code: 'Code from the email', del_pass: 'Password', del_or: 'or', forgot: 'No password? Set one', del_wrong_c: 'The code is wrong or has expired. Send a new one.', del_wrong_p: 'Wrong password.', app_note: 'Google is connected in a browser: open bilohash.com/comiks.' },
    no: { g_t: 'Logg inn med Google', g_on: '✅ Google er koblet til – logg inn med ett trykk.', g_off: 'Koble til Google for å logge inn uten passord.', g_unlink: 'Koble fra Google', g_unlink_q: 'Koble Google fra kontoen? Fremgangen blir værende. Du kan logge inn med passord eller e-postkode.', g_unlinked: 'Google er koblet fra ✓',
      del_how: 'Bekreft med passord eller en kode fra e-posten.', del_send: '📧 Send meg en kode', del_sent: e => `Koden er sendt til ${e}. Den virker i 15 minutter.`, del_code: 'Kode fra e-posten', del_pass: 'Passord', del_or: 'eller', forgot: 'Ikke passord? Lag et', del_wrong_c: 'Koden stemmer ikke eller er utløpt. Send en ny.', del_wrong_p: 'Feil passord.', app_note: 'Google kobles til i nettleseren: åpne bilohash.com/comiks.' },
    ar: { g_t: 'الدخول عبر Google', g_on: '✅ Google متصل — ادخل بلمسة واحدة.', g_off: 'اربط Google للدخول دون كلمة مرور.', g_unlink: 'افصل Google', g_unlink_q: 'فصل Google عن الحساب؟ يبقى التقدّم كما هو. يمكنك الدخول بكلمة المرور أو برمز البريد.', g_unlinked: 'تم فصل Google ✓',
      del_how: 'أكّد بكلمة المرور أو برمز من البريد.', del_send: '📧 أرسل لي رمزًا', del_sent: e => `أُرسل الرمز إلى ${e}. صالح لمدة 15 دقيقة.`, del_code: 'الرمز من الرسالة', del_pass: 'كلمة المرور', del_or: 'أو', forgot: 'لا توجد كلمة مرور؟ أنشئ واحدة', del_wrong_c: 'الرمز غير صحيح أو انتهت صلاحيته. أرسل رمزًا جديدًا.', del_wrong_p: 'كلمة المرور غير صحيحة.', app_note: 'يُربط Google من المتصفح: افتح bilohash.com/comiks.' }
  };
  if (window.KL_T_FILL) KL_T_FILL(ACC, 'auth.js:ACC');
  const acx = (k, ...a) => { const t = ACC[C().ui] || ACC.en; const v = k in t ? t[k] : ACC.en[k]; return typeof v === 'function' ? v(...a) : v; };
  const inApp = () => window.Capacitor?.isNativePlatform?.() || /; wv\)|\bwv\b|KomiksApp/i.test(navigator.userAgent);

  /* 🔑 Google: підключити або відв’язати. Показуємо і в кабінеті, і в налаштуваннях. */
  function googleManage() {
    const u = S.user; if (!u || u.demo || !S.server) return null;
    const box = h('div', { class: 'box au-gman', hidden: true });
    const msg = msgEl();
    const draw = () => {
      const head = h('h3', { class: 'au-gman-h' }, googleMark(), h('span', {}, acx('g_t')));
      if (S.user && S.user.google) {
        const btn = h('button', { class: 'btn small', type: 'button' }, acx('g_unlink'));
        btn.addEventListener('click', async () => {
          if (!confirm(acx('g_unlink_q'))) return;
          busy(btn, true); const r = await post('google_unlink', {}); busy(btn, false);
          if (!r.ok) { msg.textContent = errText(r.error); return; }
          await applyUser(r.user, { pull: false }); draw(); msg.textContent = acx('g_unlinked');
        });
        box.replaceChildren(head, h('p', { class: 'au-hint' }, acx('g_on')), h('div', { class: 'row-left' }, btn), msg);
      } else {
        box.replaceChildren(head, h('p', { class: 'au-hint' }, acx(inApp() ? 'app_note' : 'g_off')), inApp() ? null : googleBox('link'), msg);
      }
    };
    draw();
    // Google на сайті вимкнено і не прив’язаний — блок не потрібен
    (googleStatus ||= get('google_status')).then(r => { box.hidden = !(r?.enabled || (S.user && S.user.google)); });
    return box;
  }

  /* Видалення: пароль або код із листа (у тих, хто ввійшов через Google, пароля немає). */
  function deleteBox() {
    const K = C(), u = S.user; if (!u || u.demo) return null;
    const delP = input('password', { autocomplete: 'current-password' });
    const code = input('text', { inputmode: 'numeric', maxlength: 7, placeholder: '000 000', autocomplete: 'one-time-code' });
    const codeWrap = h('div', { hidden: true }, field(acx('del_code'), code));
    const dm = h('small', { class: 'au-msg' });
    const send = h('button', { class: 'btn small', type: 'button' }, acx('del_send'));
    send.addEventListener('click', async () => {
      busy(send, true); const r = await post('delete_code', {}); busy(send, false);
      if (!r.ok) { dm.textContent = errText(r.error); return; }
      codeWrap.hidden = false; dm.textContent = acx('del_sent', u.email); code.focus();
    });
    const del = async ev => {
      const btn = ev.currentTarget, c = code.value.replace(/\D+/g, ''), p = delP.value;
      if (!c && !p) { dm.textContent = acx('del_how'); return; }
      if (!confirm(ax('del_confirm'))) return;
      busy(btn, true);
      const r = await post('delete', c ? { code: c } : { password: p });
      busy(btn, false);
      if (!r.ok) { dm.textContent = r.error === 'wrong' ? acx(c ? 'del_wrong_c' : 'del_wrong_p') : errText(r.error); return; }
      try { const pre = `comiks.u.${sidOf(u)}.`, ks = []; for (let i = 0; i < localStorage.length; i++) ks.push(localStorage.key(i)); ks.filter(k => k.startsWith(pre)).forEach(k => localStorage.removeItem(k)); } catch { /* ignore */ }
      const all = K.raw.get('comiks.users', {}); delete all[sidOf(u)]; K.raw.set('comiks.users', all); S.user = null; K.setSession(null); location.hash = '#/'; K.route();
    };
    const or = h('p', { class: 'au-or-small' }, acx('del_or'));
    const passPart = field(acx('del_pass'), delP), codePart = [h('div', { class: 'row-left' }, send), codeWrap];
    // хто прийшов через Google, найпевніше пароля не знає — код ставимо першим
    const parts = u.google ? [...codePart, or, passPart] : [passPart, or, ...codePart];
    return h('details', { class: 'au-det danger' }, h('summary', {}, ax('del_t')), h('p', { class: 'au-hint' }, ax('del_d')), h('p', { class: 'au-hint' }, acx('del_how')),
      ...parts, h('div', { class: 'row-left' }, h('button', { class: 'btn accent', type: 'button', onclick: del }, ax('del_btn'))), dm);
  }

  /* 🔐 Безпека: пароль, двофакторна, вихід, видалення. Значки-статуси прибрано з кабінету. */
  function accountBox() {
    const u = S.user; if (!u) return null;
    const oldP = input('password', { autocomplete: 'current-password' }), newP = input('password', { autocomplete: 'new-password' });
    const pm = h('small', { class: 'au-hint' });
    const savePass = async () => { pm.textContent = ''; const r = await post('password', { old: oldP.value, password: newP.value }); pm.textContent = r.ok ? ax('saved') : errText(r.error); if (r.ok) { oldP.value = ''; newP.value = ''; } };
    return h('div', { class: 'box au-acc' }, h('h3', {}, ax('acc_t')),
      u.demo ? h('p', { class: 'au-hint' }, ax('demo_note')) : null,
      u.demo ? null : h('details', { class: 'au-det' }, h('summary', {}, ax('change_pass')), field(ax('old_pass'), oldP), field(ax('new_pass'), newP),
        h('div', { class: 'row-left' }, h('button', { class: 'btn', type: 'button', onclick: savePass }, ax('save')), pm),
        h('p', { class: 'au-hint' }, h('a', { href: '#/forgot' }, acx('forgot')))),
      totpBox(),
      h('div', { class: 'row-left' }, h('button', { class: 'btn', type: 'button', onclick: logout }, ax('logout'))),
      deleteBox());
  }

  function importBox() {
    const K = C(), sid = sidOf(S.user);
    // що вже перенесли в цей акаунт, більше не пропонуємо
    const done = new Set(K.raw.get(`comiks.u.${sid}.imported`, []) || []);
    const list = localAccounts().filter(x => !done.has(String(x.id))), guest = guestHasData() && !done.has('');
    if (!list.length && !guest) return null;
    const msg = h('small', { class: 'au-hint' });
    const run = async (from, btn) => { busy(btn, true); const n = await importLocal(from, sid); await push(); busy(btn, false); msg.textContent = a3('imp_done', n); K.Sfx.good(); setTimeout(() => location.reload(), 1600); };
    return h('div', { class: 'au-invite-box au-import' }, h('b', {}, a3('imp_t')), h('p', { class: 'au-hint' }, a3('imp_d')),
      h('div', { class: 'row-left' }, list.map(x => h('button', { class: 'btn small', type: 'button', onclick: e => run(x.id, e.currentTarget) }, '📥 ' + (x.name || x.id))), guest ? h('button', { class: 'btn small', type: 'button', onclick: e => run('', e.currentTarget) }, '📥 ' + a3('imp_guest')) : null), msg);
  }
  // 🎟 запрошення друзів (лише преміум-друзі, яких додав адміністратор)
  function inviteBox() {
    const K = C();
    const out = h('div', { class: 'au-inv-out' }), list = h('ul', { class: 'au-inv-list' });
    const fmtD = d => { try { return new Date(d).toLocaleDateString(K.locale()); } catch { return ''; } };
    const loadList = async () => {
      const j = await get('invites'); const rows = j && j.ok ? j.invites : [];
      list.replaceChildren(...rows.map(r => h('li', {}, r.used ? a3('inv_used', r.name || '🙂') : new Date(r.expires) < new Date() ? a3('inv_old') : a3('inv_wait', fmtD(r.expires)), h('small', {}, fmtD(r.created)))));
    };
    const create = async ev => {
      busy(ev.target, true); const r = await post('invite_create'); busy(ev.target, false);
      if (!r.ok) { out.replaceChildren(h('p', { class: 'au-msg' }, errText(r.error))); return; }
      const inp = h('input', { class: 'au-input', readonly: true, value: r.url, onclick: e => e.target.select() });
      const copyBtn = h('button', { class: 'btn small', type: 'button', onclick: async () => { try { await navigator.clipboard.writeText(r.url); } catch { inp.select(); document.execCommand('copy'); } copyBtn.textContent = a3('copied'); } }, a3('copy'));
      out.replaceChildren(inp, h('div', { class: 'row-left' }, copyBtn, navigator.share ? h('button', { class: 'btn small', type: 'button', onclick: () => navigator.share({ title: 'Komiks·Lab', url: r.url }).catch(() => {}) }, a3('share')) : null));
      loadList();
    };
    loadList();
    return h('div', { class: 'au-invite-box' }, h('b', {}, a3('inv_t')), h('p', { class: 'au-hint' }, a3('inv_d')), h('button', { class: 'btn accent', type: 'button', onclick: create }, a3('inv_new')), out,
      h('details', { class: 'au-det' }, h('summary', {}, a3('inv_list')), list));
  }
  // анімоване попередження від модератора: тамагочі хитає головою «так не можна»
  let noticeOpen = false;
  function showNotice(n) {
    if (!n || noticeOpen) return;
    noticeOpen = true;
    const K = C(), av = window.KomiksProfile ? window.KomiksProfile.avatar() : '🦊';
    const ban = n.kind === 'ban';
    /* Звернення від команди — не те саме, що попередження за допис: ні суворої
       картинки, ні закресленої цитати, просто текст. */
    const note = n.kind === 'note';
    const close = () => { post('notice_seen', { id: n.id }); box.remove(); noticeOpen = false; };
    const box = h('div', { class: 'free-modal au-notice', role: 'alertdialog', 'aria-modal': 'true' },
      h('div', { class: 'free-card au-notice-card' },
        h('div', { class: 'au-notice-hero' }, window.KomiksAvatars ? window.KomiksAvatars.el(av, { size: 130, mood: note ? 'idle' : 'sad' }) : h('span', {}, note ? '✉️' : '🙅'), note ? null : h('span', { class: 'au-notice-no' }, '🙅')),
        h('h2', {}, a3(note ? 'note_t' : ban ? 'ban_t' : 'warn_t')), h('p', {}, a3(note ? 'note_d' : ban ? 'ban_d' : 'warn_d')),
        n.text ? (note
          ? h('blockquote', { class: 'au-notice-q au-notice-note' }, n.text)
          : h('blockquote', { class: 'au-notice-q' }, h('small', {}, a3('your_text')), h('s', {}, n.text))) : null,
        h('button', { class: 'btn accent big', type: 'button', onclick: close }, a3('understood'))));
    document.body.append(box);
    K.Sfx.bad();
  }
  const pollNotice = () => { if (S.server && document.visibilityState === 'visible') get('notice').then(j => { if (j && j.notice) showNotice(j.notice); }); };

  /* ---------- старт ---------- */
  function init() {
    if (!window.KomiksCore) { setTimeout(init, 50); return; }
    hookStore();
    if (!location.protocol.startsWith('http')) { readyDone(false); return; }
    listenHandoff();
    get('me').then(async j => {
      if (!j || !j.auth) return false;
      S.server = true;
      await applyUser(j.user || null);
      if (j.notice) setTimeout(() => showNotice(j.notice), 1200);
      setInterval(pollNotice, 120000);   // заодно «я тут» для адмінки: хто онлайн і коли була остання активність
      const view = (location.hash || '#/').split('/')[1] || '';
      if (['login', 'register', 'account', 'settings'].includes(view)) C().route(); // перемалювати серверною версією
      return true;
    }).then(readyDone, () => readyDone(false));
  }
  // перечитати акаунт із сервера (після оплати Преміуму тощо)
  const refresh = async () => { const j = await get('me'); if (j && j.user) await applyUser(j.user); return j && j.user; };
  window.KomiksAuth = { render, accountBox, googleManage, importBox, inviteBox, logout, push, refresh, get server() { return S.server; }, get user() { return S.user; }, ready: () => S.ready };
  init();
})();
