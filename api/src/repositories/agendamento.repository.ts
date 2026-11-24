import type { AgendamentoInput } from "@salao/shared";
import { prisma } from "../lib/prisma";

// "include" faz o Prisma trazer, junto com o agendamento, os dados das 3 tabelas ligadas.
// Assim a lista mostra o NOME do cliente, do profissional e do serviço (e não só os ids).
const incluir = {
  cliente: { select: { id: true, nome: true } },
  profissional: { select: { id: true, nome: true } },
  servico: { select: { id: true, nome: true, preco: true, duracaoMin: true } },
};

// O Zod entrega a data como texto; o banco quer um objeto Date.
const paraBanco = (dados: AgendamentoInput) => ({ ...dados, dataHora: new Date(dados.dataHora) });

export const agendamentoRepository = {
  listar: () => prisma.agendamento.findMany({ include: incluir, orderBy: { dataHora: "asc" } }),

  buscarPorId: (id: number) => prisma.agendamento.findUnique({ where: { id }, include: incluir }),

  criar: (dados: AgendamentoInput) => prisma.agendamento.create({ data: paraBanco(dados), include: incluir }),

  atualizar: (id: number, dados: AgendamentoInput) =>
    prisma.agendamento.update({ where: { id }, data: paraBanco(dados), include: incluir }),

  remover: (id: number) => prisma.agendamento.delete({ where: { id } }),
};
