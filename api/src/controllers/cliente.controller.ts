import type { Request, Response } from "express";
import { lerId } from "../lib/errors";
import { clienteService } from "../services/cliente.service";

export const clienteController = {
  async listar(_req: Request, res: Response) {
    res.json(await clienteService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await clienteService.buscarPorId(lerId(req.params.id)));
  },

  async criar(req: Request, res: Response) {
    const cliente = await clienteService.criar(req.body);
    res.status(201).json(cliente);
  },

  async atualizar(req: Request, res: Response) {
    res.json(await clienteService.atualizar(lerId(req.params.id), req.body));
  },

  async remover(req: Request, res: Response) {
    await clienteService.remover(lerId(req.params.id));
    res.status(204).send();
  },
};
