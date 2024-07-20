export const PiChar = String.fromCharCode(960);
export const degChar = String.fromCharCode(176);
export const cnCharRange = '\u4e00-\u9fa5'
export function isOpenCnStr(str){
    const regexp = /(?<!["'`][\u4e00-\u9fa5，。？！“”]*?)[\u4e00-\u9fa5]+(?![\u4e00-\u9fa5，。？！“”]*?["'`])/;
    return regexp.test(str);
}
/**
 * 将扑克牌花色符号转换为中文名称
 * @param {string} str - 包含扑克牌花色符号的字符串
 * @returns {string} - 花色符号被转换为中文名称后的字符串
 */
export function suitSymbolToCN(str) {
    // 直接操作传入的字符串以避免不必要的复制
    let result = str;

    // 定义一个映射，用于将扑克牌花色符号转换为中文名称
    const map = {
        "♣️": "梅花",
        "♠️": "黑桃",
        "♥️": "红桃",
        "♦️": "方片",
        '♣': '梅花',
        '♠': '黑桃',
        '♥': '红桃',
        '♦': '方片'
    }

    // 遍历映射表，将所有的花色符号替换为对应的中文名称
    for (let [symbol, cn] of Object.entries(map)) {
        // 使用replaceAll方法全局替换字符串中的花色符号
        result = result.replaceAll(symbol, cn)
    }

    return result;
}
/**
 * @param {String} str 
 * @param {number} basic 
 * @returns {String}
 */
export function adjustTab(str, basic = 0) {
    const arr1 = str.split('\n');
    let tabLevel = basic;
    let arr2 = arr1.map(line => {
        const times = line.match(/^\t+/) ? line.match(/^\t+/)[0].length : 0;
        if (!line.includes("{") && (line.endsWith('}') || line.endsWith('},'))) tabLevel--;
        const deltaValue = times - tabLevel;
        let result = line;
        if (deltaValue > 0) result = line.slice(deltaValue);
        else if (deltaValue < 0) result = '\t'.repeat(Math.abs(deltaValue)) + line;
        if (line.endsWith('{')) tabLevel++;
        return result;
    })
    return arr2.join('\n');
};
/**
 * 
 * @param {string} str 
 * @param {function} callback 
 * @returns {string}
 */
export function eachLine(str, callback) {
    let result;
    let splited = str.split("\n");
    result = splited.map((item, index, arg) => {
        if (index > 0) callback.lastLine = splited[index - 1]
        if (index != splited.length) callback.nextLine = splited[index + 1]
        return callback(item, index, arg) || item;
    }).join("\n");
    return result;
}
/**
 * 查找并返回字符串中包含指定单词组的所有匹配项。
 * @param {string} str - 需要搜索的原始字符串。
 * @param {string[]} wordsgroup - 包含多个单词的数组，用于构建正则表达式进行匹配。
 * @returns {string[]} 返回一个数组，包含所有在字符串str中找到的与wordsgroup中的单词匹配的项。
 */
export function findWordsGroup(str, wordsgroup) {
    let result = [];
    wordsgroup = [...new Set(wordsgroup.filter(item => item && str.includes(item)))];
    if (wordsgroup.length == 0) return [];
    let regexp = new RegExp(`(${wordsgroup.join("|")})`, 'g'), match
    while ((match = regexp.exec(str)) !== null) {
        result.push(match[0]);
    }
    return result
};

/**
 * 移除字符串中指定单词组的所有出现。
 * @param {string} str - 需要处理的原始字符串。
 * @param {string[]} wordsgroup - 包含多个需要移除的单词的数组，用于构建正则表达式。
 * @returns {string} 返回一个新的字符串，其中wordsgroup中的所有单词已被移除。
 */
export function clearWordsGroup(str, wordsgroup) {
    let regexp = new RegExp(`(${wordsgroup.join("|")})`, "g")
    return str.replace(regexp, "")
}
/**
 * 
 * @param {String} str 
 * @param {String} target 
 * @returns {Array<Array<number>>} 
 */
export function indexRange(str, target) {
    const result = [];
    const { length } = target;
    const regexp = new RegExp(target, 'g');
    let match;
    while ((match = regexp.exec(str)) !== null) {
        const i = match.index;
        result.push([i, i + length - 1])
    }
    return result;
}
/**
 * @param {string} str 
 * @param {string} insertContent 
 * @param {number} i int
 * @returns {string}
 */
export function insertStr(str, insertStart, insertContent, i = 0) {
    let range = indexRange(str, insertStart);
    if (!range.length) return false;
    i = parseInt(i);
    const index = range[i][1] + 1;
    return `${str.slice(0, index)}${insertContent || ""}${str.slice(index)}`
}

/**
 * 
 * @param {number} number 
 * @param {Array} range 
 * @param {boolean}  close
 * @returns {boolean}
 */
export function selectionIsInRange(number, range, close) {
    const max = range[1] + 1, min = range[0];
    if ((close ? number <= max : number < max) && number > min) return true;
}
/**
 * 
 * @param {string} str 
 * @param {string} start 
 * @param {string} end 
 * @returns {Array<Array<Array<number>>>}
 */
export function validParenthness(str, start, end) {
    let stack = [];
    let result = [];
    let arrStart = indexRange(str, start);
    let arrEnd = indexRange(str, end);
    let tree = [...arrStart, ...arrEnd].sort((a, b) => a[1] - b[1]);
    tree.forEach(range => {
        const subStr = str.slice(range[0], range[1] + 1);
        if (subStr === start) stack.push(range);
        else if (subStr === end && stack.length) {
            result.push([stack.pop(), range])
        }
    });
    return result;
};
/**
 * @param {Array<string>} arr 
 * @param {string} prefix
 * @returns {Array<string>}
 */
export function findPrefix(arr, prefix) {
    return arr.filter(str => str.startsWith(prefix));
}
/**
 * @param {string} str 
 * @param {Array<string>} list 
 * @returns {string}
 */
export function whichPrefix(str, list) {
    let result = ''
    list.forEach(prefix => {
        if (str.startsWith(prefix)) result = prefix;
    })
    return result;
}

/**
 * @param {string} str 
 * @param {RegExp} match 
 * @param {string} prefix 
 * @param {string} suffix 
 */
export function addPSFix(str, match, prefix, suffix) {
    let result = str.replace(match, function (match, ...p) {
        return `${prefix}${match}${suffix}`;
    })
    return result;
}
export function deleteRepeat(str, regexp) {
    let result = str;
    let match;
    let pList = [];
    while ((match = regexp.exec(str)) !== null) {
        pList.push(match[0])
    }
    pList = [...new Set(pList)].map(p=>{
        return p.replace(/([\\^$.|?*+(){}\[\]])/g, '\\$1')
    });
    for (let k of pList) {
        result = result.replace(new RegExp(`(?<=${k})\\s*(${k})+`, 'g'), '')
    }
    return result;
}