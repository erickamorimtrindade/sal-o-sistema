import axios, { isAxiosError } from "axios";
import type {
  AgendamentoInput,
  CadastroInput,
  ClienteInput,
  LoginInput,
  ProfissionalInput,
  ServicoInput,
} from "@salao/shared";
import type { Agendamento, Cliente, Profissional, Servico, Usuario } from "../types";

// Todas as chamadas à API passam por esta instância do Axios.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
});

// ---------- Tratamento de erro da API ----------
export interface ErroApi {
  mensagem: string;
  campos: Record<string, string>; // erro por campo, ex.: { email: "Já existe um registro..." }
}

export function lerErroApi(erro: unknown): ErroApi {
  if (isAxiosError(erro)) {
    if (!erro.response) {
      return { mensagem: "Não foi possível conectar à API. Confira se ela está rodando.", campos: {} };
    }
    const dados = erro.response.data as { erro?: string; campos?: Record<string, string> } | undefined;
    return { mensagem: dados?.erro ?? "Algo deu errado. Tente novamente.", campos: dados?.campos ?? {} };
  }
  return { mensagem: "Algo deu errado. Tente novamente.", campos: {} };
}

// ---------- CRUD genérico: as 5 chamadas que toda tabela tem ----------
function crud<Saida, Entrada>(rota: string) {
  return {
    listar: async () => (await api.get<Saida[]>(rota)).data,
    criar: async (dados: Entrada) => (await api.post<Saida>(rota, dados)).data,
    atualizar: async (id: number, dados: Entrada) => (await api.put<Saida>(`${rota}/${id}`, dados)).data,
    remover: async (id: number) => {
      await api.delete(`${rota}/${id}`);
    },
  };
}

export const clientesApi = crud<Cliente, ClienteInput>("/clientes");
export const profissionaisApi = crud<Profissional, ProfissionalInput>("/profissionais");
export const servicosApi = crud<Servico, ServicoInput>("/servicos");
export const agendamentosApi = crud<Agendamento, AgendamentoInput>("/agendamentos");

export const authApi = {
  login: async (dados: LoginInput) => (await api.post<Usuario>("/auth/login", dados)).data,
  cadastro: async (dados: CadastroInput) => (await api.post<Usuario>("/auth/cadastro", dados)).data,
};
