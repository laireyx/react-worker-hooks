import { BareMap, EventMap } from '../types';
export declare class WorkerInstance<M extends BareMap = EventMap> {
    private worker;
    private terminated;
    private eventSeq;
    private pendingTasks;
    constructor(scriptURL: string | URL, options?: WorkerOptions);
    get pendingTaskCount(): number;
    taskWithTransferable: <E extends keyof M>(eventType: E, transfer: Transferable[], ...args: Parameters<M[E]>) => Promise<Awaited<ReturnType<M[E]>>>;
    task: <E extends keyof M>(eventType: E, ...args: Parameters<M[E]>) => Promise<Awaited<ReturnType<M[E]>>>;
    private handleResponse;
    terminate(): void;
}
