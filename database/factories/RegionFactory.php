<?php

namespace Database\Factories;

use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Region>
 */
class RegionFactory extends Factory
{
    protected $model = Region::class;

    public function definition(): array
    {
        $baseName = fake()->randomElement([
            'Chapada dos Veadeiros',
            'Serra da Mesa',
            'Vale do Araguaia',
            'Caminhos do Tocantins',
            'Norte das Cachoeiras',
        ]);

        return [
            'name' => "{$baseName} ".fake()->unique()->numberBetween(100, 9999),
        ];
    }
}
