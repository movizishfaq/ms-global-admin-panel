import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useCart } from '../App';
export function CartNotification() {
  const { pathname } = useLocation();
  const { notification } = useCart();
  if (pathname.startsWith('/admin')) return null;
  return (
    <AnimatePresence>
      {notification &&
      <motion.div
        initial={{
          y: -80,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        exit={{
          y: -80,
          opacity: 0
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="fixed top-0 left-0 right-0 z-[100] text-white py-4 px-6 flex items-center justify-center gap-4"
        style={{
          backgroundColor: '#7a0449'
        }}
        role="alert"
        aria-live="polite">

          <span className="font-mono text-sm uppercase tracking-widest text-center">
            <span
            style={{
              color: '#FF0000'
            }}>

              ★
            </span>{' '}
            ADDED TO CART —{' '}
            <span className="text-white font-bold">{notification.name}</span>
          </span>
        </motion.div>
      }
    </AnimatePresence>);

}