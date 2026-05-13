<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
    'payment_logs',
    'activity_logs',
    'finished_sessions',
    'last_action_time',
    'finish_date',
];
protected $casts = [
    'payment_logs' => 'array',
    'activity_logs' => 'array',
    'finished_sessions' => 'array',
];
}
