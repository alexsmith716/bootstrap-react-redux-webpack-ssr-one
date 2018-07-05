import React from 'react';
import Loadable from 'react-loadable';

const AboutOneLoadable = Loadable({

  // loader: () => import('./AboutOne' /* webpackChunkName: 'aboutone' */).then(module => module.default),
  loader: () => import('./AboutOne').then(module => module.default),

  loading: () => <div>Loading</div>

});

export default AboutOneLoadable;
