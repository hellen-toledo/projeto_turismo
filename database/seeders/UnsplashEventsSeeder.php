<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class UnsplashEventsSeeder extends Seeder
{
    public function run(): void
    {
        $cities = City::query()->pluck('id', 'slug')->toArray();
        $tags = InterestTag::query()->pluck('id', 'slug')->toArray();

        $events = [
            [
                'title' => 'Festival Gastronômico de Porangatu',
                'description' => 'Descubra os sabores do Norte Goiano. Um evento cheio de pratos típicos, chefs locais e muita música boa para toda a família.',
                'city_slug' => 'porangatu',
                'cover_image' => 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Encontro de Violeiros',
                'description' => 'Tradicional encontro de violeiros celebrando a autêntica música caipira e a cultura sertaneja da nossa região.',
                'city_slug' => 'uruacu',
                'cover_image' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Temporada de Pesca Esportiva',
                'description' => 'Abertura da temporada de pesca no Rio Araguaia. Competições, palestras sobre preservação e muita diversão.',
                'city_slug' => 'sao-miguel-do-araguaia',
                'cover_image' => 'https://images.unsplash.com/photo-1510006766467-3e813f57f495?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['pesca-esportiva', 'lagos'],
            ],
            [
                'title' => 'Trilha Ecológica do Cerrado',
                'description' => 'Uma expedição guiada pelas mais belas paisagens do Cerrado, visitando cachoeiras escondidas e conhecendo a flora local.',
                'city_slug' => 'alto-paraiso-de-goias',
                'cover_image' => 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['ecoturismo', 'trilhas'],
            ],
            [
                'title' => 'Festa de São João na Praça',
                'description' => 'A tradicional festa junina com quadrilhas, fogueira, comidas típicas e muito forró para aquecer a noite.',
                'city_slug' => 'cavalcante',
                'cover_image' => 'https://images.unsplash.com/photo-1533174000273-11f05a01fe31?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Exposição Agropecuária (ExpoNiq)',
                'description' => 'Maior feira agropecuária da região. Exposição de animais, shows nacionais, rodeio e inovações do setor agro.',
                'city_slug' => 'niquelandia',
                'cover_image' => 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Campeonato de Caiaque do Lago',
                'description' => 'Competição emocionante nas águas do lago, reunindo atletas de todo o estado em um fim de semana de muita adrenalina.',
                'city_slug' => 'minacu',
                'cover_image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['lagos', 'ecoturismo'],
            ],
            [
                'title' => 'Circuito de Mountain Bike',
                'description' => 'Desafio sobre duas rodas pelas estradas de terra e trilhas da zona rural. Percursos para iniciantes e profissionais.',
                'city_slug' => 'formoso',
                'cover_image' => 'https://images.unsplash.com/photo-1541625602330-2277a4c4618c?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['trilhas', 'ecoturismo'],
            ],
            [
                'title' => 'Mostra de Artesanato Local',
                'description' => 'Feira dedicada à valorização dos artesãos da cidade. Peças exclusivas feitas em madeira, barro e tecidos.',
                'city_slug' => 'teresina-de-goias',
                'cover_image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Festival das Águas Quentes',
                'description' => 'Celebração das nascentes e águas termais da região. Apresentações culturais, relaxamento e gastronomia.',
                'city_slug' => 'colinas-do-sul',
                'cover_image' => 'https://images.unsplash.com/photo-1432405972618-c60002059431?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['ecoturismo'],
            ],
            [
                'title' => 'Piquenique Estrelado',
                'description' => 'Um evento noturno nos arredores da cidade para observação de estrelas, com música acústica e fogueiras.',
                'city_slug' => 'alto-horizonte',
                'cover_image' => 'https://images.unsplash.com/photo-1515224526905-51c7d77c7bb8?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['ecoturismo'],
            ],
            [
                'title' => 'Expedição Observação de Pássaros',
                'description' => 'Passeio guiado logo ao amanhecer para observação e registro fotográfico das aves típicas do bioma Cerrado.',
                'city_slug' => 'campinorte',
                'cover_image' => 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['ecoturismo', 'trilhas'],
            ],
            [
                'title' => 'Feira do Produtor Rural',
                'description' => 'A maior feira de produtos orgânicos, queijos frescos, doces caseiros e hortaliças vindos direto das fazendas da região.',
                'city_slug' => 'crixas',
                'cover_image' => 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Corrida Rústica do Ouro',
                'description' => 'Corrida de rua que passa por ladeiras e pontos históricos da cidade, relembrando os tempos do ciclo do ouro.',
                'city_slug' => 'mara-rosa',
                'cover_image' => 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Celebração Cultural Quilombola',
                'description' => 'Festa em homenagem às raízes e tradições das comunidades quilombolas locais. Danças de roda, história e comida.',
                'city_slug' => 'cavalcante',
                'cover_image' => 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Festival de Inverno',
                'description' => 'Aproveite o clima ameno da Chapada com noites de jazz, caldos, vinhos e feiras literárias no centro da cidade.',
                'city_slug' => 'alto-paraiso-de-goias',
                'cover_image' => 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
            [
                'title' => 'Regata de Canoas Regionais',
                'description' => 'Disputa acirrada de canoas feitas tradicionalmente na região. O evento termina com uma grande confraternização na prainha.',
                'city_slug' => 'uruacu',
                'cover_image' => 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['lagos', 'ecoturismo'],
            ],
            [
                'title' => 'Encontro de Fotógrafos de Natureza',
                'description' => 'Workshops, saídas de campo e exposição para apaixonados por fotografia de paisagens, fauna e flora.',
                'city_slug' => 'minacu',
                'cover_image' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['ecoturismo'],
            ],
            [
                'title' => 'Acampamento Base',
                'description' => 'Fim de semana de camping estruturado próximo às belezas naturais, com oficinas de sobrevivência e respeito à natureza.',
                'city_slug' => 'colinas-do-sul',
                'cover_image' => 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['trilhas', 'ecoturismo'],
            ],
            [
                'title' => 'Workshop de Culinária Raiz',
                'description' => 'Aprenda a fazer pamonha, empadão e galinhada com as cozinheiras mais tradicionais da cidade.',
                'city_slug' => 'porangatu',
                'cover_image' => 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=1200&auto=format&fit=crop',
                'tags' => [],
            ],
        ];

        foreach ($events as $index => $eventData) {
            $cityId = $cities[$eventData['city_slug']] ?? null;

            if (!$cityId) {
                continue; // Pula se a cidade não existir
            }

            $startsAt = Carbon::now()->addDays(rand(5, 60))->setTime(rand(8, 19), 0);
            $endsAt = (clone $startsAt)->addHours(rand(4, 48));

            $event = Event::query()->updateOrCreate(
                ['slug' => Str::slug($eventData['title'])],
                [
                    'title' => $eventData['title'],
                    'description' => $eventData['description'],
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                    'cover_image' => $eventData['cover_image'],
                    'city_id' => $cityId,
                    'is_featured' => rand(1, 10) > 7, // 30% de chance de ser destaque
                    'is_published' => true,
                ],
            );

            // Sincronizar tags
            if (!empty($eventData['tags'])) {
                $tagIds = [];
                foreach ($eventData['tags'] as $tagSlug) {
                    if (isset($tags[$tagSlug])) {
                        $tagIds[] = $tags[$tagSlug];
                    }
                }
                $event->interestTags()->sync($tagIds);
            }
        }
    }
}
