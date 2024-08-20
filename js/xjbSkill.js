export const xjbSkill = {};
export const xjbTranslate = {};
function SkillCreater(name, skill) {
    xjbSkill[name] = { ...skill }
    delete xjbSkill[name].translate;
    delete xjbSkill[name].description;
    xjbTranslate[name] = skill.translate;
    xjbTranslate[name + "_info"] = skill.description
    return xjbSkill[name];
};

const xin_yexi = SkillCreater(
    "xin_yexi", {
    enable: "phaseUse",
    filter: function (event, player) {
        return player.countCards('h') > 0
    },
    filterTarget: function (card, player, target) {
        game.print(get.itemtype(card))
        return target.countCards("he");
    },
    filterCard: function (card) {
        if (ui.selected.cards.length) {
            return get.suit(card) == get.suit(ui.selected.cards[0])
        }
        return true
    },
    complexCard: true,
    selectCard: function (card) {
        if (ui.selected.cards.length) return -1
        return 1
    },
    check: function (card) {
        return 6 - get.value(card)
    },
    content: function () {
        player.fc_X(true, 2, [cards.length], 'num_2', { onlyme: [target] });
        if (cards.length > 1) player.useCard({ name: 'sha', nature: "thunder" }, target, false);
    },
    translate: "夜袭",
    description: "出牌阶段，你可以弃置一种花色的所有手牌，然后你弃置一名角色等量张牌。若你以此弃置的牌数>1，你对其使用一张无距离限制的雷【杀】，此【杀】计入次数限制。",
    ai: {
        order: 5,
        result: {
            player: 0.1,
            target: function (player, target) {
                return -2
            },
        },
        threaten: 1.5,
    }
});
const xjb_jianxiong = SkillCreater(
    "xjb_jianxiong", {
    trigger: {
        player: "damageEnd"
    },
    frequent: true,
    getIndex: function (event, player, triggername) {
        return event.num;
    },
    content: async function (event, trigger, player) {
        const orderingCards = [...ui.ordering.children]
        const num = orderingCards.length + 1
        const dialog = ui.create.dialog(`请选择${get.cnNumber(num)}张牌获得之`)
        dialog.add('<div class="text center" style="margin: 0px;">牌堆顶</div>')
        dialog.add(get.cards(num))
        if (orderingCards.length) {
            dialog.add('<div class="text center" style="margin: 0px;">中央区</div>')
            dialog.add(orderingCards)
        }
        const { links } = await player.chooseButton(dialog, num, true).forResult()
        await player.gain(links, 'gain2')
    },
    translate: "奸雄",
    description: "当你受到一点伤害后，你可以从牌堆顶的X张牌、此时中央区的牌中选择X张获得之(X为此时中央区的牌数+1)。",
    ai: {
        maixie: true,
        "maixie_hp": true,
        effect: {
            target: function (card, player, target) {
                if (target.isTurnedOver()) {
                    if (get.tag(card, 'damage')) {
                        if (target.hp == 1) return;
                        return [1, 2];
                    }
                }
            },
        },
    },
})
const xin_chongmou = SkillCreater(
    "xin_chongmou", {
    trigger: {
        global: ["useCardBefore"],
    },
    usable: 1,
    filter(event, player) {
        return event.getParent("_xjb_remnantArea");
    },
    content() {
        trigger.player = player
    },
    translate: "重谋",
    description: "每回合限一次，你可以将一张牌的使用者改为你。"
})
const xin_shiyin = SkillCreater(
    "xin_shiyin", {
    trigger: {
        player: ["loseAfter", "loseAsyncAfter"],
    },
    getType(event, player) {
        let cards = [];
        for (const target of [player, player.getPrevious()]) {
            const evt = event.getl(target);
            if (evt && evt.cards2 && evt.cards2.some(i => get.position(i) == "d")) {
                if (
                    target == player ||
                    target
                        .getHistory("lose", evt => {
                            return evt.type == "discard" && evt.getlx !== false;
                        })
                        .indexOf(event) == 0
                ) {
                    cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
                }
            }
        }
        let types = [];
        for (let each of cards) {
            types.add(get.type2(each, player));
        }
        return types
    },
    filter(event, player) {
        if (player !== _status.currentPhase) return false;
        if (event.type != "discard" || event.getlx === false) return false;
        return get.info("xin_shiyin").getType(event, player).length === 1;
    },
    async cost(event, trigger, player) {
        let type = get.info("xin_shiyin").getType(trigger, player)[0];
        let number = 0;
        switch (type) {
            case 'basic': number = 11; break;
            case 'trick': number = 12; break;
            case 'equip': number = 4; break;
        }
        event.result = await player.chooseTarget(get.xjb_number(number, 1)).forResult();
    },
    async content(event, trigger, player) {
        let type = get.info("xin_shiyin").getType(trigger, player)[0];
        let toDo = 0;
        switch (type) {
            case 'basic': toDo = "recover"; break;
            case 'trick': toDo = "loseHp"; break;
            case 'equip': toDo = "damage"; break;
        }
        event.targets[0][toDo](toDo === "loseHp" ? void 0 : player, toDo === "damage" ? "fire" : void 0)
    },
    translate: "识音",
    description: "你于回合内因弃置失去牌后，若你失去的牌均为：基本牌/锦囊牌/装备牌，你可以令场上一名角色：恢复1点体力/失去1点体力/受到一点火属性伤害。"
})
const xjb_qizuo = SkillCreater(
    "xjb_qizuo", {
    group: ["xjb_qizuo_gain"],
    trigger: {
        global: "roundStart",
    },
    mark: true,
    intro: {
        name: "奇",
        content: function () {
            const orderingCards = [...ui.ordering.children].filter(card => card["xjb_qizuo"]);
            if (orderingCards.length) return `${get.translation(orderingCards[0])}`
            return `无`

        }
    },
    filter: function (event, player) {
        return player.countCards("h") > 0
    },
    frequent: true,
    content: async function (event, trigger, player) {
        const { result: { bool, cards } } = await player.chooseCard('h', 1, function (card) {
            return true;
        }).set("prompt", "是否将一张牌置于处理区称为'奇'并获得上一张'奇'？")
        if (bool) {
            //
            const orderingCards = [...ui.ordering.children].filter(card => card[event.name]);
            //
            event.cardsOrdered = true;
            event.noOrdering = true;
            await game.cardsGotoOrdering(cards);
            await ui.updatehl()
            player.$throw(cards)
            cards[0][event.name] = true;
            await player.gain(orderingCards, "gain2")
            if (orderingCards.length) delete orderingCards[0][event.name];
        }
        else event.finish()
    },
    translate: "奇佐",
    description: "每轮开始时，你可以将一张牌置于处理区称为'奇'并获得上一张'奇'。每回合限一次，当处理区牌数增加时，若此牌与'奇'花色相同，你可令一名角色获得之。",
    ai: {
        threaten: 1.3,
    },
    subSkill: {
        "gain": {
            init(player, skill) {
                const observer = new MutationObserver(list => {
                    list.forEach(i => {
                        if (i.type == "childList" && i.addedNodes.length) {
                            const cards = [...i.addedNodes].filter(child => child.nodeType === Node.ELEMENT_NODE)
                            if (cards.length) {
                                var next = game.createEvent('xjb_orderingAdd');
                                next.cards = cards;
                                next.player = _status.event.player;
                                next.setContent(function () {
                                    "step 0"
                                    game.log(event.cards, "进入处理区");
                                    ui.updatehl()
                                    "step 1"
                                    event.trigger("xjb_orderingAdded");
                                })
                            }
                        }
                    })
                });
                observer.observe(ui.ordering, { childList: true });
            },
            trigger: {
                global: ["xjb_orderingAdded"]
            },
            filter: function (event, player) {
                if (player.hasSkill("xjb_qizuo_off")) return;
                const ordering = [...ui.ordering.children]
                const orderingCards = [...ui.ordering.children].filter(card => card["xjb_qizuo"]);
                const orderingCard = orderingCards[0]
                const cards = event.cards.filter(card => get.suit(card, false) === get.suit(orderingCard, false))
                return cards.length;
            },
            direct: true,
            content: async function (event, trigger, player) {
                const ordering = [...ui.ordering.children]
                const orderingCards = [...ui.ordering.children].filter(card => card["xjb_qizuo"]);
                const orderingCard = orderingCards[0]
                const cards = trigger.cards.filter(card => get.suit(card, false) === get.suit(orderingCard, false));
                const { result: { bool, targets } } = await player.chooseTarget("令一名角色获得" + get.translation(cards)).set("ai", function (target) {
                    var att = get.attitude(player, target);
                    if (att <= 0) return 0;
                    if (att < 3) return att;
                    att = 10 - get.distance(player, target, 'absolute') / game.players.length;
                    if (target.hasSkill('gwqinwu')) {
                        att /= 1.5;
                    }
                    if (target.hasJudge('lebu') || target.skipList.includes('phaseUse')) {
                        att /= 2;
                    }
                    return att;
                })
                if (bool) {
                    targets[0].gain(cards, "gain2")
                    player.addTempSkill("xjb_qizuo_off")
                }
            }
        },
        "off": {},
    }
})

