// Erro "esperado" da aplicação: carrega o status HTTP e, se quiser, a mensagem por campo.
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public campos?: Record<string, string>,
  ) {
    super(message);
  }
}

export const naoEncontrado = (o: string) => new AppError(404, `${o} não encontrado(a)`);

// Converte o :id da URL em número; se não for inteiro positivo, devolve 400.
export function lerId(valor: unknown): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, "O id informado na URL é inválido");
  }
  return id;
}
