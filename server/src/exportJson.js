import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Read seed data from seed.js or write directly
import { seedDatabase } from './seed.js';

// We can read init-mongo.js or write JSON files directly
console.log('Data directory ready at:', dataDir);
