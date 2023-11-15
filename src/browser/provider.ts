import { BrowserBridge } from '.';
import { BridgePool } from './pool';
import { BareMap, EventMap } from '../types';

export function startWorker<M extends BareMap = EventMap>(
  scriptURL: string | URL,
  options: WorkerOptions = { type: 'module' },
) {
  const workerBridge = new BrowserBridge<M>(scriptURL, options);

  return function useWorker() {
    return workerBridge;
  };
}

export function startWorkerPool<M extends BareMap = EventMap>(
  poolSize: number,
  scriptURL: string | URL,
  options: WorkerOptions = { type: 'module' },
) {
  const workers = [];
  for (let i = 0; i < poolSize; i++) {
    workers.push(new BrowserBridge<M>(scriptURL, options));
  }

  const bridgePool = new BridgePool(workers);

  return function useWorker() {
    return bridgePool;
  };
}
