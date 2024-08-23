<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubstationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('substations')->delete();

        DB::table('substations')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Kosambi Baru',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Dawuan',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'Sukamandi',
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'Rengasdengklok',
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'Kiarapayung',
            ),
            5 =>
            array(
                'id' => 6,
                'name' => 'Maligi',
            ),
            6 =>
            array(
                'id' => 7,
                'name' => 'Parungmulya',
            ),
            7 =>
            array(
                'id' => 8,
                'name' => 'Telukjambe',
            ),
            8 =>
            array(
                'id' => 9,
                'name' => 'Peruri',
            ),
            9 =>
            array(
                'id' => 10,
                'name' => 'Kutamekar',
            ),
            10 =>
            array(
                'id' => 11,
                'name' => 'Indoliberty',
            ),
            11 =>
            array(
                'id' => 12,
                'name' => 'Pindodeli',
            ),
            12 =>
            array(
                'id' => 13,
                'name' => 'Sukatani',
            ),
            13 =>
            array(
                'id' => 14,
                'name' => 'GISTET Sukatani',
            ),
            14 =>
            array(
                'id' => 15,
                'name' => 'GITET Deltamas',
            ),
        ));
    }
}
