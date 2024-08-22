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
                'name' => 'Kosambi Baru - Indramayu',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Dawuan - Kosambi Baru',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'Sukamandi - Kosambi Baru',
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'Rengasdengklok - Kosambi Baru',
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'Kiarapayung - Kosambi Baru',
            ),
            5 =>
            array(
                'id' => 6,
                'name' => 'Maligi - Parungmulya',
            ),
            6 =>
            array(
                'id' => 7,
                'name' => 'Parungmulya - Peruri',
            ),
            7 =>
            array(
                'id' => 8,
                'name' => 'Telukjambe - Parungmulya',
            ),
            8 =>
            array(
                'id' => 9,
                'name' => 'Peruri - Pinayungan',
            ),
            9 =>
            array(
                'id' => 10,
                'name' => 'Kutamekar - Maligi',
            ),
            10 =>
            array(
                'id' => 11,
                'name' => 'Indoliberty - Maligi',
            ),
            11 =>
            array(
                'id' => 12,
                'name' => 'Pindodeli - Maligi',
            ),
            12 =>
            array(
                'id' => 13,
                'name' => 'Sukatani - Kosambi Baru',
            ),
            13 =>
            array(
                'id' => 14,
                'name' => 'GISTET Sukatani - Muaratawar',
            ),
            14 =>
            array(
                'id' => 15,
                'name' => 'GITET Deltamas - Cibatu',
            ),
        ));
    }
}
