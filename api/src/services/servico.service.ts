import type { ServicoInput } from "@salao/shared";
import { naoEncontrado } from "../lib/errors";
import { servicoRepository } from "../repositories/servico.repository";

// Camada das regras: decide o que fazer (ex.: 404 se o id não existe).
export const servicoService = {
  listar: () => servicoRepository.listar(),

  async buscarPorId(id: number) {
    const servico = await servicoRepository.buscarPorId(id);
    if (!servico) throw naoEncontrado("Serviço");
    return servico;
  },

  criar: (dados: ServicoInput) => servicoRepository.criar(dados),

  async atualizar(id: number, dados: ServicoInput) {
    await this.buscarPorId(id); // garante o 404 antes de tentar atualizar
    return servicoRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await this.buscarPorId(id);
    await servicoRepository.remover(id);
  },
};