const xin_zhibang = SkillCreater(
    "xin_zhibang", {
    init: function (player, skill) {
        if (!player.storage[skill]) player.storage.xin_zhibang = [];
    },
    marktext: "棒",
    intro: {
        content: "cards",
        onunmark: function (storage, player) {
            if (storage && storage.length) {
                player.$throw(storage, 1000);
                game.cardsDiscard(storage);
                game.log(storage, '被置入了弃牌堆');
                storage.length = 0;
            }
        },
    },
    mark: true,
    trigger: {
        global: ["phaseBegin"],
    },
    direct: true,
    content: function () {
        'step 0'
        player.choosePlayerCard(player, [1, Infinity], 'hej').set('prompt', '选择作为"棒"的牌');
        'step 1'
        if (result && result.links && result.links.length) {
            player.lose(result.links, ui.special, 'toStorage');
            player.markAuto('xin_zhibang', result.links);
            game.log(player, '将', result.links, '置于其武将牌上');
            if (player.storage.xin_zhibang.length <= 5) player.draw(result.links.length)
        }
    },
    ai: {
        damage: true,
        effect: {
            target: function (card, player, target, current) {
                if (get.type(card) == 'delay') {
                    return 'zeroplayertarget';
                }
            },
        },
        expose: 0.3,
    },
    translate: "置棒",
    description: "一名角色回合开始前，你可以将你区域内的任意牌置于你的武将牌上，称为“棒\"。若你以此法使得“棒”的数量不大于5，你摸等量张牌。",
});
const xin_chuhui = SkillCreater(
    "xin_chuhui", {
    audio: "ext:新将包:false",
    enable: "phaseUse",
    filter: function (event, player) {
        return player.getStorage('xin_zhibang').length >= 5;
    },
    filterTarget: true,
    content: function () {
        const number = Math.floor(player.storage.xin_zhibang.length / 2)
        target.gain(player.storage.xin_zhibang, 'gain2', 'fromStorage');
        player.storage.xin_zhibang.length = 0;
        target.damage(number, player)
    },
    ai: {
        damage: true,
        order: 2,
        result: {
            target: function (player, target) {
                return get.damageEffect(target, player);
            },
        },
        threaten: 1.5,
        expose: 0.3,
    },
    translate: "除秽",
    description: "出牌阶段，若你\"棒\"数量≥5，你可令一名角色获得全部的\"棒\",然后对其造成x点伤害(x为棒的数量,向下取整)。",
})

