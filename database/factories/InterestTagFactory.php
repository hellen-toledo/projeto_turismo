<?php

namespace Database\Factories;

use App\Models\InterestTag;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<InterestTag>
 */
class InterestTagFactory extends Factory
{
    protected $model = InterestTag::class;

    public function definition(): array
    {
        $baseName = fake()->randomElement([
            'Ecoturismo',
            'Turismo Nautico',
            'Gastronomia',
            'Cultura Popular',
            'Aventura',
            'Trilhas',
        ]);
        $name = "{$baseName} ".fake()->unique()->numberBetween(100, 9999);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
        ];
    }
}
