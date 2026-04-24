<?php

namespace App\Application\InterestTags;

use App\Domain\InterestTags\InterestTag;

class DeleteInterestTagAction
{
    public function __invoke(InterestTag $interestTag): void
    {
        $interestTag->delete();
    }
}
