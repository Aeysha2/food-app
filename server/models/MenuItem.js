import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du plat est requis'],
      trim: true,
      maxlength: [120, 'Le nom ne peut pas dépasser 120 caractères']
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix doit être positif']
    },
    description: {
      type: String,
      default: '',
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    prepTime: {
      type: String,
      default: '20 min'
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isPopular: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
export default MenuItem;
