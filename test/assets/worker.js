import { WorkerBridge, WrapTransferable } from '../../dist/worker/index.mjs';

/**
 * @typedef {Object} TestMap
 * @property {(num: number) => string} ping
 * @property {(ab: ArrayBuffer) => number} pingTransferable
 * @property {() => ArrayBuffer} pongTransferable
 * @property {(ab: ArrayBuffer) => ArrayBuffer} pingpongTransferable
 */

/** @type {import('../../dist/worker/index.d.ts').WorkerBridge<TestMap>} */
const bridge = new WorkerBridge();

bridge.on('ping', (arg) => {
  return 'pong ' + arg;
});

bridge.on('pingTransferable', (ab) => {
  const u8a = new Uint8Array(ab);

  for (let i = 0; i < u8a.length; i++) {
    if (u8a[i] !== i) throw new Error('Received wrong data');
  }

  return ab.byteLength;
});

bridge.onTransfer('pongTransferable', () => {
  // Setup data
  const byteLength = 4 * (1 + Math.floor(Math.random() * 64));
  const u8a = new Uint8Array(byteLength);

  for (let i = 0; i < u8a.length; i++) {
    u8a[i] = i;
  }

  return new WrapTransferable(u8a.buffer, [u8a.buffer]);
});

bridge.onTransfer('pingpongTransferable', (ab) => {
  const u8a = new Uint8Array(ab);

  for (let i = 0; i < u8a.length; i++) {
    if (u8a[i] !== i) throw new Error('Received wrong data');
  }

  return new WrapTransferable(u8a.buffer, [u8a.buffer]);
});
