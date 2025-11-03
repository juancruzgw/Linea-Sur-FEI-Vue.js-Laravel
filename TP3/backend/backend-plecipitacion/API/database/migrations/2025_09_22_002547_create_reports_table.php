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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('note')->nullable();
            $table->string('image')->nullable();
            $table->string('audio')->nullable();

            // Discriminador
            $table->enum('type', ['regular', 'rotura']);

            // Relaciones comunes
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('instrument_id')->constrained('instruments')->onDelete('cascade');
            $table->foreignId('precipitation_id')->constrained('precipitations')->onDelete('cascade');
            $table->foreignId('site_id')->constrained('sites')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
