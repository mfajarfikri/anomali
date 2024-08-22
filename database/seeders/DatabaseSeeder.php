<?php

namespace Database\Seeders;

use App\Models\anomali;
use App\Models\User;
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
            GarduSeeder::class,
            UserSeeder::class,
            PeralatanSeeder::class,
            BaySeeder::class,
            VoltageSeeder::class,
            BidangSeeder::class,
            StatusSeeder::class,
            JenisSeeder::class,
        ]);
        // User::factory(40)->create();
    }
}
