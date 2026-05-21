import { Backpack, CalendarDays, Car, Compass, Droplets, HeartPulse, Map, ShieldCheck, SunMedium, Utensils } from 'lucide-react';

const quickTips = [
  {
    title: 'Planeje os deslocamentos',
    description: 'As distâncias entre cidades podem ser longas. Confira combustível, sinal de celular e tempo de estrada antes de sair.',
    icon: Car,
  },
  {
    title: 'Reserve com antecedência',
    description: 'Em feriados, temporada de praias e eventos regionais, pousadas e guias podem esgotar rapidamente.',
    icon: CalendarDays,
  },
  {
    title: 'Leve dinheiro e cartão',
    description: 'Alguns atrativos, comunidades e serviços locais podem ter sinal instável para pagamentos digitais.',
    icon: Backpack,
  },
  {
    title: 'Contrate guias locais',
    description: 'Em trilhas, cachoeiras e áreas rurais, guias melhoram a segurança e fortalecem a economia da região.',
    icon: Compass,
  },
];

const planningItems = [
  'Documento pessoal e comprovantes de reserva',
  'Protetor solar, repelente, boné ou chapéu',
  'Calçado fechado para trilhas e chinelo para áreas de água',
  'Garrafa reutilizável e lanches leves',
  'Medicamentos de uso contínuo e kit básico de primeiros socorros',
  'Saco para recolher resíduos durante passeios',
];

const seasons = [
  {
    title: 'Período seco',
    period: 'maio a setembro',
    description: 'Melhor para trilhas, estrada de terra e observação de paisagens. O ar pode ficar seco, então hidrate-se bem.',
  },
  {
    title: 'Período chuvoso',
    period: 'outubro a abril',
    description: 'A vegetação fica mais verde e as cachoeiras ganham volume. Redobre atenção com trombas d agua e estradas rurais.',
  },
  {
    title: 'Temporada de rios e lagos',
    period: 'feriados e férias',
    description: 'Praias fluviais, pesca esportiva e passeios embarcados costumam ter maior procura. Reserve antes.',
  },
];

const etiquette = [
  {
    title: 'Natureza',
    description: 'Permaneça nas trilhas, não alimente animais, não retire plantas e traga seu lixo de volta.',
    icon: SunMedium,
  },
  {
    title: 'Água',
    description: 'Evite entrar em rios e cachoeiras durante chuva forte ou quando a água mudar de cor rapidamente.',
    icon: Droplets,
  },
  {
    title: 'Comunidades',
    description: 'Peça autorização para fotografar pessoas, respeite áreas privadas e valorize produtos locais.',
    icon: HeartPulse,
  },
  {
    title: 'Gastronomia',
    description: 'Experimente restaurantes familiares, feiras e sabores do cerrado. Verifique horários, pois podem variar por cidade.',
    icon: Utensils,
  },
];

export const VisitorGuidePage = () => {
  return (
    <section className="space-y-12">
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg">
        <div className="relative min-h-[18rem] bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gray-950/65" />
          <div className="relative flex min-h-[18rem] flex-col justify-end px-5 py-8 sm:px-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-green-500">Guia do visitante</p>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-5xl">
              Prepare sua viagem pelo Norte Goiano
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 md:text-base">
              Informações práticas para circular entre cidades, visitar cachoeiras, curtir rios e lagos, respeitar comunidades locais e aproveitar melhor cada roteiro.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {quickTips.map(({ description, icon: Icon, title }) => (
          <article key={title} className="rounded-xl border border-gray-800 bg-gray-900 p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <Icon className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
              <Map className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Antes de sair</h2>
              <p className="text-sm text-gray-400">Checklist básico para passeios urbanos, rurais e de natureza.</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {planningItems.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-gray-800 bg-gray-950/40 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <p className="text-sm leading-6 text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-white">Melhor época</h2>
          <div className="mt-5 space-y-3">
            {seasons.map((season) => (
              <article key={season.title} className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white">{season.title}</h3>
                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">{season.period}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">{season.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-white">Conduta responsável</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
          O turismo no Norte Goiano depende da preservação dos atrativos naturais e do respeito a quem vive nos destinos. Use estas orientações como ponto de partida.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {etiquette.map(({ description, icon: Icon, title }) => (
            <article key={title} className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
              <Icon className="h-5 w-5 text-green-500" />
              <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-white">Em caso de emergência</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">
          Tenha estes contatos à mão durante deslocamentos, trilhas e passeios em rios ou lagos.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
            <p className="text-sm font-semibold text-gray-400">Polícia Militar</p>
            <p className="mt-2 text-2xl font-black text-green-500">190</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
            <p className="text-sm font-semibold text-gray-400">SAMU</p>
            <p className="mt-2 text-2xl font-black text-green-500">192</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-950/40 p-4">
            <p className="text-sm font-semibold text-gray-400">Bombeiros</p>
            <p className="mt-2 text-2xl font-black text-green-500">193</p>
          </div>
        </div>
      </section>
    </section>
  );
};
