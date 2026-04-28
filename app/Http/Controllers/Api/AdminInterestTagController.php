<?php

namespace App\Http\Controllers\Api;

use App\Application\InterestTags\CreateInterestTagAction;
use App\Application\InterestTags\DeleteInterestTagAction;
use App\Application\InterestTags\ListInterestTagsAction;
use App\Application\InterestTags\UpdateInterestTagAction;
use App\Domain\InterestTags\InterestTag;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInterestTagRequest;
use App\Http\Requests\UpdateInterestTagRequest;
use App\Http\Resources\InterestTagResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class AdminInterestTagController extends Controller
{
    public function index(ListInterestTagsAction $listInterestTags): AnonymousResourceCollection
    {
        $this->authorize('viewAny', InterestTag::class);

        return InterestTagResource::collection($listInterestTags());
    }

    public function store(StoreInterestTagRequest $request, CreateInterestTagAction $createInterestTag): Response
    {
        $this->authorize('create', InterestTag::class);

        return (new InterestTagResource($createInterestTag($request->validated())))
            ->response()
            ->setStatusCode(201);
    }

    public function update(
        UpdateInterestTagRequest $request,
        InterestTag $interestTag,
        UpdateInterestTagAction $updateInterestTag
    ): InterestTagResource {
        $this->authorize('update', $interestTag);

        return new InterestTagResource($updateInterestTag($interestTag, $request->validated()));
    }

    public function destroy(InterestTag $interestTag, DeleteInterestTagAction $deleteInterestTag): Response
    {
        $this->authorize('delete', $interestTag);

        $deleteInterestTag($interestTag);

        return response()->noContent();
    }
}
