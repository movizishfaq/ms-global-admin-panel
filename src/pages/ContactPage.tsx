import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}
const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  borderColor: 'rgba(255,255,255,0.2)',
  color: '#fff'
};
export function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [ticketId] = useState(
    () => `MSG-${Math.floor(Math.random() * 90000) + 10000}`
  );
  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>

  {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSubmitted(true);
  };
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundColor: '#9E055F'
      }}>

      {/* Header */}
      <section
        className="px-6 py-12"
        style={{
          backgroundColor: '#7a0449'
        }}>

        <div className="max-w-screen-xl mx-auto">
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
              duration: 0.6
            }}
            className="font-anton text-6xl md:text-8xl text-white uppercase leading-none">

            CONTACT{' '}
            <span
              style={{
                color: '#FF0000'
              }}>

              US
            </span>
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.3
            }}
            className="font-mono text-xs uppercase tracking-widest mt-4"
            style={{
              color: 'rgba(255,255,255,0.5)'
            }}>

            SUBMIT A SUPPORT TICKET — WE RESPOND WITHIN 48HRS
          </motion.p>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ?
            <motion.div
              key="form"
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -20
              }}
              transition={{
                duration: 0.4
              }}>

                {/* Ticket Header */}
                <div className="bg-black text-white p-4 flex items-center justify-between rounded-t-xl">
                  <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{
                    color: 'rgba(255,255,255,0.6)'
                  }}>

                    NEW SUPPORT TICKET
                  </span>
                  <span
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{
                    color: '#FF0000'
                  }}>

                    MS GLOBAL SUPPORT
                  </span>
                </div>

                {/* Ticket Body */}
                <form
                onSubmit={handleSubmit}
                className="rounded-b-xl p-8 space-y-6 border border-white/20 border-t-0"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)'
                }}
                aria-label="Contact form">

                  {/* Ticket meta */}
                  <div className="flex gap-6 pb-6 border-b border-white/10">
                    <div>
                      <p
                      className="font-mono text-xs uppercase tracking-widest mb-1"
                      style={{
                        color: 'rgba(255,255,255,0.4)'
                      }}>

                        TICKET ID
                      </p>
                      <p
                      className="font-mono text-sm"
                      style={{
                        color: '#FF0000'
                      }}>

                        {ticketId}
                      </p>
                    </div>
                    <div>
                      <p
                      className="font-mono text-xs uppercase tracking-widest mb-1"
                      style={{
                        color: 'rgba(255,255,255,0.4)'
                      }}>

                        STATUS
                      </p>
                      <p className="font-mono text-sm text-white">OPEN</p>
                    </div>
                    <div>
                      <p
                      className="font-mono text-xs uppercase tracking-widest mb-1"
                      style={{
                        color: 'rgba(255,255,255,0.4)'
                      }}>

                        PRIORITY
                      </p>
                      <p className="font-mono text-sm text-white">NORMAL</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label
                    htmlFor="name"
                    className="block font-mono text-xs uppercase tracking-widest mb-2"
                    style={{
                      color: 'rgba(255,255,255,0.7)'
                    }}>

                      FULL NAME *
                    </label>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="YOUR NAME"
                    className="w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors placeholder:text-white/30 rounded-lg"
                    style={inputStyle} />

                  </div>

                  {/* Email */}
                  <div>
                    <label
                    htmlFor="email"
                    className="block font-mono text-xs uppercase tracking-widest mb-2"
                    style={{
                      color: 'rgba(255,255,255,0.7)'
                    }}>

                      EMAIL ADDRESS *
                    </label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="YOUR@EMAIL.COM"
                    className="w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors placeholder:text-white/30 rounded-lg"
                    style={inputStyle} />

                  </div>

                  {/* Subject */}
                  <div>
                    <label
                    htmlFor="subject"
                    className="block font-mono text-xs uppercase tracking-widest mb-2"
                    style={{
                      color: 'rgba(255,255,255,0.7)'
                    }}>

                      SUBJECT
                    </label>
                    <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors appearance-none cursor-pointer rounded-lg"
                    style={inputStyle}>

                      <option
                      value=""
                      style={{
                        backgroundColor: '#7a0449'
                      }}>

                        SELECT A SUBJECT
                      </option>
                      <option
                      value="order"
                      style={{
                        backgroundColor: '#7a0449'
                      }}>

                        ORDER INQUIRY
                      </option>
                      <option
                      value="return"
                      style={{
                        backgroundColor: '#7a0449'
                      }}>

                        RETURN / EXCHANGE
                      </option>
                      <option
                      value="partner"
                      style={{
                        backgroundColor: '#7a0449'
                      }}>

                        PARTNERSHIP
                      </option>
                      <option
                      value="commission"
                      style={{
                        backgroundColor: '#7a0449'
                      }}>

                        COMMISSION QUERY
                      </option>
                      <option
                      value="other"
                      style={{
                        backgroundColor: '#7a0449'
                      }}>

                        OTHER
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                    htmlFor="message"
                    className="block font-mono text-xs uppercase tracking-widest mb-2"
                    style={{
                      color: 'rgba(255,255,255,0.7)'
                    }}>

                      MESSAGE *
                    </label>
                    <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="DESCRIBE YOUR ISSUE OR QUESTION..."
                    className="w-full font-mono text-sm border-2 px-4 py-3 focus:outline-none transition-colors resize-none placeholder:text-white/30 rounded-lg"
                    style={inputStyle} />

                  </div>

                  <motion.button
                  type="submit"
                  whileTap={{
                    scale: 0.99
                  }}
                  className="w-full font-mono text-sm uppercase tracking-widest text-white py-4 rounded-lg font-bold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: '#FF0000'
                  }}>

                    SUBMIT TICKET →
                  </motion.button>
                </form>

                <div className="mt-3 text-center">
                  <p
                  className="font-mono text-xs uppercase tracking-widest"
                  style={{
                    color: 'rgba(255,255,255,0.3)'
                  }}>

                    RESPONSE TIME: 24-48 HOURS ★ MON-FRI 9AM-6PM PKT
                  </p>
                </div>
              </motion.div> :

            <motion.div
              key="success"
              initial={{
                opacity: 0,
                scale: 0.95
              }}
              animate={{
                opacity: 1,
                scale: 1
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="rounded-2xl overflow-hidden border border-white/20"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)'
              }}>

                <div
                className="p-4 flex items-center justify-between"
                style={{
                  backgroundColor: '#FF0000'
                }}>

                  <span className="font-mono text-xs uppercase tracking-widest text-white">
                    TICKET SUBMITTED
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-white">
                    {ticketId}
                  </span>
                </div>
                <div className="p-12 text-center">
                  <div className="font-anton text-8xl text-white mb-4">✓</div>
                  <h2 className="font-anton text-4xl text-white uppercase mb-4">
                    TICKET{' '}
                    <span
                    style={{
                      color: '#FF0000'
                    }}>

                      RECEIVED
                    </span>
                  </h2>
                  <p className="font-mono text-sm text-white/60 leading-relaxed max-w-sm mx-auto">
                    We've got your message. Expect a reply within 48 hours.
                    Check your inbox at{' '}
                    <span
                    style={{
                      color: '#FF0000'
                    }}>

                      {form.email}
                    </span>
                    .
                  </p>
                  <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 font-mono text-xs uppercase tracking-widest border-2 border-white/40 text-white px-8 py-3 hover:border-white transition-colors rounded-lg">

                    SUBMIT ANOTHER
                  </button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}