const xjb_fangquan = SkillCreater(
    "xjb_fangquan", {
    enable: "phaseUse",
    usable: 1,
    filter(event, player, triggername) {
        if (!player.countCards('he', get.info("xjb_fangquan").filterCard)) return false;
        if (!(!player.getHistory("sourceDamage")
            || player.getHistory('sourceDamage').length == 0)) return false;
        return true;
    },
    filterCard: function (card) {
        return get.tag(card, 'damage') || ["equip1", "equip4"].includes(get.subtype(card))
    },
    selectCard: -1,
    discard: false,
    lose: false,
    position: "he",
    filterTarget: function (card, player, target) {
        return target != player;
    },
    prompt: "将带有伤害标签的牌、武器牌、-1马牌，交给一名其他角色并结束你的出牌阶段，令其额外进行一个回合",
    content: function () {
        target.gain(cards, "giveAuto")
        target.insertPhase();
    },
    translate: '放权',
    description: "出牌阶段限一次，若你本回合未造成过伤害，你可以将所有的带有伤害标签的牌、武器牌、-1马牌，交给一名其他角色并令其进行一个额外的回合。",
    ai: {
        order: 2,
        result: {
            target: function (player, target) {
                return 2;
            },
        },
        threaten: 1.5,
    },
})
const xjb_xiangle = SkillCreater(
    "xjb_xiangle", {
    group: ["xjb_xiangle_reversal"],
    trigger: {
        global: "phaseZhunbeiBegin",
    },
    filter: function (event, player) {
        return event.player.countCards('j') > 0 && player != event.player
    },
    prompt2: "是否将其判定区内一张牌移至你的判定区?",
    content: function () {
        "step 0"
        player.choosePlayerCard("j", trigger.player).set("filterButton", function (button) {
            if (player.canAddJudge(button.link)) return true
        })
        "step 1"
        if (result.bool) {
            let card = result.buttons[0].link;
            if (card.viewAs) player.addJudge({ name: card.viewAs }, [card])
            else player.addJudge(card)
            trigger.player.$give(card, player)
        }
    },
    translate: "享乐",
    description: "每名其他角色的准备阶段,若其判定区内有牌,你可以将其中一张牌移至你的判定区内；判定阶段前,你可以摸一张牌并令本回合你区域内的延时锦囊牌的判定效果反转。",
    subSkill: {
        reversal: {
            trigger: {
                player: "phaseJudgeBegin"
            },
            filter: function (event, player) {
                return event.player.countCards('j') > 0;
            },
            prompt2: "摸一张牌并令本回合你区域内的延时锦囊牌的判定效果反转?",
            content: function () {
                player.draw()
                player.addTempSkill("xjb_JudgeReversal")
            }
        }
    }
})

const xjb_jincui = SkillCreater(
    "xin_jincui", {
    audio: "ext:新将包:2",
    trigger: {
        player: "phaseBefore",
    },
    round: 1,
    content: function () {
        "step 0"
        player.fc_X(62, '再动', true, [2])
        "step 1"
        var card1 = game.createCard2('sha', 'red', undefined, 'fire')
        var card2 = game.createCard2('sha', 'red', undefined, 'fire')
        player.addToExpansion([card1, card2], 'giveAuto', player).gaintag.add('xin_chushi')
    },
    group: ["xin_jincui_roundcount"],
})
const xjb_chushi = SkillCreater(
    "xin_chushi", {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
        return player.getExpansions("xin_chushi").length > 0
    },
    content: function () {
        "step 0"
        player.getCards("x").forEach(i => {
            player.chooseUseTarget(i)
        })
    },
    marktext: "师",
    intro: {
        content: "expansion",
        markcount: "expansion",
    },
    onremove: function (player, skill) {
        var cards = player.getExpansions(skill);
        if (cards.length) player.loseToDiscardpile(cards);
    },
    ai: {
        order: 9,
        result: {
            target: function (player, target) {
                return 2;
            },
        },
        threaten: 1.5,
    },
})

