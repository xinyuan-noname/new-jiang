import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
import { moveWordToEnd } from "../tool/string.js";
import { textareaTool } from "../tool/ui.js";
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
    static makeNumToEnd_zhang(that) {
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])张(.*?)$/img, "$1$3 $2张")
    }
    static makeNumToEnd_dian(that) {
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])点(.*?)$/img, "$1$3 $2点")
    }
    static makeNumToEnd_ming(that) {
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])名(.*?)$/img, "$1$3 $2名")
    }
    static makeNumToEnd_mei(that) {
        that.value = that.value.replace(/^(.*?)((?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)到(?:[bcdefghlmnoprstuvwxyz]|\d+|[一两二三四五六七八九十]+)|\d+|[一两二三四五六七八九十]+|[bcdefghlmnoprstuvwxyz])枚(.*?)$/img, "$1$3 $2枚")
    }
    static makeNumToEnd(that) {
        EditorArrange.makeNumToEnd_zhang(that)
        EditorArrange.makeNumToEnd_dian(that)
        EditorArrange.makeNumToEnd_ming(that)
        EditorArrange.makeNumToEnd_mei(that)
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


    static standardBoolExp(that) {
        that.value = that.value
            .replace(/(?<!游戏 统计)场上势力数/g, '游戏 统计场上势力数')
            .replace(/^(.+?)[ ]*性别(相同|不同)于(.+?)$/mg, "$1 性别$2于 $3")
            .replace(/(?<=有标记)(?![ ])/g, ' ')
            .replace(/(".+?")标记的?数量/g, '统计标记 $1\n')
            .replace(/(手牌|装备|判定)区[内中]有牌/g, '$1区有牌')
            .replace(/拥?有空置?的?(.+?)栏/g, "有空置的$1栏")
            .replace(/(此|本次|本)?事件(不?是)[由因]?你(造成的|而起)/, '触发事件的来源\n并且\n触发事件的来源 $2 你')
            .replace(/此牌(不?[是为])你使用的/g, '使用此牌的角色 $1 你')
            .replace(/此牌(为|是)其他角色使用的/g, '使用此牌的角色 不为 你')
            .replace(/(.+?)是此牌的目标/g, "此牌的目标包含 $1")
            .replace(/(.+?)在(.+?)的?攻击范围内$/mg, "$2 攻击范围内有 $1")
            .replace(/(没有)(.+?)标签/mg, "无$2标签")
            .replace(/(.+?)(有|无|带|不带)(伤害|多角色|多目标)标签/g, function (match, ...p) {
                if (p[0].includes("获取")) return match
                return `获取 ${p[1]}${p[2]}标签 ${p[0]}`
            })
            .replace(/(选择使用)一张(手?牌)/g, '$1$2')
            .replace(/[上拥]?有父事件[ ]*["']?(.+?)["']?$/mg, '获取名为$1的父事件的名字  不为 undefined')
            .replace(/^(.+?)本回合未对(.+?)造成过?伤害$/mg, '$1 本回合对角色造成伤害的次数 $2\n等于\n0')
            .replace(/本回合的?出牌阶段(使用|打出)([^卡牌]+?)的?次数$/mg, "本回合出牌阶段$1某牌的次数 $2")
            .replace(/本回合的?出牌阶段(使用|打出)过([^卡牌]+?)$/mg, "本回合出牌阶段$1某牌的次数 $2\n大于\n0")
            .replace(/本回合的?出牌阶段(没有|未)(使用|打出)过([^卡牌]+?)$/mg, "本回合出牌阶段$2某牌的次数 $3\n等于\n0")
        that.value = that.value
            .replace(/(不?)(大于|小于|是|等于)/g, " $1$2 ")
            .replace(/不为/g, ' 不为 ')
            .replace(/的一半/g, ' 除以 2')
            .replace(/的三分之一/g, ' 除以 3')
            .replace(/的四分之一/g, ' 除以 4')
            .replace(/的八分之一/g, ' 除以 8')
    }
}