import { EventMap } from '.';

export interface WorkerRequest<M extends EventMap, T extends keyof M> {
  eventType: T;
  eventSeq: number;

  args: Parameters<M[T]>;
}
