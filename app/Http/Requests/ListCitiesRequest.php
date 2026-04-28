<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasCommonRequestRules;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;

class ListCitiesRequest extends FormRequest
{
    use HasCommonRequestRules;
    use ProvidesPortugueseValidation;

    protected function prepareForValidation(): void
    {
        $payload = [];

        if ($this->has('published')) {
            $payload['published'] = $this->boolean('published');
        }

        if (! $this->filled('search') && $this->filled('q')) {
            $payload['search'] = $this->string('q')->toString();
        }

        if ($payload !== []) {
            $this->merge($payload);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            ...$this->paginationRules(),
            'q' => ['nullable', 'string', 'max:255'],
            'search' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'region_id' => ['sometimes', 'integer', 'exists:regions,id'],
            'tag' => ['nullable', 'string', 'max:255'],
            'tag_id' => ['sometimes', 'integer', 'exists:interest_tags,id'],
            'published' => ['sometimes', 'boolean'],
        ];
    }
}
