import express from "express";
import AuthHandler from "../handlers/AuthHandler.js";

const router = express.Router();

router.post("/register", AuthHandler.register);

export default router;
