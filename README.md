# Fullstack Observability Demo

A small *production-minded* portfolio project that stitches together several skills:

- TypeScript backend (Express + Apollo GraphQL) with Postgres
- E2E UI tests with Playwright
- Docker + docker-compose for local dev
- Intro Kubernetes manifest via Helm (basic Deployment + Service)
- CI with GitHub Actions
- Hooks for observability (OpenTelemetry placeholders) and OAuth2 notes

> Created: 2025-09-11

## Stack

- **Backend**: TypeScript, Express, Apollo Server, GraphQL, pg
- **DB**: Postgres (docker-compose)
- **Testing**: Jest (unit), Playwright (E2E)
- **Infra**: Docker, Helm (k8s)
- **CI**: GitHub Actions

## Getting Started

### 1) Prereqs
- Node >= 18, npm or pnpm
- Docker / Docker Desktop
- (Optional) kubectl + Helm for k8s demo

### 2) Local dev (API + Postgres)

```bash
# from the repo root
docker compose up -d db

cd services/api
npm install
npm run dev
```

API runs on http://localhost:4000  
Health check at http://localhost:4000/health  
GraphQL Playground at http://localhost:4000/graphql

### 3) Run unit tests

```bash
cd services/api
npm test
```

### 4) Run E2E (headless Playwright)

```bash
cd tests/e2e
npm install
npx playwright install --with-deps
npm test
```

### 5) Dockerize API

```bash
cd services/api
docker build -t fullstack-observability/api:local .
docker run --rm -p 4000:4000 --env-file .env.example fullstack-observability/api:local
```

### 6) Kubernetes (Helm skeleton)

> This is a minimal chart intended for learning. It deploys the API with a Service.

```bash
helm install fs-ob-demo ./helm/fullstack-observability-demo \
  --set image.repository=fullstack-observability/api \
  --set image.tag=local
```

### 7) Observability (next steps)

- `services/api/src/instrumentation.ts` shows how to wire OpenTelemetry SDK (commented).
- Add a collector (OpenTelemetry Collector) and export to Prometheus; view in Grafana.

### 8) OAuth2 Notes

- See `docs/oauth2-notes.md` for how to add OAuth2 login to the API / a frontend.

---

## Repo Layout

```
fullstack-observability-demo/
├─ README.md
├─ docker-compose.yml
├─ .gitignore
├─ .github/workflows/ci.yml
├─ helm/
│  └─ fullstack-observability-demo/
│     ├─ Chart.yaml
│     ├─ values.yaml
│     └─ templates/
│        ├─ deployment.yaml
│        └─ service.yaml
├─ services/
│  └─ api/
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ jest.config.js
│     ├─ Dockerfile
│     ├─ .env.example
│     └─ src/
│        ├─ index.ts
│        ├─ schema.ts
│        ├─ db.ts
│        ├─ instrumentation.ts
│        └─ math.ts
├─ tests/
│  └─ e2e/
│     ├─ package.json
│     ├─ playwright.config.ts
│     └─ example.spec.ts
└─ web/  (placeholder)
```

---

## Suggested Next Milestones

- Add OpenTelemetry SDK and a collector, export metrics to Prometheus.
- Add Grafana dashboard and link traces to requests.
- Expand GraphQL schema with a simple `Task` entity backed by Postgres table.
- Add OAuth2 login with a provider (Auth0 demo, or GitHub OAuth) and secure a route.
- Deploy the container to a real cluster (kind, minikube, or cloud).
