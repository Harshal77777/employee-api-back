const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(model) {
  const hashPassword = await bcrypt.hash(model.password, 10);
  const user = new User({
    name: model.name,
    email: model.email,
    password: hashPassword,
    isAdmin: model.isAdmin || false, // Default isAdmin to false
  });

  await user.save();
}

async function loginUser(model) {
  const user = await User.findOne({ email: model.email });
  if (!user) {
    return null;
  }

  const isMatched = await bcrypt.compare(model.password, user.password);
  if (isMatched) {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return { token, user };
  } else {
    return null;
  }
}

module.exports = { registerUser, loginUser };
