<?php

namespace App\Application\Events;

use App\Domain\Events\Event;

class DeleteEventAction
{
    public function __invoke(Event $event): void
    {
        $event->delete();
    }
}
