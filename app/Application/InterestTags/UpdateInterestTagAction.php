<?php

namespace App\Application\InterestTags;

use App\Domain\InterestTags\InterestTag;
use Illuminate\Support\Str;

class UpdateInterestTagAction
{
    public function __invoke(InterestTag $interestTag, array $data): InterestTag
    {
        $interestTag->fill([
            'name' => $data['name'] ?? $interestTag->name,
            'slug' => Str::slug($data['slug'] ?? ($data['name'] ?? $interestTag->name)),
        ]);
        $interestTag->save();

        return $interestTag->refresh();
    }
}
