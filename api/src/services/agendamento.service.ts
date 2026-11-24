import type { AgendamentoInput } from "@salao/shared";
import { AppError, naoEncontrado } from "../lib/errors";
import { agendamentoRepository } from "../repositories/agendamento.repository";
import { clienteRepository } from "../repositories/cliente.repository";
import { profissionalRepository } from "../repositories/profissional.repository";
import { servicoRepository } from "../repositories/servico.repository";

// Regra de negócio: o agendamento só pode apontar para cliente, profissional e serviço que existem.
// Se algum não existir, responde 400 dizendo QUAL campo está errado.
async function conferirRelacoes(dados: AgendamentoInput) {
  const [cliente, profissional, servico] = await Promise.all([
    clienteRepository.buscarPorId(dados.clienteId),
    profissionalRepository.buscarPorId(dados.profissionalId),
    servicoRepository.buscarPorId(dados.servicoId),
  ]);

  const campos: Record<string, string> = {};
  if (!cliente) campos.clienteId = "Cliente não encontrado";
  if (!profissional) campos.profissionalId = "Profissional não encontrado";
  if (!servico) campos.servicoId = "Serviço não encontrado";

  if (Object.keys(campos).length > 0) {
    throw new AppError(400, "Dados inválidos", campos);
  }
}

export const agendamentoService = {
  listar: () => agendamentoRepository.listar(),

  async buscarPorId(id: number) {
    const agendamento = await agendamentoRepository.buscarPorId(id);
    if (!agendamento) throw naoEncontrado("Agendamento");
    return agendamento;
  },

  async criar(dados: AgendamentoInput) {
    await conferirRelacoes(dados);
    return agendamentoRepository.criar(dados);
  },

  async atualizar(id: number, dados: AgendamentoInput) {
    await this.buscarPorId(id);
    await conferirRelacoes(dados);
    return agendamentoRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await this.buscarPorId(id);
    await agendamentoRepository.remover(id);
  },
};
