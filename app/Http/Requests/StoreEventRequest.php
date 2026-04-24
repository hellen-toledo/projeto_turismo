<?php

namespace App\Http\Requests;

use App\Domain\Events\Event;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', Event::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'startsAt' => ['required', 'date'],
            'endsAt' => ['nullable', 'date', 'after_or_equal:startsAt'],
            'coverImage' => ['nullable', 'url', 'max:2048'],
            'externalUrl' => ['nullable', 'url', 'max:2048'],
            'cityId' => ['required', 'integer', 'exists:cities,id'],
            'isFeatured' => ['sometimes', 'boolean'],
            'isPublished' => ['sometimes', 'boolean'],
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'exists:interest_tags,id'],
        ];
    }
}
