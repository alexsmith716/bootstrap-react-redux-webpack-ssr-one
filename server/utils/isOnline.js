
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
