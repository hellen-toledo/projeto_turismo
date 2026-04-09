<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        \App\Models\Region::create(['name' => 'Chapada dos Veadeiros']);
        \App\Models\Region::create(['name' => 'Polo Norte/Porangatu']);
    }
}
