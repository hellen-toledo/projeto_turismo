<?php

namespace App\Providers;

use App\Domain\Cities\City;
use App\Domain\Events\Event;
use App\Domain\InterestTags\InterestTag;
use App\Domain\Regions\Region;
use App\Models\User;
use App\Policies\CityPolicy;
use App\Policies\EventPolicy;
use App\Policies\InterestTagPolicy;
use App\Policies\RegionPolicy;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Gate::policy(City::class, CityPolicy::class);
        Gate::policy(Event::class, EventPolicy::class);
        Gate::policy(Region::class, RegionPolicy::class);
        Gate::policy(InterestTag::class, InterestTagPolicy::class);
        Gate::define('access-admin', fn (User $user) => $user->is_admin);
    }
}
