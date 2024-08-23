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
                'name' => 'Major',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Minor',
            ),
        ));
    }
}
