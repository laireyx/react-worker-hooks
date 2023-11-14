import { BrowserBridge } from '.';
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
