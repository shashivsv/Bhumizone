import mongoose from 'mongoose';
import { seedDatabase } from '../seed.js';

let isConnecting = false;
let retryInterval = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ghardekho';
  const maskedUri = uri.replace(/:[^:]*@/, ':****@');

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return null;

  isConnecting = true;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = null;
    }
    // Attempt auto-seed if newly connected
    try {
      await seedDatabase();
    } catch (e) {
      console.error('Seed error on connect:', e.message);
    }
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`
----------------------------------------------------------------------------------
⚠️  Could not connect to MongoDB at "${maskedUri}".
    If using MongoDB Atlas (Cloud):
      - Ensure your IP is whitelisted in Atlas -> Network Access (allow 0.0.0.0/0).
----------------------------------------------------------------------------------
    `);

    // Set up auto-retry every 10 seconds in the background
    if (!retryInterval) {
      retryInterval = setInterval(async () => {
        if (mongoose.connection.readyState !== 1 && !isConnecting) {
          console.log('🔄 Retrying MongoDB connection in background...');
          await connectDB();
        }
      }, 10000);
    }
  }
};

