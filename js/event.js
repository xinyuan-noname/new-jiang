window.XJB_LOAD_EVENT = function (_status, lib, game, ui, get, ai) {
    lib.skill.xjb_1 = {
        player: {
            "fc_X": function () {
                //这是对fc_X2先做一遍预处理，将文字转化为数字
                let Arr = [], obj = {
                    '摸牌': 1, 'draw': 1,
                    '牌堆底摸牌': 51,
                    '恢复体力': 11, '回复体力': 11, '回血': 11, 'recover': 11,
                    '加体力上限': 21, 'gainMaxHp': 21,
                    '获得Buff': 41,
                    '获得其牌': 32,
                    '再动': 31, "insertPhase": 31,
                    '置于牌堆顶': 26,
                    '获得技能': 5,
                    '残区': 16,
                    '弃牌': 36,
                    '旋转': 7,
                    '流失': 52,
                    '破甲': 54,
                    '火焰': 4,
                    '冰冻': 24,
                    '雷电': 14,
                    '神袛': 34
                }
                Array.from(arguments).forEach(i => {
                    if (typeof i === 'string') {
                        let a = obj[i] || i
                        Arr.push(a)
                    }
                    else Arr.push(i)
                })
                return this.fc_X2(...Arr)
            },
            "xjb_zeroise": function (name) {
                name = name || this.name;
                let player = this;
                player.additionalSkills.length = 0;
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
            "xjb_addSkillCard": function (name) {
                lib.card.xjb_skillCard.cardConstructor(name);
                lib.card.xjb_skillCard.skillLeadIn(name);
                var card = game.createCard2(name + "_card");
                this.xjb_addZhenFa(card);
            },
            "xjb_updateCoordinate": function () {
                let player = this
                player.coordinate = [0, 0]
                var list = [...player.coordinate]
                game.countPlayer(current => {
                    if (!current.coordinate) {
                        let distance = get.distance(player, current) * 50
                        let num1 = Math.floor(Math.random() * distance);
                        let num2 = Math.floor(Math.sqrt(distance * distance - num1 * num1))
                        current.coordinate = [num1, num2]
                    }
                    current.coordinate[0] -= list[0]
                    current.coordinate[1] -= list[1]
                })
            },
            "xjb_recover": function (num = 1) {
                let player = this
                for (let i = 0; i < 2 * num; i++) {
                    player.xjb_disableEquip()
                }
                player.recover(num)
            },
            "xjb_disableEquip": function () {
                let player = this
                player.countDisabled() >= 5 && player.enableEquip([1, 2, 3, 4, 5].randomGet())
                player.chooseToDisable()
            },
            "xjb_eventLine": function (num) {
                let eventLine = xjb_lingli.event.match(num)
                let CardOk = () => {
                    return this.countCards("h") >= 15 && eventLine.includes("xjb_cardBirth")
                }
                let MaxHpOk = () => {
                    return this.maxHp >= 30 && eventLine.includes("gainMaxHp")
                }
                game.print(CardOk(), MaxHpOk())
                while (CardOk() || MaxHpOk()) {
                    eventLine = xjb_lingli.event.match(num)
                }
                eventLine.forEach(event => {
                    this[event]()
                })
                game.log(this,`因灵力转化发生事件：${eventLine.translateLine}`)
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
            "xjb_addSkillInCC": function (str) {
                this.addSkill(str)
                lib.character[this.name1][3].add(str)
            },
            "xjb_saveStorage": function (bool) {
                let player = this
                if (!lib.config.xjb_count[player.name1]) lib.config.xjb_count[player.name1]
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
                if (!lib.config.xjb_count[player.name1]) lib.config.xjb_count[player.name1]
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
                lib.config.xjb_count[player.name1].xjb_storage = lib.config.xjb_myStorage
                game.saveConfig("xjb_count", lib.config.xjb_count)
            },
            isUniqueCharacter: function (str) {
                let player = this
                if (!player.name1) return false
                if (!lib.character[player.name1]) return false
                if (!lib.character[player.name1][4]) return false
                return lib.character[player.name1][4].includes(str)
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
            changeS: function (num) {
                var player = this
                if (!player.hasSkill('skill_off')) {
                    if (num && num == 1) player.addSkill('skill_off')
                    else player.addTempSkill('skill_off')
                    return
                }
                player.removeSkill('skill_off')
            },
            "changeS2": function (boolean, num) {
                var player = this
                if (boolean && boolean == true) {
                    if (num && num == 1) player.addSkill('skill_off')
                    else player.addTempSkill('skill_off')
                    return
                }
                player.removeSkill('skill_off')
            },
            "xjb_addSkill": function (str, trigger, func1, func2, Array, Array1) {
                lib.skill[str] = {
                    trigger: trigger,
                    filter: func1,
                    content: func2
                };
                var skill = lib.skill[str]
                if (Array) {
                    if (Array[0]) skill.forced = true;
                    if (Array[1]) skill.direct = true;
                    if (Array[1]) skill.frequent = true;
                }
                this.addSkillLog(str)
                return skill
            },
            addSkillrandom: function () {
                var player = this, temp = false, list = lib.skilllist, skills = []
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] === 'boolean') {
                        temp = true
                    }
                    else if (typeof arguments[i] === 'object') var expire = arguments[i]
                    else if (typeof arguments[i] == 'string') var need = arguments[i]
                    else if (typeof arguments[i] == 'number') var num = arguments[i]
                }
                for (var a = 0; a < list.length; a++) {
                    var info = lib.skill[list[a]]
                    if (list[a].endsWith('_roundcount')) list.splice(a--, 1)
                    else if (!info || info.sub || info.hiddenSkill) list.splice(a--, 1)
                    else if (!lib.translate[list[a]]) list.splice(a--, 1)
                    else if (!lib.translate[list[a] + '_info']) list.splice(a--, 1)
                }
                skills = skills.concat(list)
                for (var b = 0; b < skills.length; b++) {
                    var info = lib.skill[skills[b]]
                    if (need) {
                        if (!info[need]) skills.splice(b--, 1)
                        else if (player.hasSkill(skills[b])) skills.splice(b--, 1)
                    }
                }
                var skill = skills.randomGet()
                if (lib.skill[skill].limited) player.restoreSkill(skill)
                if (num) {
                    if (lib.skill[skill].juexingji) {
                        player.storage.addSkillrandom_filter = true
                        if (!lib.skill[skill].addSkillrandom_filter) lib.skill[skill].addSkillrandom_filter = lib.skill[skill].filter
                        lib.skill[skill].filter = function (event, player) {
                            if (player.storage.addSkillrandom_filter) return true
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
            seekTag: function (String) {
                var player = this
                var gain = get.cardPile2(function (card) {
                    return get.tag(card, String);
                });
                if (gain) {
                    player.gain(gain, 'gain2');
                }
                game.updateRoundNumber();
                return gain
            },
            "xjb_loseHpTo": function (num) {
                var player = this, number = player.hp - num || 1
                if (num < 0) number = 1
                player.loseHp(number)
            },
            "xjb_adjustHandCardTo": function (num, str) {
                var player = this
                var hlen = player.countCards("h")
                if (hlen > num) {
                    player.chooseToDiscard(hlen - num, true)
                }
                else if (hlen < num) {
                    if (str) player.gain(get.cards(num - hlen), "draw").gaintag.add(str)
                    else player.gain(get.cards(num - hlen), "draw")
                }
            },
            "$giveHpCard": function (num, target) {
                var theCard = game.createHpCard(num, 150)
                var player = this
                ui.xjb_giveStyle(theCard, {
                    position: "absolute",
                    left: (player.offsetLeft + 23) + "px",
                    top: (player.offsetTop + 23) + "px",
                    "z-index": "5",
                })
                ui.arena.appendChild(theCard)
                setTimeout(function () {
                    ui.xjb_giveStyle(theCard, {
                        left: (target.offsetLeft + 23) + "px",
                        top: (target.offsetTop + 23) + "px"
                    })
                    setTimeout(() => { theCard.remove() }, 500)

                }, 300)
            },
            giveHpCard: function (target, num) {
                if (!target) target = _status.event.player
                if (!lib.config.xjb_count[target.name1].HpCard) lib.config.xjb_count[target.name1].HpCard = []
                var player = this
                if (!num) num = player.maxHp

                var count = player.maxHp
                var num1 = Math.min(num * 5, player.maxHp)
                player.loseMaxHp(num1)
                if (player.maxHp % 5 != 0) {
                    var x = player.maxHp % 5
                    lib.config.xjb_count[target.name1].HpCard.push(x)
                    player.$giveHpCard(x, target)
                    count -= player.maxHp % 5
                }
                var times = count / 5
                for (var i = 0; i < times; i++) {
                    lib.config.xjb_count[target.name1].HpCard.push(5)
                    player.$giveHpCard(5, target)
                }
                game.saveConfig('xjb_count', lib.config.xjb_count);
            },
            "giveHpCard2": function (target) {
                if (!target) target = _status.event.player
                let num = 1
                if (!lib.config.xjb_count[target.name1].HpCard) lib.config.xjb_count[target.name1].HpCard = []
                var player = this
                player.xjb_cardDeath()
                player.loseMaxHp(num)
                lib.config.xjb_count[target.name1].HpCard.push(num)
                player.$giveHpCard(num, target)
                game.saveConfig('xjb_count', lib.config.xjb_count);
                return lib.config.xjb_count[target.name1].HpCard
            },
        },
    }
    lib.skill.xjb_2 = {
        "fc_X2": {
            player: function () {
                let next = game.createEvent('fc_X2')
                var player = this
                if (!player.storage._skill_xin_X) player.storage._skill_xin_X = [1, 1, 1, [], [], [], []]
                var boolean, Array1 = [], object = {}, Array2 = [1], Array3 = []
                for (var i = 0; i < arguments.length; i++) {
                    if (Array.isArray(arguments[i])) Array2 = arguments[i]
                    else if (typeof arguments[i] == 'number') {
                        if (arguments[i] === 0) { }
                        else Array1.push(arguments[i])
                    }
                    else if (typeof arguments[i] === 'string') Array3.push(arguments[i])
                    else if (typeof arguments[i] === 'boolean') boolean = arguments[i]
                    else if (typeof arguments[i] === 'object') object = arguments[i]
                }
                next.boolean = boolean
                next.Array1 = Array1
                next.Array2 = Array2
                next.Array3 = Array3
                next.object = object
                next.setContent('fc_X2');
                next.player = this
                return next
            },
            content: function () {
                'step 0'
                var boolean = event.boolean,
                    Array1 = event.Array1,
                    object = event.object,
                    Array2 = event.Array2,
                    Array3 = event.Array3
                //onlyme检测
                player.storage._skill_xin_X[4] = [...Array3, "again"]
                if (boolean == true) player.storage._skill_xin_X[4].push('onlyme', 'num_2')
                //1区设置(event.do)
                player.storage._skill_xin_X[0] = Array1.shift()
                //2区设置(event.num)
                player.storage._skill_xin_X[1] = Array2.shift()
                //7区设置(event.else)
                player.storage._skill_xin_X[7] = object
                player.storage._skill_xin_X[7].redo = [...Array1]
                player.storage._skill_xin_X[7].redo2 = Array2
                'step 1'
                player.update()
                //使用X技
                'step 2'
                player.useSkill('skill_X')
            },
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
                    let card = game.createCard2(["tao", "sha", "shan", "jiu"].randomGet())
                    player.gain(card)
                }
            },
        },
        "xjb_cardDeath": {
            player: function (num = 1) {
                let next = game.createEvent('xjb_cardDeath')
                next.player = this
                next.num = num
                next.setContent('xjb_cardDeath');
                return next
            },
            content: function () {
                "step 0"
                if (event.player.countCards("hej") < 1) {
                    event.player.xjb_eventLine(1)
                    event.finish()
                }
                "step 1"
                for (var i = 0; i < event.num; i++) {
                    let card = event.player.getCards("hej").randomGet()
                    event.player.lose(card)
                    card.fix()
                    card.remove()
                    ui.updatehl()
                }
            },
        },
        "xjb_DisSkillCard": {
            player: function (number = 1) {
                let next = game.createEvent('xjb_DisSkillCard')
                next.player = this
                next.number = number
                next.setContent('xjb_DisSkillCard');
                return next
            },
            content: function () {
                "step 0"
                const zhenfa = player.getExpansions("_xjb_zhenfa");
                const skillCard = zhenfa.filter(i => lib.card[i.name].hasSkill)
                if (skillCard.length) player.chooseButton(["选择从阵法中移除的技能牌", skillCard], event.number, true)
                "step 1"
                if (result && result.links) {
                    player.gain(result.links, "gain2")
                }
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
                game.log(player,event.cards,'进入阵法区')
                "step 1"
                const zhenfa = player.getExpansions("_xjb_zhenfa");
                const skillCardLength = zhenfa.filter(i => lib.card[i.name].hasSkill).length;
                if (skillCardLength > 3) {
                    player.xjb_DisSkillCard(skillCardLength - 3)
                }
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
        "xjb_buildBridge": {
            player: function (target) {
                if (!lib.config.xjb_count[this.name1]) return;
                let next = game.createEvent('xjb_buildBridge')
                next.player = this
                next.target = target
                next.setContent('xjb_buildBridge');
                return next
            },
            content: function () {
                "step 0"
                if (player != game.me) player.storage.xjb_daomoMax = 5;
                var list = [], maxNum = player.storage.xjb_daomoMax || 1;
                if (!lib.config.xjb_count[event.player.name1].daomo) {
                    lib.config.xjb_count[event.player.name1].daomo = {}
                };
                let dataSource = lib.config.xjb_count[event.player.name1].daomo;
                function add(str, str2) {
                    if (dataSource[str] && dataSource[str].number >= maxNum) {
                        list.push(`${str2 + xjbLogo[str](80)}`)
                    }
                };
                xjb_lingli.daomo.type.forEach(i => {
                    add(i, get.xjb_daomoInformation(i).translation)
                });
                function wordswords() {
                    return "请选择一个导魔介质，放置" + (player.storage.xjb_daomoMax || 1) +
                        "对在你和" + get.translation(event.target)
                        + "间"
                };
                player.addSkill("xjb_ui_dialog_append");
                let next = event.player.chooseButton([
                    wordswords(),
                    [list, "tdnodes"],
                    "调整放置的导魔介质"
                ], [0, 1]);
                next.set('filterButton', function (button) {
                    let logoList = {
                        "金乌": "sun",
                        "龙女": "dragon",
                        "杜鹃": "blood",
                        "雪女": "tear",
                        "桃妖": "taoyao",
                        "血魔": "xuemo",
                        "百花": "flower",
                    }
                    let logo = logoList[button.innerText]
                    return lib.config.xjb_count[player.name1].daomo[logo].number >= (player.storage.xjb_daomoMax || 1)
                });
                let div = document.createElement("div"), range = document.createElement("input")
                range.type = 'range'
                range.value = (player.storage.xjb_daomoMax || 1);
                range.min = 1;
                range.max = 5;
                range.onchange = function () {
                    player.storage.xjb_daomoMax = (-(-this.value))
                    this.parentNode.parentNode.firstChild.innerText = wordswords()
                    ui.selected.buttons.forEach(i => {
                        i.click()
                        i.dispatchEvent(new TouchEvent("touchend", {
                            bubbles: true,
                            cancelable: true,
                            composed: true
                        }))
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
                next.appendC = [div, '']
                "step 1"
                if (result.links && result.links.length) {
                    let logo = {
                        "金乌": "sun",
                        "龙女": "dragon",
                        "杜鹃": "blood",
                        "雪女": "tear",
                        "桃妖": "taoyao",
                        "血魔": "xuemo",
                        "百花": "flower",
                    }[result.links[0].slice(0, 2)]
                    game.xjb_getDaomo(player, logo, -player.storage.xjb_daomoMax)
                    player.addMark("_xjb_daomo_" + logo, player.storage.xjb_daomoMax)
                    target.addMark("_xjb_daomo_" + logo, player.storage.xjb_daomoMax)
                    player.xjb_switchlingli()
                    target.xjb_switchlingli()
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
                if (!event.list.length) return event.goto(3)
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
                            if (target[verb]) target[verb]()
                            target.xjb_addlingli()
                        });


                    })
                }
                if (event.num > 0) event.redo()
                "step 3"
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
        "xjb_chooseHEJXS": {
            player: function () {
                let next = game.createEvent('xjb_chooseHEJXS')
                next.player = this
                Array.from(arguments).forEach(function (i) {
                    if (lib._xjb.type(i) === "number") {
                        next.num = i
                    } else if (typeof i === "boolean") {
                        next.forced = i
                    } else if (typeof i === "string") {
                        next.todo = i
                    }
                })
                if (!next.todo) next.todo = "discard"
                if (!next.num) next.num = 1
                next.setContent('xjb_chooseHEJXS');
                return next
            },
            content: function () {
                "step 0"
                if (event.player.countCards("hejsx") < event.num) {
                    event.player.discard(event.player.getCards("hejsx"))
                    event.finish()
                }
                "step 1"
                let dialog = ui.create.dialog("请选择" + event.num + "张牌")
                dialog.add("<div class=\"text center\">手牌区</div>")
                dialog.add([event.player.getCards("h"), "vcard"])
                dialog.add("<div class=\"text center\">装备区</div>")
                dialog.add([event.player.getCards("e"), "vcard"])
                dialog.add("<div class=\"text center\">判定区</div>")
                dialog.add([event.player.getCards("j"), "vcard"])
                dialog.add("<div class=\"text center\">武将牌上</div>")
                dialog.add([event.player.getCards("x"), "vcard"])
                dialog.add("<div class=\"text center\">特殊区</div>")
                dialog.add([event.player.getCards("s"), "vcard"])
                event.player.chooseButton(dialog, event.num, event.forced)
                "step 2"
                if (result.links) {
                    event.player[event.todo](result.links)
                }
            },
        },
        "xjb_chooseSkillAll": {
            player: function (target) {
                let next = game.createEvent('xjb_chooseSkillAll')
                next.player = this
                next.target = target || this
                for (var i = 1; i < arguments.length; i++) {
                    if (typeof arguments[i] == 'string') {
                        next.prompt = arguments[i];
                    }
                    else if (typeof arguments[i] == 'function') {
                        next.func = arguments[i];
                    }
                }
                next.setContent('xjb_chooseSkillAll');
                return next
            },
            content: function () {
                "step 0"
                let list = event.target.getSkills();
                list = list.filter(i => {
                    if (!lib.skill[i]) return false;
                    if (lib.skill[i].equipSkill) return false;
                    if (Object.keys(event.target.tempSkills).includes(i)) return false;
                    return true;
                });
                list = list.filter(i => {
                    let info = lib.skill[i];
                    let skill = i;
                    if (!event.func) return true;
                    return event.func(info, skill)
                });
                if (!list.length) {
                    event.result = {
                        bool: false
                    };
                    event.finish();
                } else {
                    var dialog = ui.create.dialog('forcebutton');
                    dialog.add(event.prompt || '选择一项技能');
                    _status.event.list = list;
                    var clickItem = function () {
                        _status.event._result = this.link;
                        game.resume();
                    };
                    for (let i = 0; i < list.length; i++) {
                        if (lib.translate[list[i] + '_info']) {
                            var translation = get.translation(list[i]);
                            var item = dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
                                translation + '】</div><div>' + lib.translate[list[i] + '_info'] + '</div></div>');
                            item.firstChild.addEventListener('click', clickItem);
                            item.firstChild.link = list[i];
                        }
                    }
                    dialog.add(ui.create.div('.placeholder'));
                    event.dialog = dialog;
                    _status.imchoosing = true;
                    game.pause();
                }
                "step 1"
                _status.imchoosing = false;
                if (event.dialog) {
                    event.dialog.close();
                }
                event.result = {
                    bool: true,
                    skill: result
                };
            },
        },
        "xjb_chooseSkillToCard": {
            player: function (num = 1, target) {
                let next = game.createEvent('xjb_chooseSkillToCard')
                next.player = this
                next.num = num
                next.target = target || this
                next.setContent('xjb_chooseSkillToCard');
                return next
            },
            content: function () {
                "step 0"
                player.xjb_chooseSkillAll(event.target, "选择你丢弃的技能", function (info, skill) {
                    let target = _status.event.target;
                    if (!target.hasSkill(skill)) return false
                    if (info.group) return false
                    return true
                });
                "step 1"
                if (result && result.bool && result.skill) {
                    player.removeSkill(result.skill);
                    lib.card.xjb_skillCard.cardConstructor(result.skill);
                    lib.card.xjb_skillCard.skillLeadIn(result.skill);
                    var card = game.createCard(result.skill + "_card");
                    event.target.gain(card, "gain2");
                }
                event.num--
                "step 2"
                if (event.num > 0) event.goto(0)
            },
        },
        useHpCard: {
            player: function (num, source, bool = true) {
                let next = game.createEvent('useHpCard')
                let player, name
                next.num = num
                next.player = player = this
                if (!source) next.source = source = player
                next.name = name = source.name1
                next.usable = bool
                if (!lib.config.xjb_count[name].HpCard) lib.config.xjb_count[name].HpCard = []
                if (!lib.config.xjb_count[name].HpCard.length) {
                    return
                }
                var x = lib.config.xjb_count[name].HpCard.indexOf(num)
                if (x < 0) {
                    return
                }
                next.index = x
                next.setContent('useHpCard');
                return next
            },
            content: function () {
                "step 0"
                if (event.usable === true) {
                    event.player.maxHp += (event.num)
                    event.player.changeHp(event.num)
                }

                lib.config.xjb_count[event.name].HpCard.splice(event.index, 1)
                game.log(event.player, get.translation(event.player.name1) + '使用了体力牌：' + event.num)
                game.saveConfig('xjb_count', lib.config.xjb_count);
            },
        },
        "xjb_bianshen": {
            player: function () {
                let next = game.createEvent('xjb_bianshen');
                next.player = this
                Array.from(arguments).forEach(function (i) {
                    if (lib._xjb.type(i) === "object") {
                        i.skill = "skill_X"
                        i.onremove = function (player) {
                            delete player.storage[i.name];
                            player.removeMark("_xin_bianshen", 1)
                        }
                        next.call = i
                    } else if (typeof i == 'string') {
                        next.qimen = i
                    } else if (typeof i == 'number') {
                        next.cost = i
                    }
                })
                if (!next.qimen) next.qimen = ""
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
                event.player.addMark('_xin_bianshen')
                "step 2"
                event.player.storage["qimendunjia"] = event.qimen
                event.player.useCard(game.createCard('qimendunjia'), event.player)
                game.xjb_systemEnergyChange(-50)
                game.cost_xjb_cost(1, event.cost)
            },
        },
        usechenSkill: {
            player: function () {
                let next = game.createEvent('usechenSkill');
                next.player = this;
                for (var i = 0; i < arguments.length; i++) {
                    if (get.itemtype(arguments[i]) === 'player') {
                        next.source = arguments[i]
                    }
                    else if (typeof arguments[i] === 'string') {
                        next.logSkill = arguments[i]
                    }
                    else if (lib._xjb.type(arguments[i]) === "array") {
                        next.skills = arguments[i]
                    }
                }
                if (!next.skills) {
                    next.skills = [];
                    var skills = next.player.getSkills();
                    for (var i = 0; i < skills.length; i++) {
                        if (lib.skill[skills[i]].chenSkill) {
                            next.skills.add(skills[i])
                        }
                    }
                }
                next.setContent('usechenSkill');
                return next;
            },
            content: function () {
                "step 0"
                var list = event.skills
                if (event.skills && event.skills.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        event.player.addMark('_xin_junzhu');
                        event.player.useSkill(list[i])
                    }
                }
                "step 1"
                if (event.player.countMark("_xin_junzhu")) event.player.removeMark("_xin_junzhu")
            },
        },
        chooseLoseHpMaxHp: {
            player: function () {
                let next = game.createEvent('chooseLoseHpMaxHp', false);
                next.player = this;
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] == 'boolean') {
                        next.forced = arguments[i];
                    }
                    else if (typeof arguments[i] == 'string') {
                        next.prompt = arguments[i];
                    }
                    else if (typeof arguments[i] == 'function') {
                        next.ai = arguments[i];
                    }
                    else if (lib._xjb.type(arguments[i]) === "array") {
                        next.num1 = arguments[i][0]
                        next.num2 = arguments[i][1]
                    }
                }
                if (!next.num1) next.num1 = 1;
                if (!next.num2) next.num2 = 1;
                next.setContent('chooseLoseHpMaxHp');
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
                if (event.hsskill) next.setHiddenSkill(event.hsskill);
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
        }
    }
}