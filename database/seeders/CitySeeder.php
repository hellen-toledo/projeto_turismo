<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\CityAttraction;
use App\Models\InterestTag;
use App\Models\Region;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $regions = Region::query()->pluck('id', 'name');
        $tags = InterestTag::query()->pluck('id', 'slug');

        $cities = [
            [
                'name' => 'Alto Paraíso de Goiás',
                'region' => 'Chapada dos Veadeiros',
                'summary' => 'Base turística da Chapada dos Veadeiros, com forte vocação para ecoturismo.',
                'description' => 'Portal de entrada para trilhas, cachoeiras, observação do céu e experiências de bem-estar no norte goiano.',
                'cover_image' => 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo', 'Trilhas'],
                'attraction' => [
                    'name' => 'Trilhas da Chapada',
                    'description' => 'Circuitos de caminhada e contemplação em áreas naturais da região.',
                    'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Porangatu',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Destino de lagos e pesca esportiva.',
                'description' => 'Cidade de apoio para pesca esportiva, passeios embarcados e experiências nos lagos da região norte de Goiás.',
                'cover_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Lagos', 'Pesca Esportiva'],
                'attraction' => [
                    'name' => 'Passeios no Lago',
                    'description' => 'Experiências embarcadas e lazer voltado ao turismo náutico.',
                    'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Uruaçu',
                'region' => 'Serra da Mesa',
                'summary' => 'Cidade estratégica para acesso ao Lago Serra da Mesa e ao turismo náutico.',
                'description' => 'Uruaçu combina infraestrutura urbana, religiosidade e acesso a áreas de lazer no entorno do Lago Serra da Mesa.',
                'cover_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Lagos', 'Pesca Esportiva'],
                'attraction' => [
                    'name' => 'Lago Serra da Mesa',
                    'description' => 'Área de referência para navegação, contemplação e pesca esportiva.',
                    'image_url' => 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Niquelândia',
                'region' => 'Serra da Mesa',
                'summary' => 'Município de natureza ampla, cachoeiras, serras e acesso ao Lago Serra da Mesa.',
                'description' => 'Niquelândia reúne paisagens naturais, comunidades tradicionais e roteiros de banho, trilhas e contemplação.',
                'cover_image' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo', 'Lagos', 'Trilhas'],
                'attraction' => [
                    'name' => 'Cachoeiras e serras',
                    'description' => 'Roteiros naturais para banho, caminhada e fotografia de paisagem.',
                    'image_url' => 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Minaçu',
                'region' => 'Serra da Mesa',
                'summary' => 'Porta de entrada para experiências no Lago Serra da Mesa e no Vale do Tocantins.',
                'description' => 'Minaçu é ponto de apoio para pesca, lazer em águas extensas e roteiros de natureza no extremo norte goiano.',
                'cover_image' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Lagos', 'Pesca Esportiva', 'Ecoturismo'],
                'attraction' => [
                    'name' => 'Roteiros de pesca',
                    'description' => 'Passeios e pontos de apoio para pesca esportiva em grandes espelhos d agua.',
                    'image_url' => 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'São Miguel do Araguaia',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Destino ligado ao Rio Araguaia, vida ribeirinha e temporada de praias fluviais.',
                'description' => 'São Miguel do Araguaia conecta o norte goiano ao lazer de rio, pesca, observação da natureza e cultura local.',
                'cover_image' => 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Pesca Esportiva', 'Ecoturismo'],
                'attraction' => [
                    'name' => 'Rio Araguaia',
                    'description' => 'Ambiente de praias sazonais, pesca e convivência ribeirinha.',
                    'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Cavalcante',
                'region' => 'Chapada dos Veadeiros',
                'summary' => 'Destino de cachoeiras, cultura Kalunga e paisagens preservadas da Chapada.',
                'description' => 'Cavalcante abriga roteiros de grande valor natural e cultural, com trilhas, quedas d agua e vivências comunitárias.',
                'cover_image' => 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo', 'Trilhas'],
                'attraction' => [
                    'name' => 'Cachoeiras Kalunga',
                    'description' => 'Trilhas e banhos em áreas naturais de forte identidade cultural.',
                    'image_url' => 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Teresina de Goiás',
                'region' => 'Chapada dos Veadeiros',
                'summary' => 'Pequena cidade da Chapada com ambiente rural e acesso a roteiros de natureza.',
                'description' => 'Teresina de Goiás é uma base tranquila para experiências ligadas ao cerrado, comunidades locais e deslocamentos pela Chapada.',
                'cover_image' => 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo', 'Trilhas'],
                'attraction' => [
                    'name' => 'Paisagens do cerrado',
                    'description' => 'Caminhos rurais, mirantes e contato com o modo de vida local.',
                    'image_url' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Colinas do Sul',
                'region' => 'Chapada dos Veadeiros',
                'summary' => 'Município de acesso a lagos, rios e áreas naturais próximas da Chapada.',
                'description' => 'Colinas do Sul oferece turismo de natureza com águas, trilhas e paisagens de transição no norte goiano.',
                'cover_image' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Lagos', 'Trilhas', 'Ecoturismo'],
                'attraction' => [
                    'name' => 'Rios e mirantes',
                    'description' => 'Roteiros para contemplar águas e formações naturais da região.',
                    'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Formoso',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Cidade do norte goiano cercada por paisagens rurais e natureza preservada.',
                'description' => 'Formoso funciona como apoio para roteiros de interior, vivências rurais e deslocamentos no eixo Porangatu/Norte.',
                'cover_image' => 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Roteiros rurais',
                    'description' => 'Experiências de tranquilidade, paisagem aberta e cultura local.',
                    'image_url' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Mara Rosa',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Município conhecido pela produção regional e por roteiros de interior no norte goiano.',
                'description' => 'Mara Rosa integra a malha de cidades de apoio no norte de Goiás, com cultura local e paisagens do cerrado.',
                'cover_image' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Cerrado produtivo',
                    'description' => 'Paisagens rurais e experiências ligadas ao cotidiano regional.',
                    'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Campinorte',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Cidade de conexão regional para viagens pelo eixo norte de Goiás.',
                'description' => 'Campinorte é ponto de passagem e apoio para roteiros que combinam cultura local, estradas cênicas e destinos próximos.',
                'cover_image' => 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Trilhas', 'Ecoturismo'],
                'attraction' => [
                    'name' => 'Caminhos do norte',
                    'description' => 'Trajetos e paisagens de cerrado para compor roteiros regionais.',
                    'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Trombas',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Município de história regional e paisagens tranquilas no norte goiano.',
                'description' => 'Trombas oferece atmosfera de cidade pequena, memória local e acesso a áreas naturais do entorno.',
                'cover_image' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Paisagens do entorno',
                    'description' => 'Áreas abertas e caminhos para observação da paisagem regional.',
                    'image_url' => 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Mutunópolis',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Cidade pequena com identidade interiorana e acesso a roteiros de natureza.',
                'description' => 'Mutunópolis valoriza o ritmo tranquilo do norte goiano, com paisagens rurais e proximidade de destinos de água e pesca.',
                'cover_image' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo', 'Trilhas'],
                'attraction' => [
                    'name' => 'Roteiros de contemplação',
                    'description' => 'Experiências simples de natureza, fotografia e paisagem rural.',
                    'image_url' => 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Novo Planalto',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Município do norte goiano com acesso a ambientes rurais e experiências de descanso.',
                'description' => 'Novo Planalto compõe roteiros de interior, com paisagens abertas e apoio a deslocamentos na região norte.',
                'cover_image' => 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Horizontes do cerrado',
                    'description' => 'Paisagens abertas para contemplação e roteiros de passagem.',
                    'image_url' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Bonópolis',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Cidade tranquila do norte de Goiás, marcada por paisagens rurais e cerrado.',
                'description' => 'Bonópolis oferece base para descanso, cultura local e pequenos roteiros de natureza no entorno.',
                'cover_image' => 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Vivência de interior',
                    'description' => 'Ritmo tranquilo, hospitalidade local e paisagens do cerrado.',
                    'image_url' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Montividiu do Norte',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Município de paisagens abertas e conexão com roteiros do extremo norte goiano.',
                'description' => 'Montividiu do Norte é um destino de apoio para quem busca estradas cênicas, descanso e contato com a vida rural.',
                'cover_image' => 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo', 'Trilhas'],
                'attraction' => [
                    'name' => 'Caminhos rurais',
                    'description' => 'Trajetos de paisagem aberta para contemplação e fotografia.',
                    'image_url' => 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Crixás',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Cidade histórica do norte goiano com identidade ligada ao garimpo e ao cerrado.',
                'description' => 'Crixás mistura história regional, cultura de interior e acesso a paisagens naturais do norte de Goiás.',
                'cover_image' => 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'História e cerrado',
                    'description' => 'Roteiros de memória local combinados a paisagens naturais.',
                    'image_url' => 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Alto Horizonte',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Cidade planejada e organizada, com paisagens de cerrado e apoio a roteiros regionais.',
                'description' => 'Alto Horizonte integra o norte goiano como ponto de apoio para turismo de negócios, passagem e natureza próxima.',
                'cover_image' => 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Paisagens urbanas e cerrado',
                    'description' => 'Contraste entre estrutura urbana e o ambiente natural do entorno.',
                    'image_url' => 'https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
            [
                'name' => 'Nova Iguaçu de Goiás',
                'region' => 'Polo Porangatu/Norte',
                'summary' => 'Pequeno município norte-goiano de atmosfera rural e paisagens abertas.',
                'description' => 'Nova Iguaçu de Goiás valoriza a tranquilidade, a hospitalidade e o contato com o cerrado regional.',
                'cover_image' => 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
                'tags' => ['Ecoturismo'],
                'attraction' => [
                    'name' => 'Tranquilidade do cerrado',
                    'description' => 'Ambiente de descanso, paisagem rural e convivência local.',
                    'image_url' => 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
                ],
            ],
        ];

        foreach ($cities as $index => $cityData) {
            $city = City::query()->updateOrCreate(
                ['slug' => Str::slug($cityData['name'])],
                [
                    'name' => $cityData['name'],
                    'summary' => $cityData['summary'],
                    'description' => $cityData['description'],
                    'cover_image' => $cityData['cover_image'],
                    'region_id' => $regions[$cityData['region']] ?? $regions->first(),
                    'is_published' => true,
                ],
            );

            $city->interestTags()->sync(array_filter(array_map(
                fn (string $tag) => $tags[Str::slug($tag)] ?? null,
                $cityData['tags'],
            )));

            CityAttraction::query()->updateOrCreate(
                [
                    'city_id' => $city->id,
                    'name' => $cityData['attraction']['name'],
                ],
                [
                    'description' => $cityData['attraction']['description'],
                    'image_url' => $cityData['attraction']['image_url'],
                    'sort_order' => $index,
                    'is_published' => true,
                ],
            );
        }
    }
}
