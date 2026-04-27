<?php

namespace Database\Factories;

use App\Domain\CityAttractions\CityAttraction as DomainCityAttraction;
use App\Models\City;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DomainCityAttraction>
 */
class CityAttractionFactory extends Factory
{
    protected $model = DomainCityAttraction::class;

    public function definition(): array
    {
        return [
            'city_id' => City::factory(),
            'name' => fake()->randomElement([
                'Mirante Natural',
                'Cachoeira do Centro',
                'Praça Cultural',
                'Mercado Regional',
            ]),
            'description' => fake()->sentence(12),
            'image_url' => fake()->imageUrl(1280, 720, 'nature'),
            'sort_order' => fake()->numberBetween(0, 5),
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
