<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Anomali extends Model
{
    use HasFactory;
    protected $fillable = [
        'titlename',
        'substation_id',
        'section_id',
        'type_id',
        'user_id',
        'equipment_id',
        'other',
        'voltage_id',
        'bay_id',
        'additional_information',
        'date_find',
        'date_plan_start',
        'date_plan_end',
        'date_execution',
        'status_id',
        'is_approve',
        'approve_by',
        'attachment_filename',
        'attachment_path',
        'action',
        'official_report',
        'report_path'
    ];

    public function substation(): BelongsTo
    {
        return $this->belongsTo(Substation::class);
    }

    public function Section() : BelongsTo {
        return $this->belongsTo (Section::class);
    }

    public function Type() : BelongsTo {
        return $this->belongsTo(Type::class);
    }

    // public function User() : BelongsTo {
    //     return $this->belongsTo(User::class);
    // }

    public function Equipment() : BelongsTo {
        return $this->belongsTo(Equipment::class);
    }

    public function Bay() : BelongsTo {
        return $this->belongsTo(Bay::class);
    }

    public function Status() : BelongsTo {
        return $this->belongsTo(Status::class);
    }

    // public function Document() : BelongsTo {
    //     return $this->belongsTo(Document::class);
    // }

    public function scopeNonEmptyColumns(Builder $query, $columns)
    {
        foreach ($columns as $column) {
            $query->whereNotNull($column)->where($column, '!=', '');
        }

        return $query;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}

