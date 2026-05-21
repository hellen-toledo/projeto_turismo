<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaAssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => '/storage/'.ltrim($this->path, '/'),
            'path' => $this->path,
            'originalName' => $this->original_name,
            'mimeType' => $this->mime_type,
            'size' => $this->size,
            'collection' => $this->collection,
            'altText' => $this->alt_text,
            'createdAt' => $this->created_at?->toAtomString(),
        ];
    }
}
