const Order = require("../models/order");
const User = require("../models/user");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
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
  let message = "";

  if (orderStatus === "Processing") {
    message = `Orderan anda sedang kami proses. Terima kasih telah berbelanja di toko kami.`;
  }

  if (orderStatus === "Dispatched") {
    message = `Orderan anda sedang sedang dalam pengiriman oleh tim kami. Terima kasih telah berbelanja di toko kami.`;
  }

  if (orderStatus === "Cancelled") {
    message = `Maaf orderan anda tidak bisa kami proses, karena alamat diluar jangkauan tim kami. Terima kasih telah berbelanja di toko kami.`;
  }

  if (orderStatus === "Completed") {
    message = `Orderan anda sudah sampai ditujuan, silahkan cek kembali barang pesanan anda. Terima kasih telah berbelanja di toko kami.`;
  }

  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();

  //get email from req.body
  const userEmail = await User.findOne({ _id: orderedBy })
    .select("email")
    .exec();

  // console.log("USER EMAIL", userEmail);

  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail.email,
    subject: "Status Pesanan",
    text: message,
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) throw err;
    console.log("Email sent:" + info.response);
  });

  res.json(updated);
};
