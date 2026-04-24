<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use App\Models\Region;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_root_route_exposes_backend_api_metadata(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertJson([
                'layer' => 'backend-api',
                'status' => 'ok',
                'documentation' => 'docs/architecture.md',
            ]);
    }

    public function test_regions_endpoint_returns_regions_with_city_counts(): void
    {
        $regionWithCities = Region::factory()->create([
            'name' => 'Chapada dos Veadeiros',
        ]);
        Region::factory()->create([
            'name' => 'Serra da Mesa',
        ]);

        City::factory()->count(2)->for($regionWithCities)->create();

        $this->getJson('/api/regions')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment([
                'name' => 'Chapada dos Veadeiros',
                'citiesCount' => 2,
            ])
            ->assertJsonFragment([
                'name' => 'Serra da Mesa',
                'citiesCount' => 0,
            ]);
    }

    public function test_cities_endpoint_supports_published_filter(): void
    {
        City::factory()->create([
            'name' => 'Alto Paraiso de Goias',
            'slug' => 'alto-paraiso-de-goias',
        ]);
        City::factory()->unpublished()->create([
            'name' => 'Cidade Oculta',
            'slug' => 'cidade-oculta',
        ]);

        $this->getJson('/api/cities?published=1')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', 'alto-paraiso-de-goias');
    }

    public function test_cities_endpoint_supports_basic_region_filters(): void
    {
        $chapada = Region::factory()->create([
            'name' => 'Chapada dos Veadeiros',
        ]);
        $serra = Region::factory()->create([
            'name' => 'Serra da Mesa',
        ]);

        City::factory()->for($chapada)->create([
            'name' => 'Sao Jorge',
            'slug' => 'sao-jorge',
        ]);
        City::factory()->for($serra)->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
        ]);

        $this->getJson("/api/v1/cities?region={$chapada->id}")
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', 'sao-jorge');

        $this->getJson('/api/v1/cities?region=Serra%20da%20Mesa')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', 'minacu');
    }

    public function test_city_show_endpoint_returns_city_by_slug_with_relationships(): void
    {
        $region = Region::factory()->create([
            'name' => 'Chapada dos Veadeiros',
        ]);
        $city = City::factory()->for($region)->create([
            'name' => 'Alto Paraiso de Goias',
            'slug' => 'alto-paraiso-de-goias',
        ]);
        $tags = InterestTag::factory()->count(2)->create();
        $city->interestTags()->sync($tags->modelKeys());

        $this->getJson('/api/cities/alto-paraiso-de-goias')
            ->assertOk()
            ->assertJsonPath('slug', 'alto-paraiso-de-goias')
            ->assertJsonPath('region.name', 'Chapada dos Veadeiros')
            ->assertJsonCount(2, 'interestTags');
    }

    public function test_city_show_endpoint_returns_not_found_for_unknown_slug(): void
    {
        $this->getJson('/api/cities/inexistente')
            ->assertNotFound()
            ->assertExactJson([
                'message' => 'Resource not found.',
            ]);
    }

    public function test_events_endpoint_supports_published_filter(): void
    {
        $city = City::factory()->create([
            'slug' => 'minacu',
        ]);

        Event::factory()->for($city)->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
        ]);
        Event::factory()->for($city)->unpublished()->create([
            'title' => 'Evento Interno',
            'slug' => 'evento-interno',
        ]);

        $this->getJson('/api/events?published=1')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', 'festival-do-lago');
    }

    public function test_events_endpoint_supports_basic_filters(): void
    {
        $city = City::factory()->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
        ]);

        Event::factory()->for($city)->past()->create([
            'title' => 'Evento Passado',
            'slug' => 'evento-passado',
            'is_featured' => true,
        ]);
        Event::factory()->for($city)->future()->featured()->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
        ]);
        Event::factory()->future()->featured()->create([
            'title' => 'Evento em Outra Cidade',
            'slug' => 'evento-em-outra-cidade',
        ]);

        $this->getJson('/api/v1/events?future=1&featured=1&city=minacu')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', 'festival-do-lago');
    }

    public function test_event_show_endpoint_returns_event_by_slug_with_relationships(): void
    {
        $city = City::factory()->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
        ]);
        $event = Event::factory()->for($city)->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
        ]);
        $tags = InterestTag::factory()->count(2)->create();
        $event->interestTags()->sync($tags->modelKeys());

        $this->getJson('/api/events/festival-do-lago')
            ->assertOk()
            ->assertJsonPath('slug', 'festival-do-lago')
            ->assertJsonPath('city.slug', 'minacu')
            ->assertJsonCount(2, 'interestTags');
    }

    public function test_event_show_endpoint_returns_not_found_for_unknown_slug(): void
    {
        $this->getJson('/api/events/inexistente')
            ->assertNotFound()
            ->assertExactJson([
                'message' => 'Resource not found.',
            ]);
    }

    public function test_public_api_rejects_write_methods(): void
    {
        $this->postJson('/api/cities', [])
            ->assertStatus(405)
            ->assertExactJson([
                'message' => 'Method not allowed.',
            ]);
    }
}
