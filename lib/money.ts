/**
 * Formats a money value (decimal string or number) as Indonesian Rupiah (IDR).
 *
 * @param amount - The amount to format, e.g. `"50000.00"` or `50000`.
 * @returns The formatted currency string (e.g. `"Rp 50.000,00"`), or `"-"` when
 *   the value is not a valid number.
 */
export function formatMoney(amount: string | number): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  if (Number.isNaN(value)) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Shortens a long identifier (e.g. a UUID) for compact display.
 *
 * @param id - The full identifier.
 * @returns The identifier as-is when 12 characters or fewer, otherwise the first
 *   6 and last 4 characters joined by an ellipsis (e.g. `"4cf7b1…90ab"`).
 */
export function shortId(id: string): string {
  const compact = id.length > 12;
  return compact ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}