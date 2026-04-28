<?php

namespace App\Http\Controllers\Api;

use App\Application\Cities\CreateCityAction;
use App\Application\Cities\DeleteCityAction;
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

class AdminCityController extends Controller
{
    public function index(ListCitiesRequest $request, ListCitiesAction $listCities): AnonymousResourceCollection
    {
        $this->authorize('viewAny', City::class);

        return CityResource::collection($listCities($request->validated(), true));
    }

    public function show(City $city, ShowCityAction $showCity): CityResource
    {
        $this->authorize('view', $city);

        $city->load([
            'region',
            'interestTags',
            'attractions',
            'galleryMediaAssets' => fn ($query) => $query->orderBy('city_media_asset.sort_order'),
        ]);

        return new CityResource($city);
    }

    public function store(StoreCityRequest $request, CreateCityAction $createCity): Response
    {
        $this->authorize('create', City::class);

        return (new CityResource($createCity($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCityRequest $request, City $city, UpdateCityAction $updateCity): CityResource
    {
        $this->authorize('update', $city);

        return new CityResource($updateCity($city, $request->validated()));
    }

    public function destroy(City $city, DeleteCityAction $deleteCity): Response
    {
        $this->authorize('delete', $city);

        $deleteCity($city);

        return response()->noContent();
    }
}
