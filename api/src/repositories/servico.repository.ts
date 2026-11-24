import type { ServicoInput } from "@salao/shared";
import { prisma } from "../lib/prisma";

export const servicoRepository = {
  listar: () => prisma.servico.findMany({ orderBy: { nome: "asc" } }),

  buscarPorId: (id: number) => prisma.servico.findUnique({ where: { id } }),

  criar: (dados: ServicoInput) => prisma.servico.create({ data: dados }),

  atualizar: (id: number, dados: ServicoInput) => prisma.servico.update({ where: { id }, data: dados }),

  remover: (id: number) => prisma.servico.delete({ where: { id } }),
};
