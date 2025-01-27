export function LOAD_REMNANT_AREA(lib, game, ui, get, ai, _status) {
    lib.skill._xjb_remnantArea = {
        mod: {
            "cardEnabled2": function (card, player) {
                var remnant = player.getCards("s").filter(i => {
                    return i.hasGaintag("_xjb_remnantArea")
                });
                if (remnant.includes(card)) return false
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
                const cardName = card.name;
                if (!cardList[cardName]) {
                    cardList[cardName] = [];
                }
                cardList[cardName].push(card);
            });
            for (const cardName in cardList) {
                const cards = cardList[cardName];
                let toUse = parseInt(cards.length / 2);
                let remainder = cards.length % 2;
                let toGain = 0;
                if (lib.card[cardName].type === "delay") {
                    if (!player.canAddJudge(cardName)) {
                        continue;
                    } else if (cards.length > 1) {
                        toUse = 1;
                        remainder = cards.length - 2;
                        ui.updatehl();
                    }
                }
                if (lib.card[cardName].type === 'equip') {
                    if (!player.canEquip(cardName)) {
                        toGain = toUse;
                        toUse = 0;
                    } else if (cards.length > 1) {
                        toGain = toUse--;
                        ui.updatehl();
                    }
                }
                if (cardName === "tao" && toUse > player.getDamagedHp()) {
                    toGain = toUse - player.getDamagedHp();
                    toUse = player.getDamagedHp();
                }
                if (["jiu","shan","du"].includes(cardName)) {
                    toGain = toUse;
                    toUse = 0;
                }
                while (cards.length > remainder) {
                    cards.pop().discard();
                    ui.updatehl();
                }
                for (let i = 0; i < toUse; i++) {
                    player.useCard(game.createCard(cardName, 'none'), player, false);
                    player.popup(`残【${get.translation(cardName)}】`);
                }
                for (let i = 0; i < toGain; i++) {
                    player.gain(game.createCard(cardName, 'none'));
                }
            }
            player.updateMarks();
        }
    }
    lib.translate._xjb_remnantArea = "<font color=gold>残区</font>"

    game.xjb_setEvent('xjb_gainRemnantCard',
        {
            player(cardName, num = 1) {
                const player = this;
                const next = game.createEvent('xjb_gainRemnantCard')
                next.setContent('xjb_gainRemnantCard');
                next.player = player;
                next.cardName = cardName;
                next.num = num;
                return next
            },
            content() {
                const cards = [];
                for (let i = 0; i < event.num; i++) {
                    cards.push(game.createCard(event.cardName, 'none'));
                }
                player.gain(cards, "gain2");
                player.loseToSpecial(cards, '_xjb_remnantArea');
                player.popup(get.translation("_xjb_remnantArea"));
            }
        }
    )
}