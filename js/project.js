import { XJB_Math } from "./tool/math.js";
import { _status, lib, game, ui, get, ai } from "../../../noname.js"
/*file*/
game.xjb_transferFile = function (BLOB, fileWay, silent) {
    function download() {
        const obj = {}
        if (!silent) obj.Myalert = game.xjb_create.alert("正在导出中...")
        const sucCallback = e => obj.Myalert && (obj.Myalert.innerHTML = "导出成功！");
        const failCallback = err => obj.Myalert && (obj.Myalert.innerHTML = "导出失败！<br>" + err);
        try {
            if ("FileTransfer" in window) var fileTransfer = new FileTransfer();
            if (fileTransfer) return fileTransfer.download(
                this.result,
                fileWay,
                sucCallback,
                failCallback
            );
            if (lib.node) return lib.node.fs.writeFile(
                window.decodeURIComponent(new URL(fileWay).pathname).substring(1),
                Buffer.from(new Uint8Array(this.result)),
                err => {
                    if (err) return failCallback(err);
                    sucCallback();
                }
            )
        } catch (err) {
            failCallback(err);
        }
    }
    if (typeof BLOB === "string") {
        const myTarget = {
            result: BLOB,
        }
        download.apply(myTarget, []);
        return;
    }
    else {
        var reader = new FileReader()
        reader.onload = download;
        if (lib.node) return reader.readAsArrayBuffer(BLOB)
        reader.readAsDataURL(BLOB, "UTF-8")
    }
};
game.xjb_checkCharacterCount = function (id, attr, preValue) {
    if (!lib.config.xjb_count[id]) lib.config.xjb_count[id] = {}
    if (!lib.config.xjb_count[id][attr]) lib.config.xjb_count[id][attr] = preValue;
}
game.xjb_checkCharacterDaomo = function (id, type) {
    if (!lib.config.xjb_count[id]) lib.config.xjb_count[id] = {}
    if (!lib.config.xjb_count[id].daomo[type]) lib.config.xjb_count[id].daomo[type] = { number: 0 };
}
game.xjb_isKind = function (player, kindName) {
    player = typeof player === "string" ? player : player.name;
    if (!lib.config.xjb_count[player]) return false;
    if (!lib.config.xjb_count[player].kind != kindName) return false;
}

