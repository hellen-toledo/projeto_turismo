<?php

namespace App\Domain\Events;

use App\Domain\Cities\City;
use App\Domain\InterestTags\InterestTag;
use App\Domain\MediaAssets\MediaAsset;
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

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function interestTags(): BelongsToMany
    {
        return $this->belongsToMany(InterestTag::class)
            ->withTimestamps();
    }

    public function galleryMediaAssets(): BelongsToMany
    {
        return $this->belongsToMany(MediaAsset::class, 'event_media_asset')
            ->withPivot(['sort_order', 'alt_text', 'is_cover'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }
}
