import React, { useEffect } from 'react';
import { captureReferralFromUrl } from '../lib/referral';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  BookOpenIcon,
  ShareIcon,
  DollarSignIcon,
  CheckCircleIcon,
  ZapIcon,
  CalendarIcon,
  GraduationCapIcon,
  GiftIcon } from
'lucide-react';
const PRIMARY = '#9E055F';
const DARK = '#7a0449';
const STEPS = [
{
  step: '01',
  icon: UserPlusIcon,
  title: 'Sign Up',
  description:
  'Create your free MS Global account. No investment required to get started.',
  badge: 'Free to join'
},
{
  step: '02',
  icon: GraduationCapIcon,
  title: 'Get Training',
  description:
  'Access our comprehensive training materials and learn how to sell effectively.',
  badge: 'Free training'
},
{
  step: '03',
  icon: ShareIcon,
  title: 'Share Products',
  description:
  'Share MS Global products on your social media and earn commissions on every sale.',
  badge: 'Instant visibility'
},
{
  step: '04',
  icon: DollarSignIcon,
  title: 'Earn Commission',
  description:
  'Get paid weekly. Track your earnings and profit in your personal dashboard.',
  badge: 'Weekly payouts'
}];

const BENEFITS = [
{
  icon: ZapIcon,
  title: 'Zero Investment',
  desc: 'No upfront cost to join MS Global.'
},
{
  icon: CalendarIcon,
  title: 'Weekly Payouts',
  desc: 'Get paid every week to your account.'
},
{
  icon: GraduationCapIcon,
  title: 'Free Training',
  desc: 'Complete training provided by MS Global.'
},
{
  icon: GiftIcon,
  title: 'Referral Bonuses',
  desc: 'Earn extra by referring new partners.'
}];

export function JoinPage() {
  useEffect(() => {
    captureReferralFromUrl();
  }, []);

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: PRIMARY
      }}>

      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 px-6"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, #c4076e 0%, #9E055F 50%, #7a0449 100%)`
        }}>

        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true">

          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, #fff 0%, transparent 70%)'
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

            Earn Online with MS Global
          </motion.p>
          <motion.h1
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="font-anton text-6xl md:text-8xl text-white leading-none uppercase mb-4">

            JOIN WITH
            <br />
            <span
              style={{
                color: '#FF0000'
              }}>

              US
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
              delay: 0.3
            }}
            className="font-mono text-sm text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed">

            Join our network and start earning online with MS Global, a
            pioneering MLM company. Whether you're an influencer or an
            individual looking to start a new opportunity, we welcome all.
            Leverage our platform, training, and skills provided by us – no
            experience or investment required. Use your phone and internet
            connection to earn rewards and grow your income.
          </motion.p>
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
              delay: 0.4
            }}
            className="flex gap-3 justify-center flex-wrap">

            <Link
              to="/signin"
              className="font-mono text-sm uppercase tracking-widest text-white px-10 py-4 font-bold rounded-lg transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#FF0000'
              }}>

              START EARNING →
            </Link>
            <a
              href="#how-it-works"
              className="font-mono text-sm uppercase tracking-widest text-white px-10 py-4 font-bold rounded-lg border-2 border-white/30 hover:border-white transition-colors">

              HOW IT WORKS
            </a>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-12">
            {[
            {
              value: '10K+',
              label: 'Partners'
            },
            {
              value: 'PKR 50M+',
              label: 'Paid Out'
            },
            {
              value: '4.9★',
              label: 'Partner Rating'
            }].
            map((stat, i) =>
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                delay: 0.5 + i * 0.1
              }}
              className="text-center">

                <p className="font-anton text-3xl text-white">{stat.value}</p>
                <p className="font-mono text-xs text-white/50 uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mb-3">
              Simple Process
            </p>
            <h2 className="font-anton text-4xl md:text-5xl text-white uppercase">
              HOW IT WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STEPS.map((step, i) =>
            <motion.div
              key={step.step}
              initial={{
                opacity: 0,
                y: 30
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-50px'
              }}
              transition={{
                delay: i * 0.1,
                duration: 0.5
              }}
              className="rounded-2xl overflow-hidden border border-white/10"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

                <div
                  className="relative h-48 overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${PRIMARY} 0%, ${DARK} 100%)`
                  }}>

                  <div className="absolute top-4 left-4">
                    <span className="font-anton text-6xl text-white/20">
                      {step.step}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: '#FF0000'
                    }}>

                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-anton text-2xl text-white uppercase">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-mono text-sm text-white/70 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    <span className="font-mono text-xs text-green-400">
                      {step.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        className="py-16 px-6 border-t border-white/10"
        style={{
          backgroundColor: DARK
        }}>

        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-anton text-4xl text-white uppercase">
              WHY JOIN MS GLOBAL?
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) =>
            <motion.div
              key={b.title}
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
                delay: i * 0.1
              }}
              className="text-center p-6 rounded-xl border border-white/10"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}>

                <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor: 'rgba(255,0,0,0.2)'
                }}>

                  <b.icon className="w-6 h-6 text-red-400" />
                </div>
                <p className="font-anton text-lg text-white mb-2">{b.title}</p>
                <p className="font-mono text-xs text-white/50 leading-relaxed">
                  {b.desc}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* MS Global Description */}
      <section
        className="py-16 px-6"
        style={{
          backgroundColor: PRIMARY
        }}>

        <div className="max-w-screen-xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 border border-white/10 text-center"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)'
            }}>

            <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mb-4">
              About the Opportunity
            </p>
            <h3 className="font-anton text-3xl text-white uppercase mb-6">
              MS GLOBAL – Empowering Your Online Earning Potential
            </h3>
            <p className="font-mono text-sm text-white/70 leading-relaxed max-w-3xl mx-auto mb-4">
              As a partner with MS Global, you'll have access to a range of
              opportunities to monetize your online presence. For more
              information on how to get started and join our community, please
              contact us.
            </p>
            <p className="font-mono text-sm text-white/70 leading-relaxed max-w-3xl mx-auto">
              Use your phone and internet connection to earn rewards and grow
              your income. No experience or investment required — we provide all
              the training and tools you need.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{
          backgroundColor: DARK
        }}>

        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          viewport={{
            once: true
          }}
          transition={{
            duration: 0.6
          }}>

          <h2 className="font-anton text-5xl md:text-7xl text-white uppercase mb-4">
            READY TO START
            <br />
            <span
              style={{
                color: '#FF0000'
              }}>

              EARNING?
            </span>
          </h2>
          <p className="font-mono text-sm text-white/60 mb-8 max-w-md mx-auto">
            Join thousands of partners already earning with MS Global.
          </p>
          <Link
            to="/signin"
            className="inline-block font-mono text-sm uppercase tracking-widest text-white px-12 py-5 font-bold rounded-lg transition-opacity hover:opacity-90"
            style={{
              backgroundColor: '#FF0000'
            }}>

            JOIN MS GLOBAL FREE →
          </Link>
        </motion.div>
      </section>
    </div>);

}