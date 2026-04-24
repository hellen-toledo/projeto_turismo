<?php

namespace App\Application\Regions;

use App\Domain\Regions\Region;

class DeleteRegionAction
{
    public function __invoke(Region $region): void
    {
        $region->delete();
    }
}
