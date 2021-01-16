const Product = require("../models/product");
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
  let products = await Product.find()
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
      err: err.message
    })
  }
};
