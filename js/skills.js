import {
    element
} from './ui.js'
window.XJB_LOAD_SKILLS = function (_status, lib, game, ui, get, ai) {
    /**
     * 
     * @param {String} name 技能名
     * @param {Object} skill 技能对象
     */
    function SkillCreater(name, skill) {
        lib.skill[name] = { ...skill }
        delete lib.skill[name].translate;
        delete lib.skill[name].description;
        lib.translate[name] = skill.translate;
        lib.translate[name + "_info"] = skill.description
        return lib.skill[name];
    };
    lib.skill.xjb_3 = {
        Translate: function () {
            lib.translate.fuSkill = "<b description=福技：首次使用此技能恢复体力并加一点护甲>福技</b>"
            lib.translate.luSkill = "<b description=禄技：首次使用此技能摸四张牌>禄技</b>"
            lib.translate.shouSkill = "<b description=寿技：首次使用此技能加两点体力上限>寿技</b>"
            lib.translate.suidongSkill = "<b description=随动技：因为此技能效果获得牌后可以立即使用该牌>随动技</b>"
            lib.translate.qzj = "<b description=强制技：技能结算后,此技能指定的目标角色当前回合失去技能>强制技</b>"
            lib.translate.queqiaoxian = "<b description=鹊桥仙：技能结算后,可令一名珠联璧合的异性角色额外结算一次>鹊桥仙</b>"
            lib.translate.xin_qinnang2 = '青囊'
            lib.translate.xin_xuming = '续命'
            lib.translate._xjb_huobi = "货币"
            lib.translate.xin_qinnang2_info = '出牌阶段限一次，你可对一名角色使用任意张【桃】，你以此法你每使用一张【桃】，你和其各摸一张牌。'
            lib.translate.lunaticMasochist = "疼痛敏感"
            lib.translate.lunaticMasochist_info = "你弃牌、失去体力、恢复体力、失去体力上限、恢复体力上限、装备装备牌均视为受到伤害。"
        },
        skillTag: function () {
            //随动技附魔
            lib.skill._xjb_suidongSkill = {
                trigger: {
                    player: ["gainEnd", "drawEnd"]
                },
                direct: true,
                filter: function (event, player) {
                    if (!event.cards) return false;
                    if (!lib.config.xjb_skillTag_Character) return false;
                    for (let i = 1; i < 9; i++) {
                        let theName = event.getParent(i) && event.getParent(i).name;
                        if (Object.keys(lib.skill).includes(theName)) {
                            if (lib.skill[theName].suidongSkill === true) return true
                        }
                    }//遍历父事件是否为随动技               
                    return false
                },
                content: function () {
                    "step 0"
                    player.chooseUseTarget(trigger.cards[0])//选择使用该牌
                }
            }
            //福技 禄技 寿技 附魔
            lib.skill._xjb_fulushouSkill = {
                trigger: {
                    player: "logSkill"
                },
                filter: function (event, player) {
                    if (!event.sourceSkill) return false
                    if (!lib.config.xjb_skillTag_Character) return false
                    if (!lib.config.xjb_skillTag_Character.includes(player.name1)
                        && !lib.config.xjb_skillTag_Character.includes(player.name2)) return false
                    return true
                },
                direct: true,
                content: function () {
                    if (!player.storage.skillTag_container) {
                        player.storage.skillTag_container = {
                            fuSkill: [],
                            luSkill: [],
                            shouSkill: [],
                        }
                    }
                    if (lib.skill[trigger.sourceSkill].fuSkill
                        && !player.storage.skillTag_container.fuSkill.includes(trigger.sourceSkill)) {
                        player.recover()
                        player.changeHujia()
                        player.popup("福技")
                        player.storage.skillTag_container.fuSkill.add(trigger.sourceSkill)
                    }
                    if (lib.skill[trigger.sourceSkill].luSkill
                        && !player.storage.skillTag_container.luSkill.includes(trigger.sourceSkill)) {
                        player.draw(4)
                        player.popup("禄技")
                        player.storage.skillTag_container.luSkill.add(trigger.sourceSkill)
                    }
                    if (lib.skill[trigger.sourceSkill].shouSkill
                        && !player.storage.skillTag_container.shouSkill.includes(trigger.sourceSkill)) {
                        player.gainMaxHp(2)
                        player.popup("寿技")
                        player.storage.skillTag_container.shouSkill.add(trigger.sourceSkill)
                    }
                }
            }
            //强制技附魔
            lib.skill._xjb_qzj = {
                trigger: {
                    player: "useSkillAfter"
                },
                filter: function (event, player) {
                    if (!event.targets) return false
                    if (!event.targets.length) return false
                    if (!event.skill) return false
                    if (!lib.skill[event.skill].qzj) return false
                    return true
                },
                direct: true,
                content: function () {
                    for (let i = 0; i < trigger.targets.length; i++) {
                        trigger.targets[i].addTempSkill('skill_noskill')
                        trigger.targets[i].popup("强制技")
                    }
                }
            }
            lib.skill._xjb_queqiaoxian = {
                trigger: {
                    player: "useSkillAfter"
                },
                filter(event, player) {
                    if (!event.skill) return false;
                    if (event.reason === "xjb_queqiaoxian") return false;
                    if (!lib.skill[event.skill].queqiaoxian) return false;
                    const info = get.info("_xjb_queqiaoxian");
                    const osPairs = info.getCP(player, event.skill)
                    if (!osPairs.length) return false;
                    if (!game.countPlayer(
                        cur => osPairs.some(character => `${cur.name1}`.endsWith(character) || `${cur.name2}`.endsWith(character))
                    )) return false;
                    if (!event.targets || event.targets.some(cur => cur.isDead())) return false;
                    return true;
                },
                whoseSkill(player, skill) {
                    const result = []
                    if (lib.character[player.name1] && game.expandSkills(lib.character[player.name1].skills).includes(skill)) result.push(player.name1);
                    if (lib.character[player.name2] && game.expandSkills(lib.character[player.name2].skills).includes(skill)) result.push(player.name2);
                    return result;
                },
                getPefectPair(characterName = '', characterName2 = '') {
                    const result = [];
                    for (let one in lib.perfectPair) {
                        if (characterName.endsWith(one)) {
                            result.push(...lib.perfectPair[one]);
                        }
                        if (lib.perfectPair[one].some(pair => characterName.endsWith(pair))) {
                            result.push(one)
                        }
                        if (characterName2.endsWith(one)) {
                            result.push(...lib.perfectPair[one]);
                        }
                        if (lib.perfectPair[one].some(pair => characterName2.endsWith(pair))) {
                            result.push(one)
                        }
                    }
                    return result;
                },
                filterCharacterNotSameSex(player, characterList, names = []) {
                    let sex
                    const name1 = names[0], name2 = names[1]
                    if (typeof player === 'string') sex = lib.character[player].sex;
                    else if (!player.name2) sex = player.sex;
                    else if (names.length === 1) sex = lib.character[name1].sex;
                    else if (names.length === 2) {
                        if (lib.character[name2].sex === lib.character[name1].sex) sex = player.sex;
                        else sex = "double";
                    }
                    return characterList.filter(
                        characterName => {
                            if (lib.character[characterName]) return sex != lib.character[characterName].sex
                        }
                    )
                },
                getCP(player, skill) {
                    const info = get.info("_xjb_queqiaoxian");
                    const names = typeof player === 'string' ? [player] : info.whoseSkill(player, skill);
                    const allPairs = info.getPefectPair(...names);
                    const osPairs = info.filterCharacterNotSameSex(player, allPairs, names);
                    function removeGUICHUN(guichun1, guichun2) {
                        if (names.some(name => name.endsWith(guichun1))) {
                            osPairs.remove(guichun2)
                        }
                        if (names.some(name => name.endsWith(guichun2))) {
                            osPairs.remove(guichun1)
                        }
                    }
                    removeGUICHUN("mayunlu", 'machao');
                    removeGUICHUN("mayunlu", 'mateng');
                    removeGUICHUN("zhanglu", 'zhangqiying');
                    removeGUICHUN("guanyinping", 'guanyu');
                    removeGUICHUN("zhouyu", 'zhouyi');
                    removeGUICHUN("wujing", "wuguotai");
                    removeGUICHUN("fuwan", "fuhuanghou");
                    removeGUICHUN("lvlingqi", "lvbu");
                    return osPairs;
                },
                direct: true,
                content() {
                    "step 0"
                    player.popup("鹊桥仙");
                    "step 1"
                    player.chooseTarget("鹊桥仙", `是否令为有姻缘的珠联璧合角色额外结算一次${get.translation(trigger.skill)}?`)
                        .set("filterTarget", function (card, player, target) {
                            const info = get.info("_xjb_queqiaoxian");
                            const osPairs = info.getCP(player, trigger.skill)
                            return osPairs.some(character => (`${target.name1}`).endsWith(character) || (`${target.name2}`).endsWith(character))
                        })
                    "step 2"
                    if (result.bool) {
                        result.targets[0].useSkill(trigger.skill, trigger.targets, trigger.cards)
                            .set("reason", "xjb_queqiaoxian");
                    }
                }
            }
            lib.skill._xjb_queqiaoxian2 = {
                trigger: {
                    player: ["logSkill"]
                },
                filter(event, player) {
                    if (!event.sourceSkill) return false;
                    if (!lib.skill[event.sourceSkill].queqiaoxian) return false;
                    if (!lib.skill[event.skill].content) return false;
                    const info = get.info("_xjb_queqiaoxian");
                    const osPairs = info.getCP(player, event.sourceSkill);
                    if (!osPairs.length) return false;
                    if (!game.countPlayer(
                        cur => osPairs.some(character => `${cur.name1}`.endsWith(character) || `${cur.name2}`.endsWith(character))
                    )) return false;
                    const skillEvt = lib.skill[event.skill].direct ?
                        event.getParent(event.skill) :
                        event.player.getHistory("useSkill", evt => evt.skill === event.skill).at(-1).event;
                    if (skillEvt.reason === "xjb_queqiaoxian") return false;
                    const playerList = [];
                    if (skillEvt.player) playerList.push(skillEvt.player)
                    if (skillEvt.targets) playerList.push(...skillEvt.targets)
                    if (skillEvt._trigger.source) playerList.push(skillEvt._trigger.source);
                    if (skillEvt._trigger.targets) playerList.push(...skillEvt._trigger.targets);
                    if (playerList.some(cur => cur.isDead())) return false;
                    return true;
                },
                direct: true,
                async content(event, trigger, player) {
                    player.popup("鹊桥仙");
                    const result = await player.chooseTarget("鹊桥仙", `是否令有姻缘的珠联璧合角色额外结算一次${get.translation(trigger.sourceSkill)}?`)
                        .set("filterTarget", function (card, player, target) {
                            const info = get.info("_xjb_queqiaoxian");
                            const osPairs = info.getCP(player, trigger.sourceSkill)
                            return osPairs.some(character => (`${target.name1}`).endsWith(character) || (`${target.name2}`).endsWith(character))
                        }).forResult();
                    if (result.bool) {
                        const skill = trigger.skill;
                        const info = get.info(skill);
                        const skillEvt = info.direct ?
                            trigger.getParent(trigger.skill) : trigger.player.getHistory("useSkill", evt => evt.skill === trigger.skill).at(-1).event;
                        const next = game.createEvent(skill);
                        if (typeof info.usable == "number") {
                            result.targets[0].addSkill("counttrigger");
                            if (!result.targets[0].storage.counttrigger) result.targets[0].storage.counttrigger = {};
                            if (!result.targets[0].storage.counttrigger[skill]) result.targets[0].storage.counttrigger[skill] = 1;
                            else result.targets[0].storage.counttrigger[skill]++;
                        }
                        next.player = result.targets[0];
                        next._trigger = skillEvt._trigger;
                        next.triggername = skillEvt.triggername;
                        next.setContent(info.content);
                        next.skillHidden = skillEvt.skillHidden;
                        if (info.forceOut) next.includeOut = true;
                        if (get.itemtype(skillEvt.targets) == "players") next.targets = skillEvt.targets.slice(0);
                        if (get.itemtype(skillEvt.cards) === "cards") next.cards = skillEvt.cards.slice(0);
                        if ("cost_data" in skillEvt) next.cost_data = skillEvt.cost_data;
                        next.indexedData = skillEvt.indexedData;
                        next.reason = 'xjb_queqiaoxian'
                    }
                }
            }
        },
        raiseSkill: function () {
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
        },
        soulSkill: function () {
            lib.skill.xjb_redSkill = {
                init: function (player, skill) {
                    player.die = function () {
                        if (!(player == game.me || player.isUnderControl())) {
                            player.revive(player.maxHp)
                            player.update()
                        } else {
                            game.pause()
                            game.xjb_create.confirm("【玩家死亡，是否复活？】", function () {
                                if (!lib.config.xjb_redSkill.dieTimes) { lib.config.xjb_redSkill.dieTimes = 0 }
                                lib.config.xjb_redSkill.dieTimes++
                                game.saveConfig("xjb_redSkill", lib.config.xjb_redSkill)
                                player.revive(player.maxHp)
                                player.update()
                                game.resume()
                            }, function () {
                                var target = lib.config["xjb_redSkill"], length = Object.keys(lib.config['xjb_redSkill'].skill).length
                                target.skill[length] = {}
                                target.skill[length].list = target.list
                                target.skill[length].translate = target.translate
                                target.list = []
                                target.translate = {}
                                game.saveConfig('xjb_redSkill', lib.config[skill])
                                lib.element.player.die.apply(player, [])
                                game.resume()
                            })
                        }
                    }
                },
                trigger: {
                    global: ["logSkill", "useSkillAfter"],
                },
                baned: lib.xjb_list_xinyuan.skills.red.concat(
                    "rehuashen"
                ),
                filter: function (event, player) {
                    if (event.player === player) return false
                    let skill = event.sourceSkill || event.skill
                    return !!skill && lib.skill[skill].equipSkill == undefined && skill[0] != "_"
                },
                forced: true,
                content: function () {
                    let skill = "xjb_redSkill"
                    let _get = trigger.sourceSkill || trigger.skill
                    if (lib.skill[skill][_get] == undefined) lib.skill[skill][_get] = 0
                    if (lib.skill[skill][_get] < 20) { lib.skill[skill][_get] += 10 }
                    else if (lib.skill[skill][_get] < 30) { lib.skill[skill][_get] += 5 }
                    else if (lib.skill[skill][_get] < 100) { lib.skill[skill][_get] += 1 }
                    var theNumber = lib.skill[skill][_get] / 1000
                    if (Math.random() < theNumber) {
                        let toget = event.name + "_" + _get
                        if (!player.hasSkill(toget) && !["rehuashen"].includes(_get)) {
                            lib.config[skill].list.add(toget)
                            lib.config[skill].translate[toget] = lib.translate[_get]
                            lib.config[skill].translate[toget + "_info"] = lib.translate[_get + "_info"]
                            game.saveConfig(skill, lib.config[skill])
                            game.updateRed()
                            player.addSkillLog(toget)
                            if (player == game.me) game.xjb_create.alert(`【系统提示：发现技能"${get.translation(toget)}"，已记录在技能目录中】`)
                        }
                    }

                },
            };
            //以下是恩赐    
            lib.skill.xjb_juanqu = {
                enable: "phaseUse",
                round: 1,
                filter: function (event, player) {
                    return player.group == "shen"
                },
                filterTarget: function (card, player, target) {
                    return target != player
                },
                async content(event, trigger, player) {
                    target.draw(10)
                    player.changeGroup("shen");
                },
                mark: true,
            }
            lib.translate.xjb_juanqu = "恩赐"
            lib.translate.xjb_juanqu_info = "每轮限一次，若你为神势力，你可以令一名角色摸十张牌并将势力改为神势力。"
            lib.skill.xjb_huojue = {
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
            }
            lib.translate.xjb_huojue = "火诀"
            lib.translate.xjb_huojue_info = "每回合限一次，当一名角色使用武将牌上的技能时，你可以令其失去该技能并对其造成1点火属性伤害。"
            lib.skill.xjb_pomie = {
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
            }
            lib.translate.xjb_pomie = "破灭"
            lib.translate.xjb_pomie_info = "当你令一名角色进入濒死阶段时，你可以选择获得其武将牌上的一个技能，若此时你有空余的技能槽，则将该技能添加到养成武将的武将牌上。"
        },
        SanSkill: function () {
            //疼痛敏感
            lib.skill.lunaticMasochist = {
                trigger: {
                    player: ["equipBefore", "discardBefore", "loseHpBefore", "recoverBefore", "loseMaxHpBefore", "gainMaxHpBefore"]
                },
                forced: true,
                content: function () {
                    trigger.set("name", "damage")
                    if (!trigger.num) trigger.num = 1
                }
            }
        },
        "xjb_theCardSkill": function () {
            //以下是诸葛亮装备
            //1.装备技能:续命
            lib.skill.xin_xuming = {
                trigger: {
                    global: "dying",
                },
                frequent: true,
                content: function () {
                    "step 0"
                    var list0 = []
                    if (player.getExpansions('qixing').length > 0) list0.push('弃置一颗"星"，令其恢复1点体力')
                    list0.push('使用一张【奇门遁甲】')
                    if (list0.length > 0) event.list0 = list0
                    "step 1"
                    player.chooseControl(event.list0).set('prompt', '续命:选择一项执行之').set('ai', function () {
                        if (get.attitude(player, trigger.player) > 0) return '弃置一颗"星"，令其恢复1点体力'
                        return '使用一张【奇门遁甲】';
                    })
                    "step 2"
                    if (result.control == '使用一张【奇门遁甲】') {
                        player.chooseUseTarget(game.createCard('xjb_qimendunjia'), true)
                        event.finish();
                    }
                    else {
                        var card = player.getExpansions('qixing').slice(-1)
                        player.loseToDiscardpile(card);
                        trigger.player.recover()
                    }
                }
            }
            /*以上是诸葛亮装备技能*/
            //1.装备技能:偃月
            lib.skill.xin_yanyue = {
                equipSkill: true,
                trigger: {
                    source: "damageBegin2",
                },
                filter: function (event, player) {
                    return player.countCards("he") > 1
                },
                check: function (event, player) {
                    return get.attitude(player, event.target) < 0;
                },
                content: function () {
                    player.chooseToDiscard(2, true, "he", "弃置两张牌令此伤害+1")
                    trigger.num++
                    trigger.player.addMark('new_wuhun_mark', 1);
                },
            }
            lib.translate.xin_yanyue = '偃月'
            //2.装备技能:追魂
            lib.skill.xin_zhuihun = {
                equipSkill: true,
                trigger: {
                    player: "damageEnd",
                },
                forced: true,
                check: function (event, player) {
                    return get.attitude(player, event.source) < 0;
                },
                content: function () {
                    if (trigger.source.countCards('h') > 0) trigger.source.chooseToDiscard('h', 1, true)
                    if (trigger.source) trigger.source.addMark('new_wuhun_mark', 1)
                    player.insertPhase();
                },
            }
            lib.translate.xin_zhuihun = '追魂'
            //3.装备延伸技能:武圣
            lib.skill.xin_hlyyd = {
                mod: {
                    cardUsableTarget: function (card, player, target) {
                        if (target.hasMark('new_wuhun_mark')) return true;
                    },
                },
                locked: false,
                enable: ["chooseToRespond", "chooseToUse"],
                filterCard: function (card, player) {
                    if (get.zhu(player, 'shouyue')) return true;
                    return get.color(card) == 'red';
                },
                position: "hes",
                viewAs: {
                    name: "sha",
                },
                viewAsFilter: function (player) {
                    if (get.zhu(player, 'shouyue')) {
                        if (!player.countCards('hes')) return false;
                    }
                    else {
                        if (!player.countCards('hes', { color: 'red' })) return false;
                    }
                },
                onuse: function (event, player) {
                    if (player.countCards("h") == 1) player.seekTag('damage')
                },
                prompt: "将一张红色牌当杀使用或打出",
                check: function (card) {
                    var val = get.value(card);
                    if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                    return 5 - val;
                },
            }
            lib.translate.xin_hlyyd = "武圣"
            lib.translate.xin_hlyyd_info = "你可以将一张红色牌当做【杀】使用或打出，你以此法使用或打出最后手牌时，你从牌堆中获得一张带伤害标签的牌。你对有“梦魇”标记的角色使用牌无次数限制。"
            lib.skill.xin_qinnang2 = {
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards('h', 'tao') > 0 || (player.hasSkill('xin_qns') && player.countCards('hes', { color: 'red' }) > 0);
                },
                filterTarget: function (card, player, target) {
                    return target.hp < target.maxHp;
                },
                content: function () {
                    "step 0"
                    player.chooseToUse('使用一张桃', { name: 'tao' }, true, function (card, player, target) {
                        if (targets[0] == target) return true;
                        return false;
                    });
                    game.asyncDraw([target, player]);
                    "step 1"
                    if (player.countCards('h', 'tao') > 0 || (player.hasSkill('xin_qns') && player.countCards('hes', { color: 'red' }))) {
                        if (targets[0].hp < targets[0].maxHp) player.chooseBool('是否继续出【桃】');
                    } else event.finish()
                    "step 2"
                    if (result.bool) {
                        if (player.countCards('h', 'tao') > 0 || (player.hasSkill('xin_qns') && player.countCards('hes', { color: 'red' }))) {
                            if (targets[0].hp < targets[0].maxHp) event.goto(0);
                        }
                    }
                },
                ai: {
                    order: 4.5,
                    result: {
                        target: function (player, target) {
                            if (target.hp == 1) return 5;
                            if (player == target && player.countCards('h') > player.hp) return 5;
                            return 2;
                        },
                    },
                    threaten: 3,
                },
            }
            //以下是马超装备
            //1.装备技能:狮怒
            lib.skill.xin_shinu = {
                equipSkill: true,
                trigger: {
                    player: "damageBegin2",
                },
                filter: function (event, player) {
                    return event.source
                },
                content: function () {
                    'step 0'
                    trigger.source.damage(trigger.num)
                    'step 1'
                    if (player.hp <= 1) {
                        trigger.cancel()
                        var s = player.getCards('e', { subtype: 'equip2' });
                        player.lose(s, ui.cardPile);
                    }
                },
            }
            lib.translate.xin_shinu = '狮怒'
        },
        Strategy: function () {
            //触屏即杀相应效果
            SkillCreater(
                "xjb_updateStrategy", {
                enable: "phaseUse",
                content: function () {
                    player.update()
                },
                translate: '策略更新'
            });
            SkillCreater(
                "_xjb_skillsNumberLimitation", {
                trigger: {
                    player: "phaseBefore"
                },
                forced: true,
                filter(event, player) {
                    const skills = player.skills.filter(i => {
                        if (!lib.skill[i]) return false;
                        if (lib.skill[i].equipSkill) return false;
                        if (Object.keys(player.tempSkills).includes(i)) return false;
                        return true;
                    });
                    event.skillsLength = skills.length
                    if (skills.length > 6 && lib.config.xjb_skillsNumberLimitation === 1) return true;
                },
                content() {
                    player.xjb_chooseSkillToCard((trigger.skillsLength - 6));
                },
                translate: '技能数限制',
                description: '回合开始前,若当前回合角色技能数超过6,其选择一项技能并将其转化为技能牌。其重复此流程，直到技能数为6。'
            })
            SkillCreater(
                "_xjb_maxHpLimitation", {
                trigger: {
                    player: "phaseBefore"
                },
                forced: true,
                filter(event, player) {
                    if (player.maxHp > 15 && lib.config.xjb_maxHpLimitation === 1) return true
                },
                content() {
                    if (player.hp === Infinity) {
                        player.hp = 15;
                        player.update();
                    }
                    var x = Math.ceil(player.maxHp / 15)
                    player.chooseLoseHpMaxHp([x, x], '选择一项执行！');
                },
                translate: '体力上限限制',
            });
        },
        rpg: function () {
            SkillCreater(
                'xjb_phaseReplaceGuessNumber', {
                trigger: {
                    player: 'phaseBefore'
                },
                forced: true,
                direct: true,
                content() {
                    'step 0'
                    event.level = _status.xjb_level;
                    if (game.players.length < 4 && game.me.isAlive()) {
                        const number = _status.xjb_level.xjb_chip * 5
                        game.xjb_create.alert('恭喜你坚持到了最后!你可以获得奖励' + number + '个魂币', function () {
                            if (number) game.xjb_getHunbi(number, void 0, true, false, '游戏');
                        })
                        game.over(true);
                        event.finish();
                        game.resume();
                    };
                    trigger.cancel();
                    'step 1'
                    if (player === game.me) {
                        game.pause();
                        game.xjb_create.prompt('输入一个介于' + event.level.min + '到' + event.level.max + '间的一个数', '', function () {
                            const input = Number(this.result)
                            if (input > event.level.max || input < event.level.min || Math.floor(input) !== input) {
                                game.xjb_create.alert('不是有效的数字,请重新输入', function () {
                                    event.redo();
                                    game.resume();
                                });
                            } else {
                                event.input = input;
                                game.resume();
                            }
                        }, function () {
                            event.redo();
                            game.resume();
                        })
                    } else {
                        game.pause();
                        setTimeout(function () {
                            event.input = lib._xjb['randomInt'](_status.xjb_level.min, _status.xjb_level.max)
                            game.resume();
                        }, 1000)
                    };
                    'step 2'
                    player.popup(event.input)
                    game.pause();
                    setTimeout(function () {
                        game.resume();
                    }, 1000)
                    'step 3'
                    if (event.input === event.level.guessNumber) {
                        player.damage(player.hp);
                        _status.xjb_level.guessNumber = Math.floor(Math.random() * 1000)
                        _status.xjb_level.min = 0;
                        _status.xjb_level.max = 999;
                    } else if (event.input < event.level.guessNumber) {
                        _status.xjb_level.min = event.input + 1;
                        player.popup('小了')
                    } else if (event.input > event.level.guessNumber) {
                        _status.xjb_level.max = event.input - 1;
                        player.popup('大了')
                    }
                    'step 4'
                    if (game.players.length < 4 && game.me.isAlive()) {
                        const number = _status.xjb_level.xjb_chip * 5
                        game.xjb_create.alert('恭喜你坚持到了最后!你可以获得奖励' + number + '个魂币', function () {
                            if (number) game.xjb_getHunbi(number, void 0, true, false, '游戏');
                            game.over(true);
                        })
                        event.finish();
                    };
                    trigger.cancel();
                }
            }
            )
        },
        project: function () {
            //变身标记
            lib.skill._xin_bianshen = {
                marktext: "变",
                intro: {
                    name: "变",
                    content: "已变身",
                },
            }
            //金币银币
            lib.skill._xjb_huobi = {
                trigger: {
                    player: ["useCardAfter", "respondAfter", "damageAfter"],
                },
                priority: -1,
                direct: true,
                num1: 0,
                num2: 0,
                num: 0,
                filter: function (event, player) {
                    return lib.config.xjb_hun;
                },
                content: function () {
                    if (trigger.card && trigger.card.number) {
                        lib.skill._xjb_huobi.num += trigger.card.number
                        lib.skill._xjb_huobi.num1 += trigger.card.number
                        lib.skill._xjb_huobi.num2 += trigger.card.number
                    } else {
                        lib.skill._xjb_huobi.num += trigger.num * 5
                        lib.skill._xjb_huobi.num1 += trigger.num * 5
                        lib.skill._xjb_huobi.num2 += trigger.num * 5
                    }
                    if (lib.skill._xjb_huobi.num1 > 500) {
                        lib.skill._xjb_huobi.num1 = 0
                        var card = game.createCard2("xjb_tianming_huobi1", "black", 13)
                        card.storage.xjb_allowed = true;
                        ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                    }
                    if (lib.skill._xjb_huobi.num2 > 1500) {
                        lib.skill._xjb_huobi.num2 = 0
                        var card = game.createCard2("xjb_tianming_huobi2", "red", 1)
                        card.storage.xjb_allowed = true;
                        ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                    }
                }
            }
        },
        uniqueSkill: function () {
            //游戏初始化
            lib.skill._xjb_tianxing = {
                trigger: {
                    global: ["gameStart"],
                },
                popup: false,
                forced: true,
                superCharlotte: true,
                charlotte: true,
                fixed: true,
                filter: function (event, player) {
                    return player === game.me
                },
                content: function () {
                    //背景原画设置
                    game.xjb_PreBackImage = window.getComputedStyle(ui.background).backgroundImage;
                    //
                    game.players.forEach(function (current) {
                        //灵力设置
                        player.storage.xjb_daomoMax = 1
                        //建X_skill区，[0]代表执行项目，[1]代表角色数目，[2]代表执行次数，[3]代表禁止武将，[4]代表限制条件，[5]修改其他五区，[6]控制[5]区(套娃)        
                        current.storage._skill_xin_X = [1, 1, 1, [], [], [], []]
                        current.storage.xjb_card_allow = {}
                        current.noskill = {}
                        current.noskill_translate = {}
                    })
                    //牌堆设置
                    if (game.xjb_getCardToAdd) {
                        let cards = game.xjb_getCardToAdd();
                        cards.forEach(i => {
                            for (let a = 0; a < i[3]; a++) {
                                game.xjb_cardAddToCardPile(i.slice(0, 3))
                            }
                        })
                    }
                    //触屏即杀设置
                    game.xjb_cpjsLoad();
                    game.xjb_cpjsRemove();
                },
            }
            //判定反转
            SkillCreater(
                "xjb_JudgeReversal", {
                mod: {
                    judge: function (player, result) {
                        if (result.bool == false) result.bool = true;
                        else result.bool = false
                    }
                },
                translate: '判定反转',
                description: "你的延时锦囊牌判定结果反转"
            })
            //强制技效果
            SkillCreater(
                "skill_noskill", {
                init: function (player, skills) {
                    var name = player.name1, list = lib.character[name][3]
                    var skillname = list.randomGet()
                    player.xjb_noskill(list)
                },
                onremove: function (player, skills) {
                    player.gain_noskill()
                },
                translate: '强制空白',
                description: '锁定技,你的所有技能被封印'
            })
            //受到伤害无视护甲
            lib.skill["xjb_pojia"] = {
                trigger: {
                    player: "damageEnd"
                },
                direct: true,
                content: function () {
                    player.removeSkill(event.name)
                },
                ai: {
                    nohujia: true,
                }
            }
        },
        XJB_skill: function () {
            let skill = {
                "xin_qns": {
                    mod: {
                        aiValue: function (player, card, num) {
                            if (get.name(card) != 'tao' && get.color(card) != 'red') return;
                            var cards = player.getCards('hs', function (card) {
                                return get.name(card) == 'tao' || get.color(card) == 'red';
                            });
                            cards.sort(function (a, b) {
                                return (get.name(a) == 'tao' ? 1 : 2) - (get.name(b) == 'tao' ? 1 : 2);
                            });
                            var geti = function () {
                                if (cards.includes(card)) {
                                    return cards.indexOf(card);
                                }
                                return cards.length;
                            };
                            return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
                        },
                        aiUseful: function () {
                            return lib.skill.kanpo.mod.aiValue.apply(this, arguments);
                        },
                    },
                    locked: false,
                    audio: "ext:新将包:false",
                    enable: "chooseToUse",
                    viewAsFilter: function (player) {
                        return player.countCards('hes', { color: 'red' }) > 0;
                    },
                    filterCard: function (card) {
                        return get.color(card) == 'red';
                    },
                    position: "hes",
                    viewAs: {
                        name: "tao",
                    },
                    prompt: "将一张红色牌当桃使用",
                    check: function (card) { return 15 - get.value(card) },
                    onuse: function (event, player) {
                        if (player.countCards('h') < 3) player.draw()
                    },
                    ai: {
                        threaten: 1.5,
                        basic: {
                            order: function (card, player) {
                                if (player.hasSkillTag('pretao')) return 5;
                                return 2;
                            },
                            useful: [6.5, 4, 3, 2],
                            value: [6.5, 4, 3, 2],
                        },
                        result: {
                            target: 2,
                            "target_use": function (player, target) {
                                if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                                var nd = player.needsToDiscard();
                                var keep = false;
                                if (nd <= 0) {
                                    keep = true;
                                }
                                else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                                    keep = true;
                                }
                                var mode = get.mode();
                                if (target.hp >= 2 && keep && target.hasFriend()) {
                                    if (target.hp > 2 || nd == 0) return 0;
                                    if (target.hp == 2) {
                                        if (game.hasPlayer(function (current) {
                                            if (target != current && get.attitude(target, current) >= 3) {
                                                if (current.hp <= 1) return true;
                                                if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                            }
                                        })) {
                                            return 0;
                                        }
                                    }
                                }
                                if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                                var att = get.attitude(player, target);
                                if (att < 3 && att >= 0 && player != target) return 0;
                                var tri = _status.event.getTrigger();
                                if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                                    if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                                        var num = game.countPlayer(function (current) {
                                            if (current.identity == 'fan') {
                                                return current.countCards('h', 'tao');
                                            }
                                        });
                                        if (num > 1 && player == target) return 2;
                                        return 0;
                                    }
                                }
                                if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                                    if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                                        return 0;
                                    }
                                }
                                if (mode == 'stone' && target.isMin() &&
                                    player != target && tri && tri.name == 'dying' && player.side == target.side &&
                                    tri.source != target.getEnemy()) {
                                    return 0;
                                }
                                return 2;
                            },
                        },
                        tag: {
                            recover: 1,
                            save: 1,
                        },
                    },
                    "_priority": 0,
                },
                "xin_whlw1": {
                    trigger: {
                        target: ["useCardToTarget"],
                    },
                    forced: true,
                    filter: function (event, player) {
                        if (event.card && player !== event.player) return true
                    },
                    content: function () {
                        trigger.player.fc_X(true, "残区", [2], { remnant: trigger.card.name })
                    },
                    ai: {
                        effect: {
                        },
                    },
                    "_priority": 0,
                },
                "xin_whlw2": {
                    trigger: {
                        global: "dyingBegin",
                    },
                    forced: true,
                    logTarget: "player",
                    filter: function (event, player) {
                        return player == _status.currentPhase && event.player != player;
                    },
                    content: function () {
                        player == _status.currentPhase &&
                            player.gain("giveAuto", trigger.player, trigger.player.getCards("h"))
                    },
                    "_priority": 0,
                },
                "xin_htzjq2": {
                    shaRelated: true,
                    trigger: {
                        player: "useCardToPlayered",
                    },
                    check: function (event, player) {
                        return get.attitude(player, event.target) <= 0;
                    },
                    filter: function (event, player) {
                        return event.card.name == 'sha';
                    },
                    logTarget: "target",
                    content: function () {
                        var target = trigger.target;
                        target.chooseLoseHpMaxHp(true)
                    },
                    ai: {
                        ignoreSkill: true,
                    },
                    "_priority": 0,
                },
                "xjb_leijue": {
                    enable: "phaseUse",
                    filterCard: {
                        suit: "spade",
                    },
                    filter: function (event, player) {
                        if (lib.config.xjb_systemEnergy < 1) return false
                        return true
                    },
                    filterTarget: true,
                    content: function () {
                        target.damage('thunder');
                    },
                    "_priority": 0,
                },
                "xjb_xinsheng": {
                    enable: "phaseUse",
                    filter: function (event, player) {
                        return game.dead.length > 0
                    },
                    filterCard: true,
                    selectCard: 3,
                    content: function () {
                        "step 0"
                        player.chooseControl(game.dead.slice(0))
                        "step 1"
                        if (result.control) {
                            result.control.revive(player.maxHp)
                        }
                    },
                    "_priority": 0,
                },
                "xjb_lunhui": {
                    trigger: {
                        player: ["dying"],
                    },
                    content: function () {
                        "step 0"
                        player.fc_X(11, 62, [3, 2], "num_2", true)
                    },
                    "_priority": 0,
                },
                "xjb_sicuan": {
                    audio: "ext:新将包:false",
                    enable: "phaseUse",
                    usable: 1,
                    check: function (card) {
                        return 9 - get.value(card)
                    },
                    filterTarget: function (card, player, target) {
                        return true;
                    },
                    content: function () {
                        "step 0"
                        var list = ["恢复体力", "失去体力", "额外进行一个回合", "失去体力上限", "横置"]
                        player.chooseControl(list)
                        "step 1"
                        var list = ["恢复体力", "失去体力", "额外进行一个回合", "失去体力上限", "横置"].remove(result.control)
                        player.chooseControl(list)
                        event.xjb_a = get.xjb_translation(result.control)
                        "step 2"
                        event.xjb_b = get.xjb_translation(result.control)
                        var c = target[event.xjb_a], a = event.xjb_a, b = event.xjb_b
                        target[a] = target[b]
                        target[b] = c
                    },
                    ai: {
                        order: 9,
                        threaten: 2,
                    },
                    "_priority": 0,
                },
                "xjb_lingpiao": {
                    trigger: {
                        global: ["xjb_addlingliBefore"],
                    },
                    check: function (event, player) {
                        return get.attitude(player, event.player) < 0
                    },
                    filter: function (event, player) {
                        return event.lingliSource !== "card";
                    },
                    content: function () {
                        "step 0"
                        trigger.cancel()
                        let card = game.createCard("xjb_lingliCheck", 'heart', 13 - trigger.num)
                        card.storage.xjb_allowed = true
                        trigger.player.gain("gain2", card)
                        trigger.player.xjb_eventLine(1)
                    },
                },
                "xjb_guifan": {
                    enable: "chooseToUse",
                    limited: true,
                    content: function () {
                        player.awakenSkill("xjb_guifan")
                        player.xjb_readStorage()
                    },
                    ai: {
                        order: 2,
                        save: true,
                        result: {
                            player: function (player) {
                                if (player.hp <= 0) return 10;
                                if (player.hp <= 1 && player.countCards('he') <= 1) return 10;
                                return 0;
                            },
                        },
                    },
                    mark: true,
                    intro: {
                        content: "limited",
                    },
                    skillAnimation: true,
                    init: function (player, skill) {
                        player.storage[skill] = false;
                    },
                    "_priority": 0,
                },
                "xjb_soul_chanter": {
                    enable: "phaseUse",
                    usable: 1,
                    filterCard: true,
                    nextDo: function (player, skill) {
                        let next = game.createEvent("chant")
                        next.player = player
                        next.skill = skill
                        next.setContent(function () {
                            "step 0"
                            game.resume()
                            event.player.xjb_addSkillCard(event.skill)
                        })
                        game.resume()
                    },
                    element: element,
                    async content(event, trigger, player) {
                        player.addTempSkill('xjb_P_gathering', { player: "phaseBegin" })
                        game.pause()
                        let num = 0, element = get.info(event.name).element
                        while (lib.skill['chant' + num] !== undefined) {
                            num++
                        }
                        game.xjb_skillEditor()
                        let touch = new TouchEvent("touchend", {
                            bubbles: true,
                            cancelable: true,
                            composed: true
                        })
                        event.skillId = event.skillId || ("chant" + num)
                        let skill = event.skillId
                        lib.translate[skill] = event.skillCnName || ("咏唱" + num)
                        let functionList = {
                            submitID: function (res) {
                                let list = (skill).split(''), a = 0
                                //输入id
                                let timer = setInterval(i => {
                                    if (a === list.length) {
                                        res();
                                        clearInterval(timer);
                                        game.xjb_back.ele.id.submit();
                                        return;
                                    }
                                    game.xjb_back.ele.id.value += list[a];
                                    a++;
                                }, 100)
                            },
                            nextPage: function (res) {
                                setTimeout(i => {
                                    game.xjb_back.ele.nextPage.click()
                                    game.xjb_back.ele.nextPage.dispatchEvent(touch)
                                    res()
                                }, 200)
                            }
                        }
                        new Promise(res => {
                            //这里是第一页内容
                            functionList.submitID(res)
                        }).then(data => {
                            return new Promise(res => {
                                setTimeout(i => {
                                    element().setTarget(game.xjb_back.ele.kinds[0])
                                        .clickAndTouch()
                                        .setTarget(game.xjb_back.ele.types[1])
                                        .clickAndTouch()
                                    res()
                                }, 200)
                            })
                        }).then(data => {
                            return new Promise(res => {
                                setTimeout(i => {
                                    element().setTarget(game.xjb_back.ele.modes[2])
                                        .clickAndTouch()
                                    res()
                                }, 200)
                            })
                        }).then(data => {
                            //这里换页了，第二页
                            return new Promise(res => {
                                functionList.nextPage(res)
                            })
                        }).then(data => {
                            return new Promise(res => {
                                let list = XJB_EDITOR_LIST['filter'].randomGet(), a = 0
                                lib.translate[skill + "_info"] = `${list}整理`
                                let timer = setInterval(i => {
                                    if (a === list.length) {
                                        res(game.xjb_back.ele.filter.value)
                                        clearInterval(timer)
                                        element().setTarget(game.xjb_back.ele.filter)
                                            .callMethod("arrange")
                                            .callMethod("submit");
                                        return
                                    }
                                    game.xjb_back.ele.filter.value += list[a]
                                    a++
                                }, 100)
                            })
                        }).then(data => {
                            //第三页
                            return new Promise(res => {
                                functionList.nextPage(res)
                            })
                        }).then(data => {
                            return new Promise(res => {
                                let list = XJB_EDITOR_LIST['effect'].randomGet(), a = 0
                                lib.translate[skill + "_info"] += `${list}整理`
                                let timer = setInterval(i => {
                                    if (a === list.length) {
                                        res();
                                        clearInterval(timer);
                                        element().setTarget(game.xjb_back.ele.content)
                                            .callMethod("arrange")
                                            .callMethod("submit");
                                        return;
                                    }
                                    game.xjb_back.ele.content.value += list[a];
                                    element().setTarget(game.xjb_back.ele.content)
                                        .callMethod("submit");
                                    a++
                                }, 100)
                            })
                        }).then(data => {
                            //第四页
                            return new Promise(res => {
                                functionList.nextPage(res)
                            })
                        }).then(data => {
                            return new Promise(res => {
                                let list = XJB_EDITOR_LIST['trigger'].randomGet(), a = 0
                                lib.translate[skill + "_info"] += `${list}整理`
                                let timer = setInterval(i => {
                                    if (a === list.length) {
                                        res()
                                        clearInterval(timer)
                                        element().setTarget(game.xjb_back.ele.trigger)
                                            .callMethod("arrange")
                                            .callMethod("submit");
                                        return
                                    }
                                    game.xjb_back.ele.trigger.value += list[a]
                                    a++
                                }, 100)
                            })
                        }).then(data => {
                            //第五页
                            return new Promise(res => {
                                functionList.nextPage(res)
                            })
                        }).then(data => {
                            return new Promise(res => {
                                setTimeout(i => {
                                    let produce = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', game.xjb_back.target.value)
                                    produce(_status, lib, game, ui, get, ai)
                                    game.xjb_back.remove()
                                    for (let k in lib.skill[skill]) {
                                        lib.skill[skill][k] = lib.skill[skill][k]
                                    }
                                    let arr = lib.translate[skill + '_info'].split('整理')
                                    if (arr[1].includes("继承")) {
                                        arr[1] = arr[1].replace("继承", "");
                                        arr[1] = arr[1].replace(/[^a-z]/gi, "")
                                        arr[1] = `你"${get.translation(arr[1])}(${arr[1]})"一次`;
                                    }
                                    lib.translate[skill + '_info'] = "锁定技，" + arr[2] + '，若' + arr[0] + '，' + arr[1] + '。'
                                    lib.translate[skill + '_info'] = lib.translate[skill + '_info'].replace(/\s/g, "")
                                    res()
                                }, 300)
                            })
                        }).then(data => {
                            get.info(event.name).nextDo(player, skill)
                        })
                    },
                    ai: {
                        order: 4,
                        result: {
                            player: 2,
                        },
                    },
                    "_priority": 0,
                },
            }
            for (let k in skill) {
                lib.skill[k] = skill[k];
            }
        }
    }
}