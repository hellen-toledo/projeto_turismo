<?php

namespace App\Application\InterestTags;

use App\Domain\InterestTags\InterestTag;
use Illuminate\Support\Str;

class CreateInterestTagAction
{
    public function __invoke(array $data): InterestTag
    {
        return InterestTag::query()->create([
            'name' => $data['name'],
            'slug' => Str::slug($data['slug'] ?? $data['name']),
        ]);
    }
}
