import type { RequestHandler } from "express";
import type { ZodType } from "zod";

// Segurança na porta de entrada: confere o body com o schema do Zod (o mesmo do frontend).
// Se tiver erro, responde 400 com a mensagem de cada campo e NÃO chama o controller.
export function validarBody(schema: ZodType): RequestHandler {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const campos: Record<string, string> = {};
      for (const problema of resultado.error.issues) {
        const campo = problema.path.join(".") || "body";
        if (!campos[campo]) campos[campo] = problema.message; // 1ª mensagem de cada campo
      }
      res.status(400).json({ erro: "Dados inválidos", campos });
      return;
    }

    req.body = resultado.data; // segue com os dados já validados e "limpos"
    next();
  };
}
