import { Eye, EyeOff, Landmark, LockKeyhole, LogIn, Mail, MailWarning, X } from 'lucide-react';
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
  const [isPasswordRecoveryNoticeOpen, setIsPasswordRecoveryNoticeOpen] = useState(false);

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
    <div
      className="admin-login-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-emerald-950 bg-cover bg-center px-6 py-10 text-slate-950"
      style={{ backgroundImage: "url('/imagemFundoLogin.jpeg')" }}
    >
      <div className="absolute inset-0 bg-white/25 backdrop-blur-[1px]" />
      <section className="relative w-full max-w-[27rem] rounded-3xl border border-white/60 bg-white/60 px-7 py-8 shadow-[0_22px_55px_rgba(15,23,42,0.18)] backdrop-blur-md sm:px-9 sm:py-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute left-1/2 flex h-11 w-11 -translate-x-[5.25rem] items-center justify-center rounded-md bg-emerald-600 text-white shadow-sm">
            <Landmark className="h-5 w-5" />
          </div>
          <h1 className="text-[1.65rem] font-bold tracking-tight text-emerald-600">Login</h1>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
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
            <button
              className="font-semibold text-teal-700 transition hover:text-teal-800"
              onClick={() => setIsPasswordRecoveryNoticeOpen(true)}
              type="button"
            >
              Esqueci minha senha
            </button>
          </div>

          <button
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            disabled={isSubmitting}
            type="submit"
          >
            <LogIn className="h-5 w-5" />
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>

      {isPasswordRecoveryNoticeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            aria-label="Fechar aviso"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            onClick={() => setIsPasswordRecoveryNoticeOpen(false)}
            type="button"
          />
          <section
            aria-labelledby="password-recovery-notice-title"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 text-slate-950 shadow-2xl"
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-700">
                <MailWarning className="h-5 w-5" />
              </div>
              <button
                aria-label="Fechar aviso"
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                onClick={() => setIsPasswordRecoveryNoticeOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-semibold text-slate-950" id="password-recovery-notice-title">
                Recuperação indisponível
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Essa funcionalidade só será possível ao implementar um servidor de email.</p>
            </div>

            <button
              className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
              onClick={() => setIsPasswordRecoveryNoticeOpen(false)}
              type="button"
            >
              Entendi
            </button>
          </section>
        </div>
      ) : null}
    </div>
  );
};
