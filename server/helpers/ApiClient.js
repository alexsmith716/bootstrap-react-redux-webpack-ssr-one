import axios from 'axios';
import config from '../config';

export default function apiClient(req) {
  const instance = axios.create({
    // baseURL: __SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : '/api'
    baseURL: __SERVER__ ? 'http://localhost:3000' : 'http://localhost:3000',
  });

  const cs = __SERVER__ ? '__SERVER__' : '__CLIENT__';
  console.log('> ApiClient.JS || AXIOS > __SERVER__ || __CLIENT__: ', cs);

  let token;

  instance.setJwtToken = newToken => {
    token = newToken;
  };



  instance.interceptors.request.use(
    conf => {

      // console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use > $$$$$$ req.headers $$$$$: ', req.headers);

      if (__SERVER__) {
        console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use1 > ######## SERVER #######');
        if (req.header('cookie')) {
          conf.headers.Cookie = req.header('cookie');
          console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use2 > headers.Cookie');
        }
        if (req.header('authorization')) {
          conf.headers.authorization = req.header('authorization');
          console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use3 > headers.authorization');
        }

      } else {

        console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use1 > ######## CLIENT #######');

      }

      // console.log('> ApiClient.JS || AXIOS > instance.interceptors.request ######## return conf #######: ', conf);
      return conf;
    },
    error => {
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use4');
      Promise.reject(error);
    }
  );



  instance.interceptors.response.use(
    response => {
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use5 > response.data: ', response.data);
      return response.data;
    },
    error => {
      console.log('> ApiClient.JS || AXIOS > instance.interceptors.request.use6');
      Promise.reject(error.response ? error.response.data : error);
    }
  );

  console.log('> ApiClient.JS || AXIOS > instance: ', instance);

  return instance;
}
