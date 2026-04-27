<?php

namespace Tests\Feature;

use App\Models\Region;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminCityValidationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Region $region;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        Sanctum::actingAs($this->admin, ['admin']);

        $this->region = Region::factory()->create();
    }

    public function test_store_city_requires_name_description_and_region(): void
    {
        $this->postJson('/api/v1/admin/cities', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'description', 'regionId']);
    }

    public function test_store_city_validates_relationships(): void
    {
        $this->postJson('/api/v1/admin/cities', [
            'name' => 'Valid Name',
            'description' => 'Valid description',
            'regionId' => 999, // Non-existent
            'interestTagIds' => [999], // Non-existent
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['regionId', 'interestTagIds.0']);
    }

    public function test_store_city_validates_cover_image_is_url(): void
    {
        $this->postJson('/api/v1/admin/cities', [
            'name' => 'Valid Name',
            'description' => 'Valid description',
            'regionId' => $this->region->id,
            'coverImage' => 'not-a-url',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['coverImage']);
    }

    public function test_slug_is_generated_if_omitted_and_must_be_unique(): void
    {
        $city1 = $this->postJson('/api/v1/admin/cities', [
            'name' => 'Unique City',
            'description' => 'Desc',
            'regionId' => $this->region->id,
        ])->assertCreated();

        $this->assertEquals('unique-city', $city1->json('slug'));

        $city2 = $this->postJson('/api/v1/admin/cities', [
            'name' => 'Unique City', // Same name
            'description' => 'Desc',
            'regionId' => $this->region->id,
        ])->assertCreated();

        $this->assertNotEquals('unique-city', $city2->json('slug'));
        $this->assertStringStartsWith('unique-city-', $city2->json('slug'));
    }
}
