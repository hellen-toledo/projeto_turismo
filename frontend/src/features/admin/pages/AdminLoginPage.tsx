import { Eye, EyeOff, Landmark, LockKeyhole, LogIn, Mail } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { getStoredString, removeStoredString, setStoredString } from '../../../shared/lib/storage/browserStorage';
import { useAdminAuth } from '../hooks/useAdminAuth';
import type { AdminFeedback } from '../types/admin';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

const rememberedAdminEmailKey = 'turismo-admin-remembered-email';

export const AdminLoginPage = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rememberedEmail = getStoredString(rememberedAdminEmailKey) ?? '';
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(Boolean(rememberedEmail));
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate replace to="/admin" />;
  }

  const locationState = location.state as LocationState | null;
  const redirectTo = locationState?.from?.pathname || '/admin';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await login({ email, password });

      if (rememberEmail) {
        setStoredString(rememberedAdminEmailKey, email);
      } else {
        removeStoredString(rememberedAdminEmailKey);
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Não foi possível autenticar.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-shell flex min-h-screen items-center justify-center bg-[#fbfdfc] px-6 py-10 text-slate-950">
      <section className="w-full max-w-[30.5rem] rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-[0_22px_55px_rgba(15,23,42,0.12)] sm:px-11 sm:py-12">
        <div className="flex items-center justify-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Turismo</p>
            <p className="text-base font-bold text-slate-950">Norte-Goiano</p>
          </div>
        </div>

        <div className="mt-9 text-center">
          <h1 className="text-[1.65rem] font-bold tracking-tight text-slate-950">Acesse sua conta</h1>
          <p className="mx-auto mt-4 max-w-[19rem] text-sm leading-6 text-slate-500">Entre para gerenciar eventos, cidades e regiões do portal.</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <FormAlert feedback={feedback} />

          <label className="block text-sm font-semibold text-slate-900" htmlFor="admin-email">
            E-mail
            <span className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
              <Mail className="h-4 w-4 shrink-0" />
              <input
                autoComplete="email"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                id="admin-email"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                placeholder="seu@email.com"
                type="email"
                value={email}
              />
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-900" htmlFor="admin-password">
            Senha
            <span className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-slate-500 transition focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
              <LockKeyhole className="h-4 w-4 shrink-0" />
              <input
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                id="admin-password"
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                placeholder="Digite sua senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
              />
              <button
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="rounded-md p-1 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="inline-flex items-center gap-2 text-slate-600">
              <input
                checked={rememberEmail}
                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                onChange={(event) => {
                  setRememberEmail(event.target.checked);
                }}
                type="checkbox"
              />
              Lembrar-me
            </label>
            <a className="font-semibold text-teal-700 transition hover:text-teal-800" href="mailto:suporte@turismonortegoiano.local?subject=Recuperar%20senha%20administrativa">
              Esqueci minha senha
            </a>
          </div>

          <button
            className="inline-flex h-[3.25rem] w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-teal-900/15 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-teal-300"
            disabled={isSubmitting}
            type="submit"
          >
            <LogIn className="h-5 w-5" />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </div>
  );
};
