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
        Schema::create('sites', function (Blueprint $table) {
            $table->id();

            $table->decimal('latitude', 10, 7); 
            $table->decimal('longitude', 10, 7);
            
            
            $table->foreignId('zona_id')->constrained('zonas')->onDelete('cascade');
            $table->foreignId('precipitation_id')->constrained('precipitations')->onDelete('cascade');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
