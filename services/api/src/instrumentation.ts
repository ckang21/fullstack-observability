// services/api/src/instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT; // e.g. http://localhost:4318
if (!process.env.OTEL_SERVICE_NAME) {
  process.env.OTEL_SERVICE_NAME = 'fullstack-observability-api';
}

if (endpoint) {
  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({ url: `${endpoint}/v1/traces` }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: `${endpoint}/v1/metrics` }),
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  // Handle both Promise-returning and void-returning start()
  (async () => {
    try {
      if (typeof (sdk as any).start === 'function') {
        await (sdk as any).start();
      }
      console.log('[otel] started');
    } catch (e) {
      console.error('[otel] failed', e);
    }
  })();

  const shutdown = async () => {
    try {
      if (typeof (sdk as any).shutdown === 'function') {
        await (sdk as any).shutdown();
      }
    } finally {
      process.exit(0);
    }
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
} else {
  console.log('[otel] disabled (no OTEL_EXPORTER_OTLP_ENDPOINT)');
}
