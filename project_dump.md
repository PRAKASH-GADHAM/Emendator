# Project Code Dump

Root Directory: `C:\Users\DELL\Downloads\ACR`

---

## 📄 README.md

**Relative Path:** `README.md`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\README.md`

```markdown

```

---

## 📄 cre.py

**Relative Path:** `cre.py`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\cre.py`

```python
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
```

---

## 📄 docker-compose.yml

**Relative Path:** `docker-compose.yml`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: code_reviewer_db
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-codereviewer}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-securepassword123}
      POSTGRES_DB: ${POSTGRES_DB:-codereviewer}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-codereviewer}" ]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: code_reviewer_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-codereviewer}:${POSTGRES_PASSWORD:-securepassword123}@postgres:5432/${POSTGRES_DB:-codereviewer}
      JWT_SECRET: ${JWT_SECRET:-change-this-jwt-secret-in-production}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET:-change-this-refresh-secret-in-production}
      OLLAMA_MODEL: ${OLLAMA_MODEL:-deepseek-coder:6.7b}
      OLLAMA_BASE_URL: ${OLLAMA_BASE_URL:-http://host.docker.internal:11434/v1}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-631600119621-kctn3pv9i0tlevcj0vrrfhm7bfkdlo4p.apps.googleusercontent.com}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:-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}
      GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID:-Ov23likq8Qcsx8P7oMja}
      GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET:-95ec68111c25061bcaaffb684dd37f6803001e3b}
      PORT: 5000
      NODE_ENV: ${NODE_ENV:-production}
      FRONTEND_URL: ${FRONTEND_URL:-http://localhost:5173}
    ports:
      - "5000:5000"
    volumes:
      - ./backend/logs:/app/logs
    networks:
      - app_network
    extra_hosts:
      - "host.docker.internal:host-gateway"

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: code_reviewer_frontend
    restart: unless-stopped
    depends_on:
      - backend
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:5000}
    ports:
      - "5173:80"
    networks:
      - app_network

volumes:
  postgres_data:
    driver: local

networks:
  app_network:
    driver: bridge

```

---

## 📄 project_dump.md

**Relative Path:** `project_dump.md`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\project_dump.md`

```markdown

```

---

## 📄 requirements.txt

**Relative Path:** `requirements.txt`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\requirements.txt`

```text
openai>=1.0.0
python-dotenv>=1.0.0
fastapi>=0.104.0
uvicorn>=0.24.0
httpx>=0.25.0
pydantic>=2.0.0
```

---

## 📄 Dockerfile

**Relative Path:** `backend\Dockerfile`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]

```

---

## 📄 package-lock.json

**Relative Path:** `backend\package-lock.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\package-lock.json`

```json
{
    "name": "ai-code-reviewer-backend",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
        "": {
            "name": "ai-code-reviewer-backend",
            "version": "1.0.0",
            "dependencies": {
                "@prisma/client": "^5.7.0",
                "axios": "^1.6.8",
                "bcryptjs": "^2.4.3",
                "cookie-parser": "^1.4.6",
                "cors": "^2.8.5",
                "dotenv": "^16.3.1",
                "express": "^4.18.2",
                "express-rate-limit": "^7.1.5",
                "express-validator": "^7.0.1",
                "helmet": "^7.1.0",
                "jsonwebtoken": "^9.0.2",
                "morgan": "^1.10.0",
                "openai": "^4.20.1",
                "winston": "^3.11.0",
                "winston-daily-rotate-file": "^4.7.1"
            },
            "devDependencies": {
                "nodemon": "^3.0.2",
                "prisma": "^5.7.0"
            },
            "engines": {
                "node": ">=18.0.0"
            }
        },
        "node_modules/@colors/colors": {
            "version": "1.6.0",
            "resolved": "https://registry.npmjs.org/@colors/colors/-/colors-1.6.0.tgz",
            "integrity": "sha512-Ir+AOibqzrIsL6ajt3Rz3LskB7OiMVHqltZmspbW/TJuTVuyOMirVqAkjfY6JISiLHgyNqicAC8AyHHGzNd/dA==",
            "license": "MIT",
            "engines": {
                "node": ">=0.1.90"
            }
        },
        "node_modules/@dabh/diagnostics": {
            "version": "2.0.8",
            "resolved": "https://registry.npmjs.org/@dabh/diagnostics/-/diagnostics-2.0.8.tgz",
            "integrity": "sha512-R4MSXTVnuMzGD7bzHdW2ZhhdPC/igELENcq5IjEverBvq5hn1SXCWcsi6eSsdWP0/Ur+SItRRjAktmdoX/8R/Q==",
            "license": "MIT",
            "dependencies": {
                "@so-ric/colorspace": "^1.1.6",
                "enabled": "2.0.x",
                "kuler": "^2.0.0"
            }
        },
        "node_modules/@prisma/client": {
            "version": "5.22.0",
            "resolved": "https://registry.npmjs.org/@prisma/client/-/client-5.22.0.tgz",
            "integrity": "sha512-M0SVXfyHnQREBKxCgyo7sffrKttwE6R8PMq330MIUF0pTwjUhLbW84pFDlf06B27XyCR++VtjugEnIHdr07SVA==",
            "hasInstallScript": true,
            "license": "Apache-2.0",
            "engines": {
                "node": ">=16.13"
            },
            "peerDependencies": {
                "prisma": "*"
            },
            "peerDependenciesMeta": {
                "prisma": {
                    "optional": true
                }
            }
        },
        "node_modules/@prisma/debug": {
            "version": "5.22.0",
            "resolved": "https://registry.npmjs.org/@prisma/debug/-/debug-5.22.0.tgz",
            "integrity": "sha512-AUt44v3YJeggO2ZU5BkXI7M4hu9BF2zzH2iF2V5pyXT/lRTyWiElZ7It+bRH1EshoMRxHgpYg4VB6rCM+mG5jQ==",
            "devOptional": true,
            "license": "Apache-2.0"
        },
        "node_modules/@prisma/engines": {
            "version": "5.22.0",
            "resolved": "https://registry.npmjs.org/@prisma/engines/-/engines-5.22.0.tgz",
            "integrity": "sha512-UNjfslWhAt06kVL3CjkuYpHAWSO6L4kDCVPegV6itt7nD1kSJavd3vhgAEhjglLJJKEdJ7oIqDJ+yHk6qO8gPA==",
            "devOptional": true,
            "hasInstallScript": true,
            "license": "Apache-2.0",
            "dependencies": {
                "@prisma/debug": "5.22.0",
                "@prisma/engines-version": "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2",
                "@prisma/fetch-engine": "5.22.0",
                "@prisma/get-platform": "5.22.0"
            }
        },
        "node_modules/@prisma/engines-version": {
            "version": "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2",
            "resolved": "https://registry.npmjs.org/@prisma/engines-version/-/engines-version-5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2.tgz",
            "integrity": "sha512-2PTmxFR2yHW/eB3uqWtcgRcgAbG1rwG9ZriSvQw+nnb7c4uCr3RAcGMb6/zfE88SKlC1Nj2ziUvc96Z379mHgQ==",
            "devOptional": true,
            "license": "Apache-2.0"
        },
        "node_modules/@prisma/fetch-engine": {
            "version": "5.22.0",
            "resolved": "https://registry.npmjs.org/@prisma/fetch-engine/-/fetch-engine-5.22.0.tgz",
            "integrity": "sha512-bkrD/Mc2fSvkQBV5EpoFcZ87AvOgDxbG99488a5cexp5Ccny+UM6MAe/UFkUC0wLYD9+9befNOqGiIJhhq+HbA==",
            "devOptional": true,
            "license": "Apache-2.0",
            "dependencies": {
                "@prisma/debug": "5.22.0",
                "@prisma/engines-version": "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2",
                "@prisma/get-platform": "5.22.0"
            }
        },
        "node_modules/@prisma/get-platform": {
            "version": "5.22.0",
            "resolved": "https://registry.npmjs.org/@prisma/get-platform/-/get-platform-5.22.0.tgz",
            "integrity": "sha512-pHhpQdr1UPFpt+zFfnPazhulaZYCUqeIcPpJViYoq9R+D/yw4fjE+CtnsnKzPYm0ddUbeXUzjGVGIRVgPDCk4Q==",
            "devOptional": true,
            "license": "Apache-2.0",
            "dependencies": {
                "@prisma/debug": "5.22.0"
            }
        },
        "node_modules/@so-ric/colorspace": {
            "version": "1.1.6",
            "resolved": "https://registry.npmjs.org/@so-ric/colorspace/-/colorspace-1.1.6.tgz",
            "integrity": "sha512-/KiKkpHNOBgkFJwu9sh48LkHSMYGyuTcSFK/qMBdnOAlrRJzRSXAOFB5qwzaVQuDl8wAvHVMkaASQDReTahxuw==",
            "license": "MIT",
            "dependencies": {
                "color": "^5.0.2",
                "text-hex": "1.0.x"
            }
        },
        "node_modules/@types/node": {
            "version": "18.19.130",
            "resolved": "https://registry.npmjs.org/@types/node/-/node-18.19.130.tgz",
            "integrity": "sha512-GRaXQx6jGfL8sKfaIDD6OupbIHBr9jv7Jnaml9tB7l4v068PAOXqfcujMMo5PhbIs6ggR1XODELqahT2R8v0fg==",
            "license": "MIT",
            "dependencies": {
                "undici-types": "~5.26.4"
            }
        },
        "node_modules/@types/node-fetch": {
            "version": "2.6.13",
            "resolved": "https://registry.npmjs.org/@types/node-fetch/-/node-fetch-2.6.13.tgz",
            "integrity": "sha512-QGpRVpzSaUs30JBSGPjOg4Uveu384erbHBoT1zeONvyCfwQxIkUshLAOqN/k9EjGviPRmWTTe6aH2qySWKTVSw==",
            "license": "MIT",
            "dependencies": {
                "@types/node": "*",
                "form-data": "^4.0.4"
            }
        },
        "node_modules/@types/triple-beam": {
            "version": "1.3.5",
            "resolved": "https://registry.npmjs.org/@types/triple-beam/-/triple-beam-1.3.5.tgz",
            "integrity": "sha512-6WaYesThRMCl19iryMYP7/x2OVgCtbIVflDGFpWnb9irXI3UjYE4AzmYuiUKY1AJstGijoY+MgUszMgRxIYTYw==",
            "license": "MIT"
        },
        "node_modules/abort-controller": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/abort-controller/-/abort-controller-3.0.0.tgz",
            "integrity": "sha512-h8lQ8tacZYnR3vNQTgibj+tODHI5/+l06Au2Pcriv/Gmet0eaj4TwWH41sO9wnHDiQsEj19q0drzdWdeAHtweg==",
            "license": "MIT",
            "dependencies": {
                "event-target-shim": "^5.0.0"
            },
            "engines": {
                "node": ">=6.5"
            }
        },
        "node_modules/accepts": {
            "version": "1.3.8",
            "resolved": "https://registry.npmjs.org/accepts/-/accepts-1.3.8.tgz",
            "integrity": "sha512-PYAthTa2m2VKxuvSD3DPC/Gy+U+sOA1LAuT8mkmRuvw+NACSaeXEQ+NHcVF7rONl6qcaxV3Uuemwawk+7+SJLw==",
            "license": "MIT",
            "dependencies": {
                "mime-types": "~2.1.34",
                "negotiator": "0.6.3"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/agent-base": {
            "version": "6.0.2",
            "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
            "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
            "license": "MIT",
            "dependencies": {
                "debug": "4"
            },
            "engines": {
                "node": ">= 6.0.0"
            }
        },
        "node_modules/agent-base/node_modules/debug": {
            "version": "4.4.3",
            "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
            "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
            "license": "MIT",
            "dependencies": {
                "ms": "^2.1.3"
            },
            "engines": {
                "node": ">=6.0"
            },
            "peerDependenciesMeta": {
                "supports-color": {
                    "optional": true
                }
            }
        },
        "node_modules/agent-base/node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/agentkeepalive": {
            "version": "4.6.0",
            "resolved": "https://registry.npmjs.org/agentkeepalive/-/agentkeepalive-4.6.0.tgz",
            "integrity": "sha512-kja8j7PjmncONqaTsB8fQ+wE2mSU2DJ9D4XKoJ5PFWIdRMa6SLSN1ff4mOr4jCbfRSsxR4keIiySJU0N9T5hIQ==",
            "license": "MIT",
            "dependencies": {
                "humanize-ms": "^1.2.1"
            },
            "engines": {
                "node": ">= 8.0.0"
            }
        },
        "node_modules/anymatch": {
            "version": "3.1.3",
            "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
            "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "normalize-path": "^3.0.0",
                "picomatch": "^2.0.4"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/array-flatten": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/array-flatten/-/array-flatten-1.1.1.tgz",
            "integrity": "sha512-PCVAQswWemu6UdxsDFFX/+gVeYqKAod3D3UVm91jHwynguOwAvYPhx8nNlM++NqRcK6CxxpUafjmhIdKiHibqg==",
            "license": "MIT"
        },
        "node_modules/async": {
            "version": "3.2.6",
            "resolved": "https://registry.npmjs.org/async/-/async-3.2.6.tgz",
            "integrity": "sha512-htCUDlxyyCLMgaM3xXg0C0LW2xqfuQ6p05pCEIsXuyQ+a1koYKTuBMzRNwmybfLgvJDMd0r1LTn4+E0Ti6C2AA==",
            "license": "MIT"
        },
        "node_modules/asynckit": {
            "version": "0.4.0",
            "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
            "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
            "license": "MIT"
        },
        "node_modules/axios": {
            "version": "1.17.0",
            "resolved": "https://registry.npmjs.org/axios/-/axios-1.17.0.tgz",
            "integrity": "sha512-J8SwNxprqqpbfenehxWYXE7CW+wM1BB4w3+N+g+/Wx40xM4rsLrfPmHHxSWIxJLYDgSY/HqlFPIYb2/S3rxafw==",
            "license": "MIT",
            "dependencies": {
                "follow-redirects": "^1.16.0",
                "form-data": "^4.0.5",
                "https-proxy-agent": "^5.0.1",
                "proxy-from-env": "^2.1.0"
            }
        },
        "node_modules/balanced-match": {
            "version": "4.0.4",
            "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
            "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": "18 || 20 || >=22"
            }
        },
        "node_modules/basic-auth": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/basic-auth/-/basic-auth-2.0.1.tgz",
            "integrity": "sha512-NF+epuEdnUYVlGuhaxbbq+dvJttwLnGY+YixlXlME5KpQ5W3CnXA5cVTneY3SPbPDRkcjMbifrwmFYcClgOZeg==",
            "license": "MIT",
            "dependencies": {
                "safe-buffer": "5.1.2"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/basic-auth/node_modules/safe-buffer": {
            "version": "5.1.2",
            "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.2.tgz",
            "integrity": "sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==",
            "license": "MIT"
        },
        "node_modules/bcryptjs": {
            "version": "2.4.3",
            "resolved": "https://registry.npmjs.org/bcryptjs/-/bcryptjs-2.4.3.tgz",
            "integrity": "sha512-V/Hy/X9Vt7f3BbPJEi8BdVFMByHi+jNXrYkW3huaybV/kQ0KJg0Y6PkEMbn+zeT+i+SiKZ/HMqJGIIt4LZDqNQ==",
            "license": "MIT"
        },
        "node_modules/binary-extensions": {
            "version": "2.3.0",
            "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
            "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/body-parser": {
            "version": "1.20.5",
            "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-1.20.5.tgz",
            "integrity": "sha512-3grm+/2tUOvu2cjJkvsIxrv/wVpfXQW4PsQHYm7yk4vfpu7Ekl6nEsYBoJUL6qDwZUx8wUhQ8tR2qz+ad9c9OA==",
            "license": "MIT",
            "dependencies": {
                "bytes": "~3.1.2",
                "content-type": "~1.0.5",
                "debug": "2.6.9",
                "depd": "2.0.0",
                "destroy": "~1.2.0",
                "http-errors": "~2.0.1",
                "iconv-lite": "~0.4.24",
                "on-finished": "~2.4.1",
                "qs": "~6.15.1",
                "raw-body": "~2.5.3",
                "type-is": "~1.6.18",
                "unpipe": "~1.0.0"
            },
            "engines": {
                "node": ">= 0.8",
                "npm": "1.2.8000 || >= 1.4.16"
            }
        },
        "node_modules/brace-expansion": {
            "version": "5.0.6",
            "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.6.tgz",
            "integrity": "sha512-kLpxurY4Z4r9sgMsyG0Z9uzsBlgiU/EFKhj/h91/8yHu0edo7XuixOIH3VcJ8kkxs6/jPzoI6U9Vj3WqbMQ94g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "balanced-match": "^4.0.2"
            },
            "engines": {
                "node": "18 || 20 || >=22"
            }
        },
        "node_modules/braces": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
            "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "fill-range": "^7.1.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/buffer-equal-constant-time": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/buffer-equal-constant-time/-/buffer-equal-constant-time-1.0.1.tgz",
            "integrity": "sha512-zRpUiDwd/xk6ADqPMATG8vc9VPrkck7T07OIx0gnjmJAnHnTVXNQG3vfvWNuiZIkwu9KrKdA1iJKfsfTVxE6NA==",
            "license": "BSD-3-Clause"
        },
        "node_modules/bytes": {
            "version": "3.1.2",
            "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
            "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/call-bind-apply-helpers": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
            "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "function-bind": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/call-bound": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
            "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "get-intrinsic": "^1.3.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/chokidar": {
            "version": "3.6.0",
            "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
            "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "anymatch": "~3.1.2",
                "braces": "~3.0.2",
                "glob-parent": "~5.1.2",
                "is-binary-path": "~2.1.0",
                "is-glob": "~4.0.1",
                "normalize-path": "~3.0.0",
                "readdirp": "~3.6.0"
            },
            "engines": {
                "node": ">= 8.10.0"
            },
            "funding": {
                "url": "https://paulmillr.com/funding/"
            },
            "optionalDependencies": {
                "fsevents": "~2.3.2"
            }
        },
        "node_modules/color": {
            "version": "5.0.3",
            "resolved": "https://registry.npmjs.org/color/-/color-5.0.3.tgz",
            "integrity": "sha512-ezmVcLR3xAVp8kYOm4GS45ZLLgIE6SPAFoduLr6hTDajwb3KZ2F46gulK3XpcwRFb5KKGCSezCBAY4Dw4HsyXA==",
            "license": "MIT",
            "dependencies": {
                "color-convert": "^3.1.3",
                "color-string": "^2.1.3"
            },
            "engines": {
                "node": ">=18"
            }
        },
        "node_modules/color-convert": {
            "version": "3.1.3",
            "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-3.1.3.tgz",
            "integrity": "sha512-fasDH2ont2GqF5HpyO4w0+BcewlhHEZOFn9c1ckZdHpJ56Qb7MHhH/IcJZbBGgvdtwdwNbLvxiBEdg336iA9Sg==",
            "license": "MIT",
            "dependencies": {
                "color-name": "^2.0.0"
            },
            "engines": {
                "node": ">=14.6"
            }
        },
        "node_modules/color-name": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/color-name/-/color-name-2.1.0.tgz",
            "integrity": "sha512-1bPaDNFm0axzE4MEAzKPuqKWeRaT43U/hyxKPBdqTfmPF+d6n7FSoTFxLVULUJOmiLp01KjhIPPH+HrXZJN4Rg==",
            "license": "MIT",
            "engines": {
                "node": ">=12.20"
            }
        },
        "node_modules/color-string": {
            "version": "2.1.4",
            "resolved": "https://registry.npmjs.org/color-string/-/color-string-2.1.4.tgz",
            "integrity": "sha512-Bb6Cq8oq0IjDOe8wJmi4JeNn763Xs9cfrBcaylK1tPypWzyoy2G3l90v9k64kjphl/ZJjPIShFztenRomi8WTg==",
            "license": "MIT",
            "dependencies": {
                "color-name": "^2.0.0"
            },
            "engines": {
                "node": ">=18"
            }
        },
        "node_modules/combined-stream": {
            "version": "1.0.8",
            "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
            "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
            "license": "MIT",
            "dependencies": {
                "delayed-stream": "~1.0.0"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/content-disposition": {
            "version": "0.5.4",
            "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-0.5.4.tgz",
            "integrity": "sha512-FveZTNuGw04cxlAiWbzi6zTAL/lhehaWbTtgluJh4/E95DqMwTmha3KZN1aAWA8cFIhHzMZUvLevkw5Rqk+tSQ==",
            "license": "MIT",
            "dependencies": {
                "safe-buffer": "5.2.1"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/content-type": {
            "version": "1.0.5",
            "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
            "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/cookie": {
            "version": "0.7.2",
            "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
            "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/cookie-parser": {
            "version": "1.4.7",
            "resolved": "https://registry.npmjs.org/cookie-parser/-/cookie-parser-1.4.7.tgz",
            "integrity": "sha512-nGUvgXnotP3BsjiLX2ypbQnWoGUPIIfHQNZkkC668ntrzGWEZVW70HDEB1qnNGMicPje6EttlIgzo51YSwNQGw==",
            "license": "MIT",
            "dependencies": {
                "cookie": "0.7.2",
                "cookie-signature": "1.0.6"
            },
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/cookie-signature": {
            "version": "1.0.6",
            "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.0.6.tgz",
            "integrity": "sha512-QADzlaHc8icV8I7vbaJXJwod9HWYp8uCqf1xa4OfNu1T7JVxQIrUgOWtHdNDtPiywmFbiS12VjotIXLrKM3orQ==",
            "license": "MIT"
        },
        "node_modules/cors": {
            "version": "2.8.6",
            "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.6.tgz",
            "integrity": "sha512-tJtZBBHA6vjIAaF6EnIaq6laBBP9aq/Y3ouVJjEfoHbRBcHBAHYcMh/w8LDrk2PvIMMq8gmopa5D4V8RmbrxGw==",
            "license": "MIT",
            "dependencies": {
                "object-assign": "^4",
                "vary": "^1"
            },
            "engines": {
                "node": ">= 0.10"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/debug": {
            "version": "2.6.9",
            "resolved": "https://registry.npmjs.org/debug/-/debug-2.6.9.tgz",
            "integrity": "sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==",
            "license": "MIT",
            "dependencies": {
                "ms": "2.0.0"
            }
        },
        "node_modules/delayed-stream": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
            "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
            "license": "MIT",
            "engines": {
                "node": ">=0.4.0"
            }
        },
        "node_modules/depd": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
            "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/destroy": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/destroy/-/destroy-1.2.0.tgz",
            "integrity": "sha512-2sJGJTaXIIaR1w4iJSNoN0hnMY7Gpc/n8D4qSCJw8QqFWXf7cuAgnEHxBpweaVcPevC2l3KpjYCx3NypQQgaJg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8",
                "npm": "1.2.8000 || >= 1.4.16"
            }
        },
        "node_modules/dotenv": {
            "version": "16.6.1",
            "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-16.6.1.tgz",
            "integrity": "sha512-uBq4egWHTcTt33a72vpSG0z3HnPuIl6NqYcTrKEg2azoEyl2hpW0zqlxysq2pK9HlDIHyHyakeYaYnSAwd8bow==",
            "license": "BSD-2-Clause",
            "engines": {
                "node": ">=12"
            },
            "funding": {
                "url": "https://dotenvx.com"
            }
        },
        "node_modules/dunder-proto": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
            "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.1",
                "es-errors": "^1.3.0",
                "gopd": "^1.2.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/ecdsa-sig-formatter": {
            "version": "1.0.11",
            "resolved": "https://registry.npmjs.org/ecdsa-sig-formatter/-/ecdsa-sig-formatter-1.0.11.tgz",
            "integrity": "sha512-nagl3RYrbNv6kQkeJIpt6NJZy8twLB/2vtz6yN9Z4vRKHN4/QZJIEbqohALSgwKdnksuY3k5Addp5lg8sVoVcQ==",
            "license": "Apache-2.0",
            "dependencies": {
                "safe-buffer": "^5.0.1"
            }
        },
        "node_modules/ee-first": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
            "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
            "license": "MIT"
        },
        "node_modules/enabled": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/enabled/-/enabled-2.0.0.tgz",
            "integrity": "sha512-AKrN98kuwOzMIdAizXGI86UFBoo26CL21UM763y1h/GMSJ4/OHU9k2YlsmBpyScFo/wbLzWQJBMCW4+IO3/+OQ==",
            "license": "MIT"
        },
        "node_modules/encodeurl": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
            "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/es-define-property": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
            "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-errors": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
            "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-object-atoms": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
            "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-set-tostringtag": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
            "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.6",
                "has-tostringtag": "^1.0.2",
                "hasown": "^2.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/escape-html": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
            "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
            "license": "MIT"
        },
        "node_modules/etag": {
            "version": "1.8.1",
            "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
            "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/event-target-shim": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/event-target-shim/-/event-target-shim-5.0.1.tgz",
            "integrity": "sha512-i/2XbnSz/uxRCU6+NdVJgKWDTM427+MqYbkQzD321DuCQJUqOuJKIA0IM2+W2xtYHdKOmZ4dR6fExsd4SXL+WQ==",
            "license": "MIT",
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/express": {
            "version": "4.22.2",
            "resolved": "https://registry.npmjs.org/express/-/express-4.22.2.tgz",
            "integrity": "sha512-IuL+Elrou2ZvCFHs18/CIzy2Nzvo25nZ1/D2eIZlz7c+QUayAcYoiM2BthCjs+EBHVpjYjcuLDAiCWgeIX3X1Q==",
            "license": "MIT",
            "dependencies": {
                "accepts": "~1.3.8",
                "array-flatten": "1.1.1",
                "body-parser": "~1.20.5",
                "content-disposition": "~0.5.4",
                "content-type": "~1.0.4",
                "cookie": "~0.7.1",
                "cookie-signature": "~1.0.6",
                "debug": "2.6.9",
                "depd": "2.0.0",
                "encodeurl": "~2.0.0",
                "escape-html": "~1.0.3",
                "etag": "~1.8.1",
                "finalhandler": "~1.3.1",
                "fresh": "~0.5.2",
                "http-errors": "~2.0.0",
                "merge-descriptors": "1.0.3",
                "methods": "~1.1.2",
                "on-finished": "~2.4.1",
                "parseurl": "~1.3.3",
                "path-to-regexp": "~0.1.12",
                "proxy-addr": "~2.0.7",
                "qs": "~6.15.1",
                "range-parser": "~1.2.1",
                "safe-buffer": "5.2.1",
                "send": "~0.19.0",
                "serve-static": "~1.16.2",
                "setprototypeof": "1.2.0",
                "statuses": "~2.0.1",
                "type-is": "~1.6.18",
                "utils-merge": "1.0.1",
                "vary": "~1.1.2"
            },
            "engines": {
                "node": ">= 0.10.0"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/express-rate-limit": {
            "version": "7.5.1",
            "resolved": "https://registry.npmjs.org/express-rate-limit/-/express-rate-limit-7.5.1.tgz",
            "integrity": "sha512-7iN8iPMDzOMHPUYllBEsQdWVB6fPDMPqwjBaFrgr4Jgr/+okjvzAy+UHlYYL/Vs0OsOrMkwS6PJDkFlJwoxUnw==",
            "license": "MIT",
            "engines": {
                "node": ">= 16"
            },
            "funding": {
                "url": "https://github.com/sponsors/express-rate-limit"
            },
            "peerDependencies": {
                "express": ">= 4.11"
            }
        },
        "node_modules/express-validator": {
            "version": "7.3.2",
            "resolved": "https://registry.npmjs.org/express-validator/-/express-validator-7.3.2.tgz",
            "integrity": "sha512-ctLw1Vl6dXVH62dIQMDdTAQkrh480mkFuG6/SGXOaVlwPNukhRAe7EgJIMJ2TSAni8iwHBRp530zAZE5ZPF2IA==",
            "license": "MIT",
            "dependencies": {
                "lodash": "^4.18.1",
                "validator": "~13.15.23"
            },
            "engines": {
                "node": ">= 8.0.0"
            }
        },
        "node_modules/fecha": {
            "version": "4.2.3",
            "resolved": "https://registry.npmjs.org/fecha/-/fecha-4.2.3.tgz",
            "integrity": "sha512-OP2IUU6HeYKJi3i0z4A19kHMQoLVs4Hc+DPqqxI2h/DPZHTm/vjsfC6P0b4jCMy14XizLBqvndQ+UilD7707Jw==",
            "license": "MIT"
        },
        "node_modules/file-stream-rotator": {
            "version": "0.6.1",
            "resolved": "https://registry.npmjs.org/file-stream-rotator/-/file-stream-rotator-0.6.1.tgz",
            "integrity": "sha512-u+dBid4PvZw17PmDeRcNOtCP9CCK/9lRN2w+r1xIS7yOL9JFrIBKTvrYsxT4P0pGtThYTn++QS5ChHaUov3+zQ==",
            "license": "MIT",
            "dependencies": {
                "moment": "^2.29.1"
            }
        },
        "node_modules/fill-range": {
            "version": "7.1.1",
            "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
            "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "to-regex-range": "^5.0.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/finalhandler": {
            "version": "1.3.2",
            "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-1.3.2.tgz",
            "integrity": "sha512-aA4RyPcd3badbdABGDuTXCMTtOneUCAYH/gxoYRTZlIJdF0YPWuGqiAsIrhNnnqdXGswYk6dGujem4w80UJFhg==",
            "license": "MIT",
            "dependencies": {
                "debug": "2.6.9",
                "encodeurl": "~2.0.0",
                "escape-html": "~1.0.3",
                "on-finished": "~2.4.1",
                "parseurl": "~1.3.3",
                "statuses": "~2.0.2",
                "unpipe": "~1.0.0"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/fn.name": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/fn.name/-/fn.name-1.1.0.tgz",
            "integrity": "sha512-GRnmB5gPyJpAhTQdSZTSp9uaPSvl09KoYcMQtsB9rQoOmzs9dH6ffeccH+Z+cv6P68Hu5bC6JjRh4Ah/mHSNRw==",
            "license": "MIT"
        },
        "node_modules/follow-redirects": {
            "version": "1.16.0",
            "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.16.0.tgz",
            "integrity": "sha512-y5rN/uOsadFT/JfYwhxRS5R7Qce+g3zG97+JrtFZlC9klX/W5hD7iiLzScI4nZqUS7DNUdhPgw4xI8W2LuXlUw==",
            "funding": [
                {
                    "type": "individual",
                    "url": "https://github.com/sponsors/RubenVerborgh"
                }
            ],
            "license": "MIT",
            "engines": {
                "node": ">=4.0"
            },
            "peerDependenciesMeta": {
                "debug": {
                    "optional": true
                }
            }
        },
        "node_modules/form-data": {
            "version": "4.0.5",
            "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.5.tgz",
            "integrity": "sha512-8RipRLol37bNs2bhoV67fiTEvdTrbMUYcFTiy3+wuuOnUog2QBHCZWXDRijWQfAkhBj2Uf5UnVaiWwA5vdd82w==",
            "license": "MIT",
            "dependencies": {
                "asynckit": "^0.4.0",
                "combined-stream": "^1.0.8",
                "es-set-tostringtag": "^2.1.0",
                "hasown": "^2.0.2",
                "mime-types": "^2.1.12"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/form-data-encoder": {
            "version": "1.7.2",
            "resolved": "https://registry.npmjs.org/form-data-encoder/-/form-data-encoder-1.7.2.tgz",
            "integrity": "sha512-qfqtYan3rxrnCk1VYaA4H+Ms9xdpPqvLZa6xmMgFvhO32x7/3J/ExcTd6qpxM0vH2GdMI+poehyBZvqfMTto8A==",
            "license": "MIT"
        },
        "node_modules/formdata-node": {
            "version": "4.4.1",
            "resolved": "https://registry.npmjs.org/formdata-node/-/formdata-node-4.4.1.tgz",
            "integrity": "sha512-0iirZp3uVDjVGt9p49aTaqjk84TrglENEDuqfdlZQ1roC9CWlPk6Avf8EEnZNcAqPonwkG35x4n3ww/1THYAeQ==",
            "license": "MIT",
            "dependencies": {
                "node-domexception": "1.0.0",
                "web-streams-polyfill": "4.0.0-beta.3"
            },
            "engines": {
                "node": ">= 12.20"
            }
        },
        "node_modules/forwarded": {
            "version": "0.2.0",
            "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
            "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/fresh": {
            "version": "0.5.2",
            "resolved": "https://registry.npmjs.org/fresh/-/fresh-0.5.2.tgz",
            "integrity": "sha512-zJ2mQYM18rEFOudeV4GShTGIQ7RbzA7ozbU9I/XBpm7kqgMywgmylMwXHxZJmkVoYkna9d2pVXVXPdYTP9ej8Q==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/fsevents": {
            "version": "2.3.3",
            "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
            "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
            "hasInstallScript": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "darwin"
            ],
            "engines": {
                "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
            }
        },
        "node_modules/function-bind": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
            "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
            "license": "MIT",
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/get-intrinsic": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
            "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "es-define-property": "^1.0.1",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.1.1",
                "function-bind": "^1.1.2",
                "get-proto": "^1.0.1",
                "gopd": "^1.2.0",
                "has-symbols": "^1.1.0",
                "hasown": "^2.0.2",
                "math-intrinsics": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/get-proto": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
            "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
            "license": "MIT",
            "dependencies": {
                "dunder-proto": "^1.0.1",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/glob-parent": {
            "version": "5.1.2",
            "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
            "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "is-glob": "^4.0.1"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/gopd": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
            "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-flag": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-3.0.0.tgz",
            "integrity": "sha512-sKJf1+ceQBr4SMkvQnBDNDtf4TXpVhVGateu0t918bl30FnbE2m4vNLX+VWe/dpjlb+HugGYzW7uQXH98HPEYw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/has-symbols": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
            "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-tostringtag": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
            "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
            "license": "MIT",
            "dependencies": {
                "has-symbols": "^1.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/hasown": {
            "version": "2.0.4",
            "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
            "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
            "license": "MIT",
            "dependencies": {
                "function-bind": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/helmet": {
            "version": "7.2.0",
            "resolved": "https://registry.npmjs.org/helmet/-/helmet-7.2.0.tgz",
            "integrity": "sha512-ZRiwvN089JfMXokizgqEPXsl2Guk094yExfoDXR0cBYWxtBbaSww/w+vT4WEJsBW2iTUi1GgZ6swmoug3Oy4Xw==",
            "license": "MIT",
            "engines": {
                "node": ">=16.0.0"
            }
        },
        "node_modules/http-errors": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.1.tgz",
            "integrity": "sha512-4FbRdAX+bSdmo4AUFuS0WNiPz8NgFt+r8ThgNWmlrjQjt1Q7ZR9+zTlce2859x4KSXrwIsaeTqDoKQmtP8pLmQ==",
            "license": "MIT",
            "dependencies": {
                "depd": "~2.0.0",
                "inherits": "~2.0.4",
                "setprototypeof": "~1.2.0",
                "statuses": "~2.0.2",
                "toidentifier": "~1.0.1"
            },
            "engines": {
                "node": ">= 0.8"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/https-proxy-agent": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
            "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
            "license": "MIT",
            "dependencies": {
                "agent-base": "6",
                "debug": "4"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/https-proxy-agent/node_modules/debug": {
            "version": "4.4.3",
            "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
            "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
            "license": "MIT",
            "dependencies": {
                "ms": "^2.1.3"
            },
            "engines": {
                "node": ">=6.0"
            },
            "peerDependenciesMeta": {
                "supports-color": {
                    "optional": true
                }
            }
        },
        "node_modules/https-proxy-agent/node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/humanize-ms": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/humanize-ms/-/humanize-ms-1.2.1.tgz",
            "integrity": "sha512-Fl70vYtsAFb/C06PTS9dZBo7ihau+Tu/DNCk/OyHhea07S+aeMWpFFkUaXRa8fI+ScZbEI8dfSxwY7gxZ9SAVQ==",
            "license": "MIT",
            "dependencies": {
                "ms": "^2.0.0"
            }
        },
        "node_modules/iconv-lite": {
            "version": "0.4.24",
            "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.4.24.tgz",
            "integrity": "sha512-v3MXnZAcvnywkTUEZomIActle7RXXeedOR31wwl7VlyoXO4Qi9arvSenNQWne1TcRwhCL1HwLI21bEqdpj8/rA==",
            "license": "MIT",
            "dependencies": {
                "safer-buffer": ">= 2.1.2 < 3"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/ignore-by-default": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/ignore-by-default/-/ignore-by-default-1.0.1.tgz",
            "integrity": "sha512-Ius2VYcGNk7T90CppJqcIkS5ooHUZyIQK+ClZfMfMNFEF9VSE73Fq+906u/CWu92x4gzZMWOwfFYckPObzdEbA==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/inherits": {
            "version": "2.0.4",
            "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
            "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
            "license": "ISC"
        },
        "node_modules/ipaddr.js": {
            "version": "1.9.1",
            "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
            "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/is-binary-path": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
            "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "binary-extensions": "^2.0.0"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/is-extglob": {
            "version": "2.1.1",
            "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
            "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/is-glob": {
            "version": "4.0.3",
            "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
            "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-extglob": "^2.1.1"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/is-number": {
            "version": "7.0.0",
            "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
            "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.12.0"
            }
        },
        "node_modules/is-stream": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/is-stream/-/is-stream-2.0.1.tgz",
            "integrity": "sha512-hFoiJiTl63nn+kstHGBtewWSKnQLpyb155KHheA1l39uvtO9nWIop1p3udqPcUd/xbF1VLMO4n7OI6p7RbngDg==",
            "license": "MIT",
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/jsonwebtoken": {
            "version": "9.0.3",
            "resolved": "https://registry.npmjs.org/jsonwebtoken/-/jsonwebtoken-9.0.3.tgz",
            "integrity": "sha512-MT/xP0CrubFRNLNKvxJ2BYfy53Zkm++5bX9dtuPbqAeQpTVe0MQTFhao8+Cp//EmJp244xt6Drw/GVEGCUj40g==",
            "license": "MIT",
            "dependencies": {
                "jws": "^4.0.1",
                "lodash.includes": "^4.3.0",
                "lodash.isboolean": "^3.0.3",
                "lodash.isinteger": "^4.0.4",
                "lodash.isnumber": "^3.0.3",
                "lodash.isplainobject": "^4.0.6",
                "lodash.isstring": "^4.0.1",
                "lodash.once": "^4.0.0",
                "ms": "^2.1.1",
                "semver": "^7.5.4"
            },
            "engines": {
                "node": ">=12",
                "npm": ">=6"
            }
        },
        "node_modules/jsonwebtoken/node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/jwa": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/jwa/-/jwa-2.0.1.tgz",
            "integrity": "sha512-hRF04fqJIP8Abbkq5NKGN0Bbr3JxlQ+qhZufXVr0DvujKy93ZCbXZMHDL4EOtodSbCWxOqR8MS1tXA5hwqCXDg==",
            "license": "MIT",
            "dependencies": {
                "buffer-equal-constant-time": "^1.0.1",
                "ecdsa-sig-formatter": "1.0.11",
                "safe-buffer": "^5.0.1"
            }
        },
        "node_modules/jws": {
            "version": "4.0.1",
            "resolved": "https://registry.npmjs.org/jws/-/jws-4.0.1.tgz",
            "integrity": "sha512-EKI/M/yqPncGUUh44xz0PxSidXFr/+r0pA70+gIYhjv+et7yxM+s29Y+VGDkovRofQem0fs7Uvf4+YmAdyRduA==",
            "license": "MIT",
            "dependencies": {
                "jwa": "^2.0.1",
                "safe-buffer": "^5.0.1"
            }
        },
        "node_modules/kuler": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/kuler/-/kuler-2.0.0.tgz",
            "integrity": "sha512-Xq9nH7KlWZmXAtodXDDRE7vs6DU1gTU8zYDHDiWLSip45Egwq3plLHzPn27NgvzL2r1LMPC1vdqh98sQxtqj4A==",
            "license": "MIT"
        },
        "node_modules/lodash": {
            "version": "4.18.1",
            "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.18.1.tgz",
            "integrity": "sha512-dMInicTPVE8d1e5otfwmmjlxkZoUpiVLwyeTdUsi/Caj/gfzzblBcCE5sRHV/AsjuCmxWrte2TNGSYuCeCq+0Q==",
            "license": "MIT"
        },
        "node_modules/lodash.includes": {
            "version": "4.3.0",
            "resolved": "https://registry.npmjs.org/lodash.includes/-/lodash.includes-4.3.0.tgz",
            "integrity": "sha512-W3Bx6mdkRTGtlJISOvVD/lbqjTlPPUDTMnlXZFnVwi9NKJ6tiAk6LVdlhZMm17VZisqhKcgzpO5Wz91PCt5b0w==",
            "license": "MIT"
        },
        "node_modules/lodash.isboolean": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/lodash.isboolean/-/lodash.isboolean-3.0.3.tgz",
            "integrity": "sha512-Bz5mupy2SVbPHURB98VAcw+aHh4vRV5IPNhILUCsOzRmsTmSQ17jIuqopAentWoehktxGd9e/hbIXq980/1QJg==",
            "license": "MIT"
        },
        "node_modules/lodash.isinteger": {
            "version": "4.0.4",
            "resolved": "https://registry.npmjs.org/lodash.isinteger/-/lodash.isinteger-4.0.4.tgz",
            "integrity": "sha512-DBwtEWN2caHQ9/imiNeEA5ys1JoRtRfY3d7V9wkqtbycnAmTvRRmbHKDV4a0EYc678/dia0jrte4tjYwVBaZUA==",
            "license": "MIT"
        },
        "node_modules/lodash.isnumber": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/lodash.isnumber/-/lodash.isnumber-3.0.3.tgz",
            "integrity": "sha512-QYqzpfwO3/CWf3XP+Z+tkQsfaLL/EnUlXWVkIk5FUPc4sBdTehEqZONuyRt2P67PXAk+NXmTBcc97zw9t1FQrw==",
            "license": "MIT"
        },
        "node_modules/lodash.isplainobject": {
            "version": "4.0.6",
            "resolved": "https://registry.npmjs.org/lodash.isplainobject/-/lodash.isplainobject-4.0.6.tgz",
            "integrity": "sha512-oSXzaWypCMHkPC3NvBEaPHf0KsA5mvPrOPgQWDsbg8n7orZ290M0BmC/jgRZ4vcJ6DTAhjrsSYgdsW/F+MFOBA==",
            "license": "MIT"
        },
        "node_modules/lodash.isstring": {
            "version": "4.0.1",
            "resolved": "https://registry.npmjs.org/lodash.isstring/-/lodash.isstring-4.0.1.tgz",
            "integrity": "sha512-0wJxfxH1wgO3GrbuP+dTTk7op+6L41QCXbGINEmD+ny/G/eCqGzxyCsh7159S+mgDDcoarnBw6PC1PS5+wUGgw==",
            "license": "MIT"
        },
        "node_modules/lodash.once": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/lodash.once/-/lodash.once-4.1.1.tgz",
            "integrity": "sha512-Sb487aTOCr9drQVL8pIxOzVhafOjZN9UU54hiN8PU3uAiSV7lx1yYNpbNmex2PK6dSJoNTSJUUswT651yww3Mg==",
            "license": "MIT"
        },
        "node_modules/logform": {
            "version": "2.7.0",
            "resolved": "https://registry.npmjs.org/logform/-/logform-2.7.0.tgz",
            "integrity": "sha512-TFYA4jnP7PVbmlBIfhlSe+WKxs9dklXMTEGcBCIvLhE/Tn3H6Gk1norupVW7m5Cnd4bLcr08AytbyV/xj7f/kQ==",
            "license": "MIT",
            "dependencies": {
                "@colors/colors": "1.6.0",
                "@types/triple-beam": "^1.3.2",
                "fecha": "^4.2.0",
                "ms": "^2.1.1",
                "safe-stable-stringify": "^2.3.1",
                "triple-beam": "^1.3.0"
            },
            "engines": {
                "node": ">= 12.0.0"
            }
        },
        "node_modules/logform/node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/math-intrinsics": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
            "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/media-typer": {
            "version": "0.3.0",
            "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-0.3.0.tgz",
            "integrity": "sha512-dq+qelQ9akHpcOl/gUVRTxVIOkAJ1wR3QAvb4RsVjS8oVoFjDGTc679wJYmUmknUF5HwMLOgb5O+a3KxfWapPQ==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/merge-descriptors": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-1.0.3.tgz",
            "integrity": "sha512-gaNvAS7TZ897/rVaZ0nMtAyxNyi/pdbjbAwUpFQpN70GqnVfOiXpeUUMKRBmzXaSQ8DdTX4/0ms62r2K+hE6mQ==",
            "license": "MIT",
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/methods": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/methods/-/methods-1.1.2.tgz",
            "integrity": "sha512-iclAHeNqNm68zFtnZ0e+1L2yUIdvzNoauKU4WBA3VvH/vPFieF7qfRlwUZU+DA9P9bPXIS90ulxoUoCH23sV2w==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/mime": {
            "version": "1.6.0",
            "resolved": "https://registry.npmjs.org/mime/-/mime-1.6.0.tgz",
            "integrity": "sha512-x0Vn8spI+wuJ1O6S7gnbaQg8Pxh4NNHb7KSINmEWKiPE4RKOplvijn+NkmYmmRgP68mc70j2EbeTFRsrswaQeg==",
            "license": "MIT",
            "bin": {
                "mime": "cli.js"
            },
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/mime-db": {
            "version": "1.52.0",
            "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
            "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/mime-types": {
            "version": "2.1.35",
            "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
            "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
            "license": "MIT",
            "dependencies": {
                "mime-db": "1.52.0"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/minimatch": {
            "version": "10.2.5",
            "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.5.tgz",
            "integrity": "sha512-MULkVLfKGYDFYejP07QOurDLLQpcjk7Fw+7jXS2R2czRQzR56yHRveU5NDJEOviH+hETZKSkIk5c+T23GjFUMg==",
            "dev": true,
            "license": "BlueOak-1.0.0",
            "dependencies": {
                "brace-expansion": "^5.0.5"
            },
            "engines": {
                "node": "18 || 20 || >=22"
            },
            "funding": {
                "url": "https://github.com/sponsors/isaacs"
            }
        },
        "node_modules/moment": {
            "version": "2.30.1",
            "resolved": "https://registry.npmjs.org/moment/-/moment-2.30.1.tgz",
            "integrity": "sha512-uEmtNhbDOrWPFS+hdjFCBfy9f2YoyzRpwcl+DqpC6taX21FzsTLQVbMV/W7PzNSX6x/bhC1zA3c2UQ5NzH6how==",
            "license": "MIT",
            "engines": {
                "node": "*"
            }
        },
        "node_modules/morgan": {
            "version": "1.11.0",
            "resolved": "https://registry.npmjs.org/morgan/-/morgan-1.11.0.tgz",
            "integrity": "sha512-zSkVu3t18r39pw4ixfBKvfZi3y2UOqr7d4WYwcj3m8nXpEQK4rPO6GLzs/CExoRgmX3y9EjmmcXqv6jq0SK46g==",
            "license": "MIT",
            "dependencies": {
                "basic-auth": "~2.0.1",
                "debug": "2.6.9",
                "depd": "~2.0.0",
                "on-finished": "~2.4.1",
                "on-headers": "~1.1.0"
            },
            "engines": {
                "node": ">= 0.8.0"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/express"
            }
        },
        "node_modules/ms": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.0.0.tgz",
            "integrity": "sha512-Tpp60P6IUJDTuOq/5Z8cdskzJujfwqfOTkrwIwj7IRISpnkJnT6SyJ4PCPnGMoFjC9ddhal5KVIYtAt97ix05A==",
            "license": "MIT"
        },
        "node_modules/negotiator": {
            "version": "0.6.3",
            "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-0.6.3.tgz",
            "integrity": "sha512-+EUsqGPLsM+j/zdChZjsnX51g4XrHFOIXwfnCVPGlQk/k5giakcKsuxCObBRu6DSm9opw/O6slWbJdghQM4bBg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/node-domexception": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/node-domexception/-/node-domexception-1.0.0.tgz",
            "integrity": "sha512-/jKZoMpw0F8GRwl4/eLROPA3cfcXtLApP0QzLmUT/HuPCZWyB7IY9ZrMeKw2O/nFIqPQB3PVM9aYm0F312AXDQ==",
            "deprecated": "Use your platform's native DOMException instead",
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/jimmywarting"
                },
                {
                    "type": "github",
                    "url": "https://paypal.me/jimmywarting"
                }
            ],
            "license": "MIT",
            "engines": {
                "node": ">=10.5.0"
            }
        },
        "node_modules/node-fetch": {
            "version": "2.7.0",
            "resolved": "https://registry.npmjs.org/node-fetch/-/node-fetch-2.7.0.tgz",
            "integrity": "sha512-c4FRfUm/dbcWZ7U+1Wq0AwCyFL+3nt2bEw05wfxSz+DWpWsitgmSgYmy2dQdWyKC1694ELPqMs/YzUSNozLt8A==",
            "license": "MIT",
            "dependencies": {
                "whatwg-url": "^5.0.0"
            },
            "engines": {
                "node": "4.x || >=6.0.0"
            },
            "peerDependencies": {
                "encoding": "^0.1.0"
            },
            "peerDependenciesMeta": {
                "encoding": {
                    "optional": true
                }
            }
        },
        "node_modules/nodemon": {
            "version": "3.1.14",
            "resolved": "https://registry.npmjs.org/nodemon/-/nodemon-3.1.14.tgz",
            "integrity": "sha512-jakjZi93UtB3jHMWsXL68FXSAosbLfY0In5gtKq3niLSkrWznrVBzXFNOEMJUfc9+Ke7SHWoAZsiMkNP3vq6Jw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "chokidar": "^3.5.2",
                "debug": "^4",
                "ignore-by-default": "^1.0.1",
                "minimatch": "^10.2.1",
                "pstree.remy": "^1.1.8",
                "semver": "^7.5.3",
                "simple-update-notifier": "^2.0.0",
                "supports-color": "^5.5.0",
                "touch": "^3.1.0",
                "undefsafe": "^2.0.5"
            },
            "bin": {
                "nodemon": "bin/nodemon.js"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/nodemon"
            }
        },
        "node_modules/nodemon/node_modules/debug": {
            "version": "4.4.3",
            "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
            "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "ms": "^2.1.3"
            },
            "engines": {
                "node": ">=6.0"
            },
            "peerDependenciesMeta": {
                "supports-color": {
                    "optional": true
                }
            }
        },
        "node_modules/nodemon/node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/normalize-path": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
            "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/object-assign": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
            "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/object-hash": {
            "version": "2.2.0",
            "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-2.2.0.tgz",
            "integrity": "sha512-gScRMn0bS5fH+IuwyIFgnh9zBdo4DV+6GhygmWM9HyNJSgS0hScp1f5vjtm7oIIOiT9trXrShAkLFSc2IqKNgw==",
            "license": "MIT",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/object-inspect": {
            "version": "1.13.4",
            "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
            "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/on-finished": {
            "version": "2.4.1",
            "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
            "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
            "license": "MIT",
            "dependencies": {
                "ee-first": "1.1.1"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/on-headers": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/on-headers/-/on-headers-1.1.0.tgz",
            "integrity": "sha512-737ZY3yNnXy37FHkQxPzt4UZ2UWPWiCZWLvFZ4fu5cueciegX0zGPnrlY6bwRg4FdQOe9YU8MkmJwGhoMybl8A==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/one-time": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/one-time/-/one-time-1.0.0.tgz",
            "integrity": "sha512-5DXOiRKwuSEcQ/l0kGCF6Q3jcADFv5tSmRaJck/OqkVFcOzutB134KRSfF0xDrL39MNnqxbHBbUUcjZIhTgb2g==",
            "license": "MIT",
            "dependencies": {
                "fn.name": "1.x.x"
            }
        },
        "node_modules/openai": {
            "version": "4.104.0",
            "resolved": "https://registry.npmjs.org/openai/-/openai-4.104.0.tgz",
            "integrity": "sha512-p99EFNsA/yX6UhVO93f5kJsDRLAg+CTA2RBqdHK4RtK8u5IJw32Hyb2dTGKbnnFmnuoBv5r7Z2CURI9sGZpSuA==",
            "license": "Apache-2.0",
            "dependencies": {
                "@types/node": "^18.11.18",
                "@types/node-fetch": "^2.6.4",
                "abort-controller": "^3.0.0",
                "agentkeepalive": "^4.2.1",
                "form-data-encoder": "1.7.2",
                "formdata-node": "^4.3.2",
                "node-fetch": "^2.6.7"
            },
            "bin": {
                "openai": "bin/cli"
            },
            "peerDependencies": {
                "ws": "^8.18.0",
                "zod": "^3.23.8"
            },
            "peerDependenciesMeta": {
                "ws": {
                    "optional": true
                },
                "zod": {
                    "optional": true
                }
            }
        },
        "node_modules/parseurl": {
            "version": "1.3.3",
            "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
            "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/path-to-regexp": {
            "version": "0.1.13",
            "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-0.1.13.tgz",
            "integrity": "sha512-A/AGNMFN3c8bOlvV9RreMdrv7jsmF9XIfDeCd87+I8RNg6s78BhJxMu69NEMHBSJFxKidViTEdruRwEk/WIKqA==",
            "license": "MIT"
        },
        "node_modules/picomatch": {
            "version": "2.3.2",
            "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
            "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8.6"
            },
            "funding": {
                "url": "https://github.com/sponsors/jonschlinkert"
            }
        },
        "node_modules/prisma": {
            "version": "5.22.0",
            "resolved": "https://registry.npmjs.org/prisma/-/prisma-5.22.0.tgz",
            "integrity": "sha512-vtpjW3XuYCSnMsNVBjLMNkTj6OZbudcPPTPYHqX0CJfpcdWciI1dM8uHETwmDxxiqEwCIE6WvXucWUetJgfu/A==",
            "devOptional": true,
            "hasInstallScript": true,
            "license": "Apache-2.0",
            "dependencies": {
                "@prisma/engines": "5.22.0"
            },
            "bin": {
                "prisma": "build/index.js"
            },
            "engines": {
                "node": ">=16.13"
            },
            "optionalDependencies": {
                "fsevents": "2.3.3"
            }
        },
        "node_modules/proxy-addr": {
            "version": "2.0.7",
            "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
            "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
            "license": "MIT",
            "dependencies": {
                "forwarded": "0.2.0",
                "ipaddr.js": "1.9.1"
            },
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/proxy-from-env": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-2.1.0.tgz",
            "integrity": "sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/pstree.remy": {
            "version": "1.1.8",
            "resolved": "https://registry.npmjs.org/pstree.remy/-/pstree.remy-1.1.8.tgz",
            "integrity": "sha512-77DZwxQmxKnu3aR542U+X8FypNzbfJ+C5XQDk3uWjWxn6151aIMGthWYRXTqT1E5oJvg+ljaa2OJi+VfvCOQ8w==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/qs": {
            "version": "6.15.2",
            "resolved": "https://registry.npmjs.org/qs/-/qs-6.15.2.tgz",
            "integrity": "sha512-Rzq0KEyX/w/tEybncDgdkZrJgVUsUMk3xjh3t5bv3S1HTAtg+uOYt72+ZfwiQwKdysThkTBdL/rTi6HDmX9Ddw==",
            "license": "BSD-3-Clause",
            "dependencies": {
                "side-channel": "^1.1.0"
            },
            "engines": {
                "node": ">=0.6"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/range-parser": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
            "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/raw-body": {
            "version": "2.5.3",
            "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-2.5.3.tgz",
            "integrity": "sha512-s4VSOf6yN0rvbRZGxs8Om5CWj6seneMwK3oDb4lWDH0UPhWcxwOWw5+qk24bxq87szX1ydrwylIOp2uG1ojUpA==",
            "license": "MIT",
            "dependencies": {
                "bytes": "~3.1.2",
                "http-errors": "~2.0.1",
                "iconv-lite": "~0.4.24",
                "unpipe": "~1.0.0"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/readable-stream": {
            "version": "3.6.2",
            "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-3.6.2.tgz",
            "integrity": "sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==",
            "license": "MIT",
            "dependencies": {
                "inherits": "^2.0.3",
                "string_decoder": "^1.1.1",
                "util-deprecate": "^1.0.1"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/readdirp": {
            "version": "3.6.0",
            "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
            "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "picomatch": "^2.2.1"
            },
            "engines": {
                "node": ">=8.10.0"
            }
        },
        "node_modules/safe-buffer": {
            "version": "5.2.1",
            "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
            "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/feross"
                },
                {
                    "type": "patreon",
                    "url": "https://www.patreon.com/feross"
                },
                {
                    "type": "consulting",
                    "url": "https://feross.org/support"
                }
            ],
            "license": "MIT"
        },
        "node_modules/safe-stable-stringify": {
            "version": "2.5.0",
            "resolved": "https://registry.npmjs.org/safe-stable-stringify/-/safe-stable-stringify-2.5.0.tgz",
            "integrity": "sha512-b3rppTKm9T+PsVCBEOUR46GWI7fdOs00VKZ1+9c1EWDaDMvjQc6tUwuFyIprgGgTcWoVHSKrU8H31ZHA2e0RHA==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/safer-buffer": {
            "version": "2.1.2",
            "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
            "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
            "license": "MIT"
        },
        "node_modules/semver": {
            "version": "7.8.1",
            "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.1.tgz",
            "integrity": "sha512-rkVq3IXh+4FDGch+KwzX3aV9W3kO54GyEgpvBzSyctDA6Xtd7RJQV1xmXbeQp5v7+VzLOfVqiutSE6GICgPFvg==",
            "license": "ISC",
            "bin": {
                "semver": "bin/semver.js"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/send": {
            "version": "0.19.2",
            "resolved": "https://registry.npmjs.org/send/-/send-0.19.2.tgz",
            "integrity": "sha512-VMbMxbDeehAxpOtWJXlcUS5E8iXh6QmN+BkRX1GARS3wRaXEEgzCcB10gTQazO42tpNIya8xIyNx8fll1OFPrg==",
            "license": "MIT",
            "dependencies": {
                "debug": "2.6.9",
                "depd": "2.0.0",
                "destroy": "1.2.0",
                "encodeurl": "~2.0.0",
                "escape-html": "~1.0.3",
                "etag": "~1.8.1",
                "fresh": "~0.5.2",
                "http-errors": "~2.0.1",
                "mime": "1.6.0",
                "ms": "2.1.3",
                "on-finished": "~2.4.1",
                "range-parser": "~1.2.1",
                "statuses": "~2.0.2"
            },
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/send/node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/serve-static": {
            "version": "1.16.3",
            "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-1.16.3.tgz",
            "integrity": "sha512-x0RTqQel6g5SY7Lg6ZreMmsOzncHFU7nhnRWkKgWuMTu5NN0DR5oruckMqRvacAN9d5w6ARnRBXl9xhDCgfMeA==",
            "license": "MIT",
            "dependencies": {
                "encodeurl": "~2.0.0",
                "escape-html": "~1.0.3",
                "parseurl": "~1.3.3",
                "send": "~0.19.1"
            },
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/setprototypeof": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
            "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
            "license": "ISC"
        },
        "node_modules/side-channel": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
            "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "object-inspect": "^1.13.3",
                "side-channel-list": "^1.0.0",
                "side-channel-map": "^1.0.1",
                "side-channel-weakmap": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-list": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
            "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "object-inspect": "^1.13.4"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-map": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
            "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.5",
                "object-inspect": "^1.13.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-weakmap": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
            "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.5",
                "object-inspect": "^1.13.3",
                "side-channel-map": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/simple-update-notifier": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/simple-update-notifier/-/simple-update-notifier-2.0.0.tgz",
            "integrity": "sha512-a2B9Y0KlNXl9u/vsW6sTIu9vGEpfKu2wRV6l1H3XEas/0gUIzGzBoP/IouTcUQbm9JWZLH3COxyn03TYlFax6w==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "semver": "^7.5.3"
            },
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/stack-trace": {
            "version": "0.0.10",
            "resolved": "https://registry.npmjs.org/stack-trace/-/stack-trace-0.0.10.tgz",
            "integrity": "sha512-KGzahc7puUKkzyMt+IqAep+TVNbKP+k2Lmwhub39m1AsTSkaDutx56aDCo+HLDzf/D26BIHTJWNiTG1KAJiQCg==",
            "license": "MIT",
            "engines": {
                "node": "*"
            }
        },
        "node_modules/statuses": {
            "version": "2.0.2",
            "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
            "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/string_decoder": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.3.0.tgz",
            "integrity": "sha512-hkRX8U1WjJFd8LsDJ2yQ/wWWxaopEsABU1XfkM8A+j0+85JAGppt16cr1Whg6KIbb4okU6Mql6BOj+uup/wKeA==",
            "license": "MIT",
            "dependencies": {
                "safe-buffer": "~5.2.0"
            }
        },
        "node_modules/supports-color": {
            "version": "5.5.0",
            "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-5.5.0.tgz",
            "integrity": "sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "has-flag": "^3.0.0"
            },
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/text-hex": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/text-hex/-/text-hex-1.0.0.tgz",
            "integrity": "sha512-uuVGNWzgJ4yhRaNSiubPY7OjISw4sw4E5Uv0wbjp+OzcbmVU/rsT8ujgcXJhn9ypzsgr5vlzpPqP+MBBKcGvbg==",
            "license": "MIT"
        },
        "node_modules/to-regex-range": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
            "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-number": "^7.0.0"
            },
            "engines": {
                "node": ">=8.0"
            }
        },
        "node_modules/toidentifier": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
            "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
            "license": "MIT",
            "engines": {
                "node": ">=0.6"
            }
        },
        "node_modules/touch": {
            "version": "3.1.1",
            "resolved": "https://registry.npmjs.org/touch/-/touch-3.1.1.tgz",
            "integrity": "sha512-r0eojU4bI8MnHr8c5bNo7lJDdI2qXlWWJk6a9EAFG7vbhTjElYhBVS3/miuE0uOuoLdb8Mc/rVfsmm6eo5o9GA==",
            "dev": true,
            "license": "ISC",
            "bin": {
                "nodetouch": "bin/nodetouch.js"
            }
        },
        "node_modules/tr46": {
            "version": "0.0.3",
            "resolved": "https://registry.npmjs.org/tr46/-/tr46-0.0.3.tgz",
            "integrity": "sha512-N3WMsuqV66lT30CrXNbEjx4GEwlow3v6rr4mCcv6prnfwhS01rkgyFdjPNBYd9br7LpXV1+Emh01fHnq2Gdgrw==",
            "license": "MIT"
        },
        "node_modules/triple-beam": {
            "version": "1.4.1",
            "resolved": "https://registry.npmjs.org/triple-beam/-/triple-beam-1.4.1.tgz",
            "integrity": "sha512-aZbgViZrg1QNcG+LULa7nhZpJTZSLm/mXnHXnbAbjmN5aSa0y7V+wvv6+4WaBtpISJzThKy+PIPxc1Nq1EJ9mg==",
            "license": "MIT",
            "engines": {
                "node": ">= 14.0.0"
            }
        },
        "node_modules/type-is": {
            "version": "1.6.18",
            "resolved": "https://registry.npmjs.org/type-is/-/type-is-1.6.18.tgz",
            "integrity": "sha512-TkRKr9sUTxEH8MdfuCSP7VizJyzRNMjj2J2do2Jr3Kym598JVdEksuzPQCnlFPW4ky9Q+iA+ma9BGm06XQBy8g==",
            "license": "MIT",
            "dependencies": {
                "media-typer": "0.3.0",
                "mime-types": "~2.1.24"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/undefsafe": {
            "version": "2.0.5",
            "resolved": "https://registry.npmjs.org/undefsafe/-/undefsafe-2.0.5.tgz",
            "integrity": "sha512-WxONCrssBM8TSPRqN5EmsjVrsv4A8X12J4ArBiiayv3DyyG3ZlIg6yysuuSYdZsVz3TKcTg2fd//Ujd4CHV1iA==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/undici-types": {
            "version": "5.26.5",
            "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-5.26.5.tgz",
            "integrity": "sha512-JlCMO+ehdEIKqlFxk6IfVoAUVmgz7cU7zD/h9XZ0qzeosSHmUJVOzSQvvYSYWXkFXC+IfLKSIffhv0sVZup6pA==",
            "license": "MIT"
        },
        "node_modules/unpipe": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
            "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/util-deprecate": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
            "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
            "license": "MIT"
        },
        "node_modules/utils-merge": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/utils-merge/-/utils-merge-1.0.1.tgz",
            "integrity": "sha512-pMZTvIkT1d+TFGvDOqodOclx0QWkkgi6Tdoa8gC8ffGAAqz9pzPTZWAybbsHHoED/ztMtkv/VoYTYyShUn81hA==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4.0"
            }
        },
        "node_modules/validator": {
            "version": "13.15.35",
            "resolved": "https://registry.npmjs.org/validator/-/validator-13.15.35.tgz",
            "integrity": "sha512-TQ5pAGhd5whStmqWvYF4OjQROlmv9SMFVt37qoCBdqRffuuklWYQlCNnEs2ZaIBD1kZRNnikiZOS1eqgkar0iw==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.10"
            }
        },
        "node_modules/vary": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
            "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/web-streams-polyfill": {
            "version": "4.0.0-beta.3",
            "resolved": "https://registry.npmjs.org/web-streams-polyfill/-/web-streams-polyfill-4.0.0-beta.3.tgz",
            "integrity": "sha512-QW95TCTaHmsYfHDybGMwO5IJIM93I/6vTRk+daHTWFPhwh+C8Cg7j7XyKrwrj8Ib6vYXe0ocYNrmzY4xAAN6ug==",
            "license": "MIT",
            "engines": {
                "node": ">= 14"
            }
        },
        "node_modules/webidl-conversions": {
            "version": "3.0.1",
            "resolved": "https://registry.npmjs.org/webidl-conversions/-/webidl-conversions-3.0.1.tgz",
            "integrity": "sha512-2JAn3z8AR6rjK8Sm8orRC0h/bcl/DqL7tRPdGZ4I1CjdF+EaMLmYxBHyXuKL849eucPFhvBoxMsflfOb8kxaeQ==",
            "license": "BSD-2-Clause"
        },
        "node_modules/whatwg-url": {
            "version": "5.0.0",
            "resolved": "https://registry.npmjs.org/whatwg-url/-/whatwg-url-5.0.0.tgz",
            "integrity": "sha512-saE57nupxk6v3HY35+jzBwYa0rKSy0XR8JSxZPwgLr7ys0IBzhGviA1/TUGJLmSVqs8pb9AnvICXEuOHLprYTw==",
            "license": "MIT",
            "dependencies": {
                "tr46": "~0.0.3",
                "webidl-conversions": "^3.0.0"
            }
        },
        "node_modules/winston": {
            "version": "3.19.0",
            "resolved": "https://registry.npmjs.org/winston/-/winston-3.19.0.tgz",
            "integrity": "sha512-LZNJgPzfKR+/J3cHkxcpHKpKKvGfDZVPS4hfJCc4cCG0CgYzvlD6yE/S3CIL/Yt91ak327YCpiF/0MyeZHEHKA==",
            "license": "MIT",
            "dependencies": {
                "@colors/colors": "^1.6.0",
                "@dabh/diagnostics": "^2.0.8",
                "async": "^3.2.3",
                "is-stream": "^2.0.0",
                "logform": "^2.7.0",
                "one-time": "^1.0.0",
                "readable-stream": "^3.4.0",
                "safe-stable-stringify": "^2.3.1",
                "stack-trace": "0.0.x",
                "triple-beam": "^1.3.0",
                "winston-transport": "^4.9.0"
            },
            "engines": {
                "node": ">= 12.0.0"
            }
        },
        "node_modules/winston-daily-rotate-file": {
            "version": "4.7.1",
            "resolved": "https://registry.npmjs.org/winston-daily-rotate-file/-/winston-daily-rotate-file-4.7.1.tgz",
            "integrity": "sha512-7LGPiYGBPNyGHLn9z33i96zx/bd71pjBn9tqQzO3I4Tayv94WPmBNwKC7CO1wPHdP9uvu+Md/1nr6VSH9h0iaA==",
            "license": "MIT",
            "dependencies": {
                "file-stream-rotator": "^0.6.1",
                "object-hash": "^2.0.1",
                "triple-beam": "^1.3.0",
                "winston-transport": "^4.4.0"
            },
            "engines": {
                "node": ">=8"
            },
            "peerDependencies": {
                "winston": "^3"
            }
        },
        "node_modules/winston-transport": {
            "version": "4.9.0",
            "resolved": "https://registry.npmjs.org/winston-transport/-/winston-transport-4.9.0.tgz",
            "integrity": "sha512-8drMJ4rkgaPo1Me4zD/3WLfI/zPdA9o2IipKODunnGDcuqbHwjsbB79ylv04LCGGzU0xQ6vTznOMpQGaLhhm6A==",
            "license": "MIT",
            "dependencies": {
                "logform": "^2.7.0",
                "readable-stream": "^3.6.2",
                "triple-beam": "^1.3.0"
            },
            "engines": {
                "node": ">= 12.0.0"
            }
        }
    }
}

```

