
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'react-router-redux';

import { renderRoutes } from 'react-router-config';
import { trigger } from 'redial';

import { ReduxAsyncConnect, Provider } from '../shared';

import asyncMatchRoutes from '../server/utils/asyncMatchRoutes';

import { AppContainer as HotEnabler } from 'react-hot-loader';
import Loadable from 'react-loadable';

import routes from '../shared/routes';
import isOnline from '../server/utils/isOnline';

import createBrowserHistory from 'history/createBrowserHistory';
import createStore from './redux/create';

import { socket, createApp } from '../server/app';
import apiClient from '../server/helpers/apiClient';

import { getStoredState } from 'redux-persist';
import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js'; // Client-Side Cookie Manipulation 'cookies-js'

const dest = document.getElementById('content');

// =====================================================================
// Bootstrap Cookie from preloaded state in window object
// =====================================================================

const persistConfig = {
  key: 'root',
  storage: new CookieStorage(Cookies), // window object cookies passed to 
  stateReconciler(inboundState, originalState) {
    // Ignore state from cookies, only use preloadedState from window object
    return originalState;
  },
  whitelist: ['auth', 'info',] // accepting from
};

// =====================================================================
// configure client for API communication ( socket / authentication )
// =====================================================================

const app = createApp();
const client = apiClient();

const providers = {
  app,
  client
};

// =====================================================================
// client is configured with socket object now initialize that socket
// =====================================================================

function initSocket() {
  socket.on('news', data => {
    console.log(data);
    socket.emit('my other event', { my: 'data from client' });
  });
  socket.on('msg', data => {
    console.log(data);
  });

  return socket;
}

initSocket();

console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS <<<<<<<<<<<<<<<<<<<<<<<<<<<');
console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > __DEVTOOLS__ !!!!!: ', __DEVTOOLS__);
console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > persistConfig !!!!!: ', persistConfig);
console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > app !!!!!: ', app);
console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > client !!!!!: ', client);

// =====================================================================
// 
// =====================================================================

(async () => {

  const preloadedState = await getStoredState(persistConfig);
  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > preloadedState: ', preloadedState);

  const online = window.__data ? true : await isOnline();

  if (online) {
    socket.open();
    await app.authenticate().catch(() => null);
  }

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > online: ', online);

  const history = createBrowserHistory();

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > history: ', history);

  const store = createStore({
    history,
    data: {
      ...preloadedState,
      ...window.__data,
      online
    },
    helpers: providers,
    persistConfig
  });

  console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > store: ', store);

  const hydrate = async _routes => {

    const { components, match, params } = await asyncMatchRoutes(_routes, history.location.pathname);

    const triggerLocals = {
      ...providers,
      store,
      match,
      params,
      history,
      location: history.location
    };

    await trigger('fetch', components, triggerLocals);
    await trigger('defer', components, triggerLocals);

    ReactDOM.hydrate(
      <HotEnabler>
        <Provider store={store} {...providers}>
          <ConnectedRouter history={history}>
            <ReduxAsyncConnect routes={_routes} store={store} helpers={providers}>
              {renderRoutes(_routes)}
            </ReduxAsyncConnect>
          </ConnectedRouter>
        </Provider>
      </HotEnabler>,
      dest
    );
  };

  await Loadable.preloadReady();
  await hydrate(routes);

  // if (module.hot) {
  //   console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > MODULE.HOT! <<<<<<<<<<<<<<<<<');
  //   module.hot.accept('./routes', () => {
  //     hydrate(require('./routes'));
  //   });
  // } else {
  //   console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > NO MODULE.HOT! <<<<<<<<<<<<<<');
  // }

  // if (process.env.NODE_ENV !== 'production') {
  //   window.React = React;
  //   console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > process.env.NODE_ENV === DEV!!!');

  //   if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-reactroot']) {
  //     console.error('Server-side React render was discarded.' +
  //       'Make sure that your initial render does not contain any client-side code.');
  //   }
  // }

  // if (__DEVTOOLS__ && !window.devToolsExtension) {
  //   console.log('>>>>>>>>>>>>>>>>>>> CLIENT.JS > __DEVTOOLS__ && NO window.devToolsExtension');
  //   const devToolsDest = document.createElement('div');
  //   window.document.body.insertBefore(devToolsDest, null);
  //   const DevTools = require('./containers/DevTools/DevTools');

  //   ReactDOM.hydrate(
  //     <Provider store={store} key="provider">
  //       <DevTools />
  //     </Provider>,
  //     devToolsDest
  //   );
  // }

  if (!__DEVELOPMENT__ && 'serviceWorker' in navigator) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>> CLIENT.JS > !__DEVELOPMENT__ && serviceWorker in navigator <<<<<<<<<<<<<');
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
      registration.onupdatefound = () => {
        // The updatefound event implies that reg.installing is set; see
        // https://w3c.github.io/ServiceWorker/#service-worker-registration-updatefound-event
        const installingWorker = registration.installing;

        installingWorker.onstatechange = () => {
          switch (installingWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and the fresh content will
                // have been added to the cache.
                // It's the perfect time to display a "New content is available; please refresh."
                // message in the page's interface.
                console.log('New or updated content is available.');
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a "Content is cached for offline use." message.
                console.log('Content is now available offline!');
              }
              break;
            case 'redundant':
              console.error('The installing service worker became redundant.');
              break;
            default:
          }
        };
      };
    } catch (error) {
      console.log('Error registering service worker: ', error);
    }

    await navigator.serviceWorker.ready;
    console.log('Service Worker Ready');
  }
})();
