import { prisma } from "../lib/prisma";

// Camada que conversa com o banco. Só sabe ler e gravar, não tem regra de negócio.
export const usuarioRepository = {
  buscarPorEmail: (email: string) => prisma.usuario.findUnique({ where: { email } }),

  criar: (dados: { nome: string; email: string; senha: string }) =>
    prisma.usuario.create({ data: dados }),
};
