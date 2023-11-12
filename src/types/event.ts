export abstract class EventMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [eventType: string]: (...args: any[]) => any;
}
