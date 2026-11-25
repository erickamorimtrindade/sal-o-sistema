import { Badge } from "@mantine/core";
import type { StatusAgendamento } from "../types";

export const STATUS_INFO: Record<StatusAgendamento, { rotulo: string; cor: string }> = {
  AGENDADO: { rotulo: "Agendado", cor: "blue" },
  CONCLUIDO: { rotulo: "Concluído", cor: "green" },
  CANCELADO: { rotulo: "Cancelado", cor: "gray" },
};

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  const { rotulo, cor } = STATUS_INFO[status];
  return (
    <Badge color={cor} variant="light" radius="sm" fw={600} tt="none">
      {rotulo}
    </Badge>
  );
}
