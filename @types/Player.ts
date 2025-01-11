import Player from "../../../node_modules/@types/noname-typings/nonameModules/noname/library/element/player";
type HpCardNum = 1 | 2 | 3 | 4 | 5
declare module "../../../node_modules/@types/noname-typings/nonameModules/noname/library/element/player" {
    interface Player {
        /**
         * 根据体力值和体力上限调整player.xjb_HpCardArea属性
         */
        xjb_adjustHpCard: () => void;
        /**
         * 翻面体力牌的动画
         * 当obv,rev均缺省时自动将第一张体力牌翻面
         * @param obv -体力牌正面点数
         * @param rev -体力牌背面点数
         */
        $xjb_turnOverHpCard: (obv?: HpCardNum, rev?: HpCardNum) => void;
        /**
         * 将自己的第几张体力牌翻面 0索引
         * @param index -位于player.xjb_HpCardArea体力牌的索引值 默认为0
         */
        xjb_turnOverHpCard: (index?: number) => GameEvent;
        /**
         * 令一名角色的一张体力牌翻面
         * @param target -体力牌翻面的角色 默认为自己
         */
        xjb_turnOverPlayerHpCard: (target?: Player) => GameEvent;
        /**
         * 与一名角色交换体力牌
         * @param target 交换牌的角色
         * @param num 交换的张数 默认为0
         */
        xjb_swapHpCard: (target: Player, num: number) => GameEvent;
        /**
         * 将自己的第几张体力牌翻面 0索引
         * @param index 位于player.xjb_HpCardArea体力牌的索引值 默认为0
         * @param forced 是否强制要求分割
         */
        xjb_splitHpCard: (index: number, forced: true) => GameEvent;

        //
        /**
         * 获取指定区域的技能卡
         * @param position 区域字符串 默认为'h'手牌区
         * @param includeNoSkill 是否包括暂无技能的技能卡
         */
        xjb_getSkillCard: (position?: string, includeNoSkill?: boolean) => Card[];
        /**
         * 统计指定区域的技能卡
         * @param position 区域字符串 默认为'h'手牌区
         * @param includeNoSkill 是否包括暂无技能的技能卡
         */
        xjb_countSkillCard: (position?: string, includeNoSkill?: boolean) => Card[];
        /**
         * 判断是否有技能卡
         * @param position 区域字符串 默认为'h'手牌区
         * @param includeNoSkill 是否包括暂无技能的技能卡
         */
        xjb_hasSkillCard: (position?: string, includeNoSkill?: boolean) => Card[];
        /**
         * 从阵法区中移除一张技能卡
         * @param select 选择牌的区间or张数
         */
        xjb_discardSkillCard: (select: Select | number) => GameEvent;
        /**
         * @param {boolean} [forced] - 是否强制选择。如果设置为 true，则必须被选择。
         * @param {(Select|number)} [select] - 选择技能卡的区间或数量。
         * @param {function(string):boolean} [filterSkill] - 过滤技能，指示该技能是否应该被转化。
         * @param {Player} [target] - 技能转化为技能卡的目标玩家。
         */
        xjb_chooseSkillToCard: (...args: any[]) => GameEvent;


        //
        /**
         * 返回的灵力
         * @param status "postive"代表正灵力 "negative"表示负灵力 不填则两者均算入
         * @param position 默认为特殊区域s的灵力
         */
        xjb_getLingli: (status?: "positive" | "negative", position?: string) => Card[];
        /**
         * 返回的灵力张数
         * @param status "postive"代表正灵力 "negative"表示负灵力 不填则两者均算入
         * @param position 默认为特殊区域s的灵力张数
         */
        xjb_countLingli: (status?: "positive" | "negative", position?: string) => number;
        /**
         * 判断角色是否有灵力
         * @param status "postive"代表正灵力 "negative"表示负灵力 不填则计算两者的代数和
         * @param position 默认判断特殊区域s的灵力
         */
        xjb_hasLingli: (status?: "positive" | "negative", position?: string) => boolean;
        /**
         * 返回特殊区域灵力的总体状态
         * @param position 默认为特殊区域s的灵力张数
         */
        xjb_getLingliStatus: (position?: string) => "positive" | "negative" | null;
        /**
         * 返回同时有正灵力和负灵力的区域
         */
        xjb_getLingliPeaceless: () => string;
        /**
         * 获取角色的灵力密度
         */
        xjb_getLingliDensity: () => number;
        /**
         * 失去灵力
         * @param num 无第二个参数status时 num为正数失去正灵力 负数失去反灵力 若有status且num为负数 则num为0
         */
        xjb_loseLingli: (num: number, status?: "positive" | "negative") => GameEvent;
        /**
         * 获得灵力
         * @param num 无第二个参数status时 num为正数获得正灵力 负数获得反灵力 若有status且num为负数 则num为0
         */
        xjb_addLingli: (num: number, status?: "positive" | "negative") => GameEvent;
        /**
         * 将灵力转化灵力密度
         * @param ignoreStable 是否将灵力转化为灵力密度直到灵力平衡
         */
        xjb_transDensity: (ignoreStable: boolean) => GameEvent
        /**
         * 增加灵力密度
         */
        xjb_addLingliDensity: (num: number, status: "positive" | "negative") => GameEvent



        //
        /**
         * 该函数用于销毁一些牌
         * @param cards 销毁的牌
         */
        xjb_destoryCards: (cards: Card[]) => GameEvent;
    }
}

