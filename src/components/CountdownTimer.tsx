import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
function getTargetDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}
const TARGET_DATE = getTargetDate();
interface TimeUnit {
  value: number;
  label: string;
}
function pad(n: number) {
  return String(n).padStart(2, '0');
}
function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0)
  return {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
  const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
  const seconds = Math.floor(diff % (1000 * 60) / 1000);
  return {
    days,
    hours,
    minutes,
    seconds
  };
}
function AnimatedDigit({ value }: {value: string;}) {
  return (
    <div className="relative overflow-hidden h-[1em] inline-block">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{
            y: '100%',
            opacity: 0
          }}
          animate={{
            y: '0%',
            opacity: 1
          }}
          exit={{
            y: '-100%',
            opacity: 0
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="block">

          {value}
        </motion.span>
      </AnimatePresence>
    </div>);

}
export function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const units: TimeUnit[] = [
  {
    value: time.days,
    label: 'DAYS'
  },
  {
    value: time.hours,
    label: 'HRS'
  },
  {
    value: time.minutes,
    label: 'MIN'
  },
  {
    value: time.seconds,
    label: 'SEC'
  }];

  return (
    <section
      className="bg-black py-20 px-6 w-full"
      aria-label="Next drop countdown">

      <div className="max-w-screen-xl mx-auto text-center">
        <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mb-10">
          NEXT DROP DROPS IN
        </p>
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {units.map((unit, i) =>
          <div key={unit.label} className="flex items-end gap-4 md:gap-8">
              <div className="flex flex-col items-center">
                <div className="font-anton text-6xl md:text-9xl text-white leading-none">
                  <AnimatedDigit value={pad(unit.value)} />
                </div>
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest mt-2">
                  {unit.label}
                </span>
              </div>
              {i < units.length - 1 &&
            <span className="font-anton text-5xl md:text-8xl text-red leading-none pb-6">
                  :
                </span>
            }
            </div>
          )}
        </div>
        <motion.button
          whileHover={{
            scale: 1.02
          }}
          whileTap={{
            scale: 0.98
          }}
          className="mt-14 font-mono text-sm uppercase tracking-widest bg-red text-white px-12 py-4 border-2 border-red hover:bg-white hover:text-red transition-colors">

          NOTIFY ME
        </motion.button>
      </div>
    </section>);

}