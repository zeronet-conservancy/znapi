
export interface ZNAPI {
  connect(): void;
  getServerInfo(): Promise<ServerInfo>;
  requestPermission(permission: string): Promise<void>;
  // TODO: types
  getSignerList(): Promise<any>;
  getSiteList(): Promise<any>;
  getSizeLimitRules(): Promise<any>;
  getSiteDetails(address: string): Promise<any>;
  addPrivateSizeLimitRule(address: string, rule: string, value: number, priority: number): Promise<void>;
  removePrivateSizeLimitRule(rule_id: number): Promise<void>;
};

export abstract class ZNAPIGeneric implements ZNAPI {
  abstract connect(): void;
  abstract send(message: any, cb: any): void;

  sendWithResp(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.send(message, (resp: any) => {
        resolve(resp);
      });
    });
  }

  getServerInfo(): Promise<any> {
    return this.sendWithResp({
      cmd: 'serverInfo',
      params: {},
    });
  }

  // TODO: type
  getSignerList(): Promise<any> {
    return this.sendWithResp({
      cmd: 'signerList',
    });
  }

  getSiteList(): Promise<any> {
    return this.sendWithResp({
      cmd: 'siteList',
    });
  }

  getSiteDetails(address: string): Promise<any> {
    return this.sendWithResp({
      cmd: 'siteDetails',
      params: {
        address,
      },
    });
  }

  getSizeLimitRules(): Promise<any> {
    return this.sendWithResp({
      cmd: 'getSizeLimitRules',
    });
  }

  requestPermission(permission: string): Promise<void> {
    return this.sendWithResp({
      cmd: 'wrapperPermissionAdd',
      params: permission,
    });
  }

  addPrivateSizeLimitRule(address: string, rule: string, value: number, priority: number): Promise<void> {
    return this.sendWithResp({
      cmd: 'addPrivateSizeLimitRule',
      params: {
        address,
        rule,
        value,
        priority,
      },
    }).then((r) => { return; });
  }

  removePrivateSizeLimitRule(rule_id: number): Promise<void> {
    return this.sendWithResp({
      cmd: 'removePrivateSizeLimitRule',
      params: {
        rule_id,
      },
    }).then((r) => { return; });
  }
};

export interface Config {
  useWS?: boolean;
  wsUrl?: string;
};

export type ServerInfo = {
};
