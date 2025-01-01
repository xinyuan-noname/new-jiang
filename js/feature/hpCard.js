import { _status, lib, game, ui, get, ai } from "../../../../noname.js";
const setEvent = (name, { player, content }) => {
    lib.element.player[name] = get.copy(player)
    lib.element.content[name] = get.copy(content)
};
const addPlayerMethod = (name, method) => {
    lib.element.player[name] = get.copy(method)
};

; (() => {
    const map = new Map();
    map.set(1, { obv: 1, rev: 2 });
    map.set(3, { obv: 3, rev: 4 });
    map.set(5, { obv: 5, rev: 4 });
    lib.xjb_cacheHpCardData = map;
})();
; (() => {
    const map = new Map()
    map.set(2, [[1, 1]])
    map.set(3, [[1, 1, 1], [1, 2]])
    map.set(4, [[1, 1, 1, 1], [1, 1, 2], [1, 3], [2, 2]])
    map.set(5, [[1, 1, 1, 1, 1], [1, 1, 1, 2], [1, 2, 2], [1, 1, 3], [2, 3], [1, 4]])
    lib.xjb_splitHpCardMap = map;
})();
lib.skill._xjb_UseHpCard = {
    trigger: {
        global: "gameStart"
    },
    filter: function (event, player) {
        if (!lib.config.xjb_hun) return false
        var name = player.name
        game.xjb_checkCharCountAll(name);
        if (!lib.config.xjb_count[name].HpCard || !lib.config.xjb_count[name].HpCard.length) return false
        if (!(player === game.me || player.isUnderControl())) return false
        return true
    },
    direct: true,
    forced: true,
    content: function () {
        "step 0"
        var name = player.name1
        var list = game.xjb_countHpCard(lib.config.xjb_count[name].HpCard)
        var hpCard = new Array(1, 2, 3, 4, 5).map(function (i) {
            return [i, game.xjb_createHpCard(i).outerHTML, get.cnNumber(i)]
        })
        var next = player.chooseButton(
            [
                '请选择你使用的体力牌',
                [hpCard, "tdnodes"]
            ],
            [1, Infinity]
        )
        next.filterButton = function (button) {
            var player = _status.event.player
            return lib.config.xjb_count[player.name].HpCard.includes(
                parseInt(button.link)
            )
        }
        "step 1"
        if (result.bool) {
            result.links.forEach(function (i) {
                player.xjb_useHpCard(i)
            })
        }
    }
}
lib.translate._xjb_UseHpCard = "<font color=gold>体力牌</font>"

lib.skill._xjb_changeHpCard = {
    trigger: {
        player: ["gainMaxHpAfter", "loseMaxHpAfter"],
    },
    direct: true,
    charlotte: true,
    content: function () {
        "step 0"
        player.xjb_adjustHpCard();
    },
    mark: true,
}

//Hpcard创建函数，第一个值为体力牌类型，第二个值为体力牌样式高度
game.xjb_createHpCard = function (num, num2 = 100) {
    if (Array.isArray(num)) {
        let list = []
        for (let i = 0; i < num.length; i++) {
            list.push(game.createHpCard(num[i]))
        }
        return list
    }
    const HpCard = ui.create.div('.xjb-HpCard');
    HpCard.setAttribute("number", get.cnNumber(num))
    HpCard.number = num;
    HpCard.innerHTML =
        `<img src="${lib.xjb_src}HpCard/${HpCard.number}.jpg" height =${num2}px>`
    return HpCard;
}

//统计体力牌张数
game.xjb_countHpCard = function (arr) {
    const list = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
    }
    arr.forEach(function (i) {
        list[i] = list[i] + 1
    })
    return list
}

get.xjb_playerHpCardCount = function (player) {
    let name = '';
    if (get.itemtype(player) == 'player') name = player.name
    if (typeof player === "string") name = player
    if (!lib.config.xjb_count[name] || !lib.config.xjb_count[name].HpCard) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    return game.xjb_countHpCard(lib.config.xjb_count[name].HpCard)
};

