import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    category: { type: String, default: 'General' }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true
    },
    userId: {
      type: String,
      default: 'guest-user'
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    phone: { type: String, default: '' },
    deliveryNotes: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Cash on Delivery', 'Apple Pay', 'PayPal'],
      default: 'Credit Card'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Paid'
    },
    status: {
      type: String,
      enum: ['Order Placed', 'Preparing Food', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Placed'
    },
    estimatedDeliveryTime: {
      type: String,
      default: '30-45 min'
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate order number before saving
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
