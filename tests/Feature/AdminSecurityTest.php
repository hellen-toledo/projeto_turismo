<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Event;
use App\Models\InterestTag;
use App\Models\MediaAsset;
use App\Models\Region;
use App\Models\User;
use App\Policies\CityPolicy;
use App\Policies\EventPolicy;
use App\Policies\InterestTagPolicy;
use App\Policies\RegionPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminSecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_media_index(): void
    {
        $this->getJson('/api/v1/admin/media')
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_non_admin_user_cannot_access_admin_media_index(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/v1/admin/media')
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_admin_can_access_admin_media_index(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $this->getJson('/api/v1/admin/media')
            ->assertOk();
    }

    public function test_non_admin_user_cannot_upload_media(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->create());

        $this->post('/api/v1/admin/media', [
            'file' => $this->fakePngImage('cover.png'),
        ], [
            'Accept' => 'application/json',
        ])
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_cannot_delete_region_with_linked_cities(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $region = Region::factory()->create();
        City::factory()->for($region)->create();

        $this->deleteJson("/api/v1/admin/regions/{$region->id}")
            ->assertStatus(409)
            ->assertExactJson([
                'message' => 'Region has linked cities and cannot be deleted.',
            ]);

        $this->assertDatabaseHas('regions', ['id' => $region->id]);
    }

    public function test_cannot_delete_city_with_linked_events(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $region = Region::factory()->create();
        $city = City::factory()->for($region)->create();
        Event::factory()->for($city)->create();

        $this->deleteJson("/api/v1/admin/cities/{$city->id}")
            ->assertStatus(409)
            ->assertExactJson([
                'message' => 'City has linked events and cannot be deleted.',
            ]);

        $this->assertDatabaseHas('cities', ['id' => $city->id]);
    }

    public function test_cannot_delete_media_asset_while_it_is_in_use(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $region = Region::factory()->create();
        $city = City::factory()->for($region)->create();
        $media = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/in-use.jpg',
        ]);

        Storage::disk('public')->put($media->path, 'image-binary');
        $city->galleryMediaAssets()->attach($media->id, [
            'sort_order' => 0,
            'is_cover' => true,
        ]);

        $this->deleteJson("/api/v1/admin/media/{$media->id}")
            ->assertStatus(409)
            ->assertExactJson([
                'message' => 'Media asset is linked to content and cannot be deleted.',
            ]);

        $this->assertDatabaseHas('media_assets', ['id' => $media->id]);
        Storage::disk('public')->assertExists($media->path);
    }

    public function test_city_update_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(CityPolicy::class, 'update');

        $region = Region::factory()->create();
        $city = City::factory()->for($region)->create();

        $this->patchJson("/api/v1/admin/cities/{$city->id}", [
            'summary' => 'Resumo bloqueado pela policy.',
        ])
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_city_delete_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(CityPolicy::class, 'delete');

        $region = Region::factory()->create();
        $city = City::factory()->for($region)->create();

        $this->deleteJson("/api/v1/admin/cities/{$city->id}")
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_event_update_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(EventPolicy::class, 'update');

        $city = City::factory()->create();
        $event = Event::factory()->for($city)->create();

        $this->patchJson("/api/v1/admin/events/{$event->id}", [
            'title' => 'Evento bloqueado pela policy',
        ])
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_event_delete_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(EventPolicy::class, 'delete');

        $city = City::factory()->create();
        $event = Event::factory()->for($city)->create();

        $this->deleteJson("/api/v1/admin/events/{$event->id}")
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_region_update_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(RegionPolicy::class, 'update');

        $region = Region::factory()->create();

        $this->patchJson("/api/v1/admin/regions/{$region->id}", [
            'name' => 'Regiao bloqueada',
        ])
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_region_delete_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(RegionPolicy::class, 'delete');

        $region = Region::factory()->create();

        $this->deleteJson("/api/v1/admin/regions/{$region->id}")
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_interest_tag_update_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(InterestTagPolicy::class, 'update');

        $interestTag = InterestTag::factory()->create();

        $this->patchJson("/api/v1/admin/interest-tags/{$interestTag->id}", [
            'name' => 'Tag bloqueada',
        ])
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    public function test_interest_tag_delete_respects_policy(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
        $this->denyPolicyAbility(InterestTagPolicy::class, 'delete');

        $interestTag = InterestTag::factory()->create();

        $this->deleteJson("/api/v1/admin/interest-tags/{$interestTag->id}")
            ->assertForbidden()
            ->assertJson([
                'message' => 'Forbidden.',
            ]);
    }

    private function fakePngImage(string $name): UploadedFile
    {
        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==',
            true,
        );

        return UploadedFile::fake()->createWithContent($name, $png ?: '');
    }

    private function denyPolicyAbility(string $policyClass, string $ability): void
    {
        $this->app->instance($policyClass, new DenySingleAbilityPolicy($ability));
    }
}

class DenySingleAbilityPolicy
{
    public function __construct(private readonly string $abilityToDeny) {}

    public function __call(string $method, array $arguments): bool
    {
        if ($method === $this->abilityToDeny) {
            return false;
        }

        return true;
    }
}
