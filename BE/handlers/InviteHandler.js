import mongoose from "mongoose";
import Form from "../models/Form.js";

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
}
export default new InviteControler();
