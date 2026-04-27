<?php

namespace App\Application\MediaAssets;

use App\Domain\MediaAssets\MediaAsset;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DeleteMediaAssetAction
{
    public function __invoke(MediaAsset $mediaAsset): void
    {
        if ($mediaAsset->cities()->exists() || $mediaAsset->events()->exists()) {
            throw new ConflictHttpException('Media asset is linked to content and cannot be deleted.');
        }

        if (filled($mediaAsset->path) && Storage::disk($mediaAsset->disk)->exists($mediaAsset->path)) {
            Storage::disk($mediaAsset->disk)->delete($mediaAsset->path);
        }

        $mediaAsset->delete();
    }
}
