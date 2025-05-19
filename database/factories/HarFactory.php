<?php

namespace Database\Factories;

use App\Models\Bay;
use App\Models\Equipment;
use App\Models\User;
use App\Models\Substation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Har>
 */
class HarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'titlename' => $this->faker->text,
            'substation_id' => Substation::factory(),
            'bay_id' => Bay::factory(),
            'user_id' => User::factory(),
            'equipment_id' => 1,
            'date' => fake()->dateTimeBetween('-1 month', 'now'),
            'description' => $this->faker->realText,
        ];
    }
}
