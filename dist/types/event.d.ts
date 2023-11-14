export interface BareMap {
    [eventType: string]: any;
}
export interface EventMap {
    [eventType: string]: (...args: any[]) => any;
}