const xjb_yeling = SkillCreater(
    "xin_yeling", {
    trigger: {
        player: ["phaseZhunbeiBegin"],
    },
    forced: true,
    mark: true,
    priority: 1000,
    content: function () {
        'step 0'
        player.judge()
        'step 1'
        player.fc_X(true, '残区', { remnant: result.card.name })
    },
})
const xin_huanshi = SkillCreater(
    "xin_huanshi", {
    trigger: {
        global: ["judgeBegin"],
    },
    filter: function (event, player) {
        return player.countCards('he') > 0;
    },
    frequent: true,
    content: function () {
        "step 0"
        player.chooseCard('he', [1, Infinity], '将任意张牌置于牌堆顶').set('ai', function (card) {
            var trigger = _status.event.getTrigger();
            var player = _status.event.player;
            var result = trigger.judge(card)
            var attitude = get.attitude(player, trigger.player);
            if (attitude == 0 || result == 0) return 0;
            if (attitude > 0) {
                return result - get.value(card) / 2;
            }
            else {
                return -result - get.value(card) / 2;
            }
        })
        "step 1"
        if (result.bool) {
            player.fc_X(true, '置于牌堆顶', '牌堆底摸牌', { toTopCard: result.cards }, [1, result.cards.length])
        }
    }
})
const xin_bianzhu = SkillCreater(
    "xin_bianzhu", {
    trigger: {
        global: "judgeEnd",
    },
    filter: function (event, player) {
        if (event.result.card.suit !== 'club') return false
        return game.countPlayer(function (current) {
            return current.hasSkill("xin_yeling")
        }) > 0
    },
    content: function () {
        "step 0"
        player.fc_X(true, "再动", "获得技能", { skills: ['xin_bianzhu_win'] })
    },
    subSkill: {
        win: {
            trigger: {
                player: ["useCardEnd"],
            },
            forced: true,
            filter: function (event, player) {
                return event.targets && event.card && get.type(event.card) !== 'equip';
            },
            content: function () {
                "step 0"
                let num = [1, 2, 3].randomGet()
                player.fc_X(true, '残区', {
                    remnant: trigger.card.name,
                    onlyme: trigger.targets
                }, [num])
            },
            sub: true,
        },
    },
})
const xin_zhabing = SkillCreater(
    "xin_zhabing", {
    trigger: {
        player: "phaseBegin",
    },
    derivation: ["xin_yeling", "xin_bianzhu"],
    limited: true,
    skillAnimation: true,
    filter: function (event, player) {
        return !player.isHealthy()
    },
    animationColor: "thunder",
    content: function () {
        'step 0'
        trigger.cancel()
        var targets = game.players
        player.fc_X(true, 83, { skills: ['xin_yeling'], expire: { player: 'xin_yelingAfter' }, onlyme: targets })
        player.fc_X(true, 23, 133, 143, { skills: ['xin_bianzhu'], awaken: ['xin_zhabing'], remove: ['xin_yeling'] })
    },
    mark: true,
    intro: {
        content: "limited",
    },
    init: function (player, skill) {
        player.storage[skill] = false;
        player.storage.xin_zhabing = false;
    },
})

const xin_huzhu = SkillCreater(
    "xin_huzhu", {
    derivation: ["xin_huzhu2"],
    audio: "ext:新将包:false",
    trigger: {
        global: "useCardToTargeted",
    },
    check: function (event, player) {
        return get.attitude(player, event.target) > 0 && !event.target.hasSkill('xin_huzhu2');
    },
    filter: function (event, player) {
        if (event.card.name == 'sha' && event.player != player) return true
        return false
    },
    prompt: function (event, player) {
        return '是否对' + get.translation(event.target) + '发动〖护主〗？'
    },
    content: function () {
        'step 0'
        player.chooseToDiscard('he', 1, '弃置一张牌，或点取消失去一点体力').set('ai', function (card) {
            return 8 - get.value(card)
        })
        'step 1'
        if (result.bool) {
            trigger.target.draw(2)
        }
        else {
            player.loseHp()
            trigger.target.addTempSkill('xin_huzhu2', { player: 'dieAfter' })
            trigger.target.storage.xin_huzhu2++
        }
        'step 2'
        trigger.target.update();
    },
    ai: {
        threaten: 1.6,
    },
})
const xin_huzhu2 = SkillCreater(
    "xin_huzhu2", {
    init: function (player) {
        player.storage.xin_huzhu2 = 0;
        player.markSkill('xin_huzhu2');
        player.syncStorage('xin_huzhu2');
    },
    enable: ["chooseToUse", "chooseToRespond"],
    viewAs: {
        name: "shan",
        isCard: true,
    },
    filterCard: function () { return false },
    selectCard: -1,
    onuse: function (event, player) {
        player.draw()
        player.storage.xin_huzhu2--;
        player.update();
        if (player.storage.xin_huzhu2 <= 0) player.removeSkill('xin_huzhu2')
    },
    onrespond: function (event, player) {
        player.draw()
        player.storage.xin_huzhu2--;
        player.update();
        if (player.storage.xin_huzhu2 <= 0) player.removeSkill('xin_huzhu2')
    },
    marktext: "护",
    prompt: "视为使用或打出一张【闪】",
    intro: {
        content: "护：你可在需要时，视为使用或打出一张【闪】。若此做，你失去一个“护”。 ",
    },
    ai: {
        respondShan: true,
        order: 3,
        basic: {
            useful: [7, 2],
            value: [7, 2],
        },
        result: {
            player: 1,
        },
    },
})
const xin_xiongli = SkillCreater(
    "xin_xiongli", {
    enable: "phaseUse",
    multitarget: true,
    multiline: true,
    selectTarget: [1, Infinity],
    filterTarget: function (card, player, target) {
        return (target != player)
    },
    qzj: true,
    usable: 1,
    content: function () {
        player.fc_X(true, 54, { onlyme: targets })
        player.fc_X(true, "残区", { remnant: 'sha' }, [targets.length])
    },
    ai: {
        damage: true,
        order: 6,
        result: {
            target: function (player, target) {
                return get.damageEffect(target, player);
            },
        },
        threaten: 1.5,
        expose: 0.3,
    }
})

