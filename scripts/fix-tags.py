import pathlib

# Erroneous JSX tags accidentally introduced (not framer-motion).
wrong_close = "</" + "mo" + "tion.div>"
right_close = "</div>"
wrong_open = "<" + "mo" + "tion.div"
right_open = "<div"

root = pathlib.Path(__file__).resolve().parents[1]
for path in root.rglob("*.tsx"):
    text = path.read_text(encoding="utf-8")
    fixed = text.replace(wrong_close, right_close).replace(wrong_open, right_open)
    if fixed != text:
        path.write_text(fixed, encoding="utf-8")
        print("fixed", path.relative_to(root))
