<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\City::create([
            'name' => 'Minaçu',
            'description' => 'Home of the majestic Serra da Mesa Lake.',
            'region_id' => 2 // Polo Norte
        ]);

        \App\Models\City::create([
            'name' => 'Alto Paraíso',
            'description' => 'The gateway to the stunning Chapada dos Veadeiros.',
            'region_id' => 1 // Chapada
        ]);
    }
}
