export function formatMoney(amount: string | number): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function shortId(id: string): string {
  const compact = id.length > 12;
  return compact ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}