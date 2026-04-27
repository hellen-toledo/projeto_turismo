<?php

namespace App\Http\Controllers\Api;

use App\Application\MediaAssets\CreateMediaAssetAction;
use App\Application\MediaAssets\DeleteMediaAssetAction;
use App\Application\MediaAssets\ListMediaAssetsAction;
use App\Domain\MediaAssets\MediaAsset;
use App\Http\Controllers\Controller;
use App\Http\Requests\ListMediaAssetsRequest;
use App\Http\Requests\StoreMediaAssetRequest;
use App\Http\Resources\MediaAssetResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class AdminMediaController extends Controller
{
    public function index(ListMediaAssetsRequest $request, ListMediaAssetsAction $listMediaAssets): AnonymousResourceCollection
    {
        $this->authorize('viewAny', MediaAsset::class);

        return MediaAssetResource::collection($listMediaAssets($request->validated()));
    }

    public function store(StoreMediaAssetRequest $request, CreateMediaAssetAction $createMediaAsset): Response
    {
        $this->authorize('create', MediaAsset::class);

        return (new MediaAssetResource($createMediaAsset($request->validated(), $request->user())))
            ->response()
            ->setStatusCode(201);
    }

    public function destroy(MediaAsset $media, DeleteMediaAssetAction $deleteMediaAsset): Response
    {
        $this->authorize('delete', $media);

        $deleteMediaAsset($media);

        return response()->noContent();
    }
}
