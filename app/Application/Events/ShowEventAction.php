<?php

namespace App\Application\Events;

use App\Domain\Events\Event;

class ShowEventAction
{
    public function __invoke(Event $event): Event
    {
        return $event->load(['city.region', 'interestTags']);
    }
}
