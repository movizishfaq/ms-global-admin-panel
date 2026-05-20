import type { CatalogProduct } from '../types/commerce';
import { formatRp } from './money';

/** Default product image (MS-Global Rose Hip Face Oil). */
export const DEFAULT_PRODUCT_IMAGE =
  '/original-4006ba5de374258f3b7a9bf72a711ce4.webp';

export interface HomeProductCard {
  id: string;
  name: string;
  price: string;
  original: string;
  image: string;
  /** 0 = hide rating row */
  rating: number;
  sold: string;
  progress: number;
}

export function catalogToHomeCard(
  p: CatalogProduct,
  unitsSold = 0
): HomeProductCard {
  return {
    id: p.id,
    name: p.name,
    price: formatRp(p.priceRp),
    original: '',
    image: p.image?.trim() || DEFAULT_PRODUCT_IMAGE,
    rating: 0,
    sold: unitsSold > 0 ? `${unitsSold} sold` : '',
    progress: 0
  };
}

export function activeCatalogProducts(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter((p) => p.active);
}
