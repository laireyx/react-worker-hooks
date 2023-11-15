import { WrapTransferable } from './wrapTransferable';
import { BareMap, EventMap, WorkerRequest, WorkerResponse } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callable = (...args: any) => any;
type CallableTrick<T extends Callable> = (
  ...args: Parameters<T>
) => ReturnType<T>;

type TransferHandler<M extends BareMap, E extends keyof M> = (
  ...args: Parameters<M[E]>
) => WrapTransferable<ReturnType<M[E]>>;

export class WorkerBridge<M extends BareMap = EventMap> {
  private handlers: Map<keyof M, M[keyof M] | TransferHandler<M, keyof M>> =
    new Map();

  constructor() {
    self.addEventListener(
      'message',
      (ev: MessageEvent<WorkerRequest<M, keyof M>>) =>
        void this.handleRequest(ev),
    );
  }

  private handleRequest = async <E extends keyof M>(
    ev: MessageEvent<WorkerRequest<M, E>>,
  ) => {
    const { eventType, eventSeq, args } = ev.data;

    try {
      const handler: CallableTrick<M[E]> | TransferHandler<M, E> | undefined =
        this.handlers.get(eventType);
      if (!handler) return;

      // eslint-disable-next-line @typescript-eslint/await-thenable
      const handlerResult = await handler(...args);

      let response: M[E];
      let transfer: Transferable[];

      if (handlerResult instanceof WrapTransferable) {
        ({ response, transfer } = handlerResult);
      } else {
        response = handlerResult;
        transfer = [];
      }

      const successResponse: WorkerResponse<M, E> = {
        eventType,
        eventSeq,
        result: {
          success: true,

          response,
        },
      };

      self.postMessage(successResponse, { transfer });
    } catch (err) {
      const failResponse: WorkerResponse<M, E> = {
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

  onTransfer = <E extends keyof M>(
    eventType: E,
    handler: TransferHandler<M, E>,
  ) => {
    this.handlers.set(eventType, handler);
  };
}
