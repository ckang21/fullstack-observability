# Fullstack Observability Demo

Small, production-minded demo that ties together:
- TypeScript API (Express + Apollo GraphQL) + Postgres
- Unit (Jest) + E2E (Playwright) tests
- Docker + docker-compose
- OpenTelemetry → Collector → Prometheus → Grafana

## Quickstart

```bash
# 1) Start Postgres
docker compose up -d db

# 2) Run API (plain)
cd services/api
npm install
DATABASE_URL=postgres://postgres:postgres@localhost:5433/appdb npm run dev
# API:     http://localhost:4000
# GraphQL: http://localhost:4000/graphql
# Health:  http://localhost:4000/health
```

## Observability

# From repo root: start Collector + Prometheus + Grafana
docker compose up -d otel-collector prometheus grafana

# Run API with OpenTelemetry enabled
cd services/api
npm run dev:otel
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3000  (admin / admin)



## Tests
# Unit tests
cd services/api
npm test

# E2E tests (auto-starts API via Playwright webServer)
cd ../../tests/e2e
npm install
npx playwright install --with-deps
npm test

