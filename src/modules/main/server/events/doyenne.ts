// This file is released under the MIT License. See the LICENSE file.

import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'
import { Talisman, MagicEraser, Heartsnatcher, TemporalDistorsor, Loudspeaker } from '../database/items/bonus'

@EventData({
    name: 'EV-DOYENNE',
    hitbox: {
        width: 32,
        height: 16
    }
})
export class DoyenneEvent extends RpgEvent {
    onInit() {
        this.setGraphic('female19_3')
    }

    async changeName(player: RpgPlayer) {
        let name = "";
        const max_length = 16;
        while (name.length < max_length) {
            let message = "Quel est nom nom ?";
            let subsets = new Array(
                "ABCDEF",
                "GHIJKL",
                "MNOPQR",
                "STUVWX",
                "YZ-ÇÉÈ",
            );
            let options1 = new Array();
            subsets.forEach((s, i) => {
                options1.push({ value: i, text: `Lettres ${s.split('').join(', ')}`});
            });
            options1.push({value: -1,
                           text: `Valider ${name.length > 0 ? name : player.name}`});
            const choice1 = await player.showChoices(message,
                options1, { talkWith: this });
            if (!choice1 || choice1.value < 0)
                break;

            let characters = subsets[choice1.value].split('');
            let options2 = new Array();
            characters.forEach((c, i) => {
                options2.push({ value: i, text: `Lettre ${c}`});
            });
            options2.push({value: -1,
                           text: `Valider ${name.length > 0 ? name : player.name}`});
            const choice2 = await player.showChoices(message,
                options2, { talkWith: this });
            if (!choice2 || choice2.value < 0)
                break;
            name += characters[choice2.value];
        }
        if (name.length)
            player.name = name;
    }

