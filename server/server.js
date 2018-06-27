import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
import serverConfig from '../config/config';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import jwt from 'express-jwt';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import http from 'http';
import favicon from 'serve-favicon';
import headers from './utils/headers';
import delay from 'express-delay';
import apiRouter from '../api/apiRouter';
import mongoose from 'mongoose';
import httpProxy from 'http-proxy';
import Cookies from 'cookies';

import { getStoredState } from 'redux-persist';
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage';

// #########################################################################

import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';

import asyncMatchRoutes from './utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from '../shared';

import createMemoryHistory from 'history/createMemoryHistory';

import createStore from '../client/redux/create';
// import createStore from 'redux/create';

import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { trigger } from 'redial';

import Html from './helpers/Html';
import routes from '../client/routes';
import { parse as parseUrl } from 'url';

import { createApp } from './app';
import apiClient from './helpers/apiClient';

import { getChunks, waitChunks } from './utils/chunks';

// #########################################################################

const loadableChunksPath = path.join(__dirname, '..', 'public', 'assets', 'loadable-chunks.json');
// /Users/../bootstrap-redux-react-loadable-webpack-dllplugin/build/public/assets/loadable-chunks.json
console.log('>>>>>>>>>>>>>>>>> SERVER > loadableChunksPath +++++++++: ', loadableChunksPath);

// #########################################################################

const MongoStore = require('connect-mongo')(session);
const sessionExpireDate = 6 * 60 * 60 * 1000; // 6 hours
let gracefulShutdown;
let dbURL = serverConfig.mongoURL;
if (process.env.NODE_ENV === 'production') {
  // dbURL = serverConfig.mongoLabURL;
};
const mongooseOptions = {
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000
};

// #########################################################################

mongoose.Promise = global.Promise;
mongoose.connect(dbURL, mongooseOptions, err => {
  if (err) {
    console.error('####### > Please make sure Mongodb is installed and running!');
  } else {
    console.error('####### > Mongodb is installed and running!');
  }
});

// #########################################################################

process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>> server > Unhandled Rejection at:', promise, 'reason:', error);
});

// #########################################################################

