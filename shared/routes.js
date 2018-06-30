import { routerActions } from 'react-router-redux';
// import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';

import { App, Home, NotFound } from '../client/containers';

// import Login from '../client/containers/Login/Loadable';
// import Register from '../client/containers/Register/Loadable';
// import About from '../client/containers/About/Loadable';
// import LoginSuccess from '../client/containers/LoginSuccess/Loadable';

// import AboutOne from '../client/containers/AboutOne/Loadable';
// import AboutToo from '../client/containers/AboutToo/Loadable';
// import AboutThree from '../client/containers/AboutThree/Loadable';
// import AboutFour from '../client/containers/AboutFour/Loadable';


// const isAuthenticated = connectedReduxRedirect({
//   redirectPath: '/login',
//   authenticatedSelector: state => state.auth.user !== null,
//   redirectAction: routerActions.replace,
//   wrapperDisplayName: 'UserIsAuthenticated'
// });
// 
// const isNotAuthenticated = connectedReduxRedirect({
//   redirectPath: '/',
//   authenticatedSelector: state => state.auth.user === null,
//   redirectAction: routerActions.replace,
//   wrapperDisplayName: 'UserIsAuthenticated',
//   allowRedirectBack: false
// });

const routes = [{
  component: App,
  routes: [
    { path: '/', exact: true, component: Home },
    // { path: '/aboutone', component: AboutOne },
    // { path: '/abouttoo', component: AboutToo },
    // { path: '/aboutthree', component: AboutThree },
    // { path: '/aboutfour', component: AboutFour },
    // { path: '/about', component: About },
    // { path: '/login', component: Login },
    // { path: '/login-success', component: isAuthenticated(LoginSuccess) },
    // { path: '/register', component: isNotAuthenticated(Register) },
    { component: NotFound },
  ],
}];

export default routes;
