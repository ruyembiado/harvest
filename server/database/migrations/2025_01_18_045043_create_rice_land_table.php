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
        Schema::create('rice_land', function (Blueprint $table) {
            $table->id();
            $table->string('rice_land_name');
            $table->string('rice_land_lat');
            $table->string('rice_land_long');
            $table->string('rice_land_size');
            $table->string('rice_land_condition');
            $table->string('rice_land_current_stage');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rice_land');
    }
};
