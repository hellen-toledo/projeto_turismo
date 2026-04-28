<?php

namespace App\Http\Requests;

use App\Domain\Cities\City;
use App\Http\Requests\Concerns\HasCommonRequestRules;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreCityRequest extends FormRequest
{
    use HasCommonRequestRules;
    use ProvidesPortugueseValidation;

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
            ...$this->interestTagRules(),
            'attractions' => ['sometimes', 'array'],
            'attractions.*.name' => ['required', 'string', 'max:255'],
            'attractions.*.description' => ['nullable', 'string'],
            'attractions.*.imageUrl' => ['nullable', 'url', 'max:2048'],
            'attractions.*.sortOrder' => ['sometimes', 'integer', 'min:0'],
            'attractions.*.isPublished' => ['sometimes', 'boolean'],
            ...$this->galleryRules(),
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(fn (Validator $validator) => $this->validateSingleCoverImage($validator));
    }
}
