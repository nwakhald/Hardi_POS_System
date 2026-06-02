<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Payment;

class Project extends Model
{
  protected $fillable = [
    'title',
    'owner',
    'location',
    'phone',
    'start_date',
    'deadline',
    'cost',
    'paid',
    'unpaid',
    'expense_cost',
    'team_cost',
    'progress',
    'status',
    'notes',
    'activity_logs',
    'finished_sessions',
    'last_action_time',
    'finish_date',
];
protected $casts = [
    'activity_logs' => 'array',
    'finished_sessions' => 'array',
];

public function payments()
{
    return $this->hasMany(Payment::class);
}
}

