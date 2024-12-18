import {
    lib,
    game,
    ui,
    get,
    _status
} from "../../../noname.js"
import {
    findPrefix,
    addPSFix,
    adjustTab,
} from "./tool/string.js";
import {
    textareaTool
} from './tool/ui.js'
import {
    editorInbuiltSkillMap
} from './editor/skill.js'
import { EditorOrganize } from "./editor/organize.mjs";
export const playerList = {
    '你': 'player',
    '目标': 'target',
    '玩家': 'game.me',
    '主公': 'game.zhu',
    '当前回合角色': '_status.currentPhase',
    '触发事件的角色': 'trigger.player',
    '触发事件的来源': 'trigger.source',
    '触发事件的目标': 'trigger.target',
    '伤害来源': 'trigger.source',
    '受伤角色': 'trigger.player',
    '受到伤害的角色': 'trigger.player',
    '使用此牌的角色': "trigger.player",
    '此牌的目标': "trigger.target",
    '事件的目标': "event.target"
}
const phaseList = {
    "回合": "phase",
    "准备阶段": "phaseZhunbei",
    "出牌阶段": "phaseUse",
    "结束阶段": "phaseJieShu",
    "判定阶段": "phaseJudge",
    "弃牌阶段": "phaseDiscard",
    "摸牌阶段": "phaseDraw",
}
const eventList = {
    ...phaseList,
    //
    '摸牌': 'draw',
    "判定牌生效": "judge",
    "响应牌": "respond",
    "打出牌": "respond",
    "使用牌": "useCard",
    '弃置牌': 'discard',
    '获得牌': 'gain',
    '失去牌': 'lose',
    '牌置入装备区': 'equip',
    '牌置入判定区': 'addJudge',
    '置于武将牌上': 'addToExpansion',
    '置于武将牌旁': 'addToExpansion',
    '将牌置于武将牌上': 'addToExpansion',
    '将牌置于武将牌旁': 'addToExpansion',
    //
    /*恢复体力(值)*/
    "回复体力": "recover",
    "回复体力值": "recover",
    '受伤': 'damage',
    "受到伤害": "damage",
    '失去体力': 'loseHp',
    '失去体力值': "loseHp",
    '失去体力上限': 'loseMaxHp',
    '减少体力上限': 'loseMaxHp',
    '增加体力上限': 'gainMaxHp',
    '获得体力上限': 'gainMaxHp',
    //
    '横置或重置': 'link',
    '翻面': 'turnOver',
    '武将牌翻面': 'turnOver',
    '死亡': 'die'
}
const cardNameList = (() => {
    return [].concat(...lib.config.cards.map(name => lib.cardPack[name]))
})();
const cardTypeList = (() => {
    return ['basic', 'equip', 'delay', ...Object.keys(lib.cardType)]
})();
function getMapOfOneOfPlayers() {
    const map = {}
    for (let i = 0; i < 10; i++) {
        map[`第${get.cnNumber(i + 1)}个所选角色`] = `result.targets[${i}]`;
        map[`目标组-${i}`] = `targets[${i}]`;
    }
    return map
}
function getMapOfCard(bool = true) {
    const idList = cardNameList
    const map = {};
    for (let k of idList) {
        map[lib.translate[k]] = `${bool ? '"' : ""}${k}${bool ? '"' : ""}`;
    }
    return map;
}
function getMapOfSuit(bool = true) {
    const idList = lib.suit
    const map = {};
    for (let k of idList) {
        map[lib.translate[k + "2"]] = `${bool ? '"' : ""}${k}${bool ? '"' : ""}`;
    }
    return map;
}
function getMapOfColor(bool = true) {
    const idList = Object.keys(lib.color)
    const map = {};
    for (let k of idList) {
        map[lib.translate[k]] = `${bool ? '"' : ""}${k}${bool ? '"' : ""}`;
    }
    return map;
}
function getMapOfType(bool = true) {
    const idList = cardTypeList;
    const map = {};
    for (let k of idList) {
        map[lib.translate[k] + '牌'] = `${bool ? '"' : ""}${k}${bool ? '"' : ""}`;
    }
    if (bool) map['普通锦囊牌'] = '"trick"'
    else map['普通锦囊牌'] = 'trick'
    return map;
}
function getMapOfGroup(bool = true) {
    const idList = lib.group;
    const map = {};
    for (let k of idList) {
        map[lib.translate[k] + ""] = `${bool ? '"' : ""}${k}${bool ? '"' : ""}`;
        map[lib.translate[k] + "势力"] = `${bool ? '"' : ""}${k}${bool ? '"' : ""}`;
    }
    return map;
}
function getMapOfColorCard() {
    const map = {};
    for (let [cn, attr] of Object.entries({ ...getMapOfColor(false), ...getMapOfSuit(false) })) {
        map[cn + "牌"] = `${attr}`;
    }
    return map;
}

function getMapOfgetParent() {
    const list = {}
    for (let [i, k] of Object.entries(eventList)) {
        list['获取名为' + i + '的父事件'] = 'getParent:"' + k + '"'
        list['获取名为' + i + '的父事件的名字'] = 'getParent:"' + k + '"://!?name'
    }
    return list
}
function getMapOfTrigger() {
    const list = {}
    let event = {
        ...eventList,
        "获得技能": "addSkills",
        "失去技能": "removeSkills",
    };
    for (let [i, k] of Object.entries(event)) {
        list[i + "前"] = k + "Before"
        list[i + "开始"] = k + "Begin"
        if (["回合"].includes(i)) list[i + "时"] = k + "Begin"
        list[i + "结束"] = k + "End"
        list[i + "后"] = k + "After"
        list[i + "结算后"] = k + "After"
        list["令一名角色" + i + "时"] = "source:" + k + "Begin"
        list["令一名角色" + i + "结束"] = "source:" + k + "End"
        list["令一名角色" + i + "前"] = "source:" + k + "Before"
        list["令一名角色" + i + "后"] = "source:" + k + "After"
    }
    list["失去手牌后"] = "loseAfter:h";
    return list
}
function getMapOfTri_Target() {
    const map = {}
    for (let [cn, attr] of Object.entries({ ...getMapOfCard(false), ...getMapOfColorCard() })) {
        map["成为" + cn + '的目标时'] = 'target:' + attr + ':' + 'useCardToTarget';
        map["成为" + cn + '的目标后'] = 'target:' + attr + ':' + 'useCardToTargeted';
        map["使用" + cn + '指定目标时'] = 'player:' + attr + ':' + 'useCardToPlayer';
        map["使用" + cn + '指定目标后'] = 'player:' + attr + ':' + 'useCardToPlayered';
    }
    return map;
}
function getMapOfTri_Use() {
    const map = {}
    for (let [cn, attr] of Object.entries({ ...getMapOfCard(false), ...getMapOfColorCard() })) {
        map["使用" + cn + '前'] = attr + ':' + 'useCardBefore';
        map["使用" + cn + '时'] = attr + ':' + 'useCardBegin';
        map["使用" + cn] = attr + ':' + 'useCard';
        map["使用" + cn + '后'] = attr + ':' + 'useCardAfter';

    }
    return map;
}
function getMapOfWhen() {
    const map = {}
    for (let [cn, en] of Object.entries(eventList)) {
        map["于下次" + cn + "前"] = `when;{player:"${en}Before"}`
        map["于下次" + cn + "时"] = `when;{player:"${en}Begin"}`
        map["于下次" + cn + "后"] = `when;{player:"${en}End"}`
        map["于下次" + cn + "结算后"] = `when;{player:"${en}After"}`
    }
    return map;
}

