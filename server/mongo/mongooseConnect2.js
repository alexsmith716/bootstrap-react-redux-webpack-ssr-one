import mongoose from 'mongoose';
import serverConfig from '../config';
import dotenv from 'dotenv';

dotenv.config();
//require('dotenv').config();

let gracefulShutdown;

let dbURL = serverConfig.mongoURL;
if (process.env.NODE_ENV === 'production') {
  // dbURL = serverConfig.mongoLabURL;
};

const mongooseOptions = {
  autoReconnect: true,
  keepAlive: true,
  connectTimeoutMS: 30000
};

export default function mongooseConnect(req, res, next) {

  mongoose.Promise = global.Promise;
  mongoose.connect(dbURL, mongooseOptions, err => {
    if (err) {
      console.error('####### > Please make sure Mongodb is installed and running!');
    } else {
      console.error('####### > Mongodb is installed and running!');
    }
  });

  mongoose.connection.on('connected', function() {
    console.log('####### > MONGOOSE CONNECTED: ' + dbURL);
  });

  mongoose.connection.on('error', function(err) {
    console.log('####### > Mongoose connection error: ' + err);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('####### > Mongoose disconnected');
  });

  // Handle Mongoose/Node connections
  gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      console.log('####### > Mongoose disconnected through: ' + msg);
      callback();
    })
  };

  // For app termination
  process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
      console.log('####### > Mongoose SIGINT gracefulShutdown');
      process.exit(0);
    })
  });

  // For nodemon restarts
  process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
      console.log('####### > Mongoose SIGUSR2 gracefulShutdown');
      process.kill(process.pid, 'SIGUSR2');
    })
  });

  // For Heroku app termination
  process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
      console.log('####### > Mongoose SIGTERM gracefulShutdown');
      process.exit(0);
    })
  });

  return next();
};
