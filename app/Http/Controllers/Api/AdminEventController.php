<?php

namespace App\Http\Controllers\Api;

use App\Application\Events\CreateEventAction;
use App\Application\Events\DeleteEventAction;
use App\Application\Events\ListEventsAction;
use App\Application\Events\UpdateEventAction;
use App\Domain\Events\Event;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListEventsRequest;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class AdminEventController extends Controller
{
    public function index(ListEventsRequest $request, ListEventsAction $listEvents): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Event::class);

        return EventResource::collection($listEvents($request->validated()));
    }

    public function store(StoreEventRequest $request, CreateEventAction $createEvent): Response
    {
        $this->authorize('create', Event::class);

        return (new EventResource($createEvent($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateEventRequest $request, Event $event, UpdateEventAction $updateEvent): EventResource
    {
        return new EventResource($updateEvent($event, $request->validated()));
    }

    public function destroy(Event $event, DeleteEventAction $deleteEvent): Response
    {
        $this->authorize('delete', $event);

        $deleteEvent($event);

        return response()->noContent();
    }
}
