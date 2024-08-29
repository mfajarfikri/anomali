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
                'name' => 'GI Kosambi Baru',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'GI Dawuan',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'GI Sukamandi',
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'GI Rengasdengklok',
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'GI Kiarapayung',
            ),
            5 =>
            array(
                'id' => 6,
                'name' => 'GI Maligi',
            ),
            6 =>
            array(
                'id' => 7,
                'name' => 'GI Parungmulya',
            ),
            7 =>
            array(
                'id' => 8,
                'name' => 'GI Telukjambe',
            ),
            8 =>
            array(
                'id' => 9,
                'name' => 'GI Peruri',
            ),
            9 =>
            array(
                'id' => 10,
                'name' => 'GI Kutamekar',
            ),
            10 =>
            array(
                'id' => 11,
                'name' => 'GI Indoliberty',
            ),
            11 =>
            array(
                'id' => 12,
                'name' => 'GI Pindodeli',
            ),
            12 =>
            array(
                'id' => 13,
                'name' => 'GI Sukatani',
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
