import { BrowserBridge } from '.';
import { EventMap } from '../types';
export declare function startWorker<M extends EventMap>(scriptURL: string | URL, options?: WorkerOptions): () => BrowserBridge<M>;
