import { _status, lib, game, ui, get, ai } from "../../../../noname.js";
const setEvent = (name, { player, content }) => {
    lib.element.player[name] = get.copy(player)
    lib.element.content[name] = get.copy(content)
}
lib.skill._xjb_remnantArea = {
    mod: {
        cardEnabled2: function (card, player) {
            if (card.hasGaintag("_xjb_remnantArea")) {
                return false
            }
        },
    },
    trigger: {
        player: ["phaseJudgeBefore", 'xjb_gainRemnantCardAfter']
    },
    filter: function (_, player) {
        return player.getCards("s").filter(i => {
            return i.hasGaintag("_xjb_remnantArea")
        }).length > 0
    },
    direct: true,
    charlotte: true,
    forced: true,
    content: function () {
        "step 0"
        const cardList = {};
        let taggedCards = player.getCards("s").filter(card => card.hasGaintag("_xjb_remnantArea"));
        taggedCards.forEach(card => {
            const record = card.nature ? card.name + ":" + card.nature : card.name
            if (!cardList[record]) {
                cardList[record] = [];
            }
            cardList[record].push(card);
        });
        outer: for (const record in cardList) {
            const cards = cardList[record];
            const [cardName, cardNature] = record.split(":")
            const remove = [];
            let countNumber = 0;
            for (const card of cards) {
                let toGain = false;
                countNumber += card.number;
                remove.push(card);
                if (countNumber < 13) continue;
                if (lib.card[cardName].type === "delay") {
                    if (!player.canAddJudge(cardName)) continue outer;
                }
                if (lib.card[cardName].type === 'equip') {
                    toGain = !player.canEquip(cardName);
                }
                if (cardName === "tao" && player.isHealthy()) toGain = true;
                if (["jiu", "shan", "du"].includes(cardName)) toGain = true;
                player.lose(remove); remove.length = 0; countNumber = 0;
                if (toGain) {
                    player.gain(game.createCard(cardName, 'none', void 0, cardNature));
                } else {
                    player.useCard({
                        name: cardName,
                        nature: cardNature,
                    }, player, false);
                    player.popup(`残【${get.translation(cardName)}】`);
                }
            }
        }
        player.updateMarks();
    }
}
lib.translate._xjb_remnantArea = "<font color=gold>残区</font>"
game.addGlobalSkill("xjb_gainRemnantCard");
setEvent('xjb_gainRemnantCard',
    {
        player() {
            const player = this;
            const next = game.createEvent('xjb_gainRemnantCard')
            for (const arg of arguments) {
                if (typeof arg === "number") next.num = arg;
                else if (arg in lib.card) next.cardName = arg;
                else if (get.itemtype(arg) === "nature") next.nature = arg;
            }
            next.setContent('xjb_gainRemnantCard');
            next.player = player;
            next.num ??= 1;
            if (!lib.skill.global.includes('_xjb_remnantArea')) {
                game.addGlobalSkill("_xjb_remnantArea");
            }
            return next;
        },
        content() {
            const cards = [];
            for (let i = 0; i < event.num; i++) {
                cards.push(game.createCard(event.cardName, 'none', Math.floor(Math.random() * 13 + 1), event.nature));
            }
            player.gain(cards, "gain2");
            player.loseToSpecial(cards, '_xjb_remnantArea');
            player.popup(get.translation("_xjb_remnantArea"));
        }
    }
)
