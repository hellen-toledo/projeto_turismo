<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InterestTagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = ['Ecotourism', 'Sport Fishing', 'Lakes', 'Trails'];
        foreach ($tags as $tag) {
            \App\Models\InterestTag::create(['name' => $tag]);
        }
    }
}
