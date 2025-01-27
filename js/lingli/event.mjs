import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
const lingli_event = {
    "xjb_qiling": {
        player: function (num = 1, source) {
            let next = game.createEvent('xjb_qiling');
            next.player = this;
            next.num = num;
            next.source = source;
            next.setContent('xjb_qiling');
            return next
        },
        content: function () {
            "step 0"
            if (event.num === 0) {
                event.trigger("xjb_qilingZero");
                event.finish();
            }
            "step 1"
            game.log(player, "进行了一次启灵")
            const num = get.xjb_randomNDInt(3, 0.9);
            player.xjb_addLingli(num);
            event.num--;
            "step 2"
            if (event.num > 0) event.goto(1);
        }
    },
    "xjb_transDensity": {
        player: function () {
            const player = this;
            const next = game.createEvent('xjb_transDensity')
            next.player = player;
            next.setContent("xjb_transDensity");
            return next;
        },
        /**
         * @param {GameEvent} event 
         * @param {GameEvent} trigger 
         * @param {Player} player 
         */
        content: async function (event, trigger, player) {
            "step 0"
            while (!player.xjb_isLingliStable()) {
                const status = player.xjb_getLingliStatus();
                await player.xjb_loseLingli(1, status);
                await player.xjb_addLingliDensity(1, status);
            }
            event.trigger("xjb_transLingliStable");
        }
    },

    "xjb_loseLingli": {
        player: function (num = 1, status) {
            const player = this;
            let next = game.createEvent('xjb_loseLingli')
            next.player = player
            if (status && num < 0) {
                num = 0;
            }
            next.status = status;
            next.num = num
            next.setContent('xjb_loseLingli');
            return next
        },
        /**
         * @param {GameEvent} event 
         * @param {GameEvent} trigger 
         * @param {Player} player 
         */
        content: async function (event, trigger, player) {
            if (event.num === 0) {
                await event.trigger("xjb_lingliLoseZero");
                return;
            }
            if (event.num > 0 && !event.status) {
                event.status = "positive"
            }
            if (event.num < 0 && !event.status) {
                event.status = "negative";
                event.num = Math.abs(event.num)
            }
            const cards = player.xjb_getLingli(event.status).randomGets(event.num);
            player.lose(ui.ordering, cards);
            cards.forEach(card => {
                card.remove();
                card.fix();
                card.destroyed = true;
            })
        },
    },
    "xjb_addLingli": {
        player: function (num = 1, status) {
            const player = this; let next = game.createEvent('xjb_addLingli');
            next.player = player;
            if (status && num < 0) {
                num = 0;
            }
            next.status = status;
            next.num = num;
            next.setContent('xjb_addLingli');
            return next
        },
        /**
         * @param {GameEvent} event 
         * @param {GameEvent} trigger 
         * @param {Player} player 
         */
        content: async function (event, trigger, player) {
            if (event.num === 0) {
                await event.trigger("xjb_lingliAddZero");
                return;
            }
            if (event.num > 0 && !event.status) {
                event.status = "positive"
            }
            if (event.num < 0 && !event.status) {
                event.status = "negative";
                event.num = Math.abs(event.num)
            }
            const cards = [];
            for (let i = 0; i < event.num; i++) {
                const card = game.createCard("xjb_lingli");
                cards.push(card);
            }
            if (event.status === "negative") {
                cards.forEach(card => {
                    card.classList.add("xjb-color-invert")
                });
            }
            player.loseToSpecial(cards, "xjb_lingli", player);
        },
    },
    "xjb_addLingliDensity": {
        player: function (num = 1, status) {
            const player = this;
            const next = game.createEvent('xjb_addLingliDensity')
            next.player = player;
            if (!status && num > 0) {
                status = 'positive';
            }
            if (!status && num < 0) {
                status = "negative";
            }
            if (status === "negative" && num > 0) {
                num = -num;
            }
            if (status === "positive" && num < 0) {
                num = 0;
            }
            next.status = status;
            next.num = num;
            next.setContent('xjb_addLingliDensity');
            return next
        },
        /**
         * @param {GameEvent} event 
         * @param {GameEvent} trigger 
         * @param {Player} player 
         */
        content: async function (event, trigger, player) {
            game.broadcastAll(player => {
                if (!player.storage.xjb_lingliDensity) player.storage.xjb_lingliDensity = 0
                player.storage.xjb_lingliDensity += event.num;
            }, player)
            player.markSkill("xjb_lingliDensity")
            game.broadcastAll(player => {
                if (player.marks.xjb_lingliDensity) {
                    if (player.xjb_getLingliDensity() >= 0) player.marks.xjb_lingliDensity.classList.remove("xjb-color-invert")
                    else player.marks.xjb_lingliDensity.classList.add("xjb-color-invert");
                }
            }, player)
        },
    },

    "xjb_addZhenFa": {
        player: function (cards) {
            let next = game.createEvent('xjb_addZhenFa')
            next.player = this
            next.cards = cards
            if (!Array.isArray(cards)) next.cards = [cards]
            next.setContent('xjb_addZhenFa');
            return next
        },
        content: function () {
            "step 0"
            player.addToExpansion(event.cards, 'gain2').gaintag.add("_xjb_zhenfa");
            game.log(player, event.cards, '进入阵法区');
            "step 1"
            const zhenfa = player.getExpansions("_xjb_zhenfa");
            if (zhenfa.length > 3) player.xjb_discardZhenfaCard(3 - zhenfa.length);
            player.getHistory()["custom"].push(event);
        },
    },
    "xjb_discardZhenfaCard": {
        player: function (num = 1, filterButton) {
            /**
            * @type {Player}
            */
            const player = this;
            let next = game.createEvent('xjb_discardZhenfaCard')
            next.player = player;
            next.num = num;
            next.filterButton = filterButton;
            next.setContent('xjb_discardZhenfaCard');
            return next
        },
        content: function () {
            "step 0"
            player.chooseButton(
                ["选择从阵法区中移除牌", player.getExpansions("_xjb_zhenfa")],
                event.number,
                true,
                event.filterButton
            );
            "step 1"
            if (result && result.links) {
                player.gain(result.links, "gain2");
            }
        }
    }
}
/**
 * @type {Player}
 */
