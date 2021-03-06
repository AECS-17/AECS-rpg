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
                return ["???? ??????????? ??? ???????? ????????? ??????????? ?????????????????? ??????? ???????????? ??????? ?????????????? ??????????????"];
            }
        }),
        TextEvent({
            name: 'EV-DISPLAY-1',
            getText: function(player: RpgPlayer) {
                return ["AVIS AUX HABITANTS", "Une Sphinge carnivore hante la r??gion.", "Signe distinctif : pose des ??nigmes potentiellement dangereuse.", "Si vous disposez d'information la concernant, contactez le num??ro ??crit en bas de l'affiche.", " N???agissez pas seul."];
            }
        }),
        TextEvent({
            name: 'EV-DISPLAY-2',
            getText: function(player: RpgPlayer) {
                return ["?????? Librairie",
                        "?????? Passerelle Nord",
                        "?????? ??le de la rose",
                        "?????? Passerelle Sud"];
            }
        }),
        TextEvent({
            name: 'EV-DISPLAY-3',
            getText: function(player: RpgPlayer) {
                return ["?????? Passerelle Nord",
                        "?????? Toutes directions",
                        "?????? Auberge",
                        "?????? Autres directions"];
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
                    return ["Je vois que tu as des outils math??matiques int??ressants...",
                            "Oh l??, pauvre manuel, il est tout d??chiquet?? ! Tu t'es pris??e pour Marcel Duchamp ou quoi ?",
                            "H?? h??. Tra??ons une petite rosace... hop ! hop !",
                            "Ah un boulier, ??a j'adore ! unit??s, dizaines, centaines...",
                            "C'est sympa ! ?? moi de t'offrir quelque chose alors.",
                            `Re??u: ${Heartsnatcher.prototype['name']}.`];
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
                    [`Non, je ne suis pas une princesse ?? sauver !`,
                     `Il faudrait peut-??tre ??voluer un peu ?`],
                    [`Les seules armes dans ce jeu sont intellectuelles...`,
                     `Non ?? la violence !`],
                    [`Plut??t que de rester ?? jouer devant ton ??cran,`,
                     `tu ne pr??f??rerais pas plut??t lire un livre,`,
                     `par exemple Anna Kar??nine ou Madame Bovary ?`],
                    [`En effet tu ne trouveras pas d'argent dans ce jeu.`,
                     `Pourquoi poss??der quand on peut partager ?`],
                    [`Ce jeu a pas mal de bugs, tu ne trouves pas ?`],
                    ["Dans ce jeu il faut alterner la parole ?? l'Ange et au Chevalier."],
                    [`Il n'y a pas de comp??tition dans ce jeu...`,
                     `Ni vainqueurs ni perdants,`,
                     `Progressons tous ensemble et chacun ?? son rythme !`],
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
                    ["Va voir l'ermite au nord-est si tu cherches une cl??."],
                    ["Montre des instruments scientifiques ?? la femme au nord du village.",
                     "Elle te donnera un appareil pour gagner du temps contre la Sphinge."],
                     ["La personne au sud du village adore les outils math??matiques.",
                     "Elle poss??de un objet pour d??rober des vies ?? la Sphinge."],
                     ["Le vieillard sur l'??le de l'ouest est un nostalgique des objets d'explorateurs",
                      "Il peut te fournir de quoi frapper plus fortement la sphinge."],
                      ["Le type de l'??le de l'est est un passionn?? de litt??rature.",
                      "Va le trouver avec un po??me si tu veux que la Sphinge propose moins d'options."],
                      ["Parle une fois ?? l'Ange, deux fois au Chevalier et trois fois ?? la Gargouille."],
                      ["Des objets se cachent dans les coffres, les amphores, le linge, les ??tag??res, les paneaux et les statues."],
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
                    return ["Tiens donc, tu poss??des un assemblage h??t??roclite d'instruments scientifiques...",
                            "Une erlenmeyer : la titrim??trie j'en ai eu ma dose ?? la fac !",
                            "Ah, comme je dis toujours j'ai z??ro culture mais j'ai ma boite de P??tri !",
                            "Enfin un amp??rem??tre, j'??tais pas au courant que ??a existait encore...",
                            "Attends une seconde, j'ai un pr??sent pour toi...",
                            `Re??u: ${TemporalDistorsor.prototype['name']}.`];
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
                            "Ah une carte du monde... Une vie ne suffirait pas ?? d??couvrir toutes les cultures...",
                            "Un historique des grands ??venements pass??s. Montrons nous digne de les prolonger !",
                            "Un dictionnaire bilingue, c'??tait indispensable du temps o?? tous ces trucs technologiques n'existaient pas.",
                            "Tout cela me rend nostalgique. Pour exprimer ma gratitude, je te donne un petit quelque chose qui pourra t'??tre utile.",
                            `Re??u: ${Loudspeaker.prototype['name']}.`];
                }
                return pickRandomCourse(player.level, "g??ographie")
                    || [`J'ai beaucoup voyag?? !`];
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
                            "?? Au bois il y a un oiseau, son chant vous arr??te et vous fait rougir.",
                            "Il y a une horloge qui ne sonne pas.",
                            "Il y a une fondri??re avec un nid de b??tes blanches.",
                            "Il y a une cath??drale qui descend et un lac qui monte.",
                            "Il y a une petite voiture abandonn??e dans le taillis, ou qui descend le sentier en courant, enrubann??e.",
                            "Il y a une troupe de petits com??diens en costumes, aper??us sur la route ?? travers la lisi??re du bois.",
                            "Il y a enfin, quand l'on a faim et soif, quelqu'un qui vous chasse. ??",
                            "C'est magnifique ! Voil?? un petit cadeau pour te remercier.",
                            `Re??u: ${MagicEraser.prototype['name']}.`];
                }
                return pickRandomCourse(player.level, "fran??ais")
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
                    return ["Regarde ce que j'ai trouv?? en parlant aux statues !",
                            `Re??u: ${BilingualDictionary.prototype['name']}.`,
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
            text: "On peut lire sur socle : ?? 0. Ange ??",
        }),
        StatueEvent({
            name: 'EV-STATUE-2',
            code: [0, 1, 0, 1, 0, 1],
            gain: Amperemeter,
            value: 1,
            text: "La statue comporte l'inscription : ?? 1. Chevalier ??",
        }),
        StatueEvent({
            name: 'EV-STATUE-3',
            code: [0, 1, 1, 2, 2, 2],
            gain: Abacus,
            value: 2,
            text: "Il est ??crit le texte suivant : ?? 2. Gargouille ??",
        }),
        VillagerEvent({
            name: 'EV-DOG-1',
            getText: function(player: RpgPlayer) {
                return player.hasItem(Talisman) ?
                    [`???? Wouaf ! Wouaf !`] :
                    [`WAF ! WAF ! GRRRRRR... WAF !`];
            },
            graphic: 'dog1_2',
            moveRandom: true
        }),
        VillagerEvent({
            name: 'EV-CAT-1',
            getText: function(player: RpgPlayer) {
                return player.hasItem(Talisman) ?
                    [`???? Miaaaaou !`] :
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
