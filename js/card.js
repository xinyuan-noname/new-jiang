window.XJB_LOAD_CARD = function (_status, lib, game, ui, get, ai) {
    function CardObjectCreater(name, card) {
        lib.card[name] = { ...card };
        lib.card[name].translate = undefined;
        lib.card[name].description = undefined;
        lib.translate[name] = card.translate;
        lib.translate[name + "_info"] = card.description;
        return lib.translate[name]
    };
    lib.skill.xjb_4 = {
        XJBCard: function () {
            lib.cardPack["xjb_jizhuoyangqing"] = [
                "xjb_lijingtuzhi",
                "xjb_xiugengxuzi",
                "xjb_chucanquhui",
            ]
            lib.translate.xjb_jizhuoyangqing_card_config = "激浊扬清"
            lib.config.all.cards.push("xjb_jizhuoyangqing");
            CardObjectCreater(
                "xjb_lijingtuzhi", {
                image: "ext:新将包/image/card/xjb_lijingtuzhi.png",
                fullskin: true,
                type: "delay",
                filterTarget: function (card, player, target) {
                    return (lib.filter.judge(card, player, target)) && player === target;
                },
                judge: function (card) {
                    if (get.suit(card) != 'heart') return 1;
                    return -2;
                },
                "judge2": function (result) {
                    if (result.bool == true) return true;
                    return false;
                },
                effect: function () {
                    if (result.bool == true) {
                        let evt1 = _status.event.getParent("phase")
                        if (evt1.phaseList) {
                            evt1.phaseList.splice(evt1.num + 1, 0, "phaseUse|xjb_lijingtuzhi")
                        } else {
                            let evt2 = _status.event.getParent("phaseJudge")
                            let next = player.phaseUse()
                            _status.event.next.remove(next);
                            evt2.next.push(next)
                        }
                    }
                },
                translate: "励精图治",
                description: "出牌阶段,对你使用。若判定结果不为红桃,你于该判定阶段后执行一个额外的出牌阶段。",
                ai: {
                    basic: {
                        order: 1,
                        useful: 2,
                        value: 8,
                    },
                    result: {
                        target: (player, target) => {
                            return 2;
                        },
                    },
                    tag: {
                        add: "phaseUse",
                    },
                },
                selectTarget: -1,
                toself: true,
                enable: true,
                content: function () {
                    if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
                },
                allowMultiple: false,
            });
            CardObjectCreater(
                "xjb_xiugengxuzi", {
                image: "ext:新将包/image/card/xjb_xiugengxuzi.png",
                fullskin: true,
                type: "delay",
                filterTarget: function (card, player, target) {
                    return (lib.filter.judge(card, player, target));
                },
                judge: function (card) {
                    if (get.suit(card) != 'club') return 1;
                    return -2;
                },
                "judge2": function (result) {
                    if (result.bool == true) return true;
                    return false;
                },
                effect: function () {
                    if (result.bool == true) {
                        let evt1 = _status.event.getParent("phase")
                        if (evt1.phaseList) {
                            evt1.phaseList.splice(evt1.num + 1, 0, "phaseDraw|xjb_xiugengxuzi")
                        } else {
                            let evt2 = _status.event.getParent("phaseJudge")
                            let next = player.phaseDraw()
                            _status.event.next.remove(next);
                            evt2.next.push(next)
                        }
                    }
                },
                translate: "修耕蓄资",
                description: "出牌阶段,对一名角色使用。若判定结果不为梅花,你于该判定阶段后执行一个额外的摸牌阶段。",
                ai: {
                    basic: {
                        order: 1,
                        useful: 2,
                        value: 8,
                    },
                    result: {
                        target: (player, target) => {
                            return 2;
                        },
                    },
                    tag: {
                        add: "phaseDraw",
                    },
                },
                selectTarget: 1,
                enable: true,
                content: function () {
                    if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
                },
                allowMultiple: false,
            });
            CardObjectCreater(
                "xjb_chucanquhui", {
                image: "ext:新将包/image/card/xjb_chucanquhui.png",
                fullskin: true,
                type: "trick",
                filterTarget: function (card, player, target) {
                    return player !== target && target.countCards("h") > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseCard("h", { color: "red" }, [0, 1], true).set("ai", function (card) {
                        return get.number(card) - get.value(card)
                    });
                    "step 1"
                    event.playerCard = result.cards[0];
                    target.chooseCard("h", { color: "black" }, [0, 1], true).set("ai", function (card) {
                        return get.number(card) - get.value(card)
                    });;
                    "step 2"
                    event.targetCard = result.cards[0]
                    "step 3"
                    player.discard(event.playerCard);
                    target.discard(event.targetCard);
                    if (!event.playerCard) {
                        player.damage(target)
                        event.finish();
                    }
                    if (!event.targetCard) {
                        target.damage(player)
                        event.finish();
                    }
                    "step 4"
                    let num1 = get.number(event.playerCard, player), num2 = get.number(event.targetCard, target)
                    if (num1 > num2) target.damage(player);
                    if (num1 < num2) player.damage(target)
                },
                selectTarget: 1,
                enable: true,
                translate: "除残去秽",
                description: "出牌阶段，对一名有手牌的其他角色使用。你/该角色可以弃置一张红色手牌/黑色手牌，未弃置牌和弃置牌点数较小的角色各受到对方造成的一点伤害。",
                ai: {
                    basic: {
                        order: 5,
                        useful: 2,
                        value: 6,
                    },
                    result: {
                        target: -1,
                    },
                    tag: {
                        damage: 1,
                    },
                },
            })
            if (lib.config.cards.includes("xjb_jizhuoyangqing")) {
                lib.inpile.push(...lib.cardPack["xjb_jizhuoyangqing"])
                lib.cardPack["xjb_jizhuoyangqing"].forEach(i => {
                    lib.translate[i + "_info"] += `<br><a onclick="location.hash='#xjb_card${i}'">※点此将该牌加入牌堆</a>`
                })
            }
        },
        CardFunction: function () {
            //创建卡牌并返回数组
            game.xjb_cardFactory = function () {
                var cards = []
                for (var i = 0; i < arguments.length; i++) {
                    let card = lib.card[arguments[i][0]] && game.createCard2(...arguments[i])
                    card.storage = arguments[i][5]
                    card.gaintag = arguments[i][4]
                    cards.push(card)
                }
                return cards
            };
            //检测卡牌是否可被添加
            game.xjb_checkCardCanAdd = function (cardName) {
                return lib.inpile.includes(cardName)
            };
            //
            game.xjb_cardAddToCardPile = function (card) {
                let Acard = card
                if (get.itemtype(card) !== "card") {
                    Acard = game.createCard2(...card);
                }
                let cardPileItems = ui.cardPile.children;
                let randomIndex = Math.floor(Math.random() * (cardPileItems.length + 1));
                ui.cardPile.insertBefore(Acard, cardPileItems[randomIndex]);
            };
            get.xjb_enFromCn=function(cn){
                return Object.entries(lib.translate).find(item=>{
                    return item[1]===cn
                })[0]
            }
            //类似迭代器
            game.xjb_getCardToAdd = function (step) {
                const firstList = Object.entries(lib.config.xjb_cardAddToPile).filter(i => i[1] !== "0");
                if (step == 1) return firstList;
                const secondList = firstList.map(i => i.join("-"));
                if (step == 2) return secondList;
                const thirdList = secondList.map(i => i.split("-"))
                if (step == 3) return thirdList;
                const fourthList = thirdList.map(i =>{ 
                    return [get.xjb_enFromCn(i[0]), get.xjb_enFromCn(i[1]).slice(0,-1), i[2] * 1, i[3] * 1]
                })
                if (step == 4) return fourthList;
                const fifthList = fourthList.filter(i => game.xjb_checkCardCanAdd(i[0]));
                return fifthList;
            }
        },
        storeCard: function () {
            const xjb_penglai = CardObjectCreater(
                "xjb_penglai", {
                type: "xjb_unique",
                subtype: "xjb_unique_talent",
                enable: true,
                filterTarget: function (card, player, target) {
                    return card.storage.xjb_allowed == true;;
                },
                content() {
                    'step 0'
                    target.useCard({ name: "jiu" }, target)
                    target.storage.xjb_card_allow = target.storage.xjb_card_allow || {}
                    target.storage.xjb_card_allow['xjb_penglai'] = true
                    target.storage.xjb_unique_talent = target.storage.xjb_unique_talent || []
                    event.num = [1, 2, 3].randomGet()
                    player.$skill(event.num + '', 'legend', 'wood');
                    'step 1'
                    var list = [[]], num = game.roundNumber + event.num
                    list[0] = [num, 'xjb_penglai']
                    target.storage.xjb_unique_talent = [...target.storage.xjb_unique_talent, ...list]
                    'step 2'
                    target.addSkillLog('xjb_penglai')
                    target.update()
                    'step 3'
                    target.getStat().card.jiu = 0
                    target.restoreSkill = function () {
                        return this;
                    }
                    target.awakenSkill = function (skill) {
                        this.storage[skill] = false
                        return this;
                    }
                    target.enableSkill = function () {
                        return this;
                    }
                    target.disableSkill = function () {
                        return this;
                    }
                },
                savable: true,
                selectTarget: 1,
                modTarget: true,
                ai: {
                    order: 8,
                    basic: {
                        value: 10,
                        useful: 10,
                    },
                    result: {
                        target: function (player, target, card, isLink) {
                            if (target.hasSkill("xjb_penglai")) return 0.5
                            return 1
                        },
                    },
                },
                fullskin: true,
                image: "ext:新将包/xjb_Infinity.png",
                translate: '蓬莱',
                description: '出牌阶段及濒死时，对一名角色使用，其:<br>1.使用一张【酒】并将本回合使用过【酒】的次数清零;<br>2.体力值变为无限，持续回合由抽到的数字决定<br>3.失去技能废除及恢复的能力'
            });
            const xjb_skill_off_card = CardObjectCreater(
                "xjb_skill_off_card", {
                type: "xjb_unique",
                subtype: "xjb_unique_talent",
                enable: true,
                filterTarget: function (card, player, target) {
                    return card.storage.xjb_allowed == true;;
                },
                selectTarget: 1,
                modTarget: true,
                content: function () {
                    "step 0"
                    if (target.name1.indexOf("subplayer") > -1) {
                        game.xjb_create.alert("禁止对随从使用此牌！")
                        event.finish()
                    }
                    "step 1"
                    target.storage.xjb_unique_talent = target.storage.xjb_unique_talent || []
                    event.num = [1, 2, 3].randomGet()
                    player.$skill(event.num + '', 'legend', 'wood');
                    "step 2"
                    var list = [[]], num = game.roundNumber + event.num
                    list[0] = [num, 'skill_noskill']
                    target.storage.xjb_unique_talent = target.storage.xjb_unique_talent.concat(list)
                    "step 3"
                    target.addSkill("skill_noskill")
                    target.turnOver()
                },
                fullskin: true,
                image: "ext:新将包/xjb_jingu.png",
                translate: '禁锢卡',
                description: '出牌阶段，你对一名角色使用此牌，其翻面，然后其封印所有技能，持续回合由抽取数字决定。'
            });
            const xjb_zhihuan = CardObjectCreater(
                'xjb_zhihuan', {
                type: "xjb_unique",
                subtype: "xjb_unique_reusable",
                enable: true,
                selectTarget: 1,
                modTarget: true,
                filterTarget: true,
                modTarget: true,
                filterTarget(card, player, target) {
                    return card.storage.xjb_allowed == true;;
                },
                content() {
                    "step 0"
                    target.chooseToDiscard('he', [1, Infinity], true)
                    "step 1"
                    player.draw(result.cards.length)
                    var num = cards[0].number + 1
                    if (cards[0].number < 5) {
                        let gainCard = game.createCard(cards[0].name, cards[0].suit, num)
                        gainCard.storage.xjb_allowed = true
                        player.gain(gainCard)
                    }
                },
                fullskin: true,
                image: "ext:新将包/xjb_zhihuan.png",
                translate: '置换卡',
                description: '出牌阶段，你对一名角色使用此牌，其弃置至少一张牌，然后你摸等量张牌。<br><b description=[当卡牌点数大于4时，使用牌结算后就不能再次获得此牌]>最大回收点数:4</b>'
            });
            lib.card.xjb_lingliCheck = {
                type: "xjb_unique",
                subtype: "xjb_unique_money",
                enable: true,
                selectTarget: 1,
                modTarget: true,
                filterTarget: function (card, player, target) {
                    return card.storage.xjb_allowed == true;;
                },
                content: function () {
                    "step 0"
                    var num = xjb_lingli.area["fanchan"]()
                    target.xjb_addlingli(14 - cards[0].number).set("lingliSource", "card")

                },
                fullskin: true,
                image: "ext:新将包/lingli/check.png",
                ai: {
                    order: 2,
                    basic: {
                        value: 10,
                        useful: 10,
                    },
                    result: {
                        target: 1
                    },
                },
            }
            lib.translate.xjb_lingliCheck = "灵力支票";
            lib.translate.xjb_lingliCheck_info = "出牌阶段对一名角色使用，其获得灵力。"
            lib.card.xjb_shenshapo = {
                ai: {
                    order: 3,
                    basic: {
                        value: 10,
                        useful: 10,
                    },
                    result: {
                        target: -3,
                        player: 1,
                    },
                },
                image: "ext:新将包/xjb_shenshapo.png",
                type: "xjb_unique",
                subtype: "xjb_unique_reusable",
                enable: true,
                selectTarget: 3,
                multitarget: true,
                multiline: true,
                modTarget: true,
                filterTarget: true,
                content: function () {
                    'step 0'
                    player.useCard({
                        name: "sha",
                        nature: "kami"
                    }, targets)
                    'step 1'
                    player.getStat().card.sha = 0
                    var num = cards[0].number + 1
                    if (cards[0].number < 2) {
                        let gainCard = game.createCard(cards[0].name, cards[0].suit, num)
                        gainCard.storage.xjb_allowed = true
                        player.gain(gainCard)
                    }

                },
                fullskin: true,
            }
            lib.translate.xjb_shenshapo_info = "出牌阶段指定三名角色:1.视为对目标使用一张神杀;<br>2.出牌阶段使用过【杀】的次数清零<br><b description=[当卡牌点数大于1时，使用牌结算后就不能再次获得此牌]>最大回收点数:1点</b>"
            lib.translate.xjb_shenshapo = "神杀破";
            lib.translate.xjb_seizeHpCard = "体力抓取"
            lib.translate.xjb_seizeHpCard_info = "出牌阶段对一名手牌数大于你的其他角色使用:你与其的拼点，若你赢，你获得其一张体力牌<br><b description=[当卡牌点数大于1时，使用牌结算后就不能再次获得此牌]>最大回收点数:1</b>"
            lib.card.xjb_seizeHpCard = {
                image: "ext:新将包/xjb_seizeHpCard.png",
                audio: true,
                fullskin: true,
                type: "xjb_unique",
                subtype: "xjb_unique_reusable",
                filterTarget: function (card, player, target) {
                    if (card.storage.xjb_allowed !== true) return false
                    return target !== player && player.canCompare(target) && target.maxHp != Infinity && player.countCards("h") > target.countCards("h")
                },
                enable: true,
                content: function () {
                    "step 0"
                    player.chooseToCompare(target);
                    "step 1"
                    if (result.bool) {
                        target.giveHpCard(player, 1)
                    }
                    "step 2"
                    var num = cards[0].number + 1
                    if (cards[0].number < 2) player.gain(game.createCard(cards[0].name, cards[0].suit, num))

                },
                ai: {
                    order: 6,
                    basic: {
                        useful: 4.5,
                        value: 9.2,
                    },
                    result: {
                        target: -2,
                    },
                },
            }
            lib.card.xjb_tianming_huobi2 = {
                image: "ext:新将包/xjb_tianming_huobi2.png",
                audio: true,
                fullskin: true,
                type: "xjb_unique",
                subtype: "xjb_unique_money",
                recastable: true,
                enable: true,
                selectTarget: -1,
                cardcolor: "red",
                toself: true,
                filterTarget: function (card, player, target) {
                    return target === game.me && card.storage.xjb_allowed == true;
                },
                modTarget: true,
                content: function () {
                    game.xjb_gainJP("80上限")
                    delete card.storage.vanish;
                },
                ai: {
                    basic: {
                        useful: 4.5,
                        value: 9.2,
                    },
                    result: {
                        target: 2,
                    },
                },
            }
            lib.translate.xjb_tianming_huobi2 = "金币"
            lib.translate.xjb_tianming_huobi2_info = "珍贵的金币"
            lib.card.xjb_tianming_huobi1 = {
                image: "ext:新将包/xjb_tianming_huobi1.png",
                audio: true,
                fullskin: true,
                recastable: true,
                type: "xjb_unique",
                subtype: "xjb_unique_money",
                enable: true,
                selectTarget: -1,
                cardcolor: "red",
                toself: true,
                filterTarget: function (card, player, target) {
                    return target === game.me && card.storage.xjb_allowed == true;;
                },
                modTarget: true,
                content: function () {
                    game.xjb_gainJP("40上限")
                    delete card.storage.vanish;
                },
                ai: {
                    basic: {
                        useful: 4.5,
                        value: 9.2,
                    },
                    result: {
                        target: 2,
                    },
                },
            }
            lib.translate.xjb_tianming_huobi1 = "铜币"
            lib.translate.xjb_tianming_huobi1_info = "普通的铜币"
            lib.card.xjb_skillCard = {
                audio: "ext:新将包",
                type: "xjb_unique",
                subtype: "xjb_unique_talent",
                enable: true,
                lianheng: true,
                logv: false,
                selectTarget: 1,
                modTarget: true,
                filterTarget(card, player, target) {
                    return card.storage.xjb_allowed == true;;
                },
                cardConstructor(id, boolean) {
                    var it = lib.card[id + "_card"] = {
                        enable: function (event, player) {
                            return false
                        },
                        type: "xjb_unique",
                        subtype: "xjb_unique_talent",
                        recastable: true,
                        hasSkill: id,
                        ai: {
                            basic: {
                                useful: 10,
                                value: 10,
                            },
                        },
                        fullskin: true,
                        image: "ext:新将包/skillCard.png"
                    };
                    if (boolean === true) {
                        it.subtype = "xjb_unique_SanSkill";
                    }
                    if (["xin_guimeng_1"].includes(id)) {
                        it.debuff = true
                        it.ai.basic.value = 0
                        it.ai.basic.useful = 0
                    }
                    lib.translate[id + "_card"] = lib.translate[id]
                    lib.translate[id + "_card_info"] = "当你持有或武将牌上存在" + get.translation(id) + "时，你视为拥有技能:【" + get.translation(id) + "】<br><ins><i>" + lib.translate[id + "_info"] + "</i></ins>"

                },
                skillLeadIn(id, fatherName) {
                    if (!fatherName) fatherName = id
                    var skill = game.xjb_EqualizeSkillObject(id + "_card", lib.skill[id])
                    if (skill.init) skill.init = function (player, skill) { player.storage[skill] = false }
                    if (!skill.filter) {
                        skill.filter = function () { return true }
                    }
                    skill.filter2 = skill.filter
                    skill.filter = function (event, player) {
                        if (player.countCards("hxs", { name: fatherName + "_card" }) < 1) return false;
                        return this.filter2.apply(this, arguments);
                    }
                    if (skill.group) {
                        if (typeof skill.group == "string") {
                            this.skillLeadIn(skill.group, id)
                            skill.group = skill.group + "_card"
                            lib.translate[skill.group + '_card'] = lib.translate[skill.group]
                        }
                        else if (Array.isArray(skill.group)) {
                            skill.group.forEach((item, index) => {
                                this.skillLeadIn(item, id)
                                skill.group[index] = item + "_card"
                                lib.translate[item + "_card"] = lib.translate[item]

                            })
                        }
                    }
                    game.addGlobalSkill(id + "_card")
                },
                SanSkill: [
                    'xin_zulong',
                    'xjb_xinsheng',
                    'lunaticMasochist',
                    'xjb_sicuan'
                ],
                content() {
                    'step 0'
                    var list = ['输入id', '神圣技能']
                    player.chooseControl(list)
                    'step 1'
                    if (result.control == '输入id') event.goto(2);
                    else if (result.control == '神圣技能') event.goto(3)
                    'step 2'
                    game.pause()
                    game.xjb_create.prompt("请输入技能的id", "", function () {
                        game.resume()
                        var id = this.result;
                        if (Object.keys(lib.skill).includes(id)) {
                            if (lib.skill[id].mod) {
                                player.gain(cards)
                                return game.xjb_create.alert("该技能不在合法技能名录中！")
                            }
                            game.xjb_createSkillCard(id, target)
                        } else {
                            player.gain(cards)
                            game.xjb_create.alert("未找到该技能！")
                        }
                    }, function () {
                        game.resume()
                        player.gain(cards)
                    })
                    event.finish()
                    'step 3'
                    var list = []
                    for (let i = 0; i < lib.card.xjb_skillCard.SanSkill.length; i++) {
                        lib.card.xjb_skillCard.cardConstructor(lib.card.xjb_skillCard.SanSkill[i], true)
                        list.push(game.createCard(lib.card.xjb_skillCard.SanSkill[i] + '_card'))
                    }
                    player.chooseButton(['选择一张神圣技能牌', list], true)
                    'step 4'
                    if (result.links) {
                        player.gain(result.links[0], "gain2")
                        lib.card.xjb_skillCard.skillLeadIn(result.links[0].name.slice(0, result.links[0].name.lastIndexOf('_card')))
                    }
                },
                fullskin: true,
                image: "ext:新将包/skillCard.png",
            }
            lib.translate.xjb_skillCard_info = "出牌阶段，你可使用此牌，然后选择一项:1.输入id，获得一张对应的技能牌;2.获得一张神圣技能牌。"
        },
        CardStore: function () {
            game.xjb_storeCard = [
                "xjb_shenshapo",
                "xjb_skill_off_card",
                "xjb_zhihuan",
                "xjb_penglai",
                "xjb_skillCard",
                "xjb_tianming_huobi2",
                "xjb_tianming_huobi1",
                "xjb_seizeHpCard",
                "xjb_lingliCheck"
            ]
            lib.cardPack["xjb_hunbiStore"] = [...game.xjb_storeCard]
            lib.translate.xjb_hunbiStore_card_config = "魂市"
            lib.config.all.cards.push("xjb_hunbiStore");
            if (!lib.config.cards.includes("xjb_hunbiStore")) lib.config.cards.push("xjb_hunbiStore");
            class CardCreator {
                constructor(num1 = 1, num2 = 1, num3 = 1, arr1, arr2) {
                    this.content = {
                        fivePoint: num1,
                        minCost: num2,
                        energyNeed: num3,
                    }
                    this.arr1 = arr1
                    this.arr2 = arr2
                }
                get ok() {
                    return lib.config.xjb_systemEnergy >= this.content.energyNeed;
                }
                get cost() {
                    this.update();
                    if (lib.translate[this.cardName]) lib.translate[this.cardName + "_info"] = this.description + "</br>价格:" + this.content.cost;
                    return this.content.cost;
                }
                update() {
                    if (lib.config.xjb_systemEnergy < this.content.fivePoint) {
                        let Num1 = this.content.fivePoint - lib.config.xjb_systemEnergy
                        this.content.cost = (Math.floor(Num1 / this.arr1[0]) * (this.arr1[1])) + 5
                    } else if (lib.config.xjb_systemEnergy > this.content.fivePoint) {
                        let Num2 = lib.config.xjb_systemEnergy - this.content.fivePoint
                        this.content.cost = (-(Math.floor(Num2 / this.arr2[0]) * (this.arr2[1]))) + 5
                    } else {
                        this.content.cost = 5
                    }
                    this.content.cost = Math.round(this.content.cost * game.xjb_inflationRate())
                    if (this.content.cost < this.content.minCost) this.content.cost = this.content.minCost
                }
                setName(cardName) {
                    this.cardName = cardName
                    this.description = lib.translate[cardName + "_info"]
                    return this
                }
            }
            game.xjb_storeCard_information = {
                xjb_skill_off_card: new CardCreator(580, 0, 25, [500, 1], [600, 1]).setName("xjb_skill_off_card"),
                xjb_zhihuan: new CardCreator(150, 1, 43, [5, 1], [8, 1]).setName("xjb_zhihuan"),
                xjb_penglai: new CardCreator(1230, 2, 70, [56, 1], [70, 1]).setName("xjb_penglai"),
                xjb_skillCard: new CardCreator(1460, 2, 75, [56, 1], [100, 1]).setName("xjb_skillCard"),
                xjb_tianming_huobi2: new CardCreator(9842, 0, 500, [24, 1], [26, 1]).setName("xjb_tianming_huobi2"),
                xjb_tianming_huobi1: new CardCreator(1142, 0, 70, [84, 1], [96, 1]).setName("xjb_tianming_huobi1"),
                xjb_shenshapo: new CardCreator(980, 1, 50, [254, 2], [220, 1]).setName("xjb_shenshapo"),
                xjb_seizeHpCard: new CardCreator(3000, 4, 150, [61, 1], [10, 1]).setName("xjb_seizeHpCard"),
                xjb_BScharacter: new CardCreator(10000, 3, 50, [1905, 1], [2300, 1]),
                xjb_lingliCheck: new CardCreator(23000, 4, 1300, [2500, 1], [1500, 1]).setName("xjb_lingliCheck")
            }
            lib.skill._xjb_cardStore = {
                enable: ["chooseToUse"],
                filter: function (event, player) {
                    if (!lib.config.xjb_hun || !lib.config.xjb_cardStore) return false
                    if (!(player == game.me || player.isUnderControl())) return false
                    if (event.type != 'dying' && event.parent.name != 'phaseUse') return false
                    if (lib.config.xjb_systemEnergy < 0) return false
                    let list = []
                    game.xjb_storeCard.forEach(function (item, index) {
                        const _this = game.xjb_storeCard_information[item];
                        if (!_this) return;
                        if (!_this.cost||!_this.ok) return;
                        if (!game.xjb_condition(1, _this.cost)) return;
                        list.push(item);
                    })
                    if (!list.length) return false
                    return true
                },
                content: function () {
                    "step 0"
                    let list = []
                    game.xjb_storeCard.forEach(function (item, index) {
                        const _this = game.xjb_storeCard_information[item];
                        if (!_this) return;
                        if (!_this.cost||!_this.ok) return;
                        if (!game.xjb_condition(1, _this.cost)) return;
                        list.push(["", "<font color=white>" + _this.cost + "魂币", item])
                    })
                    if (list.length) {
                        let dialog = ui.create.dialog("新将包魂市", [list, "vcard"])
                        player.chooseButton(dialog)
                    }
                    "step 1"
                    if (result.bool) {
                        const cardName = result.links[0][2];
                        const information = game.xjb_storeCard_information[cardName];
                        let card = game.createCard(cardName, "", 1)
                        player.gain(card, "draw")
                        card.storage.xjb_allowed = true;
                        card.dataset.cost = information.cost;
                        game.cost_xjb_cost(1, information.cost, '在商店中购买');
                        game.xjb_systemEnergyChange(-information.content.energyNeed);
                    }
                },
                ai: {
                    save: true
                }
            }
            //天赋卡判定原理
            lib.skill._unique_talent_xjb = {
                trigger: {
                    global: "roundStart",
                },
                load: [],
                direct: true,
                content: function () {
                    "step 0"
                    for (var i = 0; i < lib.skill._unique_talent_xjb.load.length; i++) {
                        lib.skill._unique_talent_xjb.load[i]()
                    }
                    player.storage.xjb_unique_talent == undefined && event.finish()
                    "step 1"
                    if (player.storage.xjb_unique_talent.length > 0) {
                        for (var i = 0; i < player.storage.xjb_unique_talent.length; i++) {
                            if (player.storage.xjb_unique_talent[i][0] == game.roundNumber) {
                                var skill = player.storage.xjb_unique_talent[i][1]
                                player.removeSkill(skill)
                                player.update()
                            }
                        }
                    }
                }
            }
            lib.translate._xjb_cardStore = "魂市"
            lib.cardType['xjb_unique'] = 0.5
            lib.cardType['xjb_unique_skill'] = 0.35
            lib.cardType['xjb_unique_talent'] = 0.4
            lib.cardType['xjb_unique_reusable'] = 0.45
            lib.cardType['xjb_unique_money'] = 0.46
            lib.translate.xjb_unique = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="32">'
            lib.translate.xjb_unique_SanSkill = "🐉神圣技能🐉"
            lib.translate.xjb_unique_talent = "💡天赋卡💡"
            lib.translate.xjb_unique_money = "💎货币卡💎"
            lib.translate.xjb_unique_reusable = "♻️循环卡♻️"
            lib.translate.xjb_skillCard = "技能卡"
        },
        CardSkills: function () {
            //蓬莱卡
            lib.skill.xjb_penglai = {
                init: function (player, skill) {
                    if (!player.storage.xjb_card_allow['xjb_penglai']) return
                    player.storage[skill] = player.maxHp
                    game.log(player, '忽闻海外有仙山，上联青云九霄天，下通沟壑九幽界。隐隐云窈窕，我得神皇药。');
                    player.maxHp = player.hasSkill("xjb_minglou") || Infinity;
                    player.hp = player.hasSkill("xjb_minglou") || Infinity;
                },
                onremove: function (player, skill) {
                    var maxHp = player.storage[skill] || 3
                    player.maxHp = maxHp
                    if (player.storage.xjb_card_allow['xjb_penglai']) {
                        player.storage.xjb_card_allow['xjb_penglai'] = false
                    }
                    const benben = {
                        disableSkill: lib.element.player.disableSkill,
                        enableSkill: lib.element.player.enableSkill,
                        awakenSkill: lib.element.player.awakenSkill,
                        restoreSkill: lib.element.player.restoreSkill,
                    }
                    for (let k in benben) {
                        player[k] = benben[k]
                    }
                },
            }
        },
        equip: function () {
            let cards = {
                qimendunjia: {
                    type: "trick",
                    toself: true,
                    enable: function (event, player) {
                        return true;
                    },
                    selectTarget: -1,
                    modTarget: true,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    content: function () {
                        'step 0'
                        if (target.name1.indexOf("zhugeliang") > -1) {
                            var list = ["盈", "缺", "愈", "疾", "焰", "雷"]
                            target.fc_X(true, 'choose', 'needResult', { choice: list, storage: "qimendunjia", chopro: "请选择一个魂将的X技能力" })
                            event.bool = true
                        }
                        'step 1'
                        var ability = target.storage["qimendunjia"]
                        player.$skill(ability, "legend")
                        var num = lib.xjb_list_xinyuan.X_skill_num[ability]
                        target.storage._skill_xin_X_locked = num
                        target.fc_X(num)
                    },
                    fullskin: true,
                },
                "xin_qinnangshu": {
                    type: "equip",
                    subtype: "equip5",
                    skills: ["xin_qinnang2", "xin_qns"],
                    nomod: true,
                    nopower: true,
                    cardcolor: "red",
                    unique: true,
                    onLose: function () {
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        player.addSkillLog("xin_qinnang2")
                        game.log(card, '被销毁了');
                    },
                    ai: {
                        equipValue: 7.5,
                        basic: {
                            order: function (card, player) {
                                if (player && player.hasSkillTag('reverseEquip')) {
                                    return 8.5 - get.equipValue(card, player) / 20;
                                }
                                else {
                                    return 8 + get.equipValue(card, player) / 20;
                                }
                            },
                            useful: 2,
                            equipValue: 1,
                            value: function (card, player, index, method) {
                                if (player.isDisabled(get.subtype(card))) return 0.01;
                                var value = 0;
                                var info = get.info(card);
                                var current = player.getEquip(info.subtype);
                                if (current && card != current) {
                                    value = get.value(current, player);
                                }
                                var equipValue = info.ai.equipValue;
                                if (equipValue == undefined) {
                                    equipValue = info.ai.basic.equipValue;
                                }
                                if (typeof equipValue == 'function') {
                                    if (method == 'raw') return equipValue(card, player);
                                    if (method == 'raw2') return equipValue(card, player) - value;
                                    return Math.max(0.1, equipValue(card, player) - value);
                                }
                                if (typeof equipValue != 'number') equipValue = 0;
                                if (method == 'raw') return equipValue;
                                if (method == 'raw2') return equipValue - value;
                                return Math.max(0.1, equipValue - value);
                            },
                        },
                        result: {
                            target: function (player, target, card) {
                                return get.equipResult(player, target, card.name);
                            },
                        },
                    },
                    enable: true,
                    selectTarget: -1,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    modTarget: true,
                    allowMultiple: false,
                    content: function () {
                        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                    },
                    toself: true,
                    image: "ext:新将包/xin_qingnangshu.jpg",
                    fullskin: true,
                },
                "card_lw": {
                    enable: true,
                    type: "trick",
                    derivation: "jiaxu",
                    toself: true,
                    selectTarget: -1,
                    modTarget: true,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    content: function () {
                        "step 0"
                        player.logSkill('luanwu')
                        event.current = target.next;
                        event.currented = [];
                        event.preCurrent = game.players.length
                        "step 1"
                        event.currented.push(event.current);
                        event.current.chooseToUse('乱武:使用一张杀或失去一点体力', function (card) {
                            if (get.name(card) != 'sha') return false;
                            return lib.filter.filterCard.apply(this, arguments)
                        }, function (card, player, target) {
                            if (player == target) return false;
                            var dist = get.distance(player, target);
                            if (dist > 1) {
                                if (game.hasPlayer(function (current) {
                                    return current != player && get.distance(player, current) < dist;
                                })) {
                                    return false;
                                }
                            }
                            return lib.filter.filterTarget.apply(this, arguments)
                        }).set('ai2', function () {
                            return get.effect_use.apply(this, arguments) + 0.01;
                        });
                        "step 2"
                        if (result.bool == false) {
                            event.current.chooseToDiscard('he', true)
                            event.current.loseHp();
                        }
                        event.current = event.current.next;
                        if (event.current != player && !event.currented.includes(event.current)) {
                            game.delay(0.5);
                            event.goto(1);
                        } else {
                            (event.preCurrent > game.players.length) && player.gain(cards, 'gain2')
                        }
                    },
                    contentAfter: function () {
                        player.chooseUseTarget('sha', '是否使用一张【杀】？', false, 'nodistance');
                    },
                    fullimage: true,
                },
                "xin_qinglong": {
                    fullskin: true,
                    type: "equip",
                    subtype: "equip1",
                    distance: {
                        attackFrom: -2,
                    },
                    onLose: function () {
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        game.log(card, '被销毁了');
                        player.$skill('二龙互化', 'legend', 'metal');
                        player.equip(game.createCard('qinglong', 'spade', 5))
                    },
                    ai: {
                        equipValue: function (card, player) {
                            var num = 2.5 + (player.countCards('h') + player.countCards('e')) / 2.5;
                            return Math.min(num, 5);
                        },
                        basic: {
                            equipValue: 4.5,
                        },
                    },
                    skills: ["xin_yanyue", "xin_hlyyd"],
                },
                "xin_chitu": {
                    fullskin: true,
                    type: "equip",
                    subtype: "equip4",
                    nomod: true,
                    nopower: true,
                    distance: {
                        globalFrom: -1,
                        globalTo: 1,
                    },
                    enable: true,
                    selectTarget: -1,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    modTarget: true,
                    allowMultiple: false,
                    content: function () {
                        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                    },
                    toself: true,
                    onLose: function () {
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        game.log(card, '被销毁了');
                        player.equip(game.createCard('chitu', 'heart', 5))
                    },
                    skills: ["xin_zhuihun", "new_wuhun"],
                    ai: {
                        basic: {
                            order: function (card, player) {
                                if (player && player.hasSkillTag('reverseEquip')) {
                                    return 8.5 - get.equipValue(card, player) / 20;
                                }
                                else {
                                    return 8 + get.equipValue(card, player) / 20;
                                }
                            },
                            useful: 2,
                            equipValue: 4,
                            value: function (card, player, index, method) {
                                if (player.isDisabled(get.subtype(card))) return 0.01;
                                var value = 0;
                                var info = get.info(card);
                                var current = player.getEquip(info.subtype);
                                if (current && card != current) {
                                    value = get.value(current, player);
                                }
                                var equipValue = info.ai.equipValue;
                                if (equipValue == undefined) {
                                    equipValue = info.ai.basic.equipValue;
                                }
                                if (typeof equipValue == 'function') {
                                    if (method == 'raw') return equipValue(card, player);
                                    if (method == 'raw2') return equipValue(card, player) - value;
                                    return Math.max(0.1, equipValue(card, player) - value);
                                }
                                if (typeof equipValue != 'number') equipValue = 0;
                                if (method == 'raw') return equipValue;
                                if (method == 'raw2') return equipValue - value;
                                return Math.max(0.1, equipValue - value);
                            },
                        },
                        result: {
                            target: function (player, target, card) {
                                return get.equipResult(player, target, card.name);
                            },
                        },
                    },
                },
                "xin_baiyin": {
                    fullskin: true,
                    type: "equip",
                    subtype: "equip2",
                    loseDelay: false,
                    onLose: function () {
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        game.log(card, '被销毁了');
                        player.equip(game.createCard('baiyin', 'club', 1))
                        player.recover();
                    },
                    skills: ["xin_shinu"],
                    tag: {
                        recover: 1,
                    },
                    ai: {
                        order: 9.5,
                        equipValue: function (card, player) {
                            if (player.hp == player.maxHp) return 5;
                            if (player.countCards('h', 'baiyin')) return 6;
                            return 0;
                        },
                        basic: {
                            equipValue: 5,
                            order: function (card, player) {
                                if (player && player.hasSkillTag('reverseEquip')) {
                                    return 8.5 - get.equipValue(card, player) / 20;
                                }
                                else {
                                    return 8 + get.equipValue(card, player) / 20;
                                }
                            },
                            useful: 2,
                            value: function (card, player, index, method) {
                                if (player.isDisabled(get.subtype(card))) return 0.01;
                                var value = 0;
                                var info = get.info(card);
                                var current = player.getEquip(info.subtype);
                                if (current && card != current) {
                                    value = get.value(current, player);
                                }
                                var equipValue = info.ai.equipValue;
                                if (equipValue == undefined) {
                                    equipValue = info.ai.basic.equipValue;
                                }
                                if (typeof equipValue == 'function') {
                                    if (method == 'raw') return equipValue(card, player);
                                    if (method == 'raw2') return equipValue(card, player) - value;
                                    return Math.max(0.1, equipValue(card, player) - value);
                                }
                                if (typeof equipValue != 'number') equipValue = 0;
                                if (method == 'raw') return equipValue;
                                if (method == 'raw2') return equipValue - value;
                                return Math.max(0.1, equipValue - value);
                            },
                        },
                        result: {
                            target: function (player, target, card) {
                                return get.equipResult(player, target, card.name);
                            },
                        },
                    },
                    enable: true,
                    selectTarget: -1,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    modTarget: true,
                    allowMultiple: false,
                    content: function () {
                        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                    },
                    toself: true,
                },
                "xin_hutou": {
                    fullskin: true,
                    type: "equip",
                    subtype: "equip1",
                    distance: {
                        attackFrom: -2,
                    },
                    skills: ["xin_htzjq2", "mashu"],
                    loseDelay: false,
                    onLose: function () {
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        game.log(card, '被销毁了');
                        player.$skill('虎恨', 'legend', 'metal');
                        player.equip(game.createCard(get.typeCard('equip').randomGet()))
                    },
                    ai: {
                        basic: {
                            equipValue: 2,
                            order: function (card, player) {
                                if (player && player.hasSkillTag('reverseEquip')) {
                                    return 8.5 - get.equipValue(card, player) / 20;
                                }
                                else {
                                    return 8 + get.equipValue(card, player) / 20;
                                }
                            },
                            useful: 2,
                            value: function (card, player) {
                                var value = 0;
                                var info = get.info(card);
                                var current = player.getEquip(info.subtype);
                                if (current && card != current) {
                                    value = get.value(current, player);
                                }
                                var equipValue = info.ai.equipValue;
                                if (equipValue == undefined) {
                                    equipValue = info.ai.basic.equipValue;
                                }
                                if (typeof equipValue == 'function') return equipValue(card, player) - value;
                                if (typeof equipValue != 'number') equipValue = 0;
                                return equipValue - value;
                            },
                        },
                        result: {
                            target: function (player, target, card) {
                                return get.equipResult(player, target, card.name);
                            },
                        },
                    },
                    enable: true,
                    selectTarget: -1,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    modTarget: true,
                    allowMultiple: false,
                    content: function () {
                        target.equip(card);
                    },
                    toself: true,
                },
                "xin_qixing": {
                    type: "equip",
                    subtype: "equip2",
                    skills: ["qixing", "xin_xuming"],
                    onLose: function () {
                        player.gain(player.getExpansions('qixing'), 'gain2', 'fromStorage');
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        game.log(card, '被销毁了');
                        player.removeSkill('guanxing')
                    },
                    ai: {
                        basic: {
                            equipValue: 6.5,
                            order: function (card, player) {
                                if (player && player.hasSkillTag('reverseEquip')) {
                                    return 8.5 - get.equipValue(card, player) / 20;
                                }
                                else {
                                    return 8 + get.equipValue(card, player) / 20;
                                }
                            },
                            useful: 2,
                            value: function (card, player, index, method) {
                                if (player.isDisabled(get.subtype(card))) return 0.01;
                                var value = 0;
                                var info = get.info(card);
                                var current = player.getEquip(info.subtype);
                                if (current && card != current) {
                                    value = get.value(current, player);
                                }
                                var equipValue = info.ai.equipValue;
                                if (equipValue == undefined) {
                                    equipValue = info.ai.basic.equipValue;
                                }
                                if (typeof equipValue == 'function') {
                                    if (method == 'raw') return equipValue(card, player);
                                    if (method == 'raw2') return equipValue(card, player) - value;
                                    return Math.max(0.1, equipValue(card, player) - value);
                                }
                                if (typeof equipValue != 'number') equipValue = 0;
                                if (method == 'raw') return equipValue;
                                if (method == 'raw2') return equipValue - value;
                                return Math.max(0.1, equipValue - value);
                            },
                        },
                        result: {
                            target: function (player, target, card) {
                                return get.equipResult(player, target, card.name);
                            },
                        },
                    },
                    fullskin: true,
                    enable: true,
                    selectTarget: -1,
                    filterTarget: function (card, player, target) {
                        return target == player;
                    },
                    modTarget: true,
                    allowMultiple: false,
                    content: function () {
                        target.equip(cards[0]);
                        player.$skill('武侯之魂', 'legend', 'metal');
                        game.me.addToExpansion(get.cards(7), 'gain2').gaintag.add('qixing');

                    },
                    toself: true,
                },
            }
            for (let k in cards) {
                lib.card[k] = cards[k];
            }
        }
    }
}