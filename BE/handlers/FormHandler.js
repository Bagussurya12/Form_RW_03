import mongoose from "mongoose";
import Form from "../models/Form.js";
import User from "../models/User.js";

class FormHandler {
  async AddFormHandler(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.id,
        title: "UNTITLED FORM",
        description: null,
        public: true,
      });
      if (!form) {
        throw { code: 400, message: "FORM_CREATE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "CREATE_FORM_SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetFormHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "ID_FORM_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({ _id: req.params.id, userId: req.jwt.id });
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }
      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_FORM",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async UpdateFormHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, req.body, { new: true });
      if (!form) {
        throw { code: 400, message: "FORM_UPDATE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "UPDATE_FORM_SUCCESS",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async DeleteFormHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOneAndDelete({ _id: req.params.id, userId: req.jwt.id });
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }
      return res.status(200).json({
        status: true,
        message: "DELETE_FORM_SUCCESS",
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetAllFormHandlerByUser(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const forms = await Form.paginate({ userId: req.jwt.id }, { limit: limit, page: page });
      if (!forms) {
        throw { code: 404, message: "FORMS_NOT_FOUND" };
      }
      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_FORMS",
        total: forms.length,
        forms,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async GetFormHandlerToUser(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "ID_FORM_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({ _id: req.params.id });
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }
      if (req.jwt.id != form.userId && form.public === false) {
        const user = await User.findOne({ _id: req.jwt.id });
        if (!form.invites.includes(user.email)) {
          throw { code: 401, message: "YOUR_NOT_INVITES" };
        }
      }
      form.invites = [];
      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_FORM",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new FormHandler();
