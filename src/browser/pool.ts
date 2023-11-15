import { BrowserBridge } from '.';
import { BareMap } from '../types';

export class BridgePool<M extends BareMap> {
  private lastWorkerIndex = 0;

  constructor(private workers: BrowserBridge<M>[]) {}

  get size() {
    return this.workers.length;
  }

  assign = (count: number) => {
    if (count > this.workers.length) {
      throw new RangeError(
        `Cannot select ${count} workers: This pool has only ${this.workers.length} workers.`,
      );
    }

    const selectedPool = new BridgePool(
      this.workers
        .concat(this.workers)
        .slice(this.lastWorkerIndex, this.lastWorkerIndex + count),
    );

    this.lastWorkerIndex = (this.lastWorkerIndex + count) % this.workers.length;

    return selectedPool;
  };

  taskWithTransferable = <E extends keyof M>(
    eventType: E,
    transfer: Transferable[],
    ...args: Parameters<M[E]>
  ) =>
    this.workers.map((worker) =>
      worker.taskWithTransferable(eventType, transfer, ...args),
    );

  task = <E extends keyof M>(eventType: E, ...args: Parameters<M[E]>) =>
    this.workers.map((worker) => worker.task(eventType, ...args));
}
