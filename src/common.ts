export interface ZNAPI {
  connect(): void;
  getServerInfo(): Promise<ServerInfo>;
};

export interface Config {
  useWS?: boolean;
  wsUrl?: string;
};

export type ServerInfo = {
};
