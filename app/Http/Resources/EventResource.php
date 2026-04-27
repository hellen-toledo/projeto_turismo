<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EventResource extends JsonResource
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
