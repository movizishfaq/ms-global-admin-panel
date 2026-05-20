import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  CreditCardIcon,
  SmartphoneIcon,
  ChevronRightIcon } from
'lucide-react';
import { useCart } from '../App';
import { useStore } from '../context/StoreContext';
import { computeCheckoutTotals } from '../lib/checkoutTotals';
import { formatRp, parseRp } from '../lib/money';
import type { PaymentMethodKey } from '../types/commerce';
import { recordReferralOrderCommission } from '../lib/api';
const PRIMARY = '#9E055F';
const DARK = '#7a0449';
interface ShippingForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
const inputClass =
'w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors placeholder:text-white/30 rounded-lg text-white';
const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderColor: 'rgba(255,255,255,0.2)'
};
export function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const store = useStore();
  const firstEnabledPayment = useMemo((): PaymentMethodKey => {
    const order: PaymentMethodKey[] = ['cod', 'card', 'jazzcash'];
    return (
      order.find((k) => store.paymentEnabled[k]) ?? 'cod'
    );
  }, [store.paymentEnabled]);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethodKey>('cod');
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan'
  });
  useEffect(() => {
    if (!store.paymentEnabled[paymentMethod]) {
      setPaymentMethod(firstEnabledPayment);
    }
  }, [store.paymentEnabled, paymentMethod, firstEnabledPayment]);
  const subtotalBeforePromoRp = cartItems.reduce(
    (sum, item) => sum + parseRp(item.price) * item.quantity,
    0
  );
  const totals = computeCheckoutTotals({
    subtotalBeforePromoRp,
    taxRatePercent: store.taxRatePercent,
    shippingFlatRp: store.shippingFlatRp,
    freeShippingOverRp: store.freeShippingOverRp,
    promoPercent: store.promoPercent
  });
  const anyPaymentEnabled =
    store.paymentEnabled.cod ||
    store.paymentEnabled.card ||
    store.paymentEnabled.jazzcash;
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ''
    }));
  };
  const validate = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.fullName) newErrors.fullName = 'Required';
    if (!form.email) newErrors.email = 'Required';
    if (!form.phone) newErrors.phone = 'Required';
    if (!form.address) newErrors.address = 'Required';
    if (!form.city) newErrors.city = 'Required';
    if (!form.postalCode) newErrors.postalCode = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handlePlaceOrder = () => {
    if (!validate()) return;
    if (cartItems.length === 0) return;
    if (!anyPaymentEnabled) return;
    if (!store.paymentEnabled[paymentMethod]) return;
    setLoading(true);
    const orderId = `MSG-${Math.floor(100000 + Math.random() * 900000)}`;
    setTimeout(() => {
      store.recordOrder({
        id: orderId,
        customerName: form.fullName,
        customerEmail: form.email,
        paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPriceRp: parseRp(item.price),
          lineTotalRp: parseRp(item.price) * item.quantity
        })),
        subtotalRp: totals.subtotalAfterPromoRp,
        taxRp: totals.taxRp,
        shippingRp: totals.shippingRp,
        totalRp: totals.totalRp
      });
      recordReferralOrderCommission(
        orderId,
        form.email.trim(),
        totals.totalRp
      ).catch(() => {});
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderId,
          total: totals.totalRp,
          paymentMethod,
          name: form.fullName,
          email: form.email,
          discountRp: totals.discountRp,
          subtotalAfterPromoRp: totals.subtotalAfterPromoRp,
          taxRp: totals.taxRp,
          shippingRp: totals.shippingRp
        }
      });
    }, 1500);
  };
  if (cartItems.length === 0) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: PRIMARY
        }}>

        <div className="text-center">
          <p className="font-mono text-white/60 mb-4">Your cart is empty</p>
          <Link
            to="/shop"
            className="font-mono text-sm uppercase tracking-widest text-white px-6 py-3 rounded-lg"
            style={{
              backgroundColor: '#FF0000'
            }}>

            BROWSE SHOP
          </Link>
        </div>
      </div>);

  }
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundColor: PRIMARY
      }}>

      {/* Header */}
      <section
        className="px-6 py-10"
        style={{
          backgroundColor: DARK
        }}>

        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 font-mono text-xs text-white/50 uppercase tracking-widest mb-3">
            <Link to="/cart" className="hover:text-white transition-colors">
              CART
            </Link>
            <ChevronRightIcon className="w-3 h-3" />
            <span className="text-white">CHECKOUT</span>
          </div>
          <h1 className="font-anton text-5xl md:text-7xl text-white uppercase leading-none">
            CHECKOUT
          </h1>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* LEFT: Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Shipping Details */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="rounded-2xl p-6 border border-white/10"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

              <h2 className="font-anton text-2xl text-white uppercase mb-6">
                SHIPPING DETAILS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    Full Name *
                  </label>
                  <input
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="FULL NAME"
                    className={inputClass}
                    style={inputStyle} />

                  {errors.fullName &&
                  <p className="font-mono text-xs text-red-400 mt-1">
                      {errors.fullName}
                    </p>
                  }
                </div>
                {/* Email */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="EMAIL ADDRESS"
                    className={inputClass}
                    style={inputStyle} />

                  {errors.email &&
                  <p className="font-mono text-xs text-red-400 mt-1">
                      {errors.email}
                    </p>
                  }
                </div>
                {/* Phone */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+92 300 0000000"
                    className={inputClass}
                    style={inputStyle} />

                  {errors.phone &&
                  <p className="font-mono text-xs text-red-400 mt-1">
                      {errors.phone}
                    </p>
                  }
                </div>
                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    Street Address *
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="STREET ADDRESS"
                    className={inputClass}
                    style={inputStyle} />

                  {errors.address &&
                  <p className="font-mono text-xs text-red-400 mt-1">
                      {errors.address}
                    </p>
                  }
                </div>
                {/* City */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    City *
                  </label>
                  <input
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="CITY"
                    className={inputClass}
                    style={inputStyle} />

                  {errors.city &&
                  <p className="font-mono text-xs text-red-400 mt-1">
                      {errors.city}
                    </p>
                  }
                </div>
                {/* Postal Code */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    Postal Code *
                  </label>
                  <input
                    name="postalCode"
                    type="text"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="POSTAL CODE"
                    className={inputClass}
                    style={inputStyle} />

                  {errors.postalCode &&
                  <p className="font-mono text-xs text-red-400 mt-1">
                      {errors.postalCode}
                    </p>
                  }
                </div>
                {/* Country */}
                <div className="sm:col-span-2">
                  <label className="block font-mono text-xs uppercase tracking-widest text-white/60 mb-2">
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className={inputClass}
                    style={{
                      ...inputStyle,
                      appearance: 'none'
                    }}>

                    <option
                      value="Pakistan"
                      style={{
                        backgroundColor: DARK
                      }}>

                      Pakistan
                    </option>
                    <option
                      value="India"
                      style={{
                        backgroundColor: DARK
                      }}>

                      India
                    </option>
                    <option
                      value="Indonesia"
                      style={{
                        backgroundColor: DARK
                      }}>

                      Indonesia
                    </option>
                    <option
                      value="Malaysia"
                      style={{
                        backgroundColor: DARK
                      }}>

                      Malaysia
                    </option>
                    <option
                      value="Other"
                      style={{
                        backgroundColor: DARK
                      }}>

                      Other
                    </option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
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
                delay: 0.1
              }}
              className="rounded-2xl p-6 border border-white/10"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

              <h2 className="font-anton text-2xl text-white uppercase mb-6">
                PAYMENT METHOD
              </h2>
              <div className="space-y-3">
                {store.paymentEnabled.cod &&
                <>
                    {/* COD */}
                    <button
                    onClick={() => setPaymentMethod('cod')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left"
                    style={{
                      borderColor:
                      paymentMethod === 'cod' ?
                      '#fff' :
                      'rgba(255,255,255,0.2)',
                      backgroundColor:
                      paymentMethod === 'cod' ?
                      'rgba(255,255,255,0.12)' :
                      'rgba(255,255,255,0.05)'
                    }}>

                      <TruckIcon className="w-6 h-6 text-white flex-shrink-0" />
                      <div>
                        <p className="font-mono text-sm text-white font-bold">
                          Cash on Delivery (COD)
                        </p>
                        <p className="font-mono text-xs text-white/50">
                          Pay when your order arrives
                        </p>
                      </div>
                      <div className="ml-auto w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                        {paymentMethod === 'cod' &&
                      <div className="w-2 h-2 rounded-full bg-white" />
                      }
                      </div>
                    </button>
                  </>
                }

                {store.paymentEnabled.card &&
                <>
                    <button
                    onClick={() => setPaymentMethod('card')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left"
                    style={{
                      borderColor:
                      paymentMethod === 'card' ?
                      '#fff' :
                      'rgba(255,255,255,0.2)',
                      backgroundColor:
                      paymentMethod === 'card' ?
                      'rgba(255,255,255,0.12)' :
                      'rgba(255,255,255,0.05)'
                    }}>

                      <CreditCardIcon className="w-6 h-6 text-white flex-shrink-0" />
                      <div>
                        <p className="font-mono text-sm text-white font-bold">
                          Card Payment (Stripe)
                        </p>
                        <p className="font-mono text-xs text-white/50">
                          Visa, Mastercard, Amex
                        </p>
                      </div>
                      <div className="ml-auto w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                        {paymentMethod === 'card' &&
                      <div className="w-2 h-2 rounded-full bg-white" />
                      }
                      </div>
                    </button>
                    {paymentMethod === 'card' &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto'
                    }}
                    className="grid grid-cols-2 gap-3 px-2">

                        <div className="col-span-2">
                          <input
                        type="text"
                        placeholder="CARD NUMBER"
                        className={inputClass}
                        style={inputStyle}
                        maxLength={19} />

                        </div>
                        <input
                      type="text"
                      placeholder="MM/YY"
                      className={inputClass}
                      style={inputStyle}
                      maxLength={5} />

                        <input
                      type="text"
                      placeholder="CVV"
                      className={inputClass}
                      style={inputStyle}
                      maxLength={4} />

                      </motion.div>
                  }
                  </>
                }

                {store.paymentEnabled.jazzcash &&
                <>
                    <button
                    onClick={() => setPaymentMethod('jazzcash')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors text-left"
                    style={{
                      borderColor:
                      paymentMethod === 'jazzcash' ?
                      '#fff' :
                      'rgba(255,255,255,0.2)',
                      backgroundColor:
                      paymentMethod === 'jazzcash' ?
                      'rgba(255,255,255,0.12)' :
                      'rgba(255,255,255,0.05)'
                    }}>

                      <SmartphoneIcon className="w-6 h-6 text-white flex-shrink-0" />
                      <div>
                        <p className="font-mono text-sm text-white font-bold">
                          JazzCash / EasyPaisa
                        </p>
                        <p className="font-mono text-xs text-white/50">
                          Mobile wallet payment
                        </p>
                      </div>
                      <div className="ml-auto w-4 h-4 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
                        {paymentMethod === 'jazzcash' &&
                      <div className="w-2 h-2 rounded-full bg-white" />
                      }
                      </div>
                    </button>
                    {paymentMethod === 'jazzcash' &&
                  <motion.div
                    initial={{
                      opacity: 0,
                      height: 0
                    }}
                    animate={{
                      opacity: 1,
                      height: 'auto'
                    }}
                    className="px-2">

                        <input
                      type="tel"
                      placeholder="MOBILE NUMBER (03XX XXXXXXX)"
                      className={inputClass}
                      style={inputStyle} />

                      </motion.div>
                  }
                  </>
                }
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-2">
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
                delay: 0.15
              }}
              className="rounded-2xl p-6 border border-white/10 sticky top-24"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

              <h2 className="font-anton text-2xl text-white uppercase mb-5">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {cartItems.map((item) =>
                <div key={item.id} className="flex items-center gap-3">
                    <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-white truncate">
                        {item.name}
                      </p>
                      <p className="font-mono text-xs text-white/50">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-white flex-shrink-0">
                      {formatRp(parseRp(item.price) * item.quantity)}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-white/60">
                    Subtotal
                  </span>
                  <span className="font-mono text-sm text-white">
                    {formatRp(subtotalBeforePromoRp)}
                  </span>
                </div>
                {totals.discountRp > 0 &&
                <div className="flex justify-between">
                    <span className="font-mono text-sm text-white/60">
                      Promo ({store.promoPercent}%)
                    </span>
                    <span className="font-mono text-sm text-green-400">
                      −{formatRp(totals.discountRp)}
                    </span>
                  </div>
                }
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-white/60">
                    Shipping
                  </span>
                  <span
                  className={`font-mono text-sm font-bold ${totals.shippingRp === 0 ? 'text-green-400' : 'text-white'}`}>

                    {totals.shippingRp === 0 ? 'FREE' : formatRp(totals.shippingRp)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono text-sm text-white/60">
                    Tax ({store.taxRatePercent}%)
                  </span>
                  <span className="font-mono text-sm text-white">
                    {formatRp(totals.taxRp)}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between">
                  <span className="font-mono text-sm text-white font-bold">
                    TOTAL
                  </span>
                  <span className="font-anton text-2xl text-white">
                    {formatRp(totals.totalRp)}
                  </span>
                </div>
              </div>

              {!anyPaymentEnabled &&
              <p className="font-mono text-xs text-amber-300 mb-3 text-center uppercase tracking-widest">
                  Checkout is unavailable — payment options are not enabled yet.
                </p>
              }
              <motion.button
                onClick={handlePlaceOrder}
                disabled={loading || !anyPaymentEnabled}
                whileTap={{
                  scale: 0.99
                }}
                className="w-full font-mono text-sm uppercase tracking-widest text-white py-4 rounded-xl font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{
                  backgroundColor: '#FF0000'
                }}>

                {loading ? 'PLACING ORDER...' : 'PLACE ORDER →'}
              </motion.button>

              <p className="font-mono text-xs text-white/30 text-center mt-3 uppercase tracking-widest">
                Secure · Encrypted · Trusted
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>);

}