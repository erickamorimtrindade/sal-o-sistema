import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/errors";

// Último da fila: qualquer erro lançado nas camadas cai aqui e vira uma resposta clara.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Erros que nós mesmos lançamos (404, 401, 409...)
  if (err instanceof AppError) {
    res.status(err.status).json({ erro: err.message, campos: err.campos });
    return;
  }

  // JSON quebrado no corpo da requisição
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
    return;
  }

  // Erros do Prisma (banco)
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: valor repetido em campo @unique
    if (err.code === "P2002") {
      const alvo = (err.meta?.target as string[] | undefined) ?? [];
      const campos: Record<string, string> = {};
      for (const campo of alvo) campos[campo] = "Já existe um registro com este valor";
      res.status(409).json({ erro: `Valor repetido em: ${alvo.join(", ") || "campo único"}`, campos });
      return;
    }
    // P2003: chave estrangeira (apontar para algo que não existe, ou apagar algo em uso)
    if (err.code === "P2003") {
      res.status(409).json({ erro: "Operação bloqueada: há registros relacionados a este item" });
      return;
    }
    // P2025: registro não encontrado
    if (err.code === "P2025") {
      res.status(404).json({ erro: "Registro não encontrado" });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor" });
};
