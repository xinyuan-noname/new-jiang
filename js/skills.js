import './skill/raiseSkill.mjs';
import './skill/sanSkill.mjs';
import { _status, lib, game, ui, get, ai } from "../../../noname.js"
import { XJB_Math } from './tool/math.js';
/**
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
        lib.translate.xin_qinnang2 = '青囊';
        lib.translate._xjb_huobi = "货币"
        lib.translate.xin_qinnang2_info = '出牌阶段限一次，你可对一名角色使用任意张【桃】，你以此法你每使用一张【桃】，你和其各摸一张牌。'
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
                //判断角色
                if (!event.targets) return false
                if (!event.targets.length) return false
                if (!event.skill) return false
                //判断有没有标签的
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
            async content(event, trigger, player) {
                event.level = _status.xjb_level;
                if (game.players.length < 4 && game.me.isAlive()) {
                    const number = _status.xjb_level.xjb_chip * 5
                    await game.xjb_create.promise.alert('恭喜你坚持到了最后!你可以获得奖励' + number + '个魂币')
                    if (number) game.xjb_getHunbi(number, void 0, true, false, '游戏');
                    game.over(true);
                    return;
                };
                trigger.cancel();
                let inputNum;
                if (player === game.me) {
                    if (_status.xjb_level.min === _status.xjb_level.max) {
                        await game.xjb_create.promise.alert("boom!");
                        inputNum = _status.xjb_level.min;
                    }
                    else for (let bool; !bool && _status.event === event;) {
                        const { result, bool: boolx } = await game.xjb_create.promise.range(
                            '输入一个介于' + event.level.min + '到' + event.level.max + '间的一个数',
                            { min: event.level.min, max: event.level.max }
                        )
                        bool = boolx, inputNum = result;
                    }
                } else {
                    await new Promise(res => {
                        setTimeout(() => {
                            inputNum = XJB_Math['randomInt'](_status.xjb_level.min, _status.xjb_level.max);
                            res();
                        }, 1000)
                    })
                };
                player.popup(inputNum);
                await new Promise(res => {
                    setTimeout(res, 500);
                })
                if (inputNum === event.level.guessNumber) {
                    await player.damage(Infinity);
                    _status.xjb_level.guessNumber = Math.floor(Math.random() * 1000)
                    _status.xjb_level.min = 0;
                    _status.xjb_level.max = 999;
                    player.xjb_speechWord(get.translation(player) + "出局")
                    await new Promise(res => {
                        setTimeout(res, 100);
                    })
                } else if (inputNum < event.level.guessNumber) {
                    _status.xjb_level.min = inputNum + 1;
                    player.popup('小了');
                    player.xjb_speechWord("小了")
                    await new Promise(res => {
                        setTimeout(res, 100);
                    })
                } else if (inputNum > event.level.guessNumber) {
                    _status.xjb_level.max = inputNum - 1;
                    player.popup('大了');
                    player.xjb_speechWord("大了")
                    await new Promise(res => {
                        setTimeout(res, 100);
                    })
                }
                if (game.players.length < 4 && game.me.isAlive()) {
                    const number = _status.xjb_level.xjb_chip * 5
                    await game.xjb_create.alert(`恭喜你坚持到了最后!${isNaN(number) ? "你可以获得" + number + "个魂币。" : ""}`)
                    if (number) game.xjb_getHunbi(number, void 0, true, false, '游戏');
                    game.over(true);
                    return;
                };
                trigger.cancel();
            }
        })
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
    method: function () {
        get.xjb_skillDescription = (skill) => {
            return `【${get.translation(skill)}】(${skill})${lib.translate[skill + "_info"]}`
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
                    if (!_status.event.card) return;
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
    },
}
