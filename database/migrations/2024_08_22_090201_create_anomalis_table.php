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
        Schema::create('anomalis', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique()->nullable();
            $table->string('gardu_id')->nullable();
            $table->string('bidang_id')->nullable();
            $table->string('jenis_id')->nullable();
            $table->string('user_id')->nullable();
            $table->string('peralatan_id')->nullable();
            $table->string('peralatan_keterangan')->nullable();
            $table->string('voltage_id')->nullable();
            $table->string('bay_id')->nullable();
            $table->text('additional_information')->nullable();
            $table->date('date_findings')->nullable();
            $table->date('date_plan')->nullable();
            $table->date('date_execution')->nullable();
            $table->string('status_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anomalis');
    }
};
