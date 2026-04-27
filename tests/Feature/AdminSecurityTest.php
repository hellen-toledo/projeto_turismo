<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Event;
use App\Models\MediaAsset;
use App\Models\Region;
use App\Models\User;
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

    private function fakePngImage(string $name): UploadedFile
    {
        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4////fwAJ+wP9KobjigAAAABJRU5ErkJggg==',
            true,
        );

        return UploadedFile::fake()->createWithContent($name, $png ?: '');
    }
}
