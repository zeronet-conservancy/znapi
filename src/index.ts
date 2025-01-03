import { ZNAPI, Config } from './common.js';
import { WSAPI } from './ws.js';
import { WWAPI } from './ww.js';

export const connect = (config: Config): ZNAPI => {
  let cl;
  if (config.useWS) {
    cl = WSAPI;
  } else {
    cl = WWAPI;
  }
  const api = new cl(config);
  api.connect();
  return api;
};
