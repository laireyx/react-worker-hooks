import { EventMap, WorkerRequest, WorkerResponse } from '../types';

export class WorkerBridge<M extends EventMap> {
  private handlers: Map<keyof M, M[keyof M]> = new Map();

  constructor() {
    self.addEventListener(
      'message',
      (ev: MessageEvent<WorkerRequest<M, keyof M>>) =>
        void this.handleRequest(ev),
    );
  }

  private handleRequest = async (
    ev: MessageEvent<WorkerRequest<M, keyof M>>,
  ) => {
    const { eventType, eventSeq, args } = ev.data;

    try {
      const handler = this.handlers.get(eventType);
      if (!handler)
        throw new TypeError(
          `Invalid event type: ${String(eventType)} does not have any handler`,
        );

      const successResponse: WorkerResponse<M, keyof M> = {
        eventType,
        eventSeq,
        result: {
          success: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          response: await handler(...args),
        },
      };

      self.postMessage(successResponse);
    } catch (err) {
      const failResponse: WorkerResponse<M, keyof M> = {
        eventType,
        eventSeq,
        result: {
          success: false,
          reason: err,
        },
      };

      self.postMessage(failResponse);
    }
  };

  on = <E extends keyof M>(eventType: E, handler: M[E]) => {
    this.handlers.set(eventType, handler);
  };
}
