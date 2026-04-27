<?php

namespace App\Http\Requests;

use App\Domain\Cities\City;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCityRequest extends FormRequest
{
    public function authorize(): bool
    {
        $city = $this->route('city');

        return $city instanceof City && (bool) $this->user()?->can('update', $city);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:500'],
            'description' => ['sometimes', 'string'],
            'coverImage' => ['nullable', 'url', 'max:2048'],
            'regionId' => ['sometimes', 'integer', 'exists:regions,id'],
            'isPublished' => ['sometimes', 'boolean'],
            'interestTagIds' => ['sometimes', 'array'],
            'interestTagIds.*' => ['integer', 'exists:interest_tags,id'],
            'attractions' => ['sometimes', 'array'],
            'attractions.*.id' => ['sometimes', 'integer'],
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
            $attractions = $this->input('attractions', []);

            if (is_array($gallery)) {
                $coverCount = collect($gallery)
                    ->filter(fn ($item) => is_array($item) && ($item['isCover'] ?? false))
                    ->count();

                if ($coverCount > 1) {
                    $validator->errors()->add('gallery', 'Only one gallery image can be the cover.');
                }
            }

            if (! is_array($attractions)) {
                return;
            }

            $invalidAttractionIds = collect($attractions)
                ->pluck('id')
                ->filter()
                ->reject(fn ($id) => $this->route('city')?->attractions()->whereKey($id)->exists())
                ->values();

            foreach ($invalidAttractionIds as $index => $id) {
                $validator->errors()->add("attractions.{$index}.id", "The selected attraction id {$id} is invalid for this city.");
            }
        });
    }
}
