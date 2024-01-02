import mongoose from "mongoose";
import Form from "../models/Form.js";

const allowType = ["Text", "Radio", "Checkbox", "Dropdown", "Email"];

class QuestionsHandler {
  async postQuestionHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        type: "Text",
        question: null,
        options: [],
        required: false,
      };

      const question = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, { $push: { questions: newQuestion } }, { new: true });
      if (!question) {
        throw { code: 400, message: "ADD_QUESTIONS_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ADD_QUESTIONS_SUCCESS",
        question: newQuestion,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async updateQuestionHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 428, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 428, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      let field = {};
      if (req.body.hasOwnProperty("question")) {
        field["questions.$[indexQuestion].question"] = req.body.question;
      } else if (req.body.hasOwnProperty("required")) {
        field["questions.$[indexQuestion].required"] = req.body.required;
      } else if (req.body.hasOwnProperty("type")) {
        if (!allowType.includes(req.body.type)) {
          throw { code: 400, message: "INVALID_TYPE" };
        }
        field["questions.$[indexQuestion].type"] = req.body.type;
      }
      // Update Form
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $set: field },
        { arrayFilters: [{ "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId) }], new: true }
      );
      if (!question) {
        throw { code: 400, message: "QUESTIONS_UPDATE_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "QUESTIONS_UPDATE_SUCCESS",
        question,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async deleteQuestionHandler(req, res) {
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

      const question = await Form.findOneAndUpdate({ _id: req.params.id, userId: req.jwt.id }, { $pull: { questions: { id: new mongoose.Types.ObjectId(req.params.questionId) } } });
      if (!question) {
        throw { code: 400, message: "QUESTION_DELETE_FAILED" };
      }
      return res.status(200).json({
        status: false,
        message: "SUCCESS_DELETE_QUESTIONS",
        question,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async getQuestionHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
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
        message: "FORM_FOUND",
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

export default new QuestionsHandler();
