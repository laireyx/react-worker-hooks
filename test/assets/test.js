import { prepared, setupTest } from './utils.js';
import { startWorker } from '../../dist/browser/index.mjs';

let useWorker;

setupTest('startWorker', async () => {
  useWorker = startWorker('./worker.js');
  if (useWorker) return true;
});

setupTest('ping', async () => {
  const result = await useWorker().task('ping', 123);
  return result;
});

prepared();
