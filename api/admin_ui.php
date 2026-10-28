<?php
/* Комікс·Lab — спільний HTML-каркас для install.php та admin.php (напряму не відкривається). */
declare(strict_types=1);
if (!defined('KOMIKS_API')) { http_response_code(404); exit; }

// HTML замість JSON + суворі заголовки безпеки (скрипти лише з nonce, без вбудовування в iframe)
function html_mode(): string {
  $nonce = base64_encode(random_bytes(16));
  header('Content-Type: text/html; charset=utf-8');
  header('X-Frame-Options: DENY');
  header('X-Robots-Tag: noindex, nofollow');
  /* Скрипти — лише з цим nonce (зокрема локальний bootstrap.bundle.min.js), стилі й
     шрифти — лише свої. Жодного CDN: адмінка мусить працювати й без інтернету на сервері.
     form-action дозволяє ще accounts.google.com: «Перевірити через Google» надсилає
     форму, а сервер перенаправляє на Google. Chrome застосовує form-action і до
     перенаправлення, тож без цього кнопка мовчки нічого не робила. */
  header("Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$nonce'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; form-action 'self' https://accounts.google.com; frame-ancestors 'none'; base-uri 'none'");
  set_exception_handler(function (Throwable $e) {
    error_log('[komiks-admin] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    http_response_code(500);
    echo '<!doctype html><meta charset="utf-8"><title>Помилка</title><p style="font:16px system-ui;padding:24px">Помилка сервера. Деталі — у журналі помилок PHP (hPanel → Advanced → PHP error logs).</p>';
    exit;
  });
  return $nonce;
}
function e($s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function when(?int $t): string {
  if (!$t) return '—';
  $d = time() - $t;
  if ($d < 60) return 'щойно';
  if ($d < 3600) return intdiv($d, 60) . ' хв тому';
  if ($d < 86400) return intdiv($d, 3600) . ' год тому';
  if ($d < 86400 * 30) return intdiv($d, 86400) . ' дн тому';
  return date('d.m.Y', $t);
}

function page_open(string $title, string $nonce, array $nav = [], string $active = '', ?array $me = null): void {
  ?><!doctype html>
<html lang="uk" data-bs-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> · Komiks·Lab Admin</title>
<script nonce="<?= e($nonce) ?>">/* тема до першого малювання — без спалаху світлого екрана */try{var t=localStorage.getItem('kl-admin-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.setAttribute('data-theme','dark');}catch(e){}</script>
<link rel="stylesheet" href="assets/vendor/bootstrap.min.css">
<style>
/* ───────── «стіл художника коміксів» ─────────
   Фон — синьо-розлінована дошка (так художники розмічають сторінку олівцем,
   який не видно при друку), картки — обведені тушшю панелі з жорсткою тінню,
   меню — смуга туші, заголовок сторінки — жовтий «підпис оповідача» з коміксу.
   Шрифти лише системні: адмінка не тягне нічого з CDN. */
:root {
  --ink: #15161c; --paper: #ffffff; --board: #eaf1fb; --grid: rgba(70, 140, 220, .14);
  --text: #15161c; --muted: #5d6878; --line: #d5dce7; --edge: #15161c; --soft: #f4f7fc; --track: #e6ebf2;
  --yellow: #ffd23f; --red: #e8402f; --red-ink: #b42318; --blue: #2463eb; --green: #1a7f37;
  --ok-bg: #e4f6e8; --ok-fg: #12632b; --warn-bg: #fff4d2; --warn-fg: #7a5600; --err-bg: #ffe9e6; --err-fg: #a3171e; --info-bg: #e7efff; --info-fg: #1b46b8; --pur-bg: #efe8fd; --pur-fg: #5f37b0;
  --shadow: 3px 3px 0 var(--edge); --shadow-sm: 2px 2px 0 var(--edge); --radius: 12px;
  --side: #15161c; --side-ink: #c9cfda; --side-dim: #7f889a;
  --f-ui: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --f-cap: "Segoe UI Black", "Arial Black", "Helvetica Neue", system-ui, sans-serif;
  --bs-body-font-family: var(--f-ui); --bs-body-font-size: .9375rem; --bs-body-bg: var(--board); --bs-body-color: var(--text);
  --bs-border-color: var(--line); --bs-primary: var(--blue); --bs-link-color-rgb: 36, 99, 235; --bs-link-hover-color-rgb: 27, 70, 184;
  /* старі назви — їх читають сторінки й дашборд */
  --kl-surface: var(--paper); --kl-muted: var(--muted); --kl-line: var(--line); --kl-radius: var(--radius); --kl-shadow: var(--shadow-sm); --kl-side: var(--side); --kl-side-ink: var(--side-ink);
  color-scheme: light;
}
:root[data-theme="dark"] {
  --ink: #000; --paper: #1b1d26; --board: #101219; --grid: rgba(120, 160, 255, .055);
  --text: #e8ebf2; --muted: #9aa3b5; --line: #2d3141; --edge: #3d4256; --soft: #22253a; --track: #2a2e3d;
  --blue: #6e9bff; --red: #ff6450; --red-ink: #ff8a7a; --green: #4cc46e;
  --ok-bg: #173323; --ok-fg: #7fe09b; --warn-bg: #3a3013; --warn-fg: #ffd66b; --err-bg: #3d1c1c; --err-fg: #ff9b92; --info-bg: #1b2747; --info-fg: #9dbbff; --pur-bg: #2a2142; --pur-fg: #c9b1ff;
  --shadow: 3px 3px 0 #000; --shadow-sm: 2px 2px 0 #000; --side: #0b0c11;
  --bs-link-color-rgb: 125, 165, 255; --bs-link-hover-color-rgb: 170, 195, 255;
  color-scheme: dark;
}
html, body { background-color: var(--board); }
body {
  -webkit-font-smoothing: antialiased; color: var(--text);
  background-image: linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 28px 28px; background-attachment: fixed;
}
a { color: rgb(var(--bs-link-color-rgb)); }
h1, h2, h3 { font-weight: 750; letter-spacing: -.01em; margin: 0 0 .55rem; color: var(--text); }
h2 { font-size: 1.06rem; } h3 { font-size: .97rem; }
/* підпис оповідача — фірмовий знак кожної сторінки */
main h1:not(.card h1), .set-head h1, .dash-head h1, .ms-head h1 {
  display: inline-block; margin: 0 0 .9rem; padding: .3rem .85rem .35rem; font: 900 1.45rem/1.15 var(--f-cap); text-transform: uppercase; letter-spacing: .015em;
  color: #15161c; background: var(--yellow); border: 2.5px solid var(--edge); border-radius: 4px; box-shadow: var(--shadow); transform: rotate(-.7deg);
}
code { background: var(--soft); color: var(--text); padding: .1em .38em; border-radius: 5px; font-size: .86em; border: 1px solid var(--line); }
.muted, small.muted { color: var(--muted) !important; }
::selection { background: var(--yellow); color: #15161c; }
:focus-visible { outline: 3px solid var(--blue); outline-offset: 2px; }

/* ───────── каркас ───────── */
.kl-side {
  background: var(--side); color: var(--side-ink); width: 252px; display: flex; flex-direction: column; gap: .2rem; padding: .9rem .7rem;
  background-image: radial-gradient(rgba(255, 255, 255, .045) 1px, transparent 1.2px); background-size: 6px 6px;
}
.kl-side .brand { display: flex; align-items: center; gap: .6rem; color: #fff; text-decoration: none; font: 900 1.02rem var(--f-cap); padding: .2rem .45rem .9rem; letter-spacing: .01em; }
.kl-side .brand img { flex: none; width: 34px; height: 34px; display: block; filter: drop-shadow(2px 2px 0 #000); }
.kl-side .brand small { display: block; font: 700 .6rem var(--f-ui); letter-spacing: .14em; text-transform: uppercase; color: var(--yellow); }
.nav { flex-direction: column; padding-left: 0; margin-bottom: 0; }
.nav-g { margin: .55rem .55rem .25rem; font: 800 .64rem var(--f-ui); letter-spacing: .14em; text-transform: uppercase; color: var(--side-dim); }
.nav a {
  display: flex; align-items: center; gap: .55rem; padding: .48rem .65rem; margin-bottom: 2px; border: 2px solid transparent;
  border-radius: 9px; color: var(--side-ink); text-decoration: none; font-weight: 600; font-size: .9rem; transition: background .12s, transform .12s;
}
.nav a:hover { background: rgba(255, 255, 255, .07); color: #fff; }
.nav a.on { background: var(--yellow); color: #15161c; border-color: #000; box-shadow: 2px 2px 0 #000; font-weight: 800; transform: translateX(2px); }
.nav a .cnt { margin-left: auto; min-width: 1.4rem; padding: 0 .4rem; border-radius: 99px; background: var(--red); color: #fff; font-size: .7rem; font-weight: 800; text-align: center; line-height: 1.35rem; }
.who { margin-top: auto; padding-top: .8rem; border-top: 1px dashed rgba(255, 255, 255, .14); display: grid; gap: .45rem; }
.who form { margin: 0; }
.who .u-ava { background: var(--yellow); color: #15161c; border: 2px solid #000; }
.who .email { font-size: .76rem; color: var(--side-dim); overflow-wrap: anywhere; }
.who .btn { --bs-btn-bg: transparent; --bs-btn-color: var(--side-ink); --bs-btn-border-color: rgba(255, 255, 255, .22); --bs-btn-hover-bg: rgba(255, 255, 255, .08); --bs-btn-hover-color: #fff; --bs-btn-hover-border-color: rgba(255, 255, 255, .35); box-shadow: none; }
.kl-top { display: none; }
main { padding: 0 1.4rem 3.5rem; max-width: 1320px; }
/* верхня смужка: пошук (Ctrl+K), хто зараз на сайті, тема */
.kl-bar { position: sticky; top: 0; z-index: 1010; display: flex; align-items: center; gap: .6rem; margin: 0 -1.4rem 1.1rem; padding: .7rem 1.4rem; background: color-mix(in srgb, var(--board) 82%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
.kl-search { flex: 1; max-width: 460px; display: flex; align-items: center; gap: .55rem; padding: .45rem .75rem; border: 2px solid var(--edge); border-radius: 10px; background: var(--paper); color: var(--muted); font: 600 .9rem var(--f-ui); box-shadow: var(--shadow-sm); cursor: pointer; text-align: left; }
.kl-search:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--edge); }
.kl-search kbd { margin-left: auto; padding: .05rem .4rem; border: 1px solid var(--line); border-bottom-width: 2px; border-radius: 5px; background: var(--soft); color: var(--muted); font: 700 .72rem var(--f-ui); }
.kl-live { display: inline-flex; align-items: center; gap: .4rem; padding: .3rem .7rem; border: 2px solid var(--edge); border-radius: 99px; background: var(--paper); font-weight: 700; font-size: .82rem; box-shadow: var(--shadow-sm); white-space: nowrap; text-decoration: none; color: var(--text); }
.kl-live i { width: 9px; height: 9px; border-radius: 50%; background: #1fbf4c; box-shadow: 0 0 0 0 rgba(31, 191, 76, .55); animation: klp 1.8s infinite; }
@keyframes klp { 70% { box-shadow: 0 0 0 8px rgba(31, 191, 76, 0); } 100% { box-shadow: 0 0 0 0 rgba(31, 191, 76, 0); } }
.kl-icon { width: 40px; height: 40px; display: grid; place-items: center; border: 2px solid var(--edge); border-radius: 10px; background: var(--paper); box-shadow: var(--shadow-sm); font-size: 1.05rem; cursor: pointer; color: var(--text); text-decoration: none; }
.kl-icon:hover, .kl-live:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--edge); }
.kl-bar .sp { flex: 1; }
@media (min-width: 992px) {
  body { padding-left: 252px; }
  .kl-side { position: fixed; inset: 0 auto 0 0; z-index: 1030; overflow-y: auto; }
}
@media (max-width: 991.98px) {
  .kl-top { display: flex; align-items: center; gap: .6rem; position: sticky; top: 0; z-index: 1020; padding: .55rem .8rem; background: var(--side); color: #fff; }
  .kl-top .brand { color: #fff; text-decoration: none; font: 900 .98rem var(--f-cap); display: flex; align-items: center; gap: .5rem; }
  .kl-top .brand img { width: 28px; height: 28px; display: block; }
  .kl-top .btn { --bs-btn-bg: transparent; --bs-btn-color: #fff; --bs-btn-border-color: rgba(255,255,255,.3); box-shadow: none; }
  .kl-side { width: 280px; }
  main { padding: 0 .85rem 3rem; }
  .kl-bar { top: 52px; margin: 0 -.85rem 1rem; padding: .55rem .85rem; }
  .kl-search span.lbl { display: none; }
  input, select, textarea { font-size: 16px !important; }
}

/* ───────── поверхні: панелі коміксу ───────── */
.card {
  display: block; color: var(--text); background: var(--paper); border: 2px solid var(--edge); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 1rem 1.15rem; margin-bottom: 1.1rem; min-width: 0;
}
.card > h2:first-child, .card > h3:first-child { margin-top: 0; }
.grid { display: grid; gap: 1.1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 330px), 1fr)); align-items: start; }
.cols2 { display: grid; gap: 0 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
fieldset { border: 2px solid var(--edge); border-radius: var(--radius); padding: .85rem 1rem .25rem; margin: 0 0 1rem; background: var(--paper); }
legend { font-size: .95rem; font-weight: 750; padding: 0 .4rem; width: auto; float: none; }
hr { border-color: var(--line); opacity: 1; }

/* ───────── плитки з числами ───────── */
.stats { display: grid; gap: .8rem; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin-bottom: 1.1rem; }
.stat { position: relative; overflow: hidden; background: var(--paper); border: 2px solid var(--edge); border-radius: var(--radius); box-shadow: var(--shadow); padding: .75rem .9rem; }
.stat::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 5px; background: var(--blue); }
.stat b { display: block; font: 900 1.7rem/1.1 var(--f-cap); letter-spacing: -.01em; }
.stat span.lbl, .stat small { display: block; font-size: .8rem; font-weight: 600; color: var(--muted); line-height: 1.3; }
.stat span { position: absolute; right: .6rem; top: .5rem; font-size: 1.1rem; opacity: .5; }
.stat.y::before { background: var(--yellow); } .stat.g::before { background: var(--green); } .stat.b::before { background: var(--blue); } .stat.r::before { background: var(--red); } .stat.p::before { background: #8b5cf6; }

/* ───────── кнопки: одна червона на екран, решта — паперові ───────── */
.btn {
  --bs-btn-padding-y: .42rem; --bs-btn-padding-x: .8rem; --bs-btn-font-size: .875rem; --bs-btn-font-weight: 700; --bs-btn-border-radius: 9px; --bs-btn-border-width: 2px;
  --bs-btn-color: var(--text); --bs-btn-bg: var(--paper); --bs-btn-border-color: var(--edge);
  --bs-btn-hover-color: var(--text); --bs-btn-hover-bg: var(--soft); --bs-btn-hover-border-color: var(--edge);
  --bs-btn-active-bg: var(--soft); --bs-btn-active-border-color: var(--edge); --bs-btn-active-color: var(--text);
  --bs-btn-disabled-bg: var(--soft); --bs-btn-disabled-color: var(--muted); --bs-btn-disabled-border-color: var(--line);
  display: inline-flex; align-items: center; gap: .35rem; white-space: nowrap; box-shadow: var(--shadow-sm); transition: transform .1s, box-shadow .1s;
}
.btn:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 var(--edge); }
.btn:active { transform: translate(1px, 1px); box-shadow: 0 0 0 var(--edge); }
.btn.pri { --bs-btn-color: #fff; --bs-btn-bg: var(--red); --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #d6321f; --bs-btn-active-bg: #c22b1a; --bs-btn-active-color: #fff; }
.btn.ok { --bs-btn-color: #fff; --bs-btn-bg: var(--green); --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #176b2f; --bs-btn-active-bg: #145c28; --bs-btn-active-color: #fff; }
.btn.danger { --bs-btn-color: var(--red-ink); --bs-btn-bg: var(--paper); --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #cf222e; --bs-btn-active-bg: #a40e1a; --bs-btn-active-color: #fff; }
.btn.sm { --bs-btn-padding-y: .2rem; --bs-btn-padding-x: .55rem; --bs-btn-font-size: .8rem; --bs-btn-border-radius: 7px; }
.row { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; margin: 0; --bs-gutter-x: 0; --bs-gutter-y: 0; }
.row > * { width: auto; max-width: none; flex-shrink: 1; padding-left: 0; padding-right: 0; margin-top: 0; }
.row form { margin: 0; }
.row-left { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }

/* ───────── поля ───────── */
label.f { display: grid; gap: .25rem; font-weight: 650; font-size: .875rem; margin-bottom: .85rem; }
label.f small { color: var(--muted); font-weight: 400; font-size: .8rem; }
input[type=text], input[type=email], input[type=password], input[type=search], input[type=number], input[type=url], input[type=date], select, textarea {
  width: 100%; font: inherit; padding: .45rem .7rem; color: var(--text); background: var(--paper); border: 2px solid var(--line); border-radius: 9px;
}
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--edge); box-shadow: 3px 3px 0 var(--yellow); }
.check { display: flex; gap: .5rem; align-items: center; font-weight: 600; margin: .4rem 0 .8rem; }
.check input { width: 1.1rem; height: 1.1rem; accent-color: var(--red); }
.filters { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; margin-bottom: .9rem; }
.filters input[type=search], .filters select { flex: 0 1 230px; width: auto; }
@media (max-width: 575.98px) { .filters > * { flex: 1 1 100% !important; } }

/* ───────── позначки й повідомлення ───────── */
.pill { display: inline-block; padding: .08rem .5rem; border: 1.5px solid transparent; border-radius: 99px; font-size: .74rem; font-weight: 750; background: var(--soft); color: var(--muted); white-space: nowrap; }
.pill.g { background: var(--ok-bg); color: var(--ok-fg); } .pill.r { background: var(--err-bg); color: var(--err-fg); }
.pill.y { background: var(--warn-bg); color: var(--warn-fg); } .pill.b { background: var(--info-bg); color: var(--info-fg); } .pill.p { background: var(--pur-bg); color: var(--pur-fg); }
.pill.A1 { background: var(--ok-bg); color: var(--ok-fg); } .pill.A2 { background: var(--info-bg); color: var(--info-fg); } .pill.B1 { background: var(--warn-bg); color: var(--warn-fg); } .pill.B2 { background: var(--err-bg); color: var(--err-fg); }
.msg { position: relative; padding: .65rem .9rem .65rem 1.05rem; border: 2px solid var(--edge); border-radius: 10px; margin-bottom: 1rem; font-weight: 600; background: var(--paper); box-shadow: var(--shadow-sm); }
.msg::before { content: ''; position: absolute; inset: 0 auto 0 0; width: 5px; border-radius: 8px 0 0 8px; background: var(--blue); }
.msg.ok { background: var(--ok-bg); color: var(--ok-fg); } .msg.ok::before { background: var(--green); }
.msg.err { background: var(--err-bg); color: var(--err-fg); } .msg.err::before { background: var(--red); }
.msg.warn { background: var(--warn-bg); color: var(--warn-fg); } .msg.warn::before { background: var(--yellow); }
.msg a { color: inherit; font-weight: 800; }
.err-box { padding: .6rem .75rem; margin: .6rem 0; background: var(--err-bg); color: var(--err-fg); border: 1.5px solid currentColor; border-radius: 9px; overflow-wrap: anywhere; }

/* ───────── таблиці ───────── */
table.t { width: 100%; border-collapse: separate; border-spacing: 0; font-size: .875rem; color: var(--text); }
.card table.t { display: block; overflow: auto; max-height: 72vh; }
.t th { position: sticky; top: 0; z-index: 1; text-align: left; white-space: nowrap; font-size: .7rem; text-transform: uppercase; letter-spacing: .07em; font-weight: 800; color: var(--muted); background: var(--soft); padding: .55rem .6rem; border-bottom: 2px solid var(--edge); }
.t td { padding: .52rem .6rem; border-bottom: 1px solid var(--line); vertical-align: middle; }
.t tbody tr:hover td { background: var(--soft); }
.t td .muted, .t td small { white-space: normal; }
.u-name { display: flex; align-items: center; gap: .6rem; }
.u-ava { flex: none; width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: var(--yellow); color: #15161c; border: 2px solid var(--edge); font-weight: 900; font-size: .85rem; }
.u-name b { display: block; font-weight: 700; } .u-name small { color: var(--muted); word-break: break-all; }
.pager { display: flex; gap: .5rem; justify-content: center; margin-top: 1rem; }

/* ───────── переклади ───────── */
.tr-bar { display: block; height: 8px; background: var(--track); border-radius: 99px; overflow: hidden; margin-bottom: 3px; min-width: 70px; }
.tr-bar i { display: block; height: 100%; border-radius: 99px; }
.tr-bar i.ok { background: var(--green); } .tr-bar i.mid { background: #d4a72c; } .tr-bar i.low { background: var(--red); }
.tr-pct { font-size: .85rem; }
.tr-miss { margin: 0 0 10px; padding-left: 18px; font-size: .86rem; color: var(--muted); max-height: 220px; overflow: auto; }
.tr-miss li { margin-bottom: 2px; word-break: break-word; }

/* ───────── списки, чипси, решта ───────── */
.chips { display: flex; flex-wrap: wrap; gap: .4rem; }
.chips a { padding: .25rem .7rem; border: 2px solid var(--edge); border-radius: 99px; color: var(--text); text-decoration: none; font-weight: 700; font-size: .82rem; background: var(--paper); }
.chips a:hover { background: var(--soft); }
.chips a.on { background: var(--yellow); color: #15161c; box-shadow: var(--shadow-sm); }
.list { display: grid; gap: .45rem; margin: 0; padding: 0; list-style: none; }
.list li { display: flex; gap: .6rem; align-items: center; justify-content: space-between; padding: .5rem .7rem; border: 1.5px solid var(--line); border-radius: 9px; background: var(--soft); }
.list li > div { min-width: 0; }
.kv { display: grid; grid-template-columns: max-content 1fr; gap: .4rem .9rem; margin: 0; font-size: .9rem; }
.kv dt { color: var(--muted); font-weight: 650; } .kv dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
.req { display: grid; gap: .35rem; margin: 0 0 1rem; padding: 0; list-style: none; }
.req li { display: flex; justify-content: space-between; gap: .6rem; padding: .4rem .7rem; border: 1.5px solid var(--line); border-radius: 9px; background: var(--soft); }
/* 🟢 хто онлайн */
.on-dot { display: inline-block; width: .6rem; height: .6rem; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px rgba(76, 196, 110, .25); vertical-align: middle; animation: onpulse 2s ease-in-out infinite; }
@keyframes onpulse { 50% { box-shadow: 0 0 0 6px rgba(76, 196, 110, 0); } }
@media (prefers-reduced-motion: reduce) { .on-dot { animation: none; } }
.online-card h2 { display: flex; align-items: center; gap: .5rem; }
.online-list { display: flex; flex-wrap: wrap; gap: .5rem; }
.online-u { display: flex; align-items: center; gap: .5rem; padding: .35rem .7rem .35rem .4rem; border: 1.5px solid var(--line); border-radius: 999px; background: var(--soft); color: inherit; text-decoration: none; }
.online-u:hover { border-color: var(--green); }
.online-u small { display: block; color: var(--muted); font-size: .72rem; }
.u-sort { margin: .2rem 0 .8rem; }
.diag { list-style: none; padding: 0; margin: 0; }
.diag li { display: flex; gap: .6rem; align-items: flex-start; padding: .55rem .7rem; border: 1.5px solid var(--line); border-left: 5px solid var(--line); border-radius: 9px; margin-bottom: .4rem; background: var(--soft); }
.diag li.d-ok { border-left-color: var(--green); } .diag li.d-warn { border-left-color: #d4a72c; background: var(--warn-bg); } .diag li.d-bad { border-left-color: var(--red); background: var(--err-bg); }
.diag .d-ic { flex: none; line-height: 1.4; }
.diag small { font-weight: 400; color: var(--muted); }
.fb-img { max-width: min(320px, 100%); height: auto; border: 2px solid var(--edge); border-radius: 9px; margin: .4rem 0; display: block; }
.fb-text { background: var(--soft); border: 1.5px solid var(--line); border-radius: 9px; padding: .5rem .7rem; margin: .4rem 0; white-space: pre-wrap; }
.row-btns { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; margin-top: .75rem; } .row-btns form { margin: 0; }
.set-list { margin: .2rem 0 0; padding-left: 1.1rem; } .set-list li { margin: .35rem 0; }
.bars { display: flex; align-items: flex-end; gap: 2px; height: 120px; padding-top: .5rem; }
.bars i { flex: 1; min-width: 3px; background: var(--blue); border-radius: 3px 3px 0 0; position: relative; opacity: .85; }
.bars i:hover { opacity: 1; }
.bars i:hover::after { content: attr(data-t); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #15161c; color: #fff; font-size: .75rem; padding: .15rem .4rem; border-radius: 6px; white-space: nowrap; z-index: 2; }
.bars-x { display: flex; justify-content: space-between; color: var(--muted); font-size: .75rem; border-top: 1px solid var(--line); padding-top: .2rem; }
.cat { margin-bottom: 1.4rem; }
.cat h2 { display: flex; align-items: center; gap: .5rem; }
.comics { display: grid; gap: .9rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 232px), 1fr)); }
.comic { display: grid; gap: .2rem; padding: 0 0 .7rem; background: var(--paper); border: 2px solid var(--edge); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; transition: transform .12s; }
.comic:hover { transform: translate(-2px, -2px) rotate(-.3deg); box-shadow: 5px 5px 0 var(--edge); }
.comic > :not(.comic-cover) { margin-left: .7rem; margin-right: .7rem; }
.comic b { font-weight: 750; font-size: .92rem; }
.comic small { color: var(--muted); font-size: .78rem; }
.comic-cover { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: var(--soft); border-bottom: 2px solid var(--edge); margin: 0 0 .5rem; }
.comic .row { margin-top: .3rem; }
.material-tracks { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; margin: 0 0 1.1rem; }
.material-track { min-width: 0; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .7rem; padding: .8rem .9rem; color: var(--text); text-decoration: none; background: var(--paper); border: 2px solid var(--edge); border-radius: var(--radius); box-shadow: var(--shadow-sm); }
.material-track:hover { color: var(--text); transform: translate(-1px, -1px); box-shadow: var(--shadow); }
.material-track.on { background: var(--yellow); box-shadow: var(--shadow); }
.material-track-icon { font-size: 1.65rem; line-height: 1; }
.material-track b, .material-track small { display: block; }
.material-track small { color: var(--muted); font-size: .76rem; line-height: 1.25; margin-top: .12rem; }
.material-track strong { display: grid; place-items: center; min-width: 2.1rem; height: 2.1rem; padding: 0 .35rem; border: 2px solid var(--edge); border-radius: 999px; background: var(--paper); color: var(--text); font: 800 .84rem var(--f-cap); }
.material-cover { place-items: center; align-content: center; gap: .15rem; background: linear-gradient(135deg, var(--soft), var(--paper)); }
.material-cover.en { background: linear-gradient(135deg, #e8f1ff, #fff4f4); }
.material-cover.code { background: linear-gradient(135deg, #e9e4ff, #e3f8f0); }
.material-cover > span { font-size: 3rem; line-height: 1; }
.material-cover > b { font: 900 1rem var(--f-cap); color: var(--muted); letter-spacing: .08em; }
@media (max-width: 850px) { .material-tracks { grid-template-columns: 1fr; } .material-track small { display: none; } }
.mail-list { max-height: 60vh; overflow-y: auto; }
.mail-row { display: grid; grid-template-columns: auto 1fr auto; gap: .6rem; align-items: center; cursor: pointer; width: 100%; min-height: 48px; padding: 6px 0; }
.mail-row input { width: 22px; height: 22px; accent-color: var(--red); }
.mail-meta { text-align: right; white-space: nowrap; font-size: .8rem; color: var(--muted); }
.mail-count { margin-left: auto; align-self: center; font-size: .875rem; }
.mail-count.none { color: var(--red-ink); }
.mail-who { min-width: 0; overflow-wrap: anywhere; }
.mail-list li { min-width: 0; }
.mail-preview { overflow-wrap: anywhere; }
.mail-preview details { padding: 12px 0; border-bottom: 1px solid var(--line); }
.mail-preview summary { cursor: pointer; font-weight: 700; min-height: 32px; }
#mailForm .btn { min-height: 44px; }
#mailForm .mail-count { flex-basis: 100%; margin-left: 0; }
@media (max-width: 620px) { .mail-row { grid-template-columns: auto 1fr; } .mail-meta { grid-column: 2; text-align: left; } }

/* ───────── ⚙️ налаштування ───────── */
.set-head { margin-bottom: 1rem; }
.set-head p { margin: 0; }
.set { display: grid; gap: 1.1rem; grid-template-columns: 268px minmax(0, 1fr); align-items: start; }
.set-nav { position: sticky; top: 4.6rem; display: grid; gap: 3px; padding: .4rem; background: var(--paper); border: 2px solid var(--edge); border-radius: var(--radius); box-shadow: var(--shadow); }
.set-nav a { display: grid; grid-template-columns: 1.6rem minmax(0, 1fr) auto; align-items: center; gap: .55rem; padding: .5rem .6rem; border: 2px solid transparent; border-radius: 9px; color: var(--text); text-decoration: none; }
.set-nav a:hover { background: var(--soft); }
.set-nav a.on { background: var(--yellow); color: #15161c; border-color: var(--edge); }
.set-nav a.on small { color: #3d3a2a; }
.set-nav .ico { font-size: 1.1rem; text-align: center; }
.set-nav .t { display: grid; min-width: 0; line-height: 1.25; }
.set-nav .t b { font-weight: 750; font-size: .9rem; }
.set-nav .t small { color: var(--muted); font-size: .76rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: #c7cdd4; border: 1.5px solid var(--edge); }
.dot.ok { background: #1fbf4c; } .dot.warn { background: #f2b705; } .dot.err { background: #e5383b; }
.set-body { min-width: 0; }
.set-sec { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 1.1rem; padding: 1rem 1.15rem; background: var(--paper); border: 2px solid var(--edge); border-radius: var(--radius); box-shadow: var(--shadow); }
.set-sec h2 { font-size: 1.2rem; margin-bottom: .25rem; }
.set-sec p { margin: 0; max-width: 62ch; }
.set-cards { display: grid; gap: 1.1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); align-items: start; }
.set-cards .card { margin: 0; }
.set-wide { grid-column: 1 / -1; }
.set-form { max-width: 560px; margin-top: .75rem; }
.set-form .btn { margin-top: .25rem; }
.set-note { font-size: .82rem; margin: .6rem 0 0; }
.set-grid { display: grid; gap: .95rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); }
.set-tile { display: flex; flex-direction: column; gap: .35rem; color: inherit; text-decoration: none; margin: 0; transition: transform .12s, box-shadow .12s; }
.set-tile:hover { transform: translate(-2px, -2px); box-shadow: 5px 5px 0 var(--edge); }
.set-tile h2 { margin: .25rem 0 0; font-size: 1rem; }
.set-tile p { margin: 0; font-size: .86rem; flex: 1; }
.set-tile-top { display: flex; justify-content: space-between; align-items: center; gap: .5rem; }
.set-tile-top .ico { font-size: 1.45rem; }
.set-go { color: rgb(var(--bs-link-color-rgb)); font-weight: 750; font-size: .86rem; margin-top: .35rem; }
.set-attn { margin-bottom: 1.1rem; }
.set-steps { list-style: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .55rem; padding: 0; margin: 0 0 1rem; }
.set-steps li { display: flex; align-items: center; gap: .5rem; padding: .55rem .7rem; background: var(--paper); border: 2px solid var(--line); border-radius: 9px; font-size: .84rem; color: var(--muted); min-width: 0; }
.set-steps li b { flex: none; width: 1.55rem; height: 1.55rem; display: grid; place-items: center; border-radius: 50%; background: var(--soft); color: var(--text); font-size: .78rem; border: 1.5px solid var(--edge); }
.set-steps li span { min-width: 0; overflow-wrap: anywhere; }
.set-steps li.done b { background: var(--green); color: #fff; }
.set-steps li.now { border-color: var(--edge); color: var(--text); font-weight: 700; box-shadow: var(--shadow-sm); }
.set-steps li.now b { background: var(--yellow); color: #15161c; }
.set-meter { height: 12px; background: var(--track); border: 1.5px solid var(--edge); border-radius: 99px; overflow: hidden; margin: .25rem 0 .75rem; }
.set-meter i { display: block; height: 100%; background: var(--yellow); }
code.wrap { overflow-wrap: anywhere; word-break: break-all; }
@media (max-width: 991.98px) {
  .set { grid-template-columns: minmax(0, 1fr); }
  .set-nav { position: static; display: flex; overflow-x: auto; gap: .35rem; padding: .35rem; scroll-snap-type: x proximity; -webkit-overflow-scrolling: touch; }
  .set-nav a { flex: none; grid-template-columns: auto auto auto; scroll-snap-align: start; padding: .45rem .65rem; border-color: var(--line); }
  .set-nav .t small { display: none; }
  .set-nav .t b { white-space: nowrap; }
  .set-sec { flex-direction: column; gap: .5rem; padding: .85rem .9rem; }
  .set-steps { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 575.98px) {
  .kv { grid-template-columns: minmax(0, 1fr); gap: .1rem; }
  .kv dt { margin-top: .45rem; }
  .set-form .btn { width: 100%; }
}

/* ───────── вхід ───────── */
.auth-wrap { min-height: 100vh; display: grid; place-items: center; padding: 1.25rem .85rem; }
.auth { width: min(460px, 100%); }
.auth .card { padding: 1.6rem; box-shadow: 6px 6px 0 var(--edge); }
.auth .brand { display: flex; align-items: center; justify-content: center; gap: .55rem; margin-bottom: 1.1rem; font: 900 1.2rem var(--f-cap); color: var(--text); text-decoration: none; text-transform: uppercase; }
.auth .brand small { padding: .05rem .45rem; background: var(--yellow); color: #15161c; border: 2px solid var(--edge); border-radius: 4px; font-size: .7rem; letter-spacing: .1em; transform: rotate(-2deg); }
.auth .brand img { width: 36px; height: 36px; display: block; }
.auth h1, .auth h2 { transform: none; }

/* ───────── ⌘K палітра ───────── */
.kl-pal { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: start center; padding: 12vh 1rem 1rem; background: rgba(10, 12, 20, .45); backdrop-filter: blur(3px); }
.kl-pal[hidden] { display: none; }
.kl-pal-box { width: min(620px, 100%); background: var(--paper); border: 2.5px solid var(--edge); border-radius: 14px; box-shadow: 6px 6px 0 var(--edge); overflow: hidden; }
.kl-pal-in { display: flex; align-items: center; gap: .6rem; padding: .8rem 1rem; border-bottom: 2px solid var(--edge); background: var(--yellow); }
.kl-pal-in input { border: 0 !important; background: transparent !important; box-shadow: none !important; padding: 0; font: 800 1.05rem var(--f-ui); color: #15161c; }
.kl-pal-in input::placeholder { color: #5e5530; }
.kl-pal ul { list-style: none; margin: 0; padding: .4rem; max-height: 50vh; overflow: auto; }
.kl-pal li a { display: flex; align-items: center; gap: .7rem; padding: .55rem .75rem; border-radius: 9px; color: var(--text); text-decoration: none; font-weight: 650; border: 2px solid transparent; }
.kl-pal li a small { margin-left: auto; color: var(--muted); font-weight: 600; font-size: .78rem; }
.kl-pal li a.sel { background: var(--soft); border-color: var(--edge); }
.kl-pal .hint { padding: .5rem 1rem; border-top: 1px solid var(--line); color: var(--muted); font-size: .76rem; }

@media (max-width: 767.98px) {
  main h1, .set-head h1, .dash-head h1 { font-size: 1.15rem; }
  .card { padding: .85rem .9rem; }
  .stats { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .65rem; }
  .stat b { font-size: 1.4rem; }
  .list li { flex-direction: column; align-items: stretch; gap: .5rem; }
  .row .btn { min-height: 38px; }
  .kv { grid-template-columns: 1fr; } .kv dt { margin-top: .35rem; }
  .card table.t { max-height: none; }
  .t thead { display: none; }
  .t, .t tbody, .t tr, .t td { display: block; width: 100%; }
  .t tr { border: 2px solid var(--edge); border-radius: var(--radius); margin-bottom: .7rem; background: var(--paper); padding: .3rem 0; box-shadow: var(--shadow-sm); }
  .t td { border: 0; padding: .3rem .75rem; }
  .t td[data-l]::before { content: attr(data-l) ': '; color: var(--muted); font-weight: 700; font-size: .78rem; }
  .btn { white-space: normal; text-align: left; }
}
/* 📅 календар активності користувача: стовпчик — тиждень, клітинка — день */
.act-cal { display: flex; gap: 3px; margin: .2rem 0 .5rem; overflow-x: auto; padding-bottom: 2px; }
.cal-w { display: grid; grid-template-rows: repeat(7, 1fr); gap: 3px; }
.act-cal i, .act-lg i { display: block; width: 14px; height: 14px; border-radius: 3px; background: var(--track); border: 1px solid var(--line); }
.act-cal i.on, .act-lg i.on { background: var(--green); border-color: var(--edge); }
.act-cal i.fut { background: transparent; border-style: dashed; }
.act-lg { display: flex; gap: 1rem; margin-bottom: .7rem; font-size: .78rem; color: var(--muted); }
.act-lg span { display: inline-flex; align-items: center; gap: .35rem; }
/* перемикач (підписка на розсилку тощо) */
.mail-sw { margin: 0; }
.sw { display: inline-flex; align-items: center; gap: .45rem; cursor: pointer; font-size: .8rem; font-weight: 700; color: var(--muted); user-select: none; }
.sw input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.sw i { position: relative; flex: none; width: 40px; height: 22px; border: 2px solid var(--edge); border-radius: 99px; background: var(--track); transition: background .15s; }
.sw i::after { content: ''; position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border: 2px solid var(--edge); border-radius: 50%; background: var(--paper); transition: transform .15s; }
.sw input:checked + i { background: var(--green); }
.sw input:checked + i::after { transform: translateX(18px); }
.sw input:checked ~ span { color: var(--ok-fg); }
.sw input:focus-visible + i { outline: 3px solid var(--blue); outline-offset: 2px; }
.sw.busy { opacity: .6; pointer-events: none; }
/* спливаюче повідомлення після дії без перезавантаження */
.kl-toast { position: fixed; right: 18px; bottom: 18px; z-index: 2100; max-width: min(420px, calc(100vw - 36px)); padding: .65rem 1rem; border: 2.5px solid var(--edge); border-radius: 12px; background: var(--ok-bg); color: var(--ok-fg); font-weight: 750; box-shadow: var(--shadow); animation: kltIn .2s ease-out; }
.kl-toast.err { background: var(--err-bg); color: var(--err-fg); } .kl-toast.warn { background: var(--warn-bg); color: var(--warn-fg); }
@keyframes kltIn { from { opacity: 0; transform: translateY(10px); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } main h1 { transform: none; } }
</style></head><body>
<?php if ($nav): ?>
<?php
  /* Розділи групуємо за тим, що з ними робиш: люди, контент, зв’язок, сервер.
     Ключі, яких тут немає, потрапляють у «Інше» — нова сторінка не загубиться. */
  $groups = ['Огляд' => ['dash'], 'Люди' => ['users', 'community', 'teachers', 'feedback'], 'Контент' => ['materials', 'translations', 'voice'], 'Звʼязок' => ['mail'], 'Система' => ['diag', 'system']];
  $placed = array_merge(...array_values($groups));
  $rest = array_values(array_diff(array_keys($nav), $placed));
  if ($rest) $groups['Інше'] = $rest;
  $item = function (string $k, string $label) use ($active) {
    // «💌 Відгуки (5)» → підпис + червоний лічильник
    $cnt = preg_match('/\((\d+)\)\s*$/u', $label, $m) ? $m[1] : '';
    $label = $cnt !== '' ? trim(preg_replace('/\(\d+\)\s*$/u', '', $label)) : $label;
    return '<a href="admin.php?p=' . e($k) . '" class="' . ($k === $active ? 'on' : '') . '"' . ($k === $active ? ' aria-current="page"' : '') . '>' . e($label) . ($cnt !== '' ? '<span class="cnt">' . e($cnt) . '</span>' : '') . '</a>';
  };
  $side = function () use ($nav, $groups, $item, $me) { ?>
    <a class="brand" href="admin.php"><img src="img/logo.svg" alt="" width="34" height="34"><span>Komiks·Lab<small>редакція</small></span></a>
    <nav class="nav" aria-label="Розділи"><?php foreach ($groups as $g => $keys) { $links = ''; foreach ($keys as $k) if (isset($nav[$k])) $links .= $item($k, $nav[$k]); if ($links !== '') echo (count($nav) > 3 ? '<div class="nav-g">' . e($g) . '</div>' : '') . $links; } ?></nav>
    <?php if ($me): ?><div class="who">
      <div class="d-flex align-items-center gap-2"><span class="u-ava"><?= e(mb_first($me['name'])) ?></span><span class="email"><?= e($me['email']) ?></span></div>
      <a class="btn sm" href="./" target="_blank" rel="noopener">↗ Відкрити сайт</a>
      <form method="post" action="admin.php?p=logout"><input type="hidden" name="csrf" value="<?= e(admin_csrf()) ?>"><button class="btn sm w-100">Вийти</button></form>
    </div><?php endif;
  };
  $live = (function_exists('hits_live') && function_exists('hits_enabled') && meta_get('hits_v') === '1') ? hits_live() : null;
  /* дані для палітри Ctrl+K: розділи + швидкі дії; рендер — у page_close */
  $pal = [];
  foreach ($nav as $k => $label) $pal[] = ['t' => trim(preg_replace('/\(\d+\)\s*$/u', '', $label)), 'h' => 'admin.php?p=' . $k, 's' => 'розділ'];
  foreach ([['📣 Новий лист', 'admin.php?p=mail&view=compose', 'розсилки'], ['➕ Створити акаунт', 'admin.php?p=users', 'користувачі'], ['📈 Статистика відвідувань', 'admin.php?p=system&s=stats', 'налаштування'], ['🔐 Безпека та доступ', 'admin.php?p=system&s=security', 'налаштування'], ['💾 Резервна копія', 'admin.php?p=system&s=backup', 'налаштування'], ['↗ Відкрити сайт', './', 'сайт']] as [$t, $h, $s]) if (isset($nav['system']) || !str_contains($h, 'system')) $pal[] = ['t' => $t, 'h' => $h, 's' => $s];
  $GLOBALS['KL_PAL'] = $pal;
?>
<header class="kl-top">
  <button class="btn sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#klNav" aria-controls="klNav" aria-label="Розділи">☰</button>
  <a class="brand" href="admin.php"><img src="img/logo.svg" alt="" width="28" height="28"> Komiks·Lab</a>
</header>
<aside class="kl-side d-none d-lg-flex"><?php $side(); ?></aside>
<div class="offcanvas offcanvas-start kl-side d-lg-none" tabindex="-1" id="klNav" aria-label="Розділи адмін-панелі"><?php $side(); ?></div>
<main>
<div class="kl-bar">
  <button class="kl-search" type="button" data-pal-open aria-label="Пошук розділу або користувача">🔎 <span class="lbl">Пошук розділу, дії або користувача…</span><kbd>Ctrl K</kbd></button>
  <span class="sp"></span>
  <?php if ($live !== null): ?><a class="kl-live" href="admin.php?p=dash" title="Активні за останні 5 хвилин"><i aria-hidden="true"></i><?= (int)$live ?> на сайті</a><?php endif; ?>
  <button class="kl-icon" type="button" data-theme-toggle aria-label="Перемкнути тему" title="Світла / темна тема">🌗</button>
</div>
<?php endif;
}
function page_close(string $nonce, bool $wrapped = true): void {
  if ($wrapped) echo "</main>\n";
  $pal = $GLOBALS['KL_PAL'] ?? [];
  if ($pal) {
    echo '<div class="kl-pal" hidden role="dialog" aria-modal="true" aria-label="Швидкий пошук"><div class="kl-pal-box"><div class="kl-pal-in">🔎<input type="search" placeholder="Розділ, дія або ім’я / пошта користувача" aria-label="Що шукаємо" autocomplete="off"></div><ul></ul><div class="hint">↑ ↓ — вибір · Enter — відкрити · Esc — закрити</div></div></div>';
    echo '<script nonce="' . e($nonce) . '">window.KL_PAL=' . json_encode($pal, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) . ';</script>';
  }
  /* Bootstrap потрібен лише для шухляди з розділами на телефоні, тому вантажимо
     його останнім і з defer — сторінка читається, не чекаючи на скрипт. */
  echo '<script nonce="' . e($nonce) . '" src="assets/vendor/bootstrap.bundle.min.js" defer></script>';
  // підтвердження небезпечних дій: <form data-confirm="…">; тема; палітра Ctrl+K (текст — лише через textContent)
  echo '<script nonce="' . e($nonce) . '">document.addEventListener("submit",function(ev){var m=ev.target.getAttribute("data-confirm");if(m&&!confirm(m))ev.preventDefault();});'
    /* data-ajax: дія без перезавантаження. Сервер відповідає JSON (go() бачить X-Admin-Ajax);
       data-done="remove" — картка зникає, лічильники data-count зменшуються; data-switch — галочка. */
    . 'function klToast(t,k){var d=document.createElement("div");d.className="kl-toast "+(k||"");d.setAttribute("role","status");d.textContent=t;document.body.appendChild(d);setTimeout(function(){d.remove();},2600);}'
    . 'document.addEventListener("submit",function(ev){var f=ev.target;if(ev.defaultPrevented||!f.matches("form[data-ajax]"))return;ev.preventDefault();var sw=f.querySelector(".sw");if(sw)sw.classList.add("busy");'
    . 'fetch(f.getAttribute("action"),{method:"POST",body:new FormData(f),credentials:"same-origin",headers:{"X-Admin-Ajax":"1"}}).then(function(r){return r.json();}).then(function(j){if(sw)sw.classList.remove("busy");'
    . 'if(!j.ok){klToast(j.text||"Не вдалося.","err");var cb=f.querySelector("[data-autosubmit]");if(cb)cb.checked=!cb.checked;return;}klToast(j.text,j.type==="warn"?"warn":"");'
    . 'if(f.hasAttribute("data-switch")){var c=f.querySelector("[data-autosubmit]"),d=f.querySelector("input[name=do]"),s=f.querySelector(".sw span");d.value=c.checked?c.getAttribute("data-off"):c.getAttribute("data-on");if(s)s.textContent=c.checked?"підписаний":"відписаний";return;}'
    . 'if(f.getAttribute("data-done")==="remove"){var it=f.closest("[data-item]");if(it){var dec=it.getAttribute("data-dec");if(dec)document.querySelectorAll("[data-count="+dec+"]").forEach(function(n){n.textContent=Math.max(0,(parseInt(n.textContent,10)||0)-1);});'
    . 'it.classList.add("gone");setTimeout(function(){var list=it.parentNode;it.remove();if(list&&list.hasAttribute("data-empty")&&!list.querySelector("[data-item]")){var p=document.createElement("p");p.className="mod-empty";p.textContent=list.getAttribute("data-empty");list.appendChild(p);}},260);}}'
    . 'else location.reload();}).catch(function(){if(sw)sw.classList.remove("busy");klToast("Немає зв’язку із сервером. Спробуйте ще раз.","err");});});'
    . 'document.addEventListener("change",function(e){var c=e.target;if(c.matches&&c.matches("[data-autosubmit]")&&c.form){if(c.form.requestSubmit)c.form.requestSubmit();else c.form.dispatchEvent(new Event("submit",{cancelable:true,bubbles:true}));}});'
    . '(function(){var r=document.documentElement;document.querySelectorAll("[data-theme-toggle]").forEach(function(b){b.addEventListener("click",function(){var d=r.getAttribute("data-theme")!=="dark";if(d)r.setAttribute("data-theme","dark");else r.removeAttribute("data-theme");try{localStorage.setItem("kl-admin-theme",d?"dark":"light");}catch(e){}});});'
    . 'var P=document.querySelector(".kl-pal");if(!P||!window.KL_PAL)return;var inp=P.querySelector("input"),ul=P.querySelector("ul"),sel=0,items=[];'
    . 'function draw(){var q=inp.value.trim().toLowerCase();items=window.KL_PAL.filter(function(x){return !q||x.t.toLowerCase().indexOf(q)>=0||x.s.indexOf(q)>=0;});'
    . 'if(q.length>1)items.push({t:"👤 Знайти користувача: "+inp.value.trim(),h:"admin.php?p=users&q="+encodeURIComponent(inp.value.trim()),s:"пошук"});if(sel>=items.length)sel=0;'
    . 'while(ul.firstChild)ul.removeChild(ul.firstChild);items.forEach(function(x,i){var li=document.createElement("li"),a=document.createElement("a"),s=document.createElement("small");a.href=x.h;a.textContent=x.t;s.textContent=x.s;a.appendChild(s);if(i===sel)a.className="sel";if(x.h==="./")a.target="_blank";li.appendChild(a);ul.appendChild(li);});}'
    . 'function open(){P.hidden=false;inp.value="";sel=0;draw();inp.focus();}function close(){P.hidden=true;}'
    . 'document.querySelectorAll("[data-pal-open]").forEach(function(b){b.addEventListener("click",open);});'
    . 'document.addEventListener("keydown",function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();P.hidden?open():close();}else if(!P.hidden){if(e.key==="Escape")close();else if(e.key==="ArrowDown"){e.preventDefault();sel=Math.min(items.length-1,sel+1);draw();}else if(e.key==="ArrowUp"){e.preventDefault();sel=Math.max(0,sel-1);draw();}else if(e.key==="Enter"&&items[sel]){e.preventDefault();if(items[sel].h==="./")window.open("./","_blank");else location.href=items[sel].h;}}});'
    . 'inp.addEventListener("input",function(){sel=0;draw();});P.addEventListener("click",function(e){if(e.target===P)close();});})();</script>';
  echo "</body></html>";
}
function mb_first(string $s): string { return preg_match('/^./u', $s, $m) ? mb_upper($m[0]) : '?'; }
function mb_upper(string $s): string { return function_exists('mb_strtoupper') ? mb_strtoupper($s, 'UTF-8') : strtoupper($s); }
/* mbstring є не скрізь (зокрема у php -S на машині розробника), а пошук мусить
   працювати й без нього — просто без правильного регістру для кирилиці. */
function mb_lower(string $s): string { return function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s); }

// CSRF для форм адмінки: HMAC від сесійного токена (без сесії — від cookie-«нонса» інсталятора)
function admin_csrf(): string { return hash_hmac('sha256', 'admin|' . sha((string)($_COOKIE[SESSION_COOKIE] ?? '')), (string)cfg('secret')); }
function check_admin_csrf(): void {
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== ($_SERVER['HTTP_HOST'] ?? '') && parse_url($origin, PHP_URL_HOST) !== parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) { http_response_code(403); exit('csrf'); }
  if (!hash_equals(admin_csrf(), (string)($_POST['csrf'] ?? ''))) { http_response_code(403); exit('csrf'); }
}
