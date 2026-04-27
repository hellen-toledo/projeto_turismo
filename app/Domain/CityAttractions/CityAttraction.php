<?php

namespace App\Domain\CityAttractions;

use App\Domain\Cities\City;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CityAttraction extends Model
{
    use HasFactory;

    protected $fillable = [
        'city_id',
        'name',
        'description',
        'image_url',
        'sort_order',
        'is_published',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_published' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }
}
