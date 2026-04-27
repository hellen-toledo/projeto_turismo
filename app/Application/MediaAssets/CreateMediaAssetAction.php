<?php

namespace App\Application\MediaAssets;

use App\Domain\MediaAssets\MediaAsset;
use App\Models\User;
use Illuminate\Http\UploadedFile;

class CreateMediaAssetAction
{
    public function __invoke(array $data, ?User $user = null): MediaAsset
    {
        /** @var UploadedFile $file */
        $file = $data['file'];
        $directory = sprintf('tourism/media/%s', now()->format('Y/m'));
        $path = $file->store($directory, 'public');

        return MediaAsset::query()->create([
            'disk' => 'public',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType() ?? $file->getClientMimeType(),
            'size' => $file->getSize(),
            'collection' => $data['collection'] ?? null,
            'alt_text' => $data['altText'] ?? null,
            'created_by' => $user?->id,
        ]);
    }
}
