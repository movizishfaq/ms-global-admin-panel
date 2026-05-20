import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../App';
import type { CatalogProduct } from '../types/commerce';
import { formatRp } from '../lib/money';
interface ProductCardProps {
  product: CatalogProduct;
}
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
export function ProductCard({ product }: ProductCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const size = selectedSize || 'M';
    addToCart({
      id: product.id,
      name: product.name,
      price: formatRp(product.priceRp),
      image: product.image,
      size
    });
    setIsFlipped(false);
    setSelectedSize('');
  };
  return (
    <div
      className="perspective-1000 cursor-pointer"
      style={{
        perspective: '1000px'
      }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}>

      <motion.div
        className="relative w-full transform-style-3d"
        style={{
          transformStyle: 'preserve-3d',
          aspectRatio: '3/4'
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1]
        }}>

        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden overflow-hidden bg-gray-100"
          style={{
            backfaceVisibility: 'hidden'
          }}>

          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy" />

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black p-3">
            <h3 className="font-anton text-lg leading-tight text-black uppercase">
              {product.name}
            </h3>
            <p className="font-mono text-sm text-black mt-0.5">
              {formatRp(product.priceRp)}
            </p>
          </div>
          <div className="absolute top-3 left-3">
            <span className="font-mono text-xs bg-black text-white px-2 py-1 uppercase tracking-widest">
              {product.category}
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden bg-black flex flex-col justify-between p-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}>

          <div>
            <h3 className="font-anton text-2xl text-white uppercase leading-tight mb-2">
              {product.name}
            </h3>
            <p className="font-mono text-2xl text-red mb-4">
              {formatRp(product.priceRp)}
            </p>
            <p className="font-mono text-xs text-white/60 leading-relaxed">
              {product.description ||
              'Premium quality streetwear. Limited run. 100% cotton. Oversized fit. Pre-washed for softness.'}
            </p>
          </div>

          <div>
            {/* Size Selector */}
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
              SELECT SIZE
            </p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {SIZES.map((size) =>
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`font-mono text-xs px-3 py-1.5 border transition-colors ${selectedSize === size ? 'bg-red border-red text-white' : 'bg-transparent border-white/40 text-white hover:border-white'}`}>

                  {size}
                </button>
              )}
            </div>

            <motion.button
              whileTap={{
                scale: 0.97
              }}
              onClick={handleAddToCart}
              className="w-full font-mono text-sm uppercase tracking-widest bg-red text-white py-3 hover:bg-white hover:text-black transition-colors">

              ADD TO CART
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>);

}