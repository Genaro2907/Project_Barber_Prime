import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import connectDB from './config/database';

const app = new Koa();
const PORT = 3000;

connectDB();

const publicDirectoryPath = path.join(__dirname, '../public');
app.use(serve(publicDirectoryPath));

app.listen(PORT, () => {
  console.log(`Server is successfully running on http://localhost:${PORT}`);
});