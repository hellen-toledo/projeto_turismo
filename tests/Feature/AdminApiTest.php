<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use App\Models\MediaAsset;
use App\Models\Region;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (['admin@example.com', 'user@example.com', 'valid-login@example.com', 'invalid-login@example.com'] as $email) {
            RateLimiter::clear("admin-login|{$email}|127.0.0.1");
        }
    }

    public function test_admin_can_login_and_receive_token(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $this->postJson('/api/v1/admin/auth/login', [
            'email' => $admin->email,
            'password' => 'password',
            'deviceName' => 'phpunit',
        ])
            ->assertOk()
            ->assertJsonPath('tokenType', 'Bearer')
            ->assertJsonPath('user.email', 'admin@example.com')
            ->assertJsonPath('user.isAdmin', true);

        $token = $admin->tokens()->latest('id')->first();

        $this->assertNotNull($token);
        $this->assertTrue($token->can('admin'));
    }

    public function test_login_with_invalid_password_returns_generic_error(): void
    {
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
        ]);

        $this->postJson('/api/v1/admin/auth/login', [
            'email' => $admin->email,
            'password' => 'wrong-password',
            'deviceName' => 'phpunit',
        ])
            ->assertStatus(422)
            ->assertExactJson([
                'message' => 'Invalid admin credentials.',
            ]);
    }

    public function test_non_admin_user_cannot_obtain_admin_token(): void
    {
        $user = User::factory()->create([
            'email' => 'user@example.com',
        ]);

        $this->postJson('/api/v1/admin/auth/login', [
            'email' => $user->email,
            'password' => 'password',
            'deviceName' => 'phpunit',
        ])
            ->assertStatus(422)
            ->assertExactJson([
                'message' => 'Invalid admin credentials.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_guest_cannot_access_admin_resources(): void
    {
        $this->postJson('/api/v1/admin/cities', [])
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
            ->getJson('/api/v1/admin/auth/me')
            ->assertOk()
            ->assertJsonPath('email', 'admin@example.com')
            ->assertJsonPath('isAdmin', true);

        $this->withHeaders($headers)
            ->postJson('/api/v1/admin/auth/logout')
            ->assertOk()
            ->assertJson([
                'message' => 'Logged out successfully.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_non_admin_cannot_access_admin_resources(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/admin/regions')
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_admin_login_is_rate_limited(): void
    {
        $email = 'ratelimit-'.uniqid().'@example.com';

        User::factory()->admin()->create([
            'email' => $email,
        ]);

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/v1/admin/auth/login', [
                'email' => $email,
                'password' => 'wrong-password',
                'deviceName' => 'phpunit',
            ])
                ->assertStatus(422)
                ->assertExactJson([
                    'message' => 'Invalid admin credentials.',
                ]);
        }

        $this->postJson('/api/v1/admin/auth/login', [
            'email' => $email,
            'password' => 'wrong-password',
            'deviceName' => 'phpunit',
        ])
            ->assertStatus(429);
    }

    public function test_admin_can_list_protected_resources(): void
    {
        $this->authenticateAsAdmin();

        $region = Region::factory()->create();
        $tag = InterestTag::factory()->create();
        $city = City::factory()->for($region)->create();
        Event::factory()->for($city)->create();

        $this->getJson('/api/v1/admin/regions')
            ->assertOk()
            ->assertJsonCount(1);

        $this->getJson('/api/v1/admin/interest-tags')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.slug', $tag->slug);

        $this->getJson('/api/v1/admin/cities')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/v1/admin/events')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_admin_can_manage_regions_tags_and_cities(): void
    {
        $this->authenticateAsAdmin();
        Storage::fake('public');

        $regionResponse = $this->postJson('/api/v1/admin/regions', [
            'name' => 'Chapada dos Veadeiros',
        ])->assertCreated();

        $tagResponse = $this->postJson('/api/v1/admin/interest-tags', [
            'name' => 'Ecoturismo',
        ])->assertCreated();

        $coverMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/admin-cover.jpg',
            'alt_text' => 'Capa administrativa',
        ]);
        $galleryMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/admin-gallery.jpg',
            'alt_text' => 'Galeria administrativa',
        ]);

        $cityResponse = $this->postJson('/api/v1/admin/cities', $this->validCityPayload(
            regionId: $regionResponse->json('id'),
            interestTagIds: [$tagResponse->json('id')],
            attractions: [
                [
                    'name' => 'Mirante Central',
                    'description' => 'Vista ampla da cidade.',
                    'imageUrl' => 'https://example.com/mirante.jpg',
                    'sortOrder' => 0,
                    'isPublished' => true,
                ],
            ],
            gallery: [
                [
                    'mediaAssetId' => $coverMedia->id,
                    'sortOrder' => 0,
                    'altText' => 'Foto de capa da cidade',
                    'isCover' => true,
                ],
                [
                    'mediaAssetId' => $galleryMedia->id,
                    'sortOrder' => 1,
                    'altText' => 'Foto complementar',
                    'isCover' => false,
                ],
            ],
        ));

        $cityResponse
            ->assertCreated()
            ->assertJsonPath('name', 'Alto Paraiso de Goias')
            ->assertJsonPath('region.name', 'Chapada dos Veadeiros')
            ->assertJsonPath('attractions.0.name', 'Mirante Central')
            ->assertJsonPath('attractions.0.isPublished', true)
            ->assertJsonPath('gallery.0.id', $coverMedia->id)
            ->assertJsonPath('gallery.0.isCover', true);

        $cityId = $cityResponse->json('id');

        $this->patchJson("/api/v1/admin/cities/{$cityId}", [
            'summary' => 'Resumo atualizado.',
            'attractions' => [
                [
                    'id' => $cityResponse->json('attractions.0.id'),
                    'name' => 'Mirante Central Renovado',
                    'description' => 'Vista atualizada da cidade.',
                    'imageUrl' => 'https://example.com/mirante-renovado.jpg',
                    'sortOrder' => 0,
                    'isPublished' => true,
                ],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('summary', 'Resumo atualizado.')
            ->assertJsonPath('attractions.0.name', 'Mirante Central Renovado');

        $this->getJson('/api/v1/admin/cities')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson("/api/v1/admin/cities/{$cityId}")
            ->assertOk()
            ->assertJsonPath('gallery.0.id', $coverMedia->id)
            ->assertJsonPath('gallery.1.id', $galleryMedia->id)
            ->assertJsonPath('attractions.0.name', 'Mirante Central Renovado');
    }

    public function test_admin_city_creation_validates_required_fields(): void
    {
        $this->authenticateAsAdmin();

        $this->postJson('/api/v1/admin/cities', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'description', 'regionId']);
    }

    public function test_admin_can_manage_events(): void
    {
        $this->authenticateAsAdmin();
        Storage::fake('public');

        $city = City::factory()->create([
            'name' => 'Minacu',
            'slug' => 'minacu',
        ]);
        $tag = InterestTag::factory()->create([
            'name' => 'Turismo Nautico',
            'slug' => 'turismo-nautico',
        ]);
        $coverMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/event-cover.jpg',
        ]);
        $galleryMedia = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/event-gallery.jpg',
        ]);

        $response = $this->postJson('/api/v1/admin/events', $this->validEventPayload(
            cityId: $city->id,
            interestTagIds: [$tag->id],
            gallery: [
                [
                    'mediaAssetId' => $coverMedia->id,
                    'sortOrder' => 0,
                    'altText' => 'Capa do evento',
                    'isCover' => true,
                ],
                [
                    'mediaAssetId' => $galleryMedia->id,
                    'sortOrder' => 1,
                    'altText' => 'Bastidores do evento',
                    'isCover' => false,
                ],
            ],
        ));

        $response
            ->assertCreated()
            ->assertJsonPath('title', 'Festival do Lago')
            ->assertJsonPath('city.slug', 'minacu')
            ->assertJsonPath('isFeatured', true)
            ->assertJsonPath('gallery.0.id', $coverMedia->id)
            ->assertJsonPath('gallery.0.isCover', true)
            ->assertJsonPath('coverImage', '/storage/tourism/media/2026/04/event-cover.jpg');

        $eventId = $response->json('id');

        $this->patchJson("/api/v1/admin/events/{$eventId}", [
            'gallery' => [
                [
                    'mediaAssetId' => $galleryMedia->id,
                    'sortOrder' => 0,
                    'altText' => 'Nova capa do evento',
                    'isCover' => true,
                ],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('gallery.0.id', $galleryMedia->id)
            ->assertJsonPath('gallery.0.isCover', true)
            ->assertJsonPath('coverImage', '/storage/tourism/media/2026/04/event-gallery.jpg');

        $this->deleteJson("/api/v1/admin/events/{$eventId}")
            ->assertNoContent();
    }

    public function test_admin_event_creation_validates_required_fields(): void
    {
        $this->authenticateAsAdmin();

        $this->postJson('/api/v1/admin/events', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'description', 'startsAt', 'cityId']);
    }

    public function test_admin_city_listing_supports_search_filters_and_draft_visibility(): void
    {
        $this->authenticateAsAdmin();

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
            'summary' => 'Destino de ecoturismo',
            'is_published' => true,
        ]);
        $altoParaiso->interestTags()->sync([$ecoturismo->id]);

        $cidadeRascunho = City::factory()->unpublished()->for($serra)->create([
            'name' => 'Cidade Rascunho',
            'slug' => 'cidade-rascunho',
            'summary' => 'Operacao nautica',
        ]);
        $cidadeRascunho->interestTags()->sync([$nautico->id]);

        $this->getJson('/api/v1/admin/cities?search=ecoturismo&region_id='.$chapada->id.'&tag=ecoturismo&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'alto-paraiso-de-goias')
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/v1/admin/cities?published=0')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'cidade-rascunho');
    }

    public function test_admin_event_listing_supports_search_filters_and_draft_visibility(): void
    {
        $this->authenticateAsAdmin();

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

        $festival = Event::factory()->for($city)->future()->featured()->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
            'description' => 'Agenda nautica',
            'is_published' => true,
        ]);
        $festival->interestTags()->sync([$nautico->id]);

        Event::factory()->for($otherCity)->unpublished()->future()->create([
            'title' => 'Evento Rascunho',
            'slug' => 'evento-rascunho',
            'description' => 'Nao publicado',
        ]);

        $this->getJson('/api/v1/admin/events?search=nautica&city_id='.$city->id.'&tag=turismo-nautico&featured=1&per_page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'festival-do-lago')
            ->assertJsonPath('meta.total', 1);

        $this->getJson('/api/v1/admin/events?published=0')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.slug', 'evento-rascunho');
    }

    public function test_admin_can_delete_city(): void
    {
        $this->authenticateAsAdmin();

        $city = City::factory()->create();

        $this->deleteJson("/api/v1/admin/cities/{$city->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('cities', ['id' => $city->id]);
    }

    public function test_admin_can_update_event(): void
    {
        $this->authenticateAsAdmin();

        $event = Event::factory()->create([
            'title' => 'Old Title',
            'starts_at' => now()->addDay(),
        ]);

        $this->patchJson("/api/v1/admin/events/{$event->id}", [
            'title' => 'New Title',
        ])
            ->assertOk()
            ->assertJsonPath('title', 'New Title');

        $this->assertDatabaseHas('events', [
            'id' => $event->id,
            'title' => 'New Title',
        ]);
    }

    public function test_admin_can_still_create_event_with_legacy_cover_image_url(): void
    {
        $this->authenticateAsAdmin();

        $city = City::factory()->create([
            'slug' => 'minacu',
        ]);

        $response = $this->postJson('/api/v1/admin/events', [
            'title' => 'Evento com URL Legada',
            'description' => 'Evento usando payload antigo.',
            'startsAt' => '2026-09-10 09:00:00',
            'endsAt' => '2026-09-10 18:00:00',
            'cityId' => $city->id,
            'coverImage' => 'https://example.com/legacy-event.jpg',
            'isPublished' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('coverImage', 'https://example.com/legacy-event.jpg');

        $this->assertDatabaseHas('events', [
            'title' => 'Evento com URL Legada',
            'cover_image' => 'https://example.com/legacy-event.jpg',
        ]);
    }

    private function authenticateAsAdmin(): User
    {
        $admin = User::factory()->admin()->create();
        Sanctum::actingAs($admin, ['admin']);

        return $admin;
    }

    private function validCityPayload(
        int $regionId,
        array $interestTagIds = [],
        array $attractions = [],
        array $gallery = [],
    ): array {
        return [
            'name' => 'Alto Paraiso de Goias',
            'summary' => 'Base de apoio da Chapada.',
            'description' => 'Destino para trilhas e cachoeiras.',
            'coverImage' => 'https://example.com/cidade.jpg',
            'regionId' => $regionId,
            'isPublished' => true,
            'interestTagIds' => $interestTagIds,
            'attractions' => $attractions,
            'gallery' => $gallery,
        ];
    }

    private function validEventPayload(int $cityId, array $interestTagIds = [], array $gallery = []): array
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
            'gallery' => $gallery,
        ];
    }
}
