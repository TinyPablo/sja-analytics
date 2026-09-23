# syntax=docker/dockerfile:1
# Build context is the REPO ROOT - npm workspaces need the root manifest,
# and the prod stage copies the nginx config from deploy/.

FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY apps/web/package.json apps/web/
COPY packages/api-types/package.json packages/api-types/
RUN npm install


# ---- dev: Vite dev server, sources bind-mounted by compose ----
FROM deps AS dev
WORKDIR /repo/apps/web
EXPOSE 5173
CMD ["npm", "run", "dev"]


# ---- build: static bundle ----
FROM deps AS build
COPY packages/api-types packages/api-types
COPY apps/web apps/web
RUN npm run build --workspace @sja/web


# ---- prod: nginx serving the bundle and proxying /api ----
FROM nginx:1.27-alpine AS prod
COPY deploy/nginx/prod.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
