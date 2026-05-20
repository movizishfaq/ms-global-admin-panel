import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeOffIcon, ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../App';
import { authLogin, authRegister } from '../lib/api';
import { apiUserToStored } from '../lib/authStorage';
import {
  clearStoredReferralCode,
  getStoredReferralCode
} from '../lib/referral';
type View = 'signin' | 'signup' | 'forgot';
const PRIMARY = '#9E055F';
const DARK = '#7a0449';
export function SignInPage() {
  const [view, setView] = useState<View>('signin');
  const navigate = useNavigate();
  const { signIn } = useAuth();
  return (
    <div
      className="w-full min-h-screen flex flex-col"
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

      <div className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {view === 'signin' &&
            <SignInForm
              key="signin"
              onSwitch={setView}
              onSuccess={(session) => {
                signIn(session);
                navigate('/dashboard');
              }} />

            }
            {view === 'signup' &&
            <SignUpForm
              key="signup"
              onSwitch={setView}
              onSuccess={(session) => {
                signIn(session);
                navigate('/dashboard');
              }} />

            }
            {view === 'forgot' &&
            <ForgotForm key="forgot" onSwitch={setView} />
            }
          </AnimatePresence>
        </div>
      </div>
    </div>);

}
// ─── Sign In Form ─────────────────────────────────────────────────────────────
function SignInForm({
  onSwitch,
  onSuccess



}: {
  onSwitch: (v: View) => void;
  onSuccess: (session: {
    token: string;
    user: ReturnType<typeof apiUserToStored>;
  }) => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('ALL FIELDS REQUIRED.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authLogin(email.trim(), password);
      onSuccess({ token, user: apiUserToStored(user) });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.toUpperCase()
          : 'SIGN IN FAILED.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
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

      <div className="text-center mb-10">
        <Link to="/" className="font-anton text-5xl text-white leading-none">
          MS-GLOBAL
          <span
            style={{
              color: '#FF0000'
            }}>

            .
          </span>
        </Link>
        <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mt-3">
          MEMBER SIGN IN
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-0">
        <div
          className="rounded-t-lg overflow-hidden border-2 border-white/20 border-b-0"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>

          <label
            htmlFor="email"
            className="block font-mono text-xs uppercase tracking-widest text-white/50 px-4 pt-4 pb-1">

            EMAIL
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="YOUR@EMAIL.COM"
            className="w-full font-mono text-sm bg-transparent text-white px-4 pb-4 focus:outline-none placeholder:text-white/20" />

        </div>
        <div
          className="rounded-b-lg overflow-hidden border-2 border-white/20 relative"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>

          <label
            htmlFor="password"
            className="block font-mono text-xs uppercase tracking-widest text-white/50 px-4 pt-4 pb-1">

            PASSWORD
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full font-mono text-sm bg-transparent text-white px-4 pb-4 pr-12 focus:outline-none placeholder:text-white/20" />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">

            {showPassword ?
            <EyeOffIcon className="w-4 h-4" /> :

            <EyeIcon className="w-4 h-4" />
            }
          </button>
        </div>

        {error &&
        <motion.p
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          className="font-mono text-xs text-red-400 uppercase tracking-widest pt-2">

            ★ {error}
          </motion.p>
        }

        <motion.button
          type="submit"
          whileTap={{
            scale: 0.99
          }}
          disabled={loading}
          className="w-full font-mono text-sm uppercase tracking-widest text-white py-4 mt-4 rounded-lg font-bold transition-colors disabled:opacity-50"
          style={{
            backgroundColor: '#FF0000'
          }}>

          {loading ? 'SIGNING IN...' : 'SIGN IN →'}
        </motion.button>
      </form>

      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={() => onSwitch('forgot')}
          className="font-mono text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors">

          FORGOT PASSWORD?
        </button>
        <div className="w-full border-t border-white/10" />
        <p className="font-mono text-xs text-white/50 uppercase tracking-widest">
          NO ACCOUNT?{' '}
          <button
            onClick={() => onSwitch('signup')}
            className="text-white hover:opacity-70 transition-opacity underline underline-offset-2">

            CREATE ONE
          </button>
        </p>
      </div>
    </motion.div>);

}
// ─── Sign Up Form ─────────────────────────────────────────────────────────────
function SignUpForm({
  onSwitch,
  onSuccess



}: {
  onSwitch: (v: View) => void;
  onSuccess: (session: {
    token: string;
    user: ReturnType<typeof apiUserToStored>;
  }) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError('ALL FIELDS REQUIRED.');
      return;
    }
    if (password !== confirm) {
      setError('PASSWORDS DO NOT MATCH.');
      return;
    }
    if (password.length < 8) {
      setError('PASSWORD TOO SHORT (MIN 8).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authRegister(
        email.trim(),
        password,
        name.trim(),
        'buyer',
        getStoredReferralCode()
      );
      clearStoredReferralCode();
      onSuccess({ token, user: apiUserToStored(user) });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.toUpperCase()
          : 'REGISTRATION FAILED.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
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

      <div className="text-center mb-8">
        <Link to="/" className="font-anton text-5xl text-white leading-none">
          MS-GLOBAL
          <span
            style={{
              color: '#FF0000'
            }}>

            .
          </span>
        </Link>
        <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mt-3">
          CREATE ACCOUNT
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {[
        {
          id: 'name',
          label: 'FULL NAME',
          value: name,
          onChange: setName,
          type: 'text',
          placeholder: 'YOUR NAME'
        },
        {
          id: 'reg-email',
          label: 'EMAIL',
          value: email,
          onChange: setEmail,
          type: 'email',
          placeholder: 'YOUR@EMAIL.COM'
        }].
        map((field) =>
        <div
          key={field.id}
          className="rounded-lg overflow-hidden border-2 border-white/20"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>

            <label
            htmlFor={field.id}
            className="block font-mono text-xs uppercase tracking-widest text-white/50 px-4 pt-3 pb-1">

              {field.label}
            </label>
            <input
            id={field.id}
            type={field.type}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full font-mono text-sm bg-transparent text-white px-4 pb-3 focus:outline-none placeholder:text-white/20" />

          </div>
        )}

        <div
          className="rounded-lg overflow-hidden border-2 border-white/20 relative"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>

          <label
            htmlFor="reg-password"
            className="block font-mono text-xs uppercase tracking-widest text-white/50 px-4 pt-3 pb-1">

            PASSWORD
          </label>
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="MIN 8 CHARACTERS"
            className="w-full font-mono text-sm bg-transparent text-white px-4 pb-3 pr-12 focus:outline-none placeholder:text-white/20" />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">

            {showPassword ?
            <EyeOffIcon className="w-4 h-4" /> :

            <EyeIcon className="w-4 h-4" />
            }
          </button>
        </div>

        <div
          className="rounded-lg overflow-hidden border-2 border-white/20"
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)'
          }}>

          <label
            htmlFor="confirm"
            className="block font-mono text-xs uppercase tracking-widest text-white/50 px-4 pt-3 pb-1">

            CONFIRM PASSWORD
          </label>
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="REPEAT PASSWORD"
            className="w-full font-mono text-sm bg-transparent text-white px-4 pb-3 focus:outline-none placeholder:text-white/20" />

        </div>

        {error &&
        <motion.p
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          className="font-mono text-xs text-red-400 uppercase tracking-widest pt-1">

            ★ {error}
          </motion.p>
        }

        <motion.button
          type="submit"
          whileTap={{
            scale: 0.99
          }}
          disabled={loading}
          className="w-full font-mono text-sm uppercase tracking-widest text-white py-4 mt-2 rounded-lg font-bold transition-colors disabled:opacity-50"
          style={{
            backgroundColor: '#FF0000'
          }}>

          {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => onSwitch('signin')}
          className="font-mono text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 mx-auto">

          <ArrowLeftIcon className="w-3 h-3" /> BACK TO SIGN IN
        </button>
      </div>
    </motion.div>);

}
// ─── Forgot Password Form ─────────────────────────────────────────────────────
function ForgotForm({ onSwitch }: {onSwitch: (v: View) => void;}) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30
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

      <div className="text-center mb-8">
        <Link to="/" className="font-anton text-5xl text-white leading-none">
          MS-GLOBAL
          <span
            style={{
              color: '#FF0000'
            }}>

            .
          </span>
        </Link>
        <p className="font-mono text-xs text-white/50 uppercase tracking-[0.3em] mt-3">
          RESET PASSWORD
        </p>
      </div>

      {sent ?
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="text-center py-8">

          <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)'
          }}>

            <span className="text-2xl">✉️</span>
          </div>
          <p className="font-anton text-2xl text-white mb-2">
            CHECK YOUR EMAIL
          </p>
          <p className="font-mono text-xs text-white/60 mb-6">
            We sent a reset link to
            <br />
            <span className="text-white">{email}</span>
          </p>
          <button
          onClick={() => onSwitch('signin')}
          className="font-mono text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 mx-auto">

            <ArrowLeftIcon className="w-3 h-3" /> BACK TO SIGN IN
          </button>
        </motion.div> :

      <>
          <p className="font-mono text-xs text-white/60 text-center mb-6 leading-relaxed">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={handleSubmit}>
            <div
            className="rounded-lg overflow-hidden border-2 border-white/20 mb-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}>

              <label
              htmlFor="forgot-email"
              className="block font-mono text-xs uppercase tracking-widest text-white/50 px-4 pt-4 pb-1">

                EMAIL ADDRESS
              </label>
              <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR@EMAIL.COM"
              className="w-full font-mono text-sm bg-transparent text-white px-4 pb-4 focus:outline-none placeholder:text-white/20" />

            </div>
            <motion.button
            type="submit"
            whileTap={{
              scale: 0.99
            }}
            disabled={loading || !email}
            className="w-full font-mono text-sm uppercase tracking-widest text-white py-4 rounded-lg font-bold transition-colors disabled:opacity-50"
            style={{
              backgroundColor: '#FF0000'
            }}>

              {loading ? 'SENDING...' : 'SEND RESET LINK →'}
            </motion.button>
          </form>
          <div className="mt-6 text-center">
            <button
            onClick={() => onSwitch('signin')}
            className="font-mono text-xs text-white/50 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 mx-auto">

              <ArrowLeftIcon className="w-3 h-3" /> BACK TO SIGN IN
            </button>
          </div>
        </>
      }
    </motion.div>);

}