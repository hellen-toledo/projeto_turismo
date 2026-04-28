import { ArrowRight, CalendarRange, Images, MapPinned, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/admin/cities',
    title: 'Cidades',
    description: 'Cadastre, publique e mantenha a taxonomia regional das cidades.',
    icon: MapPinned,
  },
  {
    to: '/admin/events',
    title: 'Eventos',
    description: 'Gerencie agenda, destaque editorial e vínculo com cidades/tags.',
    icon: CalendarRange,
  },
  {
    to: '/admin/media',
    title: 'Mídia',
    description: 'Centralize upload, preview, remoção e reutilização de imagens administrativas.',
    icon: Images,
  },
];

export const AdminHomePage = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-300/30">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Visão Geral</p>
          <h1 className="mt-4 text-4xl font-black">Frontend administrativo preparado para crescer em camadas.</h1>
          <p className="mt-4 text-base text-slate-300">
            Esta base já separa autenticação, guardas de rota, serviços CRUD, formulários reaproveitáveis e feedback operacional. O próximo passo pode ser dashboard, permissões finas ou upload real sem retrabalho estrutural.
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.to}
              className="group rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 transition-transform hover:-translate-y-1"
              to={card.to}
            >
              <Icon className="h-6 w-6 text-emerald-600" />
              <h2 className="mt-6 text-2xl font-black text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm text-slate-500">{card.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                Abrir módulo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="rounded-[28px] border border-emerald-100 bg-emerald-50/70 p-6">
        <div className="flex items-start gap-4">
          <Shield className="mt-1 h-5 w-5 text-emerald-700" />
          <div>
            <h2 className="text-lg font-black text-slate-900">O que já está pronto</h2>
            <p className="mt-2 text-sm text-slate-600">
              Sessão persistida, proteção de rota, consulta de sessão atual, listagens simples, criação, edição e remoção de cidades e eventos com dependências auxiliares de regiões e tags.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
