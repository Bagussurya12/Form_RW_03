import express from "express";
import AuthHandler from "../handlers/AuthHandler.js";

const router = express.Router();

router.post("/register", AuthHandler.register);
router.post("/login", AuthHandler.login);

export default router;
