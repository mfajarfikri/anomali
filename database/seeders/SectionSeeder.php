<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('sections')->delete();

        DB::table('sections')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Hargi',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Harjar',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'Harpro',
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'K3L',
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'Banghal',
            ),
        ));
    }
}
