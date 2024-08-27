<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AnomaliSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('anomalis')->delete();

        DB::table('anomalis')->insert(array(
            0 =>
            array(
                'id' => 1,
                'ticketname' => 'Admin',
                'substation_id' => 1,
                'section_id' => 1,
                'type_id' => 1,
                'user_id' => 1,
                'peralatan_id' => 1,
                'other' => null,
                'voltage_id' => 2,
                'bay_id' => 2,
                'additional_information' => 'Lorem ipsum dolor sit amet.',
                'date_find' => 26082024,
                'date_plan' => null,
                'date_execution' => null,
                'status_id' => 1,
            ),
            1 =>
            array(
                'id' => 2,
                'ticketname' => 'Gangguan Kosambi',
                'substation_id' => 1,
                'section_id' => 2,
                'type_id' => 3,
                'user_id' => 2,
                'peralatan_id' => 5,
                'other' => null,
                'voltage_id' => 3,
                'bay_id' => 2,
                'additional_information' => 'Lorem ipsum dolor sit amet.',
                'date_find' => 26082024,
                'date_plan' => null,
                'date_execution' => null,
                'status_id' => 3,
            )
        ));
    }
}
