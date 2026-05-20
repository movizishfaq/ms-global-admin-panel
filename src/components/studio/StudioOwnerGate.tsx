import React from 'react';
import { Loader2Icon, ShieldIcon } from 'lucide-react';
import { useAuth } from '../../App';
import { authLogin } from '../../lib/api';
import { apiUserToStored } from '../../lib/authStorage';

const BG = '#0f0a12';
const CARD = 'rgba(255,255,255,0.06)';
const BORDER = 'rgba(255,255,255,0.1)';

/** Studio domain: only platform admins may access the website editor. */
export function StudioOwnerGate({ children }: { children: React.ReactNode }) {
  const { user, authLoading, signIn } = useAuth();

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG }}
      >
        <Loader2Icon className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <StudioAdminSignIn onSuccess={signIn} />;
  }

  if (user.role !== 'admin') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: BG }}
      >
        <div
          className="max-w-md w-full rounded-2xl border p-8 text-center"
          style={{ backgroundColor: CARD, borderColor: BORDER }}
        >
          <ShieldIcon className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h1 className="font-anton text-2xl text-white uppercase mb-2">
            Owner access only
          </h1>
          <p className="font-mono text-xs text-white/50 mb-6">
            This domain is for the site owner. Sign in with your admin account
            or use the public shop site.
          </p>
          <p className="font-mono text-xs text-white/40 mb-4">
            Signed in as {user.email} ({user.role})
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-mono text-xs uppercase tracking-widest text-white px-6 py-3 rounded-lg"
            style={{ backgroundColor: '#9E055F' }}
          >
            Sign in with owner account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function StudioAdminSignIn({
  onSuccess
}: {
  onSuccess: (session: {
    token: string;
    user: ReturnType<typeof apiUserToStored>;
  }) => void;
}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authLogin(email.trim(), password);
      if (user.role !== 'admin') {
        setError('THIS ACCOUNT IS NOT AN OWNER / ADMIN.');
        setLoading(false);
        return;
      }
      onSuccess({ token, user: apiUserToStored(user) });
    } catch (err) {
      setError(
        err instanceof Error ? err.message.toUpperCase() : 'SIGN IN FAILED.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: BG }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-8"
        style={{ backgroundColor: CARD, borderColor: BORDER }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#7a0449' }}
          >
            <ShieldIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-anton text-2xl text-white uppercase">
              Site Studio
            </h1>
            <p className="font-mono text-xs text-white/50">
              Owner login — separate from the public shop
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="OWNER@EMAIL.COM"
            className="w-full rounded-xl border px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 outline-none"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderColor: BORDER }}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PASSWORD"
            className="w-full rounded-xl border px-4 py-3 font-mono text-sm text-white placeholder:text-white/30 outline-none"
            style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderColor: BORDER }}
          />
          {error ? (
            <p className="font-mono text-xs text-red-400 uppercase">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-mono text-sm uppercase tracking-widest text-white py-3 rounded-xl font-bold disabled:opacity-60"
            style={{ backgroundColor: '#FF0000' }}
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN AS OWNER'}
          </button>
        </form>
        <p className="font-mono text-[10px] text-white/35 mt-6 text-center">
          Create an admin with{' '}
          <code className="text-white/50">npm run seed:admin</code> in the
          server folder.
        </p>
      </div>
    </div>
  );
}
