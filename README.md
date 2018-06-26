# bootstrap-react-redux-webpack-ssr-one


## Overview:

App is a continuation of repo 'bootstrap-redux-react-loadable-webpack-dllplugin-three'.


### PORTS:

  Server API (api/api.js):
    Port: 3030

  Server Static && init delegate `react-router` rendering (server.js):
    Port: 3000

  Server Dev (webpack-serve):
    Port: 3001

### FeathersJS:

  Open source REST and realtime API layer for modern applications.

  Feathers is a real-time, micro-service web framework for NodeJS that gives you control over your data via RESTful resources, sockets and flexible plug-ins.

  Built using promises and ES6 features, Feathers is a tiny, fully compatible wrapper over Express and Socket.io.

  Feathers can be used in the browser, React Native and server side with Node.js. Using the Feathers client you can quickly add authentication, share code between your server and client, and easily make your apps real-time.

  Integrates with any client side framework.

#### ++++++++++++++++++++++++++++++++++++++++

import React from 'react';

import { ConnectedRouter } from 'react-router-redux';
import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';

import routes from 'routes';

import Loadable from 'react-loadable';

import apiClient from 'helpers/apiClient';

import createStore from 'redux/create';

import { getStoredState } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';

import asyncMatchRoutes from 'utils/asyncMatchRoutes';
import { ReduxAsyncConnect, Provider } from 'components';

import ReactDOM from 'react-dom/server';
import { socket, createApp } from 'app';

import createMemoryHistory from 'history/createMemoryHistory';

import createBrowserHistory from 'history/createBrowserHistory';

#### ++++++++++++++++++++++++++++++++++++++++

<Provider store={store} {...providers}>
  <ConnectedRouter history={history}>
    <StaticRouter location={req.originalUrl} context={context}>
      <ReduxAsyncConnect routes={routes} store={store} helpers={providers}>
        {renderRoutes(routes)}
      </ReduxAsyncConnect>
    </StaticRouter>
  </ConnectedRouter>
</Provider>

