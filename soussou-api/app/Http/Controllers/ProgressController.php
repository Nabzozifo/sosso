<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserProgress;

class ProgressController extends Controller
{
    private function computeScore(array $data): int
    {
        $games = (int)($data['games_played'] ?? 0);
        $correct = (int)($data['correct_answers'] ?? 0);
        $streak = (int)($data['streak'] ?? 0);
        $lessons = (int)($data['lessons_completed'] ?? 0);
        $hardWins = (int)($data['hard_mode_wins'] ?? 0);
        return $correct*10 + $streak*5 + $lessons*2 + $hardWins*3 + $games;
    }

    private function computeBadge(int $score): string
    {
        if ($score >= 300) return 'Pro';
        if ($score >= 100) return 'Avancé';
        return 'Débutant';
    }

    public function get(Request $request)
    {
        $user = $request->user();
        $progress = UserProgress::firstOrCreate(['user_id' => $user->id]);
        return response()->json($progress);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $progress = UserProgress::firstOrCreate(['user_id' => $user->id]);
        $data = $request->only(['games_played','correct_answers','streak','lessons_completed','hard_mode_wins']);
        foreach ($data as $k => $v) {
            $progress->{$k} = (int)$v;
        }
        $score = $this->computeScore($data + [
            'games_played' => $progress->games_played,
            'correct_answers' => $progress->correct_answers,
            'streak' => $progress->streak,
            'lessons_completed' => $progress->lessons_completed,
            'hard_mode_wins' => $progress->hard_mode_wins,
        ]);
        $progress->score = $score;
        $progress->badge = $this->computeBadge($score);
        $progress->save();
        return response()->json($progress);
    }
}