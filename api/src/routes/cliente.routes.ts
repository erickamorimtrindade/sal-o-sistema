import { Router } from "express";
import { clienteSchema } from "@salao/shared";
import { validarBody } from "../middlewares/validarSchema";
import { clienteController } from "../controllers/cliente.controller";

const router = Router();

router.get("/", clienteController.listar);
router.get("/:id", clienteController.buscarPorId);
router.post("/", validarBody(clienteSchema), clienteController.criar);
router.put("/:id", validarBody(clienteSchema), clienteController.atualizar);
router.delete("/:id", clienteController.remover);

export default router;
