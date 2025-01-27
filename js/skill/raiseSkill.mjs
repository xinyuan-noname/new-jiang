import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
function SkillCreater(name, skill) {
    lib.skill[name] = { ...skill }
    delete lib.skill[name].translate;
    delete lib.skill[name].description;
    lib.translate[name] = skill.translate;
    lib.translate[name + "_info"] = skill.description
    return lib.skill[name];
};
const xjb_wei_fayi = SkillCreater(
    "xjb_wei_fayi", {
    enable: "phaseUse",
    multitarget: true,
    multiline: true,
    limited: true,
    zhuSkill: true,
    groupSkill: "wei",
    skillAnimation: true,
    animationColor: "water",
    filter: function (event, player, triggername) {
        if (player.group != "wei") return false;
        if (!player.hasZhuSkill("xjb_wei_fayi")) return false;
        if (!(game.countPlayer(cur => cur.group != "wei") > 1)) return false;
        return true;
    },
    filterTarget: function (card, player, target) {
        if (target == player) return false;
        if (!(target.group == "wei")) return false;
        return true;
    },
    selectTarget: -1,
    content: async function (event, trigger, player) {
        player.awakenSkill("xjb_wei_fayi");
        const control = await player.chooseControl("red", "black")
            .set("ai", () => ["red", "black"].randomGet())
            .forResultControl();
        player.chat("我选" + get.translation(control));
        game.log(player, "选择了", get.translation(control))
        const result = await player.chooseToDebate(event.targets)
            .set("targetColor", control)
            .set("ai", card => {
                const val = get.value(card)
                const playerx = _status.event.source;
                const target = _status.event.player;
                const filter = get.attitude(target, playerx) < 0
                    ? card => get.color(card, target) !== _status.event.getParent(2).targetColor
                    : card => get.color(card, target) === _status.event.getParent(2).targetColor
                if (filter(card)) return val + 15;
                return val * Math.random()
            })
            .set("aiCard", target => {
                const playerx = _status.event.source;
                const filter = get.attitude(target, playerx) < 0
                    ? card => get.color(card, target) !== _status.event.getParent(2).targetColor
                    : card => get.color(card, target) === _status.event.getParent(2).targetColor
                let hs = target.getCards("h", filter)
                if (!hs.length) hs = target.getCards("h")
                return { bool: true, cards: [hs.randomGet()] }
            })
            .forResult()
        const { opinion } = result;
        const color = ["red", "black"].find(item => item != control)
        if (opinion === control) {
            const maxHandCardsPlayer = game.filterPlayer().find(cur => cur.isMaxHandcard())
            await player.drawTo(maxHandCardsPlayer.countCards("h") + 1)
            if (result[color]) {
                for (const [cur, card] of result[color]) {
                    await cur.loseHp();
                }
            }
        } else {
            result[color].forEach(map => map[0].addSkill("xjb_wei_fayi_yidang"))
        }
    },
    subSkill: {
        "yidang": {
            trigger: {
                player: ["dieAfter"],
            },
            forceDie: true,
            mark: true,
            marktext: "异",
            intro: {
                name: "异党",
                content: "丞相本兴义兵，匡扶汉室，当秉忠贞之志，守谦退之节。君子爱人以德，不宜如此。"
            },
            content: function () {
                const target = game.filterPlayer().find(cur => cur.hasSkill("xjb_wei_fayi", null, false, false));
                target.restoreSkill("xjb_wei_fayi");
            },
            sub: true,
            sourceSkill: "xjb_wei_fayi",
        },
    },
    translate: "伐异",
    description: "主公技，限定技，魏势力技，出牌阶段，你可选择一种颜色,然后令所有魏势力角色议事。若结果与你选择的颜色相同，你将手牌摸至全场唯一最多（至少摸一张），令颜色不同的角色各失去一点体力；否则，你于一名颜色不同的角色死亡后重置此技能。"
})
const xjb_wei_fengtian = SkillCreater(
    "xjb_wei_fengtian", {
    enable: "phaseUse",
    zhuSkill: true,
    groupSkill: "wei",
    filter: function (event, player, triggername) {
        if (player.group != "wei") return false;
        if (!player.hasZhuSkill("xjb_wei_fengtian")) return false;
        if (!player.hasCard({ suit: "diamond" }, "he")) return false;
        return true;
    },
    filterTarget: function (card, player, target) {
        if (!(target.group != "wei")) return false;
        return true;
    },
    filterCard: function (card) {
        if (!(get.suit(card) == "diamond")) return false;
        return true;
    },
    check: card => 7 - get.value(card),
    usable: 1,
    position: "he",
    selectTarget: -1,
    async content(event, trigger, player) {
        const next = event.target.chooseControl("选项一", "选项二");
        next.set("choiceList", [
            `交给${get.translation(player)}一张牌`,
            `${get.translation(player)}本回合对你使用【杀】无距离和次数限制`
        ])
        next.set("ai", () => {
            const player = _status.event.getParent().player;
            const target = _status.event.player;
            const att = get.attitude(target, player);
            if (!target.hasCard(void 0, "he")) return "选项二"
            if (att < 0 && target.hasCard("du")) return "选项一";
            else if (att >= 0) return "选项一";
            else if (!player.inRange(target) && !target.hasCard("shan")) return "选项一";
            else if (player.countCards("h") >= target.hp + target.countCards("shan") + 2) return "选项一";
            target.ai.shown += Math.min((0.95 - target.ai.shown), 0.3)
            return "选项二";
        })
        if (!event.target.hasCard(void 0, "he")) {
            next.controls.remove('选项一')
            next.choiceList[0] = `<span style=opacity:0.5>${next.choiceList[0]}</span>`
        }
        const { control } = await next.forResult();
        console.log(event.target.name, control)
        if (control === "选项一") {
            const { cards } = await event.target.chooseCard(true, 'he', `选择一张牌交给${get.translation(player)}`)
                .set("ai", get.attitude(player, event.target) > 0 ? card => {
                    if (card.name === "sha") return get.value(card) + 2
                    return 8 - get.value(card)
                } : get.unuseful3).forResult();
            event.target.give(cards, player, false)
        }
        if (control === "选项二") {
            event.target.addTempSkill('xjb_wei_fengtian_tao')
        }
    },
    ai: {
        order: 6,
        result: {
            player: 1,
        }
    },
    mod: {
        cardUsableTarget: function (card, player, target) {
            if (target.hasSkill("xjb_wei_fengtian_tao")) return true;
        },
        targetInRange: function (card, player, target, now) {
            if (target.hasSkill("xjb_wei_fengtian_tao")) {
                if (get.name(card, player) === "sha") return true;
            }
        },
    },
    subSkill: {
        "tao": {
            mark: true,
            marktext: "讨",
            intro: {
                name: "不臣",
                content: "设使国家无有孤，不知当几人称帝，几人称王！",
            },
            sub: true,
            sourceSkill: "xjb_wei_fengtian",
        },
    },
    translate: "奉天",
    description: "主公技，魏势力技，你可以弃置一张♦牌，令所有非魏势力选择一项：1.交给你一张牌；2.你本回合对其使用【杀】无距离和次数限制。"
})
const xjb_wu_yushou = SkillCreater(
    "xjb_wu_yushou", {
    trigger: {
        global: ["useCardToTarget", "dying"],
    },
    zhuSkill: true,
    groupSkill: "wu",
    filter: function (event, player, triggername) {
        if (!player.hasZhuSkill("xjb_wu_yushou")) return false;
        if (player.group != "wu") return false;
        const target = event.name == "dying" ? event.player : event.target;
        console.log(event.name)
        if (target.group !== "wu") return false;
        if (target === player && game.countPlayer(cur => cur != player && cur.group === "wu") === 0) return false;
        return true;
    },
    async cost(event, trigger, player) {
        const target = trigger.name == "dying" ? trigger.player : trigger.target;
        const chooseEvent = player.chooseControl("选项一", "选项二", "cancel2")
        chooseEvent.set("choiceList", [
            `交给${get.translation(target)}一张牌`,
            `令其他吴势力角色依次选择是否交给${get.translation(target)}一张牌`
        ])
        chooseEvent.set("ai", () => {
            const player = _status.event.player;
            const target = _status.event.receiver;
            const att = get.attitude(player, target);
            if (att < 0) return 'cancel2';
            if (target === player) return "选项二";
            if (_status.event.dyingEvent && player.hasCard("jiu")) return "选项一";
            if (_status.event.cardName === "sha" && player.hasCard("shan") && target.countCards() < 3) return "选项一";
            if (_status.event.cardName === "juedou" && player.hasCard("juedou") && target.countCards() < 3) return "选项一";
            if (player.countCards() > player.getHandcardLimit()) return "选项一"
            return "选项二"
        })
        if (trigger.name == "dying") chooseEvent.set("dyingEvent", true)
        else if (trigger.card.name) chooseEvent.set("cardName", trigger.card.name)
        chooseEvent.set("receiver", target)
        if (target === player) {
            chooseEvent.controls.remove("选项一")
            chooseEvent.choiceList[0] = `<span style=opacity:0.5>${chooseEvent.choiceList[0]}</span>`
        }
        const { control } = await chooseEvent.forResult();
        if (control === "选项一") event.result = { bool: true, targets: [player] }
        else if (control === "选项二") event.result = { bool: true, targets: game.filterPlayer(cur => cur != player && cur.group === "wu") }
        else event.result = { bool: false }
    },
    async content(event, trigger, player) {
        const target = trigger.name == "dying" ? trigger.player : trigger.target;
        for (const helper of event.targets) {
            const { bool, cards } = await helper.chooseCard("he", `交给${get.translation(target)}一张牌`)
                .set("ai", card => {
                    const playerx = _status.event.player;
                    const targetx = _status.event.target;
                    const cardName = _status.event.cardName;
                    console.log(playerx.name, targetx.name, cardName, get.value(card), card.name)
                    if (get.attitude(playerx, targetx) <= 0) return -1000;
                    if (_status.event.dyingEvent && card.name == "jiu") return 6;
                    if (cardName === "sha" && card.name == "shan") return 6;
                    if (cardName === "juedou" && card.name == "sha") return 6;
                    if (cardName == "nanman" && card.name == "sha") return 6;
                    if (cardName == "wanjian" && card.name == "shan") return 6;
                    if (targetx.isPhaseUsing() && playerx.countCards() > 2) {
                        if (targetx.isDamaged() && card.name == "tao") return 6;
                        if (targetx.countUsed("sha") === 0 && card.name == "sha") return 6;
                        if (get.type2(card) === "trick" && card.name !== "wuxie") return 6;
                        if (targetx.countCards() < targetx.getHandcardLimit()) return 6 - get.value(card);
                    }
                    if (playerx.countCards() >= playerx.getHandcardLimit()) return 6 - get.value(card);
                    return 0;
                })
                .set("target", target)
                .set("cardName", trigger.name == "dying" ? "jiu" : trigger.card.name)
                .set("dyingEvent", trigger.name === "dying")
                .forResult()
            if (bool) {
                await helper.give(cards, target, false);
                helper.ai.shown += Math.min((0.95 - helper.ai.shown), 0.3);
            }
        }
    },
    translate: "御守",
    description: "主公技，吴势力时，一名吴势力角色成为牌的目标时/进入濒死阶段后，你可以交给其一张牌或者令其他吴势力角色依次选择是否交给其一张牌。"
})
const xjb_shu_nufa = SkillCreater(
    "xjb_shu_nufa", {
    enable: "phaseUse",
    multitarget: true,
    multiline: true,
    zhuSkill: true,
    groupSkill: "shu",
    filter: function (event, player, triggername) {
        if (!player.hasZhuSkill("xjb_shu_nufa")) return false;
        if (player.group != "shu") return false;
        return true;
    },
    filterTarget: function (card, player, target) {
        if (!(target.group == "shu")) return false;
        return true;
    },
    selectTarget: -1,
    usable: 1,
    content: async function (event, trigger, player) {
        "step 0"
        let x = 0
        let list = [];
        for (const target of event.targets) {
            const chooseEvent = target.chooseBool("是否失去一点体力？")
            chooseEvent.set("ai", () => {
                let playerx = _status.event.player;
                let launcher = _status.event.launcher;
                if (get.attitude(playerx, launcher) < 0) return false;
                if (playerx.hp < 2) return false;
                return true;
            })
            chooseEvent.set("launcher", player)
            const result = await chooseEvent.forResult()
            if (result.bool) {
                await target.loseHp(1)
                x++
            }
        }
        event.topCards = get.cards(x)
        event.bottomCards = get.bottomCards(x)
        const cards = event.topCards.concat(event.bottomCards)
        await game.cardsGotoOrdering(event.cards)
        while (cards.length !== 0) {
            const chooseEvent = player.chooseCardButton(cards, true, "怒伐:选择要分配的牌", [1, cards.length])
            chooseEvent.set("ai", () => {
                return ui.selected.buttons.legnth === 0 ? 1 : 0
            })
            const { bool, links } = await chooseEvent.forResult()
            if (bool) {
                cards.removeArray(links)
                const next = player.chooseTarget(true, "选择一名角色获得" + get.translation(links), (card, target, player) => {
                    return target.group == "shu"
                });
                const { targets } = await next.forResult();
                list.push([targets[0], links])
                targets[0].addTempSkill('xjb_shu_nufa_fa', "roundStart")
            }
        }
        game.loseAsync({
            gain_list: list,
            giver: player,
            animate: "draw"
        }).setContent("gaincardMultiple")
    },
    ai: {
        result: {
            player: 1,
        }
    },
    subSkill: {
        "fa": {
            mark: true,
            marktext: "伐",
            intro: {
                name: "怒伐",
                content: "你造成和受到的伤害均+1，直到下一轮开始时",
            },
            trigger: {
                player: ["damageBegin1"],
                source: ["damageBegin1"],
            },
            filter(event, player) {
                return event.notLink();
            },
            forced: true,
            content: function () {
                "step 0"
                trigger.num += 1
            },
            sub: true,
            sourceSkill: "xjb_shu_nufa",
        },
    },
    translate: "怒伐",
    description: "主公技，蜀势力技，出牌阶段限一次，你可以令所有蜀势力角色选择是否失去1点体力，然后展示牌堆顶和牌堆底各X张牌(X为本回合以此法失去的体力)。你须将这些牌分配给任意名蜀势力角色，获得牌的角色直到下一轮开始时，造成和受到的伤害均+1。"
})

