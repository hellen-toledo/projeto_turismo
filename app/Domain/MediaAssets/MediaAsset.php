<?php

namespace App\Domain\MediaAssets;

use App\Domain\Cities\City;
use App\Domain\Events\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MediaAsset extends Model
{
    use HasFactory;

    public const COLLECTION_COVER = 'cover';

    public const COLLECTION_GALLERY = 'gallery';

    public const COLLECTION_GENERAL = 'general';

    protected $fillable = [
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
        'collection',
        'alt_text',
        'created_by',
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function cities(): BelongsToMany
    {
        return $this->belongsToMany(City::class, 'city_media_asset')
            ->withPivot(['sort_order', 'alt_text', 'is_cover'])
            ->withTimestamps();
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class, 'event_media_asset')
            ->withPivot(['sort_order', 'alt_text', 'is_cover'])
            ->withTimestamps();
    }

    public static function collections(): array
    {
        return [
            self::COLLECTION_COVER,
            self::COLLECTION_GALLERY,
            self::COLLECTION_GENERAL,
        ];
    }
}
