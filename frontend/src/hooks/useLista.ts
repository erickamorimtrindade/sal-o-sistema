import { useCallback, useEffect, useState } from "react";
import { lerErroApi } from "../services/api";

// Carrega uma lista da API ao abrir a tela (useEffect) e permite recarregar depois.
export function useLista<T>(carregar: () => Promise<T[]>) {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setItens(await carregar());
    } catch (e) {
      setErro(lerErroApi(e).mensagem);
    } finally {
      setCarregando(false);
    }
  }, [carregar]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return { itens, carregando, erro, recarregar };
}
