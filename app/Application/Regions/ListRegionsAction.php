<?php

namespace App\Application\Regions;

use App\Domain\Regions\Region;
use Illuminate\Database\Eloquent\Collection;

class ListRegionsAction
{
    public function __invoke(): Collection
    {
        return Region::query()
            ->withCount('cities')
            ->orderBy('name')
            ->get();
    }
}