game.xjb_genHpCardData = function (value) {
    if (typeof value != "number") value = parseInt(value);
    /**
     * @type {Map}
     */
    const map = lib.xjb_cacheHpCardData;
    map.set(4, [{ obv: 4, rev: 3 }, { obv: 4, rev: 5 }].randomGet())
    map.set(2, [{ obv: 2, rev: 3 }, { obv: 2, rev: 1 }].randomGet())
    return map.get(value)
}

addPlayerMethod('xjb_adjustHpCard', function () {
    const player = this;
    player.xjb_HpCardArea = [];
    const mod = player.maxHp % 5;
    if ([1, 2, 3, 4, 5].includes(player.maxHp)) {
        player.xjb_HpCardArea.push(game.xjb_genHpCardData(player.maxHp));
    }
    else if (mod === 0) {
        for (let i = 0; i < player.maxHp / 5; i++) {
            player.xjb_HpCardArea.push(game.xjb_genHpCardData(5));
        }
    }
    else if ([3, 4].includes(mod)) {
        player.xjb_HpCardArea.push(game.xjb_genHpCardData(mod));
        const times = (player.maxHp - mod) / 5
        for (let i = 0; i < times; i++) {
            player.xjb_HpCardArea.push(game.xjb_genHpCardData(5));
        }
    }
    else if ([1, 2].includes(mod)) {
        player.xjb_HpCardArea.push(game.xjb_genHpCardData(3));
        player.xjb_HpCardArea.push(game.xjb_genHpCardData(2 + mod));
        const times = (player.maxHp - mod) / 5;
        for (let i = 0; i < times - 1; i++) {
            player.xjb_HpCardArea.push(game.xjb_genHpCardData(5));
        }
    }
    return player.xjb_HpCardArea;
})
addPlayerMethod("xjb_getLoseHpMap", function () {
    const player = this;
    let has = player.hp;
    const hasHpList = player.xjb_HpCardArea.slice(0).reverse().reduce((acc, hpCard) => {
        if (has >= hpCard.obv) {
            has -= hpCard.obv;
            acc.push(hpCard.obv);
            return acc;
        } else {
            acc.push(has);
            has = 0;
            return acc;
        }
    }, []);
    return hasHpList.reverse();
})
addPlayerMethod("xjb_getAccLoseHpMap", function (...indexes) {
    const player = this;
    const lose = player.xjb_getLoseHpMap().filter((_, index) => {
        return indexes.includes(index)
    }).reduce((acc, now) => acc + now, 0)
    return lose;
})
//给出体力牌
addPlayerMethod("$xjb_giveHpCard", function (num, target) {
    const theCard = game.xjb_createHpCard(num, 150)
    const player = this
    ui.xjb_giveStyle(theCard, {
        position: "absolute",
        left: (player.offsetLeft + 23) + "px",
        top: (player.offsetTop + 23) + "px",
        "z-index": "5",
    })
    ui.arena.appendChild(theCard)
    setTimeout(function () {
        ui.xjb_giveStyle(theCard, {
            left: (target.offsetLeft + 23) + "px",
            top: (target.offsetTop + 23) + "px"
        })
        setTimeout(() => { theCard.remove() }, 500)
    }, 300)
})
setEvent('xjb_giveHpCard',
    {
        player(target, num) {
            const player = this;
            if (!player.xjb_HpCardArea) player.xjb_adjustHpCard()
            if (!target) target = _status.event.player;
            if (!lib.config.xjb_count[target.name].HpCard) lib.config.xjb_count[target.name1].HpCard = [];
            if (!num) num = player.maxHp;
            const next = game.createEvent('xjb_giveHpCard')
            next.setContent('xjb_giveHpCard');
            next.player = this;
            next.target = target;
            next.num = num;
            return next
        },
        content() {
            const list = player.xjb_HpCardArea;
            const toRemove = []
            for (let i = 0; i < num; i++) {
                const hpCardObj = list[i];
                const obv = hpCardObj.obv;
                player.loseMaxHp(obv, target)
                lib.config.xjb_count[target.name].HpCard.push(obv)
                player.$xjb_giveHpCard(obv, target);
                toRemove.push(hpCardObj)
            }
            player.xjb_HpCardArea.removeArray(toRemove);
            game.saveConfig('xjb_count', lib.config.xjb_count);
        }
    }
)
//使用体力牌
setEvent('xjb_useHpCard', {
    player: function (num, source, bool = true) {
        if (!source) source = this;
        const player = this;
        const name = source.name;
        const next = game.createEvent('xjb_useHpCard');
        if (!player.xjb_HpCardArea) player.xjb_adjustHpCard();
        if (!lib.config.xjb_count[name].HpCard) lib.config.xjb_count[name].HpCard = [];
        next.num = num;
        next.player = player;
        next.source = source
        next.name = name;
        next.usable = bool;
        next.setContent('xjb_useHpCard');
        return next
    },
    content: function () {
        "step 0"
        event.trigger('xjb_judgeHasHpCard');
        event.container = lib.config.xjb_count[event.name].HpCard;
        if (!event.container.includes(event.num)) {
            event.trigger('xjb_hasnotHpCard')
            event.finish()
        }
        "step 1"
        event.container.remove(event.num);
        if (event.usable === true) {
            player.maxHp += (event.num);
            player.hp += (event.num);
            player.xjb_HpCardArea.push(game.xjb_genHpCardData(event.num))
        };
        player.update();
        game.log(player, get.translation(player.name) + '使用了体力牌：' + event.num)
        game.saveConfig('xjb_count', lib.config.xjb_count);
    }
})
//体力牌翻面动画
addPlayerMethod("$xjb_turnOverHpCard", function (obv, rev) {
    const player = this;
    const container = ui.create.div('.xjb-hpCard-container');
    const card = ui.create.div('.xjb-hpCard-doubleFace');
    const obvCard = game.xjb_createHpCard(obv, 100)
    const revCard = game.xjb_createHpCard(rev, 100)
    revCard.classList.add('xjb-hpCard-back')
    player.node.avatar.append(container)
    container.append(card)
    card.append(obvCard, revCard)
    setTimeout(() => {
        card.style.transform = 'rotateY(180deg)'
    }, 50)
    setTimeout(() => {
        container.remove()
    }, 1100)
})
//将体力牌翻面
setEvent("xjb_turnOverHpCard", {
    player(index) {
        const player = this;
        if (!player.xjb_HpCardArea) player.xjb_adjustHpCard()
        const list = player.xjb_HpCardArea;
        const next = game.createEvent('xjb_turnOverHpCard');
        next.player = player;
        next.index = list[index] ? index : 0;
        next.setContent('xjb_turnOverHpCard');
        return next
    },
    content() {
        'step 0'
        const list = player.xjb_HpCardArea;
        const hpCardObj = list[event.index];
        const obv = hpCardObj.obv;
        const rev = hpCardObj.rev;
        event.obv = obv;
        event.rev = rev;
        'step 1'
        player.xjb_HpCardArea[event.index] = { rev: event.obv, obv: event.rev };
        'step 2'
        player.maxHp -= event.obv;
        player.maxHp += event.rev;
        player.$xjb_turnOverHpCard(event.obv, event.rev)
        game.delay()
        'step 3'
        player.update();
        game.log(player, '将一张', event.obv, '点的体力牌', '翻面，', '成为', event.rev, '点的体力牌')
    }
})
//交换体力牌
setEvent("xjb_swapHpCard", {
    player(target, num = 1) {
        const player = this;
        if (!target) return;
        if (!player.xjb_HpCardArea) player.xjb_adjustHpCard()
        if (!target.xjb_HpCardArea) target.xjb_adjustHpCard()
        num = parseInt(num)
        num = isNaN(num) ? 0 : num
        const next = game.createEvent('xjb_swapHpCard');
        next.player = player;
        next.target = target;
        next.num = num;
        next.setContent('xjb_swapHpCard');
        return next
    },
    content() {
        'step 0'
        event.area1 = player.xjb_HpCardArea;
        event.area2 = event.target.xjb_HpCardArea;
        'step 1'
        if (event.area2.length > event.num) {
            const area = event.target.xjb_HpCardArea.map((content, index) => {
                return [index, game.xjb_createHpCard(content.obv).outerHTML]
            });
            player.chooseButton(true, event.num,
                [
                    `你选择${event.num}张从${get.translation(event.target)}交换获得的体力牌`,
                    [area, 'tdnodes']
                ]
            )
        } else {
            event.index2 = new Array(event.num).fill().map((_, index) => index);
            event.goto(3)
        }
        'step 2'
        event.index2 = result.links
        'step 3'
        if (event.area1.length > event.num) {
            const area = player.xjb_HpCardArea.map((content, index) => {
                return [index, game.xjb_createHpCard(content.obv).outerHTML]
            });
            player.chooseButton(true, event.num,
                [
                    `你选择${event.num}张给出的体力牌`,
                    [area, 'tdnodes']
                ]
            )
        } else {
            event.index1 = new Array(event.num).fill().map((_, index) => index);
            event.goto(5)
        }
        'step 4'
        event.index1 = result.links;
        'step 5'
        const list1 = event.area1.filter((_, index) => {
            return event.index1.includes(index)
        })
        const list2 = event.area2.filter((_, index) => {
            return event.index2.includes(index)
        })
        const allSide1 = list1.reduce((acc, hpCard) => {
            return acc + hpCard.obv
        }, 0)
        const allSide2 = list2.reduce((acc, hpCard) => {
            return acc + hpCard.obv
        }, 0)
        const loseHp1 = player.xjb_getAccLoseHpMap(...event.index1)
        const loseHp2 = event.target.xjb_getAccLoseHpMap(...event.index2)
        player.maxHp -= allSide1
        player.hp -= loseHp1
        player.maxHp += allSide2
        player.hp += loseHp2
        player.xjb_HpCardArea.remove(...list1);
        player.xjb_HpCardArea.add(...list2)
        event.target.maxHp -= allSide2;
        event.target.hp -= loseHp2;
        event.target.maxHp += allSide1;
        event.target.hp += loseHp1;
        event.target.xjb_HpCardArea.remove(...list2)
        event.target.xjb_HpCardArea.add(...list1)
        player.$xjb_giveHpCard(list1[0].obv, event.target)
        event.target.$xjb_giveHpCard(list2[0].obv, player)
        game.delay();
        'step 6'
        player.update();
        event.target.update();
    }
})
//分割体力牌
setEvent("xjb_splitHpCard", {
    player(index, forced) {
        const player = this;
        if (!player.xjb_HpCardArea) player.xjb_adjustHpCard()
        const list = player.xjb_HpCardArea;
        const next = game.createEvent('xjb_splitHpCard');
        next.player = player;
        next.index = list[index] ? index : 0;
        next.setContent('xjb_splitHpCard');
        return next
    },
    content() {
        'step 0'
        event.toSplit = player.xjb_HpCardArea[event.index];
        if (event.toSplit.obv === 1) event.finish()
        'step 1'
        const list = lib.xjb_splitHpCardMap.get(event.toSplit.obv).map(item => {
            const type = item.join('-')
            return [[[type, item.map(num => game.xjb_createHpCard(num).outerHTML).join("<span> </span>")]], 'tdnodes']
        }).reduce((acc, val) => {
            acc.push(`<font color=red>${val[0][0][0]}</font>`)
            acc.push(val)
            return acc;
        }, [])
        const next = player.chooseButton([
            '请选择一种分割方案',
            ...list
        ])
        if (forced) next.set("forced", true)
        'step 2'
        if (result.bool) {
            player.xjb_HpCardArea.remove(event.toSplit);
            result.links[0].split("-").forEach(item => {
                player.xjb_HpCardArea.push(game.xjb_genHpCardData(item))
            })
        }
    }
})

//防止一些未修改到的地方
if (game.createHpCard) console.warn('已有game.createHpCard函数!将被新将包的同名函数替换!')
game.createHpCard = game.xjb_createHpCard;
if (game.countHpCard) console.warn('已有game.countHpCard函数!将被新将包的同名函数替换!')
game.countHpCard = game.xjb_countHpCard;
setEvent('giveHpCard', {
    player: lib.element.player['xjb_giveHpCard'],
    content: lib.element.content['xjb_giveHpCard']
})
addPlayerMethod("$giveHpCard", lib.element.player["$xjb_giveHpCard"])
