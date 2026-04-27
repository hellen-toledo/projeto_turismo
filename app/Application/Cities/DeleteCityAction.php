<?php

namespace App\Application\Cities;

use App\Domain\Cities\City;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DeleteCityAction
{
    public function __invoke(City $city): void
    {
        if ($city->events()->exists()) {
            throw new ConflictHttpException('City has linked events and cannot be deleted.');
        }

        $city->delete();
    }
}
