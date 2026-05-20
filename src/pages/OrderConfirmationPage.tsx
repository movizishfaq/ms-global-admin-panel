import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, PackageIcon, TruckIcon, HomeIcon } from 'lucide-react';
const PRIMARY = '#9E055F';
const DARK = '#7a0449';
interface OrderState {
  orderId: string;
  total: number;
  paymentMethod: string;
  name: string;
  email: string;
  discountRp?: number;
  subtotalAfterPromoRp?: number;
  taxRp?: number;
  shippingRp?: number;
}
function formatPrice(amount: number): string {
  return `Rp${amount.toLocaleString('id-ID')}`;
}
function getPaymentLabel(method: string): string {
  if (method === 'cod') return 'Cash on Delivery';
  if (method === 'card') return 'Card Payment (Stripe)';
  if (method === 'jazzcash') return 'JazzCash / EasyPaisa';
  return method;
}
export function OrderConfirmationPage() {
  const location = useLocation();
  const state = location.state as OrderState | null;
  if (!state) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: PRIMARY
        }}>

        <div className="text-center">
          <p className="font-mono text-white/60 mb-4 uppercase tracking-widest">
            No order found
          </p>
          <Link
            to="/"
            className="font-mono text-sm uppercase tracking-widest text-white px-6 py-3 rounded-lg"
            style={{
              backgroundColor: '#FF0000'
            }}>

            GO HOME
          </Link>
        </div>
      </div>);

  }
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center px-6 py-16"
      style={{
        backgroundColor: PRIMARY
      }}>

      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #fff 0%, transparent 70%)'
          }} />

        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #fff 0%, transparent 70%)'
          }} />

      </div>

      <div className="relative w-full max-w-lg">
        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="rounded-3xl p-8 md:p-12 border border-white/10 text-center"
          style={{
            backgroundColor: 'rgba(255,255,255,0.08)'
          }}>

          {/* Checkmark */}
          <motion.div
            initial={{
              scale: 0,
              rotate: -180
            }}
            animate={{
              scale: 1,
              rotate: 0
            }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              type: 'spring',
              stiffness: 200
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: 'rgba(34,197,94,0.2)'
            }}>

            <CheckCircleIcon className="w-10 h-10 text-green-400" />
          </motion.div>

          {/* Heading */}
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
              delay: 0.4
            }}>

            <h1 className="font-anton text-4xl md:text-5xl text-white uppercase mb-2">
              ORDER{' '}
              <span
                style={{
                  color: '#FF0000'
                }}>

                CONFIRMED!
              </span>
            </h1>
            <p className="font-mono text-sm text-white/60 mb-6">
              Thank you, <span className="text-white">{state.name}</span>! Your
              order has been placed successfully.
            </p>
          </motion.div>

          {/* Order Details */}
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
              delay: 0.5
            }}
            className="rounded-2xl p-5 mb-6 border border-white/10 text-left space-y-3"
            style={{
              backgroundColor: 'rgba(255,255,255,0.06)'
            }}>

            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                Order ID
              </span>
              <span
                className="font-mono text-sm text-white font-bold"
                style={{
                  color: '#FF0000'
                }}>

                {state.orderId}
              </span>
            </div>
            {state.discountRp != null && state.discountRp > 0 &&
            <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Promo
                </span>
                <span className="font-mono text-xs text-green-400">
                  −{formatPrice(state.discountRp)}
                </span>
              </div>
            }
            {state.subtotalAfterPromoRp != null &&
            <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Merchandise
                </span>
                <span className="font-mono text-xs text-white">
                  {formatPrice(state.subtotalAfterPromoRp)}
                </span>
              </div>
            }
            {state.shippingRp != null &&
            <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Shipping
                </span>
                <span className="font-mono text-xs text-white">
                  {state.shippingRp === 0 ? 'FREE' : formatPrice(state.shippingRp)}
                </span>
              </div>
            }
            {state.taxRp != null &&
            <div className="flex justify-between items-center">
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Tax
                </span>
                <span className="font-mono text-xs text-white">
                  {formatPrice(state.taxRp)}
                </span>
              </div>
            }
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                Total
              </span>
              <span className="font-anton text-xl text-white">
                {formatPrice(state.total)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                Payment
              </span>
              <span className="font-mono text-xs text-white">
                {getPaymentLabel(state.paymentMethod)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                Delivery
              </span>
              <span className="font-mono text-xs text-green-400">
                3-5 Business Days
              </span>
            </div>
          </motion.div>

          {/* Email note */}
          <motion.p
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.6
            }}
            className="font-mono text-xs text-white/50 mb-8 leading-relaxed">

            We'll send a confirmation to{' '}
            <span className="text-white">{state.email}</span>
          </motion.p>

          {/* Order Tracking Steps */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.65
            }}
            className="flex items-center justify-center gap-2 mb-8">

            {[
            {
              icon: CheckCircleIcon,
              label: 'Confirmed',
              active: true
            },
            {
              icon: PackageIcon,
              label: 'Processing',
              active: false
            },
            {
              icon: TruckIcon,
              label: 'Shipped',
              active: false
            },
            {
              icon: HomeIcon,
              label: 'Delivered',
              active: false
            }].
            map((step, i) =>
            <Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1">
                  <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: step.active ?
                    'rgba(34,197,94,0.3)' :
                    'rgba(255,255,255,0.1)'
                  }}>

                    <step.icon
                    className={`w-4 h-4 ${step.active ? 'text-green-400' : 'text-white/30'}`} />

                  </div>
                  <span
                  className="font-mono text-xs"
                  style={{
                    color: step.active ?
                    'rgba(255,255,255,0.8)' :
                    'rgba(255,255,255,0.3)'
                  }}>

                    {step.label}
                  </span>
                </div>
                {i < 3 &&
              <div
                className="w-8 h-px mb-4"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.15)'
                }} />

              }
              </Fragment>
            )}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.7
            }}
            className="flex flex-col sm:flex-row gap-3">

            <button
              className="flex-1 font-mono text-sm uppercase tracking-widest py-3 rounded-xl font-bold border-2 border-white text-white hover:bg-white transition-colors"
              style={{
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = PRIMARY;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}>

              TRACK ORDER
            </button>
            <Link
              to="/"
              className="flex-1 font-mono text-sm uppercase tracking-widest py-3 rounded-xl font-bold text-white text-center transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#FF0000'
              }}>

              CONTINUE SHOPPING
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>);

}