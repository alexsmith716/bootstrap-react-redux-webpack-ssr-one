import express from '@feathersjs/express';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import apiConfig from '../configuration/config';

process.on('unhandledRejection', (error, promise) => {
  console.error('>>>>>> API > API > Unhandled Rejection at:', promise, 'reason:', error);
});

const app = express(feathers());

// app.set('config', config);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.configure(express.rest());
app.configure(socketio({ path: '/ws' }));

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

if (apiConfig.apiPort) {

  app.listen(apiConfig.apiPort, err => {

    if (err) {
      console.error('>>>>>> API > API > Express server connection Error', err);
    }

    console.error('>>>>>> API > API > Express server running on PORT: ', apiConfig.apiPort);

  });

} else {
  console.error('==>     ERROR: No APIPORT environment variable has been specified');
}
