# React Webworker Hooks

Use Web Worker in React

# Usage

1. Write an event map(common/event.ts):

```typescript
export interface WorkerEvents {
  ping(msg: string): string;
}
```

2. Write a handler(worker/worker.ts):

```typescript
import { WorkerBridge } from 'react-worker-hooks/worker';
import { WorkerEvents } from '../common/event.ts';

const bridge = new WorkerBridge<WorkerEvents>();

bridge.on('ping', (msg: string) => {
  return 'pong ' + msg;
});
```

3. Start a worker instance(hooks/usePingWorker.ts):

```typescript
import { startWorker } from 'react-worker-hooks/browser';

export const usePingWorker = startWorker(
  new URL('../worker/worker.ts', import.meta.url),
);
```

4. Use in React Component(Component.tsx):

```typescript
import { usePingWorker } from './hooks/usePingWorker.ts';

function Component() {
  const bridge = usePingWorker();

  useEffect(() => {
    bridge
      .task('ping', 'hi')
      .then((resp) => console.log(resp))
      .catch((err) => console.error(err));
  }, [bridge]);
}
```

# API

## Browser

These methods are available via `react-worker-hooks/browser`

### `startWorker<EventMap>(scriptURL: string|URL, options: WorkerOptions): () => WorkerInstance`

Start a single worker instance, and return a getter function of the worker instance.

> Note that parameters `scriptURL` and `options` are directly passed to [worker constructor](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)(`new Worker()`).

### `startWorkerPool<EventMap>(poolSize: number, scriptURL: string|URL, options: WorkerOptions): () => WorkerPool`

Start a worker pool, and return a getter function of the worker pool.

> Note that parameters `scriptURL` and `options` are directly passed to [worker constructor](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)(`new Worker()`).

## WorkerInstance(Browser)

### `WorkerInstance.taskWithTransferable<E extends keyof EventMap>(eventType: E, transfer: Transferable[], ...args: Parameters<EventMap[E]>): Promise<Awaited<ReturnType<M[E]>>>`

Start a task with the given `eventType`. `args` are passed to the worker context. Use `transfer` to pass [transferable object](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects).

### `WorkerInstance.task<E extends keyof EventMap>(eventType: E, ...args: Parameters<EventMap[E]>): Promise<Awaited<ReturnType<M[E]>>>`

Start a task with the given `eventType`. `args` are passed to the worker context.

> Note that this method is equivalent to call `WorkerInstance.taskWithTransferable()` with `transfer=[]`.

### `WorkerInstance.terminate(): void`

Terminate this worker instance. Terminated instances cannot be reused anymore.

## WorkerPool(Browser)

### `WorkerPool.size: number`

Get the number of worker instances in this worker pool.

### `WorkerPool.assign(count: number): WorkerPool`

Assign `count` workers from this worker pool, and return the sub-pool.

### `WorkerInstance.task<E extends keyof EventMap>(eventType: E, ...args: Parameters<EventMap[E]>): Promise<Awaited<ReturnType<M[E]>>>`

Start a task with the given `eventType`. `args` are passed to the worker context.

> Note that `WorkerPool.taskWithTransferable()` makes no sense because the ownership can only be transferred once.

### `WorkerPool.terminate(): void`

Terminate this worker pool. Terminated pools cannot be reused anymore.
**Only the root-level pool can be terminated.** If the worker pool is terminated, every sub-pool created by `WorkerPool.assign()` is also terminated.

## WorkerBridge(Worker)

### `new WorkerBridge<EventMap>()`

Initialize worker bridge.

Multiple worker bridge instances in a single worker context are allowed. In that case, each worker bridge instance receives individually, which means if those worker bridge instances have duplicated listeners for a single event type, every listener would be called if the event is fired. However, only the first-arrived result will be passed back to the browser.

### `WorkerBridge.on<E extends keyof EventMap>(eventType: E, handler: EventMap[E]): void`

Register a handler for `eventType`. The return value of the handler will be passed back to the `WorkerInstance.task()` or `WorkerInstance.taskWithTransferable()`.
As mentioned above, If multiple handlers are registered on a single event, all of those listeners will be called and the return values are discarded except the first arrived one.
