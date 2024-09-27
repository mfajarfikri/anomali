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
                'titlename' => 'Rembesan minyak trafo',
                'substation_id' => 1,
                'section_id' => 1,
                'type_id' => 1,
                'user_id' => 1,
                'equipment_id' => 1,
                'other' => 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi quam iusto earum minima ratione mollitia fuga sapiente maiores eligendi suscipit.',
                'bay_id' => 1,
                'additional_information' => 'terdapat rembesan minyak pada trafo 6',
                'date_find' => 26082024,
                'date_plan_start' => null,
                'date_plan_end' => null,
                'date_execution' => null,
                'status_id' => 1,
                'is_approve' => false,
                'document_id' => 1
            ),
        ));
    }
}
