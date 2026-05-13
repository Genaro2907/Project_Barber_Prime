import Router from '@koa/router';
import { AppointmentController } from '../controllers/AppointmentController';

const appointmentRouter = new Router({ prefix: '/api/appointments' });

appointmentRouter.post('/', AppointmentController.create);
appointmentRouter.get('/', AppointmentController.getAll);
appointmentRouter.get('/stats', AppointmentController.getStats);
appointmentRouter.get('/booked-times', AppointmentController.getBookedTimes);
appointmentRouter.delete('/:id', AppointmentController.cancel);

export default appointmentRouter;
