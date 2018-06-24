
// Calling webservice ++++++++++++++++++++++++++++++++++++++++++

export default function isOnline(path = '/favicon.ico') {
  // Handle IE and more capable browsers
  console.log('>>>>>>>>>>>>>>>>>>> IsOnline.JS > export default function isOnline  <<<<<<<<<<<<<<<<<<<<<');
  const xhr = new (window.ActiveXObject || XMLHttpRequest)('Microsoft.XMLHTTP');

  // Open new request as a HEAD to the root hostname with a random param to bust the cache
  xhr.open('HEAD', `//${window.location.host}${path}?rand=${Math.floor((1 + Math.random()) * 0x10000)}`, true);

  // Issue request and handle response
  return new Promise(resolve => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304)) {
          console.log('>>>>>>>>>> isOnline.js > xhr.onreadystatechange >>>>>>>> xhr.status1: ', xhr.status);
          return resolve(true);
        }
        console.log('>>>>>>>>>> isOnline.js > xhr.onreadystatechange >>>>>>>> xhr.status2: ', xhr.status);
        resolve(false);
      }
    };
    console.log('>>>>>>>>>> isOnline.js > xhr.onreadystatechange >>>>>>>> xhr.send <<<<<<<<<');
    xhr.send(null);
  });
}

// https://github.com/socketio/socket.io
// https://github.com/socketio/socket.io-client
// https://github.com/socketio/socket.io/blob/master/docs/API.md
// https://github.com/socketio/socket.io-client/blob/master/docs/API.md

// location: http://example.org:8888/foo/bar#bang
// hostname === example.org
// host ======= example.org:8888

// HTTP request method HEAD:
// The HEAD method asks for a response identical to that of a GET request, 
// but without the response body. This is useful for retrieving meta-information written in response headers, 
// without having to transport the entire content.