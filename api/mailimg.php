<?php
/* 🖼 Фото в листах розсилки: віддає збережене зображення за випадковою назвою.
   Файли лежать у api/data/mailimg (каталог закрито .htaccess) — тут лише читання за суворим шаблоном,
   без бази й без lib.php. Назва — 32 випадкові hex-символи, тож перебрати чужі картинки не вийде. */
declare(strict_types=1);
$f = (string)($_GET['f'] ?? '');
if (!preg_match('/^[a-f0-9]{32}\.(png|jpg)$/', $f, $m) || !is_file($path = __DIR__ . '/data/mailimg/' . $f)) { http_response_code(404); exit; }
header('Content-Type: ' . ($m[1] === 'png' ? 'image/png' : 'image/jpeg'));
header('Content-Length: ' . filesize($path));
header('Cache-Control: public, max-age=31536000, immutable');
header('X-Content-Type-Options: nosniff');
header("Content-Security-Policy: default-src 'none'; sandbox");
readfile($path);