---

## 📄 package.json

**Relative Path:** `backend\package.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\package.json`

```json
{
    "name": "ai-code-reviewer-backend",
    "version": "1.0.0",
    "description": "AI Code Reviewer SaaS Backend API",
    "main": "src/server.js",
    "scripts": {
        "dev": "nodemon src/server.js",
        "start": "node src/server.js",
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:studio": "prisma studio",
        "prisma:deploy": "prisma migrate deploy"
    },
    "dependencies": {
        "@prisma/client": "^5.7.0",
        "bcryptjs": "^2.4.3",
        "cookie-parser": "^1.4.6",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "express-rate-limit": "^7.1.5",
        "express-validator": "^7.0.1",
        "helmet": "^7.1.0",
        "jsonwebtoken": "^9.0.2",
        "morgan": "^1.10.0",
        "openai": "^4.20.1",
        "winston": "^3.11.0",
        "winston-daily-rotate-file": "^4.7.1",
        "axios": "^1.6.8"
    },
    "devDependencies": {
        "nodemon": "^3.0.2",
        "prisma": "^5.7.0"
    },
    "engines": {
        "node": ">=18.0.0"
    }
}

```

---

## 📄 .14129d6d712edbc1f8bf362cb11b4993aed747ca-audit.json

**Relative Path:** `backend\logs\.14129d6d712edbc1f8bf362cb11b4993aed747ca-audit.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\logs\.14129d6d712edbc1f8bf362cb11b4993aed747ca-audit.json`

```json
{
    "keep": {
        "days": true,
        "amount": 7
    },
    "auditLog": "/app/logs/.14129d6d712edbc1f8bf362cb11b4993aed747ca-audit.json",
    "files": [
        {
            "date": 1782987403313,
            "name": "/app/logs/combined-2026-07-02.log",
            "hash": "a6e773f3f522a9c4140538e5b35b0c37440f03d5e3e69bf9101ade5dc9b58559"
        }
    ],
    "hashType": "sha256"
}
```

---

## 📄 .67729f8fcb1b33197ed19709eea93e1b0ec2469c-audit.json

**Relative Path:** `backend\logs\.67729f8fcb1b33197ed19709eea93e1b0ec2469c-audit.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\logs\.67729f8fcb1b33197ed19709eea93e1b0ec2469c-audit.json`

```json
{
    "keep": {
        "days": true,
        "amount": 14
    },
    "auditLog": "/app/logs/.67729f8fcb1b33197ed19709eea93e1b0ec2469c-audit.json",
    "files": [
        {
            "date": 1781930451721,
            "name": "/app/logs/error-2026-06-20.log",
            "hash": "8f60606830d183ed1832c03570f18ab97ee743ccd89117d4d5ed2295a91aa1b7"
        },
        {
            "date": 1782198739887,
            "name": "/app/logs/error-2026-06-23.log",
            "hash": "4e9bfb3ae88579565f70d9865a502076449b5fc0c124bae1320d9babeb5e7a57"
        },
        {
            "date": 1782987403290,
            "name": "/app/logs/error-2026-07-02.log",
            "hash": "1a6f8dcce2f40303d3c305d40af0178d908a34512f82ccfe8366d312aba01be3"
        }
    ],
    "hashType": "sha256"
}
```

---

## 📄 Dockerfile

**Relative Path:** `backend\secrets\Dockerfile`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\secrets\Dockerfile`

```dockerfile
FROM node:18-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN mkdir -p logs

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
```

---

## 📄 package.json

**Relative Path:** `backend\secrets\package.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\secrets\package.json`

```json
{
    "name": "ai-code-reviewer-backend",
    "version": "1.0.0",
    "description": "AI Code Reviewer SaaS Backend API",
    "main": "src/server.js",
    "scripts": {
        "dev": "nodemon src/server.js",
        "start": "node src/server.js",
        "prisma:generate": "prisma generate",
        "prisma:migrate": "prisma migrate dev",
        "prisma:studio": "prisma studio",
        "prisma:deploy": "prisma migrate deploy"
    },
    "dependencies": {
        "@prisma/client": "^5.7.0",
        "axios": "^1.6.2",
        "bcryptjs": "^2.4.3",
        "cookie-parser": "^1.4.6",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "express-rate-limit": "^7.1.5",
        "express-validator": "^7.0.1",
        "helmet": "^7.1.0",
        "jsonwebtoken": "^9.0.2",
        "morgan": "^1.10.0",
        "openai": "^4.20.1",
        "winston": "^3.11.0",
        "winston-daily-rotate-file": "^4.7.1"
    },
    "devDependencies": {
        "nodemon": "^3.0.2",
        "prisma": "^5.7.0"
    },
    "engines": {
        "node": ">=18.0.0"
    }
}
```

---

## 📄 app.js

**Relative Path:** `backend\src\app.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\app.js`

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const logger = require('./config/logger');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const reviewRoutes = require('./routes/review.routes');
const historyRoutes = require('./routes/history.routes');

const app = express();

// Security headers
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// HTTP request logging
const morganStream = {
    write: (message) => logger.http(message.trim()),
};
app.use(morgan('combined', { stream: morganStream }));

// Global rate limiter
app.use(globalRateLimiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/history', historyRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
```

---

## 📄 server.js

**Relative Path:** `backend\src\server.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\server.js`

```javascript
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const app = require('./app');
const logger = require('./config/logger');
const prisma = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        const server = app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);
            server.close(async () => {
                await prisma.$disconnect();
                logger.info('💀 Server and database connections closed');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
```

---

## 📄 database.js

**Relative Path:** `backend\src\config\database.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\config\database.js`

```javascript
const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
});

if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
        logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
    });
}

prisma.$on('error', (e) => {
    logger.error('Prisma error:', e);
});

prisma.$on('warn', (e) => {
    logger.warn('Prisma warning:', e);
});

module.exports = prisma;
```

---

## 📄 logger.js

**Relative Path:** `backend\src\config\logger.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\config\logger.js`

```javascript
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

const logDir = path.join(process.cwd(), 'logs');

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
    })
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const transports = [
    new winston.transports.Console({
        format: consoleFormat,
    }),
    new DailyRotateFile({
        filename: path.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: fileFormat,
        maxSize: '20m',
        maxFiles: '14d',
    }),
    new DailyRotateFile({
        filename: path.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        format: fileFormat,
        maxSize: '20m',
        maxFiles: '7d',
    }),
];

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels,
    transports,
    exitOnError: false,
});

module.exports = logger;
```

---

## 📄 oauth.js

**Relative Path:** `backend\src\config\oauth.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\config\oauth.js`

```javascript
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USERINFO_URL = 'https://api.github.com/user';
const GITHUB_EMAIL_URL = 'https://api.github.com/user/emails';

const getGoogleAuthUrl = (state) => {
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        state,
    });
    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
};

const getGithubAuthUrl = (state) => {
    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
        scope: 'read:user user:email',
        state,
    });
    return `${GITHUB_AUTH_URL}?${params.toString()}`;
};

module.exports = {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    FRONTEND_URL,
    GOOGLE_TOKEN_URL,
    GOOGLE_USERINFO_URL,
    GITHUB_TOKEN_URL,
    GITHUB_USERINFO_URL,
    GITHUB_EMAIL_URL,
    getGoogleAuthUrl,
    getGithubAuthUrl,
};
```

---

## 📄 openai.js

**Relative Path:** `backend\src\config\openai.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\config\openai.js`

```javascript
const OpenAI = require('openai');
const logger = require('./logger');

// Ollama runs locally at port 11434
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://host.docker.internal:11434/v1';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

if (!OLLAMA_MODEL) {
    logger.warn('⚠️ OLLAMA_MODEL is not set. AI features will not work.');
}

const openai = new OpenAI({
    baseURL: OLLAMA_BASE_URL,
    apiKey: 'ollama', // Ollama doesn't require a real API key
});

logger.info(`🤖 Using Ollama model: ${OLLAMA_MODEL}`);

module.exports = openai;

```

---

## 📄 auth.controller.js

**Relative Path:** `backend\src\controllers\auth.controller.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\controllers\auth.controller.js`

