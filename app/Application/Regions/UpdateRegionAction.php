<?php

namespace App\Application\Regions;

use App\Domain\Regions\Region;

class UpdateRegionAction
{
    public function __invoke(Region $region, array $data): Region
    {
        $region->fill($data);
        $region->save();

        return $region->refresh();
    }
}
