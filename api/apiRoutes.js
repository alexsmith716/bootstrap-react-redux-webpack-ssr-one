import cookie from 'cookie';
import config from '../config';
import actions from './actions';

import { mapUrl, parseToken } from './common/utils';

const apiRoutes = async (req,res) => {
  console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > REQ.method: ', req.method, ' > REQ.url: ', req.url);

  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);
  const { action, params } = mapUrl(actions, splittedUrlPath);

  // console.log('>>>>>>>>>>>>> API.JS > async > mapUrl > action: ', action);
  // console.log('>>>>>>>>>>>>> API.JS > async > mapUrl > params: ', params);
  // console.log('>>>>>>>>>>>>> API.JS > async > mapUrl > REQ.headers.cookie: ', req.headers.cookie);

  if (action) {
    // console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > action > REQ.method: ', req.method, ' > REQ.url: ', req.url, ' > action: ', action);
    const token = cookie.parse(req.headers.cookie || '').accessToken;
    if (token) {
      req.session.user = parseToken(token).sub;
    }

    // console.log('>>>>>>>>>>>> Api.JS > async > Token: ', token);
    // console.log('>>>>>>>>>>>> Api.JS > async > REQ.session.user: ', req.session.user);

    try {
      const result = await action(req, params);

      if (result.isAnonymous) {
        // Just check Authorization when we need
        console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > RES.end() > REQ.method: ', req.method, ' > REQ.url: ', req.url);
        return res.end();
      }

      if (result instanceof Function) {
        console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > result(res) > REQ.method: ', req.method, ' > REQ.url: ', req.url);
        result(res);
      } else {
        console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > RES.json(result) > REQ.method: ', req.method, ' > REQ.url: ', req.url);
        res.json(result);
      }
    } catch (error) {
      if (error.redirect) {
        console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > RES.redirect(error.redirect) > REQ.method: ', req.method, ' > REQ.url: ', req.url);
        return res.redirect(error.redirect);
      }

      console.error('API ERROR:', pretty.render(error));
      console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > RES.json(ERROR) > REQ.method: ', req.method, ' > REQ.url: ', req.url);
      res.status(error.status || 500).json(error);
    }
  } else {
    console.log('>>>>>>>>>>>>> API.JS > app.use(ASYNC) > RES.end(NOT FOUND) > REQ.method: ', req.method, ' > REQ.url: ', req.url);
    res.status(404).end('NOT FOUND');
  }
};

export default apiRoutes;

// response ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// request url: http://localhost:3000/ws/?EIO=3&transport=polling&t=M7sJPpL
// set-cookie: io=4fXp7fMYpIzCncf8AAAA; Path=/; HttpOnly
// -----------------------------------------------------------------
// request +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// request referrer: http://localhost:3000/

// handshake:
// allows client connection
// initiated with client request
// data may be added to handshake
// can store socket based properties
// you can identify the session ID based on cookies passed,
// and then match an identified session
