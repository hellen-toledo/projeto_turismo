<?php

namespace App\Http\Requests;

use App\Domain\Regions\Region;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRegionRequest extends FormRequest
{
    use ProvidesPortugueseValidation;

    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', Region::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('regions', 'name')],
        ];
    }
}
