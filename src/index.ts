import { ServerInfo, Config } from './common';
import { WSAPI } from './ws';

interface ZNAPI {
  getServerInfo(): Promise<ServerInfo>;
};

export const connect = (config: Config): ZNAPI => {
  console.log('hiy');
  if (config.useWS) {
    const api = new WSAPI(config);
    console.log('wsapi reate');
    api.connect();
    console.log('wsapi onnec');
    return api;
  } else {
    // return new
    throw undefined;
  }
};
