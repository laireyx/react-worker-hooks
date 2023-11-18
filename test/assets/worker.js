import { WorkerBridge } from '../../dist/worker/index.mjs';

const bridge = new WorkerBridge();

bridge.on('ping', (arg) => {
  return 'pong ' + arg;
});