const xin_mousheng = SkillCreater(
    "xin_mousheng", {
    trigger: {
        player: "compare",
        target: "compare",
    },
    filter: function (event) {
        return !event.iwhile;
    },
    forced: true,
    locked: false,
    content: function () {
        if (player == trigger.player) {
            trigger.num1 += game.roundNumber;
            if (trigger.num1 > 13) trigger.num1 = 13;
        }
        else {
            trigger.num2 += game.roundNumber;
            if (trigger.num2 > 13) trigger.num2 = 13;
        }
    },
    "_priority": 0,
})

const xin_bingjie = SkillCreater(
    "xin_bingjie", {
    trigger: {
        global: ["phaseZhunbeiBegin"],
        player: "damageEnd",
    },
    filter: function (event, player) {
        if (event.name == 'phaseZhunbei') {
            return event.player.countCards("h") !== event.player.maxHp && player.countCards("h") > 0
        }
        return true;
    },
    direct: true,
    content: function () {
        'step 0'
        if (event.triggername == 'damageEnd') event.count = trigger.num
        'step 1'
        if (event.triggername == 'damageEnd') {
            event.count--
            player.chooseTarget('令一名角色将手牌数调至体力上限', true, function (card, player, target) {
                return true
            }).set('ai', function (target) {
                var att = get.attitude(_status.event.player, target);
                var draw = Math.min(5, target.maxHp) - target.countCards('h');
                if (draw >= 0) {
                    if (target.hasSkillTag('nogain')) att /= 6;
                    if (att > 2) {
                        return Math.sqrt(draw + 1) * att;
                    }
                    return att / 3;
                }
                if (draw < -1) {
                    if (target.hasSkillTag('nogain')) att *= 6;
                    if (att < -2) {
                        return -Math.sqrt(1 - draw) * att;
                    }
                }
                return 0;
            });
        }
        else {
            event.target = trigger.player
            var a = event.target.maxHp
            var n = a > 5 ? 5 : a
            var next = player.chooseBool('是否令' + get.translation(event.target) + '将手牌调至' + n + '张牌，你弃置所有手牌？')
            next.set('ai', function () {
                var event = _status.event;
                if (event.player.hp > 1) {
                    if (event.source.countCards("h") < event.source.maxHp) return (get.attitude(event.player, event.source) > 0)
                }
                return false
            });
            next.set('source', event.target);
        }
        'step 2'
        if (result.bool) {
            if (event.triggername != 'damageEnd') player.discard(player.getCards("h"))
            event.target = event.triggername == 'damageEnd' ? result.targets[0] : trigger.player
            var num = event.target.maxHp > 20 ? 20 : event.target.maxHp
            event.target.fc_X(true, 46, [num], { toTagCard: 'xin_liuxiang' })
        }
        else if (event.count > 0) event.goto(1)
        else event.finish()
        'step 3'
        if (event.triggername != 'damageEnd') { }
        else if (event.count > 0) event.goto(1)
        else event.finish()
    },
    "_priority": 0,
})
const xin_liuxiang = SkillCreater(
    "xin_liuxiang", {
    group: ["xin_liuxiang_xiang", "xin_liuxiang_aid"],
    subSkill: {
        xiang: {
            marktext: "香",
            intro: {
                name: "香",
                content: "mark",
            },
            sub: true,
            "_priority": 0,
        },
        aid: {
            trigger: {
                global: ["respondEnd", "useCardEnd", "discardEnd"],
            },
            forced: true,
            priority: -1,
            filter: function (event, player) {
                return event.player.hasHistory('lose', function (evt) {
                    if (evt.getParent() != event) return false;
                    for (var i in evt.gaintag_map) {
                        if (evt.gaintag_map[i].includes('xin_liuxiang')) {
                            event.player.addMark('xin_liuxiang_xiang', 1)
                            event.player.update()
                            return event.player.countMark('xin_liuxiang_xiang') >= player.hp && !player.isHealthy();
                        }
                    }
                    return false;
                });
            },
            content: function () {
                'step 0'
                event.target = trigger.player
                var num = event.target.hp
                player.chooseBool('对' + get.translation(event.target) + '是否令其恢复一点体力')
                'step 1'
                if (result.bool) {
                    event.target.removeMark('xin_liuxiang_xiang', event.target.countMark('xin_liuxiang_xiang'));
                    event.target.fc_X(true, "回血")
                }
            },
            sub: true,
            "_priority": -100,
        },
    },
    "_priority": 0,
})

