<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use App\Models\Region;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_and_receive_token(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/admin/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'password',
            'deviceName' => 'phpunit',
        ])
            ->assertOk()
            ->assertJsonPath('tokenType', 'Bearer')
            ->assertJsonPath('user.email', 'admin@example.com')
            ->assertJsonPath('user.isAdmin', true);
    }

    public function test_guest_cannot_access_admin_resources(): void
    {
        $this->postJson('/api/admin/v1/cities', [])
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_admin_can_read_current_session_and_logout_with_token(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
        ]);
        $token = $admin->createToken('phpunit', ['admin'])->plainTextToken;

        $headers = [
            'Authorization' => "Bearer {$token}",
        ];

        $this->withHeaders($headers)
            ->getJson('/api/admin/v1/auth/me')
            ->assertOk()
            ->assertJsonPath('email', 'admin@example.com')
            ->assertJsonPath('isAdmin', true);

        $this->withHeaders($headers)
            ->postJson('/api/admin/v1/auth/logout')
            ->assertOk()
            ->assertJson([
                'message' => 'Logged out successfully.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_non_admin_cannot_access_admin_resources(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/admin/v1/regions')
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_admin_can_list_protected_resources(): void
    {
        $this->authenticateAsAdmin();

        $region = Region::factory()->create();
        $tag = InterestTag::factory()->create();
        $city = City::factory()->for($region)->create();
        Event::factory()->for($city)->create();

        $this->getJson('/api/admin/v1/regions')
            ->assertOk()
            ->assertJsonCount(1);

        $this->getJson('/api/admin/v1/interest-tags')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', $tag->slug);

        $this->getJson('/api/admin/v1/cities')
            ->assertOk()
            ->assertJsonCount(1);

        $this->getJson('/api/admin/v1/events')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_admin_can_manage_regions_tags_and_cities(): void
    {
        $this->authenticateAsAdmin();

        $regionResponse = $this->postJson('/api/admin/v1/regions', [
            'name' => 'Chapada dos Veadeiros',
        ])->assertCreated();

        $tagResponse = $this->postJson('/api/admin/v1/interest-tags', [
            'name' => 'Ecoturismo',
        ])->assertCreated();

        $cityResponse = $this->postJson('/api/admin/v1/cities', $this->validCityPayload(
            regionId: $regionResponse->json('id'),
            interestTagIds: [$tagResponse->json('id')],
        ));

        $cityResponse
            ->assertCreated()
            ->assertJsonPath('name', 'Alto Paraiso de Goias')
            ->assertJsonPath('region.name', 'Chapada dos Veadeiros');

        $cityId = $cityResponse->json('id');

        $this->patchJson("/api/admin/v1/cities/{$cityId}", [
            'summary' => 'Resumo atualizado.',
        ])
            ->assertOk()
            ->assertJsonPath('summary', 'Resumo atualizado.');

        $this->getJson('/api/admin/v1/cities')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_admin_city_creation_validates_required_fields(): void
    {
        $this->authenticateAsAdmin();

        $this->postJson('/api/admin/v1/cities', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'description', 'regionId']);
    }

    public function test_admin_can_manage_events(): void
    {
        $this->authenticateAsAdmin();

        $city = City::factory()->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
        ]);
        $tag = InterestTag::factory()->create([
            'name' => 'Turismo Nautico',
            'slug' => 'turismo-nautico',
        ]);

        $response = $this->postJson('/api/admin/v1/events', $this->validEventPayload(
            cityId: $city->id,
            interestTagIds: [$tag->id],
        ));

        $response
            ->assertCreated()
            ->assertJsonPath('title', 'Festival do Lago')
            ->assertJsonPath('city.slug', 'minacu')
            ->assertJsonPath('isFeatured', true);

        $eventId = $response->json('id');

        $this->deleteJson("/api/admin/v1/events/{$eventId}")
            ->assertNoContent();
    }

    public function test_admin_event_creation_validates_required_fields(): void
    {
        $this->authenticateAsAdmin();

        $this->postJson('/api/admin/v1/events', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'description', 'startsAt', 'cityId']);
    }

    private function authenticateAsAdmin(): User
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin, ['admin']);

        return $admin;
    }

    private function validCityPayload(int $regionId, array $interestTagIds = []): array
    {
        return [
            'name' => 'Alto Paraiso de Goias',
            'summary' => 'Base de apoio da Chapada.',
            'description' => 'Destino para trilhas e cachoeiras.',
            'coverImage' => 'https://example.com/cidade.jpg',
            'regionId' => $regionId,
            'isPublished' => true,
            'interestTagIds' => $interestTagIds,
        ];
    }

    private function validEventPayload(int $cityId, array $interestTagIds = []): array
    {
        return [
            'title' => 'Festival do Lago',
            'description' => 'Evento nautico.',
            'startsAt' => '2026-09-10 09:00:00',
            'endsAt' => '2026-09-10 18:00:00',
            'cityId' => $cityId,
            'isFeatured' => true,
            'isPublished' => true,
            'interestTagIds' => $interestTagIds,
        ];
    }
}
