<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\HasCommonRequestRules;
use App\Http\Requests\Concerns\ProvidesPortugueseValidation;
use Illuminate\Foundation\Http\FormRequest;

class ListMediaAssetsRequest extends FormRequest
{
    use HasCommonRequestRules;
    use ProvidesPortugueseValidation;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            ...$this->paginationRules(),
            ...$this->mediaCollectionRules(),
        ];
    }
}
