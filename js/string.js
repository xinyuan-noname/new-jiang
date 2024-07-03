export const PiChar = String.fromCharCode(960);
export const degChar = String.fromCharCode(176);
export const cnCharRange = '\u4e00-\u9fa5'
/**
 * @param {String} str 
 * @param {number} basic 
 * @returns {String}
 */
export function adjustTab(str, basic = 0) {
    const arr1 = str.split('\n');
    let tabLevel = basic;
    let stack = []
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
 * 
 * @param {string} str 
 * @param {function} callback 
 * @returns {string}
 */
export function eachLine(str, callback) {
    let result;
    result = str.split("\n").map((item, index, arg) => {
        return callback(item, index, arg) || item;
    }).join("\n");
    return result;
}
/**
 * 
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