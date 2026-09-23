# syntax=docker/dockerfile:1

FROM python:3.13-slim AS base
COPY --from=ghcr.io/astral-sh/uv:0.10.12 /uv /uvx /bin/
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PROJECT_ENVIRONMENT=/app/.venv \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1
WORKDIR /app


# ---- dev: dependencies incl. dev group, sources bind-mounted by compose ----
FROM base AS dev
ENV PYTHONPATH=/app/src
COPY pyproject.toml ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-install-project
COPY . .
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "sja_api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", \
     "--reload-dir", "/app/src"]


# ---- prod: no dev dependencies, project installed into the venv ----
FROM base AS prod
COPY pyproject.toml ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-dev --no-install-project
COPY . .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --no-dev
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uvicorn", "sja_api.main:app", "--host", "0.0.0.0", "--port", "8000"]
