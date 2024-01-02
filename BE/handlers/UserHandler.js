import User from "../models/User.js";
import bcrypt from "bcrypt";
import { isEmailExist, isEmailExistWithUserId } from "../library/EmailExist.js";

const getAllUserHandler = async (req, res) => {
  try {
    let find = {
      fullname: { $regex: `^${req.query.search}`, $options: "i" },
    };

    let options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };

    const users = await User.paginate(find, options);
    if (!users) {
      throw { code: 404 || 500, message: "USERS_NOT_FOUND" || "GET_USERS_FAILED" };
    }
    return res.status(200).json({
      status: true,
      total: users.length,
      users,
    });
  } catch (error) {
    if (!error.code) {
      error.code = 500;
    }
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const addUserHandler = async (req, res) => {
  try {
    if (!req.body.fullname) {
      throw { code: 428, message: "FULLNAME_IS_REQUIRED" };
    }
    if (!req.body.email) {
      throw { code: 428, message: "email_IS_REQUIRED" };
    }
    if (!req.body.password) {
      throw { code: 428, message: "password_IS_REQUIRED" };
    }
    if (!req.body.role) {
      throw { code: 428, message: "role_IS_REQUIRED" };
    }

    if (req.body.password !== req.body.password.retype_password) {
      throw { code: 428, message: "PASSWORD_IS_MUST_MATCH" };
    }
    const emailExist = await isEmailExist(req.body.email);

    if (emailExist) {
      throw {
        code: 409,
        message: "EMAIL_EXIST",
      };
    }

    //   HASH PASSWORD
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash,
      role: req.body.role,
    });
    const user = await newUser.save();
    if (!user) {
      throw { code: 500, message: "USER_REGISTER_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "USER_REGISTER_SUCCESS",
      user,
    });
  } catch (error) {
    if (!error.code) {
      error.code = 500;
    }
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const updateUserHandler = async (req, res) => {
  try {
    if (req.params.id) {
      throw {
        code: 428,
        message: "ID_IS_REQUIRED",
      };
    }
    if (!req.body.fullname) {
      throw { code: 428, message: "FULLNAME_IS_REQUIRED" };
    }
    if (!req.body.email) {
      throw { code: 428, message: "email_IS_REQUIRED" };
    }
    if (!req.body.password) {
      throw { code: 428, message: "password_IS_REQUIRED" };
    }
    if (!req.body.role) {
      throw { code: 428, message: "role_IS_REQUIRED" };
    }
    if (req.body.password !== req.body.retype_password) {
      throw { code: 428, message: "PASSWORD_MUST_MATCH" };
    }
    const email = await isEmailExistWithUserId(req.params.id, req.body.email);
    if (email) {
      throw { code: 428, message: "EMAIL_EXIST" };
    }
    let fields = {};
    (fields.fullname = req.body.fullname), (fields.email = req.body.email), (fields.role = req.body.role);

    if (req.body.password) {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      fields.password = hash;
    }
    const user = await User.findByIdAndUpdate(req.params.id, fields, { new: true });
    if (!user) {
      throw { code: 500, message: "USER_UPDATE_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "USER_UPDATE_SUCCESS",
      user: user,
    });
  } catch (error) {
    if (!error.code) {
      error.code = 500;
    }
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      throw { code: 404, message: "USER_NOT_FOUND" };
    }
    return res.status(200).json({
      status: true,
      message: "GET_USER_SUCCESS",
      user: user,
    });
  } catch (error) {
    if (!error.code) {
      error.code = 500;
    }
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteUserByIdHandler = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw { code: 500, message: "DELETE_USER_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "SUCCESS_DELETE_USER",
      user,
    });
  } catch (error) {
    if (!error.code) {
      error.code = 500;
    }
    return res.status(error.code).json({
      status: false,
      message: error.message,
    });
  }
};

const getProfileById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      throw { code: 404, message: "USER_NOT_FOUND" };
    }
    return res.statu(200).json({
      status: true,
      user: user,
    });
  } catch (error) {
    if (!err.code) {
      err.code = 500;
    }
    console.log(err);
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export { getAllUserHandler, addUserHandler, updateUserHandler, getUserById, deleteUserByIdHandler, getProfileById };
