<?php

namespace Database\Seeders;

use App\Models\Anomali;
use App\Models\User;
use App\Models\Bay;
use App\Models\Har;
use Database\Factories\AnomaliFactory;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            RoleSeeder::class,
            // AnomaliSeeder::class,
            SubstationSeeder::class,
            UserSeeder::class,
            EquipmentSeeder::class,
            BaySeeder::class,
            SectionSeeder::class,
            StatusSeeder::class,
            TypeSeeder::class,
            ConditionSeeder::class
        ]);
        // User::factory(40)->create();
        Anomali::factory(30)->create();
        Bay::factory(100)->create();
        Har::factory(50)->create();
    }
}
