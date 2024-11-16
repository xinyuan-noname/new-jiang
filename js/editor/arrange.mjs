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
import { getLineRangeOfInput, moveWordToEnd, pointInWhichLine } from "../tool/string.js";
const matchNotObjColon = /(?<!\{[ \w"']+):(?![ \w"']+\})/;
export class EditorArrange {
    static transCnCalculation(that) {
        for (let i = 10; i > 0; i--) {
            that.changeWord("加" + get.cnNumber(i), "+" + i);
            that.changeWord("减" + get.cnNumber(i), "-" + i);
            that.changeWord("乘" + get.cnNumber(i), "*" + i);
            that.changeWord("乘以" + get.cnNumber(i), "*" + i);
            that.changeWord("加" + (i), "+" + i);
            that.changeWord("减" + (i), "-" + i);
            that.changeWord("乘" + (i), "*" + i);
            that.changeWord("乘以" + (i), "*" + i);
            that.changeWord("*" + get.cnNumber(i), "*" + i);
            that.changeWord("+" + get.cnNumber(i), "+" + i);
            that.changeWord("-" + get.cnNumber(i), "-" + i);
        }
    }
    static makeWordsToEnd(that, words, judge) {
        for (const word of words) {
            that.value = moveWordToEnd(that.value, word, " ", judge);
        }
    }
    static makeNumToEnd(that) {
        for (let i = 10; i >= 1; i--) {
            that.value = moveWordToEnd(that.value, i + '张', " ");
            that.value = moveWordToEnd(that.value, get.cnNumber(i) + '张', " ");
            that.value = moveWordToEnd(that.value, i + '点', " ");
            that.value = moveWordToEnd(that.value, get.cnNumber(i) + '点', " ");
            that.value = moveWordToEnd(that.value, i + '名', " ");
            that.value = moveWordToEnd(that.value, get.cnNumber(i) + '名', " ");
            that.value = moveWordToEnd(that.value, i + '枚', " ");
            that.value = moveWordToEnd(that.value, get.cnNumber(i) + '枚', " ");
        }
        "bcdefghlmnoprstuvwxyz".split('').forEach(i => {
            that.value = moveWordToEnd(that.value, i + '点', " ");
            that.value = moveWordToEnd(that.value, i.toUpperCase() + '点', " ");
            that.value = moveWordToEnd(that.value, i + '名', " ");
            that.value = moveWordToEnd(that.value, i.toUpperCase() + '名', " ");
            that.value = moveWordToEnd(that.value, i + '张', " ");
            that.value = moveWordToEnd(that.value, i.toUpperCase() + '张', " ");
            that.value = moveWordToEnd(that.value, i + '枚', " ");
            that.value = moveWordToEnd(that.value, i.toUpperCase() + '枚', " ");
        });
    }
    static makeOtherToEnd(that) {
        that.value = moveWordToEnd(that.value, "其他", " ", (p1, p2, p3) => {
            if (/.势力角色/.test(p3)) return false;
            if (/[男女双]性角色/.test(p3)) return false;
            return true;
        });
    }
    static makeOccupyLine(that, words) {
        that.changeWord(new RegExp(`(?<!\n)(${words.join("|")})`,"g"), '\n$1');
        that.changeWord(new RegExp(`(${words.join("|")})(?!\n)`,"g"), '$1\n');
    }
}