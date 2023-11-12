import { EventMap } from '.';
export interface WorkerResponse<M extends EventMap, T extends keyof M> {
    eventType: T;
    eventSeq: number;
    result: {
        success: true;
        response: Awaited<ReturnType<M[T]>>;
    } | {
        success: false;
        reason: any;
    };
}
