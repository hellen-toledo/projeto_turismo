<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('summary', 500)->nullable();
            $table->text('description');
            $table->string('cover_image')->nullable();
            $table->foreignId('region_id')->constrained('regions')->cascadeOnDelete();
            $table->boolean('is_published')->default(true)->index();
            $table->timestamps();

            $table->index(['region_id', 'is_published']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cities');
    }
};
