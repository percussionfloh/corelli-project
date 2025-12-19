import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { getIdFromFilename, getFiles, parseTimepoint } from './utils.mjs';

// prepare the path variables for later use.
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToVorhalt = `${__dirname}/../content/vorhalte.yaml`;
const pathToChords = `${__dirname}/../content/chords.yaml`;

const vorhalteAsString = fs.readFileSync(pathToVorhalt, 'utf8').toString();


// YAML einlesen
const chordsData = yaml.load(fs.readFileSync('./content/chords.yaml', 'utf8'));
const allChords = (chordsData && chordsData.chords) ? chordsData.chords : [];

// Filter: fb enthält '4' UND meterWeight ist 'strong'
const chordsWith4Strong = allChords.filter(chord =>
  chord.fb && chord.fb.toString().includes('4') && chord.meterWeight === 'strong'
);

// Alle Akkorde sammeln, einschließlich der vorherigen
const chordsWithContext = [];
chordsWith4Strong.forEach(chord => {
  // Finde den Index des aktuellen Akkords
  const currentIndex = allChords.indexOf(chord);
  
  // Füge den vorherigen Akkord hinzu, falls vorhanden
  if (currentIndex > 0) {
    chordsWithContext.push(allChords[currentIndex - 1]);
  }
  
  // Füge den gefilterten Akkord selbst hinzu
  chordsWithContext.push(chord);
});


// Gruppieren nach 'deg'
const groupedByDeg = chordsWith4Strong.reduce((acc, chord) => {
  const degKey = chord.deg == null ? 'unknown' : String(chord.deg);
  if (!acc[degKey]) acc[degKey] = [];
  // optional: nur die relevanten Felder speichern
  acc[degKey].push({
    pieceId: chord.pieceId,
    lineNumber: chord.lineNumber,
    beat: chord.beat,
    fb: chord.fb,
    hint: chord.hint,
    meterWeight: chord.meterWeight,
    original: chord, // falls du das ganze Objekt behalten willst
  });
  return acc;
}, {});

// Ausgabe: Objekt mit Keys = deg, Values = Array von Akkorden
console.log(groupedByDeg);

// Optional: als sortierte Liste nach Häufigkeit
const groupsSorted = Object.entries(groupedByDeg)
  .map(([deg, chords]) => ({ deg, count: chords.length, chords }))
  .sort((a, b) => b.count - a.count);

// console.log(groupsSorted);


// const vorhalte = yaml.load(vorhalteAsString);

// const quartvorhalt = vorhalte.vorhalte.filter(c => c.tags.includes('vorhalt'));

// add .splice(0, 1) //if you want to test with only 1 doppia
// quartvorhalt.forEach(vorhalt => {

//     // generate a unique id for each cadence
//     const id = `${vorhalt.pieceId} ${vorhalt.startLine}-${vorhalt.endLine}`;

//     // Apply humdrum/humlib tools to extract the relevant information from the
//     // cadence, such as isolating the score by the cadence’s startLine/endLine,
//     // extracting only the bass, removing figured-bass numbers, note durations,
//     // manually add the key of the cadence, beat positions, and scale degrees.
//     //Vorhalte: | svor
//     const output = execSync(`cat ${pathToKernScores}${vorhalt.pieceId}.krn \
//         | myank -l ${vorhalt.startLine}-${vorhalt.endLine} \
//         | extractxx -i '**kern' \
//         | ridxx -LGTMd \
//         | beat -ca \
//         | fb -c\
//         | extractxx -k1`).toString().trim();
        

                      //  <Chart :config="nextDegConfig"  /> such nach nextDegConfig
                      //  https://www.chartjs.org/
//     console.log(output);   

// });


/* if in fb:
            - 8 follows 9 -> Nonvorhalt
            - 6 follows 7 -> Septimvorhalt
            - 3 follows 4 -> Quartvorhalt
            - 1 follows 2 -> Sekundvorhalt
            - 5 follows 6 AND 3 follows 4 (also not gleichzeitig) -> Quartsextvorhalt
            - 8 follows 9 AND 6 follows 7 (also not gleichzeitig) -> Septnonvorhalt
            
*/

