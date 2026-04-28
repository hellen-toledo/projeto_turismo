<?php

namespace Tests\Feature;

use App\Models\MediaAsset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminMediaApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_upload_media(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $response = $this->post('/api/v1/admin/media', [
            'file' => $this->fakePngImage('cover.png'),
            'collection' => 'cover',
            'altText' => 'Vista panoramica da cidade',
        ], [
            'Accept' => 'application/json',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('originalName', 'cover.png')
            ->assertJsonPath('collection', 'cover')
            ->assertJsonPath('altText', 'Vista panoramica da cidade')
            ->assertJsonPath('mimeType', 'image/png');

        $media = MediaAsset::query()->first();

        $this->assertNotNull($media);
        $this->assertDatabaseHas('media_assets', [
            'id' => $media->id,
            'disk' => 'public',
            'original_name' => 'cover.png',
            'collection' => 'cover',
            'created_by' => auth()->id(),
        ]);
        Storage::disk('public')->assertExists($media->path);
    }

    public function test_guest_cannot_upload_media(): void
    {
        Storage::fake('public');

        $this->post('/api/v1/admin/media', [
            'file' => $this->fakePngImage('cover.png'),
        ], [
            'Accept' => 'application/json',
        ])
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    public function test_media_upload_validates_invalid_file_types(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $this->postJson('/api/v1/admin/media', [
            'file' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
            'collection' => 'cover',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['file'])
            ->assertJsonPath('errors.file.0', 'O campo arquivo deve ser uma imagem válida.');
    }

    public function test_media_upload_validates_invalid_collection(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $this->post('/api/v1/admin/media', [
            'file' => $this->fakePngImage('cover.png'),
            'collection' => 'invalid',
        ], [
            'Accept' => 'application/json',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['collection'])
            ->assertJsonPath('errors.collection.0', 'O valor informado para coleção é inválido.');
    }

    public function test_admin_can_delete_media_and_physical_file(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $media = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/delete-me.jpg',
        ]);

        Storage::disk('public')->put($media->path, 'image-binary');
        Storage::disk('public')->assertExists($media->path);

        $this->deleteJson("/api/v1/admin/media/{$media->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('media_assets', ['id' => $media->id]);
        Storage::disk('public')->assertMissing($media->path);
    }

    public function test_admin_can_list_media_with_expected_json_shape(): void
    {
        Storage::fake('public');
        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);

        $media = MediaAsset::factory()->create([
            'disk' => 'public',
            'path' => 'tourism/media/2026/04/example.jpg',
            'original_name' => 'example.jpg',
            'mime_type' => 'image/jpeg',
            'collection' => 'gallery',
            'alt_text' => 'Imagem da galeria',
        ]);

        $this->getJson('/api/v1/admin/media?collection=gallery')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $media->id)
            ->assertJsonPath('data.0.path', 'tourism/media/2026/04/example.jpg')
            ->assertJsonPath('data.0.originalName', 'example.jpg')
            ->assertJsonPath('data.0.mimeType', 'image/jpeg')
            ->assertJsonPath('data.0.collection', 'gallery')
            ->assertJsonPath('data.0.altText', 'Imagem da galeria')
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'url',
                        'path',
                        'originalName',
                        'mimeType',
                        'size',
                        'collection',
                        'altText',
                        'createdAt',
                    ],
                ],
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
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
}
