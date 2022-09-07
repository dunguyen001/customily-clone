export type Callback = (...args: any) => void;

interface IEvent {
    [x:string]: any[] | Callback[];
}

interface IDispatchPayload {
    [x:string]: any
}


export class Emitter {
  events: IEvent;
  constructor() {
    this.events = {};
  }

  getClientEvent(event: string) {
    return `@${event}`;
  }

  getEvent(event: string) {
    return this.events[event];
  }

  dispatch(event: string, payload: IDispatchPayload) {
    if(!this.getEvent(event)) return;
    this.events[event].forEach(callback => callback(payload))
  }

  subscribe(event: string, callback: Callback) {
    if (!this.getEvent(event)) this.events[event] = [];
    this.events[event].push(callback)
  }

  unsubscribe(event: string) {
    if (!this.getEvent(event)) return;
    delete this.events[event];
  }
}