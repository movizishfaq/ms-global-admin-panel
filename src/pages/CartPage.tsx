import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  XIcon,
  ArrowRightIcon } from
'lucide-react';
import { useCart } from '../App';
import { useStore } from '../context/StoreContext';
import { computeCheckoutTotals } from '../lib/checkoutTotals';
import { formatRp, parseRp } from '../lib/money';
const PRIMARY = '#9E055F';
const DARK = '#7a0449';
export function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const store = useStore();
  const subtotalBeforePromoRp = cartItems.reduce((sum, item) => {
    return sum + parseRp(item.price) * item.quantity;
  }, 0);
  const est = useMemo(
    () =>
      computeCheckoutTotals({
        subtotalBeforePromoRp,
        taxRatePercent: store.taxRatePercent,
        shippingFlatRp: store.shippingFlatRp,
        freeShippingOverRp: store.freeShippingOverRp,
        promoPercent: store.promoPercent
      }),
    [
      subtotalBeforePromoRp,
      store.taxRatePercent,
      store.shippingFlatRp,
      store.freeShippingOverRp,
      store.promoPercent
    ]
  );
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundColor: PRIMARY
      }}>

      {/* Header */}
      <section
        className="px-6 py-12"
        style={{
          backgroundColor: DARK
        }}>

        <div className="max-w-screen-xl mx-auto flex items-end justify-between">
          <div>
            <h1 className="font-anton text-6xl md:text-8xl text-white uppercase leading-none">
              MY{' '}
              <span
                style={{
                  color: '#FF0000'
                }}>

                CART
              </span>
            </h1>
            <p className="font-mono text-sm text-white/50 mt-2 uppercase tracking-widest">
              {cartItems.length === 0 ?
              'Empty' :
              `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <Link
            to="/shop"
            className="font-mono text-xs text-white/60 hover:text-white transition-colors uppercase tracking-widest hidden md:block">

            ← CONTINUE SHOPPING
          </Link>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {cartItems.length === 0 /* Empty State */ ?
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-center py-24">

            <ShoppingBagIcon
            className="w-16 h-16 mx-auto mb-6"
            style={{
              color: 'rgba(255,255,255,0.2)'
            }} />

            <p className="font-anton text-3xl text-white uppercase mb-3">
              Your cart is empty
            </p>
            <p className="font-mono text-sm text-white/50 mb-8">
              Add some products to get started
            </p>
            <Link
            to="/shop"
            className="inline-block font-mono text-sm uppercase tracking-widest text-white px-10 py-4 font-bold rounded-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#FF0000'
            }}>

              BROWSE SHOP →
            </Link>
          </motion.div> :

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, i) =>
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: 20,
                  height: 0
                }}
                transition={{
                  delay: i * 0.06,
                  duration: 0.3
                }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/10"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}>

                    {/* Image */}
                    <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />


                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white font-bold truncate">
                        {item.name}
                      </p>
                      <span
                    className="inline-block font-mono text-xs px-2 py-0.5 rounded mt-1"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.7)'
                    }}>

                        {item.size}
                      </span>
                      <p className="font-mono text-sm text-white/60 mt-1">
                        {item.price} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                    onClick={() =>
                    updateQuantity(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    aria-label="Decrease quantity">

                        <MinusIcon className="w-3.5 h-3.5 text-white" />
                      </button>
                      <span className="font-mono text-sm text-white w-6 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                    onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }}
                    aria-label="Increase quantity">

                        <PlusIcon className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right flex-shrink-0 min-w-[80px]">
                      <p className="font-mono text-sm text-white font-bold">
                        {formatRp(parseRp(item.price) * item.quantity)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  style={{
                    color: 'rgba(255,255,255,0.4)'
                  }}
                  aria-label="Remove item">

                      <XIcon className="w-4 h-4 hover:text-red-400 transition-colors" />
                    </button>
                  </motion.div>
              )}
              </AnimatePresence>

              <Link
              to="/shop"
              className="inline-block font-mono text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest mt-2 md:hidden">

                ← CONTINUE SHOPPING
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.2
              }}
              className="rounded-2xl p-6 border border-white/10 sticky top-24"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

                <h2 className="font-anton text-2xl text-white uppercase mb-6">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-white/60">
                      Subtotal
                    </span>
                    <span className="font-mono text-sm text-white">
                      {formatRp(subtotalBeforePromoRp)}
                    </span>
                  </div>
                  {est.discountRp > 0 &&
                  <div className="flex justify-between">
                      <span className="font-mono text-sm text-white/60">
                        Promo ({store.promoPercent}%)
                      </span>
                      <span className="font-mono text-sm text-green-400">
                        −{formatRp(est.discountRp)}
                      </span>
                    </div>
                  }
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-white/60">
                      Est. shipping
                    </span>
                    <span
                    className={`font-mono text-sm font-bold ${est.shippingRp === 0 ? 'text-green-400' : 'text-white'}`}>

                      {est.shippingRp === 0 ? 'FREE' : formatRp(est.shippingRp)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-white/60">
                      Est. tax ({store.taxRatePercent}%)
                    </span>
                    <span className="font-mono text-sm text-white">
                      {formatRp(est.taxRp)}
                    </span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="font-mono text-sm text-white font-bold">
                      Est. total
                    </span>
                    <span className="font-anton text-xl text-white">
                      {formatRp(est.totalRp)}
                    </span>
                  </div>
                </div>

                <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full font-mono text-sm uppercase tracking-widest text-white py-4 rounded-xl font-bold transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: '#FF0000'
                }}>

                  PROCEED TO CHECKOUT
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>

                <div className="mt-4 text-center">
                  <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
                    Secure checkout · Free shipping over{' '}
                    {formatRp(store.freeShippingOverRp)}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        }
      </div>
    </div>);

}