export class ImplicitTextTool {
    static content(text) {
        let result = text
            .replace(/(.+?)[ ]*执行(一个)?额外的?(准备|判定|出牌|摸牌|弃牌|结束)阶段/g, `阶段列表 剪接 当前回合序号 0 $3阶段|\\-skillID`)
        console.log("content", result);
        return result;
    }
    static filterCard(text) {
        let result = text
            .replace(/^卡牌(花色|点数|牌名|颜色|类型|副类别|类别)(相同|不同)$/mg, '获取 当前选择的卡牌$1是否$2')
        console.log("filterCard", result);
        return result;
    }
    static trigger(text) {
        let result = text
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