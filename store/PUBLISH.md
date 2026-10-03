# 🚀 Публікація Комікс·Lab у Google Play

Покроково, від перевірки до кнопки «Опублікувати». Спершу Android; для App Store
кроки схожі, але потрібен Mac — про це наприкінці.

---

## Крок 0. Перевірити, що все ціле

```bash
cd C:\comiks && node tools\audit-all.js
```

Має закінчитися рядком `✅ Усе гаразд — можна публікувати.` Якщо ні — виправити
те, на що вкаже, і запустити ще раз. Перевірка дивиться: цілість коміксів,
помилки в перекладах, наявність усіх озвучень, відсутність паролів у збірці,
розмір застосунку, матеріали для магазину.

---

## Крок 1. Залити сайт

Застосунок звертається до сервера, тож спершу оновіть сайт:

1. Зберіть: `node tools\build.js`
2. Залийте **весь вміст `dist\`** у `public_html/comiks/`
3. ⚠️ Переконайтеся, що серед залитого є новий **`api/lib.php`** — без нього
   застосунок не зможе ні ввійти, ні показати рейтинг.

Перевірити, що сервер пускає застосунок:

```bash
curl -i -H "Origin: https://localhost" https://bilohash.com/comiks/api/players.php?sort=stars
```

У відповіді має бути `Access-Control-Allow-Origin: https://localhost`.

---

## Крок 2. Подивитися застосунок своїми очима

```bash
node app\tools\prepare-web.js --light
node app\tools\serve.js
```

Відкрити `http://localhost:8970`, звузити вікно до ширини телефона. Це рівно те,
що побачить користувач. Перевірте: комікс відкривається, звук грає, тест
проходиться, вхід в акаунт працює.

---

## Крок 3. Поставити інструменти складання

На вашій машині їх ще немає. Потрібні:

