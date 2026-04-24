<?php

namespace App\Domain\InterestTags;

use App\Domain\Cities\City;
use App\Domain\Events\Event;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class InterestTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function cities(): BelongsToMany
    {
        return $this->belongsToMany(City::class)
            ->withTimestamps();
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class)
            ->withTimestamps();
    }
}
