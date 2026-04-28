<?php

namespace App\Http\Requests;

use App\Domain\InterestTags\InterestTag;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInterestTagRequest extends FormRequest
{
    use ProvidesPortugueseValidation;

    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', InterestTag::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:interest_tags,name'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('interest_tags', 'slug')],
        ];
    }
}
