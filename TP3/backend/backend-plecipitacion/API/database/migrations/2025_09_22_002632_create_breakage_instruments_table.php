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
        Schema::create('breakage_instruments', function (Blueprint $table) {
            $table->id();
            $table->string('damage');

            // Relación 1-1 con reporte
            $table->foreignId('report_id')->constrained('reports')->onDelete('cascade')->unique();

            $table->timestamps();
        });
    }
 
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('breakage_instruments');
    }
};
