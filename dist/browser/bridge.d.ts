import { EventMap } from '../types';
export declare class BrowserBridge<M extends EventMap> {
    worker: Worker;
    private eventSeq;
    private pendingTasks;
    constructor(scriptURL: string | URL, options?: WorkerOptions);
    task: <E extends keyof M | (string & {})>(eventType: E, ...args: Parameters<M[E]>) => Promise<Awaited<ReturnType<M[E]>>>;
    private handleResponse;
}
