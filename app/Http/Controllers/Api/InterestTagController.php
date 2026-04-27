<?php

namespace App\Http\Controllers\Api;

use App\Application\InterestTags\ListInterestTagsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\InterestTagResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InterestTagController extends Controller
{
    public function index(ListInterestTagsAction $listInterestTags): AnonymousResourceCollection
    {
        return InterestTagResource::collection($listInterestTags());
    }
}
