import { Router } from "express";
import { agendamentoSchema } from "@salao/shared";
import { validarBody } from "../middlewares/validarSchema";
import { agendamentoController } from "../controllers/agendamento.controller";

const router = Router();

router.get("/", agendamentoController.listar);
router.get("/:id", agendamentoController.buscarPorId);
router.post("/", validarBody(agendamentoSchema), agendamentoController.criar);
router.put("/:id", validarBody(agendamentoSchema), agendamentoController.atualizar);
router.delete("/:id", agendamentoController.remover);

export default router;
