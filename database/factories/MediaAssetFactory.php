<?php

namespace Database\Factories;

use App\Domain\MediaAssets\MediaAsset as DomainMediaAsset;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DomainMediaAsset>
 */
class MediaAssetFactory extends Factory
{
    protected $model = DomainMediaAsset::class;

    public function definition(): array
    {
        return [
            'disk' => 'public',
            'path' => sprintf('tourism/media/%s/%s.jpg', now()->format('Y/m'), fake()->uuid()),
            'original_name' => fake()->slug().'.jpg',
            'mime_type' => 'image/jpeg',
            'size' => fake()->numberBetween(10_000, 2_000_000),
            'collection' => fake()->randomElement(DomainMediaAsset::collections()),
            'alt_text' => fake()->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
