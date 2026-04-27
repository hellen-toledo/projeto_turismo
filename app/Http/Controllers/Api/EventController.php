<?php

namespace App\Http\Controllers\Api;

use App\Application\Events\CreateEventAction;
use App\Application\Events\DeleteEventAction;
use App\Application\Events\FindEventByIdOrSlugAction;
use App\Application\Events\ListEventsAction;
use App\Application\Events\ShowEventAction;
use App\Application\Events\UpdateEventAction;
use App\Domain\Events\Event;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListEventsRequest;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class EventController extends Controller
{
    public function index(ListEventsRequest $request, ListEventsAction $listEvents): AnonymousResourceCollection
    {
        return EventResource::collection($listEvents($request->validated(), false));
    }

    public function store(StoreEventRequest $request, CreateEventAction $createEvent): Response
    {
        $event = $createEvent($request->validated());

        return (new EventResource($event))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $idOrSlug, FindEventByIdOrSlugAction $findEvent, ShowEventAction $showEvent): EventResource
    {
        return new EventResource($showEvent($findEvent($idOrSlug)));
    }

    public function update(UpdateEventRequest $request, Event $event, UpdateEventAction $updateEvent): EventResource
    {
        return new EventResource($updateEvent($event, $request->validated()));
    }

    public function destroy(Event $event, DeleteEventAction $deleteEvent): Response
    {
        $deleteEvent($event);

        return response()->noContent();
    }
}
