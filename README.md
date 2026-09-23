# sja-analytics

Analytics dashboard for **Small Jump Adventures** - visualising player death
heatmaps over imported Unity scenes, with more statistics to follow.

Currently a project skeleton: the whole stack boots and talks end to end
(`browser → nginx → React → /api/health → FastAPI → SQLite`), but no domain
logic exists yet.

## Stack

| Layer      | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Frontend   | React 19 + TypeScript, Vite, React Router, TanStack Query       |
| Styling    | Tailwind CSS v4 + shadcn/ui                                     |
| Backend    | FastAPI, SQLAlchemy 2.0 (sync), Alembic, managed by `uv`        |
| Database   | SQLite on a Docker volume                                       |
| Front door | nginx in every environment; Cloudflare Tunnel for public access |

## Layout

```
apps/
  api/          FastAPI service - routers → services → SQLAlchemy
  web/          React SPA
packages/
  api-types/    TS types generated from the API's OpenAPI schema
deploy/
  nginx/        dev.conf and prod.conf
  cloudflared-ingress.md
data/           SQLite file and uploaded Unity scenes (git-ignored volume)
```

## Getting started

```sh
cp .env.example .env
make dev-build          # first run
open http://localhost:8300
```

`make help` lists everything else. For the server see [DEPLOY.md](DEPLOY.md).

The dev stack bind-mounts sources, so
uvicorn reloads and Vite HMR both work through nginx, published on host
port 8300.

## Architecture decisions

- **The API is an ETL + cache layer.** Firebase is an import source, never a
  runtime dependency of the browser. The frontend talks only to `/api`.
- **Sync is manual** via `POST /api/sync` - no scheduler, no worker.
- **Unity scenes are uploaded** through `POST /api/maps`, parsed in Python;
  geometry lands in SQLite, the original `.yml` on the data volume.
- **Heatmaps are aggregated in SQL.** The endpoint returns a binned grid, so
  the payload stays constant regardless of how many deaths were recorded.
- **Pydantic models are the contract.** `packages/api-types` is generated from
  the OpenAPI schema; never edit `src/schema.ts` by hand.
- **Production is loopback-only.** nginx publishes on `127.0.0.1:8300` and a
  Cloudflare Tunnel is the sole public entry point.

## Not built yet

Firebase sync, the `.yml` parser, heatmap aggregation and rendering, tests, CI.
