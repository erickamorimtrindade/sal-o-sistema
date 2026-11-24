import type { Request, Response } from "express";
import { lerId } from "../lib/errors";
import { servicoService } from "../services/servico.service";

export const servicoController = {
  async listar(_req: Request, res: Response) {
    res.json(await servicoService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await servicoService.buscarPorId(lerId(req.params.id)));
  },

  async criar(req: Request, res: Response) {
    const servico = await servicoService.criar(req.body);
    res.status(201).json(servico);
  },

  async atualizar(req: Request, res: Response) {
    res.json(await servicoService.atualizar(lerId(req.params.id), req.body));
  },

  async remover(req: Request, res: Response) {
    await servicoService.remover(lerId(req.params.id));
    res.status(204).send();
  },
};
