
// matchRoutes function to find which elements in the data structure match against a particular URL
// Return array of matched routes
// Each item in the array contains two properties: route and match
//   route: A reference to the route used to match
//   match: The match object that also gets passed to <Route> render methods

import { matchRoutes } from 'react-router-config';

// *** use branch of routes to figure out what is going to be rendered before it actually is rendered ***
// do something like this on the server before rendering !!!!


function getComponents(match) {
  return match.map(v => v.route.component).reduce(async (result, component) => {
    if (component.preload) {
      const res = await component.preload();
      const ret = [...(await result), component, ...[].concat(res)];
      return ret;
    }
    return [...(await result), component];
  }, []);
}

function getParams(match) {
  return match.reduce((result, component) => {
    if (component.match && component.match.params) {
      return { ...result, ...component.match.params };
    }
    return result;
  }, {});
}

const matchRoutesAsync = async (routes, pathname) => {

  const match = matchRoutes(routes, pathname);
  const params = getParams(match);

  const components = await getComponents(match);

  console.log('>>>>>>>> matchRoutesAsync() > getComponents > await > match: ', match);
  console.log('>>>>>>>> matchRoutesAsync() > getComponents > await > params: ', params);
  console.log('>>>>>>>> matchRoutesAsync() > getComponents > await > components: ', components);

  return { components, match, params };
};

export default matchRoutesAsync;