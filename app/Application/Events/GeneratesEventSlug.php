<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use Illuminate\Support\Str;

class GeneratesEventSlug
{
    public function __invoke(string $title, ?string $slug = null, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($slug ?: $title);
        $candidate = $baseSlug;
        $suffix = 2;

        while (
            Event::query()
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
