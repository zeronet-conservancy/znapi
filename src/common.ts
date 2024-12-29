
export interface ZNAPI {
  connect(): void;
  getServerInfo(): Promise<ServerInfo>;
  requestPermission(permission: string): Promise<void>;
  // TODO: types
  getSignerList(): Promise<any>;
  getSiteList(): Promise<any>;
  getSizeLimitRules(): Promise<any>;
  addPrivateSizeLimitRule(address: string, rule: string, value: number, priority: number): Promise<void>;
};

export interface Config {
  useWS?: boolean;
  wsUrl?: string;
};

export type ServerInfo = {
};
