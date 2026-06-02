<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TeamMember;
use App\Models\WorkSession;

class WorkSessionController extends Controller
{
    public function start(Project $project, TeamMember $teamMember)
    {
        // Check if team member has any active work sessions in other projects
        $activeSession = WorkSession::where('team_member_id', $teamMember->id)
            ->whereNull('finished_at')
            ->where('project_id', '!=', $project->id)
            ->first();

        if ($activeSession) {
            $otherProject = Project::find($activeSession->project_id);
            return response()->json([
                'message' => "Team member is already working on '{$otherProject->title}'. They must finish that work before starting here.",
                'error' => true,
            ], 409);
        }

        // Check if already has active session in this project
        $existingSession = WorkSession::where('project_id', $project->id)
            ->where('team_member_id', $teamMember->id)
            ->whereNull('finished_at')
            ->first();

        if ($existingSession) {
            return response()->json([
                'message' => 'Team member already has an active work session in this project.',
                'error' => true,
            ], 409);
        }

        $session = WorkSession::create([
            'project_id' => $project->id,
            'team_member_id' => $teamMember->id,
            'work_date' => now()->toDateString(),
            'started_at' => now(),
            'finished_at' => null,
        ]);

        return response()->json([
            'message' => 'Work started',
            'session' => $session,
        ], 201);
    }

    public function finish(WorkSession $workSession)
    {
        $workSession->update([
            'finished_at' => now(),
        ]);

        // Refresh to get the updated timestamps and computed accessors
        $workSession->refresh();

        return response()->json([
            'message' => 'Work finished',
            'session' => $workSession,
        ]);
    }

    public function index(Project $project)
    {
        $members = TeamMember::all();

        $rows = $members->map(function ($member) use ($project) {
            $session = WorkSession::where('project_id', $project->id)
                ->where('team_member_id', $member->id)
                ->whereNull('finished_at')
                ->latest()
                ->first();

            return [
                'id' => $member->id,
                'name' => $member->name,
                'startTime' => $session ? $session->start_time : '-',
                'finishTime' => '-',
                'status' => $session ? 'Working' : $member->status,
                'actionState' => $session ? 'working' : 'idle',
                'workSessionId' => $session ? $session->id : null,
            ];
        });

        return response()->json($rows);
    }

    public function finishedSessions(Project $project)
    {
        $sessions = WorkSession::where('project_id', $project->id)
            ->whereNotNull('finished_at')
            ->with('teamMember')
            ->latest()
            ->get();

        $rows = $sessions->map(function ($session) {
            return [
                'id' => $session->id,
                'name' => $session->teamMember->name,
                'startTime' => $session->start_time,
                'finishTime' => $session->finish_time,
            ];
        });

        return response()->json($rows);
    }
}