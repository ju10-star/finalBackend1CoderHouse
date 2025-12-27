import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from '../db/connect.js';
import Product from '../models/product.js';

const run = async () => {
  await connectDB(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany([
    {
      title: 'Notebook A',
      description: 'Notebook 15 pulgadas',
      category: 'Electro',
      price: 800,
      stock: 10,
      available: true
    },
    {
      title: 'Auriculares B',
      description: 'Bluetooth con cancelación de ruido',
      category: 'Audio',
      price: 50,
      stock: 30,
      available: true
    },
    {
      title: 'TV C',
      description: 'Smart TV 55 pulgadas',
      category: 'Electro',
      price: 500,
      stock: 5,
      available: false
    }
  ]);
  console.log('Seed completado');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});