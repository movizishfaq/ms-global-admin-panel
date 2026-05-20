import React from 'react';
import { motion } from 'framer-motion';
import { StudioSelectBar } from './studio/StudioSelectBar';
const DEFAULT_TICKER =
'MS-GLOBAL ★ PREMIUM LADIES OIL & BEAUTY ★ FREE SHIPPING ON ORDERS OVER Rp200.000 ★ SHOP NOW ★ MS-GLOBAL ★ PREMIUM LADIES OIL & BEAUTY ★ FREE SHIPPING ON ORDERS OVER Rp200.000 ★';
export function Marquee({
  text,
  durationSeconds = 28
}: {
  text?: string;
  durationSeconds?: number;
}) {
  const ticker = text?.trim() ? text : DEFAULT_TICKER;
  return (
    <div className="relative" aria-label="Announcements ticker">
      <div className="relative bg-black overflow-hidden h-10 flex items-center">
        <StudioSelectBar
          panel="home-editor"
          label="Ticker"
          block="marquee"
          anchor="above"
        />
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ['0%', '-50%']
          }}
          transition={{
            duration: Math.max(6, durationSeconds),
            ease: 'linear',
            repeat: Infinity
          }}>

          <span className="font-mono text-xs text-white uppercase tracking-widest pr-8">
            {ticker}
          </span>
          <span className="font-mono text-xs text-white uppercase tracking-widest pr-8">
            {ticker}
          </span>
        </motion.div>
      </div>
    </div>);

}