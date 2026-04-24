<?php

namespace App\Http\Requests;

use App\Domain\Cities\City;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $city = $this->route('city');

        return $city instanceof City && (bool) $this->user()?->can('update', $city);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['sometimes', 'string'],
            'coverImage' => ['nullable', 'url', 'max:2048'],
            'regionId' => ['sometimes', 'integer', 'exists:regions,id'],
            'isPublished' => ['sometimes', 'boolean'],
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'exists:interest_tags,id'],
        ];
    }
}
