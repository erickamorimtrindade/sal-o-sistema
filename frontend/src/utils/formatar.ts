const doisDigitos = (n: number) => String(n).padStart(2, "0");

export const formatarData = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export const formatarHora = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

export const formatarDataHora = (iso: string) => `${formatarData(iso)} às ${formatarHora(iso)}`;

export const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// O campo <input type="datetime-local"> usa o formato "2026-11-28T10:00" (horário local).
export function paraInputLocal(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}T${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

// Sugestão inicial para um novo agendamento: a próxima hora cheia.
export function proximaHoraCheia(): string {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  return paraInputLocal(d);
}

export const mesmoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export function iniciais(nome: string): string {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]!.toUpperCase())
    .join("");
}
