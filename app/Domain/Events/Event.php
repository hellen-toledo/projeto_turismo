<?php

namespace App\Domain\Events;

use App\Domain\Cities\City;
use App\Domain\InterestTags\InterestTag;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'starts_at',
        'ends_at',
        'cover_image',
        'external_url',
        'city_id',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function interestTags(): BelongsToMany
    {
        return $this->belongsToMany(InterestTag::class)
            ->withTimestamps();
    }
}
