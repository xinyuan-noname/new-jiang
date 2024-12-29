const cardNumberMap = {
    A: 1,
    J: 11,
    Q: 12,
    K: 13
}
export class ImplicitTextTool {
    static common(text) {
        let result = text
            .replace(/(.+?)[ ]*(颜色)?(不?[为是])[ ]*(黑|红|无)色$/mg, '获取 颜色 $1 \n $3 \n $4色')
            .replace(/(.+?)[ ]*(花色)?(不?[为是])[ ]*(梅花|黑桃|方片|红桃)$/mg, '获取 花色 $1 \n $3 \n $4')
            .replace(/(.+?)[ ]*(类别)?(不?[为是])[ ]*(非延时锦囊牌|延时锦囊牌|普通锦囊牌|基本牌|装备牌)$/mg, '获取 类别 $1 \n $3 \n $4')
            .replace(/(.+?)[ ]*(类别)?(不?[为是])[ ]*锦囊牌$/mg, '获取 广义类别 $1 \n $3 \n $4')
            .replace(/(.+?)[ ]*(牌名)?(不?[为是])[ ]*(杀|闪|桃|酒|无懈可击|桃园结义|[南][蛮]入侵|万箭齐发|顺手牵羊|过河拆桥|无中生有|铁索连环|决斗|火攻|闪电|乐不思蜀|兵粮寸断)$/mg, '获取 牌名 $1 \n $3 \n $4')
            .replace(/(?<=[ ]*点数[ ]*不?[为是][ ]*)(A|J|Q|K)$/g, function (_, ...p) {
                return `${cardNumberMap[p[0]]}`
            })
            .replace(/^(.+?)[ ]*点数[ ]*(不?)(为|是|大于|小于|等于)[ ]*(10|11|12|13|[1-9])$/mg, '获取 点数 $1\n $2$3 \n $4')
            .replace(/^(.+?)[ ]*(副类别)?[ ]*(不?[为是])[ ]*(武器牌|防具牌|\+1马牌|-1马牌|进攻马牌|防御马牌)$/mg, '获取 副类别 $1 \n $3 \n $4')
            .replace(/^(.+?)[ ]*(不?)是[ ]*伤害牌/mg, "获取  $2带伤害标签 $1")
            .replace(/^(.+?)[ ]*(不?[为是])[ ]*([冰火雷])杀$/mg, (_, ...p) => {
                return `获取 属性 ${p[0]}\n ${p[1]} \n ${p[2]}属性 \n ${p[1].includes("不") ? "或者" : "并且"} \n 获取 牌名 ${p[0]} \n ${p[1]} \n 杀`
            })
        result = result
            .replace(/^(.+?)于回合外$/mg, "$1 不是当前回合角色")
            .replace(/^(.+?)[ ]*[是为][ ]*(男性|女性)$/mg, '$1 属于性别 $2')
            .replace(/^(.+?)[ ]*不[是为][ ]*(男性|女性)$/mg, '$1 不属于性别 $2')
        return result;
    }
    static content(text) {
        let result = ImplicitTextTool.common(text)
            .replace(/(.+?)[ ]*执行(一个)?额外的?(准备|判定|出牌|摸牌|弃牌|结束)阶段/g, `阶段列表 剪接 当前回合序号 0 $3阶段|\\-skillID`)
            .replace(/^销毁(此牌|卡牌)/mg, '$1 修正\n$1 移除\n$1 已销毁 令为 真\n游戏 日志 $1 "已销毁"')
            .replace(/^重置本技能发动次数$/mg, '本技能发动次数令为0')
        console.log("content", result);
        return result;
    }
    static filter(text) {
        let result = ImplicitTextTool.common(text)
            .replace(/^卡牌(花色|点数|牌名|颜色|类型|副类别|类别)(相同|不同)$/mg, '获取 当前选择的卡牌$1是否$2')
        console.log("filterCard", result);
        return result;
    }
    static filterCard(text) {
        let result = ImplicitTextTool.common(text)
            .replace(/^卡牌(花色|点数|牌名|颜色|类型|副类别|类别)(相同|不同)$/mg, '获取 当前选择的卡牌$1是否$2')
        console.log("filterCard", result);
        return result;
    }
    static trigger(text) {
        let result = text
            .replace(/^游戏开始时$/mg, "global phaseBefore\nplayer enterGame\n")
            .replace(/于回合[外内]/g, '')
            .replace(/当(?!前)/g, '')
            .replace(/(结束时|结束后)/g, "结束")
            .replace(/(开始时|开始后)/g, "开始")
            .replace(/(完成结算后|结算完成后)/g, "结算后")
            .replace(/之([前后])/g, "$1")
        console.log("trigger", result);
        return result;
    }
}