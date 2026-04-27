<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use App\Models\MediaAsset;
use Illuminate\Support\Facades\Storage;

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

            $syncPayload[$mediaId] = [
                'sort_order' => $item['sortOrder'] ?? $index,
                'alt_text' => $item['altText'] ?? null,
                'is_cover' => $isCover,
            ];

            if ($isCover) {
                $coverMedia = $media;
            }
        }

        $event->galleryMediaAssets()->sync($syncPayload);

        if ($coverMedia) {
            $event->forceFill([
                'cover_image' => Storage::disk($coverMedia->disk)->url($coverMedia->path),
            ])->save();
        }
    }
}
