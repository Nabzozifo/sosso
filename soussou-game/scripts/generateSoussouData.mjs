import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Usage: node scripts/generateSoussouData.mjs [optional_csv_path]
// Par défaut, le script lit ../../data/nombres_soussou_1_9999.csv

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const defaultCsvPath = path.resolve(projectRoot, '../data/nombres_soussou_1_9999.csv');
const csvPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultCsvPath;

const outputPath = path.resolve(projectRoot, 'src/data/soussouNumbers.generated.js');

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  // Première ligne est l’entête: Nombre;Traduction_soussou
  if (lines.length === 0) return [];
  const dataLines = lines.slice(1);
  const items = [];
  for (const line of dataLines) {
    const parts = line.split(';');
    if (parts.length < 2) continue;
    const numStr = parts[0].trim();
    const soussouRaw = parts[1].trim();
    const number = parseInt(numStr, 10);
    if (!Number.isFinite(number)) continue;
    // Garder la traduction soussou telle quelle, en normalisant espace
    const soussou = soussouRaw.replace(/\s+/g, ' ').trim();
    items.push({ number, soussou });
  }
  return items;
}

function generateModule(items) {
  // Crée un module JS avec Map et helpers pour rapidité
  const header = `// Fichier généré automatiquement depuis CSV. Ne pas éditer à la main.\n`;
  const arrayLiteral = JSON.stringify(items, null, 2); // Peut être volumineux mais chargé une fois
  return (
`${header}
export const soussouNumbers = ${arrayLiteral};
export const soussouMap = new Map(soussouNumbers.map(d => [d.number, d.soussou]));

export function getRandomSoussouNumber() {
  const i = Math.floor(Math.random() * soussouNumbers.length);
  const d = soussouNumbers[i];
  return { number: d.number, soussou: d.soussou, translation: d.soussou };
}

export function findSoussouNumber(number) {
  const n = parseInt(number, 10);
  if (!Number.isFinite(n)) return null;
  const soussou = soussouMap.get(n);
  if (!soussou) return null;
  return { number: n, soussou, translation: soussou };
}

export function findNumberBySoussou(text) {
  if (!text) return null;
  const norm = String(text).toLowerCase().trim();
  const found = soussouNumbers.find(d => d.soussou.toLowerCase().trim() === norm);
  return found ? { number: found.number, soussou: found.soussou, translation: found.soussou } : null;
}

export default soussouNumbers;
`);
}

function main() {
  console.log('[generateSoussouData] Lecture du CSV:', csvPath);
  if (!fs.existsSync(csvPath)) {
    console.error('CSV introuvable. Fournissez le chemin ou placez le fichier à:', defaultCsvPath);
    process.exit(1);
  }
  const csvText = fs.readFileSync(csvPath, 'utf8');
  const items = parseCsv(csvText);
  console.log(`[generateSoussouData] ${items.length} entrées parsées.`);
  const moduleText = generateModule(items);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, moduleText, 'utf8');
  console.log('[generateSoussouData] Fichier généré:', outputPath);
}

main();