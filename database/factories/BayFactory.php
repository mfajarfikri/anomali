<?php

namespace Database\Factories;

use App\Models\Bay;
use App\Models\Substation;
use App\Models\Condition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bay>
 */
class BayFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Bay::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word() . ' Bay',
            'substation_id' => Substation::factory(),
            'condition_id' => 1,
    'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
