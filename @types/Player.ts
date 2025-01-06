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
        $xjb_turnOverHpCard: (obv: HpCardNum | void, rev: HpCardNum | void) => void;
        /**
         * 将自己的第几张体力牌翻面 0索引
         * @param index -位于player.xjb_HpCardArea体力牌的索引值 默认为0
         */
        xjb_turnOverHpCard: (index: number | void) => GameEventPromise;
        /**
         * 令一名角色的一张体力牌翻面
         * @param target -体力牌翻面的角色 默认为自己
         */
        xjb_turnOverPlayerHpCard: (target: Player | void) => GameEventPromise;
        /**
         * 与一名角色交换体力牌
         * @param target 交换牌的角色
         * @param num 交换的张数 默认为0
         */
        xjb_swapHpCard: (target: Player, num: number) => GameEventPromise;
        /**
         * 将自己的第几张体力牌翻面 0索引
         * @param index 位于player.xjb_HpCardArea体力牌的索引值 默认为0
         * @param forced 是否强制要求分割
         */
        xjb_splitHpCard: (index: number, forced: true) => GameEventPromise;



    }
}
