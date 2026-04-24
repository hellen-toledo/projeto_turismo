<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListEventsRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $booleanFields = [];

        foreach (['future', 'featured', 'published'] as $field) {
            if ($this->has($field)) {
                $booleanFields[$field] = $this->boolean($field);
            }
        }

        if ($booleanFields !== []) {
            $this->merge($booleanFields);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city' => ['nullable', 'string', 'max:255'],
            'future' => ['sometimes', 'boolean'],
            'featured' => ['sometimes', 'boolean'],
            'published' => ['sometimes', 'boolean'],
        ];
    }
}
