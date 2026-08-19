import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../user/user.model.js";


const createToken = (user) => {
  return jwt.sign(
    {
      userId: user._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "7d",
    }
  );
};


// ==========================================
// REGISTER
// ==========================================

export const registerUser = async ({
  name,
  email,
  password,
}) => {

  const normalizedEmail =
    email.trim().toLowerCase();


  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });


  if (existingUser) {
    throw new Error(
      "An account with this email already exists"
    );
  }


  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );


  const user =
    await User.create({
      name: name.trim(),

      email:
        normalizedEmail,

      passwordHash,
    });


  const token =
    createToken(user);


  return {
    token,

    user: {
      id:
        user._id.toString(),

      name:
        user.name,

      email:
        user.email,
    },
  };
};


// ==========================================
// LOGIN
// ==========================================

export const loginUser = async ({
  email,
  password,
}) => {

  const normalizedEmail =
    email.trim().toLowerCase();


  const user =
    await User.findOne({
      email:
        normalizedEmail,
    });


  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }


  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash
    );


  if (!passwordMatches) {
    throw new Error(
      "Invalid email or password"
    );
  }


  const token =
    createToken(user);


  return {
    token,

    user: {
      id:
        user._id.toString(),

      name:
        user.name,

      email:
        user.email,
    },
  };
};