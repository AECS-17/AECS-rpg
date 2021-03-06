// This file is released under the MIT License. See the LICENSE file.

// Return a random integer between min (inclusive) and max (exclusive).
function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Return a random element from an array.
function getRandomFromArray(array) {
    return array[getRandomArbitrary(0, array.length)];
}

// Return an array of indices 0, 1, ..., count - 1 in a random order.
function getRandomIndices(count: number) {
    let indices = new Array();
    for (let i = 0; i < count; i++)
        indices.push(i);
    for (let i = count - 1; i > 0; i--) {
        const j = getRandomArbitrary(0, i + 1);
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
}

// Convert a boolean value to the French words "Oui" or "Non".
function booleanToAnswer(value: boolean) {
    return value ? "Oui" : "Non";
}

// Calculate the gcd of a and b using the euclidean algorithm.
function gcd(a: number, b: number)
{
    while (b != 0) [a, b] = [b, a % b];
    return a;
}

// Create a random question asking to associate a key of a one-to-one map to its
// value, or the other way around. Wrong answers are taken from other
// keys/values of the map. The parameters are:
// - question_key_to_value: question to ask for mapping a key to a value. The
// special substring "%KEY" is replaced with an actual key.
// - question_value_to_key: question to ask for mapping a value to its key. The
// special substring "%VALUE" is replaced with an actual value.
// - course_intro: intro sentence for the course, explaining the mapping.
// - course_key_to_value: the text to use when explaining that a key is mapped
//   to a value. The special substrings "%KEY" and "%VALUE" are used as above.
function mapQuestion(map,
                     question_key_to_value: string,
                     question_value_to_key: string,
                     course_intro?,
                     course_key_to_value?) {
    return () => {
        let keys = new Array();
        for (let key in map)
            keys.push(key);

        var indices = getRandomIndices(keys.length);
        let course;
        if (course_intro) {
            course = new Array(course_intro);
            for (let key in map) {
                course.push(course_key_to_value.
                            replace(/%KEY/g, `${key}`).
                            replace(/%VALUE/g, `${map[key]}`));
            }
        }

        if (Math.random() < .5) {
            let i = indices.pop();
            let statement = question_key_to_value.replace(/%KEY/g, `${keys[i]}`);
            let correct = map[keys[i]];
            let wrong = new Array();
            for (let j = 1; j < Math.min(4, keys.length); j++)
                wrong.push(map[keys[indices.pop()]]);
            return {
                statement: statement,
                correct: correct,
                wrong: wrong,
                course: course,
            }
        } else {
            let i = indices.pop();
            let statement = question_value_to_key.
                replace(/%VALUE/g, `${map[keys[i]]}`);
            let correct = keys[i];
            let wrong = new Array();
            for (let j = 1; j < Math.min(4, keys.length); j++)
                wrong.push(keys[indices.pop()]);
            return {
                statement: statement,
                correct: correct,
                wrong: wrong,
                course: course,
            }
        }
    }
}

// Create a random question asking to associate a key (French expression) to
// a value (expression in a Foreign language) using mapQuestion.
// - map: one-to-one map of expression from French to the language
// - language: foreign language studied e.g. "espagnol" or "anglais".
// (default is "langues").
function translationQuestion(map, language: string) {
    return mapQuestion(
        map,
        `Comment dit on "%KEY" en ${language} ?`,
        `Que signifie "%VALUE" en ${language} ?`,
        `Un peu de vocabulaire ${language}...`,
        `"%KEY" se dit "%VALUE"`,
    );
}

// Create a random question asking to associate a key (terminology) to a value
// (associated definition) using mapQuestion.
// - map: one-to-one map from terminology to definition.
function definitionQuestion(map) {
    return mapQuestion(
        map,
        `Comme d??finir le terme ?? %KEY ?? ?`,
        `?? quoi correspond la d??finition ?? %VALUE ?? ?`,
        `Quelques d??finitions...`,
        `%KEY : %VALUE`,
    );
}

// Create a random question asking to associate a key (historical date) to a
// value (event happening on that date) using mapQuestion.
// - map: one-to-one map from date to event.
// (default is "histoire").
function dateQuestion(map) {
    return mapQuestion(
        map,
        `Que s'est-il pass?? %KEY ?`,
        `Quand a eu lieu %VALUE ?`,
        `Quelques dates historiques...`,
        `%KEY : %VALUE`,
    );
}

// Create a random question asking for the number of mistakes.
// - text_with_mistakes: a text with mistakes.
// - mistake_count: the number of mistakes in the text.
function mistakeQuestions(text_with_mistakes: string, mistake_count: number) {
    function answer(c: number) { return `${c} erreur${c >= 2 ? 's' : ''}`; }
    let answer_count = 4;
    let correct = answer(mistake_count);
    return () => {
        let mistake_count_min = Math.max(0, getRandomArbitrary(mistake_count - answer_count, mistake_count + 1));
        let wrong = new Array();
        for (let c = mistake_count_min; c < mistake_count_min + answer_count; c++) {
            if (c != mistake_count)
                wrong.push(answer(c));
        }
        return {
            statement: `Combien d'erreurs comporte le texte suivant : ?? ${text_with_mistakes} ??`,
            correct: correct,
            wrong: wrong,
        }
    }
}

// This is an array of questions. Items correspond to increasing levels
// (Primaire, 6e, 5e, 4e and 3e) and is an object with the following structure:
//   - key: The field of the course. The values known by the game are:
//     "chimie",
//     "fran??ais"
//     "g??ographie"
//     "histoire"
//     "langues"
//     "maths",
//     "physique",
//     "svt"
//     (TODO: add more fields? add questions not related to school?)
//  - value: an array of functions returning a (possibly random) object. The
//    keys of that object are:
//     - statement: A string corresponding to the statement of the question.
//     - correct: A string corresponding to the correct answer to the question.
//     - wrong: An array of strings corresponding to wrong answers.
//     - course: An array of strings which teaches how to solve the question.
let questions = [
    { // Primaire
        "chimie": [
            () => {
                return {
                    statement: `Si on verse de l'huile dans de l'eau...`,
                    correct: `L'huile va flotter et former une couche au dessus de l'eau.`,
                    wrong: [`L'huile va couler et former une couche en dessous de l'eau.`,
                            `L'eau et l'huile vont se m??langer de fa??on homog??ne.`,
                            `De petite bulles d'huile vont se former ?? l'int??rieur de l'eau.`],
                    course: ["L'huile flotte au-dessus de l'eau car elle est moins dense."],
                }
            },
        ],
        "fran??ais": [
            mapQuestion(
                {
                    "Le Corbeau et le Renard" : "Tout flatteur vit aux d??pens de celui qui l?????coute.",
                    "Le Li??vre et la Tortue": "Rien ne sert de courir ; il faut partir ?? point",
                    "Le Lion et le Rat ": "On a souvent besoin d'un plus petit que soi.",
                    "Le Loup et l???Agneau": "La raison du plus fort est toujours la meilleure.",
                },
                "Quelle est la morale de la fable %KEY ?",
                "De quelle fable de La Fontaine est tir??e la morale '%VALUE' ?",
                "Quelques morales de fables de La Fontaine...",
                "%KEY : '%VALUE'",
            ),
            definitionQuestion({
                "bois": "substance dure et compacte des arbres",
                "boit": "conjugaison du verbe ?? boire ?? ?? la troisi??me personne du singulier, au pr??sent de l???indicatif.",
                "boa": "serpent vivant en Am??rique du sud.",
            }),
            mistakeQuestions(
                "J'ai manger deux d??licieuse paumes aujourd'hui.",
                3, // mang??, d??licieuseS, POMMES.
            ),
            mistakeQuestions(
                "Danses avec ton ami avant qu'elle ne parte.",
                2, // Danse, amiE.
            ),
        ],
        "g??ographie": [
            mapQuestion(
                {
                    "de la Turquie": "Ankara",
                    "de la Tha??lande": "Bangkok",
                    "de l'Australie": "Canberra",
                    "du S??n??gal": "Dakar",
                    "du Vi??t Nam": "Hano??",
                    "du Pakistan": "Islamabad",
                    "de la Jama??que": "Kingston",
                    "du Gabon": "Libreville",
                    "de l'Uruguay": "Montevideo",
                    "de l'Inde": "New Delhi",
                },
                "Quelle est la capitale %KEY ?",
                "De quel pays %VALUE est-elle la capitale ?",
                "Quelques m??tropoles mondiales...",
                "%VALUE est la capitale %KEY",
            ),
            mapQuestion(
                {
                    "du Canada": "Ottawa",
                    "de Ha??ti": "Port-au-Prince",
                    "de l'??quateur ": "Quito",
                    "de l'Arabie saoudite": "Riyad",
                    "de la Bosnie-Herz??govine": "Sarajevo",
                    "du Japon": "Tokyo",
                    "de l'Autriche": "Vienne",
                    "des ??tats-Unis": "Washington D.C.",
                    "du Cameroun": "Yaound??",
                    "de la Croatie": "Zagreb",
                },
                "Quelle est la capitale %KEY ?",
                "De quel pays %VALUE est-elle la capitale ?",
                "Quelques capitales de pays...",
                "%VALUE est la capitale %KEY",
            ),
            definitionQuestion({
                "??quateur": "ligne imaginaire qui partage la terre en 2 parties",
                "parall??le": "cercle imaginaire parall??le ?? l'??quateur",
                "m??ridien": "cercle fictif passant par les deux p??les de la Terre dont le plan est perpendiculaire ?? celui de l'??quateur",
                "longitude": "angle expression du positionnement ?? l'est ou ?? l'ouest du m??ridien de Greenwich",
                "lattitude": "angle expression du positionnement au nord ou au sud de l'??quateur",
            }),
        ],
        "histoire": [
            dateQuestion({
                "Autour du Ve si??cle av J.-C." : "la Gaule celtique",
                "Autour du Ier si??cle" : "l'empire romain",
                "Autour du Ve-VIe si??cle" : "R??gne de Clovis",
                "Autour du VIIe-VIIIe si??cle" : "R??gne de Charlemagne",
                "Autour du XVe-XVIe si??cle" : "La Renaissance",
                "Au XVIIe si??cle" : "Les lumi??res",
                "Au XVIIIe si??cle" : "la r??volution fran??aise",
                "Au XIXe si??cle" : "la r??volution industrielle",
            }),
        ],
        "langues": [
            translationQuestion({
                "manger": "to eat",
                "danser": "to dance",
                "acheter": "to buy",
                "donner": "to give",
                "lire": "to read",
                "apporter": "to bring",
                "sortir": "to go out",
                "dire": "to say",
                "savoir": "to know",
                "prendre": "to take",
            }, "anglais"),
            translationQuestion({
                "visage": "face",
                "t??te": "head",
                "pied": "foot",
                "bras": "arm",
                "main": "hand",
                "jambe": "leg",
                "torse": "chest",
            }, "anglais"),
            translationQuestion({
                "cheveux": "hairs",
                "bouche": "mouth",
                "nez": "nose",
                "oeil": "eye",
                "oreille": "ear",
            }, "anglais"),
            translationQuestion({
                "p??re": "father",
                "m??re": "mother",
                "fille": "daughter",
                "grand-p??re": "grandfather",
                "soeur": "sister",
                "neveu": "nephew",
                "tante": "aunt",
                "cousin": "cousin",
            }, "anglais"),
            translationQuestion({
                "maison": "house",
                "fen??tre": "window",
                "chemin??e": "chimney",
                "toit": "roof",
                "porte": "door",
                "cuisine": "kitchen",
                "chambre": "bedroom",
            }, "anglais"),
            translationQuestion({
                "assiette": "plate",
                "couteau": "knife",
                "cuill??re": "spoon",
                "fourchette": "fork",
                "table": "table",
                "verre": "glass",
            }, "anglais"),
        ],
        "maths": [
            () => {
                let v1 = getRandomArbitrary(100, 2000);
                let v2 = getRandomArbitrary(100, 2000);
                return {
                    statement: `Combien vaut ${v1} plus ${v2} ?`,
                    correct: `${v1 + v2}`,
                    wrong: [`${v1 + v2 - 10}`, `${v1 + v2 + 100}`, `${v1 + v2 - 100}`],
                }
            },
            () => {
                let v1 = getRandomArbitrary(10, 100);
                let v2 = getRandomArbitrary(10, 100);
                return {
                    statement: `Combien vaut ${v1} fois ${v2} ?`,
                    correct: `${v1 * v2}`,
                    wrong: [`${v1 * v2 + 200}`, `${v1 * v2 + 100}`, `${v1 * v2 - 100}`],
                }
            },
            () => {
                let v1 = getRandomArbitrary(10, 50);
                let v2 = getRandomArbitrary(100, 200);
                let v3 = v2 + (getRandomArbitrary(0, 11) - 5) * 10;
                let v4 = v2 + (getRandomArbitrary(0, 3) - 1) * 100;
                return {
                    statement: `Combien vaut ${v1 * v2} divis?? par ${v1} ?`,
                    correct: `${v2}`,
                    wrong: [v3 != v2 ? v3 : v2 - 10,
                            v4 != v2 ? v4 : v2 + 100,
                            v2 < v4 ? v4 - 10 : v4 + 10],
                }
            },
            () => {
                let n = getRandomArbitrary(1000, 2000);
                return {
                    statement: `Est-ce que ${n} est pair ?`,
                    correct: booleanToAnswer(n % 2 == 0),
                    wrong: [booleanToAnswer(n % 2 != 0), "Peut-??tre"],
                    course: ["Un nombre est pair si son dernier chiffre est 0, 2, 4, 6 ou 8.",
                             "Un nombre est impair si son dernier chiffre est 1, 3, 5, 7 ou 9."],
                }
            },
        ],
        "physique": [
            () => {
                return {
                    statement: `Combien de temps met la Terre pour effectuer un tour complet autour du Soleil ?`,
                    correct: `365 jours`,
                    wrong: [`24 heures`,
                            `1 mois`,
                            `2 ans`],
                    course: ["La Terre effectue un tour complet autour du Soleil en un an, soit environ 365 jours."],
                }
            },
            mapQuestion(
                {
                    "1??re" : "Mercure",
                    "2??me": "V??nus",
                    "3??me": "Terre",
                    "4??me": "Mars",
                    "5??me": "Jupiter",
                    "6??me": "Saturne",
                    "7??me": "Uranus",
                    "8??me": "Neptune",
              },
                "Quelle est la %KEY plan??te la plus proche du soleil ?",
                "Si on classe les plan??tes du syst??me solaire de la plus proche ?? la plus ??loign??e, quelle est la position de %VALUE ?",
                "Les 8 plan??tes du syst??me solaire de la plus proche ?? la plus ??loign??e",
                "%KEY : '%VALUE'",
            ),
        ],
        "svt": [
            definitionQuestion({
                "cerveau": "Organe charg?? de g??rer l'ensemble des fonctions corporelles par l'envoi de signaux nerveux.",
                "coeur" : "Organe charg?? du pompage du sang dans tout le corps.",
                "poumon": "Organe charg?? d'obtenir de l'oxyg??ne de l'environnement tout en ??liminant le dioxyde de carbone.",
                "estomac": "Organe charg?? de la digestion des aliments.",
            }),
        ],
    },
    { // 6e
        "chimie": [
            mapQuestion(
                {
                    "Une flamme" : "Hautement inflammable.",
                    "Une croix": "Nocif.",
                    "Une t??te de mort": "Toxique.",
                    "Tube ?? essai dont les gouttes tombent en faisant des trous dans une main et un rectangle.": "Corrosif.",
                    "Arbre et poisson morts": "Dangereux pour l'environnement.",
                },
                "Sur l'??tiquette d'une substance chimique, que signifie le pictogramme '%KEY' ?",
                "Comment est repr??sent?? l'avertissement '%VALUE' sur l'??tiquette d'une substance chimique ?",
                "Quelques pictogrammes de danger des substances chimiques...",
                "%KEY : '%VALUE'",
            ),
        ],
        "fran??ais": [
            () => {
                let v1 = getRandomArbitrary(100, 2000);
                let v2 = getRandomArbitrary(100, 2000);
                return {
                    statement: `L'Illiade raconte les ??v??n??nements pendant`,
                    correct: `La guerre de Troie`,
                    wrong: [`L'apog??e d'Ath??nes`,
                            `La guerre du P??loponn??se`,
                            `Le r??gne d'Alexandre le Grand`],
                    course: ["L'Illiade est une ??pop??e attribu??e ?? Hom??re se d??roulant pendant la guerre de Troie",
                             "Les Ach??ens venus de toute la Gr??ce affrontent les Troyens et leurs alli??s",
                             "chaque camp ??tant soutenu par diverses divinit??s comme Ath??na, Pos??idon ou Apollon."],
                }
            },
            mapQuestion(
                {
                    "L'avare" : "Il faut manger pour vivre et non pas vivre pour manger.",
                    "Le Bourgeois gentilhomme": "Il y a plus de quarante ans que je dis de la prose sans que j'en susse rien",
                    "Les Fourberies de Scapin": "Que diable allait-il faire dans cette gal??re ?",
                    "Tartuffe ": "Couvrez ce sein que je ne saurais voir",
                },
                "Quelle citation de Moli??re est tir??e de la pi??ce '%KEY' ?",
                "De quelle pi??ce de Moli??re est tir??e la citation '%VALUE' ?",
                "Quelques citations de pi??ce de Moli??re...",
                "%KEY : '%VALUE'",
            ),
            definitionQuestion({
                "porc": "cochon",
                "pore": "ouverture imperceptible dans la peau",
                "port": "endroit o?? les bateaux abordent",
            }),
            definitionQuestion({
                "cent": "Num??ral cardinal qui contient 10 fois 10.",
                "sang": "Liquide rouge qui circule dans les art??res et les veines des hommes et animaux y entretenant la vie.",
                "sans": "Pr??position marquant l???absence, le manque, l???exclusion d???une personne ou d???une chose.",
                "sent": "conjugaison du verbe ?? sentir ?? ?? la troisi??me personne du singulier, au pr??sent de l???indicatif.",
            }),
        ],
        "g??ographie": [
            definitionQuestion({
                "amont": "Partie d'un cours d'eau comprise entre un lieu d??termin?? et sa source.",
                "aval" : "Partie d'un cours d'eau comprise entre un lieu d??termin?? et son embouchure.",
                "confluent": "Point de rencontre de 2 cours d'eau.",
                "rivi??re": "Cours d'eau qui rejoint un fleuve.",
                "fleuve": "Cours d'eau d??bouchant dans une mer.",
            }),
            definitionQuestion({
                "relief": "Ensemble des in??galit??s de la surface de la terre.",
                "presqu'??le": "Terre reli??e au continent par une ??troite bande de terre.",
                "littoral": "Bande de terre plus ou moins large qui borde la mer ou l'oc??an.",
                "plateau": "Relief plus ou moins plan, dans lequel les vall??es sont encaiss??es.",
                "plaine": "Etendue plus ou moins plane, dans lequel les vall??es ne sont pas encaiss??es.",
            }),
            definitionQuestion({
                "bidonville": "Quartier d'une ville construit avec des mat??riaux de r??cup??ration.",
                "urbain": "De la ville.",
                "rural": "Des campagnes.",
                "m??tropole": "Tr??s grande agglom??ration qui commande et qui dirige.",
                "ghetto": "Quartier de ville dans lequel se rassemble une population partageant des caract??res communs (langue, religion, pauvret??).",
                "exode rural": "d??part des habitants des campagnes vers les villes.",
            }),
            definitionQuestion({
                "Esp??rance de vie": "nombre moyen d'ann??es de vie d'une population.",
                "PNB": "richesses produites par un pays en une ann??e.",
                "densit?? de population": "Nombre d'habitants qui vivent en moyenne sur 1 kilom??tre carr??.",
                "accroissement naturel": "diff??rence entre le nombre de naissances et de d??c??s.",
                "contraintes naturelles": "Ensemble des ??l??ments naturels qui font obstacle ?? l'installation des hommes dans un lieu.",
            }),
        ],
        "histoire": [
            dateQuestion({
                "vers ???3500" : "l'apparition des premi??res ??critures",
                "?? partir de ???10000" : "la s??dentarisation et les d??buts de l???agriculture",
                "au VIII??me si??cle av. J.-C." : "la r??daction des oeuvres d'Hom??re et la fondation de Rome",
                "du VII??me si??cle av. J.-C. au d??but de notre ??re" : "la r??daction de la Bible",
            }),
            dateQuestion({
                "au V??me si??cle av. J.-C." : "l'apog??e d'Ath??nes au temps de P??ricl??s",
                "du Ier au II??me si??cle": "la paix romaine",
                "du Ier au IV??me si??cle": "les d??buts du christianisme",
                "du II??me si??cle av. J.-C. au II??me si??cle ap. J.-C.": "la Chine des Han",
            }),
        ],
        "langues": [
            mistakeQuestions(
                "He go to cinema with her girlfriend.",
                3, // He goES, to THE cinema, HIS.
            ),
            mistakeQuestions(
                "She teached me music two year ago.",
                2, // taught, yearS.
            ),
        ],
        "maths": [
            () => {
                let n = getRandomArbitrary(1000, 2000);
                return {
                    statement: `Est-ce que ${n} est divisible par 3 ?`,
                    correct: booleanToAnswer(n % 3 == 0),
                    wrong: [booleanToAnswer(n % 3 != 0), "Peut-??tre"],
                    course: ["Un nombre est divisible par 3 si et seulement si la somme de ses chiffres est divisible par 3.",
                             "Par exemple 1234 est n'est pas divisible par 3 car 1 + 2 + 3 + 4 = 10 n'est pas divisible par 3.",
                             "Mais 1236 est divisible par 3 car 1 + 2 + 3 + 6 = 12 = 3 ?? 4 est divisible par 3."],
                }
            },
            () => {
                let v1 = getRandomArbitrary(10, 50);
                let v2 = getRandomArbitrary(100, 200);
                let remainder = getRandomIndices(v1);
                return {
                    statement: `Quel est le reste de la division euclidienne de ${v1 * v2 + remainder[0]} par ${v1} ?`,
                    correct: `${remainder[0]}`,
                    wrong: [`${remainder[1]}`, `${remainder[2]}`, `${remainder[3]}`],
                }
            },
        ],
        "physique": [
            () => {
                return {
                    statement: `L'alternance des saisons est expliqu??e par :`,
                    correct: `L'inclinaison de l'axe des p??les et la r??volution de la Terre autour du Soleil.`,
                    wrong: [`La trajectoire elliptique de la Terre autour du soleil et la distance qui les s??parent.`,
                            `La rotation de la Terre sur elle-m??me.`,
                            `La r??lection de la lumi??re solaire par la Lune.`,
                            `Les variations de temp??rature du Soleil au cours du temps.`],
                    course: ["Les saisons sont dues ?? l'inclinaison de l'axe des p??les, combin??e ?? la r??volution de la Terre autour du Soleil",
                             "causant une variation d'ensoleillement induite par l'orientation changeante vis-??-vis du rayonnement solaire"],
                }
            },
            definitionQuestion({
                "masse": "quantit?? de mati??re d'un corps exprim??e en kilogrammes",
                "volume" : "espace occup?? par un corps exprim?? en m??tre cube",
                "litre": "unit?? de volume correspondant ?? un 1 d??cim??tre cube",
                "poids": " force de la pesanteur exprim??e en newton",
            }),
            definitionQuestion({
                "solidification": "passage de l'??tat liquide ?? solide",
                "fusion" : "passage de l'??tat solide ?? liquide",
                "vaporisation" : "passage de l'??tat liquide ?? gaz",
                "liqu??faction" : "passage de l'??tat gaz ?? liquide",
                "condensation" : "passage de l'??tat gaz ?? solide",
                "sublimation" : "passage de l'??tat solide ?? gaz",
            }),
            () => {
                let v = getRandomArbitrary(50, 120);
                return {
                    statement: `En 2 heures et demi, quelle distance parcourt une voiture roulant ?? ${v} km/h ?`,
                    correct: `${2.5 * v} km`,
                    wrong: [`${(2*getRandomArbitrary(3, 5) + 1) * .5 * v} km`,
                            `${getRandomArbitrary(1, 4) * v} km`,
                            `${(2*getRandomArbitrary(0, 2) + 1) * .5 * v} km`],
                }
            },
        ],
        "svt": [
            definitionQuestion({
                "membrane": "lame mince s??parant l'int??rieur d'une cellule de l'environnement ext??rieur",
                "cytoplasme": "milieu rencontr?? ?? l'int??rieur des cellule",
                "noyau": "structure cellulaire  contenant l'essentiel du mat??riel g??n??tique",
                "unicellulaire": "??tre qui ne poss??de qu'une seule cellule",
                "spore": "organe de dispersion et de multiplication caract??ristique du r??gne v??g??tal",
            }),
        ],
    },
    { // 5e
        "chimie": [
            mapQuestion(
                {
                    "le sucre": "le solut??",
                    "l'eau": "le solvant",
                    "l'eau sucr??e": "la solution",
                    "l'eau sucr??e qui ne dissout plus le sucre": "la solution satur??e",
                },
                "On m??lange du sucre et de l???eau. Comme appelle t'on %KEY ?",
                "On m??lange du sucre et de l???eau. Qu'est-ce que %VALUE ?",
                "Quelques concepts de dissolution dans l'eau",
                "%KEY est appel??e %VALUE",
            ),
            mapQuestion(
                {
                    "Solution quelconque": "0 ??? pH ??? 14",
                    "Solution acide": "0 ??? pH < 7",
                    "Solution basique": "7 < pH ??? 14",
                    "Solution neutre": "pH = 0",
                },
                `A quel pH correspond une %KEY`,
                `?? quel type de solution correspond %VALUE`,
                `D??finition du pH d'une solution...`,
                `%KEY : %VALUE`,
            ),
            definitionQuestion({
                "corps pur": "substance compos??e d'une seule esp??ce chimique",
                "m??lange" : "substance compos??e de plusieurs esp??ces chimiques",
                "m??lange homog??ne": "m??lange pour lequel on ne distingue pas les constituants",
                "m??lange h??t??rog??ne": "m??lange pour lequel on distingue les constituants",
                "liquides miscibles / liquide et solide solubles": "liquides qui donnent un m??lange homog??nes",
                "liquides non-miscibles / liquide et solide insolubles": "qui donnent un m??lange h??t??rog??ne",
                "solubilit??": "masse maximale de solide qu'on peut dissoudre dans un litre de solvant",
            }),
        ],
        "fran??ais": [
            () => {
                return {
                    statement: `Quelle oeuvre n'est pas tir??e de la litt??rature du moyen-??ge ?`,
                    correct: `Don Quichotte`,
                    wrong: [`La Chanson de Roland`,
                            `Perceval ou le Conte du Graal`,
                            `Tristan et Yseult`],
                    course: ["Don Quichotte est roman ??crit par Miguel de Cervantes publi?? au d??but du XVIIe si??cle, parodie des m??urs m??di??vales et de l'id??al chevaleresque."],
                }
            },
            definitionQuestion({
                "au": " Contraction de ?? ?? le ??. ",
                "eau": "Liquide consomm?? en tant que boisson.",
                "haut": "qui a une certaine dimension dans le sens vertical.",
                "os": "Organe dur et solide qui constitue la charpente des hommes et des vert??br??s.",
            }),
            definitionQuestion({
                "compte": "Etat ou autre ??crit comprenant l?????num??ration, le calcul et autres supputations de ce qui a ??t?? re??u et d??pens??.",
                "comte": "Titre de noblesse qui vient au-dessous de celui du marquis.",
                "conte": "court r??cit d???aventures imaginaires, soit vraisemblable, soit merveilleux.",
            }),
            definitionQuestion({
                "bal": "Assembl??e o?? l???on danse.",
                "b??le": "Ville de Suisse.",
                "balle": "Petite sph??re qui rebondit, utilis??e dans certains jeux.",
            }),
        ],
        "g??ographie": [
            definitionQuestion({
                "Agriculture biologique": "syst??me de culture qui n???utilise pas de pesticides ou d???engrais chimiques.",
                "Agriculture durable": "Agriculture qui r??pond aux besoins des populations actuelles sans compromettre la capacit?? des populations futures ?? r??pondre aux leurs.",
                "Agriculture productiviste": "Agriculture qui cherche une production maximale et des rendements ??lev??s en utilisant les techniques les plus efficaces (machines, engrais, pesticides, OGM???).",
                "Agriculture vivri??re": "Agriculture destin??e ?? nourrir les paysans qui la produisent.",
            }),
            definitionQuestion({
                "Pays d??velopp??": "Pays riche o?? la majorit?? de la population a acc??s ?? tous ses besoins vitaux ainsi qu????? un certain confort.",
                "Pays du nord": "ensemble des pays riches et d??velopp??s, situ??s principalement dans l???h??misph??re nord",
                "Pays du sud": "ensemble des pays pauvres et en d??veloppement, situ??s au sud de l???Am??rique du Nord et de l???Europe.",
                "Pays ??mergent": "Pays connaissant une croissance ??conomique forte mais dont le niveau de d??veloppement de la population est encore faible.",
                "Pays enclave??" : "pays qui n???a pas acce??s a?? la mer.",
            }),
        ],
        "histoire": [
            dateQuestion({
                "en 622" : "l'H??gire",
                "en 800" : "le sacre de Charlemagne",
                "en 987" : "le couronnement et sacre d'Hugues Capet",
                "en 1054" : "le schisme des ??glises d'Orient et d'Occident",
                "entre 1096 et 1099" : "la premi??re croisade",
            }),
            dateQuestion({
                "en 1204" : "le sac de constantinople",
                "en 1214" : "la bataille de Bouvines",
                "en 1453" : "la prise de constantinople",
                "entre 1337 et 1453" : "la Guerre de Cent Ans",
            }),
            dateQuestion({
                "en 1492" : "le premier voyage de Christophe Colomb",
                "en 1598" : "l'??dit de Nantes",
                "en 1517" : "les 95 th??ses de Luther",
                "entre 1661 et 1715" : "le r??gne de Louis XIV",
            }),
        ],
        "langues": [
            translationQuestion({
                "manger": "comer",
                "danser": "bailar",
                "acheter": "comprar",
                "donner": "dar",
                "lire": "leer",
                "apporter": "traer",
                "sortir": "salir",
                "dire": "decir",
                "savoir": "saber",
                "prendre": "tomar",
            }, "espagnol"),
            translationQuestion({
                "visage": "cara",
                "t??te": "cabeza",
                "pied": "pie",
                "bras": "brazo",
                "main": "mano",
                "jambe": "pierna",
                "torse": "torso",
            }, "espagnol"),
            translationQuestion({
                "cheveux": "cabello",
                "bouche": "boca",
                "nez": "nariz",
                "oeil": "ojo",
                "oreille": "oreja",
            }, "espagnol"),
            translationQuestion({
                "p??re": "padre",
                "m??re": "madre",
                "fille": "hija",
                "grand-p??re": "abuelo",
                "soeur": "hermana",
                "neveu": "sobrino",
                "tante": "t??a",
                "cousin": "primo",
            }, "espagnol"),
            translationQuestion({
                "maison": "casa",
                "fen??tre": "ventana",
                "chemin??e": "chimenea",
                "toit": "techo",
                "porte": "puerta",
                "cuisine": "cocina",
                "chambre": "habitaci??n",
            }, "espagnol"),
            translationQuestion({
                "assiette": "plato",
                "couteau": "cuchillo",
                "cuill??re": "cuchara",
                "fourchette": "tenedor",
                "table": "mesa",
                "verre": "vaso",
            }, "espagnol"),
            mistakeQuestions(
                "Me gusta mucho las mansanas rojas.",
                2, // Me gustaN, manZanas
            ),
            mistakeQuestions(
                "El espera su amigo por ir a la playa con ella.",
                4, // ??l, A su, amigA, para.
            ),
            mistakeQuestions(
                "He has become a new person since he left her.",
                0,
            ),
        ],
        "maths": [
            () => {
                let v1 = getRandomArbitrary(-10, -1);
                let v2 = getRandomArbitrary(-10, 11);
                if (Math.random() < .5) [v1, v2] = [v2, v1];
                return {
                    statement: `Combien vaut ${v1} plus ${v2} ?`,
                    correct: `${v1 + v2}`,
                    wrong: [`${v1 - v2}`, `${-v1 - v2}`, `${v2 - v1}`],
                }
            },
            () => {
                let v1 = getRandomArbitrary(-10, -1);
                let v2 = getRandomArbitrary(-10, 11);
                if (Math.random() < .5) [v1, v2] = [v2, v1];
                return {
                    statement: `Combien vaut ${v1} moins ${v2} ?`,
                    correct: `${v1 - v2}`,
                    wrong: [`${v1 + v2}`, `${-v1 - v2}`, `${v2 - v1}`],
                }
            },
        ],
        "physique": [
            mapQuestion(
                {
                    "une pile": "deux barres parall??les (l'une grosse et courte, l'autre fine et longue)",
                    "une r??sistance": "un rectangle",
                    "une connexion": "un point",
                    "un interrupteur": "un segment qui s'ouvre ou se ferme tel un portail",
                    "une lampe": "un rond avec une croix ?? l'int??rieur",
                    "une diode": "un triangle avec une barre",
                    "une diode ??lectro-luminescente": "un triangle avec une barre et des fl??ches",
                    "un moteur": "un rond avec la lettre M ?? l'int??rieur",
                },
                "Dans un circuit ??lectrique, comment repr??sente-t-on %KEY ?",
                "Dans un circuit ??lectrique, la repr??sentation d'%VALUE est...",
                "Comment sch??matiser les composants d'un circuit ??lectrique",
                "on repr??sente %KEY par %VALUE",
            ),
            () => {
                let v1 = getRandomArbitrary(1, 10) * 10**(getRandomArbitrary(6, 8));
                let v2 = v1 * 0.001 * 0.001;
                return {
                    statement: `?? quoi est ??gale ${v1} millilitres ?`,
                    correct: `${v2} m??tres cube.`,
                    wrong: [`${v2 * (Math.random() < .5 ? 0.1 : 10)} m??tres cube`,
                            `${v2 * (Math.random() < .5 ? 0.01 : 100)} m??tres cube`,
                            `${v1} d??cim??tres cube`],
                    course: ["1 d??cim??tre est ??gal ?? 0.1 m??tre.",
                             "1 d??cim??tre cube est ??gal ?? 0.001 m??tre cube.",
                             "1 d??cim??tre cube est ??gal ?? 1 litre.",
                             "1 millilitre est ??gal ?? 0.001 litre.",
                            ],
                }
            },
        ],
        "svt": [
            definitionQuestion({
                "enzymes": "mol??cules produites par les organes digestifs permettant la fabrication de nutriments ?? partir des aliments",
                "synapse" : "r??gion d'interaction entre deux cellules nerveuses par laquelle passe un message chimique",
                "branchie": "organe respiratoire des animaux aquatiques",
                "chloroplaste": "organite sp??cifique des cellules v??g??tales, lieu de la photosynth??se",
            }),
        ],
    },
    { // 4e
        "chimie": [
            mapQuestion(
                {
                    "d'hydrog??ne": "H",
                    "de carbone": "C",
                    "d'azote": "N",
                    "d'oxyg??ne": "O",
                    "de soufre": "S",
                    "de chlore": "Cl",
                },
                "Quelle est le symbole de l'atome %KEY ?",
                "%VALUE est le symbole de l'atome... ",
                "Quelques symboles d'atomes",
                "%VALUE est le symbole de l'atome %KEY",
            ),
            mapQuestion(
                {
                    "de dioxyg??ne": "O2",
                    "de l'eau": "H2O",
                    "de dioxyde de carbone": "CO2",
                    "de m??thane": "CH4",
                    "de diazote": "N2",
                    "de chlorure de m??thyle": "CH3Cl",
                    "de dioxyde de soufre": "SO2",
                },
                "Quelle est la formule de la mol??cule %KEY ?",
                "%VALUE est la formule de  la mol??cule... ",
                "Quelques formules chimiques",
                "%VALUE est la formule de la mol??cule %KEY",
            ),
            mapQuestion(
                {
                    "diazote": "environ 78%",
                    "dioxyg??ne": "environ 21%",
                    "dioxyde de carbone": "environ 0,04%",
                    "gaz rares (argon, n??on, ...)": "moins de 1%",
                },
                "Quelle est le pourcentage de %KEY dans l'air ?",
                "Quel gaz de l'air correspond au pourcentage '%VALUE' ?",
                "Composition de l'air",
                "%KEY: %VALUE",
            ),
        ],
        "fran??ais": [
            mapQuestion(
                {
                    "Descriptif" : "C???est un roc ! ??? c???est un pic ! ??? c???est un cap ! Que dis-je, c???est un cap ? ??? C???est une p??ninsule !",
                    "Gracieux" : "Aimez-vous ?? ce point les oiseaux Que paternellement vous vous pr??occup??tes De tendre ce perchoir ?? leurs petites pattes ?",
                    "P??dant" : "L???animal seul, monsieur, qu???Aristophane Appelle Hippocamp??l??phantocam??los Dut avoir sous le front tant de chair sur tant d???os !",
                    "Cavalier" : "Quoi, l???ami, ce croc est ?? la mode ? Pour pendre son chapeau, c???est vraiment tr??s commode !",
                    "Dramatique" : "C???est la Mer Rouge quand il saigne !",
                    "Admiratif" : "Pour un parfumeur, quelle enseigne !",
                },
                "Quel ??nonc?? correspond ?? la description '%KEY' dans la tirade du Nez de Cyrano de Bergerac ?",
                "Quelle description correspond ?? l'??nonc?? ?? %VALUE ?? dans la tirade du Nez de Cyrano de Bergerac ?",
                "Quelques extraits de la tirade du nez de la pi??ce de th????tre Cyrano de Bergerac...",
                "%KEY : ?? %VALUE ??",
            ),
            mapQuestion(
                {
                    "L'Albatros": "Exil?? sur le sol au milieu des hu??es, Ses ailes de g??ant l'emp??chent de marcher.",
                    "L'Invitation au voyage ": "L??, tout n???est qu???ordre et beaut??, Luxe, calme et volupt??.",
                    "Le Balcon": "- ?? serments ! ?? parfums ! ?? baisers infinis !",
                    "Le serpent qui danse": "Je crois boire un vin de boh??me, Amer et vainqueur, Un ciel liquide qui pars??me D?????toiles mon c??ur !",
                    "Spleen (Quand le ciel bas...)": "l'Espoir, Vaincu, pleure, et l'Angoisse atroce, despotique, Sur mon cr??ne inclin?? plante son drapeau noir",
                    "Une charogne": "Alors, ?? ma beaut??! dites ?? la vermine Qui vous mangera de baisers, Que j???ai gard?? la forme et l???essence divine De mes amours d??compos??s!",
                    "?? une Passante": "Car j'ignore o?? tu fuis, tu ne sais o?? je vais, ?? toi que j'eusse aim??e, ?? toi qui le savais !",
                },
                "Quels sont les derniers vers du po??me '%KEY' des fleurs du mal ?",
                "De quel po??me de Baudelaire sont tir??s les vers ?? %VALUE ?? ?",
                "Quelques citations des fleurs du mal de Charles Baudelaire...",
                "%KEY : ?? %VALUE ??",
            ),
            definitionQuestion({
                "shah": "Titre que les Europ??ens donnent au souverain de la Perse.",
                "chas": "Trou d???une aiguille par lequel on passe le fil.",
                "chat": "Animal domestique carnassier de la famille des f??lins.",
            }),
            definitionQuestion({
                "p??re": "Celui qui a un ou plusieurs enfants.",
                "paire": "Deux choses de m??me esp??ce, qui vont ou n??cessairement ou ordinairement ensemble.",
                "pair": "Qui est ??gal, semblable, pareil.",
                "pers": "D'une couleur entre le vert et le bleu.",
                "perds": "conjugaison du verbe ?? perdre ?? ?? la deuxi??me personne du singulier, au pr??sent de l???indicatif.",
            }),
            definitionQuestion({
                "boue": "Fange des rues et des chemins.",
                "bous": "conjugaison du verbe ?? bouillir ?? ?? la deuxi??me personne du singulier, au pr??sent de l???indicatif.",
                "bout": "Extr??mit?? d???un corps, d???un espace.",
            }),
        ],
        "g??ographie": [
            definitionQuestion({
                "Tourisme de masse": "type de tourisme que l???on trouve dans des espaces ame??nage??s pour accueillir un grand nombre de voyageurs, a?? des prix abordables.",
                "Tourisme international": "tourisme pratique?? en dehors du pays de re??sidence.",
                "Tourisme vert": "tourisme centre?? sur la de??couverte et le respect de l???environnement",
                "Tourisme durable": "tourisme  proposant des activit??s qui m??nagent les ??quilibres ??conomiques, sociaux  et environnementaux.",
                "Tourisme ??quitable" : "forme de tourisme favorisant l???am??lioration des conditions de vie des communaut??s locales.",
            }),
            definitionQuestion({
                "Taux d?????volution de la population" : "mesure de l???accroissement global de la population",
                "Taux de f??condit??" : "nombre moyen d???enfants par femme.",
                "Taux de pauvret??" : "part de la population vivant avec moins de 1,90 $ par jour selon l???ONU.",
                "Taux d???urbanisation" : "part de la population d???un pays qui habite dans un espace urbain.",
            }),
        ],
        "histoire": [
            dateQuestion({
                "entre 1751 et 1772": "l'??dition de l'Encyclop??die",
                "entre 1670 et 1750" : "l'essor de la traite n??gri??re",
                "en 1789" : "le d??but de la r??volution fran??aise",
                "entre 1799 et 1815" : "le r??gne de Napol??on Bonaparte",
            }),
            dateQuestion({
                "entre f??vrier et juillet 1848" : "le Printemps des peuples",
                "en avril 1848" : "la seconde abolition de l'esclavage",
                "en mars 1848" : "l'instauration du suffrage universel masculin",
                "entre 1870 et 1880" : "le d??but de la seconde r??volution industrielle",
                "en septembre 1870" : "la naissance de la IIIe r??publique",
            }),
            dateQuestion({
                "en 1882" : "l'instauration de l'??cole gratuite, la??que et obligatoire",
                "entre 1870 et 1914" : "la 2nde mondialisation et relance de la colonisation",
                "entre 1894 et 1906" : "l'affaire Dreyfus",
                "en 1900" : "l'exposition universelle de Paris",
                "en 1905" : "la loi de s??paration des ??glises et de l'??tat",
            }),
        ],
        "langues": [
            mistakeQuestions(
                "I have visited Paris last year. There was many tourists.",
                2, // I visited. There were.
            ),
            mistakeQuestions(
                "These two mans are the most nice people I have ever meeted.",
                3, // men, nicest, met
            ),
            mistakeQuestions(
                "She do not seem very young. How old is she?",
                1, // does
            ),
        ],
        "maths": [
            () => {
                let v1 = getRandomArbitrary(-10, -1);
                let v2 = getRandomArbitrary(-10, 11);
                if (Math.random() < .5) [v1, v2] = [v2, v1];
                return {
                    statement: `Combien vaut ${v1} fois ${v2} ?`,
                    correct: `${v1 * v2}`,
                    wrong: [`${-v1 * v2}`, `${v1 + v2}`, `${v1 - v2}`],
                }
            },
            () => {
                let q = getRandomArbitrary(4, 10); // between 4 and 9
                let p = getRandomArbitrary(q + 2, q + 6); // between 6 and 14
                let a = p**2 - q**2; // >= 2q + 1 >= 10 and <= p^2 <= 196
                let b = 2*p*q; // Between 48 and 252.
                let c = p**2 + q**2; // >= Between 52 and 277.
                let sizes = [a, b, c];
                let unknown_index = getRandomArbitrary(0, 3);
                let shift = new Array();
                for (let i = 1; i <= 7; i++) {
                    shift.push(i)
                    shift.push(-i);
                }
                let indices = getRandomIndices(shift.length);
                let sizes_in_cm = new Array();
                for (let i = 0; i < 3; i++)
                    sizes_in_cm.push(`${(sizes[i])/10}cm`);
                let correct = sizes_in_cm[unknown_index];
                sizes_in_cm[unknown_index] = "?cm";
                let wrong = new Array();
                for (let i = 0; i < 3; i++)
                    wrong.push(`${(sizes[unknown_index] + shift[i])/10}cm`);
                return {
                    statement: `Quel est le cot?? manquant du triangle ABC rectangle en A tel que BC=${sizes_in_cm[0]} AC=${sizes_in_cm[1]}, AB=${sizes_in_cm[2]}.`,
                    correct: correct,
                    wrong: wrong,
                    course: ["Dans un triangle rectangle, le carr?? de l???hypot??nuse est ??gal ?? la somme des carr??s des deux autres c??t??s."],
                }
            },
            () => {
                let A = getRandomArbitrary(2, 5);
                let B = getRandomArbitrary(A + 1, 10);
                let d = gcd(A, B);
                let f = getRandomArbitrary(2, 5);
                A *= f;
                B *= f;
                d *= f;
                return {
                    statement: `Quelle est la forme irr??ductible de la fraction ${A}/${B}`,
                    correct: `${A/d}/${B/d}`,
                    wrong: [`${A}/${B}`, A > d ? `${A/d - 1}/${B/d}` : `${A/d + 1}/${B/d}`, d > f ?  `${A/f}/${B/f}` : `${A/d + 2}/${B/d}`],
                    course: ["Une fraction est irr??ductible si on ne peut pas diviser son num??rateur et son d??nominateur par un m??me nombre.",
                             `Par exemple ${A}/${B} n'est pas irr??ductible car on peut diviser ${A} et ${B} par ${d}.`,
                             `On obtien ${A/d}/${B/d} qui est une fraction irr??ductible.`]
                }
            },
            () => {
                let AM = getRandomArbitrary(2, 5);
                let AB = getRandomArbitrary(AM + 1, AM + 5);
                let AC = getRandomArbitrary(AB + 1, AB + 5);

                let AN = Math.round(100 * AC * AM / AB);
                let shift = new Array();
                for (let i = 1; i <= 5; i++) { shift.push(i); shift.push(-i); }
                let indices = getRandomIndices(shift.length);
                return {
                    statement: `Soit ABC un triangle, M un point de [AB] et N un point de [AC]. Si (MN) est parall??le ?? (BC), AB=${AB}cm, AC=${AC}cm et AM=${AM}cm quel est la meilleure valeur approch??e de AN ?`,
                    correct: `${AN/100}`,
                    wrong: [`${(AN+shift[indices.pop()])/100}`, `${(AN+shift[indices.pop()])/100}`, `${(AN+shift[indices.pop()])/100}`],
                };
            }
        ],
        "physique": [
            () => {
                let I = getRandomArbitrary(2, 10);
                let R = getRandomArbitrary(100, 200);
                return {
                    statement: `Quelle est la tension aux bornes d'un conducteur ohmique de r??sistance ${R}?? travers?? par un courant de ${I}A ?`,
                    correct: `${I * R} V`,
                    wrong: [`${R *(I**2)/2} V`, `${2 * I * R} V`, `${I + R} V`],
                    course: ["La loi d'ohm est U = R.I",
                             "o?? U est la tension en volts",
                             "o?? R est la r??sistance en ohms",
                             "et I l'intensit?? en amp??re."],
                }
            },
            mapQuestion(
                {
                    "vitesse de la lumi??re dans le vide": "300 000 km/s",
                    "vitesse du son dans l'air": "340 m/s",
                    "vitesse du son dans l'eau": "1 500 m/s",
                    "vitesse de la lumi??re dans l'eau": "225 000 km/s",
                },
                "Quelle est la %KEY ?",
                "A quoi correspond %VALUE ?",
                "Quelques vitesses du son et de la lumi??re",
                "La %KEY est de %VALUE",
            ),
        ],
        "svt": [
            definitionQuestion({
                "magma": "mat??riau se formant ?? l'int??rieur de la Terre et forme une roche en refroidissant.",
                "dorsales oc??aniques": "cha??nes de montagnes sous-marines form??es le long des zones de divergence des plaques tectoniques",
                "plaque tectonique": "fragment de l'enveloppe rigide de la surface de la Terre",
                "volcan": "structure g??ologique qui r??sulte de la mont??e d'un magma puis de l'??ruption de mat??riaux",
                "subduction": "processus par lequel une plaque tectonique oc??anique s'incurve et plonge sous une autre plaque",
                "lave en coussin": "roche ??mise par un volcan sous-marin lors d???une ??ruption",
                "s??isme": "secousse du sol r??sultant de la lib??ration brusque d'??nergie accumul??e par les contraintes exerc??es sur les roches",
            })
        ],
    },
    { // 3e et plus.
        "chimie": [
            mapQuestion(
                {
                    "Cl -": "chlorure",
                    "Fe 2+": "fer II",
                    "Na +": "sodium",
                    "SO4 2-": "sulfate",
                    "Fe 3+": "fer III",
                    "Cu 2+": "cuivre II",
                    "Al 3+": "aluminium",
                    "NO3 -": "nitrate",
                    "Zn 2+": "zinc",
                    "HO -": "hydroxyde",
                    "H +": "hydrog??ne",
                    "K +": "potassium",
                    "MnO4 -": "permanganate",
                    "F -": "fluorure",
                    "NH4 +": "ammonium",
                },
                "Quel est le nom de l'ion de formule chimique %KEY ?",
                "Quelle est la formule chimique de l'ion %VALUE",
                "Quelques formules de ions",
                "%KEY est la formule de l'ion %VALUE",
            ),
            () => {
                return {
                    statement: `Laquelle de ces formules correspond ?? une r??action acido-basique ?`,
                    correct: `2H+ + Fe ??? H2 + Fe2+`,
                    wrong: [`3 Fe + 2 O2 ??? Fe3 O4`,
                            `H+ + Fe ??? H2 + Fe2+`,
                            `3H+ + Fe ??? H2 + Fe3+`],
                }
            },
        ],
        "fran??ais": [
            mapQuestion(
                {
                    "Aim?? C??saire": "car il n'est point vrai que l'oeuvre de l'homme est finie que nous n'avons rien ?? faire au monde que nous parasitons le monde",
                    "Apollinaire": "Hommes de l???avenir souvenez-vous de moi Je vivais ?? l?????poque o?? finissaient les rois",
                    "Jacques Pr??vert": "Et pourquoi donc j'ai tu?? ce pauvre imb??cile, Maintenant les autres vont me pourchasser en motogodille",
                    "Robert Desnos": "J???ai tant r??v?? de toi que tu perds ta r??alit??.",
                },
                "Quel texte a ??t?? ??crit par %KEY ?",
                "Qui a ??crit ?? %VALUE ?? ?",
                "Quelques citations d'auteurs du XXe si??cle :",
                "%KEY : ?? %VALUE ??",
            ),
            definitionQuestion({
                "vair": "D??signait une fourrure blanche et grise.",
                "ver": "Animal rampant, dont le corps est long et sans articulation.",
                "verre": "R??cipient servant ?? recueillir une boisson et ?? la boire.",
                "vert": "Couleur qui est celle de l???herbe.",
                "vers": "Dans un po??me d??signe une ligne, qui est rythm??e par le nombre de syllabe et/ou la rime.",
            }),
            definitionQuestion({
                "tan": " Ecorce du ch??ne ou d???autres arbres",
                "tant": "Tellement, ?? tel point.",
                "taon": "Insecte ressemblant ?? une grosse mouche.",
                "temps": "Moments o?? se passe un mouvement, une action.",
                "tend": "conjugaison du verbe ?? tendre ?? ?? la troisi??me personne du singulier, au pr??sent de l???indicatif.",
            }),
        ],
        "g??ographie": [
            definitionQuestion({
                "parlement europ??en": "institution ??lue au suffrage universel direct compos?? de 705 d??put??s, d??tenteur du pouvoir l??gislatif.",
                "commission europ??enne": "institution compos??e d'un repr??sentant par ??tat membre dont la fonction principale est l'initiative l??gislative",
                "cour de justice de l'Union europ??enne": "institution qui veille ?? l'application du droit de l'Union.",
                "banque centrale europ??enne": "institution dont l'objectif est de maintenir la stabilit?? des prix et de limiter l'inflation annuelle."
            }),
            () => {
                return {
                    statement: `Lequel de ces pays est membre de l'Union Europ??enne en 2021 ?`,
                    correct: `La Slovaquie`,
                    wrong: [`L'Andorre`,
                            `La Suisse`,
                            `Le Royaume Uni`],
                    course: ["Les 27 ??tats membres de l'Union Europ??enne en 2021 sont l'Allemagne, l'Autriche, la Belgique, la Bulgarie, Chypre, la Croatie, le Danemark, l'Espagne,",
                             "l'Estonie, la Finlande, la France, la Gr??ce, la Hongrie, l'Irlande, l'Italie, la Lettonie, la Lituanie, le Luxembourg, Malte,",
                             "les Pays-Bas, la Pologne, le Portugal, la R??publique-Tch??que, la Roumanie, la Slovaquie, la Slov??nie et la Su??de.",
                            ],
                }
            },
        ],
        "histoire": [
            dateQuestion({
                "entre 1914 et 1918": "la premi??re guerre mondiale",
                "en 1917" : "la r??volution Russe",
                "en 1936" : "le front populaire",
                "entre 1933 et 1945" : "l???Allemagne d???Hitler",
            }),
            dateQuestion({
                "entre 1939 et 1945" : "la seconde guerre mondiale",
                "entre 1944 et 1945" : "la lib??ration, l'instauration du droit de vote des femmes et de la s??curit?? sociale",
                "en 1945": "la cr??ation de l???ONU",
                "entre 1947 et 1991" : "la guerre froide",
            }),
            dateQuestion({
                "en 1957" : "les trait??s de Rome",
                "en 1958" : "la naissance de la Ve R??publique",
                "en juillet 1962" : "l'ind??pendance de l???Alg??rie",
                "en d??cembre 1962" : "l'??lection du pr??sident de la R??publique au suffrage universel direct"
            }),
            dateQuestion({
                "en 1975" : "la loi Veil sur l???Interruption Volontaire de Grossesse",
                "en 1981" : "l'??lection de Fran??ois Mitterrand",
                "en 1989" : "la chute du mur de Berlin",
                "en 1992" : "le trait?? de Maastricht",
                "en 2002" : "la mise en place de l'euro, monnaie europ??ene",
            }),
        ],
        "langues": [
            translationQuestion({
                "quel": "which",
                "sorci??re": "witch",
                "souhait": "wish",
                "avec": "with",
            }, "anglais"),
            mistakeQuestions(
                "No hagas como si no lo sab??as.",
                1, // no lo supieras
            ),
            mistakeQuestions(
                "I heared that there was only two flower in their garden.",
                3, // heard, were, flowers
            ),
        ],
        "maths": [
            () => {
                let x = getRandomArbitrary(-10, 10);
                let A = getRandomArbitrary(2, 10);
                let B = getRandomArbitrary(2, 10);
                let C = getRandomArbitrary(-10, 0);
                let D = (A - C) * x + B;
                let shift = new Array();
                for (let i = 1; i <= 5; i++) { shift.push(i); shift.push(-i); }
                let indices = getRandomIndices(shift.length);
                return {
                    statement: `Quelle est la solution de l'??quation ${A}x + ${B} = ${C}x + ${D} ?`,
                    correct: `${x}`,
                    wrong: [`${x+shift[indices.pop()]}`, `${x+shift[indices.pop()]}`, `${x+shift[indices.pop()]}`],
                }
            },
            () => {
                let AB = getRandomArbitrary(2, 10);
                let AC = getRandomArbitrary(AB + 1, AB + 10);
                let A = Math.round(100 * Math.acos(AB/AC) * 180 / Math.PI);
                let shift = new Array();
                for (let i = 1; i <= 5; i++) { shift.push(i); shift.push(-i); }
                let indices = getRandomIndices(shift.length);
                return {
                    statement: `Dans un triangle rectangle dont l'hypot??nuse mesure ${AC}cm, quelle est la meilleure valeure approch??e d'une angle dont le cot?? adjacent est de longueur ${AB}cm ?`,
                    correct: `${A/100}`,
                    wrong: [`${(A+shift[indices.pop()])/100}`, `${(A+shift[indices.pop()])/100}`, `${(A+shift[indices.pop()])/100}`],
                }
            },
            () => {
                let A = getRandomArbitrary(2, 5);
                let B = getRandomArbitrary(A + 1, 30);
                let d = gcd(A, B);
                let f = getRandomArbitrary(2, 6);
                A *= f;
                B *= f;
                d *= f;
                return {
                    statement: `Quel est le PGCD de ${A} et ${B} ?`,
                    correct: `${d}`,
                    wrong: [d != B/d ? B/d : getRandomArbitrary(1, d),
                            d != A/d ? A/d : getRandomArbitrary(d + 1, A + 1),
                            d != f ? f : 1],
                    course: ["Le PCGD de deux nombres entiers A et B est le plus grand nombre qui divise ?? la fois A et B.",
                             `Par exemple le PCGD de ${A} et ${B} est ${d}.`],
                }
            },
            () => {
                let A = getRandomArbitrary(2, 5);
                let B = getRandomArbitrary(A + 1, 30);
                let d = gcd(A, B);
                let f = getRandomArbitrary(2, 6);
                A *= f;
                B *= f;
                d *= f;
                let lcm = (A*B)/d;
                return {
                    statement: `Quel est le PPCM de ${A} et ${B} ?`,
                    correct: `${(A*B)/d}`,
                    wrong: [
                        lcm != (A*B)/f ? (A*B)/f : A*B,
                        lcm != A ? A : getRandomArbitrary(1, lcm),
                        lcm != B/d ? B/d : getRandomArbitrary(lcm + 1, A*B/f)],
                    course: ["Le PPCM de deux nombres entiers A et B est le plus petit nombre qui est un multiple de chacun de ces nombres.",
                             `Par exemple le PPCM de ${A} et ${B} est ${A*B/d}.`],
                }
            },
        ],
        "physique": [
            () => {
                let m = getRandomArbitrary(1, 5);
                let v = getRandomArbitrary(2, 5);
                return {
                    statement: `Quelle est l'??nergie cin??tique d'un objet de ${m} kilos se d??pla??ant ?? la vitesse de ${v} m/s ?`,
                    correct: `${m*(v**2)/2}J`,
                    wrong: [`${m*(v**2)}J`, `${m*v/2}J`, `${m*v}J`],
                    course: ["Un objet de masse m et anim?? d???une vitesse v poss??de une ??nergie de mouvement",
                             "Elle est appel??e ??nergie cin??tique et ??gale ?? Ec = ??mv??"],
                }
            },
            () => {
                let U = getRandomArbitrary(2, 10);
                let I = getRandomArbitrary(2, 10);
                return {
                    statement: `Quelle est la puissance d'une source ??lectrique de tension ${U} V et d'intensit?? ${I} amp??res ?`,
                    correct: `${I*U} W`,
                    wrong: [`${I+U} W`, `${I*U/2}W`, `${Math.max(I, U)}W`],
                    course: ["La puissance d'une source ??lectrique est donn??e par la formule P = U I",
                            "o?? U est la tension et I l'intensit??"],
                }
            },
        ],
        "svt": [
            definitionQuestion({
                "ADN": "mol??cule organique constitu??e de nucl??otides, support de l???information g??n??tique",
                "all??le": "une des diff??rentes versions d???un g??ne, dues ?? des changements de la s??quence nucl??otidique",
                "chromosome": "ensembles d?????l??ments d???information li??s entre eux dans une m??me mol??cule d???ADN",
                "g??ne": "s??quence(s) d???ADN situ?? ?? un endroit pr??cis, d???un chromosome donn?? et constituant une unit?? d???information",
                "g??nome": "ensemble des g??nes d???un organisme",
                "locus": "Point pr??cis du chromosome occup?? par un g??ne donn??.",
                "mutation": "Toute modification du g??notype par alt??ration de la s??quence d???un fragment d???ADN",
                "ph??notype": "Ensemble des caract??res observables d???un individu.",
            }),
        ],
    },
];

// Return a random question with level < maxLevel as an object with the
// following field:
// - statement: a string corresponding to the statement of the question
// - options: an array of answers that are objects with two values:
//     - value: a boolean indicating whether the answer is correct. It is true
//       for only one of the answer (the correct answer).
//     - text: a string corresponding to the answer.
//     - damage: suggested damage received by the Sphinge for this answer. It
//       is equal to the level of the question plus one.
//
// Note: The level of the players in the game goes from 1 to 5, corresponding
// to a question level from 0 to 4.
function pickRandomQuestion(maxLevel: number)
{
    // Pick a random level.
    let questionLevel = getRandomArbitrary(0, maxLevel);
    let questionsForThisLevel = questions[questionLevel];

    // Pick a random question for this level.
    let questionCountForThisLevel = 0;
    for (let field in questionsForThisLevel)
        questionCountForThisLevel += questionsForThisLevel[field].length;
    let questionIndex = getRandomArbitrary(0, questionCountForThisLevel);
    let question;
    for (let field in questionsForThisLevel) {
        if (questionIndex < questionsForThisLevel[field].length) {
            question = questionsForThisLevel[field][questionIndex]();
            break;
        } else {
            questionIndex -= questionsForThisLevel[field].length;
        }
    }

    // Build options.
    let options = new Array();
    options.push({ value: true, text: question.correct});
    question.wrong.forEach((text) => {
      options.push({ value: false, text: text });
    });

    // Shuffle options.
    for (let i = options.length - 1; i > 0; i--) {
        const j = getRandomArbitrary(0, i + 1);
        [options[i], options[j]] = [options[j], options[i]];
    }

    return {
       statement: question.statement,
       options: options,
       damage: questionLevel + 1,
    };
}

// Return a random course corresponding to the specified field and to a random
// level < maxLevel. The return value is an array of sentences for the course
// or possibly null if no course were chosen.
//
// Note: The level of the players in the game goes from 1 to 5, corresponding
// to a question level from 0 to 4.
function pickRandomCourse(maxLevel: number, field: string) {
    let question_count = 0;
    for (let level = 0; level < maxLevel; level++) {
        if (questions[level].hasOwnProperty(field))
            question_count += questions[level][field].length;
    }

    if (question_count > 0) {
        const attempt_to_find_course = 5;
        for (let j = 0; j < attempt_to_find_course; j++) {
            let chosen_question = getRandomArbitrary(0, question_count);
            for (let level = 0; level < maxLevel; level++) {
                if (questions[level].hasOwnProperty(field)) {
                    let questionsForThisLevel = questions[level][field];
                    if (chosen_question < questionsForThisLevel.length) {
                        let course = questionsForThisLevel[chosen_question]().course;
                        if (course)
                            return course;
                    } else {
                        chosen_question -= questionsForThisLevel.length;
                    }
                }
            }
        }
    }
    return null;
}

// Export some objects for the game and for dump-questions.ts.
export { questions, pickRandomQuestion, pickRandomCourse }
