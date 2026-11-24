import { z } from "zod";

// Mensagens padrão em português para erros de tipo (campo ausente ou do tipo errado).
// As mensagens específicas de cada campo (abaixo) continuam valendo normalmente.
z.config({
  customError: (issue) => {
    if (issue.code === "invalid_type") {
      return issue.input === undefined ? "Campo obrigatório" : "Tipo de dado inválido";
    }
    return undefined; // nos demais casos, usa a mensagem do próprio campo
  },
});

// ---------- Usuário (cadastro e login) ----------
export const cadastroSchema = z.object({
  nome: z.string().min(2, "Informe o nome (mínimo 2 letras)"),
  email: z.email("E-mail inválido"),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  senha: z.string().min(1, "Informe a senha"),
});

// ---------- Cliente ----------
export const clienteSchema = z.object({
  nome: z.string().min(2, "Informe o nome (mínimo 2 letras)"),
  telefone: z.string().min(8, "Telefone inválido"),
  email: z.email("E-mail inválido"),
});

// ---------- Profissional ----------
export const profissionalSchema = z.object({
  nome: z.string().min(2, "Informe o nome (mínimo 2 letras)"),
  especialidade: z.string().min(2, "Informe a especialidade"),
});

// ---------- Serviço ----------
export const servicoSchema = z.object({
  nome: z.string().min(2, "Informe o nome do serviço"),
  preco: z.number("Informe o preço").positive("O preço precisa ser maior que zero"),
  duracaoMin: z
    .number("Informe a duração")
    .int("A duração deve ser um número inteiro")
    .positive("A duração precisa ser maior que zero"),
});

// ---------- Agendamento ----------
export const STATUS_AGENDAMENTO = ["AGENDADO", "CONCLUIDO", "CANCELADO"] as const;

export const agendamentoSchema = z.object({
  dataHora: z
    .string()
    .min(1, "Informe a data e a hora")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Data/hora inválida"),
  status: z.enum(STATUS_AGENDAMENTO, "Status inválido").default("AGENDADO"),
  observacoes: z.string().optional(),
  clienteId: z.number("Escolha o cliente").int().positive("Escolha o cliente"),
  profissionalId: z.number("Escolha o profissional").int().positive("Escolha o profissional"),
  servicoId: z.number("Escolha o serviço").int().positive("Escolha o serviço"),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type ProfissionalInput = z.infer<typeof profissionalSchema>;
export type ServicoInput = z.infer<typeof servicoSchema>;
export type AgendamentoInput = z.infer<typeof agendamentoSchema>;