1. **JDK 17** — [adoptium.net](https://adoptium.net) → Temurin 17 (x64, `.msi`)
2. **Android Studio** — [developer.android.com/studio](https://developer.android.com/studio)
   (під час першого запуску сам поставить Android SDK)

Перевірка: `java -version` має показати 17.

---

## Крок 4. Зібрати застосунок

```bash
cd C:\comiks\app
npm install
npm run add:android
npm run android
```

Відкриється Android Studio з готовим проєктом.

### Ключ підпису — робиться один раз

**Build → Generate Signed App Bundle → Android App Bundle → Create new…**

| поле | що писати |
|---|---|
| Key store path | `C:\comiks\app\komikslab.jks` |
| Password | свій, надійний |
| Alias | `komikslab` |
| Validity | 25 років |
| First and Last Name | Ruslan Bilohash |

> ⚠️ **Збережіть `.jks` і паролі в надійному місці.** Загубите — не зможете
> випустити оновлення, доведеться публікувати застосунок заново під іншою назвою.

Далі **release** → отримаєте `app\android\app\build\outputs\bundle\release\app-release.aab`.

Для перевірки на своєму телефоні досить **Build → Build APK(s)**.

---

## Крок 5. Обліковий запис розробника

[play.google.com/console](https://play.google.com/console) → одноразово **25 $**.
Потрібне підтвердження особи (документ) — це займає до кількох днів,
тож краще зробити заздалегідь.

---

## Крок 6. Створити застосунок у консолі

**Create app** → назва `Komiks·Lab — Learn Norwegian`, мова англійська,
тип **App**, **Free**.

### Сторінка в магазині (Main store listing)

| поле | значення |
|---|---|
| App name | `Komiks·Lab — Learn Norwegian` |
| Short description | `Learn Norwegian with voiced comics, tests and games. Free, A1–B2.` |
| App icon | `store\android\icon-512.png` |
| Feature graphic | `store\android\feature-graphic.png` |
| Phone screenshots | `store\android\01-home.png` … `08-cards.png` |

**Full description** (скопіювати як є):

```
Learn Norwegian (Bokmål) the way people actually speak it — through short, funny comics.

Every line is read aloud by a natural Norwegian voice, and the translation appears the moment you tap the text. Start with your first "Hei!" and work up to talking with colleagues, landlords and doctors.

WHAT IS INSIDE
• 75 voiced comics, levels A1 to B2 — everyday life in Norway: the shop, the doctor, the job interview, the dugnad, the tax card, the parents' meeting.
• 972 words in 47 topics, each with a picture and audio.
• Tests in Norwegian: listening, word order, pictures, missing words, true or false.
• Flashcards with spaced repetition — the app brings back exactly the words you keep forgetting.
• Pairs: a short daily game built from your own weak spots.
• Writing practice with instant checking, and a mock Norskprøven.
• Grammar with tables: pronouns, tenses, en/ei/et, word order.
• Games for the whole family: Logic Race, Math Rocket, chess and quiz rooms you join with a QR code.

INTERFACE IN YOUR LANGUAGE
Norwegian, English, Ukrainian, German, Polish, Turkish, Lithuanian and Arabic. Pick several translation languages at once and see them all in the comic.

COMPLETELY FREE
No subscription, no payments, no ads, no in-app purchases. An account is optional — it only keeps your progress, stars and friends across devices.

MADE FOR
People moving to Norway, international workers and families, and anyone preparing for a Norwegian course or the Norskprøven exam. Children can use it with a parent.

All stories, characters, drawings and voices are fictional and created with artificial intelligence.
```

---

## Крок 7. Анкети, які вимагає Google

### App content → Privacy policy
`https://bilohash.com/comiks/#/terms`

### Data safety (найдовша анкета)

| питання | відповідь |
|---|---|
| Чи збираєте дані? | **Так** |
| Чи передаєте третім особам? | **Ні** |
| Чи шифрується передача? | **Так** (HTTPS) |
| Чи можна видалити дані? | **Так**, у кабінеті |

Що саме вказати:

| тип | навіщо | обов'язково? |
|---|---|---|
| Ім'я | профіль і рейтинг | ні (лише з акаунтом) |
| Email | підтвердження акаунта й відновлення пароля | ні |
| App activity | прогрес навчання, зірки, результати тестів | ні |
| Повідомлення | листування між друзями | ні |
| **Аудіо** | **не збираємо** — розпізнавання робить браузер, записи не зберігаються | — |

### Content rating
Категорія **Education**, далі анкета. Чесні відповіді дають **3+ / PEGI 3**:
немає насильства, лайки, азартних ігор, покупок і реклами. Є обмін
повідомленнями між користувачами — це треба вказати.

### Ads
**Немає реклами.**

### Target audience
13+ — застосунок має спілкування між користувачами. Якщо позначити «для дітей»,
Google вимагатиме вимкнути соціальні можливості.

### Дозволи застосунку
Лише **мікрофон** (`RECORD_AUDIO`) — для перевірки вимови й голосового дзвінка.
У формі поясніть: *«Microphone is used only for pronunciation practice and the
in-app speaking exercise. No audio is recorded or stored.»*

---

## Крок 8. Випуск

1. **Testing → Internal testing** — залийте `.aab`, додайте свою пошту,
   поставте застосунок із отриманого посилання й перевірте на живому телефоні.
   **Не пропускайте цей крок.**
2. Переконайтеся, що працюють: вхід в акаунт, рейтинг, звук, мікрофон.
3. **Production → Create new release** → той самий `.aab` → **Send for review**.

Перша перевірка триває від кількох годин до тижня. Оновлення проходять швидше.

---

## Крок 9. Оновлення застосунку

```bash
node tools\build.js
node app\tools\prepare-web.js --light
cd app && npm run android
```

У `app\android\app\build.gradle` підняти `versionCode` (ціле число, **обов'язково
більше за попереднє**) і `versionName` (`1.1`, `1.2`…). Далі знову
**Generate Signed App Bundle** тим самим ключем.

---

## 🍎 App Store — коротко

Потрібні **Mac** із Xcode і обліковий запис Apple Developer (**99 $ на рік**).

```bash
cd C:\comiks\app && npm run add:ios && npm run ios
```

Відмінності від Google:
- перевірка суворіша й ручна, часто просять пояснення до дозволів;
- у `Info.plist` обов'язковий опис `NSMicrophoneUsageDescription`;
- знімки потрібні під кілька розмірів екрана;
- банер 1024×500 не потрібен, потрібна іконка 1024×1024 (вона вже є).

---

## Чек-лист перед натисканням «Опублікувати»

- [ ] `node tools\audit-all.js` → ✅
- [ ] `dist\` залито на сервер, разом із новим `api/lib.php`
- [ ] `curl` показує `Access-Control-Allow-Origin`
- [ ] застосунок перевірено локально (`app\tools\serve.js`)
- [ ] `.aab` підписано, `.jks` і паролі збережено в надійному місці
- [ ] внутрішнє тестування пройдено на живому телефоні
- [ ] заповнено Privacy policy, Data safety, Content rating
- [ ] `install.php` видалено з сервера
