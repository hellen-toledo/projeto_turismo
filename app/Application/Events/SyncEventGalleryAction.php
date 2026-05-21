<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use App\Domain\MediaAssets\MediaAsset;

class SyncEventGalleryAction
{
    public function __invoke(Event $event, array $items): void
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

        $event->galleryMediaAssets()->sync($syncPayload);

        if ($coverMedia) {
            $event->forceFill([
                'cover_image' => $coverMedia->path,
            ])->save();
        }
    }
}
