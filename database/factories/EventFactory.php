<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        $baseTitle = fake()->randomElement([
            'Festival do Lago',
            'Encontro de Sabores do Cerrado',
            'Circuito de Trilhas da Chapada',
            'Feira de Artesanato Regional',
            'Mostra Cultural do Norte Goiano',
        ]);
        $title = Str::title("{$baseTitle} ".fake()->unique()->numberBetween(100, 9999));
        $startsAt = Carbon::instance(fake()->dateTimeBetween('+1 week', '+6 months'));

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraphs(2, true),
            'starts_at' => $startsAt,
            'ends_at' => (clone $startsAt)->addHours(6),
            'cover_image' => fake()->imageUrl(1280, 720, 'events'),
            'external_url' => fake()->url(),
            'city_id' => City::factory(),
            'is_featured' => false,
            'is_published' => true,
        ];
    }

    public function unpublished(): static
    {
        return $this->state(fn () => [
            'is_published' => false,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn () => [
            'is_featured' => true,
        ]);
    }

    public function future(): static
    {
        return $this->state(function () {
            $startsAt = now()->addDays(10)->startOfHour();

            return [
                'starts_at' => $startsAt,
                'ends_at' => (clone $startsAt)->addHours(6),
            ];
        });
    }

    public function past(): static
    {
        return $this->state(function () {
            $startsAt = now()->subDays(10)->startOfHour();

            return [
                'starts_at' => $startsAt,
                'ends_at' => (clone $startsAt)->addHours(6),
            ];
        });
    }
}
