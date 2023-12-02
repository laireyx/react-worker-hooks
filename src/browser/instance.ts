import { BareMap, EventMap, WorkerRequest, WorkerResponse } from '../types';

type PendingTask<M extends EventMap, E extends keyof M> = {
  resolve: (value: Awaited<ReturnType<M[E]>>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
};

export class WorkerInstance<M extends BareMap = EventMap> {
  private terminated = false;

  private eventSeq = 0;
  private pendingTasks = new Map<number, PendingTask<M, keyof M>>();

  constructor(private worker: Worker) {
    this.worker.addEventListener(
      'message',
      (ev: MessageEvent<WorkerResponse<M, keyof M>>) => this.handleResponse(ev),
    );
  }

  get pendingTaskCount() {
    return this.pendingTasks.size;
  }

  taskWithTransferable = <E extends keyof M>(
    eventType: E,
    transfer: Transferable[],
    ...args: Parameters<M[E]>
  ): Promise<Awaited<ReturnType<M[E]>>> =>
    new Promise<Awaited<ReturnType<M[E]>>>((resolve, reject) => {
      if (this.terminated) {
        return reject(
          new Error(
            `Cannot start a new task: this worker is already terminated`,
          ),
        );
      }

      const eventSeq = this.eventSeq++;

      this.pendingTasks.set(eventSeq, {
        resolve,
        reject,
      });

      const request: WorkerRequest<M, E> = {
        eventType,
        eventSeq,
        args,
      };

      this.worker.postMessage(request, transfer);
    });

  task = <E extends keyof M>(
    eventType: E,
    ...args: Parameters<M[E]>
  ): Promise<Awaited<ReturnType<M[E]>>> =>
    this.taskWithTransferable(eventType, [], ...args);

  private handleResponse = (ev: MessageEvent<WorkerResponse<M, keyof M>>) => {
    const { data } = ev;

    const pendingTask = this.pendingTasks.get(data.eventSeq);
    if (!pendingTask) return;

    if (data.result.success) {
      pendingTask.resolve(data.result.response);
    } else {
      pendingTask.reject(data.result.reason);
    }

    this.pendingTasks.delete(data.eventSeq);
  };

  terminate() {
    if (this.terminated)
      throw new Error(
        `Cannot terminate this worker: this worker is already terminated`,
      );

    this.worker.terminate();
    this.terminated = true;
  }
}
