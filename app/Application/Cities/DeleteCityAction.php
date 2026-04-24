<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;

class DeleteCityAction
{
    public function __invoke(City $city): void
    {
        $city->delete();
    }
}
