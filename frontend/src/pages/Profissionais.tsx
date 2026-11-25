import { Alert, Button, Group, Modal, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconPlus, IconSearch } from "@tabler/icons-react";
import { profissionalSchema, type ProfissionalInput } from "@salao/shared";
import { useState, type FormEvent } from "react";
import { AcoesLinha } from "../components/AcoesLinha";
import { ConfirmarRemocao } from "../components/ConfirmarRemocao";
import { EstadoLista } from "../components/EstadoLista";
import { PageHeader } from "../components/PageHeader";
import { useFormZod } from "../hooks/useFormZod";
import { useLista } from "../hooks/useLista";
import { lerErroApi, profissionaisApi } from "../services/api";
import type { Profissional } from "../types";

function FormularioProfissional({
  profissional,
  aoSalvar,
  aoCancelar,
}: {
  profissional: Profissional | null;
  aoSalvar: () => void;
  aoCancelar: () => void;
}) {
  const { valores, erros, setErros, mudar, validar } = useFormZod<ProfissionalInput>(
    profissionalSchema,
    profissional ? { nome: profissional.nome, especialidade: profissional.especialidade } : { nome: "", especialidade: "" },
  );
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const aoEnviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    const dados = validar();
    if (!dados) return;

    setSalvando(true);
    try {
      if (profissional) await profissionaisApi.atualizar(profissional.id, dados);
      else await profissionaisApi.criar(dados);
      notifications.show({
        color: "green",
        message: profissional ? "Profissional atualizado." : "Profissional cadastrado.",
      });
      aoSalvar();
    } catch (erro) {
      const { mensagem: texto, campos } = lerErroApi(erro);
      setErros(campos);
      if (Object.keys(campos).length === 0) setMensagem(texto);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={aoEnviar} noValidate>
      <Stack gap="md">
        {mensagem && (
          <Alert color="red" icon={<IconAlertCircle size={18} />}>
            {mensagem}
          </Alert>
        )}
        <TextInput
          label="Nome"
          placeholder="Nome completo"
          data-autofocus
          value={valores.nome ?? ""}
          onChange={(e) => mudar("nome", e.currentTarget.value)}
          error={erros.nome}
        />
        <TextInput
          label="Especialidade"
          placeholder="Ex.: Cabeleireira, Manicure, Barbeiro"
          value={valores.especialidade ?? ""}
          onChange={(e) => mudar("especialidade", e.currentTarget.value)}
          error={erros.especialidade}
        />
        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={aoCancelar}>
            Cancelar
          </Button>
          <Button type="submit" loading={salvando}>
            {profissional ? "Salvar alterações" : "Cadastrar profissional"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default function Profissionais() {
  const { itens, carregando, erro, recarregar } = useLista(profissionaisApi.listar);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Profissional | null>(null);
  const [aRemover, setARemover] = useState<Profissional | null>(null);

  const termo = busca.trim().toLowerCase();
  const filtrados = itens.filter((p) => `${p.nome} ${p.especialidade}`.toLowerCase().includes(termo));

  const abrirNovo = () => {
    setEditando(null);
    setModalAberto(true);
  };
  const abrirEdicao = (p: Profissional) => {
    setEditando(p);
    setModalAberto(true);
  };
  const aposSalvar = () => {
    setModalAberto(false);
    void recarregar();
  };

  return (
    <>
      <PageHeader
        titulo="Profissionais"
        descricao="A equipe que atende no salão."
        acao={
          <Button leftSection={<IconPlus size={18} />} onClick={abrirNovo}>
            Novo profissional
          </Button>
        }
      />

      <Paper withBorder radius="md" bg="white">
        <Group justify="space-between" p="md" gap="sm">
          <TextInput
            placeholder="Buscar por nome ou especialidade"
            leftSection={<IconSearch size={17} />}
            value={busca}
            onChange={(e) => setBusca(e.currentTarget.value)}
            w={{ base: "100%", sm: 360 }}
            aria-label="Buscar profissionais"
          />
          {!carregando && !erro && (
            <Text c="dimmed" fz="sm">
              {filtrados.length} {filtrados.length === 1 ? "profissional" : "profissionais"}
            </Text>
          )}
        </Group>

        <EstadoLista
          carregando={carregando}
          erro={erro}
          vazio={!carregando && !erro && itens.length === 0}
          semResultados={!carregando && !erro && itens.length > 0 && filtrados.length === 0}
          mensagemVazio="Você ainda não cadastrou nenhum profissional"
          rotuloAcao="Cadastrar o primeiro profissional"
          aoAdicionar={abrirNovo}
          aoTentarDeNovo={() => void recarregar()}
        />

        {!carregando && !erro && filtrados.length > 0 && (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Especialidade</Table.Th>
                  <Table.Th w={90} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtrados.map((p) => (
                  <Table.Tr key={p.id}>
                    <Table.Td fw={600}>{p.nome}</Table.Td>
                    <Table.Td>{p.especialidade}</Table.Td>
                    <Table.Td>
                      <AcoesLinha aoEditar={() => abrirEdicao(p)} aoRemover={() => setARemover(p)} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>

      <Modal
        opened={modalAberto}
        onClose={() => setModalAberto(false)}
        title={editando ? "Editar profissional" : "Novo profissional"}
        centered
      >
        <FormularioProfissional
          profissional={editando}
          aoSalvar={aposSalvar}
          aoCancelar={() => setModalAberto(false)}
        />
      </Modal>

      <ConfirmarRemocao
        aberto={aRemover !== null}
        nome={aRemover?.nome ?? ""}
        dicaBloqueio="Remova ou altere os agendamentos deste profissional antes."
        remover={() => profissionaisApi.remover(aRemover!.id)}
        aoFechar={() => setARemover(null)}
        aoRemovido={() => {
          setARemover(null);
          void recarregar();
        }}
      />
    </>
  );
}
