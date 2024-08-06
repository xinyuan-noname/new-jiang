import {
    touchE,
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
        lib.skill[name].translate = undefined;
        lib.skill[name].description = undefined;
        lib.translate[name] = skill.translate;
        lib.translate[name + "_info"] = skill.description
        return lib.skill[name];
    };
    lib.skill.xjb_3 = {
        Translate: function () {
            lib.translate.fuSkill = "<b description=［附魔：首次使用此技能恢复体力并加一点护甲］>福技</b>"
            lib.translate.luSkill = "<b description=［附魔：首次使用此技能摸四张牌］>禄技</b>"
            lib.translate.shouSkill = "<b description=［附魔：首次使用此技能加两点体力上限］>寿技</b>"
            lib.translate.suidongSkill = "<b description=［附魔：因为此技能效果获得牌后可以立即使用该牌］>随动技</b>"
            lib.translate.qzj = "<b description=［附魔：此技能指定的目标角色当前回合失去技能］>强制技</b>"
            lib.translate.xin_qinnang2 = '青囊'
            lib.translate.xin_xuming = '续命'
            lib.translate.xjb_bingjue = '冰诀'
            lib.translate._xjb_huobi = "货币"
            lib.translate.xin_qinnang2_info = '出牌阶段限一次，你可对一名角色使用任意张【桃】，你以此法你每使用一张【桃】，你和其各摸一张牌。'
            lib.translate.lunaticMasochist = "疼痛敏感"
            lib.translate.lunaticMasochist_info = "你弃牌、失去体力、恢复体力、失去体力上限、恢复体力上限、装备装备牌均视为受到伤害。"
        },
        dynamicTranslate: function () {
            //谋圣动态描述
            lib.dynamicTranslate["xin_mousheng"] = function (player) {
                return '锁定技，你亮出拼点牌时，你拼点牌点数+' + Math.min(game.roundNumber, 12)
            }
            //激昂动态描述
            lib.dynamicTranslate["xin_jiang"] = function (player) {
                var num = 0
                for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i].isLinked()) num++
                }
                if ((player.hasZhuSkill('xin_yingyi') && get.mode() == 'identity') || get.mode() != 'identity') {
                    for (var i = 0; i < game.players.length; i++) {
                        if (game.players[i].group === 'wu') num++
                    }
                }
                if (num > 3) num = 3
                return lib.translate.xin_jiang_info.replace("X", num + "").replace(/[(].+[)]/i, "")
            }
            //国色动态描述
            lib.dynamicTranslate["xjb_guose"] = function () {
                var num = game.countPlayer(function (current) {
                    return current.countCards('ej');
                });
                return lib.translate.xjb_guose_info.replace("X", num + "").replace(/[(].+[)]/i, "")
            }
        },
        skillTag: function () {
            //随动技附魔
            lib.skill._xjb_suidongSkill = {
                trigger: {
                    player: ["gainEnd", "drawEnd"]
                },
                direct: true,
                filter: function (event, player) {
                    if (!event.cards) return false
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
                    if (!lib.config.xjb_skillTag_Character.includes(player.name1)) return false
                    return true
                },
                forced: true,
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
                forced: true,
                direct: true,
                content: function () {
                    for (let i = 0; i < trigger.targets.length; i++) {
                        trigger.targets[i].addTempSkill('skill_noskill')
                        trigger.targets[i].popup("强制技")
                    }
                }
            }
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
            /*以上是恩赐代码*/
            //以下是冰诀
            lib.skill.xjb_bingjue = {
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
                filter: function (card, player, target) {
                    return player.countCards('h') > 0;
                },
                discard: false,
                lose: false,
                delay: false,
                usable: 1,
                content: function () {
                    for (var i = 0; i < cards.length; i++) {
                        cards[i].storage.vanish = true
                        player.gain(game.createCard2('sha', 'club', 1, 'ice'))
                    }
                    player.lose(cards)
                },
            }
            lib.translate.xjb_bingjue_info = '出牌阶段限一次，你可弃置所有梅花手牌，然后获得等量张冰【杀♣️A】。你使用冰【杀】无次数限制。'
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
                    player.useSkill('benghuai');
                },
                translate: '体力上限限制',
                description: '回合开始前,若当前回合角色体力上限大于15,其"崩坏(benghuai)"一次。'
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
                        //角色原画设置
                        current.storage.xjb_PreImage = window.getComputedStyle(current.node.avatar).backgroundImage;
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
            //特效--旋转效果
            lib.skill.xjb_zhuanzhuan = {
                trigger: {
                    player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
                },
                direct: true,
                content: function () {
                    if (trigger.name == "phaseZhunbei") {
                        if (player == game.me) {
                            ui.arena.style = '--xjbTimeLong:4s'
                            ui.arena.classList.add('xjb_tranEndless');
                        }
                        else {
                            player.node.avatar.classList.add('xjb_tranEndless')
                        }
                    }
                    else {
                        ui.arena.style = '--xjbTimeLong:0s'
                        player.node.avatar.classList.remove('xjb_tranEndless')
                        player.removeSkill(event.name)
                    }
                },
            }
        },
        XJB_skill: function () {
            let skill = {
                "xin_jincui": {
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
                },
                "xin_chushi": {
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
                    "_priority": 0,
                },
                "xin_yeling": {
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
                },
                "xin_huanshi": {
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
                    },
                    "_priority": 0,
                },
                "xin_bianzhu": {
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
                            "_priority": 0,
                        },
                    },
                    "_priority": 0,
                },
                "xin_zhabing": {
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
                    "_priority": 0,
                },
                "xin_huzhu": {
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
                        threaten: 2.6,
                    },
                    "_priority": 0,
                },
                "xin_huzhu2": {
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
                    "_priority": 0,
                },
                "xin_xiongli": {
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
                    },
                    "_priority": 0,
                },
                "xin_mousheng": {
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
                },
                "xin_bingjie": {
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
                },
                "xin_liuxiang": {
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
                },
                "xin_ziruo": {
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
                },
                "xin_fengtian": {
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
                },
                "xin_niepan": {
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
                },
                "xin_tianming": {
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
                },
                "xin_zulong": {
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
                },
                "xin_zaozhong": {
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
                },
                "xin_taoni": {
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
                },
                "xin_jiang": {
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
                },
                "xin_yingyi": {
                    zhuSkill: true,
                    "_priority": 0,
                },
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
                "xin_lianhuan": {
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
                },
                "xjb_liuli": {
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
                    },
                    "_priority": 0,
                },
                "xjb_guose": {
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
                    "_priority": 0,
                },
                "xin_longpan": {
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
                },
                "xin_enyuan": {
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
                },
                "xjb_fuyi": {
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
                    shouSkill: true,
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
                "xin_yingfa": {
                    enable: "phaseUse",
                    filterTarget: true,
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
                            target: function (player, target) {
                                return -target.countCards('h');
                            },
                        },
                        threaten: 2,
                    },
                },
                "_xjb_remnantArea": {
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
                    },
                    "_priority": 0,
                },
                "_UseHpCard": {
                    trigger: {
                        global: "gameStart",
                    },
                    filter: function (event, player) {
                        if (!lib.config.xjb_hun) return false
                        var name = player.name1
                        if (!lib.config.xjb_count[name]) return false
                        if (!lib.config.xjb_count[name].HpCard || !lib.config.xjb_count[name].HpCard.length) return false
                        if (!(player === game.me || player.isUnderControl())) return false
                        return true
                    },
                    forced: true,
                    content: function () {
                        "step 0"
                        var name = player.name1
                        var list = game.countHpCard(lib.config.xjb_count[name].HpCard)
                        var hpCard = new Array(1, 2, 3, 4, 5).map(function (i) {
                            return (i + game.createHpCard(i).innerHTML)
                        })
                        var next = player.chooseButton(['请选择你使用的体力牌', [hpCard.slice(0, 3), "tdnodes"], [hpCard.slice(3), "tdnodes"]], [1, Infinity])
                        next.filterButton = function (button) {
                            var player = _status.event.player
                            return lib.config.xjb_count[player.name1].HpCard.includes(
                                get.xjb_number(button.link[0])
                            )
                        }
                        "step 1"
                        if (result.bool) {
                            result.links.forEach(function (i) {
                                player.useHpCard(get.xjb_number(i[0]))
                            })
                        }
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
                "xjb_minglou": {
                    enable: "phaseUse",
                    content: function () {
                        player.xjb_saveStorage()
                    },
                    ai: {
                        order: 9,
                        save: true,
                        result: {
                            player: function (player) {
                                let targetMother = get.xjb_storage(player, 1)
                                if (!targetMother) return 10;
                                let target = targetMother.character
                                let score = 0
                                score += (player.hp - target.hp) * 2;
                                score += (player.hujia - target.hujia) * 2;
                                score += (player.maxHp - target.maxHp)
                                score += ((!player.isLinked()) - (!target.isLinked))
                                score += ((!player.isTurnedOver()) - (!target.isTurnOvered)) * 5
                                function countCards() {
                                    return target.h.length + target.e.length + target.j.length + target.s.length + target.x.length
                                }
                                score += (player.countCards('hejsx') - countCards())
                                player.popup('存档收益' + (score > 0 ? '+' : '') + score)
                                return score;
                            },
                        },
                    },
                },
                "xjb_soul_fuhua": {
                    enable: "chooseToUse",
                    filter: function (event, player) {
                        if (lib.config.xjb_count[player.name1].kind != "血族") return false
                        if (event.type === 'dying') {
                            if (player != event.dying) return false;
                            return true;
                        }
                    },
                    content: function () {
                        'step 0'
                        player.recover(1 - player.hp);
                        'step 1'
                        player.removeSkill(event.name)
                        player.addSkill('xjb_soul_yiying')
                        var src = lib.xjb_src + "sink/xjb_xuemo/"
                        ui.xjb_giveStyle(player.node.avatar, {
                            "background-image": "url('" + src + "xuemo4.jpg')"
                        });
                        'step 2'
                        lib.skill._unique_talent_xjb.load.push(function () {
                            game.players.forEach(current => {
                                current.removeSkill('xjb_soul_yiying')
                            })
                        })
                    },
                    ai: {
                        save: true,
                    },
                },
                "xin_xueqi": {
                    trigger: {
                        source: "damageBefore",
                    },
                    check: function (event, player) {
                        if (get.attitude(player, event.player) > 0) return false;
                        if (player.hp >= event.player.hp) return false
                        return true
                    },
                    content: function () {
                        'step 0'
                        //交换体力牌
                        player.fc_X(103, true, {
                            onlyme: [trigger.player]
                        })
                        'step 1'
                        player.chooseTarget(1, '你选择一名其他角色进入血色空间').set("filterTarget", function (card, player, target) {
                            return player != target
                        }).set('ai', function (target) {
                            return -get.attitude(player, target);
                        })
                        'step 2'
                        if (result.bool) result.targets.forEach(target => {
                            //进入血色空间
                            target.addTempSkill('xjb_P_blood', { player: "phaseAfter" })
                        })
                    },
                    "_priority": 0,
                },
                "xjb_soul_yiying": {
                    onremove: function (player) {
                        if (player.storage.xjb_PreImage) {
                            ui.xjb_giveStyle(player.node.avatar, {
                                "background-image": player.storage.xjb_PreImage
                            })
                        }
                        player.addSkill('xjb_soul_fuhua')
                    },
                    enable: ["chooseToUse", "chooseToRespond"],
                    viewAs: {
                        name: "shan",
                        isCard: true,
                    },
                    filterCard: card => false,
                    selectCard: -1,
                    mark: false,
                    prompt: "视为使用或打出一张【闪】",
                    onuse: function (event, player) {
                        let next = game.createEvent('xjb_soul_yiying')
                        next.player = player
                        next.setContent(function () {
                            'step 0'
                            player.chooseTarget(1).set("filterTarget", function (card, player, target) {
                                return player != target
                            })
                            'step 1'
                            if (result.bool) game.swapSeat(player, result.targets[0]);
                        })
                    },
                    ai: {
                        order: 3,
                        basic: {
                            useful: [7, 5.1, 2],
                            value: [7, 5.1, 2],
                        },
                        result: {
                            player: 1,
                        },
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
        },
        characterSkill_xjb_liushan: function () {
            SkillCreater(
                "xjb_fangquan", {
                enable: "phaseUse",
                filterCard: true,
                discard: false,
                lose: false,
                position: "hes",
                check: function (card) {
                    return 6 - get.value(card)
                },
                usable: 1,
                filterTarget: function (card, player, target) {
                    return target != player;
                },
                prompt: "将一张牌交给一名其他角色并结束你的出牌阶段,令其额外进行一个回合",
                content: function () {
                    target.gain(cards, "giveAuto")
                    target.insertPhase();
                    let evt = event.getParent("phaseUse");
                    evt.finish();
                },
                translate: '放权',
                description: "出牌阶段限一次，你可以将一张牌交给一名其他角色并结束你的出牌阶段,你令其进行一个额外的回合。",
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
            SkillCreater(
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
        },
        characterSkill_xjbhan_caocao: function () {
            SkillCreater(
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
            SkillCreater(
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
        },
    };
    (function () {
        SkillCreater(
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
        SkillCreater(
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
        SkillCreater(
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
        }
        )
        SkillCreater(
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
        }
        )
        SkillCreater(
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
    })();

}