const xin_zirou = SkillCreater(
    "xin_ziruo", {
    trigger: {
        target: "useCardToTarget",
    },
    filter: function (event, player) {
        if (event.player == player) return false
        if (!event.targets || !event.targets.includes(player)) return false;
        return game.hasPlayer(function (current) {
            return event.targets.includes(current) && !current.isLinked();
        });
    },
    content: function () {
        "step 0"
        player.chooseTarget('为此牌减少任意个目标',
            [1, Infinity], function (card, player, target) {
                return _status.event.targets.includes(target) && !target.isLinked();
            }).set('ai', function (target) {
                var trigger = _status.event.getTrigger();
                if (!trigger.excluded.includes(target)) {
                    return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                }
                return -1;
            }).set('targets', trigger.targets);
        "step 1"
        if (result.bool) {
            trigger.getParent().excluded.addArray(result.targets);
            game.delay();
            for (var i = 0; i < result.targets.length; i++) {
                result.targets[i].link()
            }
        }
    },
    "_priority": 0,
})

const xin_fengtian = SkillCreater(
    "xin_fengtian", {
    trigger: {
        player: "phaseJieshuBegin",
        source: "dieAfter"
    },
    filter: function (event, player) {
        return player.getCards("h").filter(function (i) { return get.tag(i, "damage") }).length > 0
    },
    content: function () {
        player.draw(2);
        var next = player.phaseUse();
        event.next.remove(next);
        let phase = trigger.getParent("phase")
        if (!phase.name) phase = trigger.getParent("phaseUse")
        phase.next.push(next);
    },
    ai: {
        order: 8,
        result: {
            player: 1,
        },
    },
    "_priority": 0,
})
const xin_niepan = SkillCreater(
    "xin_niepan", {
    audio: "ext:新将包:false",
    enable: "phaseUse",
    filter: function (event, player) {
        return true;
    },
    usable: 2,
    content: function () {
        var mode = player.countCards('h') % 2
        if (mode === 0) {
            player.loseHp()
            player.draw(3)
        } else {
            player.recover()
            player.draw()
        }
    },
    ai: {
        order: 9,
        result: {
            player: function (player) {
                if (player.hp <= 2 && player.countCards('he') % 2 == 1) return 10;
                return 0;
            },
        },
    },
    "_priority": 0,
})

const xin_tianming = SkillCreater(
    "xin_tianming", {
    audio: "ext:新将包:false",
    trigger: {
        player: ["loseAfter"],
    },
    marktext: "命",
    init: function (player) {
        if (!player.storage.xin_tianming) player.storage.xin_tianming = [];
    },
    intro: {
        content: "你已有花色$",
    },
    charlotte: true,
    forced: true,
    content: function () {
        player.storage._skill_xin_X[0] = 13
        for (var i = 0; i < trigger.cards.length; i++) {
            var suit = get.suit(trigger.cards[i])
            if (!player.storage.xin_tianming.includes(suit)) {
                player.storage.xin_tianming.add(suit);
                player.draw()
            }
        }
        player.markSkill('xin_tianming');

    },
    ai: {
        threaten: 0.7,
    },
    "_priority": 0,
})
const xin_zulong = SkillCreater(
    "xin_zulong", {
    audio: "ext:新将包:false",
    trigger: {
        player: ["damageEnd", "loseHpEnd"],
        global: "xjb_bianshenEnd",
    },
    frequent: true,
    content: function () {
        'step 0'
        var objects = {
            choice: ['转换技', '觉醒技', '主公技', '锁定技', '视为技'],
            storage: "xin_zulong",
        }
        player.fc_X(true, 'choose', 'needResult', objects)
        'step 1'
        var string = get.xjb_translation(player.storage["xin_zulong"])
        trigger.player.addSkillrandom(string, 1)
    },
    "_priority": 0,
})

const xin_zaozhong = SkillCreater(
    "xin_zaozhong", {
    audio: "ext:新将包:false",
    frequent: true,
    trigger: {
        player: ["damageAfter"],
    },
    content: function () {
        "step 0"
        event.count = trigger.num;
        "step 1"
        player.fc_X(16, 1, "num_2", [1, 3], {
            promptAdd: "令一名角色使用一张残【兵粮寸断】然后摸三张牌",
            remnant: "bingliang"
        });
        event.count--
        "step 2"
        if (event.count > 0) event.goto(1)
    },
    ai: {
        maixie: true,
        "maixie_hp": true,
        result: {
            effect: function (card, player, target) {
                if (get.tag(card, 'damage')) {
                    if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                    if (!target.hasFriend()) return;
                    if (get.tag(card, 'damage')) {
                        if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                        if (target.hp == 1) return;
                        if (target.hp > 2) return [1, 2]
                        return [1, 1];
                    }
                }
            },
        },
        threaten: 0.6,
    },
    "_priority": 0,
})

const xin_taoni = SkillCreater(
    "xin_taoni", {
    enable: "phaseUse",
    filterCard: {
        suit: "diamond",
    },
    filterTarget: function (card, player, target) {
        return !target.isLinked()
    },
    position: "he",
    usable: 1,
    filter: function (event, player) {
        return player.countCards('hes', { suit: 'diamond' }) > 0
    },
    prepare: function (cards, player) {
        player.$throw(cards, 1000);
        game.log(player, '将', cards, '置入了弃牌堆');
    },
    discard: false,
    loseTo: "discardPile",
    visible: true,
    delay: 0.5,
    content: function () {
        target.fc_X(true, 13)
        player.fc_X(true, 1)
    },
    mod: {
        cardUsableTarget: function (card, player, target) {
            if (target.isLinked()) return true;
        },
    },
    ai: {
        order: 9,
        result: {
            player: 1,
            target: -1,
        },
        threaten: 1.5,
    }
})
const xin_jiang = SkillCreater(
    "xin_jiang", {
    audio: "ext:新将包:false",
    trigger: {
        source: "damageEnd",
        player: "damageEnd",
    },
    filter: function (event, player) {
        return event.source.isAlive()
    },
    content: function () {
        var num = 0
        for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].isLinked()) num++
        }
        if (player.hasZhuSkill('xin_yingyi')) {
            for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].group === 'wu') num++
            }
        }
        if (num > 3) num = 3
        game.asyncDraw([trigger.player, trigger.source], num)
    },
    "_priority": 0,
})
const xin_yingyi = SkillCreater(
    "xin_yingyi", {
    zhuSkill: true,
    "_priority": 0,
})


