import express from "express";
import AuthHandler from "../handlers/AuthHandler.js";
import jwtAuth from "../middlewares/JwtAuth.js";
import FormHandler from "../handlers/FormHandler.js";
import QuestionsHandlers from "../handlers/QuestionsHandlers.js";
import OptionsHandlers from "../handlers/OptionsHandler.js";
import AnswerHandler from "../handlers/AnswerHandler.js";

const router = express.Router();

// AUTH ROUTER
router.post("/register", AuthHandler.register);
router.post("/login", AuthHandler.login);
router.post("/refreshToken", jwtAuth(), AuthHandler.refreshToken);

// FORM ROUTER
router.post("/form", jwtAuth(), FormHandler.AddFormHandler);
router.get("/form/:id", jwtAuth(), FormHandler.GetFormHandler);
router.put("/form/:id", jwtAuth(), FormHandler.UpdateFormHandler);
router.delete("/form/:id", jwtAuth(), FormHandler.DeleteFormHandler);
router.get("/forms", jwtAuth(), FormHandler.GetAllFormHandlerByUser);
router.get("/form/:id/users", jwtAuth(), FormHandler.GetFormHandlerToUser);

// Questions Routes
router.post("/form/:id/questions", jwtAuth(), QuestionsHandlers.postQuestionHandler);
router.put("/form/:id/questions/:questionId", jwtAuth(), QuestionsHandlers.updateQuestionHandler);
router.delete("/form/:id/questions/:questionId", jwtAuth(), QuestionsHandlers.deleteQuestionHandler);
router.get("/form/:id/questions", jwtAuth(), QuestionsHandlers.getQuestionHandler);

// Option Routes
router.post("/form/:id/questions/:questionId/options", jwtAuth(), OptionsHandlers.postOptionsHandler);
router.put("/form/:id/questions/:questionId/options/:optionId", jwtAuth(), OptionsHandlers.updateOptionsHandler);
router.delete("/form/:id/questions/:questionId/options/:optionId", jwtAuth(), OptionsHandlers.deleteOptionHandler);

// ANSWER ROUTES
router.post("/answers/:formId", jwtAuth(), AnswerHandler.postAnswerHandler);
export default router;
