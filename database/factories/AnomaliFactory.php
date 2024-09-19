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
            'other' => fake()->words(5, true),
            'bay_id' => 1,
            'additional_information' => fake()->words(6, true),
            'date_find' => fake()->date('d-M-Y'),
            'date_plan_start' => fake()->date('d-M-Y'),
            'date_plan_end' => fake()->date('d-M-Y'),
            'date_execution' => fake()->date('d-M-Y'),
            'status_id' => fake()->numberBetween(1,3),
            'is_approve' => 0
        ];
    }
}
