import { WorkerInstance } from './instance';
import { BareMap } from '../types';
export declare class WorkerPool<M extends BareMap> {
    private workers;
    private parent;
    private lastWorkerIndex;
    private _terminated;
    constructor(workers: WorkerInstance<M>[], parent?: WorkerPool<M> | null);
    private get terminated();
    private assertOnline;
    get size(): number;
    assign: (count: number) => WorkerPool<M>;
    task: <E extends keyof M>(eventType: E, ...args: Parameters<M[E]>) => Promise<Awaited<ReturnType<M[E]>>>[];
    terminate: () => void;
}
