import json
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


def generate_report(root):
    root = Path(root).resolve()
    reports = root / "reports"
    audit = json.loads((reports / "image-audit.json").read_text(encoding="utf-8"))
    queue = json.loads((reports / "image-generation-queue.json").read_text(encoding="utf-8"))
    entries = audit.get("entries", [])
    items = queue.get("items", [])
    statuses = Counter(item.get("status", "unknown") for item in items)
    entry_statuses = Counter(item.get("status", "unknown") for item in entries)
    remaining = [item for item in entries if item.get("needsGeneration")]
    themes = audit.get("themes", [])
    category_count = themes if isinstance(themes, int) else len(themes)
    validation = audit.get("validationSummary", {})
    export_summary_path = root / "exports" / "export-summary.json"
    export_summary = json.loads(export_summary_path.read_text(encoding="utf-8")) if export_summary_path.exists() else {}
    index_path = root / "data" / "index.js"
    mapping_connected = index_path.exists() and "data/word-images-generated.js" in index_path.read_text(encoding="utf-8")

    lines = [
        "# Komiks·LAB — звіт генерації зображень",
        "",
        f"Оновлено: {datetime.now(timezone.utc).isoformat()}",
        "",
        "Цей звіт формується з фактичного аудиту файлів і відновлюваної черги. Статус не вважається успішним, доки PNG не існує та не пройшов піксельну перевірку.",
        "",
        "## Підсумок",
        "",
        "| Показник | Кількість |",
        "|---|---:|",
        f"| Усього словникових записів | {len(entries)} |",
        f"| Категорій | {category_count} |",
        f"| Валідних растрових посилань | {validation.get('validRaster', 0)} |",
        f"| Чинних inline SVG | {validation.get('inlineSvg', 0)} |",
        f"| Нових унікальних PNG | {statuses.get('generated', 0)} |",
        f"| Словникових записів, підключених до нових PNG | {entry_statuses.get('generated', 0)} |",
        f"| Залишилося відсутніх або непридатних записів | {len(remaining)} |",
        f"| Помилок генерації у черзі | {statuses.get('failed', 0)} |",
        f"| Дублікатів посилань | {validation.get('duplicates', 0)} |",
        f"| PNG у поточних ZIP-архівах | {export_summary.get('images', 0)} |",
        "",
        "## Інтеграція та перевірки",
        "",
        f"- Мапінг `data/word-images-generated.js` підключено до `data/index.js`: {'так' if mapping_connected else 'ні'}.",
        f"- Піксельна перевірка: {validation.get('validRaster', 0)} валідних растрових ресурсів; {validation.get('missingOrInvalid', len(remaining))} записів ще потребують генерації.",
        f"- Черга: {statuses.get('generated', 0)} готово, {statuses.get('pending', 0)} очікує, {statuses.get('failed', 0)} помилок.",
        f"- ZIP-експорт: {export_summary.get('categories', 0)} категорій, {export_summary.get('images', 0)} PNG, {len(export_summary.get('missingFiles', []))} відсутніх файлів під час пакування.",
        "- Перевірки карток і тестів у браузері: очікують завершення повного набору PNG.",
        "",
        "## Проблемні слова",
        "",
    ]
    if remaining:
        lines.extend(["| ID | Категорія | Норвезьке слово | Український переклад | Статус |", "|---|---|---|---|---|"])
        for item in remaining:
            values = [
                item.get("id", ""), item.get("category", ""), item.get("norwegian", ""),
                item.get("ukrainian", ""), item.get("status", "")
            ]
            values = [str(value).replace("|", "\\|").replace("\n", " ") for value in values]
            lines.append("| " + " | ".join(values) + " |")
    else:
        lines.append("Немає: усі записи, яким потрібні картинки, мають валідні PNG.")
    lines.extend([
        "", "## Команди відтворення", "",
        "```powershell",
        "node tools/audit-word-images.cjs C:\\comiks",
        "python tools/validate_word_images.py C:\\comiks",
        "node tools/build-word-image-queue.cjs C:\\comiks",
        "python tools/export_word_images.py C:\\comiks",
        "python tools/generate_image_report.py C:\\comiks",
        "```", ""
    ])
    output = reports / "image-generation-report.md"
    output.write_text("\n".join(lines), encoding="utf-8")
    return output


if __name__ == "__main__":
    project_root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    print(generate_report(project_root))
