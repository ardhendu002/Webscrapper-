# IPL 2025 Web Scraper

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Cheerio](https://img.shields.io/badge/Cheerio-E88C1F?style=for-the-badge&logo=jquery&logoColor=white)

</div>

A web scraper written in TypeScript that pulls IPL 2025 player statistics directly from Cricbuzz. It uses Axios to fetch the page and Cheerio to parse the HTML — no browser automation, no bloat. Just clean, typed data you can work with.

[Getting Started](#getting-started) · [How It Works](#how-it-works) · [Usage](#usage) · [Project Structure](#project-structure) · [Contributing](#contributing)

---

## What It Does

- Fetches the live IPL 2025 stats page from Cricbuzz
- Parses player data — name, matches played, and runs scored
- Returns the data as a typed `PlayerData[]` array
- Handles request failures gracefully without crashing
- Outputs clean JSON, ready to pipe into a database or API

---

## Tech Stack

| Tool | Why it's used |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) | Catches bugs at compile time, not runtime |
| [Node.js](https://nodejs.org/) | Runtime environment |
| [Axios](https://axios-http.com/) | Handles HTTP requests with clean promise support |
| [Cheerio](https://cheerio.js.org/) | Parses HTML using familiar jQuery-style selectors |
| [ts-node](https://typestrong.org/ts-node/) | Run `.ts` files directly without a build step |
| [nodemon](https://nodemon.io/) | Watches for file changes and restarts automatically |

---

## Getting Started

### Prerequisites

- Node.js v18 or later
- npm v8 or later

### Clone and Install

```bash
git clone https://github.com/ardhendu002/Webscrapper-.git
cd Webscrapper-
npm install
```

### Install Dependencies Manually

If you're setting up from scratch:

```bash
# Runtime
npm install -s axios cheerio

# Dev (TypeScript tooling + type definitions)
npm install -D typescript ts-node nodemon @types/axios @types/cheerio
```

---

## Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "sourceMap": true,
    "resolveJsonModule": true,
    "lib": ["es6", "dom"],
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### package.json scripts

```json
"scripts": {
  "start": "tsc && node dist/index.js",
  "dev": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"
}
```

The `dev` script watches your source files and re-runs the scraper on every save — useful when you're tuning selectors.

---

## Usage

**Development mode** — auto-reloads on file changes:

```bash
npm run dev
```

**Production** — compiles TypeScript then runs the output:

```bash
npm start
```

### Sample Output

```json
[
  { "name": "Virat Kohli",  "matches": 10, "runs": 480 },
  { "name": "Shubman Gill", "matches": 10, "runs": 440 },
  { "name": "Rohit Sharma", "matches": 10, "runs": 390 }
]
```

---

## How It Works

```
index.ts (Axios)  ──── HTTP GET ────▶  cricbuzz.com
                  ◀─── HTML response ─

cheerio.load(html)
  └── $('.cb-series-stats-container tr')
        └── each row → { name, matches, runs }
              └── PlayerData[] → JSON output
```

The flow is straightforward:

1. Axios sends a `GET` request to the Cricbuzz IPL 2025 stats URL, with a browser-like `User-Agent` header to avoid getting blocked.
2. The raw HTML from `response.data` is handed off to Cheerio.
3. Cheerio parses the HTML tree and lets you target elements using CSS selectors — the same way you'd use `document.querySelector` in a browser.
4. Each table row is iterated. The scraper picks out the player name, match count, and run tally from specific columns.
5. Valid rows get pushed into a typed `PlayerData[]` array and logged to the console.

---

## Core Code

```typescript
import axios from 'axios';
import * as cheerio from 'cheerio';

const url = 'https://www.cricbuzz.com/cricket-series/9237/indian-premier-league-2025/stats';

interface PlayerData {
  name: string;
  matches: number;
  runs: number;
}

const AxiosInstance = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  }
});

AxiosInstance.get(url)
  .then(response => {
    const html = response.data as string;
    const $ = cheerio.load(html);
    const statsTable: cheerio.Cheerio<any> = $('.cb-series-stats-container tr');
    const topScorers: PlayerData[] = [];

    statsTable.each((i, elem) => {
      const name    = $(elem).find('.cb-col-50').text().trim();
      const matches = parseInt($(elem).find('.cb-col-8').eq(0).text().trim());
      const runs    = parseInt($(elem).find('.cb-col-8').eq(1).text().trim());

      if (name) topScorers.push({ name, matches, runs });
    });

    console.log(topScorers);
  })
  .catch(console.error);
```

---

## Project Structure

```
Webscrapper-/
├── src/
│   └── index.ts        — entry point, all scraping logic lives here
├── dist/               — compiled JS output (generated on build)
├── tsconfig.json       — TypeScript compiler settings
├── package.json        — dependencies and npm scripts
└── README.md
```

---

## Disclaimer

This project is for learning purposes only. Scraping a website may conflict with its Terms of Service. Before using this in any production context, check the target site's `robots.txt` and ToS to make sure you're in the clear.

---

## Contributing

If you spot a bug or want to extend this — say, adding bowling or fielding stats — feel free to open an issue or submit a pull request.

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Then open a PR against `main`.

---

## Author

**Ardhendu** — [@ardhendu002](https://github.com/ardhendu002)

---

