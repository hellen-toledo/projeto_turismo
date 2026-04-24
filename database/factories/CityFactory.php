<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Region;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<City>
 */
class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        $baseName = fake()->randomElement([
            'Alto Paraiso de Goias',
            'Sao Jorge',
            'Minacu',
            'Porangatu',
            'Niquelandia',
            'Cavalcante',
        ]);
        $name = "{$baseName} ".fake()->unique()->numberBetween(100, 9999);

        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'summary' => fake()->sentence(10),
            'description' => fake()->paragraphs(3, true),
            'cover_image' => fake()->imageUrl(1280, 720, 'nature'),
            'region_id' => Region::factory(),
            'is_published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn () => [
            'is_published' => false,
        ]);
    }
}
