<?php

namespace App\Http\Controllers\Api;

use App\Application\Cities\CreateCityAction;
use App\Application\Cities\DeleteCityAction;
use App\Application\Cities\FindCityByIdOrSlugAction;
use App\Application\Cities\ListCitiesAction;
use App\Application\Cities\ShowCityAction;
use App\Application\Cities\UpdateCityAction;
use App\Domain\Cities\City;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListCitiesRequest;
use App\Http\Requests\StoreCityRequest;
use App\Http\Requests\UpdateCityRequest;
use App\Http\Resources\CityResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class CityController extends Controller
{
    public function index(ListCitiesRequest $request, ListCitiesAction $listCities): AnonymousResourceCollection
    {
        return CityResource::collection($listCities($request->validated(), false));
    }

    public function store(StoreCityRequest $request, CreateCityAction $createCity): Response
    {
        $city = $createCity($request->validated());

        return (new CityResource($city))
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $idOrSlug, FindCityByIdOrSlugAction $findCity, ShowCityAction $showCity): CityResource
    {
        return new CityResource($showCity($findCity($idOrSlug)));
    }

    public function update(UpdateCityRequest $request, City $city, UpdateCityAction $updateCity): CityResource
    {
        return new CityResource($updateCity($city, $request->validated()));
    }

    public function destroy(City $city, DeleteCityAction $deleteCity): Response
    {
        $deleteCity($city);

        return response()->noContent();
    }
}
