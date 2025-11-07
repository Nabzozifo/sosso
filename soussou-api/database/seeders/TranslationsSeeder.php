<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Translation;

class TranslationsSeeder extends Seeder
{
    public function run(): void
    {
        $csvPath = storage_path('app/nombres_soussou_1_9999.csv');
        if (!file_exists($csvPath)) {
            $this->command?->warn("CSV introuvable: {$csvPath}");
            return;
        }

        $handle = fopen($csvPath, 'r');
        if (!$handle) {
            $this->command?->error('Impossible d\'ouvrir le CSV');
            return;
        }

        // Lire l\'en-tête et détecter les colonnes
        $headers = fgetcsv($handle, 0, ';');
        $map = [
            'number' => null,
            'translation' => null,
            'pronunciation' => null,
        ];
        foreach ($headers as $i => $h) {
            $hNorm = strtolower(trim($h));
            if (in_array($hNorm, ['nombre','number'])) $map['number'] = $i;
            if (in_array($hNorm, ['traduction_soussou','translation','soussou'])) $map['translation'] = $i;
            if (in_array($hNorm, ['prononciation','pronunciation'])) $map['pronunciation'] = $i;
        }

        if ($map['number'] === null || $map['translation'] === null) {
            $this->command?->error('Colonnes number/translation non détectées dans le CSV');
            fclose($handle);
            return;
        }

        $batch = [];
        $count = 0;
        while (($row = fgetcsv($handle, 0, ';')) !== false) {
            $numVal = $row[$map['number']] ?? null;
            $transVal = $row[$map['translation']] ?? null;
            $pronVal = $map['pronunciation'] !== null ? ($row[$map['pronunciation']] ?? null) : null;
            if (!is_numeric($numVal) || !$transVal) continue;
            $number = intval($numVal);
            $translation = trim($transVal);
            $pronunciation = $pronVal ? trim($pronVal) : null;

            $batch[] = [
                'number' => $number,
                'translation' => $translation,
                'pronunciation' => $pronunciation,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            if (count($batch) >= 500) {
                Translation::upsert($batch, ['number'], ['translation','pronunciation','updated_at']);
                $count += count($batch);
                $batch = [];
            }
        }
        fclose($handle);

        if (!empty($batch)) {
            Translation::upsert($batch, ['number'], ['translation','pronunciation','updated_at']);
            $count += count($batch);
        }

        $this->command?->info("Import terminé: {$count} entrées (upsert)");
    }
}