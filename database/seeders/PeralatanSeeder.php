<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PeralatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('peralatans')->delete();

        DB::table('peralatans')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'TRAFO',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'PMT',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'CT',
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'CVT',
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'PMS',
            ),
            5 =>
            array(
                'id' => 6,
                'name' => 'INCOMING',
            ),
            6 =>
            array(
                'id' => 7,
                'name' => 'BUSHING',
            ),
            7 =>
            array(
                'id' => 8,
                'name' => 'ISOLATOR',
            ),
            8 =>
            array(
                'id' => 9,
                'name' => 'RECTIFIER',
            ),
            9 =>
            array(
                'id' => 10,
                'name' => 'BATTERE',
            ),
            10 =>
            array(
                'id' => 11,
                'name' => 'OTHER',
            ),
        ));
    }
}
