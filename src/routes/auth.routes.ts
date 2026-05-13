import Router from '@koa/router';
import { AuthController } from '../controllers/AuthController';

const authRouter = new Router({ prefix: '/api/auth' });

authRouter.post('/verify-pin', AuthController.verifyPin);

export default authRouter;
