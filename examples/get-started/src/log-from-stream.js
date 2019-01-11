import {XVIZStreamLoader} from 'streetscape.gl';

export default new XVIZStreamLoader({
  logGuid: 'mock',
  // bufferLength: 15,
  serverConfig: {
    defaultLogLength: 30,
    serverUrl: 'ws://localhost:8081'
  },
  worker: true,
  maxConcurrency: 4
});
