import auth from '@feathersjs/authentication';
import jwt from '@feathersjs/authentication-jwt';
import local from '@feathersjs/authentication-local';
// import oauth1 from '@feathersjs/authentication-oauth1';
// import oauth2 from '@feathersjs/authentication-oauth2';
// import FacebookTokenStrategy from 'passport-facebook-token';

// auth: adds shared PassportJS authentication for REST and WebSocket transports using JWT
// https://docs.feathersjs.com/api/authentication/server.html

// jwt: JWT authentication strategy for feathers-authentication using Passport
// https://docs.feathersjs.com/api/authentication/jwt.html

// local: Local authentication strategy for feathers-authentication using Passport
// https://docs.feathersjs.com/api/authentication/local.html

function populateUser() {
  return context => {
    context.result.user = context.params.user;
  };
}


export default function authenticationService(app) {

  const config = app.get('config').auth;


  app.configure(auth(config));
  app.configure(jwt());
  app.configure(local());
  // app.configure(oauth2({
  //   name: 'facebook',
  //   Strategy: FacebookTokenStrategy
  // }));


  app.service('authentication').hooks({

    before: {
      // You can chain multiple strategies on create method
      create: auth.hooks.authenticate(['jwt', 'local',]),
      remove: auth.hooks.authenticate('jwt')
    },

    after: {
      create: [populateUser(), local.hooks.protect('user.password')]
    }

  });

}
