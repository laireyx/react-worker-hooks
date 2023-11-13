# React Webworker Hooks

Use Web Worker in React

# Usage

Write an event map(common/event.ts):

```typescript
import { EventMap } from 'react-worker-hooks';

export class WorkerEvents extends EventMap {
  ping(msg: string): string;
}
```

Write a handler(worker/worker.ts):

```typescript
import { WorkerBridge } from 'react-worker-hooks/worker';
import { WorkerEvents } from '../common/event.ts';

const bridge = new WorkerBridge<WorkerEvents>();

bridge.on('ping', (msg: string) => {
  return 'pong ' + msg;
});
```

Start a worker instance(hooks/usePingWorker.ts):

```typescript
import { startWorker } from 'react-worker-hooks/browser';

export const usePingWorker = startWorker(
  new URL('../worker/worker.ts', import.meta.url),
);
```

Use in React Component(Component.tsx):

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
