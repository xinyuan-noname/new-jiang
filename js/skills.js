import { _status, lib, game, ui, get, ai } from "../../../noname.js"
import { XJB_Math } from './tool/math.js';
import './skill/raiseSkill.mjs';
import './skill/sanSkill.mjs';
import './skill/skillTag.mjs';
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
        lib.translate._xjb_huobi = "货币"
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
        
    },
}
