
export default function clientMiddleware(client) {

  console.log('>>>>>>>>>>>>>>>>>>>>> ClientMiddleware.js > client <<<<<<<');

  return ({ dispatch, getState }) => next => action => {

    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, ...rest } = action;

    if (!promise) {
      console.log('>>>>>>>>>>>>>>>>>>>>> ClientMiddleware.js > return > NO promise <<<<<<<');
      return next(action);
    }

    console.log('>>>>>>>>>>>>>>>>>>>>> ClientMiddleware.js > return > YES promise <<<<<<<');

    const [REQUEST, SUCCESS, FAILURE] = types;

    next({ ...rest, type: REQUEST });

    const actionPromise = promise(client, dispatch);

    console.log('>>>>>>>>>>>>>>>>>>>>> ClientMiddleware.js > return > YES promise > actionPromise <<<<<<<');

    actionPromise
      .then(
        result => next({ ...rest, result, type: SUCCESS }), error => next({ ...rest, error, type: FAILURE })
      ).catch(error => {
        console.error('MIDDLEWARE ERROR:', error);
        next({ ...rest, error, type: FAILURE });
      });

    return actionPromise;
  };
}
