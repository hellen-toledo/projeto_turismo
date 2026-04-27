<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListCitiesRequest extends FormRequest
{
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
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
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
