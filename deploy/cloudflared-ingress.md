# Exposing the stack through Cloudflare Tunnel

The production stack publishes nginx on `127.0.0.1:8300` - loopback only, never
on a public interface. A Cloudflare Tunnel (`cloudflared`, running on the host
as a systemd service) is the sole way in.

```
internet ──https──▶ Cloudflare edge ──tunnel──▶ cloudflared ──http──▶ 127.0.0.1:8300
                                                                        │
                                                          nginx ────────┤
                                                            ├─ /     → SPA (static)
                                                            └─ /api  → api:8000
```

TLS terminates at the Cloudflare edge and the edge→host leg is encrypted by the
tunnel itself, so plain HTTP on loopback is fine. Caddy is **not** involved in
this path.

## 1. DNS record

In the Cloudflare dashboard for the zone, add:

| Type  | Name        | Target                           | Proxy       |
| ----- | ----------- | -------------------------------- | ----------- |
| CNAME | `analytics` | `<TUNNEL-UUID>.cfargotunnel.com` | **Proxied** |

Proxying is mandatory - a `cfargotunnel.com` target does not resolve without it.

The CLI equivalent, if `cert.pem` covers the zone:

```sh
cloudflared tunnel route dns <TUNNEL-UUID> analytics.<domain>
```

## 2. Ingress rule

In `/etc/cloudflared/config.yml`, **above** the catch-all:

```yaml
- hostname: analytics.<domain>
  service: http://127.0.0.1:8300

- service: http_status:404
```

Order matters: `cloudflared` matches rules top to bottom, and the catch-all
swallows everything after it.

```sh
cloudflared tunnel ingress validate
sudo systemctl restart cloudflared
```

## 3. Certificate

Cloudflare issues Universal SSL automatically once the zone is active - the
wildcard covers one subdomain level, so `analytics.<domain>` is included.
Nothing to install on the host. A "hostname is not covered by a certificate"
warning before the nameservers have propagated is expected and resolves itself.

Afterwards, enable **SSL/TLS → Edge Certificates → Always Use HTTPS**.

## Troubleshooting

| Symptom              | Check                                                   |
| -------------------- | ------------------------------------------------------- |
| 502 from Cloudflare  | `curl http://127.0.0.1:8300/api/health` on the host     |
| 1033 / tunnel error  | `systemctl status cloudflared`, then its journal        |
| 404 from the tunnel  | ingress rule sits below the catch-all, or hostname typo |
| DNS does not resolve | `dig +short NS <domain>` - registrar still delegating   |
