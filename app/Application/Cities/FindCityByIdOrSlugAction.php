<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class FindCityByIdOrSlugAction
{
    public function __invoke(string $idOrSlug): City
    {
        $city = City::query()
            ->where('slug', $idOrSlug)
            ->when(is_numeric($idOrSlug), fn ($query) => $query->orWhere('id', (int) $idOrSlug))
            ->first();

        if (! $city) {
            throw (new ModelNotFoundException)->setModel(City::class, [$idOrSlug]);
        }

        return $city;
    }
}