lib.skill.xjb_6 = {
    "xjb_storage": function () {
        get.xjb_storage = function () {
            let num, all, player
            Array.from(arguments).forEach(i => {
                if (typeof i === 'number') {
                    num = Math.max(1, i)
                } else if (i === true) {
                    all = i
                } else if (typeof i == 'object') {
                    player = i.name1
                } else if (typeof i === 'string') {
                    player = i
                }
            })
            let target = lib.config.xjb_count[player] && lib.config.xjb_count[player].xjb_storage
            if (!target) return;
            if (Object.keys(target).filter(i => i === 'total').length === 0) return;
            if (all) return target
            if (num) return Object.values(target).filter(i => typeof i === 'object')[num - 1]
        }
    },
    hpcard: function () {
        game.xjb_getHpCard = function (player, value = 1, num) {
            if (typeof player != 'string') player = player.name1
            if (!lib.config.xjb_count[player]) lib.config.xjb_count[player]
            if (!lib.config.xjb_count[player].HpCard) lib.config.xjb_count[player].HpCard = []
            let list = new Array(num).fill(value)
            lib.config.xjb_count[player].HpCard.push(...list)
            game.saveConfig('xjb_count', lib.config.xjb_count);
            var dialog = ui.create.dialog(get.translation(player) + '获得了体力卡', game.createHpCard(value))
            dialog.add('(计' + num + '个)')
            dialog.style['z-index'] = '15'
            setTimeout(function () {
                dialog.close();
            }, 2500)
            game.xjb_systemEnergyChange(-7 * value * num)
        }
    },
    information: function () {
        game.xjb_getSb = {
            position: (player) => {
                return player.storage.lingliPosition || "air"
            },
            allLingli: function (player) {
                let targets = game.players.filter(i => {
                    return this.position(i) == this.position(player)
                })
                let num = 0
                targets.forEach(i => num = num + i.countMark("_xjb_lingli"))
                return num
            },
            //道具
            means: (player) => {
                function Means(translation, num, picture, intro) {
                    this.translation = translation
                    this.num = num
                    this.picture = picture
                    this.intro = intro
                }
                Means.prototype.organize = function () {
                    let li = document.createElement("li")
                    li.appendChild(this.picture)
                    let span = document.createElement("span")
                    span.innerHTML = this.translation + "×" + this.num
                    span.style.position = "relative"
                    li.appendChild(span)
                    if (typeof this.intro === "function") {
                        this.picture.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', this.intro)
                        return li
                    }
                    let introduction = document.createElement("div")
                    introduction.innerHTML = this.translation + ":" + this.intro
                    introduction.style.position = "relative"
                    introduction.style.display = "none"
                    li.onmouseover = function () {
                        introduction.style.display = "block"
                    }
                    li.onmouseout = function () {
                        introduction.style.display = "none"
                    }
                    li.appendChild(introduction)
                    return li
                }
                var result = [];
                function picture(str, h, w) {
                    let i = document.createElement("div")
                    i.style.display = "block";
                    i.style.height = h + "px";
                    i.style.width = w + "px";
                    i.style.backgroundImage = `url(${lib.xjb_src + str})`;
                    i.style.backgroundSize = "100% 100%"
                    i.style.position = "relative"
                    return i
                }
                //体力牌统计
                {
                    game.xjb_checkCharacterCount(player, "HpCard")
                    let dataSource = lib.config.xjb_count[player].HpCard;
                    let dataList = game.countHpCard(dataSource)
                    new Array(1, 2, 3, 4, 5).forEach(function (item) {
                        if (dataList["" + item]) result.push(new Means(
                            item + "点体力牌",
                            dataList["" + item],
                            picture("HpCard/" + item + ".jpg", 100, 55),
                            "开局时使用，使用后加" + item + "点体力上限和体力"
                        )
                        )
                    })
                }
                {
                    game.xjb_checkCharacterCount(player, "daomo")
                    for (const [daomo, info] of Object.entries(lib.config.xjb_count[player].daomo)) {
                        game.xjb_checkCharacterDaomo(player, daomo)
                        const basicInformation = get.xjb_daomoInformation(daomo)
                        result.push(new Means(
                            basicInformation.translation,
                            info.number,
                            picture("lingli/" + daomo + ".jpg", 75, 75),
                            basicInformation.intro
                        ))
                    }
                }
                //书统计
                {
                    game.xjb_checkCharacterCount(player, "book")
                    let dataSource = lib.config.xjb_count[player].book
                    dataSource.forEach(i => {
                        result.push(new Means(
                            i.headline + "(单击点开后，双击可以收起)",
                            1,
                            picture("lingli/book.jpg", 100, 100),
                            () => {
                                ui.create.xjb_book(ui.window, xjb_library[i.type][i.headline])
                            }
                        ))
                    })
                }
                return result
            }
        }
    },
    bianshen: function () {
        lib.skill._xjb_bianshen = {
            enable: "phaseUse",
            filter: function (event, player) {
                if (lib.config.xjb_bianshen !== 1) return false;
                if (!(player == game.me || player.isUnderControl())) return false;
                if (!game.xjb_storeCard_information.xjb_BScharacter.canPurchase()) return false;
                if (player.countMark('_xin_bianshen') > 0) return false;
                return true
            },
            bianshenCard: {
                "yi": [["xjb_baiyin", "club", 1], ["xjb_hutou", "spade", 11]],
                "po": [["xjb_chitu", "heart", 5], ["xjb_qinglong", "spade", 5]],
                "yu": [["xjb_qingnangshu", "heart", 7]],
                "ji": [["xjb_card_lw", "red", 13]],
                "all": [["xjb_qixing", "diamond", 7]]
            },
            content: function () {
                "step 0"
                let trueBody = game.xjb_storeCard_information.xjb_BScharacter;
                let addToList = function (tsl) {
                    let result = []
                    for (let k in lib.translate) {
                        lib.translate[k] && lib.translate[k].includes(tsl) && lib.character[k] && result.push(k)
                    }
                    return result;
                };
                let yi = addToList('马超').randomGet(),
                    po = addToList('关羽').randomGet(),
                    yu = addToList('华佗').randomGet(),
                    ji = addToList('贾诩').randomGet(),
                    all = addToList('诸葛亮').randomGet()
                const list = [yi, po, yu, ji, all]
                player.chooseButton([`选择一张变身的武将牌，花费魂币: ${trueBody.content.cost}`, '-武将列表-', [list, 'character']])
                event.yi = yi; event.po = po; event.yu = yu; event.ji = ji; event.all = all
                "step 1"
                if (result.bool) {
                    const name = result.links[0];
                    const info = get.info(event.name)
                    game.xjb_storeCard_information.xjb_BScharacter.purchase();
                    const object = {
                        name: name,
                        skills: [...lib.character[name][3]],
                        hp: lib.character[name].hp,
                        maxHp: lib.character[name].maxHp,
                        hs: get.cards([3, 4, 5, 6].randomGet())
                    }
                    for (const word of ["yi", "po", "yu", "ji", "all"]) {
                        if (name === event[word]) event.chosen = word;
                    }
                    player.xjb_bianshen(object, info.bianshenCard[event.chosen]);
                }
            }
        }
        lib.translate._xjb_bianshen = "魂将"
    },
}
lib.skill.xjb_9 = {
    title: function () {
        //这个函数可以唤出武将介绍，如果填写了id，这为初始武将为角色id
        game.xjb_Intro = function (playerName) {
            //生成界面
            let intro = ui.create.xjb_double("这是可以查询武将进度之处")
            intro.right.style.overflow = "auto"
            //搜索部分
            let textarea = document.createElement("textarea")
            intro.left.appendChild(textarea)
            ui.xjb_giveStyle(textarea, {
                margin: "auto",
                width: "98%",
                height: "24px",
                fontSize: "24px"
            })
            textarea.onkeydown = function (e) {
                if (e && e.keyCode === 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    //现在所有角色的样式设置为块级元素
                    this.index.forEach(function (item) {
                        item.style.display = "block"
                    })
                    //如果是空字符则全部显示
                    //遍历索引，则令所有不含该字符的角色消失
                    this.index.forEach(function (item) {
                        if (item.innerHTML.indexOf(textarea.value) < 0) item.style.display = "none"
                    })
                }
            };
            textarea.onkeyup = function () {
                if (this.value === "") {
                    this.index.forEach(function (item) {
                        item.style.display = "block"
                    })
                }
            }
            //创建放武将列表
            let ul = document.createElement("ul")
            intro.left.appendChild(ul)
            textarea.index = []
            ui.xjb_giveStyle(ul, {
                overflow: "auto",
                "list-style": "none",
                paddingLeft: "0px",
                width: "100%",
                height: "300px",
                backgroundColor: "#3c4151"
            })
            Object.keys(lib.config.xjb_count).forEach(function (item) {
                if (lib.character[item]) {
                    //
                    let li = document.createElement("li")
                    li.innerHTML = `${get.translation(item)}(${item})`
                    textarea.index.add(li)
                    ul.appendChild(li)
                    ui.xjb_giveStyle(li, {
                        width: "90%",
                        fontSize: "20px",
                        color: "black",
                        border: "solid 1.5px",
                        backgroundColor: "white"
                    })
                    li.myName = item
                    li.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                        //这是设置彩框
                        textarea.index.forEach(function (item) {
                            item.className = ""
                        })
                        this.className = "xjb_color_circle"
                        if (intro.left.I) intro.left.I.remove()
                        intro.right.character_id = item
                        intro.right.clear()
                    })
                }
            })
            intro.right.clear = function () {
                //清除技能   
                intro.right.player.xjb_zeroise(intro.right.character_id)
                intro.right.player.node.avatar.onclick = function () {
                    lib.soul[intro.right.player.name1] && lib.soul[intro.right.player.name1]()
                };
                intro.right.name.onclick = () => {
                    if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.name2()
                };
                intro.right.group.onclick = () => {
                    if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.group()
                };
                intro.right.sex.onclick = () => {
                    if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.sex()
                };
                intro.right.name.innerHTML = "<span data-nature='water'>姓名:" +
                    get.translation(intro.right.player.name1) + "</span>"
                if (!lib.character[intro.right.player.name1]) return;
                intro.right.group.innerHTML = "<span data-nature='wood'>势力:" +
                    get.translation(lib.character[intro.right.player.name1][1]) + "</span>"

                intro.right.sex.innerHTML = "<span data-nature='soil'>性别:" +
                    get.xjb_translation(lib.character[intro.right.player.name1][0]) + "</span>"

                intro.right.Title.innerHTML = "<span data-nature='metal'>称号</span>:<br>" +
                    (lib.characterTitle[intro.right.player.name1] && lib.characterTitle[intro.right.player.name1].indexOf('获得称号方式') > 0 ? "无" : lib.characterTitle[intro.right.player.name1])
            }
            let div = document.createElement("div")
            ui.xjb_giveStyle(div, {
                width: "100%",
                height: "180px",
                position: "relative"
            })
            intro.right.appendChild(div)
            let player = ui.create.player()
            player.init("xin_fellow")
            intro.right.player = player
            intro.right.character_id = playerName || "xin_fellow"
            //调整样式
            ui.xjb_giveStyle(player, {
                marginTop: "-48px",
                position: "relative"
            })
            div.appendChild(player)
            //设置信息列表
            let infor = document.createElement("ul")
            ui.xjb_giveStyle(infor, {
                float: "right",
                overflow: "auto",
                width: "50%",
                height: "180px",
                marginTop: "0px",
                "list-style": "none",
                paddingLeft: "0px",
                fontSize: "24px"
            })
            div.appendChild(infor)
            let li1 = document.createElement("li")
            infor.appendChild(li1)
            intro.right.name = li1
            let li2 = document.createElement("li")
            infor.appendChild(li2)
            intro.right.group = li2
            let li3 = document.createElement("li")
            infor.appendChild(li3)
            intro.right.sex = li3
            let li4 = document.createElement("li")
            infor.appendChild(li4)
            intro.right.Title = li4
            let hr = document.createElement("hr")
            intro.right.appendChild(hr)
            //这里是tab栏
            let tab = document.createElement("div")
            intro.right.appendChild(tab)
            ui.xjb_giveStyle(tab, {
                paddingLeft: "12px",
                position: "relative",
                overflow: "auto",
                height: "11%",
                width: "100%"
            })
            function addButton(str) {
                let button = ui.create.xjb_button(tab, str)
                ui.xjb_giveStyle(button, {
                    marginLeft: "0px",
                    marginRight: "21px",
                    marginBottom: "5px",
                    height: "24px",
                    fontSize: "20px",
                    padding: "5px"
                })
                return button
            }
            //设置数据一览
            let data = addButton("<span data-nature='key'>数据一览</span>")
            intro.right.dataSet = data
            data.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                if (intro.left.I) intro.left.I.remove()
                let xjb_count_data = document.createElement("ul")
                ui.xjb_giveStyle(xjb_count_data, {
                    fontSize: "20px",
                    "list-style": "none",
                    paddingLeft: "0px",
                })
                intro.right.appendChild(xjb_count_data)
                intro.left.I = xjb_count_data
                let count = lib.config.xjb_count[intro.right.character_id]
                //排序
                let arr1 = Object.keys(count).filter(item => {
                    if (["selectedTitle", "HpCard", "uniqueSkill", "titles", "skill", "xjb_storage", "dialog", "book", "daomo", "lingtan", "lingfa"].includes(item))
                        return false
                    return true
                })
                arr1.sort(function (a, b) {
                    if (lib.xjb_list_xinyuan._order[a] && lib.xjb_list_xinyuan._order[b]) {
                        return (lib.xjb_list_xinyuan._order[a] - lib.xjb_list_xinyuan._order[b])
                    }

                    return a > b ? 1 : -1
                })
                arr1.forEach(function (item) {
                    let countA = document.createElement("li"), theStr
                    if (item === "ice") {
                        theStr = "<span data-nature='ice'>"
                    } else if (item === "fire" || item.indexOf('zhu') >= 0 || item.indexOf('landlord') >= 0) {
                        theStr = "<span data-nature='fire'>"
                    } else if (item === "thunder" || item.indexOf('nei') >= 0) {
                        theStr = "<span data-nature='thunder'>"
                    } else if (item.indexOf('fan') >= 0 || item.indexOf('farmer') >= 0) {
                        theStr = "<span data-nature='wood'>"
                    } else if (item.indexOf('zhong') >= 0) {
                        theStr = "<span data-nature='orange'>"
                    } else if (get.xjb_translation(item).indexOf('场') >= 0) {
                        theStr = "<span data-nature='kami'>"
                    } else {
                        theStr = "<span data-nature='metal'>"
                    }
                    countA.innerHTML = `${theStr}${get.xjb_translation(item)}:${count[item]}</span>`
                    xjb_count_data.appendChild(countA)
                })
            })
            //设置称号设定
            let title = addButton("<span data-nature='key'>称号一览</span>")
            intro.right.titleSet = title
            title.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                if (intro.left.I) intro.left.I.remove()
                let xjb_count_title = document.createElement("ul")
                ui.xjb_giveStyle(xjb_count_title, {
                    fontSize: "20px",
                    "list-style": "none",
                    paddingLeft: "0px",
                    width: "80%"
                })
                intro.right.appendChild(xjb_count_title)
                intro.left.I = xjb_count_title
                let count = lib.config.xjb_count[intro.right.character_id].titles
                count.forEach(function (item) {
                    let countA = document.createElement("li")
                    countA.innerHTML = item
                    xjb_count_title.appendChild(countA)
                    countA.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                        game.xjb_create.confirm('是否将' + item + '设置为你的称号', function () {
                            lib.config.xjb_count[intro.right.character_id].selectedTitle = item
                            game.saveConfig("xjb_count", lib.config.xjb_count)
                            game.xjb_create.alert("已设置成功，重启即生效！")
                        })
                    })
                })
                if (true) {
                    let countA = document.createElement("li")
                    countA.innerHTML = "<span data-nature='key'>双击查看获取称号方法！</span>"
                    countA.addEventListener('dblclick', function () {
                        game.xjb_create.condition(
                            lib.xjb_title_condition,
                            lib.config.xjb_count[intro.right.character_id].titles2
                        )
                    })
                    xjb_count_title.appendChild(countA)

                }
            })
            //背包设定
            let bag = addButton("<span data-nature='key'>背包查看</span>")
            intro.right.bagSet = bag
            bag.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                if (intro.left.I) intro.left.I.remove()
                let xjb_count_bag = document.createElement("ul")
                ui.xjb_giveStyle(xjb_count_bag, {
                    fontSize: "20px",
                    "list-style": "none",
                    paddingLeft: "0px",
                    width: "80%"
                })
                intro.right.appendChild(xjb_count_bag)
                intro.left.I = xjb_count_bag
                game.xjb_getSb.means(intro.right.character_id).forEach(i => {
                    i.num > 0 && xjb_count_bag.appendChild(i.organize())
                })
                if (!xjb_count_bag.children.length) {
                    let countA = document.createElement("li")
                    countA.innerHTML = "你背包内没有任何东西！"
                    xjb_count_bag.appendChild(countA)
                    ui.xjb_giveStyle(xjb_count_bag, {
                        marginTop: "20px",
                    })
                }
            })
            intro.right.clear()
            for (let y in intro) {
                if (y === "back") continue
                intro.back[y] = intro[y]
            }
            return intro
        }
        game.xjb_Intro2 = function (playerName) {
            if (!game.xjb_Introduction) {
                game.xjb_Introduction = game.xjb_Intro().back
                game.xjb_back = null
                game.xjb_Introduction.close.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', game.xjb_Introduction.close.closeBack)
                game.xjb_Introduction.close.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                    game.xjb_Introduction.style.display = "none"
                })
            }
            game.xjb_Introduction.style.display = "block"
            game.xjb_Introduction.right.character_id = playerName || "xin_fellow"
            game.xjb_Introduction.right.clear()
            return game.xjb_Introduction
        }
    },
    storage: function () {
        /*ui.create.xjb_storage只有一个参数，这个参数是用来设置底部文字的*/
        ui.create.xjb_storage = function (str) {
            //创建背景   
            var list = ui.create.xjb_back(str)
            var back = list[0] //这是背景
            var theX = list[1] //这是关闭键
            //创建存档区
            var div_1 = ui.xjb_addElement({
                target: back,
                tag: 'div',
                style: {
                    height: "75%", width: "90%", margin: "4% auto", display: 'inline-block',
                    "border-radius": "1em", overflow: "auto", position: 'absolute'
                }
            })
            //这个是下方操作区
            var ul = ui.xjb_addElement({
                target: back,
                tag: 'ul',
                style: {
                    height: "8%", width: "90%", "background-color": "#996600",
                    "margin": "42% 0 0 1.5%", "border-radius": "5em",
                    border: "8px solid #f4a460", "list-style": "none", position: 'absolute'
                }
            })
            //这是三个操作区按键
            function createKey(innerHTML) {
                return ui.xjb_addElement({
                    target: ul,
                    tag: 'li',
                    innerHTML: innerHTML,
                    style: lib.xjb_style.storage_li
                })
            }
            var li_1 = createKey("创建存档");
            var li_2 = createKey("读取存档");
            var li_3 = createKey("删除存档");
            return {
                back: back,
                div_1: div_1,
                ul: ul,
                li_1: li_1,
                li_2: li_2,
                li_3: li_3,
                close: theX
            }
        }
        /*ui.create.xjb_theStorage有两个参数，第一个为其父元素，第二个为存档号*/
        ui.create.xjb_theStorage = function (storage, num) {
            //创建一个存档
            var div = document.createElement('ul')
            ui.xjb_giveStyle(div, lib.xjb_style.storage_ul)
            if (storage.children.length > 0) {
                ui.xjb_giveStyle(div, { "margin-top": "20px", })
            } //如果不是第一个存档，则给一个上边距           
            //设置存档内容的抬头
            /*ui.xjb_giveContent函数最后一个元素为数组，设置父元素及子元素样式，
            前面为字符串有多少个则创建多少个li子元素，且子元素的内容和字符串内容相同*/
            var sto_list = ui.xjb_giveContent("<b>存档号</b>", "<b>存档角色</b>", "<b>关卡信息</b>", "<b>存档时间</b>", [div, {
                height: "94%",
                width: "17%",
                float: "left",
                "margin-right": "8%",
                fontSize: "15px",
                "text-align": "center"
            }])
            //设置被记录存档号
            div.num = num
            sto_list[0].num = num
            game.saveConfig("xjb_myStorage", lib.config.xjb_myStorage)
            //设置存档号
            var str = "" + sto_list[0].num
            while (str.length < 7) str = "0" + str//不足七位用零补齐
            var p1 = ui.xjb_addElement({
                target: sto_list[0],
                tag: "p",
                innerHTML: str,
            })
            storage.appendChild(div)//将以上内容放入父节点
            //设置存档被点击后的事件
            div.update = function () {
                game.pause()
                Array.from(storage.children).forEach((i, k) => {
                    i.id = ""
                    ui.xjb_giveStyle(i, lib.xjb_style.storage_ul)
                })
                this.id = "xjb_storage_theStorage"
                this.map = lib.config.xjb_myStorage[this.num]
                this.setAttribute('xjb_information', `存档信息:编号:${this.num} 时间:${this.map.date} 关卡:${this.map.level.name}                
武将名称:${this.map.character.name}(${this.map.character.id}),
武将状态:体力:${this.map.character.hp}/${this.map.character.maxHp}  护甲:${this.map.character.hujia} 横置:${this.map.character.linked} 翻面:${this.map.character.turnedOver},
手牌区牌数/装备区牌数/判定区牌数/特殊区牌数/武将牌上牌数:${this.map.character.h.length}/${this.map.character.e.length}/${this.map.character.j.length}/${this.map.character && this.map.character.s && this.map.character.s.length}/${this.map.character && this.map.character.x && this.map.character.x.length},
`)
            };
            div.onclick = () => div.update();
            return {
                ul: div,
                theNum: sto_list[0],
                theCharacter: sto_list[1],
                theLevel: sto_list[2],
                theTime: sto_list[3]
            };
        }
        //读档函数
        game.xjb_storage_1 = function (player, bool) {
            //创建存档
            var storage = ui.create.xjb_storage()
            //引入存档信息
            for (var i in lib.config.xjb_myStorage) {
                if (typeof lib.config.xjb_myStorage[i] === "object") {
                    var thelist = ui.create.xjb_theStorage(storage.div_1, parseInt(i))//storage.div_1，即放存档的地方
                    var target = lib.config.xjb_myStorage[i]
                    const eachPartSet = [
                        { target: thelist.theTime, innerHTML: target.date },
                        { target: thelist.theCharacter, innerHTML: target.character.name },
                        { target: thelist.theLevel, innerHTML: target.level.name }
                    ];
                    eachPartSet.forEach(k => {
                        ui.xjb_addElement({ ...k, tag: 'p' })
                    })
                    if (bool === true) {
                        if (target.level.Type != _status.xjb_level.Type) thelist.ul.style.display = "none"
                    }
                }
            }
            //设置存档操作键1事件
            storage.li_1.onclick = function () {
                //创建存档
                var list = ui.create.xjb_theStorage(storage.div_1, ++lib.config.xjb_myStorage.total)
                //设置存档信息
                lib.config.xjb_myStorage[list.theNum.num] = {}
                var obj = lib.config.xjb_myStorage[list.theNum.num]
                //存档角色信息
                obj.character = {
                    id: player.name1,
                    name: "",
                    hp: Math.max(player.hp, 1),
                    maxHp: player.maxHp,
                    hujia: player.hujia,
                    linked: player.isLinked(),
                    turnedOver: player.isTurnedOver(),
                    h: [],
                    e: [],
                    j: [],
                    x: [],
                    s: []
                }
                //存档关卡信息
                obj.level = {
                    name: _status.xjb_level.name,
                    number: _status.xjb_level.number,
                    Type: _status.xjb_level.Type
                }
                var time = game.xjb_getCurrentDate();
                var str = `${time[0]}-${time[1]}-${time[2]}-${time[3]}-${time[4]}`;
                obj.date = str;
                const restPartSet = [
                    { target: list.theTime, innerHTML: obj.date },
                    { target: list.theCharacter, innerHTML: obj.character.name },
                    { target: list.theLevel, innerHTML: obj.level.name }
                ];
                restPartSet.forEach(k => {
                    ui.xjb_addElement({ ...k, tag: 'p' })
                })
                player.xjb_updateStorage()
            }
            //设置操作2键事件
            storage.li_2.onclick = storage.li_2.read = function () {
                //获取选中存档
                var theLoad = document.getElementById('xjb_storage_theStorage')
                if (theLoad) {
                    //读档                    
                    game.pause()
                    var theObj = theLoad.map;
                    game.xjb_bossLoad(theObj.level.number, player);
                    //引入角色
                    var obj = theObj.character;
                    if (obj.id !== "") player.reinit(player.name1, obj.id);
                    //设置属性
                    ["maxHp", "hp", "hujia"].forEach(att => {
                        player[att] = obj[att]
                    });
                    //执行函数
                    const attActionList = [
                        ['link', obj.linked],
                        ['turnOver', obj.turnedOver],
                        ['lose', player.getCards("hejsx")],
                        ['gain', game.xjb_cardFactory(...obj.h)]
                    ];
                    attActionList.forEach(k => {
                        let func = k[0], arg = k[1];
                        player[func](arg)
                    });
                    //处理其他区域
                    const areaActionList = [
                        ['e', card => player.equip(card)],
                        ['j', card => player.addJudge(card)],
                        ['s', card => player.loseToSpecial(card, card.gaintag[0])],
                        ['x', card => player.addToExpansion(card).gaintag.add(card.gaintag[0])],
                    ];
                    areaActionList.forEach(k => {
                        let area = k[0], callback = k[1]
                        let cards = game.xjb_cardFactory(...obj[area]);
                        cards.forEach(callback)
                    })
                    //关闭
                    storage.back.remove()
                    game.resume()
                }
                player.xjb_updateStorage()
            }
            //删档
            storage.li_3.onclick = function () {
                var theRemove = document.getElementById('xjb_storage_theStorage')
                if (theRemove) {
                    theRemove.remove()
                    lib.config.xjb_myStorage[theRemove.num] = null
                    game.saveConfig("xjb_myStorage", game.xjb_filterData(["config", "xjb_myStorage"]))

                }
                player.xjb_updateStorage()
            }
            storage.close.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', game.resume)
            return { li_1: storage.li_1, li_2: storage.li_2, li_3: storage.li_3, close: storage.close, storageArea: storage.div_1 }
        }
        //存档函数
        game.xjb_storage_2 = function (player, bool) {
            var step1 = game.xjb_storage_1(player, bool)
            step1.li_2.innerHTML = "覆盖存档"
            step1.li_2.onclick = function () {
                var theUpdate = document.getElementById('xjb_storage_theStorage')
                if (theUpdate) {
                    var obj = lib.config.xjb_myStorage[theUpdate.num], time = game.xjb_getCurrentDate()
                    var str = `${time[0]}-${time[1]}-${time[2]}-${time[3]}-${time[4]}`
                    obj.date = str
                    obj.character.id = player.name1
                    obj.character.name = get.translation(player.name1)
                    obj.character.hp = player.hp
                    obj.character.maxHp = player.maxHp
                    obj.character.hujia = player.hujia
                    obj.character.linked = player.isLinked(),
                        obj.character.turnedOver = player.isTurnedOver(),
                        obj.character.h = player.xjb_getAllCards("h")
                    obj.character.e = player.xjb_getAllCards("e")
                    obj.character.j = player.xjb_getAllCards("j")
                    obj.character.x = player.xjb_getAllCards("x")
                    obj.character.s = player.xjb_getAllCards("s")
                    obj.level = {
                        name: _status.xjb_level.name,
                        number: _status.xjb_level.number,
                    }
                    game.saveConfig("xjb_myStorage", game.xjb_filterData(["config", "xjb_myStorage"]))
                    var p = theUpdate.getElementsByTagName("p")
                    p[3].innerHTML = obj.date
                    p[2].innerHTML = obj.level.name
                    p[1].innerHTML = obj.character.name
                }
                player.xjb_updateStorage()
                theUpdate.update()
            }
            return { li_1: step1.li_1, li_2: step1.li_2, li_3: step1.li_3, close: step1.close, storageArea: step1.storageArea }
        }
    },
    math: function () {
        game.xjb_LZ_project = function () {
            const { back, div_1, ul } = ui.create.xjb_storage("点击投资区按钮可以选择投资的魂币额度，我们将考虑反馈打卡点！")
            back.removeChild(ul);
            const list = [
                ui.create.xjb_theStorage(div_1),
                ui.create.xjb_theStorage(div_1),
                ui.create.xjb_theStorage(div_1)
            ]
            const addP = function (element, str1, str2) {
                element.innerHTML = `<b>${str1}</b>`;
                const p = document.createElement("p");
                p.innerHTML = str2;
                element.appendChild(p);
                ui.xjb_giveStyle(element, { color: '#b0e0e6' });
            }
            const name = ['割圆术', '黄金分割', '自然常数']
            const π = XJB_Math["Math_doPI"], e = XJB_Math["Math_doe"], Φ = XJB_Math["Math_doΦ"]
            const num = [π(lib.config.xjb_π), Φ(lib.config.xjb_Φ), e(lib.config.xjb_e)]
            const acc = [π, Φ, e]
            const project = ["xjb_π", "xjb_Φ", "xjb_e"];
            const backNum = 7;
            for (let i = 0; i < list.length; i++) {
                const { ul, theNum, theCharacter, theLevel, theTime } = list[i];
                ul.onclick = void 0;
                ul.classList.add("xjb_ul_storage");
                ul.id = project[i];
                ul.acc = acc[i];
                addP(theNum, '项目名', name[i]);
                addP(theCharacter, '当前值', num[i]);
                addP(theLevel, '投资区', `<span class=1_xjb_touzi>×1</span>
                        <span class=6_xjb_touzi>×6</span>
                        <span class=36_xjb_touzi>×36</span>
                        <span class=216_xjb_touzi>216</span>
                        <span class=withdraw_xjb_touzi>取</span>`)
                ul.addEventListener(lib.config.touchscreen ? "touchend" : "click", function (e) {
                    if (!e.target.className.endsWith("xjb_touzi")) return;
                    const number = parseInt(e.target.className);
                    const that = this;
                    const type = this.id;
                    if (lib.config.xjb_hunbi >= number) {
                        game.xjb_systemEnergyChange(number * game.xjb_currencyRate.secondRate);
                        game.xjb_costHunbi(number, "投资");
                        lib.config[type] += number;
                        game.saveConfig(type, lib.config[type]);
                        if (Math.random() * 50 < Math.min(number, 40)) {
                            game.saveConfig("xjb_hundaka2", ++lib.config["xjb_hundaka2"]);
                            game.xjb_create.alert('你知道的，你要的报酬到了，打卡点数已增加');
                        }
                        else game.xjb_create.alert('今日你所捐的，于你亦是有益的，数学会让你见识它的伟大力量。');
                    } else if (e.target.className === "withdraw_xjb_touzi") {
                        if (lib.config[type] < 100) game.xjb_create.alert(`你当前投资额为:${lib.config[type]}点，需达到100点我们才会给予反馈服务哦！`)
                        else if (lib.config[type] < 100 + backNum) {
                            game.xjb_create.alert(`你当前投资额为:${lib.config[type]}点，从100点起，每${backNum}点投资我们反1点魂币，还差一点点哟！`)
                        }
                        else {
                            const max = parseInt((lib.config[type] - 100) / backNum)
                            game.xjb_create.range(`你当前投资额为:${lib.config[type]}点，可提取${max} 个魂币`,
                                0, max, 0,
                                function () {
                                    lib.config[type] -= this.result * backNum;
                                    game.saveConfig(type, lib.config[type]);
                                    game.xjb_getHunbi(this.result, 1, true, true, '投资反馈');
                                    that.querySelectorAll('p')[1].innerHTML = that.acc(lib.config[type]);
                                },
                                function () {
                                    this.prompt.innerHTML = `你当前投资额为:${lib.config[type]}点，可提取${parseInt((lib.config[type] - 100) / backNum)} 个魂币`
                                }
                            )
                        }
                    } else {
                        game.xjb_create.alert("佯装行善，夸下海口，却无子，去罢。");
                    }
                    that.querySelectorAll('p')[1].innerHTML = that.acc(lib.config[type]);
                })
                ui.xjb_giveStyle(theLevel, { width: "40%", marginLeft: "0", marginRight: "0" })
                ui.xjb_giveStyle(theCharacter, { width: "24%" })
                ui.xjb_giveStyle(theNum, { width: "15%" })
                theTime.remove()
            }
        }
    },
    chupingjisha: function () {
        game.xjb_cpjsLoad = function () {
            if (lib.config.xjb_chupingjisha === 1 && lib.config.xjb_systemEnergy > 0) return lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()
            return false
        };
        game.xjb_cpjsRemove = function () {
            if (lib.config.xjb_chupingjisha === 2 || lib.config.xjb_systemEnergy < 0) {
                ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove();
            };
        }
    }
}
