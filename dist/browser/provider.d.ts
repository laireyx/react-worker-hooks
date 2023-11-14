import { BrowserBridge } from '.';
import { BareMap, EventMap } from '../types';
export declare function startWorker<M extends BareMap = EventMap>(scriptURL: string | URL, options?: WorkerOptions): () => BrowserBridge<M>;
