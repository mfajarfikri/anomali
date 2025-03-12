<?php

namespace Database\Factories;

use App\Models\Substation;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubstationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Substation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->city() . ' Substation',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
} 