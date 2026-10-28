'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

const api = read('api/feedback.php');
assert.match(api, /['\"]android['\"]/, 'feedback API accepts the Android test-request category');
assert.match(api, /android[^\n]{0,240}(email|valid_email)|email[^\n]{0,240}android/is, 'Android requests require a valid email');
assert.match(api, /check_captcha/, 'Android request still uses the server-side CAPTCHA check');

const admin = read('admin.php');
assert.match(admin, /Android[^<\n]*(запит|тест)/i, 'admin labels Android test requests');
assert.match(admin, /kind\s*=\s*['\"]android['\"]|f\.kind\s*=\s*['\"]android['\"]/i, 'admin can filter the Android category');
assert.match(admin, /send_android_testing_invite/, 'marking an Android request processed sends the testing invitation');
assert.match(admin, /fb_android_sent/, 'admin reports that the Android invitation was sent');
assert.match(admin, /fb_android_(email|mail)/, 'admin reports a missing address or mail transport failure');
assert.match(admin, /\$sendResult\s*!==\s*['\"]sent['\"][^\n]*go\(/i, 'failed delivery exits before the request is processed');

const feedback = read('assets/feedback.js');
assert.match(feedback, /openAndroid|androidRequest/, 'shared Android request dialog is exported');
assert.match(feedback, /api\/feedback\.php/, 'Android request dialog posts to the feedback API');
assert.match(feedback, /type:\s*['\"]email['\"]/, 'Android request dialog uses an email input');

for (const rel of ['assets/downloads.js', 'assets/install.js']) {
  const src = read(rel);
  assert.match(src, /openAndroid|androidRequest/, `${rel} gates Android links through the request dialog`);
}

const pageBuilder = read('tools/build-download-pages.js');
assert.match(pageBuilder, /android-test|androidRequest|feedback\.php/i, 'static Android download page has the test-request form');
assert.match(pageBuilder, /captcha/i, 'static Android form includes CAPTCHA');

console.log('PASS Android test gate: request, admin delivery action and all download entry points');
