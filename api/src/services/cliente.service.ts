import type { ClienteInput } from "@salao/shared";
import { naoEncontrado } from "../lib/errors";
import { clienteRepository } from "../repositories/cliente.repository";

// Camada das regras: decide o que fazer (ex.: 404 se o id não existe).
export const clienteService = {
  listar: () => clienteRepository.listar(),

  async buscarPorId(id: number) {
    const cliente = await clienteRepository.buscarPorId(id);
    if (!cliente) throw naoEncontrado("Cliente");
    return cliente;
  },

  criar: (dados: ClienteInput) => clienteRepository.criar(dados),

  async atualizar(id: number, dados: ClienteInput) {
    await this.buscarPorId(id); // garante o 404 antes de tentar atualizar
    return clienteRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await this.buscarPorId(id);
    await clienteRepository.remover(id);
  },
};
