<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;

class TeamMemberController extends Controller
{
    public function index()
    {
        return response()->json(TeamMember::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $member = TeamMember::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'] ?? null,
            'note' => $validated['note'] ?? null,
            'status' => 'available',
        ]);

        return response()->json([
            'message' => 'Team member created',
            'member' => $member,
        ], 201);
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        $teamMember->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'] ?? null,
            'note' => $validated['note'] ?? null,
        ]);

        return response()->json([
            'message' => 'Team member updated',
            'member' => $teamMember,
        ]);
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();

        return response()->json([
            'message' => 'Team member deleted',
        ]);
    }

    public function sessions(TeamMember $teamMember)
    {
        $sessions = WorkSession::where('team_member_id', $teamMember->id)
            ->with('project')
            ->latest()
            ->get();

        $rows = $sessions->map(function ($session) {
            return [
                'id' => $session->id,
                'project_id' => $session->project_id,
                'project_title' => $session->project?->title,
                'startTime' => $session->start_time,
                'finishTime' => $session->finish_time,
            ];
        });

        return response()->json($rows);
    }
}