const xjb_bingjue = SkillCreater(
    "xjb_bingjue", {
    mod: {
        cardUsable: function (card, player, num) {
            if (card.name === 'sha' && card.nature === 'ice') return Infinity;
        },
    },
    enable: "phaseUse",
    filterCard: {
        suit: "club",
    },
    selectCard: -1,
    filter: function (event, player) {
        return player.hasCard({ suit: "club" }, 'h');
    },
    delay: false,
    usable: 1,
    content: function () {
        const cardsGain = []
        for (var i = 0; i < cards.length; i++) {
            cardsGain.push(game.createCard2('sha', 'club', 1, 'ice'));
        }
        player.gain(cardsGain, "gain2")
    },
    translate: "冰诀",
    description: "出牌阶段限一次，你可弃置所有梅花手牌，然后获得等量张冰【杀♣️A】。你使用冰【杀】无次数限制。",
})
const xjb_hanhua = SkillCreater(
    "xjb_hanhua", {
    trigger: {
        target: ["useCardToTargeted"],
    },
    filter: function (event, player, triggername) {
        if (!(get.nature(event.card) != "ice"
            || get.name(event.card) != "sha")) return false;
        if (event.name === 'useCardToTargeted' && !["club"].includes(get.suit(event.card))) return false;
        return true;
    },
    content: function () {
        "step 0"
        trigger.cards[0].fix();
        trigger.cards[0].remove();
        trigger.cards[0].destroyed = true;
        game.log(trigger.cards[0], "已销毁");
        var card = game.createCard2("sha", "club", 1, "ice");
        player.gain(card, 'gain2')
        "step 1"
        trigger.getParent("useCard", void 0, true).targets.length = 0;
        trigger.getParent("useCard", void 0, true).all_excluded = true;
    },
    ai: {
        effect: {
            target(card) {
                if (get.suit(card) === "club") return "zeroplayertarget"
            }
        }
    },
    translate: "寒花",
    description: "当你成为梅花牌的目标后，你可以将此牌变为冰【杀♣A】并获得之，然后你取消此牌的所有目标。"
})
const xjb_jinghua = SkillCreater(
    "xjb_jinghua", {
    enable: "phaseUse",
    filterCard: function (card) {
        return get.suit(card) !== "club";
    },
    filter: function (event, player) {
        return player.hasCard(card => get.suit(card) !== 'club', 'he');
    },
    position: "he",
    lose: false,
    discard: false,
    delay: false,
    usable: 3,
    content: function () {
        var card = cards[0]
        var cardx = game.createCard2(card.name, 'club', card.number, card.nature);
        player.gain(cardx)
    },
    translate: "镜花",
    description: "出牌阶段限三次，你可以选择一张非梅花牌并复制之（花色改为♣）。",
})
const xjb_bingdi = SkillCreater(
    'xjb_bingdi', {
    trigger: {
        player: ["useCard"],
    },
    forced: true,
    filter: function (event, player, triggername) {
        if (!(get.suit(event.card) == "club")) return false;
        return true;
    },
    content: function () {
        "step 0"
        trigger.getParent("useCard", void 0, true).effectCount += 1;
    },
    translate: "并蒂",
    description: "锁定技，当你使用梅花牌时，你可令此牌额外结算一次。"
})



