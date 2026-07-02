import os
from pathlib import Path

# ==============================
# CONFIGURATION
# ==============================

ROOT_DIR = r"C:\Users\DELL\Downloads\ACR"   # Change this
OUTPUT_FILE = "project_dump.md"

# Maximum file size (5 MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

# Directories to ignore
IGNORE_DIRS = {
    ".git",
    ".idea",
    ".vscode",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".turbo",
    ".cache",
    ".venv",
    "venv",
    "target",
    "bin",
    "obj"
}

# File extensions to include
ALLOWED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".java",
    ".cpp",
    ".c",
    ".cs",
    ".go",
    ".rs",
    ".php",
    ".rb",
    ".swift",
    ".kt",
    ".kts",
    ".scala",

    ".html",
    ".css",
    ".scss",
    ".sass",

    ".json",
    ".yaml",
    ".yml",
    ".xml",
    ".toml",
    ".ini",
    ".env",

    ".md",
    ".txt",

    ".sql",
    ".sh",
    ".bat",
    ".ps1",

    "Dockerfile",
    ".dockerignore"
}

# ==============================
# Helpers
# ==============================

LANGUAGE_MAP = {
    ".py": "python",
    ".js": "javascript",
    ".jsx": "jsx",
    ".ts": "typescript",
    ".tsx": "tsx",
    ".java": "java",
    ".cpp": "cpp",
    ".c": "c",
    ".cs": "csharp",
    ".go": "go",
    ".rs": "rust",
    ".php": "php",
    ".rb": "ruby",
    ".swift": "swift",
    ".kt": "kotlin",
    ".kts": "kotlin",
    ".scala": "scala",

    ".html": "html",
    ".css": "css",
    ".scss": "scss",
    ".sass": "sass",

    ".json": "json",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".xml": "xml",
    ".toml": "toml",
    ".ini": "ini",

    ".sql": "sql",
    ".sh": "bash",
    ".bat": "bat",
    ".ps1": "powershell",

    ".md": "markdown",
    ".txt": "text"
}


def get_language(file_path):
    name = Path(file_path).name

    if name == "Dockerfile":
        return "dockerfile"

    ext = Path(file_path).suffix.lower()

    return LANGUAGE_MAP.get(ext, "text")


def should_include(file_path):
    name = Path(file_path).name
    ext = Path(file_path).suffix.lower()

    if name == "Dockerfile":
        return True

    return ext in ALLOWED_EXTENSIONS


def safe_read(file_path):
    encodings = [
        "utf-8",
        "utf-8-sig",
        "latin-1",
        "cp1252"
    ]

    for enc in encodings:
        try:
            with open(file_path, "r", encoding=enc) as f:
                return f.read()
        except:
            pass

    return "⚠ Unable to read file."


# ==============================
# Main
# ==============================

with open(OUTPUT_FILE, "w", encoding="utf-8") as md:

    md.write("# Project Code Dump\n\n")
    md.write(f"Root Directory: `{ROOT_DIR}`\n\n")
    md.write("---\n\n")

    total_files = 0

    for root, dirs, files in os.walk(ROOT_DIR):

        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in sorted(files):

            file_path = os.path.join(root, file)

            if not should_include(file_path):
                continue

            try:
                if os.path.getsize(file_path) > MAX_FILE_SIZE:
                    print("Skipping (Large):", file_path)
                    continue
            except:
                continue

            rel_path = os.path.relpath(file_path, ROOT_DIR)

            print("Processing:", rel_path)

            language = get_language(file_path)
            content = safe_read(file_path)

            md.write(f"## 📄 {file}\n\n")
            md.write(f"**Relative Path:** `{rel_path}`\n\n")
            md.write(f"**Absolute Path:** `{file_path}`\n\n")

            md.write(f"```{language}\n")
            md.write(content)
            md.write("\n```\n\n")
            md.write("---\n\n")

            total_files += 1

print(f"\nFinished! {total_files} files exported.")
print(f"Output: {OUTPUT_FILE}")