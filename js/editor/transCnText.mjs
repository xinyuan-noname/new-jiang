import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
import { textareaTool } from "../tool/ui.js";
import { NonameCN } from "../nonameCN.js";
import { getLineRangeOfInput, pointInWhichLine } from "../tool/string.js";
const matchNotObjColon = /(?<!\{[ \w"']+):(?![ \w"']+\})/;
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
    static translate(word, directory) {
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

}