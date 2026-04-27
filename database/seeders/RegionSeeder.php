<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        Region::query()->updateOrCreate(['name' => 'Chapada dos Veadeiros']);
        Region::query()->updateOrCreate(['name' => 'Polo Porangatu/Norte']);
        Region::query()->updateOrCreate(['name' => 'Serra da Mesa']);
        Region::query()->updateOrCreate(['name' => 'Vale do Paranã']);
    }
}
