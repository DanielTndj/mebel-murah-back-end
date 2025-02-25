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
  createCashOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
} = require("../controllers/user");

router.post("/user/cart", authCheck, userCart); //save cart
router.get("/user/cart", authCheck, getUserCart); //get cart
router.delete("/user/cart", authCheck, emptyCart); //empty cart
router.post("/user/address", authCheck, saveAddress); //save cart

//coupon
router.post("/user/cart/coupon", authCheck, applyCouponToCart);

//order
router.post("/user/order", authCheck, createOrder); //stripe
router.post("/user/cash-order", authCheck, createCashOrder); //cod
router.get("/user/orders", authCheck, orders);

//wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;
