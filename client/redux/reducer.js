import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import auth from './modules/auth';
import notifs from './modules/notifs';
import info from './modules/info';

export default function createReducers(asyncReducers) {
  return {
    routing: routerReducer,
    reduxAsyncConnect,
    online: (v = true) => v,
    notifs,
    auth,
    info,
    ...asyncReducers
  };
}
