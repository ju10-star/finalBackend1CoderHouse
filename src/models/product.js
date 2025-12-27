import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0, index: true },
  stock: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true, index: true },
  thumbnails: [{ type: String }]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
