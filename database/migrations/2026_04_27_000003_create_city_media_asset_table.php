<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('city_media_asset', function (Blueprint $table) {
            $table->id();
            $table->foreignId('city_id')->constrained('cities')->cascadeOnDelete();
            $table->foreignId('media_asset_id')->constrained('media_assets')->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0)->index();
            $table->string('alt_text')->nullable();
            $table->boolean('is_cover')->default(false)->index();
            $table->timestamps();

            $table->unique(['city_id', 'media_asset_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('city_media_asset');
    }
};
