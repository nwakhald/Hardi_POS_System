<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        if (User::count() === 0) {
            User::create([
                'name' => 'Owner',
                'email' => env('OWNER_EMAIL'),
                'password' => Hash::make(env('OWNER_PASSWORD')),
            ]);
        }
    }
}