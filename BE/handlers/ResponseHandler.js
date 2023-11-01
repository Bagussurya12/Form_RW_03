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
      const form = await Form.findOne({ _id: req.params.formId, userId: req.jwt.id });
      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }
      const answers = await Answer.find({ formId: req.params.formId });
      if (!answers) {
        throw { code: 404, message: "ANSWER_NOT_FOUND" };
      }
      return res.status(200).json({
        status: false,
        message: "GET_ANSWER_SUCCESS",
        total: `${answers.length} Answers`,
        form,
        answers,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
        question: error.question || null,
      });
    }
  }
}
export default new ResponseHandler();
