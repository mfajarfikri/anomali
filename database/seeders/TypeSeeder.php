<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('types')->delete();

        DB::table('types')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Trafo',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'PMT',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => 'CVT',
            ),
            3 =>
            array(
                'id' => 4,
                'name' => 'Pentanahan',
            ),
            4 =>
            array(
                'id' => 5,
                'name' => 'Dll',
            ),
        ));
    }
}
