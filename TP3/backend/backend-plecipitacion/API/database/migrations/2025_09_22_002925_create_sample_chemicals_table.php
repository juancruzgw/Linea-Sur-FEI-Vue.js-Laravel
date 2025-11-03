<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sample_chemicals', function (Blueprint $table) {
            $table->id();
            $table->string('ph');
            $table->string('conductivity');
            $table->string('sodiumConcentration');
            
            $table->foreignId('sample_id')->constrained('samples')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sample_chemicals');
    }
};
