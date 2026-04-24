<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('external_url')->nullable();
            $table->foreignId('city_id')->constrained('cities')->cascadeOnDelete();
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();

            $table->index(['city_id', 'starts_at']);
            $table->index(['is_published', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
