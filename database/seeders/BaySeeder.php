<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class BaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('bays')->delete();

        DB::table('bays')->insert(array(
            0 =>
            array(
                'id' => 1,
                'substation_id' => 1,
                'name' => '7A1 DIAMETER#1 500kV',
                'condition_id' => 1
            ),
        ));
    }
}
