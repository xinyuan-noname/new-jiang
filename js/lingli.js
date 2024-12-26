import "./lingli/event.mjs"
import './lingli/gSkill.mjs'
window.XJB_LOAD_LINGLI = function (_status, lib, game, ui, get, ai) {
    lib.skill.xjb_11 = {
        saturation: function () {
            //血色空间   
            lib.skill.xjb_P_blood = {
                init: function (player) {
                    player.storage.lingliPosition = "blood"
                    player.xjb_updateLingli()
                },
                onremove: function (player) {
                    player.storage.lingliPosition = "air"
                    player.xjb_updateLingli()
                },
                trigger: {
                    player: ['phaseBegin', 'phaseEnd']
                },
                filter: function (event, player) {
                    return player.storage.lingliPosition === "blood"
                },
                direct: true,
                content: function () {
                    switch (event.triggername) {
                        case 'phaseBegin': {
                            ui.xjb_giveStyle(ui.background, {
                                'background-image': "url('" + lib.xjb_src + "image/position/redSpace.jpg')"
                            })
                            player.addTempSkill("xin_guimeng_1")
                        }; break;
                        case 'phaseEnd': {
                            ui.xjb_giveStyle(ui.background, {
                                'background-image': game.xjb_PreBackImage
                            })
                        }; break;
                    }
                }
            }
            //聚灵区
            lib.skill.xjb_P_gathering = {
                init: function (player) {
                    player.storage.lingliPosition = "gathering"
                    player.xjb_updateLingli()
                    player.node.xjb_gathering = ui.create.div(".xjb_gathering", player)
                },
                onremove: function (player) {
                    player.storage.lingliPosition = "air"
                    player.xjb_updateLingli()
                    if (player.node.xjb_gathering) {
                        player.node.xjb_gathering.remove();
                        player.node.xjb_gathering = undefined;
                    }
                },
                trigger: {
                    player: ['damageBegin']
                },
                filter: function (event, player) {
                    return player.storage.lingliPosition === "gathering" && player.countMark("_xjb_moli") >= (2 * event.num) && event.getParent().name !== "xjb_lingHit"
                },
                direct: true,
                content: function () {
                    "step 0"
                    event.num = trigger.num
                    "step 1"
                    switch (event.triggername) {
                        case 'damageBegin': {
                            trigger.cancel()
                            let next = game.createEvent('xjb_lingHit');
                            next.player = trigger.source;
                            next.target = trigger.player;
                            next.nature = trigger.nature;
                            next.setContent(function () {
                                target.xjb_addlingli()
                                target.damage(player, event.nature)
                            })
                        }; break;
                    }
                    event.num--
                    "step 2"
                    if (event.num > 0) event.goto(1)
                }
            }
        },
        count: function () {
            game.xjb_haveDaomo = game.xjb_hasDaomo = function (name) {
                if (typeof name != 'string') name = name.name
                var list = []
                if (!lib.config.xjb_count[name]) return false;
                let dataSource = lib.config.xjb_count[name].daomo
                if (typeof dataSource != "object") return false
                list = Object.keys(dataSource).filter(i => {
                    return dataSource[i].number > 0
                })
                return list.length > 0;
            }
            game.xjb_getDaomo = game.xjb_addDaomo = function (player, type, add = 1) {
                if (typeof player != 'string') player = player.name
                if (!lib.config.xjb_count[player]) return;
                if (!lib.config.xjb_count[player].daomo) lib.config.xjb_count[player].daomo = {}
                if (!lib.config.xjb_count[player].daomo[type]) lib.config.xjb_count[player].daomo[type] = get.xjb_daomoInformation(type)
                if (!lib.config.xjb_count[player].daomo[type].number) lib.config.xjb_count[player].daomo[type].number = 0
                lib.config.xjb_count[player].daomo[type].number += add
                game.saveConfig("xjb_count", lib.config.xjb_count)
            }
            get.xjb_daomoInformation = function (type) {
                let list = {
                    blood: {
                        translation: "杜鹃",
                        intro: "失去体力导魔介质"
                    },
                    sun: {
                        translation: "金乌",
                        intro: "火属性导魔介质"
                    },
                    dragon: {
                        translation: "龙女",
                        intro: "雷属性导魔介质"
                    },
                    taoyao: {
                        translation: "桃妖",
                        intro: "恢复体力导魔介质"
                    },
                    tear: {
                        translation: "雪女",
                        intro: "冰属性导魔介质"
                    },
                    xuemo: {
                        translation: "血魔",
                        intro: "体力牌导魔介质"
                    },
                    flower: {
                        translation: "百花",
                        intro: "花属性导魔介质"
                    }
                }
                if (list[type]) return { ...list[type] }
                return {
                    translation: "",
                    intro: ""
                }
            }
        },
        transform: function () {
            lib.skill.xin_guimeng = {
                subSkill: {
                    "1": {
                        trigger: {
                            player: "useCard",
                        },
                        filter: function (event, player) {
                            let info = lib.card[event.card.name]
                            if (info.notarget || info.contentBefore || info.contentAfter) return false;
                            return info.content;
                        },
                        direct: true,
                        content: function () {
                            player.removeSkill("xin_guimeng_2")
                            let info = lib.skill["xin_guimeng_2"]
                            info.trigger.player = trigger.card.name + "Before"
                            player.addTempSkill("xin_guimeng_2", { player: "xin_guimeng_2After" })
                        },
                        sub: true,
                    },
                    "2": {
                        trigger: {
                            player: "taoBefore",
                        },
                        direct: true,
                        card: ["sha", "juedou", "wuzhong", "guohe", "huogong", "tao"],
                        content: function () {
                            let card = [...lib.skill["xin_guimeng_2"].card]
                            card.remove(trigger.name)
                            let cardname = card.randomGet()
                            trigger.content = lib.init.parsex(lib.card[cardname].content);
                            game.log(trigger.card, "因混乱变为" + get.translation(cardname));
                        },
                        sub: true,
                    },
                },
            }
            lib.translate.xin_guimeng = "血梦"
            lib.translate.xin_guimeng_info = "你使用牌时，该牌效果变为【杀】【桃】【决斗】【火攻】【过河拆桥】【无中生有】中的一种"
            lib.skill.xjb_soul_lingqiang = {
                enable: "phaseUse",
                filter: function (event, player) {
                    return player.countMark("_xjb_moli") > 0
                },
                filterTarget: function (card, player, target) {
                    return player != target
                },
                position: "he",
                filterCard: true,
                content: function () {
                    "step 0"
                    player.removeMark("_xjb_moli")
                    game.playAudio().src = lib.xjb_src + "audio/fire1.mp3"
                    let next = game.createEvent('xjb_lingHit');
                    next.player = player;
                    next.target = target
                    next.setContent(function () {
                        target.popup("命中！")
                        target.xjb_addlingli();
                        target.xjb_eventLine(2);
                    })
                },
                ai: {
                    basic: {
                        order: 9,
                    },
                    result: {
                        target: function (player, target) {
                            return -1
                        },
                    },
                },
            }
            lib.translate.xjb_soul_lingqiang = "灵枪"
            lib.translate.xjb_soul_lingqiang_info = "出牌阶段，你可以销毁一张牌，然后将产生的1Ch魔力(1C)发射之。"
        },
        moliSkill: function () {
            // lib.skill._xjb_soul_daomo = {
            //     enable: "phaseUse",
            //     usable: 1,
            //     filter: function (event, player) {
            //         if (!lib.config.xjb_lingli_Allallow) return !(!lib.characterPack['xjb_soul'][player.name1])
            //         return game.xjb_hasDaomo(player)
            //     },
            //     filterTarget: function (card, player, target) {
            //         return player != target;
            //     },
            //     content: function () {
            //         "step 0"
            //         player.xjb_chooseToBuildBridge(target)
            //     },
            //     ai: {
            //         basic: {
            //             order: 9,
            //         },
            //         result: {
            //             target: function (player, target) {
            //                 if (target.countMark("_xjb_lingli") >= player.countMark("_xjb_lingli")) return 0
            //                 return -1
            //             },
            //         },
            //     },
            // }
            // lib.translate._xjb_soul_daomo = "<span data-nature=xjb_hun><font color=white>导魔</font></span>"
        },
        play: function () {
            lib.soul = {}
            lib.soul.xjb_chanter = () => {
                if (!lib.config.xjb_count.xjb_chanter.dialog) lib.config.xjb_count.xjb_chanter.dialog = {}
                let chanter = lib.xjb_src + "soul_chanter.jpg";
                let chanter2 = lib.xjb_src + "soul_chanter2.jpg";
                let library = lib.xjb_src + "position/library.jpg";
                let LH = lib.xjb_src + lib.config.xjb_newcharacter.selectedSink.slice(8);
                let myName = lib.config.xjb_newcharacter.name2;
            }
        },
        linglichang: function () {
            lib.xjb_lingli = window.xjb_lingli = {
                daomo: {
                    type: ["sun", "dragon", "blood", "tear", "taoyao", "xuemo", "flower"],
                    event: {
                        "sun": "xjb_fire",//金乌
                        "dragon": "xjb_thunder",//龙女
                        "blood": "loseHp",//杜鹃
                        "tear": "xjb_ice",//雪女
                        "taoyao": "xjb_recover",//桃妖
                        "xuemo": "giveHpCard2",//血魔
                        "flower": "xjb_flower",//百花
                    },
                    event_mark: {},
                    //检测是否有导魔介质
                    test: function (player) {
                        return this.type.some(type => player.hasMark("_xjb_daomo_" + type));
                    },
                    //列出一名角色的导魔介质
                    list: function (player) {
                        let array = []
                        for (let i = 0; i < this.type.length; i++) {
                            if (player.hasMark("_xjb_daomo_" + this.type[i]))
                                array.push("_xjb_daomo_" + this.type[i])
                        }
                        return array
                    },
                    //匹配所有有导魔介质的角色
                    find: function (player) {
                        let arr = []
                        game.countPlayer(current => {
                            if (current == player) return false
                            if (this.test(current)) arr.push(current)
                        })
                        return arr
                    }
                },
                event: {
                    "+2": ["loseHp", "loseMaxHp",
                        "xjb_recover",
                        "xjb_fire", "xjb_ice", "xjb_thunder",
                        "giveHpCard2"],
                    "-2": ["recover", "gainMaxHp"],
                    "+1": ["xjb_cardDeath"],
                    "-1": ["xjb_cardBirth"],
                    match: function (num) {
                        let list = ["-2", "+2", "-1", "+1"]
                        let now = list.randomGet(), eventLine = [], translateLine = []
                        eventLine.push(this[now].randomGet())
                        now = Number(now)
                        while (now != num) {
                            if (eventLine.includes('xjb_recover')) eventLine.remove("xjb_recover")
                            if (eventLine.length > 3) return this.match(num)
                            let add = list.randomGet()
                            let get = this[add].randomGet();
                            let index = this[add].indexOf(get);
                            eventLine.push(get);
                            game.print(add, index);
                            translateLine.push(xjb_lingli.translate[add][index]);
                            now += Number(add);
                        }
                        eventLine.translateLine = translateLine
                        return eventLine
                    },
                    find: function (event) {
                        let list = ["-2", "+2", "-1", "+1"];
                        let result
                        list.forEach(i => {
                            if (this[i].includes(event)) result = i
                        })
                        return Number(result)
                    }
                },
                translate: {
                    "+2": ["灵逝", "灵罚",
                        "借生",
                        "灵灼", "灵霜", "灵震",
                        "摄魂"],
                    "-2": ["灵愈", "延限"],
                    "+1": ["灭牌"],
                    "-1": ["生牌"],
                },
                //
                gathering: {
                    M: -2520,
                },
                //血色空间
                blood: {
                    M: -10080
                },
                //空气
                air: {
                    M: -5040,
                },
                //灵力场
                area: {
                    M: 5040,
                    "ΣL": 1024,
                    S: {
                        S0: 0,
                        S1: 2,
                        S2: 14,
                        S3: 38,
                        S4: 74,
                        S5: 122,
                        S6: 182,
                        S7: 254,
                        S8: 338
                    },
                }
            }
            xjb_lingli.area.countL = () => {
                let S = xjb_lingli.area.S
                return S.S0 + S.S1 + S.S2 + S.S3 + S.S4 + S.S5 + S.S6 + S.S7 + S.S8
            }
            xjb_lingli.updateK = str => {
                let lg = (x) => {
                    let ln = Math.log
                    return ln(x) / ln(10)
                }
                let pow = Math.pow, L = xjb_lingli.area["ΣL"],
                    M1 = xjb_lingli.area.M, M2 = xjb_lingli[str].M, abs = Math.abs
                xjb_lingli[str].K = pow(10, (lg(L) * 2 * M1 / abs(M1 - M2)) + 1 - lg(L))
                return xjb_lingli[str].K
            }
            xjb_lingli.air.updateK = () => {
                xjb_lingli.updateK("air")
                return xjb_lingli.air.K
            }
            xjb_lingli.air.updateK()
            xjb_lingli.updateK("blood")
            xjb_lingli.updateK("gathering")
            xjb_lingli.area["updateΔL"] = () => {
                let S = xjb_lingli.area.S
                xjb_lingli.area["ΔL"] = [];
                xjb_lingli.area["ΔL"][0] = S.S1 - S.S0
                xjb_lingli.area["ΔL"][1] = S.S2 - S.S1
                xjb_lingli.area["ΔL"][2] = S.S3 - S.S2
                xjb_lingli.area["ΔL"][3] = S.S4 - S.S3
                xjb_lingli.area["ΔL"][4] = S.S5 - S.S4
                xjb_lingli.area["ΔL"][5] = S.S6 - S.S5
                xjb_lingli.area["ΔL"][6] = S.S7 - S.S6
                xjb_lingli.area["ΔL"][7] = S.S8 - S.S7
            }
            xjb_lingli.area["updateΔL"]()
            xjb_lingli.area["updateV"] = () => {
                let S = xjb_lingli.area.S
                xjb_lingli.area.V = {
                    V0: S.S0 / 2,
                    V1: S.S1 / 2,
                    V2: S.S2 / 2,
                    V3: S.S3 / 2,
                    V4: S.S4 / 2,
                    V5: S.S5 / 2,
                    V6: S.S6 / 2,
                    V7: S.S7 / 2,
                    V8: S.S8 / 2
                }
                let V = xjb_lingli.area["V"]
                xjb_lingli.area["ΔV"] = [];
                xjb_lingli.area["ΔV"][0] = V.V1 - V.V0
                xjb_lingli.area["ΔV"][1] = V.V2 - V.V1
                xjb_lingli.area["ΔV"][2] = V.V3 - V.V2
                xjb_lingli.area["ΔV"][3] = V.V4 - V.V3
                xjb_lingli.area["ΔV"][4] = V.V5 - V.V4
                xjb_lingli.area["ΔV"][5] = V.V6 - V.V5
                xjb_lingli.area["ΔV"][6] = V.V7 - V.V6
                xjb_lingli.area["ΔV"][7] = V.V8 - V.V7
            }
            xjb_lingli.area["updateV"]()
            xjb_lingli.area["updateW"] = () => {
                let L = xjb_lingli.area["ΔL"], M = xjb_lingli.area.M
                xjb_lingli.area["W"] = {};
                xjb_lingli.area["W"]["0"] = M / L[0]
                xjb_lingli.area["W"]["1"] = M / L[1]
                xjb_lingli.area["W"]["2"] = M / L[2]
                xjb_lingli.area["W"]["3"] = M / L[3]
                xjb_lingli.area["W"]["4"] = M / L[4]
                xjb_lingli.area["W"]["5"] = M / L[5]
                xjb_lingli.area["W"]["6"] = M / L[6]
                xjb_lingli.area["W"]["7"] = M / L[7]
            }
            xjb_lingli.area["updateW"]()
            xjb_lingli.update = () => {
                xjb_lingli.area["updateΔL"]()
                xjb_lingli.air.updateK()
                xjb_lingli.area["updateV"]()
                xjb_lingli.area["updateW"]()
            }
            xjb_lingli.area["fanchan"] = num => {
                let area = xjb_lingli.area;
                let S = area.S;
                let count = 0
                function check(num1, num2) {
                    return (area.countL() <= num1) && (area.countL() > num2);
                }
                function isNature(arr) {
                    let array = []
                    for (let i = 0; i < arr.length; i++) {
                        array[i] = 0 + (arr[i] % 1 === 0)
                    }
                    return Math.min(...array)
                }
                xjb_lingli.update()
                function linglilose(num1, num2, str1) {
                    if (check(num1, num2)) while (num > 0 && check(num1, num2)) {
                        if (area.countL() <= 72) return;
                        S[str1] -= 2;
                        count += 2;
                        xjb_lingli.update()
                        if (isNature(Object.values(area.W))) num--
                        if (area.countL() <= 72) return;
                    }
                }
                //
                linglilose(1024, 942, "S8")
                linglilose(942, 872, "S7")
                linglilose(872, 814, "S6")
                linglilose(814, 768, "S5")
                linglilose(768, 734, "S4")
                linglilose(734, 712, "S3")
                linglilose(712, 702, "S2")
                //
                linglilose(702, 632, "S8")
                linglilose(632, 574, "S7")
                linglilose(574, 528, "S6")
                linglilose(528, 494, "S5")
                linglilose(494, 472, "S4")
                linglilose(472, 462, "S3")
                //
                linglilose(462, 404, "S8")
                linglilose(404, 358, "S7")
                linglilose(358, 324, "S6")
                linglilose(324, 302, "S5")
                linglilose(302, 292, "S4")
                //
                linglilose(292, 246, "S8")
                linglilose(246, 212, "S7")
                linglilose(212, 190, "S6")
                linglilose(190, 180, "S5")
                //
                linglilose(180, 146, "S8")
                linglilose(146, 124, "S7")
                linglilose(124, 114, "S6")

                linglilose(114, 92, "S8")
                linglilose(92, 82, "S7")
                linglilose(82, 72, "S8")
                return count
            }
        },
        logo: function () {
            let createLogo = (str, size) => {
                let div = document.createElement("div")
                let i = document.createElement("i")
                i.style.display = "block";
                i.setAttribute("size", size + "px")
                i.style.height = size + "px";
                i.style.width = size + "px";
                i.style.backgroundImage = `url(${lib.xjb_src + str})`;
                i.style.backgroundSize = "contain"
                div.appendChild(i)
                return div.innerHTML
            }
            window.xjbLogo = {
                taoyao: size => createLogo("lingli/taoyao.jpg", size),
                blood: size => createLogo("lingli/blood.jpg", size),
                dragon: size => createLogo("lingli/dragon.jpg", size),
                tear: size => createLogo("lingli/tear.jpg", size),
                sun: size => createLogo("lingli/sun.jpg", size),
                xuemo: size => createLogo("lingli/xuemo.jpg", size),
                flower: size => createLogo("lingli/flower.jpg", size),
            }
        },
        Marks: function () {
            xjb_lingli.daomo.type.forEach(i => {
                lib.skill["_xjb_daomo_" + i] = {
                    marktext: xjbLogo[i](20),
                    intro: {
                        name: xjbLogo[i](230),
                        content: function (storage, player, skill) {
                            return "能量值:" + storage + "C"
                        },
                    }
                }
                xjb_lingli.daomo.event_mark["_xjb_daomo_" + i] = xjb_lingli.daomo.event[i]
            })
            lib.skill._xjb_daomo_xuemo = {
                marktext: xjbLogo.xuemo(20),
                intro: {
                    name: xjbLogo.xuemo(230),
                    content: function (storage, player, skill) {
                        return "能量值:" + storage + "C"
                    },
                }
            }
        }
    }
}