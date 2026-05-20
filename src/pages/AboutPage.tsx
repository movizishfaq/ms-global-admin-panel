import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldCheckIcon,
  AwardIcon,
  CalendarIcon,
  HeartIcon,
  SmartphoneIcon,
  UsersIcon } from
'lucide-react';
const PRIMARY = '#9E055F';
const DARK = '#7a0449';
export function AboutPage() {
  return (
    <div
      className="w-full"
      style={{
        backgroundColor: PRIMARY
      }}>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-24 px-6"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #c4076e 0%, #9E055F 50%, #7a0449 100%)`
        }}>

        {/* Texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true">

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

          <div
            className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-5"
            style={{
              background:
              'radial-gradient(circle, #FF0000 0%, transparent 70%)'
            }} />

        </div>

        <div className="relative max-w-screen-xl mx-auto text-center">
          <motion.p
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mb-4">

            Multi-Level Marketing · E-Commerce · Pakistan
          </motion.p>
          <motion.h1
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.15,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="font-anton text-7xl md:text-9xl text-white leading-none uppercase mb-4">

            MS{' '}
            <span
              style={{
                color: '#FF0000'
              }}>

              GLOBAL
            </span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.35
            }}
            className="font-mono text-sm text-white/70 max-w-xl mx-auto leading-relaxed">

            Empowering Women Through Digital Commerce
          </motion.p>
        </div>
      </section>

      {/* ── WHO WE ARE ── */}
      <section className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Content */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.6
              }}
              className="rounded-2xl p-8 border border-white/10"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

              <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mb-3">
                Our Story
              </p>
              <h2 className="font-anton text-4xl text-white uppercase mb-6">
                WHO WE ARE
              </h2>
              <div className="space-y-4">
                <p className="font-mono text-sm text-white/80 leading-relaxed">
                  MS GLOBAL is a multi-level marketing e-commerce company that
                  empowers women and individuals to earn money through social
                  media. By providing an online platform, we're breaking down
                  barriers and creating opportunities for women who are
                  restricted from working outside the home.
                </p>
                <p className="font-mono text-sm text-white/80 leading-relaxed">
                  Founded by Mohammad Saif, a digital marketer and student, MS
                  GLOBAL is committed to supporting women's empowerment.
                </p>
                <p className="font-mono text-sm text-white/80 leading-relaxed">
                  Currently in its initial stages, MS GLOBAL has been recognized
                  by the Government of Pakistan, including SECP and FBR, and our
                  advertising campaigns are launching soon.
                </p>
              </div>
            </motion.div>

            {/* Founder Card */}
            <motion.div
              initial={{
                opacity: 0,
                x: 30
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.6,
                delay: 0.1
              }}
              className="space-y-6">

              <div
                className="rounded-2xl p-8 border border-white/10"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}>

                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: '#FF0000'
                    }}>

                    <span className="font-anton text-2xl text-white">MS</span>
                  </div>
                  <div>
                    <p className="font-anton text-xl text-white">
                      Mohammad Saif
                    </p>
                    <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
                      Founder & Digital Marketer
                    </p>
                  </div>
                </div>
                <blockquote
                  className="border-l-4 pl-4"
                  style={{
                    borderColor: '#FF0000'
                  }}>

                  <p className="font-mono text-sm text-white/80 italic leading-relaxed">
                    "We believe every woman deserves the opportunity to earn,
                    grow, and thrive — regardless of where she lives."
                  </p>
                </blockquote>
              </div>

              {/* Recognition Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="rounded-xl p-4 text-center border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }}>

                  <ShieldCheckIcon className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="font-mono text-xs text-white font-bold">SECP</p>
                  <p className="font-mono text-xs text-white/50 mt-0.5">
                    Recognized
                  </p>
                </div>
                <div
                  className="rounded-xl p-4 text-center border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }}>

                  <AwardIcon className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="font-mono text-xs text-white font-bold">FBR</p>
                  <p className="font-mono text-xs text-white/50 mt-0.5">
                    Registered
                  </p>
                </div>
                <div
                  className="rounded-xl p-4 text-center border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)'
                  }}>

                  <CalendarIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="font-mono text-xs text-white font-bold">
                    Est. 2024
                  </p>
                  <p className="font-mono text-xs text-white/50 mt-0.5">
                    Digital
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section
        className="py-16 px-6 border-t border-white/10"
        style={{
          backgroundColor: DARK
        }}>

        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-anton text-4xl md:text-5xl text-white uppercase">
              OUR VALUES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0
              }}
              className="rounded-2xl p-8 border border-white/10 text-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)'
              }}>

              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: 'rgba(255,0,0,0.2)'
                }}>

                <HeartIcon className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-anton text-2xl text-white uppercase mb-3">
                Women Empowerment
              </h3>
              <p className="font-mono text-sm text-white/60 leading-relaxed">
                Creating opportunities for women to earn from home, breaking
                barriers and building financial independence.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.1
              }}
              className="rounded-2xl p-8 border border-white/10 text-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)'
              }}>

              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: 'rgba(255,0,0,0.2)'
                }}>

                <SmartphoneIcon className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-anton text-2xl text-white uppercase mb-3">
                No Investment Required
              </h3>
              <p className="font-mono text-sm text-white/60 leading-relaxed">
                Start earning with just your phone and internet connection. No
                upfront cost, no risk — just opportunity.
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                delay: 0.2
              }}
              className="rounded-2xl p-8 border border-white/10 text-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)'
              }}>

              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: 'rgba(255,0,0,0.2)'
                }}>

                <UsersIcon className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="font-anton text-2xl text-white uppercase mb-3">
                Community Growth
              </h3>
              <p className="font-mono text-sm text-white/60 leading-relaxed">
                Build your network and grow together. Our community supports
                each other to achieve shared success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section
        className="py-16 px-6"
        style={{
          backgroundColor: DARK
        }}>

        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="font-anton text-4xl md:text-6xl text-white uppercase">
            JOIN THE{' '}
            <span
              style={{
                color: '#FF0000'
              }}>

              MS GLOBAL
            </span>{' '}
            FAMILY
          </h2>
          <Link
            to="/join"
            className="font-mono text-sm uppercase tracking-widest text-white px-12 py-4 font-bold rounded-lg whitespace-nowrap transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#FF0000'
            }}>

            GET STARTED FREE →
          </Link>
        </div>
      </section>
    </div>);

}