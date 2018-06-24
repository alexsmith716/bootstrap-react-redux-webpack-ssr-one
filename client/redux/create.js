import { createStore as _createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createPersistoid } from 'redux-persist';
import createMiddleware from './middleware/clientMiddleware';
import createReducers from './reducer';

export function inject(store, name, asyncReducer) {
  console.log('>>>>>>>>> CREATE.JS > INJECT 111111');
  if (store.asyncReducers[name]) return;
  console.log('>>>>>>>>> CREATE.JS > INJECT 222222');
  console.log('>>>>>>>>> CREATE.JS > INJECT store: ', store);
  console.log('>>>>>>>>> CREATE.JS > INJECT name: ', name);
  console.log('>>>>>>>>> CREATE.JS > INJECT asyncReducer: ', asyncReducer);
  store.asyncReducers[name] = asyncReducer;
  console.log('>>>>>>>>> CREATE.JS > INJECT store.asyncReducers: ', store.asyncReducers);
  store.replaceReducer(combineReducers(createReducers(store.asyncReducers)));
}

function getMissingReducers(reducers, data) {
  console.log('>>>>>>>>> CREATE.JS > getMissingReducers');
  if (!data) return {};
  return Object.keys(data).reduce(
    (prev, next) => (reducers[next] ? prev : { ...prev, [next]: (state = {}) => state }),
    {}
  );
}

export default function createStore(history, client, data, persistConfig = null) {
  console.log('>>>>>>>>> CREATE.JS > history: ', history);
  console.log('>>>>>>>>> CREATE.JS > client: ', client);
  console.log('>>>>>>>>> CREATE.JS > data: ', data);
  console.log('>>>>>>>>> CREATE.JS > persistConfig: ', persistConfig);
  const middleware = [createMiddleware(client), routerMiddleware(history)];
  console.log('>>>>>>>>> CREATE.JS > middleware: ', middleware);
  let enhancers = [applyMiddleware(...middleware)];

  if (__CLIENT__ && __DEVTOOLS__) {
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__1');
    const { persistState } = require('redux-devtools');
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__2');
    const DevTools = require('../containers/DevTools/DevTools');
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__3');
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__4: ', enhancers);
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__5: ', window.devToolsExtension);
    const m = window.location.href.match(/[?&]debug_session=([^&]+)\b/) 
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__6: ', m);
    enhancers = [
      ...enhancers,
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    ];
    console.log('>>>>>>>>> CREATE.JS > YES __CLIENT__ && __DEVTOOLS__ > enhancers: ', enhancers);
  }

  console.log('>>>>>>>>> CREATE.JS > enhancers: ', enhancers);
  console.log('>>>>>>>>> CREATE.JS > persistConfig: ', persistConfig);

  const finalCreateStore = compose(...enhancers)(_createStore);
  const missingReducers = getMissingReducers(createReducers(), data);
  const store = finalCreateStore(combineReducers(createReducers(missingReducers)), data);

  store.asyncReducers = {};
  store.inject = inject.bind(null, store);

  if (persistConfig) {
    console.log('>>>>>>>>> CREATE.JS > persistConfig: ', persistConfig);
    console.log('>>>>>>>>> CREATE.JS > persistConfig > store: ', store);
    createPersistoid(store, persistConfig);
    store.dispatch({ type: 'PERSIST' });
  }

  if (__DEVELOPMENT__ && module.hot) {
    console.log('>>>>>>>>> CREATE.JS > YES __DEVELOPMENT__ && module.hot');
    module.hot.accept('./reducer', () => {
      let reducer = require('./reducer').default;
      store.replaceReducer(combineReducers((reducer.default || reducer)(store.asyncReducers)));
    });
  }
  console.log('>>>>>>>>> CREATE.JS > store: ', store);
  return store;
}
