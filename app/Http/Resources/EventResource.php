<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'startsAt' => $this->starts_at?->toAtomString(),
            'endsAt' => $this->ends_at?->toAtomString(),
            'coverImage' => $coverImage,
            'externalUrl' => $this->external_url,
            'isFeatured' => $this->is_featured,
            'isPublished' => $this->is_published,
            'city' => $this->whenLoaded('city', fn () => [
                'id' => $this->city->id,
                'name' => $this->city->name,
                'slug' => $this->city->slug,
            ]),
            'interestTags' => $this->whenLoaded('interestTags', fn () => $this->interestTags->map(fn ($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ])->values()),
            'gallery' => $this->whenLoaded('galleryMediaAssets', fn () => MediaGalleryItemResource::collection($this->galleryMediaAssets)),
        ];
    }
}
