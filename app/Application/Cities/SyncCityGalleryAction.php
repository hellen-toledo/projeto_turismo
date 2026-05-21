<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use App\Domain\MediaAssets\MediaAsset;

class SyncCityGalleryAction
{
    public function __invoke(City $city, array $items): void
    {
        $syncPayload = [];
        $coverMedia = null;

        foreach (array_values($items) as $index => $item) {
            $mediaId = (int) $item['mediaAssetId'];
            $isCover = (bool) ($item['isCover'] ?? false);
            $media = MediaAsset::query()->findOrFail($mediaId);

            if ($isCover) {
                $coverMedia = $media;
            }

            $syncPayload[$mediaId] = [
                'sort_order' => $item['sortOrder'] ?? $index,
                'alt_text' => $item['altText'] ?? null,
                'is_cover' => $isCover,
            ];
        }

        $city->galleryMediaAssets()->sync($syncPayload);

        if ($coverMedia) {
            $city->forceFill([
                'cover_image' => $coverMedia->path,
            ])->save();
        }
    }
}
