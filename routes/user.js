const express = require("express");

const router = express.Router();

router.get("/user", (req, res) => {
  res.json({
    data: "response from /user",
  });
});

module.exports = router;
