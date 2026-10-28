/* Комікс·Lab — 🍎 дописує в Info.plist те, без чого App Store відхиляє збірку.
 *
 *   node app/tools/ios-plist.js            (після npx cap add ios)
 *
 * Три речі, і кожна — причина відмови або падіння:
 *
 *  • NSMicrophoneUsageDescription і NSSpeechRecognitionUsageDescription.
 *    Без них застосунок не просто отримує відмову на перевірці — він падає
 *    при першому ж зверненні до мікрофона, бо iOS вбиває процес, який просить
 *    доступ без пояснення.
 *  • ITSAppUsesNonExemptEncryption = false. Інакше App Store Connect питає про
 *    експортні обмеження на шифрування при кожному завантаженні збірки, і доки
 *    не відповісиш — білд не йде в TestFlight.
 *  • Тексти пояснень мають казати, навіщо доступ, а не що це за доступ. «Для
 *    роботи застосунку» — класична причина відмови.
 *
 * Скрипт не ламається, якщо ключі вже є: перезаписує значення.
 */
const fs = require('fs');
const path = require('path');

const PLIST = process.argv[2] || path.join(__dirname, '..', 'ios', 'App', 'App', 'Info.plist');

const KEYS = {
  NSMicrophoneUsageDescription:
    'Komiks·Lab uses the microphone only for pronunciation practice: you say a Norwegian word and the app compares it with the example. Nothing is recorded, stored or sent anywhere.',
  NSSpeechRecognitionUsageDescription:
    'Speech recognition checks your pronunciation against the word on the screen. It runs on your device and the audio never leaves it.',
};
const BOOLS = { ITSAppUsesNonExemptEncryption: false };

if (!fs.existsSync(PLIST)) {
  console.error('✖ Немає ' + PLIST + '\n  Спершу створіть проєкт: cd app && npx cap add ios');
  process.exit(1);
}

let xml = fs.readFileSync(PLIST, 'utf8');

/* Правимо текстом, а не бібліотекою: Info.plist від Capacitor — простий
   однорівневий словник, а зайва залежність у збірці на CI коштує дорожче за
   двадцять рядків розбору. */
function setString(key, value) {
  const re = new RegExp(`(<key>${key}</key>\\s*<string>)([\\s\\S]*?)(</string>)`);
  if (re.test(xml)) { xml = xml.replace(re, `$1${value}$3`); return 'оновлено'; }
  xml = xml.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${key}</key>\n\t<string>${value}</string>\n</dict>\n</plist>\n`);
  return 'додано';
}
function setBool(key, value) {
  const re = new RegExp(`<key>${key}</key>\\s*<(true|false)\\s*/>`);
  if (re.test(xml)) { xml = xml.replace(re, `<key>${key}</key>\n\t<${value}/>`); return 'оновлено'; }
  xml = xml.replace(/<\/dict>\s*<\/plist>\s*$/, `\t<key>${key}</key>\n\t<${value}/>\n</dict>\n</plist>\n`);
  return 'додано';
}

for (const [k, v] of Object.entries(KEYS)) console.log(`   ${setString(k, v)}: ${k}`);
for (const [k, v] of Object.entries(BOOLS)) console.log(`   ${setBool(k, v)}: ${k}`);

fs.writeFileSync(PLIST, xml, 'utf8');
console.log('✔ Info.plist готовий: ' + PLIST);
