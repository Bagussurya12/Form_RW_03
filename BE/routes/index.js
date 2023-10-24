import express from "express";
import AuthHandler from "../handlers/AuthHandler.js";
import jwtAuth from "../middlewares/JwtAuth.js";
import FormHandler from "../handlers/FormHandler.js";

const router = express.Router();

router.post("/register", AuthHandler.register);
router.post("/login", AuthHandler.login);
router.post("/refreshToken", jwtAuth(), AuthHandler.refreshToken);

router.post("/form", jwtAuth(), FormHandler.AddFormHandler);
router.get("/form/:id", jwtAuth(), FormHandler.GetFormHandler);
router.put("/form/:id", jwtAuth(), FormHandler.UpdateFormHandler);
router.delete("/form/:id", jwtAuth(), FormHandler.DeleteFormHandler);
router.get("/forms", jwtAuth(), FormHandler.GetAllFormHandlerByUser);

export default router;
