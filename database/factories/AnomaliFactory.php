<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\anomali>
 */
class AnomaliFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titlename' => fake()->words(3, true),
            'substation_id' => fake()->randomDigitNotNull(),
            'section_id' => fake()->numberBetween(1,3),
            'type_id' => fake()->numberBetween(1,2),
            'user_id' => fake()->numberBetween(1,42),
            'equipment_id' => fake()->numberBetween(1,12),
            'bay_id' => 1,
            'additional_information' => fake()->words(6, true),
            'date_find' => fake()->date('d-M-Y'),
            'date_plan_start' => null,
            'date_plan_end' => null,
            'date_execution' => null,
            'status_id' => 1,
            'is_approve' => 0,
            'approve_by' => null,
            'attachment_filename' => null,
            'attachment_path' => null
        ];
    }
}
