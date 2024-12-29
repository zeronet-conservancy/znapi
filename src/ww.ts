import { Config, ServerInfo, ZNAPI } from './common';

export class WWAPI implements ZNAPI {
  private waitingCb: {[key: number]: any}
  private wrapperNonce: string
  private nextMessageId: number
  private target: any

  constructor(config: Config) {
    this.waitingCb = {};
    this.wrapperNonce = document.location.href.replace(/.*wrapper_nonce=([A-Za-z0-9]+).*/, "$1");
    this.nextMessageId = 1;
  }

  public connect(): void {
    this.target = window.parent;
    window.addEventListener('message', e => this.onMessage(e), false);
    this.cmd('innerReady');
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
      }
      else {
        console.log("Websocket callback not found:", message);
      }
    } else if (cmd === 'wrapperReady') {
      this.cmd('innerReady');
    } else if (cmd === 'ping') {
      console.log('ping');
      // this.response(message.id, 'pong');
    } else if (cmd === 'wrapperOpenedWebsocket') {
      // this.onOpenWebsocket()
    } else if (cmd === 'wrapperClosedWebsocket') {
      // this.onCloseWebsocket()
    } else {
      // this.onRequest(cmd, message)
    }
  }

  getServerInfo(): Promise<ServerInfo> {
    return new Promise((resolve, reject) => {
      this.send({
        cmd: 'serverInfo',
        params: {},
      }, (info: any) => {
        resolve(info);
      });
    });
  }

  getSignerList(): Promise<any> {
    return new Promise((resolve, reject) => reject(undefined));
  }

  getSiteList(): Promise<any> {
    return new Promise((resolve, reject) => reject(undefined));
  }

  requestPermission(permission: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.send({
        cmd: 'wrapperPermissionAdd',
        params: permission,
      }, (res: any) => {
        resolve();
      });
    });
  }

  getSizeLimitRules(): Promise<any> {
    return new Promise((resolve, reject) => reject(undefined));
  }

  addPrivateSizeLimitRule(address: string, rule: string, value: number, priority: number): Promise<void> {
    return new Promise((resolve, reject) => reject(undefined));
  }
}
