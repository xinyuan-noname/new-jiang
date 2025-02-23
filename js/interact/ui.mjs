import {
    lib,
    game,
    ui,
    get,
    _status
} from "../../../../noname.js"
import { EXTENSION_PATH } from "../import/url.js";
import { element } from "../tool/ui.js";
const DEFAULT_EVENT = lib.config.touchscreen ? 'touchend' : 'click';
ui.xjb_domTool = element;
ui.xjb_toBeHidden = function (ele) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
            ui.xjb_toBeHidden(arguments[i])
        }
        return;
    }
    ui.xjb_giveStyle(ele, { visibility: "hidden" })
}
ui.xjb_toBeVisible = function (ele) {
    if (arguments.length > 1) {
        for (var i = 0; i < arguments.length; i++) {
            ui.xjb_toBeVisible(arguments[i])
        }
        return;
    }
    ui.xjb_giveStyle(ele, { visibility: "visible" })
}
ui.xjb_hideElement = function (ele) {
    if (!ele.classList.contains("xjb_hidden")) ele.classList.add("xjb_hidden")
}
ui.xjb_showElement = function (ele) {
    if (ele.classList.contains("xjb_hidden")) ele.classList.remove("xjb_hidden")
}
ui.xjb_addElement = function ({ target, tag, innerHTML,
    style, className, addclass,
    ctEvent, src, type, max, min,
    hideFun, display, inherit,
    ignorePosition }) {
    let ele = document.createElement(tag);
    if (tag == "canvas") ele.setHW = function (height, width) { this.height = height; this.width = width; return this };
    if (tag == "div") ui.xjb_giveStyle(ele, { display: "block" });
    if (display) ui.xjb_giveStyle(ele, { display: display });
    if (!ignorePosition) ui.xjb_giveStyle(ele, { position: "relative" });
    target.appendChild(ele);
    if (innerHTML) {
        if (tag == "textarea") ele.value = innerHTML;
        else ele.innerHTML = innerHTML;
    }
    if (style) ui.xjb_giveStyle(ele, style);
    if (className) ele.className = className;
    if (addclass) ele.classList.add(...addclass);
    if (ctEvent) ele.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ctEvent);
    if (src) ele.setAttribute('src', src);
    if (type) ele.setAttribute('type', type);
    if (max) ele.setAttribute('max', max);
    if (min) ele.setAttribute('min', min);
    if (hideFun) {
        ele.hide = function () { ele.style.display = 'none' };
        ele.show = function () { ele.style.display = display == 'none' ? 'block' : display };
    }
    if (inherit === true) ele.addElement = function ({ ...arg }) {
        return ui.xjb_addElement({
            ...arg,
            target: this,
        })
    };
    return ele;
}
ui.xjb_listenDefault = function (ele, callback, config) {
    let topScroll = ele.scrollTop
    ele.addEventListener(DEFAULT_EVENT, function (...args) {
        if (DEFAULT_EVENT === "touchend" && Math.abs(topScroll - ele.scrollTop) > 0.5) {
            topScroll = ele.scrollTop;
            return;
        }
        callback.apply(this, args);
    }, config);
    return ele;
};
ui.xjb_listenDefaultFNS = function (ele, callback, config) {
    let topScroll = ele.parentNode.scrollTop
    ele.addEventListener(DEFAULT_EVENT, function (...args) {
        if (DEFAULT_EVENT === "touchend" && Math.abs(topScroll - ele.parentNode.scrollTop) > 0.5) {
            topScroll = ele.parentNode.scrollTop;
            return;
        }
        callback.apply(this, args);
    }, config);
    return ele;
};
ui.xjb_setStyle = (node, key, value) => {
    node.style[key] = value;
}
ui.xjb_giveStyle = function (target, styleList) {
    if (typeof styleList === "object" && styleList != null) {
        for (let k in styleList) {
            target.style[k] = styleList[k]
        }
    } else if (typeof styleList === "string") {
        try {
            let parseList = JSON.parse(styleList)
            return ui.xjb_giveStyle(target, parseList)
        } catch (e) { }
    }
    return target
}
ui.xjb_giveStyle2 = function (str) {
    var style = document.createElement("style")
    style.innerHTML = str
    document.head.appendChild(style)
}
ui.xjb_giveContent = function () {
    var list = []
    for (var i = 0; i < arguments.length - 1; i++) {
        if (typeof arguments[i] === "string") {
            list[i] = document.createElement("li")
            list[i].innerHTML = arguments[i]
            arguments[arguments.length - 1][0].appendChild(list[i])
            if (arguments[arguments.length - 1][1]) ui.xjb_giveStyle(list[i], arguments[arguments.length - 1][1])
            if (arguments[arguments.length - 1][2]) {
                list[i].onclick = arguments[arguments.length - 1][2]
            }
        }
    }
    return list
}
ui.create.xjb_book = (father, text) => {
    if (!text) return console.error("未传入文本对象")
    if (!"headline" in text || !"writer" in text || !text.style || ! "content" in text) return console.error("传入的文本对象缺少属性");
    if (lib.xjb_library) {
        let book = lib.xjb_library[text.headline + "-" + text.writer];
        if (book) {
            father.appendChild(book);
            return book;
        }
    }
    let bookBack = element("div")
        .style({
            backgroundImage: `url(${EXTENSION_PATH}/lingli/book.jpg)`,
            "background-size": "100% 100%",
            "z-index": "10",
            padding: "8%",
        })
        .style(text.style)
        .addClass("xjbToCenter")
        .exit()
    let book = element("div")
        .style({
            height: "80%",
            width: "80%",
            fontSize: "22px",
            overflow: "auto"
        })
        .addClass("xjbToCenter")
        .father(bookBack)
        .exit()
    father.appendChild(bookBack)
    //添加标题和作者
    let headline = element("h4")
        .addClass("xjbHeadline")
        .father(book)
        .exit()
    let writer = element("h5")
        .addClass("xjbWriter")
        .father(book)
        .exit()
    let body = {
        headline: headline,
        writer: writer,
        content: book
    }
    //这是一个填充内容的promise
    function Write(writeText, type) {
        var wordsGroups = writeText.split("")
        return new Promise(function (res) {
            body.content.open = game.open;
            body.headline.open = game.open;
            body.writer.open = game.open;
            book.cantTouch = true
            let nowTarget = body[type];
            let targetList = [body[type]];
            let ignore = false
            //返回上一级元素
            function turnPre(bool) {
                //如果已经是book的最高级元素，则跳过
                if (nowTarget === body[type]) return;
                //获取对象链中当前对象的索引
                const index = targetList.indexOf(nowTarget);
                if (!index) return;
                //切换当前对象为上一级元素
                nowTarget = targetList[index - 1];
                //将当前对象从对象链中删除
                targetList.splice(index, 1);
                //清除ignore
                ignore = false
                //如果传入了true参数，进行迭代，使得当前对象切换为最高级元素                           
                if (bool) turnPre(bool);
            }
            //增加对象            
            function addTatget(tag, className, ignoreValue) {
                //根据提供的tag和className创建元素
                let toAdd = document.createElement(tag);
                if (className) toAdd.classList.add(className)
                //将target添加进去
                body[type].appendChild(toAdd);
                //将新加对象作为当前对象
                nowTarget = toAdd;
                //增加至对象链中
                targetList.push(toAdd);
                //设置ignore值
                ignore = Boolean(ignoreValue)
            }
            requestAnimationFrame(function xjbWonderfulWriter() {
                if (!wordsGroups.length) {
                    cancelAnimationFrame(xjbWonderfulWriter)
                    book.cantTouch = false
                    return res(writeText)
                }
                var theWord = wordsGroups.shift()
                if (!ignore && theWord === "n") {
                    turnPre(true)
                    theWord = "</br>"
                }
                else if (!ignore && theWord === "A") {
                    if (nowTarget.nodeName.toLowerCase() === "span") turnPre()
                    else addTatget("span", "xjb2levelTitle");
                    return window.requestAnimationFrame(xjbWonderfulWriter)
                }
                else if (!ignore && theWord === "B") {
                    if (nowTarget.nodeName === "B") turnPre()
                    else addTatget("b");
                    return window.requestAnimationFrame(xjbWonderfulWriter)
                }
                else if (theWord === "く") {
                    theWord = wordsGroups.shift()
                }
                else if (theWord === "の") {
                    theWord = wordsGroups.shift()
                    if (get.pinyin) theWord = "<span xjb_pinyin=(" + get.pinyin(theWord) + ")>" + theWord + "</span>"
                }
                else if (theWord === "っ") {
                    let temp = Number(wordsGroups.shift()), temp1
                    temp1 = wordsGroups.splice(0, temp).join("")
                    theWord = wordsGroups.shift()
                    theWord = "<span xjb_pinyin=(" + temp1 + ")>" + theWord + "</span>"
                }
                else if (theWord === "ま") {
                    let chain = '', nowWord = wordsGroups.shift();
                    theWord = nowWord;
                    nowWord = wordsGroups.shift();
                    while (nowWord !== 'ま') {
                        theWord += nowWord;
                        nowWord = wordsGroups.shift();
                    }
                    nowWord = wordsGroups.shift()
                    while (nowWord !== 'ら') {
                        chain += nowWord;
                        nowWord = wordsGroups.shift();
                    }
                    theWord = "<span xjb_pinyin=(" + chain + ")>" + theWord + "</span>"
                }
                else if (theWord === "ぇ") {
                    if (nowTarget.nodeName.toLowerCase() === "a") {
                        let chain = '', nowWord = wordsGroups.shift();
                        while (nowWord !== 'こ') {
                            chain += nowWord;
                            nowWord = wordsGroups.shift();
                        }
                        nowTarget.setAttribute("href", chain);
                        nowTarget.addEventListener('click', function () {
                            location.href = this.href;
                        })
                        turnPre()
                    }
                    else {
                        addTatget("a", void 0, true);
                        ignore = true;
                    }
                    return window.requestAnimationFrame(xjbWonderfulWriter)
                }
                else if (theWord === "ア") {
                    if (nowTarget.nodeName.toLowerCase() === "i") {
                        turnPre();
                    }
                    else {
                        addTatget("i", void 0, true);
                    }
                    return window.requestAnimationFrame(xjbWonderfulWriter)
                }
                nowTarget.innerHTML = nowTarget.innerHTML + theWord
                window.requestAnimationFrame(xjbWonderfulWriter)
            })

        })
    }
    Write(text.headline, "headline").then(() => {
        return Write(text.writer, "writer")
    }).then(() => {
        return Write(text.content, "content")
    })
    bookBack.addEventListener("dblclick", () => bookBack.remove())
    if (!lib.xjb_library) {
        lib.xjb_library = {}
    }
    lib.xjb_library[text.headline + "-" + text.writer] = bookBack
    return book
}
ui.create.xjb_curtain = function (father) {
    var back = document.createElement("div")
    if (!father) father = ui.window
    father.appendChild(back)
    ui.xjb_giveStyle(back, {
        "text-align": "center",
        "font-size": "32px",
    })
    back.classList.add('xjbTocenter');
    back.classList.add('xjb_curtain');
    return back
}
ui.create.xjb_double = function (str) {
    let list = ui.create.xjb_back(str)
    let back = list[0], close = list[1]
    let back2 = document.createElement("div")
    back.appendChild(back2)
    ui.xjb_giveStyle(back2, {
        margin: "auto",
        width: "90%",
        height: "100%",
    })
    let style = {
        width: "334px",
        height: "88%",
        float: "left",
        position: "relative",
        "border-radius": "0.5em",
        margin: "10px",
        backgroundColor: "#3c4151",
        opacity: "0.7",
        padding: "3px"
    }
    let div1 = document.createElement("div")
    let div2 = document.createElement("div")
    ui.xjb_giveStyle(div1, style)
    ui.xjb_giveStyle(div2, style)
    back2.appendChild(div1)
    back2.appendChild(div2)
    //
    return {
        close: close,
        back: back,
        container: back2,
        left: div1,
        right: div2
    }
}
ui.create.xjb_back = function (str) {
    if (game.xjb_back && game.xjb_back.remove) {
        game.xjb_back.remove()
    }
    //创建back
    const back = element('div')
        .father(ui.window)
        .addClass('interact_back')
        .addClass('xjbToCenter')
        .addClass('xjb-interact-back')
        .exit()
    game.xjb_back = back
    //点击close关闭back
    function closeIt() {
        let modeActionList = {
            close: () => { back.remove(); },
            hide: () => { back.hide() }
        };
        const mode = this.dataset.closeMode, func = modeActionList[mode];
        if (func) func();
    }
    //创建close
    const close = element('img')
        .father(back)
        .src(EXTENSION_PATH + 'image/icon/close.png')
        .addClass('close')
        .addClass('xjb-interact-close')
        .listen(lib.config.touchscreen ? 'touchend' : 'click', closeIt)
        .exit()
    close.closeBack = closeIt;
    close.dataset.closeMode = 'close';
    if (str) {
        const foot = element("div")
            .father(back)
            .innerHTML("-|" + str + "|-")
            .addClass("xjb-interact-foot")
            .exit()
        return [back, close, foot]
    }
    //
    return [back, close]//设置返回值为数组
}
ui.xjb_centerToLeft = function (ele) {
    if (ele.classList.contains("xjbToCenter")) {
        ele.style.marginLeft = 0
    }
}
ui.xjb_centerToRight = function (ele) {
    if (ele.classList.contains("xjbToCenter")) {
        ele.style.marginRight = 0
    }
}
ui.xjb_noStyle = function (ele) {
    ele.style.cssText = "";
}

