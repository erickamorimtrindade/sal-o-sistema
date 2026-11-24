import bcrypt from "bcrypt";
import type { CadastroInput, LoginInput } from "@salao/shared";
import { AppError } from "../lib/errors";
import { usuarioRepository } from "../repositories/usuario.repository";

// Tira o hash da senha do usuário ANTES de devolver para o controller.
// Assim a senha nunca chega à resposta da API.
function semSenha<T extends { senha: string }>(usuario: T): Omit<T, "senha"> {
  const { senha: _senha, ...resto } = usuario;
  return resto;
}

export const authService = {
  async cadastrar(dados: CadastroInput) {
    // bcrypt transforma a senha num hash (mão única). 10 = custo do cálculo.
    const hash = await bcrypt.hash(dados.senha, 10);
    const usuario = await usuarioRepository.criar({ nome: dados.nome, email: dados.email, senha: hash });
    return semSenha(usuario);
  },

  async login(dados: LoginInput) {
    const usuario = await usuarioRepository.buscarPorEmail(dados.email);
    // Mesma mensagem para "e-mail não existe" e "senha errada": não revela qual dos dois falhou.
    const senhaCorreta = usuario ? await bcrypt.compare(dados.senha, usuario.senha) : false;
    if (!usuario || !senhaCorreta) {
      throw new AppError(401, "E-mail ou senha inválidos");
    }
    return semSenha(usuario);
  },
};
