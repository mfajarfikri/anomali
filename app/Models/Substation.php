<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Substation extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'condition_id'
    ];

    public function Bay() : HasMany {
        return $this->hasMany(Bay::class);
    }

    public function Condition() : BelongsTo {
        return $this->belongsTo(Condition::class);
    }
}
