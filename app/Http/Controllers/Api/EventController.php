<?php

namespace App\Http\Controllers\Api;

use App\Application\Events\FindEventByIdOrSlugAction;
use App\Application\Events\ListEventsAction;
use App\Application\Events\ShowEventAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListEventsRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class EventController extends Controller
{
    public function index(ListEventsRequest $request, ListEventsAction $listEvents): AnonymousResourceCollection
    {
        return EventResource::collection($listEvents($request->validated(), false));
    }

    public function show(string $idOrSlug, FindEventByIdOrSlugAction $findEvent, ShowEventAction $showEvent): EventResource
    {
        return new EventResource($showEvent($findEvent($idOrSlug)));
    }
}
