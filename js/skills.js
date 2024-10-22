import SkillCreater from './skill/raiseSkill.mjs'
window.XJB_LOAD_SKILLS = function (_status, lib, game, ui, get, ai) {
    /**
     * 
     * @param {String} name 技能名
     * @param {Object} skill 技能对象
     */
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
                }
            }
            for (let k in skill) {
                lib.skill[k] = skill[k];
            }
        }
    }
}