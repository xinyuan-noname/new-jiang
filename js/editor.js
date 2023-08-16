"use strict";
(function(){
        window.xjb_editor={
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
            //
            '取消': 'cancel',
            '重复':'redo',
            '结束':'finish',
            '跳至':'goto',
            //
            '卡牌': 'card',
            '来源': 'source',
            '牌名': 'name',
            '花色': 'suit',
            '颜色': 'color',
            //伤害属性
            '受伤点数': 'trigger.num',
            '受到伤害点数': 'trigger.num',
            '受伤点数': 'trigger.num',
            '伤害点数': 'trigger.num',
            '伤害来源': 'trigger.source',
            '受伤角色': 'trigger.player',
            '受到伤害的角色': 'trigger.player',
            '造成伤害的牌': 'trigger.cards',
            '此牌对应的所有实体牌':'trigger.cards',
            '此牌对应的实体牌':'trigger.cards',
            '造成伤害的属性': 'trigger.nature',
            '伤害属性': 'trigger.nature',
            //游戏属性           
            '游戏': 'game',
            '创卡': 'createCard',
            '造卡': 'createCard',
            '印卡': 'createCard',
            '游戏轮数': 'game.roundNumber',
            '轮数': 'game.roundNumber',            
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
            '武器栏':'"equip1"',
            '防具栏':'"equip2"',
            '+1马栏':'"equip3"',
            '防御马栏':'"equip3"',
            '-1马栏':'"equip4"',
            '进攻马栏':'"equip3"',
            '坐骑栏':'"equip6"',
            '宝物栏':'"equip5"',
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
            '触发事件的角色':'trigger.player',
            '触发角色':'trigger.player',
            '目标角色':'trigger.target',
            //players
            '所选角色': 'result.targets',
            '所选的角色': 'result.targets',
            '选择的角色': 'result.targets',
            '所有角色': 'game.players',
            //
            '体力': 'hp',
            '体力值': 'hp',
            '体力上限':'maxHp',
            '护甲':'hujia',
            '护甲值':'hujia',
            'id': 'name1',
            '手牌数': 'countCards:"h"',
            '牌数': 'countCards:"he"',
            '区域内牌数': 'countCards:"hej"',
            //
            '有手牌': 'hasCard:"h"',
            '有牌': 'hasCard:"he"',
            '区域内有牌': 'hasCard:"hej"',
            '已受伤': 'isDamaged',
            '未受伤':'isHealthy',
            '存活': 'isAlive',
            '背面朝上': 'isTurnedOver',
            '武将牌背面朝上': 'isTurnedOver',
            '为体力值为全场最少或之一': 'isMinHp',
            '为手牌数为全场最少或之一':'isMinHandcard',
            //其他写法
            '收到伤害': 'damage',
            '摸': 'draw',            
            '获得护甲':'changeHujia',
            //
            '获得标记':'addMark',
            '移去标记':'removeMark',
            '拥有标记':'hasMark',            
            //
            '添加技能': 'addSkillLog',
            '获得技能': 'addSkillLog',
            '拥有技能':'hasSkill',
            '有技能':'hasSkill',
            //牌类事件          
            '获得区域内的牌':'gainPlayerCard:"hej":intoFunction',
            '获得区域内牌':'gainPlayerCard:"hej":intoFunction',
            '获得区域里牌':'gainPlayerCard:"hej":intoFunction',
            '获得区域里的牌':'gainPlayerCard:"hej":intoFunction',
            '弃置区域内牌':'discardPlayerCard:"hej":intoFunction', 
            '弃置区域内的牌':'discardPlayerCard:"hej":intoFunction',
            '弃置区域里牌':'discardPlayerCard:"hej":intoFunction', 
            '弃置区域里的牌':'discardPlayerCard:"hej":intoFunction',              
            '随机弃手牌':'randomDiscard',
            '随机弃置手牌':'randomDiscard',
            '随机弃牌': 'randomDiscard:"he":intoFunction',
            '随机弃置牌': 'randomDiscard:"he":intoFunction',
            '随机获得牌': 'randomGain',
            '移动场上牌':'moveCard',
            '扣置于武将牌上':'addToExpansion',  
            '置于武将牌上':'addToExpansion', 
            '获得角色牌': 'gainPlayerCard:"he":intoFunction',    
            '弃置角色牌': 'discardPlayerCard:"he":intoFunction',
            '获得角色手牌': 'gainPlayerCard:"he":intoFunction',    
            '弃置角色手牌': 'discardPlayerCard:"he":intoFunction',    
            //废除事件
            '废除一个武器栏':'disableEquip:"equip1":intoFunction',
            '废除一个防具栏':'disableEquip:"equip2":intoFunction',
            '废除一个+1马栏':'disableEquip:"equip3":intoFunction',
            '废除一个-1马栏':'disableEquip:"equip4":intoFunction',
            '废除一个防御马栏':'disableEquip:"equip3":intoFunction',
            '废除一个进攻马栏':'disableEquip:"equip4":intoFunction',
            '废除一个宝物栏':'disableEquip:"equip5":intoFunction',
            '废除武器栏':'disableEquip:"equip1":intoFunction',
            '废除防具栏':'disableEquip:"equip2":intoFunction',
            '废除+1马栏':'disableEquip:"equip3":intoFunction',
            '废除-1马栏':'disableEquip:"equip4":intoFunction',
            '废除防御马栏':'disableEquip:"equip3":intoFunction',
            '废除进攻马栏':'disableEquip:"equip4":intoFunction',
            '废除宝物栏':'disableEquip:"equip5":intoFunction',
            '废除判定区':'disableJudge',                        
            //选择式事件-废除            
            '废除装备区内一个装备栏':'chooseToDisable',
            '选择废除装备区内一个装备栏':'chooseToDisable',
            '废除一个装备栏':'chooseToDisable',
            '选择废除一个装备栏':'chooseToDisable',
            '恢复装备区内一个装备栏':'chooseToEnable',
            '选择恢复装备区内一个装备栏':'chooseToEnable',
            '选择恢复一个装备栏':'chooseToEnable',
            '恢复一个装备栏':'chooseToEnable',
            //选择式事件-牌类
            '选择弃置牌':'chooseToDiscard:"he":intoFunction',
            '选择弃置手牌':'chooseToDiscard:"h":intoFunction',       
            '选择弃牌':'chooseToDiscard:"he":intoFunction',
            '选择弃手牌':'chooseToDiscard:"h":intoFunction',        
            '选择角色牌': 'choosePlayerCard:"he":intoFunction',   
            '选择角色手牌': 'choosePlayerCard',           
            '卜算':'chooseToGuanxing',
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
            '从牌堆底':'"bottom"',
            '任意张':'[1,Infinity]',
            '任意名':'[1,Infinity]',
            //
            '其他': 'other',
            '至多':'atMost',
            '至少':'atLeast',
            //逻辑语句           
            '或': ' || ',
            '或者': ' || ',
            '且': ' && ',
            '并且': ' && ',
            '非': '!',
            '不是': ' != ',
            '不为': ' != ',
            '为': ' == ',
            '是': '==',
            '等于': '==',
            '真等于': '===',
            '不等于': '!=',
            '真不等于': '!==',
            '必须选': 'true',
            '真': 'true',
            '假': 'false',
            '不': '!',
            '如果': 'if(',
            '如果不': 'if(!',
            '若': 'if(',
            '那么': ')',
            '否则': 'else ',
            //计算语句            
            '大于': '>',
            '大于等于': '>=',
            '不小于': '>=',
            '小于': '<',
            '小于等于': '<=',
            '不大于': '<=',
            '加': ' + ',
            '减': ' - ',
            '乘': ' * ',
            '除': ' / ',
            '取模': ' % ',
            '圆周率': 'Math.PI',
            //                        
            '变量': 'var ',
            '令为': ' = ',
            'in': ' in ',
            'let': 'let ',
            'var': 'var ',
            'const': 'const ',
            'typeof': 'typeof ',
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
                '牌置于装备区':'equip',
                '牌置于判定区':'addJudge',
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
                '武将牌翻面':'turnOver',
        }
        let list = Object.values(trigger)
        let list2 = Object.keys(trigger)
        list2.forEach((i, k) => {
                window.xjb_editor[i] = list[k]
                window.xjb_editor[i + "时"] = list[k] + "Begin"
                window.xjb_editor[i + "开始"] = list[k] + "Begin"
                window.xjb_editor[i + "开始时"] = list[k] + "Begin"
                window.xjb_editor[i + "开始前"] = list[k] + "Begin"
                window.xjb_editor[i + "结束"] = list[k] + "End"
                window.xjb_editor[i + "结束时"] = list[k] + "End"
                window.xjb_editor[i + "结束后"] = list[k] + "End"
                window.xjb_editor[i + "前"] = list[k] + "Before"
                window.xjb_editor[i + "之前"] = list[k] + "Before"
                window.xjb_editor[i + "后"] = list[k] + "After"
                window.xjb_editor["令一名角色" + i] = "source:" + list[k]
                window.xjb_editor["令一名角色" + i + "时"] = "source:" + list[k] + "Begin"
                window.xjb_editor["令一名角色" + i + "结束"] = "source:" + list[k] + "End"
                window.xjb_editor["令一名角色" + i + "前"] = "source:" + list[k] + "Before"
                window.xjb_editor["令一名角色" + i + "之前"] = "source:" + list[k] + "Before"
                window.xjb_editor["令一名角色" + i + "后"] = "source:" + list[k] + "After"
                window.xjb_editor["使一名角色" + i] = "source:" + list[k]
                window.xjb_editor["使一名角色" + i + "时"] = "source:" + list[k] + "Begin"
                window.xjb_editor["使一名角色" + i + "结束"] = "source:" + list[k] + "End"
                window.xjb_editor["使一名角色" + i + "之前"] = "source:" + list[k] + "Before"
                window.xjb_editor["使一名角色" + i + "后"] = "source:" + list[k] + "After"               
        })
        "abcdefghjlmnopqrstuvwxyz".split('').forEach(i=>{
                window.xjb_editor[i + '点'] = i
                window.xjb_editor[i.toUpperCase() + '点'] = i.toUpperCase()
                window.xjb_editor[i + '张'] = i                
                window.xjb_editor[i.toUpperCase() + '张'] = i.toUpperCase()    
                window.xjb_editor[i + '张'] = i
                window.xjb_editor[i.toUpperCase() + '点'] = i.toUpperCase()                          
        })
})()