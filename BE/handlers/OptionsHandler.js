import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionsHandlers {
  // ADD OPTIONS
  async postOptionsHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 428, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 4280, message: "INVALID_ID" };
      }

      let option = {
        id: new mongoose.Types.ObjectId(),
        value: req.body.options,
      };
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $push: { "questions.$[inner].options": option } },
        { arrayFilters: [{ "inner.id": new mongoose.Types.ObjectId(req.params.questionId) }], new: true }
      );
      if (!question) {
        throw { code: 500, message: "ADD_OPTIONS_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "ADD_OPTION_SUCCESS",
        option,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async updateOptionsHandler(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 428, message: "FORM_ID_REQUIRED" };
      }
      if (!req.params.questionId) {
        throw { code: 428, message: "QUESTION_ID_REQUIRED" };
      }
      if (!req.params.optionId) {
        throw { code: 428, message: "OPTION_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 428, message: "INVALID_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 400, message: "OPTION_ID_REQUIRED" };
      }

      //update form
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        { $set: { "questions.$[indexQuestion].options.$[indexOption].value": req.body.options } },
        {
          arrayFilters: [{ "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId) }, { "indexOption.id": new mongoose.Types.ObjectId(req.params.optionId) }],
          new: true,
        }
      );
      // const question = await Form.findOneAndUpdate(
      //   { _id: req.params.id, userId: req.jwt.id },
      //   {
      //     $set: {
      //       "questions.$[indexQuestion].options.$[indexOption].value": req.body.options,
      //     },
      //   },
      //   {
      //     arrayFilters: [
      //       { "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId) },
      //       { "indexOption.id": new mongoose.Types.ObjectId(req.params.optionId) },
      //     ],
      //     new: true,
      //   },
      // );
      if (!question) {
        throw { code: 500, message: "UPDATE_OPTIONS_FAILED" };
      }

      res.status(200).json({
        status: true,
        message: "UPDATE_OPTIONS_SUCCESS",
        option: {
          id: req.params.optionId,
          value: req.body.options,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async deleteOptionHandler(req, res) {
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
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.id },
        {
          $pull: {
            "questions.$[indexQuestion].options": { id: new mongoose.Types.ObjectId(req.params.optionId) },
          },
        },
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(req.params.questionId),
            },
          ],
          new: true,
        }
      );
      if (!question) {
        throw { code: 500, message: "DELETE_OPTIONS_FAILED" };
      }
      res.status(200).json({
        status: true,
        message: "DELETE_OPTION_SUCCESS",
        question,
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
