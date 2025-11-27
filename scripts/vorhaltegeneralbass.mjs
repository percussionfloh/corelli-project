import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { getIdFromFilename, getFiles, parseTimepoint } from './utils.mjs';

// prepare the path variables for later use.
const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToVorhalt = `${__dirname}/../content/vorhalte.yaml`;
const pathToKernScores = `${__dirname}/../corelli-trio-sonatas/kern/`;
//const pathToVorhalteData = `${__dirname}/../content/vorhalte.yaml`;

const vorhalteAsString = fs.readFileSync(pathToVorhalt, 'utf8').toString();

// const cadencesVorhalte = yaml.load(fs.readFileSync(pathToVorhalteData, 'utf8').toString());

// getFiles(pathToKernScores).forEach(file => {
//     const id = getIdFromFilename(file);


//     const pieceVorhalte = cadencesVorhalte[id];

//     if (!pieceVorhalte || pieceVorhalte.length === 0) {
//         console.warn(`❌ No Vorhalte found for ${id}`);
//         return;
//     }
    
//     console.log(`✅ Vorhalte found for ${id}`);

//     const kern = execSync(`cat ${file} | lnnr | beat -ca | meter | degx --resolve-null -t`).toString().trim();

//     const newCadences = pieceCadences.map(([a, b, tags]) => ({
//         tags: tags == null ? [] : [].concat(tags),
//         pieceId: id,
//     }));
// });

const vorhalte = yaml.load(vorhalteAsString);

const quartvorhalt = vorhalte.vorhalte.filter(c => c.tags.includes('vorhalt'));

// add .splice(0, 1) if you want to test with only 1 doppia
quartvorhalt.forEach(vorhalt => {

    // generate a unique id for each cadence
    const id = `${vorhalt.pieceId} ${vorhalt.startLine}-${vorhalt.endLine}`;

    // Apply humdrum/humlib tools to extract the relevant information from the
    // cadence, such as isolating the score by the cadence’s startLine/endLine,
    // extracting only the bass, removing figured-bass numbers, note durations,
    // manually add the key of the cadence, beat positions, and scale degrees.
    //Vorhalte: | svor
    const output = execSync(`cat ${pathToKernScores}${vorhalt.pieceId}.krn \
        | myank -l ${vorhalt.startLine}-${vorhalt.endLine} \
        | extractxx -i '**kern' \
        | ridxx -LGTMd \
        | beat -ca \
        | fb \
        | extractxx -k1`).toString().trim();
        


    // convert this output string to a JS readable array
    // split by new line (=rows), then each line by tab (=columns)
    const rows = output.split('\n').map(line => line.split('\t')).map((columns) => {
        const token = columns[0];
        const duration = columns[1];
        const beat = columns[2];
        const deg = columns[3];
        return {
            token: token,
            duration: duration,
            beat: beat,
            deg: deg,
        }
    });

    console.log(output);   

});


/* if in fb:
            - 8 follows 9 -> Nonvorhalt
            - 6 follows 7 -> Septimvorhalt
            - 3 follows 4 -> Quartvorhalt
            - 1 follows 2 -> Sekundvorhalt
            - 5 follows 6 AND 3 follows 4 (also not gleichzeitig) -> Quartsextvorhalt
            - 8 follows 9 AND 6 follows 7 (also not gleichzeitig) -> Septnonvorhalt
*/