# ▶️ Play Console: що натискати просто зараз

Акаунт оплачено, збірка готова. Усе нижче робиться **в браузері, без Android-телефона**.
Файл для завантаження: `store/android/build/komikslab-online-v1.1.aab` (14 МБ,
підписаний, ідентифікатор `com.bilohash.komikslab.online`).

> **Чому поспіх із тестувальниками.** Для особистих акаунтів, створених після
> 13 листопада 2023 р., Google відкриває робочу версію лише після закритого
> тестування: **12 тестувальників, зареєстрованих 14 днів поспіль**. Відлік
> залежить від них, не від вашого телефона, тож список варто збирати сьогодні.

---

## 1. Create app

| поле | значення |
|---|---|
| App name | `Komiks·Lab — Learn Norwegian` |
| Default language | English (United States) |
| App or game | **App** |
| Free or paid | **Free** |

---

## 2. Залити збірку: Testing → Internal testing → Create new release

* App bundle: `komikslab-online-v1.1.aab`
* Release name: `1.1 (2)`
* Release notes (English):

```
First public build: 89 voiced Norwegian comics (A1–B2), tests, flashcards, games
and an interface in 8 languages.
```

Внутрішнє тестування не обовʼязкове, але воно за секунди показує, чи приймається
збірка, — тому починати варто з нього.

---

## 3. Store listing (Grow → Store presence → Main store listing)

**App name:** `Komiks·Lab — Learn Norwegian`

**Short description** (80 знаків):

```
Learn Norwegian with voiced comics, tests and games. Free, levels A1–B2.
```

**Full description** (вставити як є — цифри вже звірені зі збіркою):

```
Learn Norwegian (Bokmål) the way people actually speak it — through short, funny comics.

Every line is read aloud by a natural Norwegian voice, and the translation appears the moment you tap the text. Start with your first "Hei!" and get to a real conversation.

WHAT IS INSIDE
• 89 voiced comics, levels A1 to B2 — everyday life in Norway: the shop, the doctor, the job interview, the dugnad, the tax card, the parents' meeting, NAV.
• 1096 words in 53 topics, each with a picture and audio.
• 16 grammar topics with tables and examples: pronouns, tenses, en/ei/et, word order, comparison.
• Tests in Norwegian: listening, word order, pictures, missing words, true or false.
• Flashcards with spaced repetition — the app brings back exactly the words you keep forgetting.
• Pairs and a crossword built from your own mistakes.
• Writing practice with instant checking, and a mock Norskprøven.
• Games for the whole family: Logic Race, Math Rocket, chess and quiz rooms you join with a QR code.

INTERFACE IN YOUR LANGUAGE
Norwegian, English, Ukrainian, German, Polish, Turkish, Lithuanian and Arabic. Pick several translation languages at once and see them all under the Norwegian line.

COMPLETELY FREE
No subscription, no payments, no ads, no in-app purchases. An account is optional — it only keeps your progress, stars and friends across devices.

MADE FOR
People moving to Norway, international workers and families, and anyone preparing for a Norwegian course or the Norskprøven exam. Children learn with the same stories in a simpler mode.

All stories, characters, drawings and voices are fictional and created with artificial intelligence.
```

**Графіка** — з теки `store/android/`:

| поле | файл |
|---|---|
| App icon (512×512) | `icon-512.png` |
| Feature graphic (1024×500) | `feature-graphic.png` |
| Phone screenshots | `01-home.png` … `08-alphabet.png` |

---

## 4. App content — анкети (Policy → App content)

| анкета | відповідь |
|---|---|
| Privacy policy | `https://bilohash.com/comiks/privacy.html` |
| Ads | **No ads** |
| App access | **All functionality is available without special access** (акаунт необовʼязковий) |
| Content rating | Education → без насильства, без азартних ігор, без користувацького контенту для дітей → вийде **3+ / Everyone** |
| Target audience | 13+ (у застосунку є спілкування з друзями) |
| News app | No |
| COVID-19 apps | No |
| Data safety | див. нижче |
| Government apps | No |
| Financial features | None |

### Data safety — онлайн-версія

| питання | відповідь |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** |
| Do you provide a way for users to request that their data is deleted? | **Yes** → `https://bilohash.com/comiks/#/account` |

Типи даних (усі — **collected, not shared**, усі **optional**):

| тип | навіщо |
|---|---|
| Name | профіль і рейтинг — App functionality |
| Email address | вхід, підтвердження акаунта, відновлення пароля — Account management |
| App activity (app interactions) | прогрес навчання, зірки, результати тестів — App functionality |
| Messages (in-app) | листування між друзями — App functionality |

**Аудіо не збираємо**: розпізнавання вимови робить сам браузер на пристрої,
записи не надсилаються й не зберігаються. У формі це означає: тип «Audio» —
не позначати.

---

### 🎮 Ігри поза застосунком і вікова категорія

На сайті є вітрина ігор (`https://bilohash.com/comiks/games/`) і посилання
на «Двобій 3D» — тривимірний файтинг. **У збірках для крамниць цих посилань
немає зовсім**: застосунок перевіряє `window.Capacitor` і просто не малює ні
категорію ігор на головній, ні сторінку `#/games`, ні смужку в кінці історії
(див. `NATIVE` в `assets/app.js`).

Так зроблено навмисно. Якби посилання лишилося:

* **Content rating** довелося б заповнювати по-іншому. Файтинг — це насильство,
  хай і мультиплікаційне; замість **3+ / Everyone** вийшло б **12+ / Teen**, і
  це стосувалося б усього застосунку, а не однієї кнопки.
* Google окремо питає про **посилання назовні з застосунків для дітей**
  (Families policy). Застосунок із категорією «Education» і рейтингом 3+, який
  веде дитину на бійку, — пряма підстава для відхилення.
* В App Store те саме правило називається **1.1.4 / Kids Category**, і там
  відмова приходить швидше.

Якщо колись захочеться продавати гру з того самого застосунку — це має бути
**окремий застосунок** із власним рейтингом, а не посилання з навчального.

---

## 5. Closed testing (Testing → Closed testing → Create track)

1. Створити трек `alpha`, залити ту саму збірку.
2. Testers → Create email list → додати **12+ адрес**. Підійдуть друзі, рідні,
   колеги — будь-хто з Android і обліковим записом Google.
3. Скопіювати **opt-in link** і надіслати їм. Кожен має перейти, натиснути
   *Become a tester* і встановити застосунок.
4. Далі просто чекати: **14 днів поспіль** із 12 зареєстрованими тестувальниками.

> Google рахує саме зареєстрованих тестувальників, а не встановлення. Якщо
> хтось вийде з програми посеред строку — відлік для нього переривається, тож
> запрошуйте із запасом: 15–16 осіб.

---

## 6. Через 14 днів

Dashboard → **Apply for production access**. У заявці запитають про задум
застосунку, як проходило тестування й що ви змінили за відгуками — відповідати
своїми словами, кілька речень.

---

## Офлайн-версія — другим застосунком, пізніше

`komikslab-offline-v1.1.aab` (129 МБ, ідентифікатор `com.bilohash.komikslab`)
публікується як **окремий** застосунок. У нього простіша анкета — Data safety
«No data collected», бо в збірці немає ні акаунтів, ні мережевого коду. Але 14
днів тестування доведеться відстояти й для нього, тож зручніше запускати його
другим заходом, коли перший уже в роботі.
