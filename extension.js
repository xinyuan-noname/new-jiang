game.import("extension", function (lib, game, ui, get, ai, _status) {
    return {
        name: "新将包",
        content: function (config, pack) {
            //新的数据处理函数部分
            lib._xjb = {
                type: function (target) {
                    //该函数用于获取数据类型
                    var type = Object.prototype.toString.apply(target).slice(8, -1)
                    var a = type.indexOf("HTML"), b = type.indexOf("Element")
                    if (a >= 0 && b >= 0) {
                        type = type.slice(a + 4, b)
                    }
                    return type.toLowerCase()
                }
            }
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
                for (let k in lib.skill.xjb_1.player) {
                    lib.element.player[k] = lib.skill.xjb_1.player[k];
                }
            });
            //这个用于设置xjb_2的中的事件
            lib.arenaReady.push(function () {
                for (let k in lib.skill.xjb_2) {
                    lib.element.player[k] = lib.skill.xjb_2[k].player;
                    lib.element.content[k] = lib.skill.xjb_2[k].content;
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
                        var haven = lib.config.xjb_newcharacter.skill
                        var first = lib.config.xjb_list_hunbilist.skill.first
                        var second = lib.config.xjb_list_hunbilist.skill.second
                        var third = lib.config.xjb_list_hunbilist.skill.third
                        var list = first.concat(second, third)
                        var willget = list.randomGet()
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
                    case "免费更改势力": {
                        game.xjb_newCharacterChangeGroup(1 * turn, boolean)
                    }; break
                    case "免费更改性别": {
                        game.xjb_newCharacterChangeSex(1 * turn, boolean)
                    }; break
                    case "免费更改姓名": {
                        game.xjb_newCharacterChangeName(1 * turn)
                    }; break
                    default: {
                        var num = get.xjb_number(str)
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
                            game.xjb_getHunbi(num, turn, boolean)
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
            game.xjb_jiangchiUpDate = function () {
                game.xjb_jiangchi_zeroise()
                let hunbilist = lib.config.xjb_list_hunbilist.choujiang
                let jiangchi = lib.xjb_list_xinyuan.jiangchi
                const x = lib.config.cjb_cj_type;
                var list1 = Object.keys(hunbilist[x])
                var list2 = Object.values(hunbilist[x])
                list1.forEach((k,i)=>{
                   let a = get.xjb_number(list2[i]);
                    let addList=new Array();
                    addList.length=a;
                    addList.fill(list1[i]);
                    jiangchi=[...jiangchi,...addList];
                })
                jiangchi.sort(i=>Math.random()-0.5)
                lib.xjb_list_xinyuan.jiangchi=jiangchi
            }

            game.xjb_update_choujiang = function (num) {
                //将奖池转为数组
                let hunbilist = lib.config.xjb_list_hunbilist.choujiang
                let list = Object.keys(hunbilist[num])
                for (let i = 0; i < list.length; i++) {
                    const before = hunbilist[num][list[i]]
                    let number = get.xjb_number(before) + game.xjb_getCurrentDate(true)
                    if (i === list.length - 1) number = get.xjb_number(before) - i * game.xjb_getCurrentDate(true)
                    hunbilist[num][list[i]] = number + '*100'
                }
            }
            game.xjb_jiangchi_zeroise = function () {
                lib.xjb_list_xinyuan.jiangchi.length = 0;

            }
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
            //Hpcard创建函数，第一个值为体力牌类型，第二个值为体力牌样式高度
            game.createHpCard = function (num, num2 = 100) {
                if (Array.isArray(num)) {
                    let list = []
                    for (let i = 0; i < num.length; i++) {
                        list.push(game.createHpCard(num[i]))
                    }
                    return list
                }
                var HpCard = ui.create.div('.HpCard')
                HpCard.number = num
                HpCard.innerHTML = '<img src="' + lib.xjb_src + 'HpCard/' + HpCard.number + '.jpg" height=' + num2 + '>'
                HpCard.style['position'] = 'relative'
                var word = ui.create.div('.word', HpCard)
                word.innerHTML = get.cnNumber(num)
                word.style['font-size'] = '25px'
                word.style['position'] = 'relative'
                word.style['float'] = 'right'
                word.style['color'] = 'red'
                word.style['left'] = '-25px'
                word.style['top'] = '-10px'
                return HpCard
            }
            //统计体力牌张数
            game.countHpCard = function (arr) {
                let array = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }
                arr.forEach(function (i) {
                    array[i] = array[i] + 1
                }, arr)
                return array
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
                var willget = JSON.stringify(object)
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
            lib.extensionMenu.extension_新将包.delete.name = '<img src="' + lib.xjb_src + 'image/trash.png" width="16">' + '删除'
            //更改编辑
            lib.extensionMenu.extension_新将包.edit.name = '<img src="' + lib.xjb_src + 'image/edit.png" width="16">' + '编辑'
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
                lib.extensionMenu.extension_新将包.systemTool = {
                    name: '<img src="' + lib.xjb_src + 'image/tool.png" height="20" >' + '工具箱',
                    init: '1',
                    item: {
                        returnBoard: "执行代码",
                        coordinate: "函数绘制",
                        BinaryLinearEquations: "二元一次",
                        point: "点与向量",
                        vibrante3seconds: "震动三秒",
                    },
                    visualMenu: function (node) {
                        node.className = 'button controlbutton';
                    },
                    onclick: function (item) {
                        if (lib.config.xjb_systemEnergy < 0) return game.xjb_NoEnergy();
                        game.xjb_systemEnergyChange(-5);
                        switch (item) {
                            case "returnBoard": {
                                game.xjb_create.prompt('在此输入一串代码，将构造函数，然后执行此代码，并将返回值粘贴到剪切板上', void 0, function () {
                                    try {
                                        var textarea = document.createElement("textarea");
                                        ui.window.appendChild(textarea);
                                        let func = new Function("_status", "lib", "game", "ui", "get", "ai", this.result);
                                        textarea.value = func(_status, lib, game, ui, get, ai)
                                        textarea.select();
                                        document.execCommand("copy");
                                    }
                                    catch (err) {
                                        game.xjb_create.alert("！！！报错：<br>" + err);
                                    }
                                    textarea.remove();
                                }).higher()
                            }; break;
                            case "coordinate": {
                                game.xjb_create.coordinate()
                            }; break;
                            case "BinaryLinearEquations": {
                                game.xjb_create.blprompt("这里写第一个关于x,y的二元一次方程", void 0, "这里写第二个关于x,y的二元一次方程", void 0, function () {
                                    const answer = lib._xjb["Math_2Equal1"](this.result, this.result2)
                                    game.xjb_create.alert(`x=${answer[0]}</br>y=${answer[1]}`)
                                })
                            }; break;
                            case "point": {
                                let dialog = game.xjb_create.blprompt("这里写点的坐标，如果为直角坐标，则写成cartesian(x,y)，例如(2,1);如果为极坐标，则写成polar(magnitude,angle)，例如(3,2/PI)", "",
                                    `对点进行的操作:</br>
                                 translate(x,y):将点平移x个单位和y个单位；</br>
                                 project(x,y):求向量在向量(x,y)上的射影;</br>
                                 symmetry(A,B,C):求点关于Ax+By+C=0的对称点;</br>
                                 multiply(a,b):求点表示的复数与(a,b)表示的复数相乘表示的复数对应的点;</br>
                                 beDividedBy(a,b):求点表示的复数除以(a,b)表示的复数表示的复数对应的点`, void 0, function () {
                                    let point = lib._xjb["Math_point"](this.result)
                                    if (this.result2) {
                                        let string = lib._xjb.usuallyUsedString.Math + `
                                           return PreviousPoint.${this.result2}
                                        `
                                        string = lib._xjb.StringDispose.disposeSpecialCharacter(string)
                                        try {
                                            let func = new Function("PreviousPoint", string)
                                            point = func(point)
                                        } catch (err) {
                                            return game.xjb_create.alert(`错误:${err}`)
                                        }
                                    }
                                    const decimal = 3
                                    const x = point.cartesian[0].toFixed(decimal)
                                    const y = point.cartesian[1].toFixed(decimal)
                                    const m = point.polar[0].toFixed(decimal)
                                    const a = point.polar[1]
                                    const PI = lib._xjb.usuallyUsedString.PI
                                    const deg = lib._xjb.usuallyUsedString.deg
                                    game.xjb_create.alert(`直角坐标:(${x},${y})</br>
                                     极坐标:(${m},${a.toFixed(decimal)})</br>
                                     极坐标:(${m},${(a / Math.PI).toFixed(decimal)}${PI})
                                     </br>极坐标:(${m},${((180 * a) / Math.PI).toFixed(decimal)}${deg})`)
                                })
                                dialog.input.addButton("清")
                                dialog.input.addButton("°")
                                dialog.input.addButton("π")
                                dialog.input.addButton("p", "polar(,)")
                                dialog.input.addButton("c", "cartesian(,)")
                                dialog.input2.addButton("清")
                                dialog.input2.addButton("°")
                                dialog.input2.addButton("π")
                                dialog.input2.addButton("d", "beDividedBy(,)")
                                dialog.input2.addButton("m", "multiply(,)")
                                dialog.input2.addButton("s", "symmetry(,,)")
                                dialog.input2.addButton("p", "project(,)")
                                dialog.input2.addButton("t", "translate(,)")

                            }; break;
                            case "vibrante3seconds": {
                                navigator.vibrate ? navigator.vibrate(3000) : game.xjb_systemEnergyChange(5);
                            }; break;
                        }
                    }
                }
                lib.extensionMenu.extension_新将包.hunbi = {
                    name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20" >' + '查看魂币数据',
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
                        let dataBase=game.xjb_currencyRate
                        let condition = {
                            "hunbi": "魂币:" + (hun(lib.config.xjb_hunbi)),
                            "dakadian": "打卡点:" + (hun(lib.config.xjb_hundaka2)),
                            "energy": "能量:" + (hun(lib.config.xjb_systemEnergy)),
                            "HunbiExpectation": "魂币期望:" + (hun(game.xjb_hunbiExpectation())),
                            "threeRate":"三等率:"+dataBase.firstRate+"/"+dataBase.secondRate+"/"+dataBase.thirdRate,
                            "floatRate":"浮流率:"+(game.xjb_inflationRate()*100).toFixed(2)+"%"
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
                                num = game.xjb_currencyRate.CoinToEnergy*num-1
                            }
                            else if (lib.config.xjb_hunbi > 50 && lib.config.xjb_hunbi <= 500) {
                                num = game.xjb_currencyRate.firstRate*num
                            }
                            else if (lib.config.xjb_hunbi > 500) {
                                num = game.xjb_currencyRate.firstRate*num+500
                            }
                            else if (lib.config.xjb_hunbi < 0) {
                                num = num * 50
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
                            if(layout>6) game.xjb_NoEnergy()
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
                            if (xx == 1 && !game.xjb_condition(1, num)) {
                                return game.xjb_create.alert("你未达成抽奖的条件！")
                            }
                            else if (xx == 2 && !game.xjb_condition(2, num)) {
                                return game.xjb_create.alert("你未达成抽奖的条件！")
                            }
                            else if (xx == 4 && (!game.xjb_condition(1, num) || !game.xjb_condition(3, 1 * layout))) {
                                return game.xjb_create.alert("你未达成抽奖的条件！")
                            }
                            if (xx == 4) xx = 1
                            if (xx !== 3) game.cost_xjb_cost(xx, num)
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
                    name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="16"><font color=yellow>技能附魔',
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
                        if (e === "openType") {//标签开关
                            game.xjb_create.configList({
                                xjb_skillTag_fuSkill: "福技:首次使用后恢复体力并加护甲的技能",
                                xjb_skillTag_luSkill: "禄技:首次使用后摸四张牌的技能",
                                xjb_skillTag_shouSkill: "寿技:首次使用后加两点体力上限的技能",
                                xjb_skillTag_qzj: "强制技:令目标失去技能的技能",
                                xjb_skillTag_suidongSkill: "随动技:因此技能发动而获得牌，得牌角色可以立即使用其中第一张牌的技能",
                            })
                            lib.skill.xjb_final.skillTag()
                        } else if (e === "addCharacter") {//角色开关
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
                            let obj = {}
                            if (!lib.config.xjb_skillTag_Character || !lib.config.xjb_skillTag_Character.length) return game.xjb_create.alert("你没有任何武将解锁了技能标签，请于 添删武将 中设置！")//检测是否有武将解锁了该功能
                            lib.config.xjb_skillTag_Character.forEach(function (item, index) {
                                if (lib.character[item] && lib.character[item][3] && lib.character[item][3].length) {//判断玩家是否有技能
                                    lib.character[item][3].forEach(function (item1, index1) {
                                        if (lib.skill[item1]) {//检测该技能是否存在
                                            let info = get.info(item1)
                                            if (!info.content) return;
                                            if (lib.config.xjb_skillTag_suidongSkill == 1) {
                                                obj["xjb_skillTag_suidongSkill_" + item1] = "【随动技】" + get.translation(item1) +
                                                    "(来源:" + get.translation(item) + "|" + item + ")"
                                            }
                                            if (info.enable && info.filterTarget) {//判断该技能为主动技且会选择角色
                                                if (lib.config.xjb_skillTag_qzj == 1) {
                                                    obj["xjb_skillTag_qzj_" + item1] = "【强制技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                            }
                                            /*下面这两行连写，会先判断是否有player.logSkill再判断是否为触发技*/
                                            else if (info.direct && info.content.toString().indexOf("player.logSkill") < 0) return //判断是否有技能提示
                                            else if (info.trigger) {//判断是否为触发技
                                                if (lib.config.xjb_skillTag_fuSkill == 1) {
                                                    obj["xjb_skillTag_fuSkill_" + item1] = "【福技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                                if (lib.config.xjb_skillTag_luSkill == 1) {
                                                    obj["xjb_skillTag_luSkill_" + item1] = "【禄技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                                if (lib.config.xjb_skillTag_shouSkill == 1) {
                                                    obj["xjb_skillTag_shouSkill_" + item1] = "【寿技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                            game.xjb_create.configList(obj, function () {
                                let arr = this.isOpened, object = {
                                    fuSkill: [],
                                    luSkill: [],
                                    shouSkill: [],
                                    qzj: [],
                                    suidongSkill: []
                                }
                                arr.forEach(function (item, index) {
                                    function addTag(type) {
                                        if (item.indexOf("xjb_skillTag_" + type + "_") > -1) {
                                            object[type].add(item.replace("xjb_skillTag_" + type + "_", ""))
                                        }
                                    }
                                    ["suidongSkill", "fuSkill", "luSkill", "shouSkill", "qzj"].forEach(WonderfulTag => {
                                        addTag(WonderfulTag)
                                    })

                                })
                                game.saveConfig("xjb_skillTag_Skill", object)
                            })
                            lib.skill.xjb_final.skillTag()//更新技能附魔
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
                                    var num = lib.config.xjb_jnc
                                    game.xjb_create.prompt('每开启一个技能槽，消费便多5个魂币，你当前有' + num + '个技能槽，请输入你要开启的技能槽数量', "", function () {
                                        var add = this.result
                                        if (add <= 0) {
                                            game.xjb_create.alert("请规范输入！", function () {
                                                obj.changeSkill1()
                                            })
                                        }
                                        else {
                                            add = parseInt(add, 10)//将add转化为十进制数
                                            var first = (15 + (num + 1) * 5)//获取第一个技能槽的cost
                                            var last = (15 + (num + add) * 5)//最后一个cost
                                            var cost = ((first + last) * add) / 2//高斯求和公式
                                            if (lib.config.xjb_hunbi >= cost) {
                                                game.xjb_create.confirm('开启' + add + '个技能槽，需要' + cost + '个魂币，是否开启？', function () {
                                                    game.cost_xjb_cost("B", cost)
                                                    game.xjb_newCharacterAddJnc(add)
                                                })
                                            }
                                            else game.xjb_create.alert('需要' + cost + '个魂币，你的魂币不足！')
                                        }
                                    }).inputSmall()
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
                                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                                game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi + 5)
                                                game.xjb_create.alert('你已删除该技能，重启即生效！' + "<br>当前魂币值为" + lib.config.xjb_hunbi).nextConfirm("是否继续查看？", function () {
                                                    obj.changeSkill2()
                                                })
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
                                game.xjb_create.file("请输入你的皮肤名，并选定图片，待确定出现后按确定即可。<br>注意:本功能仅手机端支持！", str1, function () {
                                    var that = this
                                    function theDownload(src) {
                                        var fileTransfer = new FileTransfer();
                                        var Myalert = game.xjb_create.alert("正在导入中...", function () {
                                            if (src !== lib.config.xjb_fileURL) theDownload(lib.config.xjb_fileURL)
                                        })
                                        ui.xjb_toBeHidden(Myalert.buttons[0])
                                        fileTransfer.download(that.file.result, src + "sink/xin_newCharacter/normal/" + that.result + that.file.type, function () {
                                            Myalert.innerHTML = "导入成功！"
                                            ui.xjb_toBeVisible(Myalert.buttons[0])
                                            lib.config.xjb_newcharacter.sink.add(that.result + that.file.type)
                                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                        }, function (e) {
                                            Myalert.innerHTML = "导入失败！<br>" + e.code
                                            ui.xjb_toBeVisible(Myalert.buttons[0])
                                            if (src !== lib.config.xjb_fileURL) {
                                                Myalert.innerHTML = "导入失败！即将切换路径2。<br>"
                                            }
                                        });
                                    }
                                    if (lib.config.xjb_newcharacter.sink.includes(that.result)) {
                                        game.xjb_create.confirm("你已有该同名的皮肤，是否覆盖？", theDownload, function () { sinks("img") })
                                    }
                                    else theDownload(lib.xjb_src)
                                })
                            }
                            var object = {
                                other: o => 1,
                                name2: function () {
                                    game.xjb_gainJP("免费更改姓名")
                                },
                                sex: function () {
                                    let sex = lib.config.xjb_newcharacter.sex
                                    let price=game.xjb_howMuchIsIt(5,3)
                                    game.xjb_create.confirm('你当前性别为：' + get.translation(sex) + `，更改性别需要1张性转卡(${price}魂币一张，当前你有` + lib.config.xjb_objects["changeSexCard"] + '张，无则自动购买)确定要更改吗？', function () {
                                        game.xjb_newCharacterChangeSex(1 * turn, boolean)
                                    })
                                },
                                group: function () {
                                    let group = lib.config.xjb_newcharacter.group
                                    let price=game.xjb_howMuchIsIt(4,3)
                                    game.xjb_create.confirm('你当前势力为：' + get.translation(group) + `，更改势力需要1个择木卡(${price}魂币一张，当前你有` + lib.config.xjb_objects["changeGroupCard"] + '张，无则自动购买)，确定要更改吗？', function () {
                                        game.xjb_gainJP("免费更改势力", false)
                                    })
                                },
                                hp: function () {
                                    game.xjb_gainJP("体力值(1点)", false)
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
                                            if (lib.character.xjb_newCharacter[4].includes("red")) { }
                                            else {
                                                lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSink]
                                                lib.characterPack["mode_extension_新将包"].xjb_newCharacter
                                            }
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
                                        if (lib.character.xjb_newCharacter[4].includes("red")) { }
                                        else if (lib.character.xjb_newCharacter[4].includes("xuemo")) { }
                                        else {
                                            lib.characterPack["xjb_soul"].xjb_newCharacter = lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSink]
                                        }
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
                else {
                    let on_or_off1 = function () {
                        if (lib.config.xjb_bianshen == 2) return '<font color="blue">开启变身功能</font>'
                        return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">关闭变身功能</font>'
                    }
                    lib.extensionMenu.extension_新将包.bianshen_hun_on_or_off = {
                        name: on_or_off1(),
                        clear: true,
                        onclick: function () {
                            if (lib.config.xjb_bianshen == 2) lib.config.xjb_bianshen = 1;
                            else lib.config.xjb_bianshen = 2;
                            game.saveConfig('xjb_bianshen', lib.config.xjb_bianshen);
                            game.xjb_create.alert('魂币系统已更新，重启即生效');
                            this.innerHTML = on_or_off1()
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
                else {
                    let on_or_off2 = function () {
                        if (lib.config.xjb_yangcheng == 2) return '<font color="blue">开启养成功能</font>'
                        return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">关闭养成功能</font>'
                    }
                    lib.extensionMenu.extension_新将包.yangcheng_hun_on_or_off = {
                        name: on_or_off2(),
                        clear: true,
                        onclick: function () {
                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            if (lib.config.xjb_yangcheng == 2) lib.config.xjb_yangcheng = 1;
                            else lib.config.xjb_yangcheng = 2;
                            game.saveConfig('xjb_yangcheng', lib.config.xjb_yangcheng);
                            game.xjb_create.alert('魂币系统已更新，重启即生效');
                            this.innerHTML = on_or_off2()
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
                } else {
                    let on_or_off3 = function () {
                        if (lib.config.xjb_chupingjisha == 2) return '<font color="blue">开启触屏即杀</font>'
                        return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">关闭触屏即杀</font>'
                    }
                    lib.extensionMenu.extension_新将包.xjb_chupingjisha_hun_on_or_off = {
                        name: on_or_off3(),
                        clear: true,
                        onclick: function () {
                            if (lib.config.xjb_chupingjisha == 2) {
                                lib.config.xjb_chupingjisha = 1;
                                lib.config.xjb_systemEnergy > 0 && lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()
                            }
                            else {
                                lib.config.xjb_chupingjisha = 2;
                                ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove()
                            }
                            game.saveConfig('xjb_chupingjisha', lib.config.xjb_chupingjisha);
                            this.innerHTML = on_or_off3()
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
            if (true) {
                function on_off_ll() {
                    if (lib.config.xjb_lingli_Allallow) return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="#e75480">点我关闭全员灵力系统</font>'
                    return '<font color="blue">点我开启全员灵力系统</font>'
                }
                lib.extensionMenu.extension_新将包.xjb_lingliOpen = {
                    name: on_off_ll(),
                    clear: true,
                    onclick: function () {
                        lib.config.xjb_lingli_Allallow = !lib.config.xjb_lingli_Allallow
                        game.saveConfig('xjb_lingli_Allallow', lib.config.xjb_lingli_Allallow)
                        this.innerHTML = on_off_ll()
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
                name: '<div>导出魂币系统数据！(仅供手机端)</div>',
                clear: true,
                onclick: function () {
                    new Promise(res => {
                        game.xjb_create.prompt("请输入导出文件的路径及名称", lib.config.xjb_fileURL + "json/", function () {
                            res(this.result)
                        })
                    }).then(data => {
                        let dataxjb = {};
                        lib.xjb_dataGet().forEach(i => { dataxjb[i] = lib.config[i] })
                        let BLOB = new Blob([JSON.stringify(dataxjb)], {
                            type: "application/javascript;charset=utf-8"
                        })
                        var reader = new FileReader()
                        reader.readAsDataURL(BLOB, "UTF-8")
                        reader.onload = function () {
                            var fileTransfer = new FileTransfer();
                            var Myalert = game.xjb_create.alert("正在导出中...")
                            fileTransfer.download(this.result, data + ".json", function () {
                                Myalert.innerHTML = "导出成功！"
                            }, function (e) {
                                Myalert.innerHTML = "导出失败！<br>" + e.code
                            });

                        }
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
                                game.print(i, data[i]);
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
        }, precontent: function () {
            function way() {
                //新将包路径来源     
                if (document.body.outerHTML) {
                    let srcs = Array.from(document.scripts).map(function (a) {
                        if (a.outerHTML.indexOf('extension') > -1) return a.src
                    }).filter(a => a)
                    let src = srcs[0]
                    if (srcs) {
                        src = src.replace("/extension.js", "")
                        let i = src.lastIndexOf("/")
                        src = src.slice(0, i)
                        src += "/新将包/"
                        lib.xjb_src = src
                    }
                }
                lib.xjb_src = lib.xjb_src || lib.assetURL + "extension/新将包/"
            }
            //这用于引入文件
            function importFile() {
                let count = 0;
                const files = ["event", "lingli", "skills", "card", "project", "rpg", "translate", "dialog", "economy"];
                function loadFiles(fileName) {
                    lib.init.js(lib.xjb_src + "js", fileName, () => {
                        window[`XJB_LOAD_${fileName.toUpperCase()}`](_status, lib, game, ui, get, ai);
                        count++;
                    }, (err) => { game.print(err) });
                }
                new Promise(res => {
                    //引入css文件    
                    lib.init.css(lib.xjb_src + "css", "css1", () => {
                        game.print("样式表引入成功——新将包")
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
                    lib.init.js(lib.xjb_src + "js", "library", () => {
                        game.print("图书馆资料引入成功——新将包")
                    })
                    function interval() {
                        if (count >= files.length + 2) {
                            res()
                            clearInterval(interval)
                        }
                    }
                    setInterval(interval, 100)
                }).then(data => {
                    lib.init.js(lib.xjb_src + "js", "final", () => {
                        window.XJB_LOAD_FINAL(_status, lib, game, ui, get, ai)
                    })
                })

            }
            function initialize() {
                if (!lib.config.xjb_fileURL) {
                    lib.config.xjb_fileURL = "file:///storage/emulated/0/Android/data/com.noname.shijian/extension/新将包/"
                }
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
                //设置变身
                lib.config.xjb_bianshenCharacter = {};
                //设置增加到牌堆的卡牌
                if (!lib.config.xjb_cardAddToPile) lib.config.xjb_cardAddToPile = {}
                //设置列表
                lib.config.xjb_list_hunbilist = {
                    skill: {
                        first: ["xjb_juanqu", "xjb_lunhui"],
                        second: ["xjb_leijue", "xjb_bingjue"],
                        third: ["xjb_pomie", "xjb_huojue"],
                    },
                    choujiang: {
                    },
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
                        red: ["xjb_redSkill", "xjb_redSkill_1", "xjb_redSkill_2"].concat(lib.config.xjb_redSkill.list),
                    },
                    theStorage: "",
                    theFunction: {
                        xjb_chupingjisha: function () {
                            ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove()
                            //"stayleft"可以让该元素保持在左边
                            ui.xjb_chupingjisha = ui.create.control("触屏即杀", 'stayleft', lib.xjb_list_xinyuan.dom_event.chupingjisha)
                        }
                    },
                    dom_event: {
                        chupingjisha: function (e) {
                            this.hide()
                            var next = game.createEvent("xjb-chupingjisha")
                            next.player = game.me
                            _status.event.next.remove(next);
                            _status.event.getParent().next.push(next);
                            next.setContent(function () {
                                "step 0"
                                let list1 = ["流失", "火焰", "雷电", "冰冻", "破甲", "神袛"], list2 = ["1次", "2次", "3次", "4次", "5次"]
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
                                    let e = new Array()
                                    e.length = get.xjb_number(times)
                                    e.fill(activity)
                                    player.fc_X(...e, [game.players.length])
                                    game.xjb_systemEnergyChange(-get.xjb_number(times) * 30)
                                }
                                "step 2"
                                ui.xjb_chupingjisha.show()
                            })
                            //如果是你的出牌阶段发动此技能
                            if (_status.event.name == 'chooseToUse' && _status.event.player) {
                                //这个设置是关键的一步，说明本次chooseToUse是发动了技能，以让phaseUse转起来
                                _status.event.result = {
                                    bool: true,
                                    skill: 'xjb_chupingjisha'
                                }
                                //这一步是让触屏击杀事件得以发动
                                game.resume()
                            }
                        },
                    }
                }
            }
            way()
            initialize()
            importFile()
            //折头折百花联动
            if (lib.config.extensions.includes('枝头折百花') && lib.config.extension_枝头折百花_enable) {
                lib.nature && lib.nature.push && lib.nature.push('flower')
                game.addNature && game.addNature('flower')
                lib.skill._ztzbh_flowerDamage = {
                    trigger: {
                        source: ["damageBegin"],
                    },
                    filter: function (event, player) {
                        if (game.roundNumber % 4 == 1) lib.translate._ztzbh_flowerDamage = '春雷'
                        if (game.roundNumber % 4 == 2) lib.translate._ztzbh_flowerDamage = '炎夏'
                        if (game.roundNumber % 4 == 3) lib.translate._ztzbh_flowerDamage = '寂秋'
                        if (game.roundNumber % 4 == 0) lib.translate._ztzbh_flowerDamage = '凌冬'
                        if (!(event.nature == "flower")) return false;
                        return true;
                    },
                    content: function () {
                        "step 0"
                        trigger.cancel()
                        if (game.roundNumber % 4 == 1) trigger.player.damage(1, "thunder", player) && player.popup('春雷')
                        if (game.roundNumber % 4 == 2) trigger.player.damage(1, "fire", player) && player.popup('炎夏')
                        if (game.roundNumber % 4 == 3) trigger.player.loseHp(1, player) && player.popup('寂秋')
                        if (game.roundNumber % 4 == 0) trigger.player.damage(1, "ice", player) && player.popup('凌冬')
                    },
                }
                lib.translate._ztzbh_flowerDamage = '花伤'
                lib.skill._ztzbh_liandong = {
                    trigger: {
                        player: Object.keys(lib.extensionPack.枝头折百花.skill.skill).map(i => i + "After")
                    },
                    filter: function (event, player) {
                        return player === game.me
                    },
                    direct: true,
                    content: function () {
                        let name = player.name
                        game.xjb_getDaomo(player, "flower")
                    }
                }
            }
        }, help: {}, config: {}, package: {
            intro: "<a href=https://gitee.com/xinyuanwm/new-jiang class=xjb_hunTitle>扩展已上传至git！</a>",
            author: "<a href=https://b23.tv/RHn9COW class=xjb_hunTitle>新元noname</a>",
            diskURL: "",
            forumURL: "",
            version: "1.2.0.020224",
        }, files: { "character": ["xjb_jiaxu.jpg"], "card": ["xin_qixing.png"], "skill": [], "audio": [] }
    }
})