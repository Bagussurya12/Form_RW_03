import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionsHandlers {
  async postOptionsHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!req.body.option) {
        throw { code: 400, message: "REQUIRED_OPTIONS" };
      }
      const option = {
        id: new mongoose.Types.ObjectId(),
        value: req.body.option,
      };
      const form = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { "questions.$[indexQuestion].options": option } },
        { arrayFilters: [{ "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId) }], new: true }
      );
      if (!form) {
        throw { code: 400, message: "ADD_OPTIONS_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "ADD_OPTION_SUCCESS",
        option,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async updateOptionsHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }
      if (!req.params.optionId) {
        throw { code: 400, message: "REQUIRED_OPTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 400, message: "INVALID_OPTION_ID" };
      }
      if (!req.body.option) {
        throw { code: 400, message: "REQUIRED_OPTION" };
      }

      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $set: { "questions.$[indexQuestion].options.$[indexOption].value": req.body.option } },
        {
          arrayFilters: [{ "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId) }, { "indexOption.id": new mongoose.Types.ObjectId(req.params.optionId) }],
          new: true,
        }
      );
      if (!question) {
        throw { code: 500, message: "UPDATE_OPTIONS_FAILED" };
      }
      res.status(200).json({
        status: true,
        message: "UPDATE_OPTION_SUCCESS",
        option: {
          id: req.params.optionId,
          value: req.body.option,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new OptionsHandlers();
