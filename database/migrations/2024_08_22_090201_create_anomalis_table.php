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
            $table->string('substation_id');
            $table->string('section_id');
            $table->foreignId('type_id')->constrained()->onDelete('cascade');
            $table->string('user_id');
            $table->foreignId('equipment_id')->constrained()->onDelete('cascade');
            $table->string('bay_id');
            $table->text('additional_information');
            $table->date('date_find');
            $table->date('date_plan_start')->nullable();
            $table->date('date_plan_end')->nullable();
            $table->date('date_execution')->nullable();
            $table->foreignId('status_id')->constrained()->onDelete('cascade');
            $table->boolean('is_approve');
            $table->string('approve_by')->nullable();
            $table->string('attachment_filename')->nullable();
            $table->string('attachment_path')->nullable();
            $table->text('action')->nullable();
            $table->string('official_report')->nullable();
            $table->string('report_path')->nullable();
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
