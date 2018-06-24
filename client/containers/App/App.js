import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import renderRoutes from 'react-router-config/renderRoutes';
import Helmet from 'react-helmet';

import { isLoaded as isInfoLoaded, load as loadInfo } from '../../redux/modules/info';
import { isAuthLoaded, loadAuth, logout } from '../../redux/modules/auth';

import Notifs from '../../components/Notifs/Notifs';
import config from '../../../config/config';

// https://reactjs.org/docs/dom-elements.html <<<<<<<<< DOM attributes supported by React
// https://github.com/facebook/react/issues/10772#issuecomment-333242375

@asyncConnect([
  {
    promise: async ({ store: { dispatch, getState } }) => {
      console.log('>>>>>>>>>>>>> APP.JS > asyncConnect > isAuthLoaded FALSE ??? <<<<<<<<<<<<<<<<<<<');
      if (!isAuthLoaded(getState())) {
        console.log('>>>>>>>>>>>>> APP.JS > asyncConnect > isAuthLoaded FALSE <<<<<<<<<<<<<<<<<');
        await dispatch(loadAuth());
      }
      console.log('>>>>>>>>>>>>> APP.JS > asyncConnect > isInfoLoaded FALSE ??? <<<<<<<<<<<<<<<<<<<');
      if (!isInfoLoaded(getState())) {
        console.log('>>>>>>>>>>>>> APP.JS > asyncConnect > isInfoLoaded FALSE <<<<<<<<<<<<<<<<<');
        await dispatch(loadInfo());
      }
    }
  }
])

@connect(
  state => ({
    notifs: state.notifs,
    user: state.auth.user
  }),
  {
    logout
  }
)

export default class App extends Component {
  static propTypes = {
    user: PropTypes.shape({ email: PropTypes.string }),
    notifs: PropTypes.shape({ global: PropTypes.array }).isRequired,
    logout: PropTypes.func.isRequired,
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    user: null
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };

  // componentWillReceiveProps(nextProps) {
  //   if (!this.props.user && nextProps.user) {
  //     this.context.router.history.push('/loginSuccess');
  //   } else if (this.props.user && !nextProps.user) {
  //     this.context.router.history.push('/');
  //   }
  // }
  // <span className="navbar-toggler-icon"></span>
  // <img src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNzc3Nzc3IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0zIDE4aDE4di0ySDN2MnptMC01aDE4di0ySDN2MnptMC03djJoMThWNkgzeiIvPgo8L3N2Zz4=" alt="Nav Menu">
  // <img src={iconBar36} alt="Nav Menu"/>

  // <li className="nav-item">
  //   <a className="nav-link" href="#"><span className={`fa fa-headphones ${stylesScss2.colorGoldLocal}`}></span><span className={stylesScss2.colorGoldLocal}>Headphones!</span></a>
  // </li>


  handleLogout = event => {
    event.preventDefault();
    this.props.logout();
  };

  render() {

    const { notifs, route } = this.props;
    console.log('>>>>>>>>>>>>> APP.JS > render() <<<<<<<<<<<<<<');
    const stylesScss1 = require('./scss/AppScss1.scss');
    const stylesScss2 = require('./scss/AppScss2.scss');
    const stylesCss1 = require('./css/AppCss1.css');
    // const iconBar30 = require('./img/icon-bar-30.svg');
    // <img src={iconBar30} width="30" height="30" alt=""/>
    // <span className="navbar-toggler-icon"></span>
    // <span className={`fa fa-bars ${stylesScss1.faBars}`}></span>

    return (

      <div className={stylesScss1.app}>

        <Helmet {...config.app.head} />

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="main-nav">
          <a className={`navbar-brand ${stylesScss1.brand}`} href="/">Election App</a>
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link openSansItalicwebfontFont" href="/">Home <span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link bootstrapDefaultFont" data-toggle="modal" data-target="#exampleModal">
                  <span className="fa fa-fw fa-sign-in"></span>Modal</a>
              </li>
              <li className="nav-item">
                <a className="nav-link norwesterFont" href="#">
                  <span className={`fa fa-fw fa-headphones ${stylesScss2.colorGoldLocal}`}></span><span className={stylesScss2.testColorFont}>Headphones!</span></a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle lobsterv20latinregularFont" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div className="dropdown-menu" aria-labelledby="dropdown01">
                  <a className="dropdown-item" href="/aboutone">About One</a>
                  <a className="dropdown-item" href="/abouttoo">About Too</a>
                  <a className="dropdown-item" href="/aboutthree">About Three</a>
                  <a className="dropdown-item" href="/aboutfour">About Four</a>
                  <a className="dropdown-item" href="/login">Login</a>
                  <a className="dropdown-item" href="/about">About</a>
                  <a className="dropdown-item" href="/register">Register</a>
                </div>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" placeholder="Search" aria-label="Search" type="text"></input>
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>

        <div className={stylesScss1.appContent}>
          {notifs.global && (
            <div>
              <Notifs
                namespace="global"
                NotifComponent={props => <div>{props.message}</div>}
              />
            </div>
          )}
          {renderRoutes(route.routes)}
        </div>

        <div className={`py-5 ${stylesScss1.footer}`}>
          <div className="container">
            <div className={`m-0 text-center philosopherboldwebfontFont ${stylesCss1.colorCrimsonCssLocal}`}>Copyright &copy; 2018 · Election App 2018!</div>
            <div className="m-0 text-center"><span className={`fa fa-headphones ${stylesScss2.colorGoldLocal}`}></span><span className={`norwesterFont ${stylesScss2.colorGoldLocal}`}>Footer Headphones!</span></div>
          </div>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title colorGreenYellowGlobalCSS" id="exampleModalLabel">Modal Test</h5>
                <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">

                <p>Modal is working. This paragraph's font and the above modal-title's font is 'Old English'. It is the default 'global' font for this app. It is overriding Bootstrap's default font 'font-family-sans-serif'. It's a hard to read font but easily recognizable for development purposes.</p>

                <p className="robotoMonoV4LatinRegularFont">This paragraph's '@font-face' is 'roboto-mono-v4-latin-regular'.</p>

                <p className="bootstrapDefaultFont colorSalmonGlobal">This paragraph's '@font-face' is 'font-family-sans-serif'.</p>

                <p className="lobsterv20latinregularFont">This paragraph's '@font-face' is 'lobster-v20-latin-regular'.</p>

                <p className="norwesterFont">This paragraph's '@font-face' is 'norwester'.</p>

                <p className="colorCrimsonGlobal openSansItalicwebfontFont">This paragraph's '@font-face' is 'OpenSans-Italic-webfont'.</p>

                <p className="philosopherboldwebfontFont">This paragraph's '@font-face' is 'philosopher-bold-webfont'.</p>

                <p className="sourcesansproregularwebfontFont">This paragraph's '@font-face' is 'sourcesanspro-regular-webfont'.</p>

                <p className={`colorDarkgrayGlobal ${stylesScss2.montserratLightFontGlobalToLocal}`}>This paragraph's '@font-face' is 'MontserratLight'. It is scoped Global to Local.</p>

                <p className="colorOrangeredGlobal openSansBoldwebfontFont">This paragraph's '@font-face' is 'OpenSans-Bold-webfont' It is scoped Global.</p>

              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                <a className="btn btn-primary" href="#">Button Somewhere</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}
