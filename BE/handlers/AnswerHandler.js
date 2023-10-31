import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";
import answerDuplicate from "../library/AnswerDuplicate.js";
import questionRequireButEmpty from "../library/QuestionRequiredButEmpty.js";
import optionValueNotExist from "../library/OptionValueNotExist.js";

class AnswerHandler {
  async postAnswerHandler(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "IREQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const form = await Form.findById(req.params.formId);
      // pengecekan bila jawaban / Answer terduplikat (Library AnswerDuplicate.js)
      const isDuplicate = await answerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "DUPLICATE_ANSWER" };
      }
      // Pengecekan jika jawaban kosong (Library questionRequireButEmpty.js)
      const questionRequireEmpty = await questionRequireButEmpty(form, req.body.answers);
      if (questionRequireEmpty) {
        throw { code: 400, message: "QUESTION_REQUIRED_EMPTY" };
      }
      // Pengecekan Opsi
      const optionNotExist = await optionValueNotExist(form, req.body.answers);
      if (optionNotExist) {
        throw { code: 400, message: "OPTION_VALUE_IS_NOT_EXIST" };
      }
      let fields = {};
      req.body.answers.forEach((answer) => {
        fields[answer.questionId] = answer.value;
      });
      const answers = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.id,
        ...fields,
      });
      if (!answers) {
        throw { code: 400, message: "ANSWER_FAILED" };
      }
      return res.status(200).json({
        status: true,
        message: "CREATE_ANSWER_SUCCESS",
        answers,
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AnswerHandler();
