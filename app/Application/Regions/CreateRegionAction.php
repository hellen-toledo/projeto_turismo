<?php

namespace App\Application\Regions;

use App\Domain\Regions\Region;

class CreateRegionAction
{
    public function __invoke(array $data): Region
    {
        return Region::query()->create($data);
    }
}
