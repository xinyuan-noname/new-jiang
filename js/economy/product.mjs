"use script"
const { lib, game, get, ai, _status, ui } = window.XJB_GLOBAL_VAR;
export class CardStoreGoods {
    cardName;
    arr1;
    arr2;
    constructor(num1 = 1, num2 = 1, num3 = 1, arr1, arr2, exclude) {
        this.content = {
            fivePoint: num1,
            minCost: num2,
            energyNeed: num3,
        }
        this.arr1 = arr1;
        this.arr2 = arr2;
        if (!exclude) CardStoreGoods.productList.push(this);
    }
    update() {
        if (lib.config.xjb_systemEnergy < this.content.fivePoint) {
            let Num1 = this.content.fivePoint - lib.config.xjb_systemEnergy
            this.content.cost = (Math.floor(Num1 / this.arr1[0]) * (this.arr1[1])) + 5
        } else if (lib.config.xjb_systemEnergy > this.content.fivePoint) {
            let Num2 = lib.config.xjb_systemEnergy - this.content.fivePoint
            this.content.cost = (-(Math.floor(Num2 / this.arr2[0]) * (this.arr2[1]))) + 5
        } else {
            this.content.cost = 5
        }
        this.content.cost = Math.round(this.content.cost * game.xjb_inflationRate())
        if (this.content.cost < this.content.minCost) this.content.cost = this.content.minCost
    }
    setName(cardName) {
        this.cardName = cardName
        this.description = lib.translate[cardName + "_info"]
        return this
    }
    //调用此方法产生一张牌,但是不会直接获得
    purchase() {
        if (!this.cardName) return;
        if (!(this.cardName in lib.card)) return;
        const cardProduct = game.createCard(this.cardName, "", 1);
        cardProduct.storage.xjb_allowed = true;
        cardProduct.dataset.cost = this.cost;
        game.xjb_costHunbi(this.cost, '在商店中购买')
        game.xjb_systemEnergyChange(-this.content.energyNeed);
        return cardProduct;
    }
    get ok() {
        return lib.config.xjb_systemEnergy >= this.content.energyNeed;
    }
    get cost() {
        this.update();
        if (lib.translate[this.cardName]) lib.translate[this.cardName + "_info"] = this.description + "</br>价格:" + this.content.cost;
        return this.content.cost;
    }
    static productList = []
    static getGoods(cardName) {
        return CardStoreGoods.productList.find(product => product.cardName === cardName);
    }
    static get canPurchaseList() {
        return CardStoreGoods.productList.filter(product => {
            if (!product.ok) return false;
            if (!product.cost) return false;
            return game.xjb_canPayWithB(product.cost);
        })
    }
}