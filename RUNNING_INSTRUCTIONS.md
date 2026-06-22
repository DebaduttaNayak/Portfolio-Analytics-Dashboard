# Meridian Capital — Portfolio Analytics Dashboard
## Running Locally in VS Code

> **No database required.** All data is mock/simulated — just install and run.

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20+ (LTS) | https://nodejs.org |
| pnpm | 9+ | `npm install -g pnpm` |

That's it. No Postgres, no `.env` file needed.

---

## Quick Start (3 steps)

**Step 1 — Install dependencies:**
```bash
pnpm install
```

**Step 2 — Start the API server** (Terminal 1):
```bash
pnpm --filter @workspace/api-server run dev
```
API runs at → **http://localhost:5000**

**Step 3 — Start the dashboard** (Terminal 2):
```bash
pnpm --filter @workspace/meridian-dashboard run dev
```
Open → **http://localhost:5173**

---

## VS Code Tip: Run both with one click

Create `.vscode/tasks.json` in the project root:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "API Server",
      "type": "shell",
      "command": "pnpm --filter @workspace/api-server run dev",
      "isBackground": true,
      "group": "build"
    },
    {
      "label": "Dashboard",
      "type": "shell",
      "command": "pnpm --filter @workspace/meridian-dashboard run dev",
      "isBackground": true,
      "group": "build",
      "dependsOn": "API Server"
    }
  ]
}
```

Then press `Ctrl+Shift+B` to launch both at once.

---

## Recommended VS Code Extensions

- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier** — `esbenp.prettier-vscode`
- **Tailwind CSS IntelliSense** — `bradlc.vscode-tailwindcss`

---

## Project Structure

```
meridian-capital-dashboard/
├── artifacts/
│   ├── api-server/          ← Express 5 API (defaults to port 5000)
│   └── meridian-dashboard/  ← React + Vite frontend (defaults to port 5173)
├── lib/
│   ├── api-client-react/    ← Auto-generated React Query hooks
│   ├── api-spec/            ← OpenAPI spec (source of truth for all endpoints)
│   └── api-zod/             ← Auto-generated Zod validation schemas
└── pnpm-workspace.yaml      ← Workspace config
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `pnpm run typecheck` | Full TypeScript check across all packages |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerate API hooks from OpenAPI spec |

---

## Troubleshooting

**"Cannot find module @workspace/..."**
→ Run `pnpm install` again

**Dashboard shows "Failed to fetch" errors**
→ Make sure the API server (Terminal 1) is running before opening the dashboard

**Port already in use**
→ `PORT=5001 pnpm --filter @workspace/api-server run dev`
→ `PORT=5174 pnpm --filter @workspace/meridian-dashboard run dev`