const lingli_method = {
    "xjb_getLingli": function (status, position = "s") {
        const player = this;
        const allLingli = player.getCards(position, card => card.name === "xjb_lingli");
        if (status === "positive") return allLingli.filter(card => !card.classList.contains("xjb-color-invert"));
        if (status === "negative") return allLingli.filter(card => card.classList.contains("xjb-color-invert"));
        return allLingli;
    },
    "xjb_hasLingli": function (status, position) {
        const player = this;
        return player.xjb_getLingli(status, position).length > 0;
    },
    "xjb_countLingli": function (status, position) {
        const player = this;
        if (!status) return player.xjb_countLingli("positive", position) - player.xjb_countLingli("negative", position);
        return player.xjb_getLingli(status, position).length;
    },
    "xjb_getLingliStatus": function (position) {
        const player = this;
        switch (Math.sign(player.xjb_countLingli(void 0, position))) {
            case 1: return "postive";
            case -1: return "negative";
            default: return null;
        }
    },
    //获取灵力密度
    "xjb_getLingliDensity": function () {
        const player = this;
        if (!player.storage.xjb_lingliDensity) {
            game.broadcastAll((player) => {
                player.storage.xjb_lingliDensity = 0
            }, player);
        }
        return player.storage.xjb_lingliDensity;
    },
    //判断灵力是否稳定
    "xjb_isLingliStable": function () {
        const player = this;
        const value = player.xjb_countLingli();
        const sign = Math.sign(value), abs = Math.abs(value);
        return sign * player.xjb_getLingliDensity() >= abs;
    },
    //获取正灵力和反灵力同时存在的区域
    "xjb_getLingliPeaceless": function () {
        const player = this;
        let result = ""
        for (const position of "hejxs") {
            if (player.xjb_hasLingli("negative", position) && player.xjb_hasLingli("positive", position)) {
                result += position;
            }
        }
        return result;
    },
    //
    "xjb_canUseLingli": function () {
        const player = this;
        if (!lib.config.xjb_lingli_Allallow) {
            const bool1 = !lib.xjb_lingliUser.includes(player.name1) && !lib.xjb_lingliUser.includes(player.name2);
            const bool2 = !player.storage.xjb_tempAllowUseLingli
            if (bool1 && bool2) return false;
        }
        return true;
    }
}
for (const event in lingli_event) {
    lib.element.Player.prototype[event] = lingli_event[event].player;
    lib.element.content[event] = lingli_event[event].content;
}
for (const method in lingli_method) {
    lib.element.Player.prototype[method] = lingli_method[method];
}