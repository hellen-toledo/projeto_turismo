<?php

namespace App\Http\Requests;

use App\Domain\Events\Event;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        $event = $this->route('event');

        return $event instanceof Event && (bool) $this->user()?->can('update', $event);
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'startsAt' => ['sometimes', 'date'],
            'endsAt' => ['nullable', 'date', 'after_or_equal:startsAt'],
            'coverImage' => ['nullable', 'url', 'max:2048'],
            'externalUrl' => ['nullable', 'url', 'max:2048'],
            'cityId' => ['sometimes', 'integer', 'exists:cities,id'],
            'isFeatured' => ['sometimes', 'boolean'],
            'isPublished' => ['sometimes', 'boolean'],
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'exists:interest_tags,id'],
        ];
    }
}