//样式表
lib.xjb_style = {
    textarea1: {
        width: "99%",
        margin: "auto",
        height: "24px",
        position: "relative",
        fontSize: "24px"
    },
    back: {
        width: "800px",
        height: "400px",
        'z-index': '8',
        'border-radius': '3em',
        'background-image': 'linear-gradient(to bottom right,#f0acf7,#7093DB,#f7f0ac)',
        'border': '3px solid black',
    },
    foot: {
        'position': 'absolute',
        "font-size": "20px",
        "font-family": "楷体",
        width: "100%",
        'color': "#D9D919",
        "text-align": "center",
        "margin-top": "370px",
        "margin-left": "-40px"
    },
    cj_box: {
        'font-size': '24px',
        'border': '1px solid #4A766E',
        'border-radius': '5em',
        float: "left",
        "margin-bottom": "14px"
    },
    storage_li: {
        height: "92%",
        width: "25%",
        "background-color": "#e4d5b7",
        "border-radius": "3em",
        float: "left",
        "margin-right": "8%",
        color: "#041322",
        "text-align": "center"
    },
    storage_ul: {
        height: "30%",
        width: "92%",
        "border-radius": "2em",
        "background-color": "#71291d",
        border: "9px solid #cb6d51",
        "list-style": "none",
        "background-image": "",
        "background-size": ""
    }
}
