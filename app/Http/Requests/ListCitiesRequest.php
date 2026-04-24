<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListCitiesRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('published')) {
            $this->merge([
                'published' => $this->boolean('published'),
            ]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'region' => ['nullable', 'string', 'max:255'],
            'published' => ['sometimes', 'boolean'],
        ];
    }
}
