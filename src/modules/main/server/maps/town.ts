// This file is released under the MIT License. See the LICENSE file.

import { RpgMap, MapData, RpgPlayer } from '@rpgjs/server'
import { ApothecaryEvent } from '../events/apothecary';
import { ChestEvent } from '../events/chest';
import { DoyenneEvent } from '../events/doyenne';
import { EnemyEvent } from '../events/enemy'
import { ErmitEvent } from '../events/ermit';
import { ItemEvent } from '../events/item';
import { SphingeEvent } from '../events/sphinge';
import { StatueEvent } from '../events/statue'
import { TextEvent } from '../events/text';
import { VillagerEvent } from '../events/villager'
import { pickRandomCourse } from '../questions'

import { Key } from '../database/items/key';
import { Manuscript1, Manuscript2, Manuscript3 } from '../database/items/manuscripts';
import { ReadymadeMalheureux, Compass, Abacus } from '../database/items/maths'
import { ErlenmeyerFlask, PetriDish, Amperemeter } from '../database/items/experimental-sciences'
import { Timeline, WorldMap, BilingualDictionary } from '../database/items/human-sciences'
import { Talisman, MagicEraser, Heartsnatcher, TemporalDistorsor, Loudspeaker } from '../database/items/bonus'

@MapData({
    id: 'town',
    file: require('./tmx/town.tmx'),
    name: 'Town',
    events: [
        SphingeEvent,
        DoyenneEvent,
        ChestEvent({
            name: 'EV-CHEST-1',
            locked: true,
            gain: Manuscript1
        }),
        ChestEvent({
            name: 'EV-CHEST-2',
            locked: true,
            gain: Compass
        }),
        ChestEvent({
            name: 'EV-CHEST-3',
            locked: true,
            gain: PetriDish
        }),
        ChestEvent({
            name: 'EV-CHEST-4',
            locked: true,
            gain: WorldMap
        }),
        ItemEvent({
            name: 'EV-ITEM-1',
            gain: Manuscript2
        }),
        TextEvent({
            name: 'EV-ITEM-2',
            getText: function(player: RpgPlayer) { return ["Cette amphore est vide..."]; }
        }),
        TextEvent({
            name: 'EV-ITEM-3',
            getText: function(player: RpgPlayer) { return ["Ce panier est vide..."]; }
        }),
        ItemEvent({
            name: 'EV-ITEM-4',
            gain: ReadymadeMalheureux
        }),
        ItemEvent({
            name: 'EV-ITEM-5',
            gain: ErlenmeyerFlask
        }),
        ItemEvent({
            name: 'EV-ITEM-6',
            gain: Timeline
        }),
        TextEvent({
            name: 'EV-BOOK-1',
            getText: function(player: RpgPlayer) {
                return ["τί ἐστιν ὃ μίαν ἔχον φωνὴν τετράπουν καὶ δίπουν καὶ τρίπουν γίνεται"];
            }
        }),
        TextEvent({
            name: 'EV-DISPLAY-1',
            getText: function(player: RpgPlayer) {
                return ["AVIS AUX HABITANTS", "Une Sphinge carnivore hante la région.", "Signe distinctif : pose des énigmes potentiellement dangereuse.", "Si vous disposez d'information la concernant, contactez le numéro écrit en bas de l'affiche.", " N’agissez pas seul."];
            }
        }),
        TextEvent({
            name: 'EV-DISPLAY-2',
            getText: function(player: RpgPlayer) {
                return ["➡️ Librairie",
                        "⬅️ Passerelle Nord",
                        "➡️ Île de la rose",
                        "⬅️ Passerelle Sud"];
            }
        }),
        TextEvent({
            name: 'EV-DISPLAY-3',
            getText: function(player: RpgPlayer) {
                return ["➡️ Passerelle Nord",
                        "⬅️ Toutes directions",
                        "➡️ Auberge",
                        "⬅️ Autres directions"];
            }
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-MATHS',
            getText: function(player: RpgPlayer) {
                if (player.hasItem(ReadymadeMalheureux) &&
                    player.hasItem(Compass) &&
                    player.hasItem(Abacus) &&
                    !player.hasItem(Heartsnatcher)) {
                    player.addItem(Heartsnatcher);
                    return ["Je vois que tu as des outils mathématiques intéressants...",
                            "Oh là, pauvre manuel, il est tout déchiqueté ! Tu t'es pris·e pour Marcel Duchamp ou quoi ?",
                            "Hé hé. Traçons une petite rosace... hop ! hop !",
                            "Ah un boulier, ça j'adore ! unités, dizaines, centaines...",
                            "C'est sympa ! À moi de t'offrir quelque chose alors.",
                            `Reçu: ${Heartsnatcher.prototype['name']}.`];
                }
                return pickRandomCourse(player.level, "maths")
                    || ["J'adore le calcul mental !"];
            },
            graphic: 'female22_2',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-META',
            getText: function(player: RpgPlayer) {
                let texts = [
                    [`Non, je ne suis pas une princesse à sauver !`,
                     `Il faudrait peut-être évoluer un peu ?`],
                    [`Les seules armes dans ce jeu sont intellectuelles...`,
                     `Non à la violence !`],
                    [`Plutôt que de rester à jouer devant ton écran,`,
                     `tu ne préfèrerais pas plutôt lire un livre,`,
                     `par exemple Anna Karénine ou Madame Bovary ?`],
                    [`En effet tu ne trouveras pas d'argent dans ce jeu.`,
                     `Pourquoi posséder quand on peut partager ?`],
                    [`Ce jeu a pas mal de bugs, tu ne trouves pas ?`],
                    ["Dans ce jeu il faut alterner la parole à l'Ange et au Chevalier."],
                    [`Il n'y a pas de compétition dans ce jeu...`,
                     `Ni vainqueurs ni perdants,`,
                     `Progressons tous ensemble et chacun à son rythme !`],
                ];
                return texts[Math.floor(Math.random() * texts.length)];
            },
            graphic: 'female2_2',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-AIDE',
            getText: function(player: RpgPlayer) {
                let index = player.getVariable('INFO_INDEX') || 0;
                let info = [
                    ["Ne t'approche pas la Sphinge avant de recevoir le talisman de la doyenne."],
                    ["Va voir l'ermite au nord-est si tu cherches une clé."],
                    ["Montre des instruments scientifiques à la femme au nord du village.",
                     "Elle te donnera un appareil pour gagner du temps contre la Sphinge."],
                     ["La personne au sud du village adore les outils mathématiques.",
                     "Elle possède un objet pour dérober des vies à la Sphinge."],
                     ["Le vieillard sur l'île de l'ouest est un nostalgique des objets d'explorateurs",
                      "Il peut te fournir de quoi frapper plus fortement la sphinge."],
                      ["Le type de l'île de l'est est un passionné de littérature.",
                      "Va le trouver avec un poème si tu veux que la Sphinge propose moins d'options."],
                      ["Parle une fois à l'Ange, deux fois au Chevalier et trois fois à la Gargouille."],
                      ["Des objets se cachent dans les coffres, les amphores, le linge, les étagères, les paneaux et les statues."],
                      ["Va voir l'apothicaire si tu ne te sens pas bien."],
                ];
                player.setVariable('INFO_INDEX', (index + 1) % info.length);
                return info[index];
            },
            graphic: 'female5_4',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-PHYSIQUE',
            getText: function(player: RpgPlayer) {
                if (player.hasItem(ErlenmeyerFlask) &&
                    player.hasItem(PetriDish) &&
                    player.hasItem(Amperemeter) &&
                    !player.hasItem(TemporalDistorsor)) {
                    player.addItem(TemporalDistorsor);
                    return ["Tiens donc, tu possèdes un assemblage hétéroclite d'instruments scientifiques...",
                            "Une erlenmeyer : la titrimétrie j'en ai eu ma dose à la fac !",
                            "Ah, comme je dis toujours j'ai zéro culture mais j'ai ma boite de Pétri !",
                            "Enfin un ampèremètre, j'étais pas au courant que ça existait encore...",
                            "Attends une seconde, j'ai un présent pour toi...",
                            `Reçu: ${TemporalDistorsor.prototype['name']}.`];
                }
                return pickRandomCourse(player.level, "physique")
                    || ["Vive la science !"];
            },
            graphic: 'female13_2',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-CHIMIE',
            getText: function(player: RpgPlayer) {
                return pickRandomCourse(player.level, "chimie")
                    || ["Ne plonge jamais du sodium dans de l'eau !"];
            },
            graphic: 'male7_3',
            moveRandom: false
        }),
        ApothecaryEvent,
        VillagerEvent({
            name: 'EV-VILLAGER-GEOGRAPHIE',
            getText: function(player: RpgPlayer) {
                if (player.hasItem(WorldMap) &&
                    player.hasItem(Timeline) &&
                    player.hasItem(BilingualDictionary) &&
                    !player.hasItem(Loudspeaker)) {
                    player.addItem(Loudspeaker);
                    return ["Salut petit, je suis curieux de savoir ce que tu as dans ta besace...",
                            "Ah une carte du monde... Une vie ne suffirait pas à découvrir toutes les cultures...",
                            "Un historique des grands évenements passés. Montrons nous digne de les prolonger !",
                            "Un dictionnaire bilingue, c'était indispensable du temps où tous ces trucs technologiques n'existaient pas.",
                            "Tout cela me rend nostalgique. Pour exprimer ma gratitude, je te donne un petit quelque chose qui pourra t'être utile.",
                            `Reçu: ${Loudspeaker.prototype['name']}.`];
                }
                return pickRandomCourse(player.level, "géographie")
                    || [`J'ai beaucoup voyagé !`];
            },
            graphic: 'male12_2',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-HISTOIRE',
            getText: function(player: RpgPlayer) {
                return pickRandomCourse(player.level, "histoire")
                    || ["L'invasion des Huns n'a pas eu lieu en 111 !"];
            },
            graphic: 'female10_2',
            moveRandom: false
        }),
        ErmitEvent,
        VillagerEvent({
            name: 'EV-VILLAGER-FRANCAIS',
            getText: function(player: RpgPlayer) {
                if (player.hasItem(Manuscript1) &&
                    player.hasItem(Manuscript2) &&
                    player.hasItem(Manuscript3) &&
                    !player.hasItem(MagicEraser)) {
                    player.addItem(MagicEraser);
                    return ["Oh, tu as le manuscrit de Enfance III !",
                            "« Au bois il y a un oiseau, son chant vous arrête et vous fait rougir.",
                            "Il y a une horloge qui ne sonne pas.",
                            "Il y a une fondrière avec un nid de bêtes blanches.",
                            "Il y a une cathédrale qui descend et un lac qui monte.",
                            "Il y a une petite voiture abandonnée dans le taillis, ou qui descend le sentier en courant, enrubannée.",
                            "Il y a une troupe de petits comédiens en costumes, aperçus sur la route à travers la lisière du bois.",
                            "Il y a enfin, quand l'on a faim et soif, quelqu'un qui vous chasse. »",
                            "C'est magnifique ! Voilà un petit cadeau pour te remercier.",
                            `Reçu: ${MagicEraser.prototype['name']}.`];
                }
                return pickRandomCourse(player.level, "français")
                    || [`Toi aussi tu aimes lire ?`];
            },
            graphic: 'male16_3',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-VILLAGER-LANGUES',
            getText: function(player: RpgPlayer) {
                if (!player.hasItem(BilingualDictionary)) {
                    player.addItem(BilingualDictionary);
                    return ["Regarde ce que j'ai trouvé en parlant aux statues !",
                            `Reçu: ${BilingualDictionary.prototype['name']}.`,
                            "Il doit avoir moyen d'obtenir plus d'objets en essayant d'autres combinaisons..."];
                }
                return pickRandomCourse(player.level, "langues")
                    || ["Je suis polyglotte !"];
            },
            graphic: 'male17_2',
            moveRandom: true
        }),
        StatueEvent({
            name: 'EV-STATUE-1',
            code: [2, 1, 0, 2, 1, 0],
            gain: Manuscript3,
            value: 0,
            text: "On peut lire sur socle : « 0. Ange »",
        }),
        StatueEvent({
            name: 'EV-STATUE-2',
            code: [0, 1, 0, 1, 0, 1],
            gain: Amperemeter,
            value: 1,
            text: "La statue comporte l'inscription : « 1. Chevalier »",
        }),
        StatueEvent({
            name: 'EV-STATUE-3',
            code: [0, 1, 1, 2, 2, 2],
            gain: Abacus,
            value: 2,
            text: "Il est écrit le texte suivant : « 2. Gargouille »",
        }),
        VillagerEvent({
            name: 'EV-DOG-1',
            getText: function(player: RpgPlayer) {
                return player.hasItem(Talisman) ?
                    [`🐶 Wouaf ! Wouaf !`] :
                    [`WAF ! WAF ! GRRRRRR... WAF !`];
            },
            graphic: 'dog1_2',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-CAT-1',
            getText: function(player: RpgPlayer) {
                return player.hasItem(Talisman) ?
                    [`🐱 Miaaaaou !`] :
                    [`FFFFFFFFF !!!!`];
            },
            graphic: 'cat1_1',
            moveRandom: true,
        }),
        EnemyEvent({
            name: 'EV-ENEMY-1',
            graphic: 'enemy3_1',
            moveRandom: true,
        }),
        EnemyEvent({
            name: 'EV-ENEMY-2',
            graphic: 'enemy7_1',
            moveRandom: true
        }),
        EnemyEvent({
            name: 'EV-ENEMY-3',
            graphic: 'enemy11_1',
            moveRandom: true
        }),
        EnemyEvent({
            name: 'EV-ENEMY-4',
            graphic: 'enemy13_1',
            moveRandom: true
        }),
        EnemyEvent({
            name: 'EV-ENEMY-5',
            graphic: 'enemy3_1',
            moveRandom: true
        }),
        EnemyEvent({

            name: 'EV-ENEMY-6',
            graphic: 'enemy7_1',
            moveRandom: true
        }),
        EnemyEvent({
            name: 'EV-ENEMY-7',
            graphic: 'enemy11_1',
            moveRandom: true
        }),
        EnemyEvent({
            name: 'EV-ENEMY-8',
            graphic: 'enemy13_1',
            moveRandom: true
        }),
    ]
})
export class TownMap extends RpgMap {
}
