import { Router } from "express";
import { profissionalSchema } from "@salao/shared";
import { validarBody } from "../middlewares/validarSchema";
import { profissionalController } from "../controllers/profissional.controller";

const router = Router();

router.get("/", profissionalController.listar);
router.get("/:id", profissionalController.buscarPorId);
router.post("/", validarBody(profissionalSchema), profissionalController.criar);
router.put("/:id", validarBody(profissionalSchema), profissionalController.atualizar);
router.delete("/:id", profissionalController.remover);

export default router;
