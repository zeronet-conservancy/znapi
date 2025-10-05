import { Config, ServerInfo, ZNAPI, ZNAPIGeneric } from './common.js';

export class WWAPI extends ZNAPIGeneric {
  private waitingCb: {[key: number]: any};
  private wrapperNonce: string;
  private nextMessageId: number;
  private target: any;
  private _isConnected: boolean = false;
  private onConnectedCb: (() => void)[] = [];
  private onDisconnectedCb: (() => void)[] = [];

  constructor(config: Config) {
    super();
    this.waitingCb = {};
    this.wrapperNonce = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");
    this.nextMessageId = 1;
  }

  connect(): void {
    this.target = window.parent;
    window.addEventListener('message', e => this.onMessage(e), false);
    this.cmd('innerReady');
  }

  isConnected(): boolean {
    return this._isConnected;
  }

  // TODO: generalize
  triggerOnConnected(cb: () => void): void {
    this.onConnectedCb.push(cb);
  }

  triggerOnDisconnected(cb: () => void): void {
    this.onDisconnectedCb.push(cb);
  }

  cmd(cmd: string, params={}, cb=null) {
    this.send({
      cmd: cmd,
      params: params
    }, cb);
  }

  send(message: any, cb: any = null) {
    message.wrapper_nonce = this.wrapperNonce;
    message.id = this.nextMessageId;
    ++this.nextMessageId;
    this.target.postMessage(message, '*');
    if (cb) {
      this.waitingCb[message.id] = cb;
    }
  }

  private onMessage(e: any) {
    const message = e.data;
    const cmd = message.cmd;
    if (cmd === 'response') {
      if (this.waitingCb[message.to] !== undefined) {
        this.waitingCb[message.to](message.result);
        delete this.waitingCb[message.to];
      } else {
        console.log("Websocket callback not found:", message);
      }
    } else if (cmd === 'wrapperReady') {
      this.cmd('innerReady');
    } else if (cmd === 'ping') {
      console.log('ping');
      // this.response(message.id, 'pong');
    } else if (cmd === 'wrapperOpenedWebsocket') {
      this.onOpenWebsocket();
    } else if (cmd === 'wrapperClosedWebsocket') {
      this.onCloseWebsocket();
    } else {
      this.processCallback(cmd, message);
      // this.onRequest(cmd, message)
    }
  }

  // TODO: generalize
  private onOpenWebsocket(): void {
    this._isConnected = true;
    for (let cb of this.onConnectedCb) {
      cb();
    }
  }

  private onCloseWebsocket(): void {
    this._isConnected = false;
    for (let cb of this.onDisconnectedCb) {
      cb();
    }
  }
}
