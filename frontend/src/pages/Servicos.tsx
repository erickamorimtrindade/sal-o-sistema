import { Alert, Button, Group, Modal, NumberInput, Paper, Stack, Table, Text, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconPlus, IconSearch } from "@tabler/icons-react";
import { servicoSchema, type ServicoInput } from "@salao/shared";
import { useState, type FormEvent } from "react";
import { AcoesLinha } from "../components/AcoesLinha";
import { ConfirmarRemocao } from "../components/ConfirmarRemocao";
import { EstadoLista } from "../components/EstadoLista";
import { PageHeader } from "../components/PageHeader";
import { useFormZod } from "../hooks/useFormZod";
import { useLista } from "../hooks/useLista";
import { lerErroApi, servicosApi } from "../services/api";
import type { Servico } from "../types";
import { formatarMoeda } from "../utils/formatar";

function FormularioServico({
  servico,
  aoSalvar,
  aoCancelar,
}: {
  servico: Servico | null;
  aoSalvar: () => void;
  aoCancelar: () => void;
}) {
  const { valores, erros, setErros, mudar, validar } = useFormZod<ServicoInput>(
    servicoSchema,
    servico
      ? { nome: servico.nome, preco: servico.preco, duracaoMin: servico.duracaoMin }
      : { nome: "", preco: undefined, duracaoMin: undefined },
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
      if (servico) await servicosApi.atualizar(servico.id, dados);
      else await servicosApi.criar(dados);
      notifications.show({ color: "green", message: servico ? "Serviço atualizado." : "Serviço cadastrado." });
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
          label="Nome do serviço"
          placeholder="Ex.: Corte feminino"
          data-autofocus
          value={valores.nome ?? ""}
          onChange={(e) => mudar("nome", e.currentTarget.value)}
          error={erros.nome}
        />
        <Group grow align="flex-start">
          <NumberInput
            label="Preço"
            placeholder="R$ 0,00"
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            decimalSeparator=","
            thousandSeparator="."
            min={0}
            hideControls
            value={valores.preco ?? ""}
            onChange={(v) => mudar("preco", v === "" ? undefined : Number(v))}
            error={erros.preco}
          />
          <NumberInput
            label="Duração"
            placeholder="45"
            suffix=" min"
            allowDecimal={false}
            min={0}
            hideControls
            value={valores.duracaoMin ?? ""}
            onChange={(v) => mudar("duracaoMin", v === "" ? undefined : Number(v))}
            error={erros.duracaoMin}
          />
        </Group>
        <Group justify="flex-end" mt="xs">
          <Button variant="default" onClick={aoCancelar}>
            Cancelar
          </Button>
          <Button type="submit" loading={salvando}>
            {servico ? "Salvar alterações" : "Cadastrar serviço"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default function Servicos() {
  const { itens, carregando, erro, recarregar } = useLista(servicosApi.listar);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<Servico | null>(null);
  const [aRemover, setARemover] = useState<Servico | null>(null);

  const termo = busca.trim().toLowerCase();
  const filtrados = itens.filter((s) => s.nome.toLowerCase().includes(termo));

  const abrirNovo = () => {
    setEditando(null);
    setModalAberto(true);
  };
  const abrirEdicao = (s: Servico) => {
    setEditando(s);
    setModalAberto(true);
  };
  const aposSalvar = () => {
    setModalAberto(false);
    void recarregar();
  };

  return (
    <>
      <PageHeader
        titulo="Serviços"
        descricao="O que o salão oferece, com preço e duração."
        acao={
          <Button leftSection={<IconPlus size={18} />} onClick={abrirNovo}>
            Novo serviço
          </Button>
        }
      />

      <Paper withBorder radius="md" bg="white">
        <Group justify="space-between" p="md" gap="sm">
          <TextInput
            placeholder="Buscar serviço"
            leftSection={<IconSearch size={17} />}
            value={busca}
            onChange={(e) => setBusca(e.currentTarget.value)}
            w={{ base: "100%", sm: 360 }}
            aria-label="Buscar serviços"
          />
          {!carregando && !erro && (
            <Text c="dimmed" fz="sm">
              {filtrados.length} {filtrados.length === 1 ? "serviço" : "serviços"}
            </Text>
          )}
        </Group>

        <EstadoLista
          carregando={carregando}
          erro={erro}
          vazio={!carregando && !erro && itens.length === 0}
          semResultados={!carregando && !erro && itens.length > 0 && filtrados.length === 0}
          mensagemVazio="Você ainda não cadastrou nenhum serviço"
          rotuloAcao="Cadastrar o primeiro serviço"
          aoAdicionar={abrirNovo}
          aoTentarDeNovo={() => void recarregar()}
        />

        {!carregando && !erro && filtrados.length > 0 && (
          <Table.ScrollContainer minWidth={480}>
            <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Serviço</Table.Th>
                  <Table.Th>Duração</Table.Th>
                  <Table.Th>Preço</Table.Th>
                  <Table.Th w={90} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtrados.map((s) => (
                  <Table.Tr key={s.id}>
                    <Table.Td fw={600}>{s.nome}</Table.Td>
                    <Table.Td>{s.duracaoMin} min</Table.Td>
                    <Table.Td>{formatarMoeda(s.preco)}</Table.Td>
                    <Table.Td>
                      <AcoesLinha aoEditar={() => abrirEdicao(s)} aoRemover={() => setARemover(s)} />
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
        title={editando ? "Editar serviço" : "Novo serviço"}
        centered
      >
        <FormularioServico servico={editando} aoSalvar={aposSalvar} aoCancelar={() => setModalAberto(false)} />
      </Modal>

      <ConfirmarRemocao
        aberto={aRemover !== null}
        nome={aRemover?.nome ?? ""}
        dicaBloqueio="Remova ou altere os agendamentos que usam este serviço antes."
        remover={() => servicosApi.remover(aRemover!.id)}
        aoFechar={() => setARemover(null)}
        aoRemovido={() => {
          setARemover(null);
          void recarregar();
        }}
      />
    </>
  );
}
