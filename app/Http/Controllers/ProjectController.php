<?php

namespace App\Http\Controllers;

use App\Models\Project;
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

            'payment_logs' => [],
            'activity_logs' => [],
            'finished_sessions' => [],
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

    return response()->json([
        'message' => 'Project resumed',
        'project' => $project,
    ]);
}


}