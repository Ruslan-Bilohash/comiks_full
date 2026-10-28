'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets', 'kodegame.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets', 'style.css'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: 'assets/kodegame.js' });

const game = sandbox.window.KomiksKodeGame;
assert(game, 'coding game is exposed');
assert.deepEqual(Array.from(game.exampleData.moves), ['R', 'R', 'R'], 'example runs three visible commands');
assert.equal(game.exampleData.cells, 4, 'example has a start cell and three destination cells');
assert.match(source, /class: 'kg-example'/, 'level renders the compact execution example');
assert.match(source, /example_title:/, 'execution example is translated');
assert.match(css, /\.kg-example-track/, 'execution example has dedicated track styling');
assert.match(css, /\.kg-example-code \.kg-b\.on/, 'active example command is visibly highlighted');

console.log('PASS: coding levels include a compact animated code execution example');
