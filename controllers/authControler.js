const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.signupController = async (req, res) => {
  try {
    //fetch data from model
    const { name, email, password, role } = req.body;

    // if user is already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already present",
      });
    }

    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create entry in database or entry store jo bhi admi signup krega uska data db me store ho gya
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      success: true,
      message: "user register successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "user can not be register",
    });
  }
};

//login
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check user alredy login or not
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Please Register first",
      });
    }

    // if already resister now match the password
    //   const match = await bcrypt.compare(password, user.password);
    //   if (!match) {
    //     return res.status(500).json({
    //       success: false,
    //       message: "Incorrect Password",
    //     });
    //   }
    //   // now password is matched and you have loged in
    //   res.status(200).json({
    //     success: true,
    //     message: "login successfully",
    //   });

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    if (await bcrypt.compare(password, user.password)) {
      // lets agar password match kar gye to login karaynege jwt or ckookies ke help se
      //  yaha token create kiya
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user = user.toObject();
      user.token = token; // ye token ko user ke andar token name field bana ke token dal diya
      user.password = undefined; // ye se password hata denge object se hataya db se nhi

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User loged in successfully",
      });
    } else {
      // else case me password do not match
      res.status(500).json({
        success: false,
        message: "password do not match",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "error while login",
    });
    console.log(err);
  }
};