    async onAction(player: RpgPlayer) {
        if (player.getVariable("DONE")) {
            await player.showText(`Merci de nous avoir sauvés !`, { talkWith: this });
            if (!player.hasItem(MagicEraser)) {
                await player.showText(`Si tu veux encore jouer, essaie de trouver la ${MagicEraser.prototype['name']}.`, { talkWith: this });
                return;
            }
            if (!player.hasItem(Heartsnatcher)) {
                await player.showText(`Tu en demandes encore ? Cherche l'${Heartsnatcher.prototype['name']}.`, { talkWith: this });
                return;
            }
            if (!player.hasItem(Loudspeaker)) {
                await player.showText(`Tu n'as pas encore tout trouvé. Par exemple il te manque le ${Loudspeaker.prototype['name']}`, { talkWith: this });
                return;
            }
            if (!player.hasItem(TemporalDistorsor)) {
                await player.showText(`Si tu veux continuer, il te reste à obtenir le l'${TemporalDistorsor.prototype['name']}.`, { talkWith: this });
                return;
            }
            await player.showText(`Félicitations, tu as obtenu tous les objets bonus.`, { talkWith: this });
            return;
        }

        if (!player.getVariable('INTRODUCTION')) {
            await player.showText(`Bienvenue ! Je suis ANTIGONE, la doyenne du village.`, { talkWith: this });
            await this.changeName(player);
            await player.showText(`Enchantée ${player.name} !`, { talkWith: this });
            await player.showText(`Une Sphinge erre actuellement dans les parages, en terrorisant tous les voyageurs.`, { talkWith: this });
            await player.showText(`Cette femme au corps de lion et aux ailes d'oiseau dévore les visiteurs qui ne parviennent pas à répondre à ses énigmes !`, { talkWith: this });
            player.setVariable('INTRODUCTION', true);
        }

        if (!player.hasItem(Talisman)) {
            let choiceAccept = await player.showChoices("Accepterais-tu de nous aider à vaincre la Sphinge ?", [
                    { value: true, text: "Vous pouvez compter sur moi !"},
                    { value: false, text: "Laissez-moi y réfléchir un peu..."},
            ]);
            if (!choiceAccept || !choiceAccept.value) {
                await player.showText(`D'accord, reviens me voir si tu changes d'avis !`, { talkWith: this });
                return;
            }
            await player.showText(`Merci beaucoup ! Avant de partir à sa recherche, laisse moi te tester un peu...`, { talkWith: this });

            // Question simple.
            var choice0;
            var message0 = "Combien font 6 fois 7 ?";
            do {
                choice0 = await player.showChoices(message0, [
                    { value: true, text: "Quarante-deux."},
                    { value: false, text: "Soixante-sept."},
                    { value: false, text: "Pas autant que moi et le calcul mental..."},
                    { value: false, text: "Je n'ai pas encore révisé la table de 6."},
                    { value: false, text: "Ça me rappelle vaguement une blague..." },
                ], { talkWith: this });
                message0 = "Heu, tu es sur·e ? Allez encore une chance...";
            } while (choice0 && !choice0.value);
            player.level = 1;

            // Question 6e.
            const choice1 = await player.showChoices(`Que peux-tu dire du nombre entier 26 ?`, [
                { value: false, text: "C'est un nombre premier."},
                { value: true, text: "Il possède trois diviseurs."},
                { value: false, text: "Il est divisible par trois."},
                { value: false, text: "Comme ça, rien ne me vient à l'esprit."},
            ], {talkWith: this});
            if (choice1 && choice1.value) {
                player.level++;

                // Question 5e.
                const choice2 = await player.showChoices(`Combien vaut -1 fois -1 ?`, [
                    { value: false, text: "-2"},
                    { value: false, text: "-1"},
                    { value: false, text: "Hein ?"},
                    { value: true, text: "1"},
                ], {talkWith: this});
                if (choice2 && choice2.value) {
                    player.level++;

                    // Question 4e.
                    const choice3 = await player.showChoices(`Quel est la longueur de l'hypothénuse d'un triangle rectangle dont les deux autres côtés mesurent 6 et 8 centimètres ?`, [
                        { value: false, text: "Je donne ma langue au chat."},
                        { value: false, text: "9cm."},
                        { value: true, text: "10cm."},
                        { value: false, text: "14cm."},
                    ], {talkWith: this});
                    if (choice3 && choice3.value) {
                        player.level++;

                        // Question 3e.
                        const choice4 = await player.showChoices(`Combien vaut le cosinus de 60° ?`, [
                            { value: false, text: 'Aucune idée.' },
                            { value: false, text: 'La moitié de la racine carré de 3.'},
                            { value: false, text: 'PI sur 3.' },
                            { value: true, text: 'Un demi.' },
                        ], { talkWith: this });
                        if (choice4 && choice4.value)
                            player.level++;
                    }
                }
            }
            await player.showText(`Je t'ai assigné un niveau de ${player.level} étoile(s).`, { talkWith: this });

            await player.showText(`Une dernière chose : garde ce pendentif, il te protégera contre le courroux de la Sphinge !`, { talkWith: this });
            await player.showText(`Reçu: Talisman de Paix.`, { talkWith: this });
            player.addItem(Talisman);


            await player.showText(`Bonne chance !`, { talkWith: this });
            return;
        }

        const choice5 = await player.showChoices(`Tu souhaites changer ton pseudo ?`, [
            { value: true, text: `Oui.` },
            { value: false, text: `Non, conserver ${player.name}.`},
        ], { talkWith: this });
        if (choice5 && choice5.value) {
            await this.changeName(player);
        }
        const choice6 = await player.showChoices(`Tu souhaites changer ton niveau ?`, [
            { value: 1, text: 'Primaire' },
            { value: 2, text: '6e'},
            { value: 3, text: '5e' },
            { value: 4, text: '4e' },
            { value: 5, text: '3e et plus' },
            { value: player.level, text: 'Conserver mon niveau actuel.' },
        ], { talkWith: this });
        if (choice6)
            player.level = choice6.value;
        await player.showText(`Bon courage !`, { talkWith: this });
    }
}
