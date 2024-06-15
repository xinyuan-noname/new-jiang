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
                if (!lib.config.xjb_title[i]) return
                if (typeof player === 'string') {
                    game.xjb_titleGain({ name1: player }, i);
                    return;
                }
                if (lib.config.xjb_title[i][1].includes(player.name1)) return
                if (!player.name1) return;
                let playerName = get.translation(player.name1)
                game.xjb_getHunbi(50, void 0, true, true, `${playerName}(${player.name1})解锁称号`)
                game.xjb_create.alert('恭喜' + playerName + '解锁了' +
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
                        game.xjb_getHunbi(1, void 0, true, true, `${get.translation(player)}(${player.name1})造成重伤`)
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
                    game.xjb_getHunbi(1, void 0, true, true, `${get.translation(player)}(${player.name1})击杀角色`)
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
                    ["3", "国战场"]
                ]
                list.forEach(i => {
                    lib.xjb_list_xinyuan.translate["winRate" + i[0]] = i[1] + "胜率"
                    lib.xjb_list_xinyuan.translate["playedTimes" + i[0]] = i[1] + "场次"
                    lib.xjb_list_xinyuan.translate["win" + i[0]] = i[1] + "胜场"
                })
            }
            game.xjb_countCharSave = function () {
                game.saveConfig("xjb_count", lib.config.xjb_count);
            };
            game.xjb_countCharOne = function (playerName) {
                let count = lib.config.xjb_count[playerName];
                for (let k in count) {
                    if (typeof count[k]==='number'&&isNaN(count[k])) count[k] = 0;
                    if(k.includes('Rate')){
                        let rateStr=k.replace(/[a-z]*Rate/,'');
                        game.xjb_countCharWin(playerName,rateStr);
                    }
                };
                return count;
            }
            game.xjb_countCharAttAdd = function (playerName, att) {
                let count = game.xjb_countCharOne(playerName)
                if (!count[att]) count[att] = 0;
                count[att]++;
                return count;
            }
            game.xjb_countCharRate = function (playerName, rate) {
                let count = game.xjb_countCharOne(playerName)
                let rateNum=(count["win" + rate] * 100) / count["playedTimes" + rate]
                count["winRate" + rate] = rateNum.toFixed(2) + "%";
                return count;
            }
            game.xjb_countCharWin = function (player, num, win) {
                let list = [
                    ["zhu", "fan", "zhong", "nei", ...lib.group],
                    ["zhu", "fan", "zhong", "nei"],
                    ["landlord", "farmer"],
                    ["", "", "", "", ...lib.group]
                ];
                let index = list[0].indexOf(player.identity);
                let count = game.xjb_countCharOne(player.name1);
                if (!count) return;
                if (index >= 0) {
                    const identityName = list[num][index];
                    const wintimes = count['win' + num];
                    const wintimesI = count['win_' + identityName];
                    const playedTimes = count['playedTimes' + num];
                    const playedTimesI = count['playedTimes_' + identityName];
                    if (wintimes > playedTimes) count['playedTimes' + num] = wintimes;
                    if (wintimesI > playedTimesI) count['playedTimes_' + identityName] = wintimesI;
                    if (win) {
                        game.xjb_countCharAttAdd(player.name, 'win' + num);
                        game.xjb_countCharAttAdd(player.name, 'win_' + identityName);
                    }
                    game.xjb_countCharAttAdd(player.name, 'playedTimes' + num);
                    game.xjb_countCharAttAdd(player.name, 'playedTimes_' + identityName);
                }
                game.xjb_countCharOne(player.name);
                game.xjb_winTitle(player.name, num);
                game.xjb_countCharSave();
            }
            game.xjb_createWinObserver = function (player, num) {
                return function wonderfulFrame() {
                    if (!ui.dialog || !ui.dialog.content || !ui.dialog.content.firstChild) return;
                    let judge = ui.dialog.content.firstChild.innerHTML;
                    if (judge === "战斗胜利") {
                        game.xjb_countCharWin(player, num, true)
                    }
                    if (judge === "战斗失败" || judge === "战斗结束") {
                        game.xjb_countCharWin(player, num)
                    }
                    cancelAnimationFrame(wonderfulFrame)
                }
            };
            game.xjb_winTitle = function (playerName, num) {
                const conditionTitleList = [
                    [8, 25, 1, () => ["shen_ganning", "re_xusheng"].includes(playerName)],
                    [9, 100, 1, () => ["shen_ganning", "re_xusheng"].includes(playerName)],
                    [10, 250, 1, () => ["shen_ganning", "re_xusheng"].includes(playerName)],
                    [11, 25, 2, () => ["shen_ganning", "re_xusheng"].includes(playerName)],
                    [12, 100, 2, () => ["shen_ganning", "re_xusheng"].includes(playerName)],
                    [13, 250, 2, () => ["shen_ganning", "re_xusheng"].includes(playerName)],
                ]
                let count = game.xjb_countCharOne(playerName)
                conditionTitleList.forEach(k => {
                    let titleNum = k[0], requirement = k[1], filedNum = k[2], callback = k[3];
                    if (num === filedNum && count["win" + filedNum] >= requirement && !lib.config.xjb_title[titleNum][1].includes(playerName) && callback()) {
                        game.xjb_titleGain(playerName, titleNum)
                    }
                })
            };
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