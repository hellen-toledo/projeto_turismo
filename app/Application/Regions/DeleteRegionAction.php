<?php

namespace App\Application\Regions;

use App\Domain\Regions\Region;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class DeleteRegionAction
{
    public function __invoke(Region $region): void
    {
        if ($region->cities()->exists()) {
            throw new ConflictHttpException('Region has linked cities and cannot be deleted.');
        }

        $region->delete();
    }
}
