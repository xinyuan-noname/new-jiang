import { _status, lib, game, ui, get, ai } from "../../../noname.js";
const xjb_playerMethod = {
    "xjb_zeroise": function (name) {
        name = name || this.name;
        const player = this;
        player.skills.length = 0;
        player.hiddenSkills.length = 0;
        player.init(name);
        if (lib.character[name]) {
            player.skills = lib.character[name][3] || [];
            player.sex = lib.character[name][0];
            player.group = lib.character[name][1];
        }
        player.classList.remove('unseen');

    },
    "xjb_clearSkills": function () {
        const player = this;
        player.skills.length = 0;
        player.hiddenSkills.length = 0;
    },
    "xjb_recordTalentCard": function (num, skillName) {
        const player = this;
        const storage = player.storage
        if (!storage.xjb_unique_talent) storage.xjb_unique_talent = [];
        let records = storage.xjb_unique_talent
        records.push([game.roundNumber + num, skillName])
        player.update();
    },
    "xjb_addSkillCard": function (name) {
        const info = get.info({ name: "xjb_skillCard" });
        info.cardConstructor(name);
        info.skillLeadIn(name);
        var card = game.createCard2(name + "_card");
        this.xjb_addZhenFa(card);
    },
    "xjb_eventLine": function (num) {
        let eventLine = xjb_lingli.event.match(num)
        let CardOk = () => {
            return this.countCards("h") >= 15 && eventLine.includes("xjb_cardBirth")
        }
        let MaxHpOk = () => {
            return this.maxHp >= 30 && eventLine.includes("gainMaxHp")
        }
        while (CardOk() || MaxHpOk()) {
            eventLine = xjb_lingli.event.match(num)
        }
        eventLine.forEach(event => {
            this[event]()
        })
        game.log(this, `因灵力波动发生事件：${eventLine.translateLine}`)
        return eventLine
    },
    "xjb_fire": function (num) {
        this.damage(num, "fire")
    },
    "xjb_flower": function (num) {
        this.damage(num, "flower")
    },
    "xjb_thunder": function (num) {
        this.damage(num, "thunder")
    },
    "xjb_ice": function (num) {
        this.damage(num, "ice")
    },
    "xjb_saveStorage": function (bool) {
        const player = this
        game.xjb_checkCharCountAll(player.name1);
        if (!lib.config.xjb_count[player.name1].xjb_storage) {
            lib.config.xjb_count[player.name1].xjb_storage = { total: 0 }
        }
        lib.config.xjb_myStorage = lib.config.xjb_count[player.name1].xjb_storage
        let i = game.xjb_storage_2(player, bool)
        game.pause();
        if (player !== game.me || _status.auto) {
            let curtain = ui.create.xjb_curtain()
            if (player === game.me) curtain.remove()
            new Promise(res => {
                if (i.storageArea.children.length === 0) i.li_1.click()
                res(i.storageArea.children[0].update())
            }).then(data => {
                return new Promise(res => {
                    setTimeout(k => {
                        res(i.li_2.onclick())
                    }, 1000)
                })
            }).then(data => {
                setTimeout(k => {
                    i.close.closeBack()
                    curtain.remove()
                    game.resume()
                }, 100)
            })
        }
        return i
    },
    "xjb_readStorage": function (bool) {
        let player = this
        game.xjb_checkCharCountAll(player.name1)
        if (!lib.config.xjb_count[player.name1].xjb_storage) {
            lib.config.xjb_count[player.name1].xjb_storage = { total: 0 }
        }
        lib.config.xjb_myStorage = lib.config.xjb_count[player.name1].xjb_storage
        let i = game.xjb_storage_1(player, bool)
        game.pause()
        if (player !== game.me || _status.auto) {
            let curtain = ui.create.xjb_curtain()
            if (player === game.me) curtain.remove()
            new Promise(res => {
                if (i.storageArea.children.length === 0) i.li_1.click()
                res(i.storageArea.children[0].update())
            }).then(data => {
                return new Promise(res => {
                    setTimeout(k => {
                        i.li_2.read()
                        i.close.click()
                        curtain.remove()
                    }, 1000)
                })
            })
        }
        return i
    },
    "xjb_updateStorage": function () {
        let player = this
        game.xjb_checkCharCountAll(player);
        lib.config.xjb_count[player.name1].xjb_storage = lib.config.xjb_myStorage
        game.saveConfig("xjb_count", lib.config.xjb_count)
    },
    "xjb_noskill": function (skillname) {
        var player = this, skill = lib.skill[skillname]
        if (Array.isArray(skillname)) {
            for (var i = 0; i < skillname.length; i++) {
                player.xjb_noskill(skillname[i])
            }
            return
        }
        if (lib.skill[skillname] === undefined) return
        if (lib.skill[skillname].noskill != undefined) return
        if (!player.noskill) player.noskill = {}
        player.noskill[skillname] = { ...lib.skill[skillname] }
        player.noskill_translate[skillname + '_info'] = lib.translate[skillname + '_info']
        Object.keys(skill).forEach(key => {
            let object = {
                valueOf: function () {
                    return 0;
                },
                includes: function () {
                    return false;
                }
            }
            if (typeof skill[key] == "boolean") skill[key] = false;
            if (typeof skill[key] == "function") skill[key] = function () { return object };
            if (typeof skill[key] == "string") delete skill[key];
            if (typeof skill[key] == "number") skill[key] = 0;
            if (typeof skill[key] == "object") skill[key] = {};
        })
        lib.skill[skillname].noskill = true
        lib.translate[skillname + '_info'] = '已被强制技封印'
    },
    "gain_noskill": function () {
        var player = this
        var list1 = Object.keys(player.noskill)
        var list2 = Object.keys(player.noskill_translate)
        var list3 = Object.values(player.noskill_translate)
        for (var i = 0; i < list1.length; i++) {
            game.xjb_EqualizeSkillObject(list1[i], player.noskill[list1[i]])
        }
        for (var i = 0; i < list2.length; i++) {
            lib.translate[list2[i]] = list3[i]
        }
        player.noskill = {}
    },
    addSkillrandom: function () {
        var player = this, temp = false, list = lib.skilllist, skills = []
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'boolean') {
                temp = true
            }
            else if (typeof arguments[i] === 'object') var expire = arguments[i]
            else if (typeof arguments[i] == 'number') var num = arguments[i]
            else if (typeof arguments[i] == 'string') var need = arguments[i]
        }
        for (let a = 0; a < list.length; a++) {
            const info = get.info(list[a])
            if (!list[a] || list[a].endsWith('_roundcount')) list.splice(a--, 1)
            else if (!info || info.sub || info.hiddenSkill) list.splice(a--, 1)
            else if (!lib.translate[list[a]]) list.splice(a--, 1)
            else if (!lib.translate[list[a] + '_info']) list.splice(a--, 1)
        }
        skills = skills.concat(list)
        for (let b = 0; b < skills.length; b++) {
            var info = lib.skill[skills[b]]
            if (need) {
                if (!info[need]) skills.splice(b--, 1)
                else if (player.hasSkill(skills[b])) skills.splice(b--, 1)
            }
        }
        var skill = skills.randomGet();
        if (!(skill in lib.skill)) return false;
        if (lib.skill[skill].limited) player.restoreSkill(skill);
        if (num) {
            if (lib.skill[skill].juexingji) {
                player.addTip("addSkillrandom", "觉醒技无视条件")
                if (!lib.skill[skill].addSkillrandom_filter) lib.skill[skill].addSkillrandom_filter = lib.skill[skill].filter
                lib.skill[skill].filter = function (event, player) {
                    if (player.tips && player.tips.get("addSkillrandom")) return true
                    return this.addSkillrandom_filter.apply(this, arguments);
                }
            }
        }
        if (temp == true) player.addTempSkill(skill, expire)
        else player.addSkill(skill)
        player.popup(skill)
        game.log(player, '获得了技能〖' + get.translation(skill) + '〗')
        return skill
    },
    "xjb_getAllCards": function (str) {
        var cards = [], player = this
        var cards = player.getCards(str).map(card => {
            return [card.name,
            card.suit,
            card.number,
            card.nature,
            card.gaintag,
            card.storage]
        })
        return cards
    },
    "giveHpCard2": function (target) {
        if (!target) target = _status.event.player
        let num = 1
        const player = this
        game.xjb_checkCharCountAll(target.name);
        player.xjb_cardDeath()
        player.loseMaxHp(num)
        lib.config.xjb_count[target.name].HpCard.push(num)
        player.$xjb_giveHpCard(num, target)
        game.saveConfig('xjb_count', lib.config.xjb_count);
        return lib.config.xjb_count[target.name].HpCard
    },
    "xjb_speechWord": function (words) {
        if (!("speechSynthesis" in window)) return;
        if (!this.xjb_speaker) {
            this.xjb_speaker = new SpeechSynthesisUtterance();
            this.xjb_speaker.lang = "zh-CN"
        }
        this.xjb_speaker.text = words;
        speechSynthesis.speak(this.xjb_speaker)
    },
}
const xjb_likeEvent = {
    "xjb_chooseAllCard": function () {
        const player = this;
        let select, forced, target, prompt
        Array.from(arguments).forEach(function (arg) {
            if (typeof arg === "number") {
                select = arg;
            }
            else if (get.itemtype(arg) === "select") {
                select = arg;
            }
            else if (get.itemtype(arg) === "player") {
                target = arg;
            }
            else if (typeof arg === "boolean") {
                forced = arg
            }
            else if (typeof arg === "string") {
                prompt = arg
            }
        })
        if (!target) target = player;
        if (!select) select = 1;
        if (!prompt) prompt = "请选择卡牌"
        const hs = target.getCards("h").randomSort(),
            es = target.getCards("e").randomSort(),
            js = target.getCards("j").randomSort(),
            xs = target.getCards("x").randomSort(),
            ss = target.getCards("s").randomSort();
        const dialog = ui.create.dialog(prompt)
        if (hs.length) {
            dialog.add("<div class=\"text center\" style=\"margin: 0px;\">手牌区</div>");
            dialog.add([hs, "vcard"]);
        }
        if (es.length) {
            dialog.add("<div class=\"text center\" style=\"margin: 0px;\">装备区</div>");
            dialog.add([es, "vcard"]);
        }
        if (js.length) {
            dialog.add("<div class=\"text center\" style=\"margin: 0px;\">判定区</div>");
            dialog.add([js, "vcard"]);
        }
        if (xs.length) {
            dialog.add("<div class=\"text center\" style=\"margin: 0px;\">武将牌上</div>");
            dialog.add([xs, "vcard"]);
        }
        if (ss.length) {
            dialog.add("<div class=\"text center\" style=\"margin: 0px;\">特殊区</div>");
            dialog.add([ss, "vcard"]);
        }
        dialog.hide();
        return player.chooseButton(dialog, select, forced);
    },

}
const xjb_event = {
    "xjb_destoryCards": {
        player: function (cards) {
            const player = this;
            let next = game.createEvent('xjb_destoryCards')
            next.player = player
            next.cards = cards
            next.setContent('xjb_destoryCards');
            return next
        },
        content: async function (event, trigger, player) {
            await player.lose(event.cards, ui.ordering);
            for (const card of event.cards) {
                card.fix()
                card.remove()
                card.destroyed = true
            }
            ui.updatehl();
        }
    },
    "xjb_cardBirth": {
        player: function (num = 1) {
            let next = game.createEvent('xjb_cardBirth')
            next.player = this
            next.num = num
            next.setContent('xjb_cardBirth');
            return next
        },
        content: function () {
            for (var i = 0; i < event.num; i++) {
                const name = ["tao", "sha", "shan", "jiu", "juedou", "wuxie", "guohe", "shunshou", "lebu", "bingliang"].randomGet()
                const nature = name === "sha" ? [...lib.inpile_nature, null].randomGet() : null;
                const card = game.createCard2(name, void 0, void 0, nature)
                player.gain(card)
            }
        },
    },
    "xjb_cardDeath": {
        player: function (num = 1, position = "hej") {
            let next = game.createEvent('xjb_cardDeath')
            next.player = this;
            next.num = num;
            next.position = position;
            next.setContent('xjb_cardDeath');
            return next
        },
        content: function () {
            "step 0"
            if (player.countCards(event.position) < 1) {
                player.xjb_eventLine(1)
                event.finish()
            }
            "step 1"
            const cards = player.getCards(event.position).randomGets(event.num)
            player.lose(cards)
            player.xjb_destoryCards(cards)
        },
    },
    "xjb_bianshen": {
        player: function () {
            let next = game.createEvent('xjb_bianshen');
            next.player = this
            Array.from(arguments).forEach(function (i) {
                const arg = i;
                if (Array.isArray(arg)) {
                    next.toGenerateCards = arg
                } else if (typeof i === "object") {
                    i.onremove = function (player) {
                        delete player.storage[i.name];
                        player.removeMark("_xin_bianshen", 1)
                    }
                    next.call = i
                }
            })
            next.setContent('xjb_bianshen');
            return next;
        },
        content: function () {
            "step 0"
            if (event.player.countMark('_xin_bianshen') > 0) {
                event.finish()
            }
            "step 1"
            event.player.storage[event.call.name] = event.player.addSubPlayer(event.call);
            event.player.callSubPlayer(event.call)
            event.player.addMark('_xin_bianshen');
            "step 2"
            if (event.toGenerateCards) {
                const cards = game.xjb_cardFactory(...event.toGenerateCards);
                player.gain(cards, "gain2");
                event.cards = cards;
            }
            "step 3"
            if (event.cards) {
                for (const card of event.cards) {
                    if (get.type(card) === "equip") {
                        if (!player.canEquip(card)) player.expandEquip(get.subtype(card));
                        player.equip(card);
                    }
                }
            }
        },
    },
    "xjb_chooseLoseHpMaxHp": {
        player: function () {
            let next = game.createEvent('xjb_chooseLoseHpMaxHp', false);
            next.player = this;
            for (const arg of arguments) {
                if (typeof arg == 'boolean') {
                    next.forced = arg;
                }
                else if (typeof arg == 'string') {
                    next.prompt = arg;
                }
                else if (typeof arg == 'function') {
                    next.ai = arg;
                }
                else if (Array.isArray(arg)) {
                    next.num1 = arg[0]
                    next.num2 = arg[1]
                }
                else if (typeof arg === "number") {
                    if (!next.num1) next.num1 = arg
                    else next.num2 = arg
                }
            }
            if (!next.num1) next.num1 = 1;
            if (!next.num2) next.num2 = 1;
            next.setContent('xjb_chooseLoseHpMaxHp');
            return next;
        },
        content: function () {
            'step 0'
            var controls = ['失去体力上限', '失去体力'];
            if (!event.forced) {
                controls.push('cancel2');
            }
            var prompt = event.prompt;
            if (!prompt) {
                prompt = '失去' + get.cnNumber(event.num1) + '体力上限或失去' + get.cnNumber(event.num2) + '点体力'
            }
            var next = player.chooseControl(controls);
            next.set('prompt', prompt);
            if (event.ai) {
                next.set('ai', event.ai);
            }
            else {
                var choice;
                if (player.maxHp > player.hp) {
                    choice = '失去体力上限';
                } else if (player.hp == 1) {
                    choice = 'cancel2'
                }
                else {
                    choice = '失去体力';
                }
                next.set('ai', function () {
                    return _status.event.choice;
                });
                next.set('choice', choice);
            }
            'step 1'
            if (result.control != 'cancel2') {
                if (event.logSkill) {
                    if (typeof event.logSkill == 'string') {
                        player.logSkill(event.logSkill);
                    }
                    else if (Array.isArray(event.logSkill)) {
                        player.logSkill.apply(player, event.logSkill);
                    }
                }
                if (result.control == '失去体力上限') {
                    player.loseMaxHp(event.num1);
                }
                else {
                    player.loseHp(event.num2);
                }
            }
            event.result = result;
        },
    },
}
for (const event in xjb_event) {
    lib.element.player[event] = xjb_event[event].player;
    lib.element.content[event] = xjb_event[event].content;
}
for (const method in xjb_playerMethod) {
    lib.element.Player.prototype[method] = xjb_playerMethod[method];
}
for (const method in xjb_likeEvent) {
    lib.element.player[method] = xjb_likeEvent[method];
}