const xin_yingfa = SkillCreater(
    "xin_yingfa", {
    enable: "phaseUse",
    filterTarget: true,
    usable: 3,
    content: function () {
        "step 0"
        player.loseHp()
        player.chooseControl(["基本牌", "装备牌", "锦囊牌"]).set("prompt", "选择一种类别，令其将其区域内所有该类别的牌置入弃牌堆。")
        "step 1"
        const list = {
            "基本牌": "basic",
            "装备牌": "equip",
            "锦囊牌": ["trick", "delay"]
        }
        const type = list[result.control]
        const cards = target.getCards("hej", { type: type })
        target.discard(cards)
        event.cards = cards
        "step 2"
        var s = event.cards
        if (s.length) player.gain(s.randomGet(), "gain2")
    },
    ai: {
        order: 9,
        result: {
            player:function(player) {
                if (player.hp <= 1) return -10;
                return 2
            },
            target:function(player, target) {
                return -target.countCards('h');
            },
        },
        threaten: 2,
    },
    translate: "英发",
    description: "出牌阶段限三次，你可以失去一点体力，令一名角色失去一种类型的所有牌，你随机获得其中一张牌。",
})


const xin_lianhuan = SkillCreater(
    "xin_lianhuan", {
    enable: "phaseUse",
    selectTarget: function () {
        return _status.event.player.hp;
    },
    filterTarget: true,
    usable: 1,
    content: function () {
        target.link()
    },
    "_priority": 0,
})


const xjb_liuli = SkillCreater(
    "xjb_liuli", {
    trigger: {
        player: "damageBegin",
    },
    filter: function (event, player) {
        return player.countCards('hes', { suit: 'diamond' }) > 0
    },
    direct: true,
    content: function () {
        "step 0"
        player.chooseCardTarget({
            filterCard: {
                suit: "diamond",
            },
            position: "hes",
            selectCard: 1,
            filterTarget: function (event, player, target) {
                if (target == player) return false
                return true
            },
            ai1: function (card) {
                var player = _status.event.player;
                return 15 - get.value(card);
            },
            ai2: function (target) {
                var player = _status.event.player, card = ui.selected.cards[0];
                if (get.value(card, target) < 0) return -get.attitude(player, target);
                if (get.value(card, target) < 1) return 0.01 * -get.attitude(player, target);
                return Math.max(1, get.value(card, target) - get.value(card, player)) * get.attitude(player, target);
            },
            prompt: '交给另一名其他角色一张♦️牌，你令伤害来源改为这名角色并令其重新分配伤害'
        });
        "step 1"
        if (result.bool) {
            var num = trigger.num
            result.targets[0].gain(result.cards, player, 'giveAuto');
            var daqiao = {}
            if (trigger.nature) {
                daqiao.nature = [trigger.nature]
                daqiao.wordsAdd = get.translation(trigger.nature) + '属性'
            }
            result.targets[0].fc_X(44, [num], daqiao)
            trigger.cancel()
        }
    },
    ai: {
        "maixie_defend": true,
        effect: {
            target: function (card, player, target) {
                if (player.hasSkillTag('jueqing', false, target)) return;
                if (get.tag(card, 'damage') && target.countCards('he') > 1) return 0.7;
            },
        },
    }
})
const xjb_guose = SkillCreater(
    "xjb_guose", {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
        return game.countPlayer(function (current) {
            return current.countCards('ej');
        }) > 0
    },
    filterTarget: function (event, player, target) {
        return target.countCards('j') == 0
    },
    content: function () {
        "step 0"
        var num = game.countPlayer(function (current) {
            return current.countCards('ej');
        });
        if (num < 1) num = 1
        player.draw(num)
        "step 1"
        var list1 = [], list2 = []
        for (var i = 0; i < result.length; i++) {
            if (get.suit(result[i]) != 'diamond') list1.push(result[i])
        }
        if (list1.length > 0) {
            for (var i = 0; i < lib.inpile.length; i++) {
                if (get.type(lib.inpile[i]) == 'delay') list2.push(game.createCard(lib.inpile[i], '', '', ''));
            }
            event.list1 = list1
            player.chooseButton(['视为使用一张延时锦囊牌', list2], 1, true)
        }
        "step 2"
        if (result.bool) {
            target.addJudge({ name: result.links[0].name }, event.list1);
        }
    },
})


