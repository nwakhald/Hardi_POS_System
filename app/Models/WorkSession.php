<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSession extends Model
{
    protected $fillable = [
        'project_id',
        'team_member_id',
        'work_date',
        'started_at',
        'finished_at',
    ];

    protected $casts = [
        'work_date' => 'date',
        'started_at' => 'datetime',
        'finished_at' => 'datetime',
    ];

    protected $appends = [
        'start_time',
        'finish_time',
    ];

    public function getStartTimeAttribute()
    {
        return $this->started_at;
    }

    public function getFinishTimeAttribute()
    {
        return $this->finished_at;
    }

    public function teamMember()
    {
        return $this->belongsTo(TeamMember::class);
    }
}
