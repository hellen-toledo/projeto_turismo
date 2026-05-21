<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FindEventByIdOrSlugAction
{
    public function __invoke(string $idOrSlug): Event
    {
        $event = Event::query()
            ->where('is_published', true)
            ->where(function ($query) use ($idOrSlug): void {
                $query
                    ->where('slug', $idOrSlug)
                    ->when(is_numeric($idOrSlug), fn ($query) => $query->orWhere('id', (int) $idOrSlug));
            })
            ->first();

        if (! $event) {
            throw (new ModelNotFoundException)->setModel(Event::class, [$idOrSlug]);
        }

        return $event;
    }
}