const xjb_leijue = SkillCreater(
    "xjb_leijue", {
    translate: "雷诀",
    description: "出牌阶段，你可以弃置一张黑桃牌，然后对一名角色造成1点雷属性伤害。",
    enable: "phaseUse",
    filterCard: {
        suit: "spade",
    },
    filter: function (event, player) {
        return player.hasCard({suit:"spade"},"he")
    },
    filterTarget: true,
    content: function () {
        target.damage('thunder');
    },
})
const xjb_tianfa = SkillCreater(
    "xjb_leijue", {
    translate: "天罚",
    description: "限定技，你可以令一名角色进行一次【天谴】判定。",
    enable: "phaseUse",
    filterCard: {
        suit: "spade",
    },
    filter: function (event, player) {
        return true
    },
    filterTarget: true,
    content: function () {
        target.damage('thunder');
    },
    "_priority": 0,
})

const xjb_huojue = SkillCreater(
    "xjb_huojue", {
    translate: "火诀",
    description: "每回合限一次，当一名角色使用武将牌上的技能时，你可以令其失去该技能并对其造成1点火属性伤害。",
    trigger: {
        global: ["logSkill", "useSkillAfter"],
    },
    filter: function (event, player) {
        let skillname = (event.sourceSkill || event.skill)
        let thierSkills = event.player.getStockSkills(true, true)
        if (!skillname) return false;
        if (!thierSkills.includes(skillname)) return false;
        if (player != event.player) return true;
    },
    cost: async function (event, trigger, player) {
        const skill = trigger.sourceSkill || trigger.skill;
        event.result = await player.chooseBool(get.prompt("xjb_huojue"), "令" + get.translation(trigger.player) + "失去技能【" + get.translation(skill) + "】并受到1点火属性伤害").forResult()
    },
    usable: 1,
    content: async function (event, trigger, player) {
        trigger.player.removeSkill((trigger.sourceSkill || trigger.skill))
        trigger.player.damage("fire", player)
    },
})
const xjb_pomie = SkillCreater(
    "xjb_pomie", {
    translate: "破灭",
    description: "当你令一名角色进入濒死阶段时，你可以选择获得其武将牌上的一个技能，若此时你有空余的技能槽，则将该技能添加到养成武将的武将牌上。",
    trigger: {
        source: "dying",
    },
    filter: function (event, player) {
        let skillsList = []
        for (const skillName of event.player.getStockSkills(true, true)) {
            if (!lib.config.xjb_newcharacter.skill.includes(skillName)) {
                skillsList.add(skillName)
            }
        }
        if (skillsList.length) return true
    },
    cost: async function (event, trigger, player) {
        let skillsList = []
        for (const skillName of trigger.player.getStockSkills(true, true)) {
            if (!lib.config.xjb_newcharacter.skill.includes(skillName)) {
                skillsList.add(skillName)
            }
        }
        const { control } = await player.chooseControl([...skillsList, 'cancel2'])
            .set("choiceList", skillsList.map(skill => `【${get.translation(skill)}】${lib.translate[skill + '_info']}`))
            .forResult()
        if (control in lib.skill) event.result = { bool: true, cost_data: control }
    },
    content: async function (event, trigger, player) {
        player.addSkillLog(event.cost_data)
        if (game.xjb_condition(3, 1) && player === game.me) {
            lib.config.xjb_newcharacter.skill.add(result.control)
            game.saveConfig("xjb_newcharacter", lib.config.xjb_newcharacter)
        }
    }
})

const xjb_juanqu = SkillCreater(
    "xjb_juanqu", {
    enable: "phaseUse",
    round: 1,
    filterTarget: function (card, player, target) {
        return target != player
    },
    async content(event, trigger, player) {
        await player.draw(2);
        await player.loseHp();
        event.target.insetPhase();
    },
    ai: {
        result: {
            target: (player, target) => {
                return target.countCards("h")
            },
            player: player => {
                return get.effect(player, { name: "loseHp" }, player, player)
            }
        }
    },
    translate: "捐躯",
    description: "出牌阶段限一次，你可以失去一点体力,然后令一名其它角色摸两张牌并额外进行一个回合。",
})

