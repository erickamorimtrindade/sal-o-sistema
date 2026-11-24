import type { Request, Response } from "express";
import { lerId } from "../lib/errors";
import { profissionalService } from "../services/profissional.service";

export const profissionalController = {
  async listar(_req: Request, res: Response) {
    res.json(await profissionalService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await profissionalService.buscarPorId(lerId(req.params.id)));
  },

  async criar(req: Request, res: Response) {
    const profissional = await profissionalService.criar(req.body);
    res.status(201).json(profissional);
  },

  async atualizar(req: Request, res: Response) {
    res.json(await profissionalService.atualizar(lerId(req.params.id), req.body));
  },

  async remover(req: Request, res: Response) {
    await profissionalService.remover(lerId(req.params.id));
    res.status(204).send();
  },
};
