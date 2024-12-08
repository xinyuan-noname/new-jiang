import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
export const xjbSkill = {};
export const xjbTranslate = {};
/**
 * 
 * @param {*} name 
 * @param {Skill} skill 
 * @returns 
 */
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
        return target.countCards("he");
    },
    filterCard: function (card) {
        if (ui.selected.cards.length) {
            return get.suit(card) === get.suit(ui.selected.cards[0])
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
    content: async function (event, trigger, player) {
        await player.discardPlayerCard("he", event.target, [1, event.cards.length]);
        if (event.cards.length > 1) {
            await player.useCard({ name: 'sha', nature: "thunder" }, event.target, false);
        }
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
    getIndex: function (event, player, triggername) {
        return event.num;
    },
    content: async function (event, trigger, player) {
        if (!trigger.cards) trigger.cards = [];
        const cards = trigger.cards.filterInD();
        const num = Math.max(2 - cards.length, 0)
        await player.draw(num);
        await player.gain(cards, 'gain2')
    },
    translate: "奸雄",
    description: "当你受到一点伤害后，你可以摸2-X张牌，然后你获得对你造成伤害的牌。(X为位于中央区的对你造成伤害的牌的数量且至多为2)",
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
        const type = get.info("xin_shiyin").getType(trigger, player)[0];
        let chooseStr = "";
        switch (type) {
            case 'basic': chooseStr = "你选择一名角色，令其回复一点体力"; break;
            case 'trick': chooseStr = "你选择一名角色，令其失去一点体力"; break;
            case 'equip': chooseStr = "你选择一名角色，对其造成一点伤害"; break;
        }
        event.result = await player.chooseTarget(chooseStr).forResult();
    },
    async content(event, trigger, player) {
        const type = get.info("xin_shiyin").getType(trigger, player)[0];
        let toDo = "";
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


const xjb_zhijue = SkillCreater(
    "xjb_zhijue", {
    trigger: {
        global: "useCard"
    },
    filter: (event, player) => {
        return player.countCards("he") > 0
            && event.player != player
            && get.type2(event.card) === 'trick'
    },
    translate: "智绝",
    description: "一名其他角色使用锦囊牌时，你可以弃置一张相同点数/颜色的牌(虚拟牌则改为任意一张)，取消此牌的所有目标。该角色获得X张残【杀】(X为此牌的目标数且至少为1)",
    cost: async function (event, trigger, player) {
        const { bool } = await player.chooseToDiscard(
            card => {
                const cardx = event.getParent("useCard").card;
                if (cardx.cards.length === 0) return true;
                return get.color(card) === get.color(cardx)
                    || get.number(card) === get.number(cardx)
            },
            'he',
            "弃置一张相同点数/颜色的牌，取消此牌的所有目标。"
        ).forResult();
        event.result = { bool, cost_data: { cards: event.cards } }
    },
    content: async function (event, trigger, player) {
        const tl = Math.max(trigger.targets.length, 1)
        trigger.targets.length = 0;
        trigger.all_excluded = true;
        trigger.player.xjb_gainRemnantCard('sha', tl)
    },
})
const xjb_qiongzhi = SkillCreater(
    "xjb_qiongzhi", {
    enable: "phaseUse",
    translate: "穷智",
    description: "出牌阶段，你可令一名角色摸一张牌并跳过下一个摸牌阶段，然后其依次使用其手牌中的锦囊牌；若无锦囊牌，本回合你可以视为使用任意一张普通锦囊牌。",
    usable: 1,
    filterTarget: function (card, player, target) {
        if (!(target != player)) return false;
        return true;
    },
    content: async function (event, trigger, player) {
        await event.target.draw();
        event.target.skip("phaseDraw");
        const hs = event.target.getCards('h', card => get.type2(card) === "trick")
        for (const card of hs) {
            await event.target.chooseUseTarget(card, true);
        }
        if (hs.length === 0) player.addTempSkill("xjb_qiongzhi_useTrick")
    },
    subSkill: {
        useTrick: {
            enable: ["chooseToUse", "chooseToRespond"],
            usable: 1,
            filter: function (event, player, triggername) {
                if (!get.info("xjb_qiongzhi_useTrick").buttonRequire(player, event)) return false;
                return true;
            },
            chooseButton: {
                dialog: function (event, player) {
                    const list = [];
                    for (const i of lib.inpile) {
                        if (get.type(i, "trick") !== "trick") continue;
                        if (!event.filterCard({ name: i }, player, event)) continue;
                        list.push(["锦囊", "", i]);
                    }
                    return ui.create.dialog(get.translation("xjb_qiongzhi"), [list, 'vcard']);
                },
                backup: function (links, player) {
                    return {
                        filterCard: () => false,
                        selectCard: -1,
                        viewAs: {
                            name: links[0][2],
                        },
                    }
                },
                prompt: function (links, player) {
                    return "视为使用一张【" + get.translation(links[0][2]) + "】"
                },
            },
            buttonRequire: function (player, event) {
                const hasCardCanUse = lib.inpile.some(cardName => {
                    if (get.type(cardName) !== "trick") return false;
                    if (!event.filterCard({ name: cardName }, player, event)) return false;
                    return true;
                })
                if (!hasCardCanUse) return false;
                return true;
            },
        }
    }
})


const xjb_xianmou = SkillCreater(
    "xjb_xianmou", {
    trigger: {
        global: "judgeBegin",
        player: "phaseUseBegin"
    },
    translate: "先谋",
    description: "你的出牌阶段开始时/一张牌判定牌生效前，你可以视为一张【洞烛先机】，然后将至少两张牌置于牌堆顶。",
    content: async function (event, trigger, player) {
        await player.chooseUseTarget({ name: "dongzhuxianji", isCard: true }, true);
        const result = await player.chooseToDiscard(
            'he',
            [2, Infinity],
            '将至少两张牌置于牌堆顶',
            true,
        ).forResult();
        if (result.bool) {
            while (result.cards.length > 0) {
                ui.cardPile.insertBefore(result.cards.pop(), ui.cardPile.firstChild);
            }
            game.log(player, '将', result.cards, '置于牌堆顶');
        }
    }
})
const xjb_yinlve = SkillCreater(
    "xjb_yinlve", {
    trigger: {
        global: "judgeEnd",
    },
    translate: "隐略",
    description: "你对一名角色使用一张锦囊牌时，你可以令其获得一张同名的残牌。",
    trigger: {
        player: ["useCardEnd"],
    },
    frequent: true,
    filter: function (event, player) {
        return event.targets && event.card && get.type2(event.card) === 'trick';
    },
    content: async function (event, trigger, player) {
        for (const target of trigger.targets) {
            target.xjb_gainRemnantCard(trigger.card.name)
        }
    },
})

const xin_huzhu = SkillCreater(
    "xin_huzhu", {
    translate: "护主",
    description: "当一名其他角色指定其他角色为【杀】目标时，你可以获得一张同属性的残【杀】令其获得一个“护”",
    derivation: ["xin_huzhu2"],
    trigger: {
        global: "useCardToTargeted",
    },
    check: function (event, player) {
        return get.attitude(player, event.target) > 0 && !event.target.hasSkill('xin_huzhu2');
    },
    filter: function (event, player) {
        if (event.card.name !== 'sha') return false;
        if (event.target === player) return false;
        if (event.player === player) return false
        return true;
    },
    prompt: function (event, player) {
        return '是否对' + get.translation(event.target) + '发动〖护主〗？'
    },
    content: function () {
        player.xjb_gainRemnantCard(trigger.card, trigger.nature, 1)
        trigger.target.addTempSkill('xin_huzhu2', { player: 'dieAfter' })
        trigger.target.storage.xin_huzhu2++
    },
    ai: {
        threaten: 1.6,
    },
})
const xin_huzhu2 = SkillCreater(
    "xin_huzhu2", {
    translate: "护主",
    description: "<i>护：你可以在需要时，视为使用或打出一张【闪】。若此做，你摸一张牌并移去1个“护”。</i> ",
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
    translate: "凶力",
    description: "出牌阶段限一次，你可以对任意名其他角色造成一点随机属性伤害，若此做，你获得等量张不定属性的残【杀】。",
    selectTarget: [1, Infinity],
    filterTarget: function (card, player, target) {
        return (target != player)
    },
    usable: 1,
    content: function () {
        "step 0"
        const natureList = lib.inpile_nature.slice(0)
        natureList.push(...lib.inpile_nature.map((nature, index, natures) =>
            natures.slice(index + 1).map(i => `${nature}|${i}`)).flat())
        event.remnantNatureList = {}
        targets.forEach(targetx => {
            targetx.damage(player, natureList.randomGet())
            const nature = lib.inpile_nature.randomGet()
            event.remnantNatureList[nature] ??= 0;
            event.remnantNatureList[nature]++;
        });
        "step 1"
        for (const nature in event.remnantNatureList) {
            player.xjb_gainRemnantCard("sha", event.remnantNatureList[nature], nature)
        }
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
    translate: "谋圣",
    description: "你亮出拼点牌时，可以令拼点牌点数+X(X为游戏轮数)",
    trigger: {
        player: "compare",
        target: "compare",
    },
    filter: function (event) {
        return !event.iwhile;
    },
    forced: true,
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

const xjb_bingjie = SkillCreater(
    "xjb_bingjie", {
    translate: "秉节",
    description: "每轮开始时/你受到一点伤害后，你可以弃置任意非“留香”牌，然后你令一名角色将手牌摸至体力上限，该角色以此法获得的牌称为“留香”",
    trigger: {
        global: "roundStart",
        player: "damageEnd"
    },
    getIndex: function (event) {
        return event.num || 1;
    },
    cost: async function (event, trigger, player) {
        const { result: { bool } } = await player.chooseToDiscard([0, Infinity], "he", true, card => !card.hasGaintag("xjb_liuxiang"));
        event.result = { bool }
    },
    content: async function (event, trigger, player) {
        const { result: { targets } } = await player.chooseTarget()
            .set("prompt2", "令角色将手牌摸至体力上限");
        if (targets) {
            const { result: cards } = await targets[0].drawTo(targets[0].maxHp);
            if (cards.length) targets[0].addGaintag(cards, "xjb_liuxiang")
        }
    },
})
const xjb_liuxiang = SkillCreater(
    "xjb_liuxiang", {
    translate: "留香",
    description: "一名角色每使用或打出“留香”牌的次数大于X后，你可以令其恢复一点体力值，然后重新计算失去次数。(X为其体力值，且至少为3)",
    group: ["xjb_liuxiang_xiang", "xjb_liuxiang_aid"],
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
                global: ["respondEnd", "useCardEnd"],
            },
            forced: true,
            priority: -1,
            filter: function (event, player) {
                return event.player.hasHistory('lose', function (evt) {
                    if (evt.getParent() != event) return false;
                    for (var i in evt.gaintag_map) {
                        if (evt.gaintag_map[i].includes('xjb_liuxiang')) {
                            event.player.addMark('xjb_liuxiang_xiang', 1)
                            event.player.update()
                            return event.player.countMark('xjb_liuxiang_xiang') >= Math.max(player.hp, 3) && !event.player.isHealthy();
                        }
                    }
                    return false;
                });
            },
            content: function () {
                'step 0'
                event.target = trigger.player
                player.chooseBool('对' + get.translation(event.target) + '是否令其恢复一点体力')
                'step 1'
                if (result.bool) {
                    event.target.removeMark('xjb_liuxiang_xiang', event.target.countMark('xjb_liuxiang_xiang'));
                    event.target.recover()
                }
            },
            sub: true,
            "_priority": -100,
        },
    },
    "_priority": 0,
})

const xjb_zirou = SkillCreater(
    "xjb_ziruo", {
    translate: "自若",
    description: "当你成为其他角色的牌的目标时，你可为此牌减少任意名未横置的目标，然后这些目标横置。",
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

const xjb_huibian = SkillCreater(
    "xjb_huibian", {
    translate: "挥鞭",
    description: "结束阶段，若你还有带有伤害标签的牌，你可以摸两张牌然后额外执行一个出牌阶段。",
    trigger: {
        player: "phaseJieshuBegin"
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

const xjb_fengchu = SkillCreater(
    "xjb_fengchu", {
    translate: "凤雏",
    description: "出牌阶段限一次，你若你手牌数为奇数，你可以回复一点体力并摸一张牌;手牌数为偶数，你可以失去一点体力并摸四张牌。",
    enable: "phaseUse",
    filter: function (event, player) {
        return true;
    },
    usable: 1,
    content: function () {
        var mode = player.countCards('h') % 2
        if (mode === 0) {
            player.loseHp()
            player.draw(4)
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
const xjb_zulong = SkillCreater(
    "xjb_zulong", {
    translate: "祖龙",
    description: "每回合限一次，一名角色减少一点体力后，可以你选择获得指定种类的一个技能。若此技能为觉醒技，则无视发动条件。",
    trigger: {
        global: ["damageEnd", "loseHpEnd"],
    },
    usable: 1,
    getIndex(trigger) {
        return trigger.num || 1;
    },
    skillMap: {
        "转换技": "zhuanhuanji",
        "觉醒技": "juexingji",
        "主公技": "zhuSkill",
        "锁定技": "locked",
        "视为技": "viewAs"
    },
    frequent: true,
    content: async function (event, trigger, player) {
        const { result } = await player.chooseControl('转换技', '觉醒技', '主公技', '锁定技', '视为技')
        const skillMap = get.info("xjb_zulong").skillMap;
        const skillType = skillMap[result.control];
        player.addSkillrandom(skillType, 1);
    },
    ai: {
        threaten: 0.8
    }
});
const xjb_longwei = SkillCreater(
    "xjb_longwei", {
    translate: "龙威",
    description: "锁定技，你失去体力上限改为增加等量点体力上限,",
    trigger: {
        player: ["loseMaxHpBefore"]
    },
    forced: true,
    content: async function (event, trigger, player) {
        await player.gainMaxHp(event.num);
        trigger.cancel()
    }
})

const xjb_yiji = SkillCreater(
    "xjb_yiji", {
    translate: "遗计",
    description: "当你受到一点伤害后，你选择一名角色，其使用一张残【兵粮寸断】然后摸三张牌。",
    frequent: true,
    trigger: {
        player: ["damageAfter"],
    },
    getIndex: function (event) {
        return event.num;
    },
    cost: async function (event, trigger, player) {
        const { result: { bool, targets } } = await player.chooseTarget();
        event.result = { bool, cost_data: { targets } }
    },
    content: async function (event, trigger, player) {
        const target = event.cost_data.targets[0]
        target.draw(3)
        target.xjb_gainRemnantCard("bingliang");
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

const xjb_taoni = SkillCreater(
    "xjb_taoni", {
    translate: "讨逆",
    description: "出牌阶段限X次，你可以重铸一张牌并令一名角色横置;你对已横置的角色使用牌无次数限制。(X为你造成伤害的次数+1)",
    enable: "phaseUse",
    filterCard: (card, player) => player.canRecast(card),
    filterTarget: function (card, player, target) {
        return !target.isLinked()
    },
    position: "he",
    filter: function (event, player) {
        if (!player.countCards('he')) return false;
        if (!player.getStat().skill.xjb_taoni) return true;
        return player.getHistory("sourceDamage").length + 1 > player.getStat().skill.xjb_taoni;
    },
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
        player.recast(event.cards)
        event.target.link()
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
            player: function (player) {
                if (player.hp <= 1) return -10;
                return 2
            },
            target: function (player, target) {
                return -target.countCards('h');
            },
        },
        threaten: 2,
    },
    translate: "英发",
    description: "出牌阶段限三次，你可以失去一点体力，令一名角色失去一种类型的所有牌，你随机获得其中一张牌。",
})





const xjb_liuli = SkillCreater(
    "xjb_liuli", {
    translate: "流离",
    description: "当你受到伤害前，你可交给另一名其他角色一张♦️牌，若此做，你令伤害来源改为这名角色并令其重新分配伤害(每名角色至多1点伤害)",
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
    translate: "国色",
    description: "出牌阶段限一次，你可以选择一名判定区没有牌的角色，然后你摸X张牌(X为场上的牌数)并将其中的非♦️牌当作【乐不思蜀】对其使用。",
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
        let cards = [];
        for (let card of result) {
            if (get.suit(card) != 'diamond') cards.push(card);
        }
        if (cards.length > 0) {
            target.addJudge({ name: "lebu" }, cards);
        }
    },
})



