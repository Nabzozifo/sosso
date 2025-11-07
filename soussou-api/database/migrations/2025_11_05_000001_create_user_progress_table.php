<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_progresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('score')->default(0);
            $table->string('badge')->nullable();
            $table->integer('games_played')->default(0);
            $table->integer('correct_answers')->default(0);
            $table->integer('streak')->default(0);
            $table->integer('lessons_completed')->default(0);
            $table->integer('hard_mode_wins')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_progresses');
    }
};