window.XJB_LOAD_EDITOR = function (_status, lib, game, ui, get, ai) {
    let obj = {
        xjb_translate: function () {
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
            }
            lib.xjb_translate = {
                //
                '场上一名角色': 'global',
                '场上一个角色': 'global',
                '场上一位角色': 'global',
                '场上一只角色': 'global',
                '一名角色': 'global',
                '一个角色': 'global',
                '一位角色': 'global',
                '一只角色': 'global',
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
                '名为使用牌的父事件': 'getParent:"useCard":intoFunction',
                '名为打出牌的父事件': 'getParent:"respond":intoFunction',
                //事件属性
                '名字': "name",
                '卡牌': 'card',
                '来源': 'source',
                '牌名': 'name',
                '花色': 'suit',
                '颜色': 'color',
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
                '弃牌堆中不为赠物的宝物牌': 'discardPile:card=>get.subtype(card,false)=="equip5"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中不为赠物的武器牌': 'discardPile:card=>get.subtype(card,false)=="equip1"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中不为赠物的防具牌': 'discardPile:card=>get.subtype(card,false)=="equip2"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中不为赠物的+1马牌': 'discardPile:card=>get.subtype(card,false)=="equip3"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中不为赠物的-1马牌': 'discardPile:card=>get.subtype(card,false)=="equip4"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中不为赠物的进攻马牌': 'discardPile:card=>get.subtype(card,false)=="equip3"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中不为赠物的防御马牌': 'discardPile:card=>get.subtype(card,false)=="equip4"&&!get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的宝物牌': 'discardPile:card=>get.subtype(card,false)=="equip5"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的武器牌': 'discardPile:card=>get.subtype(card,false)=="equip1"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的防具牌': 'discardPile:card=>get.subtype(card,false)=="equip2"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的+1马牌': 'discardPile:card=>get.subtype(card,false)=="equip3"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的-1马牌': 'discardPile:card=>get.subtype(card,false)=="equip4"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的进攻马牌': 'discardPile:card=>get.subtype(card,false)=="equip3"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中为赠物的防御马牌': 'discardPile:card=>get.subtype(card,false)=="equip4"&&get.cardtag(card,"gifts"):intoFunction',
                '弃牌堆中伤害锦囊牌': 'discardPile:card=>get.type2(card,false)=="trick"&&get.tag(card,"damage"):intoFunction',
                '弃牌堆中颜色为红色的牌': 'discardPile:card=>get.color(card,false)=="red":intoFunction',
                '弃牌堆中颜色为黑色的牌': 'discardPile:card=>get.color(card,false)=="black":intoFunction',
                '弃牌堆中花色为梅花的牌': 'discardPile:card=>get.color(card,false)=="club":intoFunction',
                '弃牌堆中花色为方片的牌': 'discardPile:card=>get.color(card,false)=="diamond":intoFunction',
                '弃牌堆中花色为黑桃的牌': 'discardPile:card=>get.color(card,false)=="spade":intoFunction',
                '弃牌堆中花色为红桃的牌': 'discardPile:card=>get.color(card,false)=="heart":intoFunction',
                '弃牌堆中花色为红心的牌': 'discardPile:card=>get.color(card,false)=="heart":intoFunction',
                '弃牌堆中红色牌': 'discardPile:card=>get.color(card,false)=="red":intoFunction',
                '弃牌堆中黑色牌': 'discardPile:card=>get.color(card,false)=="black":intoFunction',
                '弃牌堆中梅花牌': 'discardPile:card=>get.color(card,false)=="club":intoFunction',
                '弃牌堆中方片牌': 'discardPile:card=>get.color(card,false)=="diamond":intoFunction',
                '弃牌堆中黑桃牌': 'discardPile:card=>get.color(card,false)=="spade":intoFunction',
                '弃牌堆中红桃牌': 'discardPile:card=>get.color(card,false)=="heart":intoFunction',
                '弃牌堆中红心牌': 'discardPile:card=>get.color(card,false)=="heart":intoFunction',
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
                '牌堆中不为赠物的宝物牌': 'cardPile2:card=>get.subtype(card,false)=="equip5"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中不为赠物的武器牌': 'cardPile2:card=>get.subtype(card,false)=="equip1"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中不为赠物的防具牌': 'cardPile2:card=>get.subtype(card,false)=="equip2"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中不为赠物的+1马牌': 'cardPile2:card=>get.subtype(card,false)=="equip3"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中不为赠物的-1马牌': 'cardPile2:card=>get.subtype(card,false)=="equip4"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中不为赠物的进攻马牌': 'cardPile2:card=>get.subtype(card,false)=="equip3"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中不为赠物的防御马牌': 'cardPile2:card=>get.subtype(card,false)=="equip4"&&!get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的宝物牌': 'cardPile2:card=>get.subtype(card,false)=="equip5"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的武器牌': 'cardPile2:card=>get.subtype(card,false)=="equip1"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的防具牌': 'cardPile2:card=>get.subtype(card,false)=="equip2"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的+1马牌': 'cardPile2:card=>get.subtype(card,false)=="equip3"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的-1马牌': 'cardPile2:card=>get.subtype(card,false)=="equip4"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的进攻马牌': 'cardPile2:card=>get.subtype(card,false)=="equip3"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中为赠物的防御马牌': 'cardPile2:card=>get.subtype(card,false)=="equip4"&&get.cardtag(card,"gifts"):intoFunction',
                '牌堆中伤害锦囊牌': 'cardPile2:card=>get.type2(card,false)=="trick"&&get.tag(card,"damage"):intoFunction',
                '牌堆中颜色为红色的牌': 'cardPile2:card=>get.color(card,false)=="red":intoFunction',
                '牌堆中颜色为黑色的牌': 'cardPile2:card=>get.color(card,false)=="black":intoFunction',
                '牌堆中花色为梅花的牌': 'cardPile2:card=>get.color(card,false)=="club":intoFunction',
                '牌堆中花色为方片的牌': 'cardPile2:card=>get.color(card,false)=="diamond":intoFunction',
                '牌堆中花色为黑桃的牌': 'cardPile2:card=>get.color(card,false)=="spade":intoFunction',
                '牌堆中花色为红桃的牌': 'cardPile2:card=>get.color(card,false)=="heart":intoFunction',
                '牌堆中花色为红心的牌': 'cardPile2:card=>get.color(card,false)=="heart":intoFunction',
                '牌堆中红色牌': 'cardPile2:card=>get.color(card,false)=="red":intoFunction',
                '牌堆中黑色牌': 'cardPile2:card=>get.color(card,false)=="black":intoFunction',
                '牌堆中梅花牌': 'cardPile2:card=>get.color(card,false)=="club":intoFunction',
                '牌堆中方片牌': 'cardPile2:card=>get.color(card,false)=="diamond":intoFunction',
                '牌堆中黑桃牌': 'cardPile2:card=>get.color(card,false)=="spade":intoFunction',
                '牌堆中红桃牌': 'cardPile2:card=>get.color(card,false)=="heart":intoFunction',
                '牌堆中红心牌': 'cardPile2:card=>get.color(card,false)=="heart":intoFunction',
                //花色颜色
                '方片': '"diamond"',
                '无花色': '"none"',
                '黑桃': '"spade"',
                '红桃': '"heart"',
                '红心': '"heart"',
                '红色': '"red"',
                '黑色': '"black"',
                //
                '游戏': 'game',
                //
                '创卡': 'createCard',
                '造卡': 'createCard',
                '印卡': 'createCard',
                '更新轮数': 'updateRoundNumber',
                '刷新牌堆': 'updateRoundNumber',
                '暂停': 'pause',
                '继续': 'resume',
                '胜利': 'over:true:intoFunction',
                '失败': 'over:false:intoFunction',
                '结束': 'over',
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
                '梅花': '"club"',
                '方片': '"diamond"',
                '无花色': '"none"',
                '黑桃': '"spade"',
                '红桃': '"heart"',
                '红心': '"heart"',
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
                '成为一张牌的目标后': "target:useCardToTarget",
                '成为牌的目标后': "target:useCardToTarget",
                '造成伤害': 'damageSource',
                '造成伤害时': 'damageSource',
                '造成伤害后': 'damageSource',
                //
                '摸牌式': '"draw"',
                '从牌堆底': '"bottom"',
                '任意张': '[1,Infinity]',
                '任意名': '[1,Infinity]',
                //
                '其他': 'other',
                '至多': 'atMost',
                '至少': 'atLeast',
                //逻辑语句           
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
                '必须选': 'true',
                '真': 'true',
                '假': 'false',
                '不': '!',
                '如果': 'if(',
                '如果不': 'if(!',
                '若': 'if(',
                '那么': ')',
                '否则': 'else ',
                '大于': ' > ',
                '大于等于': ' >= ',
                '不小于': ' >= ',
                '小于': ' < ',
                '小于等于': ' <= ',
                '不大于': ' <= ',
                //计算语句  
                '加': ' + ',
                '减': ' - ',
                '乘': ' * ',
                '除': ' / ',
                '取模': ' % ',
                '圆周率': 'Math.PI',
                //变量        
                '变量': 'var ',
                '令为': ' = ',
                '自增': '++',
                '自减': '--',
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
                'let': 'let ',
                'var': 'var ',
                'const': 'const ',
                'typeof': 'typeof ',
                'function': 'function ',
                'class': 'class ',
                'new': 'new ',
                'return': 'return ',
                'delete': 'delete ',
                'case': 'case ',
                //注释
                '注释': '//',
            }
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
                "回复体力": "recover",
                '回血': 'recover',
                '受伤': 'damage',
                "受到伤害": "damage",
                '失去体力': 'loseHp',
                '流失体力': 'loseHp',
                '失去血量': 'loseHp',
                '流失血量': 'loseHp',
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
                lib.xjb_translate["令一名角色" + i] = "source:" + list[k]
                lib.xjb_translate["令一名角色" + i + "时"] = "source:" + list[k] + "Begin"
                lib.xjb_translate["令一名角色" + i + "结束"] = "source:" + list[k] + "End"
                lib.xjb_translate["令一名角色" + i + "前"] = "source:" + list[k] + "Before"
                lib.xjb_translate["令一名角色" + i + "之前"] = "source:" + list[k] + "Before"
                lib.xjb_translate["令一名角色" + i + "后"] = "source:" + list[k] + "After"
                lib.xjb_translate["使一名角色" + i] = "source:" + list[k]
                lib.xjb_translate["使一名角色" + i + "时"] = "source:" + list[k] + "Begin"
                lib.xjb_translate["使一名角色" + i + "结束"] = "source:" + list[k] + "End"
                lib.xjb_translate["使一名角色" + i + "之前"] = "source:" + list[k] + "Before"
                lib.xjb_translate["使一名角色" + i + "后"] = "source:" + list[k] + "After"
            })
            "bcdfghlmnoprstuvwxyz".split('')
                .forEach(i => {
                    lib.xjb_translate[i + '点'] = i
                    lib.xjb_translate[i.toUpperCase() + '点'] = i.toUpperCase()
                    lib.xjb_translate[i + '张'] = i
                    lib.xjb_translate[i.toUpperCase() + '张'] = i.toUpperCase()
                    lib.xjb_translate[i + '张'] = i
                    lib.xjb_translate[i.toUpperCase() + '点'] = i.toUpperCase()
                })
            for (let i = 0; i < 100; i++) {
                lib.xjb_translate["步骤" + i] = '"step ' + i + '"'
                lib.xjb_translate["步骤" + get.cnNumber(i)] = '"step ' + i + '"'
                lib.xjb_translate["第" + i + "步"] = '"step ' + i + '"'
                lib.xjb_translate["第" + get.cnNumber(i) + "步"] = '"step ' + i + '"'
                lib.xjb_translate["跳至第" + i + "步"] = `event.goto(${i})`
                lib.xjb_translate["跳至第" + get.cnNumber(i) + "步"] = `event.goto(${i})`
                lib.xjb_translate[i + "张"] = '' + i
                lib.xjb_translate[get.cnNumber(i) + "张"] = '' + i
                lib.xjb_translate[i + "名"] = '' + i
                lib.xjb_translate[get.cnNumber(i) + "名"] = '' + i
                lib.xjb_translate[i + "点"] = '' + i
                lib.xjb_translate[get.cnNumber(i) + "点"] = '' + i
                lib.xjb_translate["牌堆中点数为" + get.strNumber(i) + "的牌"] = `cardPile2: card => get.number(card, false) === "${i}": intoFunction`
                lib.xjb_translate["弃牌堆中" + get.strNumber(i) + "的牌"] = `discardPile: card => get.number(card, false) === "${i}": intoFunction`
            }
            Object.keys(lib.card)
                .forEach(i => {
                    if (lib.translate[i]) {
                        lib.xjb_translate["牌堆中" + lib.translate[i]] = `cardPile2: card => get.name(card, false) === "${i}": intoFunction`
                        lib.xjb_translate["弃牌堆中" + lib.translate[i]] = `discardPile: card => get.name(card, false) === "${i}": intoFunction`
                        lib.xjb_translate[lib.translate[i]] = '"' + i + '"'
                        lib.xjb_translate['成为' + lib.translate[i] + '目标'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为' + lib.translate[i] + '的目标'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为' + lib.translate[i] + '的目标时'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为' + lib.translate[i] + '目标时'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为' + lib.translate[i] + '的目标后'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为' + lib.translate[i] + '目标后'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为【' + lib.translate[i] + '】目标'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为【' + lib.translate[i] + '】的目标'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为【' + lib.translate[i] + '】的目标时'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为【' + lib.translate[i] + '】目标时'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为【' + lib.translate[i] + '】的目标后'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['成为【' + lib.translate[i] + '】目标后'] = 'target:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['使用' + lib.translate[i] + '指定目标后'] = 'player:' + i + ':' + 'useCardToPlayered'
                        lib.xjb_translate['使用【' + lib.translate[i] + '】指定目标后'] = 'player:' + i + ':' + 'useCardToTarget'
                        lib.xjb_translate['使用' + lib.translate[i] + '指定目标'] = 'player:' + i + ':' + 'useCardToPlayered'
                        lib.xjb_translate['使用【' + lib.translate[i] + '】指定目标'] = 'player:' + i + ':' + 'useCardToTarget'
                    }
                    lib.xjb_class.cardName.push('"' + i + '"')
                })
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
                if (["createCard", 'createCard2'].contains(value)) list = ['cardName', 'suit', 'number', 'nature']
                if (["addToExpansion", 'gain'].contains(value)) list = ['gain']
                return list
            }
            game.xjb_skillEditor = function () {
                //
                const playerCN = new Array("你", "玩家", "目标角色", "当前回合角色", "所选角色", "选择的角色", "所选的角色")
                let player = ui.create.player()
                let eventModel = { ..._status.event }
                eventModel.trigger = undefined;
                player.init('xjb_caocao')
                let back = ui.create.xjb_back()[0]
                back.ele = {}
                back.skill = {
                    mode: '',
                    id: 'xxx',
                    kind: '',
                    type: [],
                    filter: [],
                    filter_card: [],
                    content: [],
                    trigger: {
                        player: [],
                        source: [],
                        global: [],
                        target: []
                    }
                }
                back.pageNum = 0
                back.pages = []
                back.trigger = []
                back.phaseUse = []
                back.choose = []
                back.organize = function () {
                    let str = '', step = 0, bool, logic = false, IF = false
                    if (this.skill.mode === 'mt') {
                        str = '"' + this.skill.id + '":{\n'
                    } else if (this.skill.mode === 'mainCode') {
                        str = 'lib.skill["' + this.skill.id + '"]={\n'
                    }
                    back.trigger.forEach(i => { i.style.display = 'none' })
                    back.phaseUse.forEach(i => { i.style.display = 'none' })
                    back.choose.forEach(i => { i.style.display = 'none' })
                    if (this.skill.kind === 'trigger') {
                        back.trigger.forEach(i => { i.style.display = 'block' })
                        str += '    trigger:{\n'
                        let addTrigger = (value) => {
                            if (this.skill.trigger[value].length === 0) return false
                            str += '        '
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
                        str += '    },\n'
                    }
                    else if (this.skill.kind) {
                        str += '    ' + this.skill.kind + ',\n'
                        if (this.skill.kind === 'enable:"phaseUse"') {
                            back.phaseUse.forEach(i => { i.style.display = 'block' })
                        } else {
                            back.choose.forEach(i => { i.style.display = 'block' })
                        }
                    }
                    this.skill.type.forEach(i => {
                        str += '    ' + i + ':true,\n'

                    })
                    str += '    filter:function(event,player){\n'
                    if (this.skill.type.contains("zhuSkill")) {
                        str += '        if(! player.hasZhuSkill("' + this.skill.id +
                            '")) return false;\n'
                    }
                    if (this.skill.filter_card.length > 0) {
                        let tempStr = this.skill.filter_card.join()
                        str += '        if(! [' + tempStr + '].contains(get.name(event.card))) return false;\n'
                    }
                    this.skill.filter.forEach((i, k) => {
                        if (i === "") return;
                        if (i.indexOf("var ") >= 0 || i.indexOf("let ") >= 0 || i.indexOf("const ") >= 0 || i.indexOf(" = ") >= 0 || i.indexOf(" += ") >= 0 || i.indexOf(" -= ") >= 0) {
                            str += '        ' + i + '\n'
                        }
                        else if (i.slice(-3, -1) === "||" || i.slice(-3, -1) === "&&") {
                            if (logic == false) str += '        if(! (' + i
                            else str += '\n        ' + i
                            logic = true
                        }
                        else if (logic === true) {
                            str += '\n        ' + i + ')) return false;\n'
                            logic = false
                        }
                        else {
                            str += '        if(! (' + i + ')) return false;\n'
                        }
                    })
                    str += '        return true;\n'
                    str += '    },\n'
                    str += '    content:function(){\n        "step 0"\n'
                    let judgeAwaken = () => {
                        return this.skill.type.filter(i => {
                            return ["limited", "juexingji", "dutySkill"].contains(i)
                        }).length > 0
                    }
                    if (judgeAwaken()) str += '        player.awakenSkill("' + this.skill.id + '");\n';
                    if (this.skill.type.contains('zhuanhuanji')) str +=
                        '        player.changeZhuanhuanji("' + this.skill.id + '");\n'
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
                        if (i === "if(" && IF === false) {
                            str += '        if('
                            IF = true
                        }
                        else if (i === ")" && IF === true) {
                            str += ')\n    '
                            IF = false
                        }
                        else if (IF === true) {
                            str += a
                        }
                        else str += '        ' + a + "\n"
                        if (i.indexOf('chooseTarget') > 0) {
                            step++
                            str += '        "step ' + step + '"\n'
                            bool = false;
                        }
                    })
                    str += '    },\n'
                    if (this.skill.mode === 'mt') str += '},'
                    else if (this.skill.mode === 'mainCode') str += '}'
                    str = str.replace(/,[)]/g, ')')
                    str = str.replace(/,,+/g, ',')
                    str = str.replace(/[(],/g, '(')
                    str = str.replace(/;;+/g, ';')
                    this.target.value = str
                }
                function dispose(str, number) {
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
                            c.forEach(f => {
                                if (!['当'].contains(f)) d.push(f)
                            })
                            d = d.join('')
                            d = lib.xjb_translate[d] || d
                            if (d.indexOf(":intoFunction") > 0) {
                                d = d.replace(":intoFunction", "")
                                d = d.split(":")
                                return list.push(...d)
                            }
                            list.push(d)
                        })
                        list3.push(list)
                    })
                    if (number === 3) return list3
                    //组装
                    list3.forEach(i => {
                        let str0 = '', str = '', str1 = '', str2 = '', notice = [], bool = true, index,
                            players
                        //捕捉关键词
                        i.forEach(a => {
                            if (game.xjb_judgeType(a)) {
                                notice.push(game.xjb_judgeType(a))
                                if (game.xjb_judgeType(a) === 'players') players = a
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
                                else if (a.indexOf(':') > 0) {
                                    let arrA = a.split(':')
                                    str += '.' + arrA.shift()
                                    str += '('
                                    str += arrA.join(',')
                                    str += ')'
                                }
                                else str += a
                            }
                            if (notice.contains('game')) WAW(game)
                            else if (notice.contains('get')) WAW(get)
                            else if (notice.contains('player')) WAW(player)
                            else if (notice.contains('event')) WAW(eventModel)
                            else WAW(player)
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
                                let punc = [" || ", " && ", " + ", " - ", " += ", " -= ", "++", "--", "!", " >= ", " <= ", " == ", " === "]
                                if (c.indexOf('到') > 0) {
                                    let arr = c.split('到')
                                    a = '['
                                    a += lib.xjb_translate[arr[0]] || arr[0]
                                    a += ','
                                    a += lib.xjb_translate[arr[1]] || arr[1]
                                    a += ']'
                                }
                                if (b > 0 && !punc.contains(a) && !puncSwtich) {
                                    string = ',' + a + ')'
                                }
                                else {
                                    if (punc.contains(a)) puncSwtich = true
                                    else if (puncSwtich) puncSwtich = false
                                    string = a + ')'
                                }
                                str2 = str2.replace(')', string)
                            })
                        }
                        if (notice.contains('players')) {
                            str0 = players + '.forEach(i=>{'
                            while (str.indexOf(players) >= 0) str = str.replace(players, 'i')
                            while (str2.indexOf(players) >= 0) str2 = str2.replace(players, 'i')
                            str2 += ';})'
                        }
                        if (notice.contains('if') && !notice.contains('then')) {
                            str1 = ')'
                        }
                        list4.push(str0 + str + str1 + str2)
                    })
                    return list4
                }
                function newElement(tag, innerHTML, father) {
                    let h = document.createElement(tag);
                    h.innerHTML = innerHTML;
                    father.appendChild(h)
                    return h
                }
                function style(ele) {
                    ui.xjb_giveStyle(ele, {
                        height: "1.5em",
                        position: 'relative',
                    })
                }
                function listener(ele, fn) {
                    ele.addEventListener(lib.config.touchscreen ?
                        'touchend' : 'click', fn)
                }
                function newPage() {
                    let subBack = newElement('div', '', back)
                    back.pages.push(subBack)
                    ui.xjb_giveStyle(subBack, {
                        flexDirection: 'column',
                        bottom: '25px',
                        fontSize: '1.5em',
                        width: 'calc(95% - 50px)',
                        height: 'calc(65% + 50px)',
                        margin: 'auto',
                        position: 'relative',
                        display: 'flex'
                    })
                    let curtain = newElement('div', '', subBack)
                    ui.xjb_giveStyle(curtain, {
                        width: '100%',
                        height: '100%',
                        backgroundColor: "#3c4151",
                        opacity: "0.7",
                        position: 'absolute',
                        zIndex: '-1'
                    })
                    if (back.pages.length > 1) subBack.style.display = "none"
                    return subBack
                }
                let h1 = newElement('h1', '魂氏技能编辑器', back)
                h1.style.width = '90%'
                let next = newElement('span', '下一页', h1)
                next.style.float = 'right'
                back.ele.nextPage = next
                listener(next, e => {
                    if (back.pageNum < back.pages.length - 1) back.pageNum++
                    else back.pageNum = 0
                    back.pages.forEach((i, k) => {
                        i.style.display = back.pageNum == k ? 'flex' : 'none'
                    })
                })
                let last = newElement('span', '上一页', h1)
                back.ele.lastPage = last
                listener(last, e => {
                    back.pageNum--
                    if (back.pageNum < 0) back.pageNum = back.pages.length - 1
                    back.pages.forEach((i, k) => {
                        i.style.display = back.pageNum == k ? 'flex' : 'none'
                    })
                })
                last.style.float = 'right'
                last.style.marginRight = '10px'
                //第一页
                let subBack = newPage()
                //
                let idSeter = newElement('div', '技能id:', subBack)
                style(idSeter)
                let idFree = newElement('textarea', '', subBack)
                back.ele.id = idFree
                ui.xjb_giveStyle(idFree, {
                    fontSize: '1em',
                    height: '1em',
                    width: '50%',
                    position: 'relative',
                })
                idFree.submit = function (e) {
                    if (e && e.keyCode == 13) {
                        idFree.value = ''
                    }
                    back.skill.id = idFree.value
                    back.organize()
                }
                idFree.addEventListener('keyup', idFree.submit)
                //
                let kindSeter = newElement('div', '技能种类:', subBack)
                style(kindSeter)
                let kindFree = newElement('div', '', subBack)
                ui.xjb_giveStyle(kindFree, {
                    height: '1em',
                    float: 'left',
                    position: 'relative',
                })
                back.ele.kinds = kindFree.children
                if (true) {
                    let list = ['触发类', '出牌阶段类', '使用类', '打出类', '使用打出类'];
                    let list1 = ['trigger', 'enable:"phaseUse"', 'enable:"chooseToUse"',
                        'enable:"chooseToRespond"', 'enable:["chooseToUse","chooseToRespond"]']
                    list.forEach((i, k) => {
                        let it = ui.create.xjb_button(kindFree, i)
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        })
                        it.kind = list1[k]
                        listener(it, e => {
                            back.skill.kind = it.kind
                            Array.from(it.parentElement.children).forEach(t => {
                                t.style.backgroundColor = "#e4d5b7"
                                if (t.kind == back.skill.kind) t.style.backgroundColor = 'red'
                            })
                            back.organize()
                        })
                    })
                }
                //
                let typeSeter = newElement('div', '技能标签:', subBack)
                style(typeSeter)
                let typeFree = newElement('div', '', subBack)
                ui.xjb_giveStyle(typeFree, {
                    height: '1em',
                    float: 'left',
                    position: 'relative',

                })
                back.ele.types = typeFree.children
                if (true) {
                    let list = ['主公技', '锁定技', '使命技', '限定技', '觉醒技', '转换技'];
                    let list1 = ['zhuSkill', 'forced', 'dutySkill', 'limited',
                        'juexingji', 'zhuanhuanji']
                    list.forEach((i, k) => {
                        let it = ui.create.xjb_button(typeFree, i)
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        })
                        it.type = list1[k]
                        listener(it, e => {
                            if (back.skill.type.contains(it.type)) {
                                back.skill.type.remove(it.type)
                                it.style.backgroundColor = "#e4d5b7";
                            } else {
                                it.style.backgroundColor = "red";
                                back.skill.type.push(it.type)
                            }
                            back.organize()
                        })
                    })
                }
                let modeSeter = newElement('div', '编写位置:', subBack)
                style(modeSeter)
                let modeFree = newElement('div', '', subBack)
                back.ele.mode = modeFree.children
                ui.xjb_giveStyle(modeFree, {
                    height: '1em',
                    float: 'left',
                    position: 'relative',
                })
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
                let filterSeter = newElement('div', '<b><font color="red">发动条件</font></b>:', subBack2)
                style(filterSeter)
                let filterFree = newElement('textarea', '', subBack2)
                back.ele.filter = filterFree
                ui.xjb_giveStyle(filterFree, {
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                filterFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                filterFree.arrange = function () {
                    function update(str) {
                        let wonder = filterFree.value.split('\n')
                        wonder = wonder.map(t => {
                            let wonder1 = t.split(str).join('')
                            return wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : '')
                        })
                        filterFree.value = wonder.join('\n')
                    }
                    playerCN.forEach(i => {
                        this.changeWord(i + '的', i)
                    });
                    new Array("你", "玩家", "目标", "当前回合角色",
                        "体力值", "体力上限", "手牌数",
                        "大于", "小于", "等于", "是", "不是", "不为",
                        "火属性", "冰属性", "雷属性",
                        '红色', '黑色', '梅花', '方片', '无花色', '黑桃', '红桃', '红心').forEach(i => {
                            this.changeWord(new RegExp(i, 'g'), i + ' ')
                        });
                    this.changeWord(/(?<!名)为/g, '为 ')
                    this.changeWord(/体力(?!上限|值)/g, '体力 ')
                    this.changeWord(/并且\s?/g, '并且\n')
                    this.changeWord(/或者\s?/g, '或者\n')
                    this.changeWord(/\s\s/g, ' ')
                    this.changeWord(/\s+$/, '')
                }
                back.ele.filter.submit = function (e) {
                    let wonderfulCSTS = (filterFree.value.indexOf("同上") > 0 && filterFree.value.match(/.+\n同上/) && filterFree.value.match(/.+\n同上/)[0]) || ''
                    wonderfulCSTS = wonderfulCSTS.replace(/\n同上/, '')
                    filterFree.value = filterFree.value.replace("同上", wonderfulCSTS)
                    let updatedValue = (filterFree.value.indexOf("同下") >= 0 && filterFree.value.match(/同下\n.+/) && filterFree.value.match(/同下\n.+/)[0]) || '';
                    updatedValue = updatedValue.replace(/同下\n/, '');
                    filterFree.value = filterFree.value.replace(/同下/, updatedValue);
                    filterFree.value.indexOf("整理") > 0 && filterFree.changeWord('整理', '') && filterFree.arrange()
                    back.skill.filter = []
                    if (!filterFree.value || filterFree.value.length === 0) return back.skill.filter.push('true') && back.organize()
                    let list = dispose(filterFree.value)
                    list = list.map(t => {
                        return t.replace(/trigger/g, 'event')
                    })
                    back.skill.filter.push(...list)
                    back.organize()
                }
                filterFree.addEventListener('keyup', back.ele.filter.submit)
                let filterIntro = newElement('div', '举例说明', subBack2)
                style(filterIntro)
                let filterExample = newElement('div', '例如:有一个技能的发动条件是:你的体力值大于3<br>' +
                    '就在框框中写:<br>' +
                    '你 体力值 大于 三<br>' +
                    '每写完一个效果，就提行写下一个效果。'
                    , subBack2)
                style(filterExample)
                //第三页
                let subBack3 = newPage()
                let contentSeter = newElement('div', '<b><font color=red>技能效果', subBack3)
                style(contentSeter)
                let contentFree = newElement('textarea', '', subBack3)
                back.ele.content = contentFree
                ui.xjb_giveStyle(contentFree, {
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                contentFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                contentFree.ensure = function () {
                    this.changeWord(/\s\n/g, '\n')
                    this.changeWord(/\s\s/g, ' ')
                    this.changeWord(/如果\s?/g, '如果\n')
                    this.changeWord(/\s?那么\s?/g, '\n那么\n')
                }
                contentFree.arrange = function () {
                    this.changeWord(/然后/g, '\n')
                    this.changeWord(/\s\n/g, '\n')
                    function update(str) {
                        let wonder = contentFree.value.split('\n')
                        wonder = wonder.map(t => {
                            let wonder1 = t.split(str).join('')
                            return wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : '')
                        })
                        contentFree.value = wonder.join('\n')
                    }
                    for (let i = 1; i <= 20; i++) {
                        this.changeWord("任意" + i + '张', i + '张')
                        this.changeWord("任意" + get.cnNumber(i) + '张', get.cnNumber(i) + '张')
                        this.changeWord("任意" + i + '名', get.cnNumber(i) + '名')
                        this.changeWord("任意" + get.cnNumber(i) + '名', get.cnNumber(i) + '名')
                    }
                    playerCN.forEach(i => {
                        this.changeWord(i + '的', i)
                    })
                    for (let i = 1; i <= 20; i++) {
                        update(i + '张')
                        update(get.cnNumber(i) + '张')
                        update(i + '点')
                        update(get.cnNumber(i) + '点')
                        update(i + '名')
                        update(get.cnNumber(i) + '名')
                    }
                    "abcdefghjlmnopqrstuvwxyz".split('').forEach(i => {
                        update(i + '张')
                        update(i + '点')
                        update(i + '名')
                        update(i.toUpperCase() + '张')
                        update(i.toUpperCase() + '点')
                        update(i.toUpperCase() + '名')
                    })
                    const wonderA = [
                        '红色', '黑色', '梅花', '方片', '无花色', '黑桃', '红桃', '红心',
                        "火属性", "冰属性", "雷属性",
                        "任意张", "任意名",
                        "其他", "至多", "至少",
                        "并且", "或者"]
                    for (let i = 0; i < wonderA.length; i++) {
                        update(wonderA[i])
                    }
                    ["体力值", "体力上限", "手牌数",
                        "大于", "小于", "等于", "是", "不是", "不为", "令为",
                        "变量"
                    ].forEach(i => {
                        this.changeWord(new RegExp(i, 'g'), i + ' ')
                    })
                    this.changeWord(/(?<!名)为/g, '为 ')
                    this.changeWord(/体力(?!上限|值)/g, '体力 ')
                    this.ensure()
                    let ty = contentFree.value.split('\n').map(i => {
                        let nice1 = [], nice2 = [], ie
                        let arrNice = new Array(...playerCN)
                        arrNice.forEach(ae => {
                            if (i.indexOf(ae) === 0) {
                                nice1.push(ae)
                                i = i.replace(ae, '')
                            }
                        })
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
                    this.value = ty.join('\n');
                    this.ensure()
                    this.changeWord(/\s+$/, '')
                }
                contentFree.zeroise = function () {
                    this.value = ""
                }
                back.ele.content.submit = function (e) {
                    let wonderfulCSTS = (contentFree.value.indexOf("同上") > 0 && contentFree.value.match(/.+\n同上/) && contentFree.value.match(/.+\n同上/)[0]) || ''
                    wonderfulCSTS = wonderfulCSTS.replace(/\n同上/, '')
                    contentFree.changeWord("同上", wonderfulCSTS)
                    let updatedValue = (contentFree.value.indexOf("同下") >= 0 && contentFree.value.match(/同下\n.+/) && contentFree.value.match(/同下\n.+/)[0]) || '';
                    updatedValue = updatedValue.replace(/同下\n/, '');
                    contentFree.changeWord(/同下/, updatedValue);
                    contentFree.value.indexOf("清空") >= 0 && contentFree.zeroise()
                    contentFree.value.indexOf("整理") >= 0 && contentFree.changeWord('整理', '') && contentFree.arrange()
                    back.skill.content = []
                    if (contentFree.value.length === 0) return back.organize()
                    let list = dispose(contentFree.value)
                    back.skill.content.push(...list)
                    back.organize()
                }
                contentFree.addEventListener('keyup', back.ele.content.submit)
                let contentIntro = newElement('div', '举例说明', subBack3)
                style(contentIntro)
                let contentExample = newElement('div', '例如:有一个技能的效果是:你摸三张牌<br>' +
                    '就在框框中写:<br>' +
                    '你 摸牌 三张<br>' +
                    '每写完一个效果，就提行写下一个效果。'
                    , subBack3)
                style(contentExample)
                //第五页
                let subBack5 = newPage()
                let triggerAdd = (who, en) => {
                    back.trigger.push(who)
                    who.style.display = 'none'
                    who.style.display = 'none'
                }
                let triggerSeter = newElement('div', '<b><font color=red>触发时机</font></b>', subBack5)
                style(triggerSeter)
                let triggerFree = newElement('textarea', '', subBack5)
                back.ele.trigger = triggerFree
                ui.xjb_giveStyle(triggerFree, {
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                triggerFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                triggerFree.arrange = function () {
                    ["你", "一名角色"].forEach(i => {
                        this.changeWord(new RegExp(i, 'g'), i + ' ')
                    })
                    this.changeWord(/\s\s/g, ' ')
                }
                back.ele.trigger.submit = function (e) {
                    this.value.indexOf("整理") > 0 && this.changeWord('整理', '') && this.arrange()
                    back.skill.trigger.source = []
                    back.skill.trigger.player = []
                    back.skill.trigger.global = []
                    back.skill.trigger.target = []
                    back.skill.filter_card = []
                    if (triggerFree.value.length === 0) return
                    let list = dispose(triggerFree.value, 3), tri_player = [],
                        tri_global = [], tri_target = [], tri_source = [], tri_players = []
                    list.forEach(i => {
                        if (i.contains('player')) {
                            let a = i
                            a.remove('player')
                            tri_players.push(...a)
                        } else if (i.contains('global')) {
                            let a = i
                            a.remove('global')
                            tri_global.push(...a)
                        }
                    })
                    tri_players.forEach(i => {
                        let a = i
                        if (i === 'damageSource') tri_source.push(a)
                        else if (i.indexOf("source:") === 0) {
                            a = a.slice(7)
                            tri_source.push(a)
                        }
                        else if (i.indexOf("target:") === 0) {
                            a = a.slice(7)
                            if (a.indexOf('useCardToTarget') > 0) {
                                tri_target.includes('useCardToTarget') || tri_target.push('useCardToTarget')
                                a = a.replace('useCardToTarget', '')
                                a = a.replace(':', '')
                                back.skill.filter_card.push('"' + a + '"')
                            }
                            else tri_target.push(a)
                        }
                        else if (i.indexOf("player:") === 0) {
                            a = a.slice(7)
                            if (a.indexOf('useCardToPlayer') > 0) {
                                tri_player.includes('useCardToPlayer') || tri_player.push('useCardToPlayer')
                                a = a.replace('useCardToPlayer', '')
                                a = a.replace(':', '')
                                back.skill.filter_card.push('"' + a + '"')
                            }
                            else tri_player.push(a)
                        }
                        else tri_player.push(a)
                    })
                    back.skill.trigger.player.push(...tri_player)
                    back.skill.trigger.source.push(...tri_source)
                    back.skill.trigger.target.push(...tri_target)
                    back.skill.trigger.global.push(...tri_global)
                    back.organize()
                }
                triggerFree.addEventListener('keyup', back.ele.trigger.submit)
                let triggerIntro = newElement('div', '举例说明', subBack5)
                style(triggerIntro)
                let triggerExample = newElement('div', '例如有一个技能的发动时机是:你受到伤害后<br>' +
                    '在框框中就写:<br>' +
                    '你 受到伤害后<br>' +
                    '每写完一个时机就提行写下一个时机。',
                    subBack5)
                style(triggerExample)
                triggerAdd(triggerExample)
                triggerAdd(triggerFree)
                triggerAdd(triggerIntro)
                triggerAdd(triggerSeter)
                let enableAdd = (word, en) => {
                    let rat = newElement('div', '', subBack5)
                    ui.xjb_giveStyle(rat, {
                        height: '1em',
                        float: 'left',
                        position: 'relative',
                    })
                    let it = ui.create.xjb_button(rat, word)
                    ui.xjb_giveStyle(it, {
                        fontSize: '1em'
                    })
                    it.type = en
                    listener(it, e => {
                        if (back.skill.type.contains(it.type)) {
                            back.skill.type.remove(it.type)
                            it.style.backgroundColor = "#e4d5b7";
                        } else {
                            it.style.backgroundColor = "red";
                            back.skill.type.push(it.type)
                        }
                        back.organize()
                    })
                    let mouse = newElement('div', '', subBack5)
                    style(mouse)
                    rat.style.display = 'none'
                    mouse.style.display = 'none'
                    back.phaseUse.push(rat, mouse)
                }
                enableAdd('选择角色', 'filterTarget')
                enableAdd('选择卡片', 'filterCard')
                let chooseSeter = newElement('div', '视为牌的技能:还在施工中...', subBack5)
                style(chooseSeter)
                back.choose.push(chooseSeter)
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
                        back.target.select();
                        document.execCommand("copy")
                    }
                    catch (err) {
                        game.xjb_create.alert("！！！报错：<br>" + err)
                    }
                })
                let skillFree = newElement('textarea', '', subBack4)
                ui.xjb_giveStyle(skillFree, {
                    height: '10em',
                    fontSize: '0.75em',
                })
                back.target = skillFree
                back.organize()
                return back
            }
            ui.create.system("技能编辑", game.xjb_skillEditor)
        },
    }
    for (let k in obj) {
        obj[k]()
    }
}