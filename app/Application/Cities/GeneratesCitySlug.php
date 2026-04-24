<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Illuminate\Support\Str;

class GeneratesCitySlug
{
    public function __invoke(string $name, ?string $slug = null, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug ?: $name);
        $candidate = $baseSlug;
        $suffix = 2;

        while (
            City::query()
                ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $candidate;
    }
}
