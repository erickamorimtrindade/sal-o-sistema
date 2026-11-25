import type { STATUS_AGENDAMENTO } from "@salao/shared";

export type StatusAgendamento = (typeof STATUS_AGENDAMENTO)[number];

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  criadoEm: string;
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
}

export interface Profissional {
  id: number;
  nome: string;
  especialidade: string;
}

export interface Servico {
  id: number;
  nome: string;
  preco: number;
  duracaoMin: number;
}

// O agendamento vem da API já com os nomes das 3 tabelas ligadas (include do Prisma).
export interface Agendamento {
  id: number;
  dataHora: string;
  status: StatusAgendamento;
  observacoes: string | null;
  clienteId: number;
  profissionalId: number;
  servicoId: number;
  cliente: { id: number; nome: string };
  profissional: { id: number; nome: string };
  servico: { id: number; nome: string; preco: number; duracaoMin: number };
}