const xin_longpan = SkillCreater(
    "xin_longpan", {
    trigger: {
        player: "phaseAfter",
    },
    filter: function (event, player) {
        return player.storage.xin_tianming.length >= 4
    },
    frequent: true,
    content: function () {
        'step 0'
        var list = []
        var suit = player.storage.xin_tianming;
        for (var i = 0; i < suit.length; i++) {
            var cardname = 'xin_zhaoling_' + suit[i];
            lib.card[cardname] = {
                fullimage: true,
                image: 'character:' + player.name1
            }
            lib.translate[cardname] = lib.translate[suit[i]];
            list.push(game.createCard(cardname, suit[i], ''));
        }
        player.chooseButton(['龙蟠：选择移去的花色', list], suit.length)
        'step 1'
        if (result.bool) {
            event.suit = []
            for (var i = 0; i < result.links.length; i++) {
                event.suit.push(get.suit(result.links[i]))
                player.storage.xin_tianming.remove(get.suit(result.links[i]))
                player.markSkill('xin_tianming');
            }
            var num = result.links.length
            player.fc_X(12, 1, [1, 4], 'num_2', 'again', { promptAdd: "然后摸四张牌" })
        }
    },
    "_priority": 0,
})
const xin_enyuan = SkillCreater(
    "xin_enyuan", {
    audio: "ext:新将包:false",
    trigger: {
        player: ["gainEnd", "drawEnd", "damageEnd"],
    },
    usable: 3,
    filter: function (event, player) {
        if (!event.source) return false
        if (!event.source.isAlive()) return false
        if (event.source == event.player) return false
        if (event.name === "damage") return true
        if (event.cards && event.cards.length >= 2) return true;
        else if (event.num >= 2) return true
    },
    content: function () {
        if (trigger.name != "damage") {
            trigger.source.fc_X(true, 1)
            trigger.source.storage.rerende = 0
        }
        else trigger.source.fc_X(true, 12, '获得其牌', [trigger.num, trigger.num])
    },
    "_priority": 0,
})
const xjb_fuyi = SkillCreater(
    "xjb_fuyi", {
    global: "xjb_fuyi_global",
    trigger: {
        global: ["roundStart"],
    },
    frequent: true,
    content: function () {
        "step 0"
        player.chooseBool("是否使用逐鹿天下？")
        "step 1"
        if (result.bool) {
            player.useCard({
                name: "zhulu_card",
                suit: "club",
                number: 4
            }, game.players)
        }
    },
    subSkill: {
        global: {
            trigger: {
                player: "useCardToTarget",
            },
            frequent: true,
            filter: function (event, player) {
                if (event.targets.length > 1) return false
                var info = get.info(event.card);
                if (info.selectTarget === -1) return false
                if (info.multitarget) return false;
                if (info.allowMultiple === false) return false;
                if (info.type == 'equip') return false;
                if (info.type == 'delay') return false;
                return event.target.countCards('e') > 0 && game.players.filter(i => i.hasSkill("xjb_fuyi")).length
            },
            content: function () {
                "step 0"
                player.chooseCard([1, Infinity], "h").set('ai', function (card) {
                    let target = game.players.filter(i => i.hasSkill("xjb_fuyi"))[0]
                    if (get.attitude(_status.event.player, target) > 0) {
                        return 5 - get.value(card);
                    }
                    return -get.value(card);
                });
                "step 1"
                let target = game.players.filter(i => i.hasSkill("xjb_fuyi"))[0]
                if (result.bool) {
                    target.gain(result.cards, player, "giveAuto")
                    if (target === player) target.discard(result.cards)
                    player.chooseTarget([1, result.cards.length], function (card, player, target) {
                        var trigger = _status.event.getTrigger();
                        return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.effect(target, _status.event.getTrigger().card, player, player);
                    });
                }
                "step 2"
                if (result.bool) {
                    if (!event.isMine() && !event.isOnline()) game.delayx();
                    event.target = result.targets
                }
                "step 3"
                if (event.target && event.target.length) trigger.targets.push(...event.target)
            },
            selectedChioce: "未受伤",
            sub: true,
            "_priority": 0,
        },
    },
    "_priority": 0,
})


const _xjb_remantArea = SkillCreater(
    "_xjb_remnantArea", {
    mod: {
        "cardEnabled2": function (card, player) {
            var remnant = player.getCards("s").filter(i => {
                return i.hasGaintag("_xjb_remnantArea")
            });
            if (remnant.includes(card)) return false
        },
    },
    trigger: {
        player: "phaseJudgeBefore",
    },
    filter: function (event, player) {
        return player.getCards("s").filter(i => {
            return i.hasGaintag("_xjb_remnantArea")
        }).length > 0
    },
    forced: true,
    content: function () {
        "step 0"
        let list = {}
        let remnantArea = player.getCards("s").filter(i => {
            return i.hasGaintag("_xjb_remnantArea")
        })
        remnantArea.forEach(i => {
            let a = i.name
            if (!list[i.name]) list[a] = []
            list[a].push(i)
        })
        for (let k in list) {
            let a = Math.floor(list[k].length / 2)
            let b = list[k].length % 2
            if (lib.card[k].type === "delay") {
                if (!player.canAddJudge(k)) continue;
                else if (list[k].length > 1) {
                    a = 1
                    b = list[k].length - 2
                    ui.updatehl()
                }
            }
            while (list[k].length > b) {
                list[k].pop().discard()
                ui.updatehl()
            }
            for (let c = 0; c < a; c++) {
                player.useCard(game.createCard(k), player, false)
                player.popup("残【" + get.translation(k) + "】")
            }

        }
        player.updateMarks()
    }
})