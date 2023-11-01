import mongoose from "mongoose";
import Form from "../models/Form.js";
import User from "../models/User.js";

class InviteControler {
  async postInviteHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "REQUIRED_EMAIL" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      // CHECK USER CANT INVITE HIM SELF
      const user = await User.findOne({ _id: req.jwt.id, email: req.body.email });
      if (user) {
        throw { code: 400, message: "CANT_INVITE_YOUR_SELF" };
      }
      // CHECK IS EMAIL INVITED
      const emailInvited = await Form.findOne({ _id: req.params.id, userId: req.jwt.id, invites: { $in: req.body.email } });
      if (emailInvited) {
        throw { code: 400, message: "EMAIL_ALREADY_INVITED" };
      }
      //   Check Kevalidan Email
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email) === false) {
        throw { code: 400, message: "INVALID_EMAIL" };
      }
      const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, { $push: { invites: req.body.email } }, { new: true });
      if (!form) {
        throw { code: 404, message: "INVITE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "INVITE_SUCCESS",
        email: req.body.email,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async deleteInviteHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "REQUIRED_EMAIL" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      // Email not Exist
      const emailExist = await Form.findOne({ _id: req.params.id, userId: req.jwt.id, invites: { $in: req.body.email } });
      if (!emailExist) {
        throw { code: 404, message: "EMAIL_NOT_FOUND" };
      }
      const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, { $pull: { invites: req.body.email } }, { new: true });
      if (!form) {
        throw { code: 500, message: "REMOVE_INVITED_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "REMOVE_INVITED_SUCCESS",
        email: req.body.email,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async getInviteHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      // Email not Exist
      const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id }).select("invites");
      if (!form) {
        throw { code: 404, message: "INVITE_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "GET_INVITED_SUCCESS",
        invites: form.invites,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}
export default new InviteControler();
