import { Router } from "express";
import { cadastroSchema, loginSchema } from "@salao/shared";
import { validarBody } from "../middlewares/validarSchema";
import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/cadastro", validarBody(cadastroSchema), authController.cadastro);
router.post("/login", validarBody(loginSchema), authController.login);

export default router;
