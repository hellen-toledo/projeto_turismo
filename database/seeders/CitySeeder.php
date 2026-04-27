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
        $chapada = Region::query()->where('name', 'Chapada dos Veadeiros')->firstOrFail();
        $porangatu = Region::query()->where('name', 'Polo Porangatu/Norte')->firstOrFail();

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

        $porangatuCity = City::query()->updateOrCreate(
            ['slug' => 'porangatu'],
            [
                'name' => 'Porangatu',
                'summary' => 'Destino de lagos e pesca esportiva.',
                'description' => 'Cidade de apoio para pesca esportiva, passeios embarcados e experiências nos lagos da região norte de Goiás.',
                'cover_image' => 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
                'region_id' => $porangatu->id,
                'is_published' => true,
            ],
        );

        $tags = InterestTag::query()->pluck('id', 'slug');

        $altoParaiso->interestTags()->sync(array_filter([
            $tags[Str::slug('Ecoturismo')] ?? null,
            $tags[Str::slug('Trilhas')] ?? null,
        ]));

        $porangatuCity->interestTags()->sync(array_filter([
            $tags[Str::slug('Lagos')] ?? null,
            $tags[Str::slug('Pesca Esportiva')] ?? null,
        ]));

        CityAttraction::query()->updateOrCreate(
            [
                'city_id' => $altoParaiso->id,
                'name' => 'Trilhas da Chapada',
            ],
            [
                'description' => 'Circuitos de caminhada e contemplação em áreas naturais da região.',
                'image_url' => 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
                'sort_order' => 0,
                'is_published' => true,
            ],
        );

        CityAttraction::query()->updateOrCreate(
            [
                'city_id' => $porangatuCity->id,
                'name' => 'Passeios no Lago',
            ],
            [
                'description' => 'Experiências embarcadas e lazer voltado ao turismo náutico.',
                'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'sort_order' => 0,
                'is_published' => true,
            ],
        );
    }
}
