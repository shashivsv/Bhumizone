import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

console.log('Testing connection to MongoDB Atlas...');
console.log('Target URI:', uri ? uri.replace(/:[^:]*@/, ':****@') : 'NOT SET');

try {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 6000,
  });
  console.log('==============================================');
  console.log('🎉 SUCCESS! Connected to MongoDB Atlas!');
  console.log(`Host: ${conn.connection.host}`);
  console.log(`Database: ${conn.connection.name}`);
  console.log('==============================================');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.log('==============================================');
  console.error('❌ Connection Failed:', err.message);
  if (err.message.includes('whitelist') || err.message.includes('tlsv1 alert') || err.message.includes('Could not connect to any servers')) {
    console.log('\n👉 REASON: Your IP address is not whitelisted in MongoDB Atlas Network Access.');
    console.log('👉 ACTION REQUIRED:');
    console.log('   1. Open https://cloud.mongodb.net and log in.');
    console.log('   2. Go to "Network Access" in the left sidebar.');
    console.log('   3. Click "Add IP Address" -> select "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) or "Add Current IP Address".');
    console.log('   4. Click "Confirm" and wait 1 minute for Atlas to apply the rule.');
    console.log('   5. Run: npm run test:db');
  }
  console.log('==============================================');
  process.exit(1);
}
