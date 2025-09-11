// OpenTelemetry wiring placeholder.
// Install packages:
//   npm i @opentelemetry/api @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
// Example (pseudo):
//
// import { NodeSDK } from '@opentelemetry/sdk-node';
// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// const sdk = new NodeSDK({
//   instrumentations: [getNodeAutoInstrumentations()],
//   // add exporter / resource as needed
// });
// sdk.start();
// process.on('SIGTERM', () => sdk.shutdown());
//
// Then import this file at the top of src/index.ts:
//   import './instrumentation.js';
