import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../noname.js";
export function XJB_CONTENT(config, pack) {
    //新的数据处理函数部分            
    String.prototype.getNumberBefore = function (character) {
        if (this.indexOf(character) == -1) return []
        var pList = []
        this.replace(new RegExp(`(\-{0,1}[0-9][0-9\.\/]*)${character}`, 'g'), function (match, p) {
            pList.push(p)
        })
        return pList
    }
    String.prototype.getNumberAfter = function (character) {
        if (this.indexOf(character) == -1) return []
        var pList = []
        this.replace(new RegExp(`${character}(\-{0,1}[0-9][0-9\.\/]*)`, 'g'), function (match, p) {
            pList.push(p)
        })
        return pList
    }
    String.prototype.withTogether = function (str, func) {
        return [func(this), func(str)]
    }
    Array.prototype.toEnsureItsPersonality = function () {
        var list = Array.from(new Set(this))
        return list
    }
    //这个是用于设置关卡信息的函数
    lib.arenaReady.push(function () {
        _status.xjb_level = {
            name: lib.config.mode,
            number: "0000",
            Type: "normal"
        }
    });
    //这个用于把xjb_1中的函数赋给角色
    lib.arenaReady.push(function () {
        if (lib.skill.xjb_1) {
            for (let k in lib.skill.xjb_1.player) {
                lib.element.player[k] = lib.skill.xjb_1.player[k];
            }
        }
    });
    //这个用于设置xjb_2的中的事件
    lib.arenaReady.push(function () {
        if (lib.skill.xjb_2) {
            for (let k in lib.skill.xjb_2) {
                lib.element.player[k] = lib.skill.xjb_2[k].player;
                lib.element.content[k] = lib.skill.xjb_2[k].content;
            }
        }
    })
    //这个把其他新将包的数据释放出来
    lib.arenaReady.push(function () {
        //这里会创建一个数组，该数组为xjb_3、xjb_4、...
        let arr = new Array();
        arr.length = 11;
        arr.fill("xjb_");
        arr = arr.map(function (item, index) {
            return item + (index + 3);
        })
        //遍历这个数组，执行其中的函数
        arr.forEach(function (item) {
            if (!this[item]) return false;
            for (let i in this[item]) {
                (typeof this[item][i] === "function") && this[item][i]()
            }
        }, lib.skill)
    })
    //这个是一定要放在最后处理的新将包数据
    lib.arenaReady.push(function () {
        if (lib.skill.xjb_final) {
            for (let k in lib.skill.xjb_final) {
                window.requestAnimationFrame(function () {
                    (typeof lib.skill.xjb_final[k] === "function") &&
                        lib.skill.xjb_final[k]()
                })
            }
        }
    })
    lib.extensionMenu.extension_新将包.delete.name = '<img src="' + lib.xjb_src + 'image/trash.png" width="16">' + '删除'
    lib.extensionMenu.extension_新将包['Eplanation'] = {
        name: '<img src="' + lib.xjb_src + 'image/instruction.png" width="16"></img>说明编辑',
        init: '',
        item: {
            mingxie: '鸣谢',
            disk: "网盘",
            remnantArea: "残区",
            qzj: '强制技',
            skill_X: 'X技',
            xjb_lingli: "灵力",
            hun_system: '魂币系统',
            fileURL: "导出路径"
        },
        onclick: function (layout) {
            if (layout == "fileURL") {
                game.xjb_create.prompt('这里可以设置本扩展文件的导出路径', lib.config.xjb_fileURL ? lib.config.xjb_fileURL : "file:///", function () {
                    lib.config.xjb_fileURL = this.result;
                    game.saveConfig("xjb_fileURL", this.result)
                })
                return false;
            }
            ui.create.xjb_book(ui.window, xjb_library["intro"][layout])
        }
    }
    lib.extensionMenu.extension_新将包.xjb_download = {
        name: '\u{1f4e5}更新工具',
        init: '',
        item: {
            getAPI: '获取工具',
            update: '刷新工具',
            putout: '输出目录',
            download: '下载更新'
        },
        visualMenu: function (node) {
            node.className = 'button controlbutton';
        },
        onclick: function (layout) {
            switch (layout) {
                case 'getAPI': {
                    game.xjb_loadAPI(function () {
                        game.xjb_create.alert("xjb_xyAPI加载成功!")
                    })
                }; break;
                case 'update': {
                    if (!("xjb_xyAPI" in window)) return game.xjb_create.alert("xjb_xyAPI未引入,请点击获取工具引入!")
                    xjb_xyAPI.updateServiceTarget('新将包');
                    game.xjb_create.alert('工具已刷新')
                }; break;
                case 'putout': {
                    if (!("xjb_xyAPI" in window)) return game.xjb_create.alert("xjb_xyAPI未引入,请点击获取工具引入!")
                    xjb_xyAPI.directoryDownload();
                    xjb_xyAPI.directoryDownloadFHook = function () {
                        game.xjb_create.alert('目录导出失败')
                    }
                    xjb_xyAPI.directoryDownloadSHook = function () {
                        game.xjb_create.alert('目录导出成功')
                    }
                }; break;
                case 'download': {
                    if (!("xjb_xyAPI" in window)) return game.xjb_create.alert("xjb_xyAPI未引入,请点击获取工具引入!")
                    xjb_xyAPI.updateOnline()
                    game.xjb_create.alert('请耐心等待,直到出现alert提示框!此前请不要关闭无名杀!')
                    xjb_xyAPI.updateDownloadHook = function (list) {
                        alert('下载完成,失败的文件' + list)
                    }
                }; break;
            }
        }
    }
    lib.extensionMenu.extension_新将包.xjb_strategy = {
        name: "💡策略集",
        clear: true,
        onclick: function () {
            const strategyList = {
                xjb_lingli_Allallow: '全员灵力策略',
                xjb_skillsNumberLimitation: '技能数限制策略',
                xjb_maxHpLimitation: '体力上限限制策略',
                // xjb_perfectPair: "<b description=增加:"
                //     + "刘宏-何太后;"
                //     + "刘辩-唐姬;"
                //     + "刘协-[董贵人,曹节,曹宪,曹华];"
                //     + "曹操-丁夫人"
                //     + "曹丕-郭照"
                //     + "曹叡-明元郭皇后"
                //     + "刘备-[糜夫人,吴苋];"
                //     + "孙权-[潘淑]"
                //     + "孙亮-全惠解"
                //     + "孙皓-[张媱,张嫙];"
                //     + "何晏-曹金玉;"
                //     + "赵昂-王异;"
                //     +">扩展珠联璧合策略</b>",
            };
            const restList = {
                xjb_yangcheng: '养成武将策略',
                xjb_chupingjisha: '触屏击杀策略',
                xjb_cardStore: '魂市策略',
                xjb_bianshen: '魂将策略'
            }
            if (lib.config.xjb_hun) Object.keys(restList).forEach(i => {
                if (lib.config[i] !== void 0) {
                    strategyList[i] = restList[i];
                }
            })
            game.xjb_create.configList(strategyList, function () {
                game.xjb_cpjsLoad();
                game.xjb_cpjsRemove();
                if (_status.event.name == 'chooseToUse' && _status.event.player) {
                    _status.event.result = {
                        bool: true,
                        skill: 'xjb_updateStrategy'
                    };
                    game.resume();
                }

            });
        }
    }
    if (!lib.config.xjb_hun) {
        lib.extensionMenu.extension_新将包.open = {
            name: "<font color='blue'>点我开启魂币系统",
            clear: true,
            onclick: function () {
                if (!lib.config.xjb_hunbi) {
                    lib.config.xjb_hunbi = 0;
                    game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                }
                game.saveConfig('xjb_hun', true);
                game.xjb_create.alert('已开启魂币系统，将自动重启', function () {
                    game.reload();
                });
            }
        }
    }
    if (lib.config.xjb_hun) {
        lib.extensionMenu.extension_新将包.hunbi = {
            name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20" >' + '魂币数据',
            clear: true,
            onclick: function () {
                function hun(num) {
                    var hunbi = ""
                    if (num > 0 && num < 5) {
                        for (var i = 0; i < num; i++) {
                            hunbi = hunbi + '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="25" >'
                        }
                    }
                    else {
                        hunbi = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="25" >×' + num
                    }
                    return hunbi
                }
                let dataBase = game.xjb_currencyRate
                let condition = {
                    "hunbi": "魂币:" + (hun(lib.config.xjb_hunbi)),
                    "dakadian": "打卡点:" + (hun(lib.config.xjb_hundaka2)),
                    "energy": "能量:" + (hun(lib.config.xjb_systemEnergy)),
                    "HunbiExpectation": "魂币期望:" + (hun(game.xjb_hunbiExpectation())),
                    "floatRate": "浮流率:" + (game.xjb_inflationRate() * 100).toFixed(2) + "%"
                }
                let target = game.xjb_create.condition(condition).font(30)
            }
        }
        lib.extensionMenu.extension_新将包.hunbi_tozero = {
            name: '<img src="' + lib.xjb_src + 'image/zeroize.png" height="16">清零魂币',
            clear: true,
            onclick: function () {
                if (lib.config.xjb_hunbi === 0) return game.xjb_create.alert('你的魂币无需清零');
                game.xjb_create.confirm('确定要清零吗？', function () {
                    var num = lib.config.xjb_hunbi
                    if (lib.config.xjb_hunbi > 0 && lib.config.xjb_hunbi <= 50) {
                        num = game.xjb_currencyRate.CoinToEnergy * num - 1;
                    }
                    else if (lib.config.xjb_hunbi > 50 && lib.config.xjb_hunbi <= 500) {
                        num = game.xjb_currencyRate.firstRate * num;
                    }
                    else if (lib.config.xjb_hunbi > 500) {
                        num = game.xjb_currencyRate.firstRate * num + 500;
                    }
                    else if (lib.config.xjb_hunbi < 0) {
                        num = num * game.xjb_currencyRate.CoinToEnergy - 100;
                    }
                    game.saveConfig('xjb_hunbi', 0);
                    game.xjb_systemEnergyChange(num)
                    game.xjb_create.alert('你的魂币已清零');
                })

            }
        }
        lib.extensionMenu.extension_新将包.LZ_project = {
            name: '<img src="' + lib.xjb_src + 'image/π.png" height="16">刘徽-祖冲之项目',
            clear: true,
            onclick: function () {
                game.xjb_LZ_project()
            }
        }
        lib.extensionMenu.extension_新将包['information'] = {
            name: '<img src="' + lib.xjb_src + 'image/instruction.png" width="16">' + '<font color="yellow">角色进度查询!</font>',
            clear: true,
            onclick: function () {
                game.xjb_Intro2()
            }
        }
        lib.extensionMenu.extension_新将包['choujiang'] = {
            name: '<img src="' + lib.xjb_src + 'image/Lucky.png" width="16">' + '<font color="yellow">超值抽奖！</font>',
            init: '1',
            item: {
                1: '一倍',
                6: '六倍',
                36: '三十六倍',
                72: '七十二倍'
            },
            onclick: function (layout) {
                if (lib.config.xjb_systemEnergy < 0) {
                    if (layout >= 6) return game.xjb_NoEnergy()
                    if (lib.config.xjb_hundaka2 >= layout && lib.config.xjb_hunbi < 10) return game.xjb_create.alert("由于能量不足，现在抽奖方决定：临时开发打卡点抽奖途径，以渡过无能量期，现在自动为您抽奖...", function () {
                        lib.config.cjb_cj_type = "2"
                        game.xjb_jiangchiUpDate()
                        let JP = lib.xjb_list_xinyuan.jiangchi.randomGet()
                        game.cost_xjb_cost(2, 1)
                        game.xjb_create.alert(JP + '×' + layout, function () {
                            game.xjb_gainJP(JP, true, 1 * layout)
                        })
                    })
                    return game.xjb_NoEnergy()
                }
                //设置back
                var thelist = ui.create.xjb_back("抽奖花费:养成、技能奖池:8魂币，魂币奖池:1打卡点。点击奖品表即可刷新。")
                var back = thelist[0]
                //设置抽奖种类
                var xjb_list = ui.create.div('.xjb_choujiang', back)
                ui.xjb_giveStyle(xjb_list, { width: "125px" })
                //onclick函数生成
                var myFunc = function (num) {
                    return function () {
                        lib.config.cjb_cj_type = `${num}`
                        var xx = lib.config.cjb_cj_type, xjb_txt1 = document.getElementById('myChouJiang_XJB_TXT'), btn = document.getElementById('myChouJiang_XJB_BUTTON')
                        if (btn.disabled) return false
                        xjb_txt1.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang[xx])
                        game.xjb_jiangchiUpDate()
                    }
                }
                //设置每个抽奖按钮的内容
                var constructor = function (i) {
                    var inner = ["养成奖池", "魂币奖池", "免费奖池", "技能奖池"], style = [
                        { "margin-top": "50px", color: "red" },
                        { "margin-top": "100px", color: "orange" },
                        { "margin-top": "150px", color: "blue" },
                        { "margin-top": "200px", color: "pink" }
                    ]
                    var choujiang = ui.create.div('.xjb_choujiang', xjb_list)
                    choujiang.innerHTML = inner[i]
                    ui.xjb_giveStyle(choujiang, lib.xjb_style.cj_box)
                    ui.xjb_giveStyle(choujiang, style[i])
                    choujiang.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', myFunc(i + 1))
                    return choujiang
                }
                //显示当前奖品
                var content = ui.create.div(".choujiang_content", back)
                content.innerHTML = '奖品'
                content.id = "myChouJiang_XJB_CONTENT"
                ui.xjb_giveStyle(content, { 'font-size': "30px", 'color': "#D9D919", "margin-left": "56%", "margin-top": "100px", "width": "240px", "text-align": "center" })
                //抽奖按键
                var btn = document.createElement("BUTTON")
                btn.id = "myChouJiang_XJB_BUTTON"
                btn.innerHTML = '点击抽奖'
                ui.xjb_giveStyle(btn, { "margin-left": "60%", 'border-radius': "5em", position: "relative", color: "red", border: "1px solid green", 'font-size': "24px", "margin-top": "200px", width: "175px", height: "80px" })
                back.appendChild(btn);
                //创建奖品列表
                var text = ui.create.div(".choujiang_text", back)
                text.id = "myChouJiang_XJB_TXT"
                var xx = lib.config.cjb_cj_type, xjb_txtself = document.getElementById('myChouJiang_XJB_TXT')
                text.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang[xx])
                ui.xjb_giveStyle(text, { 'font-size': "20px", right: "410px", top: "10px" })
                text.onclick = function () {
                    if (btn.disabled) return;
                    this.style.color = ["red", "blue", "yellow", "pink", "white"].randomGet()
                    var bool = this.innerHTML.search(/技能/) >= 0
                    game.xjb_systemEnergyChange(-1)
                    if (!bool) return
                    lib.skill.xjb_final.choujiang()
                    this.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang["4"])
                    game.xjb_jiangchiUpDate()
                    game.xjb_systemEnergyChange(-1)
                }
                //抽奖事件
                btn.onclick = function () {
                    var xx = get.xjb_number(lib.config.cjb_cj_type), num = 8 * layout
                    if (xx == 2) num = 1 * layout
                    let conditionList = {
                        '1': () => !game.xjb_condition(1, num),
                        '2': () => !game.xjb_condition(2, num),
                        '3': () => false,
                        '4': () => (!game.xjb_condition(1, num) || !game.xjb_condition(3, 1 * layout))
                    }
                    if (conditionList[xx]()) return game.xjb_create.alert("你未达成抽奖的条件！")
                    if (xx == 4) xx = 1
                    if (xx !== 3) game.cost_xjb_cost(xx, num, '抽奖')
                    game.xjb_jiangchiUpDate()
                    btn.disabled = true;
                    var xjb_content = document.getElementById('myChouJiang_XJB_CONTENT')
                    var i = 0, z = -1
                    var timer = window.requestAnimationFrame(function wonderfulJP() {
                        z++
                        if (i < 100) {
                            if (z % 5 === 0) {
                                var jp = lib.xjb_list_xinyuan.jiangchi[i]
                                xjb_content.innerHTML = jp
                                i++
                            }
                            var timer = window.requestAnimationFrame(wonderfulJP)
                        }
                        else {
                            game.xjb_create.alert(xjb_content.innerHTML + '×' + layout, function () {
                                game.xjb_gainJP(xjb_content.innerHTML, undefined, 1 * layout)
                            })
                            cancelAnimationFrame(timer)
                            btn.disabled = false
                        }
                    })
                }
                //设置奖池表
                for (var i = 0; i < 4; i++) {
                    let clk = constructor(i)
                    if ((i == 3) && layout != 1) {
                        ui.xjb_giveStyle(clk, { display: 'none' })
                    }
                }
            }
        }
        lib.extensionMenu.extension_新将包.level = {
            name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="16"><font color=yellow>技能附魔！',
            init: "openType",
            item: {
                openType: "开启标签",
                addCharacter: "添删武将",
                enchanting: "技能附魔"
            },
            visualMenu: function (node) {
                node.className = 'button controlbutton';
            },
            onclick: function (e) {
                if (e === "openType") {
                    //标签开关
                    const dialog = game.xjb_create.configList({
                        xjb_skillTag_fuSkill: "福技:首次使用后恢复体力并加护甲",
                        xjb_skillTag_luSkill: "禄技:首次使用后摸四张牌",
                        xjb_skillTag_shouSkill: "寿技:首次使用后加两点体力上限",
                        xjb_skillTag_qzj: "强制技:结算后,令目标失去技能",
                        xjb_skillTag_suidongSkill: "随动技:因本技能而获得牌，该角色可以立即使用之",
                        xjb_skillTag_queqiaoxian: "鹊桥仙:结算后,可令有姻缘的珠联璧合角色额外结算一次",
                    })
                    dialog.style.width = '800px'
                    lib.skill.xjb_final.skillTag()
                } else if (e === "addCharacter") {
                    //角色开关
                    let obj = {}
                    for (let i in lib.character) {
                        if (lib.character[i][4].includes("unseen")) continue;
                        obj["xjb_skillTag_Character_" + i] = get.translation(i) + "(" + i + ")"
                    }
                    game.xjb_create.configList(obj, function () {
                        let arr = this.isOpened
                        arr = arr.map(function (item) {
                            return item.replace("xjb_skillTag_Character_", "")
                        })
                        game.saveConfig("xjb_skillTag_Character", arr)
                    })
                    lib.skill.xjb_final.skillTag()
                } else if (e === "enchanting") {//技能开关
                    const obj = {}
                    function addItem(skillName, characterID, type) {
                        obj["xjb_skillTag_" + type + "_" + skillName] = "【" + get.translation(type) + "】"
                            + `<b description=${get.plainText(`${lib.translate[skillName + "_info"] || ''}`).replaceAll(/(福技|禄技|寿技|随动技|强制技|鹊桥仙)[,，]/g, '')}>${get.translation(skillName)}</b>`
                            + "(来源:" + get.translation(characterID) + ")"
                    }
                    const {
                        xjb_skillTag_Character,
                        xjb_skillTag_qzj,
                        xjb_skillTag_queqiaoxian,
                        xjb_skillTag_suidongSkill,
                        xjb_skillTag_fuSkill,
                        xjb_skillTag_luSkill,
                        xjb_skillTag_shouSkill
                    } = lib.config;
                    if (!xjb_skillTag_Character || !xjb_skillTag_Character.length) {
                        //检测是否有武将解锁了该功能
                        return game.xjb_create.alert("你没有任何武将解锁了技能标签，请于 添删武将 中设置！")
                    }
                    const queqiaoxianBan = ["yingzi", "olhuoji", "olkanpo", "cangzhuo"]
                    xjb_skillTag_Character.forEach(item => {
                        if (!lib.character[item]) return;
                        if (!lib.character[item][3]) return;
                        if (!lib.character[item][3].length) return;
                        lib.character[item][3].forEach(skillName => {
                            if (!lib.skill[skillName]) return;
                            //检测该技能是否存在
                            const info = get.info(skillName)
                            if (!info.content) return;
                            const contentStr = info.content.toString()
                            if (xjb_skillTag_suidongSkill == 1) {
                                addItem(skillName, item, 'suidongSkill')
                            }
                            //判断该技能为主动技且会选择角色
                            if (info.enable) {
                                if (info.filterTarget && xjb_skillTag_qzj == 1) {
                                    addItem(skillName, item, 'qzj')
                                }
                                if (xjb_skillTag_queqiaoxian == 1 && get.info("_xjb_queqiaoxian").getCP(item).length) {
                                    addItem(skillName, item, 'queqiaoxian')
                                }
                            }
                            /*下面这两行连写，会先判断是否有player.logSkill再判断是否为触发技*/
                            else if (info.direct && !contentStr.includes("player.logSkill")) return //判断是否有技能提示
                            else if (info.trigger) {//判断是否为触发技
                                if (xjb_skillTag_fuSkill == 1) {
                                    addItem(skillName, item, 'fuSkill')
                                }
                                if (xjb_skillTag_luSkill == 1) {
                                    addItem(skillName, item, 'luSkill')
                                }
                                if (xjb_skillTag_shouSkill == 1) {
                                    addItem(skillName, item, 'shouSkill')
                                }
                                if (xjb_skillTag_queqiaoxian == 1 && get.info("_xjb_queqiaoxian").getCP(item).length) {
                                    if (!info.forceDie && ["yingzi"] && queqiaoxianBan.every(ban => !skillName.endsWith(ban))) addItem(skillName, item, 'queqiaoxian')
                                }
                            }
                        })
                    })
                    game.xjb_create.configList(obj, function () {
                        let arr = this.isOpened, object = {
                            fuSkill: [],
                            luSkill: [],
                            shouSkill: [],
                            qzj: [],
                            suidongSkill: [],
                            queqiaoxian: []
                        }
                        function addTag(item, type) {
                            if (item.indexOf("xjb_skillTag_" + type + "_") > -1) {
                                object[type].add(item.replace("xjb_skillTag_" + type + "_", ""))
                            }
                        }
                        arr.forEach(item => {
                            Object.keys(object).forEach(Tag => {
                                addTag(item, Tag)
                            })
                        })
                        game.saveConfig("xjb_skillTag_Skill", object)
                    })
                    //更新技能附魔
                    lib.skill.xjb_final.skillTag()
                }
            }
        }
        if (lib.config.xjb_yangcheng == 1) {
            lib.xjb_yangcheng1 = lib.extensionMenu.extension_新将包.newCharacter = {
                name: '<img src="' + lib.xjb_src + 'xin_newCharacter.jpg" height="16">' + '<font color="yellow">武将养成</font>',
                init: 'name2',
                item: {
                    name2: '姓名更改',
                    sex: '性别更改',
                    group: '势力更改',
                    hp: '体力值↑',
                    intro: '身份设置',
                    unique: '特殊设置',
                    skill1: '技能槽↑',
                    skill2: '技能回收',
                    skill3: '技能学习',
                    sink1: '皮肤导入',
                    sink3: '原皮更改',
                    sink4: '恢复初始',
                },
                visualMenu: function (node) {
                    node.className = 'button controlbutton';
                },
                onclick: function (layout) {
                    //能量判定
                    if (lib.config.xjb_systemEnergy < 0) {
                        return game.xjb_NoEnergy()
                    }
                    function changeSkill(abcde) {
                        var obj = {}
                        function Longstr(list) {
                            var word = '请按以下规则输入:<br>'
                            for (var i = 0; i < list.length; i++) {
                                word = word + '查看技能〖' + get.translation(list[i]) + '〗，请输入' + i + '<br>'
                            }
                            return word
                        }
                        function normalStr(skill) {
                            var str = '〖' + get.translation(skill) + '〗：' + lib.translate[skill + '_info']
                            return game.xjb_create.alert(str)
                        }
                        obj.changeSkill1 = function () {
                            let num = lib.config.xjb_jnc;
                            let max = 0;
                            function apSum(first, endIndex, difference) {
                                const last = first + (endIndex - 1) * difference
                                return (first + last) * endIndex / 2
                            }
                            for (let add = 0; add < 15; add++) {
                                let first = game.xjb_goods.jnc.price
                                let cost = apSum(first, add, 5)
                                if (lib.config.xjb_hunbi < cost) break;
                                max = add;
                            }
                            game.xjb_create.range('你当前有' + num + '个技能槽，开启0个技能槽,共需0个魂币', 0, max, 0, function () {
                                let add = this.result
                                let first = game.xjb_goods.jnc.price
                                let cost = apSum(first, add, 5)
                                if (lib.config.xjb_hunbi >= cost) {
                                    game.cost_xjb_cost("B", cost)
                                    game.xjb_newCharacterAddJnc(add)
                                }
                            }, function () {
                                let add = this.value;
                                let first = game.xjb_goods.jnc.price
                                let cost = apSum(first, add, 5)
                                this.prompt.innerHTML = '你当前有' + num + '个技能槽，开启' + add + '个技能槽,共需' + cost + '个魂币'
                            })
                        }
                        obj.changeSkill2 = function () {
                            var list = lib.config.xjb_newcharacter.skill
                            if (list.length < 1) return game.xjb_create.alert('你没有技能！')
                            let dialog = game.xjb_create.prompt(Longstr(list), "", function () {
                                var num = this.result
                                var skill = list[num]
                                if (list.includes(skill)) {
                                    normalStr(skill).nextConfirm('是否回收此技能并获得5魂币？', function () {
                                        lib.config.xjb_newcharacter.skill.remove(skill)
                                        game.xjb_systemEnergyChange(skill.length)
                                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
                                        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi + 5);
                                        game.xjb_create.alert('你已删除该技能，重启即生效！' + "<br>当前魂币值为" + lib.config.xjb_hunbi).nextConfirm("是否继续查看？", function () {
                                            obj.changeSkill2();
                                        });
                                    }, function () {
                                        game.xjb_create.confirm("是否继续查看？", function () {
                                            obj.changeSkill2()
                                        })
                                    })
                                }
                                else game.xjb_create.alert("你的输入有误!")
                            }).Mysize()
                            dialog.input.numberListButton(list.length)
                        }
                        obj.changeSkill3 = function () {
                            var haven = lib.config.xjb_newcharacter.skill, SkillList = lib.config.xjb_list_hunbilist.skill
                            var first = SkillList.first, second = SkillList["second"], third = SkillList["third"]
                            var list = first.concat(second, third)
                            list.remove(haven)
                            let dialog = game.xjb_create.prompt(Longstr(list), "", function () {
                                var num = this.result
                                var willget = list[num]
                                if (list.includes(willget)) {
                                    var myAlert = normalStr(willget)
                                    if (haven.length < lib.config.xjb_jnc) {
                                        if (first.includes(willget)) var cost = 15
                                        if (second.includes(willget)) var cost = 25
                                        if (third.includes(willget)) var cost = 50
                                        if (lib.config.xjb_hunbi >= cost) {
                                            myAlert.nextConfirm('你已达成获得该技能的条件，是否花费' + cost + '个魂币，获得此技能？', function () {
                                                game.cost_xjb_cost(1, cost)
                                                game.xjb_systemEnergyChange(-cost - 3)
                                                lib.config.xjb_newcharacter.skill.add(willget)
                                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                                game.xjb_create.alert('你已获得该技能，重启即生效！').nextConfirm("是否继续查看？", function () {
                                                    obj.changeSkill3()
                                                })
                                            }, function () {
                                                game.xjb_create.confirm("是否继续查看？", function () {
                                                    obj.changeSkill3()
                                                })
                                            })
                                        }
                                    }
                                }
                                else game.xjb_create.alert("你的输入有误!")
                            }).Mysize()
                            dialog.input.numberListButton(list.length)
                        }
                        if (!lib.config.xjb_jnc) lib.config.xjb_jnc = 0
                        obj["changeSkill" + abcde]()
                    }
                    var sinks = function (str1) {
                        if (!lib.config.xjb_newcharacter.sink) lib.config.xjb_newcharacter.sink = []
                        const downloadByCordova = function () {
                            const that = this;
                            var Myalert = game.xjb_create.alert("正在导入中...");
                            const sucCallback = () => {
                                Myalert.innerHTML = "导入成功！"
                                ui.xjb_toBeVisible(Myalert.buttons[0])
                                lib.config.xjb_newcharacter.sink.add(that.result + that.file.type)
                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            }
                            const failCallback = err => {
                                Myalert.innerHTML = "导入失败！<br>" + err
                                ui.xjb_toBeVisible(Myalert.buttons[0])
                            }
                            const downloadWay = lib.config.xjb_fileURL + "sink/xin_newCharacter/normal/" + that.result + that.file.type;
                            ui.xjb_toBeHidden(Myalert.buttons[0])
                            var fileTransfer = new FileTransfer();
                            fileTransfer.download(
                                that.file.result,
                                downloadWay,
                                sucCallback,
                                failCallback
                            )
                        };
                        const downloadByNode = function () {
                            const that = this;
                            var Myalert = game.xjb_create.alert("正在导入中...");
                            const sucCallback = () => {
                                Myalert.innerHTML = "导入成功！"
                                ui.xjb_toBeVisible(Myalert.buttons[0])
                                lib.config.xjb_newcharacter.sink.add(that.result + that.file.type)
                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            }
                            const failCallback = err => {
                                Myalert.innerHTML = "导入失败！<br>" + err
                                ui.xjb_toBeVisible(Myalert.buttons[0])
                            }
                            const downloadWay = lib.config.xjb_fileURL + "sink/xin_newCharacter/normal/" + that.result + that.file.type;
                            ui.xjb_toBeHidden(Myalert.buttons[0])
                            lib.node.fs.writeFile(
                                window.decodeURIComponent(new URL(downloadWay).pathname).substring(1),
                                Buffer.from(new Uint8Array(that.file.result)),
                                err => {
                                    if (err) return failCallback(err);
                                    sucCallback();
                                }
                            )
                        }
                        game.xjb_create.file(
                            "请输入你的皮肤名，并选定图片，待确定出现后按确定即可。",
                            str1,
                            function () {
                                const theDownload = lib.node ? downloadByNode : downloadByCordova
                                if (lib.config.xjb_newcharacter.sink.includes(this.result)) {
                                    game.xjb_create.confirm("你已有该同名的皮肤，是否覆盖？", theDownload, function () { sinks("img") })
                                }
                                else theDownload.apply(this, [])
                            },
                            () => { },
                            lib.node ? true : false
                        )
                    }
                    var object = {
                        other: o => 1,
                        name2: function () {
                            game.xjb_gainJP("免费更改姓名")
                        },
                        sex: function () {
                            let sex = lib.config.xjb_newcharacter.sex
                            let price = game.xjb_goods.changeSexCard.price;
                            game.xjb_create.confirm('你当前性别为：' + get.translation(sex) + `，更改性别需要1张性转卡(${price}魂币一张，当前你有` + game.xjb_countIt("changeSexCard") + '张，无则自动购买)确定要更改吗？', function () {
                                game.xjb_newCharacterChangeSex(1, false)
                            })
                        },
                        group: function () {
                            let group = lib.config.xjb_newcharacter.group
                            let price = game.xjb_goods.changeGroupCard.price;
                            game.xjb_create.confirm('你当前势力为：' + get.translation(group) + `，更改势力需要1个择木卡(${price}魂币一张，当前你有` + game.xjb_countIt("changeGroupCard") + '张，无则自动购买)，确定要更改吗？', function () {
                                game.xjb_newCharacterChangeGroup(1, false)
                            })
                        },
                        hp: function () {
                            let hp = lib.config.xjb_newcharacter.hp;
                            let max = 0;
                            function getCost(num) {
                                let count = 0, i = 0;
                                while (i < num) {
                                    count += (hp + i) * (hp + i) * 2
                                    i++
                                }
                                return count;
                            }
                            for (let add = 0; add < 15; add++) {
                                let cost = getCost(add)
                                if (lib.config.xjb_hunbi < cost) break;
                                max = add;
                            }
                            game.xjb_create.range('你已有' + hp + '点体力。增加0点体力需要0个魂币。', 0, max, 0, function () {
                                const add = this.result;
                                let cost = getCost(add)
                                if (lib.config.xjb_hunbi >= cost) {
                                    game.xjb_newCharacterAddHp(this.result, false)
                                }
                            }, function () {
                                const add = this.value;
                                let cost = getCost(add);
                                this.prompt.innerHTML = '你已有' + hp + '点体力。增加' + add + '点体力需要' + cost + '个魂币。'
                            })
                        },
                        intro: function () {
                            game.xjb_create.prompt('请输入该角色的背景信息', lib.config.xjb_newcharacter.intro, function () {
                                lib.config.xjb_newcharacter.intro = this.result
                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                game.xjb_systemEnergyChange(-1)
                            }).higher()
                        },
                        unique: function () {
                            game.xjb_create.configList({
                                xjb_newCharacter_isZhu: "设置为常备主公",
                                xjb_newCharacter_hide: "设置登场时隐匿",
                                xjb_newCharacter_addGuoZhan: "加入国战模式",
                            })
                        },
                        skill1: function () {
                            changeSkill(1)
                        },
                        skill2: function () {
                            changeSkill(2)
                        },
                        skill3: function () {
                            changeSkill(3)
                        },
                        sink1: function () {
                            sinks("img")
                        },
                        sink3: function () {
                            game.xjb_create.button("未选中皮肤", lib.xjb_src + "sink/xin_newCharacter/normal/", lib.config.xjb_newcharacter.sink, function () {
                                lib.config.xjb_newcharacter.selectedSink = "ext:新将包/sink/xin_newCharacter/normal/" + this.result
                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                game.xjb_create.alert('更改皮肤为' + this.result + '，重启即生效');
                                if (lib.character.xjb_newCharacter) {
                                    lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSink];
                                }
                            }, function () {
                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            })
                        },
                        sink4: function () {
                            lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            game.xjb_create.alert('已恢复至原皮，重启即生效');
                            if (lib.character.xjb_newCharacter) {
                                lib.characterPack["xjb_soul"].xjb_newCharacter = lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSink]
                            }
                        },
                    }
                    object[layout]()
                    return object
                }
            }
        }
        if (!lib.config.xjb_bianshen) {
            lib.extensionMenu.extension_新将包.bianshen_hun_open = {
                name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁变身功能',
                clear: true,
                onclick: function () {
                    var that = this
                    if (lib.config.xjb_hunbi >= 15) {
                        game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁该功能需要15个魂币，确定要解锁吗？', function () {
                            game.cost_xjb_cost("B", 15)
                            game.saveConfig('xjb_bianshen', 1);
                            game.xjb_create.alert('已解锁变身功能，重启即生效');
                            that.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁变身功能'
                        })
                    }
                    else game.xjb_create.alert('需要15个魂币，你的魂币不足！');
                }
            }
        }
        if (!lib.config.xjb_yangcheng) {
            lib.extensionMenu.extension_新将包.yangcheng_hun_open = {
                name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁养成功能',
                clear: true,
                onclick: function () {
                    var that = this
                    if (lib.config.xjb_hunbi >= 5) {
                        game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁养成功能需要5个魂币，确定要解锁吗？', function () {
                            game.cost_xjb_cost(1, 5)
                            game.saveConfig('xjb_yangcheng', 1);
                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
                            game.xjb_create.alert('已解锁养成功能，角色已添加到soul包，重启则自动生效');
                            that.innerHTML = '<img src="' + lib.assetURL + '/extension/新将包/image/xjb_open.png" width="16">' + '你已解锁养成功能'
                        })
                    }
                    else game.xjb_create.alert('需要5个魂币，你的魂币不足！');
                }
            }
        }
        if (!lib.config.xjb_chupingjisha) {
            lib.extensionMenu.extension_新将包.xjb_chupingjisha_hun_open = {
                name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁触屏即杀功能',
                clear: true,
                onclick: function () {
                    var that = this
                    if (lib.config.xjb_hunbi >= 50) {
                        game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁触屏即杀功能需要50个魂币，确定要解锁吗？', function () {
                            game.cost_xjb_cost(1, 50)
                            game.saveConfig('xjb_chupingjisha', 1);
                            that.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁触屏即杀'
                        })
                    }
                    else game.xjb_create.alert('需要50个魂币，你的魂币不足！');
                }
            }
        }
        lib.extensionMenu.extension_新将包.hun_close = {
            name: '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">点我关闭魂币系统</font>',
            clear: true,
            onclick: function () {
                game.saveConfig('xjb_hun', false);
                game.xjb_create.alert('已关闭魂币系统，将自动重启', function () {
                    game.xjb_systemEnergyChange(1)
                    game.reload();
                });
            }
        }
    }
    lib.extensionMenu.extension_新将包.skillEditor = {
        name: '<div>技能编写器</div>',
        clear: true,
        onclick: function () {
            game.xjb_skillEditor()
        }
    }
    lib.xjb_dataGet = function () {
        return Object.keys(lib.config).filter(function (a) {
            return a.indexOf("xjb_") > -1
        })
    }
    lib.extensionMenu.extension_新将包.hun_zeroise = {
        name: '<div>重置魂币系统数据！</div>',
        clear: true,
        onclick: function () {
            game.xjb_create.confirm('确定要重置吗？', function () {
                let list = lib.xjb_dataGet()
                for (let i = 0; i < list.length; i++) {
                    game.saveConfig(list[i], undefined);
                }
                game.xjb_create.alert("已重置，点击重启", function () {
                    game.reload();
                })
            });
        }
    }
    lib.extensionMenu.extension_新将包.storage = {
        name: '<div>导出魂币系统数据！</div>',
        clear: true,
        onclick: function () {
            new Promise(res => {
                game.xjb_create.prompt("请输入导出文件的路径及名称", lib.config.xjb_fileURL + "json/", function () {
                    res(this.result)
                })
            }).then(data => {
                let dataxjb = {};
                lib.xjb_dataGet().forEach(i => { dataxjb[i] = lib.config[i] })
                let BLOB = new Blob([JSON.stringify(dataxjb, null, 4)], {
                    type: "application/javascript;charset=utf-8"
                });
                let fileWay = data + '.json';
                game.xjb_transferFile(BLOB, fileWay);
            })

        }
    }
    lib.extensionMenu.extension_新将包.readStorage = {
        name: '<div>读取魂币系统数据！</div>',
        clear: true,
        onclick: function () {
            game.xjb_create.file("选择你要读取的json文件", "json", function () {
                lib.init.json(this.file.result, function (data) {
                    let list = Object.keys(data);
                    list.forEach(i => {
                        lib.config[i] = data[i];
                        game.saveConfig(i, lib.config[i])
                    })
                    game.xjb_create.alert("数据已载入，请重启", function () {
                        game.reload();
                    })
                })
            })
        }
    }
}