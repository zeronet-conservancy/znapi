
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
  siteFavorite(address: string): Promise<any>;
  siteUnfavorite(address: string): Promise<any>;
  siteLimitsUnsubscribe(address: string): Promise<string>;
  siteLimitsSubscribe(address: string, priority: number): Promise<string>;
};

export abstract class ZNAPIGeneric implements ZNAPI {
  abstract connect(): void;
  abstract send(message: any, cb: any): void;

  sendWithResp(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.send(message, (resp: any) => {
        if (resp.error !== undefined) {
          reject(new Error(resp.error));
        } else {
          resolve(resp);
        }
      });
    });
  }

  ping(): Promise<string> {
    return this.sendWithResp({
      cmd: 'ping',
      params: {},
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

  siteFavorite(address: string): Promise<any> {
    return this.sendWithResp({
      cmd: 'siteFavorite',
      params: {
        address,
      },
    });
  }

  siteUnfavorite(address: string): Promise<any> {
    return this.sendWithResp({
      cmd: 'siteUnfavorite',
      params: {
        address,
      },
    });
  }

  siteLimitsUnsubscribe(address: string): Promise<string> {
    return this.sendWithResp({
      cmd: 'siteLimitsUnsubscribe',
      params: {
        address,
      },
    });
  }

  siteLimitsSubscribe(address: string, priority: number): Promise<string> {
    return this.sendWithResp({
      cmd: 'siteLimitsSubscribe',
      params: {
        address,
        priority,
      },
    });
  }

  siteDiagnose(address: string): Promise<any> {
    return this.sendWithResp({
      cmd: 'siteDiagnose',
      params: {
        address,
      },
    });
  }

  siteFixUserPermissions(address: string, content_path: string, user_addresses: string[]) {
    return this.sendWithResp({
      cmd: 'siteFixUserPermissions',
      params: {
        address,
        content_path,
        user_addresses,
      },
    });
  }

  remoteConnectionList() {
    return this.sendWithResp({
      cmd: 'remoteConnectionList',
      params: {},
    });
  }

  connectionSiteList(conn_id: number) {
    return this.sendWithResp({
      cmd: 'connectionSiteList',
      params: {
        conn_id,
      },
    });
  }
};

export interface Config {
  useWS?: boolean;
  wsUrl?: string;
};

export type ServerInfo = {
};
