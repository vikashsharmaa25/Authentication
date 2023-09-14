// auth , isAdmin , isStudent
const jwt = require("jsonwebtoken");
require("dotenv").config();
//================================================= authmiddleware ====================================================//

exports.authmiddleware = (req, res, next) => {
  try {
    // extract jwt token from yeen jagh cookie se body requiest se or header se
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Aurthorization").replace("Bearer", "");

    // agar token nhi mila to
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // ager token mill gya to check krenge valid token hai ki nahi
    // verify the token
    try {
      // payload mean pahle decode likha tha
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);
      req.user = payload; // decode or payload data ke ko req ke sath store kr  liyaa kyuki yaha se pata lgega ki role kaya hai admin hai ya student hai ya kuch aur
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "sonmthing error",
    });
  }
};

//================================================= Student ====================================================//

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(400).json({
        success: false,
        message: "somthing while wrong while verifying token",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      message: "user role not match",
    });
  }
};

//================================================= Admin ====================================================//

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(400).json({
        success: false,
        message: "this is protected route for admin",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      message: "sonmthing error",
    });
  }
  next();
};
