<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;

class CreateCityAction
{
    public function __construct(
        private readonly GeneratesCitySlug $generateSlug,
    ) {}

    public function __invoke(array $data): City
    {
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

        return $city->load(['region', 'interestTags']);
    }
}
