import type { ClienteInput } from "@salao/shared";
import { prisma } from "../lib/prisma";

export const clienteRepository = {
  listar: () => prisma.cliente.findMany({ orderBy: { nome: "asc" } }),

  buscarPorId: (id: number) => prisma.cliente.findUnique({ where: { id } }),

  criar: (dados: ClienteInput) => prisma.cliente.create({ data: dados }),

  atualizar: (id: number, dados: ClienteInput) => prisma.cliente.update({ where: { id }, data: dados }),

  remover: (id: number) => prisma.cliente.delete({ where: { id } }),
};
