<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class VoltageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('voltages')->delete();

        DB::table('voltages')->insert(array(
            0 =>
            array(
                'id' => 1,
                'name' => '70Kv',
            ),
            1 =>
            array(
                'id' => 2,
                'name' => '150Kv',
            ),
            2 =>
            array(
                'id' => 3,
                'name' => '500Kv',
            ),
        ));
    }
}
