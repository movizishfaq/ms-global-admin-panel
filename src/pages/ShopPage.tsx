import React, { useState, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { StudioSelectBar } from '../components/studio/StudioSelectBar';
import { useStore } from '../context/StoreContext';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
export function ShopPage() {
  const { products } = useStore();
  const visible = useMemo(
    () => products.filter((p) => p.active),
    [products]
  );
  const FILTER_TAGS = useMemo(() => {
    const cats = [...new Set(visible.map((p) => p.category))];
    return ['ALL', ...cats.sort()];
  }, [visible]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, {
    once: true,
    margin: '-50px'
  });
  const filtered =
    activeFilter === 'ALL'
      ? visible
      : visible.filter((p) => p.category === activeFilter);
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundColor: 'var(--primary)'
      }}>

      {/* Page Header */}
      <section
        className="px-6 py-12"
        style={{
          backgroundColor: 'var(--dark)'
        }}>

        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <h1 className="font-anton text-6xl md:text-8xl text-white uppercase leading-none">
            SHOP{' '}
            <span
              style={{
                color: '#FF0000'
              }}>

              ALL
            </span>
          </h1>
          <p
            className="font-mono text-sm uppercase tracking-widest"
            style={{
              color: 'rgba(255,255,255,0.6)'
            }}>

            {filtered.length} ITEMS
          </p>
        </div>
      </section>

      {/* Filter Tags */}
      <section
        className="px-6 py-4 overflow-x-auto border-b border-white/10"
        aria-label="Product filters"
        style={{
          backgroundColor: 'var(--dark)'
        }}>

        <div className="flex gap-3 min-w-max max-w-screen-xl mx-auto">
          {FILTER_TAGS.map((tag) => {
            const isActive = activeFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className="relative font-mono text-xs uppercase tracking-widest px-5 py-2 border-2 transition-colors rounded"
                style={{
                  backgroundColor: isActive ? '#fff' : 'transparent',
                  color: isActive ? 'var(--primary)' : '#fff',
                  borderColor: isActive ? '#fff' : 'rgba(255,255,255,0.4)'
                }}
                aria-pressed={isActive}>

                {tag}
              </button>);

          })}
        </div>
      </section>

      {/* Product Grid */}
      <section className="relative px-6 py-12" aria-label="Products">
        <StudioSelectBar panel="products" label="Catalog" block="shop" />
        <div className="max-w-screen-xl mx-auto">
          <motion.div
            ref={gridRef}
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate={gridInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((product) =>
            <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            )}
          </motion.div>

          {filtered.length === 0 &&
          <div className="text-center py-24">
              <p
              className="font-mono text-sm uppercase tracking-widest"
              style={{
                color: 'rgba(255,255,255,0.4)'
              }}>

                NO ITEMS IN THIS CATEGORY
              </p>
            </div>
          }
        </div>
      </section>
    </div>);

}
