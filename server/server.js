import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Files (Widget Script)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/static', express.static(path.join(__dirname, 'static')));

// API Routes
app.use('/api', routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