export default function (parameters) {

  const targetUrl = `http://${serverConfig.apiHost}:${serverConfig.apiPort}`;
  const app = new express();
  const server = http.createServer(app);

  const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true
  });

  const normalizePort = (val)  => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  };

  const port = normalizePort(serverConfig.port);
  app.set('port', port);

  app.use((req, res, next) => {
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.ip +++++++++++++: ', req.ip);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.method +++++++++: ', req.method);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++: ', req.url);
    console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.headers ++++++++: ', req.headers);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.session ++++++++: ', req.session);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.params +++++++++: ', req.params);
    // console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.originalUrl ++++: ', req.originalUrl);
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN < $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    return next();
  });

  app.use(morgan('dev'));
  app.use(helmet());
  app.use(helmet.xssFilter());
  app.use(cors());
  // app.use(headers);

  // #########################################################################

  if (process.env.NODE_ENV === 'development') {
    //app.use(delay(200, 300));
  }

  // #########################################################################

  // app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  // app.use(bodyParser.json({ limit: '20mb' }));
  app.use(cookieParser());
  app.use(compression());
  app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
  app.use(favicon(path.join(__dirname, '../public/static/favicon', 'favicon.ico')));
  app.use('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '../public/static/manifest/manifest.json')));

  // #########################################################################

  app.use('/service-worker.js', (req, res, next) => {
    console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ service-worker $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-store');
    return next();
  });

  app.use('/dlls/:dllName.js', (req, res, next) => {
    fs.access(
      path.join(__dirname, '..', 'build', 'public', 'assests', 'dlls', `${req.params.dllName}.js`),
      fs.constants.R_OK,
      err => (err ? res.send(`console.log('No dll file found (${req.originalUrl})')`) : next())
    );
  });

  // #########################################################################

  app.use((req, res, next) => {
    res.setHeader('X-Forwarded-For', req.ip);
    return next();
  });

  app.use('/api', (req, res) => {
    console.log('>>>>>>>>>>>>>>>> server.js > app.user(/API) <<<<<<<<<<<<<<<<');
    proxy.web(req, res, { target: targetUrl });
  });

  app.use('/ws', (req, res) => {
    console.log('>>>>>>>>>>>>>>>> server.js > app.user(/WS) <<<<<<<<<<<<<<<<');
    proxy.web(req, res, { target: `${targetUrl}/ws` });
  });

  // #########################################################################

  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
    }

    const json = {
      error: 'proxy_error',
      reason: error.message
    };
    res.end(JSON.stringify(json));
  });

  // #########################################################################

  // app.use((req, res) => {
  //   res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');
  // });


  // #########################################################################
  // generate HTML page && return contents with 'react-router'
  // #########################################################################

  app.use(async (req, res) => {

    const chunks = parameters.chunks();
    // const chunks = {...parameters.chunks()};

    // configure server for API communication (rest / axios/ajax)
    // passing session cookie (req)
    const providers = {
      app: createApp(req),
      client: apiClient(req)
    };

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > providers.app !!: ', providers.app);
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > providers.client !!: ', providers.client);
    

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! START !! $$$$$$$$$$$$$$$$$$$$$$');

    // manage session history (stack, navigate, confirm navigation, persist state between sessions)
    // initialEntries: initial URLs in the history stack
    const history = createMemoryHistory({ initialEntries: [req.originalUrl] });

    // redux persist cookie
    // Read-only mode: using getStoredState()
    // create cookie jar 'Cookies()'
    // pass 'cookie jar' to Redux Persist storage 'NodeCookiesWrapper()'
    const cookieJar = new NodeCookiesWrapper(new Cookies(req, res)); // node module for getting and setting HTTP cookies

    const persistConfig = {
      key: 'root',
      storage: new CookieStorage(cookieJar),
      stateReconciler(inboundState, originalState) {
        // Ignore state from cookies, only use preloadedState from window object
        return originalState
      },
      whitelist: ['auth', 'info',]
    };

    // stateReconciler: (inboundState, originalState) => originalState,

    let preloadedState;
  
    // read stored cookies: getStoredState()
    try {
      preloadedState = await getStoredState(persistConfig);
    } catch (e) {
      // getStoredState implementation fails when index storage item is not set.
      preloadedState = {};
    }

    const store = createStore({
      history,
      helpers: providers,
      data: preloadedState
    });

    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > url: ', url);
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > location: ', location);
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! > apiClient !!');
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > apiClient !!');
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > createMemoryHistory !!');
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > history: '. history);
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! > createStore !!');
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > createStore !!');
    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > store: ', store);
    // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! END !! $$$$$$$$$$$$$$$$$$$$$$$$$');

    function hydrate() {
      res.write('<!doctype html>');
      ReactDOM.renderToNodeStream(<Html assets={chunks} store={store} />).pipe(res);
    }

    if (__DISABLE_SSR__) {
      return hydrate();
    }

    try {

      console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$ loadOnServer START $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

      const { components, match, params } = await asyncMatchRoutes(routes, req.path);

      await trigger('fetch', components, {
        ...providers,
        store,
        match,
        params,
        history,
        location: history.location // current location
      });

      console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$ loadOnServer END $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');


      const context = {};
      const modules = [];

      // Finding out which dynamic modules were rendered
      // Find out which modules were actually rendered when a request comes in:
      // Loadable.Capture: component to collect all modules that were rendered

      const component = (
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <Provider store={store} {...providers}>
            <ConnectedRouter history={history}>
              <StaticRouter location={req.originalUrl} context={context}>
                <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
                  {renderRoutes(routes)}
                </ReduxAsyncConnect>
              </StaticRouter>
            </ConnectedRouter>
          </Provider>
        </Loadable.Capture>
      );

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > ===================================== 11111');
      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > ===================================== component: ', component);

      const content = ReactDOM.renderToString(component);

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > ===================================== 22222');

      if (context.url) {
        return res.redirect(302, context.url);
      }

      // const locationState = store.getState().router.location;

      // if (req.originalUrl !== locationState.pathname + locationState.search) {
      //   return res.redirect(301, locationState.pathname);
      // }

      const bundles = getBundles(getChunks(), modules);

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > (webpack-compiled chunks) > CHUNKS: ', chunks);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > (which modules were rendered) > MODULES : ', modules);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > (convert rendered modules to bundles) > BUNDLES: ', bundles);
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > content: ', content);
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > store: ', store);

      const html = <Html assets={chunks} bundles={bundles} content={content} store={store} />;

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > DID IT !! res.status(200).send <<<<<<<<<<<<<<<<<<');

      // res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');
      res.status(200).send(`<!doctype html>${ReactDOM.renderToString(html)}`);

    } catch (error) {

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > TRY > ERROR > error: ', error);

      res.status(500);

      hydrate();

    }

  });

  // #########################################################################

  (async () => {

    try {
      // preload all your loadable components
      // make sure all loadable components are loaded when before rendering them 
      // Loadable.preloadAll(): returns >>> promise that will resolve <<< when all loadable components are ready
      await Loadable.preloadAll();
      const wc = await waitChunks(loadableChunksPath);
      // console.log('>>>>>>>>>>>>>>>>> SERVER > Loadable.preloadAll() > waitChunks(): ', wc);
    } catch (error) {
      console.log('>>>>>>>>>>>>>>>>> SERVER > Loadable.preloadAll() > ERROR: ', error);
    }

    server.listen( app.get('port'), serverConfig.host, () => {
      console.log('>>>>>>>>>>>>>>>> server.js > Express server Connected: ', server.address());
    });

    server.on('error', (err, req, res) => {

      if (err.syscall !== 'listen') {
        console.log('>>>>>>>>>>>>>>>> server.js > Express server error: ', err);
      }

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      switch (err.code) {
        case 'EACCES':
          console.log('>>>>>>>>>>>>>>>> server.js > Express server error: ' + bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.log('>>>>>>>>>>>>>>>> server.js > Express server error: ' + bind + ' is already in use');
          process.exit(1);
          break;
        case 'ECONNRESET':
          console.log('>>>>>>>>>>>>>>>> server.js > Express proxy error +++++++++++++++++++++');
          process.exit(1);
          break;
        default:
          console.log('>>>>>>>>>>>>>>>> server.js > Express server error.code: ', err.code);
      }

      if (!res.headersSent) {
        console.log('>>>>>>>>>>>>>>>> server.js > Express error > !res.headersSent: ', res.headersSent);
        // res.writeHead(500, { 'content-type': 'application/json' });
      }
      // const json = {
      //   error: 'proxy_error',
      //   reason: error.message
      // };
      // res.end(JSON.stringify(json));
    });

    server.on('listening', () => {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      console.log('>>>>>>>>>>>>>>>> server.js > Express server Listening on: ', bind);
    });

    // https://nodejs.org/api/net.html#net_class_net_socket
    // https://nodejs.org/api/http.html#http_event_upgrade
    server.on('upgrade', (req, socket, head) => {
      console.log('>>>>>>>>>>>>>>>> server.js > server.on(UPGRADE) <<<<<<<<<<<<<<<<');
      proxy.ws(req, socket, head);
    });

  })()

};

// #########################################################################

mongoose.connection.on('connected', function() {
  console.log('####### > MONGOOSE CONNECTED: ' + dbURL);
});

mongoose.connection.on('error', function(err) {
  console.log('####### > Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('####### > Mongoose disconnected');
});

// Handle Mongoose/Node connections
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('####### > Mongoose disconnected through: ' + msg);
    callback();
  })
};

// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    console.log('####### > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  })
});

// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    console.log('####### > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  })
});

// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    console.log('####### > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  })
});
