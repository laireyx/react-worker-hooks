import { prepared, setupTest } from './utils.js';
import { startWorker } from '../../dist/browser/index.mjs';

/**
 * @typedef {Object} TestMap
 * @property {(num: number) => string} ping
 * @property {(ab: ArrayBuffer) => number} pingTransferable
 * @property {() => ArrayBuffer} pongTransferable
 * @property {(ab: ArrayBuffer) => ArrayBuffer} pingpongTransferable
 */

/**
 * @type {() => import('../../dist/browser/index.d.ts').WorkerInstance<TestMap>}
 */
let useWorker;

setupTest('startWorker', async () => {
  useWorker = startWorker('./worker.js');
  if (useWorker) return true;
});

setupTest('ping', async () => {
  const result = await useWorker().task('ping', 123);
  return result;
});

setupTest('pingTransferable', async () => {
  // Setup data
  const byteLength = 4 * (1 + Math.floor(Math.random() * 64));
  const u8a = new Uint8Array(byteLength);

  for (let i = 0; i < u8a.length; i++) {
    u8a[i] = i;
  }

  const result = await useWorker().taskWithTransferable(
    'pingTransferable',
    [u8a.buffer],
    u8a.buffer,
  );

  // 0 if transferred
  if (u8a.byteLength !== 0) return false;

  return result === byteLength;
});

setupTest('pongTransferable', async () => {
  const result = await useWorker().task('pongTransferable');
  const u8a = new Uint8Array(result);

  for (let i = 0; i < u8a.length; i++) {
    if (u8a[i] !== i) return false;
  }

  return true;
});

setupTest('pingpongTransferable', async () => {
  // Setup data
  const byteLength = 4 * (1 + Math.floor(Math.random() * 64));
  const u8a = new Uint8Array(byteLength);

  for (let i = 0; i < u8a.length; i++) {
    u8a[i] = i;
  }

  // Send as transferable
  const result = await useWorker().taskWithTransferable(
    'pingpongTransferable',
    [u8a.buffer],
    u8a.buffer,
  );

  // 0 if transferred
  if (u8a.byteLength !== 0) return false;

  for (let i = 0; i < u8a.length; i++) {
    if (result[i] !== i) return false;
  }

  return true;
});

prepared();
