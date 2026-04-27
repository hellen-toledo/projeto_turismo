<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use Illuminate\Support\Facades\DB;

class CreateEventAction
{
    public function __construct(
        private readonly GeneratesEventSlug $generateSlug,
        private readonly SyncEventGalleryAction $syncEventGallery,
    ) {}

    public function __invoke(array $data): Event
    {
        return DB::transaction(function () use ($data): Event {
            $tagIds = $data['interestTagIds'] ?? [];

            $event = Event::query()->create([
                'title' => $data['title'],
                'slug' => ($this->generateSlug)($data['title'], $data['slug'] ?? null),
                'description' => $data['description'],
                'starts_at' => $data['startsAt'],
                'ends_at' => $data['endsAt'] ?? null,
                'cover_image' => $data['coverImage'] ?? null,
                'external_url' => $data['externalUrl'] ?? null,
                'city_id' => $data['cityId'],
                'is_featured' => $data['isFeatured'] ?? false,
                'is_published' => $data['isPublished'] ?? true,
            ]);

            if ($tagIds !== []) {
                $event->interestTags()->sync($tagIds);
            }

            if (array_key_exists('gallery', $data)) {
                ($this->syncEventGallery)($event, $data['gallery'] ?? []);
            }

            return $event->load(['city.region', 'interestTags', 'galleryMediaAssets']);
        });
    }
}
