import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error('❌ FATAL ERROR: MONGO_URL is not defined in .env');
    process.exit(1);
  }

  mongoose.connection.on('connected', () => console.log('🔥 MongoDB Atlas Connected successfully!'));
  mongoose.connection.on('error', (err) => console.error('❌ MongoDB Connection Error:', err));
  mongoose.connection.on('disconnected', () => console.log('⚠️ MongoDB Disconnected'));

  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.error('❌ Initial Database Connection Failed:', error);
    process.exit(1);
  }
};

export default connectDB;