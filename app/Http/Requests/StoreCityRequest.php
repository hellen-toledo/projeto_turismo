<?php

namespace App\Http\Requests;

use App\Domain\Cities\City;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', City::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'coverImage' => ['nullable', 'url', 'max:2048'],
            'regionId' => ['required', 'integer', 'exists:regions,id'],
            'isPublished' => ['sometimes', 'boolean'],
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'exists:interest_tags,id'],
            'attractions' => ['sometimes', 'array'],
            'attractions.*.name' => ['required', 'string', 'max:255'],
            'attractions.*.description' => ['nullable', 'string'],
            'attractions.*.imageUrl' => ['nullable', 'url', 'max:2048'],
            'attractions.*.sortOrder' => ['sometimes', 'integer', 'min:0'],
            'attractions.*.isPublished' => ['sometimes', 'boolean'],
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
