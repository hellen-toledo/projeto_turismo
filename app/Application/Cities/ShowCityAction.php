<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;

class ShowCityAction
{
    public function __invoke(City $city): City
    {
        return $city->load(['region', 'interestTags']);
    }
}
