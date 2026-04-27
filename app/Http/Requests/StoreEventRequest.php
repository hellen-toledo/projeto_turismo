<?php

namespace App\Http\Requests;

use App\Domain\Events\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

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
            'gallery' => ['sometimes', 'array'],
            'gallery.*.mediaAssetId' => ['required', 'integer', 'distinct', 'exists:media_assets,id'],
            'gallery.*.sortOrder' => ['sometimes', 'integer', 'min:0'],
            'gallery.*.altText' => ['nullable', 'string', 'max:255'],
            'gallery.*.isCover' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $gallery = $this->input('gallery', []);

            if (! is_array($gallery)) {
                return;
            }

            $coverCount = collect($gallery)
                ->filter(fn ($item) => is_array($item) && ($item['isCover'] ?? false))
                ->count();

            if ($coverCount > 1) {
                $validator->errors()->add('gallery', 'Only one gallery image can be the cover.');
            }
        });
    }
}
