<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $coverImage = $this->cover_image;

        if (! $coverImage && $this->relationLoaded('galleryMediaAssets')) {
            $coverMedia = $this->galleryMediaAssets->first(fn ($media) => (bool) ($media->pivot?->is_cover ?? false));

            if ($coverMedia) {
                $coverImage = Storage::disk($coverMedia->disk)->url($coverMedia->path);
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'coverImage' => $coverImage,
            'isPublished' => $this->is_published,
            'region' => $this->whenLoaded('region', fn () => [
                'id' => $this->region->id,
                'name' => $this->region->name,
            ]),
            'interestTags' => $this->whenLoaded('interestTags', fn () => $this->interestTags->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])->values()),
            'attractions' => $this->whenLoaded('attractions', fn () => CityAttractionResource::collection($this->attractions)),
            'gallery' => $this->whenLoaded('galleryMediaAssets', fn () => MediaGalleryItemResource::collection($this->galleryMediaAssets)),
        ];
    }
}