```javascript
const axios = require('axios');
const authService = require('../services/auth.service');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, setCookieOptions } = require('../utils/jwt');
const { sendSuccess, createError } = require('../utils/response');
const logger = require('../config/logger');
const oauthConfig = require('../config/oauth');
const { generateOAuthState, validateOAuthState } = require('../middleware/oauth.middleware');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await authService.registerUser({ name, email, password });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        sendSuccess(res, { user, accessToken }, 'Account created successfully', 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await authService.loginUser({ email, password });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        sendSuccess(res, { user, accessToken }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return next(createError('Refresh token required', 401));
        }

        let decoded;
        try {
            decoded = verifyRefreshToken(refreshToken);
        } catch {
            return next(createError('Invalid or expired refresh token', 401));
        }

        const user = await authService.getUserById(decoded.userId);
        const newAccessToken = generateAccessToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', newRefreshToken, setCookieOptions());
        sendSuccess(res, { accessToken: newAccessToken }, 'Token refreshed');
    } catch (error) {
        next(error);
    }
};

const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    sendSuccess(res, {}, 'Logged out successfully');
};

const getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        sendSuccess(res, { user });
    } catch (error) {
        next(error);
    }
};

// ─── Google OAuth ──────────────────────────────────────────────────────────────

const googleLogin = (req, res) => {
    const state = generateOAuthState();
    const url = oauthConfig.getGoogleAuthUrl(state);
    res.redirect(url);
};

const googleCallback = async (req, res, next) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            logger.warn(`Google OAuth error: ${error}`);
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_denied`);
        }

        if (!validateOAuthState(state)) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_state_invalid`);
        }

        if (!code) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_code`);
        }

        // Exchange code for tokens
        const tokenRes = await axios.post(oauthConfig.GOOGLE_TOKEN_URL, {
            code,
            client_id: oauthConfig.GOOGLE_CLIENT_ID,
            client_secret: oauthConfig.GOOGLE_CLIENT_SECRET,
            redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
            grant_type: 'authorization_code',
        });

        const { access_token } = tokenRes.data;

        // Fetch user info
        const userInfoRes = await axios.get(oauthConfig.GOOGLE_USERINFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { sub: providerId, email, name, picture: avatar } = userInfoRes.data;

        if (!email) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_email`);
        }

        const user = await authService.findOrCreateOAuthUser({
            email,
            name: name || email.split('@')[0],
            avatar,
            provider: 'google',
            providerId,
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        // Redirect to frontend with token
        res.redirect(`${oauthConfig.FRONTEND_URL}/oauth/callback?token=${accessToken}`);
    } catch (error) {
        logger.error('Google OAuth callback error:', error);
        res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

// ─── GitHub OAuth ──────────────────────────────────────────────────────────────

const githubLogin = (req, res) => {
    const state = generateOAuthState();
    const url = oauthConfig.getGithubAuthUrl(state);
    res.redirect(url);
};

const githubCallback = async (req, res, next) => {
    try {
        const { code, state, error } = req.query;

        if (error) {
            logger.warn(`GitHub OAuth error: ${error}`);
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_denied`);
        }

        if (!validateOAuthState(state)) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_state_invalid`);
        }

        if (!code) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_code`);
        }

        // Exchange code for token
        const tokenRes = await axios.post(
            oauthConfig.GITHUB_TOKEN_URL,
            {
                client_id: oauthConfig.GITHUB_CLIENT_ID,
                client_secret: oauthConfig.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/github/callback`,
            },
            { headers: { Accept: 'application/json' } }
        );

        const { access_token } = tokenRes.data;

        if (!access_token) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_failed`);
        }

        // Fetch user info
        const [userInfoRes, emailsRes] = await Promise.all([
            axios.get(oauthConfig.GITHUB_USERINFO_URL, {
                headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'CodeReviewerApp' },
            }),
            axios.get(oauthConfig.GITHUB_EMAIL_URL, {
                headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'CodeReviewerApp' },
            }),
        ]);

        const { id: providerId, name, avatar_url: avatar, login } = userInfoRes.data;

        // Get primary verified email
        const primaryEmail = emailsRes.data.find((e) => e.primary && e.verified);
        const email = primaryEmail?.email || emailsRes.data[0]?.email;

        if (!email) {
            return res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_no_email`);
        }

        const user = await authService.findOrCreateOAuthUser({
            email,
            name: name || login || email.split('@')[0],
            avatar,
            provider: 'github',
            providerId: String(providerId),
        });

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        res.cookie('refreshToken', refreshToken, setCookieOptions());

        res.redirect(`${oauthConfig.FRONTEND_URL}/oauth/callback?token=${accessToken}`);
    } catch (error) {
        logger.error('GitHub OAuth callback error:', error);
        res.redirect(`${oauthConfig.FRONTEND_URL}/login?error=oauth_failed`);
    }
};

module.exports = { register, login, refresh, logout, getMe, googleLogin, googleCallback, githubLogin, githubCallback };
```

---

## 📄 history.controller.js

**Relative Path:** `backend\src\controllers\history.controller.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\controllers\history.controller.js`

```javascript
const historyService = require('../services/history.service');
const { sendSuccess } = require('../utils/response');

const getHistory = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);

        const result = await historyService.getUserHistory(req.user.id, { page, limit });
        sendSuccess(res, result);
    } catch (error) {
        next(error);
    }
};

const deleteReview = async (req, res, next) => {
    try {
        const result = await historyService.deleteReview(req.params.id, req.user.id);
        sendSuccess(res, result, 'Review deleted successfully');
    } catch (error) {
        next(error);
    }
};

module.exports = { getHistory, deleteReview };
```

---

## 📄 review.controller.js

**Relative Path:** `backend\src\controllers\review.controller.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\controllers\review.controller.js`

```javascript
const reviewService = require('../services/review.service');
const { sendSuccess } = require('../utils/response');

const createReview = async (req, res, next) => {
    try {
        const { code, language } = req.body;
        const review = await reviewService.createReview({
            userId: req.user.id,
            code,
            language,
        });
        sendSuccess(res, { review }, 'Code review completed', 201);
    } catch (error) {
        next(error);
    }
};

const getReview = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewById(req.params.id, req.user.id);
        sendSuccess(res, { review });
    } catch (error) {
        next(error);
    }
};

const getFullReview = async (req, res, next) => {
    try {
        const review = await reviewService.getReviewFullById(req.params.id, req.user.id);
        sendSuccess(res, { review });
    } catch (error) {
        next(error);
    }
};

module.exports = { createReview, getReview, getFullReview };
```

---

## 📄 auth.middleware.js

**Relative Path:** `backend\src\middleware\auth.middleware.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\middleware\auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(createError('Access token required', 401));
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return next(createError('Access token required', 401));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return next(createError('Token expired', 401, 'TOKEN_EXPIRED'));
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return next(createError('Invalid token', 401));
            }
            return next(createError('Token verification failed', 401));
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true },
        });

        if (!user) {
            return next(createError('User not found', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        next(createError('Authentication failed', 500));
    }
};

module.exports = { authenticate };
```

---

## 📄 errorHandler.js

**Relative Path:** `backend\src\middleware\errorHandler.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\middleware\errorHandler.js`

```javascript
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Prisma errors
    if (err.code === 'P2002') {
        statusCode = 409;
        message = 'A record with this information already exists';
    } else if (err.code === 'P2025') {
        statusCode = 404;
        message = 'Record not found';
    } else if (err.code === 'P2003') {
        statusCode = 400;
        message = 'Invalid reference';
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    logger.error(`[${statusCode}] ${message}`, {
        path: req.path,
        method: req.method,
        ip: req.ip,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(statusCode).json({
        success: false,
        message,
        code: err.code || undefined,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
```

---

## 📄 oauth.middleware.js

**Relative Path:** `backend\src\middleware\oauth.middleware.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\middleware\oauth.middleware.js`

```javascript
const crypto = require('crypto');

const oauthStates = new Map();

const generateOAuthState = () => {
    const state = crypto.randomBytes(32).toString('hex');
    oauthStates.set(state, { createdAt: Date.now() });
    // Clean up old states (older than 10 minutes)
    for (const [key, val] of oauthStates.entries()) {
        if (Date.now() - val.createdAt > 10 * 60 * 1000) {
            oauthStates.delete(key);
        }
    }
    return state;
};

const validateOAuthState = (state) => {
    if (!state || !oauthStates.has(state)) {
        return false;
    }
    const entry = oauthStates.get(state);
    oauthStates.delete(state);
    // Reject states older than 10 minutes
    if (Date.now() - entry.createdAt > 10 * 60 * 1000) {
        return false;
    }
    return true;
};

module.exports = { generateOAuthState, validateOAuthState };
```

---

## 📄 rateLimiter.js

**Relative Path:** `backend\src\middleware\rateLimiter.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\middleware\rateLimiter.js`

```javascript
const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const globalRateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000 / 60) + ' minutes',
    },
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    },
});

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
    handler: (req, res, next, options) => {
        logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
    },
});

const aiRateLimiter = rateLimit({
    windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
    max: parseInt(process.env.AI_RATE_LIMIT_MAX) || 10,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
    message: {
        success: false,
        message: 'AI review limit reached. You can submit 10 reviews per hour.',
    },
    handler: (req, res, next, options) => {
        logger.warn(`AI rate limit exceeded for user: ${req.user?.id || req.ip}`);
        res.status(429).json(options.message);
    },
});

module.exports = { globalRateLimiter, authRateLimiter, aiRateLimiter };
```

---

## 📄 validate.middleware.js

**Relative Path:** `backend\src\middleware\validate.middleware.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\middleware\validate.middleware.js`

```javascript
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

module.exports = { validate };
```

---

## 📄 auth.routes.js

**Relative Path:** `backend\src\routes\auth.routes.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\routes\auth.routes.js`

```javascript
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
];

// Standard auth
router.post('/register', authRateLimiter, registerValidation, validate, authController.register);
router.post('/login', authRateLimiter, loginValidation, validate, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

// Google OAuth
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

// GitHub OAuth
router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

module.exports = router;
```

---

## 📄 history.routes.js

**Relative Path:** `backend\src\routes\history.routes.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\routes\history.routes.js`

```javascript
const express = require('express');
const { param } = require('express-validator');
const historyController = require('../controllers/history.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', historyController.getHistory);
router.delete('/:id', [param('id').notEmpty().withMessage('Review ID required'), validate], historyController.deleteReview);

module.exports = router;
```

---

## 📄 review.routes.js

**Relative Path:** `backend\src\routes\review.routes.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\routes\review.routes.js`

```javascript
const express = require('express');
const { body, param } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
    'html', 'css', 'sql', 'bash', 'other',
];

const reviewValidation = [
    body('code')
        .notEmpty().withMessage('Code is required')
        .isLength({ min: 10 }).withMessage('Code must be at least 10 characters')
        .isLength({ max: 50000 }).withMessage('Code exceeds 50,000 character limit'),
    body('language')
        .notEmpty().withMessage('Language is required')
        .isIn(SUPPORTED_LANGUAGES).withMessage(`Language must be one of: ${SUPPORTED_LANGUAGES.join(', ')}`),
];

const idValidation = [param('id').notEmpty().withMessage('Review ID required'), validate];

router.use(authenticate);

router.post('/', aiRateLimiter, reviewValidation, validate, reviewController.createReview);
router.get('/:id', idValidation, reviewController.getReview);
router.get('/:id/full', idValidation, reviewController.getFullReview);

module.exports = router;
```

---

## 📄 ai.service.js

**Relative Path:** `backend\src\services\ai.service.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\services\ai.service.js`

```javascript
const crypto = require('crypto');
const { performance } = require('perf_hooks');
const openai = require('../config/openai');
const logger = require('../config/logger');
const { createError } = require('../utils/response');

// In-memory cache for code review results (FIFO, capped size)
const reviewCache = new Map();
const MAX_CACHE_SIZE = 100;

const getCacheKey = (code, language) => {
    return crypto.createHash('sha256').update(`${language}:${code}`).digest('hex');
};

const REVIEW_SYSTEM_PROMPT = `You are an expert senior software developer reviewing code.
Analyze the provided code and output ONLY a valid JSON object in this exact schema:
{
  "score": <integer 0-100>,
  "issues": [<string>, ...], // max 4 actual bugs, vulnerabilities, or bad practices
  "suggestions": [<string>, ...], // max 4 optimizations or cleanups
  "lineFixes": [ // max 5 line-specific fixes
    {
      "matchSnippet": "<exact code substring to find>",
      "fix": "<corrected replacement code>",
      "type": "error" | "improvement"
    }
  ]
}
Rules:
1. Output ONLY the raw JSON object. Do not include any markdown backticks, code blocks, or text outside the JSON.
2. "matchSnippet" MUST be an exact copy-paste substring of the provided code.
3. Keep feedback brief, precise, and actionable.`;

const analyzeCode = async (code, language) => {
    const totalStart = performance.now();
    const cacheKey = getCacheKey(code, language);

    // 1. Check in-memory cache
    if (reviewCache.has(cacheKey)) {
        logger.info(`[CACHE HIT] Found duplicate review cache for code hash: ${cacheKey}`);
        const cachedResult = reviewCache.get(cacheKey);
        const totalDuration = performance.now() - totalStart;
        logger.info(`[LATENCY] Total time (Cache Hit): ${totalDuration.toFixed(2)}ms`);
        return cachedResult;
    }

    // 2. Prompt construction stage
    const promptStart = performance.now();
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
    const systemPrompt = REVIEW_SYSTEM_PROMPT;
    const userPrompt = `Language: ${language}\n\nCode to review:\n\`\`\`${language}\n${code}\n\`\`\`\n\nProvide your code review as a JSON object only.`;
    const promptDuration = performance.now() - promptStart;

    // 3. Model inference stage (with JSON mode & Timeout)
    const inferenceStart = performance.now();
    let response;
    try {
        logger.info(`Starting AI code analysis using Ollama model: ${OLLAMA_MODEL}`);
        response = await openai.chat.completions.create({
            model: OLLAMA_MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 1200, // Enforce shorter token limit to decrease inference duration
            response_format: { type: 'json_object' }, // Instruct Ollama to output valid JSON strictly
        }, {
            timeout: 45000, // 45 seconds timeout
        });
    } catch (error) {
        if (error.statusCode) throw error;

        // Gracefully catch connection failures to Ollama
        const isConnectionError = 
            error.code === 'ECONNREFUSED' || 
            error.code === 'ENOTFOUND' ||
            error.code === 'ETIMEDOUT' ||
            error.cause?.code === 'ECONNREFUSED' ||
            error.cause?.code === 'ENOTFOUND' ||
            error.cause?.code === 'ETIMEDOUT' ||
            error.name === 'APIConnectionError' ||
            error.message?.toLowerCase().includes('fetch failed') ||
            error.message?.toLowerCase().includes('connection');

        if (isConnectionError) {
            throw createError('Cannot connect to Ollama. Make sure Ollama is running on host.docker.internal:11434.', 503);
        }

        if (error.status === 429) {
            throw createError('Ollama rate limit reached. Please try again later.', 429);
        }
        if (error.status === 401) {
            throw createError('Ollama API authentication failed', 500);
        }
        if (error.status === 400) {
            throw createError('Code content was rejected by AI service', 400);
        }

        logger.error('Ollama API error:', error);
        throw createError('AI service is temporarily unavailable', 503);
    }
    const inferenceDuration = performance.now() - inferenceStart;

    // 4. Parsing and validation stage
    const parsingStart = performance.now();
    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw createError('AI returned empty response', 500);
    }

    // Clean response markup just in case
    let cleanedContent = content.trim();
    cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedContent = jsonMatch[0];
    }

    let parsed;
    try {
        parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
        logger.error('Failed to parse AI response:', content);
        throw createError('AI returned invalid JSON response', 500);
    }

    if (
        typeof parsed.score !== 'number' ||
        !Array.isArray(parsed.issues) ||
        !Array.isArray(parsed.suggestions)
    ) {
        logger.error('AI response missing required fields:', parsed);
        throw createError('AI returned incomplete response structure', 500);
    }

    // Validate lineFixes — only keep entries where matchSnippet actually appears in code
    const lineFixes = Array.isArray(parsed.lineFixes)
        ? parsed.lineFixes
            .map((lf) => {
                if (!lf || typeof lf.matchSnippet !== 'string' || typeof lf.fix !== 'string') return null;

                // Try exact match first
                if (code.includes(lf.matchSnippet)) {
                    return lf;
                }

                // Try trimmed match
                const trimmed = lf.matchSnippet.trim();
                if (trimmed.length > 0 && code.includes(trimmed)) {
                    return {
                        ...lf,
                        matchSnippet: trimmed,
                    };
                }

                return null;
            })
            .filter((lf) => lf && ['error', 'improvement'].includes(lf.type))
            .slice(0, 5) // Cap at 5 fixes to limit response payload and processing time
        : [];

    const result = {
        score: Math.min(100, Math.max(0, Math.round(parsed.score))),
        issues: parsed.issues.filter((i) => typeof i === 'string').slice(0, 4),
        suggestions: parsed.suggestions.filter((s) => typeof s === 'string').slice(0, 4),
        lineFixes,
    };

    const parsingDuration = performance.now() - parsingStart;
    const totalDuration = performance.now() - totalStart;

    logger.info(`[LATENCY STAGES]
- Prompt construction: ${promptDuration.toFixed(2)}ms
- Model inference: ${inferenceDuration.toFixed(2)}ms
- Parsing & validation: ${parsingDuration.toFixed(2)}ms
- Total end-to-end: ${totalDuration.toFixed(2)}ms`);

    // Save to cache
    if (reviewCache.size >= MAX_CACHE_SIZE) {
        const firstKey = reviewCache.keys().next().value;
        reviewCache.delete(firstKey);
    }
    reviewCache.set(cacheKey, result);

    return result;
};

module.exports = { analyzeCode };
```

---

## 📄 auth.service.js

**Relative Path:** `backend\src\services\auth.service.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\services\auth.service.js`

```javascript
const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const SALT_ROUNDS = 12;

const registerUser = async ({ name, email, password }) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw createError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
    });

    logger.info(`New user registered: ${email}`);
    return user;
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw createError('Invalid email or password', 401);
    }

    if (!user.password) {
        throw createError(`This account uses ${user.provider || 'social'} login. Please sign in with that provider.`, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw createError('Invalid email or password', 401);
    }

    logger.info(`User logged in: ${email}`);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        provider: user.provider,
        createdAt: user.createdAt,
    };
};

const findOrCreateOAuthUser = async ({ email, name, avatar, provider, providerId }) => {
    // Check by provider + providerId first (most reliable)
    let user = await prisma.user.findUnique({
        where: { provider_providerId: { provider, providerId } },
    });

    if (user) {
        // Update avatar in case it changed
        user = await prisma.user.update({
            where: { id: user.id },
            data: { avatar, name },
            select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
        });
        logger.info(`OAuth user logged in: ${email} via ${provider}`);
        return user;
    }

    // Check if email already exists (account merging prevention)
    const existingByEmail = await prisma.user.findUnique({ where: { email } });

    if (existingByEmail) {
        if (existingByEmail.provider && existingByEmail.provider !== provider) {
            throw createError(
                `This email is already registered with ${existingByEmail.provider}. Please sign in using that provider.`,
                409
            );
        }
        // Update existing email-based account to link OAuth
        user = await prisma.user.update({
            where: { id: existingByEmail.id },
            data: { provider, providerId, avatar, name },
            select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
        });
        logger.info(`Linked OAuth provider ${provider} to existing user: ${email}`);
        return user;
    }

    // Create new user
    user = await prisma.user.create({
        data: { email, name, avatar, provider, providerId },
        select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
    });

    logger.info(`New OAuth user created: ${email} via ${provider}`);
    return user;
};

const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, avatar: true, provider: true, createdAt: true },
    });

    if (!user) {
        throw createError('User not found', 404);
    }

    return user;
};

module.exports = { registerUser, loginUser, findOrCreateOAuthUser, getUserById };
```

---

## 📄 history.service.js

**Relative Path:** `backend\src\services\history.service.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\services\history.service.js`

```javascript
const prisma = require('../config/database');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const getUserHistory = async (userId, { page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where: { userId },
            select: {
                id: true,
                language: true,
                score: true,
                issues: true,
                suggestions: true,
                createdAt: true,
                code: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.review.count({ where: { userId } }),
    ]);

    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: skip + reviews.length < total,
        },
    };
};

const deleteReview = async (reviewId, userId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
    });

    if (!review) {
        throw createError('Review not found', 404);
    }

    await prisma.review.delete({ where: { id: reviewId } });
    logger.info(`Review deleted: ${reviewId} by user: ${userId}`);

    return { id: reviewId };
};

module.exports = { getUserHistory, deleteReview };
```

---

## 📄 review.service.js

**Relative Path:** `backend\src\services\review.service.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\services\review.service.js`

```javascript
const prisma = require('../config/database');
const { analyzeCode } = require('./ai.service');
const { createError } = require('../utils/response');
const logger = require('../config/logger');

const createReview = async ({ userId, code, language }) => {
    const aiResult = await analyzeCode(code, language);

    const review = await prisma.review.create({
        data: {
            userId,
            code,
            language,
            score: aiResult.score,
            issues: aiResult.issues,
            suggestions: aiResult.suggestions,
            lineFixes: aiResult.lineFixes || [],
        },
        select: {
            id: true,
            code: true,
            language: true,
            score: true,
            issues: true,
            suggestions: true,
            lineFixes: true,
            createdAt: true,
        },
    });

    logger.info(`Review created: ${review.id} for user: ${userId}`);
    return review;
};

const getReviewById = async (reviewId, userId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
        select: {
            id: true,
            code: true,
            language: true,
            score: true,
            issues: true,
            suggestions: true,
            lineFixes: true,
            createdAt: true,
        },
    });

    if (!review) {
        throw createError('Review not found', 404);
    }

    return review;
};

const getReviewFullById = async (reviewId, userId) => {
    const review = await prisma.review.findFirst({
        where: { id: reviewId, userId },
        select: {
            id: true,
            code: true,
            language: true,
            score: true,
            issues: true,
            suggestions: true,
            lineFixes: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!review) {
        throw createError('Review not found', 404);
    }

    return review;
};

module.exports = { createReview, getReviewById, getReviewFullById };
```

---

## 📄 jwt.js

**Relative Path:** `backend\src\utils\jwt.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\utils\jwt.js`

```javascript
const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

const setCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    setCookieOptions,
};
```

---

## 📄 response.js

**Relative Path:** `backend\src\utils\response.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\backend\src\utils\response.js`

```javascript
const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const sendError = (res, message = 'Error', statusCode = 500, errors = null) => {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(statusCode).json(response);
};

const createError = (message, statusCode = 500, code = null) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    if (code) error.code = code;
    return error;
};

module.exports = { sendSuccess, sendError, createError };
```

---

## 📄 Dockerfile

**Relative Path:** `frontend\Dockerfile`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\Dockerfile`

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf '%s\n' \
  'server {' \
  '    listen 80;' \
  '    server_name _;' \
  '    root /usr/share/nginx/html;' \
  '    index index.html;' \
  '' \
  '    gzip on;' \
  '    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;' \
  '' \
  '    location / {' \
  '        try_files $uri $uri/ /index.html;' \
  '    }' \
  '' \
  '    location /api {' \
  '        proxy_pass http://backend:5000;' \
  '        proxy_http_version 1.1;' \
  '        proxy_set_header Upgrade $http_upgrade;' \
  '        proxy_set_header Connection "upgrade";' \
  '        proxy_set_header Host $host;' \
  '        proxy_cache_bypass $http_upgrade;' \
  '    }' \
  '' \
  '    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {' \
  '        expires 1y;' \
  '        add_header Cache-Control "public, immutable";' \
  '    }' \
  '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 📄 index.html

**Relative Path:** `frontend\index.html`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\index.html`

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Emendator — a quiet workspace for reviewing and refining code." />
    <meta name="theme-color" content="#faf9f7" />
    <title>Emendator — Code, refined.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body class="bg-paper-100 text-ink-900 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>

```

---

## 📄 package-lock.json

**Relative Path:** `frontend\package-lock.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\package-lock.json`

