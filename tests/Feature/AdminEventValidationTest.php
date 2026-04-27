<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminEventValidationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private City $city;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        Sanctum::actingAs($this->admin, ['admin']);

        $this->city = City::factory()->create();
    }

    public function test_store_event_requires_fields(): void
    {
        $this->postJson('/api/v1/admin/events', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'description', 'startsAt', 'cityId']);
    }

    public function test_store_event_validates_relationships(): void
    {
        $this->postJson('/api/v1/admin/events', [
            'title' => 'Title',
            'description' => 'Desc',
            'startsAt' => '2026-01-01 10:00:00',
            'cityId' => 999, // Non-existent
            'interestTagIds' => [999], // Non-existent
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['cityId', 'interestTagIds.0']);
    }

    public function test_store_event_validates_dates(): void
    {
        $this->postJson('/api/v1/admin/events', [
            'title' => 'Title',
            'description' => 'Desc',
            'startsAt' => 'not-a-date',
            'cityId' => $this->city->id,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['startsAt']);

        $this->postJson('/api/v1/admin/events', [
            'title' => 'Title',
            'description' => 'Desc',
            'startsAt' => '2026-01-02 10:00:00',
            'endsAt' => '2026-01-01 10:00:00', // Before startsAt
            'cityId' => $this->city->id,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['endsAt']);
    }

    public function test_slug_is_generated_if_omitted_and_must_be_unique(): void
    {
        $event1 = $this->postJson('/api/v1/admin/events', [
            'title' => 'Unique Event',
            'description' => 'Desc',
            'startsAt' => '2026-01-01 10:00:00',
            'cityId' => $this->city->id,
        ])->assertCreated();

        $this->assertEquals('unique-event', $event1->json('slug'));

        $event2 = $this->postJson('/api/v1/admin/events', [
            'title' => 'Unique Event', // Same title
            'description' => 'Desc',
            'startsAt' => '2026-01-01 10:00:00',
            'cityId' => $this->city->id,
        ])->assertCreated();

        $this->assertNotEquals('unique-event', $event2->json('slug'));
        $this->assertStringStartsWith('unique-event-', $event2->json('slug'));
    }
}
