export const MOTIVOS = [
  "Compra de mercancía",
  "Devolución de compra",
  "Venta de mercancía",
  "Devolución de venta",
  "Ajuste de inventario",
  "Merma",
  "Perdida",
  "Otro",
] as const;

export type Motivo = typeof MOTIVOS[number];
