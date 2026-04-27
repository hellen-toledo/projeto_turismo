<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListEventsRequest extends FormRequest
{
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
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
