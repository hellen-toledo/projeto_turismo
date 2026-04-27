<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\CityAttraction;
use App\Models\Event;
use App\Models\InterestTag;
use App\Models\MediaAsset;
use App\Models\Region;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_root_route_exposes_backend_api_metadata(): void
    {
        Config::set('app.key', 'base64:ZMOeqtf/bRJlK3spROcA9ItdXUMRXEmkiDPf6sqHojI=');

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

        $this->getJson('/api/v1/regions')
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

        $this->getJson('/api/v1/cities?published=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'alto-paraiso-de-goias')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_interest_tags_endpoint_returns_tags_in_name_order(): void
    {
        InterestTag::factory()->create([
            'name' => 'Trilhas',
            'slug' => 'trilhas',
        ]);
        InterestTag::factory()->create([
            'name' => 'Ecoturismo',
            'slug' => 'ecoturismo',
        ]);

        $this->getJson('/api/v1/interest-tags')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonPath('0.slug', 'ecoturismo')
            ->assertJsonPath('1.slug', 'trilhas');
    }

    public function test_cities_endpoint_is_paginated_and_supports_search_region_and_tag_filters(): void
    {
        $chapada = Region::factory()->create([
            'name' => 'Chapada dos Veadeiros',
        ]);
        $serra = Region::factory()->create([
            'name' => 'Serra da Mesa',
        ]);
        $ecoturismo = InterestTag::factory()->create([
            'name' => 'Ecoturismo',
            'slug' => 'ecoturismo',
        ]);
        $nautico = InterestTag::factory()->create([
            'name' => 'Turismo Nautico',
            'slug' => 'turismo-nautico',
        ]);

        $altoParaiso = City::factory()->for($chapada)->create([
            'name' => 'Alto Paraiso de Goias',
            'slug' => 'alto-paraiso-de-goias',
            'summary' => 'Base de ecoturismo',
        ]);
        $altoParaiso->interestTags()->sync([$ecoturismo->id]);

        $minacu = City::factory()->for($serra)->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
            'summary' => 'Lago e pesca esportiva',
        ]);
        $minacu->interestTags()->sync([$nautico->id]);

        City::factory()->unpublished()->for($chapada)->create([
            'name' => 'Cidade Rascunho',
            'slug' => 'cidade-rascunho',
            'summary' => 'Nao deve aparecer',
        ]);

        $this->getJson('/api/v1/cities?search=ecoturismo&region_id='.$chapada->id.'&tag=ecoturismo&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'alto-paraiso-de-goias')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/v1/cities?region=Serra%20da%20Mesa&tag_id='.$nautico->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'minacu');
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
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'sao-jorge');

        $this->getJson('/api/v1/cities?region=Serra%20da%20Mesa')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'minacu');
    }

    public function test_city_show_endpoint_returns_city_by_slug_with_relationships(): void
    {
        Storage::fake('public');

        $region = Region::factory()->create([
            'name' => 'Chapada dos Veadeiros',
        ]);
        $city = City::factory()->for($region)->create([
            'name' => 'Alto Paraiso de Goias',
            'slug' => 'alto-paraiso-de-goias',
        ]);
        $tags = InterestTag::factory()->count(2)->create();
        $city->interestTags()->sync($tags->modelKeys());
        CityAttraction::factory()->for($city)->create([
            'name' => 'Mirante Publicado',
            'sort_order' => 0,
            'is_published' => true,
        ]);
        CityAttraction::factory()->unpublished()->for($city)->create([
            'name' => 'Atracao Oculta',
            'sort_order' => 1,
        ]);
        $coverMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/public-cover.jpg',
        ]);
        $galleryMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/public-gallery.jpg',
        ]);
        $city->galleryMediaAssets()->sync([
            $coverMedia->id => [
                'sort_order' => 0,
                'alt_text' => 'Capa publica',
                'is_cover' => true,
            ],
            $galleryMedia->id => [
                'sort_order' => 1,
                'alt_text' => 'Galeria publica',
                'is_cover' => false,
            ],
        ]);
        $city->update([
            'cover_image' => null,
        ]);

        $this->getJson('/api/v1/cities/alto-paraiso-de-goias')
            ->assertOk()
            ->assertJsonPath('slug', 'alto-paraiso-de-goias')
            ->assertJsonPath('region.name', 'Chapada dos Veadeiros')
            ->assertJsonCount(2, 'interestTags')
            ->assertJsonCount(1, 'attractions')
            ->assertJsonPath('attractions.0.name', 'Mirante Publicado')
            ->assertJsonMissing(['name' => 'Atracao Oculta'])
            ->assertJsonCount(2, 'gallery')
            ->assertJsonPath('gallery.0.isCover', true)
            ->assertJsonPath('gallery.0.altText', 'Capa publica')
            ->assertJsonPath('coverImage', '/storage/tourism/media/2026/04/public-cover.jpg');
    }

    public function test_city_show_endpoint_returns_not_found_for_unknown_slug(): void
    {
        $this->getJson('/api/v1/cities/inexistente')
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

        $this->getJson('/api/v1/events?published=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'festival-do-lago')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_events_endpoint_is_paginated_and_supports_search_city_tag_and_featured_filters(): void
    {
        $city = City::factory()->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
        ]);
        $otherCity = City::factory()->create([
            'name' => 'Sao Jorge',
            'slug' => 'sao-jorge',
        ]);
        $nautico = InterestTag::factory()->create([
            'name' => 'Turismo Nautico',
            'slug' => 'turismo-nautico',
        ]);
        $trilhas = InterestTag::factory()->create([
            'name' => 'Trilhas',
            'slug' => 'trilhas',
        ]);

        $festival = Event::factory()->for($city)->future()->featured()->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
            'description' => 'Programacao nautica e gastronomia.',
        ]);
        $festival->interestTags()->sync([$nautico->id]);

        $trilha = Event::factory()->for($otherCity)->future()->create([
            'title' => 'Circuito de Trilhas',
            'slug' => 'circuito-de-trilhas',
            'description' => 'Vivencia na chapada.',
        ]);
        $trilha->interestTags()->sync([$trilhas->id]);

        Event::factory()->for($city)->unpublished()->future()->create([
            'title' => 'Evento Rascunho',
            'slug' => 'evento-rascunho',
            'description' => 'Nao deve aparecer na API publica.',
        ]);

        $this->getJson('/api/v1/events?search=nautica&city_id='.$city->id.'&tag=turismo-nautico&featured=1&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'festival-do-lago')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/v1/events?city=sao-jorge&tag_id='.$trilhas->id)
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'circuito-de-trilhas');
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
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'festival-do-lago');
    }

    public function test_event_show_endpoint_returns_event_by_slug_with_relationships(): void
    {
        Storage::fake('public');

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
        $coverMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/public-event-cover.jpg',
        ]);
        $galleryMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/public-event-gallery.jpg',
        ]);
        $event->galleryMediaAssets()->sync([
            $coverMedia->id => [
                'sort_order' => 0,
                'alt_text' => 'Capa publica do evento',
                'is_cover' => true,
            ],
            $galleryMedia->id => [
                'sort_order' => 1,
                'alt_text' => 'Galeria publica do evento',
                'is_cover' => false,
            ],
        ]);
        $event->update([
            'cover_image' => null,
        ]);

        $this->getJson('/api/v1/events/festival-do-lago')
            ->assertOk()
            ->assertJsonPath('slug', 'festival-do-lago')
            ->assertJsonPath('city.slug', 'minacu')
            ->assertJsonCount(2, 'interestTags')
            ->assertJsonCount(2, 'gallery')
            ->assertJsonPath('gallery.0.isCover', true)
            ->assertJsonPath('gallery.0.altText', 'Capa publica do evento')
            ->assertJsonPath('coverImage', '/storage/tourism/media/2026/04/public-event-cover.jpg');
    }

    public function test_event_show_endpoint_returns_not_found_for_unknown_slug(): void
    {
        $this->getJson('/api/v1/events/inexistente')
            ->assertNotFound()
            ->assertExactJson([
                'message' => 'Resource not found.',
            ]);
    }

    public function test_public_api_rejects_write_methods(): void
    {
        $writeRequests = [
            ['postJson', '/api/v1/cities'],
            ['putJson', '/api/v1/cities/1'],
            ['patchJson', '/api/v1/cities/1'],
            ['deleteJson', '/api/v1/cities/1'],
            ['postJson', '/api/v1/events'],
            ['putJson', '/api/v1/events/1'],
            ['patchJson', '/api/v1/events/1'],
            ['deleteJson', '/api/v1/events/1'],
        ];

        foreach ($writeRequests as [$method, $uri]) {
            $this->{$method}($uri, [])
                ->assertStatus(405)
                ->assertExactJson([
                    'message' => 'Method not allowed.',
                ]);
        }
    }

    public function test_events_endpoint_orders_by_date(): void
    {
        $city = City::factory()->create();

        Event::factory()->for($city)->create([
            'title' => 'Event 2',
            'starts_at' => now()->addDays(2),
        ]);

        Event::factory()->for($city)->create([
            'title' => 'Event 1',
            'starts_at' => now()->addDay(),
        ]);

        Event::factory()->for($city)->create([
            'title' => 'Event 3',
            'starts_at' => now()->addDays(3),
        ]);

        $this->getJson('/api/v1/events')
            ->assertOk()
            ->assertJsonPath('data.0.title', 'Event 1')
            ->assertJsonPath('data.1.title', 'Event 2')
            ->assertJsonPath('data.2.title', 'Event 3');
    }
}
