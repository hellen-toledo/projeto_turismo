<?php

namespace App\Http\Requests;

use App\Domain\MediaAssets\MediaAsset;
use App\Http\Requests\Concerns\HasCommonRequestRules;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;

class StoreMediaAssetRequest extends FormRequest
{
    use HasCommonRequestRules;
    use ProvidesPortugueseValidation;

    private const MAX_IMAGE_SIZE_KILOBYTES = 15 * 1024;

    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', MediaAsset::class);
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.self::MAX_IMAGE_SIZE_KILOBYTES],
            ...$this->mediaCollectionRules(),
            'altText' => ['nullable', 'string', 'max:255'],
        ];
    }
}
