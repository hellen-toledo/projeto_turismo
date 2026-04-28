<?php

namespace Tests\Feature;

use App\Models\InterestTag;
use App\Models\Region;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminTaxonomyValidationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Sanctum::actingAs(User::factory()->admin()->create(), ['admin']);
    }

    public function test_store_region_requires_name_in_portuguese(): void
    {
        $this->postJson('/api/v1/admin/regions', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name'])
            ->assertJsonPath('errors.name.0', 'O campo nome é obrigatório.');
    }

    public function test_update_region_allows_keeping_the_same_name(): void
    {
        $region = Region::factory()->create([
            'name' => 'Chapada dos Veadeiros',
        ]);

        $this->patchJson("/api/v1/admin/regions/{$region->id}", [
            'name' => 'Chapada dos Veadeiros',
        ])
            ->assertOk()
            ->assertJsonPath('name', 'Chapada dos Veadeiros');
    }

    public function test_store_interest_tag_requires_name_and_rejects_duplicate_slug(): void
    {
        InterestTag::factory()->create([
            'name' => 'Ecoturismo Original',
            'slug' => 'ecoturismo',
        ]);

        $this->postJson('/api/v1/admin/interest-tags', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name'])
            ->assertJsonPath('errors.name.0', 'O campo nome é obrigatório.');

        $this->postJson('/api/v1/admin/interest-tags', [
            'name' => 'Outra Tag',
            'slug' => 'ecoturismo',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug'])
            ->assertJsonPath('errors.slug.0', 'O valor informado para slug já está em uso.');
    }

    public function test_update_interest_tag_allows_keeping_the_same_slug(): void
    {
        $interestTag = InterestTag::factory()->create([
            'name' => 'Cachoeiras',
            'slug' => 'cachoeiras',
        ]);

        $this->patchJson("/api/v1/admin/interest-tags/{$interestTag->id}", [
            'slug' => 'cachoeiras',
        ])
            ->assertOk()
            ->assertJsonPath('slug', 'cachoeiras');
    }
}
