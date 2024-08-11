import { horizontalLine, plumbLine } from './canvas.js';
import { element, textareaTool } from './ui.js';
window.XJB_LOAD_DIALOG = function (_status, lib, game, ui, get, ai) {
    //这是创建对话框
    ui.create.xjb_dialogBase = function () {
        if (game.xjb_create.baned) return null;
        //这个是对话框
        var div = element('div')
            .addClass("xjb_dialogBase")
            .addClass("xjbToCenter")
            .father(ui.window)
            .exit();
        //这里写幕布
        var back = ui.create.xjb_curtain()
        var length = element("div")
            .style({
                "z-index": "8",
                width: "100%",
                display: "block",
                height: "36px",
                top: "250px"
            })
            .addClass("xjbToCenter")
            .father(back)
            .exit();
        var buttons = [];
        for (var i = 0; i < arguments.length; i++) {
            var button = ui.create.xjb_button(length, arguments[i], [div, back])
            buttons.push(button)
        }
        div.back = back
        div.buttons = buttons;
        //
        div.addElement = function (tag, innerHTML, style) {
            let ele = ui.xjb_addElement({
                target: div,
                tag: tag,
                innerHTML: innerHTML,
                style: style
            })
            if (tag == "textarea") {
                ele.addButton = function (character, text) {
                    text = text ? text : character
                    let button = div.addElement("span", character, { display: "Inline-block", height: "30px", width: "30px", textAlign: "center", border: "#FFFFE0 1.5px solid", fontSize: "1em", borderRadius: "50%", })
                    if (ele.nextSibling !== button) {
                        div.insertBefore(button, ele.nextSibling)
                    }
                    button.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', character !== "清" ? function (e) {
                        e.preventDefault()
                        let index = ele.selectionStart
                        let part1 = ele.value.slice(0, index);
                        let part2 = ele.value.slice(index);
                        const newPart = part1 + text
                        ele.value = newPart + part2;
                        ele.selectionStart = newPart.length;
                        ele.selectionEnd = newPart.length;
                    } : function (e) {
                        e.preventDefault()
                        ele.value = "";
                    })
                    return ele;
                }
                ele.numberListButton = function (number) {
                    for (let i = 0; i < number; i++) {
                        ele.addButton(`${i}`)
                    }
                }
            }
            ele.addElement = this.addElement;
            return ele
        }
        //
        div.higher = function () {
            ui.xjb_giveStyle(div, {
                height: "308.4px",
                top: "-170px"
            })
            return div
        }
        div.highest = function () {
            ui.xjb_giveStyle(div, {
                height: "500px",
                top: "0px"
            })
            div.back.remove()
            div.highestRemove = function () {
                document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', div.highestListenerRemove);
                div.remove()
            }
            div.highestListenerRemove = function (e) {
                if (!div.highestRemoveOk) return;
                if (e.target !== div && !Array.from(div.getElementsByTagName("*")).includes(e.target)) {
                    div.highestRemove()
                }
            }
            document.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', div.highestListenerRemove)
            return div
        }
        div.standardWidth = function () {
            ui.xjb_giveStyle(div, {
                width: "502px"
            })
            return div
        }
        //
        div.nextAlert = function () {
            var nextDialog = game.xjb_create.alert(...arguments)
            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
            this.next = nextDialog
            return nextDialog
        }
        div.nextConfirm = function () {
            var nextDialog = game.xjb_create.confirm(...arguments)
            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
            this.next = nextDialog
            return nextDialog
        }
        div.nextPrompt = function () {
            var nextDialog = game.xjb_create.prompt(...arguments)
            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
            this.next = nextDialog
            return nextDialog
        }
        div.goOnAlert = function () {
            var nextDialog = game.xjb_create.alert(...arguments)
            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
            this.goon = nextDialog
            return nextDialog
        }
        div.goOnConfirm = function () {
            var nextDialog = game.xjb_create.confirm(...arguments)
            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
            this.goon = nextDialog
            return nextDialog
        }
        div.goOnPrompt = function () {
            var nextDialog = game.xjb_create.prompt(...arguments)
            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
            this.goon = nextDialog
            return nextDialog
        }
        return div
    };
    //创建按钮
    ui.create.xjb_button = function (length, str, remove) {
        var button = element("div")
            .innerHTML(str)
            .father(length)
            .style({
                color: "#041322",
                "text-align": "center",
                "font-size": "36px",
                "background-color": "#e4d5b7",
                "border-radius": "0.5em",
                position: "relative",
                margin: "auto",
                marginLeft: "15px",
                marginRight: "15px",
            })
            .exit();
        if (remove && remove.length) {
            button.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
                e.stopPropagation();
                for (var i = 0; i < remove.length; i++) {
                    remove[i].remove()
                    remove[i].remove()
                }
            })
        }
        return button
    };
    if (!game.xjb_create) game.xjb_create = {}
    //game.xjb_create开关
    game.xjb_create.ban = function () {
        return game.xjb_create.baned = true;
    }
    game.xjb_create.allow = function () {
        return game.xjb_create.baned = false;
    }
    //提醒警告型对话框
    game.xjb_create.alert = function (str = "", func) {
        if (game.xjb_create.baned) return;
        var dialog = ui.create.xjb_dialogBase("确定")
        dialog.innerHTML = str
        if (func) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func)
        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            if (dialog.next) {
                ui.xjb_toBeVisible(dialog.next, dialog.next.back)
            }
        })
        return dialog
    }
    //确认型对话框
    game.xjb_create.confirm = function (str = '', func1, func2) {
        if (game.xjb_create.baned) return;
        var dialog = ui.create.xjb_dialogBase("确定", "取消")
        dialog.innerHTML = str
        if (func1) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func1)
        if (func2) dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func2)
        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            if (dialog.next) {
                ui.xjb_toBeVisible(dialog.next, dialog.next.back)
            }
        })
        dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            if (dialog.goon) {
                ui.xjb_toBeVisible(dialog.goon, dialog.goon.back)
            }
        })
        return dialog
    }
    //互动性对话框
    game.xjb_create.prompt = function (str1, str2 = "", func1, func2) {
        if (game.xjb_create.baned) return;
        var dialog = ui.create.xjb_dialogBase("确定", "取消")
        dialog.addElement("div", str1)
        var textarea = dialog.addElement("textarea", str2, {
            display: "block",
            margin: "auto",
            width: "99%",
            height: "300%",
            fontSize: "24px",
        })
        dialog.input = textarea
        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            this.result = textarea.value
            if (dialog.next) {
                ui.xjb_toBeVisible(dialog.next, dialog.next.back)
            }
        })
        dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            this.result = textarea.value
            if (dialog.goon) {
                ui.xjb_toBeVisible(dialog.goon, dialog.goon.back)
            }
        })
        if (func1) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func1)
        if (func2) dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func2)
        dialog.Mysize = function () {
            ui.xjb_giveStyle(dialog, {
                height: "308.4px",
                top: "-170px"
            })
            ui.xjb_giveStyle(textarea, {
                height: "26px"
            })
            return dialog
        }
        dialog.inputSmall = function () {
            ui.xjb_giveStyle(textarea, {
                width: "5em",
                height: "1em"
            })
            return dialog
        }
        dialog.inputOneLine = function () {
            textareaTool().setTarget(textarea)
                .width('95%')
                .height('1.5em')
                .style({
                    margin: '0',
                    marginTop: '20px',
                    padding: '0'
                })
                .clearThenAnotherClickTouch('\n', dialog.buttons[0], 'touchend')
            return dialog
        }
        dialog.prompt = textarea
        return dialog
    }
    game.xjb_create.blprompt = function (str1, str2, str3, str4, func1, func2) {
        if (game.xjb_create.baned) return;
        let dialog = game.xjb_create.prompt(str1, str2, void 0, void 0).Mysize();
        let textarea1 = dialog.input;
        dialog.addElement("div", str3)
        let textarea2 = dialog.addElement("textarea", str4, {
            display: "block",
            margin: "auto",
            width: "99%",
            marginTop: "10px",
            height: "26px",
            fontSize: "24px"
        })
        dialog.input2 = textarea2
        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            this.result2 = textarea2.value
        })
        dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
            this.result2 = textarea2.value
        })
        if (func1) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func1)
        if (func2) dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func2)
        return dialog;
    }
    game.xjb_create.multiprompt = function (func1, func2) {
        if (game.xjb_create.baned) return;
        const dialog = game.xjb_create.confirm(void 0);
        dialog.prompts = []
        dialog.higher()
        dialog.appendPrompt = function (str, value, placeholder = '', times = 1) {
            element("div")
                .style({
                    position: "relative",
                })
                .innerHTML(str)
                .father(this)
                .block()
                .exit()
            const textarea = element("textarea")
                .style({
                    display: "block",
                    margin: "auto",
                    width: "99%",
                    fontSize: "24px",
                    height: `${34 * times}px`
                })
                .father(this)
                .exit()
            if (value) textarea.value = value
            textarea.placeholder = placeholder
            dialog.prompts.push(textarea)
            dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                this.resultList = dialog.prompts.map(prompt => prompt.value);
            })
            dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                this.resultList = dialog.prompts.map(prompt => prompt.value);
            })
            dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func1)
            dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func2)
            return dialog;
        }
        return dialog;
    }
    //选项型对话框
    game.xjb_create.chooseAnswer = function (str, choicesList, single, func, src) {
        if (game.xjb_create.baned) return;
        var dialog = game.xjb_create.alert(void 0, func);
        ui.xjb_giveStyle(dialog, {
            height: "258.4px",
            top: "-120px"
        });
        dialog.chosen = [];
        dialog.choiceList = [];
        dialog.single = single;
        dialog.chosenIndex = [];
        dialog.addElement("div", str);
        dialog.addElement("hr");
        choicesList.forEach((string, index) => {
            const option = element("div")
                .style({
                    position: "relative",
                    fontSize: "30px",
                    marginBottom: "0.5em",
                    alignItems: "center"
                })
                .flexRow()
                .father(dialog)
                .exit();
            const theNumber = element("div")
                .innerHTML(String.fromCharCode(index + 65))
                .style({
                    display: "block",
                    borderRadius: "50%",
                    height: "30px",
                    width: "30px",
                    textAlign: "center",
                    border: "#FFFFE0 1.5px solid",
                    marginRight: "10px",
                    position: "relative"
                })
                .father(option)
                .exit();
            element("div")
                .innerHTML(string)
                .style({
                    display: "block",
                    position: "relative",
                    fontSize: "26px",
                })
                .father(option)
            option.index = index;
            dialog.choiceList.push(option)
        })
        function updateBackStyle(ele, backColor) {
            ui.xjb_giveStyle(ele, {
                backgroundColor: backColor
            })
        }
        dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
            if (!Array.from(dialog.getElementsByTagName("*")).includes(e.target)) return false;
            const chosen = dialog.choiceList.filter(option => {
                return (Array.from(option.getElementsByTagName("*")).includes(e.target))
            })[0];
            if (!chosen) return;
            if (dialog.chosen.includes(chosen)) {
                updateBackStyle(chosen.firstElementChild, "")
                dialog.chosenIndex = dialog.chosenIndex.filter(i => i != chosen.index);
                dialog.chosen = dialog.chosen.filter(i => i != chosen);
            } else {
                updateBackStyle(chosen.firstElementChild, "#FFFFE0")
                if (dialog.single) {
                    dialog.chosen = dialog.chosen.filter(option => {
                        updateBackStyle(option.firstElementChild, "")
                        return false;
                    });
                    dialog.chosenIndex = [];
                }
                dialog.chosen.push(chosen)
                dialog.chosenIndex.push(chosen.index)
            }
            dialog.buttons[0].result = dialog.chosen.map(option => option.children[1].innerText);
            dialog.buttons[0].resultIndex = [...dialog.chosenIndex];
            if (single) {
                dialog.buttons[0].result = dialog.buttons[0].result[0];
                dialog.buttons[0].resultIndex = dialog.buttons[0].resultIndex[0];
            }
        })
        if (src) {
            element().setTarget(dialog.back)
                .setStyle("backgroundImage", `url(${src})`)
                .setStyle("background-size", "100% 100%")
                .setStyle("opacity", '1');
        }
        return dialog
    }
    //文件交互对话框
    game.xjb_create.file = function (str, type, func1, func2, needBuffer) {
        if (game.xjb_create.baned) return;
        var dialog = game.xjb_create.prompt(str, "", func1, func2)
        dialog.Mysize()
        ui.xjb_toBeHidden(dialog.buttons[0]);
        let file = document.createElement("input")
        file.type = "file"
        ui.xjb_giveStyle(file, {
            display: "block",
        })
        dialog.appendChild(file)
        var obj = {
            json: function () {
                var json = document.createElement("div")
                json.xjb_check = function () {
                    if (this.xjb_type != ".json") return ui.xjb_toBeHidden(dialog.buttons[0])
                }
                return json
            },
            img: function () {
                var img = document.createElement("img")
                ui.xjb_giveStyle(img, {
                    width: "var(--xjb-file-width)",
                    "object-fit": "fill"
                })
                return img
            },
            video: function () {
                var video = document.createElement("video")
                ui.xjb_giveStyle(video, {
                    width: "var(--xjb-file-width)",
                    "object-fit": "fill"
                })
                video.controls = true
                video.autoplay = true
                return video
            },
            audio: function () {
                var audio = document.createElement("audio")
                ui.xjb_giveStyle(audio, {
                    width: "var(--xjb-file-width)",
                    "object-fit": "fill"
                })
                audio.controls = true
                audio.autoplay = true
                return audio
            },
            all: function () {
                return document.createElement('span')
            }
        }
        var target = obj[type]()
        dialog.appendChild(target)
        target.onerror = function () {
            ui.xjb_toBeHidden(dialog.buttons[0])
        }
        file.onchange = function () {
            const readingFile = this.files[0];
            ui.xjb_toBeHidden(dialog.buttons[0])
            var reader = new FileReader()
            if (needBuffer) reader.readAsArrayBuffer(readingFile)
            else reader.readAsDataURL(readingFile, "UTF-8")
            reader.onload = function () {
                const fileData = this.result;
                //文件类型
                let lastnamefortype = file.value.slice(file.value.lastIndexOf("."))
                target.src = URL.createObjectURL(readingFile)
                target.xjb_type = lastnamefortype
                ui.xjb_toBeVisible(dialog.buttons[0])
                const fileResult = {
                    self: readingFile,
                    result: fileData,
                    type: lastnamefortype,
                }
                dialog.buttons[0].file = fileResult;
                dialog.buttons[1].file = fileResult;
                if (target.xjb_check) target.xjb_check()
            }
        }
        return dialog
    }
    //图片选择型对话框
    game.xjb_create.button = function (str1, str2, arr2, func, func2) {
        if (game.xjb_create.baned) return;
        var dialog = game.xjb_create.confirm("<p id=xjb_dialog_p>" + str1 + "</p><hr>", func, func2);
        ui.xjb_toBeHidden(dialog.buttons[0])
        ui.xjb_giveStyle(dialog, {
            height: "308.4px",
            top: "-170px"
        })
        for (var i = 0; i < arr2.length; i++) {
            var img = dialog.addElement("div", void 0, {
                width: "28.3%",
                height: "238px",
                margin: "1.7%",
                border: "#f0acf7 3px solid ",
                "background-image": `url(${str2 + arr2[i]})`,
                "background-size": "cover",
                "background-repeat": "no-repeat",
                color: "white",
                "text-align": "center",
                "border-radius": "0.5em",
            });
            img.name = arr2[i];
            element().setTarget(img)
                .setAttribute('src', str2 + arr2[i])
                .innerHTML(img.name)
                .listen(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
                    document.getElementById("xjb_dialog_p").innerHTML = this.name
                    ui.xjb_toBeVisible(dialog.buttons[0])
                    for (var a = 0; a < dialog.imgs.length; a++) {
                        dialog.imgs[a].className = ""
                    }
                    element().setTarget(this)
                        .className("xjb_color_circle")
                        .setTarget(dialog.buttons[0])
                        .hook(ele => {
                            ele.result = this.name;
                        })
                        .setAttribute('src', this.src);
                })
            img.ondblclick = function () {
                this.remove()
                ui.xjb_toBeHidden(dialog.buttons[0])
                if (arr2 && arr2.includes(this.name)) {
                    arr2.remove(this.name);
                }
            }
        }
        dialog.imgs = dialog.getElementsByTagName("div")
        return dialog
    }


    //寻找信息型对话框
    game.xjb_create.search = function (
        str = "<div style=position:relative;overflow:auto;font-size:24px>输入关键词后，敲击回车以进行搜索</div><hr>",
        func,
        liDisplay = 'block'
    ) {
        if (game.xjb_create.baned) return;
        let dialog = game.xjb_create.alert(str, func)
        ui.xjb_giveStyle(dialog, {
            height: "318.4px",
            top: "-170px",
            overflow: ""
        })
        let textarea = dialog.addElement("textarea", void 0, lib.xjb_style.textarea1)
        /**
         * @type {HTMLUListElement}
         */
        let ul = dialog.addElement("ul", void 0, {
            overflow: "auto",
            marginTop: "0px",
            "list-style": "none",
            paddingLeft: "0px",
            height: "180px"
        })
        textarea.onkeyup = function (e) {
            if (this.value.length) return;
            const showList = this.index.filter(item => !this.shown.includes(item))
            for (const item of showList) {
                let count = 0;
                const searchIndex = () => {
                    count++
                    item.style.display = liDisplay;
                }
                if (count <= 30) searchIndex()
                else setTimeout(searchIndex, 0)
            }
        };
        textarea.onkeydown = function (e) {
            if (e.keyCode !== 13) return;
            e.preventDefault();
            e.stopPropagation();
            console.log(this)
            for (const item of this.index) {
                let count = 0;
                const searchIndex = () => {
                    if (!item.innerText.includes(this.value)) {
                        item.style.display = "none";
                        return;
                    }
                    item.style.display = liDisplay
                    this.shown.push(item)
                }
                if (count <= 30) searchIndex()
                else setTimeout(searchIndex, 0)
            }
        }
        textarea.index = [];
        textarea.shown = [];
        dialog.textarea = textarea;
        dialog.ul = ul;
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    const target = entry.target;
                    const b = target.querySelector("b")
                    if (!b) return;
                    if (![target.parentNode.lastElementChild, textarea.shown.at(-1)].includes(target)) return;
                    element("div").width("100%").height("5em").father(ul);
                    observer.disconnect()
                })
            },
            {
                root: ul,
            }
        )
        dialog.observer = observer;
        dialog.buttons[0].observer = dialog.observer;
        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
            this.observer.disconnect()
        });
        return dialog;
    }
    //数字调整型对话框
    game.xjb_create.configNumberList = function (obj, func) {
        if (game.xjb_create.baned) return;
        let dialog = game.xjb_create.search("<div style=position:relative;overflow:auto;font-size:24px>拖动可改变数值数值。输入关键词后，敲击回车以进行搜索</div><hr>", func)
        let textarea = dialog.textarea;
        let ul = dialog.ul;
        let changedObj = {};
        dialog.changedObj = changedObj;
        /*
          演示obj
          {
              xjb_lijingtuzhi_1:{
                 counterpart:"【励精图治-红桃-7】",
                 current:1,
                 min:1,
                 max:5,
              },
              xjb_lijingtuzhi_2:{
                 counterpart:"【励精图治-黑桃-7】",
                 current:1,
                 min:1,
                 max:5,
              },
          }
        */
        if (obj) {
            function rangeChange() {
                changedObj[this.counterpart] = this.value;
                this.numShower.innerHTML = changedObj[this.counterpart];
            }
            for (let k in obj) {
                let li = document.createElement("li")
                li.innerHTML = "【" + obj[k].counterpart + "】";
                ul.appendChild(li);
                let range = document.createElement("input");
                range.counterpart = obj[k].counterpart;
                range.type = 'range';
                range.value = (obj[k].current || 0);
                range.min = (obj[k].min || 0);
                range.max = (obj[k].max || max);
                range.addEventListener("change", rangeChange)
                ui.xjb_giveStyle(range, {
                    float: "right"
                })
                li.appendChild(range);
                let span = document.createElement("span")
                li.appendChild(span);
                ui.xjb_giveStyle(span, {
                    float: "right"
                })
                span.innerHTML = range.value;
                range.numShower = span
            }
            textarea.index = Array.from(ul.children)
        }
        return dialog;
    }
    //列表解锁型对话框
    game.xjb_create.configList = function (list, func) {
        if (game.xjb_create.baned) return;
        let dialog = game.xjb_create.search("<div style=position:relative;overflow:auto;font-size:24px>点击以下项目可进行设置，解锁需要5魂币。输入关键词后，敲击回车或搜索框失去焦点以进行搜索</div><hr>", func)
        let textarea = dialog.textarea;
        let ul = dialog.ul;
        dialog.buttons[0].isOpened = [];
        dialog.buttons[0].isClosed = [];
        if (!list) return dialog;
        for (let i in list) {
            var li = ui.xjb_addElement({
                target: ul,
                tag: 'li',
                innerHTML: list[i],
                style: {
                    height: "28px",
                    fontSize: "21px",
                    width: "97%",
                    paddingTop: "7px"
                }
            })
            let span = ui.xjb_addElement({
                target: li,
                tag: 'span',
                style: {
                    top: "-4px",
                    float: 'right'
                }
            })
            span.update = function () {
                switch (lib.config[i]) {
                    case void 0: span.innerHTML = '【🔐已锁定】'; break;
                    case 2: case false: {
                        span.innerHTML = '【🔒已关闭】';
                        dialog.buttons[0].isOpened.includes(i) && dialog.buttons[0].isOpened.remove(i)
                        dialog.buttons[0].isClosed.add(i)
                    }; break;
                    case 1: case true: {
                        span.innerHTML = '【🔓已开启】'
                        dialog.buttons[0].isClosed.includes(i) && dialog.buttons[0].isClosed.remove(i)
                        dialog.buttons[0].isOpened.add(i)
                    }; break;
                }
            };
            span.update();
            span.myName = i;
            span.myLi = li
        };
        ul.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
            e.preventDefault()
            if (e.target.tagName !== 'SPAN') return;
            const _this = e.target;
            const valueActionList = [
                () => {
                    if (game.xjb_condition(1, 5)) {
                        game.cost_xjb_cost(1, 5)
                        lib.config[_this.myName] = 1
                    } else {
                        _this.myLi.className = "xjb_animation_shake"
                        setTimeout(() => {
                            _this.myLi.className = ""
                        }, 820)
                    }
                },
                () => { lib.config[_this.myName] = 2 },
                () => { lib.config[_this.myName] = 1 },
                () => { lib.config[_this.myName] = false },
                () => { lib.config[_this.myName] = true }
            ];
            const index = [void 0, 1, 2, true, false].indexOf(lib.config[_this.myName]);
            valueActionList[index]();
            game.saveConfig(_this.myName, lib.config[_this.myName])
            _this.update();
            game.saveConfig(_this.myName, lib.config[_this.myName]);
        })
        textarea.index = Array.from(ul.children)
        if (ul.querySelector("b")) textarea.index.forEach(ele => {
            dialog.observer.observe(ele)
        })
        return dialog;
    }
    //这种对话框用于展示条件
    game.xjb_create.condition = function (obj, arr1, arr2) {
        if (game.xjb_create.baned) return;
        let dialog = game.xjb_create.search()
        let textarea = dialog.textarea;
        let ul = element().setTarget(dialog.ul)
            .setStyle('height', '210px')
            .exit();
        var list = obj
        if (list) {
            for (let i in list) {
                element("li")
                    .appendInnerHTML(list[i])
                    .father(ul)
                    .setStyle('fontSize', '18px')
                    .hook(ele => textarea.index.add(ele));
            }
        }
        dialog.font = function (num) {
            Array.from(textarea.index).forEach(a => {
                ui.xjb_giveStyle(a, {
                    fontSize: (num + "px")
                })
            })
            return dialog
        }
        return dialog
    }
    game.xjb_create.seeDelete = function (map, seeStr = "查看", deleteStr = "删除", seeCallback = () => true, deleteCallback = () => true, func) {
        if (game.xjb_create.baned) return;
        const dialog = game.xjb_create.search(void 0, func)
        const textarea = dialog.textarea;
        const ul = dialog.ul;
        const listenType = lib.config.touchscreen ? "touchend" : "click";
        dialog.buttons[0].result = [];
        for (const [attr, desc] of Object.entries(map)) {
            function addLi() {
                if (!dialog.parentNode) return;
                const container = element('li')
                    .setAttribute('xjb_id', attr)
                    .father(ul)
                    .block()
                    .style({
                        position: 'relative',
                        width: "100%"
                    })
                    .exit()
                const descEle = element("div")
                    .father(container)
                    .innerHTML(desc)
                    .block()
                    .style({
                        position: 'relative',
                    })
                    .exit()
                const seeButton = ui.create.xjb_button(container, seeStr);
                element().setTarget(seeButton)
                    .style({
                        position: 'relative',
                        fontSize: '1.5rem'
                    })
                    .exit()
                seeButton.descEle = descEle;
                seeButton.container = container;
                seeButton.yesButton = dialog.buttons[0];
                const deleteButton = ui.create.xjb_button(container, deleteStr)
                element().setTarget(deleteButton)
                    .father(container)
                    .style({
                        position: 'relative',
                        fontSize: '1.5rem',
                    })
                    .exit()
                deleteButton.descEle = descEle;
                deleteButton.container = container;
                deleteButton.yesButton = dialog.buttons[0];
                textarea.index.push(container);
                if (!desc.includes(textarea.value)) container.style.display = "none";
            }
            if (ul.children.length <= 30) addLi();
            else setTimeout(addLi, 33)
        }
        dialog.addEventListener(listenType, function (e) {
            if (e.target.innerText === deleteStr || e.target.deleteExpanding) {
                deleteCallback.apply(e.target, [e]);
                e.target.parentNode.remove();
            }
            if (e.target.innerText === seeStr || e.target.seeExpanding) {
                seeCallback.apply(e.target, [e])
            }
        })
        return dialog
    }


    game.xjb_create.range = function (str, min, max, value = 0, callback, changeValue = () => true) {
        if (game.xjb_create.baned) return;
        let dialog = game.xjb_create.confirm(void 0, callback);
        const prompt = element('div')
            .block()
            .setStyle('position', 'relative')
            .innerHTML(str)
            .father(dialog)
            .exit()
        const showValue = element('div')
            .block()
            .style({
                position: 'relative',
                height: '52px',
                margin: 'auto',
                width: '52px',
                textAlign: "center",
                fontSize: '50px',
                marginBottom: '32px'
            })
            .father(dialog)
            .exit()
        const range = element('input')
            .type('range')
            .value(value)
            .block()
            .style({
                position: 'relative',
                margin: 'auto',
                width: '90%',
            })
            .max(max)
            .min(min)
            .father(dialog)
            .listen('change', e => {
                dialog.buttons[0].result = parseInt(e.target.value);
                showValue.innerHTML = e.target.value;
            })
            .listen('change', changeValue)
            .exit();
        range.prompt = prompt
        dialog.buttons[0].result = parseInt(value);
        showValue.innerHTML = value;
        return dialog;
    }
    game.xjb_create.UABobjectsToChange = function ({ object, num, free, list, previousPrice, objectName, changeFunc }) {
        const energyConsume = previousPrice * game.xjb_currencyRate.CoinToEnergy
        if (free === false) {
            if (game.xjb_hasIt(object)) { }
            else if (!game.xjb_purchaseIt(object, 1, previousPrice)) return game.xjb_create.alert(`购买${objectName}需要${game.xjb_goods[object].price}魂币，你的魂币不足!`)
            var word = '请按以下规则输入:'
            for (let i = 0; i < list.length; i++) {
                word = word + '改为' + get.xjb_translation(list[i]) + '，请输入' + i + '，'
            }
            let dialog = game.xjb_create.prompt(word, void 0, function () {
                var result = this.result
                var newAttribute = list[result]
                if (list.includes(newAttribute)) {
                    changeFunc(newAttribute)
                    game.xjb_getIt(object, -1)
                } else game.xjb_create.alert("你的输入有误！")
            }).inputSmall()
            dialog.input.numberListButton(list.length)
        } else {
            game.xjb_getIt(object, num, energyConsume)
            game.xjb_create.alert("你获得了" + num + `张${objectName}`)
        }
    }
    //函数解析式对话框
    game.xjb_create.AnaFun = function (target) {
        function anaDuncStringDispose(AnaFunString) {
            let AnaFun = lib._xjb.StringDispose.anaDuncStringDispose(AnaFunString)
            game.print(AnaFun)
            //详见project.js
            let string = lib._xjb.usuallyUsedString.Math + `
                       return -(${AnaFun})`
            try {
                var func = new Function("x", string);
                func(1)
            } catch (err) {
                return err
            }
            return func
        }
        function sendPromise(target) {
            return new Promise(res => {
                let func = anaDuncStringDispose(dialog.input.value)
                if (typeof func == "function") res(func)
                else if (func instanceof Error) throw func
            }).then(data => {
                if (typeof data == "function") target.AnaFun = data
            }).catch(err => {
                game.xjb_create.alert("错误！函数解析式不正确！</br>" + err, function () {
                    return game.xjb_create.AnaFun(target)
                })
            })
        }
        let dialog = game.xjb_create.prompt("请在对话框中输入函数:f(x)=", void 0, function () {
            target && sendPromise(target)
        }, function () {
            if (target) target.toRemove = true
        });
        dialog.Mysize()
        dialog.input.addButton("arc")
        let triangle = ["sin", "cos", "tan", "csc", "sec", "cot"]
        triangle.reverse().forEach(item => {
            dialog.input.addButton(item, item + "()")
        })
        triangle.reverse()
        dialog.input.addButton(lib._xjb.usuallyUsedString.PI)
        dialog.input.addButton(lib._xjb.usuallyUsedString.deg)
        dialog.addElement("div", `支持${triangle}等三角函数</br>
                arcsin,arccos,arctan,arccsc,arcsec,arccot等反三角函数</br>
                以e为底的对数函数lnx及以a为底的对数函数log(a,x)，指数函数a^x</br>
                斯特林公式Stirling，高斯取整函数Gause</br>
                绝对值函数abs,取模函数mod(x,a)</br>
                求和函数sum(...numbers)，求积函数product(...numbers)，最大值函数max(...numbers)，最小值函数min(...numbers)</br>
                正态分布函数ND(x,E,S)(E为均值，S为标准差)，极差函数range(...numbers)，均值函数ave(...numbers)，可输入百分号。
                </br>注意:为了显示x值与y值，画布中y轴末部分不显示图象`)
        return dialog
    }
    //坐标对话框
    game.xjb_create.coordinate = async function () {
        let dialog = ui.create.xjb_dialogBase()
        dialog.highest().standardWidth()
        const canvas = dialog.addElement("canvas").setHW(500, 500);
        const context = canvas.getContext("2d");
        context.font = "16px 楷体"
        context.translate(250, 250)
        let f = await new Promise(res => {
            function waitForFunction() {
                if (dialog.AnaFun) {
                    res(dialog.AnaFun);
                    dialog.highestRemoveOk = true;
                    dialog.style.display = "block"
                }
                else if (dialog.toRemove) {
                    dialog.highestRemove()
                }
                else setTimeout(waitForFunction, 300)
            }
            setTimeout(waitForFunction, 300)
            game.xjb_create.AnaFun(dialog)
            dialog.style.display = "none"
        })
        canvas.addEventListener('click', function (e) {
            const coordinateX = (e.offsetX - 250) / (canvas.dataset.scale);
            let coordinateY = -f(coordinateX);
            context.clearRect(-250, 215, 240, 35)
            context.fillText(`y值:${coordinateY.toFixed(4)}`, -250, 230)
            context.fillText(`x值:${coordinateX.toFixed(8)}`, -250, 245)
        })
        function coordinate() {
            horizontalLine(context, -250, 240, 0);
            context.beginPath();
            context.moveTo(250, 0);
            context.lineTo(235, 4);
            context.lineTo(240, 0);
            context.lineTo(235, -4);
            context.closePath();
            context.fill();
            //
            plumbLine(context, 250, -240, 0);
            //
            context.beginPath();
            context.moveTo(0, -250);
            context.lineTo(4, -235);
            context.lineTo(0, -240);
            context.lineTo(-4, -235);
            context.closePath();
            context.fill();
            //                
            context.fillText("y", -16, -234)
            context.fillText("x", 234, -16)
            //
        }
        function paint(scale) {
            if (scale == 0) return;
            context.beginPath()
            let startDraw = false, lastY;
            for (let pX = -5000; pX < 5001; pX++) {
                const x = pX / (20 * scale);
                const y = f(x);
                const pY = scale * y
                if (y == Infinity || y == -Infinity || isNaN(y) || pY > 215) {
                    context.stroke();
                    context.beginPath();
                    startDraw = false;
                    continue;
                }
                if (!startDraw) {
                    context.moveTo(pX / 20, pY)
                    startDraw = true
                }
                else context.lineTo(pX / 20, pY);
            }
            context.stroke();
        }
        let range = ui.xjb_addElement({
            target: dialog,
            tag: 'input',
            type: 'range',
            value: 25,
            max: 250,
            min: 1,
            style: {
                "width": "100%",
                "height": "15px",
                "backgroundColor": "#ddd",
                "outline": "none"
            }
        });
        range.addEventListener("change", function () {
            canvas.dataset.scale = range.value;
            context.clearRect(-250, -250, 500, 500);
            coordinate();
            paint(range.value);
        });
        canvas.dataset.scale = range.value;
        coordinate()
        paint(25)
        return dialog
    }
    game.xjb_create.iframe = function (src) {
        let dialog = game.xjb_create.alert()
        let iframe = element("iframe")
            .father(dialog)
            .src(src)
            .style({
                "height": "100%",
                "width": "100%"
            })
            .exit()
        if (src.endsWith(".md")) {

        }
        dialog.frame = iframe;
    }
    //能量不足提醒
    game.xjb_NoEnergy = function () {
        game.xjb_create.alert("系统能量不足！<br>请支持刘徽-祖冲之项目为系统供能！")
    }
    //系统更新提醒
    game.xjb_systemUpdate = function () {
        game.xjb_create.alert('魂币系统已更新，重启即生效');
    }
}