<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@example.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');

        User::query()->updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => env('ADMIN_NAME', 'Admin User'),
                'password' => Hash::make($adminPassword),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            RegionSeeder::class,
            InterestTagSeeder::class,
            CitySeeder::class,
            EventSeeder::class,
        ]);
    }
}
