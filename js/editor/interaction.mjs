import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
import { element, textareaTool } from "../tool/ui.js";
import { NonameCN } from "../nonameCN.js";
import { getLineRangeOfInput, pointInWhichLine } from "../tool/string.js";
import { TransCnText } from "./transCnText.mjs";
import { EditorParameterList, parameterJudge } from "./parameter.mjs";
import { dispose } from "../editor.js";
import { Player } from "../../../../noname/library/element/player.js";
function tabChange(type) {
    let list = [];
    let tabMode = false;
    return function (e) {
        if (e.key != 'Tab') {
            if (!tabMode) return;
            if (e.key === 'Backspace') return;
            this.arrange();
            this.submit();
            tabMode = false;
            return;
        }
        if (!tabMode) tabMode = true;
        e.preventDefault();
        const range = getLineRangeOfInput(this);
        const start = range[0];
        const end = range[1];
        const content = this.value;
        const subStr = content.slice(start, end).replace('\t', '');
        if (this.selectionEnd == this.selectionStart) {
            list = [...Object.keys(NonameCN.giveSentence[type]), ...Object.keys(NonameCN.giveSentence['unshown_' + type])].filter(item => item.startsWith(subStr));
        }
        if (!list.length) {
            this.selectionStart = start;
            this.selectionEnd = end;
            return;
        }
        const replacer = list.shift();
        this.value = content.slice(0, start) + replacer + content.slice(end);
        this.selectionStart = start;
        this.selectionEnd = start + replacer.length;
    }
}
export class EditorInteraction {
    static GivenSentenceDialog(node) {
        game.xjb_create.seeDelete(
            NonameCN.giveSentence[node.toPart],
            '使用',
            '隐藏',
            function () {
                const id = this.container.dataset.xjb_id;
                EditorInteraction.insertPhrase(node, "\n");
                EditorInteraction.insertPhrase(node, id);
                EditorInteraction.insertPhrase(node, "\n");
                node.arrange();
                node.submit();
            },
            function () {
            },
            function () {
            }
        )
    }
    /**
     * 
     * @param {HTMLInputElement} input 
     * @param {string} str 
     */
    static insertPhrase(input, str) {
        const { selectionEnd: preEnd, selectionStart: preStart, value: preValue } = input;
        if (preEnd != preStart) return;
        input.value = `${preValue.slice(0, preEnd)}${str}${preValue.slice(preEnd)}`;
        input.setSelectionRange(preEnd + str.length, preEnd + str.length);
    }
    /**
     * 
     * @param {HTMLElement} ele 
     */
    static get editorBack() {
        return ui.window.querySelector(".xjb-interact-back.xjb-editor");
    }
    static addAllOrder(ele) {
        const back = this.editorBack
        textareaTool().setTarget(ele)
            .clearOrder()
            .dittoOrder()
            .dittoUnderOrder()
            .listen('keydown', tabChange(ele.toPart))
            .listen('keyup', function () {
                if (!this.value.includes('引入')) return;
                for (const [regexp, result] of NonameCN.editorInbuiltSkillMap.entries()) {
                    if (!regexp.test(this.value)) continue;
                    this.value = this.value.replace(regexp, '');
                    const { kind, position, filter, filterCard, filterTarget, contentAsync, content, trigger } = result;
                    back.skill.contentAsync = !(!contentAsync);
                    if ('phaseUse' in result) {
                        back.skill.kind = 'enable:"phaseUse"';
                    }
                    if ('position' in result) {
                        back.skill.position = position;
                    }
                    if ('filter' in result) {
                        back.ele.filter.value = filter;
                        back.ele.filter.arrange()
                        back.ele.filter.submit();
                    }
                    if ('filterCard' in result) {
                        back.ele.filterCard.value = filterCard;
                        back.skill.type.push("filterCard");
                        back.ele.filterCard.arrange();
                        back.ele.filterCard.submit();
                    }
                    if ('filterTarget' in result) {
                        back.ele.filterTarget.value = filterTarget;
                        back.skill.type.push("filterTarget");
                        back.ele.filterTarget.arrange();
                        back.ele.filterTarget.submit();
                    }
                    if ('content' in result) {
                        back.ele.content.value = content;
                        back.ele.content.arrange()
                        back.ele.content.submit();
                    }
                    if ('trigger' in result) {
                        back.skill.kind = 'trigger';
                        back.ele.trigger.value = trigger;
                        back.ele.trigger.arrange();
                        back.ele.trigger.submit();
                    }
                    break;
                }
            })
            .listen('keyup', (e) => {
                if (!e.shiftKey || !e.altKey || e.key !== 'ArrowUp') return;
                /**
                 * @type {HTMLTextAreaElement}
                 */
                const node = e.target;
                const { selectionStart: preStart, selectionEnd: preEnd } = node
                const lineNumStart = pointInWhichLine(node.value, preStart)
                const lineNumEnd = pointInWhichLine(node.value, preEnd)
                const lines = node.value.split("\n");
                let targetPhrase;
                if (lineNumStart === lineNumEnd) targetPhrase = lines.at(lineNumEnd);
                else {
                    targetPhrase = lines.slice(lineNumStart, lineNumEnd + 1).join("\n");
                }
                lines.splice(lineNumStart, 0, targetPhrase)
                node.value = lines.join("\n");
                node.setSelectionRange(preStart, preEnd);
                node.blur();
                node.focus();
                node.submit();
            })
            .listen('keyup', (e) => {
                if (!e.shiftKey || !e.altKey || e.key !== 'ArrowDown') return;
                /**
                 * @type {HTMLTextAreaElement}
                 */
                const node = e.target;
                const { selectionStart: preStart, selectionEnd: preEnd } = node
                const lineNumStart = pointInWhichLine(node.value, preStart)
                const lineNumEnd = pointInWhichLine(node.value, preEnd)
                const lines = node.value.split("\n");
                let targetPhrase;
                if (lineNumStart === lineNumEnd) targetPhrase = lines.at(lineNumEnd);
                else {
                    targetPhrase = lines.slice(lineNumStart, lineNumEnd + 1).join("\n");
                }
                lines.splice(lineNumEnd + 1, 0, targetPhrase)
                node.value = lines.join("\n");
                node.setSelectionRange(preStart + targetPhrase.length + 1, preEnd + targetPhrase.length + 1);
                node.blur();
                node.focus();
                node.submit();
            })
            .listen('keyup', e => {
                if (!e.shiftKey || !e.altKey || e.key !== 'D') return;
                const node = e.target;
                const { selectionStart: preStart, selectionEnd: preEnd } = node
                const lineNumStart = pointInWhichLine(node.value, preStart)
                const lineNumEnd = pointInWhichLine(node.value, preEnd)
                const lines = node.value.split("\n");
                let targetPhrase;
                if (lineNumStart === lineNumEnd) targetPhrase = lines.at(lineNumEnd);
                else {
                    targetPhrase = lines.slice(lineNumStart, lineNumEnd + 1).join("\n");
                }
                lines.splice(lineNumStart, lineNumEnd - lineNumStart + 1);
                node.value = lines.join("\n");
                node.setSelectionRange(preEnd - targetPhrase.length, preEnd - targetPhrase.length);
                node.blur();
                node.focus();
            })
            .listen('keyup', e => {
                if (!e.shiftKey || !e.altKey || e.key !== 'C') return;
                ele.value = '';
                ele.submit();
            })
            .listen('keyup', e => {
                if (!e.shiftKey || !e.altKey || e.key !== 'F') return;
                ele.arrange();
                ele.submit();
            })
            .listen('keyup', e => {
                if (!e.shiftKey || !e.altKey || e.key !== 'S') return;
                EditorInteraction.GivenSentenceDialog(ele);
            })
            .listen('keyup', e => {
                if (!e.shiftKey || !e.altKey || e.key !== '#') return;
                EditorInteraction.insertPhrase(ele, `${"#".repeat(15)}\n`)
            })
            .clearThenOrder("整理", ele.arrange)
            .replaceThenOrder('新长中文', '', () => NonameCN.moreSetDialog[6](back))
            .replaceOrder(/(本|此|该)技能id/g, back.getID)
            .replaceOrder(/^新分隔符/mg, "#".repeat(15))
    }
    static addCommonOrder(ele) {
        const back = this.editorBack;
        textareaTool().setTarget(ele)
            .listen('blur', function () { this.lastPlaceIndex = this.selectionStart })
            .listen("keyup", function (e) {
                if (e.key !== "Enter") return;
                /**
                 * @type {string}
                 */
                const position = this.selectionStart;
                const initialValue = this.value;
                if (!initialValue.includes("\n")) return;
                const tabs = this.value.slice(0, position).split("\n").at(-2).match(/^\t/g);
                if (tabs) {
                    this.value = `${initialValue.slice(0, position)}${"\t".repeat(tabs.length)}${initialValue.slice(position)}`;
                    this.selectionStart = this.selectionEnd = position + tabs.length;
                }
            })
            .replaceOrder(/访\*(\d+)/g, (_, ...p) => {
                return '访  '.repeat(parseInt(p[0]))
            })
            .replaceThenOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束", ele.adjustTab)
            .replaceThenOrder('新否则', "否则\n分支开始\n\n分支结束", ele.adjustTab)
            .replaceThenOrder(/^如果\*(\d+)/mg, (_, ...p) => {
                return "如果\n\n那么\n分支开始\n\n分支结束\n".repeat(parseInt(p[0])).slice(0, -1)
            }, ele.adjustTab)
            .replaceThenOrder('新默认', "默认 :\n分支开始\n\n分支结束\n打断", ele.adjustTab)
            .replaceThenOrder(/^新函数/mg, "函数 参数表头 参数表尾 函数开始\n\n函数结束", ele.adjustTab)
            .replaceOrder(/\bdo-while\b/g, "do{\n\n}\nwhile(  )")
            .replaceOrder(/\bwhile-/g, "while(  ){\n\n}")
            .replaceOrder(/\bfor-in\b/g, "for( 常量 k in  ){\n\n}")
            .replaceOrder(/\bfor-of\b/g, "for( 常量 k of  ){\n\n}")
            .replaceOrder(/\bfor-;;/g, "for( 块变 i 令为 0 ; i< ; i++ ){\n\n}")
            .replaceOrder(/\bswitch-case\*(\d+)/g, (_, ...p) => {
                return `switch (  ){\n${"case ():{\n\n}\nbreak;\n".repeat(parseInt(p[0]))}default:{\n\n}\nbreak;\n}`
            }, ele.adjustTab)
            .replaceThenOrder(
                /^新?花色分支$/mg,
                '变量 花色 令为 获取 花色 卡牌\n分岔 ( 花色 ) \n分支开始\n\t情况 红桃 :\n\t分支开始\n\t\t\n\t分支结束\n\t打断\n\t情况 方片 :\n\t分支开始\n\t\t\n\t分支结束\n\t打断\n\t情况 黑桃 :\n\t分支开始\n\t\t\n\t分支结束\n\t打断\n\t情况 梅花 :\n\t分支开始\n\t\t\n\t分支结束\n\t打断\n分支结束',
                ele.adjustTab
            )
            .replaceOrder("新虚拟牌", '变量 虚拟牌 令为\n{\n牌名 : 杀 ,\n花色 : 梅花 ,\n点数 : A点 ,\n属性 : 火属性\n}')
    }
    static addContentOrder_setting(ele) {
        const back = this.editorBack;
        textareaTool().setTarget(ele)
            .replaceThenOrder(/(?<![/][*])[ ]*back.skill.contentAsync[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.skill.contentAsync=true*/", () => { back.skill.contentAsync = true })
            .clearThenOrder(/([/][*])[ ]*back.skill.contentAsync[ ]*\=false[ ]*[ ]*([*][/])/g, () => { back.skill.contentAsync = false })
            .replaceThenOrder(/(?<![/][*])back.ContentInherit[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.ContentInherit=true*/", () => { back.ContentInherit = false })
            .clearThenOrder(/([/][*])[ ]*back.ContentInherit[ ]*\=[ ]*false[ ]*([*][/])/g, () => { back.ContentInherit = false })
    }
    static addContentOrder_area(ele) {
        const back = this.editorBack;
        textareaTool().setTarget(ele)
            .replaceOrder(/^<([$_a-zA-Z0-9]+)[>]?->$/mg, '<$1>\n\n</$1>')
            .replaceOrder(/^(模组|mod)[区域]?->$/mg, '<mod>\n\n</mod>')
            .replaceThenOrder(/^f-([$_a-zA-Z0-9]+)->$/mg, '$1( ){\n\n\n},', ele.adjustTab)
            .replaceThenOrder(/^f-+[>]/mg, 'function( ){\n\n\n}', ele.adjustTab)
            .replaceThenOrder(/^f-(卡牌)?可使?用性(模组)?->$/mg, 'cardEnabled(card){\n\n\n},', ele.adjustTab)
            .replaceThenOrder('新判定回调', '#判定回调区头\n函数 参数表头 参数表尾 函数开始\n新步骤\n\n函数结束\n#判定回调区尾\n', ele.adjustTab)
    }
}
function getVarOfTextarea(textarea, type, hook = str => str) {
    const end = textarea.selectionEnd;
    const str = hook(textarea.value.slice(0, end));
    const vars = getVar(str);
    return Object.entries(vars).map(arr => arr.join(":")).filter(actual => {
        const isPlayer = parameterJudge.Player(actual.split(":").at(-1));
        if (type === "Player") return isPlayer;
        if (isPlayer) return false;
        return true
    });
}
/**
 * 
 * @param {HTMLTextAreaElement} textarea 
 */
function getVarOfContent(type) {
    const content = game.xjb_back.querySelector(".xjb-Ed-contentTextarea");
    return getVarOfTextarea(content, type, str => {
        let result = str;
        return result;
    });
}
function getVar(str) {
    const lines = dispose(str);
    const result = {};
    for (const line of lines) {
        line.replace(findVarRegexp, function (...arr) {
            result[arr[3].replace(/[ ]/g, "")] = arr[4].replace(/[ ]/g, "");
        })
    }
    return result;
}
const playerList = ["你", "玩家", "当前回合角色"];
const getPlayerList = () => {
    const result = [...playerList];
    result.push(...getVarOfContent("Player").map(str => str.split(":").at(0)));
    return result;
}
const getBoolList = (cnTrue = "是", cnFalse = "无") => {
    const result = [cnTrue, cnFalse];
    result.push(...getVarOfContent("bool").map(str => str.split(":").at(0)));
    return result;
}
const getNumberVarList = () => {
    return getVarOfContent("number").map(str => str.split(":").at(0));
}
const methodsList = Object.keys(EditorParameterList).map(method => {
    return Object.keys(NonameCN.ContentList).find(cn => NonameCN.ContentList[cn] === method);
})
const findVarRegexp = /(var|const|let)(\s)+(.+)\=\s*(.+)/;
export class choiceMode {
    static updateDataListRegular(datalist, getList, interval = 500) {
        let lastToStr = '';
        const timer = setInterval(() => {
            if (!datalist) {
                last = null;
                clearInterval(timer)
                return;
            }
            const list = getList();
            const listToStr = list.toString();
            if (listToStr === lastToStr) return;
            let innerHTML = '';
            for (const data of list) {
                innerHTML += `<option value=${data}>`;
            }
            datalist.innerHTML = innerHTML;
            lastToStr = listToStr;
        }, interval)
    }
    static giveDataList(input, list, id, father) {
        input.setAttribute("list", id);
        let innerHTML = '';
        for (const data of list) {
            innerHTML += `<option value=${data}>`
        }
        const dataList = document.createElement("datalist");
        dataList.setAttribute('id', id);
        dataList.innerHTML = innerHTML;
        father.append(dataList);
        return dataList
    }
    /**
     * 
     * @param {HTMLElement} ele 
     */
    static reloadDataArea(ele) {
        ele.replaceChildren();
    }
    /**
     * @param {HTMLElement} ele 
     */
    static init(ele) {
        const firstLine = element("div")
            .setStyle("position", "relative")
            .block()
            .exit()
        const DataArea = element("div")
            .style({
                "position": "relative",
                "height": "165px",
                "overflow": "auto"
            })
            .addClass("xjb-Ed-contentDataInput")
            .block()
            .exit()
        const submitArea = element()
            .setTarget(ui.create.xjb_button(void 0, "生成"))
            .setStyle("position", "relative")
            .listen(lib.config.touchscreen ? "touchend" : "click", () => {
                const player = TransCnText.translate(firstLine.whoEle.value, NonameCN.ContentList);
                const event = TransCnText.translate(firstLine.doWhatEle.value, NonameCN.ContentList);
                const lefts = [];
                const rights = [];
                for (const node of DataArea.children) {
                    const [left, right] = node.getData();
                    if (Array.isArray(left)) lefts.push(...left);
                    else lefts.push(left);
                    if (Array.isArray(right)) rights.push(...right);
                    else rights.push(right);
                }
                const sentence = `${player}.${event}(${rights})`;
                const content = game.xjb_back.querySelector(".xjb-Ed-contentTextarea");
                EditorInteraction.insertPhrase(content, "\n")
                EditorInteraction.insertPhrase(content, sentence)
                EditorInteraction.insertPhrase(content, "\n")
                content.arrange();
                content.submit();
                {
                    firstLine.whoEle.value = "";
                    firstLine.doWhatEle.value = "";
                    choiceMode.reloadDataArea(DataArea);
                }
            })
            .exit();
        const whoText = element("div").innerHTML("对象(谁)：").setStyle("position", "relative").block().exit();
        const who = element("input").type("search")
            .setStyle("position", "relative")
            .block()
            .addClass("xjb-Ed-contentWho")
            .listen("change", () => {
                doWhat.value = "";
                choiceMode.reloadDataArea(DataArea);
            })
            .exit()
        const doWhatText = element("div").block().setStyle("position", "relative").innerHTML("方法(干什么)：").exit();
        const doWhat = element("input").block()
            .setStyle("position", "relative")
            .type("search")
            .addClass("xjb-Ed-contentDoWhat")
            .listen("change", () => {
                choiceMode.reloadDataArea(DataArea);
                const methodName = TransCnText.translate(doWhat.value, NonameCN.ContentList);
                if (!(methodName in EditorParameterList)) return;
                for (const data of EditorParameterList[methodName]) {
                    if (data.type === "number") choiceMode.pushNumControl(DataArea, data.cn, data.value, data.max, data.min);
                    if (data.type === "Player") choiceMode.pushPlayerControl(DataArea, data.cn, data.value);
                    if (data.type === "boolean") choiceMode.pushBooleanControl(DataArea, data.cn, data.value, data.defaultValue, data.cnTrue, data.cnFalse);
                    if (data.type === "otherArgs") choiceMode.pushOtherArgsControl(DataArea, data.cn, data.value, data.args);
                }
            })
            .exit()
        firstLine.whoEle = who;
        firstLine.doWhatEle = doWhat;
        firstLine.append(whoText, who, doWhatText, doWhat);
        choiceMode.giveDataList(who, playerList, "xjb-Ed-contentWho-list", firstLine);
        choiceMode.giveDataList(doWhat, methodsList, "xjb-Ed-contentDoWhat-list", firstLine);
        ele.append(firstLine, DataArea, submitArea);
    }
    static pushNumControl(father, cn, value, max = Infinity, min = -Infinity) {
        const controlNumContainer = element("div")
            .block()
            .setStyle("position", "relative")
            .exit()
        const controlNumText = element("div").block().innerHTML(`${cn}：<span></span>`).setStyle("position", "relative").exit();
        const varButton = ui.create.xjb_button(controlNumText, "使用变量");
        const controlNum = element("input")
            .type("number")
            .block()
            .min(min)
            .max(max)
            .listen("change", e => {
                const num = parseInt(e.target.value)
                if (isNaN(num)) e.target.value = "";
                if (num > e.target.max) e.target.value = e.target.max;
                if (num < e.target.min) e.target.value = e.target.min;
                const node = controlNumText.querySelector("span");
                node.textContent = e.target.value;
            })
            .exit();
        const controlNumVar = element("input")
            .type("search")
            .block()
            .addClass("xjb_hidden")
            .listen("change", e => {
                const node = controlNumText.querySelector("span");
                node.textContent = e.target.value.split(":").at(0);
            })
            .exit();
        const datalist = choiceMode.giveDataList(controlNumVar, getNumberVarList(), `${cn}-${value}`, controlNumContainer);
        choiceMode.updateDataListRegular(datalist, getNumberVarList);
        varButton.addEventListener(lib.config.touchscreen ? "touchend" : "click", () => {
            varButton.classList.toggle("xjb-chosen");
            controlNum.classList.toggle("xjb_hidden");
            controlNumVar.classList.toggle("xjb_hidden");
            controlNumContainer.useVar = !controlNumContainer.useVar;
            const node = controlNumText.querySelector("span");
            node.textContent = (controlNumContainer.useVar ? controlNumVar : controlNum).value;
        })
        controlNumContainer.getData = () => {
            return [value, (controlNumContainer.useVar ? controlNumVar : controlNum).value];
        }
        controlNumContainer.append(controlNumText, controlNum, controlNumVar);
        father.appendChild(controlNumContainer);
    }
    static pushPlayerControl(father, cn, value) {
        const controlPlayerContainer = element("div")
            .block()
            .setStyle("position", "relative")
            .exit()
        const controlPlayerText = element("div").block().innerHTML(cn).setStyle("position", "relative").exit();
        const controlPlayer = element("input")
            .type("search")
            .block()
            .exit();
        const datalist = choiceMode.giveDataList(controlPlayer, getPlayerList(), `${cn}-${value}`, controlPlayerContainer);
        choiceMode.updateDataListRegular(datalist, getPlayerList);
        controlPlayerContainer.getData = () => {
            return [value, TransCnText.translate(controlPlayer.value, NonameCN.ContentList)];
        }
        controlPlayerContainer.append(controlPlayerText, controlPlayer);
        father.appendChild(controlPlayerContainer);
    }
    static pushBooleanControl(father, cn, value, defaultValue, cnTrue = "是", cnFalse = "否") {
        const controlBoolContainer = element("div")
            .block()
            .setStyle("position", "relative")
            .exit()
        const controlBoolText = element("div").block().innerHTML(cn).setStyle("position", "relative").exit();
        const controlBool = element("input")
            .type("search")
            .hook(ele => {
                if (defaultValue === true) ele.value = cnTrue;
                if (defaultValue === false) ele.value = cnFalse;
            })
            .block()
            .exit();
        const datalist = choiceMode.giveDataList(controlBool, getBoolList(cnTrue, cnFalse), `${cn}-${value}`, controlBoolContainer);
        choiceMode.updateDataListRegular(datalist, () => getBoolList(cnTrue, cnFalse));
        controlBoolContainer.getData = () => {
            let data = controlBool.value
            if (data === cnTrue) data = true;
            if (data === cnFalse) data = false;
            return [value, data];
        }
        controlBoolContainer.append(controlBoolText, controlBool);
        father.appendChild(controlBoolContainer);
    }
    static pushOtherArgsControl(father, cn = "其他设置", value, args = []) {
        const controlArgsContainer = element("div")
            .block()
            .setStyle("position", "relative")
            .exit()
        const controlArgsText = element("div").block().innerHTML(cn).setStyle("position", "relative").father(controlArgsContainer).exit();
        for (const arg of args) {
            const button = element()
                .setTarget(ui.create.xjb_button(controlArgsContainer, arg.cn))
                .style({
                    margin: "",
                    marginRight: "1em"
                })
                .exit();
            button.value = arg.value;
            if (arg.defaultValue) {
                button.classList.addClass(".xjb-chosen");
            }
        }
        controlArgsContainer.addEventListener(lib.config.touchscreen ? "touchend" : "click", e => {
            if (!e.target.classList.contains("xjb_dialogButton")) return;
            controlArgsContainer.values = [];
            e.target.classList.toggle("xjb-chosen");
            const nodes = controlArgsContainer.querySelectorAll(".xjb_dialogButton");
            nodes.forEach((node, index) => {
                if (node.classList.contains("xjb-chosen")) controlArgsContainer.values[index] = node.value;
            })
        })
        controlArgsContainer.getData = () => {
            return [controlArgsContainer.values, controlArgsContainer.values];
        }
        father.appendChild(controlArgsContainer);
    }
}