import { z } from "zod";
import { cadastroSchema, loginSchema, clienteSchema } from "@salao/shared";

// O Swagger é montado a partir dos MESMOS schemas do Zod usados na validação:
// se a regra mudar no shared, a documentação muda junto.
type Json = Record<string, any>;

const paraJson = (schema: z.ZodType): Json => {
  const { $schema: _ignorar, ...resto } = z.toJSONSchema(schema, { target: "openapi-3.0" }) as Json;
  return resto;
};

// Versão "de saída": o mesmo schema, mais o id que o banco gera.
const comId = (entrada: Json): Json => ({
  type: "object",
  properties: { id: { type: "integer", example: 1 }, ...entrada.properties },
  required: ["id", ...(entrada.required ?? [])],
});

const ref = (nome: string) => ({ $ref: `#/components/schemas/${nome}` });
const json = (schema: Json) => ({ "application/json": { schema } });
const resposta = (descricao: string, schema?: Json) => ({
  description: descricao,
  ...(schema ? { content: json(schema) } : {}),
});
const erro = (descricao: string) => resposta(descricao, ref("Erro"));
const idParam = { name: "id", in: "path", required: true, schema: { type: "integer" } };

// Gera as 5 rotas do CRUD de uma tabela (listar, buscar, criar, editar, remover).
function crud(caminho: string, tag: string, nome: string, entrada: string, saida: string): Json {
  const corpo = { required: true, content: json(ref(entrada)) };
  return {
    [caminho]: {
      get: { tags: [tag], summary: `Lista ${nome}`, responses: { 200: resposta("Lista", { type: "array", items: ref(saida) }) } },
      post: {
        tags: [tag],
        summary: `Cria ${nome}`,
        requestBody: corpo,
        responses: { 201: resposta("Criado", ref(saida)), 400: erro("Dados inválidos"), 409: erro("Valor repetido em campo único") },
      },
    },
    [`${caminho}/{id}`]: {
      get: {
        tags: [tag],
        summary: `Busca ${nome} por id`,
        parameters: [idParam],
        responses: { 200: resposta("Encontrado", ref(saida)), 404: erro("Não encontrado") },
      },
      put: {
        tags: [tag],
        summary: `Edita ${nome}`,
        parameters: [idParam],
        requestBody: corpo,
        responses: {
          200: resposta("Atualizado", ref(saida)),
          400: erro("Dados inválidos"),
          404: erro("Não encontrado"),
          409: erro("Valor repetido em campo único"),
        },
      },
      delete: {
        tags: [tag],
        summary: `Remove ${nome}`,
        parameters: [idParam],
        responses: { 204: resposta("Removido"), 404: erro("Não encontrado"), 409: erro("Há registros relacionados") },
      },
    },
  };
}

const cliente = paraJson(clienteSchema);

export const swaggerSpec: Json = {
  openapi: "3.0.3",
  info: { title: "API do Salão", version: "1.0.0", description: "Sistema de agendamento de um salão de beleza." },
  tags: [{ name: "Auth" }, { name: "Clientes" }],
  paths: {
    "/auth/cadastro": {
      post: {
        tags: ["Auth"],
        summary: "Cadastra um usuário (a senha é guardada com bcrypt)",
        requestBody: { required: true, content: json(ref("Cadastro")) },
        responses: { 201: resposta("Usuário criado (sem a senha)", ref("Usuario")), 400: erro("Dados inválidos"), 409: erro("E-mail já cadastrado") },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Faz login com e-mail e senha",
        requestBody: { required: true, content: json(ref("Login")) },
        responses: { 200: resposta("Login ok (sem a senha)", ref("Usuario")), 400: erro("Dados inválidos"), 401: erro("E-mail ou senha inválidos") },
      },
    },
    ...crud("/clientes", "Clientes", "clientes", "ClienteEntrada", "Cliente"),
  },
  components: {
    schemas: {
      Erro: {
        type: "object",
        properties: {
          erro: { type: "string", example: "Dados inválidos" },
          campos: { type: "object", additionalProperties: { type: "string" }, example: { email: "E-mail inválido" } },
        },
      },
      Cadastro: paraJson(cadastroSchema),
      Login: paraJson(loginSchema),
      Usuario: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string" },
          email: { type: "string" },
          criadoEm: { type: "string", format: "date-time" },
        },
      },
      ClienteEntrada: cliente,
      Cliente: comId(cliente),
    },
  },
};
