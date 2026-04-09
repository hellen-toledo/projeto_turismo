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
            $table->string('name'); 
            $table->string('day'); 
            $table->string('month');
            $table->string('location_city'); 
            $table->string('action_link')->nullable(); 
            $table->timestamps();
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
