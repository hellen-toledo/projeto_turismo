<?php

namespace App\Http\Requests;

use App\Domain\Regions\Region;
use Illuminate\Foundation\Http\FormRequest;

class StoreRegionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('create', Region::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:regions,name'],
        ];
    }
}
