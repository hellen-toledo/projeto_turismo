import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FormAlert } from '../../../shared/components/form/FormAlert';
import { TextInput } from '../../../shared/components/form/TextInput';
import { useAdminAuth } from '../hooks/useAdminAuth';
import type { AdminFeedback } from '../types/admin';

interface LocationState {
  from?: {
    pathname?: string;
  };
}

export const AdminLoginPage = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
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
    <div className="min-h-screen bg-[linear-gradient(135deg,_#052e16_0%,_#064e3b_42%,_#ecfeff_42%,_#f8fafc_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[36px] border border-white/10 bg-slate-950/70 p-8 text-white shadow-2xl backdrop-blur md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.36em] text-emerald-300">Área Administrativa</p>
          <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-5xl">
            Base de autenticação e operação para o futuro painel do projeto.
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-300">
            A entrada administrativa já nasce separada da navegação pública, com sessão persistida, rotas protegidas e formulários reutilizáveis.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <ShieldCheck className="h-6 w-6 text-emerald-300" />
              <p className="mt-4 text-lg font-semibold">Fluxo isolado</p>
              <p className="mt-2 text-sm text-slate-300">A rota /admin usa layout, guarda e estado próprios.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <LockKeyhole className="h-6 w-6 text-emerald-300" />
              <p className="mt-4 text-lg font-semibold">Expansão pronta</p>
              <p className="mt-2 text-sm text-slate-300">Cidades, eventos, regiões e tags já entram na mesma arquitetura.</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] bg-white p-8 shadow-2xl shadow-slate-900/10 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Login Admin</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">Acessar operações</h2>
          <p className="mt-3 text-sm text-slate-500">Use as credenciais administrativas do seed para testar o fluxo base.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <FormAlert feedback={feedback} />

            <TextInput
              autoComplete="email"
              id="admin-email"
              label="E-mail"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              type="email"
              value={email}
            />

            <TextInput
              autoComplete="current-password"
              id="admin-password"
              label="Senha"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              type="password"
              value={password}
            />

            <button
              className="w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar na área administrativa'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};
