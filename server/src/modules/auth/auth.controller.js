import {
  registerUser,
  loginUser,
} from "./auth.service.js";


// ==========================================
// REGISTER
// ==========================================

export const register = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;


    if (
      !name?.trim() ||
      !email?.trim() ||
      !password
    ) {

      return res
        .status(400)
        .json({
          success: false,
          message:
            "Name, email and password are required",
        });

    }


    if (password.length < 8) {

      return res
        .status(400)
        .json({
          success: false,
          message:
            "Password must be at least 8 characters",
        });

    }


    const result =
      await registerUser({
        name,
        email,
        password,
      });


    return res
      .status(201)
      .json({
        success: true,
        message:
          "Account created",
        data:
          result,
      });


  } catch (error) {

    console.error(
      "Registration failed:",
      error
    );


    const status =
      error.message.includes(
        "already exists"
      )
        ? 409
        : 500;


    return res
      .status(status)
      .json({
        success: false,
        message:
          error.message ||
          "Registration failed",
      });
  }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;


    if (
      !email?.trim() ||
      !password
    ) {

      return res
        .status(400)
        .json({
          success: false,
          message:
            "Email and password are required",
        });

    }


    const result =
      await loginUser({
        email,
        password,
      });


    return res
      .status(200)
      .json({
        success: true,
        message:
          "Login successful",
        data:
          result,
      });


  } catch (error) {

    console.error(
      "Login failed:",
      error
    );


    const status =
      error.message ===
      "Invalid email or password"
        ? 401
        : 500;


    return res
      .status(status)
      .json({
        success: false,
        message:
          error.message ||
          "Login failed",
      });
  }
};