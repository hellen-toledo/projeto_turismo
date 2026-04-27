<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use App\Models\MediaAsset;
use Illuminate\Support\Facades\Storage;

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

            $syncPayload[$mediaId] = [
                'sort_order' => $item['sortOrder'] ?? $index,
                'alt_text' => $item['altText'] ?? null,
                'is_cover' => $isCover,
            ];

            if ($isCover) {
                $coverMedia = $media;
            }
        }

        $city->galleryMediaAssets()->sync($syncPayload);

        if ($coverMedia) {
            $city->forceFill([
                'cover_image' => Storage::disk($coverMedia->disk)->url($coverMedia->path),
            ])->save();
        }
    }
}
