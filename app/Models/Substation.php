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

    /**
     * Get all of the Bay for the Substation
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function Bay(): HasMany
    {
        return $this->hasMany(related: Bay::class);
    }

    /**
     * Get the Condition that owns the Substation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function Condition(): BelongsTo
    {
        return $this->belongsTo(related: Condition::class);
    }

    /**
     * Get all of the User for the Substation
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function User(): HasMany
    {
        return $this->hasMany(related: User::class);
    }
}
