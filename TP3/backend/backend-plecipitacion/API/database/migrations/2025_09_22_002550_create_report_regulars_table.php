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
        Schema::create('report_regulars', function (Blueprint $table) {
            $table->id();
            $table->string('amount');

            $table->foreignId('united_measure_id')->constrained('united_measures')->onDelete('cascade');
            $table->foreignId('sample_id')->constrained('samples')->onDelete('cascade');

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
        Schema::dropIfExists('report_regulars');
    }
};
