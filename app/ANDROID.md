# 🤖 Комікс·Lab для Android — від перевірки до Google Play

Застосунок — це той самий сайт у власній оболонці (Capacitor). Нічого не переписуємо:
беремо готову збірку `dist/`, кладемо її всередину застосунку, а серверні речі
(акаунти, рейтинг, дзвінок, перевірка письма) ходять на `bilohash.com`.

---

## 1. Перевірити застосунок локально — без Android Studio

Це найшвидший спосіб побачити те саме, що покаже телефон:

```bash
cd C:\comiks && node app\tools\prepare-web.js --light && node app\tools\serve.js
```

Відкриється `http://localhost:8970`. Це **вміст застосунку**, а не сайт: якщо чогось
не поклали в офлайн, сторінка це покаже, а сервер надрукує рядок
`⚠ немає у застосунку: …`. Зменште вікно браузера до ширини телефона (≈390 px) —
і побачите справжній вигляд.

Щоб перевірити застосунок проти **локального** сервера замість живого сайту:

```bash
node app\tools\prepare-web.js --light --api=http://localhost:8950/
```

---

## 2. Скільки важить застосунок

| команда | що всередині | розмір |
|---|---|---|
| `prepare-web.js --remote` | лише оболонка, усе вантажиться онлайн | < 1 МБ |
| `prepare-web.js --light` | сайт + 8 історій і 10 тем слів озвучені офлайн | **15 МБ** |
| `prepare-web.js` | усе аудіо офлайн | ~150 МБ |

Для Google Play беріть `--light`: застосунок ставиться за секунди, а решта озвучень
підвантажується з сайту, коли є інтернет. Скільки саме історій і тем класти офлайн —
змінюється без правок коду:

```bash
set LIGHT_COMICS=15 && set LIGHT_THEMES=20 && node app\tools\prepare-web.js --light
```

---

## 3. Інструменти — уже стоять

| що | де | версія |
|---|---|---|
| JDK | усередині Android Studio (`jbr`) | 25 |
| Android SDK | `%LOCALAPPDATA%\Android\Sdk` | platform 37, build-tools 36 |
| Gradle | wrapper у проєкті | 9.1.0 |
| Android Gradle Plugin | `app/android/build.gradle` | 8.13.0 |

Окремий JDK ставити не треба — беремо той, що йде з Android Studio. Усі команди
нижче очікують цей рядок:

```bash
export JAVA_HOME="C:/Program Files/Android/Android Studio/jbr"
```

`app/android/local.properties` має вказувати на SDK **прямими скісними рисками** —
з `C:\Users\…` Gradle падає з `Invalid file path`:

```
sdk.dir=C:/Users/rbilo/AppData/Local/Android/Sdk
```

---

## 4. Скласти застосунок

Перший раз — створити нативний проєкт:

```bash
cd C:\comiks\app && npm install && npx cap add android && npx --yes @capacitor/assets generate --android
```

`@capacitor/assets` бере `app/resources/icon.png` і `splash.png` і розкладає їх по всіх
розмірах — без цього застосунок матиме стандартну іконку Capacitor.

### Два застосунки — два ідентифікатори

Політика приватності описує їх як різні: `com.bilohash.komikslab` — офлайн-версія,
яка не збирає нічого, `com.bilohash.komikslab.online` — та, що з акаунтами. У Play
один ідентифікатор — це один застосунок, тож без розділення другу версію не можна
ні опублікувати, ні навіть поставити поруч: вона заміщала б першу.

Ідентифікатор задається змінною середовища, бо вміст (офлайн чи онлайн) теж
підставляють скриптами:

```bash
# онлайн: акаунти, рейтинг, друзі
KL_APP_ID=com.bilohash.komikslab.online ./gradlew bundleRelease assembleRelease
# офлайн: без змінної, базовий ідентифікатор
./gradlew bundleRelease assembleRelease
```

### Онлайн-версія (15 МБ, з акаунтами)

```bash
cd C:\comiks && node app\tools\prepare-web.js --light && cd app && npx cap sync android
```

```bash
cd C:\comiks\app\android && JAVA_HOME="C:/Program Files/Android/Android Studio/jbr" ./gradlew bundleRelease assembleRelease
```

### Офлайн-версія (121 МБ AAB, без акаунтів)

`cap sync` кладе в застосунок `app/www`, тому офлайн-вміст підставляємо самі:

```bash
cd C:\comiks && node app\android_offline\build.js && rm -rf app\android\app\src\main\assets\public && cp -r app\android_offline\www app\android\app\src\main\assets\public
```

```bash
cd C:\comiks\app\android && JAVA_HOME="C:/Program Files/Android/Android Studio/jbr" ./gradlew bundleRelease assembleRelease
```

Готові файли лежать у `app/android/app/build/outputs/` — копії з іменами версій
складено в `store/android/build/`.

### Підпис

Ключ уже створено: `_private/android/komikslab-release.jks`, пароль — у
`_private/android/keystore.properties`. `app/build.gradle` читає цей файл сам,
тому `bundleRelease` одразу дає **підписаний** AAB.

> **Збережіть копію обох файлів.** Без цього ключа оновити застосунок у Google Play
> буде неможливо. `_private/` ніколи не потрапляє ні в `dist/`, ні в архів.

Перевірити підпис:

```bash
"C:/Program Files/Android/Android Studio/jbr/bin/keytool.exe" -printcert -jarfile app/build/outputs/bundle/release/app-release.aab
```

---

## 5. ⚠️ Обовʼязково перед релізом: CORS на сервері

Застосунок — це окреме джерело (`https://localhost`), тож для сервера він чужий сайт.
Без дозволу браузер блокує **всі** запити до `api/…`: не працюють вхід, рейтинг,
друзі, дзвінок і перевірка письма.

Це вже вирішено в `api/lib.php` — дозволені джерела застосунку й попередні запити
`OPTIONS`, а кука сесії для застосунку йде з `SameSite=None; Secure`.
**Треба лише залити оновлений `api/lib.php` на сервер** разом зі збіркою.

Перевірити на живому сервері:

```bash
curl -i -H "Origin: https://localhost" https://bilohash.com/comiks/api/players.php?sort=stars
```

У відповіді має бути рядок `Access-Control-Allow-Origin: https://localhost`.
Якщо його немає — застосунок працюватиме лише як читалка, без акаунта.

Додати ще одне джерело (наприклад, для тестового складання) можна в `api/config.php`:

```php
'app_origins' => ['https://localhost', 'capacitor://localhost'],
```

---

## 6. Дані для сторінки в Google Play

| поле | значення |
|---|---|
| Назва | Komiks·Lab — Learn Norwegian |
| Пакет | `com.bilohash.komikslab` |
| Категорія | Education |
| Вікове обмеження | 3+ (немає реклами й покупок) |
| Ціна | безкоштовно, без покупок усередині |
| Політика конфіденційності | https://bilohash.com/comiks/#/terms |
| Підтримка | rbilohash@gmail.com |

**Короткий опис (80 символів):**
Learn Norwegian with voiced comics, tests and games. Free, A1–B2.

**Дозволи, які просить застосунок:** мікрофон (перевірка вимови й голосовий дзвінок) —
і більше нічого. Камери, геолокації, контактів застосунок не торкається.

**Знімки екрана** беруться з `icons/sc-*.png`, іконка — `app/resources/icon.png`.

---

## 7. Щоденний цикл

```bash
node tools\build.js
node app\tools\prepare-web.js --light
cd app && npm run android
```
