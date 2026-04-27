<?php

namespace App\Http\Requests;

use App\Domain\MediaAssets\MediaAsset;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListMediaAssetsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'collection' => ['nullable', 'string', Rule::in(MediaAsset::collections())],
        ];
    }
}