```json
{
    "name": "ai-code-reviewer-frontend",
    "version": "1.0.0",
    "lockfileVersion": 3,
    "requires": true,
    "packages": {
        "": {
            "name": "ai-code-reviewer-frontend",
            "version": "1.0.0",
            "dependencies": {
                "@monaco-editor/react": "^4.6.0",
                "axios": "^1.6.2",
                "lucide-react": "^0.294.0",
                "monaco-editor": "^0.44.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "react-hot-toast": "^2.4.1",
                "react-router-dom": "^6.20.1",
                "zustand": "^4.4.7"
            },
            "devDependencies": {
                "@types/react": "^18.2.42",
                "@types/react-dom": "^18.2.17",
                "@vitejs/plugin-react": "^4.2.1",
                "autoprefixer": "^10.4.16",
                "eslint": "^8.55.0",
                "eslint-plugin-react": "^7.33.2",
                "postcss": "^8.4.32",
                "tailwindcss": "^3.3.6",
                "vite": "^5.0.7"
            }
        },
        "node_modules/@alloc/quick-lru": {
            "version": "5.2.0",
            "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz",
            "integrity": "sha512-UrcABB+4bUrFABwbluTIBErXwvbsU/V7TZWfmbgJfbkwiBuziS9gxdODUyuiecfdGQ85jglMW6juS3+z5TsKLw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/@babel/code-frame": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
            "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/helper-validator-identifier": "^7.29.7",
                "js-tokens": "^4.0.0",
                "picocolors": "^1.1.1"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/compat-data": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
            "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/core": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
            "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/code-frame": "^7.29.7",
                "@babel/generator": "^7.29.7",
                "@babel/helper-compilation-targets": "^7.29.7",
                "@babel/helper-module-transforms": "^7.29.7",
                "@babel/helpers": "^7.29.7",
                "@babel/parser": "^7.29.7",
                "@babel/template": "^7.29.7",
                "@babel/traverse": "^7.29.7",
                "@babel/types": "^7.29.7",
                "@jridgewell/remapping": "^2.3.5",
                "convert-source-map": "^2.0.0",
                "debug": "^4.1.0",
                "gensync": "^1.0.0-beta.2",
                "json5": "^2.2.3",
                "semver": "^6.3.1"
            },
            "engines": {
                "node": ">=6.9.0"
            },
            "funding": {
                "type": "opencollective",
                "url": "https://opencollective.com/babel"
            }
        },
        "node_modules/@babel/generator": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.7.tgz",
            "integrity": "sha512-DkXD5OJQaAQIdZ1bt3UZdEnHAn9Imd3IVBdX03UFe+ony9Ojw5pzr9YVKGDY1jt+Gcn/FnGkNf8r+Vj5NOJWtQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/parser": "^7.29.7",
                "@babel/types": "^7.29.7",
                "@jridgewell/gen-mapping": "^0.3.12",
                "@jridgewell/trace-mapping": "^0.3.28",
                "jsesc": "^3.0.2"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-compilation-targets": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
            "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/compat-data": "^7.29.7",
                "@babel/helper-validator-option": "^7.29.7",
                "browserslist": "^4.24.0",
                "lru-cache": "^5.1.1",
                "semver": "^6.3.1"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-globals": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
            "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-module-imports": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
            "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/traverse": "^7.29.7",
                "@babel/types": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-module-transforms": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
            "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/helper-module-imports": "^7.29.7",
                "@babel/helper-validator-identifier": "^7.29.7",
                "@babel/traverse": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            },
            "peerDependencies": {
                "@babel/core": "^7.0.0"
            }
        },
        "node_modules/@babel/helper-plugin-utils": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.29.7.tgz",
            "integrity": "sha512-G7sHYigPY17oO5SYWnfD/0MTBwVR781S/JI643e/JhUYgVgWE/61SoW3NH9KWUKyKq5LVh3npif99Wkt6j86Jw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-string-parser": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
            "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-validator-identifier": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
            "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helper-validator-option": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
            "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/helpers": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
            "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/template": "^7.29.7",
                "@babel/types": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/parser": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.7.tgz",
            "integrity": "sha512-hnORnjP/1P/zFEndoeX+n+t1RwWRJiJpM/jO7FW32Kn9r5+sJB2JWOdYo4L6k78j15eCwY3Gm/7364B1EMwtNg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/types": "^7.29.7"
            },
            "bin": {
                "parser": "bin/babel-parser.js"
            },
            "engines": {
                "node": ">=6.0.0"
            }
        },
        "node_modules/@babel/plugin-transform-react-jsx-self": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-self/-/plugin-transform-react-jsx-self-7.29.7.tgz",
            "integrity": "sha512-TL0hMc9xzy86VD31nUiwzd5otRAcyEPcsegCxolO0PvcXuH1v0kECe/UIznYFihpkvU5wg/jk4v0TTEFfm53fw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/helper-plugin-utils": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            },
            "peerDependencies": {
                "@babel/core": "^7.0.0-0"
            }
        },
        "node_modules/@babel/plugin-transform-react-jsx-source": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/plugin-transform-react-jsx-source/-/plugin-transform-react-jsx-source-7.29.7.tgz",
            "integrity": "sha512-06IyK09H3wi4cGbhDBwp5gUGo0IKtnYa8tyTiephirPCK6fbobVGiXMMI5zLQ4aKEYP3wZ3ArU44o+8KMrSG/Q==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/helper-plugin-utils": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            },
            "peerDependencies": {
                "@babel/core": "^7.0.0-0"
            }
        },
        "node_modules/@babel/template": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
            "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/code-frame": "^7.29.7",
                "@babel/parser": "^7.29.7",
                "@babel/types": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/traverse": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.7.tgz",
            "integrity": "sha512-EhlfNQtZ+NK22w5BM61ciuiq1m58ed33Wr1Xan//ZRTy6hgjnwyCffRYwzsGXdASJSUJ1guZILsErh1eQcl+zw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/code-frame": "^7.29.7",
                "@babel/generator": "^7.29.7",
                "@babel/helper-globals": "^7.29.7",
                "@babel/parser": "^7.29.7",
                "@babel/template": "^7.29.7",
                "@babel/types": "^7.29.7",
                "debug": "^4.3.1"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@babel/types": {
            "version": "7.29.7",
            "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.7.tgz",
            "integrity": "sha512-4zBIxpPzowiZpusoFkyGVwakdRJUyuH5PxQ/PrqghfdFWWasvnCdPfQXHrenDai+gyLARulZjZowCOj6fjT4pA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/helper-string-parser": "^7.29.7",
                "@babel/helper-validator-identifier": "^7.29.7"
            },
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/@esbuild/aix-ppc64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.21.5.tgz",
            "integrity": "sha512-1SDgH6ZSPTlggy1yI6+Dbkiz8xzpHJEVAlF/AM1tHPLsf5STom9rwtjE4hKAF20FfXXNTFqEYXyJNWh1GiZedQ==",
            "cpu": [
                "ppc64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "aix"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/android-arm": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.21.5.tgz",
            "integrity": "sha512-vCPvzSjpPHEi1siZdlvAlsPxXl7WbOVUBBAowWug4rJHb68Ox8KualB+1ocNvT5fjv6wpkX6o/iEpbDrf68zcg==",
            "cpu": [
                "arm"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "android"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/android-arm64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.21.5.tgz",
            "integrity": "sha512-c0uX9VAUBQ7dTDCjq+wdyGLowMdtR/GoC2U5IYk/7D1H1JYC0qseD7+11iMP2mRLN9RcCMRcjC4YMclCzGwS/A==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "android"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/android-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.21.5.tgz",
            "integrity": "sha512-D7aPRUUNHRBwHxzxRvp856rjUHRFW1SdQATKXH2hqA0kAZb1hKmi02OpYRacl0TxIGz/ZmXWlbZgjwWYaCakTA==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "android"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/darwin-arm64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.21.5.tgz",
            "integrity": "sha512-DwqXqZyuk5AiWWf3UfLiRDJ5EDd49zg6O9wclZ7kUMv2WRFr4HKjXp/5t8JZ11QbQfUS6/cRCKGwYhtNAY88kQ==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "darwin"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/darwin-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.21.5.tgz",
            "integrity": "sha512-se/JjF8NlmKVG4kNIuyWMV/22ZaerB+qaSi5MdrXtd6R08kvs2qCN4C09miupktDitvh8jRFflwGFBQcxZRjbw==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "darwin"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/freebsd-arm64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.21.5.tgz",
            "integrity": "sha512-5JcRxxRDUJLX8JXp/wcBCy3pENnCgBR9bN6JsY4OmhfUtIHe3ZW0mawA7+RDAcMLrMIZaf03NlQiX9DGyB8h4g==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "freebsd"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/freebsd-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.21.5.tgz",
            "integrity": "sha512-J95kNBj1zkbMXtHVH29bBriQygMXqoVQOQYA+ISs0/2l3T9/kj42ow2mpqerRBxDJnmkUDCaQT/dfNXWX/ZZCQ==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "freebsd"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-arm": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.21.5.tgz",
            "integrity": "sha512-bPb5AHZtbeNGjCKVZ9UGqGwo8EUu4cLq68E95A53KlxAPRmUyYv2D6F0uUI65XisGOL1hBP5mTronbgo+0bFcA==",
            "cpu": [
                "arm"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-arm64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.21.5.tgz",
            "integrity": "sha512-ibKvmyYzKsBeX8d8I7MH/TMfWDXBF3db4qM6sy+7re0YXya+K1cem3on9XgdT2EQGMu4hQyZhan7TeQ8XkGp4Q==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-ia32": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.21.5.tgz",
            "integrity": "sha512-YvjXDqLRqPDl2dvRODYmmhz4rPeVKYvppfGYKSNGdyZkA01046pLWyRKKI3ax8fbJoK5QbxblURkwK/MWY18Tg==",
            "cpu": [
                "ia32"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-loong64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.21.5.tgz",
            "integrity": "sha512-uHf1BmMG8qEvzdrzAqg2SIG/02+4/DHB6a9Kbya0XDvwDEKCoC8ZRWI5JJvNdUjtciBGFQ5PuBlpEOXQj+JQSg==",
            "cpu": [
                "loong64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-mips64el": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.21.5.tgz",
            "integrity": "sha512-IajOmO+KJK23bj52dFSNCMsz1QP1DqM6cwLUv3W1QwyxkyIWecfafnI555fvSGqEKwjMXVLokcV5ygHW5b3Jbg==",
            "cpu": [
                "mips64el"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-ppc64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.21.5.tgz",
            "integrity": "sha512-1hHV/Z4OEfMwpLO8rp7CvlhBDnjsC3CttJXIhBi+5Aj5r+MBvy4egg7wCbe//hSsT+RvDAG7s81tAvpL2XAE4w==",
            "cpu": [
                "ppc64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-riscv64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.21.5.tgz",
            "integrity": "sha512-2HdXDMd9GMgTGrPWnJzP2ALSokE/0O5HhTUvWIbD3YdjME8JwvSCnNGBnTThKGEB91OZhzrJ4qIIxk/SBmyDDA==",
            "cpu": [
                "riscv64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-s390x": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.21.5.tgz",
            "integrity": "sha512-zus5sxzqBJD3eXxwvjN1yQkRepANgxE9lgOW2qLnmr8ikMTphkjgXu1HR01K4FJg8h1kEEDAqDcZQtbrRnB41A==",
            "cpu": [
                "s390x"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/linux-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.21.5.tgz",
            "integrity": "sha512-1rYdTpyv03iycF1+BhzrzQJCdOuAOtaqHTWJZCWvijKD2N5Xu0TtVC8/+1faWqcP9iBCWOmjmhoH94dH82BxPQ==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/netbsd-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.21.5.tgz",
            "integrity": "sha512-Woi2MXzXjMULccIwMnLciyZH4nCIMpWQAs049KEeMvOcNADVxo0UBIQPfSmxB3CWKedngg7sWZdLvLczpe0tLg==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "netbsd"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/openbsd-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.21.5.tgz",
            "integrity": "sha512-HLNNw99xsvx12lFBUwoT8EVCsSvRNDVxNpjZ7bPn947b8gJPzeHWyNVhFsaerc0n3TsbOINvRP2byTZ5LKezow==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "openbsd"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/sunos-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.21.5.tgz",
            "integrity": "sha512-6+gjmFpfy0BHU5Tpptkuh8+uw3mnrvgs+dSPQXQOv3ekbordwnzTVEb4qnIvQcYXq6gzkyTnoZ9dZG+D4garKg==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "sunos"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/win32-arm64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.21.5.tgz",
            "integrity": "sha512-Z0gOTd75VvXqyq7nsl93zwahcTROgqvuAcYDUr+vOv8uHhNSKROyU961kgtCD1e95IqPKSQKH7tBTslnS3tA8A==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/win32-ia32": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.21.5.tgz",
            "integrity": "sha512-SWXFF1CL2RVNMaVs+BBClwtfZSvDgtL//G/smwAc5oVK/UPu2Gu9tIaRgFmYFFKrmg3SyAjSrElf0TiJ1v8fYA==",
            "cpu": [
                "ia32"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@esbuild/win32-x64": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.21.5.tgz",
            "integrity": "sha512-tQd/1efJuzPC6rCFwEvLtci/xNFcTZknmXs98FYDfGE4wP9ClFV98nyKrzJKVPMhdDnjzLhdUyMX4PsQAPjwIw==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ],
            "engines": {
                "node": ">=12"
            }
        },
        "node_modules/@eslint-community/eslint-utils": {
            "version": "4.9.1",
            "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
            "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "eslint-visitor-keys": "^3.4.3"
            },
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            },
            "funding": {
                "url": "https://opencollective.com/eslint"
            },
            "peerDependencies": {
                "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
            }
        },
        "node_modules/@eslint-community/regexpp": {
            "version": "4.12.2",
            "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
            "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
            }
        },
        "node_modules/@eslint/eslintrc": {
            "version": "2.1.4",
            "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-2.1.4.tgz",
            "integrity": "sha512-269Z39MS6wVJtsoUl10L60WdkhJVdPG24Q4eZTH3nnF6lpvSShEK3wQjDX9JRWAUPvPh7COouPpU9IrqaZFvtQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "ajv": "^6.12.4",
                "debug": "^4.3.2",
                "espree": "^9.6.0",
                "globals": "^13.19.0",
                "ignore": "^5.2.0",
                "import-fresh": "^3.2.1",
                "js-yaml": "^4.1.0",
                "minimatch": "^3.1.2",
                "strip-json-comments": "^3.1.1"
            },
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            },
            "funding": {
                "url": "https://opencollective.com/eslint"
            }
        },
        "node_modules/@eslint/js": {
            "version": "8.57.1",
            "resolved": "https://registry.npmjs.org/@eslint/js/-/js-8.57.1.tgz",
            "integrity": "sha512-d9zaMRSTIKDLhctzH12MtXvJKSSUhaHcjV+2Z+GK+EEY7XKpP5yR4x+N3TAcHTcu963nIr+TMcCb4DBCYX1z6Q==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            }
        },
        "node_modules/@humanwhocodes/config-array": {
            "version": "0.13.0",
            "resolved": "https://registry.npmjs.org/@humanwhocodes/config-array/-/config-array-0.13.0.tgz",
            "integrity": "sha512-DZLEEqFWQFiyK6h5YIeynKx7JlvCYWL0cImfSRXZ9l4Sg2efkFGTuFf6vzXjK1cq6IYkU+Eg/JizXw+TD2vRNw==",
            "deprecated": "Use @eslint/config-array instead",
            "dev": true,
            "license": "Apache-2.0",
            "dependencies": {
                "@humanwhocodes/object-schema": "^2.0.3",
                "debug": "^4.3.1",
                "minimatch": "^3.0.5"
            },
            "engines": {
                "node": ">=10.10.0"
            }
        },
        "node_modules/@humanwhocodes/module-importer": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
            "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
            "dev": true,
            "license": "Apache-2.0",
            "engines": {
                "node": ">=12.22"
            },
            "funding": {
                "type": "github",
                "url": "https://github.com/sponsors/nzakas"
            }
        },
        "node_modules/@humanwhocodes/object-schema": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/@humanwhocodes/object-schema/-/object-schema-2.0.3.tgz",
            "integrity": "sha512-93zYdMES/c1D69yZiKDBj0V24vqNzB/koF26KPaagAfd3P/4gUlh3Dys5ogAK+Exi9QyzlD8x/08Zt7wIKcDcA==",
            "deprecated": "Use @eslint/object-schema instead",
            "dev": true,
            "license": "BSD-3-Clause"
        },
        "node_modules/@jridgewell/gen-mapping": {
            "version": "0.3.13",
            "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
            "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@jridgewell/sourcemap-codec": "^1.5.0",
                "@jridgewell/trace-mapping": "^0.3.24"
            }
        },
        "node_modules/@jridgewell/remapping": {
            "version": "2.3.5",
            "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
            "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@jridgewell/gen-mapping": "^0.3.5",
                "@jridgewell/trace-mapping": "^0.3.24"
            }
        },
        "node_modules/@jridgewell/resolve-uri": {
            "version": "3.1.2",
            "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
            "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.0.0"
            }
        },
        "node_modules/@jridgewell/sourcemap-codec": {
            "version": "1.5.5",
            "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
            "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/@jridgewell/trace-mapping": {
            "version": "0.3.31",
            "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
            "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@jridgewell/resolve-uri": "^3.1.0",
                "@jridgewell/sourcemap-codec": "^1.4.14"
            }
        },
        "node_modules/@monaco-editor/loader": {
            "version": "1.7.0",
            "resolved": "https://registry.npmjs.org/@monaco-editor/loader/-/loader-1.7.0.tgz",
            "integrity": "sha512-gIwR1HrJrrx+vfyOhYmCZ0/JcWqG5kbfG7+d3f/C1LXk2EvzAbHSg3MQ5lO2sMlo9izoAZ04shohfKLVT6crVA==",
            "license": "MIT",
            "dependencies": {
                "state-local": "^1.0.6"
            }
        },
        "node_modules/@monaco-editor/react": {
            "version": "4.7.0",
            "resolved": "https://registry.npmjs.org/@monaco-editor/react/-/react-4.7.0.tgz",
            "integrity": "sha512-cyzXQCtO47ydzxpQtCGSQGOC8Gk3ZUeBXFAxD+CWXYFo5OqZyZUonFl0DwUlTyAfRHntBfw2p3w4s9R6oe1eCA==",
            "license": "MIT",
            "dependencies": {
                "@monaco-editor/loader": "^1.5.0"
            },
            "peerDependencies": {
                "monaco-editor": ">= 0.25.0 < 1",
                "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0",
                "react-dom": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
            }
        },
        "node_modules/@nodelib/fs.scandir": {
            "version": "2.1.5",
            "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
            "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@nodelib/fs.stat": "2.0.5",
                "run-parallel": "^1.1.9"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/@nodelib/fs.stat": {
            "version": "2.0.5",
            "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
            "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/@nodelib/fs.walk": {
            "version": "1.2.8",
            "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
            "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@nodelib/fs.scandir": "2.1.5",
                "fastq": "^1.6.0"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/@remix-run/router": {
            "version": "1.23.3",
            "resolved": "https://registry.npmjs.org/@remix-run/router/-/router-1.23.3.tgz",
            "integrity": "sha512-4An71tdz9X8+3sI4Qqqd2LWd9vS39J7sqd9EU4Scw7TJE/qB10Flv/UuqbPVgfQV9XoK8Np6jNquZitnZq5i+Q==",
            "license": "MIT",
            "engines": {
                "node": ">=14.0.0"
            }
        },
        "node_modules/@rolldown/pluginutils": {
            "version": "1.0.0-beta.27",
            "resolved": "https://registry.npmjs.org/@rolldown/pluginutils/-/pluginutils-1.0.0-beta.27.tgz",
            "integrity": "sha512-+d0F4MKMCbeVUJwG96uQ4SgAznZNSq93I3V+9NHA4OpvqG8mRCpGdKmK8l/dl02h2CCDHwW2FqilnTyDcAnqjA==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/@rollup/rollup-android-arm-eabi": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm-eabi/-/rollup-android-arm-eabi-4.62.2.tgz",
            "integrity": "sha512-6o7ZLZK+BeenkZCFNDXqpbjw9bD6nuWonvS/lwQJp7NoVVxm6p3qE7qQ5jGuBjiFsgvqjD8mZAU5oWxTmbOeOg==",
            "cpu": [
                "arm"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "android"
            ]
        },
        "node_modules/@rollup/rollup-android-arm64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-android-arm64/-/rollup-android-arm64-4.62.2.tgz",
            "integrity": "sha512-BaH7BllCACHoH1LguOU56UItGfUWjujlO65kS9LAodViaN4bwIKd7oeW/ZHJ/4ljr/7MIiENnNy3HJ0zXv8Zkw==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "android"
            ]
        },
        "node_modules/@rollup/rollup-darwin-arm64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-arm64/-/rollup-darwin-arm64-4.62.2.tgz",
            "integrity": "sha512-v39RCCvj4He82I9sFmk+M1VZ0PLM9sfsLVikjfx2hYBNALhrrOR2D3JjQA6AhlaSOgcR+RzrKY7e1+bT6SUO/A==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "darwin"
            ]
        },
        "node_modules/@rollup/rollup-darwin-x64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-darwin-x64/-/rollup-darwin-x64-4.62.2.tgz",
            "integrity": "sha512-yl0y2vq3S3lHeuXhEdss6TWfKW8vkujImO12tn4ZkG/4oghr09LvdYm2RElVjokTQiUvDUGXLGsYeLqUMCKpGA==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "darwin"
            ]
        },
        "node_modules/@rollup/rollup-freebsd-arm64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-arm64/-/rollup-freebsd-arm64-4.62.2.tgz",
            "integrity": "sha512-tT4pvt4qXD+vEoezupCWi+a1F0vvDiksiHc+PxRlYTOH1I6/X4id9jPxTP+Fg+545euaFT1jJVs4CEdHZAU1vw==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "freebsd"
            ]
        },
        "node_modules/@rollup/rollup-freebsd-x64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-freebsd-x64/-/rollup-freebsd-x64-4.62.2.tgz",
            "integrity": "sha512-6nU5F2wCW+qvCBhTn1pdIU3bzsIoF7EUwsCDRxilWGprQR6yd508YnH9+OKFCwpfS8pjZqDUmnCAr7exax0XCg==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "freebsd"
            ]
        },
        "node_modules/@rollup/rollup-linux-arm-gnueabihf": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-gnueabihf/-/rollup-linux-arm-gnueabihf-4.62.2.tgz",
            "integrity": "sha512-n1GJHPOvpIfhi3TmrCeh6S6URt9BFCt0KQE3qvexyGCTAKpR4Lg+eWvNZEqu7epxwus/8ElT3hacYEucm49SZg==",
            "cpu": [
                "arm"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-arm-musleabihf": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm-musleabihf/-/rollup-linux-arm-musleabihf-4.62.2.tgz",
            "integrity": "sha512-JqgflS8wEB+UXV/vS1RpRbifGBeN4D5lz8D8oOFbFZw4vedvdOgCFAjfBmIMdW3yL10XpQQ0Ambepw6MXrhOnA==",
            "cpu": [
                "arm"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-arm64-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-gnu/-/rollup-linux-arm64-gnu-4.62.2.tgz",
            "integrity": "sha512-wnFJkogWvN4jm/hQRF2UBaeUmk20j5+DmHvoyWii2b8HJDyvz1MF2OU/6ynXt2KR63rbZLWkFpoytpdc/yBuSA==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-arm64-musl": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-arm64-musl/-/rollup-linux-arm64-musl-4.62.2.tgz",
            "integrity": "sha512-HVu2bp0zhvJ8xHEV9+UUs7S90VadmBSY3LcIMvozbPo4AuMGDWlz3ymHLHZPX4hR67TKTt8Qp5PJ5RBg/i+RMQ==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-loong64-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-gnu/-/rollup-linux-loong64-gnu-4.62.2.tgz",
            "integrity": "sha512-mQqqAV8QaoSgr9I2fKDLY2BAVvmKjWoGiu/cSYQonsLvtqwEn1E4QYfnCOcp5zoEqNhsDYin1s6jx/VJmrxlZg==",
            "cpu": [
                "loong64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-loong64-musl": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-loong64-musl/-/rollup-linux-loong64-musl-4.62.2.tgz",
            "integrity": "sha512-IxKLoxCQ2IWi6bT2akyDUBGsOImDKB+sPp4EsTmwFQ/fMwpCKm8uLSSgP/Kx/QYUgKis6SEZ5/Nlhup0DIA0PQ==",
            "cpu": [
                "loong64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-ppc64-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-gnu/-/rollup-linux-ppc64-gnu-4.62.2.tgz",
            "integrity": "sha512-Mk5ha2RQSgyFfmYYLkBpPnUk8D8FriBxesO1u9O75X0mHgXL1UQcH5Itl2lurWL2tj0RxV9b9tJgipac0hRY9A==",
            "cpu": [
                "ppc64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-ppc64-musl": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-ppc64-musl/-/rollup-linux-ppc64-musl-4.62.2.tgz",
            "integrity": "sha512-CjvEnqJL/0/TQ3TXX3OPIJ/kmBellrWd4heXUmHeJlTnmwjKpSJzoehLaL6Xk0ZnMHBu9dZuFADNOrtjF4v+2w==",
            "cpu": [
                "ppc64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-riscv64-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-gnu/-/rollup-linux-riscv64-gnu-4.62.2.tgz",
            "integrity": "sha512-1SiZbzwdkaDURsew/tSOrooKiYy7EQGT6m8ufavAi9NEyQb/6VuIxFXAL1fqa4iZe3g4NbNk4P7J32z2tw5Mgg==",
            "cpu": [
                "riscv64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-riscv64-musl": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-riscv64-musl/-/rollup-linux-riscv64-musl-4.62.2.tgz",
            "integrity": "sha512-nQts12zJ3NQRoE6uYljOH89v7szzLDvG2JD/vsX+vGXU8w/At1GowTZ5/7qeFQ8m7L55rpR8Okugnuo5bgjy2Q==",
            "cpu": [
                "riscv64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-s390x-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-s390x-gnu/-/rollup-linux-s390x-gnu-4.62.2.tgz",
            "integrity": "sha512-E9/ll019jhPIJgpzfZoIkBGhcz+kKNgVWYRY0zr9srBdPPFVpvOKW8VaJKUbeK+eZXyQF9ltME+Kk6affeaPgg==",
            "cpu": [
                "s390x"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-x64-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.62.2.tgz",
            "integrity": "sha512-5BqxR/pshjey51iliyzTD5Xi3EN0aLmQ2lZ3lvefVV9c82BvrLo2/6OT55iifpWBufs6kdwWbuOKS841DrmK9A==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-linux-x64-musl": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-linux-x64-musl/-/rollup-linux-x64-musl-4.62.2.tgz",
            "integrity": "sha512-uNN83XxQrRAh/w0/pmAfibcwyb6YWt4gP+dpnQKPVJshAloQ785ii8CT8ZCIxkGg9opVsvAlGhFitSm6D1Jjpg==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "linux"
            ]
        },
        "node_modules/@rollup/rollup-openbsd-x64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-openbsd-x64/-/rollup-openbsd-x64-4.62.2.tgz",
            "integrity": "sha512-srjEIxSH3LRnJN6THczDHWQplqEMFiAJrTab0msUryh9kwNpkICf3Ea6q6MN/2cZwRFUNx5w+h6Hpi4QuHS6Zg==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "openbsd"
            ]
        },
        "node_modules/@rollup/rollup-openharmony-arm64": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-openharmony-arm64/-/rollup-openharmony-arm64-4.62.2.tgz",
            "integrity": "sha512-8hOJnxgbyObnCm5AlRA3A931xX19xq80RjVTKgJOvEKWqJruP/Uf12IbAOaDjjEXYRewwHLfmF0YRIdK3OwKWA==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "openharmony"
            ]
        },
        "node_modules/@rollup/rollup-win32-arm64-msvc": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-arm64-msvc/-/rollup-win32-arm64-msvc-4.62.2.tgz",
            "integrity": "sha512-mmF4AY1i0hG/bLWUctUq59gtmgaSIRa3cu/A3JFRp/sCNEme2bgDEiDS22P9FbnJB8NJNF4jPJiSP5RHQpUTDg==",
            "cpu": [
                "arm64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ]
        },
        "node_modules/@rollup/rollup-win32-ia32-msvc": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-ia32-msvc/-/rollup-win32-ia32-msvc-4.62.2.tgz",
            "integrity": "sha512-DZgkknc6jhHrk46V25vbAM0zZkyP0nSDkJB8/dRkLTxv470dOmWDqGoEJl/9A0dFfS7yE3REOwNDxpHwSLSt0Q==",
            "cpu": [
                "ia32"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ]
        },
        "node_modules/@rollup/rollup-win32-x64-gnu": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-gnu/-/rollup-win32-x64-gnu-4.62.2.tgz",
            "integrity": "sha512-T6xr6ucWSFto+VGajA8YH26LdpHRuP4YLHEKAtCWvJDOlnmWcDZVCI2Jmjr+IFHDlt2zRaTAKE4tfjTaWLgJBg==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ]
        },
        "node_modules/@rollup/rollup-win32-x64-msvc": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/@rollup/rollup-win32-x64-msvc/-/rollup-win32-x64-msvc-4.62.2.tgz",
            "integrity": "sha512-BfzEnDJOt9T8M989/lA37EcJgat01wLRnoi5dQf3QzOH7jzpqTAzdDbVfRljVr5r+jzKqpbHeyOfAaXxAd0PAA==",
            "cpu": [
                "x64"
            ],
            "dev": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "win32"
            ]
        },
        "node_modules/@types/babel__core": {
            "version": "7.20.5",
            "resolved": "https://registry.npmjs.org/@types/babel__core/-/babel__core-7.20.5.tgz",
            "integrity": "sha512-qoQprZvz5wQFJwMDqeseRXWv3rqMvhgpbXFfVyWhbx9X47POIA6i/+dXefEmZKoAgOaTdaIgNSMqMIU61yRyzA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/parser": "^7.20.7",
                "@babel/types": "^7.20.7",
                "@types/babel__generator": "*",
                "@types/babel__template": "*",
                "@types/babel__traverse": "*"
            }
        },
        "node_modules/@types/babel__generator": {
            "version": "7.27.0",
            "resolved": "https://registry.npmjs.org/@types/babel__generator/-/babel__generator-7.27.0.tgz",
            "integrity": "sha512-ufFd2Xi92OAVPYsy+P4n7/U7e68fex0+Ee8gSG9KX7eo084CWiQ4sdxktvdl0bOPupXtVJPY19zk6EwWqUQ8lg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/types": "^7.0.0"
            }
        },
        "node_modules/@types/babel__template": {
            "version": "7.4.4",
            "resolved": "https://registry.npmjs.org/@types/babel__template/-/babel__template-7.4.4.tgz",
            "integrity": "sha512-h/NUaSyG5EyxBIp8YRxo4RMe2/qQgvyowRwVMzhYhBCONbW8PUsg4lkFMrhgZhUe5z3L3MiLDuvyJ/CaPa2A8A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/parser": "^7.1.0",
                "@babel/types": "^7.0.0"
            }
        },
        "node_modules/@types/babel__traverse": {
            "version": "7.28.0",
            "resolved": "https://registry.npmjs.org/@types/babel__traverse/-/babel__traverse-7.28.0.tgz",
            "integrity": "sha512-8PvcXf70gTDZBgt9ptxJ8elBeBjcLOAcOtoO/mPJjtji1+CdGbHgm77om1GrsPxsiE+uXIpNSK64UYaIwQXd4Q==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/types": "^7.28.2"
            }
        },
        "node_modules/@types/estree": {
            "version": "1.0.9",
            "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
            "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/@types/prop-types": {
            "version": "15.7.15",
            "resolved": "https://registry.npmjs.org/@types/prop-types/-/prop-types-15.7.15.tgz",
            "integrity": "sha512-F6bEyamV9jKGAFBEmlQnesRPGOQqS2+Uwi0Em15xenOxHaf2hv6L8YCVn3rPdPJOiJfPiCnLIRyvwVaqMY3MIw==",
            "devOptional": true,
            "license": "MIT"
        },
        "node_modules/@types/react": {
            "version": "18.3.31",
            "resolved": "https://registry.npmjs.org/@types/react/-/react-18.3.31.tgz",
            "integrity": "sha512-vfEqpXTvwT91yhmwdfouStN2hSKwTvyRs8qpLfADyrq/kxDw0hZM7Wk9Ug1FELj8hIby+S/+kQCSRFF32nv2Qw==",
            "devOptional": true,
            "license": "MIT",
            "dependencies": {
                "@types/prop-types": "*",
                "csstype": "^3.2.2"
            }
        },
        "node_modules/@types/react-dom": {
            "version": "18.3.7",
            "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-18.3.7.tgz",
            "integrity": "sha512-MEe3UeoENYVFXzoXEWsvcpg6ZvlrFNlOQ7EOsvhI3CfAXwzPfO8Qwuxd40nepsYKqyyVQnTdEfv68q91yLcKrQ==",
            "dev": true,
            "license": "MIT",
            "peerDependencies": {
                "@types/react": "^18.0.0"
            }
        },
        "node_modules/@ungap/structured-clone": {
            "version": "1.3.1",
            "resolved": "https://registry.npmjs.org/@ungap/structured-clone/-/structured-clone-1.3.1.tgz",
            "integrity": "sha512-mUFwbeTqrVgDQxFveS+df2yfap6iuP20NAKAsBt5jDEoOTDew+zwLAOilHCeQJOVSvmgCX4ogqIrA0mnyr08yQ==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/@vitejs/plugin-react": {
            "version": "4.7.0",
            "resolved": "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-4.7.0.tgz",
            "integrity": "sha512-gUu9hwfWvvEDBBmgtAowQCojwZmJ5mcLn3aufeCsitijs3+f2NsrPtlAWIR6OPiqljl96GVCUbLe0HyqIpVaoA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@babel/core": "^7.28.0",
                "@babel/plugin-transform-react-jsx-self": "^7.27.1",
                "@babel/plugin-transform-react-jsx-source": "^7.27.1",
                "@rolldown/pluginutils": "1.0.0-beta.27",
                "@types/babel__core": "^7.20.5",
                "react-refresh": "^0.17.0"
            },
            "engines": {
                "node": "^14.18.0 || >=16.0.0"
            },
            "peerDependencies": {
                "vite": "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"
            }
        },
        "node_modules/acorn": {
            "version": "8.17.0",
            "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.17.0.tgz",
            "integrity": "sha512-xRQbDb9BnwDafYNn6Vwl839DYVjqXYb1XVGtWAZ1kcDc6iwAL4hg3B1dZlRiuENFeO2H53gFG3in621AdERVAg==",
            "dev": true,
            "license": "MIT",
            "bin": {
                "acorn": "bin/acorn"
            },
            "engines": {
                "node": ">=0.4.0"
            }
        },
        "node_modules/acorn-jsx": {
            "version": "5.3.2",
            "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
            "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
            "dev": true,
            "license": "MIT",
            "peerDependencies": {
                "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
            }
        },
        "node_modules/agent-base": {
            "version": "6.0.2",
            "resolved": "https://registry.npmjs.org/agent-base/-/agent-base-6.0.2.tgz",
            "integrity": "sha512-RZNwNclF7+MS/8bDg70amg32dyeZGZxiDuQmZxKLAlQjr3jGyLx+4Kkk58UO7D2QdgFIQCovuSuZESne6RG6XQ==",
            "license": "MIT",
            "dependencies": {
                "debug": "4"
            },
            "engines": {
                "node": ">= 6.0.0"
            }
        },
        "node_modules/ajv": {
            "version": "6.15.0",
            "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
            "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "fast-deep-equal": "^3.1.1",
                "fast-json-stable-stringify": "^2.0.0",
                "json-schema-traverse": "^0.4.1",
                "uri-js": "^4.2.2"
            },
            "funding": {
                "type": "github",
                "url": "https://github.com/sponsors/epoberezkin"
            }
        },
        "node_modules/ansi-regex": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-5.0.1.tgz",
            "integrity": "sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/ansi-styles": {
            "version": "4.3.0",
            "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
            "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "color-convert": "^2.0.1"
            },
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/chalk/ansi-styles?sponsor=1"
            }
        },
        "node_modules/any-promise": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/any-promise/-/any-promise-1.3.0.tgz",
            "integrity": "sha512-7UvmKalWRt1wgjL1RrGxoSJW/0QZFIegpeGvZG9kjp8vrRu55XTHbwnqq2GpXm9uLbcuhxm3IqX9OB4MZR1b2A==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/anymatch": {
            "version": "3.1.3",
            "resolved": "https://registry.npmjs.org/anymatch/-/anymatch-3.1.3.tgz",
            "integrity": "sha512-KMReFUr0B4t+D+OBkjR3KYqvocp2XaSzO55UcB6mgQMd3KbcE+mWTyvVV7D/zsdEbNnV6acZUutkiHQXvTr1Rw==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "normalize-path": "^3.0.0",
                "picomatch": "^2.0.4"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/arg": {
            "version": "5.0.2",
            "resolved": "https://registry.npmjs.org/arg/-/arg-5.0.2.tgz",
            "integrity": "sha512-PYjyFOLKQ9y57JvQ6QLo8dAgNqswh8M1RMJYdQduT6xbWSgK36P/Z/v+p888pM69jMMfS8Xd8F6I1kQ/I9HUGg==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/argparse": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
            "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
            "dev": true,
            "license": "Python-2.0"
        },
        "node_modules/array-buffer-byte-length": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz",
            "integrity": "sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "is-array-buffer": "^3.0.5"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/array-includes": {
            "version": "3.1.9",
            "resolved": "https://registry.npmjs.org/array-includes/-/array-includes-3.1.9.tgz",
            "integrity": "sha512-FmeCCAenzH0KH381SPT5FZmiA/TmpndpcaShhfgEN9eCVjnFBqq3l1xrI42y8+PPLI6hypzou4GXw00WHmPBLQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.4",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.24.0",
                "es-object-atoms": "^1.1.1",
                "get-intrinsic": "^1.3.0",
                "is-string": "^1.1.1",
                "math-intrinsics": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/array.prototype.findlast": {
            "version": "1.2.5",
            "resolved": "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz",
            "integrity": "sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.7",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.2",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.0.0",
                "es-shim-unscopables": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/array.prototype.flat": {
            "version": "1.3.3",
            "resolved": "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.3.tgz",
            "integrity": "sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.5",
                "es-shim-unscopables": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/array.prototype.flatmap": {
            "version": "1.3.3",
            "resolved": "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz",
            "integrity": "sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.5",
                "es-shim-unscopables": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/array.prototype.tosorted": {
            "version": "1.1.4",
            "resolved": "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz",
            "integrity": "sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.7",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.3",
                "es-errors": "^1.3.0",
                "es-shim-unscopables": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/arraybuffer.prototype.slice": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz",
            "integrity": "sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "array-buffer-byte-length": "^1.0.1",
                "call-bind": "^1.0.8",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.5",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.6",
                "is-array-buffer": "^3.0.4"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/async-function": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/async-function/-/async-function-1.0.0.tgz",
            "integrity": "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/asynckit": {
            "version": "0.4.0",
            "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
            "integrity": "sha512-Oei9OH4tRh0YqU3GxhX79dM/mwVgvbZJaSNaRk+bshkj0S5cfHcgYakreBjrHwatXKbz+IoIdYLxrKim2MjW0Q==",
            "license": "MIT"
        },
        "node_modules/autoprefixer": {
            "version": "10.5.0",
            "resolved": "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.5.0.tgz",
            "integrity": "sha512-FMhOoZV4+qR6aTUALKX2rEqGG+oyATvwBt9IIzVR5rMa2HRWPkxf+P+PAJLD1I/H5/II+HuZcBJYEFBpq39ong==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/postcss/"
                },
                {
                    "type": "tidelift",
                    "url": "https://tidelift.com/funding/github/npm/autoprefixer"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "browserslist": "^4.28.2",
                "caniuse-lite": "^1.0.30001787",
                "fraction.js": "^5.3.4",
                "picocolors": "^1.1.1",
                "postcss-value-parser": "^4.2.0"
            },
            "bin": {
                "autoprefixer": "bin/autoprefixer"
            },
            "engines": {
                "node": "^10 || ^12 || >=14"
            },
            "peerDependencies": {
                "postcss": "^8.1.0"
            }
        },
        "node_modules/available-typed-arrays": {
            "version": "1.0.7",
            "resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",
            "integrity": "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "possible-typed-array-names": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/axios": {
            "version": "1.18.0",
            "resolved": "https://registry.npmjs.org/axios/-/axios-1.18.0.tgz",
            "integrity": "sha512-E32NzpYKp++W7XRe52rHiXV2ehxmh3wbdgO7MHeFM+vqxLBYHzt0ElkiImtOBxtOmyp0yoC8C6uESVV84Y2/hw==",
            "license": "MIT",
            "dependencies": {
                "follow-redirects": "^1.16.0",
                "form-data": "^4.0.5",
                "https-proxy-agent": "^5.0.1",
                "proxy-from-env": "^2.1.0"
            }
        },
        "node_modules/balanced-match": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
            "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/baseline-browser-mapping": {
            "version": "2.10.38",
            "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.10.38.tgz",
            "integrity": "sha512-31/02mVB4yuQU6adKk5SlY6m+mxDwUq5KZkyYgnLrrKl7TEm1+3PyDtDBz2kOv/wxZz41GHsvV1A/u6RmiyBvw==",
            "dev": true,
            "license": "Apache-2.0",
            "bin": {
                "baseline-browser-mapping": "dist/cli.cjs"
            },
            "engines": {
                "node": ">=6.0.0"
            }
        },
        "node_modules/binary-extensions": {
            "version": "2.3.0",
            "resolved": "https://registry.npmjs.org/binary-extensions/-/binary-extensions-2.3.0.tgz",
            "integrity": "sha512-Ceh+7ox5qe7LJuLHoY0feh3pHuUDHAcRUeyL2VYghZwfpkNIy/+8Ocg0a3UuSoYzavmylwuLWQOf3hl0jjMMIw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/brace-expansion": {
            "version": "1.1.15",
            "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.15.tgz",
            "integrity": "sha512-EwOCDEex4quD37XhqM3omwtMoJjr//isUZz1JopUNWms+4Z2ViyM/k1YIRePpoVNnQhENnxtFjLaxNHrT7xIUg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "balanced-match": "^1.0.0",
                "concat-map": "0.0.1"
            }
        },
        "node_modules/braces": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
            "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "fill-range": "^7.1.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/browserslist": {
            "version": "4.28.2",
            "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.2.tgz",
            "integrity": "sha512-48xSriZYYg+8qXna9kwqjIVzuQxi+KYWp2+5nCYnYKPTr0LvD89Jqk2Or5ogxz0NUMfIjhh2lIUX/LyX9B4oIg==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/browserslist"
                },
                {
                    "type": "tidelift",
                    "url": "https://tidelift.com/funding/github/npm/browserslist"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "baseline-browser-mapping": "^2.10.12",
                "caniuse-lite": "^1.0.30001782",
                "electron-to-chromium": "^1.5.328",
                "node-releases": "^2.0.36",
                "update-browserslist-db": "^1.2.3"
            },
            "bin": {
                "browserslist": "cli.js"
            },
            "engines": {
                "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
            }
        },
        "node_modules/call-bind": {
            "version": "1.0.9",
            "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.9.tgz",
            "integrity": "sha512-a/hy+pNsFUTR+Iz8TCJvXudKVLAnz/DyeSUo10I5yvFDQJBFU2s9uqQpoSrJlroHUKoKqzg+epxyP9lqFdzfBQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "es-define-property": "^1.0.1",
                "get-intrinsic": "^1.3.0",
                "set-function-length": "^1.2.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/call-bind-apply-helpers": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
            "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "function-bind": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/call-bound": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
            "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "get-intrinsic": "^1.3.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/callsites": {
            "version": "3.1.0",
            "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
            "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/camelcase-css": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/camelcase-css/-/camelcase-css-2.0.1.tgz",
            "integrity": "sha512-QOSvevhslijgYwRx6Rv7zKdMF8lbRmx+uQGx2+vDc+KI/eBnsy9kit5aj23AgGu3pa4t9AgwbnXWqS+iOY+2aA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/caniuse-lite": {
            "version": "1.0.30001799",
            "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001799.tgz",
            "integrity": "sha512-hG1bReV+OUU+MOqK4t/ZWI0tZOyz3rqS9XuhOUz1cIcbwBKjOyJEJuw9ER5JuNyqxNk8u/JUVbGibBOL1yrjFw==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/browserslist"
                },
                {
                    "type": "tidelift",
                    "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "CC-BY-4.0"
        },
        "node_modules/chalk": {
            "version": "4.1.2",
            "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
            "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "ansi-styles": "^4.1.0",
                "supports-color": "^7.1.0"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/chalk/chalk?sponsor=1"
            }
        },
        "node_modules/chokidar": {
            "version": "3.6.0",
            "resolved": "https://registry.npmjs.org/chokidar/-/chokidar-3.6.0.tgz",
            "integrity": "sha512-7VT13fmjotKpGipCW9JEQAusEPE+Ei8nl6/g4FBAmIm0GOOLMua9NDDo/DWp0ZAxCr3cPq5ZpBqmPAQgDda2Pw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "anymatch": "~3.1.2",
                "braces": "~3.0.2",
                "glob-parent": "~5.1.2",
                "is-binary-path": "~2.1.0",
                "is-glob": "~4.0.1",
                "normalize-path": "~3.0.0",
                "readdirp": "~3.6.0"
            },
            "engines": {
                "node": ">= 8.10.0"
            },
            "funding": {
                "url": "https://paulmillr.com/funding/"
            },
            "optionalDependencies": {
                "fsevents": "~2.3.2"
            }
        },
        "node_modules/chokidar/node_modules/glob-parent": {
            "version": "5.1.2",
            "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
            "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "is-glob": "^4.0.1"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/color-convert": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
            "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "color-name": "~1.1.4"
            },
            "engines": {
                "node": ">=7.0.0"
            }
        },
        "node_modules/color-name": {
            "version": "1.1.4",
            "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
            "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/combined-stream": {
            "version": "1.0.8",
            "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
            "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
            "license": "MIT",
            "dependencies": {
                "delayed-stream": "~1.0.0"
            },
            "engines": {
                "node": ">= 0.8"
            }
        },
        "node_modules/commander": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/commander/-/commander-4.1.1.tgz",
            "integrity": "sha512-NOKm8xhkzAjzFx8B2v5OAHT+u5pRQc2UCa2Vq9jYL/31o2wi9mxBA7LIFs3sV5VSC49z6pEhfbMULvShKj26WA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/concat-map": {
            "version": "0.0.1",
            "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
            "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/convert-source-map": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
            "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/cross-spawn": {
            "version": "7.0.6",
            "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
            "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "path-key": "^3.1.0",
                "shebang-command": "^2.0.0",
                "which": "^2.0.1"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/cssesc": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/cssesc/-/cssesc-3.0.0.tgz",
            "integrity": "sha512-/Tb/JcjK111nNScGob5MNtsntNM1aCNUDipB/TkwZFhyDrrE47SOx/18wF2bbjgc3ZzCSKW1T5nt5EbFoAz/Vg==",
            "dev": true,
            "license": "MIT",
            "bin": {
                "cssesc": "bin/cssesc"
            },
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/csstype": {
            "version": "3.2.3",
            "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
            "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
            "license": "MIT"
        },
        "node_modules/data-view-buffer": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
            "integrity": "sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "es-errors": "^1.3.0",
                "is-data-view": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/data-view-byte-length": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz",
            "integrity": "sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "es-errors": "^1.3.0",
                "is-data-view": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/inspect-js"
            }
        },
        "node_modules/data-view-byte-offset": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz",
            "integrity": "sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "is-data-view": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/debug": {
            "version": "4.4.3",
            "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
            "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
            "license": "MIT",
            "dependencies": {
                "ms": "^2.1.3"
            },
            "engines": {
                "node": ">=6.0"
            },
            "peerDependenciesMeta": {
                "supports-color": {
                    "optional": true
                }
            }
        },
        "node_modules/deep-is": {
            "version": "0.1.4",
            "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
            "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/define-data-property": {
            "version": "1.1.4",
            "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
            "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-define-property": "^1.0.0",
                "es-errors": "^1.3.0",
                "gopd": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/define-properties": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
            "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "define-data-property": "^1.0.1",
                "has-property-descriptors": "^1.0.0",
                "object-keys": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/delayed-stream": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
            "integrity": "sha512-ZySD7Nf91aLB0RxL4KGrKHBXl7Eds1DAmEdcoVawXnLD7SDhpNgtuII2aAkg7a7QS41jxPSZ17p4VdGnMHk3MQ==",
            "license": "MIT",
            "engines": {
                "node": ">=0.4.0"
            }
        },
        "node_modules/didyoumean": {
            "version": "1.2.2",
            "resolved": "https://registry.npmjs.org/didyoumean/-/didyoumean-1.2.2.tgz",
            "integrity": "sha512-gxtyfqMg7GKyhQmb056K7M3xszy/myH8w+B4RT+QXBQsvAOdc3XymqDDPHx1BgPgsdAA5SIifona89YtRATDzw==",
            "dev": true,
            "license": "Apache-2.0"
        },
        "node_modules/dlv": {
            "version": "1.1.3",
            "resolved": "https://registry.npmjs.org/dlv/-/dlv-1.1.3.tgz",
            "integrity": "sha512-+HlytyjlPKnIG8XuRG8WvmBP8xs8P71y+SKKS6ZXWoEgLuePxtDoUEiH7WkdePWrQ5JBpE6aoVqfZfJUQkjXwA==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/doctrine": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-3.0.0.tgz",
            "integrity": "sha512-yS+Q5i3hBf7GBkd4KG8a7eBNNWNGLTaEwwYWUijIYM7zrlYDM0BFXHjjPWlWZ1Rg7UaddZeIDmi9jF3HmqiQ2w==",
            "dev": true,
            "license": "Apache-2.0",
            "dependencies": {
                "esutils": "^2.0.2"
            },
            "engines": {
                "node": ">=6.0.0"
            }
        },
        "node_modules/dunder-proto": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
            "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.1",
                "es-errors": "^1.3.0",
                "gopd": "^1.2.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/electron-to-chromium": {
            "version": "1.5.376",
            "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.376.tgz",
            "integrity": "sha512-cUVA7/RvbFTEuw/i3obUwDTRIXojaxkResf+ibByPFxjc6XK3VNtcQXV0NSbAlJ0FMjcJGgftVVB4Qo184EXvA==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/es-abstract": {
            "version": "1.24.2",
            "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",
            "integrity": "sha512-2FpH9Q5i2RRwyEP1AylXe6nYLR5OhaJTZwmlcP0dL/+JCbgg7yyEo/sEK6HeGZRf3dFpWwThaRHVApXSkW3xeg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "array-buffer-byte-length": "^1.0.2",
                "arraybuffer.prototype.slice": "^1.0.4",
                "available-typed-arrays": "^1.0.7",
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.4",
                "data-view-buffer": "^1.0.2",
                "data-view-byte-length": "^1.0.2",
                "data-view-byte-offset": "^1.0.1",
                "es-define-property": "^1.0.1",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.1.1",
                "es-set-tostringtag": "^2.1.0",
                "es-to-primitive": "^1.3.0",
                "function.prototype.name": "^1.1.8",
                "get-intrinsic": "^1.3.0",
                "get-proto": "^1.0.1",
                "get-symbol-description": "^1.1.0",
                "globalthis": "^1.0.4",
                "gopd": "^1.2.0",
                "has-property-descriptors": "^1.0.2",
                "has-proto": "^1.2.0",
                "has-symbols": "^1.1.0",
                "hasown": "^2.0.2",
                "internal-slot": "^1.1.0",
                "is-array-buffer": "^3.0.5",
                "is-callable": "^1.2.7",
                "is-data-view": "^1.0.2",
                "is-negative-zero": "^2.0.3",
                "is-regex": "^1.2.1",
                "is-set": "^2.0.3",
                "is-shared-array-buffer": "^1.0.4",
                "is-string": "^1.1.1",
                "is-typed-array": "^1.1.15",
                "is-weakref": "^1.1.1",
                "math-intrinsics": "^1.1.0",
                "object-inspect": "^1.13.4",
                "object-keys": "^1.1.1",
                "object.assign": "^4.1.7",
                "own-keys": "^1.0.1",
                "regexp.prototype.flags": "^1.5.4",
                "safe-array-concat": "^1.1.3",
                "safe-push-apply": "^1.0.0",
                "safe-regex-test": "^1.1.0",
                "set-proto": "^1.0.0",
                "stop-iteration-iterator": "^1.1.0",
                "string.prototype.trim": "^1.2.10",
                "string.prototype.trimend": "^1.0.9",
                "string.prototype.trimstart": "^1.0.8",
                "typed-array-buffer": "^1.0.3",
                "typed-array-byte-length": "^1.0.3",
                "typed-array-byte-offset": "^1.0.4",
                "typed-array-length": "^1.0.7",
                "unbox-primitive": "^1.1.0",
                "which-typed-array": "^1.1.19"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/es-abstract-get": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/es-abstract-get/-/es-abstract-get-1.0.0.tgz",
            "integrity": "sha512-6PMWXpdhshVvFp+FoWYs1EvG1Nj0tvk0dZM+XcK0xMEM1czRVcP6ohqPWHy6qPagSpC8j4+p89WXlT+xXJs/fg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.1.2",
                "is-callable": "^1.2.7",
                "object-inspect": "^1.13.4"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/es-define-property": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
            "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-errors": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
            "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-iterator-helpers": {
            "version": "1.3.3",
            "resolved": "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.3.3.tgz",
            "integrity": "sha512-0PuBxFi+4uPanB97iDxCLWuHeYud2FALrw5HFZGtAF38UpJDbDC8frwp2cnDyae692CQ0dou60UwWfhgsa4U/g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.9",
                "call-bound": "^1.0.4",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.24.2",
                "es-errors": "^1.3.0",
                "es-set-tostringtag": "^2.1.0",
                "function-bind": "^1.1.2",
                "get-intrinsic": "^1.3.0",
                "globalthis": "^1.0.4",
                "gopd": "^1.2.0",
                "has-property-descriptors": "^1.0.2",
                "has-proto": "^1.2.0",
                "has-symbols": "^1.1.0",
                "internal-slot": "^1.1.0",
                "iterator.prototype": "^1.1.5",
                "math-intrinsics": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-object-atoms": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
            "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-set-tostringtag": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
            "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.6",
                "has-tostringtag": "^1.0.2",
                "hasown": "^2.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-shim-unscopables": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.1.0.tgz",
            "integrity": "sha512-d9T8ucsEhh8Bi1woXCf+TIKDIROLG5WCkxg8geBCbvk22kzwC5G2OnXVMO6FUsvQlgUUXQ2itephWDLqDzbeCw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "hasown": "^2.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/es-to-primitive": {
            "version": "1.3.1",
            "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.1.tgz",
            "integrity": "sha512-CxN9N56HYfd2m/acc/NOFrZQsN9kU4eh+2kk6A707Kz1krH8tKmfrs5RnftB8WNX80T0NS7vSQsDOlg23diR2g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-abstract-get": "^1.0.0",
                "es-errors": "^1.3.0",
                "is-callable": "^1.2.7",
                "is-date-object": "^1.1.0",
                "is-symbol": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/esbuild": {
            "version": "0.21.5",
            "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.21.5.tgz",
            "integrity": "sha512-mg3OPMV4hXywwpoDxu3Qda5xCKQi+vCTZq8S9J/EpkhB2HzKXq4SNFZE3+NK93JYxc8VMSep+lOUSC/RVKaBqw==",
            "dev": true,
            "hasInstallScript": true,
            "license": "MIT",
            "bin": {
                "esbuild": "bin/esbuild"
            },
            "engines": {
                "node": ">=12"
            },
            "optionalDependencies": {
                "@esbuild/aix-ppc64": "0.21.5",
                "@esbuild/android-arm": "0.21.5",
                "@esbuild/android-arm64": "0.21.5",
                "@esbuild/android-x64": "0.21.5",
                "@esbuild/darwin-arm64": "0.21.5",
                "@esbuild/darwin-x64": "0.21.5",
                "@esbuild/freebsd-arm64": "0.21.5",
                "@esbuild/freebsd-x64": "0.21.5",
                "@esbuild/linux-arm": "0.21.5",
                "@esbuild/linux-arm64": "0.21.5",
                "@esbuild/linux-ia32": "0.21.5",
                "@esbuild/linux-loong64": "0.21.5",
                "@esbuild/linux-mips64el": "0.21.5",
                "@esbuild/linux-ppc64": "0.21.5",
                "@esbuild/linux-riscv64": "0.21.5",
                "@esbuild/linux-s390x": "0.21.5",
                "@esbuild/linux-x64": "0.21.5",
                "@esbuild/netbsd-x64": "0.21.5",
                "@esbuild/openbsd-x64": "0.21.5",
                "@esbuild/sunos-x64": "0.21.5",
                "@esbuild/win32-arm64": "0.21.5",
                "@esbuild/win32-ia32": "0.21.5",
                "@esbuild/win32-x64": "0.21.5"
            }
        },
        "node_modules/escalade": {
            "version": "3.2.0",
            "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
            "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/escape-string-regexp": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
            "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/eslint": {
            "version": "8.57.1",
            "resolved": "https://registry.npmjs.org/eslint/-/eslint-8.57.1.tgz",
            "integrity": "sha512-ypowyDxpVSYpkXr9WPv2PAZCtNip1Mv5KTW0SCurXv/9iOpcrH9PaqUElksqEB6pChqHGDRCFTyrZlGhnLNGiA==",
            "deprecated": "This version is no longer supported. Please see https://eslint.org/version-support for other options.",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@eslint-community/eslint-utils": "^4.2.0",
                "@eslint-community/regexpp": "^4.6.1",
                "@eslint/eslintrc": "^2.1.4",
                "@eslint/js": "8.57.1",
                "@humanwhocodes/config-array": "^0.13.0",
                "@humanwhocodes/module-importer": "^1.0.1",
                "@nodelib/fs.walk": "^1.2.8",
                "@ungap/structured-clone": "^1.2.0",
                "ajv": "^6.12.4",
                "chalk": "^4.0.0",
                "cross-spawn": "^7.0.2",
                "debug": "^4.3.2",
                "doctrine": "^3.0.0",
                "escape-string-regexp": "^4.0.0",
                "eslint-scope": "^7.2.2",
                "eslint-visitor-keys": "^3.4.3",
                "espree": "^9.6.1",
                "esquery": "^1.4.2",
                "esutils": "^2.0.2",
                "fast-deep-equal": "^3.1.3",
                "file-entry-cache": "^6.0.1",
                "find-up": "^5.0.0",
                "glob-parent": "^6.0.2",
                "globals": "^13.19.0",
                "graphemer": "^1.4.0",
                "ignore": "^5.2.0",
                "imurmurhash": "^0.1.4",
                "is-glob": "^4.0.0",
                "is-path-inside": "^3.0.3",
                "js-yaml": "^4.1.0",
                "json-stable-stringify-without-jsonify": "^1.0.1",
                "levn": "^0.4.1",
                "lodash.merge": "^4.6.2",
                "minimatch": "^3.1.2",
                "natural-compare": "^1.4.0",
                "optionator": "^0.9.3",
                "strip-ansi": "^6.0.1",
                "text-table": "^0.2.0"
            },
            "bin": {
                "eslint": "bin/eslint.js"
            },
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            },
            "funding": {
                "url": "https://opencollective.com/eslint"
            }
        },
        "node_modules/eslint-plugin-react": {
            "version": "7.37.5",
            "resolved": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.5.tgz",
            "integrity": "sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "array-includes": "^3.1.8",
                "array.prototype.findlast": "^1.2.5",
                "array.prototype.flatmap": "^1.3.3",
                "array.prototype.tosorted": "^1.1.4",
                "doctrine": "^2.1.0",
                "es-iterator-helpers": "^1.2.1",
                "estraverse": "^5.3.0",
                "hasown": "^2.0.2",
                "jsx-ast-utils": "^2.4.1 || ^3.0.0",
                "minimatch": "^3.1.2",
                "object.entries": "^1.1.9",
                "object.fromentries": "^2.0.8",
                "object.values": "^1.2.1",
                "prop-types": "^15.8.1",
                "resolve": "^2.0.0-next.5",
                "semver": "^6.3.1",
                "string.prototype.matchall": "^4.0.12",
                "string.prototype.repeat": "^1.0.0"
            },
            "engines": {
                "node": ">=4"
            },
            "peerDependencies": {
                "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"
            }
        },
        "node_modules/eslint-plugin-react/node_modules/doctrine": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
            "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
            "dev": true,
            "license": "Apache-2.0",
            "dependencies": {
                "esutils": "^2.0.2"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/eslint-scope": {
            "version": "7.2.2",
            "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-7.2.2.tgz",
            "integrity": "sha512-dOt21O7lTMhDM+X9mB4GX+DZrZtCUJPL/wlcTqxyrx5IvO0IYtILdtrQGQp+8n5S0gwSVmOf9NQrjMOgfQZlIg==",
            "dev": true,
            "license": "BSD-2-Clause",
            "dependencies": {
                "esrecurse": "^4.3.0",
                "estraverse": "^5.2.0"
            },
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            },
            "funding": {
                "url": "https://opencollective.com/eslint"
            }
        },
        "node_modules/eslint-visitor-keys": {
            "version": "3.4.3",
            "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
            "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
            "dev": true,
            "license": "Apache-2.0",
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            },
            "funding": {
                "url": "https://opencollective.com/eslint"
            }
        },
        "node_modules/espree": {
            "version": "9.6.1",
            "resolved": "https://registry.npmjs.org/espree/-/espree-9.6.1.tgz",
            "integrity": "sha512-oruZaFkjorTpF32kDSI5/75ViwGeZginGGy2NoOSg3Q9bnwlnmDm4HLnkl0RE3n+njDXR037aY1+x58Z/zFdwQ==",
            "dev": true,
            "license": "BSD-2-Clause",
            "dependencies": {
                "acorn": "^8.9.0",
                "acorn-jsx": "^5.3.2",
                "eslint-visitor-keys": "^3.4.1"
            },
            "engines": {
                "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
            },
            "funding": {
                "url": "https://opencollective.com/eslint"
            }
        },
        "node_modules/esquery": {
            "version": "1.7.0",
            "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
            "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
            "dev": true,
            "license": "BSD-3-Clause",
            "dependencies": {
                "estraverse": "^5.1.0"
            },
            "engines": {
                "node": ">=0.10"
            }
        },
        "node_modules/esrecurse": {
            "version": "4.3.0",
            "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
            "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
            "dev": true,
            "license": "BSD-2-Clause",
            "dependencies": {
                "estraverse": "^5.2.0"
            },
            "engines": {
                "node": ">=4.0"
            }
        },
        "node_modules/estraverse": {
            "version": "5.3.0",
            "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
            "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
            "dev": true,
            "license": "BSD-2-Clause",
            "engines": {
                "node": ">=4.0"
            }
        },
        "node_modules/esutils": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
            "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
            "dev": true,
            "license": "BSD-2-Clause",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/fast-deep-equal": {
            "version": "3.1.3",
            "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
            "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/fast-glob": {
            "version": "3.3.3",
            "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.3.tgz",
            "integrity": "sha512-7MptL8U0cqcFdzIzwOTHoilX9x5BrNqye7Z/LuC7kCMRio1EMSyqRK3BEAUD7sXRq4iT4AzTVuZdhgQ2TCvYLg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@nodelib/fs.stat": "^2.0.2",
                "@nodelib/fs.walk": "^1.2.3",
                "glob-parent": "^5.1.2",
                "merge2": "^1.3.0",
                "micromatch": "^4.0.8"
            },
            "engines": {
                "node": ">=8.6.0"
            }
        },
        "node_modules/fast-glob/node_modules/glob-parent": {
            "version": "5.1.2",
            "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
            "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "is-glob": "^4.0.1"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/fast-json-stable-stringify": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
            "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/fast-levenshtein": {
            "version": "2.0.6",
            "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
            "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/fastq": {
            "version": "1.20.1",
            "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.1.tgz",
            "integrity": "sha512-GGToxJ/w1x32s/D2EKND7kTil4n8OVk/9mycTc4VDza13lOvpUZTGX3mFSCtV9ksdGBVzvsyAVLM6mHFThxXxw==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "reusify": "^1.0.4"
            }
        },
        "node_modules/file-entry-cache": {
            "version": "6.0.1",
            "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-6.0.1.tgz",
            "integrity": "sha512-7Gps/XWymbLk2QLYK4NzpMOrYjMhdIxXuIvy2QBsLE6ljuodKvdkWs/cpyJJ3CVIVpH0Oi1Hvg1ovbMzLdFBBg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "flat-cache": "^3.0.4"
            },
            "engines": {
                "node": "^10.12.0 || >=12.0.0"
            }
        },
        "node_modules/fill-range": {
            "version": "7.1.1",
            "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
            "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "to-regex-range": "^5.0.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/find-up": {
            "version": "5.0.0",
            "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
            "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "locate-path": "^6.0.0",
                "path-exists": "^4.0.0"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/flat-cache": {
            "version": "3.2.0",
            "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-3.2.0.tgz",
            "integrity": "sha512-CYcENa+FtcUKLmhhqyctpclsq7QF38pKjZHsGNiSQF5r4FtoKDWabFDl3hzaEQMvT1LHEysw5twgLvpYYb4vbw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "flatted": "^3.2.9",
                "keyv": "^4.5.3",
                "rimraf": "^3.0.2"
            },
            "engines": {
                "node": "^10.12.0 || >=12.0.0"
            }
        },
        "node_modules/flatted": {
            "version": "3.4.2",
            "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.2.tgz",
            "integrity": "sha512-PjDse7RzhcPkIJwy5t7KPWQSZ9cAbzQXcafsetQoD7sOJRQlGikNbx7yZp2OotDnJyrDcbyRq3Ttb18iYOqkxA==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/follow-redirects": {
            "version": "1.16.0",
            "resolved": "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.16.0.tgz",
            "integrity": "sha512-y5rN/uOsadFT/JfYwhxRS5R7Qce+g3zG97+JrtFZlC9klX/W5hD7iiLzScI4nZqUS7DNUdhPgw4xI8W2LuXlUw==",
            "funding": [
                {
                    "type": "individual",
                    "url": "https://github.com/sponsors/RubenVerborgh"
                }
            ],
            "license": "MIT",
            "engines": {
                "node": ">=4.0"
            },
            "peerDependenciesMeta": {
                "debug": {
                    "optional": true
                }
            }
        },
        "node_modules/for-each": {
            "version": "0.3.5",
            "resolved": "https://registry.npmjs.org/for-each/-/for-each-0.3.5.tgz",
            "integrity": "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-callable": "^1.2.7"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/form-data": {
            "version": "4.0.6",
            "resolved": "https://registry.npmjs.org/form-data/-/form-data-4.0.6.tgz",
            "integrity": "sha512-vKatAh4SlVfgbv+YtmhiRjhEMJsYpsG1Y2rMQtR+SVSbytsSD1YGzDIcrAJmdFec88u/+VoGmxnl+80gL1tRCQ==",
            "license": "MIT",
            "dependencies": {
                "asynckit": "^0.4.0",
                "combined-stream": "^1.0.8",
                "es-set-tostringtag": "^2.1.0",
                "hasown": "^2.0.4",
                "mime-types": "^2.1.35"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/fraction.js": {
            "version": "5.3.4",
            "resolved": "https://registry.npmjs.org/fraction.js/-/fraction.js-5.3.4.tgz",
            "integrity": "sha512-1X1NTtiJphryn/uLQz3whtY6jK3fTqoE3ohKs0tT+Ujr1W59oopxmoEh7Lu5p6vBaPbgoM0bzveAW4Qi5RyWDQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": "*"
            },
            "funding": {
                "type": "github",
                "url": "https://github.com/sponsors/rawify"
            }
        },
        "node_modules/fs.realpath": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
            "integrity": "sha512-OO0pH2lK6a0hZnAdau5ItzHPI6pUlvI7jMVnxUQRtw4owF2wk8lOSabtGDCTP4Ggrg2MbGnWO9X8K1t4+fGMDw==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/fsevents": {
            "version": "2.3.3",
            "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
            "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
            "dev": true,
            "hasInstallScript": true,
            "license": "MIT",
            "optional": true,
            "os": [
                "darwin"
            ],
            "engines": {
                "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
            }
        },
        "node_modules/function-bind": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
            "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
            "license": "MIT",
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/function.prototype.name": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.2.0.tgz",
            "integrity": "sha512-jObKIik1P2QjPHP5nz5BaOtUlfgS0fWo8IUByNXkM+o+02sJOi94em77GwJKQSJ3gfPHdgzLNrHc1uokV4P/ew==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.9",
                "call-bound": "^1.0.4",
                "es-define-property": "^1.0.1",
                "es-errors": "^1.3.0",
                "functions-have-names": "^1.2.3",
                "has-property-descriptors": "^1.0.2",
                "hasown": "^2.0.4",
                "is-callable": "^1.2.7",
                "is-document.all": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/functions-have-names": {
            "version": "1.2.3",
            "resolved": "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz",
            "integrity": "sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==",
            "dev": true,
            "license": "MIT",
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/generator-function": {
            "version": "2.0.1",
            "resolved": "https://registry.npmjs.org/generator-function/-/generator-function-2.0.1.tgz",
            "integrity": "sha512-SFdFmIJi+ybC0vjlHN0ZGVGHc3lgE0DxPAT0djjVg+kjOnSqclqmj0KQ7ykTOLP6YxoqOvuAODGdcHJn+43q3g==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/gensync": {
            "version": "1.0.0-beta.2",
            "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
            "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6.9.0"
            }
        },
        "node_modules/get-intrinsic": {
            "version": "1.3.0",
            "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
            "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
            "license": "MIT",
            "dependencies": {
                "call-bind-apply-helpers": "^1.0.2",
                "es-define-property": "^1.0.1",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.1.1",
                "function-bind": "^1.1.2",
                "get-proto": "^1.0.1",
                "gopd": "^1.2.0",
                "has-symbols": "^1.1.0",
                "hasown": "^2.0.2",
                "math-intrinsics": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/get-proto": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
            "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
            "license": "MIT",
            "dependencies": {
                "dunder-proto": "^1.0.1",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/get-symbol-description": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz",
            "integrity": "sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.6"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/glob": {
            "version": "7.2.3",
            "resolved": "https://registry.npmjs.org/glob/-/glob-7.2.3.tgz",
            "integrity": "sha512-nFR0zLpU2YCaRxwoCJvL6UvCH2JFyFVIvwTLsIf21AuHlMskA1hhTdk+LlYJtOlYt9v6dvszD2BGRqBL+iQK9Q==",
            "deprecated": "Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "fs.realpath": "^1.0.0",
                "inflight": "^1.0.4",
                "inherits": "2",
                "minimatch": "^3.1.1",
                "once": "^1.3.0",
                "path-is-absolute": "^1.0.0"
            },
            "engines": {
                "node": "*"
            },
            "funding": {
                "url": "https://github.com/sponsors/isaacs"
            }
        },
        "node_modules/glob-parent": {
            "version": "6.0.2",
            "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
            "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "is-glob": "^4.0.3"
            },
            "engines": {
                "node": ">=10.13.0"
            }
        },
        "node_modules/globals": {
            "version": "13.24.0",
            "resolved": "https://registry.npmjs.org/globals/-/globals-13.24.0.tgz",
            "integrity": "sha512-AhO5QUcj8llrbG09iWhPU2B204J1xnPeL8kQmVorSsy+Sjj1sk8gIyh6cUocGmH4L0UuhAJy+hJMRA4mgA4mFQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "type-fest": "^0.20.2"
            },
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/globalthis": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
            "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "define-properties": "^1.2.1",
                "gopd": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/goober": {
            "version": "2.1.19",
            "resolved": "https://registry.npmjs.org/goober/-/goober-2.1.19.tgz",
            "integrity": "sha512-U7veizMqxyKlM58+Z5j2ngJBH/r9siDmxpvNxSw0PylF6WQvrASJEZrxh1hidRBJc2jqoBVSyOban5u8m+6Rxg==",
            "license": "MIT",
            "peerDependencies": {
                "csstype": "^3.0.10"
            }
        },
        "node_modules/gopd": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
            "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/graphemer": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/graphemer/-/graphemer-1.4.0.tgz",
            "integrity": "sha512-EtKwoO6kxCL9WO5xipiHTZlSzBm7WLT627TqC/uVRd0HKmq8NXyebnNYxDoBi7wt8eTWrUrKXCOVaFq9x1kgag==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/has-bigints": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.1.0.tgz",
            "integrity": "sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-flag": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
            "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/has-property-descriptors": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
            "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-define-property": "^1.0.0"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-proto": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz",
            "integrity": "sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "dunder-proto": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-symbols": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
            "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/has-tostringtag": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
            "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
            "license": "MIT",
            "dependencies": {
                "has-symbols": "^1.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/hasown": {
            "version": "2.0.4",
            "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
            "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
            "license": "MIT",
            "dependencies": {
                "function-bind": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/https-proxy-agent": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/https-proxy-agent/-/https-proxy-agent-5.0.1.tgz",
            "integrity": "sha512-dFcAjpTQFgoLMzC2VwU+C/CbS7uRL0lWmxDITmqm7C+7F0Odmj6s9l6alZc6AELXhrnggM2CeWSXHGOdX2YtwA==",
            "license": "MIT",
            "dependencies": {
                "agent-base": "6",
                "debug": "4"
            },
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/ignore": {
            "version": "5.3.2",
            "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
            "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 4"
            }
        },
        "node_modules/import-fresh": {
            "version": "3.3.1",
            "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
            "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "parent-module": "^1.0.0",
                "resolve-from": "^4.0.0"
            },
            "engines": {
                "node": ">=6"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/imurmurhash": {
            "version": "0.1.4",
            "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
            "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.8.19"
            }
        },
        "node_modules/inflight": {
            "version": "1.0.6",
            "resolved": "https://registry.npmjs.org/inflight/-/inflight-1.0.6.tgz",
            "integrity": "sha512-k92I/b08q4wvFscXCLvqfsHCrjrF7yiXsQuIVvVE7N82W3+aqpzuUdBbfhWcy/FZR3/4IgflMgKLOsvPDrGCJA==",
            "deprecated": "This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "once": "^1.3.0",
                "wrappy": "1"
            }
        },
        "node_modules/inherits": {
            "version": "2.0.4",
            "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
            "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/internal-slot": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
            "integrity": "sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "hasown": "^2.0.2",
                "side-channel": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/is-array-buffer": {
            "version": "3.0.5",
            "resolved": "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz",
            "integrity": "sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.3",
                "get-intrinsic": "^1.2.6"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-async-function": {
            "version": "2.1.1",
            "resolved": "https://registry.npmjs.org/is-async-function/-/is-async-function-2.1.1.tgz",
            "integrity": "sha512-9dgM/cZBnNvjzaMYHVoxxfPj2QXt22Ev7SuuPrs+xav0ukGB0S6d4ydZdEiM48kLx5kDV+QBPrpVnFyefL8kkQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "async-function": "^1.0.0",
                "call-bound": "^1.0.3",
                "get-proto": "^1.0.1",
                "has-tostringtag": "^1.0.2",
                "safe-regex-test": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-bigint": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz",
            "integrity": "sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "has-bigints": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-binary-path": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/is-binary-path/-/is-binary-path-2.1.0.tgz",
            "integrity": "sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "binary-extensions": "^2.0.0"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/is-boolean-object": {
            "version": "1.2.2",
            "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.2.tgz",
            "integrity": "sha512-wa56o2/ElJMYqjCjGkXri7it5FbebW5usLw/nPmCMs5DeZ7eziSYZhSmPRn0txqeW4LnAmQQU7FgqLpsEFKM4A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "has-tostringtag": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-callable": {
            "version": "1.2.7",
            "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz",
            "integrity": "sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-core-module": {
            "version": "2.16.2",
            "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
            "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "hasown": "^2.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-data-view": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz",
            "integrity": "sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "get-intrinsic": "^1.2.6",
                "is-typed-array": "^1.1.13"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-date-object": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz",
            "integrity": "sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "has-tostringtag": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-document.all": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/is-document.all/-/is-document.all-1.0.0.tgz",
            "integrity": "sha512-+XSoyS05OdBbhFuELhgTCpFNHkpBOJqtsZfUFFpe5QTw+9Sjbh8zitxhQkYAo6wV7e1Vb8cAPvpCk9jGam/82g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.4"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-extglob": {
            "version": "2.1.1",
            "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
            "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/is-finalizationregistry": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz",
            "integrity": "sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-generator-function": {
            "version": "1.1.2",
            "resolved": "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.1.2.tgz",
            "integrity": "sha512-upqt1SkGkODW9tsGNG5mtXTXtECizwtS2kA161M+gJPc1xdb/Ax629af6YrTwcOeQHbewrPNlE5Dx7kzvXTizA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.4",
                "generator-function": "^2.0.0",
                "get-proto": "^1.0.1",
                "has-tostringtag": "^1.0.2",
                "safe-regex-test": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-glob": {
            "version": "4.0.3",
            "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
            "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-extglob": "^2.1.1"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/is-map": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz",
            "integrity": "sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-negative-zero": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz",
            "integrity": "sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-number": {
            "version": "7.0.0",
            "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
            "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.12.0"
            }
        },
        "node_modules/is-number-object": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz",
            "integrity": "sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "has-tostringtag": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-path-inside": {
            "version": "3.0.3",
            "resolved": "https://registry.npmjs.org/is-path-inside/-/is-path-inside-3.0.3.tgz",
            "integrity": "sha512-Fd4gABb+ycGAmKou8eMftCupSir5lRxqf4aD/vd0cD2qc4HL07OjCeuHMr8Ro4CoMaeCKDB0/ECBOVWjTwUvPQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/is-regex": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
            "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "gopd": "^1.2.0",
                "has-tostringtag": "^1.0.2",
                "hasown": "^2.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-set": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz",
            "integrity": "sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-shared-array-buffer": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz",
            "integrity": "sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-string": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz",
            "integrity": "sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "has-tostringtag": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-symbol": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz",
            "integrity": "sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "has-symbols": "^1.1.0",
                "safe-regex-test": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-typed-array": {
            "version": "1.1.15",
            "resolved": "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz",
            "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "which-typed-array": "^1.1.16"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-weakmap": {
            "version": "2.0.2",
            "resolved": "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz",
            "integrity": "sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-weakref": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.1.tgz",
            "integrity": "sha512-6i9mGWSlqzNMEqpCp93KwRS1uUOodk2OJ6b+sq7ZPDSy2WuI5NFIxp/254TytR8ftefexkWn5xNiHUNpPOfSew==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/is-weakset": {
            "version": "2.0.4",
            "resolved": "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.4.tgz",
            "integrity": "sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "get-intrinsic": "^1.2.6"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/isarray": {
            "version": "2.0.5",
            "resolved": "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz",
            "integrity": "sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/isexe": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
            "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/iterator.prototype": {
            "version": "1.1.5",
            "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",
            "integrity": "sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "define-data-property": "^1.1.4",
                "es-object-atoms": "^1.0.0",
                "get-intrinsic": "^1.2.6",
                "get-proto": "^1.0.0",
                "has-symbols": "^1.1.0",
                "set-function-name": "^2.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/jiti": {
            "version": "1.21.7",
            "resolved": "https://registry.npmjs.org/jiti/-/jiti-1.21.7.tgz",
            "integrity": "sha512-/imKNG4EbWNrVjoNC/1H5/9GFy+tqjGBHCaSsN+P2RnPqjsLmv6UD3Ej+Kj8nBWaRAwyk7kK5ZUc+OEatnTR3A==",
            "dev": true,
            "license": "MIT",
            "bin": {
                "jiti": "bin/jiti.js"
            }
        },
        "node_modules/js-tokens": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
            "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
            "license": "MIT"
        },
        "node_modules/js-yaml": {
            "version": "4.2.0",
            "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.2.0.tgz",
            "integrity": "sha512-ePWsvanv0DWuDRsW8dnt+R4jQ31SCRCQ7hhNcPXZPsoBZiemuZNYGf7adZdqX2D86j6rvKp3RpCxVTSb8WQlOw==",
            "dev": true,
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/puzrin"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/nodeca"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "argparse": "^2.0.1"
            },
            "bin": {
                "js-yaml": "bin/js-yaml.js"
            }
        },
        "node_modules/jsesc": {
            "version": "3.1.0",
            "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
            "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
            "dev": true,
            "license": "MIT",
            "bin": {
                "jsesc": "bin/jsesc"
            },
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/json-buffer": {
            "version": "3.0.1",
            "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
            "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/json-schema-traverse": {
            "version": "0.4.1",
            "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
            "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/json-stable-stringify-without-jsonify": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
            "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/json5": {
            "version": "2.2.3",
            "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
            "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
            "dev": true,
            "license": "MIT",
            "bin": {
                "json5": "lib/cli.js"
            },
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/jsx-ast-utils": {
            "version": "3.3.5",
            "resolved": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz",
            "integrity": "sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "array-includes": "^3.1.6",
                "array.prototype.flat": "^1.3.1",
                "object.assign": "^4.1.4",
                "object.values": "^1.1.6"
            },
            "engines": {
                "node": ">=4.0"
            }
        },
        "node_modules/keyv": {
            "version": "4.5.4",
            "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
            "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "json-buffer": "3.0.1"
            }
        },
        "node_modules/levn": {
            "version": "0.4.1",
            "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
            "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "prelude-ls": "^1.2.1",
                "type-check": "~0.4.0"
            },
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/lilconfig": {
            "version": "3.1.3",
            "resolved": "https://registry.npmjs.org/lilconfig/-/lilconfig-3.1.3.tgz",
            "integrity": "sha512-/vlFKAoH5Cgt3Ie+JLhRbwOsCQePABiU3tJ1egGvyQ+33R/vcwM2Zl2QR/LzjsBeItPt3oSVXapn+m4nQDvpzw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=14"
            },
            "funding": {
                "url": "https://github.com/sponsors/antonk52"
            }
        },
        "node_modules/lines-and-columns": {
            "version": "1.2.4",
            "resolved": "https://registry.npmjs.org/lines-and-columns/-/lines-and-columns-1.2.4.tgz",
            "integrity": "sha512-7ylylesZQ/PV29jhEDl3Ufjo6ZX7gCqJr5F7PKrqc93v7fzSymt1BpwEU8nAUXs8qzzvqhbjhK5QZg6Mt/HkBg==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/locate-path": {
            "version": "6.0.0",
            "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
            "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "p-locate": "^5.0.0"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/lodash.merge": {
            "version": "4.6.2",
            "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
            "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/loose-envify": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
            "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
            "license": "MIT",
            "dependencies": {
                "js-tokens": "^3.0.0 || ^4.0.0"
            },
            "bin": {
                "loose-envify": "cli.js"
            }
        },
        "node_modules/lru-cache": {
            "version": "5.1.1",
            "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
            "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "yallist": "^3.0.2"
            }
        },
        "node_modules/lucide-react": {
            "version": "0.294.0",
            "resolved": "https://registry.npmjs.org/lucide-react/-/lucide-react-0.294.0.tgz",
            "integrity": "sha512-V7o0/VECSGbLHn3/1O67FUgBwWB+hmzshrgDVRJQhMh8uj5D3HBuIvhuAmQTtlupILSplwIZg5FTc4tTKMA2SA==",
            "license": "ISC",
            "peerDependencies": {
                "react": "^16.5.1 || ^17.0.0 || ^18.0.0"
            }
        },
        "node_modules/math-intrinsics": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
            "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/merge2": {
            "version": "1.4.1",
            "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
            "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/micromatch": {
            "version": "4.0.8",
            "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
            "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "braces": "^3.0.3",
                "picomatch": "^2.3.1"
            },
            "engines": {
                "node": ">=8.6"
            }
        },
        "node_modules/mime-db": {
            "version": "1.52.0",
            "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.52.0.tgz",
            "integrity": "sha512-sPU4uV7dYlvtWJxwwxHD0PuihVNiE7TyAbQ5SWxDCB9mUYvOgroQOwYQQOKPJ8CIbE+1ETVlOoK1UC2nU3gYvg==",
            "license": "MIT",
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/mime-types": {
            "version": "2.1.35",
            "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.35.tgz",
            "integrity": "sha512-ZDY+bPm5zTTF+YpCrAU9nK0UgICYPT0QtT1NZWFv4s++TNkcgVaT0g6+4R2uI4MjQjzysHB1zxuWL50hzaeXiw==",
            "license": "MIT",
            "dependencies": {
                "mime-db": "1.52.0"
            },
            "engines": {
                "node": ">= 0.6"
            }
        },
        "node_modules/minimatch": {
            "version": "3.1.5",
            "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
            "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "brace-expansion": "^1.1.7"
            },
            "engines": {
                "node": "*"
            }
        },
        "node_modules/monaco-editor": {
            "version": "0.44.0",
            "resolved": "https://registry.npmjs.org/monaco-editor/-/monaco-editor-0.44.0.tgz",
            "integrity": "sha512-5SmjNStN6bSuSE5WPT2ZV+iYn1/yI9sd4Igtk23ChvqB7kDk9lZbB9F5frsuvpB+2njdIeGGFf2G4gbE6rCC9Q==",
            "license": "MIT"
        },
        "node_modules/ms": {
            "version": "2.1.3",
            "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
            "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
            "license": "MIT"
        },
        "node_modules/mz": {
            "version": "2.7.0",
            "resolved": "https://registry.npmjs.org/mz/-/mz-2.7.0.tgz",
            "integrity": "sha512-z81GNO7nnYMEhrGh9LeymoE4+Yr0Wn5McHIZMK5cfQCl+NDX08sCZgUc9/6MHni9IWuFLm1Z3HTCXu2z9fN62Q==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "any-promise": "^1.0.0",
                "object-assign": "^4.0.1",
                "thenify-all": "^1.0.0"
            }
        },
        "node_modules/nanoid": {
            "version": "3.3.13",
            "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.13.tgz",
            "integrity": "sha512-sPdqC6ByMVVGvF1ynvvMo0/o+oD1VX7DaHhijt1bFgjvBkHBib4t49GoNDhf2NDta4oeUNlaGbSt5K7qjZ955Q==",
            "dev": true,
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "bin": {
                "nanoid": "bin/nanoid.cjs"
            },
            "engines": {
                "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
            }
        },
        "node_modules/natural-compare": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
            "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/node-exports-info": {
            "version": "1.6.0",
            "resolved": "https://registry.npmjs.org/node-exports-info/-/node-exports-info-1.6.0.tgz",
            "integrity": "sha512-pyFS63ptit/P5WqUkt+UUfe+4oevH+bFeIiPPdfb0pFeYEu/1ELnJu5l+5EcTKYL5M7zaAa7S8ddywgXypqKCw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "array.prototype.flatmap": "^1.3.3",
                "es-errors": "^1.3.0",
                "object.entries": "^1.1.9",
                "semver": "^6.3.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/node-releases": {
            "version": "2.0.48",
            "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.48.tgz",
            "integrity": "sha512-1uz8041X6LoI6ZSdZacM9lVY28vuzDlSKitnpbSNK0RfKoIJkX29NBPVEFXhnuSuEOA9Ww0xnPJ+ILWbGAv8DA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=18"
            }
        },
        "node_modules/normalize-path": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/normalize-path/-/normalize-path-3.0.0.tgz",
            "integrity": "sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/object-assign": {
            "version": "4.1.1",
            "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
            "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/object-hash": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/object-hash/-/object-hash-3.0.0.tgz",
            "integrity": "sha512-RSn9F68PjH9HqtltsSnqYC1XXoWe9Bju5+213R98cNGttag9q9yAOTzdbsqvIa7aNm5WffBZFpWYr2aWrklWAw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/object-inspect": {
            "version": "1.13.4",
            "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
            "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/object-keys": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
            "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/object.assign": {
            "version": "4.1.7",
            "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz",
            "integrity": "sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.3",
                "define-properties": "^1.2.1",
                "es-object-atoms": "^1.0.0",
                "has-symbols": "^1.1.0",
                "object-keys": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/object.entries": {
            "version": "1.1.9",
            "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.1.9.tgz",
            "integrity": "sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.4",
                "define-properties": "^1.2.1",
                "es-object-atoms": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/object.fromentries": {
            "version": "2.0.8",
            "resolved": "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz",
            "integrity": "sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.7",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.2",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/object.values": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz",
            "integrity": "sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.3",
                "define-properties": "^1.2.1",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/once": {
            "version": "1.4.0",
            "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
            "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "wrappy": "1"
            }
        },
        "node_modules/optionator": {
            "version": "0.9.4",
            "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
            "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "deep-is": "^0.1.3",
                "fast-levenshtein": "^2.0.6",
                "levn": "^0.4.1",
                "prelude-ls": "^1.2.1",
                "type-check": "^0.4.0",
                "word-wrap": "^1.2.5"
            },
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/own-keys": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.1.tgz",
            "integrity": "sha512-qFOyK5PjiWZd+QQIh+1jhdb9LpxTF0qs7Pm8o5QHYZ0M3vKqSqzsZaEB6oWlxZ+q2sJBMI/Ktgd2N5ZwQoRHfg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "get-intrinsic": "^1.2.6",
                "object-keys": "^1.1.1",
                "safe-push-apply": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/p-limit": {
            "version": "3.1.0",
            "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
            "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "yocto-queue": "^0.1.0"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/p-locate": {
            "version": "5.0.0",
            "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
            "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "p-limit": "^3.0.2"
            },
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/parent-module": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
            "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "callsites": "^3.0.0"
            },
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/path-exists": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
            "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/path-is-absolute": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.1.tgz",
            "integrity": "sha512-AVbw3UJ2e9bq64vSaS9Am0fje1Pa8pbGqTTsmXfaIiMpnr5DlDhfJOuLj9Sf95ZPVDAUerDfEk88MPmPe7UCQg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/path-key": {
            "version": "3.1.1",
            "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
            "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/path-parse": {
            "version": "1.0.7",
            "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
            "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/picocolors": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
            "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/picomatch": {
            "version": "2.3.2",
            "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
            "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8.6"
            },
            "funding": {
                "url": "https://github.com/sponsors/jonschlinkert"
            }
        },
        "node_modules/pify": {
            "version": "2.3.0",
            "resolved": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
            "integrity": "sha512-udgsAY+fTnvv7kI7aaxbqwWNb0AHiB0qBO89PZKPkoTmGOgdbrHDKD+0B2X4uTfJ/FT1R09r9gTsjUjNJotuog==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/pirates": {
            "version": "4.0.7",
            "resolved": "https://registry.npmjs.org/pirates/-/pirates-4.0.7.tgz",
            "integrity": "sha512-TfySrs/5nm8fQJDcBDuUng3VOUKsd7S+zqvbOTiGXHfxX4wK31ard+hoNuvkicM/2YFzlpDgABOevKSsB4G/FA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 6"
            }
        },
        "node_modules/possible-typed-array-names": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.1.0.tgz",
            "integrity": "sha512-/+5VFTchJDoVj3bhoqi6UeymcD00DAwb1nJwamzPvHEszJ4FpF6SNNbUbOS8yI56qHzdV8eK0qEfOSiodkTdxg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/postcss": {
            "version": "8.5.15",
            "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.15.tgz",
            "integrity": "sha512-FfR8sjd4em2T6fb3I2MwAJU7HWVMr9zba+enmQeeWFfCbm+UOC/0X4DS8XtpUTMwWMGbjKYP7xjfNekzyGmB3A==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/postcss/"
                },
                {
                    "type": "tidelift",
                    "url": "https://tidelift.com/funding/github/npm/postcss"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "nanoid": "^3.3.12",
                "picocolors": "^1.1.1",
                "source-map-js": "^1.2.1"
            },
            "engines": {
                "node": "^10 || ^12 || >=14"
            }
        },
        "node_modules/postcss-import": {
            "version": "15.1.0",
            "resolved": "https://registry.npmjs.org/postcss-import/-/postcss-import-15.1.0.tgz",
            "integrity": "sha512-hpr+J05B2FVYUAXHeK1YyI267J/dDDhMU6B6civm8hSY1jYJnBXxzKDKDswzJmtLHryrjhnDjqqp/49t8FALew==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "postcss-value-parser": "^4.0.0",
                "read-cache": "^1.0.0",
                "resolve": "^1.1.7"
            },
            "engines": {
                "node": ">=14.0.0"
            },
            "peerDependencies": {
                "postcss": "^8.0.0"
            }
        },
        "node_modules/postcss-import/node_modules/resolve": {
            "version": "1.22.12",
            "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
            "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "is-core-module": "^2.16.1",
                "path-parse": "^1.0.7",
                "supports-preserve-symlinks-flag": "^1.0.0"
            },
            "bin": {
                "resolve": "bin/resolve"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/postcss-js": {
            "version": "4.1.0",
            "resolved": "https://registry.npmjs.org/postcss-js/-/postcss-js-4.1.0.tgz",
            "integrity": "sha512-oIAOTqgIo7q2EOwbhb8UalYePMvYoIeRY2YKntdpFQXNosSu3vLrniGgmH9OKs/qAkfoj5oB3le/7mINW1LCfw==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/postcss/"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "camelcase-css": "^2.0.1"
            },
            "engines": {
                "node": "^12 || ^14 || >= 16"
            },
            "peerDependencies": {
                "postcss": "^8.4.21"
            }
        },
        "node_modules/postcss-load-config": {
            "version": "6.0.1",
            "resolved": "https://registry.npmjs.org/postcss-load-config/-/postcss-load-config-6.0.1.tgz",
            "integrity": "sha512-oPtTM4oerL+UXmx+93ytZVN82RrlY/wPUV8IeDxFrzIjXOLF1pN+EmKPLbubvKHT2HC20xXsCAH2Z+CKV6Oz/g==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/postcss/"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "lilconfig": "^3.1.1"
            },
            "engines": {
                "node": ">= 18"
            },
            "peerDependencies": {
                "jiti": ">=1.21.0",
                "postcss": ">=8.0.9",
                "tsx": "^4.8.1",
                "yaml": "^2.4.2"
            },
            "peerDependenciesMeta": {
                "jiti": {
                    "optional": true
                },
                "postcss": {
                    "optional": true
                },
                "tsx": {
                    "optional": true
                },
                "yaml": {
                    "optional": true
                }
            }
        },
        "node_modules/postcss-nested": {
            "version": "6.2.0",
            "resolved": "https://registry.npmjs.org/postcss-nested/-/postcss-nested-6.2.0.tgz",
            "integrity": "sha512-HQbt28KulC5AJzG+cZtj9kvKB93CFCdLvog1WFLf1D+xmMvPGlBstkpTEZfK5+AN9hfJocyBFCNiqyS48bpgzQ==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/postcss/"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "postcss-selector-parser": "^6.1.1"
            },
            "engines": {
                "node": ">=12.0"
            },
            "peerDependencies": {
                "postcss": "^8.2.14"
            }
        },
        "node_modules/postcss-selector-parser": {
            "version": "6.1.4",
            "resolved": "https://registry.npmjs.org/postcss-selector-parser/-/postcss-selector-parser-6.1.4.tgz",
            "integrity": "sha512-bIoJLOmjCO1S9XdY/DcnR5hJxvrDir1PbGChrzXG3vw0/FOliy/fA3dmdhQ441kah4gKv+TwckGzex6wNS5cnQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "cssesc": "^3.0.0",
                "util-deprecate": "^1.0.2"
            },
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/postcss-value-parser": {
            "version": "4.2.0",
            "resolved": "https://registry.npmjs.org/postcss-value-parser/-/postcss-value-parser-4.2.0.tgz",
            "integrity": "sha512-1NNCs6uurfkVbeXG4S8JFT9t19m45ICnif8zWLd5oPSZ50QnwMfK+H3jv408d4jw/7Bttv5axS5IiHoLaVNHeQ==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/prelude-ls": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
            "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/prop-types": {
            "version": "15.8.1",
            "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
            "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "loose-envify": "^1.4.0",
                "object-assign": "^4.1.1",
                "react-is": "^16.13.1"
            }
        },
        "node_modules/proxy-from-env": {
            "version": "2.1.0",
            "resolved": "https://registry.npmjs.org/proxy-from-env/-/proxy-from-env-2.1.0.tgz",
            "integrity": "sha512-cJ+oHTW1VAEa8cJslgmUZrc+sjRKgAKl3Zyse6+PV38hZe/V6Z14TbCuXcan9F9ghlz4QrFr2c92TNF82UkYHA==",
            "license": "MIT",
            "engines": {
                "node": ">=10"
            }
        },
        "node_modules/punycode": {
            "version": "2.3.1",
            "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
            "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=6"
            }
        },
        "node_modules/queue-microtask": {
            "version": "1.2.3",
            "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
            "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
            "dev": true,
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/feross"
                },
                {
                    "type": "patreon",
                    "url": "https://www.patreon.com/feross"
                },
                {
                    "type": "consulting",
                    "url": "https://feross.org/support"
                }
            ],
            "license": "MIT"
        },
        "node_modules/react": {
            "version": "18.3.1",
            "resolved": "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
            "integrity": "sha512-wS+hAgJShR0KhEvPJArfuPVN1+Hz1t0Y6n5jLrGQbkb4urgPE/0Rve+1kMB1v/oWgHgm4WIcV+i7F2pTVj+2iQ==",
            "license": "MIT",
            "dependencies": {
                "loose-envify": "^1.1.0"
            },
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/react-dom": {
            "version": "18.3.1",
            "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz",
            "integrity": "sha512-5m4nQKp+rZRb09LNH59GM4BxTh9251/ylbKIbpe7TpGxfJ+9kv6BLkLBXIjjspbgbnIBNqlI23tRnTWT0snUIw==",
            "license": "MIT",
            "dependencies": {
                "loose-envify": "^1.1.0",
                "scheduler": "^0.23.2"
            },
            "peerDependencies": {
                "react": "^18.3.1"
            }
        },
        "node_modules/react-hot-toast": {
            "version": "2.6.0",
            "resolved": "https://registry.npmjs.org/react-hot-toast/-/react-hot-toast-2.6.0.tgz",
            "integrity": "sha512-bH+2EBMZ4sdyou/DPrfgIouFpcRLCJ+HoCA32UoAYHn6T3Ur5yfcDCeSr5mwldl6pFOsiocmrXMuoCJ1vV8bWg==",
            "license": "MIT",
            "dependencies": {
                "csstype": "^3.1.3",
                "goober": "^2.1.16"
            },
            "engines": {
                "node": ">=10"
            },
            "peerDependencies": {
                "react": ">=16",
                "react-dom": ">=16"
            }
        },
        "node_modules/react-is": {
            "version": "16.13.1",
            "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
            "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/react-refresh": {
            "version": "0.17.0",
            "resolved": "https://registry.npmjs.org/react-refresh/-/react-refresh-0.17.0.tgz",
            "integrity": "sha512-z6F7K9bV85EfseRCp2bzrpyQ0Gkw1uLoCel9XBVWPg/TjRj94SkJzUTGfOa4bs7iJvBWtQG0Wq7wnI0syw3EBQ==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/react-router": {
            "version": "6.30.4",
            "resolved": "https://registry.npmjs.org/react-router/-/react-router-6.30.4.tgz",
            "integrity": "sha512-SVUsDe+DybHM/WmYKIVYhZh1o5Dcuf16yM6WjG02Q9XVFMZIJyHYhwrr6bFBXZkVP6z69kNkMyBCujt8FaFLJA==",
            "license": "MIT",
            "dependencies": {
                "@remix-run/router": "1.23.3"
            },
            "engines": {
                "node": ">=14.0.0"
            },
            "peerDependencies": {
                "react": ">=16.8"
            }
        },
        "node_modules/react-router-dom": {
            "version": "6.30.4",
            "resolved": "https://registry.npmjs.org/react-router-dom/-/react-router-dom-6.30.4.tgz",
            "integrity": "sha512-q4HvNl+mmDdkS0g+MqiBZNteQJCuimWoOyHMy4T/RQLAn9Z29+E91QXRaxOujeMl2HTzRSS0KFPd7lxX3PjV0Q==",
            "license": "MIT",
            "dependencies": {
                "@remix-run/router": "1.23.3",
                "react-router": "6.30.4"
            },
            "engines": {
                "node": ">=14.0.0"
            },
            "peerDependencies": {
                "react": ">=16.8",
                "react-dom": ">=16.8"
            }
        },
        "node_modules/read-cache": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/read-cache/-/read-cache-1.0.0.tgz",
            "integrity": "sha512-Owdv/Ft7IjOgm/i0xvNDZ1LrRANRfew4b2prF3OWMQLxLfu3bS8FVhCsrSCMK4lR56Y9ya+AThoTpDCTxCmpRA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "pify": "^2.3.0"
            }
        },
        "node_modules/readdirp": {
            "version": "3.6.0",
            "resolved": "https://registry.npmjs.org/readdirp/-/readdirp-3.6.0.tgz",
            "integrity": "sha512-hOS089on8RduqdbhvQ5Z37A0ESjsqz6qnRcffsMU3495FuTdqSm+7bhJ29JvIOsBDEEnan5DPu9t3To9VRlMzA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "picomatch": "^2.2.1"
            },
            "engines": {
                "node": ">=8.10.0"
            }
        },
        "node_modules/reflect.getprototypeof": {
            "version": "1.0.10",
            "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
            "integrity": "sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.9",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.0.0",
                "get-intrinsic": "^1.2.7",
                "get-proto": "^1.0.1",
                "which-builtin-type": "^1.2.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/regexp.prototype.flags": {
            "version": "1.5.4",
            "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz",
            "integrity": "sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "define-properties": "^1.2.1",
                "es-errors": "^1.3.0",
                "get-proto": "^1.0.1",
                "gopd": "^1.2.0",
                "set-function-name": "^2.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/resolve": {
            "version": "2.0.0-next.7",
            "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.7.tgz",
            "integrity": "sha512-tqt+NBWwyaMgw3zDsnygx4CByWjQEJHOPMdslYhppaQSJUtL/D4JO9CcBBlhPoI8lz9oJIDXkwXfhF4aWqP8xQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "is-core-module": "^2.16.2",
                "node-exports-info": "^1.6.0",
                "object-keys": "^1.1.1",
                "path-parse": "^1.0.7",
                "supports-preserve-symlinks-flag": "^1.0.0"
            },
            "bin": {
                "resolve": "bin/resolve"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/resolve-from": {
            "version": "4.0.0",
            "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
            "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=4"
            }
        },
        "node_modules/reusify": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
            "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "iojs": ">=1.0.0",
                "node": ">=0.10.0"
            }
        },
        "node_modules/rimraf": {
            "version": "3.0.2",
            "resolved": "https://registry.npmjs.org/rimraf/-/rimraf-3.0.2.tgz",
            "integrity": "sha512-JZkJMZkAGFFPP2YqXZXPbMlMBgsxzE8ILs4lMIX/2o0L9UBw9O/Y3o6wFw/i9YLapcUJWwqbi3kdxIPdC62TIA==",
            "deprecated": "Rimraf versions prior to v4 are no longer supported",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "glob": "^7.1.3"
            },
            "bin": {
                "rimraf": "bin.js"
            },
            "funding": {
                "url": "https://github.com/sponsors/isaacs"
            }
        },
        "node_modules/rollup": {
            "version": "4.62.2",
            "resolved": "https://registry.npmjs.org/rollup/-/rollup-4.62.2.tgz",
            "integrity": "sha512-RFnrW4lhXA3s3eqHDZvN654g8OTjzRfqpIRJYczCGB6HzphckVAi/Qh4tbPUbRuDi7s1Llv8g/NspLkttY3gTA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@types/estree": "1.0.9"
            },
            "bin": {
                "rollup": "dist/bin/rollup"
            },
            "engines": {
                "node": ">=18.0.0",
                "npm": ">=8.0.0"
            },
            "optionalDependencies": {
                "@rollup/rollup-android-arm-eabi": "4.62.2",
                "@rollup/rollup-android-arm64": "4.62.2",
                "@rollup/rollup-darwin-arm64": "4.62.2",
                "@rollup/rollup-darwin-x64": "4.62.2",
                "@rollup/rollup-freebsd-arm64": "4.62.2",
                "@rollup/rollup-freebsd-x64": "4.62.2",
                "@rollup/rollup-linux-arm-gnueabihf": "4.62.2",
                "@rollup/rollup-linux-arm-musleabihf": "4.62.2",
                "@rollup/rollup-linux-arm64-gnu": "4.62.2",
                "@rollup/rollup-linux-arm64-musl": "4.62.2",
                "@rollup/rollup-linux-loong64-gnu": "4.62.2",
                "@rollup/rollup-linux-loong64-musl": "4.62.2",
                "@rollup/rollup-linux-ppc64-gnu": "4.62.2",
                "@rollup/rollup-linux-ppc64-musl": "4.62.2",
                "@rollup/rollup-linux-riscv64-gnu": "4.62.2",
                "@rollup/rollup-linux-riscv64-musl": "4.62.2",
                "@rollup/rollup-linux-s390x-gnu": "4.62.2",
                "@rollup/rollup-linux-x64-gnu": "4.62.2",
                "@rollup/rollup-linux-x64-musl": "4.62.2",
                "@rollup/rollup-openbsd-x64": "4.62.2",
                "@rollup/rollup-openharmony-arm64": "4.62.2",
                "@rollup/rollup-win32-arm64-msvc": "4.62.2",
                "@rollup/rollup-win32-ia32-msvc": "4.62.2",
                "@rollup/rollup-win32-x64-gnu": "4.62.2",
                "@rollup/rollup-win32-x64-msvc": "4.62.2",
                "fsevents": "~2.3.2"
            }
        },
        "node_modules/run-parallel": {
            "version": "1.2.0",
            "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
            "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
            "dev": true,
            "funding": [
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/feross"
                },
                {
                    "type": "patreon",
                    "url": "https://www.patreon.com/feross"
                },
                {
                    "type": "consulting",
                    "url": "https://feross.org/support"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "queue-microtask": "^1.2.2"
            }
        },
        "node_modules/safe-array-concat": {
            "version": "1.1.4",
            "resolved": "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.4.tgz",
            "integrity": "sha512-wtZlHyOje6OZTGqAoaDKxFkgRtkF9CnHAVnCHKfuj200wAgL+bSJhdsCD2l0Qx/2ekEXjPWcyKkfGb5CPboslg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.9",
                "call-bound": "^1.0.4",
                "get-intrinsic": "^1.3.0",
                "has-symbols": "^1.1.0",
                "isarray": "^2.0.5"
            },
            "engines": {
                "node": ">=0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/safe-push-apply": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz",
            "integrity": "sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "isarray": "^2.0.5"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/safe-regex-test": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
            "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "is-regex": "^1.2.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/scheduler": {
            "version": "0.23.2",
            "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.23.2.tgz",
            "integrity": "sha512-UOShsPwz7NrMUqhR6t0hWjFduvOzbtv7toDH1/hIrfRNIDBnnBWd0CwJTGvTpngVlmwGCdP9/Zl/tVrDqcuYzQ==",
            "license": "MIT",
            "dependencies": {
                "loose-envify": "^1.1.0"
            }
        },
        "node_modules/semver": {
            "version": "6.3.1",
            "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
            "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
            "dev": true,
            "license": "ISC",
            "bin": {
                "semver": "bin/semver.js"
            }
        },
        "node_modules/set-function-length": {
            "version": "1.2.2",
            "resolved": "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz",
            "integrity": "sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "define-data-property": "^1.1.4",
                "es-errors": "^1.3.0",
                "function-bind": "^1.1.2",
                "get-intrinsic": "^1.2.4",
                "gopd": "^1.0.1",
                "has-property-descriptors": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/set-function-name": {
            "version": "2.0.2",
            "resolved": "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz",
            "integrity": "sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "define-data-property": "^1.1.4",
                "es-errors": "^1.3.0",
                "functions-have-names": "^1.2.3",
                "has-property-descriptors": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/set-proto": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz",
            "integrity": "sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "dunder-proto": "^1.0.1",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/shebang-command": {
            "version": "2.0.0",
            "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
            "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "shebang-regex": "^3.0.0"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/shebang-regex": {
            "version": "3.0.0",
            "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
            "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/side-channel": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
            "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "object-inspect": "^1.13.4",
                "side-channel-list": "^1.0.1",
                "side-channel-map": "^1.0.1",
                "side-channel-weakmap": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-list": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
            "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "object-inspect": "^1.13.4"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-map": {
            "version": "1.0.1",
            "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
            "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.5",
                "object-inspect": "^1.13.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/side-channel-weakmap": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
            "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "es-errors": "^1.3.0",
                "get-intrinsic": "^1.2.5",
                "object-inspect": "^1.13.3",
                "side-channel-map": "^1.0.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/source-map-js": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
            "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
            "dev": true,
            "license": "BSD-3-Clause",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/state-local": {
            "version": "1.0.7",
            "resolved": "https://registry.npmjs.org/state-local/-/state-local-1.0.7.tgz",
            "integrity": "sha512-HTEHMNieakEnoe33shBYcZ7NX83ACUjCu8c40iOGEZsngj9zRnkqS9j1pqQPXwobB0ZcVTk27REb7COQ0UR59w==",
            "license": "MIT"
        },
        "node_modules/stop-iteration-iterator": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
            "integrity": "sha512-eLoXW/DHyl62zxY4SCaIgnRhuMr6ri4juEYARS8E6sCEqzKpOiE521Ucofdx+KnDZl5xmvGYaaKCk5FEOxJCoQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "internal-slot": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/string.prototype.matchall": {
            "version": "4.0.12",
            "resolved": "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.0.12.tgz",
            "integrity": "sha512-6CC9uyBL+/48dYizRf7H7VAYCMCNTBeM78x/VTUe9bFEaxBepPJDa1Ow99LqI/1yF7kuy7Q3cQsYMrcjGUcskA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "call-bound": "^1.0.3",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.23.6",
                "es-errors": "^1.3.0",
                "es-object-atoms": "^1.0.0",
                "get-intrinsic": "^1.2.6",
                "gopd": "^1.2.0",
                "has-symbols": "^1.1.0",
                "internal-slot": "^1.1.0",
                "regexp.prototype.flags": "^1.5.3",
                "set-function-name": "^2.0.2",
                "side-channel": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/string.prototype.repeat": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz",
            "integrity": "sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "define-properties": "^1.1.3",
                "es-abstract": "^1.17.5"
            }
        },
        "node_modules/string.prototype.trim": {
            "version": "1.2.11",
            "resolved": "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.11.tgz",
            "integrity": "sha512-PwvK7BU+CMTJGYQCTZb5RWXIML92lftJLhQz1tBzgKiqGxJaMlBAa48POXaNAC2s4y8jr3EFqrkF9+44neS46w==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.9",
                "call-bound": "^1.0.4",
                "define-data-property": "^1.1.4",
                "define-properties": "^1.2.1",
                "es-abstract": "^1.24.2",
                "es-object-atoms": "^1.1.2",
                "has-property-descriptors": "^1.0.2",
                "safe-regex-test": "^1.1.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/string.prototype.trimend": {
            "version": "1.0.10",
            "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.10.tgz",
            "integrity": "sha512-2+3aDAOmPTmuFwjDnmJG2ctEkQKVki7vOSqaxkv42Mowj1V6PnvuwFCRrR5lChUux1TBskPjfkeTOhqczDMxTw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.9",
                "call-bound": "^1.0.4",
                "define-properties": "^1.2.1",
                "es-object-atoms": "^1.1.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/string.prototype.trimstart": {
            "version": "1.0.8",
            "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz",
            "integrity": "sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.7",
                "define-properties": "^1.2.1",
                "es-object-atoms": "^1.0.0"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/strip-ansi": {
            "version": "6.0.1",
            "resolved": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-6.0.1.tgz",
            "integrity": "sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "ansi-regex": "^5.0.1"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/strip-json-comments": {
            "version": "3.1.1",
            "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
            "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=8"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/sucrase": {
            "version": "3.35.1",
            "resolved": "https://registry.npmjs.org/sucrase/-/sucrase-3.35.1.tgz",
            "integrity": "sha512-DhuTmvZWux4H1UOnWMB3sk0sbaCVOoQZjv8u1rDoTV0HTdGem9hkAZtl4JZy8P2z4Bg0nT+YMeOFyVr4zcG5Tw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@jridgewell/gen-mapping": "^0.3.2",
                "commander": "^4.0.0",
                "lines-and-columns": "^1.1.6",
                "mz": "^2.7.0",
                "pirates": "^4.0.1",
                "tinyglobby": "^0.2.11",
                "ts-interface-checker": "^0.1.9"
            },
            "bin": {
                "sucrase": "bin/sucrase",
                "sucrase-node": "bin/sucrase-node"
            },
            "engines": {
                "node": ">=16 || 14 >=14.17"
            }
        },
        "node_modules/supports-color": {
            "version": "7.2.0",
            "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
            "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "has-flag": "^4.0.0"
            },
            "engines": {
                "node": ">=8"
            }
        },
        "node_modules/supports-preserve-symlinks-flag": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
            "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/tailwindcss": {
            "version": "3.4.19",
            "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.19.tgz",
            "integrity": "sha512-3ofp+LL8E+pK/JuPLPggVAIaEuhvIz4qNcf3nA1Xn2o/7fb7s/TYpHhwGDv1ZU3PkBluUVaF8PyCHcm48cKLWQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "@alloc/quick-lru": "^5.2.0",
                "arg": "^5.0.2",
                "chokidar": "^3.6.0",
                "didyoumean": "^1.2.2",
                "dlv": "^1.1.3",
                "fast-glob": "^3.3.2",
                "glob-parent": "^6.0.2",
                "is-glob": "^4.0.3",
                "jiti": "^1.21.7",
                "lilconfig": "^3.1.3",
                "micromatch": "^4.0.8",
                "normalize-path": "^3.0.0",
                "object-hash": "^3.0.0",
                "picocolors": "^1.1.1",
                "postcss": "^8.4.47",
                "postcss-import": "^15.1.0",
                "postcss-js": "^4.0.1",
                "postcss-load-config": "^4.0.2 || ^5.0 || ^6.0",
                "postcss-nested": "^6.2.0",
                "postcss-selector-parser": "^6.1.2",
                "resolve": "^1.22.8",
                "sucrase": "^3.35.0"
            },
            "bin": {
                "tailwind": "lib/cli.js",
                "tailwindcss": "lib/cli.js"
            },
            "engines": {
                "node": ">=14.0.0"
            }
        },
        "node_modules/tailwindcss/node_modules/resolve": {
            "version": "1.22.12",
            "resolved": "https://registry.npmjs.org/resolve/-/resolve-1.22.12.tgz",
            "integrity": "sha512-TyeJ1zif53BPfHootBGwPRYT1RUt6oGWsaQr8UyZW/eAm9bKoijtvruSDEmZHm92CwS9nj7/fWttqPCgzep8CA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "es-errors": "^1.3.0",
                "is-core-module": "^2.16.1",
                "path-parse": "^1.0.7",
                "supports-preserve-symlinks-flag": "^1.0.0"
            },
            "bin": {
                "resolve": "bin/resolve"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/text-table": {
            "version": "0.2.0",
            "resolved": "https://registry.npmjs.org/text-table/-/text-table-0.2.0.tgz",
            "integrity": "sha512-N+8UisAXDGk8PFXP4HAzVR9nbfmVJ3zYLAWiTIoqC5v5isinhr+r5uaO8+7r3BMfuNIufIsA7RdpVgacC2cSpw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/thenify": {
            "version": "3.3.1",
            "resolved": "https://registry.npmjs.org/thenify/-/thenify-3.3.1.tgz",
            "integrity": "sha512-RVZSIV5IG10Hk3enotrhvz0T9em6cyHBLkH/YAZuKqd8hRkKhSfCGIcP2KUY0EPxndzANBmNllzWPwak+bheSw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "any-promise": "^1.0.0"
            }
        },
        "node_modules/thenify-all": {
            "version": "1.6.0",
            "resolved": "https://registry.npmjs.org/thenify-all/-/thenify-all-1.6.0.tgz",
            "integrity": "sha512-RNxQH/qI8/t3thXJDwcstUO4zeqo64+Uy/+sNVRBx4Xn2OX+OZ9oP+iJnNFqplFra2ZUVeKCSa2oVWi3T4uVmA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "thenify": ">= 3.1.0 < 4"
            },
            "engines": {
                "node": ">=0.8"
            }
        },
        "node_modules/tinyglobby": {
            "version": "0.2.17",
            "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
            "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "fdir": "^6.5.0",
                "picomatch": "^4.0.4"
            },
            "engines": {
                "node": ">=12.0.0"
            },
            "funding": {
                "url": "https://github.com/sponsors/SuperchupuDev"
            }
        },
        "node_modules/tinyglobby/node_modules/fdir": {
            "version": "6.5.0",
            "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
            "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=12.0.0"
            },
            "peerDependencies": {
                "picomatch": "^3 || ^4"
            },
            "peerDependenciesMeta": {
                "picomatch": {
                    "optional": true
                }
            }
        },
        "node_modules/tinyglobby/node_modules/picomatch": {
            "version": "4.0.4",
            "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.4.tgz",
            "integrity": "sha512-QP88BAKvMam/3NxH6vj2o21R6MjxZUAd6nlwAS/pnGvN9IVLocLHxGYIzFhg6fUQ+5th6P4dv4eW9jX3DSIj7A==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=12"
            },
            "funding": {
                "url": "https://github.com/sponsors/jonschlinkert"
            }
        },
        "node_modules/to-regex-range": {
            "version": "5.0.1",
            "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
            "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-number": "^7.0.0"
            },
            "engines": {
                "node": ">=8.0"
            }
        },
        "node_modules/ts-interface-checker": {
            "version": "0.1.13",
            "resolved": "https://registry.npmjs.org/ts-interface-checker/-/ts-interface-checker-0.1.13.tgz",
            "integrity": "sha512-Y/arvbn+rrz3JCKl9C4kVNfTfSm2/mEp5FSz5EsZSANGPSlQrpRI5M4PKF+mJnE52jOO90PnPSc3Ur3bTQw0gA==",
            "dev": true,
            "license": "Apache-2.0"
        },
        "node_modules/type-check": {
            "version": "0.4.0",
            "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
            "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "prelude-ls": "^1.2.1"
            },
            "engines": {
                "node": ">= 0.8.0"
            }
        },
        "node_modules/type-fest": {
            "version": "0.20.2",
            "resolved": "https://registry.npmjs.org/type-fest/-/type-fest-0.20.2.tgz",
            "integrity": "sha512-Ne+eE4r0/iWnpAxD852z3A+N0Bt5RN//NjJwRd2VFHEmrywxf5vsZlh4R6lixl6B+wz/8d+maTSAkN1FIkI3LQ==",
            "dev": true,
            "license": "(MIT OR CC0-1.0)",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/typed-array-buffer": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz",
            "integrity": "sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "es-errors": "^1.3.0",
                "is-typed-array": "^1.1.14"
            },
            "engines": {
                "node": ">= 0.4"
            }
        },
        "node_modules/typed-array-byte-length": {
            "version": "1.0.3",
            "resolved": "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz",
            "integrity": "sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.8",
                "for-each": "^0.3.3",
                "gopd": "^1.2.0",
                "has-proto": "^1.2.0",
                "is-typed-array": "^1.1.14"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/typed-array-byte-offset": {
            "version": "1.0.4",
            "resolved": "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.4.tgz",
            "integrity": "sha512-bTlAFB/FBYMcuX81gbL4OcpH5PmlFHqlCCpAl8AlEzMz5k53oNDvN8p1PNOWLEmI2x4orp3raOFB51tv9X+MFQ==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "available-typed-arrays": "^1.0.7",
                "call-bind": "^1.0.8",
                "for-each": "^0.3.3",
                "gopd": "^1.2.0",
                "has-proto": "^1.2.0",
                "is-typed-array": "^1.1.15",
                "reflect.getprototypeof": "^1.0.9"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/typed-array-length": {
            "version": "1.0.8",
            "resolved": "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.8.tgz",
            "integrity": "sha512-phPGCwqr2+Qo0fwniCE8e4pKnGu/yFb5nD5Y8bf0EEeiI5GklnACYA9GFy/DrAeRrKHXvHn+1SUsOWgJp6RO+g==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bind": "^1.0.9",
                "for-each": "^0.3.5",
                "gopd": "^1.2.0",
                "is-typed-array": "^1.1.15",
                "possible-typed-array-names": "^1.1.0",
                "reflect.getprototypeof": "^1.0.10"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/unbox-primitive": {
            "version": "1.1.0",
            "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz",
            "integrity": "sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.3",
                "has-bigints": "^1.0.2",
                "has-symbols": "^1.1.0",
                "which-boxed-primitive": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/update-browserslist-db": {
            "version": "1.2.3",
            "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.2.3.tgz",
            "integrity": "sha512-Js0m9cx+qOgDxo0eMiFGEueWztz+d4+M3rGlmKPT+T4IS/jP4ylw3Nwpu6cpTTP8R1MAC1kF4VbdLt3ARf209w==",
            "dev": true,
            "funding": [
                {
                    "type": "opencollective",
                    "url": "https://opencollective.com/browserslist"
                },
                {
                    "type": "tidelift",
                    "url": "https://tidelift.com/funding/github/npm/browserslist"
                },
                {
                    "type": "github",
                    "url": "https://github.com/sponsors/ai"
                }
            ],
            "license": "MIT",
            "dependencies": {
                "escalade": "^3.2.0",
                "picocolors": "^1.1.1"
            },
            "bin": {
                "update-browserslist-db": "cli.js"
            },
            "peerDependencies": {
                "browserslist": ">= 4.21.0"
            }
        },
        "node_modules/uri-js": {
            "version": "4.4.1",
            "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
            "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
            "dev": true,
            "license": "BSD-2-Clause",
            "dependencies": {
                "punycode": "^2.1.0"
            }
        },
        "node_modules/use-sync-external-store": {
            "version": "1.6.0",
            "resolved": "https://registry.npmjs.org/use-sync-external-store/-/use-sync-external-store-1.6.0.tgz",
            "integrity": "sha512-Pp6GSwGP/NrPIrxVFAIkOQeyw8lFenOHijQWkUTrDvrF4ALqylP2C/KCkeS9dpUM3KvYRQhna5vt7IL95+ZQ9w==",
            "license": "MIT",
            "peerDependencies": {
                "react": "^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0"
            }
        },
        "node_modules/util-deprecate": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.2.tgz",
            "integrity": "sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==",
            "dev": true,
            "license": "MIT"
        },
        "node_modules/vite": {
            "version": "5.4.21",
            "resolved": "https://registry.npmjs.org/vite/-/vite-5.4.21.tgz",
            "integrity": "sha512-o5a9xKjbtuhY6Bi5S3+HvbRERmouabWbyUcpXXUA1u+GNUKoROi9byOJ8M0nHbHYHkYICiMlqxkg1KkYmm25Sw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "esbuild": "^0.21.3",
                "postcss": "^8.4.43",
                "rollup": "^4.20.0"
            },
            "bin": {
                "vite": "bin/vite.js"
            },
            "engines": {
                "node": "^18.0.0 || >=20.0.0"
            },
            "funding": {
                "url": "https://github.com/vitejs/vite?sponsor=1"
            },
            "optionalDependencies": {
                "fsevents": "~2.3.3"
            },
            "peerDependencies": {
                "@types/node": "^18.0.0 || >=20.0.0",
                "less": "*",
                "lightningcss": "^1.21.0",
                "sass": "*",
                "sass-embedded": "*",
                "stylus": "*",
                "sugarss": "*",
                "terser": "^5.4.0"
            },
            "peerDependenciesMeta": {
                "@types/node": {
                    "optional": true
                },
                "less": {
                    "optional": true
                },
                "lightningcss": {
                    "optional": true
                },
                "sass": {
                    "optional": true
                },
                "sass-embedded": {
                    "optional": true
                },
                "stylus": {
                    "optional": true
                },
                "sugarss": {
                    "optional": true
                },
                "terser": {
                    "optional": true
                }
            }
        },
        "node_modules/which": {
            "version": "2.0.2",
            "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
            "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
            "dev": true,
            "license": "ISC",
            "dependencies": {
                "isexe": "^2.0.0"
            },
            "bin": {
                "node-which": "bin/node-which"
            },
            "engines": {
                "node": ">= 8"
            }
        },
        "node_modules/which-boxed-primitive": {
            "version": "1.1.1",
            "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz",
            "integrity": "sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-bigint": "^1.1.0",
                "is-boolean-object": "^1.2.1",
                "is-number-object": "^1.1.1",
                "is-string": "^1.1.1",
                "is-symbol": "^1.1.1"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/which-builtin-type": {
            "version": "1.2.1",
            "resolved": "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz",
            "integrity": "sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "call-bound": "^1.0.2",
                "function.prototype.name": "^1.1.6",
                "has-tostringtag": "^1.0.2",
                "is-async-function": "^2.0.0",
                "is-date-object": "^1.1.0",
                "is-finalizationregistry": "^1.1.0",
                "is-generator-function": "^1.0.10",
                "is-regex": "^1.2.1",
                "is-weakref": "^1.0.2",
                "isarray": "^2.0.5",
                "which-boxed-primitive": "^1.1.0",
                "which-collection": "^1.0.2",
                "which-typed-array": "^1.1.16"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/which-collection": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz",
            "integrity": "sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "is-map": "^2.0.3",
                "is-set": "^2.0.3",
                "is-weakmap": "^2.0.2",
                "is-weakset": "^2.0.3"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/which-typed-array": {
            "version": "1.1.22",
            "resolved": "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.22.tgz",
            "integrity": "sha512-fvO4ExWMFsqyhG3AiPAObMuY1lxaqgYcxbc49CNdWDDECOJNgQyvsOWVwbZc+qf3rzRtxojBK+CMEv0Ld5CYpw==",
            "dev": true,
            "license": "MIT",
            "dependencies": {
                "available-typed-arrays": "^1.0.7",
                "call-bind": "^1.0.9",
                "call-bound": "^1.0.4",
                "for-each": "^0.3.5",
                "get-proto": "^1.0.1",
                "gopd": "^1.2.0",
                "has-tostringtag": "^1.0.2"
            },
            "engines": {
                "node": ">= 0.4"
            },
            "funding": {
                "url": "https://github.com/sponsors/ljharb"
            }
        },
        "node_modules/word-wrap": {
            "version": "1.2.5",
            "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
            "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=0.10.0"
            }
        },
        "node_modules/wrappy": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
            "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/yallist": {
            "version": "3.1.1",
            "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
            "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
            "dev": true,
            "license": "ISC"
        },
        "node_modules/yocto-queue": {
            "version": "0.1.0",
            "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
            "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
            "dev": true,
            "license": "MIT",
            "engines": {
                "node": ">=10"
            },
            "funding": {
                "url": "https://github.com/sponsors/sindresorhus"
            }
        },
        "node_modules/zustand": {
            "version": "4.5.7",
            "resolved": "https://registry.npmjs.org/zustand/-/zustand-4.5.7.tgz",
            "integrity": "sha512-CHOUy7mu3lbD6o6LJLfllpjkzhHXSBlX8B9+qPddUsIfeF5S/UZ5q0kmCsnRqT1UHFQZchNFDDzMbQsuesHWlw==",
            "license": "MIT",
            "dependencies": {
                "use-sync-external-store": "^1.2.2"
            },
            "engines": {
                "node": ">=12.7.0"
            },
            "peerDependencies": {
                "@types/react": ">=16.8",
                "immer": ">=9.0.6",
                "react": ">=16.8"
            },
            "peerDependenciesMeta": {
                "@types/react": {
                    "optional": true
                },
                "immer": {
                    "optional": true
                },
                "react": {
                    "optional": true
                }
            }
        }
    }
}

```

