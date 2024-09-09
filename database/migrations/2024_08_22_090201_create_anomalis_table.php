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
            $table->string('titlename');
            $table->string('substation_id')->nullable();
            $table->string('section_id')->nullable();
            $table->foreignId('type_id')->constrained()->onDelete('cascade');
            $table->string('user_id')->nullable();
            $table->foreignId('equipment_id')->constrained()->onDelete('cascade');
            $table->string('other')->nullable();
            $table->string('bay_id')->nullable();
            $table->text('additional_information')->nullable();
            $table->date('date_find')->nullable();
            $table->date('date_plan')->nullable();
            $table->date('date_execution')->nullable();
            $table->foreignId('status_id')->constrained()->onDelete('cascade');
            $table->boolean('is_approve');
            $table->string('approve_by')->nullable();
            $table->string('document_id')->nullable();
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
