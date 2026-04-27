<?php

namespace App\Application\Events;

use App\Domain\Events\Event;
use Illuminate\Support\Facades\DB;

class UpdateEventAction
{
    public function __construct(
        private readonly GeneratesEventSlug $generateSlug,
        private readonly SyncEventGalleryAction $syncEventGallery,
    ) {}

    public function __invoke(Event $event, array $data): Event
    {
        return DB::transaction(function () use ($event, $data): Event {
            $tagIds = $data['interestTagIds'] ?? null;

            if (array_key_exists('title', $data) || array_key_exists('slug', $data)) {
                $event->slug = ($this->generateSlug)(
                    $data['title'] ?? $event->title,
                    $data['slug'] ?? null,
                    $event->id,
                );
            }

            $event->fill([
                'title' => $data['title'] ?? $event->title,
                'description' => $data['description'] ?? $event->description,
                'starts_at' => $data['startsAt'] ?? $event->starts_at,
                'ends_at' => array_key_exists('endsAt', $data) ? $data['endsAt'] : $event->ends_at,
                'cover_image' => array_key_exists('coverImage', $data) ? $data['coverImage'] : $event->cover_image,
                'external_url' => array_key_exists('externalUrl', $data) ? $data['externalUrl'] : $event->external_url,
                'city_id' => $data['cityId'] ?? $event->city_id,
                'is_featured' => $data['isFeatured'] ?? $event->is_featured,
                'is_published' => $data['isPublished'] ?? $event->is_published,
            ]);
            $event->save();

            if (is_array($tagIds)) {
                $event->interestTags()->sync($tagIds);
            }

            if (array_key_exists('gallery', $data)) {
                ($this->syncEventGallery)($event, $data['gallery'] ?? []);
            }

            return $event->load(['city.region', 'interestTags', 'galleryMediaAssets']);
        });
    }
}
