# react-worker-hooks

Use [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) with(_or without_) [React](https://react.dev/).

# Usage

1. Write an event map

   > common/event.ts
   >
   > ```typescript
   > export interface WorkerEvents {
   >   ping(msg: string): string;
   > }
   > ```

2. Write a handler

   > worker/worker.ts
   >
   > ```typescript
   > import { WorkerBridge } from 'react-worker-hooks/worker';
   > import { WorkerEvents } from '../common/event.ts';
   >
   > const bridge = new WorkerBridge<WorkerEvents>();
   >
   > // You can get type hint here.
   > bridge.on('ping', (msg) => {
   >   return 'pong ' + msg;
   > });
   > ```

3. Start a worker instance

   > hooks/usePingWorker.ts
   >
   > ```typescript
   > import { startWorker } from 'react-worker-hooks/browser';
   > import { WorkerEvents } from '../common/event.ts';
   >
   > export const usePingWorker = startWorker<WorkerEvents>(
   >   new URL('../worker/worker.ts', import.meta.url),
   > );
   > ```

4. Use in React Component
   > Component.tsx
   >
   > ```typescript
   > import { usePingWorker } from './hooks/usePingWorker.ts';
   >
   > function Component() {
   >   const bridge = usePingWorker();
   >
   >   useEffect(() => {
   >     bridge
   >       // You can get type hint here.
   >       .task('ping', 'hi')
   >       .then((resp) => console.log(resp))
   >       .catch((err) => console.error(err));
   >   }, [bridge]);
   > }
   > ```

# API

## Global(Browser)

These methods are available via `react-worker-hooks/browser`

You can get type hints while writing browser code by passing an interface `EventMap`.

- `startWorker<EventMap>(scriptURL, options)`

  Start a single worker instance, and return a getter function of the worker instance.

  > Parameters `scriptURL` and `options` are directly passed to [worker constructor](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)(`new Worker()`).

- `startWorkerPool<EventMap>(poolSize, scriptURL, options)`

  Start a worker pool, and return a getter function of the worker pool.

  > Parameters `scriptURL` and `options` are directly passed to [worker constructor](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker)(`new Worker()`).

## WorkerInstance(Browser)

These methods are available via `react-worker-hooks/browser`

- `.taskWithTransferable(eventType, transfer, ...args)`

  Start a task with the given `eventType`. `args` are passed to the worker context. Use `transfer` to pass [transferable object](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) via [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage).

  Return a promise of the task result.

- `.task(eventType, ...args)`

  Start a task with the given `eventType`. `args` are passed to the worker context.

  > This method is equivalent to call `WorkerInstance.taskWithTransferable()` with `transfer=[]`.

- `.terminate()`

  Terminate this worker instance. Terminated instances cannot be reused anymore.

## WorkerPool(Browser)

These methods are available via `react-worker-hooks/browser`

- `.size`

  Get the number of worker instances in this worker pool.

- `.assign(count)`

  Assign `count` workers from this worker pool, and return the sub-pool.

- `.task(eventType, ...args)`

  Start a task with the given `eventType`. `args` are passed to the worker context.

  > Note that `WorkerPool.taskWithTransferable()` makes no sense because the ownership can only be transferred once.

- `.terminate()`

  Terminate this worker pool. Terminated pools cannot be reused anymore.
  **Only the root-level pool can be terminated.** If the worker pool is terminated, every sub-pool created by `WorkerPool.assign()` is also terminated.

## WorkerBridge(Worker)

These methods are available via `react-worker-hooks/worker`

You can get type hints while writing browser code by passing an interface `EventMap`.

- `new WorkerBridge<EventMap>()`

  Initialize worker bridge.
  Multiple worker bridge instances in a single worker context are allowed. In that case, each worker bridge instance receives individually, which means if those worker bridge instances have duplicated listeners for a single event type, every listener would be called if the event is fired.
  However, **only the first-arrived result will be passed back to the browser.**

- `.on(eventType, handler)`

  Register a handler for `eventType`. The return value of the handler will be passed back to the `WorkerInstance.task()` or `WorkerInstance.taskWithTransferable()`.
  As mentioned above, If multiple handlers are registered on a single event, all of those listeners will be called and the return values are discarded except the first arrived one.

- `.onTransfer(eventType, handler)`

  Register a handler for `eventType`. The return value of the handler will be passed back to the `WorkerInstance.task()` or `WorkerInstance.taskWithTransferable()`.
  The difference between `WorkerBridge.on()` and this method is the return type. This method expects handlers to return value wrapped with `WrapTransferable` before return. `WorkerBridge` will transfer objects instead of copying them.

## WrapTransferable(Worker)

These methods are available via `react-worker-hooks/worker`

- `new WrapTransferable<T>(response, transfer)`
  Wrap handler response and mark which object(s) are transferable.
