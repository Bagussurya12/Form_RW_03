import User from "../models/User.js";
import isEmailExist from "../library/EmailExist.js";
import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import dotenv from "dotenv";
import isEmailValid from "../library/isEmailValid.js";

const env = dotenv.config().parsed;

const generateAccessToken = async (payload) => {
  return jsonWebToken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: env.JWT_ACCESS_TOKEN_LIFE });
};
const generateRefreshToken = async (payload) => {
  return jsonWebToken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: env.JWT_REFRESH_TOKEN_LIFE });
};
class AuthHandler {
  // Register Handler
  async register(req, res) {
    try {
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!isEmailValid(req.body.email)) {
        throw { code: 400, message: "EMAIL_INVALID" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      if (req.body.password.length <= 6) {
        throw { code: 400, message: "PASSWORD_MINIMUM_7_CHARACTER" };
      }
      const emailExist = await isEmailExist(req.body.email);
      if (emailExist) {
        throw { code: 409, message: "EMAIL_ALREADY_EXIST" };
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });
      if (!user) {
        throw { code: 500, message: "USER_REGISTER_FAILED" };
      }
      // Generate Token
      let payload = { id: user._id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "USER_REGISTER_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({ status: false, message: error.message });
    }
  }
  // Login Handler
  async login(req, res) {
    try {
      if (!req.body.email) {
        throw { code: 428, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 428, message: "PASSWORD_IS_REQUIRED" };
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }
      const isPasswordValid = await bcrypt.compareSync(req.body.password, user.password);
      if (!isPasswordValid) {
        throw { code: 403, message: "INVALID_PASSWORD" };
      }
      let payload = { id: user._id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      return res.status(200).json({
        status: true,
        message: "LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  // Refresh Token
  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "REFRESH_TOKEN_IS_REQUIRED" };
      }
      const verify = await jsonWebToken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET);

      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error.message == "jwt expired") {
        error.message = "REFRESH_TOKEN_EXPIRED";
      } else if (error.message == "invalid signature" || error.message == "jwt malformed" || error.message == "jwt must be provided" || error.message == "invalid token") {
        error.message = "INVALID_REFRESH_TOKEN";
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthHandler();
