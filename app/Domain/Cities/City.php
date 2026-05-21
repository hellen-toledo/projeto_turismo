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

    /**
     * Set the cover image.
     * If it's a local storage URL, store only the path.
     */
    public function setCoverImageAttribute(?string $value): void
    {
        if (empty($value)) {
            $this->attributes['cover_image'] = null;

            return;
        }

        $path = parse_url($value, PHP_URL_PATH);

        if (is_string($path) && str_starts_with($path, '/storage/')) {
            $this->attributes['cover_image'] = ltrim(substr($path, 9), '/');

            return;
        }

        // If it's a full URL, check if it's a local storage URL
        if (str_starts_with($value, 'http')) {
            $storageUrl = config('filesystems.disks.public.url');
            if ($storageUrl && str_starts_with($value, $storageUrl)) {
                $this->attributes['cover_image'] = ltrim(substr($value, strlen($storageUrl)), '/');

                return;
            }
        }

        // If it's a relative URL starting with /storage
        if (str_starts_with($value, '/storage/')) {
            $this->attributes['cover_image'] = substr($value, 9);

            return;
        }

        $this->attributes['cover_image'] = $value;
    }

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
