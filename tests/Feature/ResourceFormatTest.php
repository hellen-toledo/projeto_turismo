<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use App\Models\Region;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResourceFormatTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_city_resource_uses_camel_case_format(): void
    {
        $region = Region::factory()->create(['name' => 'Regiao Teste']);
        $city = City::factory()->for($region)->create([
            'slug' => 'cidade-teste',
            'cover_image' => 'http://example.com/img.jpg',
            'is_published' => true,
        ]);
        $tag = InterestTag::factory()->create(['name' => 'Ecoturismo']);
        $city->interestTags()->sync([$tag->id]);

        $this->getJson('/api/v1/cities/cidade-teste')
            ->assertOk()
            ->assertJsonStructure([
                'id',
                'name',
                'slug',
                'summary',
                'description',
                'coverImage', // camelCase check
                'isPublished', // camelCase check
                'region' => ['id', 'name'],
                'interestTags' => [
                    '*' => ['id', 'name', 'slug'],
                ],
            ]);
    }

    public function test_public_event_resource_uses_camel_case_format(): void
    {
        $city = City::factory()->create();
        $event = Event::factory()->for($city)->create([
            'slug' => 'evento-teste',
            'cover_image' => 'http://example.com/img.jpg',
            'starts_at' => now(),
            'ends_at' => now()->addDay(),
            'is_featured' => true,
            'is_published' => true,
            'external_url' => 'http://example.com',
        ]);

        $this->getJson('/api/v1/events/evento-teste')
            ->assertOk()
            ->assertJsonStructure([
                'id',
                'title',
                'slug',
                'description',
                'startsAt', // camelCase check
                'endsAt', // camelCase check
                'coverImage', // camelCase check
                'externalUrl', // camelCase check
                'isFeatured', // camelCase check
                'isPublished', // camelCase check
                'city' => ['id', 'name', 'slug'],
                'interestTags',
            ]);
    }
}
