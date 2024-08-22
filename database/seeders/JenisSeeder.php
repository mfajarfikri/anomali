<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('jenis')->delete();

        DB::table('jenis')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Mayor',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Minor',
            ),
        ));
    }
}
