import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useState } from "react";
import { lerErroApi } from "../services/api";

interface Props {
  aberto: boolean;
  nome: string; // nome do item, para a pessoa saber o que está removendo
  dicaBloqueio: string; // o que fazer se a API recusar (ex.: item ainda tem agendamentos)
  remover: () => Promise<void>;
  aoFechar: () => void;
  aoRemovido: () => void;
}

// Janela de confirmação antes de apagar. Se a API recusar (409), explica o motivo aqui mesmo.
export function ConfirmarRemocao({ aberto, nome, dicaBloqueio, remover, aoFechar, aoRemovido }: Props) {
  const [removendo, setRemovendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const fechar = () => {
    setErro(null);
    aoFechar();
  };

  const confirmar = async () => {
    setRemovendo(true);
    setErro(null);
    try {
      await remover();
      notifications.show({ color: "green", message: `${nome} foi removido.` });
      aoRemovido();
    } catch (e) {
      setErro(lerErroApi(e).mensagem);
    } finally {
      setRemovendo(false);
    }
  };

  return (
    <Modal opened={aberto} onClose={fechar} title="Remover item?" centered size="sm">
      <Stack gap="md">
        <Text>
          Você vai remover <b>{nome}</b>. Essa ação não pode ser desfeita.
        </Text>
        {erro && (
          <Alert color="red" icon={<IconAlertTriangle size={18} />} title="Não foi possível remover">
            {erro}. {dicaBloqueio}
          </Alert>
        )}
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={fechar}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmar} loading={removendo}>
            Remover
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
