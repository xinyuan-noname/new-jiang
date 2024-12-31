import { lib } from "../../../../noname.js";

const suit = ['club', 'spade', 'diamond', 'heart', 'none'];
const color = ['red', 'black'];
const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const type = ["basic", "equip", "trick", "delay"];
const subtype = ["equip1", "equip2", "equip3", "equip4", "equip5"];
const position = "hejxs"
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
        //sort 注意这里不会判断一点从而判断getIndex 这需要搭配后续的一些处理
        //添加受到一点伤害/获得/摸一张牌的判断函数
        for (const line of lines) {
            if (line.includes("roundStart")) {
                line.remove("roundStart");
                result.global.push("roundStart");
            }
            if (!line.length) continue;
            let [type] = line;
            if (type in result) line.remove(type)
            else type = "player";
            for (let item of line) {
                if (item === "damageSource") {
                    if (type !== "global") {
                        result.source.push(item);
                        continue;
                    }
                }
                if (item.startsWith("source:")) {
                    item = item.slice(7)
                    if (type !== "global") {
                        result.source.push(item);
                        continue;
                    }
                }
                if (item.startsWith("target:")) {
                    item = item.slice(7);
                    if (type !== "global") {
                        result.target.push(item);
                        continue;
                    }
                }
                if (item.startsWith("player:")) {
                    item = item.slice(7)
                    if (type !== "global") {
                        result.player.push(item);
                        continue;
                    }
                }
                if (item.startsWith("global:")) {
                    item = item.slice(7)
                    result.global.push(item);
                    continue;
                }
                result[type].push(item);
            }
        }
        for (const type of ["player", "source", "target", "global"]) {
            result[type] = result[type].map(item => {
                if (!item.includes(":")) return item;
                const [triggername, ...filterList] = item.split(":").reverse();
                const filterParts = [];
                for (const filter of filterList) {
                    if (filter in lib.card) {
                        filterParts.push(`name=${filter}`)
                    } else if (suit.includes(filter)) {
                        filterParts.push(`suit=${filter}`);
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
                    } else {
                        filterParts.push(`unkonwn=${filter}`)
                    }
                }
                if (!triFilterMap[type][triggername]) triFilterMap[type][triggername] = [];
                triFilterMap[type][triggername].push(filterList.join("&"));
                return triggername;
            }).toUniqued();
        }
        return [result, triFilterMap]
    };
}
