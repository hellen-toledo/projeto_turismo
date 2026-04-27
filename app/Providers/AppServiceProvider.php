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
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

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

        RateLimiter::for('admin-login', function (Request $request): Limit {
            $email = Str::lower($request->string('email')->toString());

            return Limit::perMinute(5)->by("admin-login|{$email}|{$request->ip()}");
        });
    }
}
