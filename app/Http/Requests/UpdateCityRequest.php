<?php

namespace App\Http\Requests;

use App\Domain\Cities\City;
use App\Http\Requests\Concerns\HasCommonRequestRules;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateCityRequest extends FormRequest
{
    use HasCommonRequestRules;
    use ProvidesPortugueseValidation;

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
            'coverImage' => $this->coverImageRules(),
            'regionId' => ['sometimes', 'integer', 'exists:regions,id'],
            'isPublished' => ['sometimes', 'boolean'],
            ...$this->interestTagRules(),
            'attractions' => ['sometimes', 'array'],
            'attractions.*.id' => ['sometimes', 'integer'],
            'attractions.*.name' => ['required', 'string', 'max:255'],
            'attractions.*.description' => ['nullable', 'string'],
            'attractions.*.imageUrl' => ['nullable', 'url', 'max:2048'],
            'attractions.*.sortOrder' => ['sometimes', 'integer', 'min:0'],
            'attractions.*.isPublished' => ['sometimes', 'boolean'],
            ...$this->galleryRules(),
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $attractions = $this->input('attractions', []);

            $this->validateSingleCoverImage($validator);

            if (! is_array($attractions)) {
                return;
            }

            $invalidAttractionIds = collect($attractions)
                ->pluck('id')
                ->filter()
                ->reject(fn ($id) => $this->route('city')?->attractions()->whereKey($id)->exists())
                ->values();

            foreach ($invalidAttractionIds as $index => $id) {
                $validator->errors()->add("attractions.{$index}.id", "A atração selecionada ({$id}) não pertence a esta cidade.");
            }
        });
    }
}
