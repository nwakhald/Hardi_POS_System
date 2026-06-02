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
}