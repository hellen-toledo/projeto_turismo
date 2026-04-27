<?php

namespace App\Http\Controllers\Api;

use App\Application\Cities\FindCityByIdOrSlugAction;
use App\Application\Cities\ListCitiesAction;
use App\Application\Cities\ShowCityAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListCitiesRequest;
use App\Http\Resources\CityResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CityController extends Controller
{
    public function index(ListCitiesRequest $request, ListCitiesAction $listCities): AnonymousResourceCollection
    {
        return CityResource::collection($listCities($request->validated(), false));
    }

    public function show(string $idOrSlug, FindCityByIdOrSlugAction $findCity, ShowCityAction $showCity): CityResource
    {
        return new CityResource($showCity($findCity($idOrSlug)));
    }
}
