<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bay extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'substation_id',
        'condition_id'
    ];

    public function Substation() : BelongsTo {
        return $this->belongsTo(Substation::class);
    }

    public function Condition() : BelongsTo {
        return $this->belongsTo(Condition::class);
    }
}
