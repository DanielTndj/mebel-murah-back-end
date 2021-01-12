const SubCategory = require("../models/sub-category");
const slugify = require("slugify");

exports.create = async (req, res) => {
  const { name, parent } = req.body;

  try {
    const newCategory = await new SubCategory({
      name,
      slug: slugify(name).toLowerCase(),
      parent,
    }).save();

    res.json(newCategory);
  } catch (err) {
    res.status(400).send("Sub category create failed!");
  }
};

exports.list = async (req, res) => {
  try {
    const subs = await SubCategory.find().sort({ createdAt: -1 }).exec();

    res.json(subs);
  } catch (error) {
    res.status(400).send("Sub category are empty");
  }
};

exports.read = async (req, res) => {
  const { slug } = req.params;
  try {
    const sub = await SubCategory.findOne({ slug }).exec();

    res.json(sub);
  } catch (error) {
    res.status(400).send("Sub category not found");
  }
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  const { slug } = req.params;

  try {
    const updated = await SubCategory.findOneAndUpdate(
      { slug },
      { name, parent, slug: slugify(name).toLowerCase() },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).send("Sub category Update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedSub = await SubCategory.findOneAndDelete({ slug });

    res.json(deletedSub);
  } catch (error) {
    res.status(400).send("Sub category Delete failed");
  }
};
