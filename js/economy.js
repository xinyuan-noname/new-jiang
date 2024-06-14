window.XJB_LOAD_ECONOMY = function (_status, lib, game, ui, get, ai) {
    //log
    game.xjb_writeHunbiLog = function (log) {
        var time = game.xjb_getCurrentDate();
        var str = `${time[0]}-${time[1]}-${time[2]}-${time[3]}-${time[4]}:`;
        str += log
        const fileWay = lib.config.xjb_fileURL + "log/log.txt";
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.responseText) {
                const file = new Blob([xhr.responseText + str], {
                    type: "text/plain;charset=utf-8"
                });
                game.xjb_transferFile(file, fileWay, true);
            } else {
                const file = new Blob([str], {
                    type: "text/plain;charset=utf-8"
                });
                game.xjb_transferFile(file, fileWay, true);
            }
        };
        xhr.open("GET", lib.xjb_src + "log/log.txt");
        xhr.send();
    }
    game.xjb_clearHunbiLog = function () {
        const fileWay = lib.config.xjb_fileURL + "log/log.txt";
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.responseText) {
                const file = new Blob([''], {
                    type: "text/plain;charset=utf-8"
                });
                game.xjb_transferFile(file, fileWay, true);
            } else {
                const file = new Blob([''], {
                    type: "text/plain;charset=utf-8"
                });
                game.xjb_transferFile(file, fileWay, true);
            }
        };
        xhr.open("GET", lib.xjb_src + "log/log.txt");
        xhr.send();
    }
    /*Getcurrency*/
    game.xjb_currencyRate = {
        PointToEnergy: 520,
        defineProperty: function (key) {
            Object.defineProperty(this, key, {
                writable: false,
                configurable: false
            })
        },
    };
    game.xjb_getHunbi = function (value = 1, num = 1, freeE, silent = false, log) {
        if (!lib.config.xjb_hunbi) lib.config.xjb_hunbi = 0
        lib.config.xjb_hunbi += Math.round(num * value);
        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
        if (!silent) game.xjb_create.alert('你获得了' + num * value + '魂币！')
        if (!freeE) {
            let regulatoryFactor = Math.ceil(game.xjb_currencyRate.thirdRate / game.xjb_inflationRate())
            if (game.xjb_inflationRate() < 1) regulatoryFactor = game.xjb_currencyRate.CoinToEnergy;
            let consumeEnergy = num * value * regulatoryFactor;
            game.xjb_systemEnergyChange(-consumeEnergy)
        }
        if (log || !log) {
            let logString = `你因为${log ? log : 'unknown'}获得了${num * value}个魂币.
`;
            game.xjb_writeHunbiLog(logString);
        }
    }
    game.xjb_addDakadian = function (num = 1, freeE) {
        game.saveConfig('xjb_hundaka2', lib.config.xjb_hundaka2 + num);
        if (!freeE) {
            game.xjb_create.alert('你获得了' + num + '打卡点！')
            game.xjb_systemEnergyChange(-game.xjb_currencyRate.PointToEnergy * num)
        }
    }
    game.xjb_systemEnergyChange = function (num = 0) {
        lib.config.xjb_systemEnergy += Math.round(num);
        game.saveConfig('xjb_systemEnergy', lib.config.xjb_systemEnergy);
        if (lib.config.xjb_systemEnergy <= 0) {
            num < 0 && game.xjb_create.alert("魂币系统能量耗尽")
            game.xjb_back && game.xjb_back.remove && game.xjb_back.remove()
            ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove()
        } else {
            lib.config.xjb_chupingjisha === 1 && lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()
        }
        return lib.config.xjb_systemEnergy
    }
    /*Bonus*/
    game.xjb_jiangchiUpDate = function () {
        game.xjb_jiangchi_zeroise()
        let hunbilist = lib.config.xjb_list_hunbilist.choujiang
        let jiangchi = lib.xjb_list_xinyuan.jiangchi
        const x = lib.config.cjb_cj_type;
        var list1 = Object.keys(hunbilist[x])
        var list2 = Object.values(hunbilist[x])
        list1.forEach((k, i) => {
            let a = get.xjb_number(list2[i]);
            let addList = new Array();
            addList.length = a;
            addList.fill(list1[i]);
            jiangchi = [...jiangchi, ...addList];
        })
        jiangchi.sort(i => Math.random() - 0.5)
        lib.xjb_list_xinyuan.jiangchi = jiangchi
    }

    game.xjb_update_choujiang = function (num) {
        //将奖池转为数组
        let hunbilist = lib.config.xjb_list_hunbilist.choujiang
        let list = Object.keys(hunbilist[num])
        for (let i = 0; i < list.length; i++) {
            const before = hunbilist[num][list[i]]
            let number = get.xjb_number(before) + game.xjb_getCurrentDate(true)
            if (i === list.length - 1) number = get.xjb_number(before) - i * game.xjb_getCurrentDate(true)
            hunbilist[num][list[i]] = number + '*100'
        }
    }
    game.xjb_jiangchi_zeroise = function () {
        lib.xjb_list_xinyuan.jiangchi.length = 0;
    }
    /*Data*/
    game.xjb_hunbiExpectation = function () {
        const inputString = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang["2"])
        // 使用正则表达式提取礼包价值和概率
        const pattern = /(\d+)魂币.*?:(\d+\%)/g;
        const matches = [];
        let match;
        while ((match = pattern.exec(inputString)) !== null) {
            matches.push({ value: parseInt(match[1], 10), probability: parseFloat(match[2].replace('%', '')) / 100 });
        }
        // 计算期望值
        const expectation = matches.reduce((total, { value, probability }) => total + (value * probability), 0);
        return Math.floor(expectation);
    }
    game.xjb_inflationRate = function () {
        return (game.xjb_currencyRate.CoinToEnergy * lib.config.xjb_hunbi / lib.config.xjb_systemEnergy)
    }
    /*consume*/
    game.xjb_condition = function (num1, num2) {
        var Uhave
        switch (num1) {
            case 1: Uhave = lib.config.xjb_hunbi; break;
            case 2: Uhave = lib.config.xjb_hundaka2; break;
            case 3: Uhave = lib.config.xjb_jnc - lib.config.xjb_newcharacter.skill.length;; break;
        }
        if (!Uhave) return false
        if (Uhave >= num2) return true
        return false
    }
    game.cost_xjb_cost = function (num1, num2, log) {
        num2 = Math.abs(num2)
        if (num1 == 1 || num1 == "B") game.xjb_costHunbi(num2, log)
        else if (num1 === 2 || num1 == "D") lib.config.xjb_hundaka2 -= num2
        game.saveConfig('xjb_hundaka2', lib.config.xjb_hundaka2);
        return true;
    }
    game.xjb_costHunbi = function (number, log) {
        number = Math.abs(number);
        lib.config.xjb_hunbi -= number;
        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
        game.xjb_systemEnergyChange(number * game.xjb_currencyRate.thirdRate);
        if (log || !log) {
            let logString = `${str}:你因为${log ? log : 'unknown'}失去了${number}个魂币.
`;
            game.xjb_writeHunbiLog(logString);
        }
    }
    game.xjb_howMuchIsIt = function (value, min) {
        let price = Math.round(value * game.xjb_inflationRate());
        if (price < min) price = min;
        return price
    }
    game.xjb_purchaseIt = function (name, num = 1,) {
        const price = (game.xjb_goods[name] && game.xjb_goods[name].getPrice()) || 3
        if (!game.xjb_condition(1, price * num)) return false;
        game.cost_xjb_cost(1, price * num, `购买${game.xjb_goods[name].translate}`);
        game.xjb_getIt(name, num);
        return true;
    }
    game.xjb_getIt = function (name, num = 1) {
        if (!lib.config.xjb_objects[name]) lib.config.xjb_objects[name] = 0
        lib.config.xjb_objects[name] += num
        game.saveConfig('xjb_objects', lib.config.xjb_objects)
        if (num > 1) {
            const energyConsume = (game.xjb_goods[name] && game.xjb_goods[name].getEnergyConsume()) || 30
            game.xjb_systemEnergyChange(-energyConsume * num)
        }
    }
    game.xjb_hasIt = function (name, num = 1) {
        if (!lib.config.xjb_objects[name]) lib.config.xjb_objects[name] = 0
        return lib.config.xjb_objects[name] >= num
    }
    /*goods*/
    class Goods {
        constructor(previousPrice, minCost, translate) {
            this.previousPrice = previousPrice;
            this.minCost = minCost;
            this.translate = translate;
        }
        getPrice() {
            return game.xjb_howMuchIsIt(this.previousPrice, this.minCost);
        }
        getEnergyConsume() {
            return this.previousPrice * game.xjb_currencyRate.CoinToEnergy;
        }
    }
    game.xjb_goods = {
        changeSexCard: new Goods(5, 3, '性转卡'),
        changeGroupCard: new Goods(4, 3, '择木卡'),
    }
}