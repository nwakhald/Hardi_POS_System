<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 
   public function up(): void
{
    Schema::create('projects', function (Blueprint $table) {
        $table->id();

        $table->string('title');
        $table->string('owner');
        $table->string('location');
        $table->string('phone');

        $table->date('start_date');
        $table->date('deadline')->nullable();

        $table->decimal('cost', 10, 2)->default(0);
        $table->decimal('paid', 10, 2)->default(0);
        $table->decimal('unpaid', 10, 2)->default(0);

        $table->decimal('expense_cost', 10, 2)->default(0);
        $table->decimal('team_cost', 10, 2)->default(0);

        $table->integer('progress')->default(0);

        $table->enum('status', [
            'upcoming',
            'in_progress',
            'paused',
            'completed',
            'handed_off'
        ])->default('upcoming');

        $table->text('notes')->nullable();

        $table->json('payment_logs')->nullable();
        $table->json('activity_logs')->nullable();
        $table->json('finished_sessions')->nullable();

        $table->timestamp('last_action_time')->nullable();
        $table->timestamp('finish_date')->nullable();

        $table->timestamps();
    });
}
  
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
