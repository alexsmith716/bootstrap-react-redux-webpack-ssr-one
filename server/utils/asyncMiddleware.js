
// wrapping async await routes
// helper function that wraps express routes to handle rejected promises

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};