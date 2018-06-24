import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import LoginForm from '../../components/LoginForm/LoginForm';
import * as authActions from '../../redux/modules/auth';
import * as notifActions from '../../redux/modules/notifs';
import FacebookLogin from '../../components/FacebookLogin/FacebookLogin';

// <p>You are currently logged in as {user.email}.</p>

@connect(state => ({ user: state.auth.user }), { ...notifActions, ...authActions })
@withRouter

export default class Login extends Component {

  static propTypes = {
    user: PropTypes.shape({ email: PropTypes.string }),
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired,
    history: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static defaultProps = {
    user: null
  };

  onFacebookLogin = async (err, data) => {
    if (err) return;

    try {
      await this.props.login('facebook', data);
      this.successLogin();
    } catch (error) {
      if (error.message === 'Incomplete oauth registration') {
        this.props.history.push({
          pathname: '/register',
          state: { oauth: error.data }
        });
      } else {
        throw error;
      }
    }
  };

  onLocalLogin = async data => {
    const result = await this.props.login('local', data);
    this.successLogin();
    return result;
  };

  successLogin = () => {
    this.props.notifSend({
      message: "You're logged in now !",
      kind: 'success',
      dismissAfter: 2000
    });
  };

  FacebookLoginButton = ({ facebookLogin }) => (
    <div>
      <a href="#" className="m-b-10 d-flex justify-content-center align-items-center button-facebook" onClick={facebookLogin}>
        <i className="fa fa-facebook-official"></i>
        Facebook
      </a>
    </div>
  );


  render() {

    const { user, logout } = this.props;
    const styles = require('./scss/Login.scss');
    const googleIcon = require('../../components/GoogleLogin/images/icon-google.png');

    return (

      <div className="container">

        <div className={styles.loginContainer}>

          <Helmet title="Login" />  

          {!user && (

            <div className="d-flex justify-content-center">

              <div className={styles.login}>

                <div className={`mb-3 ${styles.formTitle}`}>
                  <p>
                    Sign in to Election App
                  </p>
                </div>

                <div className={styles.formContainer}>

                  <LoginForm onSubmit={this.onLocalLogin} />

                  <div className={`mt-3 mb-3 ${styles.signInWith}`}>
                    <p>Or sign in with</p>
                  </div>

                  <div className="d-flex justify-content-between">

                    <FacebookLogin
                      appId="35353454535454354"
                      /* autoLoad={true} */
                      fields="name,email,picture"
                      onLogin={this.onFacebookLogin}
                      component={this.FacebookLoginButton}
                    />

                    <div>
                      <a href="#" className="m-b-10 d-flex justify-content-center align-items-center button-google">
                        <img src={googleIcon} alt="Google Login" />
                        Google
                      </a>
                    </div> 

                  </div>

                </div>

                <div className={`mt-4 d-flex justify-content-center ${styles.createAccount}`}>
                  <div>
                    Not a member?
                    <a href="/join?source=login">Create an account</a>.
                  </div>
                </div> 

              </div>

            </div>

          )}

          {user && (

            <div>

              <div>You are currently logged in as Elmer Fudddd. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</div>

              <div>
                <button className="btn btn-danger" onClick={logout}>
                  <i className="fa fa-sign-out" /> Log Out
                </button>
              </div>
            </div>

          )}

        </div>

      </div>

    );
  }
};
