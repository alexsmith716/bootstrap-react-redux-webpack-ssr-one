import { Router } from 'express';
import apiRoutes from './apiRoutes';

const router = new Router();

// router.use((req, res, next) => {
//   console.log('>>>>>>>>>>>>>>>>> ApiRouter.js > REQ.ip +++++++++: ', req.ip);
//   console.log('>>>>>>>>>>>>>>>>> ApiRouter.js > REQ.method +++++: ', req.method);
//   console.log('>>>>>>>>>>>>>>>>> ApiRouter.js > REQ.url ++++++++: ', req.url);
//   console.log('>>>>>>>>>>>>>>>>> ApiRouter.js > REQ.headers ++++: ', req.headers);
//   return next();
// });

router.route('/auth/load').post(apiRoutes);
router.route('/info/load').get(apiRoutes);

export default router;
