import { lib } from "../../../../noname.js";

const suit = ['club', 'spade', 'diamond', 'heart', 'none'];
const color = ['red', 'black'];
const nature = Array.from(lib.nature.keys());
const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const type = ["basic", "equip", "trick", "delay"];
const subtype = ["equip1", "equip2", "equip3", "equip4", "equip5"];
const position = "hejxs"
const testLoseRegExp = /^lose(?!Hp)/
export class EditorDataAnalyze {
    static select(line) {
        let result = line, ok = false;
        switch (true) {
            case line.includes('atLeast'): {
                result = `[${line.replace('atLeast', '')},Infinity]`;
                ok = true;
            }; break;
            case line.includes('atMost'): {
                result = `[1,${line.replace('atMost', '')}]`;
                ok = true;
            }; break;
            case (/^\[\d+,\d+\]$/.test(line) || /^\[[0-9],Infinity\]$/.test(line) || !isNaN(Number(result))): {
                ok = true;
            }; break;
        }
        return [ok, result];
    };
    static trigger(lines) {
        const result = {
            player: [],
            source: [],
            target: [],
            global: []
        };
        const triFilterMap = {
            player: {},
            source: {},
            target: {},
            global: {}
        };
        const getIndexMap = {
            player: [],
            source: [],
            target: [],
            global: []
        }
        //sort 注意这里不会判断一点从而判断getIndex 这需要搭配后续的一些处理
        //添加受到一点伤害/获得/摸一张牌的判断函数
        for (const line of lines) {
            if (line.includes("roundStart")) {
                line.remove("roundStart");
                result.global.push("roundStart");
            }
            if (!line.length) continue;
            let [triType] = line;
            if (triType in result) line.remove(triType)
            else triType = "player";
            for (let item of line) {
                if (item === "damageSource") {
                    if (triType !== "global") {
                        result.source.add(item);
                        continue;
                    }
                }
                if (item.startsWith("source:")) {
                    if (triType !== "global") {
                        item = item.slice(7)
                        result.source.add(item);
                        continue;
                    }
                }
                if (item.startsWith("target:")) {
                    if (triType !== "global") {
                        item = item.slice(7);
                        result.target.add(item);
                        continue;
                    }
                }
                if (item.startsWith("player:")) {
                    if (triType !== "global") {
                        item = item.slice(7)
                        result.player.add(item);
                        continue;
                    }
                }
                if (item.startsWith("global:")) {
                    item = item.slice(7)
                    result.global.add(item);
                    continue;
                }
                result[triType].add(item);
            }
        }
        for (const triType of ["player", "source", "target", "global"]) {
            result[triType] = result[triType].map(item => {
                if (!item.includes(":")) return item;
                const [triggername, ...filterList] = item.split(":").reverse();
                const filterParts = [];
                for (const filter of filterList) {
                    if (filter in lib.card) {
                        filterParts.push(`name=${filter}`)
                    } else if (suit.includes(filter)) {
                        filterParts.push(`suit=${filter}`);
                    } else if (nature.includes(filter)) {
                        filterParts.push(`nature=${filter}`);
                    } else if (color.includes(filter)) {
                        filterParts.push(`color=${filter}`);
                    } else if (number.includes(Number(filter))) {
                        filterParts.push(`number=${Number(filter)}`);
                    } else if (type.includes(filter)) {
                        filterParts.push(`type=${filter}`);
                    } else if (subtype.includes(filter)) {
                        filterParts.push(`subtype=${filter}`);
                    } else if (position.includes(filter)) {
                        filterParts.push(`position=${filter}`);
                    } else if (filter.startsWith("getIndex=")) {
                        getIndexMap[triType].push(triggername);
                    } else if (/^\w+=[\w\d]+$/.test(filter)) {
                        filterParts.push(filter);
                    } else {
                        filterParts.push(`unknown=${filter}`)
                    }
                }
                if (!triFilterMap[triType][triggername]) triFilterMap[triType][triggername] = filterParts.join("&");
                else triFilterMap[triType][triggername] += '&' + filterParts.join("&")
                return triggername;
            }).toUniqued();
        }
        for (const triName in triFilterMap.global) {
            ["player", "source", "target"].forEach(triType => {
                if (triName in triFilterMap[triType]) triFilterMap[triType][triName] += '&' + triFilterMap.global[triName]
            })
        }
        const triLength = result.player.length + result.target.length + result.global.length + result.source.length;
        const loseEvts = [...result.player, ...result.target, ...result.global, ...result.source].filter(triName => testLoseRegExp.test(triName));
        return [result, triFilterMap, triLength, loseEvts, getIndexMap]
    };
    static triLimitUrl(search) {
        const result = {}
        for (const [attr, value] of new URLSearchParams(search)) {
            if (!result[attr]) result[attr] = [];
            if (["number", "unknown", 'position'].includes(attr)) result[attr].push(value)
            else result[attr].push(`"${value}"`)
        };
        return result;
    }
}
