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
                'name' => 'GITET 500KV DELTAMAS',
                'condition_id' => 1
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'GISTET 500KV SUKATANI',
                'condition_id' => 1
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'GI 150KV DELTAMAS',
                'condition_id' => 1
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'GIS 150KV SUKATANI',
                'condition_id' => 1
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'GI 150KV SUKATANI GOBEL',
                'condition_id' => 1
            ),
            5 =>
            array(
                'id' => 6,
                'name' => 'GI 150KV KOSAMBI BARU',
                'condition_id' => 1
            ),
            6 =>
            array(
                'id' => 7,
                'name' => 'GI 70KV KOSAMBI BARU',
                'condition_id' => 1
            ),
            7 =>
            array(
                'id' => 8,
                'name' => 'GI 150KV DAWUAN',
                'condition_id' => 1
            ),
            8 =>
            array(
                'id' => 9,
                'name' => 'GI 150KV SUKAMANDI',
                'condition_id' => 1
            ),
            9 =>
            array(
                'id' => 10,
                'name' => 'GI 150KV PARUNGMULYA',
                'condition_id' => 1
            ),
            10 =>
            array(
                'id' => 11,
                'name' => 'GI 150KV KUTAMEKAR',
                'condition_id' => 1
            ),
            11 =>
            array(
                'id' => 12,
                'name' => 'GI 150KV KIARAPAYUNG',
                'condition_id' => 1
            ),
            12 =>
            array(
                'id' => 13,
                'name' => 'GI 150KV PERURI',
                'condition_id' => 1
            ),
            13 =>
            array(
                'id' => 14,
                'name' => 'GI 150KV TELUKJAMBE',
                'condition_id' => 1
            ),
            14 =>
            array(
                'id' => 15,
                'name' => 'GI 150KV MALIGI',
                'condition_id' => 1
            ),
            15 =>
            array(
                'id' => 16,
                'name' => 'GI 70KV PINDODELI',
                'condition_id' => 1
            ),
            16 =>
            array(
                'id' => 17,
                'name' => 'GI 150KV INDOLIBERTY',
                'condition_id' => 1
            ),
            17 =>
            array(
                'id' => 18,
                'name' => 'GI 70KV RENGASDENGKLOK',
                'condition_id' => 1
            ),
        ));
    }
}
