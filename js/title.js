window.XJB_LOAD_title = function (_status, lib, game, ui, get, ai) {
    lib.skill.xjb_5 = {
        titleSet: function () {
            for (let i = 0; i < 15; i++) {
                if (!lib.config.xjb_title[i]) {
                    lib.config.xjb_title[i] = [
                        ``,
                        []
                    ]
                }
            }
            lib.config.xjb_title[0][0] = `<img src=${lib.xjb_src}title/xjb_kill1.png height=50px></img>`
            lib.config.xjb_title[1][0] = `<img src=${lib.xjb_src}title/xjb_fire.png height=20px></img>`
            lib.config.xjb_title[2][0] = `<img src=${lib.xjb_src}title/xjb_thunder.png height=20px></img>`
            lib.config.xjb_title[3][0] = `<img src=${lib.xjb_src}title/xjb_ice.png height=20px></img>`
            lib.config.xjb_title[4][0] = `<img src=${lib.xjb_src}title/xjb_loseMaxHp.png height=20px></img>`
            lib.config.xjb_title[5][0] = `<img src=${lib.xjb_src}title/xjb_gainMaxHp.png height=20px></img>`
            lib.config.xjb_title[6][0] = `<img src=${lib.xjb_src}title/xjb_kill2.png height=40px></img>`
            lib.config.xjb_title[7][0] = `<img src=${lib.xjb_src}title/xjb_boss1.png height=50px></img>`
            lib.config.xjb_title[8][0] = `<img src=${lib.xjb_src}title/xjb_yin1.png height=50px></img>`
            lib.config.xjb_title[9][0] = `<img src=${lib.xjb_src}title/xjb_yin2.png height=60px></img>`
            lib.config.xjb_title[10][0] = `<img src=${lib.xjb_src}title/xjb_yin3.png height=70px></img>`
            lib.config.xjb_title[11][0] = `<img src=${lib.xjb_src}title/xjb_yin1.png height=50px></img>`
            lib.config.xjb_title[12][0] = `<img src=${lib.xjb_src}title/xjb_yin2.png height=60px></img>`
            lib.config.xjb_title[13][0] = `<img src=${lib.xjb_src}title/xjb_yin3.png height=70px></img>`
            lib.config.xjb_title[14][0] = `<img src=${lib.xjb_src}title/xjb_damageZero.png height=60px></img>`
            game.saveConfig('xjb_title', lib.config.xjb_title);
        },
        Func: function () {
            game.xjb_titleGain = function (player, i) {
                if (lib.config.xjb_title[i][1].includes(player.name1)) return
                game.xjb_getHunbi(50,void 0,true,true)
                game.xjb_create.alert('恭喜' + get.translation(player.name1) + '解锁了' +
                    lib.config.xjb_title[i][0])
                lib.config.xjb_title[i][1].add(player.name1)
                game.saveConfig('xjb_title', lib.config.xjb_title);
                lib.skill.xjb_final.title()
            }
        },
        titleSkill: function () {
            //造成伤害
            lib.skill._damage_jxbhunbi = {
                trigger: {
                    source: ["damageEnd"],
                },
                popup: false,
                forced: true,
                superCharlotte: true,
                charlotte: true,
                fixed: true,
                filter: function (event, player) {
                    if (!lib.config.xjb_hun) return false
                    if (!(player == game.me || player.isUnderControl())) return false
                    if (event.num > 1) {
                        if (!lib.config.xjb_count[player.name]) lib.config.xjb_count[player.name] = {}
                        if (!lib.config.xjb_count[player.name].strongDamage) {
                            lib.config.xjb_count[player.name].strongDamage = 0
                        }
                        lib.config.xjb_count[player.name].strongDamage++
                        game.saveConfig('xjb_count', lib.config.xjb_count);
                        game.log(player, 'strongDamage值为' + lib.config.xjb_count[player.name].strongDamage)
                        //一个魂币，不消耗能量，沉默
                        game.xjb_getHunbi(1,void 0,true,true)
                        game.log('你的魂币+1')
                    }
                    if (!event.nature) return false
                    return true
                },
                content: function () {
                    var nature = trigger.nature
                    var i
                    switch (nature) {
                        case 'thunder': i = 2; break;
                        case 'fire': i = 1;; break;
                        case 'ice': i = 3; break;
                    }
                    var name = player.name1;
                    if (!lib.config.xjb_count[name]) game.zeroise_xjbCount(player)
                    if (lib.config.xjb_count[name][nature] == undefined) lib.config.xjb_count[name][nature] = 0
                    if (isNaN(lib.config.xjb_count[name][nature])) lib.config.xjb_count[name][nature] = 0
                    lib.config.xjb_count[name][nature] += trigger.num
                    game.saveConfig('xjb_count', lib.config.xjb_count);
                    game.log(player, nature + '值为' + lib.config.xjb_count[name][nature])
                    if (lib.config.xjb_count[name][nature] >= 100 && !lib.config.xjb_title[i][1].includes(name)) {
                        game.xjb_titleGain(player, i)
                    }
                }
            }
            //
            lib.skill._skillDamageCount = {
                trigger: {
                    player: ["damageZero"],
                },
                filter: function (event, player) {
                    if (!lib.config.xjb_hun) return false
                    if (!(event.source == game.me)) return false
                    return true
                },
                content: function () {
                    for (let i = 1; i < 9; i++) {
                        let theName = trigger.getParent(i).name
                        if (Object.keys(lib.skill).includes(theName)) {
                            if (!_status.xjb_CharacterCount[theName]) {
                                _status.xjb_CharacterCount[theName] = 0
                            }
                            _status.xjb_CharacterCount[theName]++
                        }
                    }

                }
            }
            //击杀       
            lib.skill._jisha_jxbhunbi = {
                trigger: {
                    global: ["dieBefore"],
                },
                popup: false,
                forced: true,
                superCharlotte: true,
                charlotte: true,
                fixed: true,
                filter: function (event, player) {
                    if (!lib.config.xjb_hun) return false
                    if (!(player == game.me || player.isUnderControl())) return false
                    if (_status.currentPhase != player) return false
                    return true
                },
                content: function () {
                    //一个魂币，不消耗能量，沉默
                    game.xjb_getHunbi(1,void 0,true,true)
                    game.log('你的魂币+1')
                    //
                    var name = player.name1;
                    if (!lib.config.xjb_count[name]) game.zeroise_xjbCount(player)
                    if (isNaN(lib.config.xjb_count[name].kill)) lib.config.xjb_count[name].kill = 0
                    lib.config.xjb_count[name].kill++
                    game.saveConfig('xjb_count', lib.config.xjb_count);
                    game.log(player, 'kill值为' + lib.config.xjb_count[name].kill)
                    if (lib.config.xjb_count[name].kill >= 100 && !lib.config.xjb_title[0][1].includes(name)) {
                        game.xjb_titleGain(player, 0)
                    }
                    if (lib.config.xjb_count[name].kill >= 250 && !lib.config.xjb_title[0][6].includes(name)) {
                        game.xjb_titleGain(player, 6)
                    }
                    if (trigger.player.name1 === "xjb_Boss_Start" && trigger.player != game.me) {
                        if (!trigger.source) event.finish()
                        if (lib.config.xjb_title[7][1].length < 1) game.xjb_titleGain(player, 7)
                    }
                }
            }
            //体力上限
            lib.skill._maxHp_jxbhunbi = {
                trigger: {
                    player: ["loseMaxHpAfter", "gainMaxHpAfter"],
                },
                popup: false,
                forced: true,
                superCharlotte: true,
                charlotte: true,
                fixed: true,
                filter: function (event, player) {
                    if (!lib.config.xjb_hun) return false
                    if (!(player == game.me || player.isUnderControl())) return false
                    return true
                },
                content: function () {
                    var name = player.name1, num = trigger.name === "loseMaxHp" ? 4 : 5
                    if (!lib.config.xjb_count[name]) game.zeroise_xjbCount(player)
                    if (isNaN(lib.config.xjb_count[name][trigger.name])) lib.config.xjb_count[name][trigger.name] = 0
                    lib.config.xjb_count[name][trigger.name] += trigger.num
                    game.saveConfig('xjb_count', lib.config.xjb_count);
                    game.log(player, `${trigger.name}值为${lib.config.xjb_count[name][trigger.name]}`)
                    if (lib.config.xjb_count[name][trigger.name] >= 20 && !lib.config.xjb_title[num][1].includes(name)) {
                        game.xjb_titleGain(player, num)
                    }
                }
            }
        }
    }
    lib.skill.xjb_10 = {
        win: function () {
            if (true) {
                let list = [
                    ["_zhu", "主公"],
                    ["_zhong", "忠臣"],
                    ["_nei", "内奸"],
                    ["_fan", "反贼"],
                    ["_landlord", "地主"],
                    ["_farmer", "农民"],
                    ["1", "身份场"],
                    ["2", "斗地主场"],
                    ["3", "国战场"]]
                list.forEach(i => {
                    lib.xjb_list_xinyuan.translate["winRate" + i[0]] = i[1] + "胜率"
                    lib.xjb_list_xinyuan.translate["playedTimes" + i[0]] = i[1] + "场次"
                    lib.xjb_list_xinyuan.translate["win" + i[0]] = i[1] + "胜场"
                })
            }
            game.xjb_win = function (player, num, bool) {
                let name = bool ? player.name1 : player.name2
                let count = lib.config.xjb_count[name]
                if (!count) return true
                if (!count["win" + num]) count["win" + num] = 0
                count["win" + num]++
                //
                Object.keys(_status.xjb_CharacterCount).forEach(function (item) {
                    if (this[item] >= 5) {
                        game.xjb_titleGain(player, 14)
                    }
                }, _status.xjb_CharacterCount)
                //江东铁壁称号判定
                if (["shen_ganning", "re_xusheng"].includes(name)) {
                    if (num == 1) {
                        if (count["win" + num] >= 25 && !lib.config.xjb_title[8][1].includes(name)) {
                            game.xjb_titleGain(player, 8)
                        }
                        if (count["win" + num] >= 100 && !lib.config.xjb_title[9][1].includes(name)) {
                            game.xjb_titleGain(player, 9)
                        }
                        if (count["win" + num] >= 250 && !lib.config.xjb_title[9][1].includes(name)) {
                            game.xjb_titleGain(player, 10)
                        }
                    }
                    if (num === 2) {
                        if (count["win" + num] >= 25 && !lib.config.xjb_title[8][1].includes(name)) {
                            game.xjb_titleGain(player, 11)
                        }
                        if (count["win" + num] >= 100 && !lib.config.xjb_title[9][1].includes(name)) {
                            game.xjb_titleGain(player, 12)
                        }
                        if (count["win" + num] >= 250 && !lib.config.xjb_title[9][1].includes(name)) {
                            game.xjb_titleGain(player, 13)
                        }
                    }
                }
                //
                if (num == 1) {
                    if (["zhu", "zhong", "nei", "fan"].includes(player.identity)) {
                        if (!count["win_" + player.identity]) count["win_" + player.identity] = 0
                        count["win_" + player.identity]++
                    }
                }
                if (num === 2) {
                    let iden = player.identity == "zhu" ? "landlord" : "farmer"
                    if (!count["win_" + iden]) count["win_" + iden] = 0
                    count["win_" + iden]++
                }
                game.xjb_played_timesUp(player, num, bool)
                return true
            }
            game.xjb_played_timesUp = function (player, num, bool) {
                let name = player.name1
                if (bool) name = player.name2
                let count = lib.config.xjb_count[name]
                if (!count) return
                if (!count["playedTimes" + num]) count["playedTimes" + num] = 0
                count["playedTimes" + num]++
                if (count["win" + num] > count["playedTimes" + num]) count["playedTimes" + num] = count["win" + num]
                if (true) {
                    count["winRate" + num] =
                        ((count["win" + num] * 100) / count["playedTimes" + num]).toFixed(2) + "%"
                }
                if (num == 1) {
                    if (["zhu", "zhong", "nei", "fan"].includes(player.identity)) {
                        if (!count["playedTimes_" + player.identity]) count["playedTimes_" + player.identity] = 0
                        count["playedTimes_" + player.identity]++
                        if (count["playedTimes_" + player.identity] > count["win_" + player.identity]) count["playedTimes_" + player.identity] = count["win_" + player.identity]
                        count["winRate_" + player.identity] =
                            ((count["win_" + player.identity] * 100) / count["playedTimes_" + player.identity]).toFixed(2) + "%"
                    }
                }
                if (num === 2) {
                    let iden = player.identity == "zhu" ? "landlord" : "farmer"
                    if (!count["playedTimes_" + iden]) count["playedTimes_" + iden] = 0
                    count["playedTimes_" + iden]++
                    if (count["playedTimes_" + iden] > count["win_" + iden]) count["playedTimes_" + iden] = count["win_" + iden]
                    count["winRate_" + iden] =
                        ((count["win_" + iden] * 100) / count["playedTimes_" + iden]).toFixed(2) + "%"
                }
                game.saveConfig("xjb_count", lib.config.xjb_count)
            }
            game.xjb_createWinObserver = function (player, num) {
                return function wonderfulFrame() {
                    if (!ui.dialog || !ui.dialog.content || !ui.dialog.content.firstChild) return
                    let judge = ui.dialog.content.firstChild.innerHTML
                    judge === "战斗胜利" && game.xjb_win(player, num) && game.xjb_win(player, num, true);
                    (judge === "战斗失败" || judge === "战斗结束") && game.xjb_played_timesUp(player, num) && game.xjb_played_timesUp(player, num, true)
                    cancelAnimationFrame(wonderfulFrame)
                }
            }
        },
        guozhan: function () {
            if (get.mode() != "guozhan") return
            lib.element.player.xjb_dieAfter = lib.element.player.dieAfter
            lib.element.player.dieAfter = function () {
                lib.element.player.xjb_dieAfter.apply(this, arguments)
                window.requestAnimationFrame(game.xjb_createWinObserver(game.me, 3));
            }
        },
        doudizhu: function () {
            if (get.mode() != "doudizhu") return
            lib.element.player.xjb_dieAfter = lib.element.player.dieAfter
            lib.element.player.dieAfter = function () {
                lib.element.player.xjb_dieAfter.apply(this, arguments)
                window.requestAnimationFrame(game.xjb_createWinObserver(game.me, 2));
            }
        },
        identity: function () {
            if (get.mode() != "identity") return
            lib.element.player.xjb_dieAfter = lib.element.player.dieAfter
            lib.element.player.dieAfter = function () {
                lib.element.player.xjb_dieAfter.apply(this, arguments)
                window.requestAnimationFrame(game.xjb_createWinObserver(game.me, 1));
            }
        }
    }
}