<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityAttractionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $isAdminRoute = $request->routeIs('api.v1.admin.*');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'imageUrl' => $this->image_url,
            'sortOrder' => $this->sort_order,
            'isPublished' => $this->when($isAdminRoute, $this->is_published),
        ];
    }
}
