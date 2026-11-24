import type { Request, Response } from "express";
import { lerId } from "../lib/errors";
import { agendamentoService } from "../services/agendamento.service";

export const agendamentoController = {
  async listar(_req: Request, res: Response) {
    res.json(await agendamentoService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await agendamentoService.buscarPorId(lerId(req.params.id)));
  },

  async criar(req: Request, res: Response) {
    const agendamento = await agendamentoService.criar(req.body);
    res.status(201).json(agendamento);
  },

  async atualizar(req: Request, res: Response) {
    res.json(await agendamentoService.atualizar(lerId(req.params.id), req.body));
  },

  async remover(req: Request, res: Response) {
    await agendamentoService.remover(lerId(req.params.id));
    res.status(204).send();
  },
};
