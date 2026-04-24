<?php

namespace App\Http\Requests;

use App\Domain\Regions\Region;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRegionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $region = $this->route('region');

        return $region instanceof Region && (bool) $this->user()?->can('update', $region);
    }

    public function rules(): array
    {
        $regionId = $this->route('region')?->id;

        return [
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('regions', 'name')->ignore($regionId)],
        ];
    }
}
