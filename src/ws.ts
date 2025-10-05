import { Config, ZNAPIGeneric } from './common.js';

type WaitingCb = {
  // TODO: get rid of any
  [key: number]: (...args: any[]) => any;
};

export class WSAPI extends ZNAPIGeneric {
  private waitingCb: WaitingCb = {};
  private messageQueue: any[] = [];
  private nextMsgId: number = 0;
  private _isConnected: boolean = false;
  private isReconnecting: boolean = false;
  private onConnectedCb: (() => void)[] = [];
  private onDisconnectedCb: (() => void)[] = [];
  private ws?: WebSocket;
  private wsUrl: string;

  constructor(config: Config) {
    super();
    this.wsUrl = config.wsUrl || 'ws://127.0.0.1:43110/ZeroNet-Internal/Websocket';
  }

  connect(): void {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.addEventListener('message', (...args) => this.onMessage(...args));
    this.ws.addEventListener('open', (...args) => this.onOpenWebsocket(...args));
    this.ws.addEventListener('error', (...args) => this.onError(...args));
    this.ws.addEventListener('close', (...args) => this.onCloseWebsocket(...args));
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  triggerOnConnected(cb: () => void): void {
    this.onConnectedCb.push(cb);
  }

  triggerOnDisconnected(cb: () => void): void {
    this.onDisconnectedCb.push(cb);
  }

  private reconnect(): void {
    if (this.isReconnecting)
      return;
    setTimeout(() => { this.isReconnecting = false; this.connect(); }, 10000);
  }

  private onMessage(e: any): void {
    const message = JSON.parse(e.data);
    const cmd = message.cmd;
    if (cmd === "response") {
      if (this.waitingCb[message.to] != null) {
        this.waitingCb[message.to](message.result);
      } else {
        console.log("Websocket callback not found:", message);
      }
    } else if (cmd === "ping") {
      /* return response(message.id, "pong"); */
    } else {
      // err
      this.processCallback(cmd, message);
    }
  }

  private onError(e: any): void {
    console.log(e);
    // TODO
    this._isConnected = false;
    this.reconnect();
  }

  private onOpenWebsocket(e: Event): void {
    this._isConnected = true;
    console.log('WS open!');
    const msgs = [...this.messageQueue];
    for (let msg of msgs) {
      this.ws!.send(JSON.stringify(msg));
    }
    this.messageQueue = [];
    this.send({
      cmd: 'serverInfo',
    }, (info: any) => {
      console.log('####\n', info);
    });
    for (let cb of this.onConnectedCb) {
      cb();
    }
  }

  private onCloseWebsocket(e: Event): void {
    console.log('Connection closed');
    console.log(e);
    this._isConnected = false;
    for (let cb of this.onDisconnectedCb) {
      cb();
    }
    this.reconnect();
  }

  send(message: any, cb: any): void {
    message.id = this.nextMsgId;
    ++this.nextMsgId;

    if (this._isConnected) {
      this.ws!.send(JSON.stringify(message));
    } else {
      console.log("Not connected, adding message to queue", message);
      this.messageQueue.push(message);
    }
    if (cb) {
      this.waitingCb[message.id] = cb;
    }
  }

  requestPermission(permission: string): Promise<void> {
    return new Promise((resolve, reject) => {
      reject("Cannot request permissions in dev mode");
    });
  }
}
