import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../noname.js"
import {
    textareaTool
} from './ui.js'
const eventList = {
    "回合": "phase",
    "准备阶段": "phaseZhunbei",
    "出牌阶段": "phaseUse",
    "结束阶段": "phaseJieShu",
    "判定阶段": "phaseJudge",
    "弃牌阶段": "phaseDiscard",
    "摸牌阶段": "phaseDraw",
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
    '增加体力上限': 'gainMaxHp',
    //
    '横置或重置': 'link',
    '翻面': 'turnOver',
    '武将牌翻面': 'turnOver'
}
const cardNameList = (() => {
    return [].concat(...lib.config.cards.map(name => lib.cardPack[name]))
})();
const cardTypeList = (() => {
    return ['basic', 'equip', 'delay', ...Object.keys(lib.cardType)]
})();
function getMapOfCard(bool = true) {
    const idList = cardNameList
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
    }
    return map;
}
function getMapOfTrigger() {
    const list = {}
    let event = eventList;
    for (let [i, k] of Object.entries(event)) {
        list[i + "时"] = k + "Begin"
        list[i + "开始"] = k + "Begin"
        list[i + "开始时"] = k + "Begin"
        list[i + "开始前"] = k + "Begin"
        list[i + "结束"] = k + "End"
        list[i + "结束时"] = k + "End"
        list[i + "结束后"] = k + "End"
        list[i + "前"] = k + "Before"
        list[i + "之前"] = k + "Before"
        list[i + "后"] = k + "After"
        list[i + "结算后"] = k + "After"
        //
        list["令一名角色" + i + "时"] = "source:" + k + "Begin"
        list["令一名角色" + i + "结束"] = "source:" + k + "End"
        list["令一名角色" + i + "前"] = "source:" + k + "Before"
        list["令一名角色" + i + "之前"] = "source:" + k + "Before"
        list["令一名角色" + i + "后"] = "source:" + k + "After"
        //
        list["获取本回合" + i + "事件"] = 'getHistory:"' + k + '"'
        //
        list["获取" + i + "事件"] = 'getAllHistory:"' + k + '"'
        //
        list['名为' + i + '的父事件'] = 'getParent:"' + k + '":intoFunction'
    }
    list["判定牌生效前"] = "judge";
    list["判定牌生效后"] = "judgeEnd";
    list["失去手牌后"] = "loseAfter:h";
    list["受到伤害后"] = "damageEnd";
    return list
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
        "有普通锦囊牌": `hasCard:{type:"trick"}:"hes"`,
        "判定区内有普通锦囊牌": `hasCard:{type:"trick"}:"j"`,
        "手牌区内有普通锦囊牌": `hasCard:{type:"trick"}`,
        "装备区内有普通锦囊牌": `hasCard:{type:"trick"}:"e"`
    };
    for (let k of idList) {
        //这里不加intoFunction标志,表明不能向其中添加参数
        map["有" + lib.translate[k] + "牌"] = `hasCard:"hes":{type:"${k}"}`;
        map["判定区内有" + lib.translate[k] + "牌"] = `hasCard:{type:"${k}"}:"j"`;
        map["手牌区内有" + lib.translate[k] + "牌"] = `hasCard:{type:"${k}"}`;
        map["装备区内有" + lib.translate[k] + "牌"] = `hasCard:{type:"${k}"}:"e"`;
    }
    return map;
}
function getMapOfCanAddJudge(){
    const idList = cardNameList.filter(card=>get.type(card)==='delay')
    const map = {};
    for (let k of idList) {
        //这里不加intoFunction标志,表明不能向其中添加参数
        map["可以被贴上" + lib.translate[k]] = `canAddJudge:"${k}"`;
    }
    return map;
}
export class NonameCN {
    static basicList = {
        '每名角色': 'global',
        '场上一名角色': 'global',
        '场上一个角色': 'global',
        '场上一位角色': 'global',
        '一名角色': 'global',
        '一个角色': 'global',
        '一位角色': 'global',
        //
        '触发': 'trigger',
        '触发事件': 'trigger',
        '触发的事件': 'trigger',
        '事件': 'event',
        //事件函数
        '取消': 'cancel',
        '重复': 'redo',
        '结束': 'finish',
        '跳至': 'goto',
        '父事件': 'getParent',
        '数值改为0': "changeToZero",
        '数值调为0': "changeToZero",
        '数改为0': "changeToZero",
        '数调为0': "changeToZero",
        //事件属性
        '名字': "name",
        '卡牌': 'card',
        '来源': 'source',
        '牌名': 'name',
        '花色': 'suit',
        '颜色': 'color',
        '类别': 'type',
        '副类别': 'subtype',
        '牌': 'cards',
        //伤害事件
        '受伤点数': 'trigger.num',
        '受到伤害点数': 'trigger.num',
        '受伤点数': 'trigger.num',
        '伤害点数': 'trigger.num',
        '造成伤害的牌': 'trigger.cards',
        '此牌对应的所有实体牌': 'trigger.cards',
        '此牌对应的实体牌': 'trigger.cards',
        '造成伤害的属性': 'trigger.nature',
        '伤害属性': 'trigger.nature',
        "判定牌": "trigger.result.card",
        //
        '获取': 'get',
        //弃牌堆中
        '弃牌堆中普通锦囊牌': 'discardPile:card=>get.type(card)==="trick":intoFunction',
        '弃牌堆中延时锦囊牌': 'discardPile:card=>get.type(card)==="delay":intoFunction',
        '弃牌堆中基本牌': 'discardPile:card=>get.type(card)==="basic":intoFunction',
        '弃牌堆中装备牌': 'discardPile:card=>get.type(card)==="equip":intoFunction',
        '弃牌堆中宝物牌': 'discardPile:card=>get.subtype(card,false)=="equip5":intoFunction',
        '弃牌堆中防具牌': 'discardPile:card=>get.subtype(card,false)=="equip2":intoFunction',
        '弃牌堆中武器牌': 'discardPile:card=>get.subtype(card,false)=="equip1":intoFunction',
        '弃牌堆中+1马牌': 'discardPile:card=>get.subtype(card,false)=="equip3":intoFunction',
        '弃牌堆中-1马牌': 'discardPile:card=>get.subtype(card,false)=="equip4":intoFunction',
        '弃牌堆中防御马牌': 'discardPile:card=>get.subtype(card,false)=="equip3":intoFunction',
        '弃牌堆中进攻马牌': 'discardPile:card=>get.subtype(card,false)=="equip4":intoFunction',
        '弃牌堆中伤害锦囊牌': 'discardPile:card=>get.type2(card,false)=="trick"&&get.tag(card,"damage"):intoFunction',
        '弃牌堆中牌颜色为红色': 'discardPile:card=>get.color(card,false)=="red":intoFunction',
        '弃牌堆中牌颜色为黑色': 'discardPile:card=>get.color(card,false)=="black":intoFunction',
        //牌堆中
        '牌堆中普通锦囊牌': 'cardPile2:card=>get.type(card)==="trick":intoFunction',
        '牌堆中延时锦囊牌': 'cardPile2:card=>get.type(card)==="delay":intoFunction',
        '牌堆中基本牌': 'cardPile2:card=>get.type(card)==="basic":intoFunction',
        '牌堆中装备牌': 'cardPile2:card=>get.type(card)==="equip":intoFunction',
        '牌堆中宝物牌': 'cardPile2:card=>get.subtype(card,false)=="equip5":intoFunction',
        '牌堆中防具牌': 'cardPile2:card=>get.subtype(card,false)=="equip2":intoFunction',
        '牌堆中武器牌': 'cardPile2:card=>get.subtype(card,false)=="equip1":intoFunction',
        '牌堆中+1马牌': 'cardPile2:card=>get.subtype(card,false)=="equip3":intoFunction',
        '牌堆中-1马牌': 'cardPile2:card=>get.subtype(card,false)=="equip4":intoFunction',
        '牌堆中防御马牌': 'cardPile2:card=>get.subtype(card,false)=="equip3":intoFunction',
        '牌堆中进攻马牌': 'cardPile2:card=>get.subtype(card,false)=="equip4":intoFunction',
        '牌堆中伤害锦囊牌': 'cardPile2:card=>get.type2(card,false)=="trick"&&get.tag(card,"damage"):intoFunction',
        '牌堆中牌颜色为红色': 'cardPile2:card=>get.color(card,false)=="red":intoFunction',
        '牌堆中牌颜色为黑色': 'cardPile2:card=>get.color(card,false)=="black":intoFunction',
        //
        '游戏': 'game',
        //
        '创卡': 'createCard',
        '造卡': 'createCard',
        '印卡': 'createCard',
        '更新轮数': 'updateRoundNumber',
        '暂停': 'pause',
        '继续': 'resume',
        '胜利': 'over:true:intoFunction',
        '失败': 'over:false:intoFunction',
        '局终': 'over',
        '重启': 'reload',
        //
        '轮数': 'roundNumber',
        //
        '火属性': '"fire"',
        '雷属性': '"thunder"',
        '冰属性': '"ice"',
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
        'A': '1',
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
        'J': '11',
        'Q': '12',
        'K': '13',
        //
        '有概率': 'Math.random()<=',
        //
        '储存': 'storage',
        '体力': 'hp',
        '体力值': 'hp',
        '体力上限': 'maxHp',
        '护甲': 'hujia',
        '护甲值': 'hujia',
        'id': 'name',
        '手牌数': 'countCards:"h"',
        '牌数': 'countCards:"he"',
        '区域内牌数': 'countCards:"hej"',
        //
        '有手牌': 'hasCard',
        '有牌': 'hasCard:"he"',
        '区域内有牌': 'hasCard:"hej"',
        //
        '已受伤': 'isDamaged',
        '未受伤': 'isHealthy',
        '存活': 'isAlive',
        '背面朝上': 'isTurnedOver',
        '武将牌背面朝上': 'isTurnedOver',
        '为体力值为全场最少或之一': 'isMinHp',
        '为手牌数为全场最少或之一': 'isMinHandcard',
        //
        '获取手牌区牌': 'getCards:"h"',
        '获取区域内牌': 'getCards:"hej"',
        '获取牌': 'getCards:"he"',
        '获取手牌': 'getCards:"h"',
        //
        '获取本回合指定其他角色为目标的使用牌事件': "getHistory:'useCard':function(evt){return evt.targets.filter(current=>target!=player)}",
        '获取本回合指定其他角色为目标的打出牌事件': "getHistory:'respond':function(evt){return evt.targets.filter(current=>target!=player)}",
        '本回合使用牌的次数': `getHistory:'useCard':intoFunction://!?length`,
        '本回合使用牌次数': `getHistory:'useCard':intoFunction://!?length`,
        //其他写法
        '摸': 'draw',
        '获得护甲': 'changeHujia',
        //
        '获得标记': 'addMark',
        '移去标记': 'removeMark',
        '拥有标记': 'hasMark',
        //
        '添加技能': 'addSkillLog',
        '获得技能': 'addSkillLog',
        '拥有技能': 'hasSkill',
        '有技能': 'hasSkill',
        //牌类事件      
        '展示牌': "showCards",
        '随机弃手牌': 'randomDiscard',
        '随机弃置手牌': 'randomDiscard',
        '随机弃牌': 'randomDiscard:"he":intoFunction',
        '随机弃置牌': 'randomDiscard:"he":intoFunction',
        '随机获得牌': 'randomGain',
        '移动场上牌': 'moveCard',
        '获得角色区域内牌': 'gainPlayerCard:"hej":intoFunction',
        '弃置角色区域内牌': 'discardPlayerCard:"hej":intoFunction',
        '获得角色牌': 'gainPlayerCard:"he":intoFunction',
        '弃置角色牌': 'discardPlayerCard:"he":intoFunction',
        '获得角色手牌': 'gainPlayerCard:"h":intoFunction',
        '弃置角色手牌': 'discardPlayerCard:"h":intoFunction',
        '将手牌补至': 'drawTo',
        '将手牌摸至': 'drawTo',
        '手牌补至': 'drawTo',
        '手牌摸至': 'drawTo',
        "将体力值回复至": "recoverTo",
        "体力值回复至": "recoverTo",
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
        '废除判定区': 'disableJudge',
        //选择式事件-废除和恢复            
        '废除装备区内一个装备栏': 'chooseToDisable',
        '选择废除装备区内一个装备栏': 'chooseToDisable',
        '废除一个装备栏': 'chooseToDisable',
        '选择废除一个装备栏': 'chooseToDisable',
        '恢复装备区内一个装备栏': 'chooseToEnable',
        '选择恢复装备区内一个装备栏': 'chooseToEnable',
        '选择恢复一个装备栏': 'chooseToEnable',
        '恢复一个装备栏': 'chooseToEnable',
        //选择式事件-牌类
        '选择弃置牌': 'chooseToDiscard:"he":intoFunction',
        '选择弃置手牌': 'chooseToDiscard:"h":intoFunction',
        '选择弃牌': 'chooseToDiscard:"he":intoFunction',
        '选择弃手牌': 'chooseToDiscard:"h":intoFunction',
        '选择角色牌': 'choosePlayerCard:"he":intoFunction',
        '选择角色手牌': 'choosePlayerCard',
        '卜算': 'chooseToGuanxing',
        '选择角色': 'chooseTarget',
        '选择目标': 'chooseTarget',
        //
        '摸牌式': '"draw"',
        '从牌堆底': '"bottom"',
        '牌堆底': '"bottom"',
        '任意张': '[1,Infinity]',
        '任意名': '[1,Infinity]',
        //
        '其他': 'other',
        '至多': 'atMost',
        '至少': 'atLeast',
        '必须选': 'true',
        //关键字、运算符中文  
        '返回': 'return',
        '变量': 'var ',
        '常量': 'const ',
        '令为': ' = ',
        '自增': '++',
        '自减': '--',
        '或': ' || ',
        '或者': ' || ',
        '且': ' && ',
        '并且': ' && ',
        '非': '!',
        '不是': ' != ',
        '不为': ' != ',
        '为': ' == ',
        '是': ' == ',
        '等于': ' == ',
        '真等于': ' === ',
        '不等于': ' != ',
        '真不等于': ' !== ',
        '真': 'true',
        '假': 'false',
        '不': '!',
        '如果': 'if(',
        '如果不': 'if(!',
        '若': 'if(',
        '那么': ')',
        '分支开始': '{',
        '分支结束': '}',
        '否则': 'else ',
        '大于': ' > ',
        '大于等于': ' >= ',
        '不小于': ' >= ',
        '小于': ' < ',
        '小于等于': ' <= ',
        '不大于': ' <= ',
        '加': ' + ',
        '减': ' - ',
        '乘': ' * ',
        '除': ' / ',
        '取模': ' % ',
        //数学
        '随机数': 'Math.random()',
        '圆周率': 'Math.PI',
        //           
        '+': ' + ',
        '-': ' - ',
        '*': ' * ',
        '/': ' / ',
        '%': ' % ',
        '=': ' = ',
        '+=': " += ",
        '-=': " -= ",
        '>=': ' >= ',
        '<=': " <= ",
        '==': " == ",
        '===': " === ",
        '||': ' || ',
        '&&': ' && ',
        //关键字
        'else': 'else ',
        'in': ' in ',
        'for(var': 'for(var ',
        'for(let': 'for(let ',
        'for(let': 'for(const ',
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
        //注释
        '注释': '//',
        //
        "父元素": "parentNode",
        "子元素": "children",
        //
        "牌堆": "ui.cardPile",
        "弃牌堆": "ui.discardPile",
        "处理区": "ui.ordering",
    }
    static freeQuotation = {
        cardName: getMapOfCard(false),
        type: getMapOfType(false),
    }
    static groupedList = {
        player: {
            '你': 'player',
            '玩家': 'game.me',
            '主公': 'game.zhu',
            '目标': 'target',
            '当前回合角色': '_status.currentPhase',
            '触发事件的角色': 'trigger.player',
            '触发角色': 'trigger.player',
            '目标角色': 'trigger.target',
            '伤害来源': 'trigger.source',
            '受伤角色': 'trigger.player',
            '受到伤害的角色': 'trigger.player',
        },
        player_attribute: {
        },
        player_method: {
            "获取宗族": "getClans",
            "属于宗族": "hasClan",
            '获取判定区牌': 'getJudge',
            '获取装备区牌': 'getEquip',
        },
        player_withArg: {
            ...getMapOfHasCard(),
            ...getMapOfHasType(),
            ...getMapOfCanAddJudge()
        },
        players: {
            /*所(被)选(的)角色,所(被)选择(的)角色*/
            '所选角色': 'result.targets',
            '所有角色': 'game.players',
        },
        event: eventList,
        card_method: {
        },
        triggerList: {
            ...getMapOfTrigger(),
            //特殊时机
            '成为牌的目标': "target:useCardToTarget",
            '成为牌的目标时': "target:useCardToTarget",
            '成为牌的目标后': "target:useCardToTargeted",
            '亮出拼点牌前': 'compareCardShowBefore',
            '亮出拼点牌之前': 'compareCardShowBefore',
            '造成伤害': 'damageSource',
            '造成伤害时': 'damageSource',
            '造成伤害后': 'damageSource',
            '进入濒死状态时': 'dying',
            '脱离濒死状态时': 'dyingAfter',
            '牌被弃置后': 'loseAfter:discard',
            '需要打出闪时': 'chooseToRespondBefore:shan',
            '需要使用闪时': 'chooseToUseBefore:shan',
            '需要打出杀时': 'chooseToRespondBefore:sha',
        },
        color: {
        },
        suit: {
        },
        type: getMapOfType(),
        cardName: getMapOfCard(),
        group: getMapOfGroup(),
        packed_playerCode: {
            '令角色代为打出': 'packed_playerCode_sufferForAnother',
            '令角色代为使用': 'packed_playerCode_sufferForAnother',
            '令角色代为使用或打出': 'packed_playerCode_sufferForAnother',
        }
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
                console.log(player)
                console.log(args)
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
        }
    }
    static get AllList() {
        let list = Object.assign({}, this.basicList, ...Object.values(this.groupedList));
        return list
    }
    static getEn(cn) {
        let list = Object.assign({}, ...Object.values(this.freeQuotation));
        return list[cn];
    }
    static getStrFormFunc(key, value) {
        if (Array.isArray(value)) {
            value = value.map(k => `"${k}"`)
            return `[${value}].includes(get.${key}(card,player))`
        }
        return `get.${key}(card,player) === "${value}"`
    }
    static getVirtualPlayer() {
        const player = ui.create.player();
        player.init('xjb_caocao');
        Object.values(this.groupedList.packed_playerCode).forEach(method => player[method] = () => { })
        return player;
    }
    /**
     * @param that 一个对象，其changeWord方法被调用来执行文本替换。
     */
    static deleteBlank(that) {
        //处理空白字符
        textareaTool().setTarget(that)
            .replace(/[ ]+/g, " ")
            .replace(/[ ]+$/mg, "")
            .replace(/\s+$/g, '')
        //method类
        //event类
        textareaTool().setTarget(that)
            .replace("受到 伤害 ", "受到伤害 ")
            .replace(/(?<=代为) (?=使用 |打出 |使用或打出 )/g, "")
            .replace(/体力值 (回复|恢复)至 /g, "体力值回复至 ")
    }
    static underlieVariable(that) {
        textareaTool().setTarget(that)
            .replace(/变量/g, "变量 ")
            .replace(/常量/g, "常量 ")
            .replace(/令为/g, " 令为 ")
            .replace(/(?<=\w+)为/g, " 为 ")
            .replace(/(?<!名|令)为/g, '为 ')
    }
    static standardFilter(that) {
        textareaTool().setTarget(that)
            //"(获取) 类别(...) ?"
            .replace(/(?<=获取)(.+?)的?(类别|副类别|颜色|花色|点数|id)/g, ` $2 $1`)
            //"你(...) 获取手牌区(...)牌"
            .replace(/(获取)(你|伤害来源|当前回合角色)\s*的?(手牌区|装备区|判定区)[内中]?的?牌/g, '$2 $1$3牌')
            //"你(...) 获取区域内牌 基本牌(..)"
            .replace(/(获取)(你|伤害来源|当前回合角色)\s*的?(区域)[内中]的牌/g, '$2 $1$3内牌 $4')
    }
    static standardEvent(that) {
        //处理事件描述
        textareaTool().setTarget(that)
            .replace(/流失体力/g, "失去体力")
            .replace(/横置\/重置/g, "横置或重置")
            .replace(/(?<=置)于(?=判定区|装备区|弃牌堆)/g, "入")
            .replace("扣置", "置")
            .replace("恢复体力", "回复体力")
    }
    static standardTri(that) {
        textareaTool().setTarget(that)
            .replace(/(?<=濒死)(状态|阶段)/g, "状态")
    }
    //处理模拟代码块
    static replace(undisposed) {
        let list = Object.values(this.groupedList.packed_playerCode).filter(str => undisposed.includes(str));
        for (let k of list) {
            undisposed = this.packedCodeRePlaceMap[k](undisposed);
        }
        return undisposed.split('\n')
    }
    static analyzeThisCard(triggerList) {
        const List = [].concat(...Object.values(triggerList));
        if (List.length === 1) {
            const trigger = List[0]
            if (trigger.startsWith("judge")) return `trigger.result.card`
            return `trigger.card`
        }
    }
    static analyzeTheseCard(triggerList) {
        const List = [...Object.values(triggerList)];
        alert(List)
        if (List.length === 1) {
            const trigger = List[0]
            if (trigger.startsWith("judge")) return `[trigger.result.card]`
            return `trigger.cards`
        }
    }
    static GenerateMod(back) {
        const { mod } = back.skill;
        const that = this;
        let result = '';
        result += "mod:{\n";
        if (mod.lengthOfCardUsable) {
            result += "cardUsable:function(card,player,num){\n"
            mod.cardUsable_Infinity.forEach(condition => {
                if (condition === "all") result += "return Infinity;\n";
                else {
                    let list = condition.split(":");
                    let cdt0 = list[0];
                    let cdt1 = list[1]
                    if (cdt1.includes('-')) {
                        cdt1 = cdt1.split('-')
                    }
                    result += `if(${that.getStrFormFunc(cdt0, cdt1)}) return Infinity;\n`
                }
            })
            result += "},\n"
        }
        if (mod.lengthOfTargetInRange) {
            result += "targetInRange:function(card,player,target,now){\n"
            mod.targetInRange_Infinity.forEach(condition => {
                if (condition === "all") result += "return true;\n";
                else {
                    let list = condition.split(":");
                    let cdt0 = list[0];
                    let cdt1 = list[1]
                    if (cdt1.includes('-')) {
                        cdt1 = cdt1.split('-')
                    }
                    result += `if(${that.getStrFormFunc(cdt0, cdt1)}) return true;\n`
                }
            })
            result += "},\n"
        }
        result += "},\n";
        return result
    }
}