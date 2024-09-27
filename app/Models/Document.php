<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'filename',
        'path'
    ];

    public function Anomali() : HasOne {
        return $this->hasOne(Anomali::class);
    }
}
