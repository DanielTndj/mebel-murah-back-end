const admin = require("../firebase");
const User = require("../models/user");

exports.authCheck = async (req, res, next) => {
  // validate token using firebase admin
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);

    req.user = firebaseUser;
    next();
  } catch (error) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;
  try {
    await User.findOne({ email }).exec((err, user) => {
      if (err) throw new Error(err);

      if (user.role !== "admin") {
        res.status(403).json({
          err: "Admin resource. Access denied.",
        });
      } else {
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};
