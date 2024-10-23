import { ZNAPI, Config } from './common';
import { WSAPI } from './ws';
import { WWAPI } from './ww';

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
