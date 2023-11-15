import { WrapTransferable } from './wrapTransferable';
import { BareMap, EventMap } from '../types';
type TransferHandler<M extends BareMap, E extends keyof M> = (...args: Parameters<M[E]>) => WrapTransferable<ReturnType<M[E]>>;
export declare class WorkerBridge<M extends BareMap = EventMap> {
    private handlers;
    constructor();
    private handleRequest;
    on: <E extends keyof M>(eventType: E, handler: M[E]) => void;
    onTransfer: <E extends keyof M>(eventType: E, handler: TransferHandler<M, E>) => void;
}
export {};
