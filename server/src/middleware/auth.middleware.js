import jwt from "jsonwebtoken";

import User from "../modules/user/user.model.js";


export const requireAuth = async (
  req,
  res,
  next
) => {

  try {

    const header =
      req.headers.authorization;


    if (
      !header ||
      !header.startsWith(
        "Bearer "
      )
    ) {

      return res
        .status(401)
        .json({
          success: false,
          message:
            "Authentication required",
        });

    }


    const token =
      header.split(" ")[1];


    const payload =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    const user =
      await User.findById(
        payload.userId
      ).select(
        "_id name email"
      );


    if (!user) {

      return res
        .status(401)
        .json({
          success: false,
          message:
            "User no longer exists",
        });

    }


    req.user = user;

    next();


  } catch (error) {

    return res
      .status(401)
      .json({
        success: false,
        message:
          "Invalid or expired session",
      });

  }
};