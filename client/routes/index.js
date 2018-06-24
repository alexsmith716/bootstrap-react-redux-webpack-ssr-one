import { routerActions } from 'react-router-redux';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { App, Home, NotFound } from '../containers';

// import Login from '../containers/Login/Loadable';
// import Register from '../containers/Register/Loadable';
// import About from '../containers/About/Loadable';
// import LoginSuccess from 'containers/LoginSuccess/Loadable';

import AboutOne from '../containers/AboutOne/Loadable';
import AboutToo from '../containers/AboutToo/Loadable';
import AboutThree from '../containers/AboutThree/Loadable';
import AboutFour from '../containers/AboutFour/Loadable';

const locationHelper = locationHelperBuilder({});

const isAuthenticated = connectedRouterRedirect({
  authenticatedSelector: state => !!state.auth.user,
  redirectPath: '/login',
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const isNotAuthenticated = connectedRouterRedirect({
  authenticatedSelector: state => !state.auth.user,
  redirectAction: routerActions.replace,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  wrapperDisplayName: 'UserIsNotAuthenticated'
});

const routes = [{
  component: App,
  routes: [
    { path: '/', exact: true, component: Home },
    { path: '/aboutone', component: AboutOne },
    { path: '/abouttoo', component: AboutToo },
    { path: '/aboutthree', component: AboutThree },
    { path: '/aboutfour', component: AboutFour },
    // { path: '/about', component: About },
    // { path: '/login', component: Login },
    // { path: '/login-success', component: isAuthenticated(LoginSuccess) },
    // { path: '/register', component: isNotAuthenticated(Register) },
    { component: NotFound },
  ],
}];

export default routes;
