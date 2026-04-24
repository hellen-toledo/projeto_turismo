<?php

namespace Tests\Unit;

use App\Application\Cities\GeneratesCitySlug;
use App\Models\City;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeneratesCitySlugTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_a_unique_slug_when_name_already_exists(): void
    {
        City::factory()->create([
            'name' => 'Alto Paraiso de Goias',
            'slug' => 'alto-paraiso-de-goias',
        ]);

        $slug = app(GeneratesCitySlug::class)('Alto Paraiso de Goias');

        $this->assertSame('alto-paraiso-de-goias-2', $slug);
    }

    public function test_it_can_ignore_the_current_city_when_regenerating_slug(): void
    {
        $city = City::factory()->create([
            'name' => 'Alto Paraiso de Goias',
            'slug' => 'alto-paraiso-de-goias',
        ]);

        $slug = app(GeneratesCitySlug::class)('Alto Paraiso de Goias', ignoreId: $city->id);

        $this->assertSame('alto-paraiso-de-goias', $slug);
    }
}
