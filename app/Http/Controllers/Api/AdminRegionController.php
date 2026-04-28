<?php

namespace App\Http\Controllers\Api;

use App\Application\Regions\CreateRegionAction;
use App\Application\Regions\DeleteRegionAction;
use App\Application\Regions\ListRegionsAction;
use App\Application\Regions\UpdateRegionAction;
use App\Domain\Regions\Region;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRegionRequest;
use App\Http\Requests\UpdateRegionRequest;
use App\Http\Resources\RegionResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class AdminRegionController extends Controller
{
    public function index(ListRegionsAction $listRegions): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Region::class);

        return RegionResource::collection($listRegions());
    }

    public function store(StoreRegionRequest $request, CreateRegionAction $createRegion): Response
    {
        $this->authorize('create', Region::class);

        return (new RegionResource($createRegion($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateRegionRequest $request, Region $region, UpdateRegionAction $updateRegion): RegionResource
    {
        $this->authorize('update', $region);

        return new RegionResource($updateRegion($region, $request->validated()));
    }

    public function destroy(Region $region, DeleteRegionAction $deleteRegion): Response
    {
        $this->authorize('delete', $region);

        $deleteRegion($region);

        return response()->noContent();
    }
}
