# photo/ — кадри для фото-коміксів

Звичайні комікси малює `assets/art.js`. Кадр із полем `art.photo` натомість бере
світлину з цієї теки: `panels[i].art.photo = 'p164-1.jpg'` → `photo/p164-1.jpg`.
Хмаринки з норвезьким текстом, переклад при наведенні й озвучення працюють так само.

**Формат:** JPEG, 4:3, від 1200×900, до ~300 КБ. Кадр обрізається по центру
(`preserveAspectRatio="xMidYMid slice"`), тож важливе тримайте в центрі, а нижні
20 % лишайте спокійними — там лягає текст.

**Де в кадрі обличчя.** У `art.chars` вказуються не персонажі, а точки
`{ id, x, y }` у координатах 400×300 — від них тягнеться хвостик хмаринки.
Підженіть `x`/`y` під конкретне фото.

## p164 «En dag i Oslo» — 6 кадрів

Кадри вже справжні — згенеровані за промтами нижче (1200×900, JPEG).
Промти лишаємо, щоб можна було перегенерувати кадр або зробити такий самий
комікс про інше місто. Якщо міняєте фото — підженіть `art.chars` у
`data/comic-164-en-dag-i-oslo.js`: це точки облич, від них іде хвостик хмаринки.

| файл | промт |
|---|---|
| `p164-1.jpg` | Photorealistic 4:3 photo: a covered bus stop in Oslo on an overcast morning, a lit digital departure board showing bus numbers and minutes, a woman in her thirties and a man in his thirties standing under the shelter looking at the board, wet asphalt, natural daylight, documentary street photography, no text overlay. |
| `p164-2.jpg` | Photorealistic 4:3 photo: a narrow Oslo shopping street with brick and pastel facades, a small shop window with a printed opening-hours sign reading "ÅPENT 09–20", two people reading the sign from the pavement, soft cloudy light, documentary street photography. |
| `p164-3.jpg` | Photorealistic 4:3 photo: a Norwegian grocery store dairy aisle, milk cartons on a shelf with yellow price tags, a man holding a carton and a woman beside him, bright supermarket lighting, shallow depth of field, realistic retail interior. |
| `p164-4.jpg` | Photorealistic 4:3 photo: a cosy Scandinavian café counter with a cup of filter coffee and a cinnamon bun on a wooden tray, a card terminal on the counter, two customers at the counter from behind, warm window light, food-documentary style. |
| `p164-5.jpg` | Photorealistic 4:3 photo: a wooden park bench under tall green trees in a Norwegian city park in late summer, two people sitting and talking, dappled sunlight, calm empty path behind, natural colours. |
| `p164-6.jpg` | Photorealistic 4:3 photo: the Oslo fjord at sunset, calm water, low orange sun, dark islands on the horizon, two people in silhouette on a wooden pier looking at the water, golden hour, no text. |

Порада: тримайте один стиль на всі шість кадрів (одна пора року, однакове світло,
ті самі двоє людей) — інакше історія розсипається.
