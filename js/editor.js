import {
    adjustTab, indexRange, selectionIsInRange, validParenthness,
    findPrefix, whichPrefix, addPSFix
} from './string.js'
import { listenAttributeChange, element, touchE } from './ui.js'
window.XJB_LOAD_EDITOR = function (_status, lib, game, ui, get, ai) {
    window.XJB_EDITOR_LIST = {
        filter: ['你已受伤', '你未受伤', '你体力不小于3',
            '你本回合使用牌次数大于1'],
        effect: [
            '你摸两张牌', '你恢复一点体力', '你获得一点护甲',
            '你移动场上一张牌', '你失去一点体力', '你随机弃置两张牌',
            '所有角色回复一点体力', '所有角色摸一张牌',
            '所有角色随机弃置两张牌',
            '你摸一张牌，若游戏轮数小于3那么你再摸一张牌',
            '你选择一名其他角色，所选角色摸两张牌', '你选择一名其他角色，所选角色回复一点体力',
            '继承releiji\n', "继承xingshang",
            '继承jieming\n', '继承niepan\n', '继承xunxun\n',
            '继承kurou\n', , '继承chengxiang\n', '继承huituo\n', '继承fangzhu\n',
            '继承yiji\n', "继承luoshen\n"
        ],
        trigger: [
            '你受到伤害后', '你回复体力后',
            '回合结束时', '摸牌阶段开始时', '摸牌阶段结束时', '弃牌阶段开始时', '弃牌阶段结束时',
            '当你判定牌生效后',
            '你于回合外失去手牌后', '你于回合外失去牌后',
            '当你使用杀指定目标时', '当你使用杀指定目标后',
            '当你成为杀的目标后', '当你成为决斗的目标后',
            '当你使用杀后', '当你使用决斗后', '当你使用桃后', '当你使用\u5357\u86ee\u5165\u4fb5后', '当你使用万箭齐发后'
        ],
    };
    window.XJB_PUNC = [" || ", " && ", " + ", " - ", " += ", " -= ", "++", "--", "!", " >= ", " <= ", " == ", " === "]
    lib.xjb_class = {
        player: ['_status.currentPhase', 'target', 'game.me',
            'player', 'trigger.player', 'trigger.source', 'global'],
        players: ['game.players', 'result.targets', 'targets'],
        game: ['game'],
        get: ['get'],
        event: ['event', 'trigger', '_status.event'],
        suit: ['"red"', '"black"', '"club"', '"spade"', '"heart"', '"diamond"', '"none"'],
        nature: ['"ice"', '"fire"', '"thunder"'],
        cardName: [],
        number: ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12', '13'],
        gain: ['"gain2"', '"draw"'],
        logicConj: [" > ", " < ", " >= ", " <= ", " == ", ">", "<", ">=", "<=", "=="]
    }
    lib.xjb_translate = {
        //
        '每名角色': 'global',
        '场上一名角色': 'global',
        '场上一个角色': 'global',
        '场上一位角色': 'global',
        '场上一只角色': 'global',
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
        '牌': 'cards',
        //伤害事件
        '受伤点数': 'trigger.num',
        '受到伤害点数': 'trigger.num',
        '受伤点数': 'trigger.num',
        '伤害点数': 'trigger.num',
        '伤害来源': 'trigger.source',
        '受伤角色': 'trigger.player',
        '受到伤害的角色': 'trigger.player',
        '造成伤害的牌': 'trigger.cards',
        '此牌对应的所有实体牌': 'trigger.cards',
        '此牌对应的实体牌': 'trigger.cards',
        '造成伤害的属性': 'trigger.nature',
        '伤害属性': 'trigger.nature',
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
        //花色颜色
        '方片': '"diamond"',
        '无花色': '"none"',
        '黑桃': '"spade"',
        '红桃': '"heart"',
        '红色': '"red"',
        '黑色': '"black"',
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
        //player
        '你': 'player',
        '玩家': 'game.me',
        '目标': 'target',
        '当前回合角色': '_status.currentPhase',
        '触发事件的角色': 'trigger.player',
        '触发角色': 'trigger.player',
        '目标角色': 'trigger.target',
        //players
        '所选角色': 'result.targets',
        '所选的角色': 'result.targets',
        '选择的角色': 'result.targets',
        '所有角色': 'game.players',
        //
        '储存': 'storage',
        '体力': 'hp',
        '体力值': 'hp',
        '体力上限': 'maxHp',
        '护甲': 'hujia',
        '护甲值': 'hujia',
        'id': 'name1',
        '手牌数': 'countCards:"h"',
        '牌数': 'countCards:"he"',
        '区域内牌数': 'countCards:"hej"',
        //
        '有手牌': 'hasCard:"h"',
        '有牌': 'hasCard:"he"',
        '区域内有牌': 'hasCard:"hej"',
        '已受伤': 'isDamaged',
        '未受伤': 'isHealthy',
        '存活': 'isAlive',
        '背面朝上': 'isTurnedOver',
        '武将牌背面朝上': 'isTurnedOver',
        '为体力值为全场最少或之一': 'isMinHp',
        '为手牌数为全场最少或之一': 'isMinHandcard',
        //
        '获取本回合指定其他角色为目标的使用牌事件': "getHistory:'useCard':function(evt){return evt.targets.filter(current=>target!=player)}",
        '获取本回合指定其他角色为目标的打出牌事件': "getHistory:'respond':function(evt){return evt.targets.filter(current=>target!=player)}",
        '本回合使用牌的次数': `getHistory:'useCard':intoFunction://!?length`,
        '本回合使用牌次数': `getHistory:'useCard':intoFunction://!?length`,
        //其他写法
        '收到伤害': 'damage',
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
        '获得区域内的牌': 'gainPlayerCard:"hej":intoFunction',
        '获得区域内牌': 'gainPlayerCard:"hej":intoFunction',
        '获得区域里牌': 'gainPlayerCard:"hej":intoFunction',
        '获得区域里的牌': 'gainPlayerCard:"hej":intoFunction',
        '弃置区域内牌': 'discardPlayerCard:"hej":intoFunction',
        '弃置区域内的牌': 'discardPlayerCard:"hej":intoFunction',
        '弃置区域里牌': 'discardPlayerCard:"hej":intoFunction',
        '弃置区域里的牌': 'discardPlayerCard:"hej":intoFunction',
        '随机弃手牌': 'randomDiscard',
        '随机弃置手牌': 'randomDiscard',
        '随机弃牌': 'randomDiscard:"he":intoFunction',
        '随机弃置牌': 'randomDiscard:"he":intoFunction',
        '随机获得牌': 'randomGain',
        '移动场上牌': 'moveCard',
        '获得角色牌': 'gainPlayerCard:"he":intoFunction',
        '弃置角色牌': 'discardPlayerCard:"he":intoFunction',
        '获得角色手牌': 'gainPlayerCard:"he":intoFunction',
        '弃置角色手牌': 'discardPlayerCard:"he":intoFunction',
        '将手牌补至': 'drawTo',
        '手牌补至': 'drawTo',
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
        //特殊时机
        '成为一张牌的目标': "target:useCardToTarget",
        '成为牌的目标': "target:useCardToTarget",
        '成为一张牌的目标时': "target:useCardToTarget",
        '成为牌的目标时': "target:useCardToTarget",
        '成为一张牌的目标后': "target:useCardToTargeted",
        '成为牌的目标后': "target:useCardToTargeted",
        '亮出拼点牌前': 'compareCardShowBefore',
        '亮出拼点牌之前': 'compareCardShowBefore',
        '造成伤害': 'damageSource',
        '造成伤害时': 'damageSource',
        '造成伤害后': 'damageSource',
        '进入濒死阶段时': 'dying',
        '进入濒死状态时': 'dying',
        '脱离濒死状态时': 'dyingAfter',
        '牌被弃置后': 'loseAfter:discard',
        '需要打出闪时': 'chooseToRespondBefore:shan',
        '需要使用闪时': 'chooseToUseBefore:shan',
        '需要打出杀时': 'chooseToRespondBefore:sha',
        '需要使用杀时': 'chooseToUseBefore:sha',
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
        //
        //'此杀伤害+1': `++;\n`
    }
    let obj = {
        //该函数用于生成lib.xjb_translate，用于将中文转为代码
        xjb_translate: function () {
            function randomNum() {
                const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                for (let i = 0; i < 11; i++) {
                    for (let a = 10; a > i; a--) {
                        lib.xjb_translate[`${i}到${a}`] = `new Array(${list.slice(i, a + 1)}).randomGet()`
                    }
                }
            }
            function translateEvent() {
                let trigger = {
                    //
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
                    '牌置于装备区': 'equip',
                    '牌置于判定区': 'addJudge',
                    '扣置于武将牌上': 'addToExpansion',
                    '置于武将牌上': 'addToExpansion',
                    '置于武将牌旁': 'addToExpansion',
                    '将牌扣置于武将牌上': 'addToExpansion',
                    '将牌置于武将牌上': 'addToExpansion',
                    '将牌置于武将牌旁': 'addToExpansion',
                    //
                    "恢复体力": "recover",
                    "恢复体力值": "recover",
                    "回复体力": "recover",
                    "回复体力值": "recover",
                    '回血': 'recover',
                    '受伤': 'damage',
                    "受到伤害": "damage",
                    '失去体力': 'loseHp',
                    '流失体力': 'loseHp',
                    '失去体力值': "loseHp",
                    '失去体力上限': 'loseMaxHp',
                    '增加体力上限': 'gainMaxHp',
                    //
                    '横置/重置': 'link',
                    '横置或重置': 'link',
                    '翻面': 'turnOver',
                    '武将牌翻面': 'turnOver',
                }
                let list = Object.values(trigger)
                let list2 = Object.keys(trigger)
                list2.forEach((i, k) => {
                    lib.xjb_translate[i] = list[k]
                    lib.xjb_translate[i + "时"] = list[k] + "Begin"
                    lib.xjb_translate[i + "开始"] = list[k] + "Begin"
                    lib.xjb_translate[i + "开始时"] = list[k] + "Begin"
                    lib.xjb_translate[i + "开始前"] = list[k] + "Begin"
                    lib.xjb_translate[i + "结束"] = list[k] + "End"
                    lib.xjb_translate[i + "结束时"] = list[k] + "End"
                    lib.xjb_translate[i + "结束后"] = list[k] + "End"
                    lib.xjb_translate[i + "前"] = list[k] + "Before"
                    lib.xjb_translate[i + "之前"] = list[k] + "Before"
                    lib.xjb_translate[i + "后"] = list[k] + "After"
                    lib.xjb_translate[i + "结算后"] = list[k] + "After"
                    //
                    lib.xjb_translate["令一名角色" + i] = "source:" + list[k]
                    lib.xjb_translate["令一名角色" + i + "时"] = "source:" + list[k] + "Begin"
                    lib.xjb_translate["令一名角色" + i + "结束"] = "source:" + list[k] + "End"
                    lib.xjb_translate["令一名角色" + i + "前"] = "source:" + list[k] + "Before"
                    lib.xjb_translate["令一名角色" + i + "之前"] = "source:" + list[k] + "Before"
                    lib.xjb_translate["令一名角色" + i + "后"] = "source:" + list[k] + "After"
                    //
                    lib.xjb_translate["获取本回合的" + i + "事件"] = 'getHistory:"' + list[k] + '"'
                    lib.xjb_translate["获取本回合的" + i + "的事件"] = 'getHistory:"' + list[k] + '"'
                    lib.xjb_translate["获取本回合" + i + "事件"] = 'getHistory:"' + list[k] + '"'
                    lib.xjb_translate["获取此回合的" + i + "事件"] = 'getHistory:"' + list[k] + '"'
                    lib.xjb_translate["获取此回合的" + i + "的事件"] = 'getHistory:"' + list[k] + '"'
                    lib.xjb_translate["获取此回合" + i + "事件"] = 'getHistory:"' + list[k] + '"'
                    //
                    lib.xjb_translate["获取" + i + "事件"] = 'getAllHistory:"' + list[k] + '"'
                    lib.xjb_translate["获取" + i + "的事件"] = 'getAllHistory:"' + list[k] + '"'
                    //
                    lib.xjb_translate['名为' + i + '的父事件'] = 'getParent:"' + list[k] + '":intoFunction'
                })
                lib.xjb_translate["判定牌生效前"] = "judge";
                lib.xjb_translate["判定牌生效后"] = "judgeEnd";
                lib.xjb_translate["失去手牌后"] = "loseAfter:h";
                lib.xjb_translate["受到伤害后"] = "damageEnd";
            };
            function translateVariable() {
                "bcdfghlmnoprstuvwxyz".split('')
                    .forEach(i => {
                        lib.xjb_translate[i + '点'] = i
                        lib.xjb_translate[i.toUpperCase() + '点'] = i.toUpperCase()
                        lib.xjb_translate[i + '张'] = i
                        lib.xjb_translate[i.toUpperCase() + '张'] = i.toUpperCase()
                        lib.xjb_translate[i + '张'] = i
                        lib.xjb_translate[i.toUpperCase() + '点'] = i.toUpperCase()
                    })
            };
            function translateNumber() {
                for (let i = 0; i < 100; i++) {
                    lib.xjb_translate["步骤" + i] = '"step ' + i + '"'
                    lib.xjb_translate["步骤" + get.cnNumber(i)] = '"step ' + i + '"'
                    lib.xjb_translate["第" + i + "步"] = '"step ' + i + '"'
                    lib.xjb_translate["第" + get.cnNumber(i) + "步"] = '"step ' + i + '"'
                    lib.xjb_translate["跳至第" + i + "步"] = `event.goto(${i})`
                    lib.xjb_translate["跳至第" + get.cnNumber(i) + "步"] = `event.goto(${i})`
                }
                for (let i = 1; i < 14; i++) {
                    lib.xjb_translate["牌堆中牌点数为" + get.strNumber(i)] = `cardPile2: card => get.number(card, false) === "${i}":intoFunction`
                    lib.xjb_translate["弃牌堆中牌点数为" + get.strNumber(i)] = `discardPile: card => get.number(card, false) === "${i}":intoFunction`
                }
                for (let i = 0; i < 51; i++) {
                    lib.xjb_translate[i + "张"] = '' + i
                    lib.xjb_translate[get.cnNumber(i) + "张"] = '' + i
                    lib.xjb_translate[i + "名"] = '' + i
                    lib.xjb_translate[get.cnNumber(i) + "名"] = '' + i
                    lib.xjb_translate[i + "点"] = '' + i
                    lib.xjb_translate[get.cnNumber(i) + "点"] = '' + i
                }
            };
            function translateCard() {
                const CardMission = {
                    /**
                     * @description According  to the attribute , set translation for getting card from the cardPile
                     * @param {String} attributeValue such as 'sha'(name),"red"(color)
                     * @param {String} attributeKey such as "name","color"
                     * @param {String} cn attributeValue in Chinese
                     */
                    cardPile: (attributeValue, attributeKey, cn) => {
                        lib.xjb_translate["牌堆中" + cn] = `cardPile2: card => get.${attributeKey}(card, false) === "${attributeValue}":intoFunction`
                    },
                    /**
                     * @description According  to the attribute , set translation for getting card from the discardPile 
                     * @param {String} attributeValue such as 'sha'(name),"red"(color)
                     * @param {String} attributeKey such as "name","color"
                     * @param {String} cn attributeValue in Chinese
                     */
                    discardPile: (attributeValue, attributeKey, cn) => {
                        lib.xjb_translate["弃牌堆中" + cn] = `discardPile: card => get.${attributeKey}(card, false) === "${attributeValue}":intoFunction`
                    },
                    /**
                     * @description According  to the attribute , set translation for a target trigger 
                     * @param {String} attribute id,color,suit and so on
                     * @param {String} cn attribute in Chinese
                     */
                    target: (attribute, cn) => {
                        lib.xjb_translate["成为" + cn + '的目标时'] = 'target:' + attribute + ':' + 'useCardToTarget';
                        lib.xjb_translate["成为" + cn + '的目标后'] = 'target:' + attribute + ':' + 'useCardToTargeted';
                    },
                    /**
                     * @description According  to the attribute , set translation for a player trigger 
                     * @param {String} attribute id,color,suit and so on
                     * @param {String} cn attribute in Chinese
                     */
                    player: (attribute, cn) => {
                        lib.xjb_translate["使用" + cn + '指定目标时'] = 'player:' + attribute + ':' + 'useCardToPlayer';
                        lib.xjb_translate["使用" + cn + '指定目标后'] = 'player:' + attribute + ':' + 'useCardToPlayered';
                    },
                    /**
                     * @description According  to the attribute , set translation for a player's Use trigger 
                     * @param {String} attribute id,color,suit and so on
                     * @param {String} cn attribute in Chinese
                     */
                    playerUse: (attribute, cn) => {
                        lib.xjb_translate["使用" + cn + '前'] = attribute + ':' + 'useCardBegin';
                        lib.xjb_translate["使用" + cn + '时'] = attribute + ':' + 'useCard';
                        lib.xjb_translate["使用" + cn] = attribute + ':' + 'useCard';
                        lib.xjb_translate["使用" + cn + '后'] = attribute + ':' + 'useCardAfter';
                    },
                    /**
                     * @description According  to the attribute , set translation for a player's using card times in a phase up to that time
                     * @param {String} attribute id
                     * @param {String} cn attribute in Chinese
                     */
                    usedTimes: (attribute, cn) => {
                        lib.xjb_translate['使用' + cn + '次数'] =
                            lib.xjb_translate[cn + '使用次数'] =
                            "getStat:intoFunction://!?card://!?" + attribute
                    }
                }
                Object.keys(lib.card).forEach(i => {
                    if (lib.translate[i]) {
                        const cardId = i, cardTranslate = lib.translate[i], cardModelTranslate = ('【' + lib.translate[i] + '】')
                        lib.xjb_translate[lib.translate[i]] = '"' + i + '"'
                        CardMission.cardPile(cardId, 'name', cardTranslate)
                        CardMission.cardPile(cardId, 'name', cardModelTranslate)
                        CardMission.discardPile(cardId, 'name', cardTranslate)
                        CardMission.discardPile(cardId, 'name', cardModelTranslate)
                        CardMission.target(cardId, cardTranslate)
                        CardMission.target(cardId, cardModelTranslate)
                        CardMission.player(cardId, cardTranslate)
                        CardMission.player(cardId, cardModelTranslate)
                        CardMission.playerUse(cardId, cardModelTranslate)
                        CardMission.playerUse(cardId, cardTranslate)
                        CardMission.usedTimes(cardId, cardTranslate)
                        CardMission.usedTimes(cardId, cardModelTranslate)
                    }
                    lib.xjb_class.cardName.push('"' + i + '"')
                })
                lib.suits.forEach(i => {
                    const suit = i, suitTranslate = lib.translate[i + '2'] + "牌"
                    CardMission.cardPile(suit, 'suit', suitTranslate)
                    CardMission.discardPile(suit, 'suit', suitTranslate)
                    CardMission.target(suit, suitTranslate)
                    CardMission.player(suit, suitTranslate)
                    CardMission.playerUse(suit, suitTranslate)
                })
                Object.keys(lib.color).forEach(i => {
                    const color = i, colorTranslate = lib.translate[i] + "牌"
                    CardMission.cardPile(color, 'color', colorTranslate)
                    CardMission.discardPile(color, 'color', colorTranslate)
                    CardMission.target(color, colorTranslate)
                    CardMission.player(color, colorTranslate)
                    CardMission.playerUse(color, colorTranslate)
                })
                let CardType = [...Object.keys(lib.cardType), 'basic', 'delay', 'trick', 'equip'].map(i => {
                    return lib.translate[i] + "牌"
                });
                CardType.forEach((a, index) => {
                    lib.xjb_translate[a] = "'" + Object.keys(lib.cardType)[index] + "'"
                    lib.xjb_translate[a] = '"' + Object.keys(lib.cardType)[index] + '"'
                });
            };
            function translateSkill() {
                let list = Object.keys(lib.skill)
                list = list.filter(a => {
                    if (a === "global") return false;
                    if (a === "globalmap") return false;
                    if (a.indexOf("_") === 0) return false;
                    return true;
                })
                list.forEach(i => {
                    lib.xjb_translate['发动' + i + '次数'] =
                        lib.xjb_translate[i + '发动' + '次数'] =
                        "getStat:intoFunction://!?skill://!?" + i
                })
            };
            randomNum();
            translateEvent();
            translateVariable();
            translateNumber();
            translateCard();
            translateSkill();
        },
        content: function () {
            get.xjb_makeIt = game.xjb_makeIt = function (value) {
                if (value === 'gain') return '"gain2"'
                return 'undefined'
            }
            //判定类型
            get.xjb_judgeType = game.xjb_judgeType = function (word) {
                if (!isNaN(Number(word))) return 'number'
                for (let k in lib.xjb_class) {
                    if (lib.xjb_class[k] && lib.xjb_class[k].includes(word)) return k
                }
            }
            get.xjb_MapNum = function (value, input) {
                if (value === 'createCard' || value === 'createCard2') {
                    if (input === 'cardName') return 1
                    if (input === 'suit') return 2
                    if (input === 'number') return 3
                    if (input === 'nature') return 4
                }
                if (value === 'gain') {
                    if (input === 'gain') return 1
                    return 2
                }
                if (value === "addToExpansion") {
                    if (input === 'gain') return 1
                    return 2
                }
            }
            get.xjb_fAgruments = function (value) {
                let list = []
                if (["createCard", 'createCard2'].includes(value)) list = ['cardName', 'suit', 'number', 'nature']
                if (["addToExpansion", 'gain'].includes(value)) list = ['gain']
                return list
            }
            game.xjb_skillEditor = function () {
                //
                const playerCN = new Array("你", "玩家", "目标角色", "当前回合角色", "所选角色", "选择的角色", "所选的角色", "所有角色", "触发角色")
                let player = ui.create.player(); player.init('xjb_caocao')
                let eventModel = {
                    ..._status.event,
                    num: 1,
                    targetprompt: '1',
                    filterTarget: function () { },
                    set: function () { },
                    cancel: function () { }
                }
                eventModel.trigger = undefined;
                let backArr = ui.create.xjb_back()
                let back = backArr[0]
                let close = backArr[1]
                back.close = close
                back.ele = {}
                back.skill = {
                    mode: '',
                    id: 'xxx',
                    kind: '',
                    type: [],
                    filter: [],
                    /*
                    jianxiong-gain:用来确保获得的为实体牌而且处于处理区 
                    viewAs:用来确保技能类别为视为类技能  
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
                    variable_filter: new Map(),
                    variable_content: new Map(),
                    filterTarget: [],
                    content: [],
                    contentAsync: false,
                    trigger: {
                        player: [],
                        source: [],
                        global: [],
                        target: []
                    },
                    uniqueTrigger: [],
                    respond: [],
                    viewAs: [],
                    viewAsCondition: []
                }
                back.pageNum = 0;
                back.pages = [];
                back.trigger = [];
                back.phaseUse = [];
                back.choose = [];
                back.allVariable = function () {
                    back.skill.variable_content.clear();
                    back.skill.variable_filter.clear();
                    back.skill.content.forEach(str => {
                        let regexp = /(var|const|let)(\s)+(.+)\=\s*(.+)/
                        if (regexp.exec(str) != null) {
                            str.replace(regexp, function (...arr) {
                                /**
                                 * @type {Map}
                                 */
                                let map = back.skill.variable_content;
                                map.set(arr[4].replace(/\s/g, ""), arr[3].replace(/\s/g, ""));
                            })
                        }
                    });
                    back.skill.filter.forEach(str => {
                        let regexp = /(var|const|let)(\s)+(.+)=\s*(.+)/
                        if (regexp.exec(str) != null) {
                            str.replace(regexp, function (...arr) {
                                /**
                                 * @type {Map}
                                 */
                                let map = back.skill.variable_filter;
                                map.set(arr[4].replace(/\s/g, ""), arr[3].replace(/\s/g, ""));
                            })
                        }
                    });
                }
                back.updateDisplay = function () {
                    [...back.trigger, ...back.phaseUse, ...back.choose].forEach(i => {
                        i.style.display = 'none'
                    });
                    switch (back.skill.kind) {
                        case "trigger": {
                            back.trigger.forEach(i => { i.style.display = 'block' });
                        }; break;
                        case 'enable:"phaseUse"': {
                            back.phaseUse.forEach(i => { i.style.display = 'block' });
                        }; break;
                        default: {
                            back.skill.boolList.includes("viewAs") && back.choose.forEach(i => { i.style.display = 'block' })
                        }; break;
                    }
                }
                back.modTest = function () {
                    back.ele.content.submit(true);
                    back.skill.mod = {
                        cardUsable_Infinity: [],
                        targetInRange_Infinity: [],
                    }
                    Object.defineProperty(back.skill.mod, 'length', {
                        get() {
                            let result = 0;
                            for (let k in back.skill.mod) {
                                const atrr = back.skill.mod[k];
                                if (Array.isArray(atrr)) result += atrr.length;
                            }
                            return result;
                        }
                    });
                    Object.defineProperty(back.skill.mod, 'lengthOfCardUsable', {
                        get() {
                            let result = 0;
                            for (let k in back.skill.mod) {
                                const atrr = back.skill.mod[k];
                                if (k.startsWith("cardUsable") && Array.isArray(atrr)) result += atrr.length;
                            }
                            return result;
                        }
                    });
                    Object.defineProperty(back.skill.mod, 'lengthOfTargetInRange', {
                        get() {
                            let result = 0;
                            for (let k in back.skill.mod) {
                                const atrr = back.skill.mod[k];
                                if (k.startsWith("targetInRange") && Array.isArray(atrr)) result += atrr.length;
                            }
                            return result;
                        }
                    })
                    /**
                     * @param {RegExp} regexp 
                     * @param {string} output 
                     * @param {string} attr
                     */
                    function addMod(regexp, output, attr) {
                        back.skill.content.forEach((cont, i) => {
                            if (regexp.exec(cont) !== null) {
                                const last = back.skill.content[i - 1]
                                if (last && (last === "{" || last === ")")) return;
                                back.skill.content.remove(cont);
                                back.skill.mod[attr].push(output)
                            }
                        })
                    }
                    //card_use_Infinity
                    addMod(/^\s*(你|player)\s*使用的?卡?牌(无|没有)(次数|数量)限制\s*$/, 'all', 'cardUsable_Infinity');
                    //sha_use_Infinity
                    addMod(/^\s*(你|player)\s*使用的?杀(无|没有)(次数|数量)限制\s*$/, "name:sha", "cardUsable_Infinity");
                    //jiu_use_Infinity
                    addMod(/^\s*(你|player)\s*使用的?酒(无|没有)(次数|数量)限制\s*$/, "name:jiu", "cardUsable_Infinity");
                    //card_range_Infinity
                    addMod(/^\s*(你|player)\s*使用的?卡?牌(无|没有)(距离)限制\s*$/, "all", "targetInRange_Infinity");
                    //sha_range_Infinity
                    addMod(/^\s*(你|player)\s*使用的?杀(无|没有)(距离)限制\s*$/, "name:sha", "targetInRange_Infinity");
                    //jiu_range_Infinity
                    addMod(/^\s*(你|player)\s*使用的?酒(无|没有)(距离)限制\s*$/, "name:jiu", "targetInRange_Infinity");
                    //trick&delay_range_Infinity
                    addMod(/^\s*(你|player)\s*使用的?锦囊牌(无|没有)(距离)限制\s*$/, "type:trick-delay", "targetInRange_Infinity");
                }
                back.prepare = function () {
                    back.allVariable();
                    back.skill.boolList.length = 0;
                    function isJianxiongGain() {
                        /**
                         * @type {Map}
                         */
                        let map = back.skill.variable_content
                        let p = map.get("trigger.cards")
                        const bool1 = back.skill.trigger.player.includes("damageEnd");
                        const bool2 = back.skill.content.some(str => {
                            return /gain\(.*trigger.cards.*\)/.exec(str) !== null;
                        });
                        const bool3 = back.skill.content.some(str => {
                            return new RegExp(`gain\(.*${p}.*\)`).exec(str) != null;
                        })
                        return bool1 && (bool2 || bool3);
                    }
                    function isViewAs() {
                        const bool = back.skill.kind && back.skill.kind !== "trigger" && back.skill.kind !== 'enable:"phaseUse"'
                        return bool
                    }
                    isJianxiongGain() && back.skill.boolList.push("jianxiong_gain");
                    isViewAs() && back.skill.boolList.push("viewAs");
                    //
                    back.modTest()
                    //dom部分
                    //更新显示状态
                    back.updateDisplay();
                }
                back.organize = function () {
                    back.prepare();
                    /*初始化:最终输出的文字*/
                    let str = '',
                        /*初始化：步骤变量*/
                        step = -1, bool,
                        /*初始化:逻辑变量*/
                        logic = false, IF = false, branch = false, afterBranch = [];
                    //根据所选的编辑器类型确定开头
                    if (this.skill.mode === 'mt') {
                        str = '"' + this.skill.id + '":{\n'
                    } else if (this.skill.mode === 'mainCode') {
                        str = 'lib.skill["' + this.skill.id + '"]={\n'
                    } else if (!this.skill.mode) {
                        this.skill.mode = 'self'
                    }
                    //init部分
                    if (this.skill.type.includes("mainSkill") || this.skill.type.includes("viceSkill")) {
                        str += "init:function(player,skill){\n"
                        if (this.skill.type.includes("mainSkill")) {
                            str += `const bool = player.checkMainSkill("${this.skill.id}");\n`
                        }
                        if (this.skill.type.includes("viceSkill")) {
                            str += `const bool = player.checkViceSkill("${this.skill.id}")\n&& !player.viceChanged;\n`
                        }
                        if (back.skill.uniqueList.includes("mainVice-remove1")) {
                            str += `bool && player.removeMaxHp();\n`
                        }
                        str += '},\n'
                    }
                    //mod部分
                    if (back.skill.mod.length) {
                        str += "mod:{\n";
                        if (back.skill.mod.lengthOfCardUsable) {
                            str += "cardUsable:function(card,player,num){\n"
                            back.skill.mod.cardUsable_Infinity.forEach(condition => {
                                if (condition === "all") str += "return Infinity;\n";
                                else {
                                    let list = condition.split(":");
                                    if (list[0] === "name") str += `if(get.name(card,player)==="${list[1]}") return Infinity;\n`
                                }
                            })
                            str += "},\n"
                        }
                        if (back.skill.mod.lengthOfTargetInRange) {
                            str += "targetInRange:function(card,player,target,now){\n"
                            back.skill.mod.targetInRange_Infinity.forEach(condition => {
                                if (condition === "all") str += "return true;\n";
                                else {
                                    let list = condition.split(":");
                                    if (list[0] === "name") str += `if(get.name(card,player)==="${list[1]}") return true;\n`
                                    if (list[0] === "type") {
                                        if (list[1].includes('-')) {
                                            let typeList = list[1].split("-").map(type => `"${type}"`)
                                            str += `if([${typeList}].includes(get.type(card,player))) return true;\n`
                                        } else {
                                            `if(get.type(card,player)==="${list[1]}") return true;\n`
                                        }
                                    }
                                }
                            })
                            str += "},\n"
                        }
                        str += "},\n";
                    }
                    //处理触发事件
                    if (this.skill.kind === 'trigger') {
                        /*开头*/
                        str += 'trigger:{\n'
                        /*添加函数的制作*/
                        let addTrigger = (value) => {
                            if (this.skill.trigger[value].length === 0) return false
                            str += value
                            str += ':['
                            this.skill.trigger[value].forEach((i, k) => {
                                str += '"' + i + '"'
                                str += (k == this.skill.trigger[value].length - 1 ? '' : ',')
                            })
                            str += '],\n'
                        }
                        ["player", "global", "source", "target"].forEach(TriA => {
                            addTrigger(TriA);
                        })
                        /*结束*/
                        str += '},\n'
                    }
                    else if (this.skill.kind) {
                        str += this.skill.kind + ',\n';
                    }
                    //遍历技能类别
                    this.skill.type.forEach(i => {
                        if (i === 'filterTarget' && back.skill.kind != 'enable:"phaseUse"' || (i === 'filterTarget' && back.skill.filterTarget && back.skill.filterTarget.length > 0)) return;
                        if (i === 'filterCard' && back.skill.kind != 'enable:"phaseUse"') return;
                        str += i + ':true,\n'
                    })
                    //filter部分
                    str += 'filter:function(event,player){\n'
                    //主公技
                    if (this.skill.type.includes("zhuSkill")) {
                        str += 'if(! player.hasZhuSkill("' + this.skill.id +
                            '")) return false;\n'
                    }
                    //势力技
                    if (back.skill.type.includes("groupSkill")) {
                        const group = findPrefix(back.skill.uniqueList, "group").map(k => k.slice(6))
                        if (group.length > 0) {
                            str += `if(player.group != "${group[0]}") return false;\n`
                        }
                    }
                    //respond
                    if (back.skill.trigger.player.includes("chooseToRespondBegin") || back.skill.trigger.player.includes("chooseToRespondBefore")) {
                        str += "if(event.responded) return false;\n"
                        if (back.skill.respond.length) {
                            back.skill.respond.forEach(resp => {
                                str += `if(!event.filterCard({name:"${resp}",isCard:true},player,event)) return false;`
                            })
                        }
                    }
                    const filterCardDispose = (filterCardType, standard) => {
                        const filterTypeList = this.skill["filter_" + filterCardType].map(x => {
                            return x.replace(/:.*$/, "")
                        })
                        const filterContentList = this.skill["filter_" + filterCardType].map(x => {
                            return x.replace(/[^:\n]*:/, "")
                        })
                        let filterTypeAllList = new Set(filterTypeList)
                        filterTypeAllList.forEach(x => {
                            let arrList = filterContentList.filter((item, index) => {
                                return filterTypeList[index] === x;
                            })
                            let tempStr = arrList.join()
                            if (x === "useCardAfter") str += `if(event.name==='useCard'&&! [${tempStr}].includes(get.${standard}(event.card))) return false;\n`
                            else str += `if(event.name==='${x}'&&! [${tempStr}].includes(get.${standard}(event.card))) return false;\n`
                        })
                    }
                    this.skill.filter.forEach((i, k) => {
                        //如果是空字符，则不处理
                        if (i === "") return;
                        //如果含赋值语句或本身就有return，则不添加return
                        if (i.indexOf("return") >= 0 || i.indexOf("var ") >= 0 || i.indexOf("let ") >= 0 || i.indexOf("const ") >= 0 || i.indexOf(" = ") >= 0 || i.indexOf(" += ") >= 0 || i.indexOf(" -= ") >= 0) {
                            str += i + '\n'
                        }
                        if (i.includes('if(') && IF === false) {
                            str += i;
                            IF = true
                        }
                        else if (i === ")" && IF === true) {
                            str += i;
                            IF = false;
                        }
                        else if (IF === true) {
                            str += i;
                        }
                        else if (i === '{' || i === '}') {
                            str += i + '\n';
                        }
                        else if (i.slice(-3, -1) === "||" || i.slice(-3, -1) === "&&") {
                            if (logic == false) str += 'if(! (' + i
                            else str += '\n' + i;
                            logic = true;
                        }
                        else if (logic === true) {
                            str += '\n' + i + ')) return false;\n';
                            logic = false;
                        }
                        else {
                            str += 'if(! (' + i + ')) return false;\n'
                        }
                    });
                    if (this.skill.filter_card.length > 0) filterCardDispose('card', 'name');
                    if (this.skill.filter_suit.length > 0) filterCardDispose('suit', 'suit');
                    if (this.skill.filter_color.length > 0) filterCardDispose('color', 'color')
                    if (this.skill.uniqueTrigger.length > 0) {
                        if (this.skill.uniqueTrigger.some(x => x.includes("outPhase"))) {
                            const outPhaseList = this.skill.uniqueTrigger.filter(x => x.includes("outPhase")).map(x => x.replace('outPhase:', ''))
                            outPhaseList.forEach(x => {
                                const add = x === 'lose' ? '' : `event.name==="${x}"&&`
                                str += `if(${add}player===_status.currentPhase) return false;\n`
                            })
                        }
                        if (this.skill.uniqueTrigger.some(x => x.includes("inPhase"))) {
                            const inPhaseList = this.skill.uniqueTrigger.filter(x => x.includes("inPhase")).map(x => x.replace('inPhase:', ''))
                            inPhaseList.forEach(x => {
                                const add = x === 'lose' ? '' : `event.name==="${x}"&&`
                                str += `if(${add}player!==_status.currentPhase) return false;\n`
                            })
                        }
                        if (this.skill.uniqueTrigger.includes('player:loseAfter')) {
                            str += `if(event.name==="gain"&&event.player==player) return false;\n`
                            str += `if(!(event.getl(player)&&event.getl(player).cards2&&event.getl(player).cards.length>0)) return false;\n`
                        } else if (this.skill.uniqueTrigger.includes('player:loseAfter:h')) {
                            str += `if(event.name==="gain"&&event.player==player) return false;\n`
                            str += `if(!(event.getl(player)&&event.getl(player).hs&&event.getl(player).hs.length>0)) return false;\n`
                        } else if (this.skill.uniqueTrigger.includes('player:loseAfter:discard')) {
                            str += `if(!(event.type==='discard'&&event.getl(player).cards2.length>0)) return false;\n`
                        }
                    }
                    if (!back.returnIgnore) str += 'return true;\n';
                    str += '},\n';
                    if (back.skill.kind == 'enable:"phaseUse"' && back.skill.filterTarget && back.skill.filterTarget.length > 0 && back.skill.type.includes('filterTarget')) {
                        str += 'filterTarget:function(card,player,target){\n';
                        back.skill.filterTarget.forEach(i => {
                            let a = i;
                            //如果含赋值语句或本身就有return，则不添加return
                            if (i.indexOf("return") >= 0 || i.indexOf("var ") >= 0 || i.indexOf("let ") >= 0 || i.indexOf("const ") >= 0 || i.indexOf(" = ") >= 0 || i.indexOf(" += ") >= 0 || i.indexOf(" -= ") >= 0) {
                                str += i + '\n'
                            }
                            else str += 'if( !(' + a + ")) return false;\n"
                        })
                        str += 'return true;\n'
                        str += '},\n'
                    }
                    //content部分
                    let judgeAwaken = () => {
                        return this.skill.type.filter(i => {
                            return ["limited", "juexingji", "dutySkill"].includes(i)
                        }).length > 0
                    }
                    if (!back.skill.boolList.includes("viewAs")) {
                        str += back.skill.contentAsync ? 'async content(event,trigger,player){\n' : 'content:function(){\n';
                        if (!back.stepIgnore) {
                            str += '"step 0"\n';
                            step = 0;
                        }
                        if (judgeAwaken()) str += 'player.awakenSkill("' + this.skill.id + '");\n';
                        if (this.skill.type.includes('zhuanhuanji')) str += 'player.changeZhuanhuanji("' + this.skill.id + '");\n'
                        //开始时,先初始化一下变量
                        IF = false;
                        //遍历
                        this.skill.content.forEach(i => {
                            let a = i
                            //这里是步骤矫正
                            if (i.indexOf("'step") >= 0 || i.indexOf('"step') >= 0) {
                                let k = i
                                k = k.replace(/"/g, '')
                                k = k.replace(/'/g, '')
                                k = k.replace('step', '')
                                k = k.replace(' ', '')
                                step++
                                a = '"step ' + step + '"'
                                bool = false
                            } else if (i.indexOf('result.targets') >= 0 && !bool) {
                                a = 'if(result.bool) ' + i
                            } else {
                                let k = i.replace(' ', '')
                                if (k.indexOf('if(result.bool){') === 0) bool = true
                            }
                            if (i.indexOf('chooseTarget') > 0) {
                                if (a.indexOf('other') > 0) {
                                    a = a.replace(/,?other/, '')
                                    a += '.set("filterTarget",function(card,player,target){return player!=target})'
                                }
                                if (!back.stepIgnore) {
                                    a += `.set("prompt",get.prompt("${this.skill.id}"))`
                                    a += `.set("prompt2",(lib.translate["${this.skill.id}_info"]||''))`
                                }
                            }
                            if (i.indexOf('atLeast') > 0) {
                                a = a.replace('atLeast', '')
                                let tempStr = (a.match(/[0-9]+/) && a.match(/[0-9]+/)[0]) || ''
                                a = a.replace(tempStr, '[' + tempStr + ',Infinity]')
                            } else if (i.indexOf('atMost') > 0) {
                                a = a.replace('atMost', '')
                                let tempStr = (a.match(/[0-9]+/) && a.match(/[0-9]+/)[0]) || ''
                                a = a.replace(tempStr, '[1,' + tempStr + ']')
                            }
                            if (i.indexOf("addToExpansion") > 0) {
                                if (i.indexOf("gaintag.add") < 0) {
                                    a += '.gaintag.add( "' + this.skill.id + '")'
                                }
                            }
                            if (i.includes('if(') && IF === false) {
                                str += i;
                                IF = true
                            }
                            else if (i === ")" && IF === true) {
                                str += i;
                                IF = false;
                            }
                            else if (IF === true) {
                                str += a;
                            }
                            else if (i === "{" && branch === false) {
                                str += '{\n';
                                branch = true;
                            }
                            else if (i === "}" && branch === true) {
                                str += '}\n'
                                branch = false
                                afterBranch = afterBranch.filter(x => {
                                    x()
                                    return false;
                                });
                            }
                            else if (branch === true) {
                                function addBranchStence() {
                                    str += `${a}\n`
                                }
                                if (a.includes("if(result.bool) ")) afterBranch.push(addBranchStence)
                                else addBranchStence()
                            }
                            else str += a + "\n"
                            if (!back.stepIgnore && i.indexOf('chooseTarget') > 0) {
                                step++
                                function addStepForChoose() {
                                    str += '"step ' + step + '"\n'
                                    bool = false;
                                }
                                if (!branch) addStepForChoose()
                                else afterBranch.push(addStepForChoose)
                            }
                        })
                        str += '},\n'
                        //获得对你造成伤害的牌
                        if (back.skill.boolList.includes("jianxiong_gain")) {
                            str = addPSFix(str, /[a-z\.]+gain\(.*trigger.cards.*\)/g, `if(get.itemtype(trigger.cards)==="cards"\n&&get.position(trigger.cards[0])==="o"){\n`, '\n}\n')
                            /**
                             * @type {Map}
                             */
                            const map = back.skill.variable_content;
                            let p = map.get("trigger.cards")
                            str = addPSFix(str, new RegExp(`[a-z\.]+gain\(.*${p}.*\)`, "g"), `if(get.itemtype(${p})==="cards"\n&&get.position(${p}[0])=="o"){\n`, '\n}\n')
                        }
                        if (/此【?杀】?(造成的)?伤害(\+|-|\*)/.exec(str) != null) {
                            str = str.replace(/\s+$/gm, "")
                            let regexp = /(此【?杀】?)(造成的)?伤害(\+|-|\*)(?=[0-9a-z_$]+)/g
                            str = str.replace(regexp, function (match, ...p) {
                                return `var id=trigger.target.playerid;\nvar map=trigger.getParent().customArgs;\nif(!map[id]) map[id]={};\nif(typeof map[id].extraDamage!='number'){\nmap[id].extraDamage=0;\n}\nmap[id].extraDamage${p[2]}=`
                            })
                        }
                        if (/(造成|受到)(的)?伤害(\+|-|\*)/.exec(str) != null) {
                            str = str.replace(/\s+$/gm, "")
                            let regexp = /(造成|受到)(的)?伤害(\+|-|\*)(?=[0-9a-z_$]+)/g
                            str = str.replace(regexp, function (match, ...p) {
                                return `trigger.num${p[2]}=`
                            })
                        }
                    }
                    else if (back.skill.viewAs.length === 1 && back.skill.viewAsCondition.length) {
                        /**
                         * @type {string}
                         */
                        const condition = back.skill.viewAsCondition[0]
                        let asCard = back.skill.viewAs[0]
                        let asNature;
                        let costName = condition.startsWith("cardName-") && condition.slice(9)
                        let costNature;
                        let costColor;
                        let costSuit;
                        let position = get.type(costName) == "type" ? "'hes'" : "'hs'"
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
                        str += "viewAs:{\n";
                        str += `name:"${asCard}",\n`;
                        if (asNature) str += `nature:"${asNature}",\n`;
                        str += "},\n";
                        str += "filterCard:{\n";
                        if (costName) str += `name:"${costName}",\n`;
                        if (costNature) str += `nature:"${costNature}",\n`;
                        if (costColor) str += `color:"${costColor}",\n`;
                        if (costSuit) str += `suit:"${costSuit}",\n`;
                        str += `},\n`
                        str += "viewAsFilter:function(player){\n"
                        if (costName) str += `const name = "${costName}";\n`
                        if (costNature) str += `const nature ="${costNature}";\n`;
                        if (costColor) str += `const color ="${costColor}";\n`;
                        if (costSuit) str += `const suit ="${costSuit}";\n`;
                        str += `if(!player.countCards("${position}",{${costName ? "name," : ""}${costNature ? "nature," : ""}${costColor ? "color," : ""}${costSuit ? "suit," : ""}})) return false;\n`
                        str += "},\n"
                        if (position === 'hes') str += "position:'hes',\n"
                        else if (position === 'hs') str += "position:'hs',\n"
                        if (asCard === "tao") {
                            str += "ai:{\n"
                            str += "save:true,\n"
                            str += "},\n"
                        }
                    } else {
                    }
                    if (back.adjust) {
                        str = str.replace(/else\s*\n\s*{/g, "else{");
                        /*匹配满足特定条件的点（.）字符，其前面必须是一个等号（=）或者行首，并且后面跟着一个小写字母。
                        其用于匹配
                        */
                        str = str.replace(/(?<=(\=|^)\s*)\.(?=[a-z])/img, "player.");
                        str = str.replace(/([/][*])(.|\n)*([*][/])/g, "");
                    }
                    if (this.skill.mode === 'mt') str += '},'
                    else if (this.skill.mode === 'mainCode') str += '}'
                    //清除.undefined
                    str = str.replace(/\.undefined/g, "")
                    //处理标点符号使用;!
                    str = str.replace(/,[)]/g, ')');
                    str = str.replace(/,,+/g, ',');
                    str = str.replace(/[(],/g, '(');
                    str = str.replace(/;;+/g, ';');
                    //tab处理
                    str = adjustTab(str, this.skill.mode === 'self' ? 1 : 0);
                    back.target.value = str;
                }
                function dispose(str, number) {
                    //初始化
                    back.NowDidposePlayerType = undefined;
                    //                  
                    let list1 = str.split('\n'), list2 = [], list3 = [], list4 = [];
                    //切割
                    if (number === 1) return list1
                    list1.forEach(i => {
                        list2.push(i.split(' '))
                    })
                    if (number === 2) return list2
                    //翻译
                    list2.forEach(i => {
                        let list = []
                        i.forEach(a => {
                            let c = a.split(''), d = []
                            c.forEach((f, t) => {
                                if (!['当'].includes(f)) d.push(f);
                                else if (c[t + 1] === "前") d.push(f);
                            })
                            d = d.join('')
                            //如果有对应的翻译,则翻译,否则,返回原文
                            d = lib.xjb_translate[d] || d
                            //如果中含有intoFunction,则将其分割,并放置于参数位置
                            if (d.indexOf(":intoFunction") > 0) {
                                d = d.replace(":intoFunction", "");
                                d = d.split(":");
                                return list.push(...d);
                            }
                            list.push(d)
                        })
                        list3.push(list)
                    });
                    if (number === 3) return list3
                    //组装
                    list3.forEach(i => {
                        let str0 = '', str = '', str1 = '', str2 = '', notice = [], bool = true, index,
                            players, logicConj = []
                        //捕捉关键词
                        i.forEach(a => {
                            if (game.xjb_judgeType(a)) {
                                notice.push(game.xjb_judgeType(a))
                                if (logicConj && game.xjb_judgeType(a) === 'player') back.NowDidposePlayerType = a;
                                if (game.xjb_judgeType(a) === 'players') players = a
                                if (game.xjb_judgeType(a) === 'logicConj') logicConj.push(a)
                            }
                        })
                        //组装函数前语句
                        i.forEach((a, b) => {
                            if (!bool) return false
                            function WAW(body) {
                                if (body[a]) {
                                    str += ('.' + a)
                                    if (typeof body[a] === 'function') {
                                        bool = false;
                                        index = b + 1
                                        str2 = '()'
                                    }
                                }
                                else if (a.indexOf(':') > 0 && a.slice(-1) != ',') {
                                    let arrA = a.split(':')
                                    let verbA = arrA.shift()
                                    if (body[verbA]) {
                                        str += '.' + verbA;
                                        str += '(';
                                        str += arrA.join(',');
                                        str += ')';
                                    } else {
                                        str += a;
                                    }
                                }
                                else str += a
                            }
                            if (notice.includes('game')) WAW(game)
                            else if (notice.includes('get')) WAW(get)
                            else if (notice.includes('player')) { WAW(player) }
                            else if (notice.includes('event')) WAW(eventModel)
                            else WAW(player);
                        })
                        //填写参数
                        if (index) {
                            let toOrder = i.splice(index)
                            //排序
                            toOrder.sort((a, b) => {
                                let value1 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(a)),
                                    value2 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(b))
                                return value1 - value2
                            })
                            //补齐必须参数
                            let j = get.xjb_fAgruments(i[i.length - 1])
                            for (let g = 0; g < j.length; g++) {
                                if (get.xjb_judgeType(toOrder[g]) !== j[g]) {
                                    toOrder.splice(g, 0, get.xjb_makeIt(j[g]))
                                }
                            }
                            let puncSwtich = false
                            toOrder.forEach((c, b) => {
                                let string = '', a = c
                                let punc = window.XJB_PUNC
                                //翻译n到m
                                if (c.indexOf('到') > 0) {
                                    let arr = c.split('到')
                                    a = '['
                                    a += lib.xjb_translate[arr[0]] || arr[0]
                                    a += ','
                                    a += lib.xjb_translate[arr[1]] || arr[1]
                                    a += ']'
                                }
                                //非标点符号以,连接
                                if (b > 0 && !punc.includes(a) && !puncSwtich) {
                                    string = ',' + a + ')'
                                }
                                //否则直接连接
                                else {
                                    if (punc.includes(a)) puncSwtich = true
                                    else if (puncSwtich) puncSwtich = false
                                    string = a + ')'
                                }
                                str2 = str2.replace(')', string)
                            })
                        }
                        if (notice.includes('players')) {
                            str0 = players + '.forEach(i=>{'
                            while (str.indexOf(players) >= 0) str = str.replace(players, 'i')
                            while (str2.indexOf(players) >= 0) str2 = str2.replace(players, 'i')
                            str2 += ';})'
                        }
                        if (notice.includes('if') && !notice.includes('then')) {
                            str1 = ')'
                        }
                        let sentence = str0 + str + str1 + str2, p
                        function post() {
                            sentence = sentence.replace(/\/\/\!\?(\w+)(?=\s*,|\s*\)|\s*$|\s*[/]|\s*\.)/, function (match, p1) {
                                p = p1
                                return ""
                            })
                            sentence += "." + p
                        }
                        while (sentence.indexOf('//!?') >= 0) {
                            post();
                            if (p == undefined) break;
                        }
                        if (notice.includes("logicConj")) {
                            if (back.stepIgnore) { }
                            else if (logicConj.length === 1) {
                                let caught;
                                sentence = sentence.replace(new RegExp(`${logicConj[0]}[^\n\)]*`), function (match, p1) {
                                    caught = match;
                                    return "";
                                });
                                let disposedCaught = caught.replace(",", "");
                                sentence += disposedCaught;
                                sentence = sentence.replace(",)", ")")
                            }
                        }
                        list4.push(sentence)
                    })
                    return list4
                }
                /**
                 * @param {String} tag 
                 * @param {String} innerHTML 
                 * @param {HTMLElement} father 
                 * @returns {HTMLElement}
                 */
                function newElement(tag, innerHTML, father) {
                    let h = document.createElement(tag);
                    h.innerHTML = innerHTML;
                    father.appendChild(h);
                    h.setStyle = function (style) {
                        ui.xjb_giveStyle(this, style);
                        return this;
                    };
                    h.style1 = function (style) {
                        return this.setStyle({
                            height: "1.5em",
                            position: 'relative'
                        })
                    };
                    return h;
                }
                /**
                 * 
                 * @param {HTMLElement} ele 
                 * @param {Function} fn 
                 */
                function listener(ele, fn) {
                    ele.addEventListener(lib.config.touchscreen ?
                        'touchend' : 'click', fn)
                }
                function newPage() {
                    let subBack = newElement('div', '', back).setStyle({
                        flexDirection: 'column',
                        bottom: '25px',
                        fontSize: '1.5em',
                        width: 'calc(95% - 50px)',
                        height: 'calc(65% + 50px)',
                        margin: 'auto',
                        position: 'relative',
                        display: 'flex',
                        "font-family": "xingkai"
                    });
                    back.pages.push(subBack)
                    let curtain = newElement('div', '', subBack).setStyle({
                        width: '100%',
                        height: '100%',
                        backgroundColor: "#3c4151",
                        opacity: "0.7",
                        position: 'absolute',
                        zIndex: '-1'
                    });
                    if (back.pages.length > 1) subBack.style.display = "none"
                    return subBack;;
                }
                /**
                 * @param {Event} e 
                 * @returns 
                 */
                function deleteModule(e) {
                    const i = this.selectionStart, k = this.selectionEnd;
                    if (i === k && i === 0) return;
                    if (k > i) return;
                    if (e.key !== "Delete" && e.key !== "Backspace") {
                        return;
                    };
                    e.preventDefault();
                    const deleteModule = (start, end) => {
                        let arr1 = validParenthness(this.value, start, end);
                        let over1 = false
                        let some1 = arr1.some(ranges => {
                            const rangeA = ranges[0], rangeB = ranges[1];
                            if (over1 === true) return true;
                            if (selectionIsInRange(i, rangeA, true) || selectionIsInRange(i, rangeB, true)) {
                                this.value = `${this.value.slice(0, rangeA[0])}${this.value.slice(rangeB[1] + 1)}`;
                                this.arrange();
                                over1 = true;
                                return true;
                            }
                        })
                        return some1
                    }
                    if (!deleteModule('如果', '那么') && !deleteModule('分支开始', '分支结束')) {
                        this.value = `${this.value.slice(0, i - 1)}${this.value.slice(i)}`;
                        this.selectionStart = this.selectionEnd = i - 1;
                    }
                }
                /**
                 * @type {HTMLElement}
                 */
                const buttonContainer = element("div")
                    .style({
                        height: '1em',
                        position: 'relative'
                    })
                    .exit()
                let h1 = newElement('h1', '', back).setStyle({
                    width: '90%'
                });
                let h1Title = newElement("span", "魂氏技能编辑器", h1);
                listener(h1Title, e => {
                    h1.slide.style.display = h1.slide.style.display == "none" ? "inline" : "none"
                });
                let h1Slide = newElement("span", "滑动翻页", h1)
                h1.slide = h1Slide;
                listener(h1Slide, e => {
                    lib.config.xjb_editorSplide = !lib.config.xjb_editorSplide;
                    game.saveConfig("xjb_editorSplide", lib.config.xjb_editorSplide);
                    h1.slide.style.color = lib.config.xjb_editorSplide ? "red" : "gray";
                });
                ui.xjb_giveStyle(h1.slide, {
                    margin: "10px",
                    display: "none",
                    color: (lib.config.xjb_editorSplide ? "red" : "gray"),
                    opacity: "0.75",
                    fontSize: "0.75em"
                })//*/
                //换页功能
                //切换至下一页
                let next = newElement('span', '下一页', h1).setStyle({
                    float: 'right'
                });
                back.ele.nextPage = next;
                function turnNextPage() {
                    if (back.pageNum < back.pages.length - 1) back.pageNum++
                    else back.pageNum = 0
                    back.pages.forEach((i, k) => {
                        i.style.display = back.pageNum == k ? 'flex' : 'none'
                    })
                }
                listener(next, turnNextPage)
                //切换至上一页
                let last = newElement('span', '上一页', h1).setStyle({
                    float: 'right',
                    marginRight: '10px'
                })
                back.ele.lastPage = last
                function turnLastPage() {
                    back.pageNum--
                    if (back.pageNum < 0) back.pageNum = back.pages.length - 1
                    back.pages.forEach((i, k) => {
                        i.style.display = back.pageNum == k ? 'flex' : 'none'
                    })
                }
                listener(last, turnLastPage);
                (function touchPageChange() {
                    function hasParentBack(ele) {
                        let parentNode = ele.parentNode;
                        while (parentNode != null) {
                            if (parentNode == back) {
                                return true;
                            }
                            parentNode = parentNode.parentNode;
                        }
                        return false;
                    }
                    // 初始化触摸相关变量
                    let startX = 0;
                    let isMoving = false;
                    let diffX = 0
                    // 监听touchstart事件
                    function touchS(event) {
                        if (hasParentBack(event.target) || !lib.config.xjb_editorSplide) return;
                        if (event.touches.length === 1) {
                            // 记录起始X坐标
                            startX = event.touches[0].clientX;
                            isMoving = true;
                        }
                    }
                    document.addEventListener('touchstart', touchS);
                    // 监听touchmove事件
                    function touchM(event) {
                        if (hasParentBack(event.target) || !lib.config.xjb_editorSplide) return;
                        if (isMoving && event.touches.length === 1) {
                            const endX = event.touches[0].clientX;
                            diffX = endX - startX;
                            // 按照滑动方向更新当前显示的页面    
                            startX = endX;
                        }
                    }
                    document.addEventListener('touchmove', touchM);
                    // 监听touchend事件
                    function touchE(event) {
                        if (hasParentBack(event.target) || !lib.config.xjb_editorSplide) return;
                        if (diffX > 5) {
                            turnLastPage();
                        } else if (diffX < -5) {
                            turnNextPage();
                        }
                        // 更新起始X坐标
                        isMoving = false;
                    }
                    document.addEventListener('touchend', touchE);
                    listener(back.close, e => {
                        document.removeEventListener("touchstart", touchS)
                        document.removeEventListener("touchend", touchE)
                        document.removeEventListener("touchmove", touchM)
                    })

                })();
                //第一页
                let subBack = newPage()
                let idSeter = newElement('div', '技能id:', subBack).style1();
                let idFree = newElement('textarea', '', subBack).setStyle({
                    fontSize: '1em',
                    height: '1em',
                    width: '50%',
                    position: 'relative',
                })
                back.ele.id = idFree;
                idFree.submit = function (e) {
                    //敲击回车,清空字符
                    if (e && e.keyCode == 13) {
                        idFree.value = ''
                    }
                    //设置非法id，id为一些字符;id包含一些字符
                    if ([...(',.?!:/@...";~()<>([{<*&[]\`#$%^+-={}|>}])'.split('')), "'",
                        'NaN', 'Infinity', 'undefined', 'null',
                        'Math', 'Object', 'Array', 'Date', 'String', 'Number', 'Symbol', 'RegExp',
                        'player', 'target', 'event', 'result', 'trigger', 'card', 'cards', 'targets',
                        'var', 'let', 'const', 'try', 'catch', 'throw', 'if', 'else', 'switch', 'case', 'for', 'while', 'break', 'continue', 'function', 'return', 'new', 'class', 'async'].includes(idFree.value) ||
                        bannedKeyWords.some(i => idFree.value.indexOf(i) >= 0)
                    ) {
                        try {
                            throw ('"' + idFree.value + '"不是合法id');
                        }
                        catch (err) {
                            idFree.value = '';
                            game.xjb_create.alert('警告:' + err);
                        };
                    }
                    back.skill.id = idFree.value;
                    back.organize();
                }
                idFree.addEventListener('keyup', idFree.submit);
                //
                let kindSeter = newElement('div', '技能种类:', subBack).style1();
                let kindFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.kinds = kindFree.children
                if (true) {
                    let list = ['触发类', '出牌阶段类', '使用类', '打出类', '使用打出类'];
                    let list1 = ['trigger', 'enable:"phaseUse"', 'enable:"chooseToUse"',
                        'enable:"chooseToRespond"', 'enable:["chooseToUse","chooseToRespond"]']
                    list.forEach((i, k) => {
                        //这是创建一个button,设置技能的类别;
                        let it = ui.create.xjb_button(kindFree, i)
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        })
                        it.kind = list1[k]
                        listener(it, e => {
                            back.skill.kind = it.kind;
                            Array.from(it.parentElement.children).forEach(t => {
                                t.style.backgroundColor = "#e4d5b7"
                                if (t.kind == back.skill.kind) t.style.backgroundColor = 'red'
                            })
                            back.organize()
                        })
                    })
                }
                /**
                 * @param {Array<string>} list1 
                 * @returns {Array<string>}
                 */
                function xjb_formatting(list1) {
                    if (list1.length > 5) {
                        let t = Math.floor((list1.length - 5) / 4)
                        list1.splice(5, 0, ">>>", "<<<")
                        for (let i = 0; i < t; i++) {
                            list1.splice(7 + 4 * (i + 1) + 2 * i, 0, ">>>", "<<<")
                        }
                    }
                    return list1
                }
                //
                let typeSeter = newElement('div', '技能标签:', subBack).style1()
                let typeFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.types = typeFree.children
                if (true) {
                    const mapList = {
                        'zhuSkill': '主公技',
                        'forced': "锁定技",
                        "limited": "限定技",
                        "juexingji": "觉醒技",
                        "zhuanhuanji": "转换技",
                        "hiddenSkill": "隐匿技",
                        "clanSkill": "宗族技",
                        "groupSkill": "势力技",
                        "dutySkill": "使命技",
                        "zhenfa": "阵法技",
                        "mainSkill": "主将技",
                        "viceSkill": "副将技",
                        "preHidden": "预亮",
                        "chargeSkill": "蓄力技",
                        "chargingSkill": "蓄能技",
                        "charlotte": "charlotte技",
                        "sunbenSkill": "昂扬技",
                        "persevereSkill": "持恒技",
                        "frequent": "自动发动",
                    }
                    let list = xjb_formatting(Object.values(mapList));
                    let list1 = xjb_formatting(Object.keys(mapList));
                    list.forEach((i, k) => {
                        const en = list1[k];
                        let it;
                        it = ui.create.xjb_button(typeFree, i);
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        });
                        if (k >= 6) ui.xjb_giveStyle(it, {
                            display: 'none'
                        });
                        it.type = en;
                    });
                }
                listener(typeFree, e => {
                    let list = Array.from(typeFree.children)
                    if (!list.includes(e.target)) return;
                    if (e.target.innerText.includes('>>>')) {
                        const a = list.indexOf(e.target) + 1;
                        let b = Math.min((a + 5), (list.length - 1));
                        list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none")
                        return;
                    }
                    if (e.target.innerText.includes('<<<')) {
                        const a = list.indexOf(e.target) - 1;
                        let b = Math.max(0, (a - 5));
                        list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none")
                        return;
                    }
                    if (back.skill.type.includes(e.target.type)) {
                        back.skill.type.remove(e.target.type);
                        e.target.style.backgroundColor = "#e4d5b7";
                    } else {
                        e.target.style.backgroundColor = "red";
                        back.skill.type.push(e.target.type);
                    };
                    back.organize();
                    back.ele.groupsContainer.update();
                });
                let groupSeter = newElement('div', '特殊设置:', subBack).style1()
                let groupFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.groupsContainer = groupFree;
                back.ele.groups = groupFree.children;
                groupFree.groupsPageNum = 0;
                listener(groupFree, e => {
                    let list = Array.from(groupFree.children)
                    if (!list.includes(e.target)) return;
                    if (e.target.innerText.includes('>>>')) {
                        const a = list.indexOf(e.target) + 1;
                        let b = Math.min((a + 5), (list.length - 1));
                        list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none");
                        groupFree.groupsPageNum++;
                        return;
                    }
                    if (e.target.innerText.includes('<<<')) {
                        const a = list.indexOf(e.target) - 1;
                        let b = Math.max(0, (a - 5));
                        list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none");
                        groupFree.groupsPageNum--;
                        return;
                    }
                    let attr = e.target.getAttribute('data-attr');
                    let prefix = whichPrefix(attr, ["group", "mainVice"])
                    findPrefix(back.skill.uniqueList, prefix).forEach(k => {
                        back.skill.uniqueList.remove(k);
                        let ele = groupFree.querySelector(`[data-attr="${k}"]`)
                        if (ele !== null) ele.style.backgroundColor = "#e4d5b7";
                    });
                    back.skill.uniqueList.push(attr);
                    e.target.style.backgroundColor = "red";
                    back.organize();
                });
                groupFree.update = function () {
                    const pageNum = groupFree.groupsPageNum;
                    groupFree.groupsPageNum = 0;
                    function groupFreeChange() {
                        //先移除所有元素
                        element().setTarget(groupFree)
                            .removeAllChildren();
                        let mapList = {};
                        if (back.skill.type.includes("groupSkill")) {
                            [...lib.group, "key", "western"].forEach(group => {
                                mapList["group-" + group] = lib.translate[group] + "势力"
                            })
                        }
                        if (back.skill.type.includes("mainSkill") || back.skill.type.includes("viceSkill")) {
                            mapList = Object.assign(mapList, {
                                "mainVice-remove1": "鱼减半个"
                            })
                        }
                        let list = xjb_formatting(Object.values(mapList));
                        let list1 = xjb_formatting(Object.keys(mapList));
                        list.forEach((i, k) => {
                            const en = list1[k];
                            /**
                             * @type {HTMLElement}
                             */
                            let it = ui.create.xjb_button(groupFree, i);
                            element().setTarget(it)
                                .setStyle('fontSize', '1em')
                                .hook(ele => {
                                    if (k >= 6) element().setTarget(ele).setStyle("display", "none");
                                }).
                                setAttribute('data-attr', en);
                            if (back.skill.uniqueList.includes(en)) it.style.backgroundColor = "red";

                        });
                        return list.length;
                    }
                    if (groupFreeChange()) {
                        element().setTarget(groupSeter)
                            .setStyle("display", "inline-block")
                            .setTarget(groupFree)
                            .setStyle("display", "inline-block")
                    } else {
                        element().setTarget(groupSeter)
                            .setStyle("display", "none")
                            .setTarget(groupFree)
                            .setStyle("display", "none")
                    };
                    while (groupFree.groupsPageNum !== pageNum) {
                        /**
                         * @type {HTMLElement}
                         */
                        let target = Array.from(groupFree.children).filter(k => k.style.display != "none").at(-1);
                        if (target && target.innerText.includes('>>>')) {
                            target.click();
                            target.dispatchEvent(touchE);
                        } else break;
                    }
                }
                groupFree.update();
                //编辑模式选择
                let modeSeter = newElement('div', '编写位置:', subBack).style1()
                let modeFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.mode = modeFree.children;
                if (true) {
                    let list = ['本体自带编写器', 'mt管理器', '主代码'];
                    let list1 = ['self', 'mt', 'mainCode']
                    list.forEach((i, k) => {
                        let it = ui.create.xjb_button(modeFree, i)
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        })
                        it.mode = list1[k]
                        listener(it, e => {
                            back.skill.mode = it.mode
                            Array.from(it.parentElement.children).forEach(t => {
                                t.style.backgroundColor = "#e4d5b7"
                                if (t.mode == back.skill.mode) t.style.backgroundColor = 'red'
                            })
                            back.organize()
                        })
                    })
                }
                //第二页
                let subBack2 = newPage()
                let filterSeter = newElement('div', '<b><font color="red">发动条件</font></b>:', subBack2).style1()
                let filterFree = newElement('textarea', '', subBack2)
                filterFree.setStyle({
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                back.ele.filter = filterFree;
                filterFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                filterFree.ensure = function () {
                    this.changeWord(/\s\n/g, '\n')
                    this.changeWord(/\s\s/g, ' ')
                    this.changeWord(/如果\s?/g, '如果\n')
                    this.changeWord(/\s?那么\s?/g, '\n那么\n')
                };
                filterFree.arrange = function () {
                    const that = this;
                    function update(str) {
                        let wonder = filterFree.value.split('\n')
                        wonder = wonder.map(t => {
                            let wonder1 = t.split(str).join('')
                            return wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : '')
                        })
                        filterFree.value = wonder.join('\n')
                    }
                    /**
                    * @param {string} appendWord 
                    * @param {string[]} every 
                    */
                    function appendWordToEvery(appendWord, every) {
                        every.forEach(i => {
                            that.changeWord(new RegExp(i, 'g'), i + appendWord);
                        });
                    }
                    //
                    that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                        return p[0];
                    })
                    //处理变量词
                    appendWordToEvery(' ', ["令为", "变量"])
                    /*统一写法*/
                    for (let i = 999; i > 0; i--) {
                        that.changeWord("加" + get.cnNumber(i), "+" + i)
                        that.changeWord("减" + get.cnNumber(i), "-" + i)
                        that.changeWord("乘" + get.cnNumber(i), "*" + i)
                        that.changeWord("乘以" + get.cnNumber(i), "*" + i)
                        that.changeWord("加" + (i), "+" + i)
                        that.changeWord("减" + (i), "-" + i)
                        that.changeWord("乘" + (i), "*" + i)
                        that.changeWord("乘以" + (i), "*" + i)
                        that.changeWord("*" + get.cnNumber(i), "*" + i)
                        that.changeWord("+" + get.cnNumber(i), "+" + i)
                        that.changeWord("-" + get.cnNumber(i), "-" + i)
                    }
                    that.changeWord(/(♣️)/g, '梅花');
                    that.changeWord(/(♠️)/g, '黑桃');
                    that.changeWord(/(♥️)/g, '红桃');
                    that.changeWord(/(♦️)/g, '方片');
                    that.changeWord(/(♣)/g, '梅花');
                    that.changeWord(/(♠)/g, '黑桃');
                    that.changeWord(/(♥)/g, '红桃');
                    that.changeWord(/(♦)/g, '方片');
                    that.changeWord(/该回合/g, "本回合")
                    //处理角色相关字符
                    playerCN.forEach(i => {
                        that.changeWord(new RegExp(i + '(的|于|在)回合外', 'g'), i + '不为当前回合角色')
                        that.changeWord(new RegExp(i + '的', 'g'), i)
                    });
                    appendWordToEvery(' ', ["你", "玩家", "当前回合角色"]);
                    that.changeWord(/体力(?!上限|值)/g, '体力值');
                    appendWordToEvery(' ', ["体力值", "体力上限", "手牌数"]);
                    //处理game相关字符
                    that.changeWord(/游戏轮数/g, '游戏 轮数')
                    //处理一些特殊属性
                    appendWordToEvery(' ', ["火属性", "冰属性", "雷属性"]);
                    appendWordToEvery(' ', ['红色', '黑色', '梅花', '方片', '无花色', '黑桃', '红桃']);
                    //处理逻辑字符
                    new Array("不大于", "不小于", "不是", "不为", "不等于").forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), ' ' + i + ' ')
                    });
                    ["大于", "小于", "是", "等于"].forEach(i => {
                        that.changeWord(new RegExp(`(?<!不)${i}`, "g"), ` ${i} `)
                    })
                    that.changeWord(/(?<!名|令)为/g, '为 ')
                    that.changeWord(/并且\s?/g, '并且\n')
                    that.changeWord(/或者\s?/g, '或者\n')
                    //处理空白字符
                    that.changeWord(/\s\s/g, ' ')
                    that.changeWord(/\s+$/, '')
                }
                back.ele.filter.submit = function (e) {
                    const _this = this
                    _this.value.indexOf("新如果") >= 0 && _this.changeWord('新如果', '如果那么分支开始\n分支结束') && _this.ensure();
                    _this.value.indexOf("新否则") >= 0 && _this.changeWord('新否则', '否则\n分支开始\n分支结束') && _this.ensure();
                    //同上同下指令
                    let wonderfulCSTS = (filterFree.value.indexOf("同上") > 0 && filterFree.value.match(/.+\n同上/) && filterFree.value.match(/.+\n同上/)[0]) || ''
                    wonderfulCSTS = wonderfulCSTS.replace(/\n同上/, '')
                    filterFree.value = filterFree.value.replace("同上", wonderfulCSTS)
                    let updatedValue = (filterFree.value.indexOf("同下") >= 0 && filterFree.value.match(/同下\n.+/) && filterFree.value.match(/同下\n.+/)[0]) || '';
                    updatedValue = updatedValue.replace(/同下\n/, '');
                    filterFree.value = filterFree.value.replace(/同下/, updatedValue);
                    //整理指令
                    filterFree.value.indexOf("整理") >= 0 && filterFree.changeWord('整理', '') && filterFree.arrange()
                    //继承指令
                    let wonderfulInherit = (filterFree.value.indexOf("继承") >= 0 && filterFree.value.match(/继承.+\n/) && filterFree.value.match(/继承.+\n/)[0]) || '';
                    if (wonderfulInherit && wonderfulInherit != '继承') {
                        let preSkill = ''
                        //获取继承的技能的id                   
                        wonderfulInherit = wonderfulInherit.replace(/继承/, '');
                        wonderfulInherit = wonderfulInherit.replace(/\n/, '');
                        //获取继承的技能的filter并处理                    
                        if (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content) preSkill = wonderfulInherit;
                        wonderfulInherit = (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].filter && lib.skill[wonderfulInherit].filter.toString()) || ''
                        /*清除空格*/
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        /*截取函数*/
                        wonderfulInherit = wonderfulInherit.slice((wonderfulInherit.indexOf('{') + 2), -1)
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        wonderfulInherit = wonderfulInherit.replace(new RegExp(preSkill, 'g'), back.skill.id)
                        back.returnIgnore = true
                        filterFree.changeWord(/继承.+\n/, wonderfulInherit);
                    }
                    back.skill.filter = []
                    if (!filterFree.value || filterFree.value.length === 0) return back.skill.filter.push('true') && back.organize()
                    let list = dispose(filterFree.value)
                    list = list.map(t => {
                        return t.replace(/trigger/g, 'event')
                    })
                    back.skill.filter.push(...list)
                    back.organize()
                }
                listenAttributeChange(filterFree, 'selectionStart').start();
                filterFree.addEventListener('selectionStartChange', function (e) {
                    let arr = [...indexRange(this.value, '如果'), ...indexRange(this.value, '那么'), ...indexRange(this.value, '分支开始'), ...indexRange(this.value, "那么\n分支开始"), ...indexRange(this.value, '分支结束'), ...indexRange(this.value, '否则'), ...indexRange(this.value, '否则\n分支开始')]
                    const i = this.selectionStart;
                    arr.forEach(range => {
                        if (selectionIsInRange(i, range)) this.selectionStart = range[1] + 1;
                    })
                })
                filterFree.addEventListener('keydown', deleteModule)
                filterFree.addEventListener('keyup', back.ele.filter.submit)
                let filterIntro = newElement('div', '举例说明', subBack2).style1();
                let filterExample = newElement('div', '例如:有一个技能的发动条件是:你的体力值大于3<br>' +
                    '就在框框中写:' +
                    '你体力值大于三<br>' +
                    '每写完一个效果，就提行写下一个效果，<br>' +
                    "最后输入整理即可"
                    , subBack2).style1()
                //第三页
                let subBack3 = newPage();
                let contentSeter = newElement('div', '<b><font color=red>技能效果', subBack3).style1()
                let contentFree = newElement('textarea', '', subBack3).setStyle({
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                });
                back.ele.content = contentFree;
                contentFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, typeof replacer === 'function' ? replacer : '' + replacer)
                    return true
                };
                contentFree.ensure = function () {
                    this.changeWord(/\s\n/g, '\n')
                    this.changeWord(/\s\s/g, ' ')
                    this.changeWord(/如果\s?/g, '如果\n')
                    this.changeWord(/\s?那么\s?/g, '\n那么\n')
                };
                contentFree.arrange = function () {
                    if (back.stepIgnore) return false;
                    const that = this
                    /**
                     * This function is used to adjust a word to the end of its line
                     * @param {String} str the word to adjust
                     * @param {Function} hook 
                     */
                    function update(str, hook) {
                        let wonder = that.value.split('\n')
                        wonder = wonder.map(t => {
                            let wonder1 = t.split(str).join('');
                            let disposedString = (wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : ''))
                            if (typeof hook === 'function') {
                                disposedString = hook(str, disposedString, t)
                            }
                            return disposedString;
                        })
                        that.value = wonder.join('\n')
                    }
                    /**
                     * 该函数用于集中处理一类参数
                     * @param  {...any} wonderA 
                     */
                    function parameter(...wonderA) {
                        let parameterWord = wonderA, hook;
                        if (typeof wonderA[wonderA.length - 1] === 'function') {
                            hook = parameterWord.splice(-1, 1)[0];
                        }
                        for (let i = 0; i < wonderA.length; i++) {
                            update(wonderA[i], hook)
                        };
                    }
                    function newLine() {
                        that.changeWord(/，/g, '\n')
                        that.changeWord(/。/g, '\n')
                        that.changeWord(/然后/g, '\n');
                        that.changeWord(/\s\n/g, '\n');
                    }
                    newLine()
                    //
                    that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                        return p[0];
                    })
                    //处理变量词
                    that.changeWord(/变量/g, "变量 ")
                    that.changeWord(/令为/g, " 令为 ")
                    //统一写法
                    for (let i = 999; i > 0; i--) {
                        that.changeWord("加" + get.cnNumber(i), "+" + i)
                        that.changeWord("减" + get.cnNumber(i), "-" + i)
                        that.changeWord("乘" + get.cnNumber(i), "*" + i)
                        that.changeWord("乘以" + get.cnNumber(i), "*" + i)
                        that.changeWord("加" + (i), "+" + i)
                        that.changeWord("减" + (i), "-" + i)
                        that.changeWord("乘" + (i), "*" + i)
                        that.changeWord("乘以" + (i), "*" + i)
                        that.changeWord("*" + get.cnNumber(i), "*" + i)
                        that.changeWord("+" + get.cnNumber(i), "+" + i)
                        that.changeWord("-" + get.cnNumber(i), "-" + i)
                    }
                    that.changeWord(/(♣️)/g, '梅花');
                    that.changeWord(/(♠️)/g, '黑桃');
                    that.changeWord(/(♥️)/g, '红桃');
                    that.changeWord(/(♦️)/g, '方片');
                    that.changeWord(/(♣)/g, '梅花');
                    that.changeWord(/(♠)/g, '黑桃');
                    that.changeWord(/(♥)/g, '红桃');
                    that.changeWord(/(♦)/g, '方片');
                    that.changeWord(/≯/g, '不大于')
                    that.changeWord(/≮/g, '不小于')
                    //处理逻辑词
                    that.changeWord(/若你/g, "如果 你")
                    that.changeWord(/若游戏/g, "如果 游戏")
                    that.changeWord(/(?<!名|令)为/g, '为 ');
                    new Array("不大于", "不小于", "不是", "不为", "不等于").forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), ' ' + i + ' ')
                    });
                    ["大于", "小于", "是", "等于"].forEach(i => {
                        that.changeWord(new RegExp(`(?<!不)${i}`), ` ${i} `)
                    });
                    //处理player相关字符
                    playerCN.forEach(i => {
                        that.changeWord(new RegExp(`对${i}造成伤害的牌`, 'g'), "造成伤害的牌");
                        that.changeWord(new RegExp(i + '的', 'g'), i);
                        that.changeWord(new RegExp(i, 'g'), `${i} `);
                    });
                    that.changeWord(/体力(?!上限|值)/g, '体力值');
                    ["体力值", "体力上限", "手牌数"].forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), i + ' ');
                    });
                    //处理game相关字符
                    that.changeWord('游戏轮数', '游戏 轮数')
                    //处理事件描述
                    that.changeWord(/再摸/g, "摸");
                    that.changeWord(/各摸/g, "摸");
                    that.changeWord(/该回合/g, "本回合");
                    that.changeWord(/可以获得(?=.*牌)/g, " 获得牌 ")
                    //限定词处理
                    that.changeWord(/(至多)+/g, "至多");
                    that.changeWord(/(至少)+/g, "至少");
                    that.changeWord(/(其他|其它)+/g, "其他");
                    that.changeWord(/(可以)+/g, "可以");
                    //数字有关处理
                    that.changeWord(/二(名|点)/g, function (match, p1) {
                        //将匹配的部分换为两名/两点
                        return '两' + p1
                    });
                    for (let i = 1; i <= 20; i++) {
                        that.changeWord(new RegExp("任意" + i + '张', 'g'), i + '张');
                        that.changeWord(new RegExp("任意" + get.cnNumber(i) + '张', 'g'), get.cnNumber(i) + '张');
                        that.changeWord(new RegExp("任意" + i + '名', 'g'), get.cnNumber(i) + '名');
                        that.changeWord(new RegExp("任意" + get.cnNumber(i) + '名', 'g'), get.cnNumber(i) + '名');
                        that.changeWord(new RegExp(`可 ? 以 ? 令(至多 | 至少) * ${i}名(其他) * 角色`, 'g'), function (match, p1, p2) {
                            return `选择${p1 ? p1 : ''}${i}名${p2 ? p2 : ''}角色然后所选角色`
                        });
                        that.changeWord(new RegExp(`可 ? 以 ? 令(至多 | 至少) * ${get.cnNumber(i)}名(其他) * 角色`, 'g'), function (match, p1, p2) {
                            return `选择${p1 ? p1 : ''}${get.cnNumber(i)}名${p2 ? p2 : ''}角色然后所选角色`
                        });
                    }
                    that.changeWord(new RegExp(`令任意名(其他) * 角色`, 'g'), function (match, p1) {
                        return `选择名${p1 ? p1 : ''}角色然后所选角色`
                    });
                    newLine()
                    //数字参数处理
                    for (let i = 1; i <= 20; i++) {
                        update(i + '张');
                        update(get.cnNumber(i) + '张');
                        update(i + '点');
                        update(get.cnNumber(i) + '点');
                        update(i + '名');
                        update(get.cnNumber(i) + '名');
                    }
                    "abcdefghjlmnopqrstuvwxyz".split('').forEach(i => {
                        update(i + '张');
                        update(i + '点');
                        update(i + '名');
                        update(i.toUpperCase() + '张');
                        update(i.toUpperCase() + '点');
                        update(i.toUpperCase() + '名');
                    });
                    //参数处理
                    parameter("火属性", "冰属性", "雷属性",
                        "任意张", "任意名",
                        "并且", "或者",
                        "从牌堆底");
                    parameter("其他", "至多", "至少")
                    parameter('梅花', '方片', '无花色', '黑桃', '红桃', '红色', '黑色', '无色', function (disposing, disposed, previous) {
                        if (previous.includes(`牌堆中${disposing}牌`)) return previous;
                        return disposed;
                    });
                    that.ensure()
                    let ty = contentFree.value.split('\n').map(i => {
                        let nice1 = [], nice2 = [], ie
                        let arrNice = new Array(...playerCN)
                        //如果为变量则忽略
                        if (i.includes('变量')) return i;
                        //遍历每一行,如果角色对象在第一个位置出现,则去掉,并将其加入到第一个个数组
                        arrNice.forEach(ae => {
                            if (i.indexOf(ae) === 0) {
                                nice1.push(ae)
                                i = i.replace(ae, '')
                            }
                        })
                        //没有则不动
                        if (!nice1.length) return i
                        arrNice.forEach(ae => {
                            ie = i.split(ae)
                            while (i.indexOf(ae) >= 0) {
                                i = i.replace(ae, '')
                            }
                            if (ie.length > 1) {
                                let nice3 = []
                                nice3.length = ie.length - 1
                                nice3.fill(ae)
                                nice2.push(...nice3)
                            }
                        })
                        return nice1.join('') + ' ' + i + ' ' + nice2.join(' ')
                    })
                    that.value = ty.join('\n');
                    that.ensure()
                    that.changeWord(/\s+$/, '')
                }
                contentFree.zeroise = function () {
                    this.value = ""
                }
                back.ele.content.submit = function (bool = false) {
                    contentFree.value.indexOf("新如果") >= 0 && contentFree.changeWord('新如果', '如果那么分支开始\n分支结束') && contentFree.ensure()
                    //新否则语句指令
                    this.value.indexOf("新否则") >= 0 && this.changeWord('新否则', '否则\n分支开始\n分支结束') && this.ensure()
                    //
                    if (this.value.includes('back.adjust=true')) {
                        contentFree.changeWord(/(?<![/][*])back.adjust\=true(?![*][/])/, "/*back.adjust=true*/")
                        back.adjust = true
                    }
                    if (this.value.includes('back.adjust=false')) {
                        contentFree.changeWord(/([/][*])*back.adjust\=false([*][/])*/, "")
                        back.adjust = false
                    }
                    //同上同下指令
                    let wonderfulCSTS = (contentFree.value.indexOf("同上") > 0 && contentFree.value.match(/.+\n同上/) && contentFree.value.match(/.+\n同上/)[0]) || ''
                    wonderfulCSTS = wonderfulCSTS.replace(/\n同上/, '')
                    contentFree.changeWord("同上", wonderfulCSTS)
                    let updatedValue = (contentFree.value.indexOf("同下") >= 0 && contentFree.value.match(/同下\n.+/) && contentFree.value.match(/同下\n.+/)[0]) || '';
                    updatedValue = updatedValue.replace(/同下\n/, '');
                    contentFree.changeWord(/同下/, updatedValue);
                    //清空指令
                    contentFree.value.indexOf("清空") >= 0 && contentFree.zeroise()
                    //整理指令
                    contentFree.value.indexOf("整理") >= 0 && contentFree.changeWord('整理', '') && contentFree.arrange()
                    //继承指令
                    let wonderfulInherit = (contentFree.value.indexOf("继承") >= 0 && contentFree.value.match(/继承.+\n/) && contentFree.value.match(/继承.+\n/)[0]) || '';
                    if (wonderfulInherit && wonderfulInherit != '继承') {
                        let preSkill = ''
                        //获取继承的技能的id                   
                        wonderfulInherit = wonderfulInherit.replace(/继承/, '');
                        wonderfulInherit = wonderfulInherit.replace(/\n/, '');
                        //获取继承的技能的content并处理                    
                        if (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content) preSkill = wonderfulInherit;
                        wonderfulInherit = (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content && lib.skill[wonderfulInherit].content.toString()) || ''
                        if (wonderfulInherit.includes('async content')) back.skill.contentAsync = true
                        /*清除空格*/
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        /*截取函数*/
                        wonderfulInherit = wonderfulInherit.slice((wonderfulInherit.indexOf('{') + 2), -1)
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        wonderfulInherit = wonderfulInherit.replace(new RegExp(preSkill, 'g'), back.skill.id)
                        contentFree.changeWord(/继承.+\n/, wonderfulInherit);
                        back.stepIgnore = true
                        back.ContentInherit = true
                    }
                    //清空content数组
                    back.skill.content = []
                    //数组为空则返回
                    if (contentFree.value.length === 0) {
                        if (bool!==true) back.organize()
                        return;
                    }
                    //后续处理，如果涉及到继承，则为数字1就返回
                    const list = dispose(contentFree.value, back.ContentInherit ? 1 : void 0)
                    function disposeList() {
                        let disposedList = list.map(x => {
                            //没有角色角色类型返回原值
                            if (!back.NowDidposePlayerType) return x
                            //不含逻辑字符返回原值
                            if (!x.split("").some(y => lib.xjb_class.logicConj.includes(y))) return x;
                            /*判断承前省略
                            如果匹配".",前面为空字符/>/<,且后面字符非空
                            */
                            let y = x.replace(/(?<=\s|\>|\<)\.(?=[^\s]+)/g, function (match) {
                                return back.NowDidposePlayerType + "."
                            })
                            return y;
                        })
                        return disposedList
                    }
                    back.skill.content.push(...disposeList());
                    if (bool!==true) back.organize()
                }
                listenAttributeChange(contentFree, 'selectionStart').start();
                contentFree.addEventListener('selectionStartChange', function (e) {
                    let arr = [...indexRange(this.value, '如果'), ...indexRange(this.value, '那么'), ...indexRange(this.value, '分支开始'), ...indexRange(this.value, "那么\n分支开始"), ...indexRange(this.value, '分支结束'), ...indexRange(this.value, '否则'), ...indexRange(this.value, '否则\n分支开始')]
                    const i = this.selectionStart;
                    arr.forEach(range => {
                        if (selectionIsInRange(i, range)) this.selectionStart = range[1] + 1;
                    })
                })
                contentFree.addEventListener('keydown', deleteModule)
                contentFree.addEventListener('keyup', back.ele.content.submit)
                let contentIntro = newElement('div', '举例说明', subBack3).style1();
                let contentExample = newElement('div', `例如:技能的一个效果是:你摸三张牌</br>
                    就在框框中写:你摸三张牌。</br>
                    每写完一个效果，就提行写下一个效果。</br>
                    最后输入整理即可。`
                    , subBack3).style1()
                //第五页
                let subBack5 = newPage()
                let triggerAdd = (who, en) => {
                    back.trigger.push(who);
                    who.style.display = 'none';
                }
                let triggerSeter = newElement('div', '<b><font color=red>触发时机</font></b>', subBack5).style1()
                let triggerFree = newElement('textarea', '', subBack5).setStyle({
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                back.ele.trigger = triggerFree;
                triggerFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                triggerFree.arrange = function () {
                    let that = triggerFree;
                    /**
                     * 
                     * @param {string} appendWord 
                     * @param {string[]} every 
                     */
                    function appendWordToEvery(appendWord, every) {
                        every.forEach(i => {
                            that.changeWord(new RegExp(i, 'g'), i + appendWord);
                        });
                    }
                    //
                    that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                        return p[0];
                    })
                    //逻辑处理
                    that.changeWord(/(?<!使用)或(?!打出)/g, ' ')
                    //省略
                    that.changeWord(/的判定牌生效/g, '判定牌生效');
                    that.changeWord(/一张/g, '');
                    //统一写法
                    that.changeWord(/使一名角色/g, '令一名角色');
                    that.changeWord(/红牌/g, '红色牌');
                    that.changeWord(/黑牌/g, '黑色牌');
                    that.changeWord(/(♣️)/g, '梅花');
                    that.changeWord(/(♠️)/g, '黑桃');
                    that.changeWord(/(♥️)/g, '红桃');
                    that.changeWord(/(♦️)/g, '方片');
                    that.changeWord(/(♣)/g, '梅花');
                    that.changeWord(/(♠)/g, '黑桃');
                    that.changeWord(/(♥)/g, '红桃');
                    that.changeWord(/(♦)/g, '方片');
                    //关于角色
                    appendWordToEvery(' ', ['你', '每名角色']);
                    that.changeWord(/(?<!令)一名角色/g, '一名角色 ');
                    //
                    that.changeWord(/([\u4e00-\u9fa5]*?)使用或打出([\u4e00-\u9fa5]+)/g, function (match, ...p) {
                        return `${p[0]}使用${p[1]} ${p[0]}打出${p[1]}`;
                    })
                    //空白调整
                    that.changeWord(/\s\s/g, ' ');
                }
                back.ele.trigger.submit = function (e) {
                    back.skill.uniqueTrigger = [];
                    back.skill.trigger.source = [];
                    back.skill.trigger.player = [];
                    back.skill.trigger.global = [];
                    back.skill.trigger.target = [];
                    back.skill.filter_card = [];
                    back.skill.filter_color = [];
                    back.skill.filter_suit = [];
                    back.skill.respond = [];
                    this.value.includes("整理") && this.changeWord('整理', '') && this.arrange();
                    this.value.includes('于回合外失去') && back.skill.uniqueTrigger.push("outPhase:lose")
                    this.value.includes('于回合内失去') && back.skill.uniqueTrigger.push("inPhase:lose")
                    if (triggerFree.value.length === 0) return;
                    function disposeTriggerValue() {
                        let myTarget = triggerFree.value;
                        myTarget = myTarget.replace(/于回合[外内]/g, '')
                        return myTarget;
                    }
                    let list = dispose(disposeTriggerValue(), 3)
                    let tri_player = [], tri_global = [], tri_target = [], tri_source = [], tri_players = []
                    list.forEach(i => {
                        if (i.includes('player')) {
                            let a = i
                            a.remove('player')
                            tri_players.push(...a)
                        } else if (i.includes('global')) {
                            let a = i
                            a.remove('global')
                            tri_global.push(...a)
                        } else {
                            let a = i
                            tri_players.push(...a)
                        }
                    })
                    tri_players.forEach(i => {
                        let a = i, cardsNames = Object.keys(lib.card), suits = lib.suits, colors = Object.keys(lib.color)
                        if (i === 'damageSource') tri_source.push(a)
                        else if (i.indexOf("source:") === 0) {
                            a = a.slice(7)
                            tri_source.push(a)
                        }
                        else if (i.indexOf("target:") === 0) {
                            a = a.slice(7)
                            let strToArray = function (pending, str) {
                                if (pending.indexOf(str) <= 0) return false;
                                tri_target.includes(str) || tri_target.push(str);
                                pending = pending.replace(str, '');
                                pending = pending.replace(':', '');
                                if (cardsNames.includes(pending)) back.skill.filter_card.push(str + ':"' + pending + '"')
                                if (suits.includes(pending)) back.skill.filter_suit.push(str + ':"' + pending + '"')
                                if (colors.includes(pending)) back.skill.filter_color.push(str + ':"' + pending + '"')
                                return true
                            }
                            if (strToArray(a, 'useCardToTargeted')) { }
                            else if (strToArray(a, 'useCardToTarget')) { }
                            else tri_target.push(a)
                        }
                        else if (i.indexOf("loseAfter") === 0) {
                            back.skill.uniqueTrigger.push('player:' + i);
                            tri_player.push("loseAfter", "loseAsyncAfter");
                            if (i !== 'loseAfter:discard') tri_global.push("equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter");
                        }
                        else if (i.indexOf("player:") === 0) {
                            a = a.slice(7)
                            let strToArray = function (pending, str) {
                                if (pending.indexOf(str) <= 0) return false;
                                tri_player.includes(str) || tri_player.push(str);
                                pending = pending.replace(str, '');
                                pending = pending.replace(':', '');
                                if (cardsNames.includes(pending)) back.skill.filter_card.push(str + ':"' + pending + '"')
                                if (suits.includes(pending)) back.skill.filter_suit.push(str + ':"' + pending + '"')
                                if (colors.includes(pending)) back.skill.filter_color.push(str + ':"' + pending + '"')
                                return true
                            }
                            if (strToArray(a, 'useCardToPlayered')) { }
                            else if (strToArray(a, 'useCardToPlayer')) { }
                            else tri_player.push(a)
                        }
                        else if (i.includes(':useCard')) {
                            const list = i.split(":"), str = "useCardAfter";
                            a = list[0];
                            if (cardsNames.includes(a)) back.skill.filter_card.push(str + ':"' + a + '"')
                            if (suits.includes(a)) back.skill.filter_suit.push(str + ':"' + a + '"')
                            if (colors.includes(a)) back.skill.filter_color.push(str + ':"' + a + '"')
                            tri_player.push(list[1]);
                        }
                        else if (i.startsWith('chooseToUseBefore:') || i.startsWith('chooseToUseBegin:')) {
                            const list = i.split(":")
                            const str = list[0]
                            tri_player.push(str);
                        }
                        else if (i.startsWith('chooseToRespondBefore:') || i.startsWith('chooseToRespondBegin:')) {
                            const list = i.split(":");
                            back.skill.respond.push(list[1]);
                            tri_player.push(list[0]);
                        }
                        else tri_player.push(a)
                    })
                    tri_global = tri_global.map(i => {
                        let a = i, cardsNames = Object.keys(lib.card), suits = lib.suits, colors = Object.keys(lib.color)
                        if (i.includes(':useCardAfter')) {
                            const str = "useCardAfter"
                            a = a.replace(':useCardAfter', '')
                            if (cardsNames.includes(a)) back.skill.filter_card.push(str + ':"' + a + '"')
                            if (suits.includes(a)) back.skill.filter_suit.push(str + ':"' + a + '"')
                            if (colors.includes(a)) back.skill.filter_color.push(str + ':"' + a + '"')
                            return str;
                        }
                        return i;
                    })
                    back.skill.trigger.player.push(...tri_player)
                    back.skill.trigger.source.push(...tri_source)
                    back.skill.trigger.target.push(...tri_target)
                    back.skill.trigger.global.push(...tri_global)
                    back.organize()
                }
                triggerFree.addEventListener('keyup', back.ele.trigger.submit)
                let triggerIntro = newElement('div', '举例说明', subBack5).style1()
                let triggerExample = newElement('div', '例如有一个技能的发动时机是:你受到伤害后<br>' +
                    '在框框中就写:' +
                    '你受到伤害后<br>' +
                    '每写完一个时机就提行写下一个时机<br>' +
                    '最后输入整理即可',
                    subBack5).style1()
                triggerAdd(triggerExample)
                triggerAdd(triggerFree)
                triggerAdd(triggerIntro)
                triggerAdd(triggerSeter)
                //
                let enableAdds = (who) => {
                    back.phaseUse.push(who)
                    who.style.display = 'none'
                }
                let enableAdd = (word, en) => {
                    let rat = newElement('div', '', subBack5).setStyle({
                        height: '1em',
                        float: 'left',
                        position: 'relative'
                    })
                    let it = ui.create.xjb_button(rat, word)
                    ui.xjb_giveStyle(it, {
                        fontSize: '1em'
                    })
                    it.type = en
                    listener(it, e => {
                        if (back.skill.type.includes(it.type)) {
                            back.skill.type.remove(it.type)
                            it.style.backgroundColor = "#e4d5b7";
                        } else {
                            it.style.backgroundColor = "red";
                            back.skill.type.push(it.type)
                        }
                        back.organize()
                    })
                    let mouse = newElement('div', '', subBack5).style1()
                    enableAdds(rat);
                    enableAdds(mouse);
                }
                enableAdd('选择角色', 'filterTarget')
                let filterTargetFree = newElement('textarea', '', subBack5).setStyle({
                    marginTop: '-20px',
                    marginLeft: '10px',
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                });
                filterTargetFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                filterTargetFree.arrange = function () {
                    this.changeWord(/所选角色/g, '目标')
                    new Array('你', '目标').forEach(i => {
                        this.changeWord(new RegExp(i, 'g'), i + ' ')
                    })
                    this.changeWord(/\s\s/g, ' ')
                }
                filterTargetFree.submit = function (e) {
                    if (!back.skill.type.includes('filterTarget')) filterTargetFree.value = ''
                    this.value.indexOf("整理") > 0 && this.changeWord('整理', '') && this.arrange()
                    back.skill.filterTarget = []
                    let list = dispose(filterTargetFree.value)
                    back.skill.filterTarget.push(...list)
                    back.organize()
                }
                filterTargetFree.addEventListener('keyup', filterTargetFree.submit)
                enableAdds(filterTargetFree)
                enableAdd('选择卡片', 'filterCard')
                //
                let chooseSeter = newElement('div', '视为的牌', subBack5).style1()
                const cardNameFree = element()
                    .clone(buttonContainer)
                    .father(subBack5)
                    .exit();
                cardNameFree.colorList = ["red", "orange", "yellow", "green", "pink", "#add8e6"]
                let costSeter = newElement('div', '视为的花费', subBack5).style1()
                const costFree1 = element()
                    .clone(buttonContainer)
                    .father(subBack5)
                    .setStyle("marginBottom", "0.5em")
                    .exit();
                const costFree2 = element()
                    .clone(costFree1)
                    .father(subBack5)
                    .exit();
                const costFree3 = element()
                    .clone(costFree1)
                    .father(subBack5)
                    .exit();
                if (true) {
                    const colorList = cardNameFree.colorList;
                    /**
                     * @param {HTMLElement} domEle 
                     * @param {object} mapList 
                     * @param {Array<string>} backAttr 
                     * @param {string} domEleAttr 
                     */
                    function setDom(domEle, mapList, backAttr, domEleAttr) {
                        let list = xjb_formatting(Object.values(mapList));
                        let list1 = xjb_formatting(Object.keys(mapList));
                        list.forEach((i, k) => {
                            const en = list1[k];
                            let it;
                            it = ui.create.xjb_button(domEle, i);
                            ui.xjb_giveStyle(it, {
                                fontSize: '1em'
                            });
                            if (k >= 6) ui.xjb_giveStyle(it, {
                                display: 'none'
                            });
                            element().setTarget(it)
                                .setStyle("fontSize", "1em")
                                .hook(ele => { ele[domEleAttr] = en })
                        });
                        listener(domEle, e => {
                            let list = Array.from(domEle.children)
                            if (!list.includes(e.target)) return;
                            if (e.target.innerText.includes('>>>')) {
                                const a = list.indexOf(e.target) + 1;
                                let b = Math.min((a + 5), (list.length - 1));
                                list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "inline-block")
                                list.forEach(ele => ele.style.display = "none")
                                return;
                            }
                            if (e.target.innerText.includes('<<<')) {
                                const a = list.indexOf(e.target) - 1;
                                let b = Math.max(0, (a - 5));
                                list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "inline-block")
                                list.forEach(ele => ele.style.display = "none")
                                return;
                            }
                            if (backAttr.includes(e.target[domEleAttr])) backAttr.remove(e.target[domEleAttr]);
                            else if (backAttr.length < colorList.length) backAttr.push(e.target[domEleAttr]);
                            Array.from(domEle.children).filter(ele => {
                                ele.style.backgroundColor = "#e4d5b7";
                                return true;
                            }).forEach(ele => {
                                const k = backAttr.indexOf(ele[domEleAttr]);
                                if (k !== -1) ele.style.backgroundColor = colorList[k];
                            });
                            back.organize();
                        });
                    }
                    if (cardNameFree) {
                        const mapList = {
                        };
                        lib.inpile_nature.forEach(k => {
                            mapList["nature-" + k + ":sha"] = lib.translate[k] + '杀'
                        });
                        [...lib.cardPack.standard, ...lib.cardPack.extra,
                        ...lib.cardPack.guozhan].forEach(k => {
                            if (lib.translate[k] && get.type(k) != "equip") mapList[k] = lib.translate[k]
                        })
                        setDom(cardNameFree, mapList, back.skill.viewAs, "cardName")
                    };
                    if (costFree1) {
                        const mapList = {
                        };
                        lib.inpile_nature.forEach(k => {
                            mapList["cardName-nature-" + k + ":sha"] = lib.translate[k] + '杀'
                        });
                        [...lib.cardPack.standard, ...lib.cardPack.extra,
                        ...lib.cardPack.guozhan].forEach(k => {
                            if (lib.translate[k]) mapList["cardName-" + k] = lib.translate[k]
                        })
                        setDom(costFree1, mapList, back.skill.viewAsCondition, "condition")
                    };
                    if (costFree2) {
                        const mapList = {
                            'color-pos-hes:black': "黑色牌",
                            'color-pos-hs:black': "黑色手牌",
                            'color-pos-hes:red': "红色牌",
                            'color-pos-hs:red': "红色手牌",
                            'suit-pos-hes:heart': "♥牌",
                            'suit-pos-hs:heart': "♥手牌",
                            'suit-pos-hes:diamond': "♦牌",
                            'suit-pos-hs:diamond': "♦手牌",
                            'suit-pos-hes:club': "♣牌",
                            'suit-pos-hs:club': "♣手牌",
                            'suit-pos-hes:spade': "♠牌",
                            'suit-pos-hs:spade': "♠手牌",
                        };
                        setDom(costFree2, mapList, back.skill.viewAsCondition, "condition")
                    };
                    if (costFree3) {
                        const mapList = {

                        };
                        setDom(costFree2, mapList, back.skill.viewAsCondition, "condition")
                    };
                }
                //第四页
                let subBack4 = newPage()
                let skillSeter = newElement('h2', '技能', subBack4)
                let copy = newElement('span', '复制', skillSeter)
                copy.style.float = 'right'
                listener(copy, e => {
                    try {
                        if (back.skill.mode === 'mainCode') {
                            let func = new Function('lib', back.target.value)
                        }
                        else new Function('let gama={' + back.target.value + '}')
                        if (document.execCommand) {
                            back.target.select();
                            document.execCommand("copy")
                        } else {
                            game.xjb_create.alert('由于所用方法已废弃，请手动复制(已为你选中，点击文本框即可复制。)', function () {
                                back.target.select();
                            })
                        }
                    }
                    catch (err) {
                        game.xjb_create.alert("！！！报错：<br>" + err)
                    }
                })
                let generator = newElement('span', '生成', skillSeter)
                generator.style.float = 'right'
                generator.style.marginRight = "0.5em"
                listener(generator, e => {
                    try {
                        if (back.skill.mode === 'mainCode') {
                            let func = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', back.target.value)
                            func(_status, lib, game, ui, get, ai);
                            game.xjb_create.alert('技能' + back.skill.id + "已生成!")
                        }
                    }
                    catch (err) {
                        game.xjb_create.alert("！！！报错：<br>" + err)
                    }
                })
                let skillFree = newElement('textarea', '', subBack4)
                ui.xjb_giveStyle(skillFree, {
                    height: '10em',
                    fontSize: '0.75em',
                    tabSize: '4'
                })
                //关于dom
                back.target = skillFree
                back.contentDoms = [contentSeter, contentFree, contentIntro, contentExample]
                back.viewAsDoms = [chooseSeter]
                back.choose = [chooseSeter, cardNameFree, costSeter, costFree1, costFree2];
                //初始化
                back.organize()
                return back
            }
            ui.create.system("技能编辑", game.xjb_skillEditor);
        },
    }
    for (let k in obj) {
        obj[k]()
    }

}