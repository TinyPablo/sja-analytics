# Deployment

The stack runs entirely in Docker on the host, published on `127.0.0.1:8300`
and reached from the internet through a Cloudflare Tunnel. See
[`deploy/cloudflared-ingress.md`](deploy/cloudflared-ingress.md) for the tunnel
and DNS side.

## Requirements on the host

- Docker Engine with the `compose` v2 plugin (`docker compose version`)
- `cloudflared` running as a systemd service, with the zone in Cloudflare
- `git`, and `make` if you want the shortcuts (every target below has a raw
  `docker compose` equivalent)
- Port 8300 free: `sudo ss -ltnp | grep :8300`

## First deployment

```sh
git clone git@github.com:TinyPablo/sja-analytics.git
cd sja-analytics

cp .env.example .env     # .env is git-ignored and required by compose
make prod                # or: docker compose -f docker-compose.prod.yml up -d --build
```

Verify locally before touching DNS:

```sh
docker compose -f docker-compose.prod.yml ps
curl -s http://127.0.0.1:8300/api/health
```

Expected: `{"status":"ok","app_name":"SJA Analytics API","app_env":"prod","database":"up"}`

Then add the DNS record and the ingress rule, and open
`https://analytics.<domain>`.

## Updating

```sh
cd ~/projects/sja-analytics
make deploy              # git pull + rebuild + restart
```

Raw equivalent:

```sh
git pull --ff-only
docker compose -f docker-compose.prod.yml up -d --build
```

Migrations run automatically in the api container's entrypoint
(`alembic upgrade head`), so a schema change needs no extra step.

## Data

SQLite and uploaded Unity scenes live on the named volume `sja-data`, mounted
at `/app/data`. It survives `up --build`, `down` and host reboots. It does
**not** survive `down -v` - that flag destroys the database.

Backup:

```sh
docker compose -f docker-compose.prod.yml exec -T api \
  sh -c 'cat /app/data/sja.db' > sja-$(date +%F).db
```

Restore into a stopped stack:

```sh
docker compose -f docker-compose.prod.yml stop api
docker compose -f docker-compose.prod.yml run --rm -T api \
  sh -c 'cat > /app/data/sja.db' < sja-2026-09-23.db
docker compose -f docker-compose.prod.yml start api
```

## Diagnostics

```sh
make prod-logs                                            # follow all logs
docker compose -f docker-compose.prod.yml logs api        # api only
docker compose -f docker-compose.prod.yml ps              # health status
```

The api container has a healthcheck on `/api/health`; nginx waits for it to
report healthy before starting, so a cold boot never serves a 502.

## Rollback

Images are built from the checked-out commit, so rolling back is a checkout:

```sh
git log --oneline -5
git checkout <commit>
docker compose -f docker-compose.prod.yml up -d --build
```

Mind that a rollback does not undo applied migrations - Alembic downgrades are
a separate, deliberate step.
