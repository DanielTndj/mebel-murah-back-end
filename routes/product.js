const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.post("/products", list);

// rating
router.put("/product/star/:productId", authCheck, productStar);

// related
router.get("/product/related/:productId", listRelated);

// search
router.post("/search/filters", searchFilters);

module.exports = router;
