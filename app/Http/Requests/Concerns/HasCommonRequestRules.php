<?php

namespace App\Http\Requests\Concerns;

use App\Domain\MediaAssets\MediaAsset;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

trait HasCommonRequestRules
{
    protected function paginationRules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }

    protected function interestTagRules(): array
    {
        return [
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'distinct', 'exists:interest_tags,id'],
        ];
    }

    protected function galleryRules(): array
    {
        return [
            'gallery' => ['sometimes', 'array'],
            'gallery.*.mediaAssetId' => ['required', 'integer', 'distinct', 'exists:media_assets,id'],
            'gallery.*.sortOrder' => ['sometimes', 'integer', 'min:0'],
            'gallery.*.altText' => ['nullable', 'string', 'max:255'],
            'gallery.*.isCover' => ['sometimes', 'boolean'],
        ];
    }

    protected function coverImageRules(): array
    {
        return [
            'nullable',
            'string',
            'max:2048',
            function (string $attribute, mixed $value, \Closure $fail): void {
                if (! is_string($value) || $value === '') {
                    return;
                }

                if (filter_var($value, FILTER_VALIDATE_URL) || str_starts_with($value, '/storage/tourism/media/')) {
                    return;
                }

                $fail('O campo imagem de capa deve ser uma URL válida.');
            },
        ];
    }

    protected function mediaCollectionRules(): array
    {
        return [
            'collection' => ['nullable', 'string', Rule::in(MediaAsset::collections())],
        ];
    }

    protected function validateSingleCoverImage(Validator $validator): void
    {
        $gallery = $this->input('gallery', []);

        if (! is_array($gallery)) {
            return;
        }

        $coverCount = collect($gallery)
            ->filter(fn ($item) => is_array($item) && ($item['isCover'] ?? false))
            ->count();

        if ($coverCount > 1) {
            $validator->errors()->add('gallery', 'A galeria pode ter apenas uma imagem marcada como capa.');
        }
    }
}
