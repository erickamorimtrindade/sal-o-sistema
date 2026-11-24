import type { ProfissionalInput } from "@salao/shared";
import { naoEncontrado } from "../lib/errors";
import { profissionalRepository } from "../repositories/profissional.repository";

// Camada das regras: decide o que fazer (ex.: 404 se o id não existe).
export const profissionalService = {
  listar: () => profissionalRepository.listar(),

  async buscarPorId(id: number) {
    const profissional = await profissionalRepository.buscarPorId(id);
    if (!profissional) throw naoEncontrado("Profissional");
    return profissional;
  },

  criar: (dados: ProfissionalInput) => profissionalRepository.criar(dados),

  async atualizar(id: number, dados: ProfissionalInput) {
    await this.buscarPorId(id); // garante o 404 antes de tentar atualizar
    return profissionalRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await this.buscarPorId(id);
    await profissionalRepository.remover(id);
  },
};
