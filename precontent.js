import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../noname.js";
import {
    xjb_library
} from "./js/library.js";
import {
    LOAD_GAME_TETRIS
} from "./js/game/tetris.js"
import {LOAD_HPCARD} from "./js/feature/hpCard.js";
import { LOAD_REMNANT_AREA } from "./js/feature/remnantArea.js";
import "./js/interact/dialog.mjs"
import "./js/interact/ui.mjs"
function provideFunction() {
    lib.xjb_dataGet = function () {
        return Object.keys(lib.config).filter(function (a) {
            return a.includes("xjb_");
        })
    }
    game.xjb_setEvent = function (name, { player, content }) {
        lib.element.player[name] = get.copy(player)
        lib.element.content[name] = get.copy(content)
    }
    game.xjb_addPlayerMethod = function (name, method) {
        lib.element.player[name] = get.copy(method)
    }
    game.xjb_judgeSkill = {
        Tri_logSkill: function (skill) {
            const info = get.info(skill);
            if (!info.trigger) return false;
            if (!info.content) return false;
            if (info.direct && !info.content.toString().includes("logSkill")) return false;
            if (info.popup === false && !info.content.toString().includes("logSkill")) return false;
            return true;
        },
        enableNotView: function (skill) {
            const info = get.info(skill);
            if (!info.enable) return false;
            if (info.viewAs) return false;
            return true;
        }
    }
    game.xjb_bossLoad = function (str, player) {
        if (_status.timeout) game.pause()
        if (!player) player = game.me
        if (!str) str = "0000"
        lib.skill.xjb_theLevel.theLevel[str].init(player)
    }
    game.xjb_filterData = function (Array) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                game.xjb_filterData(arguments[i])
            }
            return;
        }
        var target = lib
        for (var i = 0; i < Array.length; i++) {
            target = target[Array[i]]
        }
        var list = {}
        for (var i in target) {
            if (target[i] != null) list[i] = target[i]
        }
        target = list
        return target
    }
    game.xjb_gainJP = function (str, boolean, turn = 1) {
        switch (str) {
            //有技能槽则获得，消耗能量
            case "技能(1个)": {
                var list = get.xjb_allHunSkills();
                var willget = list.randomGet();
                if (game.xjb_condition(3, 1)) {
                    game.xjb_create.alert('你获得了技能' + get.translation(willget))
                    lib.config.xjb_newcharacter.skill.add(willget)
                    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                    game.xjb_systemEnergyChange(-20)
                }
                else {
                    game.xjb_getHunbi(8, void 0, true, true)
                    game.xjb_create.alert("请确保你有获得技能的能力！已退还8魂币")
                }
            }; break
            case "称号(1个)": {
                game.xjb_newCharacterGetTitle(1 * turn)
            }; break
            case "技能槽(1个)": {
                game.xjb_newCharacterAddJnc(1 * turn)
            }; break
            case "体力卡(1张，3点)": {
                game.xjb_getHpCard('xjb_newCharacter', 3, turn)
            }; break
            case "体力卡(1张，1点)": {
                game.xjb_getHpCard('xjb_newCharacter', 1, turn)
            }; break
            case "体力值(1点)": {
                game.xjb_newCharacterAddHp(1 * turn, boolean)
            }; break
            case "免费更改势力": case "择木卡一张": {
                game.xjb_newCharacterChangeGroup(1 * turn, boolean)
            }; break
            case "免费更改性别": case "性转卡一张": {
                game.xjb_newCharacterChangeSex(1 * turn, boolean)
            }; break
            case "免费更改姓名": {
                game.xjb_newCharacterChangeName(1 * turn)
            }; break
            default: {
                //替换处1
                var num = parseInt(str, 10)
                if (str.indexOf("打卡点数+") === 0) {
                    let dakadianAdded = str.replace("打卡点数+", "")
                    game.xjb_addDakadian(dakadianAdded * turn, boolean)
                }
                else if (Object.keys(lib.skill).includes(str)) {
                    if (game.xjb_condition(3, 1)) {
                        game.xjb_create.alert('你获得了技能' + get.translation(str))
                        lib.config.xjb_newcharacter.skill.add(str)
                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                        game.xjb_systemEnergyChange(-20)
                    }
                }
                else if (num != NaN) {
                    game.xjb_getHunbi(num, turn, boolean, false, 'Bonus')
                }
            }; break
        }

    }
    game.xjb_getCurrentDate = function (boolean) {
        var date = new Date()
        var a = date.getFullYear(), b = date.getMonth() + 1, c = date.getDate(), d = date.getHours(), e = date.getMinutes()
        if (boolean) {
            var d = date.getDay()
            return d === 0 ? 7 : d
        }
        return [a, b, c, d, e]
    };
    game.xjb_newcharacter_zeroise = function () {
        lib.config.xjb_newcharacter.name2 = '李华'
        lib.config.xjb_newcharacter.sex = 'male';
        lib.config.xjb_newcharacter.group = 'qun';
        lib.config.xjb_newcharacter.hp = 1;
        lib.config.xjb_newcharacter.skill = [];
        lib.config.xjb_newcharacter.intro = '';
        lib.config.xjb_newcharacter.sink = [];
        lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
    }
    game.zeroise_xjbCount = function (target) {
        lib.config.xjb_count[target.name1] = {
            kill: 0,
            thunder: 0,
            fire: 0,
            ice: 0,
            loseMaxHp: 0,
            gainMaxHp: 0,
            HpCard: [],
            uniqueSkill: []
        }
    }


    //技能=object(强制技恢复)
    game.xjb_EqualizeSkillObject = function (string1, object2) {
        lib.skill[string1] = {}
        var list = Object.keys(object2)
        for (var i = 0; i < list.length; i++) {
            lib.skill[string1][list[i]] = object2[list[i]]
        }
        return lib.skill[string1]
    }
    game.xjb_choujiangStr = function (object, num) {
        let willget = JSON.stringify(object);
        willget = willget.replace(/\"|'/g, "");
        if (num && num === 1) {
            willget = willget.replace(/\{|}/g, "");
            willget = willget.replace(/\gainMaxHp/g, "获得体力上限");
            willget = willget.replace(/\loseMaxHp/g, "失去体力上限");
            willget = willget.replace(/\uniqueSkill/g, "特殊技能");
            willget = willget.replace(/\HpCard/g, "体力牌");
            willget = willget.replace(/\,/g, "<br>");
        } else {
            willget = willget.replace(/\*/g, "%<br>");
            willget = willget.replace(/\{|}/g, "<hr>");
            willget = willget.replace(/\,|100/g, "");
            willget = willget.replace(/\,|1?00/g, "");
        }
        return willget
    }
    //get函数
    //新将包翻译
    get.xjb_translation = function (target) {
        if (Array.isArray(target)) {
            var spare = []
            for (var i = 0; i < target.length; i++) {
                spare.push(get.xjb_translation(target[i]))
            }
            return spare
        }
        var translation
        var list1 = Object.keys(lib.xjb_list_xinyuan.translate)
        var list2 = Object.values(lib.xjb_list_xinyuan.translate)
        for (var i = 0; i < list1.length; i++) {
            if (list1[i] == target) translation = list2[i]
            if (list2[i] == target) translation = list1[i]
        }
        if (!translation) {
            translation = []
            var list3 = Object.keys(lib.translate)
            var list4 = Object.values(lib.translate)
            for (var i = 0; i < list3.length; i++) {
                if (list4[i] == target) translation.push(list3[i])
                if (list3[i] == target) {
                    translation = list4[i]
                }
            }
        }
        if (typeof target === 'number') translation = get.xjb_number(target)
        if (Array.isArray(translation) && translation.length === 0) return target
        return translation
    }
}
function way() {
    //新将包路径来源     
    if (document.body.outerHTML) {
        let srcs = Array.from(document.scripts).map(function (a) {
            if (a.outerHTML.indexOf('extension') > -1) return a.src;
        }).filter(a => a)
        let src = srcs[0];
        if (srcs) {
            src = src.replace("/extension.js", "");
            let i = src.lastIndexOf("/");
            src = src.slice(0, i);
            src += "/新将包/";
            lib.xjb_src = src;
        }
    }
    if (!lib.config.xjb_fileURL) {
        const initWay = localStorage.getItem("noname_inited");
        lib.config.xjb_fileURL = `${initWay}extension/新将包/`;
        if (initWay === "nodejs") lib.config.xjb_fileURL = lib.xjb_src;
    }
    lib.xjb_fileURL = lib.config.xjb_fileURL;
}
function importFile() {
    let count = 0;
    const files = ["event", "lingli", "skills", "card",
        "project", "rpg", "translate", "character", "economy", "math", "raise"];
    function loadFiles(fileName) {
        let script = lib.init.js(lib.xjb_src + "js", fileName, () => {
            window[`XJB_LOAD_${fileName.toUpperCase()}`](_status, lib, game, ui, get, ai);
            count++;
        }, (err) => { game.print(err) });
        script.type = 'module';
    }
    new Promise(res => {
        //引入css文件    
        lib.init.css(lib.xjb_src + "css", "css1", () => {
            game.print("样式表引入成功——新将包")
        }, (err) => {
            game.print("样式表引入失败——新将包");
            game.print(err)
        })
        //引入js文件
        files.forEach(file => {
            loadFiles(file)
        })
        lib.init.js(lib.xjb_src + "js", "Xskill", () => {
            window.XJB_LOAD_Xskill(_status, lib, game, ui, get, ai)
            count++;
        })
        lib.init.js(lib.xjb_src + "js", "title", () => {
            window.XJB_LOAD_title(_status, lib, game, ui, get, ai)
            count++;
        })
        function interval() {
            if (count >= files.length + 2) {
                res()
                clearInterval(interval)
            }
        }
        setInterval(interval, 100)
    }).then(() => {
        lib.init.js(lib.xjb_src + "js", "final", () => {
            window.XJB_LOAD_FINAL(_status, lib, game, ui, get, ai)
        })
    })
    //引入api
    game.xjb_loadAPI = function (suc = () => void 0, fail = () => void 0) {
        if (window.xjb_xyAPI) {
            alert('工具已引入,无需重新引入!');
            return;
        }
        game.download(
            'https://gitee.com/xinyuanwm/xy-api/raw/master/xjb_xyAPI.js',
            'extension/新将包/xjb_xyAPI.js',
            () => {
                lib.init.js(
                    lib.xjb_src.slice(0, -1),
                    "xjb_xyAPI",
                    load => {
                        game.print('xjb_xyAPI加载成功');
                        xjb_xyAPI.setGameData(lib, game, ui, get, ai, _status);
                        xjb_xyAPI.autoAddExtension(
                            '新将包',
                            'https://gitee.com/xinyuanwm/new-jiang/raw/master/'
                        );
                        suc(load);
                    },
                    (err) => {
                        game.print('xjb_xyAPI加载失败');
                        game.print(err)
                        fail(err);
                    });
            },
            (err) => {
                fail(err)
            }
        );
    };
    if (navigator.connection.type == 'wifi') game.xjb_loadAPI(void 0, () => { game.print("xjb_xyAPI未成功引入") });
}
function initialize() {
    //设置刘徽-祖冲之祖项目
    //设置参数π、e、Φ，这些参数越大越精确
    if (!lib.config.xjb_π) {
        lib.config.xjb_π = 6
    }
    if (!lib.config.xjb_e) {
        lib.config.xjb_e = 1
    }
    if (!lib.config.xjb_Φ) {
        lib.config.xjb_Φ = 1
    }
    //设置技能标签
    if (!lib.config.xjb_skillTag_Character) lib.config.xjb_skillTag_Character = []
    if (!lib.config.xjb_skillTag_Skill) lib.config.xjb_skillTag_Skill = {}
    //设置xjb_redSkill
    if (!lib.config.xjb_redSkill) lib.config.xjb_redSkill = { list: [], skill: {}, translate: {} }
    //设置物品
    if (!lib.config.xjb_objects) lib.config.xjb_objects = {}
    //设置技能槽
    if (!lib.config.xjb_jnc || typeof lib.config.xjb_jnc != 'number') lib.config.xjb_jnc = 0
    //设置打卡，第一行用于记录年月日及次数，第二行记录打卡点
    if (!lib.config.xjb_hundaka) lib.config.xjb_hundaka = [0, 0, 0, 0]
    if (!lib.config.xjb_hundaka2 || typeof lib.config.xjb_hundaka2 != 'number') lib.config.xjb_hundaka2 = 0
    //设置抽奖类型
    if (!lib.config.cjb_cj_type) lib.config.cjb_cj_type = "1";
    //设置系统能量
    if (lib.config.xjb_systemEnergy == undefined) lib.config.xjb_systemEnergy = 50;
    if (lib.config.xjb_systemEnergy > 5e8) lib.config.xjb_systemEnergy = 5e8;
    if (isNaN(lib.config.xjb_systemEnergy)) lib.config.xjb_systemEnergy = 0;
    //设置魂币
    if (lib.config.xjb_hunbi !== undefined) {
        if (lib.config.xjb_hunbi > 5e7) lib.config.xjb_hunbi = 5e7;
        if (isNaN(lib.config.xjb_hunbi)) lib.config.xjb_hunbi = 1;
    }
    if (!lib.config.xjb_hunbiLog) lib.config.xjb_hunbiLog = "";
    //设置称号
    if (!lib.config.xjb_title) {
        lib.config.xjb_title = [];
    }
    if (!lib.config.xjb_count) lib.config.xjb_count = {}

    //设置养成角色
    if (!lib.config.xjb_newcharacter) {
        lib.config.xjb_newcharacter = {}
    }
    if (!lib.config.xjb_newcharacter.name2) lib.config.xjb_newcharacter.name2 = '李华';
    if (!lib.config.xjb_newcharacter.sex) lib.config.xjb_newcharacter.sex = 'male';
    if (!lib.config.xjb_newcharacter.group) lib.config.xjb_newcharacter.group = 'qun';
    if (!lib.config.xjb_newcharacter.hp || typeof lib.config.xjb_newcharacter.hp != 'number') lib.config.xjb_newcharacter.hp = 1;
    if (lib.config.xjb_newcharacter.hp > 8) lib.config.xjb_newcharacter.hp = 8
    if (!lib.config.xjb_newcharacter.skill) lib.config.xjb_newcharacter.skill = [];
    if (!lib.config.xjb_newcharacter.intro) lib.config.xjb_newcharacter.intro = '';
    if (!lib.config.xjb_newcharacter.sink) lib.config.xjb_newcharacter.sink = [];
    if (!lib.config.xjb_newcharacter.selectedSink) lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
    //设置存档
    if (!lib.config.xjb_myStorage) {
        lib.config.xjb_myStorage = {
            total: 0,
        }
    }
    if (lib.config.xjb_cardStore === void 0) lib.config.xjb_cardStore = true;
    if (lib.config.xjb_lingli_Allallow === void 0) lib.config.xjb_lingli_Allallow = false;
    //设置变身
    lib.config.xjb_bianshenCharacter = {};
    //设置增加到牌堆的卡牌
    if (!lib.config.xjb_cardAddToPile) lib.config.xjb_cardAddToPile = {}
    //设置列表
    lib.xjb_hunList = lib.config.xjb_list_hunbilist = {
        skill: {},
        choujiang: {},
    }
    //选项    
    lib.xjb_list_xinyuan = {
        _order: {
            win_fan: 33.7,
            win_zhong: 33.3,
            win_nei: 33.5,
            win_zhu: 33.1,
            playedTimes_fan: 33.6,
            playedTimes_zhu: 33,
            playedTimes_zhong: 33.2,
            playedTimes_nei: 33.4,
            winRate_fan: 33.71,
            winRate_zhong: 33.31,
            winRate_nei: 33.51,
            winRate_zhu: 33.11,
            win1: 32,
            playedTimes1: 31,
            winRate1: 32.1,
            win2: 42,
            playedTimes2: 41,
            winRate2: 43,
            win_farmer: 44,
            playedTimes_farmer: 44.1,
            winRate_farmer: 44.2,
            win_landlord: 45,
            playedTimes_landlord: 45.1,
            winRate_landlord: 45.2,
            win3: 52,
            playedTimes3: 51,
            winRate3: 53,
            strongDamage: 10,
            ice: 13,
            fire: 11,
            thunder: 12,
            kami: 14,
            "kill": 1,
            "recover": 20,
            "loseHp": 21,
            "loseMaxHp": 22,
            "gainMaxHp": 23,
        },
        translate: {
            //count翻译
            lingfa: "灵法",
            kind: "种族",
            lingtan: "灵弹",
            selectedTitle: "当前称号",
            strongDamage: "重伤害",
            ice: "冰属性伤害",
            fire: "火属性伤害",
            thunder: "雷属性伤害",
            kami: "神属性伤害",
            "kill": "击杀人数",
            "HpCard": "体力牌",
            "recover": "恢复体力",
            "loseHp": "失去体力",
            "loseMaxHp": "失去体力上限",
            "gainMaxHp": "增加体力上限",
            "die": "死亡",
            "link": "横置",
            "insertPhase": "额外进行一个回合",
            //单词翻译
            'none': '无',
            //技能翻译
            'limited': '限定技',
            'juexingji': '觉醒技',
            'zhuanhuanji': '转换技',
            'zhuSkill': '主公技',
            'forced': '锁定技',
            'skill_X': 'X技',
            'qzj': '强制技',
            'viewAs': "视为技"
        },
        jiangchi: [],
        skills: {
            first: ["xjb_juanqu", "xjb_lunhui"],
            second: ["xjb_leijue", "xjb_bingjue"],
            third: ["xjb_pomie", "xjb_huojue"],
            red: []
        },
        choujiang: {
        },
        theStorage: "",
        theFunction: {
            xjb_chupingjisha: function () {
                ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove()
                //"stayleft"可以让该元素保持在左边
                const cpjs = ui.xjb_chupingjisha = ui.create.control("触屏即杀", 'stayleft', lib.xjb_list_xinyuan.dom_event.chupingjisha)
                return cpjs;
            }
        },
        dom_event: {
            chupingjisha: function () {
                this.hide()
                var next = game.createEvent("xjb-chupingjisha");
                next.player = game.me;
                _status.event.next.remove(next);
                _status.event.getParent().next.push(next);
                next.setContent(function () {
                    "step 0"
                    let list1 = ["流失", "火焰", "雷电", "冰冻", "破甲", "神袛"],
                        list2 = ["1次", "2次", "3次", "4次", "5次"]
                    var next = player.chooseButton([
                        '请选择击杀方式',
                        [list1, 'tdnodes'],
                        '请选择重复次数',
                        [list2, 'tdnodes'],
                    ], 2);
                    event.list1 = list1
                    event.list2 = list2
                    event.selected1 = 0
                    event.selected2 = 0
                    next.set('filterButton', function (button) {
                        ui.selected.buttons.forEach(i => {
                            event.selected1 = 0
                            event.selected2 = 0
                            if (list1.includes(i.innerText)) event.selected1 = 1
                            if (list2.includes(i.InnerText)) event.selected2 = 1
                        })
                        if (event.selected1 === 1 && list1.includes(button.link)) return false
                        return !(list2.includes(button.link) && (event.selected1 === 0 || event.selected2 === 1))
                    });
                    "step 1"
                    if (result.links) {
                        let times, activity
                        result.links.forEach(i => {
                            activity = (event.list1.includes(i) && i) || activity
                            times = (event.list2.includes(i) && i) || times
                        })
                        let e = new Array(parseInt(times)).fill(activity)
                        player.fc_X(...e, [game.players.length])
                        game.xjb_systemEnergyChange(-parseInt(times) * 30)
                    }
                    "step 2"
                    ui.xjb_chupingjisha.show();
                })
                //如果是你的出牌阶段发动此技能
                if (_status.event.name == 'chooseToUse' && _status.event.player) {
                    //这个设置是关键的一步，说明本次chooseToUse是发动了技能，以让phaseUse转起来
                    _status.event.result = {
                        bool: true,
                        skill: 'xjb_updateStrategy'
                    };
                    game.resume();
                }
            }
        }
    }
}
function LOAD_FEATURE() {
    LOAD_HPCARD(lib, game, ui, get, ai, _status);
    LOAD_REMNANT_AREA(lib, game, ui, get, ai, _status);
}
function LOAD_SMALL_GAME() {
    LOAD_GAME_TETRIS(lib, game, ui, get, ai, _status)
}
export function XJB_PRECONTENT() {
    provideFunction();
    way();
    initialize();
    importFile();
    LOAD_FEATURE();
    LOAD_SMALL_GAME();
    window.xjb_library = xjb_library;
    //折头折百花联动
    // if (lib.config.extensions.includes('枝头折百花') && lib.config.extension_枝头折百花_enable) {
    //     lib.nature && lib.nature.push && lib.nature.push('flower')
    //     game.addNature && game.addNature('flower')
    //     lib.skill._ztzbh_flowerDamage = {
    //         trigger: {
    //             source: ["damageBegin"],
    //         },
    //         filter: function (event, player) {
    //             if (game.roundNumber % 4 == 1) lib.translate._ztzbh_flowerDamage = '春雷'
    //             if (game.roundNumber % 4 == 2) lib.translate._ztzbh_flowerDamage = '炎夏'
    //             if (game.roundNumber % 4 == 3) lib.translate._ztzbh_flowerDamage = '寂秋'
    //             if (game.roundNumber % 4 == 0) lib.translate._ztzbh_flowerDamage = '凌冬'
    //             if (!(event.nature == "flower")) return false;
    //             return true;
    //         },
    //         content: function () {
    //             "step 0"
    //             trigger.cancel()
    //             if (game.roundNumber % 4 == 1) trigger.player.damage(1, "thunder", player) && player.popup('春雷')
    //             if (game.roundNumber % 4 == 2) trigger.player.damage(1, "fire", player) && player.popup('炎夏')
    //             if (game.roundNumber % 4 == 3) trigger.player.loseHp(1, player) && player.popup('寂秋')
    //             if (game.roundNumber % 4 == 0) trigger.player.damage(1, "ice", player) && player.popup('凌冬')
    //         },
    //     }
    //     lib.translate._ztzbh_flowerDamage = '花伤'
    //     lib.skill._ztzbh_liandong = {
    //         trigger: {
    //             player: [],
    //         },
    //         filter: function (event, player) {
    //             return player === game.me
    //         },
    //         direct: true,
    //         content: function () {
    //             let name = player.name
    //             game.xjb_getDaomo(player, "flower")
    //         }
    //     }
    // }
}