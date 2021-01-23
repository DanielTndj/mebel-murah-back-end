const express = require("express");
const router = express.Router();
// middlewares
const { authCheck } = require("../middlewares/auth");

// controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToCart,
  createOrder,
  orders,
} = require("../controllers/user");

router.post("/user/cart", authCheck, userCart); //save cart
router.get("/user/cart", authCheck, getUserCart); //get cart
router.delete("/user/cart", authCheck, emptyCart); //empty cart
router.post("/user/address", authCheck, saveAddress); //save cart

//coupon
router.post('/user/cart/coupon', authCheck, applyCouponToCart)

//order
router.post('/user/order', authCheck, createOrder)
router.get('/user/orders', authCheck, orders)

module.exports = router;
