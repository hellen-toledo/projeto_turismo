<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\InterestTag;
use App\Models\Region;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $chapada = Region::query()->where('name', 'Chapada dos Veadeiros')->firstOrFail();
        $serraDaMesa = Region::query()->where('name', 'Serra da Mesa')->firstOrFail();

        $altoParaiso = City::query()->updateOrCreate(
            ['slug' => 'alto-paraiso-de-goias'],
            [
                'name' => 'Alto Paraíso de Goiás',
                'summary' => 'Base turística da Chapada dos Veadeiros, com forte vocação para ecoturismo.',
                'description' => 'Portal de entrada para trilhas, cachoeiras, observação do céu e experiências de bem-estar no norte goiano.',
                'cover_image' => 'https://images.unsplash.com/photo-1695420959065-27a3ed7fb50c?q=80&w=1200&auto=format&fit=crop',
                'region_id' => $chapada->id,
                'is_published' => true,
            ],
        );

        $minacu = City::query()->updateOrCreate(
            ['slug' => 'minacu'],
            [
                'name' => 'Minaçu',
                'summary' => 'Destino ligado ao Lago Serra da Mesa e ao turismo náutico.',
                'description' => 'Cidade de apoio para pesca esportiva, passeios embarcados e experiências junto ao reservatório da Serra da Mesa.',
                'cover_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
                'region_id' => $serraDaMesa->id,
                'is_published' => true,
            ],
        );

        $tags = InterestTag::query()->pluck('id', 'slug');

        $altoParaiso->interestTags()->sync([
            $tags[Str::slug('Ecoturismo')],
            $tags[Str::slug('Cachoeiras')],
            $tags[Str::slug('Trilhas')],
        ]);

        $minacu->interestTags()->sync([
            $tags[Str::slug('Turismo Náutico')],
            $tags[Str::slug('Gastronomia')],
        ]);
    }
}
