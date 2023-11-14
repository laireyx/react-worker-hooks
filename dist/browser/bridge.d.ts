import { BareMap, EventMap } from '../types';
export declare class BrowserBridge<M extends BareMap = EventMap> {
    worker: Worker;
    private eventSeq;
    private pendingTasks;
    constructor(scriptURL: string | URL, options?: WorkerOptions);
    taskWithTransferable: <E extends keyof M>(eventType: E, transfer: Transferable[], ...args: Parameters<M[E]>) => Promise<Awaited<ReturnType<M[E]>>>;
    task: <E extends keyof M>(eventType: E, ...args: Parameters<M[E]>) => Promise<Awaited<ReturnType<M[E]>>>;
    private handleResponse;
}
