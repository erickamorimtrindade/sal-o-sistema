import type { ProfissionalInput } from "@salao/shared";
import { prisma } from "../lib/prisma";

export const profissionalRepository = {
  listar: () => prisma.profissional.findMany({ orderBy: { nome: "asc" } }),

  buscarPorId: (id: number) => prisma.profissional.findUnique({ where: { id } }),

  criar: (dados: ProfissionalInput) => prisma.profissional.create({ data: dados }),

  atualizar: (id: number, dados: ProfissionalInput) => prisma.profissional.update({ where: { id }, data: dados }),

  remover: (id: number) => prisma.profissional.delete({ where: { id } }),
};
