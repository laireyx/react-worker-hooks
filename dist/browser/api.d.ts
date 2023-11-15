import { WorkerInstance } from '.';
import { WorkerPool } from './pool';
import { BareMap, EventMap } from '../types';
export declare function startWorker<M extends BareMap = EventMap>(scriptURL: string | URL, options?: WorkerOptions): () => WorkerInstance<M>;
export declare function startWorkerPool<M extends BareMap = EventMap>(poolSize: number, scriptURL: string | URL, options?: WorkerOptions): () => WorkerPool<M>;
