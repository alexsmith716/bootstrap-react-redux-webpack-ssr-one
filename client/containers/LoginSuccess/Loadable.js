import React from 'react';
import Loadable from 'react-loadable';

const LoginSuccessLoadable = Loadable({

  // loader: () => import('./LoginSuccess' /* webpackChunkName: 'login-success' */).then(module => module.default),
  loader: () => import('./LoginSuccess').then(module => module.default),

  loading: () => <div>Loading</div>

});


export default LoginSuccessLoadable;
