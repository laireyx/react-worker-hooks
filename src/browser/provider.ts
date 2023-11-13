import { BrowserBridge } from '.';
import { EventMap } from '../types';

export function startWorker<M extends EventMap>(
  scriptURL: string | URL,
  options: WorkerOptions = { type: 'module' },
) {
  const workerBridge = new BrowserBridge<M>(scriptURL, options);

  return function useWorker() {
    return workerBridge;
  };
}
