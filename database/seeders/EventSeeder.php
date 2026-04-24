<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $altoParaiso = City::query()->where('slug', 'alto-paraiso-de-goias')->firstOrFail();
        $minacu = City::query()->where('slug', 'minacu')->firstOrFail();
        $tags = InterestTag::query()->pluck('id', 'slug');

        $festival = Event::query()->updateOrCreate(
            ['slug' => 'festival-do-cerrado'],
            [
                'title' => 'Festival do Cerrado',
                'description' => 'Evento com programação cultural, música e experiências ligadas ao patrimônio natural da região.',
                'starts_at' => Carbon::now()->addMonths(2)->setTime(18, 0),
                'ends_at' => Carbon::now()->addMonths(2)->setTime(23, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/festival-do-cerrado',
                'city_id' => $altoParaiso->id,
                'is_featured' => true,
                'is_published' => true,
            ],
        );

        $regata = Event::query()->updateOrCreate(
            ['slug' => 'encontro-nautico-serra-da-mesa'],
            [
                'title' => 'Encontro Náutico Serra da Mesa',
                'description' => 'Programação voltada a esportes aquáticos, gastronomia e divulgação do potencial turístico do lago.',
                'starts_at' => Carbon::now()->addMonths(3)->setTime(9, 0),
                'ends_at' => Carbon::now()->addMonths(3)->setTime(18, 0),
                'cover_image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
                'external_url' => 'https://example.com/encontro-nautico',
                'city_id' => $minacu->id,
                'is_featured' => false,
                'is_published' => true,
            ],
        );

        $festival->interestTags()->sync([
            $tags[Str::slug('Ecoturismo')],
            $tags[Str::slug('Cultura Popular')],
        ]);

        $regata->interestTags()->sync([
            $tags[Str::slug('Turismo Náutico')],
            $tags[Str::slug('Gastronomia')],
        ]);
    }
}
