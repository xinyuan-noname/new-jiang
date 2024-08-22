export function LOAD_HPCARD(lib, game, ui, get, ai, _status) {
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
    if (!game.createHpCard) console.warn('已有game.createHpCard函数!将被新将包的同名函数替换!')
    game.createHpCard = game.xjb_createHpCard;

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
    if (!game.countHpCard) console.warn('已有game.countHpCard函数!将被新将包的同名函数替换!')
    game.countHpCard = game.xjb_countHpCard;

    get.xjb_playerHpCardCount = function (player) {
        let name = '';
        if (get.itemtype(player) == 'player') name = player.name
        if (typeof player === "string") name = player
        if (!lib.config.xjb_count[name] || !lib.config.xjb_count[name].HpCard) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        return game.xjb_countHpCard(lib.config.xjb_count[name].HpCard)
    }

    lib.skill._xjb_UseHpCard = {
        trigger: {
            global: "gameStart",
        },
        filter: function (event, player) {
            if (!lib.config.xjb_hun) return false
            var name = player.name1
            if (!lib.config.xjb_count[name]) return false
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


    {
        const map = new Map();
        map.set(1, { obv: 1, rev: 2 });
        map.set(2, { obv: 2, rev: 1 });
        map.set(3, { obv: 3, rev: 4 });
        map.set(5, { obv: 5, rev: 4 });
        lib.xjb_cacheHpCardData = map;
    }

    game.xjb_genHpCardData = function (value) {
        /**
         * @type {Map}
         */
        const map = lib.xjb_cacheHpCardData;
        map.set(4, [{ obv: 4, rev: 3 }, { obv: 4, rev: 5 }].randomGet())
        return map.get(value)
    }
    game.xjb_addPlayerMethod('xjb_adjustHpCard', function () {
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
            const times = (player.maxHp - mod) / 5
            console.log(times)
            for (let i = 0; i < times - 1; i++) {
                player.xjb_HpCardArea.push(game.xjb_genHpCardData(5));
            }
        }
        return player.xjb_HpCardArea;
    })

    //给出体力牌
    game.xjb_addPlayerMethod("$xjb_giveHpCard", function (num, target) {
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
    game.xjb_addPlayerMethod("$giveHpCard", lib.element.player["$xjb_giveHpCard"])
    game.xjb_setEvent('xjb_giveHpCard',
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
    game.xjb_setEvent('giveHpCard', {
        player: lib.element.player['xjb_giveHpCard'],
        content: lib.element.content['xjb_giveHpCard']
    })

    //使用体力牌
    game.xjb_setEvent('xjb_useHpCard', {
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

    //体力牌翻面
    game.xjb_addPlayerMethod("$xjb_turnOverHpCard", function (obv, rev) {
        const player = this;
        const container = ui.create.div('.xjb-hpCard-container');
        const card = ui.create.div('.xjb-hpCard-doubleFace');
        const obvCard = game.xjb_createHpCard(obv, 100)
        const revCard = game.xjb_createHpCard(rev, 100)
        revCard.classList.add('xjb-hpCard-back')
        player.node.avatar.append(container)
        container.append(card)
        card.append(obvCard, revCard)
        requestAnimationFrame(() => {
            card.style.transform = 'rotateY(180deg)'
        })
        setTimeout(() => {
            container.remove()
        }, 1100)
    })
    game.xjb_setEvent("xjb_turnOverHpCard", {
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
        content(event) {
            'step 0'
            const list = player.xjb_HpCardArea;
            const hpCardObj = list[event.index];
            const obv = hpCardObj.obv;
            const rev = hpCardObj.rev;
            event.obv = obv;
            event.rev = rev;
            'step 1'
            let has = player.hp;
            const hasHpList = player.xjb_HpCardArea.reduce((acc, hpCard) => {
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
            hasHpList.reverse()
            player.hp -= hasHpList[event.index];
            'step 2'
            player.xjb_HpCardArea[event.index] = { rev: event.obv, obv: event.rev };
            'step 3'
            player.maxHp -= event.obv;
            player.maxHp += event.rev;
            player.hp += event.rev;
            player.$xjb_turnOverHpCard(event.obv, event.rev)
            game.delay()
            'step 4'
            player.update();
            game.log(player,'将一张',event.obv,'点的体力牌','翻面，','成为',event.rev,'点的体力牌')
        }
    })
}