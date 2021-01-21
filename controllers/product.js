const Product = require("../models/product");
const User = require("../models/user");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedProduct = await Product.findOneAndRemove({ slug }).exec();

    res.json(deletedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send("Category delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subs")
      .exec();

    res.json(product);
  } catch (error) {
    console.log(error);
  }
};

exports.update = async (req, res) => {
  let { title } = req.body;

  try {
    if (title) {
      req.body.slug = slugify(title);
    }

    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
      }
    ).exec();

    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.list = async (req, res) => {
  try {
    // sort : createdAt/updatedAt/sold
    // order: desc/asc
    // limit: number of products
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  // return object if match between id on ratings object (postedby) and currently login user
  let existingRating = product.ratings.find(
    (rating) => rating.postedBy.toString() === user._id.toString()
  );

  if (existingRating === undefined) {
    // user haven't left rating yet
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();

    res.json(ratingAdded);
  } else {
    // user have already left rating, update rating
    let ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRating },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();

    res.json(ratingUpdated);
  }
};

// show product which has same category
exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.json(related);
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("postedBy", "_id name")
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

const handleStars = (req, res, stars) => {
  Product.aggregate([
    // generate project based on existing fields on Product model
    {
      $project: {
        document: "$$ROOT", //giving access to new entire document
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, aggregates) => {
      if (err) console.log("Aggregates ", err);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) console.log("Product aggregate error", err);
          res.json(products);
        });
    });
};

const handleSub = async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

const handleFabric = async (req, res, fabric) => {
  const products = await Product.find({ fabric })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("postedBy", "_id name")
    .exec();

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    sub,
    shipping,
    color,
    fabric,
  } = req.body;

  if (query) await handleQuery(req, res, query);

  if (price !== undefined) await handlePrice(req, res, price);

  if (category) await handleCategory(req, res, category);

  if (stars) await handleStars(req, res, stars);

  if (sub) await handleSub(req, res, sub);

  if (shipping) await handleShipping(req, res, shipping);

  if (color) await handleColor(req, res, color);

  if (fabric) await handleFabric(req, res, fabric);
};
