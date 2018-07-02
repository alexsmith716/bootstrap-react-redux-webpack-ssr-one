
// The '@feathersjs/express' module contains Express framework integrations for Feathers
import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import services from './services';
import channels from './channels';  // Decide what events to send to connected real-time clients
import serverConfig from '../config/config';
import config from './config';

process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>> API > API > Unhandled Rejection at:', promise, 'reason:', error);
});

// *********************************************************************************************
// Configure Express server and REST API
// Turn this Feathers application into a Express compatible application
// Additionally to Feathers functionality also lets you use the Express API
// *********************************************************************************************

// Create the app that is a Feathers AND Express application
const app = express(feathers());

// assign setting name 'config' to value config object 'auth' (cookie info)
app.set('config', config);
app.use(morgan('dev'));
app.use(cookieParser()); // parse cookie header and populate req.cookies


// EXPRESS-SESSION:

// resave: false,             // don't save session if unmodified
                              // Forces session to be saved back to the session store, 
                              // even if the session was never modified during the request.

// saveUninitialized: false,  // don't create session until something stored
                              // Forces 'uninitialized' session to be saved to the store
                              // A session is uninitialized when it is new but not modified


// *** Note:
// *** if you are using Session in conjunction with PassportJS, 
// *** Passport will add an empty Passport object to the session for use after a user is authenticated, 
// *** which will be treated as a modification to the session, causing it to be saved. 

// creating session 
app.use(session({
  secret: serverConfig.sessionSecret, // secret used to sign the session ID cookie
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}));


// *********************************************************************************************
// Configure Exposing services through this RESTful API
// *********************************************************************************************

// parse data in the HTTP body
// so REST can .create, .update and .patch calls parse the data in the HTTP body
// Turn on URL-encoded parser for REST services
app.use(bodyParser.urlencoded({ extended: true }));
// Turn on JSON parser for REST services
app.use(bodyParser.json());

// Set up REST transport
app.configure(express.rest());

// Set up real-time socket transport
app.configure(socketio({ path: '/ws' }));

app.use((req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> API > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  // console.log('>>>>>>>>>>>>>>>>> API > REQ.ip +++++++++++++: ', req.ip);
  console.log('>>>>>>>>>>>>>>>>> API > REQ.method +++++++++++++++: ', req.method);
  console.log('>>>>>>>>>>>>>>>>> API > REQ.url ++++++++++++++++++: ', req.url);
  console.log('>>>>>>>>>>>>>>>>> API > REQ.headers ++++++++++++++: ', req.headers);
  console.log('>>>>>>>>>>>>>>>>> API > REQ.cookies ++++++++++++++: ', req.cookies);
  console.log('>>>>>>>>>>>>>>>>> API > REQ.session ++++++++: ', req.session);
  // console.log('>>>>>>>>>>>>>>>>> API > REQ.params +++++++++: ', req.params);
  // console.log('>>>>>>>>>>>>>>>>> API > REQ.originalUrl ++++: ', req.originalUrl);
  console.log('>>>>>>>>>>>>>>>>> API > $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ IN < $$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
  return next();
});

app.configure(services);
app.configure(channels);

app.use(express.notFound());
app.use(express.errorHandler({
  logger: {
    error: error => {
      if (error && error.code !== 404) {
        console.error('>>>>>> API > API > ERROR !!!:', error);
      }
    }
  }
}));

if (serverConfig.apiPort) {

  app.listen(serverConfig.apiPort, err => {

    if (err) {
      console.error('>>>>>> API > API > Express server connection Error', err);
    }

    console.error('>>>>>> API > API > Express server running on PORT: ', serverConfig.apiPort);

  });

} else {
  console.error('==>     ERROR: No APIPORT environment variable has been specified');
}
