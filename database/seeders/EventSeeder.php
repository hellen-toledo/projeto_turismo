<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use RuntimeException;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $cities = City::query()
            ->whereIn('slug', [
                'alto-paraiso-de-goias',
                'porangatu',
                'uruacu',
                'niquelandia',
                'minacu',
                'sao-miguel-do-araguaia',
                'cavalcante',
                'teresina-de-goias',
                'colinas-do-sul',
                'formoso',
            ])
            ->get()
            ->keyBy('slug');
        $tags = InterestTag::query()->pluck('id', 'slug');

        $events = [
            [
                'title' => 'Festival do Cerrado',
                'description' => 'Evento com programação cultural, música e experiências ligadas ao patrimônio natural da região.',
                'starts_at' => Carbon::now()->addMonths(2)->setTime(18, 0),
                'ends_at' => Carbon::now()->addMonths(2)->setTime(23, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/festival-do-cerrado',
                'city_slug' => 'alto-paraiso-de-goias',
                'is_featured' => true,
                'tags' => ['Ecoturismo', 'Trilhas'],
            ],
            [
                'title' => 'Torneio de Pesca Esportiva',
                'description' => 'Campeonato de pesca esportiva no lago, com premiação e confraternização.',
                'starts_at' => Carbon::now()->addMonths(3)->setTime(9, 0),
                'ends_at' => Carbon::now()->addMonths(3)->setTime(18, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/torneio-pesca',
                'city_slug' => 'porangatu',
                'is_featured' => false,
                'tags' => ['Pesca Esportiva', 'Lagos'],
            ],
            [
                'title' => 'Circuito Náutico Serra da Mesa',
                'description' => 'Fim de semana com passeios embarcados, feira de produtos locais e atividades de contemplação no Lago Serra da Mesa.',
                'starts_at' => Carbon::now()->addMonths(1)->addDays(12)->setTime(8, 30),
                'ends_at' => Carbon::now()->addMonths(1)->addDays(13)->setTime(17, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/circuito-nautico-serra-da-mesa',
                'city_slug' => 'uruacu',
                'is_featured' => true,
                'tags' => ['Lagos', 'Pesca Esportiva'],
            ],
            [
                'title' => 'Encontro de Cachoeiras e Serras',
                'description' => 'Programação guiada com trilhas, banho de cachoeira, fotografia de natureza e conversa sobre conservação do cerrado.',
                'starts_at' => Carbon::now()->addMonths(4)->setTime(7, 0),
                'ends_at' => Carbon::now()->addMonths(4)->setTime(16, 30),
                'cover_image' => 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/encontro-cachoeiras-serras',
                'city_slug' => 'niquelandia',
                'is_featured' => false,
                'tags' => ['Ecoturismo', 'Trilhas'],
            ],
            [
                'title' => 'Festival Sabores do Lago',
                'description' => 'Mostra gastronômica com pratos regionais, música ao vivo e experiências ligadas à pesca e à cultura ribeirinha.',
                'starts_at' => Carbon::now()->addMonths(2)->addDays(18)->setTime(17, 0),
                'ends_at' => Carbon::now()->addMonths(2)->addDays(18)->setTime(22, 30),
                'cover_image' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/festival-sabores-do-lago',
                'city_slug' => 'minacu',
                'is_featured' => true,
                'tags' => ['Lagos', 'Pesca Esportiva'],
            ],
            [
                'title' => 'Temporada de Praias do Araguaia',
                'description' => 'Agenda de lazer em praias fluviais com esporte, música, gastronomia e ações de educação ambiental.',
                'starts_at' => Carbon::now()->addMonths(5)->setTime(10, 0),
                'ends_at' => Carbon::now()->addMonths(5)->addDays(2)->setTime(20, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/temporada-praias-araguaia',
                'city_slug' => 'sao-miguel-do-araguaia',
                'is_featured' => true,
                'tags' => ['Pesca Esportiva', 'Ecoturismo'],
            ],
            [
                'title' => 'Vivência Kalunga e Trilhas',
                'description' => 'Roteiro cultural com guias locais, visita a cachoeiras e experiências gastronômicas em comunidades tradicionais.',
                'starts_at' => Carbon::now()->addMonths(1)->addDays(25)->setTime(6, 30),
                'ends_at' => Carbon::now()->addMonths(1)->addDays(25)->setTime(18, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/vivencia-kalunga-trilhas',
                'city_slug' => 'cavalcante',
                'is_featured' => false,
                'tags' => ['Ecoturismo', 'Trilhas'],
            ],
            [
                'title' => 'Caminhada do Cerrado Vivo',
                'description' => 'Caminhada interpretativa por paisagens rurais, mirantes e áreas de cerrado com monitores ambientais.',
                'starts_at' => Carbon::now()->addMonths(3)->addDays(8)->setTime(7, 30),
                'ends_at' => Carbon::now()->addMonths(3)->addDays(8)->setTime(12, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/caminhada-cerrado-vivo',
                'city_slug' => 'teresina-de-goias',
                'is_featured' => false,
                'tags' => ['Ecoturismo', 'Trilhas'],
            ],
            [
                'title' => 'Remada dos Rios e Mirantes',
                'description' => 'Passeio de remada leve, contemplação de mirantes e feira de artesanato regional ao fim do percurso.',
                'starts_at' => Carbon::now()->addMonths(4)->addDays(10)->setTime(8, 0),
                'ends_at' => Carbon::now()->addMonths(4)->addDays(10)->setTime(15, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/remada-rios-mirantes',
                'city_slug' => 'colinas-do-sul',
                'is_featured' => false,
                'tags' => ['Lagos', 'Ecoturismo'],
            ],
            [
                'title' => 'Feira de Turismo Rural de Formoso',
                'description' => 'Feira de produtos locais, rotas de vivência rural, música regional e encontro de empreendedores do turismo.',
                'starts_at' => Carbon::now()->addMonths(2)->addDays(6)->setTime(9, 0),
                'ends_at' => Carbon::now()->addMonths(2)->addDays(6)->setTime(19, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/feira-turismo-rural-formoso',
                'city_slug' => 'formoso',
                'is_featured' => false,
                'tags' => ['Ecoturismo'],
            ],
        ];

        $missingCitySlugs = collect($events)
            ->pluck('city_slug')
            ->reject(fn (string $slug) => $cities->has($slug))
            ->values();

        if ($missingCitySlugs->isNotEmpty()) {
            throw new RuntimeException('Cidades ausentes para eventos: '.$missingCitySlugs->implode(', '));
        }

        foreach ($events as $eventData) {
            $event = Event::query()->updateOrCreate(
                ['slug' => Str::slug($eventData['title'])],
                [
                    'title' => $eventData['title'],
                    'description' => $eventData['description'],
                    'starts_at' => $eventData['starts_at'],
                    'ends_at' => $eventData['ends_at'],
                    'cover_image' => $eventData['cover_image'],
                    'external_url' => $eventData['external_url'],
                    'city_id' => $cities->get($eventData['city_slug'])->id,
                    'is_featured' => $eventData['is_featured'],
                    'is_published' => true,
                ],
            );

            $event->interestTags()->sync(array_filter(array_map(
                fn (string $tag) => $tags[Str::slug($tag)] ?? null,
                $eventData['tags'],
            )));
        }
    }
}
