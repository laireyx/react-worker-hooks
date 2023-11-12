import { EventMap } from '../types';
export declare class WorkerBridge<M extends EventMap> {
    private handlers;
    constructor();
    private handleRequest;
    on: <E extends keyof M>(eventType: E, handler: M[E]) => void;
}
