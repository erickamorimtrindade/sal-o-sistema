import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

// Os dois botões do fim de cada linha da tabela: editar e remover.
export function AcoesLinha({ aoEditar, aoRemover }: { aoEditar: () => void; aoRemover: () => void }) {
  return (
    <Group gap={4} justify="flex-end" wrap="nowrap">
      <Tooltip label="Editar" withArrow>
        <ActionIcon variant="subtle" color="gray" onClick={aoEditar} aria-label="Editar">
          <IconPencil size={18} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Remover" withArrow>
        <ActionIcon variant="subtle" color="red" onClick={aoRemover} aria-label="Remover">
          <IconTrash size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
