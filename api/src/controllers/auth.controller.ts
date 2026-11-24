import type { Request, Response } from "express";
import { authService } from "../services/auth.service";

// Camada HTTP: lê a requisição, chama o service, devolve a resposta com o status certo.
export const authController = {
  async cadastro(req: Request, res: Response) {
    const usuario = await authService.cadastrar(req.body);
    res.status(201).json(usuario);
  },

  async login(req: Request, res: Response) {
    const usuario = await authService.login(req.body);
    res.json(usuario);
  },
};
