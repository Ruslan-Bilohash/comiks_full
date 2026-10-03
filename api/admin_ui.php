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
     шрифти — лише свої. Жодного CDN: адмінка мусить працювати й без інтернету на сервері. */
  header("Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-$nonce'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
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
<link rel="stylesheet" href="assets/vendor/bootstrap.min.css">
<style>
/* ───────── палітра інструмента, а не коміксу ─────────
   Сірий фон, біла поверхня, одна акцентна барва. Дані мають бути найтемнішим,
   що є на екрані; рамки й підписи — світлішими за них. */
:root {
  --bs-body-font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --bs-body-font-size: .9375rem;
  --bs-body-bg: #f4f5f7;
  --bs-body-color: #1f2328;
  --bs-border-color: #d9dee3;
  --bs-primary: #2563eb;
  --bs-link-color-rgb: 37, 99, 235;
  --kl-surface: #fff;
  --kl-muted: #616b76;
  --kl-line: #e3e7eb;
  --kl-side: #1b2230;
  --kl-side-ink: #cfd6e0;
  --kl-radius: 10px;
  --kl-shadow: 0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.08);
}
body { -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-weight: 650; letter-spacing: -.01em; margin: 0 0 .5rem; }
h1 { font-size: 1.4rem; } h2 { font-size: 1.08rem; } h3 { font-size: .98rem; }
code { background: #eef1f4; color: #24292f; padding: .1em .35em; border-radius: 5px; font-size: .875em; }
.muted, small.muted { color: var(--kl-muted) !important; }

/* ───────── каркас: меню збоку, вміст праворуч ─────────
   На ПК колонка фіксована — розділи завжди перед очима й не гортаються разом
   із довгою таблицею. На телефоні та сама колонка стає offcanvas-шухлядою
   Bootstrap: кнопка в шапці, жест закриття, повернення фокуса — усе вже в ній. */
.kl-side {
  background: var(--kl-side); color: var(--kl-side-ink);
  width: 248px; display: flex; flex-direction: column; gap: .25rem; padding: .85rem .7rem;
}
.kl-side .brand { display: flex; align-items: center; gap: .55rem; color: #fff; text-decoration: none; font-weight: 700; padding: .25rem .4rem .75rem; }
.kl-side .brand img { flex: none; width: 30px; height: 30px; display: block; }
.kl-side .brand small { font-size: .62rem; letter-spacing: .09em; text-transform: uppercase; color: #93a1b5; display: block; font-weight: 600; }
/* Увага: .row, .nav і .card у Bootstrap означають своє — сітку, горизонтальне
   меню й flex-колонку. Розмітка проєкту вкладає в ці класи інший зміст, тому
   нижче ми навмисно повертаємо їм наше значення. Без цього .row > * отримує
   width:100% і кнопки стають на всю ширину кожна. */
.nav { flex-direction: column; padding-left: 0; margin-bottom: 0; }
.nav a {
  display: flex; align-items: center; gap: .55rem; padding: .5rem .65rem; margin-bottom: 1px;
  border-radius: 8px; color: var(--kl-side-ink); text-decoration: none; font-weight: 500; font-size: .9rem;
}
.nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
.nav a.on { background: var(--bs-primary); color: #fff; font-weight: 600; }
.who { margin-top: auto; padding-top: .75rem; border-top: 1px solid rgba(255,255,255,.1); display: grid; gap: .45rem; }
.who form { margin: 0; }
.who .u-ava { background: #37415180; color: #fff; border: 0; }
.who .email { font-size: .78rem; color: #93a1b5; overflow-wrap: anywhere; }
.kl-top { display: none; }
main { padding: 1.25rem 1.25rem 3.5rem; max-width: 1280px; }
@media (min-width: 992px) {
  body { padding-left: 248px; }
  .kl-side { position: fixed; inset: 0 auto 0 0; z-index: 1030; overflow-y: auto; }
}
@media (max-width: 991.98px) {
  .kl-top {
    display: flex; align-items: center; gap: .6rem; position: sticky; top: 0; z-index: 1020;
    padding: .5rem .75rem; background: var(--kl-side); color: #fff;
  }
  .kl-top .brand { color: #fff; text-decoration: none; font-weight: 700; display: flex; align-items: center; gap: .5rem; }
  .kl-top .brand img { width: 28px; height: 28px; display: block; }
  .kl-side { width: 272px; }
  main { padding: 1rem .85rem 3rem; }
  /* iOS зумить сторінку, якщо поле дрібніше за 16px */
  input, select, textarea { font-size: 16px !important; }
}

/* ───────── поверхні ───────── */
.card {
  display: block;                       /* а не flex-колонка, як у Bootstrap */
  background: var(--kl-surface); border: 1px solid var(--kl-line); border-radius: var(--kl-radius);
  box-shadow: var(--kl-shadow); padding: 1rem 1.1rem; margin-bottom: 1rem; min-width: 0;
}
.card > h2:first-child, .card > h3:first-child { margin-top: 0; }
.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 330px), 1fr)); align-items: start; }
.cols2 { display: grid; gap: 0 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
fieldset { border: 1px solid var(--kl-line); border-radius: var(--kl-radius); padding: .85rem 1rem .25rem; margin: 0 0 1rem; background: var(--kl-surface); }
legend { font-size: .95rem; font-weight: 650; padding: 0 .4rem; width: auto; float: none; }

/* ───────── плитки з числами ─────────
   Число — головне, тому воно велике й темне; підпис і емодзі навмисно тихі. */
.stats { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fit, minmax(158px, 1fr)); margin-bottom: 1rem; }
.stat {
  position: relative; overflow: hidden; background: var(--kl-surface);
  border: 1px solid var(--kl-line); border-left: 3px solid var(--bs-primary);
  border-radius: var(--kl-radius); box-shadow: var(--kl-shadow); padding: .7rem .85rem;
}
.stat b { display: block; font-size: 1.6rem; font-weight: 700; line-height: 1.15; letter-spacing: -.02em; }
.stat span.lbl, .stat small { display: block; font-size: .8rem; font-weight: 500; color: var(--kl-muted); line-height: 1.3; }
.stat span { position: absolute; right: .6rem; top: .5rem; font-size: 1.05rem; opacity: .35; }
.stat.y { border-left-color: #d4a72c; } .stat.g { border-left-color: #1a7f37; }
.stat.b { border-left-color: #2563eb; } .stat.r { border-left-color: #cf222e; }
.stat.p { border-left-color: #8250df; }

/* ───────── кнопки ─────────
   Одна помітна на екран (.pri), решта тихі. Раніше всі були однаково яскраві,
   тому головну дію доводилося шукати очима. */
.btn {
  --bs-btn-padding-y: .4rem; --bs-btn-padding-x: .75rem; --bs-btn-font-size: .875rem;
  --bs-btn-font-weight: 550; --bs-btn-border-radius: 8px;
  --bs-btn-color: #24292f; --bs-btn-bg: #fff; --bs-btn-border-color: #ccd3da;
  --bs-btn-hover-color: #24292f; --bs-btn-hover-bg: #f3f5f7; --bs-btn-hover-border-color: #b9c2cb;
  --bs-btn-active-bg: #e9edf1; --bs-btn-active-border-color: #b9c2cb; --bs-btn-active-color: #24292f;
  --bs-btn-disabled-bg: #f3f5f7; --bs-btn-disabled-color: #8c959f; --bs-btn-disabled-border-color: #d9dee3;
  display: inline-flex; align-items: center; gap: .35rem; white-space: nowrap;
}
.btn.pri { --bs-btn-color: #fff; --bs-btn-bg: var(--bs-primary); --bs-btn-border-color: var(--bs-primary);
  --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #1d4ed8; --bs-btn-hover-border-color: #1d4ed8;
  --bs-btn-active-bg: #1a45c0; --bs-btn-active-border-color: #1a45c0; --bs-btn-active-color: #fff; }
.btn.ok { --bs-btn-color: #fff; --bs-btn-bg: #1a7f37; --bs-btn-border-color: #1a7f37;
  --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #176b2f; --bs-btn-hover-border-color: #176b2f;
  --bs-btn-active-bg: #145c28; --bs-btn-active-color: #fff; }
.btn.danger { --bs-btn-color: #cf222e; --bs-btn-bg: #fff; --bs-btn-border-color: #f1b8bd;
  --bs-btn-hover-color: #fff; --bs-btn-hover-bg: #cf222e; --bs-btn-hover-border-color: #cf222e;
  --bs-btn-active-bg: #a40e1a; --bs-btn-active-color: #fff; }
.btn.sm { --bs-btn-padding-y: .22rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .8rem; }
.row { display: flex; flex-wrap: wrap; gap: .45rem; align-items: center; margin: 0; --bs-gutter-x: 0; --bs-gutter-y: 0; }
.row > * { width: auto; max-width: none; flex-shrink: 1; padding-left: 0; padding-right: 0; margin-top: 0; }
.row form { margin: 0; }
.row-left { display: flex; flex-wrap: wrap; gap: .45rem; align-items: center; }

/* ───────── поля ───────── */
label.f { display: grid; gap: .25rem; font-weight: 550; font-size: .875rem; margin-bottom: .8rem; }
label.f small { color: var(--kl-muted); font-weight: 400; font-size: .8rem; }
input[type=text], input[type=email], input[type=password], input[type=search], input[type=number], input[type=url], input[type=date], select, textarea {
  width: 100%; font: inherit; padding: .42rem .65rem; color: var(--bs-body-color);
  background: #fff; border: 1px solid #ccd3da; border-radius: 8px;
}
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--bs-primary); box-shadow: 0 0 0 3px rgba(37,99,235,.15); }
.check { display: flex; gap: .5rem; align-items: center; font-weight: 500; margin: .4rem 0 .8rem; }
.check input { width: 1.05rem; height: 1.05rem; accent-color: var(--bs-primary); }
.filters { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; margin-bottom: .9rem; }
.filters input[type=search], .filters select { flex: 0 1 220px; width: auto; }
@media (max-width: 575.98px) { .filters > * { flex: 1 1 100% !important; } }

/* ───────── позначки ─────────
   Тло ледь кольорове, текст насичений: позначку видно, але вона не перетягує
   погляд із самих даних. */
.pill {
  display: inline-block; padding: .08rem .45rem; border: 1px solid transparent; border-radius: 99px;
  font-size: .75rem; font-weight: 600; background: #eef1f4; color: #39414a; white-space: nowrap;
}
.pill.g { background: #e6f5ea; color: #116329; } .pill.r { background: #ffebe9; color: #a40e26; }
.pill.y { background: #fff6dd; color: #7d5a00; } .pill.b { background: #e8f0fe; color: #1a45c0; }
.pill.p { background: #f2ebfd; color: #6639ba; }
.pill.A1 { background: #e6f5ea; color: #116329; } .pill.A2 { background: #e8f0fe; color: #1a45c0; }
.pill.B1 { background: #fff6dd; color: #7d5a00; } .pill.B2 { background: #ffebe9; color: #a40e26; }
.msg { padding: .6rem .85rem; border: 1px solid var(--kl-line); border-left: 3px solid var(--bs-primary); border-radius: 8px; margin-bottom: 1rem; font-weight: 500; background: var(--kl-surface); }
.msg.ok { border-left-color: #1a7f37; background: #f2fbf4; }
.msg.err { border-left-color: #cf222e; background: #fff5f4; }
.msg.warn { border-left-color: #d4a72c; background: #fffdf2; }
.err-box { padding: .6rem .75rem; margin: .6rem 0; background: #fff5f4; border: 1px solid #f1b8bd; border-radius: 8px; overflow-wrap: anywhere; }

/* ───────── таблиці ─────────
   Шапка липне: у списку на сотню рядків без неї не зрозуміти, що в стовпці.
   На телефоні рядок стає карткою — підписи беруться з data-l. */
table.t { width: 100%; border-collapse: separate; border-spacing: 0; font-size: .875rem; }
.card table.t { display: block; overflow: auto; max-height: 72vh; }
.t th {
  position: sticky; top: 0; z-index: 1; text-align: left; white-space: nowrap;
  font-size: .72rem; text-transform: uppercase; letter-spacing: .05em; font-weight: 650; color: var(--kl-muted);
  background: #f7f8fa; padding: .5rem .6rem; border-bottom: 1px solid var(--bs-border-color);
}
.t td { padding: .5rem .6rem; border-bottom: 1px solid var(--kl-line); vertical-align: middle; }
.t tbody tr:hover td { background: #f7f9fb; }
.t td .muted, .t td small { white-space: normal; }
.u-name { display: flex; align-items: center; gap: .6rem; }
.u-ava { flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: #e8f0fe; color: #1a45c0; font-weight: 700; font-size: .85rem; }
.u-name b { display: block; font-weight: 600; } .u-name small { color: var(--kl-muted); word-break: break-all; }
.pager { display: flex; gap: .5rem; justify-content: center; margin-top: 1rem; }

/* ───────── списки, чипси, решта ───────── */
.chips { display: flex; flex-wrap: wrap; gap: .35rem; }
.chips a { padding: .25rem .65rem; border: 1px solid #ccd3da; border-radius: 99px; color: #39414a; text-decoration: none; font-weight: 550; font-size: .82rem; background: #fff; }
.chips a:hover { background: #f3f5f7; }
.chips a.on { background: var(--bs-primary); border-color: var(--bs-primary); color: #fff; }
.list { display: grid; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.list li { display: flex; gap: .6rem; align-items: center; justify-content: space-between; padding: .5rem .7rem; border: 1px solid var(--kl-line); border-radius: 8px; background: #fbfcfd; }
.list li > div { min-width: 0; }
.kv { display: grid; grid-template-columns: max-content 1fr; gap: .35rem .9rem; margin: 0; font-size: .9rem; }
.kv dt { color: var(--kl-muted); font-weight: 550; } .kv dd { margin: 0; word-break: break-word; }
.req { display: grid; gap: .35rem; margin: 0 0 1rem; padding: 0; list-style: none; }
.req li { display: flex; justify-content: space-between; gap: .6rem; padding: .4rem .7rem; border: 1px solid var(--kl-line); border-radius: 8px; background: #fbfcfd; }
.diag { list-style: none; padding: 0; margin: 0; }
.diag li { display: flex; gap: .6rem; align-items: flex-start; padding: .55rem .7rem; border: 1px solid var(--kl-line); border-left: 3px solid var(--kl-line); border-radius: 8px; margin-bottom: .35rem; background: #fbfcfd; }
.diag li.d-ok { border-left-color: #1a7f37; } .diag li.d-warn { border-left-color: #d4a72c; background: #fffdf2; } .diag li.d-bad { border-left-color: #cf222e; background: #fff5f4; }
.diag .d-ic { flex: none; line-height: 1.4; }
.diag small { font-weight: 400; color: var(--kl-muted); }
.fb-img { max-width: min(320px, 100%); height: auto; border: 1px solid var(--kl-line); border-radius: 8px; margin: .4rem 0; display: block; }
.fb-text { background: #fbfcfd; border: 1px solid var(--kl-line); border-radius: 8px; padding: .5rem .7rem; margin: .4rem 0; white-space: pre-wrap; }
.bars { display: flex; align-items: flex-end; gap: 2px; height: 120px; padding-top: .5rem; }
.bars i { flex: 1; min-width: 3px; background: var(--bs-primary); border-radius: 3px 3px 0 0; position: relative; opacity: .85; }
.bars i:hover { opacity: 1; }
.bars i:hover::after { content: attr(data-t); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: #1f2328; color: #fff; font-size: .75rem; padding: .15rem .4rem; border-radius: 6px; white-space: nowrap; z-index: 2; }
.bars-x { display: flex; justify-content: space-between; color: var(--kl-muted); font-size: .75rem; border-top: 1px solid var(--bs-border-color); padding-top: .2rem; }
.cat { margin-bottom: 1.4rem; }
.cat h2 { display: flex; align-items: center; gap: .5rem; }
.comics { display: grid; gap: .75rem; grid-template-columns: repeat(auto-fill, minmax(min(100%, 232px), 1fr)); }
.comic { display: grid; gap: .2rem; padding: 0 0 .7rem; background: var(--kl-surface); border: 1px solid var(--kl-line); border-radius: var(--kl-radius); box-shadow: var(--kl-shadow); overflow: hidden; }
.comic > :not(.comic-cover) { margin-left: .7rem; margin-right: .7rem; }
.comic b { font-weight: 600; font-size: .92rem; }
.comic small { color: var(--kl-muted); font-size: .78rem; }
/* Обкладинка — найшвидший спосіб упізнати комікс: назв 81, а картинки різні. */
.comic-cover { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #eef1f4; border-bottom: 1px solid var(--kl-line); margin: 0 0 .5rem; }
.comic .row { margin-top: .3rem; }
.mail-list { max-height: 60vh; overflow-y: auto; }
.mail-row { display: grid; grid-template-columns: auto 1fr auto; gap: .6rem; align-items: center; cursor: pointer; width: 100%; }
.mail-row input { width: 1.05rem; height: 1.05rem; accent-color: var(--bs-primary); }
.mail-meta { text-align: right; white-space: nowrap; font-size: .8rem; color: var(--kl-muted); }
.mail-count { margin-left: auto; align-self: center; font-size: .875rem; }
.mail-count.none { color: #cf222e; }
@media (max-width: 620px) { .mail-row { grid-template-columns: auto 1fr; } .mail-meta { grid-column: 2; text-align: left; } }
.auth-wrap { min-height: 100vh; display: grid; place-items: center; padding: 1.25rem .85rem; background: #f4f5f7; }
.auth { width: min(460px, 100%); }
.auth .card { padding: 1.5rem; }
.auth .brand { display: flex; align-items: center; justify-content: center; gap: .5rem; margin-bottom: 1rem; font-weight: 700; color: var(--bs-body-color); text-decoration: none; }
.auth .brand img { width: 32px; height: 32px; display: block; }

@media (max-width: 767.98px) {
  h1 { font-size: 1.22rem; }
  .card { padding: .8rem .85rem; }
  .stats { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .6rem; }
  .stat b { font-size: 1.35rem; }
  .list li { flex-direction: column; align-items: stretch; gap: .5rem; }
  .row .btn { min-height: 38px; }
  .kv { grid-template-columns: 1fr; } .kv dt { margin-top: .35rem; }
  /* Рядок таблиці стає карткою: стовпців буває сім, а екран один. */
  .card table.t { max-height: none; }
  .t thead { display: none; }
  .t, .t tbody, .t tr, .t td { display: block; width: 100%; }
  .t tr { border: 1px solid var(--kl-line); border-radius: var(--kl-radius); margin-bottom: .6rem; background: #fff; padding: .25rem 0; }
  .t td { border: 0; padding: .3rem .7rem; }
  .t td[data-l]::before { content: attr(data-l) ': '; color: var(--kl-muted); font-weight: 600; font-size: .78rem; }
  .btn { white-space: normal; text-align: left; }
}
</style></head><body>
<?php if ($nav): ?>
<?php
  /* Меню малюємо один раз і вставляємо у два місця: колонкою на ПК і в offcanvas
     на телефоні. Два окремі списки розійшлися б при першій же новій сторінці. */
  $side = function () use ($nav, $active, $me) { ?>
    <a class="brand" href="admin.php"><img src="img/logo.svg" alt="" width="30" height="30"><span>Komiks·Lab<small>адмін-панель</small></span></a>
    <nav class="nav"><?php foreach ($nav as $k => $label): ?><a href="admin.php?p=<?= e($k) ?>" class="<?= $k === $active ? 'on' : '' ?>"><?= e($label) ?></a><?php endforeach; ?></nav>
    <?php if ($me): ?><div class="who">
      <div class="d-flex align-items-center gap-2"><span class="u-ava"><?= e(mb_first($me['name'])) ?></span><span class="email"><?= e($me['email']) ?></span></div>
      <a class="btn sm" href="./" target="_blank" rel="noopener">↗ Відкрити сайт</a>
      <form method="post" action="admin.php?p=logout"><input type="hidden" name="csrf" value="<?= e(admin_csrf()) ?>"><button class="btn sm w-100">Вийти</button></form>
    </div><?php endif;
  };
?>
<header class="kl-top">
  <button class="btn sm" type="button" data-bs-toggle="offcanvas" data-bs-target="#klNav" aria-controls="klNav" aria-label="Розділи">☰</button>
  <a class="brand" href="admin.php"><img src="img/logo.svg" alt="" width="28" height="28"> Komiks·Lab</a>
</header>
<aside class="kl-side d-none d-lg-flex"><?php $side(); ?></aside>
<div class="offcanvas offcanvas-start kl-side d-lg-none" tabindex="-1" id="klNav" aria-label="Розділи адмін-панелі"><?php $side(); ?></div>
<main>
<?php endif;
}
function page_close(string $nonce, bool $wrapped = true): void {
  if ($wrapped) echo "</main>\n";
  /* Bootstrap потрібен лише для шухляди з розділами на телефоні, тому вантажимо
     його останнім і з defer — сторінка читається, не чекаючи на скрипт. */
  echo '<script nonce="' . e($nonce) . '" src="assets/vendor/bootstrap.bundle.min.js" defer></script>';
  // підтвердження небезпечних дій: <form data-confirm="…">
  echo '<script nonce="' . e($nonce) . '">document.addEventListener("submit",function(ev){var m=ev.target.getAttribute("data-confirm");if(m&&!confirm(m))ev.preventDefault();});</script>';
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
