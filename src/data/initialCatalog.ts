import type { CatalogProduct } from '../types/commerce';
import { DEFAULT_PRODUCT_IMAGE } from '../lib/catalogDisplay';

/** Real MS-Global catalog — add more products in Admin → Products. */
export const INITIAL_CATALOG: CatalogProduct[] = [
  {
    id: 'rose-hip-face-oil',
    name: 'ROSE HIP FACE OIL',
    priceRp: 89_000,
    category: 'FACE OILS',
    image: DEFAULT_PRODUCT_IMAGE,
    description:
      'Pure rosehip oil for radiant, youthful skin. Rich in vitamins A and C.',
    active: true
  }
];
