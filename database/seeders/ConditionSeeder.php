<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class ConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('conditions')->delete();

        DB::table('conditions')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => 'Operasi',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => 'Tidak Operasi',
            ),
        ));
    }
}
