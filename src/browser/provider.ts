import { useState } from 'react';

import { BrowserBridge } from '.';
import { EventMap } from '../types';

export function useWorker<M extends EventMap>(
  scriptURL: string | URL,
  options: WorkerOptions = { type: 'module' },
) {
  const [workerBridge] = useState<BrowserBridge<M>>(
    new BrowserBridge(scriptURL, options),
  );

  return workerBridge;
}
