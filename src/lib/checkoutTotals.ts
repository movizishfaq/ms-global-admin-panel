export function computeCheckoutTotals(args: {
  subtotalBeforePromoRp: number;
  taxRatePercent: number;
  shippingFlatRp: number;
  freeShippingOverRp: number;
  promoPercent: number;
}) {
  const discountRp = Math.round(
    (args.subtotalBeforePromoRp * args.promoPercent) / 100
  );
  const subtotalAfterPromoRp = Math.max(
    0,
    args.subtotalBeforePromoRp - discountRp
  );
  const shippingRp =
    subtotalAfterPromoRp >= args.freeShippingOverRp
      ? 0
      : args.shippingFlatRp;
  const taxableBase = subtotalAfterPromoRp + shippingRp;
  const taxRp = Math.round((taxableBase * args.taxRatePercent) / 100);
  const totalRp = subtotalAfterPromoRp + shippingRp + taxRp;
  return {
    discountRp,
    subtotalAfterPromoRp,
    shippingRp,
    taxRp,
    totalRp
  };
}