---

## 📄 package.json

**Relative Path:** `frontend\package.json`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\package.json`

```json
{
    "name": "ai-code-reviewer-frontend",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "lint": "eslint src --ext .js,.jsx"
    },
    "dependencies": {
        "@monaco-editor/react": "^4.6.0",
        "axios": "^1.6.2",
        "lucide-react": "^0.294.0",
        "monaco-editor": "^0.44.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-hot-toast": "^2.4.1",
        "react-router-dom": "^6.20.1",
        "zustand": "^4.4.7"
    },
    "devDependencies": {
        "@types/react": "^18.2.42",
        "@types/react-dom": "^18.2.17",
        "@vitejs/plugin-react": "^4.2.1",
        "autoprefixer": "^10.4.16",
        "eslint": "^8.55.0",
        "eslint-plugin-react": "^7.33.2",
        "postcss": "^8.4.32",
        "tailwindcss": "^3.3.6",
        "vite": "^5.0.7"
    }
}
```

---

## 📄 postcss.config.js

**Relative Path:** `frontend\postcss.config.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\postcss.config.js`

```javascript
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

---

## 📄 tailwind.config.js

**Relative Path:** `frontend\tailwind.config.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                paper: {
                    50:  '#fdfcfa',
                    100: '#faf9f7',
                    200: '#f5f2ec',
                    300: '#ede8dd',
                    400: '#e0d9c8',
                    500: '#c9c0aa',
                },
                ink: {
                    900: '#1a1815',
                    800: '#2a2621',
                    700: '#3d3831',
                    600: '#5a5450',
                    500: '#7a7370',
                    400: '#9a938e',
                    300: '#b5aea7',
                    200: '#d1cbc2',
                    100: '#e5e0d8',
                },
                clay: {
                    50:  '#fbf1ec',
                    100: '#f4dfd4',
                    200: '#e7bea9',
                    300: '#d99479',
                    400: '#cb7452',
                    500: '#c96442',
                    600: '#b3573a',
                    700: '#95462f',
                    800: '#733626',
                    900: '#4d251a',
                },
                sage:   { DEFAULT: '#4b7a53', muted: '#e6efe5' },
                ochre:  { DEFAULT: '#b8853d', muted: '#f4ead1' },
                brick:  { DEFAULT: '#b8483c', muted: '#f6dfd8' },
                slate2: { DEFAULT: '#4a6fa5', muted: '#e2ebf7' },
            },
            fontFamily: {
                serif: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
                sans:  ['"Instrument Sans"', 'system-ui', '-apple-system', 'sans-serif'],
                mono:  ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
            },
            boxShadow: {
                paper:  '0 1px 2px rgba(60,50,40,0.04), 0 1px 3px rgba(60,50,40,0.06)',
                soft:   '0 2px 12px rgba(60,50,40,0.06), 0 1px 3px rgba(60,50,40,0.04)',
                lift:   '0 8px 24px rgba(60,50,40,0.08), 0 2px 6px rgba(60,50,40,0.05)',
                inset1: 'inset 0 0 0 1px #e5e0d8',
                ring:   '0 0 0 3px rgba(201,100,66,0.15)',
            },
            animation: {
                'fade-in':  'fadeIn 0.5s ease-out',
                'rise':     'rise 0.5s cubic-bezier(0.22,1,0.36,1)',
                'blink':    'blink 1.1s steps(2,end) infinite',
                'shimmer':  'shimmer 1.6s linear infinite',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                rise:   { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                blink:  { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
                shimmer:{ '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
            },
        },
    },
    plugins: [],
};

```

