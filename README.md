# React Webworker Hooks

Use Web Worker in React

# Usage

Write an event map(event.ts):

```typescript
import { EventMap } from 'react-worker-hooks';

export class WorkerEvents extends EventMap {
  ping(msg: string): string;
}
```

Write a handler(worker.ts):

```typescript
import { WorkerBridge } from 'react-worker-hooks/worker';
import { WorkerEvents } from './event.ts';

const bridge = new WorkerBridge<WorkerEvents>();

bridge.on('ping', (msg: string) => {
  return 'pong ' + msg;
});
```

Use in React Component(Component.tsx):

```typescript
import { useWorker } from 'react-worker-hooks/browser';

function Component() {
  const bridge = useWorker();

  useEffect(() => {
    bridge.task('ping', 'hi').then((resp) => console.log(resp));
  }, [bridge]);
}
```
