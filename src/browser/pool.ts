import { WorkerInstance } from '.';
import { BareMap } from '../types';

export class WorkerPool<M extends BareMap> {
  private lastWorkerIndex = 0;
  private _terminated = false;

  constructor(
    private workers: WorkerInstance<M>[],
    private parent: WorkerPool<M> | null = null,
  ) {}

  private get terminated(): boolean {
    return this.parent?.terminated ?? this._terminated;
  }

  private assertOnline(msg: string) {
    if (this.terminated) {
      throw new Error(msg);
    }

    return this;
  }

  get size() {
    return this.workers.length;
  }

  assign = (count: number) => {
    if (count > this.workers.length) {
      throw new RangeError(
        `Cannot select ${count} workers: This pool has only ${this.workers.length} workers.`,
      );
    }

    this.assertOnline(
      `Cannot assign a new task: this pool is already terminated`,
    );

    const selectedPool = new WorkerPool(
      this.workers
        .concat(this.workers)
        .slice(this.lastWorkerIndex, this.lastWorkerIndex + count),
      this,
    );

    this.lastWorkerIndex = (this.lastWorkerIndex + count) % this.workers.length;

    return selectedPool;
  };

  task = <E extends keyof M>(eventType: E, ...args: Parameters<M[E]>) =>
    this.assertOnline(
      `Cannot start a new task: this pool is already terminated`,
    ).workers.map((worker) => worker.task(eventType, ...args));

  terminate = () => {
    if (this.parent) {
      throw new Error(
        `Cannot terminate this pool: only the root-level pool can be terminated`,
      );
    }

    this.assertOnline(
      `Cannot terminate this pool: this pool is already terminated`,
    );

    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this._terminated = true;
  };
}
