<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Illuminate\Support\Facades\DB;

class CreateCityAction
{
    public function __construct(
        private readonly GeneratesCitySlug $generateSlug,
        private readonly SyncCityAttractionsAction $syncCityAttractions,
        private readonly SyncCityGalleryAction $syncCityGallery,
    ) {}

    public function __invoke(array $data): City
    {
        return DB::transaction(function () use ($data): City {
            $tagIds = $data['interestTagIds'] ?? [];

            $city = City::query()->create([
                'name' => $data['name'],
                'slug' => ($this->generateSlug)($data['name'], $data['slug'] ?? null),
                'summary' => $data['summary'] ?? null,
                'description' => $data['description'],
                'cover_image' => $data['coverImage'] ?? null,
                'region_id' => $data['regionId'],
                'is_published' => $data['isPublished'] ?? true,
            ]);

            if ($tagIds !== []) {
                $city->interestTags()->sync($tagIds);
            }

            if (array_key_exists('attractions', $data)) {
                ($this->syncCityAttractions)($city, $data['attractions'] ?? []);
            }

            if (array_key_exists('gallery', $data)) {
                ($this->syncCityGallery)($city, $data['gallery'] ?? []);
            }

            return $city->load(['region', 'interestTags', 'attractions', 'galleryMediaAssets']);
        });
    }
}
