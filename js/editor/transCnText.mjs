import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
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
const matchNotObjColon = /(?<!\{[ \w"']+):(?![ \w"']+\})/;
const vCardObject = NonameCN.getVirtualCard();
const player = NonameCN.getVirtualPlayer();
const vPlayers = NonameCN.getVirtualPlayers();
const vGame = NonameCN.getVirtualGame();
const eventModel = NonameCN.getVirtualEvent();
const vStorage = NonameCN.getVirtualStorage();
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
            if (!line.length) continue;
            result.push(line);
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
            const words = newline.split(/[ \t]/);
            //分词后若中文全带引号,则按不分词的形式进行
            if (words.filter(word => /[\u4e00-\u9fa5]/.test(word)).every(word => /["'`]/.test(word))) {
                result[num] = [line];
                continue;
            }
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
        return directory[word] || directory[word.replaceAll(/[的]/g, "")] || word;
    }
    static translateLine(lines, directory) {
        if (!Array.isArray(lines)) return [[]];
        /**
         * @type {string[][]}
         */
        const result = new Array(lines.length).fill().map(() => []);
        for (const [num, line] of lines.entries()) {
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
                else if (a.includes(':') && a.at(-1) != ',') {
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
                        else if (word.includes(":") && word.at(-1) !== ",") {
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
                let toOrder = i.splice(index);
                let puncSwtich = false
                let punc = window.XJB_PUNC;
                toOrder.forEach((c, b) => {
                    let string = '', a = c;
                    //翻译n到m
                    if (/到/.test(c)) {
                        let arr = c.split('到');
                        a = '[';
                        a += lib.xjb_translate[arr[0]] || arr[0];
                        a += ',';
                        a += lib.xjb_translate[arr[1]] || arr[1];
                        a += ']';
                    }
                    if (a.includes(';')) {
                        a = NonameCN.disposeWithQuo('ignore', a)
                    }
                    //非标点符号以,连接
                    if (b > 0 && !punc.includes(a) && !puncSwtich) {
                        string = ',' + a + ')';
                    }
                    //否则直接连接
                    else {
                        if (punc.includes(a)) puncSwtich = true;
                        else if (puncSwtich) puncSwtich = false;
                        string = a + ')';
                    }
                    //匹配最后一个括号以替换
                    str2 = str2.replace(/\)(?=[^\)]*$)/, string);
                })
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
