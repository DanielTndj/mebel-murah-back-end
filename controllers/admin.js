const Order = require("../models/order");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: product.env.EMAIL,
    pass: process.env.PASS,
  },
});

exports.orders = async (req, res) => {
  let allOrders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();

  res.json(allOrders);
};

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus, orderedBy } = req.body;

  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();

  //get email from req.body
  const userEmail = await User.findOne({ _id: orderedBy })
    .select("email")
    .exec();

  console.log("USER EMAIL", userEmail);

  const mailOptions = {
    from: product.env.EMAIL,
    to: userEmail.email,
    subject: "Your Order Status",
    text: `Your order status is ${orderStatus}. Thank you for ordering in our shop :)`,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) throw err;
    console.log("Email sent:" + info.response);
  });

  res.json(updated);
};
