<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectWorkDays;
use App\Models\Payment;
use App\Models\WorkSession;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'owner' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'start_date' => 'required|date',
            'cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $project = Project::create([
            ...$validated,

            'paid' => 0,
            'unpaid' => $validated['cost'],

            'expense_cost' => 0,
            'team_cost' => 0,

            'progress' => 0,

            'status' => 'upcoming',
        ]);

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project
        ], 201);
    }
    public function index()
    {
        return response()->json(Project::latest()->get());
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'owner' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'start_date' => 'required|date',
            'cost' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project,
        ]);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }
public function start(Project $project)
{
    $project->update([
        'status' => 'paused',
        'progress' => 0,
        
    ]);

    return response()->json([
        'message' => 'Project started successfully',
        'project' => $project
    ]);
}
public function pause(Project $project)
{
    $project->update([
        'status' => 'paused',
        'last_action_time' => now(),
    ]);

    // Automatically finish all active work sessions for this project
    WorkSession::where('project_id', $project->id)
        ->whereNull('finished_at')
        ->update(['finished_at' => now()]);

    $workDay = ProjectWorkDays::where('project_id', $project->id)
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

public function resume(Project $project)
{
    $project->update([
        'status' => 'in_progress',
        'last_action_time' => now(),
    ]);

    ProjectWorkDays::create([
        'project_id' => $project->id,
        'work_date' => now()->toDateString(),
        'started_at' => now(),
    ]);

    return response()->json([
        'message' => 'Project resumed',
        'project' => $project,
    ]);
}

public function complete(Project $project)
{
    $project->update([
        'status' => 'completed',
        'progress' => 100,
        'finish_date' => now(),
        'last_action_time' => now(),
    ]);

    WorkSession::where('project_id', $project->id)
        ->whereNull('finished_at')
        ->update(['finished_at' => now()]);

    return response()->json([
        'message' => 'Project completed',
        'project' => $project,
    ]);
}

public function getActivityLogs(Project $project)
{
    $activityLogs = $project->activity_logs ?? [];
    return response()->json($activityLogs);
}

public function storeActivityLog(Request $request, Project $project)
{
    $validated = $request->validate([
        'action' => 'required|string',
        'note' => 'nullable|string',
        'dateTime' => 'nullable|string',
    ]);

    $activityLogs = $project->activity_logs ?? [];
    
    $newLog = [
        'id' => count($activityLogs) + 1,
        'dateTime' => $validated['dateTime'] ?? now()->toDateTimeString(),
        'action' => $validated['action'],
        'note' => $validated['note'] ?? '',
    ];

    $activityLogs[] = $newLog;
    $project->update(['activity_logs' => $activityLogs]);

    return response()->json([
        'message' => 'Activity log saved',
        'log' => $newLog,
    ], 201);
}

public function getPayments(Project $project)
{
    $payments = $project->payments()->get()->map(function ($payment) {
        return [
            'id' => $payment->id,
            'dateTime' => $payment->paid_at,
            'amount' => $payment->amount,
            'method' => $payment->method,
            'note' => $payment->note,
        ];
    });

    return response()->json($payments);
}

public function storePayment(Request $request, Project $project)
{
    $validated = $request->validate([
        'amount' => 'required|numeric|min:0',
        'method' => 'nullable|string',
        'note' => 'nullable|string',
        'dateTime' => 'nullable|string',
    ]);

    $payment = Payment::create([
        'project_id' => $project->id,
        'amount' => $validated['amount'],
        'method' => $validated['method'] ?? '',
        'note' => $validated['note'] ?? '',
        'paid_at' => $validated['dateTime'] ?? now(),
    ]);

    $project->paid = $project->paid + $payment->amount;
    $project->unpaid = max(0, $project->cost - $project->paid);
    $project->save();

    return response()->json([
        'message' => 'Payment saved',
        'payment' => [
            'id' => $payment->id,
            'dateTime' => $payment->paid_at,
            'amount' => $payment->amount,
            'method' => $payment->method,
            'note' => $payment->note,
        ],
        'project' => $project,
    ], 201);
}


}