---

## 📄 vite.config.js

**Relative Path:** `frontend\vite.config.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: process.env.VITE_API_URL || 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    store: ['zustand'],
                    monaco: ['monaco-editor'],
                },
            },
        },
    },
    optimizeDeps: {
        include: ['@monaco-editor/react'],
    },
    worker: {
        format: 'es',
    },
});
```

---

## 📄 App.jsx

**Relative Path:** `frontend\src\App.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\App.jsx`

```jsx
import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-loaded Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ReviewPage = lazy(() => import('./pages/ReviewPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const OAuthCallbackPage = lazy(() => import('./pages/OAuthCallbackPage'));
const EditReviewPage = lazy(() => import('./pages/EditReviewPage'));

function PageLoader() {
    return (
        <div className="min-h-screen bg-paper-100 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading…" />
        </div>
    );
}

// Shell Layout for authenticated pages
function AppLayout() {
    return (
        <div className="min-h-screen bg-paper-100 text-ink-900 flex flex-col">
            <Navigation />
            {/*
              On desktop: padding-left matching sidebar width (pl-60).
              On mobile/tablet: padding-top matching topbar height (pt-14).
            */}
            <div className="flex-1 flex flex-col md:pl-60 pt-14 md:pt-0 min-h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function App() {
    const { checkAuth, isLoading } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#1a1815',
                        border: '1px solid #e5e0d8',
                        borderRadius: '8px',
                        boxShadow: '0 2px 12px rgba(60,50,40,0.08), 0 1px 3px rgba(60,50,40,0.05)',
                        fontSize: '13.5px',
                        fontFamily: "'Instrument Sans', sans-serif",
                    },
                    success: {
                        iconTheme: { primary: '#4b7a53', secondary: '#ffffff' },
                    },
                    error: {
                        iconTheme: { primary: '#b8483c', secondary: '#ffffff' },
                    },
                }}
            />

            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* ── Public routes ──────────────────────────────── */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* OAuth callback — public, no Navigation */}
                    <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

                    {/* ── Protected routes (with Navigation Layout) ──── */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            {/* Dashboard */}
                            <Route path="/dashboard" element={<DashboardPage />} />

                            {/* Review */}
                            <Route path="/review" element={<ReviewPage />} />

                            {/* Edit review */}
                            <Route path="/review/:id/edit" element={<EditReviewPage />} />

                            {/* History */}
                            <Route path="/history" element={<HistoryPage />} />
                        </Route>
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </>
    );
}

```

