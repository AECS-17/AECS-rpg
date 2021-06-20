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
        `Comme définir le terme « %KEY » ?`,
        `À quoi correspond la définition « %VALUE » ?`,
        `Quelques définitions...`,
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
        `Que s'est-il passé %KEY ?`,
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
            statement: `Combien d'erreurs comporte le texte suivant : « ${text_with_mistakes} »`,
            correct: correct,
            wrong: wrong,
        }
    }
}

// This is an array of questions. Items correspond to increasing levels
// (Primaire, 6e, 5e, 4e and 3e) and is an object with the following structure:
//   - key: The field of the course. The values known by the game are:
//     "chimie",
//     "français"
//     "géographie"
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
                            `L'eau et l'huile vont se mélanger de façon homogène.`,
                            `De petite bulles d'huile vont se former à l'intérieur de l'eau.`],
                    course: ["L'huile flotte au-dessus de l'eau car elle est moins dense."],
                }
            },
        ],
        "français": [
            mapQuestion(
                {
                    "Le Corbeau et le Renard" : "Tout flatteur vit aux dépens de celui qui l’écoute.",
                    "Le Lièvre et la Tortue": "Rien ne sert de courir ; il faut partir à point",
                    "Le Lion et le Rat ": "On a souvent besoin d'un plus petit que soi.",
                    "Le Loup et l’Agneau": "La raison du plus fort est toujours la meilleure.",
                },
                "Quelle est la morale de la fable %KEY ?",
                "De quelle fable de La Fontaine est tirée la morale '%VALUE' ?",
                "Quelques morales de fables de La Fontaine...",
                "%KEY : '%VALUE'",
            ),
            definitionQuestion({
                "bois": "substance dure et compacte des arbres",
                "boit": "conjugaison du verbe « boire » à la troisième personne du singulier, au présent de l’indicatif.",
                "boa": "serpent vivant en Amérique du sud.",
            }),
            mistakeQuestions(
                "J'ai manger deux délicieuse paumes aujourd'hui.",
                3, // mangÉ, délicieuseS, POMMES.
            ),
            mistakeQuestions(
                "Danses avec ton ami avant qu'elle ne parte.",
                3, // Danse, amiE.
            ),
        ],
        "géographie": [
            mapQuestion(
                {
                    "de la Turquie": "Ankara",
                    "de la Thaïlande": "Bangkok",
                    "de l'Australie": "Canberra",
                    "du Sénégal": "Dakar",
                    "du Viêt Nam": "Hanoï",
                    "du Pakistan": "Islamabad",
                    "de la Jamaïque": "Kingston",
                    "du Gabon": "Libreville",
                    "de l'Uruguay": "Montevideo",
                    "de l'Inde": "New Delhi",
                },
                "Quelle est la capitale %KEY ?",
                "De quel pays %VALUE est-elle la capitale ?",
                "Quelques métropoles mondiales...",
                "%VALUE est la capitale %KEY",
            ),
            mapQuestion(
                {
                    "du Canada": "Ottawa",
                    "de Haïti": "Port-au-Prince",
                    "de l'Équateur ": "Quito",
                    "de l'Arabie saoudite": "Riyad",
                    "de la Bosnie-Herzégovine": "Sarajevo",
                    "du Japon": "Tokyo",
                    "de l'Autriche": "Vienne",
                    "des États-Unis": "Washington D.C.",
                    "du Cameroun": "Yaoundé",
                    "de la Croatie": "Zagreb",
                },
                "Quelle est la capitale %KEY ?",
                "De quel pays %VALUE est-elle la capitale ?",
                "Quelques capitales de pays...",
                "%VALUE est la capitale %KEY",
            ),
            definitionQuestion({
                "équateur": "ligne imaginaire qui partage la terre en 2 parties",
                "parallèle": "cercle imaginaire parallèle à l'équateur",
                "méridien": "cercle fictif passant par les deux pôles de la Terre dont le plan est perpendiculaire à celui de l'équateur",
                "longitude": "angle expression du positionnement à l'est ou à l'ouest du méridien de Greenwich",
                "lattitude": "angle expression du positionnement au nord ou au sud de l'équateur",
            }),
        ],
        "histoire": [
            dateQuestion({
                "Autour du Ve siècle av J.-C." : "la Gaule celtique",
                "Autour du Ier siècle" : "l'empire romain",
                "Autour du Ve-VIe siècle" : "Règne de Clovis",
                "Autour du VIIe-VIIIe siècle" : "Règne de Charlemagne",
                "Autour du XVe-XVIe siècle" : "La Renaissance",
                "Au XVIIe siècle" : "Les lumières",
                "Au XVIIIe siècle" : "la révolution française",
                "Au XIXe siècle" : "la révolution industrielle",
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
                "tête": "head",
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
                "père": "father",
                "mère": "mother",
                "fille": "daughter",
                "grand-père": "grandfather",
                "soeur": "sister",
                "neveu": "nephew",
                "tante": "aunt",
                "cousin": "cousin",
            }, "anglais"),
            translationQuestion({
                "maison": "house",
                "fenêtre": "window",
                "cheminée": "chimney",
                "toit": "roof",
                "porte": "door",
                "cuisine": "kitchen",
                "chambre": "bedroom",
            }, "anglais"),
            translationQuestion({
                "assiette": "plate",
                "couteau": "knife",
                "cuillère": "spoon",
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
                    statement: `Combien vaut ${v1 * v2} divisé par ${v1} ?`,
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
                    wrong: [booleanToAnswer(n % 2 != 0), "Peut-être"],
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
                    "1ère" : "Mercure",
                    "2ème": "Vénus",
                    "3ème": "Terre",
                    "4ème": "Mars",
                    "5ème": "Jupiter",
                    "6ème": "Saturne",
                    "7ème": "Uranus",
                    "8ème": "Neptune",
              },
                "Quelle est la %KEY planète la plus proche du soleil ?",
                "Si on classe les planètes du système solaire de la plus proche à la plus éloignée, quelle est la position de %VALUE ?",
                "Les 8 planètes du système solaire de la plus proche à la plus éloignée",
                "%KEY : '%VALUE'",
            ),
        ],
        "svt": [
            definitionQuestion({
                "cerveau": "Organe chargé de gérer l'ensemble des fonctions corporelles par l'envoi de signaux nerveux.",
                "coeur" : "Organe chargé du pompage du sang dans tout le corps.",
                "poumon": "Organe chargé d'obtenir de l'oxygène de l'environnement tout en éliminant le dioxyde de carbone.",
                "estomac": "Organe chargé de la digestion des aliments.",
            }),
        ],
    },
    { // 6e
        "chimie": [
            mapQuestion(
                {
                    "Une flamme" : "Hautement inflammable.",
                    "Une croix": "Nocif.",
                    "Une tête de mort": "Toxique.",
                    "Tube à essai dont les gouttes tombent en faisant des trous dans une main et un rectangle.": "Corrosif.",
                    "Arbre et poisson morts": "Dangereux pour l'environnement.",
                },
                "Sur l'étiquette d'une substance chimique, que signifie le pictogramme '%KEY' ?",
                "Comment est représenté l'avertissement '%VALUE' sur l'étiquette d'une substance chimique ?",
                "Quelques pictogrammes de danger des substances chimiques...",
                "%KEY : '%VALUE'",
            ),
        ],
        "français": [
            () => {
                let v1 = getRandomArbitrary(100, 2000);
                let v2 = getRandomArbitrary(100, 2000);
                return {
                    statement: `L'Illiade raconte les événènements pendant`,
                    correct: `La guerre de Troie`,
                    wrong: [`L'apogée d'Athènes`,
                            `La guerre du Péloponnèse`,
                            `Le règne d'Alexandre le Grand`],
                    course: ["L'Illiade est une épopée attribuée à Homère se déroulant pendant la guerre de Troie",
                             "Les Achéens venus de toute la Grèce affrontent les Troyens et leurs alliés",
                             "chaque camp étant soutenu par diverses divinités comme Athéna, Poséidon ou Apollon."],
                }
            },
            mapQuestion(
                {
                    "L'avare" : "Il faut manger pour vivre et non pas vivre pour manger.",
                    "Le Bourgeois gentilhomme": "Il y a plus de quarante ans que je dis de la prose sans que j'en susse rien",
                    "Les Fourberies de Scapin": "Que diable allait-il faire dans cette galère ?",
                    "Tartuffe ": "Couvrez ce sein que je ne saurais voir",
                },
                "Quelle citation de Molière est tirée de la pièce '%KEY' ?",
                "De quelle pièce de Molière est tirée la citation '%VALUE' ?",
                "Quelques citations de pièce de Molière...",
                "%KEY : '%VALUE'",
            ),
            definitionQuestion({
                "porc": "cochon",
                "pore": "ouverture imperceptible dans la peau",
                "port": "endroit où les bateaux abordent",
            }),
            definitionQuestion({
                "cent": "Numéral cardinal qui contient 10 fois 10.",
                "sang": "Liquide rouge qui circule dans les artères et les veines des hommes et animaux y entretenant la vie.",
                "sans": "Préposition marquant l’absence, le manque, l’exclusion d’une personne ou d’une chose.",
                "sent": "conjugaison du verbe « sentir » à la troisième personne du singulier, au présent de l’indicatif.",
            }),
        ],
        "géographie": [
            definitionQuestion({
                "amont": "Partie d'un cours d'eau comprise entre un lieu déterminé et sa source.",
                "aval" : "Partie d'un cours d'eau comprise entre un lieu déterminé et son embouchure.",
                "confluent": "Point de rencontre de 2 cours d'eau.",
                "rivière": "Cours d'eau qui rejoint un fleuve.",
                "fleuve": "Cours d'eau débouchant dans une mer.",
            }),
            definitionQuestion({
                "relief": "Ensemble des inégalités de la surface de la terre.",
                "presqu'île": "Terre reliée au continent par une étroite bande de terre.",
                "littoral": "Bande de terre plus ou moins large qui borde la mer ou l'océan.",
                "plateau": "Relief plus ou moins plan, dans lequel les vallées sont encaissées.",
                "plaine": "Etendue plus ou moins plane, dans lequel les vallées ne sont pas encaissées.",
            }),
            definitionQuestion({
                "bidonville": "Quartier d'une ville construit avec des matériaux de récupération.",
                "urbain": "De la ville.",
                "rural": "Des campagnes.",
                "métropole": "Très grande agglomération qui commande et qui dirige.",
                "ghetto": "Quartier de ville dans lequel se rassemble une population partageant des caractères communs (langue, religion, pauvreté).",
                "exode rural": "départ des habitants des campagnes vers les villes.",
            }),
            definitionQuestion({
                "Espérance de vie": "nombre moyen d'années de vie d'une population.",
                "PNB": "richesses produites par un pays en une année.",
                "densité de population": "Nombre d'habitants qui vivent en moyenne sur 1 kilomètre carré.",
                "accroissement naturel": "différence entre le nombre de naissances et de décès.",
                "contraintes naturelles": "Ensemble des éléments naturels qui font obstacle à l'installation des hommes dans un lieu.",
            }),
        ],
        "histoire": [
            dateQuestion({
                "vers −3500" : "l'apparition des premières écritures",
                "à partir de −10000" : "la sédentarisation et les débuts de l’agriculture",
                "au VIIIème siècle av. J.-C." : "la rédaction des oeuvres d'Homère et la fondation de Rome",
                "du VIIème siècle av. J.-C. au début de notre ère" : "la rédaction de la Bible",
            }),
            dateQuestion({
                "au Vème siècle av. J.-C." : "l'apogée d'Athènes au temps de Périclès",
                "du Ier au IIème siècle": "la paix romaine",
                "du Ier au IVème siècle": "les débuts du christianisme",
                "du IIème siècle av. J.-C. au IIème siècle ap. J.-C.": "la Chine des Han",
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
                    wrong: [booleanToAnswer(n % 3 != 0), "Peut-être"],
                    course: ["Un nombre est divisible par 3 si et seulement si la somme de ses chiffres est divisible par 3.",
                             "Par exemple 1234 est n'est pas divisible par 3 car 1 + 2 + 3 + 4 = 10 n'est pas divisible par 3.",
                             "Mais 1236 est divisible par 3 car 1 + 2 + 3 + 6 = 12 = 3 × 4 est divisible par 3."],
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
                    statement: `L'alternance des saisons est expliquée par :`,
                    correct: `L'inclinaison de l'axe des pôles et la révolution de la Terre autour du Soleil.`,
                    wrong: [`La trajectoire elliptique de la Terre autour du soleil et la distance qui les séparent.`,
                            `La rotation de la Terre sur elle-même.`,
                            `La rélection de la lumière solaire par la Lune.`,
                            `Les variations de température du Soleil au cours du temps.`],
                    course: ["Les saisons sont dues à l'inclinaison de l'axe des pôles, combinée à la révolution de la Terre autour du Soleil",
                             "causant une variation d'ensoleillement induite par l'orientation changeante vis-à-vis du rayonnement solaire"],
                }
            },
            definitionQuestion({
                "masse": "quantité de matière d'un corps exprimée en kilogrammes",
                "volume" : "espace occupé par un corps exprimé en mètre cube",
                "litre": "unité de volume correspondant à un 1 décimètre cube",
                "poids": " force de la pesanteur exprimée en newton",
            }),
            definitionQuestion({
                "solidification": "passage de l'état liquide à solide",
                "fusion" : "passage de l'état solide à liquide",
                "vaporisation" : "passage de l'état liquide à gaz",
                "liquéfaction" : "passage de l'état gaz à liquide",
                "condensation" : "passage de l'état gaz à solide",
                "sublimation" : "passage de l'état solide à gaz",
            }),
            () => {
                let v = getRandomArbitrary(50, 120);
                return {
                    statement: `En 2 heures et demi, quelle distance parcourt une voiture roulant à ${v} km/h ?`,
                    correct: `${2.5 * v} km`,
                    wrong: [`${(2*getRandomArbitrary(3, 5) + 1) * .5 * v} km`,
                            `${getRandomArbitrary(1, 4) * v} km`,
                            `${(2*getRandomArbitrary(0, 2) + 1) * .5 * v} km`],
                }
            },
        ],
        "svt": [
            definitionQuestion({
                "membrane": "lame mince séparant l'intérieur d'une cellule de l'environnement extérieur",
                "cytoplasme": "milieu rencontré à l'intérieur des cellule",
                "noyau": "structure cellulaire  contenant l'essentiel du matériel génétique",
                "unicellulaire": "être qui ne possède qu'une seule cellule",
                "spore": "organe de dispersion et de multiplication caractéristique du règne végétal",
            }),
        ],
    },
    { // 5e
        "chimie": [
            mapQuestion(
                {
                    "le sucre": "le soluté",
                    "l'eau": "le solvant",
                    "l'eau sucrée": "la solution",
                    "l'eau sucrée qui ne dissout plus le sucre": "la solution saturée",
                },
                "On mélange du sucre et de l’eau. Comme appelle t'on %KEY ?",
                "On mélange du sucre et de l’eau. Qu'est-ce que %VALUE ?",
                "Quelques concepts de dissolution dans l'eau",
                "%KEY est appelée %VALUE",
            ),
            mapQuestion(
                {
                    "Solution quelconque": "0 ≤ pH ≤ 14",
                    "Solution acide": "0 ≤ pH < 7",
                    "Solution basique": "7 < pH ≤ 14",
                    "Solution neutre": "pH = 0",
                },
                `A quel pH correspond une %KEY`,
                `À quel type de solution correspond %VALUE`,
                `Définition du pH d'une solution...`,
                `%KEY : %VALUE`,
            ),
            definitionQuestion({
                "corps pur": "substance composée d'une seule espèce chimique",
                "mélange" : "substance composée de plusieurs espèces chimiques",
                "mélange homogène": "mélange pour lequel on ne distingue pas les constituants",
                "mélange hétérogène": "mélange pour lequel on distingue les constituants",
                "liquides miscibles / liquide et solide solubles": "liquides qui donnent un mélange homogènes",
                "liquides non-miscibles / liquide et solide insolubles": "qui donnent un mélange hétérogène",
                "solubilité": "masse maximale de solide qu'on peut dissoudre dans un litre de solvant",
            }),
        ],
        "français": [
            () => {
                return {
                    statement: `Quelle oeuvre n'est pas tirée de la littérature du moyen-âge ?`,
                    correct: `Don Quichotte`,
                    wrong: [`La Chanson de Roland`,
                            `Perceval ou le Conte du Graal`,
                            `Tristan et Yseult`],
                    course: ["Don Quichotte est roman écrit par Miguel de Cervantes publié au début du XVIIe siècle, parodie des mœurs médiévales et de l'idéal chevaleresque."],
                }
            },
            definitionQuestion({
                "au": " Contraction de « à le ». ",
                "eau": "Liquide consommé en tant que boisson.",
                "haut": "qui a une certaine dimension dans le sens vertical.",
                "os": "Organe dur et solide qui constitue la charpente des hommes et des vertébrés.",
            }),
            definitionQuestion({
                "compte": "Etat ou autre écrit comprenant l’énumération, le calcul et autres supputations de ce qui a été reçu et dépensé.",
                "comte": "Titre de noblesse qui vient au-dessous de celui du marquis.",
                "conte": "court récit d’aventures imaginaires, soit vraisemblable, soit merveilleux.",
            }),
            definitionQuestion({
                "bal": "Assemblée où l’on danse.",
                "bâle": "Ville de Suisse.",
                "balle": "Petite sphère qui rebondit, utilisée dans certains jeux.",
            }),
        ],
        "géographie": [
            definitionQuestion({
                "Agriculture biologique": "système de culture qui n’utilise pas de pesticides ou d’engrais chimiques.",
                "Agriculture durable": "Agriculture qui répond aux besoins des populations actuelles sans compromettre la capacité des populations futures à répondre aux leurs.",
                "Agriculture productiviste": "Agriculture qui cherche une production maximale et des rendements élevés en utilisant les techniques les plus efficaces (machines, engrais, pesticides, OGM…).",
                "Agriculture vivrière": "Agriculture destinée à nourrir les paysans qui la produisent.",
            }),
            definitionQuestion({
                "Pays développé": "Pays riche où la majorité de la population a accès à tous ses besoins vitaux ainsi qu’à un certain confort.",
                "Pays du nord": "ensemble des pays riches et développés, situés principalement dans l’hémisphère nord",
                "Pays du sud": "ensemble des pays pauvres et en développement, situés au sud de l’Amérique du Nord et de l’Europe.",
                "Pays émergent": "Pays connaissant une croissance économique forte mais dont le niveau de développement de la population est encore faible.",
                "Pays enclavé" : "pays qui n’a pas accès à la mer.",
            }),
        ],
        "histoire": [
            dateQuestion({
                "en 622" : "l'Hégire",
                "en 800" : "le sacre de Charlemagne",
                "en 987" : "le couronnement et sacre d'Hugues Capet",
                "en 1054" : "le schisme des Églises d'Orient et d'Occident",
                "entre 1096 et 1099" : "la première croisade",
            }),
            dateQuestion({
                "en 1204" : "le sac de constantinople",
                "en 1214" : "la bataille de Bouvines",
                "en 1453" : "la prise de constantinople",
                "entre 1337 et 1453" : "la Guerre de Cent Ans",
            }),
            dateQuestion({
                "en 1492" : "le premier voyage de Christophe Colomb",
                "en 1598" : "l'édit de Nantes",
                "en 1517" : "les 95 thèses de Luther",
                "entre 1661 et 1715" : "le règne de Louis XIV",
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
                "tête": "cabeza",
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
                "père": "padre",
                "mère": "madre",
                "fille": "hija",
                "grand-père": "abuelo",
                "soeur": "hermana",
                "neveu": "sobrino",
                "tante": "tía",
                "cousin": "primo",
            }, "espagnol"),
            translationQuestion({
                "maison": "casa",
                "fenêtre": "ventana",
                "cheminée": "chimenea",
                "toit": "techo",
                "porte": "puerta",
                "cuisine": "cocina",
                "chambre": "habitación",
            }, "espagnol"),
            translationQuestion({
                "assiette": "plato",
                "couteau": "cuchillo",
                "cuillère": "cuchara",
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
                4, // Él, A su, amigA, para.
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
                    "une pile": "deux barres parallèles (l'une grosse et courte, l'autre fine et longue)",
                    "une résistance": "un rectangle",
                    "une connexion": "un point",
                    "un interrupteur": "un segment qui s'ouvre ou se ferme tel un portail",
                    "une lampe": "un rond avec une croix à l'intérieur",
                    "une diode": "un triangle avec une barre",
                    "une diode électro-luminescente": "un triangle avec une barre et des flèches",
                    "un moteur": "un rond avec la lettre M à l'intérieur",
                },
                "Dans un circuit électrique, comment représente-t-on %KEY ?",
                "Dans un circuit électrique, la représentation d'%VALUE est...",
                "Comment schématiser les composants d'un circuit électrique",
                "on représente %KEY par %VALUE",
            ),
            () => {
                let v1 = getRandomArbitrary(1, 10) * 10**(getRandomArbitrary(6, 8));
                let v2 = v1 * 0.001 * 0.001;
                return {
                    statement: `À quoi est égale ${v1} millilitres ?`,
                    correct: `${v2} mètres cube.`,
                    wrong: [`${v2 * (Math.random() < .5 ? 0.1 : 10)} mètres cube`,
                            `${v2 * (Math.random() < .5 ? 0.01 : 100)} mètres cube`,
                            `${v1} décimètres cube`],
                    course: ["1 décimètre est égal à 0.1 mètre.",
                             "1 décimètre cube est égal à 0.001 mètre cube.",
                             "1 décimètre cube est égal à 1 litre.",
                             "1 millilitre est égal à 0.001 litre.",
                            ],
                }
            },
        ],
        "svt": [
            definitionQuestion({
                "enzymes": "molécules produites par les organes digestifs permettant la fabrication de nutriments à partir des aliments",
                "synapse" : "région d'interaction entre deux cellules nerveuses par laquelle passe un message chimique",
                "branchie": "organe respiratoire des animaux aquatiques",
                "chloroplaste": "organite spécifique des cellules végétales, lieu de la photosynthèse",
            }),
        ],
    },
    { // 4e
        "chimie": [
            mapQuestion(
                {
                    "d'hydrogène": "H",
                    "de carbone": "C",
                    "d'azote": "N",
                    "d'oxygène": "O",
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
                    "de dioxygène": "O2",
                    "de l'eau": "H2O",
                    "de dioxyde de carbone": "CO2",
                    "de méthane": "CH4",
                    "de diazote": "N2",
                    "de chlorure de méthyle": "CH3Cl",
                    "de dioxyde de soufre": "SO2",
                },
                "Quelle est la formule de la molécule %KEY ?",
                "%VALUE est la formule de  la molécule... ",
                "Quelques formules chimiques",
                "%VALUE est la formule de la molécule %KEY",
            ),
            mapQuestion(
                {
                    "diazote": "environ 78%",
                    "dioxygène": "environ 21%",
                    "dioxyde de carbone": "environ 0,04%",
                    "gaz rares (argon, néon, ...)": "moins de 1%",
                },
                "Quelle est le pourcentage de %KEY dans l'air ?",
                "Quel gaz de l'air correspond au pourcentage '%VALUE' ?",
                "Composition de l'air",
                "%KEY: %VALUE",
            ),
        ],
        "français": [
            mapQuestion(
                {
                    "Descriptif" : "C’est un roc ! … c’est un pic ! … c’est un cap ! Que dis-je, c’est un cap ? … C’est une péninsule !",
                    "Gracieux" : "Aimez-vous à ce point les oiseaux Que paternellement vous vous préoccupâtes De tendre ce perchoir à leurs petites pattes ?",
                    "Pédant" : "L’animal seul, monsieur, qu’Aristophane Appelle Hippocampéléphantocamélos Dut avoir sous le front tant de chair sur tant d’os !",
                    "Cavalier" : "Quoi, l’ami, ce croc est à la mode ? Pour pendre son chapeau, c’est vraiment très commode !",
                    "Dramatique" : "C’est la Mer Rouge quand il saigne !",
                    "Admiratif" : "Pour un parfumeur, quelle enseigne !",
                },
                "Quel énoncé correspond à la description '%KEY' dans la tirade du Nez de Cyrano de Bergerac ?",
                "Quelle description correspond à l'énoncé « %VALUE » dans la tirade du Nez de Cyrano de Bergerac ?",
                "Quelques extraits de la tirade du nez de la pièce de théâtre Cyrano de Bergerac...",
                "%KEY : « %VALUE »",
            ),
            mapQuestion(
                {
                    "L'Albatros": "Exilé sur le sol au milieu des huées, Ses ailes de géant l'empêchent de marcher.",
                    "L'Invitation au voyage ": "Là, tout n’est qu’ordre et beauté, Luxe, calme et volupté.",
                    "Le Balcon": "- Ô serments ! ô parfums ! ô baisers infinis !",
                    "Le serpent qui danse": "Je crois boire un vin de bohême, Amer et vainqueur, Un ciel liquide qui parsème D’étoiles mon cœur !",
                    "Spleen (Quand le ciel bas...)": "l'Espoir, Vaincu, pleure, et l'Angoisse atroce, despotique, Sur mon crâne incliné plante son drapeau noir",
                    "Une charogne": "Alors, ô ma beauté! dites à la vermine Qui vous mangera de baisers, Que j’ai gardé la forme et l’essence divine De mes amours décomposés!",
                    "À une Passante": "Car j'ignore où tu fuis, tu ne sais où je vais, Ô toi que j'eusse aimée, ô toi qui le savais !",
                },
                "Quels sont les derniers vers du poème '%KEY' des fleurs du mal ?",
                "De quel poème de Baudelaire sont tirés les vers « %VALUE » ?",
                "Quelques citations des fleurs du mal de Charles Baudelaire...",
                "%KEY : « %VALUE »",
            ),
            definitionQuestion({
                "shah": "Titre que les Européens donnent au souverain de la Perse.",
                "chas": "Trou d’une aiguille par lequel on passe le fil.",
                "chat": "Animal domestique carnassier de la famille des félins.",
            }),
            definitionQuestion({
                "père": "Celui qui a un ou plusieurs enfants.",
                "paire": "Deux choses de même espèce, qui vont ou nécessairement ou ordinairement ensemble.",
                "pair": "Qui est égal, semblable, pareil.",
                "pers": "D'une couleur entre le vert et le bleu.",
                "perds": "conjugaison du verbe « perdre » à la deuxième personne du singulier, au présent de l’indicatif.",
            }),
            definitionQuestion({
                "boue": "Fange des rues et des chemins.",
                "bous": "conjugaison du verbe « bouillir » à la deuxième personne du singulier, au présent de l’indicatif.",
                "bout": "Extrémité d’un corps, d’un espace.",
            }),
        ],
        "géographie": [
            definitionQuestion({
                "Tourisme de masse": "type de tourisme que l’on trouve dans des espaces aménagés pour accueillir un grand nombre de voyageurs, à des prix abordables.",
                "Tourisme international": "tourisme pratiqué en dehors du pays de résidence.",
                "Tourisme vert": "tourisme centré sur la découverte et le respect de l’environnement",
                "Tourisme durable": "tourisme  proposant des activités qui ménagent les équilibres économiques, sociaux  et environnementaux.",
                "Tourisme équitable" : "forme de tourisme favorisant l’amélioration des conditions de vie des communautés locales.",
            }),
            definitionQuestion({
                "Taux d’évolution de la population" : "mesure de l’accroissement global de la population",
                "Taux de fécondité" : "nombre moyen d’enfants par femme.",
                "Taux de pauvreté" : "part de la population vivant avec moins de 1,90 $ par jour selon l’ONU.",
                "Taux d’urbanisation" : "part de la population d’un pays qui habite dans un espace urbain.",
            }),
        ],
        "histoire": [
            dateQuestion({
                "entre 1751 et 1772": "l'édition de l'Encyclopédie",
                "entre 1670 et 1750" : "l'essor de la traite négrière",
                "en 1789" : "le début de la révolution française",
                "entre 1799 et 1815" : "le règne de Napoléon Bonaparte",
            }),
            dateQuestion({
                "entre février et juillet 1848" : "le Printemps des peuples",
                "en avril 1848" : "la seconde abolition de l'esclavage",
                "en mars 1848" : "l'instauration du suffrage universel masculin",
                "entre 1870 et 1880" : "le début de la seconde révolution industrielle",
                "en septembre 1870" : "la naissance de la IIIe république",
            }),
            dateQuestion({
                "en 1882" : "l'instauration de l'école gratuite, laïque et obligatoire",
                "entre 1870 et 1914" : "la 2nde mondialisation et relance de la colonisation",
                "entre 1894 et 1906" : "l'affaire Dreyfus",
                "en 1900" : "l'exposition universelle de Paris",
                "en 1905" : "la loi de séparation des églises et de l'État",
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
                    statement: `Quel est le coté manquant du triangle ABC rectangle en A tel que BC=${sizes_in_cm[0]} AC=${sizes_in_cm[1]}, AB=${sizes_in_cm[2]}.`,
                    correct: correct,
                    wrong: wrong,
                    course: ["Dans un triangle rectangle, le carré de l’hypoténuse est égal à la somme des carrés des deux autres côtés."],
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
                    statement: `Quelle est la forme irréductible de la fraction ${A}/${B}`,
                    correct: `${A/d}/${B/d}`,
                    wrong: [`${A}/${B}`, A > d ? `${A/d - 1}/${B/d}` : `${A/d + 1}/${B/d}`, d > f ?  `${A/f}/${B/f}` : `${A/d + 2}/${B/d}`],
                    course: ["Une fraction est irréductible si on ne peut pas diviser son numérateur et son dénominateur par un même nombre.",
                             `Par exemple ${A}/${B} n'est pas irréductible car on peut diviser ${A} et ${B} par ${d}.`,
                             `On obtien ${A/d}/${B/d} qui est une fraction irréductible.`]
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
                    statement: `Soit ABC un triangle, M un point de [AB] et N un point de [AC]. Si (MN) est parallèle à (BC), AB=${AB}cm, AC=${AC}cm et AM=${AM}cm quel est la meilleure valeur approchée de AN ?`,
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
                    statement: `Quelle est la tension aux bornes d'un conducteur ohmique de résistance ${R}Ω traversé par un courant de ${I}A ?`,
                    correct: `${I * R} V`,
                    wrong: [`${R *(I**2)/2} V`, `${2 * I * R} V`, `${I + R} V`],
                    course: ["La loi d'ohm est U = R.I",
                             "où U est la tension en volts",
                             "où R est la résistance en ohms",
                             "et I l'intensité en ampère."],
                }
            },
            mapQuestion(
                {
                    "vitesse de la lumière dans le vide": "300 000 km/s",
                    "vitesse du son dans l'air": "340 m/s",
                    "vitesse du son dans l'eau": "1 500 m/s",
                    "vitesse de la lumière dans l'eau": "225 000 km/s",
                },
                "Quelle est la %KEY ?",
                "A quoi correspond %VALUE ?",
                "Quelques vitesses du son et de la lumière",
                "La %KEY est de %VALUE",
            ),
        ],
        "svt": [
            definitionQuestion({
                "magma": "matériau se formant à l'intérieur de la Terre et forme une roche en refroidissant.",
                "dorsales océaniques": "chaînes de montagnes sous-marines formées le long des zones de divergence des plaques tectoniques",
                "plaque tectonique": "fragment de l'enveloppe rigide de la surface de la Terre",
                "volcan": "structure géologique qui résulte de la montée d'un magma puis de l'éruption de matériaux",
                "subduction": "processus par lequel une plaque tectonique océanique s'incurve et plonge sous une autre plaque",
                "lave en coussin": "roche émise par un volcan sous-marin lors d’une éruption",
                "séisme": "secousse du sol résultant de la libération brusque d'énergie accumulée par les contraintes exercées sur les roches",
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
                    "H +": "hydrogène",
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
                    statement: `Laquelle de ces formules correspond à une réaction acido-basique ?`,
                    correct: `2H+ + Fe → H2 + Fe2+`,
                    wrong: [`3 Fe + 2 O2 → Fe3 O4`,
                            `H+ + Fe → H2 + Fe2+`,
                            `3H+ + Fe → H2 + Fe3+`],
                }
            },
        ],
        "français": [
            mapQuestion(
                {
                    "Aimé Césaire": "car il n'est point vrai que l'oeuvre de l'homme est finie que nous n'avons rien à faire au monde que nous parasitons le monde",
                    "Apollinaire": "Hommes de l’avenir souvenez-vous de moi Je vivais à l’époque où finissaient les rois",
                    "Jacques Prévert": "Et pourquoi donc j'ai tué ce pauvre imbécile, Maintenant les autres vont me pourchasser en motogodille",
                    "Robert Desnos": "J’ai tant rêvé de toi que tu perds ta réalité.",
                },
                "Quel texte a été écrit par %KEY ?",
                "Qui a écrit « %VALUE » ?",
                "Quelques citations d'auteurs du XXe siècle :",
                "%KEY : « %VALUE »",
            ),
            definitionQuestion({
                "vair": "Désignait une fourrure blanche et grise.",
                "ver": "Animal rampant, dont le corps est long et sans articulation.",
                "verre": "Récipient servant à recueillir une boisson et à la boire.",
                "vert": "Couleur qui est celle de l’herbe.",
                "vers": "Dans un poème désigne une ligne, qui est rythmée par le nombre de syllabe et/ou la rime.",
            }),
            definitionQuestion({
                "tan": " Ecorce du chêne ou d’autres arbres",
                "tant": "Tellement, à tel point.",
                "taon": "Insecte ressemblant à une grosse mouche.",
                "temps": "Moments où se passe un mouvement, une action.",
                "tend": "conjugaison du verbe « tendre » à la troisième personne du singulier, au présent de l’indicatif.",
            }),
        ],
        "géographie": [
            definitionQuestion({
                "parlement européen": "institution élue au suffrage universel direct composé de 705 députés, détenteur du pouvoir législatif.",
                "commission européenne": "institution composée d'un représentant par État membre dont la fonction principale est l'initiative législative",
                "cour de justice de l'Union européenne": "institution qui veille à l'application du droit de l'Union.",
                "banque centrale européenne": "institution dont l'objectif est de maintenir la stabilité des prix et de limiter l'inflation annuelle."
            }),
            () => {
                return {
                    statement: `Lequel de ces pays est membre de l'Union Européenne en 2021 ?`,
                    correct: `La Slovaquie`,
                    wrong: [`L'Andorre`,
                            `La Suisse`,
                            `Le Royaume Uni`],
                    course: ["Les 27 États membres de l'Union Européenne en 2021 sont l'Allemagne, l'Autriche, la Belgique, la Bulgarie, Chypre, la Croatie, le Danemark, l'Espagne,",
                             "l'Estonie, la Finlande, la France, la Grèce, la Hongrie, l'Irlande, l'Italie, la Lettonie, la Lituanie, le Luxembourg, Malte,",
                             "les Pays-Bas, la Pologne, le Portugal, la République-Tchèque, la Roumanie, la Slovaquie, la Slovénie et la Suède.",
                            ],
                }
            },
        ],
        "histoire": [
            dateQuestion({
                "entre 1914 et 1918": "la première guerre mondiale",
                "en 1917" : "la révolution Russe",
                "en 1936" : "le front populaire",
                "entre 1933 et 1945" : "l’Allemagne d’Hitler",
            }),
            dateQuestion({
                "entre 1939 et 1945" : "la seconde guerre mondiale",
                "entre 1944 et 1945" : "la libération, l'instauration du droit de vote des femmes et de la sécurité sociale",
                "en 1945": "la création de l’ONU",
                "entre 1947 et 1991" : "la guerre froide",
            }),
            dateQuestion({
                "en 1957" : "les traités de Rome",
                "en 1958" : "la naissance de la Ve République",
                "en juillet 1962" : "l'indépendance de l’Algérie",
                "en décembre 1962" : "l'élection du président de la République au suffrage universel direct"
            }),
            dateQuestion({
                "en 1975" : "la loi Veil sur l’Interruption Volontaire de Grossesse",
                "en 1981" : "l'élection de François Mitterrand",
                "en 1989" : "la chute du mur de Berlin",
                "en 1992" : "le traité de Maastricht",
                "en 2002" : "la mise en place de l'euro, monnaie européene",
            }),
        ],
        "langues": [
            translationQuestion({
                "quel": "which",
                "sorcière": "witch",
                "souhait": "wish",
                "avec": "with",
            }, "anglais"),
            mistakeQuestions(
                "No hagas como si no lo sabías.",
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
                    statement: `Quelle est la solution de l'équation ${A}x + ${B} = ${C}x + ${D} ?`,
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
                    statement: `Dans un triangle rectangle dont l'hypoténuse mesure ${AC}cm, quelle est la meilleure valeure approchée d'une angle dont le coté adjacent est de longueur ${AB}cm ?`,
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
                    course: ["Le PCGD de deux nombres entiers A et B est le plus grand nombre qui divise à la fois A et B.",
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
                    statement: `Quelle est l'énergie cinétique d'un objet de ${m} kilos se déplaçant à la vitesse de ${v} m/s ?`,
                    correct: `${m*(v**2)/2}J`,
                    wrong: [`${m*(v**2)}J`, `${m*v/2}J`, `${m*v}J`],
                    course: ["Un objet de masse m et animé d’une vitesse v possède une énergie de mouvement",
                             "Elle est appelée énergie cinétique et égale à Ec = ½mv²"],
                }
            },
            () => {
                let U = getRandomArbitrary(2, 10);
                let I = getRandomArbitrary(2, 10);
                return {
                    statement: `Quelle est la puissance d'une source électrique de tension ${U} V et d'intensité ${I} ampères ?`,
                    correct: `${I*U} W`,
                    wrong: [`${I+U} W`, `${I*U/2}W`, `${Math.max(I, U)}W`],
                    course: ["La puissance d'une source électrique est donnée par la formule P = U I",
                            "où U est la tension et I l'intensité"],
                }
            },
        ],
        "svt": [
            definitionQuestion({
                "ADN": "molécule organique constituée de nucléotides, support de l’information génétique",
                "allèle": "une des différentes versions d’un gène, dues à des changements de la séquence nucléotidique",
                "chromosome": "ensembles d’éléments d’information liés entre eux dans une même molécule d’ADN",
                "gène": "séquence(s) d’ADN situé à un endroit précis, d’un chromosome donné et constituant une unité d’information",
                "génome": "ensemble des gènes d’un organisme",
                "locus": "Point précis du chromosome occupé par un gène donné.",
                "mutation": "Toute modification du génotype par altération de la séquence d’un fragment d’ADN",
                "phénotype": "Ensemble des caractères observables d’un individu.",
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
        let chosen_question = getRandomArbitrary(0, question_count);
        for (let level = 0; level < maxLevel; level++) {
            if (questions[level].hasOwnProperty(field)) {
                let questionsForThisLevel = questions[level][field];
                if (chosen_question < questionsForThisLevel.length) {
                    return questionsForThisLevel[chosen_question]().course || null;
                } else {
                    chosen_question -= questionsForThisLevel.length;
                }
            }
        }
    }
    return null;
}

// Export some objects for the game and for dump-questions.ts.
export { questions, pickRandomQuestion, pickRandomCourse }
