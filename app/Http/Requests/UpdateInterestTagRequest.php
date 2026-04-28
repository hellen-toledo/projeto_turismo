<?php

namespace App\Http\Requests;

use App\Domain\InterestTags\InterestTag;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInterestTagRequest extends FormRequest
{
    use ProvidesPortugueseValidation;

    public function authorize(): bool
    {
        $interestTag = $this->route('interestTag');

        return $interestTag instanceof InterestTag && (bool) $this->user()?->can('update', $interestTag);
    }

    public function rules(): array
    {
        $interestTagId = $this->route('interestTag')?->id;

        return [
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('interest_tags', 'name')->ignore($interestTagId)],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('interest_tags', 'slug')->ignore($interestTagId)],
        ];
    }
}
