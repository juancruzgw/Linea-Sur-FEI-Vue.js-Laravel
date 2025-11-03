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
        Schema::create('users', function (blueprint $table){
            $table->id()->autoIncrement();
            $table->string('name');
            $table->string('password');
            $table->string('rol')->default('user');
            
            $table->foreignId('zona_id')->constrained('zonas')->onDelete('cascade');
            $table->foreignId('site_id')->constrained('sites')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
