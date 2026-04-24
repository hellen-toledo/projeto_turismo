<?php

namespace App\Http\Controllers\Api;

use App\Application\Regions\ListRegionsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\RegionResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RegionController extends Controller
{
    public function index(ListRegionsAction $listRegions): AnonymousResourceCollection
    {
        return RegionResource::collection($listRegions());
    }
}
