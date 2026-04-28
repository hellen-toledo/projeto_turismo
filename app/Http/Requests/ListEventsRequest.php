<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasCommonRequestRules;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;

class ListEventsRequest extends FormRequest
{
    use HasCommonRequestRules;
    use ProvidesPortugueseValidation;

    protected function prepareForValidation(): void
    {
        $payload = [];

        foreach (['future', 'featured', 'published'] as $field) {
            if ($this->has($field)) {
                $payload[$field] = $this->boolean($field);
            }
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
            'city' => ['nullable', 'string', 'max:255'],
            'city_id' => ['sometimes', 'integer', 'exists:cities,id'],
            'tag' => ['nullable', 'string', 'max:255'],
            'tag_id' => ['sometimes', 'integer', 'exists:interest_tags,id'],
            'future' => ['sometimes', 'boolean'],
            'featured' => ['sometimes', 'boolean'],
            'published' => ['sometimes', 'boolean'],
        ];
    }
}
