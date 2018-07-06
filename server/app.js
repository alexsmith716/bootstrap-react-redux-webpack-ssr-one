import feathers from '@feathersjs/feathers';
import rest from '@feathersjs/rest-client';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import axios from 'axios';
import config from '../config/config';

const storage = __SERVER__ ? null : require('localforage');

const host = clientUrl => (__SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : clientUrl);

// ===================================================================================

// localforage: API to access localStorage

// Returning '@feathersjs/feathers' instance

// SERVER
//    Connection:       'REST'
//    Transport method: 'axios/ajax'
//    Authentication:   'null'

// CLIENT:
//    Connection:       'real-time'
//    Transport method: 'socket'
//    Authentication:   'passing localforage'

// ===================================================================================

const configureApp = (transport) => {
  const app = feathers();
  app.configure(transport);
  app.configure(authentication({ storage }));
  return app;
}

// ===================================================================================

// return instance of 'socket' if client '{ socket, createApp }'
export const socket = io('', { path: host('/ws'), autoConnect: false });

// ===================================================================================

export function createApp(req) {

  if (req === 'rest') {
    return configureApp( rest(host('/api')).axios(axios) );
  }

  // -------- SERVER ----------------------------------------------
  if (__SERVER__ && req) {

    const app = configureApp( rest(host('/api')).axios(axios.create({
      headers: {
        Cookie: req.get('cookie'),
        authorization: req.header('authorization') || ''
      }
    })) );

    const accessToken = req.header('authorization') || (req.cookies && req.cookies['feathers-jwt']);
    app.set('accessToken', accessToken);

    return app;
  }

  // -------- CLIENT ----------------------------------------------
  return configureApp( socketio(socket) );
}
