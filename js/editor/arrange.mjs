import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
import { moveWordToEnd } from "../tool/string.js";
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
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])张(.*?)$/img,"$1$3 $2张")
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])点(.*?)$/img,"$1$3 $2点")
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])名(.*?)$/img,"$1$3 $2名")
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])枚(.*?)$/img,"$1$3 $2枚")
    }
    static makeOtherToEnd(that) {
        that.value = moveWordToEnd(that.value, "其他", " ", (p1, p2, p3) => {
            if (/.势力角色/.test(p3)) return false;
            if (/[男女双]性角色/.test(p3)) return false;
            return true;
        });
    }
    static makeOccupyLine(that, words) {
        that.changeWord(new RegExp(`(?<!\n)(${words.join("|")})`, "g"), '\n$1');
        that.changeWord(new RegExp(`(${words.join("|")})(?!\n)`, "g"), '$1\n');
    }
}