---

## 📄 index.css

**Relative Path:** `frontend\src\index.css`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
        background-color: #faf9f7;
        color: #1a1815;
        font-family: 'Instrument Sans', system-ui, -apple-system, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: 'ss01', 'ss02', 'cv01';
    }
    h1, h2, h3, h4, .font-serif {
        font-family: 'Fraunces', ui-serif, Georgia, serif;
        font-optical-sizing: auto;
        font-variation-settings: 'SOFT' 30, 'WONK' 0;
        letter-spacing: -0.015em;
    }
    kbd {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        padding: 1px 6px;
        background: #f5f2ec;
        border: 1px solid #e5e0d8;
        border-bottom-width: 2px;
        border-radius: 4px;
        color: #3d3831;
    }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: #faf9f7; }
    ::-webkit-scrollbar-thumb { background: #d1cbc2; border-radius: 10px; border: 2px solid #faf9f7; }
    ::-webkit-scrollbar-thumb:hover { background: #b5aea7; }
    ::selection { background: rgba(201,100,66,0.20); color: #1a1815; }
}

@layer components {
    /* ── Surfaces ─────────────────────────────────────────── */
    .surface {
        background: #ffffff;
        border: 1px solid #e5e0d8;
        border-radius: 10px;
    }
    .surface-soft {
        background: #f5f2ec;
        border: 1px solid #ede8dd;
        border-radius: 10px;
    }
    .surface-hover {
        transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease;
    }
    .surface-hover:hover {
        border-color: #d1cbc2;
        box-shadow: 0 2px 12px rgba(60,50,40,0.06), 0 1px 3px rgba(60,50,40,0.04);
    }

    /* ── Buttons ──────────────────────────────────────────── */
    .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        padding: 8px 16px; border-radius: 8px;
        font-family: 'Instrument Sans', sans-serif;
        font-size: 14px; font-weight: 500; line-height: 1;
        transition: all .18s ease;
        cursor: pointer;
        border: 1px solid transparent;
    }
    .btn-primary {
        background: #1a1815; color: #faf9f7;
        border-color: #1a1815;
    }
    .btn-primary:hover { background: #2a2621; border-color: #2a2621; }
    .btn-primary:disabled { opacity: .5; cursor: not-allowed; }

    .btn-clay {
        background: #c96442; color: #ffffff;
        border-color: #c96442;
    }
    .btn-clay:hover { background: #b3573a; border-color: #b3573a; }
    .btn-clay:disabled { opacity: .5; cursor: not-allowed; }

    .btn-ghost {
        background: transparent; color: #3d3831;
        border-color: #e5e0d8;
    }
    .btn-ghost:hover { background: #f5f2ec; border-color: #d1cbc2; }
    .btn-ghost:disabled { opacity: .5; cursor: not-allowed; }

    .btn-plain {
        background: transparent; color: #5a5450; padding: 6px 10px;
    }
    .btn-plain:hover { background: #f5f2ec; color: #1a1815; }

    /* ── Inputs ───────────────────────────────────────────── */
    .input {
        width: 100%;
        padding: 10px 14px;
        background: #ffffff;
        color: #1a1815;
        border: 1px solid #e5e0d8;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color .15s ease, box-shadow .15s ease;
        font-family: 'Instrument Sans', sans-serif;
    }
    .input::placeholder { color: #9a938e; }
    .input:focus {
        border-color: #c96442;
        box-shadow: 0 0 0 3px rgba(201,100,66,0.12);
    }
    .input-error { border-color: #b8483c; }

    /* ── Chip / Badge ─────────────────────────────────────── */
    .chip {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px 8px;
        border-radius: 999px;
        font-size: 11px; font-weight: 500;
        border: 1px solid transparent;
        letter-spacing: 0.01em;
    }

    /* ── Terminal-ish prompt block (subtle nod, not full CLI) ─ */
    .prompt-line {
        font-family: 'JetBrains Mono', monospace;
        color: #5a5450;
        font-size: 13px;
    }
    .prompt-line::before {
        content: '›';
        color: #c96442;
        margin-right: 8px;
        font-weight: 600;
    }

    .cursor::after {
        content: '';
        display: inline-block;
        width: 8px; height: 1em;
        background: #c96442;
        margin-left: 3px;
        vertical-align: text-bottom;
        animation: blink 1.1s steps(2,end) infinite;
    }

    /* ── Shimmer for skeletons ────────────────────────────── */
    .shimmer {
        background: linear-gradient(90deg,
            rgba(0,0,0,0.03) 25%,
            rgba(0,0,0,0.06) 50%,
            rgba(0,0,0,0.03) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.6s infinite;
    }

    /* ── Paper texture (very subtle) ──────────────────────── */
    .paper-grain {
        position: relative;
    }
    .paper-grain::before {
        content: '';
        position: absolute; inset: 0;
        pointer-events: none;
        background-image:
            radial-gradient(circle at 25% 30%, rgba(0,0,0,0.012) 1px, transparent 1px),
            radial-gradient(circle at 75% 70%, rgba(0,0,0,0.010) 1px, transparent 1px);
        background-size: 3px 3px, 5px 5px;
        opacity: .8;
    }
}

@layer utilities {
    .text-clay { color: #c96442; }
    .divider-dot {
        display: inline-block; width: 3px; height: 3px;
        background: #b5aea7; border-radius: 999px;
        vertical-align: middle; margin: 0 8px;
    }
    /* Monaco light adjustment when embedded on cream */
    .monaco-cream .monaco-editor,
    .monaco-cream .monaco-editor-background,
    .monaco-cream .monaco-editor .margin {
        background-color: #ffffff !important;
    }
}

```

---

## 📄 main.jsx

**Relative Path:** `frontend\src\main.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\main.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

```

---

## 📄 auth.api.js

**Relative Path:** `frontend\src\api\auth.api.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\api\auth.api.js`

```javascript
import api from './axios';

export const authApi = {
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    refresh: async () => {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getGoogleAuthUrl = () => `${API_URL}/api/auth/google`;
export const getGithubAuthUrl = () => `${API_URL}/api/auth/github`;
```

---

## 📄 axios.js

**Relative Path:** `frontend\src\api\axios.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\api\axios.js`

```javascript
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor — attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor — handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response?.data?.code === 'TOKEN_EXPIRED' &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await api.post('/auth/refresh');
                const { accessToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status === 429) {
            toast.error(error.response.data.message || 'Rate limit exceeded. Please slow down.');
        }

        if (error.response?.status === 503) {
            toast.error('Service temporarily unavailable. Please try again.');
        }

        return Promise.reject(error);
    }
);

export default api;
```

---

## 📄 history.api.js

**Relative Path:** `frontend\src\api\history.api.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\api\history.api.js`

```javascript
import api from './axios';

export const historyApi = {
    getHistory: async ({ page = 1, limit = 10 } = {}) => {
        const response = await api.get('/history', { params: { page, limit } });
        return response.data;
    },

    deleteReview: async (id) => {
        const response = await api.delete(`/history/${id}`);
        return response.data;
    },
};
```

---

## 📄 review.api.js

**Relative Path:** `frontend\src\api\review.api.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\api\review.api.js`

```javascript
import api from './axios';

export const reviewApi = {
    createReview: async ({ code, language }) => {
        const response = await api.post('/review', { code, language });
        return response.data;
    },

    getReview: async (id) => {
        const response = await api.get(`/review/${id}`);
        return response.data;
    },

    getFullReview: async (id) => {
        const response = await api.get(`/review/${id}/full`);
        return response.data;
    },
};
```

---

## 📄 CodeEditor.jsx

**Relative Path:** `frontend\src\components\CodeEditor.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\CodeEditor.jsx`

```jsx
import { useRef, useEffect, useCallback, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

// Map app language names to Monaco language IDs
const MONACO_LANGUAGE_MAP = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'html',
    css: 'css',
    sql: 'sql',
    bash: 'shell',
    other: 'plaintext',
};

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs',
    },
});

export default function CodeEditor({
    value = '',
    onChange,
    language = 'javascript',
    readOnly = false,
    lineFixes = [],
    onFixApplied,
    height = '100%',
    showFixBadge = true,
}) {
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);
    const [pendingFix, setPendingFix] = useState(null);
    const [appliedCount, setAppliedCount] = useState(0);

    const monacoLang = MONACO_LANGUAGE_MAP[language] || 'plaintext';

    // Apply decorations for lineFixes
    const applyDecorations = useCallback(() => {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco || !lineFixes.length) return;

        const model = editor.getModel();
        if (!model) return;

        const newDecorations = [];

        lineFixes.forEach((fix) => {
            if (!fix.matchSnippet) return;

            const fullText = model.getValue();
            const idx = fullText.indexOf(fix.matchSnippet);
            if (idx === -1) return;

            const startPos = model.getPositionAt(idx);
            const endPos = model.getPositionAt(idx + fix.matchSnippet.length);

            const isError = fix.type === 'error';

            newDecorations.push({
                range: new monaco.Range(
                    startPos.lineNumber,
                    startPos.column,
                    endPos.lineNumber,
                    endPos.column
                ),
                options: {
                    className: isError ? 'fix-highlight-error' : 'fix-highlight-improvement',
                    glyphMarginClassName: isError ? 'fix-glyph-error' : 'fix-glyph-improvement',
                    hoverMessage: {
                        value: `**${isError ? 'Issue' : 'Suggestion'}** — Press \`Tab\` to apply fix\n\n\`\`\`\n${fix.fix}\n\`\`\``,
                    },
                    stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                },
            });
        });

        decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
    }, [lineFixes]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Inject custom CSS for highlights — warm paper palette instead of neon
        const styleId = 'linefix-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .fix-highlight-error {
                    background: rgba(184, 72, 60, 0.10) !important;
                    border-bottom: 2px solid rgba(184, 72, 60, 0.55) !important;
                }
                .fix-highlight-improvement {
                    background: rgba(75, 122, 83, 0.08) !important;
                    border-bottom: 2px solid rgba(75, 122, 83, 0.5) !important;
                }
                .fix-glyph-error::before {
                    content: '●';
                    color: #b8483c;
                    font-size: 12px;
                }
                .fix-glyph-improvement::before {
                    content: '●';
                    color: #4b7a53;
                    font-size: 12px;
                }
            `;
            document.head.appendChild(style);
        }

        // TAB key handler — apply nearest fix to cursor position
        editor.addCommand(monaco.KeyCode.Tab, () => {
            if (readOnly) return;
            const position = editor.getPosition();
            if (!position) return;

            const model = editor.getModel();
            if (!model) return;

            const fullText = model.getValue();

            // Find the closest fix whose matchSnippet is near cursor
            let bestFix = null;
            let bestDistance = Infinity;

            lineFixes.forEach((fix) => {
                if (!fix.matchSnippet) return;
                const idx = fullText.indexOf(fix.matchSnippet);
                if (idx === -1) return;

                const fixPos = model.getPositionAt(idx);
                const distance = Math.abs(fixPos.lineNumber - position.lineNumber);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestFix = { ...fix, idx };
                }
            });

            if (bestFix && bestDistance <= 10) {
                const startPos = model.getPositionAt(bestFix.idx);
                const endPos = model.getPositionAt(bestFix.idx + bestFix.matchSnippet.length);

                editor.executeEdits('linefix', [{
                    range: new monaco.Range(
                        startPos.lineNumber,
                        startPos.column,
                        endPos.lineNumber,
                        endPos.column
                    ),
                    text: bestFix.fix,
                }]);

                const newValue = model.getValue();

                toast.success(`${bestFix.type === 'error' ? 'Fix' : 'Improvement'} applied`, {
                    style: {
                        background: '#ffffff',
                        color: '#1a1815',
                        border: '1px solid #e5e0d8',
                    },
                });

                setPendingFix(bestFix);
                setAppliedCount((c) => c + 1);
                if (onFixApplied) onFixApplied(bestFix, newValue);

                // Re-apply decorations after edit
                setTimeout(applyDecorations, 100);
            } else {
                // Default tab behavior
                editor.trigger('keyboard', 'type', { text: '    ' });
            }
        });

        applyDecorations();
    };

    // Re-apply decorations when lineFixes change
    useEffect(() => {
        applyDecorations();
    }, [applyDecorations]);

    // Clear pending fix notification
    useEffect(() => {
        if (pendingFix) {
            const t = setTimeout(() => setPendingFix(null), 3000);
            return () => clearTimeout(t);
        }
    }, [pendingFix]);

    const errorFixes = lineFixes.filter((f) => f.type === 'error');
    const improvementFixes = lineFixes.filter((f) => f.type === 'improvement');

    return (
        <div className="relative flex flex-col h-full">
            {/* Fix stats bar */}
            {showFixBadge && lineFixes.length > 0 && (
                <div className="flex items-center gap-3 px-4 py-2 bg-paper-100 border-b border-ink-100 text-[11.5px]">
                    {errorFixes.length > 0 && (
                        <span className="flex items-center gap-1.5 text-brick">
                            <AlertCircle size={12} />
                            {errorFixes.length} error{errorFixes.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    {improvementFixes.length > 0 && (
                        <span className="flex items-center gap-1.5 text-sage">
                            <Sparkles size={12} />
                            {improvementFixes.length} improvement{improvementFixes.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    {appliedCount > 0 && (
                        <span className="flex items-center gap-1.5 text-ink-500">
                            <CheckCircle size={12} className="text-sage" />
                            {appliedCount} fix{appliedCount !== 1 ? 'es' : ''} applied
                        </span>
                    )}
                    <span className="ml-auto text-ink-400 font-mono">Press Tab near highlighted code to apply fix</span>
                </div>
            )}

            {/* Fix applied toast */}
            {pendingFix && (
                <div className="absolute top-12 right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px] font-medium animate-rise"
                    style={{
                        background: pendingFix.type === 'error' ? '#f6dfd8' : '#e6efe5',
                        border: `1px solid ${pendingFix.type === 'error' ? 'rgba(184,72,60,0.3)' : 'rgba(75,122,83,0.3)'}`,
                        color: pendingFix.type === 'error' ? '#b8483c' : '#4b7a53',
                    }}>
                    <CheckCircle size={12} />
                    <span>Fix applied</span>
                </div>
            )}

            <div className="flex-1 overflow-hidden monaco-cream">
                <Editor
                    height={height === '100%' ? undefined : height}
                    defaultLanguage={monacoLang}
                    language={monacoLang}
                    value={value}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    loading={
                        <div className="flex items-center justify-center h-full bg-white">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-2" />
                                <p className="text-ink-400 text-[12.5px] font-mono">Loading editor…</p>
                            </div>
                        </div>
                    }
                    options={{
                        readOnly,
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        fontLigatures: true,
                        lineHeight: 1.7,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        glyphMargin: lineFixes.length > 0,
                        lineNumbers: 'on',
                        renderLineHighlight: 'gutter',
                        cursorBlinking: 'smooth',
                        smoothScrolling: true,
                        contextmenu: true,
                        automaticLayout: true,
                        tabSize: 4,
                        insertSpaces: true,
                        folding: true,
                        bracketPairColorization: { enabled: true },
                        'semanticHighlighting.enabled': true,
                    }}
                    theme="vs"
                />
            </div>
        </div>
    );
}

```

---

## 📄 DiffEditor.jsx

**Relative Path:** `frontend\src\components\DiffEditor.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\DiffEditor.jsx`

```jsx
import { useRef } from 'react';
import { DiffEditor as MonacoDiffEditor } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import { GitCompare } from 'lucide-react';

loader.config({
    paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs',
    },
});

const MONACO_LANGUAGE_MAP = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    swift: 'swift',
    kotlin: 'kotlin',
    html: 'html',
    css: 'css',
    sql: 'sql',
    bash: 'shell',
    other: 'plaintext',
};

export default function DiffEditor({ original = '', modified = '', language = 'javascript' }) {
    const editorRef = useRef(null);
    const monacoLang = MONACO_LANGUAGE_MAP[language] || 'plaintext';

    const hasChanges = original !== modified;

    if (!hasChanges) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-paper-200 border border-ink-100">
                    <GitCompare size={22} className="text-ink-400" strokeWidth={1.8} />
                </div>
                <p className="text-ink-700 text-[13.5px] font-medium mb-1">No differences yet</p>
                <p className="text-ink-400 text-[12px] font-mono">Apply fixes with Tab to see the diff here</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header labels */}
            <div className="flex border-b border-ink-100 bg-paper-100">
                <div className="flex-1 px-4 py-2 text-[11.5px] text-ink-500 font-mono border-r border-ink-100">
                    <span className="text-brick mr-2">−</span>Original
                </div>
                <div className="flex-1 px-4 py-2 text-[11.5px] text-ink-500 font-mono">
                    <span className="text-sage mr-2">+</span>Fixed
                </div>
            </div>

            <div className="flex-1 overflow-hidden monaco-cream">
                <MonacoDiffEditor
                    original={original}
                    modified={modified}
                    language={monacoLang}
                    onMount={(editor) => { editorRef.current = editor; }}
                    loading={
                        <div className="flex items-center justify-center h-full bg-white">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500" />
                        </div>
                    }
                    options={{
                        readOnly: true,
                        fontSize: 13,
                        fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                        fontLigatures: true,
                        lineHeight: 1.7,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12, bottom: 12 },
                        renderSideBySide: true,
                        enableSplitViewResizing: true,
                        scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                        automaticLayout: true,
                        diffWordWrap: 'on',
                        renderOverviewRuler: false,
                    }}
                    theme="vs"
                />
            </div>
        </div>
    );
}

```

---

## 📄 HistoryCard.jsx

**Relative Path:** `frontend\src\components\HistoryCard.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\HistoryCard.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Copy, Check, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import { getScoreColor, formatDate, truncateCode, getLanguageIcon } from '../utils/helpers';
import ScoreRing from './ScoreRing';

export default function HistoryCard({ review, onDelete }) {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const scoreColor = getScoreColor(review.score);

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this review? This cannot be undone.')) return;
        setIsDeleting(true);
        try { await onDelete(review.id); } catch { setIsDeleting(false); }
    };

    const handleCopy = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(review.code);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = review.code; document.body.appendChild(ta);
            ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            setCopied(true); setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleEdit = (e) => { e.stopPropagation(); navigate(`/review/${review.id}/edit`); };

    return (
        <div
            className="surface surface-hover overflow-hidden cursor-pointer"
            onClick={() => setIsExpanded(v => !v)}
            data-testid={`history-card-${review.id}`}
        >
            <div className="p-5 flex items-start gap-4">
                <ScoreRing score={review.score} size={54} strokeWidth={4} />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-700">
                            {getLanguageIcon(review.language)}
                        </span>
                        <span className="text-[13px] text-ink-800 capitalize">{review.language}</span>
                        <span className="chip" style={{ background: scoreColor.muted, color: scoreColor.hex }}>
                            {scoreColor.label}
                        </span>
                    </div>
                    <p className="text-[12.5px] text-ink-500 font-mono mb-2 truncate">
                        {truncateCode(review.code, 90)}
                    </p>
                    <div className="flex items-center text-[11.5px] text-ink-400">
                        <span>{formatDate(review.createdAt)}</span>
                        <span className="divider-dot" />
                        <span>{review.issues?.length || 0} issues</span>
                        <span className="divider-dot" />
                        <span>{review.suggestions?.length || 0} suggestions</span>
                    </div>
                </div>

                <div className="flex items-center gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <button onClick={handleCopy} title="Copy code" className="btn-plain">
                        {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
                    </button>
                    <button onClick={handleEdit} title="Edit & re-review" className="btn-plain">
                        <Pencil size={14} />
                    </button>
                    <button onClick={handleDelete} disabled={isDeleting}
                        title="Delete" className="btn-plain hover:!text-brick">
                        <Trash2 size={14} className={isDeleting ? 'text-brick animate-pulse' : ''} />
                    </button>
                    <button onClick={() => setIsExpanded(v => !v)} className="btn-plain">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="border-t border-ink-100 animate-fade-in">
                    <div className="p-4 border-b border-ink-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400">Code</span>
                            <button onClick={handleCopy} className="btn btn-ghost !py-1 !px-2 !text-[11px]">
                                {copied ? <><Check size={11} className="text-sage" /> Copied</> : <><Copy size={11} /> Copy</>}
                            </button>
                        </div>
                        <pre className="text-[12px] font-mono text-ink-800 overflow-x-auto p-3 rounded-md max-h-40 bg-paper-100 border border-ink-100">
                            {review.code}
                        </pre>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-ink-100">
                        <div className="p-4">
                            <h4 className="text-[11px] uppercase tracking-[0.14em] text-brick font-medium mb-2">
                                Issues ({review.issues?.length || 0})
                            </h4>
                            {review.issues?.length > 0 ? (
                                <ul className="space-y-1.5">
                                    {review.issues.map((issue, i) => (
                                        <li key={i} className="flex gap-2 text-[12.5px] text-ink-700">
                                            <span className="font-mono text-[11px] text-brick shrink-0">{i + 1}.</span>
                                            <span>{issue}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-[12px] text-ink-400">No issues found</p>}
                        </div>
                        <div className="p-4 border-t md:border-t-0 border-ink-100">
                            <h4 className="text-[11px] uppercase tracking-[0.14em] text-clay-600 font-medium mb-2">
                                Suggestions ({review.suggestions?.length || 0})
                            </h4>
                            {review.suggestions?.length > 0 ? (
                                <ul className="space-y-1.5">
                                    {review.suggestions.map((s, i) => (
                                        <li key={i} className="flex gap-2 text-[12.5px] text-ink-700">
                                            <span className="font-mono text-[11px] text-clay-600 shrink-0">{i + 1}.</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-[12px] text-ink-400">No suggestions</p>}
                        </div>
                    </div>

                    <div className="px-4 py-3 border-t border-ink-100 flex justify-end">
                        <button onClick={handleEdit} className="btn btn-ghost !py-1.5 !text-[12px]">
                            <Pencil size={11} /> Edit &amp; re-review
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

```

---

## 📄 Navibar.jsx

**Relative Path:** `frontend\src\components\Navibar.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\Navibar.jsx`

```jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Code2, LayoutDashboard, History, LogOut, Menu, X, Zap } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/review', label: 'Review Code', icon: Code2 },
        { to: '/history', label: 'History', icon: History },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className="sticky top-0 z-50 border-b"
            style={{
                background: 'rgba(5, 5, 8, 0.85)',
                backdropFilter: 'blur(20px)',
                borderColor: 'rgba(255,255,255,0.06)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                <Zap size={16} className="text-white" />
                            </div>
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ boxShadow: '0 0 20px rgba(0,212,255,0.5)' }} />
                        </div>
                        <span className="font-bold text-lg text-gradient hidden sm:block">
                            CodeReviewer AI
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                    ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* User + Logout */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                            style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                {user?.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-300">{user?.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                        >
                            <LogOut size={16} />
                            <span className="hidden lg:block">Logout</span>
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t animate-slide-up"
                    style={{
                        background: 'rgba(5, 5, 8, 0.98)',
                        borderColor: 'rgba(255,255,255,0.06)',
                    }}>
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to)
                                    ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={16} />
                                {label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                    style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)' }}>
                                    {user?.name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setMobileOpen(false); handleLogout(); }}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all duration-200"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
```

---

## 📄 Navigation.jsx

**Relative Path:** `frontend\src\components\Navigation.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\Navigation.jsx`

```jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutGrid, PenLine, Clock, LogOut, Menu, X } from 'lucide-react';

// Small serif-mark logo — no gradient, no zap icon
function Mark({ size = 28 }) {
    return (
        <div
            className="flex items-center justify-center font-serif font-semibold text-ink-900"
            style={{
                width: size, height: size,
                background: '#f5f2ec',
                border: '1px solid #e5e0d8',
                borderRadius: 6,
                fontSize: size * 0.5,
                letterSpacing: '-0.03em',
            }}
            data-testid="brand-mark"
        >
            E
        </div>
    );
}

export default function Navigation() {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navLinks = [
        { to: '/dashboard', label: 'Overview',    icon: LayoutGrid,  testid: 'nav-dashboard' },
        { to: '/review',    label: 'New review',  icon: PenLine,     testid: 'nav-review'    },
        { to: '/history',   label: 'History',     icon: Clock,       testid: 'nav-history'   },
    ];

    const handleLogout = async () => { await logout(); navigate('/login'); };

    const isActive = (path) =>
        path === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(path);

    const links = (onNav) => navLinks.map(({ to, label, icon: Icon, testid }) => {
        const active = isActive(to);
        return (
            <Link
                key={to}
                to={to}
                onClick={onNav}
                data-testid={testid}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] transition-colors ${
                    active
                        ? 'bg-paper-200 text-ink-900 font-medium'
                        : 'text-ink-600 hover:text-ink-900 hover:bg-paper-200/70'
                }`}
            >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.7} />
                <span>{label}</span>
                {active && <span className="ml-auto w-1 h-1 rounded-full bg-clay-500" />}
            </Link>
        );
    });

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                data-testid="sidebar"
                className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 border-r border-ink-100 bg-paper-50 z-40"
            >
                <div className="h-14 flex items-center px-5 border-b border-ink-100">
                    <Link to="/dashboard" className="flex items-center gap-2.5 group" data-testid="brand-link">
                        <Mark size={26} />
                        <span className="font-serif text-[17px] text-ink-900 tracking-tight">Emendator</span>
                    </Link>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-0.5">{links()}</nav>

                <div className="p-3 border-t border-ink-100">
                    <div className="flex items-center gap-2.5 px-2 py-2 rounded-md">
                        <div className="w-7 h-7 rounded-full bg-clay-100 text-clay-700 text-[11px] font-medium flex items-center justify-center shrink-0 font-mono">
                            {user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium text-ink-900 truncate">{user?.name || 'User'}</p>
                            <p className="text-[10.5px] text-ink-500 truncate">{user?.email || '—'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        data-testid="logout-btn"
                        className="mt-1 w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-ink-600 hover:text-brick hover:bg-brick-muted/50 transition-colors"
                    >
                        <LogOut size={14} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Mobile topbar */}
            <header className="md:hidden h-14 fixed top-0 inset-x-0 border-b border-ink-100 bg-paper-50/90 backdrop-blur flex items-center justify-between px-4 z-40">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Mark size={24} />
                    <span className="font-serif text-[15px] text-ink-900">Emendator</span>
                </Link>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="btn-plain"
                    data-testid="mobile-menu-open"
                >
                    <Menu size={18} />
                </button>
            </header>

            {/* Mobile drawer */}
            {drawerOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-ink-900/20 backdrop-blur-[2px] z-50"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="md:hidden fixed top-0 bottom-0 right-0 w-72 max-w-[82vw] bg-paper-50 border-l border-ink-100 z-50 flex flex-col p-4 animate-rise">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-serif text-[16px] text-ink-900">Emendator</span>
                            <button onClick={() => setDrawerOpen(false)} className="btn-plain">
                                <X size={18} />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1">{links(() => setDrawerOpen(false))}</nav>
                        <div className="pt-3 border-t border-ink-100">
                            <div className="flex items-center gap-2.5 px-2 py-2">
                                <div className="w-8 h-8 rounded-full bg-clay-100 text-clay-700 text-xs font-medium flex items-center justify-center font-mono">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-medium text-ink-900 truncate">{user?.name}</p>
                                    <p className="text-[11px] text-ink-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setDrawerOpen(false); handleLogout(); }}
                                className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-ink-600 hover:text-brick hover:bg-brick-muted/50"
                            >
                                <LogOut size={14} /> Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

```

---

## 📄 ProtectedRoute.jsx

**Relative Path:** `frontend\src\components\ProtectedRoute.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\ProtectedRoute.jsx`

```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children ?? <Outlet />;
}
```

---

## 📄 ReviewResult.jsx

**Relative Path:** `frontend\src\components\ReviewResult.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\ReviewResult.jsx`

```jsx
import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import ScoreRing from './ScoreRing';
import { formatDate, getLanguageIcon } from '../utils/helpers';

export default function ReviewResult({ review }) {
    if (!review) return null;

    return (
        <div className="space-y-5 animate-rise">
            <div className="surface p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                    <h2 className="font-serif text-[22px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Review complete
                    </h2>
                    <div className="mt-1 flex items-center text-[12.5px] text-ink-500">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-700 mr-2">
                            {getLanguageIcon(review.language)}
                        </span>
                        <span className="capitalize">{review.language}</span>
                        <span className="divider-dot" />
                        <span>{formatDate(review.createdAt)}</span>
                    </div>
                </div>
                <ScoreRing score={review.score} size={96} strokeWidth={5} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="surface p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle size={14} className="text-brick" strokeWidth={1.8} />
                        <h3 className="text-[13px] font-medium text-ink-800">Issues</h3>
                        <span className="ml-auto chip bg-brick-muted text-brick">
                            {review.issues?.length || 0}
                        </span>
                    </div>
                    {review.issues?.length === 0 ? (
                        <div className="flex items-center gap-2 text-sage text-[13px]">
                            <CheckCircle2 size={14} /> None found
                        </div>
                    ) : (
                        <ul className="space-y-2.5">
                            {review.issues.map((issue, i) => (
                                <li key={i} className="flex gap-3 text-[13.5px] text-ink-700 leading-relaxed">
                                    <span className="mt-1 font-mono text-[11px] text-brick shrink-0 w-4">{i + 1}.</span>
                                    <span>{issue}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="surface p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb size={14} className="text-clay-500" strokeWidth={1.8} />
                        <h3 className="text-[13px] font-medium text-ink-800">Suggestions</h3>
                        <span className="ml-auto chip bg-clay-50 text-clay-700 border border-clay-100">
                            {review.suggestions?.length || 0}
                        </span>
                    </div>
                    {review.suggestions?.length === 0 ? (
                        <div className="flex items-center gap-2 text-sage text-[13px]">
                            <CheckCircle2 size={14} /> Nothing to add
                        </div>
                    ) : (
                        <ul className="space-y-2.5">
                            {review.suggestions.map((s, i) => (
                                <li key={i} className="flex gap-3 text-[13.5px] text-ink-700 leading-relaxed">
                                    <span className="mt-1 font-mono text-[11px] text-clay-600 shrink-0 w-4">{i + 1}.</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="surface overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100 bg-paper-100">
                    <span className="font-mono text-[11px] text-ink-500">
                        reviewed.{review.language}
                    </span>
                </div>
                <pre className="p-4 overflow-x-auto text-[12.5px] font-mono text-ink-800 leading-[1.7] max-h-72">
                    <code>{review.code}</code>
                </pre>
            </div>
        </div>
    );
}

```

---

## 📄 ScoreRing.jsx

**Relative Path:** `frontend\src\components\ScoreRing.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\ScoreRing.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../utils/helpers';
export default function ScoreRing({ score = 0, size = 120, strokeWidth = 6 }) {
    const [displayScore, setDisplayScore] = useState(0);
    const radius = (size - strokeWidth * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;
    const { hex, label } = getScoreColor(score);
    useEffect(() => {
        const duration = 900;
        const start = Date.now();
        const tick = () => {
            const p = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplayScore(Math.round(eased * score));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [score]);
    return (
        <div className="flex flex-col items-center gap-1.5" data-testid="score-ring">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke="#ede8dd" strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2} cy={size / 2} r={radius}
                        fill="none" stroke={hex} strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-[26px] font-medium text-ink-900" style={{ letterSpacing: '-0.03em' }}>
                        {displayScore}
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono -mt-0.5">/ 100</span>
                </div>
            </div>
            <span className="text-[11px] uppercase tracking-[0.14em] font-medium" style={{ color: hex }}>
                {label}
            </span>
        </div>
    );
}

```

---

## 📄 StatsCard.jsx

**Relative Path:** `frontend\src\components\StatsCard.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\StatsCard.jsx`

```jsx
import React from 'react';

export default function StatsCard({ icon: Icon, label, value, color = '#c96442', trend }) {
    return (
        <div className="surface surface-hover p-5">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-[11px] text-ink-500 font-medium uppercase tracking-[0.12em]">{label}</span>
                    <span className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        {value}
                    </span>
                    {trend && (
                        <span className="text-[11.5px]" style={{ color }}>
                            {trend}
                        </span>
                    )}
                </div>
                <div
                    className="p-2.5 rounded-lg"
                    style={{
                        background: `${color}14`,
                        border: `1px solid ${color}2a`,
                    }}
                >
                    <Icon size={17} style={{ color }} strokeWidth={1.8} />
                </div>
            </div>
            <div
                className="mt-4 h-[3px] rounded-full"
                style={{
                    background: `linear-gradient(90deg, ${color}45, transparent)`,
                }}
            />
        </div>
    );
}

```

---

## 📄 LoadingSpinner.jsx

**Relative Path:** `frontend\src\components\ui\LoadingSpinner.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\ui\LoadingSpinner.jsx`

```jsx
import React from 'react';
export default function LoadingSpinner({ size = 'md', text = '' }) {
    const px = { sm: 16, md: 22, lg: 32 }[size] || 22;
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <svg
                width={px} height={px} viewBox="0 0 24 24"
                className="animate-spin"
                style={{ animationDuration: '0.9s' }}
            >
                <circle cx="12" cy="12" r="9" fill="none"
                    stroke="#e5e0d8" strokeWidth="2.4" />
                <path d="M12 3 A9 9 0 0 1 21 12" fill="none"
                    stroke="#c96442" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            {text && <p className="text-[13px] text-ink-500 font-mono">{text}</p>}
        </div>
    );
}

```

---

## 📄 SkeletonCard.jsx

**Relative Path:** `frontend\src\components\ui\SkeletonCard.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\components\ui\SkeletonCard.jsx`

```jsx
import React from 'react';
export default function SkeletonCard({ lines = 3 }) {
    return (
        <div className="surface p-5 space-y-3">
            <div className="flex items-center justify-between">
                <div className="h-3 rounded shimmer" style={{ width: '32%' }} />
                <div className="h-5 w-14 rounded-full shimmer" />
            </div>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-2.5 rounded shimmer"
                    style={{ width: `${65 + (i * 7) % 30}%` }}
                />
            ))}
        </div>
    );
}

```

---

## 📄 useForm.js

**Relative Path:** `frontend\src\hooks\useForm.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\hooks\useForm.js`

```javascript
import { useState, useCallback } from 'react';

export function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (validate) {
            const validationErrors = validate(values);
            setErrors((prev) => ({ ...prev, [name]: validationErrors[name] || '' }));
        }
    }, [validate, values]);

    const handleSubmit = useCallback((onSubmit) => async (e) => {
        e.preventDefault();
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {});
            setTouched(allTouched);
            if (Object.values(validationErrors).some(Boolean)) return;
        }
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    }, [validate, values]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset, setValues };
}
```

---

## 📄 DashboardPage.jsx

**Relative Path:** `frontend\src\pages\DashboardPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\DashboardPage.jsx`

```jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Clock, TrendingUp, FileText, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useReviewStore } from '../store/reviewStore';
import StatsCard from '../components/StatsCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { getScoreColor, formatDate, getLanguageIcon } from '../utils/helpers';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const {
        history = [], pagination = {}, isLoadingHistory = false, fetchHistory,
    } = useReviewStore();

    useEffect(() => { fetchHistory({ page: 1, limit: 10 }); }, [fetchHistory]);

    const avgScore = history.length > 0
        ? Math.round(history.reduce((sum, r) => sum + r.score, 0) / history.length)
        : 0;

    const recentReviews = history.slice(0, 5);

    return (
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">
            <div className="mb-10 animate-fade-in">
                <p className="prompt-line mb-1.5" data-testid="dashboard-greeting">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="font-serif text-[34px] leading-[1.1] text-ink-900" style={{ letterSpacing: '-0.025em' }}>
                    Good to see you, {user?.name?.split(' ')[0] || 'friend'}.
                </h1>
                <p className="text-ink-500 text-[14px] mt-2 max-w-lg">
                    Pick up where you left off, or start a new review.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                <StatsCard icon={FileText}    label="Reviews"    value={pagination?.total ?? '—'} trend="All time" />
                <StatsCard icon={TrendingUp}  label="Avg score"  value={avgScore > 0 ? avgScore : '—'}
                    color={avgScore > 0 ? getScoreColor(avgScore).hex : '#c96442'}
                    trend={history.length > 0 ? getScoreColor(avgScore).label : 'Not enough data'}
                />
                <StatsCard icon={PenLine}     label="Last language"
                    value={history[0]?.language ? <span className="capitalize font-mono text-[22px]">{history[0].language}</span> : '—'}
                    trend={history[0]?.language ? 'From last review' : 'No reviews yet'}
                />
                <StatsCard icon={Clock}       label="Analyses"   value={pagination?.total ?? '—'} trend="Local model" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                <Link to="/review" className="surface surface-hover p-5 group flex items-start justify-between" data-testid="quick-new-review">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <PenLine size={14} className="text-clay-500" strokeWidth={1.8} />
                            <span className="font-medium text-[14px] text-ink-900">New review</span>
                        </div>
                        <p className="text-[12.5px] text-ink-500">Paste code and get grounded feedback.</p>
                    </div>
                    <ArrowUpRight size={16} className="text-ink-400 group-hover:text-clay-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </Link>
                <Link to="/history" className="surface surface-hover p-5 group flex items-start justify-between" data-testid="quick-history">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Clock size={14} className="text-ink-600" strokeWidth={1.8} />
                            <span className="font-medium text-[14px] text-ink-900">Browse history</span>
                        </div>
                        <p className="text-[12.5px] text-ink-500">Everything you've reviewed, in one place.</p>
                    </div>
                    <ArrowUpRight size={16} className="text-ink-400 group-hover:text-ink-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </Link>
            </div>

            <div>
                <div className="flex items-baseline justify-between mb-4">
                    <h2 className="font-serif text-[20px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Recent reviews
                    </h2>
                    {history.length > 0 && (
                        <Link to="/history" className="text-[12.5px] text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200">
                            View all
                        </Link>
                    )}
                </div>

                {isLoadingHistory ? (
                    <div className="space-y-2.5">{[1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}</div>
                ) : recentReviews.length === 0 ? (
                    <div className="surface p-12 text-center">
                        <p className="prompt-line inline-block mb-3">no reviews yet<span className="cursor" /></p>
                        <h3 className="font-serif text-[19px] text-ink-900 mb-1">A blank page.</h3>
                        <p className="text-ink-500 text-[13px] mb-5">Paste your first snippet to see it here.</p>
                        <Link to="/review" className="btn btn-clay">Start a review</Link>
                    </div>
                ) : (
                    <div className="surface divide-y divide-ink-100">
                        {recentReviews.map((review) => {
                            const { hex, label } = getScoreColor(review.score);
                            return (
                                <div key={review.id} className="p-4 flex items-center gap-4 hover:bg-paper-100/70 transition-colors">
                                    <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0 font-serif text-[16px]"
                                        style={{ background: `${hex}14`, border: `1px solid ${hex}30`, color: hex }}>
                                        {review.score}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5 text-[12.5px]">
                                            <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-paper-200 text-ink-700">
                                                {getLanguageIcon(review.language)}
                                            </span>
                                            <span className="text-ink-700 capitalize">{review.language}</span>
                                            <span className="chip" style={{ background: `${hex}14`, color: hex }}>
                                                {label}
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-ink-500 font-mono truncate">
                                            {review.code.trim().slice(0, 80)}…
                                        </p>
                                    </div>
                                    <span className="text-[11.5px] text-ink-400 shrink-0 hidden sm:block">
                                        {formatDate(review.createdAt)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

```

---

## 📄 EditReviewPage.jsx

**Relative Path:** `frontend\src\pages\EditReviewPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\EditReviewPage.jsx`

```jsx
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewApi } from '../api/review.api';
import { useReviewStore } from '../store/reviewStore';
import { getLanguageIcon, formatDate } from '../utils/helpers';

const CodeEditor = lazy(() => import('../components/CodeEditor'));

const EditorSkeleton = () => (
    <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500" />
    </div>
);

export default function EditReviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { submitReview, isAnalyzing } = useReviewStore();

    const [originalReview, setOriginalReview] = useState(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load review on mount
    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await reviewApi.getFullReview(id);
                const review = data.data.review;
                setOriginalReview(review);
                setCode(review.code);
                setLanguage(review.language);
            } catch (err) {
                const msg = err.response?.data?.message || 'Failed to load review';
                setError(msg);
                toast.error(msg);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [id]);

    const handleCodeChange = useCallback((val) => {
        setCode(val || '');
    }, []);

    const handleReview = async () => {
        if (!code.trim() || code.trim().length < 10) {
            toast.error('Code must be at least 10 characters.');
            return;
        }
        try {
            await submitReview({ code, language });
            toast.success('New review created from your edits!');
            navigate('/history');
        } catch {
            // Handled in store
        }
    };

    // ── Loading ────────────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-paper-100">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-clay-500 mb-4" />
                <p className="text-ink-500 text-[13px] font-mono">Loading review…</p>
            </div>
        );
    }

    // ── Error ──────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-paper-100 px-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-brick-muted border border-brick/20">
                    <AlertCircle size={22} className="text-brick" />
                </div>
                <p className="text-ink-900 font-medium text-[15px] mb-1">Failed to load review</p>
                <p className="text-ink-500 text-[13px] mb-6">{error}</p>
                <button onClick={() => navigate('/history')} className="btn btn-ghost">
                    <ArrowLeft size={14} /> Back to history
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-paper-100 overflow-hidden">

            {/* ── Toolbar ──────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 h-14 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                <button
                    onClick={() => navigate('/history')}
                    className="flex items-center gap-2 text-ink-500 hover:text-ink-900 transition-colors text-[13px]"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="w-px h-5 bg-ink-100 mx-1" />

                <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-ink-400">Editing review from</span>
                    <span className="text-[11.5px] text-ink-700 font-mono">
                        {originalReview ? formatDate(originalReview.createdAt) : '—'}
                    </span>
                </div>

                <div className="flex items-center gap-2 ml-2 px-2.5 py-1 rounded-md text-[11.5px] font-mono surface">
                    <span className="text-ink-400">{getLanguageIcon(language)}</span>
                    <span className="text-ink-700 capitalize">{language}</span>
                </div>

                {/* Original score badge */}
                {originalReview && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] bg-clay-50 border border-clay-100">
                        <span className="text-ink-500">Original score:</span>
                        <span className="text-clay-700 font-semibold">{originalReview.score}</span>
                    </div>
                )}

                <div className="flex-1" />

                {/* Reset to original */}
                <button
                    onClick={() => { setCode(originalReview.code); toast.success('Reset to original code'); }}
                    className="btn btn-ghost !px-3 !py-1.5 !text-[11.5px]"
                >
                    <RefreshCw size={12} />
                    Reset
                </button>

                {/* Run review */}
                <button
                    onClick={handleReview}
                    disabled={isAnalyzing}
                    className="btn btn-clay !px-4 !py-2 !text-[13px]"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Analyzing…
                        </>
                    ) : (
                        <>
                            <Play size={14} fill="currentColor" />
                            Re-review
                        </>
                    )}
                </button>
            </div>

            {/* ── Editor ───────────────────────────────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Code editor */}
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="px-4 py-2 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                        <span className="text-[11.5px] text-ink-500 font-mono">Edit your code — then press Re-review to get a new analysis</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Suspense fallback={<EditorSkeleton />}>
                            <CodeEditor
                                value={code}
                                onChange={handleCodeChange}
                                language={language}
                                readOnly={isAnalyzing}
                                lineFixes={originalReview?.lineFixes || []}
                                showFixBadge={true}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* Right: original issues & suggestions */}
                {originalReview && (
                    <div className="w-80 flex-shrink-0 border-l border-ink-100 overflow-y-auto bg-white">
                        <div className="px-4 py-3 border-b border-ink-100 bg-paper-50">
                            <p className="text-[11px] text-ink-500 font-semibold uppercase tracking-[0.14em]">Original feedback</p>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Issues */}
                            {originalReview.issues?.length > 0 && (
                                <div>
                                    <p className="text-[11px] text-brick font-semibold uppercase tracking-[0.14em] mb-2">Issues</p>
                                    <div className="space-y-1.5">
                                        {originalReview.issues.map((issue, i) => (
                                            <div key={i} className="text-[11.5px] text-ink-700 flex gap-2 p-2 rounded-md bg-brick-muted border border-brick/15">
                                                <span className="text-brick flex-shrink-0">✕</span>
                                                {issue}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {originalReview.suggestions?.length > 0 && (
                                <div>
                                    <p className="text-[11px] text-sage font-semibold uppercase tracking-[0.14em] mb-2">Suggestions</p>
                                    <div className="space-y-1.5">
                                        {originalReview.suggestions.map((s, i) => (
                                            <div key={i} className="text-[11.5px] text-ink-700 flex gap-2 p-2 rounded-md bg-sage-muted border border-sage/15">
                                                <span className="text-sage flex-shrink-0">→</span>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

```

---

## 📄 HistoryPage.jsx

**Relative Path:** `frontend\src\pages\HistoryPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\HistoryPage.jsx`

```jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReviewStore } from '../store/reviewStore';
import HistoryCard from '../components/HistoryCard';
import SkeletonCard from '../components/ui/SkeletonCard';

export default function HistoryPage() {
    const navigate = useNavigate();
    const { history, pagination, isLoadingHistory, fetchHistory, deleteReview } = useReviewStore();

    useEffect(() => { fetchHistory({ page: 1, limit: 10 }); }, [fetchHistory]);

    const handlePageChange = (newPage) => {
        fetchHistory({ page: newPage, limit: 10 });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-paper-100 py-10 px-6 animate-fade-in">
            <div className="max-w-3xl mx-auto">

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="prompt-line mb-1">everything reviewed</p>
                        <h1 className="font-serif text-[30px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                            History
                        </h1>
                        {pagination && (
                            <p className="text-[12.5px] text-ink-500 mt-0.5">
                                {pagination.total} review{pagination.total !== 1 ? 's' : ''} total
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate('/review')}
                        data-testid="history-new-review-btn"
                        className="btn btn-primary"
                    >
                        <Plus size={13} /> New review
                    </button>
                </div>

                {isLoadingHistory && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {!isLoadingHistory && history.length === 0 && (
                    <div className="surface p-16 text-center">
                        <p className="prompt-line inline-block mb-3">no history yet<span className="cursor" /></p>
                        <h3 className="font-serif text-[20px] text-ink-900 mb-1">Nothing here — yet.</h3>
                        <p className="text-ink-500 text-[13px] mb-6">Your reviews will appear here as you create them.</p>
                        <button onClick={() => navigate('/review')} className="btn btn-clay">
                            Start reviewing
                        </button>
                    </div>
                )}

                {!isLoadingHistory && history.length > 0 && (
                    <>
                        <div className="space-y-3">
                            {history.map((review) => (
                                <HistoryCard key={review.id} review={review} onDelete={deleteReview} />
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                    className="btn btn-ghost !py-1.5 !text-[12.5px] disabled:opacity-30"
                                >
                                    <ChevronLeft size={13} /> Prev
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        const isCurrent = p === pagination.page;
                                        if (p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1) {
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => handlePageChange(p)}
                                                    className="w-8 h-8 rounded-md text-[12.5px] transition-colors"
                                                    style={{
                                                        background: isCurrent ? '#1a1815' : 'transparent',
                                                        color: isCurrent ? '#faf9f7' : '#5a5450',
                                                    }}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        }
                                        if (Math.abs(p - pagination.page) === 2) {
                                            return <span key={p} className="text-ink-400 text-[12px]">…</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={!pagination.hasMore}
                                    className="btn btn-ghost !py-1.5 !text-[12.5px] disabled:opacity-30"
                                >
                                    Next <ChevronRight size={13} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

```

---

## 📄 LoginPage.jsx

**Relative Path:** `frontend\src\pages\LoginPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\LoginPage.jsx`

```jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useForm } from '../hooks/useForm';
import { getGoogleAuthUrl, getGithubAuthUrl } from '../api/auth.api';

const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Invalid email';
    if (!values.password) errors.password = 'Required';
    return errors;
};

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [oauthLoading, setOAuthLoading] = useState(null);

    const oauthError = searchParams.get('error');
    const oauthErrorMessages = {
        oauth_denied: 'Sign-in was cancelled.',
        oauth_state_invalid: 'Security error. Please try again.',
        oauth_no_email: 'Could not get email from provider.',
        oauth_failed: 'OAuth sign-in failed. Please try again.',
    };

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
        { email: '', password: '' }, validate
    );

    const onSubmit = handleSubmit(async (formValues) => {
        try { await login(formValues); navigate('/dashboard'); } catch (e) {}
    });

    return (
        <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4 paper-grain">
            <div className="w-full max-w-[380px] animate-rise">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-paper-50 border border-ink-100">
                        <span className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.04em' }}>E</span>
                    </div>
                    <h1 className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Welcome back
                    </h1>
                    <p className="text-ink-500 text-[13px] mt-1">Sign in to Emendator</p>
                </div>

                {oauthError && oauthErrorMessages[oauthError] && (
                    <div className="mb-4 p-3 rounded-md text-[13px] text-brick flex items-center gap-2 bg-brick-muted border border-brick/20">
                        <AlertCircle size={13} /> {oauthErrorMessages[oauthError]}
                    </div>
                )}

                <div className="surface p-6 shadow-paper">
                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                        <button
                            onClick={() => { setOAuthLoading('google'); window.location.href = getGoogleAuthUrl(); }}
                            disabled={!!oauthLoading}
                            data-testid="google-signin-btn"
                            className="btn btn-ghost !py-2.5 !text-[13px]"
                        >
                            {oauthLoading === 'google' ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            )}
                            Google
                        </button>
                        <button
                            onClick={() => { setOAuthLoading('github'); window.location.href = getGithubAuthUrl(); }}
                            disabled={!!oauthLoading}
                            data-testid="github-signin-btn"
                            className="btn btn-ghost !py-2.5 !text-[13px]"
                        >
                            {oauthLoading === 'github' ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#1a1815">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                            )}
                            GitHub
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center mb-5">
                        <div className="absolute inset-x-0 h-px bg-ink-100" />
                        <span className="relative bg-white px-3 text-[11px] uppercase tracking-[0.14em] text-ink-400">
                            or with email
                        </span>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Email</label>
                            <input
                                name="email" type="email"
                                value={values.email} onChange={handleChange} onBlur={handleBlur}
                                placeholder="you@example.com" autoComplete="email"
                                data-testid="login-email"
                                className={`input ${touched.email && errors.email ? 'input-error' : ''}`}
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'}
                                    value={values.password} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="••••••••" autoComplete="current-password"
                                    data-testid="login-password"
                                    className={`input pr-10 ${touched.password && errors.password ? 'input-error' : ''}`}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit" disabled={isSubmitting}
                            data-testid="login-submit"
                            className="btn btn-primary w-full !py-2.5 mt-2"
                        >
                            {isSubmitting ? (<><Loader2 size={13} className="animate-spin" /> Signing in…</>) : 'Sign in'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-[13px] text-ink-500">
                    New to Emendator?{' '}
                    <Link to="/signup" className="text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200 font-medium">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
}

```

---

## 📄 OAuthCallbackPage.jsx

**Relative Path:** `frontend\src\pages\OAuthCallbackPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\OAuthCallbackPage.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertCircle } from 'lucide-react';

const ERROR_MESSAGES = {
    oauth_denied: 'You cancelled the sign-in. Please try again.',
    oauth_state_invalid: 'Security validation failed. Please try signing in again.',
    oauth_no_code: 'OAuth sign-in was incomplete. Please try again.',
    oauth_no_email: 'Could not retrieve your email from the OAuth provider.',
    oauth_failed: 'OAuth sign-in failed. Please try again or use email/password.',
    no_token: 'No authentication token received. Please try again.',
};

export default function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            const msg = ERROR_MESSAGES[error] || 'Sign-in failed. Please try again.';
            setErrorMsg(msg);
            const t = setTimeout(() => navigate('/login'), 3500);
            return () => clearTimeout(t);
        }

        if (!token) {
            setErrorMsg(ERROR_MESSAGES.no_token);
            const t = setTimeout(() => navigate('/login'), 3500);
            return () => clearTimeout(t);
        }

        loginWithToken(token)
            .then(() => navigate('/dashboard'))
            .catch(() => {
                setErrorMsg(ERROR_MESSAGES.oauth_failed);
                setTimeout(() => navigate('/login'), 3500);
            });
    }, []); // eslint-disable-line

    if (errorMsg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-paper-100 px-6 paper-grain">
                <div className="text-center max-w-sm animate-rise">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 bg-brick-muted border border-brick/20">
                        <AlertCircle size={22} className="text-brick" />
                    </div>
                    <h2 className="font-serif text-[19px] text-ink-900 mb-2" style={{ letterSpacing: '-0.015em' }}>
                        Sign-in failed
                    </h2>
                    <p className="text-ink-500 text-[13px] mb-4">{errorMsg}</p>
                    <p className="text-ink-400 text-[11.5px] font-mono">Redirecting to login…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-paper-100 paper-grain">
            <div className="text-center animate-rise">
                <div className="relative w-14 h-14 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full border-2 border-clay-200 animate-spin"
                        style={{ borderTopColor: '#c96442' }} />
                    <div className="absolute inset-1 rounded-full border-2 border-ink-100 animate-spin"
                        style={{ borderBottomColor: '#7a7370', animationDuration: '1.3s', animationDirection: 'reverse' }} />
                </div>
                <p className="text-ink-900 font-medium text-[14px]">Completing sign-in…</p>
                <p className="text-ink-500 text-[12.5px] mt-1">You'll be redirected automatically</p>
            </div>
        </div>
    );
}

```

---

## 📄 ReviewPage.jsx

**Relative Path:** `frontend\src\pages\ReviewPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\ReviewPage.jsx`

```jsx
import { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Play, ChevronDown, AlertTriangle, Lightbulb, Star,
    Loader2, GitCompare, Code2, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useReviewStore } from '../store/reviewStore';
import { getScoreColor, getLanguageIcon } from '../utils/helpers';
import ScoreRing from '../components/ScoreRing';

// Lazy load heavy Monaco components
const CodeEditor = lazy(() => import('../components/CodeEditor'));
const DiffEditor = lazy(() => import('../components/DiffEditor'));

const SUPPORTED_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c',
    'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
    'html', 'css', 'sql', 'bash', 'other',
];

const DEFAULT_CODE = {
    javascript: `// Paste your code here or start typing...\nfunction greet(name) {\n    console.log("Hello, " + name);\n}\n\ngreet("World");`,
    python: `# Paste your code here...\ndef greet(name):\n    print("Hello, " + name)\n\ngreet("World")`,
    typescript: `// Paste your code here...\nfunction greet(name: string): void {\n    console.log("Hello, " + name);\n}\n\ngreet("World");`,
};

const EditorSkeleton = () => (
    <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-clay-500 mx-auto mb-3" />
            <p className="text-ink-400 text-[12.5px] font-mono">Loading editor…</p>
        </div>
    </div>
);

export default function ReviewPage() {
    const navigate = useNavigate();
    const { submitReview, isAnalyzing } = useReviewStore();

    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState(DEFAULT_CODE.javascript);
    const [review, setReview] = useState(null);
    const [rightPanel, setRightPanel] = useState('results'); // 'results' | 'diff'
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [fixedCode, setFixedCode] = useState(null);

    const originalCodeRef = useRef(code);

    const handleLanguageChange = (lang) => {
        const defaultCode = DEFAULT_CODE[lang] || '// Paste your code here...';
        setLanguage(lang);
        setCode(defaultCode);
        setLangDropdownOpen(false);
        setReview(null);
        setFixedCode(null);
        originalCodeRef.current = defaultCode;
    };

    const handleCodeChange = useCallback((val) => {
        setCode(val || '');
        setFixedCode(val || '');
    }, []);

    const handleFixApplied = useCallback((fix, newValue) => {
        setCode(newValue);
        setFixedCode(newValue);
    }, []);

    const handleSubmit = async () => {
        if (!code.trim() || code.trim().length < 10) {
            toast.error('Please enter at least 10 characters of code.');
            return;
        }
        originalCodeRef.current = code;
        setReview(null);
        setFixedCode(null);

        try {
            const result = await submitReview({ code, language });
            setReview(result);
            setRightPanel('results');
        } catch {
            // Error handled in store
        }
    };

    const handleReset = () => {
        const defaultCode = DEFAULT_CODE[language] || '';
        setCode(defaultCode);
        setReview(null);
        setFixedCode(null);
        originalCodeRef.current = defaultCode;
    };

    const scoreColor = review ? getScoreColor(review.score) : null;
    const lineFixes = review?.lineFixes || [];

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-paper-100 overflow-hidden">

            {/* ── Top Toolbar ─────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 h-12 bg-paper-50 border-b border-ink-100 flex-shrink-0">

                {/* Language selector */}
                <div className="relative">
                    <button
                        onClick={() => setLangDropdownOpen((o) => !o)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-mono text-ink-700 transition-all hover:text-ink-900 hover:bg-paper-200 border border-ink-100"
                    >
                        <span className="text-ink-400">{getLanguageIcon(language)}</span>
                        <span className="capitalize">{language}</span>
                        <ChevronDown size={13} className="text-ink-400" />
                    </button>

                    {langDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 z-50 w-44 rounded-lg overflow-hidden surface shadow-lift">
                            <div className="max-h-60 overflow-y-auto py-1">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left transition-colors hover:bg-paper-100 ${language === lang ? 'text-clay-600 font-medium' : 'text-ink-700'}`}
                                    >
                                        <span className="text-ink-400 font-mono text-[11px]">{getLanguageIcon(lang)}</span>
                                        <span className="capitalize">{lang}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex-1" />

                {/* Score badge */}
                {review && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-md text-[13px] surface">
                        <Star size={13} className={scoreColor.text} />
                        <span className={`font-semibold ${scoreColor.text}`}>{review.score}</span>
                        <span className="text-ink-400">/100</span>
                        <span className="text-ink-400 text-[11.5px]">— {scoreColor.label}</span>
                    </div>
                )}

                {/* Reset */}
                <button
                    onClick={handleReset}
                    className="p-2 rounded-md text-ink-400 hover:text-ink-700 transition-colors hover:bg-paper-200"
                    title="Reset editor"
                >
                    <RotateCcw size={15} />
                </button>

                {/* Run Review button */}
                <button
                    onClick={handleSubmit}
                    disabled={isAnalyzing}
                    className="btn btn-clay !px-4 !py-2 !text-[13px]"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Analyzing…
                        </>
                    ) : (
                        <>
                            <Play size={14} fill="currentColor" />
                            Run Review
                        </>
                    )}
                </button>
            </div>

            {/* ── Main Split Layout ────────────────────────────── */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT — Code Editor */}
                <div className="flex flex-col w-1/2 border-r border-ink-100 min-w-0">
                    <div className="flex items-center gap-2 px-4 py-2 bg-paper-50 border-b border-ink-100 flex-shrink-0">
                        <Code2 size={13} className="text-ink-400" />
                        <span className="text-[12px] text-ink-500 font-mono">Your code</span>
                        {lineFixes.length > 0 && (
                            <span className="ml-auto text-[11px] text-ink-400 font-mono">Tab = apply nearest fix</span>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <Suspense fallback={<EditorSkeleton />}>
                            <CodeEditor
                                value={code}
                                onChange={handleCodeChange}
                                language={language}
                                readOnly={isAnalyzing}
                                lineFixes={lineFixes}
                                onFixApplied={handleFixApplied}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* RIGHT — Results / Diff */}
                <div className="flex flex-col w-1/2 min-w-0">

                    {/* Right panel tab bar */}
                    <div className="flex items-center border-b border-ink-100 bg-paper-50 flex-shrink-0">
                        <button
                            onClick={() => setRightPanel('results')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all border-b-2 ${rightPanel === 'results'
                                ? 'text-clay-600 border-clay-500'
                                : 'text-ink-400 border-transparent hover:text-ink-700'
                                }`}
                        >
                            <Lightbulb size={12} />
                            Results
                            {review && (
                                <span className="ml-1 px-1.5 py-0.5 rounded text-[11px] bg-clay-50 text-clay-700">
                                    {(review.issues?.length || 0) + (review.suggestions?.length || 0)}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setRightPanel('diff')}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-medium transition-all border-b-2 ${rightPanel === 'diff'
                                ? 'text-clay-600 border-clay-500'
                                : 'text-ink-400 border-transparent hover:text-ink-700'
                                }`}
                        >
                            <GitCompare size={12} />
                            Diff view
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {rightPanel === 'diff' ? (
                            <Suspense fallback={<EditorSkeleton />}>
                                <DiffEditor
                                    original={originalCodeRef.current}
                                    modified={fixedCode || code}
                                    language={language}
                                />
                            </Suspense>
                        ) : (
                            <ResultsPanel
                                review={review}
                                isAnalyzing={isAnalyzing}
                                onNavigateHistory={() => navigate('/history')}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Close dropdown on outside click */}
            {langDropdownOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setLangDropdownOpen(false)} />
            )}
        </div>
    );
}

// ── Results Panel ────────────────────────────────────────────────────────────

function ResultsPanel({ review, isAnalyzing, onNavigateHistory }) {
    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-white">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full border-2 border-clay-200 animate-spin"
                        style={{ borderTopColor: '#c96442' }} />
                    <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-ink-100 animate-spin"
                        style={{ borderBottomColor: '#7a7370', animationDuration: '1.5s', animationDirection: 'reverse' }} />
                </div>
                <div className="text-center">
                    <p className="text-ink-900 font-medium text-[13.5px]">Analyzing your code…</p>
                    <p className="text-ink-500 text-[12.5px] mt-1">Reviewing for bugs, improvements &amp; best practices</p>
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="flex flex-col items-center justify-center h-full px-8 text-center bg-white">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-clay-50 border border-clay-100">
                    <Play size={22} className="text-clay-500 opacity-70" fill="currentColor" />
                </div>
                <p className="text-ink-700 font-medium text-[13.5px] mb-1">Ready to review</p>
                <p className="text-ink-400 text-[12.5px]">Write or paste your code on the left, then press <kbd>Run Review</kbd></p>
            </div>
        );
    }

    const scoreColor = getScoreColor(review.score);

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4 bg-white">

            {/* Score card */}
            <div className="flex items-center gap-4 p-4 surface">
                <ScoreRing score={review.score} size={68} strokeWidth={5} />
                <div>
                    <p className="text-ink-900 font-serif text-[17px]" style={{ letterSpacing: '-0.01em' }}>{scoreColor.label}</p>
                    <p className="text-ink-500 text-[11.5px] mt-0.5">
                        {review.issues?.length || 0} issue{review.issues?.length !== 1 ? 's' : ''} ·{' '}
                        {review.suggestions?.length || 0} suggestion{review.suggestions?.length !== 1 ? 's' : ''} ·{' '}
                        {review.lineFixes?.length || 0} fix{review.lineFixes?.length !== 1 ? 'es' : ''}
                    </p>
                </div>
                <button
                    onClick={onNavigateHistory}
                    className="ml-auto text-[11.5px] text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200"
                >
                    View history →
                </button>
            </div>

            {/* Issues */}
            {review.issues?.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-[11px] font-semibold text-brick uppercase tracking-[0.14em] mb-2">
                        <AlertTriangle size={11} />
                        Issues ({review.issues.length})
                    </h3>
                    <div className="space-y-2">
                        {review.issues.map((issue, i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-md text-[13px] text-ink-700 bg-brick-muted border border-brick/15">
                                <span className="text-brick flex-shrink-0 mt-0.5">✕</span>
                                <span>{issue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {review.suggestions?.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-[11px] font-semibold text-sage uppercase tracking-[0.14em] mb-2">
                        <Lightbulb size={11} />
                        Suggestions ({review.suggestions.length})
                    </h3>
                    <div className="space-y-2">
                        {review.suggestions.map((s, i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-md text-[13px] text-ink-700 bg-sage-muted border border-sage/15">
                                <span className="text-sage flex-shrink-0 mt-0.5">→</span>
                                <span>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Line fixes summary */}
            {review.lineFixes?.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-[11px] font-semibold text-clay-600 uppercase tracking-[0.14em] mb-2">
                        <Code2 size={11} />
                        Inline fixes — press Tab in editor to apply
                    </h3>
                    <div className="space-y-2">
                        {review.lineFixes.map((fix, i) => (
                            <div key={i} className="rounded-md overflow-hidden text-[11.5px] font-mono border"
                                style={{ borderColor: fix.type === 'error' ? 'rgba(184,72,60,0.25)' : 'rgba(75,122,83,0.2)' }}>
                                <div className="flex items-center gap-2 px-3 py-1.5"
                                    style={{ background: fix.type === 'error' ? '#f6dfd8' : '#e6efe5' }}>
                                    <span className={fix.type === 'error' ? 'text-brick' : 'text-sage'}>
                                        {fix.type === 'error' ? 'Error' : 'Improvement'}
                                    </span>
                                </div>
                                <div className="px-3 py-2 text-brick/80 bg-paper-100 line-through">
                                    {fix.matchSnippet.slice(0, 100)}{fix.matchSnippet.length > 100 ? '…' : ''}
                                </div>
                                <div className="px-3 py-2 text-sage bg-paper-100">
                                    {fix.fix.slice(0, 100)}{fix.fix.length > 100 ? '…' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

```

---

## 📄 SignupPage.jsx

**Relative Path:** `frontend\src\pages\SignupPage.jsx`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\pages\SignupPage.jsx`

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useForm } from '../hooks/useForm';

const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'Required';
    else if (values.name.length < 2) errors.name = 'At least 2 characters';
    if (!values.email) errors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email';
    if (!values.password) errors.password = 'Required';
    else if (values.password.length < 8) errors.password = 'Minimum 8 characters';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password))
        errors.password = 'Include upper, lower & a number';
    return errors;
};

export default function SignupPage() {
    const { register } = useAuthStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm(
        { name: '', email: '', password: '' }, validate
    );

    const onSubmit = handleSubmit(async (data) => {
        setServerError('');
        try { await register(data); navigate('/dashboard'); }
        catch (error) { setServerError(error.response?.data?.message || 'Registration failed.'); }
    });

    return (
        <div className="min-h-screen bg-paper-100 flex items-center justify-center px-4 paper-grain">
            <div className="w-full max-w-[380px] animate-rise">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-paper-50 border border-ink-100">
                        <span className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.04em' }}>E</span>
                    </div>
                    <h1 className="font-serif text-[26px] text-ink-900" style={{ letterSpacing: '-0.02em' }}>
                        Create your account
                    </h1>
                    <p className="text-ink-500 text-[13px] mt-1">A quiet place to review code.</p>
                </div>

                <div className="surface p-6 shadow-paper">
                    {serverError && (
                        <div className="mb-4 p-3 rounded-md text-[13px] text-brick flex items-center gap-2 bg-brick-muted border border-brick/20">
                            <AlertCircle size={13} /> {serverError}
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-3.5" noValidate>
                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Name</label>
                            <input
                                name="name" type="text"
                                value={values.name} onChange={handleChange} onBlur={handleBlur}
                                placeholder="Jane Doe" autoComplete="name"
                                data-testid="signup-name"
                                className={`input ${touched.name && errors.name ? 'input-error' : ''}`}
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Email</label>
                            <input
                                name="email" type="email"
                                value={values.email} onChange={handleChange} onBlur={handleBlur}
                                placeholder="you@example.com" autoComplete="email"
                                data-testid="signup-email"
                                className={`input ${touched.email && errors.email ? 'input-error' : ''}`}
                            />
                            {touched.email && errors.email && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-[11.5px] text-ink-600 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    name="password" type={showPassword ? 'text' : 'password'}
                                    value={values.password} onChange={handleChange} onBlur={handleBlur}
                                    placeholder="Min 8 chars, mixed case & a number"
                                    autoComplete="new-password"
                                    data-testid="signup-password"
                                    className={`input pr-10 ${touched.password && errors.password ? 'input-error' : ''}`}
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                                >
                                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1 text-[11.5px] text-brick">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit" disabled={isSubmitting}
                            data-testid="signup-submit"
                            className="btn btn-primary w-full !py-2.5 mt-2"
                        >
                            {isSubmitting ? (<><Loader2 size={13} className="animate-spin" /> Creating…</>) : 'Create account'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-[13px] text-ink-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-clay-600 hover:text-clay-700 underline underline-offset-2 decoration-clay-200 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

```

---

## 📄 authStore.js

**Relative Path:** `frontend\src\store\authStore.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\store\authStore.js`

```javascript
import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isOAuthLoading: false,

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            set({ isLoading: false, isAuthenticated: false, user: null });
            return;
        }
        try {
            const data = await authApi.getMe();
            set({ user: data.data.user, isAuthenticated: true, isLoading: false });
        } catch {
            try {
                const refreshData = await authApi.refresh();
                localStorage.setItem('accessToken', refreshData.data.accessToken);
                const meData = await authApi.getMe();
                set({ user: meData.data.user, isAuthenticated: true, isLoading: false });
            } catch {
                localStorage.removeItem('accessToken');
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        }
    },

    login: async (credentials) => {
        const data = await authApi.login(credentials);
        const { user, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        set({ user, isAuthenticated: true });
        toast.success(`Welcome back, ${user.name}! 🚀`);
        return data;
    },

    register: async (userData) => {
        const data = await authApi.register(userData);
        const { user, accessToken } = data.data;
        localStorage.setItem('accessToken', accessToken);
        set({ user, isAuthenticated: true });
        toast.success(`Account created! Welcome, ${user.name}! 🎉`);
        return data;
    },

    // Called from OAuthCallbackPage after redirect with token in URL
    loginWithToken: async (accessToken) => {
        set({ isOAuthLoading: true });
        localStorage.setItem('accessToken', accessToken);
        try {
            const meData = await authApi.getMe();
            const user = meData.data.user;
            set({ user, isAuthenticated: true, isOAuthLoading: false });
            toast.success(`Welcome, ${user.name}! 🚀`);
            return user;
        } catch (err) {
            localStorage.removeItem('accessToken');
            set({ isOAuthLoading: false });
            toast.error('OAuth login failed. Please try again.');
            throw err;
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch {
            // Ignore errors on logout
        }
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
    },
}));
```

---

## 📄 reviewStore.js

**Relative Path:** `frontend\src\store\reviewStore.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\store\reviewStore.js`

```javascript
import { create } from 'zustand';
import { reviewApi } from '../api/review.api';
import { historyApi } from '../api/history.api';
import toast from 'react-hot-toast';

export const useReviewStore = create((set, get) => ({
    currentReview: null,
    history: [],
    pagination: null,
    isAnalyzing: false,
    isLoadingHistory: false,

    submitReview: async ({ code, language }) => {
        set({ isAnalyzing: true, currentReview: null });
        try {
            const data = await reviewApi.createReview({ code, language });
            const review = data.data.review;
            set((state) => {
                const updatedHistory = [review, ...state.history];
                // Keep history capped at 10 items for the current page view
                if (updatedHistory.length > 10) {
                    updatedHistory.pop();
                }
                const currentTotal = state.pagination?.total ?? 0;
                const newTotal = currentTotal + 1;
                const limit = state.pagination?.limit ?? 10;
                
                return {
                    currentReview: review,
                    isAnalyzing: false,
                    history: updatedHistory,
                    pagination: state.pagination ? {
                        ...state.pagination,
                        total: newTotal,
                        totalPages: Math.ceil(newTotal / limit),
                    } : {
                        page: 1,
                        limit: 10,
                        total: 1,
                        totalPages: 1,
                        hasMore: false,
                    }
                };
            });
            toast.success('Code review complete!');
            return review;
        } catch (error) {
            set({ isAnalyzing: false });
            const message = error.response?.data?.message || 'Failed to analyze code';
            toast.error(message);
            throw error;
        }
    },

    fetchHistory: async ({ page = 1, limit = 10 } = {}) => {
        set({ isLoadingHistory: true });
        try {
            const data = await historyApi.getHistory({ page, limit });
            set({
                history: data.data.reviews,
                pagination: data.data.pagination,
                isLoadingHistory: false,
            });
        } catch (error) {
            set({ isLoadingHistory: false });
            const message = error.response?.data?.message || 'Failed to load history';
            toast.error(message);
        }
    },

    deleteReview: async (id) => {
        try {
            await historyApi.deleteReview(id);
            set((state) => ({
                history: state.history.filter((r) => r.id !== id),
            }));
            toast.success('Review deleted');
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete review';
            toast.error(message);
        }
    },

    clearCurrentReview: () => set({ currentReview: null }),
}));
```

---

## 📄 helpers.js

**Relative Path:** `frontend\src\utils\helpers.js`

**Absolute Path:** `C:\Users\DELL\Downloads\ACR\frontend\src\utils\helpers.js`

```javascript
// Score palette — muted, warm, non-neon
export const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-sage',   hex: '#4b7a53', muted: '#e6efe5', label: 'Excellent' };
    if (score >= 60) return { text: 'text-slate2', hex: '#4a6fa5', muted: '#e2ebf7', label: 'Good' };
    if (score >= 40) return { text: 'text-ochre',  hex: '#b8853d', muted: '#f4ead1', label: 'Average' };
    return { text: 'text-brick', hex: '#b8483c', muted: '#f6dfd8', label: 'Poor' };
};
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};
export const truncateCode = (code, maxLength = 120) => {
    if (!code) return '';
    if (code.length <= maxLength) return code;
    return code.slice(0, maxLength) + '…';
};
// Two-letter monogram badge instead of emoji flags — quieter, no AI-cliché
export const getLanguageIcon = (language) => {
    const map = {
        javascript: 'JS', typescript: 'TS', python: 'PY', java: 'JV',
        cpp: 'C+', c: 'C', csharp: 'C#', go: 'GO', rust: 'RS',
        php: 'PH', ruby: 'RB', swift: 'SW', kotlin: 'KT',
        html: 'HT', css: 'CS', sql: 'SQ', bash: 'SH', other: '··',
    };
    return map[language] || '··';
};

```

---

