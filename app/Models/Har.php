<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Har extends Model
{
    /** @use HasFactory<\Database\Factories\HarFactory> */
    use HasFactory;

    protected $fillable = [
        'titlename',
        'substation_id',
        'bay_id',
        'user_id',
        'equipment_id',
        'date',
        'description',
        'note'
    ];

    public function substation() {
        return $this->belongsTo(Substation::class);
    }

    public function bay() {
        return $this->belongsTo(Bay::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function equipment() {
        return $this->belongsTo(Equipment::class);
    }
}