function getMapOfHasCard() {
    const idList = cardNameList
    const map = {};
    for (let k of idList) {
        //这里不加intoFunction标志,表明不能向其中添加参数
        map["有" + lib.translate[k]] = `hasCard:"${k}":"hes"`;
        map["判定区内有" + lib.translate[k]] = `hasCard:"${k}":"j"`;
        map["手牌区内有" + lib.translate[k]] = `hasCard:"${k}"`;
        map["装备区内有" + lib.translate[k]] = `hasCard:"${k}":"e"`;
    }
    return map;
}
function getMapOfHasType() {
    const idList = cardTypeList
    const map = {
        "有普通锦囊牌": `hasCard;{type:"trick"};"hes"`,
        "判定区内有普通锦囊牌": `hasCard;{type:"trick"};"j"`,
        "手牌区内有普通锦囊牌": `hasCard;{type:"trick"}`,
        "装备区内有普通锦囊牌": `hasCard;{type:"trick"};"e"`
    };
    for (let k of idList) {
        //这里不加intoFunction标志,表明不能向其中添加参数
        map["有" + lib.translate[k] + "牌"] = `hasCard;"hes";{type:"${k}"}`;
        map["判定区内有" + lib.translate[k] + "牌"] = `hasCard;{type:"${k}"};"j"`;
        map["手牌区内有" + lib.translate[k] + "牌"] = `hasCard;{type:"${k}"}`;
        map["装备区内有" + lib.translate[k] + "牌"] = `hasCard;{type:"${k}"};"e"`;
    }
    return map;
}
function getMapOfCanAddJudge() {
    const idList = cardNameList.filter(card => get.type(card) === 'delay')
    const map = {};
    for (let k of idList) {
        map["可以被贴上" + lib.translate[k]] = `canAddJudge;"${k}"`;
    }
    return map;
}
function getMapOfChangeGroup() {
    const map = {};
    for (let [cn, attr] of Object.entries(getMapOfGroup())) {
        map["将势力改为" + cn] = `changeGroup;${attr}`;
    }
    return map;
}
function getMapOfStep() {
    const map = {}
    for (let i = 0; i < 100; i++) {
        map["步骤" + i] = '"step ' + i + '"'
        map["步骤" + get.cnNumber(i)] = '"step ' + i + '"'
        map["第" + i + "步"] = '"step ' + i + '"'
        map["第" + get.cnNumber(i) + "步"] = '"step ' + i + '"'
        map["跳至第" + i + "步"] = `event.goto(${i})`
        map["跳至第" + get.cnNumber(i) + "步"] = `event.goto(${i})`
    }
    return map
}
function getMapOfQuan() {
    const map = {}
    for (let i = 1; i < 10; i++) {
        map[i + "张"] = '' + i
        map[get.cnNumber(i) + "张"] = '' + i
        map[i + "名"] = '' + i
        map[get.cnNumber(i) + "名"] = '' + i
        map[i + "点"] = '' + i
        map[get.cnNumber(i) + "点"] = '' + i
        map[i + "枚"] = '' + i
        map[get.cnNumber(i) + "枚"] = '' + i
    }
    for (let i of "bcdfghlmnoprstuvwxyz") {
        map[i + '点'] = i
        map[i.toUpperCase() + '点'] = i.toUpperCase()
        map[i + '张'] = i
        map[i.toUpperCase() + '张'] = i.toUpperCase()
        map[i + '名'] = i
        map[i.toUpperCase() + '名'] = i.toUpperCase()
        map[i + '枚'] = i
        map[i.toUpperCase() + '枚'] = i.toUpperCase()
    }
    return map;
}
function getMapOfRandomNum() {
    const map = {}
    const list = new Array(11).fill().map((_, k) => k);
    for (let i = 0; i < 11; i++) {
        for (let a = 10; a > i; a--) {
            map[`${i}到${a}`] = `new Array(${list.slice(i, a + 1)}).randomGet()`
        }
    }
    return map;
}
function getMapOfUSeVcard() {
    const map = {}
    for (const [cn, en] of Object.entries(getMapOfCard())) {
        map[`视为使用${cn}`] = `useCard;{name:${en},isCard:true};intoFunction`
        map[`选择对角色使用${cn}`] = `chooseUseTarget;{name:${en},isCard:true};intoFunction`
    }
    return map
}
function getMapOfActionHistory() {
    const list = [
        ["使用牌", "useCard"],
        ["打出牌", "respond"],
        ["跳过阶段", "skipped"],
        ["获得牌", "gain"],
        ["失去牌", "lose"],
        ["造成伤害", "sourceDamage"],
        ["受到伤害", "damage"],
        ["使用技能", "useSkill"]
    ]
    const map = {
        "本回合的出牌阶段使用牌次数": `getHistory;"useCard";evt=>evt.isPhaseUsing()`,
        "本回合的出牌阶段打出牌次数": `getHistory;"respond";evt=>evt.isPhaseUsing()`,
        '本回合造成伤害点数': `getHistory;"sourceDamage";//!?reduce((acc,cur)=>acc+cur.num,0)`,
        '本回合造成的伤害点数': `getHistory;"sourceDamage";//!?reduce((acc,cur)=>acc+cur.num,0)`,
        '本回合造成伤害的点数': `getHistory;"sourceDamage";//!?reduce((acc,cur)=>acc+cur.num,0)`
    }
    for (const [cn, en] of list) {
        map[`本回合${cn}次数`] = `getHistory;"${en}";//!?length`;
        map[`获取本回合${cn}事件`] = `getHistory;"${en}"`;
        map[`本局游戏${cn}次数`] = `getAllHistory;"${en}";//!?length`
        map[`获取本局游戏${cn}事件`] = `getAllHistory;"${en}"`
    }
    return map;
}
function getMapAboutCard() {
    const map = {}
    const CardMission = {
        /**
         * @description According  to the attribute , set translation for getting card from the cardPile
         * @param {String} attributeValue such as 'sha'(name),"red"(color)
         * @param {String} attributeKey such as "name","color"
         * @param {String} cn attributeValue in Chinese
         */
        cardPile: (attributeValue, attributeKey, cn) => {
            map["牌堆中" + cn] = `cardPile2: card => get.${attributeKey}(card, false) === "${attributeValue}":intoFunction`
        },
        /**
         * @description According  to the attribute , set translation for getting card from the discardPile 
         * @param {String} attributeValue such as 'sha'(name),"red"(color)
         * @param {String} attributeKey such as "name","color"
         * @param {String} cn attributeValue in Chinese
         */
        discardPile: (attributeValue, attributeKey, cn) => {
            map["弃牌堆中" + cn] = `discardPile: card => get.${attributeKey}(card, false) === "${attributeValue}":intoFunction`
        },
        /**
         * @description According  to the attribute , set translation for a player's using card times in a phase up to that time
         * @param {String} attribute id
         * @param {String} cn attribute in Chinese
         */
        usedTimes: (attribute, cn) => {
            map[cn + '的出牌阶段使用次数'] = "getStat://!?card://!?" + attribute
        },
        hasCard: (attributeValue, attributeKey, cn) => {
            map['有' + cn] = `hasCard:{${attributeKey}:"${attributeValue}"}:"he"`
        }
    }
    cardNameList.forEach(i => {
        const cardTranslate = lib.translate[i];
        const cardId = i;
        CardMission.cardPile(cardId, 'name', cardTranslate);
        CardMission.discardPile(cardId, 'name', cardTranslate);
        CardMission.usedTimes(cardId, cardTranslate);
    })
    lib.suits.forEach(i => {
        const suit = i, suitTranslate = lib.translate[i + '2'] + "牌"
        CardMission.cardPile(suit, 'suit', suitTranslate)
        CardMission.discardPile(suit, 'suit', suitTranslate)
        CardMission.hasCard(suit, 'suit', suitTranslate)
    })
    Object.keys(lib.color).forEach(i => {
        const color = i, colorTranslate = lib.translate[i] + "牌"
        const args = [color, 'color', colorTranslate]
        CardMission.cardPile(...args)
        CardMission.discardPile(...args)
        CardMission.hasCard(...args)
    })
    for (let i = 1; i < 14; i++) {
        map["牌堆中牌点数为" + get.strNumber(i)] = `cardPile2: card => get.number(card, false) === "${i}":intoFunction`
        map["弃牌堆中牌点数为" + get.strNumber(i)] = `discardPile: card => get.number(card, false) === "${i}":intoFunction`
    }
    return map
};
function getMapOfOneOfTriCards() {
    const map = {}
    for (let i = 0; i < 10; i++) {
        map['触发事件的牌组-' + i] = `trigger.cards[${i}]`
    }
    return map
}
function getMapOfOneOfSelectedCards() {
    const map = {}
    for (let i = 0; i < 10; i++) {
        const part = '第' + get.cnNumber(i + 1) + "张牌";
        map['目前选择的' + part] =
            map['当前选择的' + part] =
            map['当前选择的卡牌-' + i] =
            map['目前选择的牌组-' + i] =
            `ui.selected.cards[${i}]`
    }
    return map
}
export class NonameCN {
    static playerCN = [
        "你", "玩家",
        "当前回合角色",
        ...new Array(10).fill('所选角色').map((item, index) => '第' + get.cnNumber(index) + '个' + item),
        "所选角色",
        "所有角色",
        "伤害来源", "受伤角色",
        "触发事件的角色", "触发事件的来源",
        "触发事件的目标组",
        "触发事件的目标",
        "事件的目标组",
        "事件的目标",
        ...new Array(10).fill('目标组-').map((item, index) => item + index),
        "目标组",
        "目标"
    ]
    static backSkillMap = {
        mode: 'self',
        id: 'xxx',
        kind: '',
        type: [],
        filter: [],
        /*
        jianxiong-gain:用来确保获得的为实体牌而且处于处理区 
        viewAs:用来确保技能类别为视为类技能  
        moreViewAs:表示视为类技能不止一个
        */
        boolList: [],
        /*
        group-*:用来设置势力技
        mainVice-remove1:用来设置移去阴阳鱼
        */
        uniqueList: [],
        filter_card: [],
        filter_suit: [],
        filter_color: [],
        variableArea_filter: [],
        variable_filter: new Map(),
        variable_content: new Map(),
        filterTarget: [],
        selectTarget: '',
        filterCard: [],
        selectCard: '',
        content: [],
        contentAsync: false,
        trigger: {
            player: [],
            source: [],
            global: [],
            target: []
        },
        respond: [],
        viewAsCondition: [],
        viewAsFrequency: [],
        viewAs: [],
        subSkill: {},
        group: [],
        uniqueTrigger: [],
        tri_filterCard: [],
        primarySkillCache: {
            skill: {},
            ele: {}
        },
        position: [],
        custom: {},
        content_ignoreIndex: [],
        filter_ignoreIndex: [],
        marktext: "",
        markName: "",
        markContent: "",
    }
    static editorInbuiltSkillMap = editorInbuiltSkillMap;
    static basicList = {
        '未定义': "undefined",
        "数学": "Math",
        //虚拟牌
        '虚拟牌': 'vCard',
        '虚拟牌0': 'vCard0',
        '虚拟牌1': 'vCard1',
        '虚拟牌2': 'vCard2',
        '虚拟牌3': 'vCard3',
        '虚拟牌4': 'vCard4',
        '虚拟牌5': 'vCard5',
        '虚拟牌6': 'vCard6',
        '虚拟牌7': 'vCard7',
        '虚拟牌8': 'vCard8',
        '虚拟牌9': 'vCard9',
        //get
        '名字': "name",
        '牌名': 'name',
        '卡牌': 'card',
        '牌组张数': "cards.length",
        '牌组长度': "cards.length",
        '牌组': "cards",
        '卡牌组': "cards",
        '花色': 'suit',
        '颜色': 'color',
        '属性': "nature",
        '类别': 'type',
        '广义类别': 'type2',
        '副类别': 'subtype',
        '拼音': 'pinyin',
        '韵母': 'yunmu',
        '韵脚': 'yunjiao',
        //
        '势力': "group",
        //
        '来源': 'source',
        //
        '新步骤': "'step'",
        //伤害事件
        '受到伤害点数': 'trigger.num',
        '受伤点数': 'trigger.num',
        '伤害点数': 'trigger.num',
        '伤害值': 'trigger.num',
        '造成伤害的牌': 'trigger.cards',
        '造成伤害的属性': 'trigger.nature',
        '伤害属性': 'trigger.nature',
        //
        '触发事件的点数': "trigger.num",
        '触发事件点数': "trigger.num",
        '当前回合序号': `trigger.getParent("phase",void 0,true).num`,
        //
        '获取': 'get',
        //
        '游戏': 'game',
        '轮数': 'roundNumber',
        //颜色和花色
        '红色': '"red"',
        '黑色': '"black"',
        '无色': '"none"',
        '梅花': '"club"',
        '方片': '"diamond"',
        '无花色': '"none"',
        '黑桃': '"spade"',
        '红桃': '"heart"',
        //装备栏
        '武器栏': '"equip1"',
        '防具栏': '"equip2"',
        '+1马栏': '"equip3"',
        '防御马栏': '"equip3"',
        '-1马栏': '"equip4"',
        '进攻马栏': '"equip3"',
        '坐骑栏': '"equip6"',
        '宝物栏': '"equip5"',
        //数字
        'A点': '1',
        'J点': '11',
        'Q点': '12',
        'K点': '13',
        '一': '1',
        '二': '2',
        '三': '3',
        '四': '4',
        '五': '5',
        '六': '6',
        '七': '7',
        '八': '8',
        '九': '9',
        '十': '10',
        //
        '有概率': 'Math.random()<=',
        //废除事件
        '废除一个武器栏': 'disableEquip:"equip1":intoFunction',
        '废除一个防具栏': 'disableEquip:"equip2":intoFunction',
        '废除一个+1马栏': 'disableEquip:"equip3":intoFunction',
        '废除一个-1马栏': 'disableEquip:"equip4":intoFunction',
        '废除一个防御马栏': 'disableEquip:"equip3":intoFunction',
        '废除一个进攻马栏': 'disableEquip:"equip4":intoFunction',
        '废除一个宝物栏': 'disableEquip:"equip5":intoFunction',
        '废除武器栏': 'disableEquip:"equip1":intoFunction',
        '废除防具栏': 'disableEquip:"equip2":intoFunction',
        '废除+1马栏': 'disableEquip:"equip3":intoFunction',
        '废除-1马栏': 'disableEquip:"equip4":intoFunction',
        '废除防御马栏': 'disableEquip:"equip3":intoFunction',
        '废除进攻马栏': 'disableEquip:"equip4":intoFunction',
        '废除宝物栏': 'disableEquip:"equip5":intoFunction',
        '任意张': '[1,Infinity]',
        '任意名': '[1,Infinity]',
        //固定值
        '其他': 'other',
        '至多': 'atMost',
        '至少': 'atLeast',
        '必须选': 'true',
        //关键字、运算符中文  
        '变量': 'var ',
        '常量': 'const ',
        '块级变量': 'let ',
        '块变': 'let ',
        //
        "等待": "await ",
        //
        '分岔': "switch ",
        '打断': "break;",
        '情况': "case ",
        '默认': "default ",
        //函数
        '异步': "async ",
        '函数': 'function',
        '参数表头': "(",
        '参数表尾': ")",
        '函数开始': "{",
        '函数结束': "}",
        '返回': 'return ',
        //布尔值
        '真': 'true',
        '假': 'false',
        '真值': 'true',
        '假值': 'false',
        //if-else类分支语句
        '如果': 'if(',
        '如果不': 'if(!',
        '若': 'if(',
        '那么': ')',
        '分支开始': '{',
        '分支结束': '}',
        '不': '!',
        '否则': 'else ',
        //数学
        '随机数': 'Math.random()',
        '圆周率': 'Math.PI',
        //      
        "；": ";",
        "：": ":",
        "【": "[",
        "】": "]",
        "【】": "[]",
        "！": "!",
        //
        '+': ' + ',
        '-': ' - ',
        '*': ' * ',
        '/': ' / ',
        '%': ' % ',
        '=': ' = ',
        '+=': " += ",
        '-=': " -= ",
        '*=': " *= ",
        '/=': " /= ",
        '**=': " **= ",
        '%=': " %= ",
        '<<=': " <<= ",
        '>>=': " >>= ",
        '>=': ' >= ',
        '<=': " <= ",
        '==': " == ",
        '===': " === ",
        '||': ' || ',
        '&&': ' && ',
        //关键字
        'else': 'else ',
        "switch": "switch ",
        'in': ' in ',
        'for(var': 'for(var ',
        'for(let': 'for(let ',
        'for(const': 'for(const ',
        'let': 'let ',
        'var': 'var ',
        'const': 'const ',
        'typeof': 'typeof ',
        'async': 'async ',
        'function': 'function ',
        'class': 'class ',
        'new': 'new ',
        'return': 'return ',
        'delete': 'delete ',
        'case': 'case ',
        'await': 'await ',
        "yield": 'yield ',
        "void": 'void ',
        "instanceof": " instanceof ",
        "of": " of ",
        "in": " in ",
        //
        "，": ',',
        //注释
        "父元素": "parentNode",
        "子元素": "children",
        "牌堆": "ui.cardPile",
        "弃牌堆": "ui.discardPile",
        "处理区": "ui.ordering",
        //
        "目前选择的卡牌的张数": "ui.selected.cards.length",
        "目前选择的目标的个数": "ui.selected.targets.length",
        "目前选择的按钮的个数": "ui.selected.buttons.length",
        "当前选择的卡牌的张数": "ui.selected.cards.length",
        "当前选择的目标的个数": "ui.selected.targets.length",
        "当前选择的按钮的个数": "ui.selected.buttons.length",
    }
    static freeQuotation = {
        cardName: getMapOfCard(false),
        type: getMapOfType(false),
        suit: getMapOfSuit(false),
        color: getMapOfColor(false),
        nature: {
            '火属性': 'fire',
            '雷属性': 'thunder',
            '冰属性': 'ice',
            "神属性": "kami"
        },
        gender: {
            "男性": `male`,
            "女性": `female`,
            "双性": 'double',
            "未知性": `unknow`
        },
        subtype: {
            "武器牌": "equip1",
            "防具牌": "equip2",
            "+1马牌": "equip3",
            "防御马牌": `equip3`,
            "-1马牌": `equip4`,
            "进攻马牌": `equip4`,
            "宝物牌": `equip5`,
        },
        eventName: eventList,
    }
    static groupedList = {
        translate: {
            "花费数据": "cost_data",
            '布尔': "bool",
        },
        uniqueArea: {
            '#判定回调区头': "<judgeCallback>",
            '#判定回调区尾': "</judgeCallback>",
            "#选择发动区头": "<cost>",
            "#选择发动区尾": "</cost>",
            '###############': " ",
        },
        custom: {
            //
            '牌堆中颜色不同牌': "info;\\skillID;//!?custom_researchCardsDif;true;'color';intoFunction",
            '牌堆中花色不同牌': "info;\\skillID;//!?custom_researchCardsDif;true;'suit';intoFunction",
            '牌堆中属性不同牌': "info;\\skillID;//!?custom_researchCardsDif;true;'nature';intoFunction",
            '牌堆中点数不同牌': "info;\\skillID;//!?custom_researchCardsDif;true;'number';intoFunction",
            '牌堆中牌名不同牌': "info;\\skillID;//!?custom_researchCardsDif;true;'name';intoFunction",
            '牌堆中类别不同牌': "info;\\skillID;//!?custom_researchCardsDif;true;'type2';intoFunction",
            '牌堆中副类别不同牌': "info;\\skillID;//!?custom_researchCaerdsDif;true;'subtype';intoFunction",
            //
            '弃牌堆中颜色不同牌': "info;\\skillID;//!?custom_researchCardsDif;false;'color';intoFunction",
            '弃牌堆中花色不同牌': "info;\\skillID;//!?custom_researchCardsDif;false;'suit';intoFunction",
            '弃牌堆中属性不同牌': "info;\\skillID;//!?custom_researchCardsDif;false;'nature';intoFunction",
            '弃牌堆中点数不同牌': "info;\\skillID;//!?custom_researchCardsDif;false;'number';intoFunction",
            '弃牌堆中牌名不同牌': "info;\\skillID;//!?custom_researchCardsDif;false;'name';intoFunction",
            '弃牌堆中类别不同牌': "info;\\skillID;//!?custom_researchCardsDif;false;'type2';intoFunction",
            '弃牌堆中副类别不同牌': "info;\\skillID;//!?custom_researchCaerdsDif;false;'subtype';intoFunction",
            //
            '当前选择卡牌颜色是否相同': "info;\\skillID;//!?custom_selectedIsSameCard;card;'color';intoFunction",
            '当前选择卡牌花色是否相同': "info;\\skillID;//!?custom_selectedIsSameCard;card;'suit';intoFunction",
            '当前选择卡牌属性是否相同': "info;\\skillID;//!?custom_selectedIsSameCard;card;'nature';intoFunction",
            '当前选择卡牌点数是否相同': "info;\\skillID;//!?custom_selectedIsSameCard;card;'number';intoFunction",
            '当前选择卡牌类别是否相同': "info;\\skillID;//!?custom_selectedIsSameCard;card;'type2';intoFunction",
            '当前选择卡牌副类别是否相同': "info;\\skillID;//!?custom_selectedIsSameCard;card;'subtype';intoFunction",
            //
            '当前选择卡牌颜色是否不同': "info;\\skillID;//!?custom_selectedIsDifCard;card;'color';intoFunction",
            '当前选择卡牌花色是否不同': "info;\\skillID;//!?custom_selectedIsDifCard;card;'suit';intoFunction",
            '当前选择卡牌属性是否不同': "info;\\skillID;//!?custom_selectedIsDifCard;card;'nature';intoFunction",
            '当前选择卡牌点数是否不同': "info;\\skillID;//!?custom_selectedIsDifCard;card;'number';intoFunction",
            '当前选择卡牌类别是否不同': "info;\\skillID;//!?custom_selectedIsDifCard;card;'type2';intoFunction",
            '当前选择卡牌副类别是否不同': "info;\\skillID;//!?custom_selectedIsDifCard;card;'subtype';intoFunction"
        },
        punctuation: {
            '访问': ".",
            '访': ".",
            '注释': '//',
            '单行注释': "//",
            //
            '自增': '++',
            '自减': '--',
            //比较算符
            '为': ' == ',
            '是': ' == ',
            '等于': ' == ',
            '相等于': ' == ',
            '真等于': ' === ',
            '严格等于': ' === ',
            '严格相等于': ' === ',
            '不是': ' != ',
            '不为': ' != ',
            '不等于': ' != ',
            '真不等于': ' !== ',
            '严格不等于': ' !== ',
            '大于': ' > ',
            '大于等于': ' >= ',
            '大等': " >= ",
            '不小于': ' >= ',
            '小于': ' < ',
            '小于等于': ' <= ',
            '小等': " <= ",
            '不大于': ' <= ',
            //普通运算
            '加': ' + ',
            '减': ' - ',
            '乘': ' * ',
            '乘以': ' * ',
            '除以': ' / ',
            '取模': ' % ',
            '模': ' % ',
            //位运算
            'AND': " & ",
            'OR': " | ",
            'NOT': " ~ ",
            'XOR': " ^ ",
            '位与': " & ",
            '位或': " | ",
            '位非': " ~ ",
            '异或': " ^ ",
            '位异或': " ^ ",
            '左移': "<<",
            '右移': ">>",
            //逻辑算符
            '或者': ' || ',
            "逻辑或": ' || ',
            '且': ' && ',
            '并且': ' && ',
            '逻辑且': " && ",
            '逻辑非': '!',
            //赋值语句
            '令为': ' = ',
            '加等': " += ",
            '减等': " -= ",
            '模等': " %= ",
            '除等': " /= ",
            '乘等': " *= ",
            '取模等': " %= ",
            '除以等': " /= ",
            '乘以等': " *= ",
            '位与等': " &= ",
            '位或等': " |= ",
            '位非等': " ~= ",
            '异或等': " ^= ",
            '左移等': " <<= ",
            '右移等': " >>= ",
            '逻辑或等': " ||= ",
            '逻辑且等': " &&= ",
        },
        staticValue: {
            "不可被无懈可击响应": `"nowuxie"`,
            "不计入次数": 'false',
            '强制发动': "true",
            '不影响ai': `"noai"`,
            '亮出式': '"gain2"',
            '隐藏式': '"draw"',
            '摸牌式': '"draw"',
            '给牌式': '"giveAuto"',
            '从牌堆底': '"bottom"',
            '牌堆底': '"bottom"',
            '无期': '"forever"',
        },
        array: {
            "无效的角色": `trigger.getParent("useCard",void 0,true).excluded`,
            "不可响应牌的角色": `trigger.getParent("useCard",void 0,true).directHit`,
            "无视此牌的目标防具的牌": `trigger.target.storage.qinggang2`,
            '此牌的目标组': `trigger.getParent("useCard",void 0,true).targets`,
            '此牌的已触发的目标组': `trigger.getParent("useCard",void 0,true).triggeredTargets2`,
            "阶段列表": `trigger.getParent("phase",void 0,true).phaseList`,
            "选项列表": "choiceList"
        },
        array_structure: {
            "数组开始": "[",
            "数组结束": "]",
        },
        array_method: {
            "包含": 'includes',
            "不包含": 'includes:denyPrefix',
            "添单": "add",
            "添多": "addArray",
            "剪接": "splice",
            "连接": "concat",
            "移除": "remove",
            "除组": "removeArray",
            "去重": "toUniqued",
            "随机抽单": "randomGet",
            "随机抽多": "randomGets",
            "长度": "length",
        },
        get_method: {
            "牌堆顶牌组": "cards",
            "牌堆底牌组": "bottomCards",
            "牌堆顶牌组(放回)": "cards:ture:intoFunctionWait",
            "牌堆底牌组(放回)": "bottomCards:ture:intoFunctionWait",
            "技能使用次数": "skillCount",
            //弃牌堆中
            '弃牌堆中普通锦囊牌': 'discardPile;card=>get.type(card)==="trick"',
            '弃牌堆中延时锦囊牌': 'discardPile;card=>get.type(card)==="delay"',
            '弃牌堆中基本牌': 'discardPile;card=>get.type(card)==="basic"',
            '弃牌堆中装备牌': 'discardPile:card=>get.type(card)==="equip"',
            '弃牌堆中宝物牌': 'discardPile:card=>get.subtype(card)=="equip5"',
            '弃牌堆中防具牌': 'discardPile:card=>get.subtype(card)=="equip2"',
            '弃牌堆中武器牌': 'discardPile:card=>get.subtype(card)=="equip1"',
            '弃牌堆中+1马牌': 'discardPile:card=>get.subtype(card)=="equip3"',
            '弃牌堆中-1马牌': 'discardPile:card=>get.subtype(card)=="equip4"',
            '弃牌堆中防御马牌': 'discardPile:card=>get.subtype(card)=="equip3"',
            '弃牌堆中进攻马牌': 'discardPile:card=>get.subtype(card)=="equip4"',
            '弃牌堆中伤害锦囊牌': 'discardPile:card=>get.type2(card)=="trick"&&get.tag(card,"damage")',
            '弃牌堆中牌颜色为红色': 'discardPile:card=>get.color(card)=="red"',
            '弃牌堆中牌颜色为黑色': 'discardPile:card=>get.color(card)=="black"',
            //牌堆中
            '牌堆中普通锦囊牌': 'cardPile2:card=>get.type(card)==="trick"',
            '牌堆中延时锦囊牌': 'cardPile2:card=>get.type(card)==="delay"',
            '牌堆中基本牌': 'cardPile2:card=>get.type(card)==="basic"',
            '牌堆中装备牌': 'cardPile2:card=>get.type(card)==="equip"',
            '牌堆中宝物牌': 'cardPile2:card=>get.subtype(card)=="equip5"',
            '牌堆中防具牌': 'cardPile2:card=>get.subtype(card)=="equip2"',
            '牌堆中武器牌': 'cardPile2:card=>get.subtype(card)=="equip1"',
            '牌堆中+1马牌': 'cardPile2:card=>get.subtype(card)=="equip3"',
            '牌堆中-1马牌': 'cardPile2:card=>get.subtype(card)=="equip4"',
            '牌堆中防御马牌': 'cardPile2:card=>get.subtype(card)=="equip3"',
            '牌堆中进攻马牌': 'cardPile2:card=>get.subtype(card)=="equip4"',
            '牌堆中伤害锦囊牌': 'cardPile2:card=>get.type2(card)=="trick"&&get.tag(card,"damage")',
            '牌堆中牌颜色为红色': 'cardPile2:card=>get.color(card)=="red"',
            '牌堆中牌颜色为黑色': 'cardPile2:card=>get.color(card)=="black"',
            //标签
            "有伤害标签": `tag:"damage":intoFunctionWait`,
            "无伤害标签": `tag:"damage":intoFunctionWait:denyPrefix`,
            "带伤害标签": `tag:"damage":intoFunctionWait`,
            "不带伤害标签": `tag:"damage":intoFunctionWait:denyPrefix`,
            "有多角色标签": `tag:"multitarget":intoFunctionWait`,
            "无多角色标签": `tag:"multitarget":intoFunctionWait:denyPrefix`,
            "带多角色标签": `tag:"damage":intoFunctionWait`,
            "不带多角色标签": `tag:"damage":intoFunctionWait:denyPrefix`,
            "有多目标标签": `tag:"multitarget":intoFunctionWait`,
            "无多目标标签": `tag:"multitarget":intoFunctionWait:denyPrefix`,
        },
        math: {
            ...getMapOfRandomNum()
        },
        math_method: {
            "最大值": "max",
            "最小值": "min",
            "绝对值": "abs",
            "正弦": "sin",
            "余弦": "cos",
            "保留整数": "trunc",
            "四舍五入": "round",
            "向下取整": "floor",
            "向上取整": "ceil"
        },
        cards: {
            "触发事件的牌组": "trigger.cards",
            "事件的牌组": "event.cards",
            "目前选择的牌组": "ui.selected.cards",
        },
        card: {
            ...getMapAboutCard(),
            ...getMapOfOneOfTriCards(),
            ...getMapOfOneOfSelectedCards(),
            "判定牌": "trigger.result.card",
            '触发事件的卡牌': "trigger.card",
        },
        card_attr: {
            "点数": "number",
            "不是转化牌": "isCard"
        },
        card_method: {
            "移除": "remove",
            "修正": "fix",
            "已销毁": "destroyed",
            "牌名相同于": "sameNameAs",
            "牌名不同于": "differentNameFrom",
            "花色相同于": "sameSuitAs",
            "花色不同于": "differentSuitFrom",
            "点数相同于": "sameNumberAs",
            "点数不同于": "differentNumberFrom",
        },
        result: {
            "事件结果": "event.result",
            "结果": "result",
            "有选择结果": "result.bool===true",
            "无选择结果": "result.bool===false",
            "选择结果布尔": "result.bool",
            "选择结果卡牌": "result.card",
            "选择结果牌组": "result.cards",
            "选择结果按钮": "result.links",
            "选择结果目标组": "result.targets",
            "选择结果牌数": "result.cards.length",
            "选择结果目标数": "result.targets.length",
            "选择结果按钮数": "result.button.length",
            "选择结果牌名": "result.name",
            "选择结果点数": "result.number",
            "选择结果颜色": "result.color",
            "选择结果花色": "result.suit",
            "选择结果选项编号": "result.choice",
            "选择结果选项": "result.control",
            //
            "没有选择卡牌": "result.bool===false",
            "没有选择角色": "result.bool===false",
            //
            '判定结果卡牌': "result.card",
            "判定结果牌名": "result.name",
            "判定结果点数": "result.number",
            "判定结果颜色": "result.color",
            "判定结果花色": "result.suit",
            //
            "议事结果": "result.opinion",
            //
            '拼点平局': "result.tie",
            '拼点平': "result.tie",
            '拼点没平': "result.tie",
            '拼点未平': "result.tie",
            '拼点胜': "result.bool",
            '拼点赢': "result.bool",
            '拼点没赢': "!result.bool",
            '拼点未赢': "!result.bool",
            '拼点输': "!result.bool && !result.tie",
            '拼点未输': "result.bool || result.tie",
            '拼点没输': "result.bool || result.tie",
        },
        staticStr_phase: {
            '准备阶段|\\-skillID': '"phaseZhunbei|\\-skillID"',
            '出牌阶段|\\-skillID': '"phaseUse|\\-skillID"',
            '结束阶段|\\-skillID': '"phaseJieShu|\\-skillID"',
            '判定阶段|\\-skillID': '"phaseJudge|\\-skillID"',
            '弃牌阶段|\\-skillID': '"phaseDiscard|\\-skillID"',
            '摸牌阶段|\\-skillID': '"phaseDraw|\\-skillID"'
        },
        player: {
            ...playerList,
            ...getMapOfOneOfPlayers(),
            '角色': "player",
            "有本技能的角色": `game.filterPlayer().find(cur=>cur.hasSkill(\\skillID,null,false,false))`,
            "有该技能的角色": `game.filterPlayer().find(cur=>cur.hasSkill(\\skillID,null,false,false))`,
            "有此技能的角色": `game.filterPlayer().find(cur=>cur.hasSkill(\\skillID,null,false,false))`,
        },
        player_attribute: {
            //
            '体力': 'hp',
            '体力值': 'hp',
            '体力上限': 'maxHp',
            '护甲': 'hujia',
            '护甲值': 'hujia',
            '剩余出局轮数': "outCount",
            '进行的回合数': "phaseNumber",
            '座位号': "getSeatNum:",
            //
            'id': 'name',
            '性别': 'sex',
            '身份': "identity",
            "势力": "group",
            //
            '储存': 'storage',
            '储存信息': 'storage',
            '存储': 'storage',
            '存储信息': 'storage',
        },
        player_method_hp: {
            '体力值为全场最少或之一': 'isMinHp',
            '体力值为全场最多或之一': 'isMaxHp',
            '有全场最少或之一的体力值': 'isMinHp',
            '有全场最多或之一的体力值': 'isMaxHp',
            '没有全场最少或之一的体力值': 'isMinHp:denyPrefix',
            '没有全场最多或之一的体力值': 'isMaxHp:denyPrefix',
            '有全场唯一最少的体力值': 'isMinHp;true',
            '有全场唯一最多的体力值': 'isMaxHp;true',
            '没有全场唯一最少的体力值': 'isMinHp;true:denyPrefix',
            '没有全场唯一最多的体力值': 'isMaxHp;true:denyPrefix',
            //
            '已损失的体力值': "getDamgedHp;",
            '已损失体力值': "getDamgedHp;",
            '已损体力值': "getDamgedHp;",
            '已失体力值': "getDamgedHp;",
        },
        player_method_handcard: {
            '手牌数为全场最少或之一': 'isMinHandcard',
            '手牌数为全场最多或之一': 'isMaxHandcard',
            '有全场最少或之一的手牌数': 'isMinHandcard',
            '有全场最多或之一的手牌数': 'isMaxHandcard',
            '有全场最少或之一的手牌数': 'isMinHandcard:denyPrefix',
            '有全场最多或之一的手牌数': 'isMaxHandcard:denyPrefix',
            '有全场唯一最少的手牌数': 'isMinHandcard;true',
            '有全场唯一最多的手牌数': 'isMaxHandcard;true',
            '没有全场唯一最少的手牌数': 'isMinHandcard;true:denyPrefix',
            '没有全场唯一最多的手牌数': 'isMaxHandcard;true:denyPrefix',
            "手牌上限": "getHandcardLimit;",
        },
        player_method_mark: {
            //标记类
            "标记数量": "countMark",
            '统计标记': "countMark",
            '获得标记': 'addMark',
            '增加标记': 'addMark',
            '移去标记': 'removeMark',
            '拥有标记': 'hasMark',
            '有标记': "hasMark",
            '清除标记': 'clearMark',
            '标记添加记录': 'markAuto',
            '标记移除记录': 'unmarkAuto',
            "有蓄力值": `hasMark:"charge"`,
            "没有蓄力值": `hasMark:"charge":denyPrefix`,
            "无蓄力值": `hasMark:"charge":denyPrefix`,
        },
        player_method_solt: {
            '有未被废除的装备栏': "hasEnabledSlot",
            '没有未被废除的装备栏': "hasEnabledSlot:denyPrefix",
            "装备栏均已废除": "hasEnabledSlot:denyPrefix",
            "装备栏均已被废除": "hasEnabledSlot:denyPrefix",
            "已废除的装备栏数量": "countDisabled;",
            "有空置的武器栏": "hasEmptySlot;1",
            "没有空置的武器栏": "hasEmptySlot;1;denyPrefix",
            "有空置的防具栏": "hasEmptySlot;2",
            "没有空置的防具栏": "hasEmptySlot;2;denyPrefix",
            "有空置的+1马栏": "hasEmptySlot;3",
            "没有空置的+1马栏": "hasEmptySlot;3;denyPrefix",
            "有空置的-1马栏": "hasEmptySlot;4",
            "没有空置的-1马栏": "hasEmptySlot;4;denyPrefix",
            "有空置的宝物栏": "hasEmptySlot;5",
            "没有空置的宝物栏": "hasEmptySlot;5;denyPrefix",
        },
        player_method_hasCard: {
            '有无懈': "hasWuxie",
            '有无懈可击': "hasWuxie",
            '有杀': "hasSha",
            '有闪': "hasShan",
            '有手牌': 'hasCard',
            '没有手牌': "hasCard:denyPrefix",
            '有牌': 'hasCard;void 0;"he"',
            '场上有牌': `hasCard;void 0;"ej"`,
            '区域内有牌': 'hasCard;void 0;"hej"',
            '装备区有牌': `hasCard;void 0;"e"`,
            '判定区有牌': `hasCard;void 0;"j"`,
            '手牌区有牌': `hasCard;void 0;"h"`,
            '没有牌': 'hasCard;void 0;"he";denyPrefix',
            '场上没有牌': `hasCard;void 0;"ej";denyPrefix`,
            '区域内没有牌': 'hasCard;void 0;"hej";denyPrefix',
            '装备区没有牌': `hasCard;void 0;"e";denyPrefix`,
            '判定区没有牌': `hasCard;void 0;"j";denyPrefix`,
            '手牌区没有牌': `hasCard;void 0;"h";denyPrefix`,
        },
        player_method_countCard: {
            '手牌数': 'countCards;"h"',
            '牌数': 'countCards;"he"',
            '场上牌数': `countCards;"ej"`,
            '区域内牌数': 'countCards;"hej"',
            '手牌区牌数': 'countCards;"h"',
            '装备区牌数': 'countCards;"e"',
            '判定区牌数': 'countCards;"j"',
            '可被获得的手牌数': "countGainableCards;'h';intoFunctionWait",
            '可被获得的牌数': "countGainableCards;'he';intoFunctionWait",
            '可被获得的区域内牌数': "countGainableCards;'hej';intoFunctionWait",
            '可被获得的手牌区的牌数': "countGainableCards;'h';intoFunctionwait",
            '可被获得的装备区的牌数': "countGainableCards;'e';intoFunctionWait",
            '可被获得的判定区的牌数': "countGainableCards;'j';intoFunctionWait",
        },
        player_method_phase: {
            '跳过阶段': "skip",
            '跳过下一个准备阶段': 'skip:"phaseZhunbei"',
            '跳过下一个出牌阶段': 'skip:"phaseUse"',
            '跳过下一个判定阶段': 'skip:"phaseJudge"',
            '跳过下一个弃牌阶段': 'skip:"phaseDiscard"',
            '跳过下一个摸牌阶段': 'skip:"phaseDraw"',
            '跳过下一个结束阶段': 'skip:"phaseJieShu"'
        },
        player_method: {
            "攻击范围内有": "inRange",
            '执行额外的回合': 'insertPhase',
            //判定区和装备栏
            '废除判定区': 'disableJudge',
            "摸牌或回复体力值": "chooseDrawRecover",
            //性别类
            "拥有性别": "hasSex",
            "属于性别": "hasSex",
            "有性别": "hasSex",
            "不属于性别": 'hasSex:denyPrefix',
            //体力类
            "将体力值回复至": "recoverTo",
            "体力值回复至": "recoverTo",
            '获得护甲': 'changeHujia',
            //
            '已受伤': 'isDamaged',
            '未受伤': 'isHealthy',
            '存活': 'isAlive',
            //牌类
            '给牌': "give",
            '给出牌': "give",
            '展示牌': "showCards",
            '随机获得牌': 'randomGain',
            '随机弃置手牌': 'randomDiscard',
            "获得多名角色手牌": `gainMultiple`,
            "获得多名角色指定区域的牌": `gainMultiple`,
            '移动场上牌': 'moveCard',
            "观看手牌": "viewHandcards",
            '将手牌补至': 'drawTo',
            '将手牌摸至': 'drawTo',
            '手牌补至': 'drawTo',
            '手牌摸至': 'drawTo',
            '丢弃至弃牌堆': "loseToDiscardpile",
            //
            '更新状态': "update",
            '更改势力': "changeGroup",
            //
            //宗族类
            "获取宗族": "getClans",
            "属于宗族": "hasClan",
            '获取判定区牌': 'getJudge',
            '获取装备区牌': 'getEquip',
            //回合类
            "处于自己的出牌阶段": "isPhaseUsing",
            //状态类
            '背面朝上': 'isTurnedOver',
            '正面朝上': 'isTurnedOver:denyPrefix',
            '武将牌背面朝上': 'isTurnedOver',
            '武将牌正面朝上': 'isTurnedOver:denyPrefix',
            '已横置': "isLinked",
            '未横置': "isLinked:denyPrefix",
            '已翻面': "isTurnedOver",
            '未翻面': "isTurnedOver:denyPrefix",
            '判定区已废除': 'isDisabledJudge',
            '判定区未废除': 'isDisabledJudge:denyPrefix',
        },
        player_method_skill: {
            //
            '失去所有技能': "clearSkills",
            '清除技能': "clearSkills",
            '添加技能': 'addSkill',
            '获得技能': 'addSkill',
            '失去技能': "removeSkill",
            '移除技能': "removeSkill",
            '添加技能并录入日志': 'addSkillLog',
            '获得技能并录入日志': 'addSkillLog',
            '移除技能并录入日志': "removeSkillLog",
            '失去技能并录入日志': "removeSkillLog",
            '拥有技能': 'hasSkill',
            '有技能': 'hasSkill',
            '记录技能为已发动': "awakenSkill",
            '重置技能': "restoreSkill",
            "更换技能": "changeSkills",
            '能够拼点': "canCompare",
            '获得技能(触发事件)': 'addSkill',
            '失去技能(触发事件)': "removeSkill",
            //
            "临时获得技能": "addTempSkill",
            "临时禁用技能": "tempBanSkill",
            //
            "本回合被破甲": `addTempSkill:"qinggang2"`,
            "本回合非锁定技失效": `addTempSkill:"fengyin"`,
            "获得技能直到下个出牌阶段结束": `addTempSkill;{player:"phaseUseEnd"}:intoFunctionWait`,
            "获得技能直到下个回合结束": `addTempSkill;{player:"phaseEnd"}:intoFunctionWait`,
            "获得技能直到下一轮开始时": `addTempSkill;"roundStart":intoFunctionWait`,
        },
        player_choose: {
            //
            "发起议事": "chooseToDebate",
            "发起拼点": "chooseToCompare",
            //
            '选择选项': "chooseControl",
            '选择带取消的选项': `chooseControl:"cancel2":intoFunction`,
            //
            '选择确认': "chooseBool",
            //
            '选择按钮': "chooseButton",
            '选择卡牌按钮': "chooseCardButton",
            //
            "选择对角色使用牌": "chooseUseTarget",
            "选择使用手牌": `chooseToUse`,
            "选择使用牌": `chooseToUse`,
            '选择牌': 'chooseCard:"he":intoFunction',
            '选择手牌': 'chooseCard',
            //
            '废除装备区内一个装备栏': 'chooseToDisable',
            '选择废除装备区内一个装备栏': 'chooseToDisable',
            '废除一个装备栏': 'chooseToDisable',
            '选择废除一个装备栏': 'chooseToDisable',
            '恢复装备区内一个装备栏': 'chooseToEnable',
            '选择恢复装备区内一个装备栏': 'chooseToEnable',
            '选择恢复一个装备栏': 'chooseToEnable',
            '恢复一个装备栏': 'chooseToEnable',
            '选择弃置牌': 'chooseToDiscard:"he":intoFunction',
            '选择弃置手牌': 'chooseToDiscard:"h":intoFunction',
            '选择弃牌': 'chooseToDiscard:"he":intoFunction',
            '选择弃手牌': 'chooseToDiscard:"h":intoFunction',
            '选择角色牌': 'choosePlayerCard:"he":intoFunction',
            '选择角色手牌': 'choosePlayerCard',
            '卜算': 'chooseToGuanxing',
            '选择角色': 'chooseTarget',
            '选择目标': 'chooseTarget',
            '判定': "judge",
            '进行判定': "judge",
            '进行一次判定': "judge",
            '选择牌和角色': "chooseCardTarget",
            '选择角色和牌': "chooseCardTarget",
            '选择牌拼点': "chooseToCompare",
            '拼点': "chooseToCompare",
        },
        player_withArg: {
            ...getMapOfHasCard(),
            ...getMapOfHasType(),
            ...getMapOfCanAddJudge(),
            ...getMapOfChangeGroup(),
            ...getMapOfUSeVcard(),
            //
            "播放判定生效动画": "tryJudgeAnimagte;true",
            "播放判定失效动画": "tryJudgeAnimagte;false",
            //
            "攻击范围": "getAttackRange;",
            //装备栏类
            //牌类事件      
            '随机弃置牌': 'randomDiscard;"he";intoFunction',
            '随机弃置装备区牌': 'randomDiscard;"e";intoFunction',
            '随机弃置手牌区牌': 'randomDiscard;"h";intoFunction',
            '弃置区域内所有牌': 'randomDiscard;"hej";Infinity',
            '获得角色区域内牌': 'gainPlayerCard;"hej";intoFunction',
            '弃置角色区域内牌': 'discardPlayerCard;"hej";intoFunction',
            '获得区域内牌': 'gainPlayerCard;"hej";intoFunction',
            '弃置区域内牌': 'discardPlayerCard;"hej";intoFunction',
            '获得角色牌': 'gainPlayerCard;"he";intoFunction',
            '弃置角色牌': 'discardPlayerCard;"he";intoFunction',
            '获得角色手牌': 'gainPlayerCard;"h";intoFunction',
            '弃置角色手牌': 'discardPlayerCard;"h";intoFunction',
            '隐式给牌': "give;false;intoFunctionWait",
            "获得多名角色牌": `gainMultiple;"he";intoFunctionWait`,
            '获取手牌区牌': 'getCards;"h"',
            '获取装备区牌': 'getCards;"e"',
            '获取判定区牌': 'getCards;"j"',
            '获取区域内牌': 'getCards;"hej"',
            '获取牌': 'getCards;"he"',
            '获取手牌': 'getCards;"h"',
            //历史类
            '获取本回合指定其他角色为目标的使用牌事件': "getHistory;'useCard';function(evt){return evt.targets.filter(current=>target!=player)}",
            '获取本回合指定其他角色为目标的打出牌事件': "getHistory;'respond';function(evt){return evt.targets.filter(current=>target!=player)}",
            ...getMapOfActionHistory(),
            '获取本回合失去牌的类型个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.type2(card)).toUniqued().length`,
            '获取本回合失去牌的颜色个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.color(card)).toUniqued().length`,
            '获取本回合失去牌的花色个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.suit(card)).toUniqued().length`,
            '获取本回合失去牌的点数个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.number(card)).toUniqued().length`,
            '获取本回合失去牌的副类别个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.subtype(card)).toUniqued().length`,
            '获取本回合失去牌的牌名个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.name(card)).toUniqued().length`,
            '获取本回合失去牌的属性个数': `getHistory;"lose";//!?map(evt => evt.cards).flat().map(card => get.nature(card)).toUniqued().length`,
            '获取本回合获得牌的类型个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.type2(card)).toUniqued().length`,
            '获取本回合获得牌的颜色个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.color(card)).toUniqued().length`,
            '获取本回合获得牌的花色个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.suit(card)).toUniqued().length`,
            '获取本回合获得牌的点数个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.number(card)).toUniqued().length`,
            '获取本回合获得牌的副类别个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.subtype(card)).toUniqued().length`,
            '获取本回合获得牌的牌名个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.name(card)).toUniqued().length`,
            '获取本回合获得牌的属性个数': `getHistory;"gain";//!?map(evt => evt.cards).flat().map(card => get.nature(card)).toUniqued().length`,
        },
        plyaer_when: {
            ...getMapOfWhen()
        },
        players: {
            /*所(被)选(的)角色,所(被)选择(的)角色*/
            '所选角色': 'result.targets',
            '所有角色': 'game.players',
            '此牌的所有目标': 'trigger.targets',
            '触发事件的目标组': "trigger.targets",
            '目标组': "targets",
            '事件的目标组': "event.targets",
        },
        event: {
            '触发': 'trigger',
            '触发事件': 'trigger',
            '触发的事件': 'trigger',
            "触发事件的父事件": "trigger.parent",
            "触发的父事件": "trigger.parent",
            '事件': 'event',
        },
        event_var: {
            "判定事件": "judgeEvent",
            "选择事件": "chooseEvent"
        },
        event_name: eventList,
        event_method: {
            '取消': 'cancel',
            '重复': 'redo',
            '结束': 'finish',
            '跳至': 'goto',
            '父事件': 'getParent',
            '获取父事件': 'getParent',
            '获取父事件的名字': 'getParent;//!?name',
            '数值改为0': "changeToZero",
            '数值调为0': "changeToZero",
            '数改为0': "changeToZero",
            '数调为0': "changeToZero",
            "设置": "set",
            "获取事件结果": "forResult",
            "不涉及横置": "notLink"
        },
        event_set: {
            //
            "设置ai": `set;"ai";intoFunction`,
            "设置Ai": `set;"ai";intoFunction`,
            "设置AI": `set;"ai";intoFunction`,
            "设置ai适度弃牌": `set;"ai";get.unuseful2`,
            "设置ai厌恶弃牌": `set;"ai";get.unuseful`,
            //
            "设置提示标题": `set;"prompt";intoFunction`,
            "设置提示内容": `set;"prompt2";intoFunction`,
            "设置提示事件提示": `set;"evtprompt";intoFunction`,
            "设置提示标题跟随技能": `set;"prompt";get.prompt(\\skillID)`,
            "设置提示内容跟随技能": `set;"prompt2";get.prompt2(\\skillID)`,
            //
            "设置选项列表": `set;"choiceList";intoFunction`,
            "设置选项组": `set;"controls";intoFunction`,
            //
            "设置角色限制条件": `set;"filterTarget";intoFunction`,
            "设置角色选择数量": `set;"selectTarget";intoFunction`,
            //
            "设置卡牌选择数量": `set;"selectCard";intoFunction`,
            "设置卡牌限制条件": `set;"filterCard";intoFunction`,
            //
            "设置为强制发动": `set;"forced";true`,
        },
        set_judge: {
            "设置判定回调": `set;"callback";intoFunction`,
            "设置判定回调跟随技能": `set;"callback";get.info(\\skillID).judgeCallback`,
            //
            "设置判定收益": `set;"judge";intoFunction`,
            "设置红桃作为判定唯一正收益": `set;"judge";card=>get.suit(card)==="heart"?1:-2`,
            "设置黑桃作为判定唯一正收益": `set;"judge";card=>get.suit(card)==="spade"?1:-2`,
            "设置梅花作为判定唯一正收益": `set;"judge";card=>get.suit(card)==="club"?1:-2`,
            "设置方片作为判定唯一正收益": `set;"judge";card=>get.suit(card)==="diamond"?1:-2`,
            "设置红色作为判定唯一正收益": `set;"judge;card=>get.color(card)==="red"?1:-2`,
            "设置黑色作为判定唯一正收益": `set;"judge";card=>get.color(card)==="black"?1:-2`,
            "设置红桃作为判定唯一负收益": `set;"judge";card=>get.suit(card)==="heart"?-2:2`,
            "设置黑桃作为判定唯一负收益": `set;"judge";card=>get.suit(card)==="spade"?-2:2`,
            "设置梅花作为判定唯一负收益": `set;"judge";card=>get.suit(card)==="club"?-2:2`,
            "设置方片作为判定唯一负收益": `set;"judge";card=>get.suit(card)==="diamond"?-2:2`,
            "设置红色作为判定唯一负收益": `set;"judge;card=>get.color(card)==="red"?-2:2`,
            "设置黑色作为判定唯一负收益": `set;"judge";card=>get.color(card)==="black"?-2:2`,
            //
            "设置判定生效结果": `set;"judge2";intoFunction`,
            "设置判定生效结果与收益相反": `set;"judge2";result=>result.bool===false?true:false`,
            "设置判定生效结果与收益相同": `set;"judge2";result=>result.bool`,
        },
        event_withArg: {
            ...getMapOfgetParent(),
        },
        trigger_type: {
            '你': 'player',
            '每名角色': 'global',
            '场上一名角色': 'global',
            '场上一位角色': 'global',
            '一名角色': 'global',
            '一位角色': 'global',
        },
        triggerList: {
            ...getMapOfTrigger(),
            ...getMapOfTri_Target(),
            ...getMapOfTri_Use(),
            //
            "每轮开始时": "roundStart",
            //phase类
            "回合开始后2": "phaseBeforeStart",
            "回合开始后4": "phaseBeforeEnd",
            "回合开始后7": "phaseBeginStart",
            "回合开始后9": "phaseBegin",
            "准备阶段": "phaseZhunbeiBegin",
            "准备阶段开始": "phaseZhunbeiBegin",
            "结束阶段": "phaseJieshuBegin",
            "结束阶段开始": "phaseJieshuBegin",
            "摸牌阶段2": "phaseDrawBegin2",
            "阶段改变时": "phaseChange",
            "阶段更改时": "phaseChange",
            //伤害
            "受到伤害后": "damageEnd",
            '造成伤害': 'damageSource',
            '造成伤害时': 'damageSource',
            '造成伤害后': 'damageSource',
            //判定
            "判定牌生效前": "judge",
            "判定牌生效后": "judgeEnd",
            //特殊时机
            '使用牌指定目标时': "useCardToPlayer",
            '使用牌指定目标后': "useCardToPlayered",
            '成为牌的目标时': "target:useCardToTarget",
            '成为牌的目标后': "target:useCardToTargeted",
            //拼点
            '亮出拼点牌前': 'compareCardShowBefore',
            //
            '杀死一名角色后': 'source:dieAfter',
            '令一名角色进入濒死状态': "source:dying",
            '进入濒死状态时': 'dying',
            '脱离濒死状态时': 'dyingAfter',
            //牌类
            '使用牌时': "useCard",
            '牌被弃置后': 'loseAfter:discard',
            '需要打出闪时': 'chooseToRespondBefore:shan',
            '需要使用闪时': 'chooseToUseBefore:shan',
            '需要打出杀时': 'chooseToRespondBefore:sha',
        },
        game_method: {
            '创卡': 'createCard',
            '造卡': 'createCard',
            '印卡': 'createCard',
            '更新轮数': 'updateRoundNumber',
            '暂停': 'pause',
            '继续': 'resume',
            '局终': 'over',
            '重启': 'reload',
            '移至处理区': "cardsGotoOrdering",
            '卡牌移至处理区': "cardsGotoOrdering",
            '同时失去牌': "loseAsync",
            '日志': "log"
        },
        game_withArg: {
            '胜利': 'over;true',
            '失败': 'over;false',
            "统计场上势力数": "countGroup;",
            "统计场上男性数量": `countPlayer;cur=>cur.hasSex("male")`,
            "统计场上女性数量": `countPlayer;cur=>cur.hasSex("female")`,
            "统计场上其他男性数量": `countPlayer;cur=>cur.hasSex("male")&&cur!=player`,
            "统计场上其他女性数量": `countPlayer;cur=>cur.hasSex("female")&&cur!=player`,
            "统计场上魏势力角色数量": `countPlayer;cur=>cur.group!="wei"`,
            "统计场上蜀势力角色数量": `countPlayer;cur=>cur.group!="shu"`,
            "统计场上吴势力角色数量": `countPlayer;cur=>cur.group!="wu"`,
            "统计场上群势力角色数量": `countPlayer;cur=>cur.group!="qun"`,
            "统计场上晋势力角色数量": `countPlayer;cur=>cur.group!="jin"`,
            "统计场上神势力角色数量": `countPlayer;cur=>cur.group!="shen"`,
            "统计场上西势力角色数量": `countPlayer;cur=>cur.group!="western"`,
            "统计场上键势力角色数量": `countPlayer;cur=>cur.group!="key"`,
            "统计场上其他魏势力角色数量": `countPlayer;cur=>cur.group!="wei"&&cur!=player`,
            "统计场上其他蜀势力角色数量": `countPlayer;cur=>cur.group!="shu"&&cur!=player`,
            "统计场上其他吴势力角色数量": `countPlayer;cur=>cur.group!="wu"&&cur!=player`,
            "统计场上其他群势力角色数量": `countPlayer;cur=>cur.group!="qun"&&cur!=player`,
            "统计场上其他晋势力角色数量": `countPlayer;cur=>cur.group!="jin"&&cur!=player`,
            "统计场上其他神势力角色数量": `countPlayer;cur=>cur.group!="shen"&&cur!=player`,
            "统计场上其他西势力角色数量": `countPlayer;cur=>cur.group!="western"&&cur!=player`,
            "统计场上其他键势力角色数量": `countPlayer;cur=>cur.group!="key"&&cur!=player`,
        },
        lib_filter: {
            '非我过滤': "lib.filter.notMe",
            '唯我过滤': "lib.filter.isMe",
        },
        step: {
            ...getMapOfStep()
        },
        quantifier: {
            ...getMapOfQuan(),
            '二名': "2",
            '二张': "2",
            '二点': "2",
        },
        suit: getMapOfSuit(),
        type: {
            ...getMapOfType(),
            "非延时锦囊牌": `"trick"`,
        },
        type2: {
            "锦囊牌": `"trick"`
        },
        subtype: {
            "武器牌": `"equip1"`,
            "防具牌": `"equip2"`,
            "+1马牌": `"equip3"`,
            "防御马牌": `"equip3"`,
            "-1马牌": `"equip4"`,
            "进攻马牌": `"equip4"`,
            "宝物牌": `"equip5"`,
        },
        color: getMapOfColor(),
        nature: {
            '火属性': '"fire"',
            '雷属性': '"thunder"',
            '冰属性': '"ice"',
        },
        cardName: getMapOfCard(),
        group: getMapOfGroup(),
        gender: {
            "男性": `"male"`,
            "女性": `"female"`,
            "双性": '"double"',
            "未知性": `"unknow"`
        },
        filter_only: {
            "不发动": "return false;",
            "发动": "return true;"
        },
        packed_playerCode: {
            '令角色代为打出': 'packed_playerCode_sufferForAnother',
            '令角色代为使用': 'packed_playerCode_sufferForAnother',
            '令角色代为使用或打出': 'packed_playerCode_sufferForAnother',
            '本回合对角色造成伤害的次数': 'packed_playerCode_getDamagedThemTimes',
            '本回合出牌阶段使用某牌的次数': 'packed_playerCode_getUsedCardTimes',
            '本回合出牌阶段打出某牌的次数': 'packed_playerCode_getRespondedCardTimes',
        },
        packed_gameCode: {
            '同时获得牌': "packed_gameCode_gainAsync"
        },
    }
    static viewAsFrequencyList = [
        "frequency-phase-cardName",
        "frequency-round-cardName",
        "frequency-game-cardName"
    ]
    static viewAsFrequencyMap = {
        'frequency-phase-cardName': '{global:"phaseAfter"}',
        'frequency-round-cardName': '{global:"roundStart"}'
    }
    static packedCodeRePlaceMap = {
        'packed_playerCode_sufferForAnother'(str) {
            let match = /(.+)\.packed_playerCode_sufferForAnother(\(.*\))/g;
            const groups = lib.group.map(group => `"${group}"`)
            return str.replace(match, function (match, ...p) {
                const player = p[0]
                const args = p[1].replace(/[\(\)]/g, '').split(",")
                let card;
                if (args.includes('"sha"')) card = 'sha'
                if (args.includes('"shan"')) card = 'shan'
                let result = '';
                result += `event.suffers = game.players\n`
                if (args.includes('other')) result += `.filter(each=>each!=player)\n`
                const sufferGroup = args.filter(arg => groups.includes(arg))
                if (sufferGroup.length) result += `.filter(each=>[${sufferGroup}].includes(each))\n`
                result += `event.sufferIndex = 0\n`
                result += `"step 1"\n`
                result += `var current = event.suffers[event.sufferIndex];\n`
                result += `if((current==game.me&&!_status.auto)\n`
                result += `||get.attitude(current,${player})>2\n`
                result += `||current.isOnline()){\n`
                result += `var next = current.chooseToRespond({name:"${card}"});\n`
                result += `next.set("prompt",'是否替'+get.translation(${player})+"打出一张${lib.translate[card]}");\n`
                result += `next.set('ai',()=>get.attitude(event.player,event.source)-2);\n`
                result += `next.set("skillwarn",'替'+get.translation(${player})+"打出一张${lib.translate[card]}");\n`
                result += `next.set("source",${player})\n`
                result += `next.autochoose=lib.filter.autoRespondShan\n`
                result += `}\n`
                result += `"step 2"\n`
                result += `if(result.bool){\n`
                result += `const current = event.suffers[event.sufferIndex];\n`
                result += `trigger.result = {\nbool:true,\ncard:{name:"${card}",isCard:true}\n}\n`
                result += `trigger.responded = true;\n`
                result += `trigger.animate = false;\n`
                result += `if(typeof current.ai.shown =="number"\n`
                result += `&&current.ai.shown<0.95){\n`
                result += `current.ai.shown=Math.min(current,ai.shown+0.3,0.95)\n`
                result += `}\n`
                result += `}\n`
                result += `else{\n`
                result += `if(++event.sufferIndex<event.suffers.length){\n`
                result += `event.goto(event.step-1);\n`
                result += `}\n`
                result += `}\n`
                return result;
            })
        },
        'packed_playerCode_getDamagedThemTimes'(str) {
            let match = /(.+)\.packed_playerCode_getDamagedThemTimes(\(.*\))/g;
            return str.replace(match, function (match, ...p) {
                const player = p[0]
                const args = p[1].replace(/[\(\)]/g, '').split(",")
                const targets = args.filter(item => Object.values(NonameCN.groupedList.player).includes(item));
                let result = '';
                result += `${player}.getHistory("sourceDamage",evt=>[${targets}].includes(evt.player)).length`
                return result;
            })
        },
        'loseAsync'(str) {
            let match = /(.+)\.loseAsync(\(.*\))/g;
            return str.replace(match, function (match, ...p) {
                if (p[1].startsWith('{')) return match;
                const args = p[1].replace(/[\(\)]/g, '').split(",").filter(arg => arg.length)
                const players = args.filter(arg => game.xjb_judgeType(arg) === 'player')
                const cardsArray = args.remove(...players)
                const playerCardsPair = []
                for (let i = 0; i < players.length; i++) {
                    playerCardsPair.push(`[${players[i]},${cardsArray[i]}]`)
                }
                let result = '';
                result += `game.loseAsync({\n`
                if (playerCardsPair.length) result += `lose_list: [${playerCardsPair}] \n`
                result += `})\n`
                result += `.setContent("chooseToCompareLose")`
                return result;
            })
        },
        'packed_gameCode_gainAsync'(str) {
            let match = /(.+)\.packed_gameCode_gainAsync(\(.*\))/g;
            return str.replace(match, function (match, ...p) {
                if (p[1].startsWith('{')) return match;
                const args = p[1].replace(/[\(\)]/g, '').split(",").filter(arg => arg.length)
                const animate = args.find(arg => ['"draw"', '"gain2"'].includes(arg))
                const players = args.filter(arg => game.xjb_judgeType(arg) === 'player')
                const player = players[0]
                const cardsArray = args.remove(animate, ...players)
                const playerCardsPair = []
                for (let i = 0; i < players.length; i++) {
                    playerCardsPair.push(`[${players[i]},${cardsArray[i]}]`)
                }
                let result = '';
                result += `game.loseAsync({\n`
                if (player) result += `player: ${player},\n`
                if (animate) result += `animate: ${animate},\n`
                if (playerCardsPair.length) result += `gain_list: [${playerCardsPair}]\n`
                result += `})\n`
                result += `.setContent("gaincardMultiple")`
                return result;
            })
        },
        'packed_playerCode_getUsedCardTimes'(str) {
            let match = /(.+)\.packed_playerCode_getUsedCardTimes(\(.*\))/g;
            return str.replace(match, function (match, ...p) {
                const player = p[0]
                const args = p[1].replace(/[\(\)]/g, '').split(",")
                const color = args.find(item => Object.values(NonameCN.groupedList.color).includes(item))
                const suit = args.find(item => Object.values(NonameCN.groupedList.suit).includes(item))
                const type = args.find(item => Object.values(NonameCN.groupedList.type).includes(item))
                const subtype = args.find(item => Object.values(NonameCN.groupedList.subtype).includes(item))
                const name = args.find(item => Object.values(NonameCN.groupedList.cardName).includes(item))
                const nature = args.find(item => Object.values(NonameCN.groupedList.nature).includes(item))
                let result = '';
                result += `${player}.getHistory("useCard", evt => evt.isPhaseUsing()`
                if (name) result += `\n && \nget.name(evt.card) === ${name}`
                if (color) result += `\n && \nget.color(evt.card) === ${color}`
                if (suit) result += `\n && \nget.suit(evt.card) === ${suit}`
                if (type) result += `\n && \nget.type2(evt.card) === ${type}`
                if (subtype) result += `\n && \nget.subtype(evt.card) === ${subtype}`
                if (nature) result += `\n && \nget.nature(evt.card) === ${nature}`
                result += `)`
                return result;
            })
        },
        'packed_playerCode_getRespondedCardTimes'(str) {
            let match = /(.+)\.packed_playerCode_getRespondedCardTimes(\(.*\))/g;
            return str.replace(match, function (match, ...p) {
                const player = p[0]
                const args = p[1].replace(/[\(\)]/g, '').split(",")
                const color = args.find(item => Object.values(NonameCN.groupedList.color).includes(item))
                const suit = args.find(item => Object.values(NonameCN.groupedList.suit).includes(item))
                const type = args.find(item => Object.values(NonameCN.groupedList.type).includes(item))
                const subtype = args.find(item => Object.values(NonameCN.groupedList.subtype).includes(item))
                const name = args.find(item => Object.values(NonameCN.groupedList.cardName).includes(item))
                const nature = args.find(item => Object.values(NonameCN.groupedList.nature).includes(item))
                let result = '';
                result += `${player}.getHistory("respond", evt => evt.isPhaseUsing()`
                if (name) result += `\n && \nget.name(evt.card) === ${name}`
                if (color) result += `\n && \nget.color(evt.card) === ${color}`
                if (suit) result += `\n && \nget.suit(evt.card) === ${suit}`
                if (type) result += `\n && \nget.type2(evt.card) === ${type}`
                if (subtype) result += `\n && \nget.subtype(evt.card) === ${subtype}`
                if (nature) result += `\n && \nget.nature(evt.card) === ${nature}`
                result += `)`
                return result;
            })
        }
    }
    static get AllList() {
        let list = Object.assign({}, this.basicList, ...Object.values(this.groupedList));
        return list
    }
    static get TriList() {
        let list = Object.assign({},
            this.groupedList.event_name,
            this.groupedList.triggerList,
            this.groupedList.trigger_type
        );
        return list
    }
    static get ContentList() {
        const back = game.xjb_back
        let list = Object.assign({}, this.basicList);
        for (let k in this.groupedList) {
            if (['filter_only'].includes(k)) continue;
            list = Object.assign(list, this.groupedList[k]);
        }
        if (!back) return list;
        const id = back.getID()
        list["获取名为" + back.getSourceID() + "父事件名字"] = `getParent: "${back.getSourceID()}"://!?name`
        list["获取名为" + id + "父事件名字"] = `getParent:"${id}"://!?name`
        list["此牌"] = NonameCN.analyzeThisCard(game.xjb_back.skill.trigger)
        list["这些牌"] = NonameCN.analyzeTheseCard(game.xjb_back.skill.trigger)
        return list
    }
    static get FilterList() {
        const back = game.xjb_back
        let list = Object.assign({}, this.basicList);
        const id = back.getID()
        for (let k in this.groupedList) {
            list = Object.assign(list, this.groupedList[k]);
        }
        list["获取名为" + back.getSourceID() + "的父事件的名字"] = `getParent:"${back.getSourceID()}"://!?name`
        list["获取名为" + id + "的父事件的名字"] = `getParent:"${id}"://!?name`
        list["获取名为\"" + id + "\"的父事件的名字"] = `getParent:"${id}"://!?name`
        list["此牌"] = NonameCN.analyzeThisCard(back.skill.trigger, true);
        list["这些牌"] = NonameCN.analyzeTheseCard(back.skill.trigger, true);
        return list;
    }
    static giveSentence = {
        filter: {
            '此牌是你使用的': '此牌是你使用的(触发技-)',
            '本事件是你造成的': '本事件是你造成的(触发技-)',
            '触发事件的角色不是你': '触发事件的角色不是你(触发技-)',
            '触发事件的目标不是你': '触发事件的目标不是你(触发技-)',
            '触发事件的来源不是你': '触发事件的来源不是你(触发技-)',
            '此牌是红色': '此牌为红色(颜色)',
            '此牌是黑色': '此牌为黑色(颜色)',
            '此牌为梅花': "此牌为梅花(花色)",
            '此牌为黑桃': "此牌为黑桃(花色)",
            '此牌为红桃': "此牌为红桃(花色)",
            '此牌为方片': "此牌为方片(花色)",
            '此牌是延时锦囊牌': '此牌是延时锦囊牌(类别)',
            '此牌是普通锦囊牌': '此牌是普通锦囊牌(类别)',
            '此牌是基本牌': '此牌是基本牌(类别)',
            '此牌是装备牌': '此牌是装备牌(类别)',
            '此牌是火杀': "此牌是火杀(属性+牌名)",
            '此牌是杀': '此牌是杀(牌名)',
            '此牌是闪': '此牌是闪(牌名)',
            '此牌是桃': '此牌是桃(牌名)',
            '此牌是酒': '此牌是酒(牌名)',
            '此牌是无懈可击': '此牌是无懈可击(牌名)',
            '此牌是决斗': '此牌是决斗(牌名)',
            '此牌点数为A': '此牌点数为A(点数)',
            '此牌点数不小于10': '此牌点数不小于10(点数)',
            '此牌为武器牌': "此牌为武器牌(副类别)",
            '此牌为防具牌': "此牌为防具牌(副类别)",
            '此牌为+1马牌': "此牌为+1牌马(副类别)",
            '此牌为-1马牌': "此牌为-1马牌(副类别)",
            '此牌为宝物牌': "此牌为宝物牌(副类别)",
            '此牌有伤害标签': '此牌有伤害标签(标签)',
            '此牌不是单体牌': '此牌有多角色标签(标签)',
            '此牌是单体牌': '此牌不带多角色标签(标签)',
            "此牌 是实体牌": "此牌是实体牌",
            '你在你的攻击范围内': '你在你的攻击范围内(攻击范围)',
            '你未受伤': '你未受伤(体力)',
            '你已受伤': '你已受伤(体力)',
            '你体力值大于3': '你体力值大于3(体力)',
            '你体力上限大于3': '你体力上限大于3(体力)',
            '你体力值为全场最少或之一': "你体力值为全场最少或之一(体力)",
            '你有全场唯一最少的体力值': '你有全场唯一最少的体力值(体力)',
            '你有全场唯一最多的体力值': '你有全场唯一最多的体力值(体力)',
            '你没有全场唯一最少的体力值': '你没有全场唯一最少的体力值(体力)',
            '你没有全场唯一最多的体力值': '你没有全场唯一最多的体力值(体力)',
            '你为男性': '你为男性(性别)',
            '你为女性': '你为女性(性别)',
            '你已横置': "你已横置(状态)",
            '你已翻面': "你已翻面*(状态)",
            "你处于自己的出牌阶段": "你处于自己的出牌阶段(阶段)",
            '你手牌上限大于3': '你手牌上限大于3',
            '你的手牌数大于3': "你的手牌数大于3",
            '你的牌数大于3': "你的牌数大于3",
            '你的场上的牌数大于3': "你的场上的牌数大于3",
            '你的区域内的牌数大于3': "你的牌数大于3",
            '场上势力数大于2': "场上势力数大于2",
            '你手牌数为全场最少或之一': "你手牌数为全场最少或之一",
            '你有全场唯一最少的手牌数': '你有全场唯一最少的手牌数',
            '你有全场唯一最多的手牌数': '你有全场唯一最多的手牌数',
            '你没有全场唯一最少的手牌数': '你有全场唯一最少的手牌数',
            '你没有全场唯一最多的手牌数': '你没有全场唯一最多的手牌数',
            '你有牌': "你有牌",
            '你有手牌': "你有手牌",
            '你场上有牌': "你场上有牌",
            '你手牌区有牌': '你手牌区有牌',
            '你装备区有牌': '你装备区有牌',
            '你判定区有牌': '你判定区有牌',
            '你有杀': "你有杀",
            '你手牌区有杀': "你手牌区有杀",
            '你装备区有杀': "你装备区有杀",
            '你判定区有杀': "你判定区有杀",
            '你有未被废除的装备栏': '你有未被废除的装备栏',
            '你的装备栏均已被废除': '你的装备栏均已被废除',
            '你有空置的武器栏': '你有空置的武器栏',
            '你有空置的防具栏': '你有空置的防具栏',
            '你有空置的+1马栏': '你有空置的+1马栏',
            '你有空置的-1马栏': '你有空置的-1马栏',
            '你有空置的宝物栏': '你有空置的宝物栏',
            '你本回合未造成伤害': "你本回合未造成伤害",
            '你本回合造成过伤害': "你本回合造成过伤害",
            '你本回合未使用过牌': "你本回合未使用过牌",
            '你本回合使用过牌': "你本回合使用过牌",
            '你本回合未对触发事件的角色造成过伤害': "你本回合未对触发事件的角色造成过伤害",
            '你本回合出牌阶段没有打出过杀': "你本回合出牌阶段没有打出过杀",
            '你本回合出牌阶段没有使用过杀': "你本回合出牌阶段没有使用过杀",
            '你本回合出牌阶段没有打出过火杀': "你本回合出牌阶段没有打出过火杀",
            '你本回合出牌阶段没有使用过火杀': "你本回合出牌阶段没有使用过火杀",
            '你本回合出牌阶段没有打出过红杀': "你本回合出牌阶段没有打出过红杀",
            '你本回合出牌阶段没有使用过红杀': "你本回合出牌阶段没有使用过红杀",
            '触发事件上有父事件摸牌': "触发事件上有名为摸牌的父事件",
            '场上有男性角色': '场上有男性角色',
            '场上有其他男性角色': '场上有其他男性角色',
            '场上有女性角色': '场上有女性角色',
            '场上有其他女性角色': '场上有其他女性角色',
            '场上有魏势力角色': '场上有魏势力角色',
            '场上有其他魏势力角色': '场上有其他魏势力角色',
            '场上有蜀势力角色': '场上有蜀势力角色',
            '场上有其他蜀势力角色': '场上有其他蜀势力角色',
            '场上有吴势力角色': '场上有吴势力角色',
            '场上有其他吴势力角色': '场上有其他吴势力角色',
            '场上有群势力角色': '场上有群势力角色',
            '场上有其他群势力角色': '场上有其他群势力角色',
            '场上有晋势力角色': '场上有晋势力角色',
            '场上有其他晋势力角色': '场上有其他晋势力角色',
        },
        content: {
            "你摸一张牌": "你摸一张牌(牌类)",
            "你从牌堆底摸一张牌": "你从牌堆底摸一张牌(牌类)",
            "你将手牌摸至五张": "你将手牌摸至五张(牌类)",
            "你随机弃置一张牌": "你随机弃置一张牌(牌类)",
            "你移动场上一张牌": "你移动场上一张牌(牌类)",
            '你选择使用一张牌': "你选择使用一张牌(牌类)",
            "你选择对一名角色使用一张杀": "你选择对一名角色使用一张杀(牌类)",
            "你增加一点体力上限": "你增加一点体力上限(体力类)",
            "你回复一点体力值": "你回复一点体力值(体力类)",
            "你将体力值回复至三点": "你将体力值回复至三点(体力类)",
            "你失去一点体力": "你失去一点体力(体力类)",
            "你获得一点护甲": "你获得一点护甲(体力类-护甲)",
            "你可以摸两张牌或回复一点体力值": "你可以摸两张牌或回复一点体力值(牌类-体力类)",
            "你本回合非锁定技失效": "你本回合非锁定技失效(技能类)",
            "你临时获得技能 'dangxian'": "你临时获得技能当先(技能类)",
            '你获得技能"yiji"直到下个回合结束': '你获得技能遗计("yiji")直到下个回合结束(技能类)',
            "你翻面": "你翻面",
            "你横置或重置": "你横置或重置",
            "你执行一个额外的准备阶段": "你执行一个额外的准备阶段(阶段类)",
            "你执行一个额外的判定阶段": "你执行一个额外的判定阶段(阶段类)",
            "你执行一个额外的摸牌阶段": "你执行一个额外的摸牌阶段(阶段类)",
            "你执行一个额外的出牌阶段": "你执行一个额外的出牌阶段(阶段类)",
            "你执行一个额外的弃牌阶段": "你执行一个额外的弃牌阶段(阶段类)",
            "你执行一个额外的结束阶段": "你执行一个额外的结束阶段(阶段类)",
            "你跳过下一个准备阶段": "你跳过下一个准备阶段(阶段类)",
            "你跳过下一个判定阶段": "你跳过下一个判定阶段(阶段类)",
            "你跳过下一个摸牌阶段": "你跳过下一个判定阶段(阶段类)",
            "你跳过下一个出牌阶段": "你跳过下一个出牌阶段(阶段类)",
            "你跳过下一个弃牌阶段": "你跳过下一个弃牌阶段(阶段类)",
            "你跳过下一个结束阶段": "你跳过下一个结束阶段(阶段类)",
            '你获得一枚"new_wuhun"标记': "你获得一枚梦魇标记(标记类)",
            '你移去一枚"new_wuhun"标记': "你移去一枚梦魇标记(标记类)",
            "此杀的伤害+1": "此杀伤害+1(触发技:使用杀时|使用杀指定目标时)",
            "此杀的伤害改为1": "此杀伤害改为1(触发技:使用杀时|使用杀指定目标时)",
            "此杀需要的闪的数量+1": "此杀需要的闪的数量+1(触发技:使用杀时|使用杀指定目标时)",
            "此杀需要的闪的数量改为2": "此杀需要的闪的数量改为1(触发技:使用杀时|使用杀指定目标时)",
            "此决斗需要的杀的数量+1": "此决斗需要的杀的数量+1(触发技:使用决斗时|使用决斗指定目标时|成为决斗的目标时)",
            "此决斗需要的杀的数量改为2": "此决斗需要的杀的数量改为1(触发技:使用决斗时|使用决斗指定目标时|成为决斗的目标时)",
            "造成的伤害+1": "造成的伤害+1(触发技:伤害类)",
            "造成的伤害改为1": "造成的伤害改为1",
            "令此牌对你无效": "令此牌对你无效",
            "此牌额外结算1次": "此牌额外结算1次",
            "此牌不可被响应": "此牌不可被响应",
            "此牌取消你为目标": "此牌取消你为目标",
            "此牌不可被此牌的目标响应": "此牌不可被此牌的目标响应",
            "此牌无视此牌的目标的防具": "此牌无视此牌的目标的防具",
            '你选择对一名角色杀': "你选择对一名角色杀(使用牌类)",
            "你视为对你使用一张无中生有": "你视为对你使用一张无中生有(使用牌类)",
            "你视为对你使用一张不可被无懈可击响应的无中生有": "你视为对你使用一张不可被无懈可击响应的无中生有(使用牌类)",
            "目标组-1视为对目标组-0使用一张不可被无懈可击响应、不影响ai的决斗": "目标组-1视为对目标组-0使用一张不可被无懈可击响应、不影响ai的决斗(使用牌类)",
            "目标组-1视为对目标组-0使用一张不计入次数、不影响ai的杀": "目标组-1视为对目标组-0使用不计入次数、不影响ai的杀(使用牌类)",
            '第一个所选角色摸一张牌': "第一个所选角色摸一张牌(选择目标后写该语句)",
            '触发事件的角色摸一张牌': "触发事件的角色摸一张牌(触发技)",
            '触发事件的目标摸一张牌': "触发事件的目标摸一张牌(触发技)",
            '本技能发动次数-1': "本技能发动次数-1(其他类)",
            "你使用杀无距离限制": "你使用杀无距离限制(mod类)",
            "你使用杀无次数限制": "你使用杀无次数限制(mod类)",
            "你不能成为顺手牵羊和乐不思蜀的目标": "你不能成为顺手牵羊和乐不思蜀的目标(mod类)",
            "变量牌组令为你获取手牌": "变量 牌组 令为 你 获取手牌",
            '变量 牌组 令为 获取 牌堆中颜色不同的两张牌': "变量牌组令为 获取 牌堆中颜色不同的两张牌",
        },
        trigger: {
            "每轮开始时": "每轮开始时",
            "准备阶段": "准备阶段(阶段类)",
            "判定阶段": "判定阶段(阶段类)",
            "摸牌阶段": "摸牌阶段(阶段类)",
            "摸牌阶段2": "摸牌阶段(时机同【英姿】，阶段类)",
            "出牌阶段开始时": "出牌阶段开始时(阶段类)",
            "弃牌阶段": "弃牌阶段(阶段类)",
            "弃牌阶段开始时": "弃牌阶段开始时(阶段类)",
            "结束阶段": "结束阶段(阶段类)",
            '你使用牌指定目标时': "你使用牌指定目标时(使用牌类)",
            '你使用牌指定目标后': "你使用牌指定目标后(使用牌类)",
            '你成为牌的目标时': "你成为牌的目标时(使用牌类)",
            '你成为牌的目标后': "你成为牌的目标后(使用牌类)",
            "你判定牌生效前": "你判定牌生效前(判定牌类)",
            "你判定牌生效后": "你判定牌生效后(判定牌类)",
            "你受到伤害后": "你受到伤害后(伤害类)",
            "你造成伤害后": "你造成伤害后(伤害类)",
            "你受到一点伤害后": "你受到一点伤害后(伤害类)",
            "你造成一点伤害后": "你造成一点伤害后(伤害类)",
            "你失去体力后": "你失去体力后(体力类)",
            "你失去一点体力后": "你失去一点体力后(体力类)",
            "你体力减少后": "你体力减少后(体力类)",
            "你令一名角色进入濒死状态": "你令一名角色进入濒死状态(濒死类)",
            '你进入濒死状态时': '你进入濒死状态时(濒死类)',
            '你脱离濒死状态时': "你脱离濒死状态时(濒死类)",
            "你杀死一名角色后": "你杀死一名角色后",
            "一名角色准备阶段": "一名角色准备阶段(阶段类)",
            "一名角色出牌阶段开始时": "一名角色出牌阶段开始时(阶段类)",
            "一名角色结束阶段": "一名角色结束阶段(阶段类)",
            "一名角色判定阶段": "一名角色判定阶段(阶段类)",
            "一名角色弃牌阶段": "一名角色弃牌阶段(阶段类)",
            "一名角色摸牌阶段": "一名角色摸牌阶段(阶段类)",
        },
        filterTarget: {
            "其他角色": "其他角色"
        },
        filterCard: {
            "卡牌颜色相同": "",
            "卡牌花色相同": "",
            "卡牌点数相同": "",
            "卡牌类别相同": "",
            "卡牌属性相同": "",
            "卡牌牌名相同": "",
        },
        unshown_filter: {},
        unshown_content: {
            "变量选择事件令为": 0,
            "选择事件设置角色限制条件 非我过滤": 0,
            "选择事件设置角色限制条件 唯我过滤": 0,
            "选择事件设置选项列表": 0,
            '变量卡牌令为触发事件的牌组-0': 0,
            '销毁卡牌': 0,
            '游戏 移至处理区': 0,
            '本技能发动次数-1': 0,
            '"step 1"': 0,
            "'step 1'": 0,
            '%#&': 0,
        },
        unshown_trigger: {},
        unshown_filterTarget: {},
        unshown_filterCard: {},
    }
    static skillModMap = new Map();
    static moreSetDialog = [];
    static getEn(cn) {
        let list = Object.assign({}, ...Object.values(this.freeQuotation));
        return list[cn];
    }
    static getStrFormFunc(key, value, noplayer) {
        if (Array.isArray(value)) {
            value = value.map(k => `"${k}"`)
            return `[${value}].includes(get.${key}(card,${key == "type" ? "false," : ""}player))`.replace(noplayer ? ",player" : "", "")
        }
        return `get.${key}(card,${key == "type" ? "false," : ""}player) === "${value}"`.replace(noplayer ? ",player" : "", "")
    }
    static getStrFormConst({ costName, costNature, costColor, costSuit }) {
        let result = ''
        if (costName) result += `const name = "${costName}";\n`;
        if (costNature) result += `const nature = "${costNature}";\n`;
        if (costColor) result += `const color = "${costColor}";\n`;
        if (costSuit) result += `const suit = "${costSuit}";\n`;
        return result;
    }
    static getStrFormVcard({ costName, costNature, costColor, costSuit }, changeLine = true) {
        let result = '{\n'
        if (costName) result += `name:"${costName}",\n`;
        if (costNature) result += `nature:"${costNature}",\n`;
        if (costColor) result += `color:"${costColor}",\n`;
        if (costSuit) result += `suit:"${costSuit}"\n`;
        result += `}`;
        if (!changeLine) result = result.replaceAll('\n', '')
        return result;
    }
    /**
     * 
     * @param {string[]|string} inputData 
     * @returns {string}
     */
    static getStrNormalFunc(inputData) {
        let result = '', IF = false, branch = 0;
        if (!Array.isArray(inputData) && typeof inputData != 'string') return result;
        if (typeof inputData === 'string') inputData = inputData.split('\n');
        let previousLine = '';
        for (const [index, line] of inputData.entries()) {
            switch (true) {
                case (line === 'if(' && IF === false): {
                    result += line;
                    IF = true
                }; break;
                case (line === ")" && IF === true): {
                    result += line;
                    IF = false;
                }; break;
                case (IF === true): {
                    if ([' || ', ' && '].includes(line)) result += '\n'
                    result += line;
                }; break;
                case (line === "{"): {
                    if (previousLine === "else ") result = result.slice(0, -1);
                    result += '{\n';
                    branch++;
                }; break;
                case (line === "}" && branch > 0): {
                    result += '}\n'
                    branch--;
                }; break;
                case (branch > 0): {
                    result += `${line}\n`
                }; break;
                case (index === inputData.length - 1): {
                    result += `${line}`
                }; break;
                default: {
                    result += `${line}\n`
                }; break;
            }
            previousLine = line;
        }
        return result;
    }
    /**
     * @param that 一个对象，其changeWord方法被调用来执行文本替换。
     */
    static deleteBlank(that) {
        const JOINED_PLAYAERCN = this.playerCN.join("|")
        //method类m
        textareaTool().setTarget(that)
            .replace(/第[ ]+([一二三四五六七八九十])张[ ]+/g, '第$1张')
            .replace(/^相[ ]+等于$/mg, '相等于')
            .replace(/(?<=(选择对角色使用|视为使用))[ ]/g, '')
            .replace("此牌的目标 组", "此牌的目标组")
            .replace("此牌的已触发的 目标组", "此牌的已触发的目标组")
            .replace("受到 伤害 ", "受到伤害 ")
            .replace(/^选择结果 目标 ([数组])$/mg, '选择结果目标$1')
            .replace(/(?<=代为) (?=使用 |打出 |使用或打出 )/g, "")
            .replace(/体力值 (回复|恢复)至 /g, "体力值回复至 ")
            .replace(/(体力值|手牌数) 为全场最/g, "$1为全场最")
            .replace(/([有无])多目标 标签/g, "$1多目标标签")
            .replace(new RegExp(`无视[ ]+(${JOINED_PLAYAERCN})[ ]+防具的牌`, 'g'), "无视$1防具的牌")
        //处理空白字符
        NonameCN.deleteBlank2(that);
    }
    static deleteBlank2(that) {
        textareaTool().setTarget(that)
            .replace(/^\n+/g, "\n")
            .replace(/^[ ]+/mg, "")
            .replace(/[ ]+/g, " ")
            .replace(/[ ]+$/mg, "")
            .replace(/\s+$/g, '')
            .replace(/\n[ ]*\n/g, '\n')
            .replace(/(?<=\t)[ ]*/g, '')
            .replace(/\n\t*(?=\n)/g, '')
            .replace(/^[ ]*\n/g, "")
    }
    static underlieVariable(that) {
        textareaTool().setTarget(that)
            .replace(/(变量|常量|块变)/g, "$1 ")
            .replace(/令为/g, " 令为 ")
            .replace(/(?<=\w+)为/g, " 为 ")
            .replace(/(势力)为/g, "$1 为")
            .replace(/(?<!名|令|成|视)为(?!全场最[少多])(?!判定唯一[正负]收益)/g, '为 ')
            .replace(/令为\s*(.+?)且(向下取整|向上取整|四舍五入)$/mg, "令为 数学 $2 $1")
            .replace(/令为\s*(.+?)且至多为(.+?)$/mg, "令为 数学 最小值 $1 $2")
            .replace(/令为\s*(.+?)且至少为(.+?)$/mg, "令为 数学 最大值 $1 $2")
    }
    static standardBoolExpBefore(that) {
        const JOINED_PLAYAERCN = this.playerCN.join("|")
        textareaTool().setTarget(that)
            .replace(/≯/g, '不大于')
            .replace(/≮/g, '不小于')
            .replace(/(?<=有标记)(?![ ])/g, ' ')
            .replace(/^(.+?)[是为](男性|女性)$/mg, '$1 属于性别 $2')
            .replace(/^(.+?)不[是为](男性|女性)$/mg, '$1 不属于性别 $2')
            .replace(/^场上有(其他)?(男性|女性)(性别)?(角色)?$/mg, '游戏 统计场上$1$2数量 \n大于\n0')
            .replace(/^场上有(其他)?(魏|蜀|吴|群|晋|西|键|神)势力角色$/mg, '游戏 统计场上$1$2势力角色数量 \n大于\n0')
            .replace(/(".+?")标记的?数量/g, '统计标记 $1\n')
            .replace(/(手牌|装备|判定)区[内中]有牌/g, '$1区有牌')
            .replace(/拥?有空置?的?(.+?)栏/g, "有空置的$1栏")
            .replace(/(此|本次|本)?事件(不?是)[由因]?你(造成的|而起)/, '触发事件的来源\n并且\n触发事件的来源 $2 你')
            .replace(/此牌(不?[是为])你使用的/g, '使用此牌的角色 $1 你')
            .replace(/此牌(为|是)其他角色使用的/g, '使用此牌的角色 不为 你')
            .replace(/(.+?)是此牌的目标/g, "此牌的目标包含 $1")
            .replace(/^(.+?)(不?[为是])([冰火雷])杀$/mg, (match, ...p) => {
                return `获取 属性 ${p[0]}\n ${p[1]} \n ${p[2]}属性 \n ${p[1].includes("不") ? "或者" : "并且"} \n 获取 牌名 ${p[0]} \n ${p[1]} \n 杀`
            })
            .replace(/(.+?)(颜色)?(不?[为是])(黑|红|无)色$/mg, '获取 颜色 $1 \n $3 \n $4色')
            .replace(/(.+?)(花色)?(不?[为是])(梅花|黑桃|方片|红桃)$/mg, '获取 花色 $1 \n $3 \n $4')
            .replace(/(.+?)(类别)?(不?[为是])(非延时锦囊牌|延时锦囊牌|普通锦囊牌|基本牌|装备牌)$/mg, '获取 类别 $1 \n $3 \n $4')
            .replace(/(.+?)(类别)?(不?[为是])锦囊牌$/mg, '获取 广义类别 $1 \n $3 \n $4')
            .replace(/(?<=点数不?[为是])(A|J|Q|K)$/g, function (match, ...p) {
                const map = {
                    A: 1,
                    J: 11,
                    Q: 12,
                    K: 13
                }
                return `${map[p[0]]}`
            })
            .replace(/(.+?)点数(不?)(为|是|大于|小于|等于)(10|11|12|13|[1-9])$/mg, '获取 点数 $1\n $2$3 \n $4')
            .replace(/(.+?)(牌名)?(不?[为是])(杀|闪|桃|酒|无懈可击|决斗|闪电|乐不思蜀|兵粮寸断|桃园结义|[南][蛮]入侵|万箭齐发)$/mg, '获取 牌名 $1 \n $3 \n $4')
            .replace(/(.+?)(副类别)?(不?[为是])(武器牌|防具牌|\+1马牌|-1马牌|进攻马牌|防御马牌)$/mg, '获取 副类别 $1 \n $3 \n $4')
            .replace(/(.+?)在(.+?)的?攻击范围内$/mg, "$2 攻击范围内有 $1")
            .replace(/(没有)(.+?)标签/mg, "无$2标签")
            .replace(/(.+?)(有|无|带|不带)(伤害|多角色|多目标)标签/g, function (match, ...p) {
                if (p[0].includes("获取")) return match
                return `获取 ${p[1]}${p[2]}标签 ${p[0]}`
            })
            .replace(/(选择使用)一张(手?牌)/g, '$1$2')
            .replace(/(不?)(大于|小于|是|等于)/g, " $1$2 ")
            .replace(/[上拥]?有父事件[ ]*["']?(.+?)["']?$/mg, '获取名为$1的父事件的名字  不为 undefined')
            .replace(/不为/g, ' 不为 ')
            .replace(/(.+?)本回合未(使用|造成)过?(牌|伤害)$/mg, '$1本回合$2$3次数\n为\n0')
            .replace(/(.+?)本回合(使用|造成)过(牌|伤害)$/mg, '$1本回合$2$3次数\n大于\n0')
            .replace(/^(.+?)本回合未对(.+?)造成过?伤害$/mg, '$1 本回合对角色造成伤害的次数 $2\n等于\n0')
            .replace(/本回合的?出牌阶段(使用|打出)([^卡牌]+?)的?次数$/mg, "本回合出牌阶段$1某牌的次数 $2")
            .replace(/本回合的?出牌阶段(使用|打出)过([^卡牌]+?)$/mg, "本回合出牌阶段$1某牌的次数 $2\n大于\n0")
            .replace(/本回合的?出牌阶段(没有|未)(使用|打出)过([^卡牌]+?)$/mg, "本回合出牌阶段$2某牌的次数 $3\n等于\n0")
            .replace(/的一半/g, ' 除以 2')
            .replace(/的三分之一/g, ' 除以 3')
            .replace(/的四分之一/g, ' 除以 4')
            .replace(/的八分之一/g, ' 除以 8')
            .replace(/获取技能(.+?)的?使用次数/g, '获取 技能使用次数 $1')
            .replace(/(?<!游戏 统计)场上势力数/g, '游戏 统计场上势力数')
    }
    static standardModBefore(that) {
        textareaTool().setTarget(that)
            .replace(/你使用的?([\u4e00-\u9fa5]+?)无(距离和次数|次数和距离|距离和数量|数量和距离)限制/g, function (match, ...p) {
                return `你使用的${p[0]}无距离限制，你使用的${p[0]}无次数限制`
            })
    }
    static standardShort(that) {
        textareaTool().setTarget(that)
            .replace(/若(你|游戏)/g, "如果 $1")
            .replace(/游戏轮数/g, '游戏 轮数')
            .replace(/(其他|其它)+/g, "其他")
            .replace(/体力(?!上限|值)/g, '体力值')
            .replace(/区域(里|内)的?/g, "区域内")
            .replace(/然后/g, '\n')
    }
    static standardEffectBefore(that) {
        textareaTool().setTarget(that)
            .replace(/额外执行一个/g, "执行一个额外的")
            .replace(/获得此牌$/mg, "获得牌 此牌")
            .replace(/可以(失去.+?点体力|受到.+?点伤害|摸.+?张牌)/g, function (match, ...p) {
                return match.replace("可以", "")
            })
            .replace(/(.+?)对([\u4e00-\u9fa5]+?)造成(.*?)点(火属性|雷属性|冰属性)?伤害/g, '$2 受到伤害 $1 $3点 $4')
            .replace(/(.+?)\s*(可以)?获得(你|伤害来源|当前回合角色)(.*?)张(手牌|牌)/g, function (match, ...p) {
                return match.replace("可以", "").replace("获得", "获得角色")
            })
            .replace(/(?<=随机)弃(?!置)/g, '弃置')
            .replace(/(将体力值回复至)([0-9a-z])(?!点)/g, "$1$2点")
            .replace(/(你使用)?此牌(不可|无法)被(闪避|响应)/g, "不可响应牌的角色 添多 此牌的目标组")
            .replace(/(你使用)?此牌(不可|无法)被(.+?)(闪避|响应)/g, "不可响应牌的角色 添单 $3")
            .replace(/(你使用)?此牌无视(.+?)的?防具/g, "$2 本回合被破甲\n无视$2防具的牌 添单 此牌")
            .replace(/^此牌取消(.+?)为目标$/mg, '此牌的目标组 移除 $1\n此牌的已触发的目标组 移除 $1')
            .replace(/你?令?此牌对(你)无效/g, "无效的角色 添单 $1")
            .replace(/^(.+?)视为对(.+?)使用(.+?)张(不可被无懈可击响应)?[的、]?(不计入次数)?[的、]?(不影响ai)?的?(.+?)$/mg, '$1 视为使用$7 $2 $3张 $4 $5 $6')
            .replace(/(?<=弃置区域内)(?=所有牌)/g, '的')
            .replace(/(.+?)防止触发事件$/g, '触发事件 取消')
            .replace(/(使用|打出)(杀|闪|桃|酒|无懈可击)次数/g, "$1的$2次数")
            .replace(/(?<!不能使用|不能打出)(?<=使用|打出)(?=(杀|闪|桃|酒|无懈可击)[ ]*$)/mg, " ")
            .replace(/(.+?)展示牌堆顶的?(.+?张)牌(\(放回\))?$/g, "event.topCards = 获取 牌堆顶牌组$3 $2\n$1 展示牌 event.topCards")
            .replace(/(.+?)展示牌堆底的?(.+?张)牌(\(放回\))?$/g, "event.bottomCards = 获取 牌堆底牌组$3 $2\n $1 展示牌 event.bottomCards")
            .replace(/^销毁(此牌|卡牌)/mg, '$1 修正\n$1 移除\n$1 已销毁 令为 真\n游戏 日志 $1 "已销毁"')
    }
    static standardEeffectMid(that) {
        textareaTool().setTarget(that)
            .replace(/(该|此)回合的?/g, "本回合")
            .replace(/(再|各)摸/g, "摸")
            .replace(/可以获得(?=.*牌)/g, " 获得牌 ")
            .replace('的事件', "事件")
            .replace(/^(.+?)(?<!\[)(?<!:)(".+?")(?!\])(.+?)$/mg, '$1$3 $2')
            .replace(/(选择|判定)事件(?![ ])/g, '$1事件 ')
            .replace(/(?<=事件)(?=取消)$/mg, ' ')
    }
    static standardEeffect(that) {
        textareaTool().setTarget(that)
            .replace(/(?<=获得|拥有|统计|移去)标记/g, "标记 ")
    }
    static standardFilter(that) {
        textareaTool().setTarget(that)
            //"(获取) 类别(...) ?"
            .replace(/^(?<=获取)(.+?)的?(类别|副类别|颜色|花色|点数|id)$/mg, ` $2 $1`)
            //"你(...) 获取手牌区(...)牌"
            .replace(/(获取)(.+?)\s*的?(手牌区|装备区|判定区)[内中]?的?牌$/mg, '$2 $1$3牌')
            //"你(...) 获取区域内牌 基本牌(..)"
            .replace(/(获取)(.+?)\s*的?(区域)[内中]的牌$/mg, '$2 $1$3内牌')
    }
    static standardFilterCardBef(that) {
        textareaTool().setTarget(that)

    }
    static standardFilterTargetBef(that) {
        textareaTool().setTarget(that)
            .replace(/^其他角色$/mg, '目标 不是 你')
    }
    static standardEvent(that) {
        //处理事件描述
        textareaTool().setTarget(that)
            .replace(/血量/g, "体力")
            .replace(/流失体力/g, "失去体力")
            .replace(/横置\/重置/g, "横置或重置")
            .replace(/(?<=置)于(?=判定区|装备区|弃牌堆)/g, "入")
            .replace("扣置", "置")
            .replace("恢复体力", "回复体力")
    }
    static standardTriBefore(that) {
        textareaTool().setTarget(that)
            .replace(/之(前|时|后)/g, "$1")
            .replace(/的判定牌生效/g, '判定牌生效')
            .replace(/(?<=你|一名角色)的?判定区被?置入(延时)?类?(锦囊)?牌/g, "牌置入判定区")
            .replace(/(?<=你|一名角色)的?装备区被?置入(装备)?牌/g, "牌置入装备区")
            .replace(/场上(的|有)?(延时)?类?(锦囊)?牌被?置入判定区/g, "一名角色牌置入判定区")
            .replace(/场上(的|有)?(装备)?牌被?置入判定区/g, "一名角色牌置入装备区")
            .replace(/体力值?减少(时|前|开始时|结束时|后)/g, "失去体力$1 受到伤害$1")
    }
    static standardTri(that) {
        textareaTool().setTarget(that)
            .replace(/(?<=濒死)(状态|阶段)/g, "状态")
            .replace(/([\u4e00-\u9fa5]*?)使用或打出([\u4e00-\u9fa5]+)/g, function (match, ...p) {
                return `${p[0]}使用${p[1]} ${p[0]}打出${p[1]}`;
            })
    }
    static implicitText_content(text) {
        let result = text
            .replace(/(.+?)[ ]*执行(一个)?额外的?(准备|判定|出牌|摸牌|弃牌|结束)阶段/g, `阶段列表 剪接 当前回合序号 0 $3阶段|\\-skillID`)
        console.log("content", result);
        return result;
    }
    static implicitText_filterCard(text) {
        let result = text
            .replace(/^卡牌(花色|点数|牌名|颜色|类型|副类别|类别)(相同|不同)$/mg, '获取 当前选择的卡牌$1是否$2')
        console.log("filterCard", result);
        return result;
    }
    //处理模拟代码块
    static replace(undisposed) {
        let list = Object.keys(this.packedCodeRePlaceMap).filter(str => undisposed.includes(str));
        for (let k of list) {
            undisposed = this.packedCodeRePlaceMap[k](undisposed);
        }
        return undisposed.split('\n')
    }
    static analyzeThisCard(triggerList, event) {
        const List = [].concat(...Object.values(triggerList));
        if (List.length === 1) {
            const trigger = List[0]
            if (trigger.startsWith("judge")) return event ? `event.result.card` : `trigger.result.card`
            return event ? `event.card` : `trigger.card`
        }
    }
    static analyzeTheseCard(triggerList, event) {
        const List = [...Object.values(triggerList)];
        if (List.length === 1) {
            const trigger = List[0]
            if (trigger.startsWith("judge")) return event ? `[event.result.card]` : `[trigger.result.card]`
            return event ? `event.cards` : `trigger.cards`
        }
    }
    static analyzeViewAsData(back, i = 0) {
        const { viewAs, viewAsCondition, id, viewAsFrequency } = back.skill;
        const condition = viewAsCondition[i]
        let asCard = viewAs[i]
        if (!condition || !asCard) return {};
        let asCardType;
        let asNature;
        let costName = condition.startsWith("cardName-") && condition.slice(9)
        let costNature, costColor, costSuit;
        let position = get.type(costName) == "type" ? "'hes'" : "'hs'"
        let needCard = true;
        let preEve;
        let selectCard;
        let conditionBool;
        if (asCard.startsWith('cardType-')) {
            asCardType = asCard.slice(9);
        }
        if (asCard.startsWith("nature-")) {
            let list = asCard.slice(7).split(":")
            asNature = list[0];
            asCard = list[1];
        }
        if (costName && costName.startsWith("nature-")) {
            let list = costName.slice(7).split(":")
            costNature = list[0];
            costName = list[1];
        }
        if (condition.startsWith("color-pos-")) {
            let list = condition.slice(10).split(":");
            position = list[0]
            costColor = list[1];
        }
        if (condition.startsWith("suit-pos-")) {
            let list = condition.slice(9).split(":");
            position = list[0]
            costSuit = list[1];
        }
        if (condition.startsWith("preEve-link-")) {
            conditionBool = condition.slice(12);
            preEve = "link"
            selectCard = '-1'
            needCard = false
        }
        return {
            asCard, asCardType, asNature,
            costName, costNature, costColor, costSuit, position, needCard,
            preEve, selectCard, conditionBool, condition,
            viewAsFrequency, id
        }
    }
    static getVirtualPlayer() {
        const player = ui.create.player();
        player.init('xjb_caocao');
        Object.values(this.groupedList.packed_playerCode).forEach(method => player[method] = () => { })
        return player;
    }
    static getVirtualGame() {
        const vGame = new game.constructor()
        Object.values(this.groupedList.packed_gameCode).forEach(method => vGame[method] = () => { })
        return vGame;
    }
    static getVirtualEvent() {
        return {
            ..._status.event,
            num: 1,
            targetprompt: '1',
            getParent: () => true,
            filterTarget: () => true,
            "set": () => true,
            cancel: () => true,
            forResult: () => true,
            goto: () => true,
            redo: () => true,
            finish: () => true,
            notLink: () => true,
        }
    }
    static getVirtualCard() {
        const vCardObj = game.createCard();
        vCardObj.destroyed = true;
        return vCardObj;
    }
    static getVirtualStorage() {
        const vStorageObj = new Array(1).fill();
        return vStorageObj;
    }
    static getVirtualPlayers() {
        const players = new Array();
        const player = ui.create.player()
        for (const attr in player) {
            players[attr] = typeof player[attr] === 'function' ? () => true : true;
        }
        return players;
    }
    static disposeWithQuo(body, toDispose = '', matchNotObjColon = /(?<!\{[ \w"']+):(?![ \w"']+\})/) {
        let arrA = toDispose.includes(';') ? toDispose.split(';') : toDispose.split(matchNotObjColon);
        let arrB = [];
        let result = ''
        arrA = arrA.filter(each => {
            if (each.startsWith("//!?")) {
                arrB.push(each.replace("//!?", ""))
                return false;
            }
            return true;
        })
        let verbA = arrA.shift()
        if (body[verbA] || body === "ignore") {
            result += '.' + verbA;
            result += '(';
            result += arrA.join(',');
            result += ')';
            if (arrB.length) {
                result += '.'
                result += arrB.join('.')
            }
        } else {
            result += toDispose;
        }
        return result;
    }
    static disposeWhen(sentence) {
        let result = sentence;
        result = result.replace(/(.+?)(when\(.+?\)\.)(.+)$/, '$1$2then(()=>{\n$1$3;\n})')
        return result;
    }
    static disposePlayers(sentence, players) {
        let result = sentence, api;
        api = sentence.replaceAll(players, '').replaceAll('.', '').replace(/\(.*/, '');
        if (![][api]) {
            result = result.replace(players, 'i');
            result = players + '.forEach(i=>' + result + ')';
        }
        return result;
    }
    static disposeNeedTrans(sentence) {
        let [result, temp] = sentence.split('//!?')
        temp = `.${temp}`.replace(',', '(')
        result = `${result})${temp}`.replaceAll(',)', ')')
        return result;
    }
    //
    static orderSteps(str) {
        let step = 0
        return str.replace(/('step[ ]*\d*'|"step[ ]*\d*")/g, () => {
            return `"step ${step++}"`;
        });
    }
    //技能各部分的组装
    static GenerateOpening(back) {
        let result = '';
        const { mode, id } = back.skill
        if (mode === 'mt') {
            result = '"' + id + '":{\n'
        } else if (mode === 'mainCode') {
            result = 'lib.skill["' + id + '"]={\n'
        }
        return result;
    }
    static GenerateInit(back) {
        let result = ''
        const bool1 = back.skill.type.includes("mainSkill");
        const bool2 = back.skill.type.includes("viceSkill");
        if (!bool1 && !bool2) return result;
        result += "init:function(player,skill){\n"
        if (bool1) {
            result += `const bool = player.checkMainSkill("${back.skill.id}");\n`
        }
        if (bool2) {
            result += `const bool = player.checkViceSkill("${back.skill.id}")\n&& !player.viceChanged;\n`
        }
        if (back.skill.uniqueList.includes("mainVice-remove1")) {
            result += `bool && player.removeMaxHp();\n`
        }
        result += '},\n'
        return result
    }
    static GenerateMod(back) {
        const { mod, custom } = back.skill;
        let result = '';
        if (!mod.length && !custom.mod) return result;
        const that = this;
        result += "mod:{\n";
        const getFilter = function (line, ...label) {
            if ([' || ', ' && '].includes(line)) result += '\n'
            if (label.includes("playerIsTarget")) line = line.replace(/player/g, "target")
            result += line;
            if (['{', '}'].includes(line)) result += '\n';
        }
        if (mod.lengthOfCardUsable) {
            result += "cardUsable:function(card,player,num){\n"
            mod.cardUsable_Infinity.forEach(condition => {
                if (condition === "all") result += "return Infinity;\n";
                else if (condition.includes(':')) {
                    let list = condition.split(":");
                    let cdt0 = list[0];
                    let cdt1 = list[1]
                    if (cdt1.includes('-')) {
                        cdt1 = cdt1.split('-')
                    }
                    result += `if(${that.getStrFormFunc(cdt0, cdt1)}) return Infinity;\n`
                }
                else getFilter(condition)
            })
            result += "},\n"
        }
        if (mod.lengthOfCardEnabled) {
            result += "cardEnabled:function(card){\n"
            mod.cardEnabled_false.forEach(condition => {
                if (condition === "all") result += "return false;\n";
                else if (condition.includes(':')) {
                    let list = condition.split(":");
                    let cdt0 = list[0];
                    let cdt1 = list[1]
                    if (cdt1.includes('-')) {
                        cdt1 = cdt1.split('-')
                    }
                    result += `if(${that.getStrFormFunc(cdt0, cdt1, true)}) return false;\n`
                }
                else getFilter(condition)
            })
            result += "},\n"
        }
        if (mod.lengthOfTargetInRange) {
            result += "targetInRange:function(card,player,target,now){\n"
            mod.targetInRange_Infinity.forEach(condition => {
                if (condition === "all") result += "return true;\n";
                else if (condition.includes(':')) {
                    let list = condition.split(":");
                    let cdt0 = list[0];
                    let cdt1 = list[1]
                    if (cdt1.includes('-')) {
                        cdt1 = cdt1.split('-')
                    }
                    result += `if(${that.getStrFormFunc(cdt0, cdt1)}) return true;\n`
                }
                else getFilter(condition)
            })
            result += "},\n"
        }
        if (mod.lengthOfTargetEnabled) {
            result += "targetEnabled:function(card,player,target,now){\n"
            mod.targetEnabled_false.forEach(condition => {
                if (condition === "all") result += "return false;\n";
                else if (condition.includes(':')) {
                    let list = condition.split(":");
                    let cdt0 = list[0];
                    let cdt1 = list[1];
                    if (cdt1.includes('-')) {
                        cdt1 = cdt1.split('-');
                    }
                    result += `if(${that.getStrFormFunc(cdt0, cdt1)}) return false;\n`;
                }
                else getFilter(condition, "playerIsTarget")
            })
            result += "},\n";
        }
        if (mod.lengthOfGlobalFrom) {
            result += `globalFrom:function(from,to,current){\n`
            if (mod.globalFrom.every(line => line.includes(':'))) {
                let number = mod.globalFrom.reduce((acc, cur) => {
                    let list = cur.split(":");
                    let cdt0 = list[0];
                    let cdt1 = parseInt(list[1]);
                    return cdt0 === "+" ? acc + cdt1 : acc - cdt1;
                }, 0);
                if (!number) number = `+0`
                if (number > 0) number = `+${number}`
                result += `return distance${number};\n`
            } else {
                mod.globalFrom.forEach(condition => {
                    if (condition.includes(':')) {
                        let list = condition.split(":");
                        let cdt0 = list[0];
                        let cdt1 = list[1];
                        result += `return distance${cdt0}${cdt1};\n`;
                    }
                    else getFilter(condition)
                })
            }
            result += "},\n"
        }
        if (mod.lengthOfGlobalTo) {
            result += `globalTo:function(from,to,current){\n`
            if (mod.globalTo.every(line => line.includes(':'))) {
                let number = mod.globalTo.reduce((acc, cur) => {
                    let list = cur.split(":");
                    let cdt0 = list[0];
                    let cdt1 = parseInt(list[1]);
                    return cdt0 === "+" ? acc + cdt1 : acc - cdt1;
                }, 0);
                if (!number) number = `+0`
                if (number > 0) number = `+${number}`
                result += `return distance${number};\n`
            } else {
                mod.globalTo.forEach(condition => {
                    if (condition.includes(':')) {
                        let list = condition.split(":");
                        let cdt0 = list[0];
                        let cdt1 = list[1];
                        result += `return distance${cdt0}${cdt1};\n`;
                    }
                    else getFilter(condition)
                })
            }
            result += "},\n"
        }
        if (custom.mod) result += NonameCN.getStrNormalFunc(custom.mod)
        result += "},\n";
        return result
    }
    static GenerateKind(back) {
        let result = '';
        const { kind, trigger } = back.skill;
        if (kind === 'trigger') {
            /*开头*/
            result += 'trigger:{\n';
            /*添加函数的制作*/
            let addTrigger = (value) => {
                if (trigger[value].length === 0) return false;
                result += value;
                result += ':[';
                trigger[value].forEach((i, k) => {
                    result += '"' + i + '"';
                    result += (k == trigger[value].length - 1 ? '' : ',');
                })
                result += '],\n';
            }
            ["player", "global", "source", "target"].forEach(TriA => {
                addTrigger(TriA);
            })
            /*结束*/
            result += '},\n';
        }
        else if (kind) {
            result += kind + ',\n';
        }
        return result;
    }
    static GenerateTag(back) {
        const { marktext, markName, markContent,
            prompt, prompt2,
            type, kind, filterTarget, filterCard,
            uniqueList } = back.skill
        let result = ''
        if (marktext && marktext.length) {
            result += `marktext:"${marktext}",\n`
        };
        if (markName && markContent) {
            result += 'intro:{\n';
            result += `name:"${markName}",\n`
            result += `content:"${markContent}",\n`
            result += '},\n';
        }
        if (prompt) {
            result += `prompt:"${prompt}",\n`
        }
        if (prompt2) {
            result += `prompt2:"${prompt2}",\n`
        }
        //遍历技能类别
        type.forEach(i => {
            if (i === 'filterTarget'
                && (kind != 'enable:"phaseUse"' || filterTarget.length > 0)) return;
            else if (i === 'filterCard'
                && (kind != 'enable:"phaseUse"' || filterCard.length > 0)) return;
            else if (i === 'groupSkill') {
                const group = findPrefix(uniqueList, "group").map(k => k.slice(6))
                if (group.length > 0) {
                    result += `groupSkill:"${group[0]}",\n`;
                    return;
                }
            }
            else if (["usable", "round"].includes(i)) {
                result += `${i}:1,\n`
                return;
            }
            else if (["lose-false", "discard-false", "delay-false"].includes(i)) {
                result += `${i.replace('-false', '')}:false,\n`
                return;
            }
            result += `${i}:true,\n`;
        })
        if (type.includes("locked-false")) {
            result = result.replaceAll('locked-false:true', "locked:false")
            result = result.replaceAll('locked:true,\n', "")
        }
        if (uniqueList.some(tag => tag.includes("animation-"))) {
            const animation = findPrefix(uniqueList, "animation").map(k => k.slice(10))
            result += `animationColor:"${animation}",\n`
        }
        return result;
    }
    static GenerateGetIndex(back) {
        let result = ''
        const { getIndex } = back.skill;
        if (!getIndex) return ''
        result += `getIndex:function(event,player,triggername){\n`
        result += `return event.num;\n`
        result += `},\n`
        return result;
    }
    static TestFilterOk(str, lineNum) {
        let func
        const test = str.replace("filter:function(event,player,triggername){", '')
        console.log(test)
        try {
            func = new Function("event", "player", "triggername", test);
        } catch (err) {
            console.log(err, lineNum);
            return false;
        }
        console.log(func)
        return true;
    }
    static GenerateFilter(back, asCardType) {
        const { id, type, uniqueList, trigger, filter,
            filter_card, filter_suit, filter_color,
            uniqueTrigger, variableArea_filter, filter_ignoreIndex,
            mod } = back.skill;
        const boolZhuSkill = type.includes("zhuSkill");
        const boolGroupSkill = type.includes("groupSkill");
        const boolRespondNeed = (trigger.player.includes("chooseToRespondBegin")
            || trigger.player.includes("chooseToRespondBefore"));
        const boolTri_filterCardNeed = back.skill.tri_filterCard.length > 0;
        const boolFilter_Card = filter_card.length > 0;
        const boolFilter_Suit = filter_suit.length > 0;
        const boolFilter_Color = filter_color.length > 0;
        const boolUniqueTrigger = uniqueTrigger.length > 0;
        const boolfilterHasContent = filter.length > 0;
        const boolOnlyMod = mod.length > 0
            && [boolZhuSkill, boolGroupSkill, boolRespondNeed,
                boolTri_filterCardNeed,
                boolFilter_Card, boolFilter_Color, boolTri_filterCardNeed,
                boolUniqueTrigger, boolfilterHasContent].every(bool => bool === false)
        if (boolOnlyMod) return ''
        let result = '';
        result += 'filter:function(event,player,triggername){\n'
        if (variableArea_filter.length) result += variableArea_filter.join("\n") + "\n"
        //主公技
        if (boolZhuSkill) {
            result += `if(! player.hasZhuSkill("${id}")) return false;\n`;
        }
        //势力技
        if (boolGroupSkill) {
            const group = findPrefix(uniqueList, "group").map(k => k.slice(6))
            if (group.length > 0) {
                result += `if(player.group != "${group[0]}") return false;\n`
            }
        }
        //respond
        if (boolRespondNeed) {
            result += "if(event.responded) return false;\n"
        }
        if (boolTri_filterCardNeed) {
            back.skill.tri_filterCard.forEach(resp => {
                result += `if(!event.filterCard({name:"${resp}",isCard:true},player,event)) return false;\n`
            })
        }
        if (asCardType) {
            result += `if(!get.info("${id}").buttonRequire(player,event)) return false;\n`
        }
        const filterCardDispose = (filterCardType, standard) => {
            const filterTypeList = back.skill["filter_" + filterCardType].map(x => {
                return x.replace(/:.*$/, "")
            })
            const filterContentList = back.skill["filter_" + filterCardType].map(x => {
                return x.replace(/[^:\n]*:/, "")
            })
            let filterTypeAllList = new Set(filterTypeList)
            filterTypeAllList.forEach(x => {
                let arrList = filterContentList.filter((item, index) => {
                    return filterTypeList[index] === x;
                })
                let tempStr = arrList.join()
                if (x === "useCardAfter") result += `if(event.name==='useCard'&&! [${tempStr}].includes(get.${standard}(event.card))) return false;\n`
                else result += `if(event.name==='${x}'&&! [${tempStr}].includes(get.${standard}(event.card))) return false;\n`
            })
        }
        if (boolfilterHasContent) {
            const stack = [], subStack = [];
            for (const [k, i] of filter.entries()) {
                if (filter_ignoreIndex.includes(k)) break;
                //如果是空字符，则不处理
                if (i === "") break;
                if (/^[ ]+$/.test(i)) break;
                subStack.push(i)
                const str = subStack.join("\n")
                if (EditorOrganize.testSentenceIsOk(str)) {
                    subStack.length = 0;
                    stack.push(str);
                } else if (stack.length) {
                    const temp = [];
                    for (let n = 0; n < stack.length; n++) {
                        temp.unshift(stack.pop());
                        const funStr = `${temp.join("\n")}\n${str}`
                        if (EditorOrganize.testSentenceIsOk(funStr)) {
                            stack.push(funStr);
                            subStack.length = 0;
                            temp.length = 0;
                            break;
                        }
                    }
                    stack.push(...temp);
                }
            }
            if (subStack.length) {
                result += filter.join("\n");
            } else if (stack.length) {
                result += stack.map(line => {
                    const testStr = `if(!(${line})) return false;`
                    if (EditorOrganize.testSentenceIsOk(testStr)) return testStr;
                    return line;
                })
                    .join("\n")
                    .replace(/\n (\|\||&&) \n/g, " $1 ")
                    .replace(/^if\(\n(.+)\n\)\n{/mg, "if($1){")
                    .replace(/else\n{/g, "else{")
            }
            result += "\n"
        }
        if (!back.returnIgnore && !result.endsWith('\n')) result += '\n'
        if (boolFilter_Card) filterCardDispose('card', 'name');
        if (boolFilter_Suit) filterCardDispose('suit', 'suit');
        if (boolFilter_Color) filterCardDispose('color', 'color')
        if (boolUniqueTrigger) {
            if (uniqueTrigger.some(x => x.includes("outPhase"))) {
                const outPhaseList = uniqueTrigger.filter(x => x.includes("outPhase")).map(x => x.replace('outPhase:', ''))
                outPhaseList.forEach(x => {
                    const add = x === 'lose' ? '' : `event.name==="${x}"&&`
                    result += `if(${add}player===_status.currentPhase) return false;\n`
                })
            }
            if (uniqueTrigger.some(x => x.includes("inPhase"))) {
                const inPhaseList = uniqueTrigger.filter(x => x.includes("inPhase")).map(x => x.replace('inPhase:', ''))
                inPhaseList.forEach(x => {
                    const add = x === 'lose' ? '' : `event.name==="${x}"&&`
                    result += `if(${add}player!==_status.currentPhase) return false;\n`
                })
            }
            if (uniqueTrigger.includes('player:loseAfter')) {
                result += `if(event.name==="gain"&&event.player==player) return false;\n`
                result += `if(!(event.getl(player)&&event.getl(player).cards2&&event.getl(player).cards.length>0)) return false;\n`
            } else if (uniqueTrigger.includes('player:loseAfter:h')) {
                result += `if(event.name==="gain"&&event.player==player) return false;\n`
                result += `if(!(event.getl(player)&&event.getl(player).hs&&event.getl(player).hs.length>0)) return false;\n`
            } else if (uniqueTrigger.includes('player:loseAfter:discard')) {
                result += `if(!(event.type==='discard'&&event.getl(player).cards2.length>0)) return false;\n`
            }
        }
        if (!back.returnIgnore) result += 'return true;\n';
        result += '},\n';
        return result
    }
    static GenerateButtonRequire(back, i = 0) {
        const {
            asCardType,
            costName, costNature, costColor, costSuit,
            position, needCard,
            preEve, conditionBool, id, viewAsFrequency
        } = this.analyzeViewAsData(back, i)
        let result = '';
        result += `buttonRequire:function(player,event){\n`
        result += `const hasCardCanUse = lib.inpile.some(cardName=>{\n`
        result += `if(get.type(cardName${asCardType === "tirck2" ? ',"trick"' : ""}) !== "${asCardType.replaceAll(/\d/g, '')}") return false;\n`
        result += `if(!event.filterCard({name:cardName},player,event)) return false;\n`;
        if (viewAsFrequency.some(condition => {
            return NonameCN.viewAsFrequencyList.includes(condition);
        })) {
            result += `if(player.storage["${id}_used"]\n`
            result += ` && player.storage["${id}_used"].includes(cardName)) return false;\n`;
        }
        result += `return true;\n`;
        result += `})\n`;
        result += `if(!hasCardCanUse) return false;\n`;
        result += this.GenerateViewAsFilter({ costName, costNature, costColor, costSuit, needCard, preEve, conditionBool, position })
        result += `},\n`
        return result;
    }
    static GeneratePosition(back) {
        const { position } = back.skill;
        if (!position.length || position.toString() === "h") return '';
        return `position:"${position.join("")}",\n`
    }
    static GenerateFilterCard(back) {
        let result = '';
        let IF = false;
        let branch = 0
        const { id, type, filterCard } = back.skill
        result += 'filterCard:function(card){\n'
        filterCard.forEach((i, k) => {
            //如果是空字符，则不处理
            if (i === "") return;
            const previousLine = k ? filterCard[k - 1] : ''
            const nextLine = k < filterCard.length - 1 ? filterCard[k + 1] : ''
            const logicWords = [" > ", " < ", " >= ", " <= ", " == ", " != ", " === ", " !== ", " || ", " && "]
            //如果含赋值语句或本身就有return，则不添加return
            if (i.includes("return")
                || i.includes("var ") || i.includes("let ") || i.includes("const ")
                || i.includes(" = ") || i.includes(" += ") || i.includes(" -= ")
                || i.includes(" /= ") || i.includes(" *= ") || i.includes(" %= ")
                || i.includes(" >>= ") || i.includes(" <<= ") || i.includes(" **= ")
                || i.includes("++") || i.includes("--")) {
                result += i + '\n'
            }
            else if (i === 'if(') {
                result += i;
                IF = true
            }
            else if (i === ")") {
                result += i;
                IF = false;
            }
            else if (IF === true) {
                if ([' || ', ' && '].includes(i)) result += '\n'
                result += i;
            }
            else if (i === '{') {
                result += '{\n';
                branch++;
            }
            else if (i === '}') {
                result += '}\n';
                branch--;
            }
            else if (branch > 0) {
                result += i + '\n'
            }
            else if (!logicWords.includes(previousLine)
                && logicWords.includes(nextLine)) {
                result += 'if(! ('
                result += i
            }
            else if (logicWords.includes(previousLine)
                && !logicWords.includes(nextLine)) {
                result += i
                result += ')) return false;\n'
            }
            else if (logicWords.includes(previousLine)
                && logicWords.includes(nextLine)) {
                result += i
            }
            else if ([' || ', ' && '].includes(i)) {
                result += '\n' + i
            }
            else if (logicWords.includes(i)) {
                result += i
            }
            else {
                result += 'if(! (' + i + ')) return false;\n'
            }
        });
        if (!result.endsWith('\n')) result += '\n'
        result += 'return true;\n';
        result += '},\n';
        return result
    }
    static GenerateFilterTarget(back) {
        let result = '';
        let IF = false;
        let branch = 0
        const { id, type, filterTarget } = back.skill
        result += 'filterTarget:function(card,player,target){\n'
        filterTarget.forEach((i, k) => {
            //如果是空字符，则不处理
            if (i === "") return;
            const previousLine = k ? filterTarget[k - 1] : ''
            const nextLine = k < filterTarget.length - 1 ? filterTarget[k + 1] : ''
            const logicWords = [" > ", " < ", " >= ", " <= ", " == ", " != ", " === ", " !== ", " || ", " && "]
            //如果含赋值语句或本身就有return，则不添加return
            if (i.includes("return")
                || i.includes("var ") || i.includes("let ") || i.includes("const ")
                || i.includes(" = ") || i.includes(" += ") || i.includes(" -= ")
                || i.includes(" /= ") || i.includes(" *= ") || i.includes(" %= ")
                || i.includes(" >>= ") || i.includes(" <<= ") || i.includes(" **= ")
                || i.includes("++") || i.includes("--")) {
                result += i + '\n'
            }
            else if (i === 'if(') {
                result += i;
                IF = true
            }
            else if (i === ")") {
                result += i;
                IF = false;
            }
            else if (IF === true) {
                if ([' || ', ' && '].includes(i)) result += '\n'
                result += i;
            }
            else if (i === '{') {
                result += '{\n';
                branch++;
            }
            else if (i === '}') {
                result += '}\n';
                branch--;
            }
            else if (branch > 0) {
                result += i + '\n'
            }
            else if (!logicWords.includes(previousLine)
                && logicWords.includes(nextLine)) {
                result += 'if(! ('
                result += i
            }
            else if (logicWords.includes(previousLine)
                && !logicWords.includes(nextLine)) {
                result += i
                result += ')) return false;\n'
            }
            else if (logicWords.includes(previousLine)
                && logicWords.includes(nextLine)) {
                result += i
            }
            else if ([' || ', ' && '].includes(i)) {
                result += '\n' + i
            }
            else if (logicWords.includes(i)) {
                result += i
            }
            else {
                result += 'if(! (' + i + ')) return false;\n'
            }
        });
        if (!result.endsWith('\n')) result += '\n'
        result += 'return true;\n';
        result += '},\n';
        return result
    }
    static GenerateEnable(back) {
        const { kind, type, filterTarget, filterCard, selectCard, selectTarget } = back.skill;
        let result = ''
        if (kind !== 'enable:"phaseUse"') return result
        if (filterTarget.length > 0 && type.includes('filterTarget')) {
            result += NonameCN.GenerateFilterTarget(back);
        }
        if (filterCard.length > 0 && type.includes('filterCard')) {
            result += NonameCN.GenerateFilterCard(back);
        }
        if (selectTarget.length > 0) result += `selectTarget:${selectTarget},\n`
        if (selectCard.length > 0) result += `selectCard:${selectCard},\n`
        result += NonameCN.GeneratePosition(back);
        return result;
    }
    static GenerateCost(back) {
        const { custom } = back.skill
        if (!custom.cost) return '';
        let result = `cost:${NonameCN.getStrNormalFunc(custom.cost).slice(0, -1)},\n`;
        return result;
    }
    static GenerateJudgeCallback(back) {
        const { custom } = back.skill;
        if (!custom.judgeCallback) return '';
        let result = `judgeCallback:${NonameCN.getStrNormalFunc(custom.judgeCallback).slice(0, -1)},\n`;
        return NonameCN.orderSteps(result);
    }
    static GenerateContent(back) {
        const { contentAsync, type, content,
            id, mod, kind, content_ignoreIndex } = back.skill;
        const boolIsAwakeSkill = type.filter(i => {
            return ["limited", "juexingji", "dutySkill"].includes(i)
        }).length > 0;
        const boolIsZhuanhuanSkill = type.includes('zhuanhuanji');
        const boolHasContent = content.length > 0;
        const boolOnlyMod = mod.length > 0
            && [boolIsAwakeSkill, boolIsZhuanhuanSkill, boolHasContent].every(bool => bool === false)
        if (boolOnlyMod) return ''
        let result = ''
        let step = -1, bool, IF = false, branch = 0, afterBranch = [];
        function addStepForChoose() {
            result += '"step ' + step + '"\n'
            bool = false;
        }
        result += contentAsync ? 'content:async function(event,trigger,player){\n' : 'content:function(){\n';
        if (!contentAsync) {
            result += '"step 0"\n';
            step = 0;
        }
        if (boolIsAwakeSkill) result += 'player.awakenSkill("' + id + '");\n';
        if (boolIsZhuanhuanSkill) result += 'player.changeZhuanhuanji("' + id + '");\n';
        const conditionList = [
            'if(result.bool){',
            'if(result.bool===true){'
        ];
        let previousLine = '';
        if (boolHasContent) back.skill.content.forEach((i, lineNum) => {
            if (content_ignoreIndex.includes(lineNum)) return;
            if (back.ContentInherit) return (result += `${i}\n`);
            let modifiedLine = i;
            if (i.indexOf("'step") >= 0 || i.indexOf('"step') >= 0) {
                let k = i
                k = k.replace(/("|'|step| )/g, '')
                step++
                modifiedLine = '"step ' + step + '"'
                bool = false
            } else if (i.includes('result.targets') && !bool) {
                modifiedLine = 'if(result.bool) ' + i
            } else {
                for (const condition of conditionList) {
                    if (!i.startsWith(condition)) continue;
                    bool = true; break;
                }
            }
            if (i.includes('chooseTarget')) {
                if (modifiedLine.indexOf('other') > 0) {
                    modifiedLine = modifiedLine.replace(/,?other/, '')
                    modifiedLine += '\n.set("filterTarget",function(card,player,target){return player!=target})'
                }
            }
            if (i.includes('atLeast')) {
                modifiedLine = modifiedLine.replace('atLeast', '')
                modifiedLine = modifiedLine.replace(/([0-9]+)/, '[$1,Infinity]')
            } else if (i.includes('atMost')) {
                modifiedLine = modifiedLine.replace('atMost', '')
                modifiedLine = modifiedLine.replace(/([0-9]+)/, '[1,$1]')
            }
            if (i.includes("addToExpansion") && i.includes("gaintag.add")) {
                modifiedLine += '.gaintag.add( "' + back.skill.id + '")';
            }
            if ([/\.chooseToUse/, /\.useCard\(\{/].some(regexp => regexp.test(i))) {
                modifiedLine = modifiedLine.replace(/(.*?)(?<!\[)([0-9]|\b[a-zA-Z]\b)(?!\])(?!\=\>)(?!\.)(.*)/, 'new Array($2).fill().forEach(()=>$1$3)')
            }
            if (i === 'if(' && IF === false) {
                result += i;
                IF = true
            }
            else if (i === ")" && IF === true) {
                result += i;
                IF = false;
            }
            else if (IF === true) {
                if ([' || ', ' && '].includes(i)) result += '\n'
                if (i === 'result.bool') bool = true;
                result += i;
            }
            else if (i === "{") {
                if (previousLine === "else ") result = result.slice(0, -1)
                result += '{\n';
                branch++;
            }
            else if (i === "}" && branch > 0) {
                result += '}\n'
                --branch;
                if (branch === 0) afterBranch = afterBranch.filter(x => {
                    x()
                    return false;
                });
            }
            else if (branch > 0) {
                result += `${modifiedLine}\n`
            }
            else result += modifiedLine + "\n"
            //如果遇见了chooseTarget,则自动增加步数
            if (!contentAsync && i.includes('chooseTarget') && !/^(var|let|const) /.test(i)) {
                step++;
                if (!branch) addStepForChoose()
                else afterBranch.push(addStepForChoose)
            }
            previousLine = i;
        })
        result += '},\n'
        if (!back.ContentInherit && back.skill.kind === 'trigger') {
            if (back.skill.boolList.includes("jianxiong_gain")) {
                result = addPSFix(result, /[a-z\.]+gain\(.*trigger.cards.*\)/g, `if(get.itemtype(trigger.cards)==="cards"\n&&get.position(trigger.cards[0])==="o"){\n`, '\n}\n')
                /**
                 * @type {Map}
                 */
                const map = back.skill.variable_content;
                let p = map.get("trigger.cards")
                result = addPSFix(result, new RegExp(`[a-z\.]+gain\(.*${p}.*\)`, "g"), `if(get.itemtype(${p})==="cards"\n&&get.position(${p}[0])=="o"){\n`, '\n}\n')
            }
            if (/[此该本]【?杀】?(造成)?的?伤害(\+|-|\*|改为)/.test(result)) {
                result = result.replace(/\s+$/gm, "")
                let regexp = /[此该本]【?杀】?(造成的)?伤害(\+|-|\*|改为)(?=[0-9a-z_$]+)/g
                result = result.replace(regexp, function (match, ...p) {
                    const symbol = p[1] === "改为" ? '' : p[1]
                    return `var id = trigger.target.playerid;\n` +
                        `var map=trigger.getParent("useCard",void 0,true).customArgs;\n` +
                        `if(!map[id]) map[id]={};\n` +
                        `if(typeof map[id].extraDamage != 'number'){\n` +
                        `map[id].extraDamage=0;\n` +
                        `}\n` +
                        `map[id].extraDamage ${symbol}=`
                })
            }
            if (/[此该本]【?杀】?需要的?【?闪】?(的数量)?(\+|-|\*|改为)/.test(result)) {
                result = result.replace(/\s+$/gm, "")
                let regexp = /[此该本]【?杀】?需要的?【?闪】?(的数量)?(\+|-|\*|改为)(?=[0-9a-z_$]+)/g
                result = result.replace(regexp, function (match, ...p) {
                    const symbol = p[1] === "改为" ? '' : p[1]
                    return `var id = trigger.target.playerid;\n` +
                        `var map = trigger.getParent("useCard",void 0,true).customArgs;\n` +
                        `if(!map[id]) map[id]={};\n` +
                        `if(typeof map[id].shanRequired != 'number'){\n` +
                        `map[id].shanRequired=1;\n` +
                        `}\n` +
                        `map[id].shanRequired ${symbol}= `
                })
            }
            if (/[此该本]【?决斗】?需要的?【?杀】?(的数量)?(\+|-|\*|改为)/.test(result)) {
                result = result.replace(/\s+$/gm, "")
                let regexp = /[此该本]【?决斗】?需要的?【?杀】?(的数量)?(\+|-|\*|改为)(?=[0-9a-z_$]+)/g
                result = result.replace(regexp, function (match, ...p) {
                    const symbol = p[1] === "改为" ? '' : p[1]
                    return `var id = (player == trigger.player ? trigger.target : trigger.player)["playerid"];\n` +
                        `var idt = trigger.target.playerid;\n` +
                        `var map = trigger.getParent("useCard",void 0,true).customArgs;\n` +
                        `if(!map[idt]) map[idt]={};\n` +
                        `if(!map[idt].shaReq) map[idt].shaReq={};\n` +
                        `if(!map[idt].shaReq[id])map[idt].shaReq[id]=1\n` +
                        `map[idt].shaReq[id] ${symbol}= `
                })
            }
            if (/(你令)?[此该本]牌额外结算([0-9a-z_$一二三四五六七八九十]+)次/.test(result)) {
                result = result.replace(/\s+$/gm, "")
                let regexp = /(你令)?[此该本]牌额外结算([0-9a-z_$一二三四五六七八九十])次/g
                result = result.replace(regexp, function (match, ...p) {
                    let number = p[1]
                    if ('一二三四五六七八九十'.includes(p[1])) number = "零一二三四五六七八九十".indexOf(p[1])
                    return `trigger.getParent("useCard",void 0,true).effectCount += ${number};`
                })
            }
            if (/(造成|受到)(的)?伤害(\+|-|\*|改为)/.test(result)) {
                result = result.replace(/\s+$/gm, "")
                let regexp = /(造成|受到)的?伤害(\+|-|\*|改为)(?=[0-9a-z_$]+)/g
                result = result.replace(regexp, function (match, ...p) {
                    const symbol = p[1] === "改为" ? '' : p[1]
                    return `trigger.num ${symbol}= `
                })
            }
        }
        if (/^令?[此该本]技能发动次数[减-]\d+$/m.test(result)) {
            result = result.replace(/^[此该本]技能发动次数[减-]/mg, kind === "trigger" ? `player.storage.counttrigger["${id}"]-=` : `player.getStat().skill["${id}"]-=`)
        }
        if (/^令?[此该本]技能发动次数令为\d+$/m.test(result)) {
            result = result.replace(/^[此该本]技能发动次数令为/mg, kind === "trigger" ? `player.storage.counttrigger["${id}"]=` : `player.getStat().skill["${id}"]=`)
        }
        if (!result.endsWith("\n")) result += "\n"
        return result;
    }
    static GenerateBackup({ id, needCard, costName, costNature, costColor, costSuit, preEve, selectCard, viewAsFrequency }) {
        let result = '';
        result += "filterCard:";
        if (needCard) result += this.getStrFormVcard({ costName, costNature, costColor, costSuit })
        else result += `()=>false`
        result += `,\n`
        if (preEve || viewAsFrequency.length) {
            const frequencyCardName = viewAsFrequency.find(condition => {
                return NonameCN.viewAsFrequencyList.includes(condition);
            })
            result += `precontent:function(){\n`
            if (preEve === "link") result += `player.link()\n`
            if (frequencyCardName) {
                if (frequencyCardName in NonameCN.viewAsFrequencyMap) {
                    result += `player.storage["${id}_used"]\n`
                    result += ` && player.when(${NonameCN.viewAsFrequencyMap[frequencyCardName]}).then(()=>{\n`;
                    result += `delete player.storage["${id}_used"];\n`
                    result += `})\n`
                }
                result += `player.markAuto("${id}_used",event.result.card.name);\n`
            }
            result += `},\n`
        };
        if (selectCard) result += `selectCard:${selectCard},\n`;
        return result;
    }
    static GenerateViewAsFilter({ costName, costNature, costColor, costSuit, needCard, preEve, conditionBool, position }) {
        let result = ''
        result += this.getStrFormConst({ costName, costNature, costColor, costSuit });
        if (needCard) result += `if(!player.countCards("${position.replaceAll("'", "")}",{${costName ? "name," : ""}${costNature ? "nature," : ""}${costColor ? "color," : ""}${costSuit ? "suit," : ""}})) return false;\n`
        if (preEve) {
            if (preEve === "link") result += `if(player.isLinked() === ${conditionBool}) return false;\n`
        }
        result += `return true;\n`
        return result;
    }
    static GenerateViewAs(back, i = 0) {
        const { id } = back.skill;
        const that = this;
        let result = '';
        const {
            asCard, asCardType, asNature,
            costName, costNature, costColor, costSuit,
            position, needCard,
            preEve, selectCard, conditionBool, viewAsFrequency
        } = that.analyzeViewAsData(back, i)
        if (!asCardType || !asCardType.length) {
            result += "viewAs:";
            result += that.getStrFormVcard({
                'costName': asCard,
                'costNature': asNature
            });
            result += ",\n";
            result += "viewAsFilter:function(player){\n"
            result += that.GenerateViewAsFilter({ costName, costNature, costColor, costSuit, needCard, preEve, conditionBool, position })
            result += "},\n"
            result += that.GenerateBackup({ id, needCard, costName, costNature, costColor, costSuit, preEve, selectCard, viewAsFrequency })
            if (asCard === "tao") {
                if (i === 0) back.skill.ai.push("save:true,");
            }
        } else {
            result += `chooseButton:{\n`
            result += `dialog:function(event,player){\n`
            result += `const list = [];\n`
            if (asCardType === 'basic') {
                result += `if(event.filterCard({name:"sha"},player,event)){\n`
                result += `list.push(["基本","","sha"])\n`
                result += `for(const nature of lib.inpile_nature){\n`
                result += `if(event.filterCard({name:"sha",nature},player,event)) list.push(["基本","","sha",nature])\n`
                result += `}\n`
                result += `}\n`
            }
            result += `for(const i of lib.inpile){\n`
            if (asCardType === 'basic') result += `if(i === "sha") continue;\n`
            result += `if(get.type(i${asCardType == 'trick2' ? ',"trick"' : ""}) !== "${asCardType.replace(/\d/, '')}") continue;\n`
            result += `if(!event.filterCard({name:i},player,event)) continue;\n`
            if (asCardType === 'delay') result += `if(!game.countPlayer(cur=>player.canUse({name:i},cur))) continue;\n`
            if (viewAsFrequency.some(condition => {
                return NonameCN.viewAsFrequencyList.includes(condition);
            })) {
                result += `if(player.storage["${id}_used"]\n`
                result += ` && player.storage["${id}_used"].includes(i)) continue;\n`
            }
            result += `list.push([${asCardType === "basic" ? '"基本"' : '"锦囊"'},"",i]);\n`
            result += `}\n`
            result += `return ui.create.dialog(get.translation("${id}"),[list,'vcard']);\n`
            result += `},\n`
            result += `backup:function(links,player){\n`
            result += `return {\n`
            result += this.GenerateBackup({ id, needCard, costName, costNature, costColor, costSuit, preEve, selectCard, viewAsFrequency })
            result += `viewAs:{\n`
            result += `name:links[0][2],\n`
            if (asCardType === 'basic') result += `nature:links[0][3],\n`
            result += `},\n`
            result += `}\n`
            result += `},\n`
            result += `prompt:function(links,player){\n`
            result += `return "视为使用一张【"+get.translation(links[0][2])+"】"\n`
            result += `},\n`
            result += `},\n`
        }
        return result;
    }
    static GenerateAi(back) {
        const { ai } = back.skill
        let result = ''
        result += 'ai:{\n'
        ai.forEach(line => {
            result += line + '\n'
        })
        result += '},\n'
        return result;
    }
    static GenerateSubskill(back, name, ...content) {
        let { id } = back.skill
        if (back.skill.subSkillEditing) id = back.skill.primarySkillCache.skill.id;
        let result = ''
        result += `"${name}":{\n`;
        result += content.join('');
        result += 'sub:true,\n';
        result += `sourceSkill:"${id}",\n`
        result += '},\n';
        return result;
    }
    static GenerateAllSubskills(back) {
        let result = ''
        const { subSkill } = back.skill
        if (!subSkill || !Object.keys(subSkill).length) return result
        result += 'subSkill:{\n';
        for (const [subSkillName, content] of Object.entries(subSkill)) {
            result += content.result;
        }
        result += '},\n';
        return result
    }
    static GenerateGroup(back) {
        let result = ''
        if (!back.skill.group.length) return result;
        const group = back.skill.group.map(id => `"${id}"`);
        result += `group:[${group}],\n`;
        return result;
    }
    static GenerateResearchDifCards_custom() {
        return [
            "custom_researchCardsDif:function(bool,kind,num){",
            "const cards = [], records = [];",
            "for(const card of bool ? ui.cardPile.childNodes : ui.discardPile.childNodes){",
            "const record = get[kind](card);",
            "if(!records.includes(record)){",
            "cards.push(card);",
            "records.push(record);",
            "}",
            "if(cards.length===num) break;",
            "}",
            "return cards;",
            "},\n"
        ].join('\n')
    }
    static GenerateChooseSameCard_custom() {
        return [
            "custom_selectedIsSameCard:function(card,kind){",
            "const mode = get.itemtype(card)==='button'?'buttons':'cards';",
            "if(!ui.selected[mode].length) return true;",
            "if(mode === 'buttons') return ui.selected[mode].every(selected=>{",
            "return get[kind](selected.link)===get[kind](card);",
            "})",
            "else return ui.selected[mode].every(selected=>{",
            "return get[kind](selected)===get[kind](card);",
            "})",
            "},\n"
        ].join('\n')
    }
    static GenerateChooseDifCard_custom() {
        return [
            "custom_selectedIsDifCard:function(card,kind){",
            "const mode = get.itemtype(card)==='button'?'buttons':'cards';",
            "if(!ui.selected[mode].length) return true;",
            "if(mode === 'buttons') return ui.selected[mode].every(selected=>{",
            "return get[kind](selected.link)===get[kind](card);",
            "})",
            "else return ui.selected[mode].every(selected=>{",
            "return get[kind](selected)===get[kind](card);",
            "})",
            "},\n"
        ].join('\n')
    }
    static GenerateEnding(back) {
        const { mode } = back.skill
        let result = ''
        if (mode === 'mt') result += '},'
        else if (mode === 'mainCode') result += '}'
        return result;
    }
    /**
     * 当所有布尔参数均为真时，抛出错误信息；否则，不执行任何操作
     * @param {string} errorMessage 错误消息文本
     * @param {...boolean} bools 
     * @throws {TypeError} 
     * @throws {Error} 
     */
    static GenerateEditorError(errorMessage, ...bools) {
        if (typeof errorMessage !== 'string') {
            throw new TypeError('Param errorMessage should be a string');
        }
        for (const bool of bools) {
            if (typeof bool !== 'boolean') {
                throw new TypeError('All element in bools should be boolean');
            }
            if (!bool) {
                return;
            }
        }
        throw new Error(errorMessage);
    }
    /**
    * 将代码从一种模式转换为另一种模式。
    * 
    * @param {Object} params 
    * @param {string} params.code - 需要转换的代码字符串。
    * @param {string} params.from - 当前代码的编写位置。
    * @param {string} params.to - 目标位置。
    * @param {string} params.id - 技能的ID。
    * @returns {string} 转换后的代码字符串。
    */
    static TransToOtherModeCode({ code, from, to, id }) {
        if (from === to) return code;
        if (to === "mainCode") {
            if (from === "mt") {
                return adjustTab(code.replace(/.*\n/, `lib.skill["${id}"]={\n`).slice(0, -1))
            } else {
                return adjustTab(`lib.skill["${id}"]={\n${code}\n}`);
            }
        }
        if (to === "mt") {
            if (from === "mainCode") {
                return adjustTab(code.replace(/.*\n/, `"${id}":{\n`))
            } else {
                return adjustTab(`"${id}":{\n${code}\n}`);
            }
        }
        if (to === "self") {
            return adjustTab(code.replace(/.*\n/, "").slice(0, -1))
        }
    }
}
//该代码块用于编辑giveSentence
{
    for (const [item, explanation] of Object.entries(NonameCN.giveSentence.trigger)) {
        if (!item.startsWith("你")) continue;
        NonameCN.giveSentence.trigger["一名角色" + item.substring(1)] = "一名角色" + explanation.substring(1)
    }
    for (const [item, _] of Object.entries(NonameCN.giveSentence.filter)) {
        if (!item.startsWith("此牌")) continue;
        NonameCN.giveSentence.filterCard["卡牌" + item.substring(2)] = 0;
    }
    const varSentence = {
        "变量x令为你体力值的一半且向上取整": "变量x令为你体力值的一半且向上取整",
        "变量x令为你体力值的一半且向下取整": "变量x令为你体力值的一半且向下取整",
        "变量x令为你体力值的一半且四舍五入": "变量x令为你体力值的一半且四舍五入",
        "变量y令为你体力上限且至多为5": "变量y令为你体力上限且至多为5",
        "变量z令为你手牌数且至少为1": "变量z令为你手牌数且至少为1",
        "变量X令为场上势力数": "变量X令为场上势力数",
        "变量Y令为你获取本回合失去牌的类型个数": "变量Y令为你获取本回合失去牌的类型个数",
    }
    for (const [item, explanation] of Object.entries(varSentence)) {
        NonameCN.giveSentence.filter[item] = explanation;
        NonameCN.giveSentence.content[item] = explanation;
    }
}
{
    const modsMap = NonameCN.skillModMap;
    const matchCardName = Object.keys(NonameCN.groupedList.cardName).join('|')
    modsMap.set(
        /^\s*(你|player)\s*计算(与|和)其他角色的?距离时?(减|\-|减少|加|\+|增加)([0-9]+)\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                let symbol = getSymbol(p[2]);
                return [`${symbol}:${p[3]}`, `globalFrom`];
            }
        ]
    );
    modsMap.set(
        /^\s*其他角色计算(与|和)(你|player)的?\s*距离时?(减|\-|减少|加|\+|增加)([0-9]+)\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                let symbol = getSymbol(p[2]);
                return [`${symbol}:${p[3]}`, `globalTo`];
            }
        ]
    );

    modsMap.set(
        new RegExp(`^\s*(你|player)\s*不能成为\s*(${matchCardName})的?\s*(目标|target)\s*$`, 'm'),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`name:${NonameCN.getEn(p[1])}`, `targetEnabled_false`];
            }
        ]
    );
    modsMap.set(
        new RegExp(`^\s*(你|player)\s*不能成为\s*(${matchCardName})(和|与|或|、)(${matchCardName})的?\s*(目标|target)\s*$`, 'm'),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`name:${NonameCN.getEn(p[1])}-${NonameCN.getEn(p[3])}`, `targetEnabled_false`];
            }
        ]
    );
    modsMap.set(
        /^\s*(你|player)\s*不能成为\s*(基本牌|装备牌|普通锦囊牌|延时锦囊牌)\s*(目标|target)\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`type:${NonameCN.getEn(p[1])}`, `targetEnabled_false`];
            }
        ]
    );
    modsMap.set(
        /^\s*(你|player)\s*不能成为\s*锦囊牌\s*(目标|target)\s*$/m,
        [
            "type:trick-delay",
            "targetEnabled_false",
            void 0
        ]
    );


    modsMap.set(
        /^\s*(你|player)\s*使用的?\s*卡?牌(无|没有)(次数|数量|距离)限制\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`all`, `${p[2] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`];
            }
        ]
    );
    modsMap.set(
        /^\s*(你|player)\s*使用的?\s*锦囊牌(无|没有)(次数|数量|距离)限制\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                return ["type:trick-delay", `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`];
            }
        ]
    );
    modsMap.set(
        new RegExp(`^\s*(你|player)\s*使用的?\s*(${matchCardName})(无|没有)(次数|数量|距离)限制\s*$`, 'm'),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`name:${NonameCN.getEn(p[1])}`, `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`];
            }
        ]
    );
    modsMap.set(
        /^\s*(你|player)\s*使用的?\s*(基本牌|普通锦囊牌|延时锦囊牌|装备牌)(无|没有)(次数|数量|距离)限制\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`type:${NonameCN.getEn(p[1])}`, `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`];
            }
        ]
    );
    modsMap.set(
        /^\s*(你|player)\s*使用的?\s*([红黑]色)手?牌(无|没有)(次数|数量|距离)限制\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`color:${NonameCN.getEn(p[1])}`, `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`];
            }
        ]
    );
    modsMap.set(
        /^\s*(你|player)\s*使用的?\s*(梅花|黑桃|红桃|方片)手?牌(无|没有)(次数|数量|距离)限制\s*$/m,
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`suit:${NonameCN.getEn(p[1])}`, `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`];
            }
        ]
    );
    modsMap.set(
        new RegExp(`^\s*(你|player)\s*不能使用(${matchCardName})\s*$`, 'm'),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`name:${NonameCN.getEn(p[1])}`, `cardEnabled_false`];
            }
        ]
    );
    modsMap.set(
        new RegExp(`^\s*(你|player)\s*不能使用(${matchCardName})(和|与|或|、)(${matchCardName})\s*$`),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`name:${NonameCN.getEn(p[1])}-${NonameCN.getEn(p[3])}`, `cardEnabled_false`];
            }
        ]
    );
    modsMap.set(
        new RegExp(/^\s*(你|player)\s*不能使用牌\s*$/m),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`all`, `cardEnabled_false`];
            }
        ]
    );
    modsMap.set(
        new RegExp(/^\s*(你|player)\s*不能使用(黑|红)色手?牌\s*$/m),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`color:${NonameCN.getEn(p[1] + "色")}`, `cardEnabled_false`];
            }
        ]
    );
    modsMap.set(
        new RegExp(/^\s*(你|player)\s*不能使用(梅花|黑桃|方片|红桃)手?牌\s*$/m),
        [
            void 0,
            void 0,
            (match, ...p) => {
                return [`suit:${NonameCN.getEn(p[1])}`, `cardEnabled_false`];
            }
        ]
    );
}
//moreSetDialog
{
    NonameCN.moreSetDialog.push(
        back => {
            if (back.skill.subSkillEditing) return game.xjb_create.alert("此技能已经是一个子技能!")
            back.cachePrimarySkill();
            back.ele.groupsContainer.groupsPageNum = 0;
            back.clearTextarea();
            back.skillEditorStart();
            delete back.skill.subSkill
            back.skill.subSkillEditing = true;
        },
        back => {
            if (back.skill.subSkillEditing) return game.xjb_create.alert("此技能已经是一个子技能!")
            const map = {};
            for (let skillName of Object.keys(back.skill.subSkill)) {
                skillName = skillName;
                if (back.skill.group.includes(skillName)) continue;
                map[skillName] = `子技能-${skillName}`
            }
            game.xjb_create.seeDelete(
                map,
                '查看',
                '删除',
                function () {
                    const id = this.container.dataset.xjb_id;
                    back.cachePrimarySkill();
                    back.readSubskillCache(id);
                    element().setTarget(back)
                        .anotherClickTouch(this.yesButton, 'touchend')
                    back.ele.groupsContainer.groupsPageNum = 0;
                    back.skill.subSkillEditing = true;
                    back.organize()
                },
                function () {
                    const id = this.container.dataset.xjb_id
                    delete back.skill.subSkill[id]
                    back.organize()
                },
                function () {
                }
            )
        },
        back => {
            if (back.skill.subSkillEditing) {
                back.cacheSubskill()
            }
            back.readPrimarySkillCache()
            back.skill.subSkillEditing = false;
        },
        back => {
            const map = {};
            for (let skillName of Object.keys(back.skill.subSkill)) {
                skillName = back.skill.id + "_" + skillName;
                if (back.skill.group.includes(skillName)) continue;
                map[skillName] = `${skillName}(${skillName})`
            }
            for (let skillName of lib.xjb_skillsStore) {
                if (!lib.translate[skillName]) continue;
                if (!lib.translate[skillName + "_info"]) continue;
                if (back.skill.group.includes(skillName)) continue;
                map[skillName] = `${lib.translate[skillName]}(${skillName})`
            }
            game.xjb_create.seeDelete(
                map,
                '查看',
                '添加',
                function () {
                    if (this.innerText === "查看") {
                        const id = this.container.dataset.xjb_id
                        this.descEle.innerHTML += `<span>${lib.translate[id + '_info']}</span>`
                        this.innerText = "收起"
                        this.seeExpanding = true;
                    } else if (this.innerText === "收起") {
                        /**
                         * @type {HTMLElement}
                         */
                        const descEle = this.descEle
                        const span = descEle.querySelector('span')
                        span && span.remove();
                        this.innerText = '查看'
                        this.seeExpanding = false;
                    }

                },
                function () {
                    const id = this.container.dataset.xjb_id
                    this.yesButton.result.push(id)
                },
                function () {
                    back.skill.group.push(...this.result)
                    back.organize()
                }
            )
        },
        back => {
            const map = {};
            for (let skillName of back.skill.group) {
                map[skillName] = `${lib.translate[skillName]}(${skillName})`
            }
            let dialog = game.xjb_create.seeDelete(
                map,
                '查看',
                '删除',
                function () {
                    if (this.innerText === "查看") {
                        const id = this.container.dataset.xjb_id
                        this.descEle.innerHTML += `<span>${lib.translate[id + '_info']}</span>`
                        this.innerText = "收起"
                        this.seeExpanding = true;
                    } else if (this.innerText === "收起") {
                        /**
                         * @type {HTMLElement}
                         */
                        const descEle = this.descEle
                        const span = descEle.querySelector('span')
                        span && span.remove();
                        this.innerText = '查看'
                    }
                },
                function () {
                    const id = this.container.dataset.xjb_id
                    this.yesButton.result.remove(id)
                },
                function () {
                    back.skill.group = [...this.result]
                    back.organize()
                }
            )
            dialog.buttons[0].result = [...back.skill.group]
        },
        back => {
            game.xjb_create.multiprompt(function () {
                back.skill.marktext = this.resultList[0];
                back.skill.markName = this.resultList[1];
                back.skill.markContent = this.resultList[2];
                back.organize();
            })
                .appendPrompt('标记外观', back.skill.marktext ? back.skill.marktext : void 0, '这里写标记外观文字,只能写一个字!',)
                .appendPrompt('标记名字', back.skill.markName ? back.skill.markName : void 0, '这里写标记的名字',)
                .appendPrompt('标记内容', back.skill.markContent ? back.skill.markContent : void 0, '这里写点开标记后显示的内容,你可以用#表示标记数量', 4);
        },
        back => {
            const dialog = game.xjb_create.multiprompt(function () {
                /**
                 * @type {Map}
                 */
                const cnSentence = back.cnSentence;
                cnSentence.set(this.resultList[0], this.resultList[1])
                back.organize();
            })
                .appendPrompt('语句编号', '%#&', '%#&',)
                .appendPrompt('语句内容', void 0, '语句编号请以%#&打头，可以创建新的编号，也可以输入已有语句编号进行修改，这里输入语句内容', 4)
            const textareas = dialog.querySelectorAll('textarea');
            textareas[0].addEventListener('keyup', function () {
                if (back.cnSentence.has(this.value)) {
                    textareas[1].value = back.cnSentence.get(this.value);
                } else {
                    textareas[1].value = '';
                }
            })
        },
        back => {
            game.xjb_create.multiprompt(function () {
                back.skill.prompt = this.resultList[0];
                back.skill.prompt2 = this.resultList[1];
                back.organize();
            })
                .appendPrompt('技能提示标题', back.skill.prompt ? back.skill.prompt : void 0, '这里写技能提示的标题', 1)
                .appendPrompt('技能提示内容', back.skill.prompt2 ? back.skill.prompt2 : void 0, '这里写技能提示的内容', 3)
        }
    )
}