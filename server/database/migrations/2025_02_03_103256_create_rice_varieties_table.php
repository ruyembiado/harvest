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
        Schema::create('rice_varieties', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rice_land_id');
            $table->foreign('rice_land_id')->references('id')->on('rice_lands')->onDelete('cascade');
            $table->string('rice_variety_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rice_varieties');
    }
};
