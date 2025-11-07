<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProgress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'score', 'badge', 'games_played', 'correct_answers', 'streak', 'lessons_completed', 'hard_mode_wins'
    ];
}