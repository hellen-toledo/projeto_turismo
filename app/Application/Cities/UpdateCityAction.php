<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Illuminate\Support\Facades\DB;

class UpdateCityAction
{
    public function __construct(
        private readonly GeneratesCitySlug $generateSlug,
        private readonly SyncCityAttractionsAction $syncCityAttractions,
        private readonly SyncCityGalleryAction $syncCityGallery,
    ) {}

    public function __invoke(City $city, array $data): City
    {
        return DB::transaction(function () use ($city, $data): City {
            $tagIds = $data['interestTagIds'] ?? null;

            if (array_key_exists('name', $data) || array_key_exists('slug', $data)) {
                $city->slug = ($this->generateSlug)(
                    $data['name'] ?? $city->name,
                    $data['slug'] ?? null,
                    $city->id,
                );
            }

            $city->fill([
                'name' => $data['name'] ?? $city->name,
                'summary' => $data['summary'] ?? $city->summary,
                'description' => $data['description'] ?? $city->description,
                'cover_image' => array_key_exists('coverImage', $data) ? $data['coverImage'] : $city->cover_image,
                'region_id' => $data['regionId'] ?? $city->region_id,
                'is_published' => $data['isPublished'] ?? $city->is_published,
            ]);
            $city->save();

            if (is_array($tagIds)) {
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
