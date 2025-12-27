import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './db/connect.js';

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar el servidor:', err.message);
  }
};

start();
