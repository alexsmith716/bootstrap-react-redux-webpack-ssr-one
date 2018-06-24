import fs from 'fs';
import express from 'express';
import helmet from 'helmet';
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
// import locale from 'locale';
import dotenv from 'dotenv';
import apiClient from './helpers/apiClient';
import serverConfig from './config';
import headers from './utils/headers';
import delay from 'express-delay';
// import mongooseConnect from './mongo/mongooseConnect';
import apiRouter from '../api/apiRouter';
import mongoose from 'mongoose';

// #########################################################################

import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';

import createMemoryHistory from 'history/createMemoryHistory';

import createStore from '../client/redux/create';
// import createStore from 'redux/create';

import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
// import { trigger } from 'redial';

import Html from './helpers/Html';
import routes from '../client/routes';
import { parse as parseUrl } from 'url';

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

//app.use(/\/api/, mongooseConnect);
mongoose.Promise = global.Promise;
mongoose.connect(dbURL, mongooseOptions, err => {
  if (err) {
    console.error('####### > Please make sure Mongodb is installed and running!');
  } else {
    console.error('####### > Mongodb is installed and running!');
  }
});

// #########################################################################

// import testingNodeLoadProcess3 from './testingNodeLoad/testingNodeLoadProcess3';
// import testingNodeLoadProcess4 from './testingNodeLoad/testingNodeLoadProcess4';
// import testingNodeLoadProcess2 from './testingNodeLoad/testingNodeLoadProcess2';

// #########################################################################

dotenv.config();

// #########################################################################

process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>> server > Unhandled Rejection at:', promise, 'reason:', error);
});

// #########################################################################

export default function (parameters) {

  const app = new express();
  const server = http.createServer(app);

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

  // const port = normalizePort(process.env.PORT || serverConfig.port);
  const port = 3000;
  app.set('port', port);

  // app.use((req, res, next) => {
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.ip +++++++++++++: ', req.ip);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.method +++++++++: ', req.method);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.url ++++++++++++: ', req.url);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.headers ++++++++: ', req.headers);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.session ++++++++: ', req.session);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.params +++++++++: ', req.params);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > REQ.originalUrl ++++: ', req.originalUrl);
  //   // console.log('>>>>>>>>>>>>>>>>> SERVER > process.env.SESSION_SECRET ++++: ', process.env.SESSION_SECRET);
  //   console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN < $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  //   return next();
  // });

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

  //app.use(express.json());
  //app.use(express.urlencoded());

  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(bodyParser.json({ limit: '20mb' }));
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
  
  // saveUninitialized: false, // don't create session until something stored
  // resave: false, // don't save session if unmodified

  // app.use(/\/api/, session({
  app.use(session({
    // secret: process.env.SESSION_SECRET,
    secret: 'keyboardcat123abz',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: serverConfig.mongoURL,
      touchAfter: 0.5 * 3600
    })
  }));

  app.use((req, res, next) => {
    // console.log('>>>>>>>>>>>>>>>> SERVER > :');
    return next();
  });

  // #########################################################################

  app.use('/api', apiRouter);
  
  // #########################################################################

  // app.use((req, res) => {
  //   res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');
  // });

  // #########################################################################
  // #########################################################################

  app.use(async (req, res) => {

    const chunks = parameters.chunks();
    // const chunks = {...parameters.chunks()};

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! START !! $$$$$$$$$$$$$$$$$$$$$$');

    const url = req.originalUrl || req.url;
    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > url: ', url);

    const location = parseUrl(url);
    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > location: ', location);

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! > apiClient !!');
    const client = apiClient(req);
    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > apiClient !!');

    const history = createMemoryHistory({ initialEntries: [url] });
    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > createMemoryHistory !!');

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > history: '. history);

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! > createStore !!');
    const store = createStore(history, client);
    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > createStore !!');

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponentDone !! > store: ', store);

    console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > SetUpComponent !! END !! $$$$$$$$$$$$$$$$$$$$$$$$$');

    function hydrate() {
      res.write('<!doctype html>');
      ReactDOM.renderToNodeStream(<Html assets={chunks} store={store} />).pipe(res);
    }

    if (__DISABLE_SSR__) {
      return hydrate();
    }

    try {
      console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$ loadOnServer START $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

      await loadOnServer({store, location, routes, helpers: { client }});

      console.log('>>>>>>>>>>>>>>>>> SERVER > $$$$$$$$$$$$$$$$$$ loadOnServer END $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');

      const context = {};
      const modules = [];

      // Finding out which dynamic modules were rendered
      // Find out which modules were actually rendered when a request comes in
      // Loadable.Capture: component to collect all modules that were rendered
      const component = (
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
          <Provider store={store} key="provider">
            <StaticRouter location={url} context={context}>
              <ReduxAsyncConnect routes={routes} helpers={{ client }} />
            </StaticRouter>
          </Provider>
        </Loadable.Capture>
      );

      const content = ReactDOM.renderToString(component);

      if (context.url) {
        return res.redirect(302, context.url);
      }

      const bundles = getBundles(getChunks(), modules);

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > (webpack-compiled chunks) > CHUNKS: ', chunks);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > (which modules were rendered) > MODULES : ', modules);
      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > (convert rendered modules to bundles) > BUNDLES: ', bundles);
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > content: ', content);
      // console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > store: ', store);

      const html = <Html assets={chunks} bundles={bundles} content={content} store={store} />;

      console.log('>>>>>>>>>>>>>>>> SERVER > APP.USE > ASYNC !! > DID IT !! res.status(200).send <<<<<<<<<<<<<<<<<<');

      //res.status(200).send('SERVER > Response Ended For Testing!!!!!!! Status 200!!!!!!!!!');
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
      console.log('>>>>>>>>>>>>>>>> server.js > Express server Upgrade <<<<<<<<<<<<<<<<');
      // proxy.ws(req, socket, head);
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
