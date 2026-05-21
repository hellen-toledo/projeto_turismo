<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $coverImage = $this->cover_image;

        // Use gallery cover only as a fallback when no explicit cover image was saved.
        if (! $coverImage && $this->relationLoaded('galleryMediaAssets')) {
            $coverMedia = $this->galleryMediaAssets->first(fn ($media) => (bool) ($media->pivot?->is_cover ?? false));

            if ($coverMedia) {
                $coverImage = '/storage/'.ltrim($coverMedia->path, '/');
            }
        }

        // Ensure that if cover_image is a relative path, we resolve it
        if ($coverImage && ! str_starts_with($coverImage, 'http') && ! str_starts_with($coverImage, '/')) {
            $coverImage = '/storage/'.ltrim($coverImage, '/');
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
