const router = require("express").Router();
const authController = require("../controllers/authControler");

const { authmiddleware } = require("../middlewares/middleware");

router.post("/signup", authController.signupController);
router.post("/login", authController.loginController);

// protected middleware //

router.get("/test", authmiddleware, (req, res) => {
  res.json({
    success: true,
    message: "this is for test",
  });
});

module.exports = router;
