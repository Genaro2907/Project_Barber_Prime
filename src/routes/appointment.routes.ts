import Router from '@koa/router';
import { AppointmentController } from '../controllers/AppointmentController';

const appointmentRouter = new Router({ prefix: '/api/appointments' });

appointmentRouter.post('/', AppointmentController.create);

export default appointmentRouter;