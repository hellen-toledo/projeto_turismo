<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaGalleryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isAdminRoute = $request->routeIs('api.v1.admin.*');

        return [
            'id' => $this->id,
            'url' => Storage::disk($this->disk)->url($this->path),
            'altText' => $this->pivot?->alt_text ?? $this->alt_text,
            'sortOrder' => $this->pivot?->sort_order,
            'isCover' => (bool) ($this->pivot?->is_cover ?? false),
            'path' => $this->when($isAdminRoute, $this->path),
            'originalName' => $this->when($isAdminRoute, $this->original_name),
            'mimeType' => $this->when($isAdminRoute, $this->mime_type),
            'size' => $this->when($isAdminRoute, $this->size),
            'collection' => $this->when($isAdminRoute, $this->collection),
        ];
    }
}
