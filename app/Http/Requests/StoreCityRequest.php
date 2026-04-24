<?php

namespace App\Http\Requests;

use App\Domain\Cities\City;
use Illuminate\Foundation\Http\FormRequest;

class StoreCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', City::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'coverImage' => ['nullable', 'url', 'max:2048'],
            'regionId' => ['required', 'integer', 'exists:regions,id'],
            'isPublished' => ['sometimes', 'boolean'],
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'exists:interest_tags,id'],
        ];
    }
}
