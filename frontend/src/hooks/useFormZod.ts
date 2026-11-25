import { useState } from "react";
import type { ZodType } from "zod";

// Controla os campos de um formulário e valida com o MESMO schema do Zod que a API usa.
// T = formato dos dados que o formulário envia (ex.: ClienteInput).
export function useFormZod<T extends object>(schema: ZodType, inicial: Partial<T>) {
  const [valores, setValores] = useState<Partial<T>>(inicial);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Muda um campo e apaga o erro dele (a pessoa já está corrigindo).
  const mudar = <K extends keyof T>(campo: K, valor: T[K] | undefined) => {
    setValores((atual) => ({ ...atual, [campo]: valor }));
    setErros((atual) => {
      if (!(campo in atual)) return atual;
      const novo = { ...atual };
      delete novo[campo as string];
      return novo;
    });
  };

  // safeParse não lança erro: devolve { success, data } ou { success: false, error }.
  const validar = (): T | null => {
    const resultado = schema.safeParse(valores);
    if (!resultado.success) {
      const novos: Record<string, string> = {};
      for (const problema of resultado.error.issues) {
        const campo = String(problema.path[0] ?? "formulario");
        if (!novos[campo]) novos[campo] = problema.message;
      }
      setErros(novos);
      return null;
    }
    setErros({});
    return resultado.data as T;
  };

  return { valores, erros, setErros, mudar, validar };
}
