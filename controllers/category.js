const Category = require("../models/category");
const SubCategory = require("../models/sub-category");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await new Category({
      name,
      slug: slugify(name).toLowerCase(),
    }).save();

    res.json(newCategory);
  } catch (err) {
    console.log(err);
    res.status(400).send("Category create failed!");
  }
};

exports.list = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).exec();

    res.json(categories);
  } catch (error) {
    console.log(err);
    res.status(400).send("Categories are empty");
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug }).exec();

  const products = await Product.find({ category })
    .populate("category")
    .exec();

  res.json({ category, products });
};

exports.update = async (req, res) => {
  const { name } = req.body;
  const { slug } = req.params;

  try {
    const updated = await Category.findOneAndUpdate(
      { slug },
      { name, slug: slugify(name).toLowerCase() },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.log(error);
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedCategory = await Category.findOneAndDelete({ slug });

    res.json(deletedCategory);
  } catch (error) {
    console.log(error);
    res.status(400).send("Category delete failed");
  }
};

exports.getSubs = async (req, res) => {
  const { _id } = req.params;

  await SubCategory.find({ parent: _id }).exec((err, subs) => {
    if (err) console.log(error);
    return res.json(subs);
  });
};
