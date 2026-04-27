<?php

namespace App\Http\Requests;

use App\Domain\MediaAssets\MediaAsset;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMediaAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', MediaAsset::class);
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'collection' => ['nullable', 'string', Rule::in(MediaAsset::collections())],
            'altText' => ['nullable', 'string', 'max:255'],
        ];
    }
}
