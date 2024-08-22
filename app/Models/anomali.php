<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anomali extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'slug',
        'gardu_id',
        'bidang_id',
        'jenis_id',
        'user_id',
        'peralatan_id',
        'peralatan_keterangan',
        'voltage',
        'bay_id',
        'additional_information',
        'date_findings',
        'date_plan',
        'date_execution',
        'status_id'
    ];
}
