import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
import { chineseToArabic } from "../tool/math.js";
import { NonameCN } from "./nonameCN.js";
export function dispose(str, number, directory = lib.xjb_translate) {
    let list1 = TransCnText.splitLine(str);
    if (number === 1) return list1;
    let list2 = TransCnText.splitWord(list1)
    if (number === 2) return list2;
    let list3 = TransCnText.translateLine(list2, directory);
    if (number === 3) return list3;
    return TransCnText.linkWords(list3);
}
export function disposeTri(str, number, directory = NonameCN.TriList) {
    let list1 = TransCnText.splitLine(str);
    if (number === 1) return list1;
    let list2 = TransCnText.splitWordTri(list1)
    if (number === 2) return list2;
    let list3 = TransCnText.translateLineTri(list2);
    return list3;
}
const matchNotObjColon = /(?<!\{[ \w"']+):(?![ \w"']+\})/;
const matchFromTo = /^([bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到([bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)[张名点枚]$/
const matchTriKeywords = /火属性|雷属性|冰属性|神属性|梅花|方片|黑桃|红桃|红色|黑色|基本|装备(?!区)|普通锦囊|非延时锦囊|延时锦囊|点数为(?:11|12|13|[AJQK1-9])|一张/
const vCardObject = NonameCN.getVirtualCard();
const player = NonameCN.getVirtualPlayer();
const vPlayers = NonameCN.getVirtualPlayers();
const vGame = NonameCN.getVirtualGame();
const eventModel = NonameCN.getVirtualEvent();
const vStorage = NonameCN.getVirtualStorage();
const XJB_PUNC = ["!", " || ", " && ", " + ", " - ", " * ", " / ", " % ",
    " += ", " -= ",
    "++", "--",
    " > ", " < ", " >= ", " <= ", " == ", " === ",
    "(", ")", "."]
const XJB_NEED_FOLLOW_PUNC = ['++', "--"]
const XJB_NEED_FELLOW_PUNC = ['!', '~']
const XJB_NEED_LINK_PUNC = [' || ', ' && ', ' ?? ', ' ? ', ' + ', ' - ', ' * ', ' ** ', ' / ', ' % ', ' += ', ' -= ', ' > ', ' < ', ' >= ', ' <= ', ' == ', ' === ', '(', '.']
export class TransCnText {
    /**
    * @param {string} text 
    * @returns {string[]|[]}
    */
    static splitLine(text) {
        if (typeof text != "string" || !text.length) return [];
        const lines = text.split('\n');
        const result = [];
        for (const [_, line] of lines.entries()) {
            if (line.startsWith("/*") && line.endsWith("*/")) continue;
            if (/^\s*$/.test(line)) continue;
            result.push(line.replace(/\t/g, ""));
        }
        return result;
    }
    /**
    * @param {string[]} lines 
    * @returns {string[][]} 
    */
    static splitWord(lines) {
        if (!Array.isArray(lines)) return [[]];
        const result = new Array(lines.length);
        for (const [num, line] of lines.entries()) {
            //全英文不分词
            if (/^[^\u4e00-\u9fa5]+$/.test(line)) {
                result[num] = [line];
                continue;
            }
            const newline = line.replace(/([,\{\}\[\]\(\)\:\.]|\.{3})/g, " $1 ");
            const words = newline.split(/[ ]/);
            //分词后若中文全带引号,则按不分词的形式进行
            if (words.filter(word => /[\u4e00-\u9fa5]/.test(word)).every(word => /["'`]/.test(word))) {
                result[num] = [line];
                continue;
            }
            result[num] = words
        }
        return result;
    }
    static splitWordTri(lines) {
        if (!Array.isArray(lines)) return [[]];
        const result = new Array(lines.length);
        for (const [num, line] of lines.entries()) {
            const words = line.split(/[ \t"'`]/).filter(word => word.length);
            result[num] = words
        }
        return result;
    }
    /**
     * @param {string} word 
     * @param {object} directory 
     * @returns {string}
     */
    static translate(word, directory = {}) {
        if (typeof word != "string") return "";
        if (matchFromTo.test(word)) {
            return `[${word.slice(0, -1).split("到").map(item => chineseToArabic(item))}]`
        }
        if (word in directory) return directory[word];
        if (/(开始)[前时]/.test(word)) {
            return TransCnText.translate(word.replace(/(开始)[前时]/, "$1"), directory);
        }
        if (/(结束)[时后]/.test(word)) {
            return TransCnText.translate(word.replace(/(结束)[前时]/, "$1"), directory);
        }
        if (/(结算完成|完成结算)[时后]/.test(word)) {
            return TransCnText.translate(word.replace(/(结算完成|完成结算)[前时]/, "$1"), directory);
        }
        if (word.includes("的")) return TransCnText.translate(word.replace(/的/g, ""), directory);
        return word;
    }
    static translateLine(lines, directory) {
        if (!Array.isArray(lines)) return [[]];
        const result = new Array(lines.length).fill().map(() => []);
        for (const [num, line] of lines.entries()) {
            //判断该行词数是否为1，且第一行全为非中文
            if (line.length === 1 && /^[^\u4e00-\u9fa5]+$/.test(line[0])) {
                result[num] = line;
                continue;
            }
            const [args, prefix] = [[], []]
            for (const word of line) {
                const translated = TransCnText.translate(word, directory);
                let processing = translated;
                processing = processing.replace(/[:;]denyPrefix/, () => {
                    prefix.push("!")
                    return ""
                })
                processing = processing.replace(/(.*?)[:;]intoFunctionWait(.*?)/, (match, p1, p2) => {
                    const concatStr = `${p1}${p2}`
                    const list = concatStr.includes(";") ? concatStr.split(";") : concatStr.split(matchNotObjColon)
                    const first = list.shift();
                    args.push(...list);
                    return first;
                })
                if (!/[:;]intoFunction/.test(processing)) {
                    result[num].push(processing)
                    continue;
                }
                const list = processing.includes(';') ? processing.split(";") : processing.split(matchNotObjColon);
                list.remove("intoFunction");
                result[num].push(...list);
            }
            result[num].unshift(...prefix);
            result[num].push(...args);
        }
        return result;
    }
    static translateTri(word) {
        if (typeof word != "string") return "";
        const directory = NonameCN.TriList;
        console.log(word);
        if (word in directory) return directory[word];
        if (/(开始)[前时]/.test(word)) {
            return TransCnText.translateTri(word.replace(/(开始)[前时]/, "$1"));
        }
        if (/(结束)[时后]/.test(word)) {
            return TransCnText.translateTri(word.replace(/(结束)[前后]/, "$1"));
        }
        if (/(结算完成|完成结算)[时后]/.test(word)) {
            return TransCnText.translateTri(word.replace(/(结算完成|完成结算)[前时]/, "$1"));
        }
        if (word.includes("的")) return TransCnText.translateTri(word.replace(/的/g, ""));
        if (matchTriKeywords.test(word)) {
            let decoration = [];
            let wordx = word.replace(/红色|黑色|梅花|方片|黑桃|红桃|火属性|雷属性|冰属性|神属性|基本|装备(?!区)|普通锦囊|非延时锦囊|延时锦囊/g, (match) => {
                decoration.push(NonameCN.getEn(match));
                return ''
            });
            wordx = wordx.replace(/一张|一点/g, (match) => {
                decoration.push('getIndex=1');
                return '';
            })
            if (wordx in directory) {
                return `${decoration.join(":")}:${directory[wordx]}`;
            }
        }
        return word;
    }
    static translateLineTri(lines) {
        if (!Array.isArray(lines)) return [[]];
        const result = lines.map(line => line.map(word => TransCnText.translateTri(word)))
        return result;
    }
    static linkWords(lines) {
        const result = [];
        lines.forEach(i => {
            let str = '', str2 = '',
                notice = [], bool = true, index,
                players
            const watchAndWork = (body, a, b) => {
                if (body === 'storage') {
                    str += ('.' + a)
                }
                else if (body[a] || body === vStorage) {
                    if (/[^a-zA-Z0-9_$]/.test(a)) {
                        str += a;
                        notice.remove('storageLower')
                    }
                    else if (typeof body[a] === 'function') {
                        str += ('.' + a)
                        bool = false;
                        str2 = '()';
                        index = b + 1
                    }
                    else str += ('.' + a)
                }
                else if (a.includes(';')) {
                    str += NonameCN.disposeWithQuo(body, a)
                }
                else if (a.includes(':') && a.slice(-1)[0] != ',') {
                    str += NonameCN.disposeWithQuo(body, a, matchNotObjColon)
                }
                else str += a
            }
            let lastTurn;
            //组装函数前语句
            for (let b = 0; b < i.length; b++) {
                //这个bool来控制循环的进行与否
                if (!bool) break;
                const a = i[b];
                const WAW = (body) => (watchAndWork(body, a, b));
                const type = game.xjb_judgeType(a)
                type && notice.push(type);
                if (lastTurn == 'game') WAW(vGame)
                else if (notice.includes('storageLower')) WAW(vStorage)
                else if (notice.includes('storage')) WAW('storage')
                else if (lastTurn === 'get') WAW(get)
                else if (lastTurn === 'players') { WAW(vPlayers) }
                else if (lastTurn === 'player') { WAW(player) }
                else if (lastTurn === 'event') WAW(eventModel)
                else if (lastTurn === 'Math') WAW(Math)
                else if (lastTurn === 'card') WAW(vCardObject)
                else if (lastTurn === 'variable') WAW({})
                else if (lastTurn === 'array') WAW(new Array(1).fill())
                else WAW(new Array(1).fill());
                lastTurn = type;
                if (type === 'players') players = a;
                if (['player', 'card'].some(viewer => notice.includes(viewer)) && a === "storage") notice.push('storage') && notice.remove('player');
                else if (notice.includes('storage')) notice.push('storageLower') && notice.remove('storage');
            }
            if (notice.includes("Math") && index) {
                const replacer = [];
                const cache = [];
                const toReplaced = i.slice(index);
                for (const word of toReplaced) {
                    const watcher = game.xjb_judgeType(cache.join(''));
                    if (['player', 'game'].includes(watcher)) {
                        if (watcher === 'player' && player[word]
                            || watcher === 'game' && game[word]) {
                            replacer.push(replacer.pop() + "." + word)
                            continue;
                        }
                        else if (word.includes(";")) {
                            replacer.push(replacer.pop() + NonameCN.disposeWithQuo(player, word))
                            continue;
                        }
                        else if (word.includes(":") && word.slice(-1)[0] !== ",") {
                            replacer.push(replacer.pop() + NonameCN.disposeWithQuo(player, word, matchNotObjColon))
                            continue;
                        }
                    }
                    replacer.push(word)
                    cache.push(word)
                    if (XJB_PUNC.includes(word)) {
                        cache.length = 0;
                        continue;
                    }
                }
                i.splice(index, Infinity, ...replacer);
            }
            //填写参数
            if (index) {
                const stack = [];
                const puncs = XJB_NEED_LINK_PUNC;
                const fePuncs = XJB_NEED_FELLOW_PUNC;
                const foPuncs = XJB_NEED_FOLLOW_PUNC;
                let lastIsPunc = false;
                const toOrder = i.splice(index).map(word => {
                    if (word.includes(";")) return NonameCN.disposeWithQuo("ignore", word);
                    return word;
                }).filter(word => word);
                for (const word of toOrder) {
                    let param = word;
                    if ((param.startsWith(".") || lastIsPunc || puncs.includes(param) || foPuncs.includes(param)) && stack.length) {
                        let last = stack.pop();
                        param = `${last}${param}`;
                        lastIsPunc = false;
                    }
                    if (puncs.some(punc => param.endsWith(punc) || fePuncs.includes(param))) {
                        lastIsPunc = true;
                    }
                    stack.push(param);
                }
                const parameters = stack.map(word => word.replace(/(?<!\.)\.\.(?!\.)/g, "."))
                str2 = `(${parameters})`;
            }
            let sentence = str + str2;
            if (players && notice.includes('players')) {
                sentence = NonameCN.disposePlayers(sentence, players);
            }
            if (notice.includes('player') && sentence.includes('.when(')) {
                sentence = NonameCN.disposeWhen(sentence, players);
            }
            if (notice.includes('get') && sentence.includes('//!?')) {
                sentence = NonameCN.disposeNeedTrans(sentence);
            }
            result.push(sentence);
        });
        return result;
    }
}
