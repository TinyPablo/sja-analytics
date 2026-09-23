# @sja/api-types

TypeScript types for the SJA Analytics API, generated from the FastAPI OpenAPI
schema. Pydantic models in `apps/api` are the single source of truth.

## Regenerating

With the stack running (`make dev`, reachable on http://localhost:8300):

```sh
make gen-types
```

`src/schema.ts` is overwritten by the generator. `src/index.ts` is hand-written
and exports friendly aliases - add one there for each new schema the app uses.
