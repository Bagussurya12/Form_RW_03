import moongose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";

class ResponseHandler {
  async listDataHandler(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!moongose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      const form = await Form.findOne({ _id: req.params.formId, userId: req.jwt.id }).populate("answers");
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      return res.status(200).json({
        status: false,
        message: "GET_ANSWER_SUCCESS",
        form,
        total: `${form.answers.length} Answers`,
        answers: form.answers,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
  async getSummaries(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!moongose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findOne({ _id: req.params.formId, userId: req.jwt.id }).populate("answers");
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      const summaries = form.questions.map((question) => {
        const summary = {
          questionId: question.id,
          question: question.question,
          type: question.type,
          answers: form.answers.map((answer) => answer[question.id]),
        };
        return summary;
      });

      return res.status(200).json({
        status: false,
        message: "GET_SUMMARIES_SUCCESS",
        summaries,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}
export default new ResponseHandler();
