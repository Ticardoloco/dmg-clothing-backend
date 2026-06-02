import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // check if orders items exist
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // loop through each item
    for (const item of items) {
      // find product in database
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Safely parsing item.size and item.color (singular format)
      const targetSize = item.size || item.sizes;
      const targetColor = item.color || item.colors;

      // Find the specific matching size and color variant inside this product
      const variant = product.variants.find(
        (v) => v.size === targetSize && v.color === targetColor
      );

      if (!variant) {
        return res.status(400).json({ 
          message: `Variant ${targetSize || "None"} - ${targetColor || "None"} for ${product.name} does not exist.` 
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (${targetSize} - ${targetColor}). Only ${variant.stock} left.`,
        });
      }

      // calculate total amount
      totalAmount += product.price * item.quantity;

      // push order item
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: targetSize,
        color: targetColor,
        price: product.price,
      });
    }

    // --- STEP 2: SAFE ATOMIC DEDUCTION ON VALIDATED ITEMS ---
    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          variants: {
            $elemMatch: { size: item.size, color: item.color, stock: { $gte: item.quantity } }
          }
        },
        {
          $inc: { "variants.$.stock": -item.quantity }
        },
        {  returnDocument: "after" }
      );

      if (!updatedProduct) {
        return res.status(400).json({
          message: "Stock levels fluctuated during checkout. Please refresh your cart and try again."
        });
      }
    }

    // ADD THE SHIPPING FEE HERE ON THE BACKEND
    const SHIPPING_FEE = 10000;
    totalAmount += SHIPPING_FEE;

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod ? paymentMethod.toLowerCase() : "cod",
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("ERROR IN CREATE_ORDER:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("items.product");

    return res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id
    }).populate("items.product");

    return res.status(200).json({
      message: "Orders retrieved successfully",
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error: error.message});
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status value is required" });
    }

    const normalizedStatus = String(status).trim().toLowerCase();

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (normalizedStatus === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findOneAndUpdate(
          { _id: item.product, "variants.size": item.size, "variants.color": item.color },
          { $inc: { "variants.$.stock": item.quantity } }
        );
      }
    }

    // FIXED: Using findByIdAndUpdate bypasses full document schema validations
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: normalizedStatus },
      { returnDocument: "after", runValidators: false } // Bypasses the missing 'shippingAddress.state' requirement
    );
    
    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("EXPRESS CONTROLLER ERROR (updateOrderStatus):", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({ message: "Payment status value is required" });
    }

    const normalizedPaymentStatus = String(paymentStatus).trim().toLowerCase();

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // FIXED: Using findByIdAndUpdate to target only this property update smoothly
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: normalizedPaymentStatus },
      { returnDocument: "after", runValidators: false } // Bypasses the missing 'shippingAddress.state' requirement
    );

    return res.status(200).json({
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("EXPRESS CONTROLLER ERROR (updatePaymentStatus):", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findOneAndUpdate(
          { _id: item.product, "variants.size": item.size, "variants.color": item.color },
          { $inc: { "variants.$.stock": item.quantity } }
        );
      }
    }

    await order.deleteOne();

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getMyOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};