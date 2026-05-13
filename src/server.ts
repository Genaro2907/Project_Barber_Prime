import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import connectDB from './config/database';
import bodyParser from 'koa-bodyparser';
import appointmentRouter from './routes/appointment.routes';
import authRouter from './routes/auth.routes';

const app = new Koa();
const PORT = 3000;

connectDB();
app.use(bodyParser());

app.use(appointmentRouter.routes());
app.use(appointmentRouter.allowedMethods());
app.use(authRouter.routes());
app.use(authRouter.allowedMethods());

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(serve(publicDirectoryPath));

app.listen(PORT, () => {
  console.log(`🚀 Server is successfully running`);
});
