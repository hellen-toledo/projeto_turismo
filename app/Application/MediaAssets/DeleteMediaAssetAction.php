<?php

namespace App\Application\MediaAssets;

use App\Domain\MediaAssets\MediaAsset;
use Illuminate\Support\Facades\Storage;

class DeleteMediaAssetAction
{
    public function __invoke(MediaAsset $mediaAsset): void
    {
        if (filled($mediaAsset->path) && Storage::disk($mediaAsset->disk)->exists($mediaAsset->path)) {
            Storage::disk($mediaAsset->disk)->delete($mediaAsset->path);
        }

        $mediaAsset->delete();
    }
}
