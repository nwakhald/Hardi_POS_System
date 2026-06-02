<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Project;

class ProjectWorkDays extends Model
{
    protected $table = 'project_work_days';

    protected $fillable = [
        'project_id',
        'work_date',
        'started_at',
        'finished_at',
        'note',
    ];

    public function resume(Project $project)
    {
        $project->update([
            'status' => 'in_progress',
            'last_action_time' => now(),
        ]);

        self::create([
            'project_id' => $project->id,
            'work_date' => now()->toDateString(),
            'started_at' => now(),
        ]);

        return response()->json([
            'message' => 'Project resumed',
            'project' => $project,
        ]);
    }
    public function pause(Project $project)
{
    $project->update([
        'status' => 'paused',
        'last_action_time' => now(),
    ]);

    $workDay = self::where('project_id', $project->id)
        ->whereNull('finished_at')
        ->latest()
        ->first();

    if ($workDay) {
        $workDay->update([
            'finished_at' => now(),
        ]);
    }

    return response()->json([
        'message' => 'Project paused',
        'project' => $project,
    ]);
}
}
