import { Router } from "express";
import { servicoSchema } from "@salao/shared";
import { validarBody } from "../middlewares/validarSchema";
import { servicoController } from "../controllers/servico.controller";

const router = Router();

router.get("/", servicoController.listar);
router.get("/:id", servicoController.buscarPorId);
router.post("/", validarBody(servicoSchema), servicoController.criar);
router.put("/:id", validarBody(servicoSchema), servicoController.atualizar);
router.delete("/:id", servicoController.remover);

export default router;
