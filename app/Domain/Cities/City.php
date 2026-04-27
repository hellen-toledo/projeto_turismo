<?php

namespace App\Domain\Cities;

use App\Domain\CityAttractions\CityAttraction;
use App\Domain\Events\Event;
use App\Domain\InterestTags\InterestTag;
use App\Domain\MediaAssets\MediaAsset;
use App\Domain\Regions\Region;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'summary',
        'description',
        'cover_image',
        'region_id',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    public function interestTags(): BelongsToMany
    {
        return $this->belongsToMany(InterestTag::class)
            ->withTimestamps();
    }

    public function attractions(): HasMany
    {
        return $this->hasMany(CityAttraction::class)
            ->orderBy('sort_order');
    }

    public function galleryMediaAssets(): BelongsToMany
    {
        return $this->belongsToMany(MediaAsset::class, 'city_media_asset')
            ->withPivot(['sort_order', 'alt_text', 'is_cover'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }
}
