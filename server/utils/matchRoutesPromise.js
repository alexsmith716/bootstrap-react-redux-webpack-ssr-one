
// matchRoutes function to find which elements in the data structure match against a particular URL
// Return array of matched routes
// Each item in the array contains two properties: route and match
//   route: A reference to the route used to match
//   match: The match object that also gets passed to <Route> render methods

import { matchRoutes } from 'react-router-config';

// *** use branch of routes to figure out what is going to be rendered before it actually is rendered ***
// do something like this on the server before rendering !!!!


const getComponents = (match) => {

  //console.log('>>>>>>>> matchRoutesPromise > getComponents 1 >>>>>>>');

  // Promise required for the blocking callback while awaiting the 'result' with 'reduce()' method
  // utilizing Promise.all() to await multiple (array) results on getComponents() function call
  const promises = match.map(v => v.route.component).reduce((result, component) => {
    if (component.preload) {
      const res = component.preload();
      const ret = [...(result), component, ...[].concat(res)];
      //console.log('>>>>>>>> matchRoutesPromise > getComponents 2a >>>>>>>');
      return ret;
    }
    //console.log('>>>>>>>> matchRoutesPromise > getComponents 2b >>>>>>>');
    return [...(result), component];
  }, []);

  //console.log('>>>>>>>> matchRoutesPromise > getComponents 3 >>>>>>>');

  return Promise.all(promises);

}

function getParams(match) {
  //console.log('>>>>>>>> matchRoutesPromise > getParams 1 >>>>>>>');
  return match.reduce((result, component) => {
    if (component.match && component.match.params) {
      //console.log('>>>>>>>> matchRoutesPromise > getParams 2a >>>>>>>');
      return { ...result, ...component.match.params };
    }
    //console.log('>>>>>>>> matchRoutesPromise > getParams 2b >>>>>>>');
    return result;
  }, {});
}

const matchRoutesPromise = (routes, pathname) => {

  return new Promise((resolve, reject) => {

    const match = matchRoutes(routes, pathname);
    //console.log('>>>>>>>> matchRoutesPromise() > matchRoutes > match: ', match);
    const params = getParams(match);
    //console.log('>>>>>>>> matchRoutesPromise() > getParams > params: ', params);

    getComponents(match)
    .then(components => {
      const result = { components, match, params };
      console.log('>>>>>>>> matchRoutesPromise() > getComponents > .then > match: ', match);
      console.log('>>>>>>>> matchRoutesPromise() > getComponents > .then > params: ', params);
      console.log('>>>>>>>> matchRoutesPromise() > getComponents > .then > components: ', components);
      // once the 'result' of the asynchronous computation (getComponents(match)) is ready ...
      // ... it is delivered 'calledback' via resolve()
      //setTimeout(() => resolve(result), 5000);
      resolve(result);
    })
    // uncaught errors are passed on until there is an error handler
    // 'catch' error at initial call from 'server'
    //.catch(err => { 
    //  console.log('>>>>>>>> matchRoutesPromise() > getComponents > .catch > err: ', err);
    //  reject(err);
    //});
  });
}

export default matchRoutesPromise;

