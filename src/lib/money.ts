/** Parse display strings like `Rp89.000` to whole rupiah. */
export function parseRp(price: string): number {
  const n = parseFloat(String(price).replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function formatRp(amount: number): string {
  return `Rp${Math.round(amount).toLocaleString('id-ID')}`;
}
