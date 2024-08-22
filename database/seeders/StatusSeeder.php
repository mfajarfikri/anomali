<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('statuses')->delete();

        DB::table('statuses')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Open',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Pending',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'Close',
            ),
        ));
    }
}
