import { BrowserBridge } from '.';
import { EventMap } from '../types';
export declare function useWorker<M extends EventMap>(scriptURL: string | URL, options?: WorkerOptions): BrowserBridge<M>;
