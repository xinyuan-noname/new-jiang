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
            const num = new Array(5).fill().map((_, index) => parseInt(Math.random() * index) + 1).randomGet();
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
                await player.xjb_loseLingli();
                await player.xjb_addLingliDensity();
            }
            event.trigger("xjb_transLingliStable");
        }
    },

    "xjb_chooseToBuildBridge": {
        player: function (target) {
            game.xjb_checkCharCountAll(this.name);
            let next = game.createEvent('xjb_chooseToBuildBridge')
            next.player = this
            next.target = target
            next.setContent('xjb_chooseToBuildBridge');
            return next
        },
        content: function () {
            "step 0"
            if (player != game.me) player.storage.xjb_daomoMax = 5;
            var list = [], maxNum = player.storage.xjb_daomoMax || 1;
            let dataSource = lib.config.xjb_count[player.name].daomo;
            function add(str, str2) {
                if (dataSource[str] && dataSource[str].number >= maxNum) {
                    list.push([str, `${str2 + xjbLogo[str](80)}`])
                }
            };
            xjb_lingli.daomo.type.forEach((i) => {
                add(i, get.xjb_daomoInformation(i).translation)
            });
            let div = document.createElement("div"),
                range = document.createElement("input")
            range.type = 'range'
            range.value = (player.storage.xjb_daomoMax || 1);
            range.min = 1;
            range.max = 5;
            range.onchange = function () {
                player.storage.xjb_daomoMax = (-(-this.value))
                this.parentNode.parentNode.querySelector('.xjb-daomo-length').innerText = (player.storage.xjb_daomoMax || 1);
                ui.selected.buttons.forEach(i => {
                    i.click()
                    i.dispatchEvent(new TouchEvent("touchend", {
                        bubbles: true,
                        cancelable: true,
                        composed: true
                    }))
                })
                game.check()
            }
            div.appendChild(range)
            const dialog = ui.create.dialog(
                `请选择一个导魔介质，放置<span class=xjb-daomo-length>${(player.storage.xjb_daomoMax || 1)}</span>对在你和${get.translation(event.target)}间`,
                [list, "tdnodes"],
                "调整放置的导魔介质",
                div,
                ''
            )
            const next = player.chooseButton(dialog, [0, 1]);
            next.set('filterButton', function (button) {
                let logo = button.link
                return lib.config.xjb_count[player.name].daomo[logo].number >= (player.storage.xjb_daomoMax || 1)
            });
            "step 1"
            if (result.links && result.links.length) {
                let logo = result.links[0];
                game.xjb_getDaomo(player, logo, -player.storage.xjb_daomoMax);
                event.logo = result.links[0];
                player.addMark("_xjb_daomo_" + logo, player.storage.xjb_daomoMax);
                event.target.addMark("_xjb_daomo_" + logo, player.storage.xjb_daomoMax);
                player.xjb_switchlingli()
                event.target.xjb_switchlingli()
            }
        },
    },
    "xjb_loseLingli": {
        player: function (num = 1) {
            const player = this;
            let next = game.createEvent('xjb_loseLingli')
            next.player = player
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
            const cards = player.xjb_getLingli();
            player.lose(ui.ordering, cards.randomGets(event.num));
        },
    },
    "xjb_addLingli": {
        player: function (num = 1) {
            const player = this;
            let next = game.createEvent('xjb_addLingli')
            next.player = player
            next.num = num
            next.setContent('xjb_addLingli');
            return next
        },
        /**
         * @param {GameEvent} event 
         * @param {GameEvent} trigger 
         * @param {Player} player 
         */
        content: async function (event, trigger, player) {
            const cards = [];
            for (let i = 0; i < event.num; i++) {
                const card = game.createCard("xjb_lingli");
                cards.push(card);
            }
            player.loseToSpecial(cards, "xjb_lingli", player);
        },
    },
    "xjb_addLingliDensity": {
        player: function (num = 1) {
            const player = this;
            let next = game.createEvent('xjb_addLingliDensity')
            next.player = player
            next.num = num
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
                player.storage.xjb_lingliDensity++;
            }, player)
            player.markSkill("xjb_lingliDensity")
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
            player.actionHistory.at(-1)["custom"].push(event);
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
    "xjb_getLingli": function () {
        const player = this;
        return player.getCards("s", card => card.name === "xjb_lingli" && card.hasGaintag("xjb_lingli"))
    },
    "xjb_hasLingli": function () {
        const player = this;
        return player.xjb_getLingli().length > 0;
    },
    "xjb_countLingli": function () {
        const player = this;
        return player.xjb_getLingli().length;
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
        return player.xjb_countLingli() <= player.xjb_getLingliDensity()
    },
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