'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class ClassList {
  constructor(value = '') { this.values = new Set(String(value).split(/\s+/).filter(Boolean)); }
  contains(value) { return this.values.has(value); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
}
class Element {
  constructor(tag, attrs = {}, ...children) {
    this.tag = tag; this.attrs = attrs || {}; this.children = [];
    this.classList = new ClassList(this.attrs.class || '');
    this.append(...children);
  }
  append(...children) { this.children.push(...children.flat().filter(value => value != null)); }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  get textContent() { return this.children.map(child => child instanceof Element ? child.textContent : String(child?.textContent ?? child ?? '')).join(''); }
}
const h = (tag, attrs, ...children) => new Element(tag, attrs, ...children);
const findAll = (node, predicate, out = []) => {
  if (node instanceof Element && predicate(node)) out.push(node);
  if (node instanceof Element) node.children.forEach(child => findAll(child, predicate, out));
  return out;
};
const findButton = (root, text) => findAll(root, node => node.tag === 'button').find(node => node.textContent.includes(text));
const currentPicture = root => findAll(root, node => node.tag === 'picture')[0]?.attrs.word;

const saved = new Map();
const words = Array.from({ length: 20 }, (_, index) => [`ord${index + 1}`, `слово ${index + 1}`, `word ${index + 1}`, '🧩']);
const core = {
  h,
  ui:'uk',
  store:{ get:(key, fallback) => saved.has(key) ? saved.get(key) : fallback, set:(key, value) => saved.set(key, value) },
  shuffle:list => [...list],
  claim:() => Promise.resolve(),
  Speech:{ speak:() => {} },
  Sfx:{ good:() => {}, bad:() => {} },
  confetti:() => {}
};
const sandbox = {
  window:{ KomiksCore:core, WORDS:{ themes:[{ id:'mock', level:'A1', words }] }, KomiksPics:{ photo:() => true, el:word => new Element('picture', { word }) } },
  document:{ documentElement:{ classList:new ClassList() } },
  performance:{ now:() => 0 },
  setTimeout:callback => { callback(); return 1; },
  clearTimeout:() => {},
  console,
  Date
};
sandbox.window.window = sandbox.window;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'assets', 'today-fx.js'), 'utf8'), sandbox);

const quiz = sandbox.window.KomiksTodayFx.quiz();
assert.ok(findButton(quiz, 'Почати'), 'quiz has a start action');
findButton(quiz, 'Почати').attrs.onclick();
const firstWord = currentPicture(quiz);
assert.ok(firstWord, 'first five-word set is visible');

const finishSet = () => {
  for (let index = 0; index < 5; index++) {
    const option = findAll(quiz, node => node.classList.contains('tq-opt'))[0];
    assert.ok(option, `question ${index + 1} has an answer option`);
    option.attrs.onclick({ currentTarget:option });
  }
};
finishSet();
assert.ok(findButton(quiz, 'Ще раз'), 'completed set can be repeated');
assert.ok(findButton(quiz, 'Наступні 5 слів'), 'completed set can be replaced with five new words');

findButton(quiz, 'Наступні 5 слів').attrs.onclick();
const secondWord = currentPicture(quiz);
assert.ok(secondWord && secondWord !== firstWord, 'next set starts with a different word');
finishSet();
assert.ok(findButton(quiz, 'Наступні 5 слів'), 'next-set action remains available after another completion');

findButton(quiz, 'Наступні 5 слів').attrs.onclick();
const thirdWord = currentPicture(quiz);
assert.ok(thirdWord && thirdWord !== secondWord, 'quiz can continue to a third set');
assert.equal(saved.get('todayQuiz').b, 1, 'last completed set remains saved while the next set is in progress');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'style.css'), 'utf8');
assert.match(css, /@media \(max-width: 560px\)[\s\S]*?\.tq-actions\s*\{[^}]*grid-template-columns:\s*1fr/, 'phone layout stacks the result actions vertically');

console.log('PASS today quiz: repeat current set or continue with endless five-word sets');
