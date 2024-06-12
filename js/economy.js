window.XJB_LOAD_ECONOMY = function (_status, lib, game, ui, get, ai) {
    game.xjb_currencyRate = {
        PointToEnergy: 520,
    }
    /*currency*/
    game.xjb_getHunbi = function (value = 1, num = 1, freeE, silent = false) {
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
    game.cost_xjb_cost = function (num1, num2) {
        num2 = Math.abs(num2)
        if (num1 == 1 || num1 == "B") lib.config.xjb_hunbi -= num2
        else if (num1 === 2 || num1 == "D") lib.config.xjb_hundaka2 -= num2
        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi)
        game.saveConfig('xjb_hundaka2', lib.config.xjb_hundaka2);
        game.xjb_systemEnergyChange(num2 * game.xjb_currencyRate.thirdRate);
        return true;
    }
    game.xjb_howMuchIsIt=function(value,min){
        let price=Math.round(value*game.xjb_inflationRate());
        if(price<min) price=min;
        return price
    }
    game.xjb_purchaseIt = function (name, num = 1, price) {
        const energyConsume = previousPrice * game.xjb_currencyRate.CoinToEnergy
        if (!game.xjb_condition(1, price)) return false
        game.cost_xjb_cost(1, price,energyConsume)
        game.xjb_getIt(...arguments)
        return true
    }
    game.xjb_getIt = function (name, num = 1,energyConsume) {
        if (!lib.config.xjb_objects[name]) lib.config.xjb_objects[name] = 0
        lib.config.xjb_objects[name] += num
        game.saveConfig('xjb_objects', lib.config.xjb_objects)
        if(num>1){
            game.xjb_systemEnergyChange(-energyConsume)
        }
    }
    game.xjb_hasIt = function (name, num = 1) {
        if (!lib.config.xjb_objects[name]) lib.config.xjb_objects[name] = 0
        return lib.config.xjb_objects[name] >= num
    }
}