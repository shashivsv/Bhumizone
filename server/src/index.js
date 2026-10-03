import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  const conn = await connectDB();

  // If connected, automatically run initial seed if collections are empty
  if (conn) {
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`
🚀 ===================================================
   GharDekho Express & MongoDB Server Running!
   PORT        : http://localhost:${PORT}
   API Base    : http://localhost:${PORT}/api/v1
   Health Check: http://localhost:${PORT}/health
   MongoDB URI : ${process.env.MONGODB_URI || 'mongodb://localhost:27017/ghardekho'}
=================================================== 🚀
    `);
  });
};

startServer();
