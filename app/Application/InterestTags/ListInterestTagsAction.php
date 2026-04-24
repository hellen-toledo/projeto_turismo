<?php

namespace App\Application\InterestTags;

use App\Domain\InterestTags\InterestTag;
use Illuminate\Database\Eloquent\Collection;

class ListInterestTagsAction
{
    public function __invoke(): Collection
    {
        return InterestTag::query()->orderBy('name')->get();
    }
}
