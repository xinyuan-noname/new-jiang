import { _status, lib, ui, game, ai, get } from "../../../../noname.js"

const lingli_event = {
    "xjb_qiling": {
        player: function (num = 1) {
            let next = game.createEvent('xjb_qiling');
            next.player = this;
            next.num = num;
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
            const num = xjb_lingli.area["fanchan"](1);
            player.xjb_addlingli(num);
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
        content: function () {
            "step 0"
            if (player.xjb_isLingliStable()) {
                event.trigger("xjb_transLingliStable");
                event.finish();
            }
            "step 1"
            player.xjb_loselingli(1);
            player.storage.xjb_lingliDensity++;
            "step 2"
            event.goto(0);
        }
    },
    "xjb_transDensityForced": {
        player: function (num = 1) {
            const player = this;
            const next = game.createEvent('xjb_transDensityForced')
            next.player = player;
            next.num = num;
            next.setContent("xjb_transDensityForced");
            return next;
        },
        content: function () {
            "step 0"
            player.xjb_loselingli(event.num);
            player.storage.xjb_lingliDensity += event.num;
        }
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
    "xjb_molizeLingli": {
        player: function (num = 1, target, card) {
            if (!this.countMark("_xjb_lingli")) return
            let next = game.createEvent('xjb_molizeLingli')
            next.player = this
            next.num = num
            next.target = target || this
            if (card) next.card = card
            next.setContent('xjb_molizeLingli');
            return next
        },
        content: function () {
            "step 0"
            event.player.xjb_loselingli(event.num);
            "step 1"
            event.target.addMark("_xjb_moli", event.num);
            event.player.update();
            if (event.card) {
                if (typeof event.card == "string") {
                    lib.card.xjb_skillCard.cardConstructor(event.card);
                    lib.card.xjb_skillCard.skillLeadIn(event.card);
                    let card = game.createCard2(event.card + "_card");
                    event.target.xjb_addZhenFa(card)
                    event.num--
                }
            }
            "step 2"
            event.target.xjb_eventLine(-1 * event.num)
            "step 3"
            event.target.xjb_switchlingli()
        },
    },
    "xjb_chooseToBuildBridge": {
        player: function (target) {
            if (!lib.config.xjb_count[this.name]) return;
            if (!lib.config.xjb_count[this.name].daomo) {
                lib.config.xjb_count[this.name].daomo = {}
            };
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
            let dataSource = lib.config.xjb_count[player.name1].daomo;
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
    "xjb_switchlingli": {
        player: function () {
            let next = game.createEvent('xjb_switchlingli')
            next.player = this
            next.setContent('xjb_switchlingli');
            return next
        },
        content: function () {
            "step 0"
            //如果没有魔力，事件结束
            event.num = event.player.countMark("_xjb_moli")
            if (event.num <= 0) event.finish()
            "step 1"
            if (!xjb_lingli.daomo.test(event.player)) event.finish()
            if (xjb_lingli.daomo.find(event.player).length < 1) event.finish()
            event.list = xjb_lingli.daomo.list(event.player)
            "step 2"
            if (!event.list.length) {
                event.goto(4)
            }
            "step 3"
            let now = event.list.shift()
            let targets = game.players.filter((current, index) => {
                if (current == event.player) return false
                if (current.hasMark(now)) return true
            })
            if (targets.length) {
                targets.forEach((current) => {
                    if (!event.player.hasMark(now)) return
                    event.num--
                    player.removeMark("_xjb_moli")
                    player.removeMark(now)
                    current.removeMark(now)
                    let next = game.createEvent('xjb_lingHit');
                    next.player = event.player;
                    let num1 = current.countMark("_xjb_lingli"),
                        num2 = event.player.countMark("_xjb_lingli");
                    next.target = num1 < num2 ? current : event.player
                    next.type = now
                    next.setContent(function () {
                        let verb = xjb_lingli.daomo.event_mark[event.type]
                        if (event.target[verb]) event.target[verb]()
                        event.target.xjb_addlingli()
                    });
                })
            }
            if (event.num > 0) event.goto(2)
            "step 4"
            if (event.num > 0) event.goto(1)
        },
    },
    "xjb_loselingli": {
        player: function (num = 1) {
            let next = game.createEvent('xjb_loselingli')
            next.player = this
            next.num = num
            next.setContent('xjb_loselingli');
            return next
        },
        content: function () {
            "step 0"
            event.player.removeMark("_xjb_lingli", event.num)
            event.player.update()
        },
    },
    "xjb_addlingli": {
        player: function (num = 1, object) {
            let next = game.createEvent('xjb_addlingli')
            next.player = this
            next.num = num
            next.setContent('xjb_addlingli');
            return next
        },
        content: function () {
            "step 0"
            event.player.addMark("_xjb_lingli", event.num)
            event.player.update()
            "step 1"
            for (let i = 0; i < event.num; i++) {
                if (Math.random() > Math.random()) event.player.xjb_molizeLingli()
            }
            event.player.xjb_updateLingli()
        },
    },
    "xjb_updateLingli": {
        player: function () {
            let next = game.createEvent('xjb_updateLingli')
            next.player = this
            next.setContent('xjb_updateLingli');
            return next
        },
        content: function () {
            let num = game.xjb_getSb.allLingli(event.player),
                K = xjb_lingli.updateK(game.xjb_getSb.position(event.player))
            if (num > K) {
                let limit = num - K
                for (let i = 0; i < limit; i++) {
                    event.player.xjb_molizeLingli()
                }
            }
            event.player.update();
            ui.updatehl();
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
    "xjb_hasLingli": function () {
        const player = this;
        return player.hasMark("_xjb_lingli")
    },
    "xjb_countLingli": function () {
        const player = this;
        return player.countMark("_xjb_lingli")
    },
    "xjb_hasMoli": function () {
        const player = this;
        return player.hasMark("_xjb_moli")
    },
    "xjb_getLingliDensity": function () {
        const player = this;
        if (!player.storage.xjb_lingliDensity) player.storage.xjb_lingliDensity = 0
        return player.storage.xjb_lingliDensity;
    },
    "xjb_isLingliStable": function () {
        const player = this;
        return player.countMark("_xjb_lingli") <= player.xjb_getLingliDensity()
    }
}
for (const event in lingli_event) {
    lib.element.player[event] = lingli_event[event].player;
    lib.element.content[event] = lingli_event[event].content;
}
for (const method in lingli_method) {
    lib.element.player[method] = lingli_method[method];
}