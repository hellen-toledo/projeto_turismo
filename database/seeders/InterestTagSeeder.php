<?php

namespace Database\Seeders;

use App\Models\InterestTag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class InterestTagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = ['Ecoturismo', 'Pesca Esportiva', 'Lagos', 'Trilhas'];

        foreach ($tags as $tag) {
            InterestTag::query()->updateOrCreate(
                ['slug' => Str::slug($tag)],
                ['name' => $tag],
            );
        }
    }
}
