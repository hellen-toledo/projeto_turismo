<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'description' => $this->description,
            'coverImage' => $this->cover_image,
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
        ];
    }
}
