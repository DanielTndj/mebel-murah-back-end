const admin = require("../firebase");

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
