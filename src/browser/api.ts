import { WorkerInstance } from './instance';
import { WorkerPool } from './pool';
import { BareMap, EventMap } from '../types';

export function startWorker<M extends BareMap = EventMap>(
  scriptURL: string | URL,
  options: WorkerOptions = { type: 'module' },
) {
  const browserBridge = new WorkerInstance<M>(new Worker(scriptURL, options));

  return function useWorker() {
    return browserBridge;
  };
}

export function connectWorker<M extends BareMap = EventMap>(worker: Worker) {
  const browserBridge = new WorkerInstance<M>(worker);

  return function useWorker() {
    return browserBridge;
  };
}

export function startWorkerPool<M extends BareMap = EventMap>(
  poolSize: number,
  scriptURL: string | URL,
  options: WorkerOptions = { type: 'module' },
) {
  const workers = [];
  for (let i = 0; i < poolSize; i++) {
    workers.push(new WorkerInstance<M>(new Worker(scriptURL, options)));
  }

  const bridgePool = new WorkerPool(workers);

  return function useWorker() {
    return bridgePool;
  };
}

export function connectWorkerPool<M extends BareMap = EventMap>(
  workers: Worker[],
) {
  const bridgePool = new WorkerPool<M>(
    workers.map((worker) => new WorkerInstance<M>(worker)),
  );

  return function useWorker() {
    return bridgePool;
  };
}
