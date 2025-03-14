import { NonameEditorData } from "./data.mjs";
import { EditableElementManager, preventEnter, toggleMultiClass, UniqueChoiceManager } from "./encapsulated.mjs";
class HTMLCharacterCardElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        //$: shadow , html/character-card.html//
shadow.innerHTML=`
<style>
    :host {
        display: flex;
        box-sizing: border-box;
        border-radius: 10px;
        border: 5px solid black;
        color: black;
        font-size: 24px;
    }

    :host>div {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
    }


    .hidden {
        display: none !important;
    }

    .transparent {
        opacity: 0 !important;
    }

    .weak-transparent {
        opacity: 0;
    }

    /* 错误提示 */
    .wrong::before {
        content: "!";
        color: red
    }

    /* 可折叠按钮 */
    [class^="expandable"] {
        font-size: 14px;
        transition: 0.1s;
        cursor: pointer;
    }

    [class^="expandable"]::after {
        content: ">";
        height: 100%;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        transition: 0.1s;
    }

    .expandable-expanded::after {
        transform: rotate(90deg);
    }

    .expandable-collapsed::after {
        transform: rotateZ(0deg);
    }

    /* 可编辑文本框 */
    [contenteditable='true'] {
        cursor: text;
    }

    span[contenteditable='true'] {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        text-shadow: none;
        min-width: 1em;
    }

    div[contenteditable="true"] {
        background-color: floralwhite;
        padding: 0 10px;
        height: 24px;
        min-width: 100px;
        text-align: center;
        overflow: hidden;
    }

    /* 皮肤 */
    [data-setting="avatar"] {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    [data-setting="avatar"]>input[type="file"] {
        display: none;
    }

    [data-setting="avatar"]>div {
        height: 13em;
        width: 10em;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: dashed black;
        border-radius: 3px;
        background-size: cover;
    }

    :host>div>div:nth-child(2) {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: flex-start;
        flex: 1;
    }

    :host>div>div:nth-child(2) div[data-setting] {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    }

    /* 武将名 */
    [data-name] rt:empty {
        display: none;
    }

    /* 性别-势力 */
    [data-group] li,
    [data-sex] li {
        background-size: contain;
        background-repeat: no-repeat;
        height: 40px;
        width: 40px;
        cursor: pointer;
        opacity: 0.4;
        transition: 0.1s;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    [data-group] li.chosen,
    [data-sex] li.chosen {
        opacity: 1;
    }

    [data-group] li:hover,
    [data-sex] li:hover {
        opacity: 1;
    }

    [data-group] li:after,
    [data-sex] li:after {
        position: absolute;
        top: 40px;
        font-size: 16px;
    }

    /* 性别 */
    [data-sex]>ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    [data-sex] li[data-sex-option="male"] {
        background-image: url(image/card/sex_male.png);
    }

    [data-sex] li[data-sex-option="male"]::after {
        content: "男性"
    }

    [data-sex] li[data-sex-option="female"] {
        background-image: url(image/card/sex_female.png);
    }

    [data-sex] li[data-sex-option="female"]::after {
        content: "女性"
    }

    [data-sex] li[data-sex-option="double"] {
        background-image: url(image/card/sex_double.png);
    }

    [data-sex] li[data-sex-option="double"]::after {
        content: "双性"
    }

    [data-sex] li[data-sex-option="none"] {
        background-image: url(image/card/sex_none.png);
    }

    [data-sex] li[data-sex-option="none"]::after {
        content: "无性";
    }

    [data-sex] li[data-sex-option="male-castrated"] {
        background-image: url(image/card/sex_male_castrated.png);
    }

    [data-sex] li[data-sex-option="male-castrated"]::after {
        content: "太监"
    }

    /* 势力选项 */
    [data-group] ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
        box-sizing: border-box;
        display: flex;
    }

    [data-group]>ul {
        flex-direction: column;
    }

    [data-group]>ul>ul {
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    [data-group] li[data-group-option="wei"] {
        background-image: url(image/card/group_wei.png);
    }

    [data-group] li[data-group-option="wei"]::after {
        content: "魏"
    }

    [data-group] li[data-group-option="shu"] {
        background-image: url(image/card/group_shu.png);
    }

    [data-group] li[data-group-option="shu"]::after {
        content: "蜀"
    }

    [data-group] li[data-group-option="wu"] {
        background-image: url(image/card/group_wu.png);
    }

    [data-group] li[data-group-option="wu"]::after {
        content: "吴"
    }

    [data-group] li[data-group-option="qun"] {
        background-image: url(image/card/group_qun.png);
    }

    [data-group] li[data-group-option="qun"]::after {
        content: "群";
    }

    [data-group] li[data-group-option="jin"] {
        background-image: url(image/card/group_jin.png);
    }

    [data-group] li[data-group-option="jin"]::after {
        content: "晋"
    }

    [data-group] li[data-group-option="shen"] {
        background-image: url(image/card/group_shen.png);
    }

    [data-group] li[data-group-option="shen"]::after {
        content: "神"
    }

    [data-group] li[data-group-option="western"] {
        background-image: url(image/card/group_western.png);
    }

    [data-group] li[data-group-option="western"]::after {
        content: "西"
    }

    [data-group] li[data-group-option="key"] {
        background-image: url(image/card/group_key.png);
    }

    [data-group] li[data-group-option="key"]::after {
        content: "键"
    }

    /* 体力相关 */
    /* 体力 */
    [data-hp] div.hp-operation {
        display: flex;
        align-items: center;
        font-size: 20px;
        position: relative;
        padding-left: 1em;
        box-sizing: border-box;
        justify-content: space-between;
    }

    .hp-more-show:not(.hidden)~.hp-show {
        display: none;
    }

    .hp-more-show:is(.hidden)~.hp-adjust span[contenteditable] {
        display: none;
    }


    .hp-more-show {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        text-shadow: none;
    }

    .hp-more-show>div {
        display: flex;
        flex-direction: column;
        text-shadow: none;
    }

    .hp-more-show span[contenteditable] {
        margin: 0 10px;
    }

    .hp-show {
        display: flex;
        margin-left: auto;
    }

    .hp-adjust {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px;
    }

    .hp-adjust>div {
        display: flex;
        align-items: center;
        flex-direction: column;
        text-shadow: none;
        margin: 0;
        margin-left: 3px;
    }

    .hp-adjust>div>div {
        cursor: pointer;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .hp-adjust>div>div:hover {
        cursor: pointer;
        outline: dashed 1px;
    }

    .hp-adjust>span {
        margin: 10px;
    }

    .hp-adjust hr {
        width: 100%;
        margin: 0;
    }

    .hpContainer {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: flex-end;
        margin: 10px 0;
    }

    .hpContainer .hp {
        height: 20px;
        width: 20px;
        margin: 0 3px;
        background-size: cover;
        cursor: pointer;
    }

    .hpContainer.healthy .hp {
        background-image: url(theme/style/hp/image/glass1.png);
    }

    .hpContainer.damaged .hp {
        background-image: url(theme/style/hp/image/glass2.png);
    }

    .hpContainer.dangerous .hp {
        background-image: url(theme/style/hp/image/glass3.png);
    }

    .hp.lost {
        background-image: url(theme/style/hp/image/glass4.png);
        filter: grayscale(100%);
        opacity: 0.5;
    }

    .hp.lost.chosen,
    .hp.lost.chosen~.hp.lost,
    .hp.lost:hover,
    .hp.lost:hover~.hp.lost {
        filter: grayscale(0%);
        opacity: 1;
    }

    /* 护甲 */
    [data-hujia] div.hujia-operation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
        padding-left: 1em;
        box-sizing: border-box;
    }

    .hujiaContainer {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: flex-end;
        margin: 10px 0;
        box-shadow: none;
    }

    .hujia {
        height: 20px;
        width: 20px;
        transform: scale(1.4);
        margin: 0 3px;
        background-image: url(image/card/shield.png);
        background-size: cover;
        cursor: pointer;
    }

    .hujia.reset {
        margin: 0 10px;
    }

    .hujia.reset::before {
        content: "🗘";
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        top: 1px;
        right: 1px;
    }

    .hujia.lost {
        filter: grayscale(100%);
        opacity: 0.5;
    }

    .hujia.lost.chosen,
    .hujia.lost.chosen~.hujia.lost,
    .hujia.lost:hover,
    .hujia.lost:hover~.hujia.lost {
        filter: grayscale(0%);
        opacity: 1;
    }
</style>

<header></header>
<div>
    <div data-setting="avatar" data-avatar="" data-required="true">
        <input type="file" accept="image/*"></input>
        <div>请选择或拖入文件</div>
    </div>
    <div>
        <div data-setting="name pinyin" data-name="" data-pinyin="" data-required="true">
            <span>
                <span>姓名</span>
            </span>
            <ruby>
                <div contenteditable="true" spellcheck="false"></div>
                <rp>(</rp>
                <rt contenteditable="true" spellcheck="false"></rt>
                <rp>)</rp>
            </ruby>
        </div>
        <div data-setting="id" data-id="">
            <span>
                <span>武将标识符(id)</span>
            </span>
            <ruby>
                <div contenteditable="true" spellcheck="false"></div>
            </ruby>
        </div>
        <div data-setting="sex" data-sex="">
            <span>
                <span>性别</span>
                <span class="expandable-expanded" data-for="sex"></span>
            </span>
            <ul data-by="sex">
                <li data-sex-option="male"></li>
                <li data-sex-option="female"></li>
                <li data-sex-option="double"></li>
                <li data-sex-option="none"></li>
                <li data-sex-option="male-castrated"></li>
            </ul>
        </div>
        <div data-setting="group" data-group="">
            <span>
                <span>势力</span>
                <span class="expandable-expanded" data-for="group"></span>
            </span>
            <ul data-by="group">
                <ul>
                    <li data-group-option="wei"></li>
                    <li data-group-option="shu"></li>
                    <li data-group-option="wu"></li>
                    <li data-group-option="qun"></li>
                    <li data-group-option="jin"></li>
                    <li data-group-option="shen"></li>
                </ul>
                <span>
                    <span class="expandable-collapsed" data-for="more-group">更多势力</span>
                </span>
                <ul class="hidden" data-by="more-group">
                    <li data-group-option="western"></li>
                    <li data-group-option="key"></li>
                    <li></li>
                </ul>
            </ul>
        </div>
        <div data-setting="hp maxHp hujia" data-hp="4" data-max-hp="4" data-hujia="0">
            <span>
                <span>体力&护甲</span>
                <span class="expandable-expanded" data-for="hp"></span>
            </span>
            <div data-by="hp">
                <div class="hp-operation">
                    <div>
                        <span>体力</span>
                        <span contenteditable="true">4</span>
                        <span>/</span>
                        <span contenteditable="true">4</span>
                    </div>
                    <div class="hp-more-show hidden">
                        <div>
                            <span>体力值</span>
                            <span>体力上限</span>
                        </div>
                    </div>
                    <div class="hp-show">
                        <div class="hpContainer healthy">
                            <div class="hp lost"></div>
                            <div class="hp lost"></div>
                            <div class="hp lost"></div>
                            <div class="hp lost"></div>
                        </div>
                    </div>
                    <div class="hp-adjust">
                        <div>
                            <div class="hp-plus">+</div>
                            <hr>
                            <div class="hp-minus">-</div>
                        </div>
                        <span contenteditable="true">1</span>
                    </div>
                </div>
                <div class="hujia-operation">
                    <div>
                        <span>护甲</span>
                        <span contenteditable="true">0</span>
                    </div>
                    <div class="hujiaContainer">
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia reset"></div>
                    </div>
                </div>
            </div>
        </div>
        <div data-setting="skills" data-skill="">
            <span>
                <span>技能</span>
            </span>
        </div>
        <div data-setting="isZhugong" data-zhu="false"></div>
        <div data-setting="dieAudios" data-intro=""></div>
        <div>
            <div data-setting="intro" data-intro=""></div>
        </div>
    </div>
</div>
<footer></footer>`
//#: shadow , html/character-card.html//
        const stylesheet = document.createElement("link");
        stylesheet.rel = ""
        this.init();
    }
    init() {
        this.listenAvatar();
        this.listenName();
        this.listenId();
        this.listenSex();
        this.listenGroup();
        this.listenHp();
        //
        this.listenExpanable();
    }
    listenAvatar() {
        /**
         * @type {HTMLDivElement}
         */
        const avatar = this.getDataAreaDom("avatar").querySelector('div');
        /**
         * @type {HTMLInputElement}
         */
        const input = this.getDataAreaDom("avatar").querySelector('input');
        const loadFile = async (file) => {
            const imgData = await NonameEditorData.readFile(file, "url");
            avatar.style.backgroundImage = `url(${imgData})`;
            this.changeData("avatar", imgData);
        }
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => avatar.addEventListener(event, e => (e.preventDefault(), e.stopPropagation()), false));
        avatar.addEventListener("pointerdown", () => input.click());
        avatar.addEventListener("drop", e => {
            if (e?.dataTransfer?.files?.[0]) {
                loadFile(e.dataTransfer.files[0]);
            }
        });
        input.addEventListener("change", () => {
            if (input.files[0] instanceof File) loadFile(input.files[0]);
        })
    }
    listenName() {
        const name = this.getDataAreaDom("name").querySelector('div');
        const pinyin = this.getDataAreaDom("pinyin").querySelector('rt');
        preventEnter(name, pinyin);
        name.addEventListener("keyup", () => {
            const pinyinText = NonameEditorData.getPinyin(name.innerText)
            pinyin.innerHTML = pinyinText;
            this.changeData("name", pinyinText);
        });
    }
    listenId() {
        const id = this.getDataAreaDom("id").querySelector("div");
        const title = this.getDataAreaDom("id").querySelector("span>span");
        preventEnter(id);
        id.addEventListener("keyup", () => {
            if (this.changeData("id", id.innerText)) {
                if (title.classList.contains("wrong")) title.classList.remove("wrong");
            } else {
                if (!title.classList.contains("wrong")) title.classList.add("wrong");
            }
        })
    }
    listenSex() {
        /**
         * @type {NodeListOf<HTMLElement>}
         */
        const sexOptions = this.getDataAreaDom("sex").querySelectorAll("[data-sex-option]");
        new UniqueChoiceManager(...sexOptions)
            .listenSiblings("pointerdown")
            .setCallback((pre, now) => {
                pre?.classList?.remove?.("chosen");
                now?.classList?.add("chosen");
                this.changeData("sex", now.dataset.sexOption);
            })
            .choose(sexOptions[0]);
    }
    listenGroup() {
        /**
         * @type {NodeListOf<HTMLElement>}
         */
        const groupOptions = this.getDataAreaDom("group").querySelectorAll("[data-group-option]");
        new UniqueChoiceManager(...groupOptions)
            .listenAllNodes("pointerdown")
            .setCallback((pre, now, funcMap) => {
                funcMap.forClass("chosen")
                this.changeData("group", now.dataset.groupOption);
            })
            .choose(groupOptions[0]);
    }
    listenHp() {
        const hpContainer = this.getDataAreaDom("hp").querySelector(".hpContainer");
        const moreShowContainer = this.getDataAreaDom("hp").querySelector(".hp-more-show");
        const [hpInput, maxHpInput] = this.getDataAreaDom("hp").querySelectorAll(".hp-operation [contenteditable]");
        const [hpPlus, hpMinus] = this.getDataAreaDom("hp").querySelectorAll(".hp-adjust>div>div");
        const hpManager = new UniqueChoiceManager(...this.getDataAreaDom("hp").querySelectorAll(".hp"));
        const hpInputManager = new EditableElementManager(hpInput);
        const maxHpInputManager = new EditableElementManager(maxHpInput);
        const prependHp = (num = 1, onlyMaxHp = false) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp");
            maxHpInputManager.changeValue(nowMaxHp + num);
            this.changeData("maxHp", nowMaxHp + num);
            if (nowMaxHp + num <= 6) {
                for (let i = 0; i < num; i++) {
                    const hp = document.createElement("div");
                    hp.className = "hp lost";
                    hpContainer.prepend(hp);
                    hpManager.append(hp);
                }
                if (onlyMaxHp === false) {
                    hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-last-child(${nowHp + num})`));
                }
            } else {
                if (moreShowContainer.classList.contains("hidden")) {
                    moreShowContainer.classList.remove("hidden");
                }
                if (onlyMaxHp === false) {
                    hpInputManager.changeValue(nowHp + num);
                    this.changeData("hp", nowHp + num);
                }
            }
        }
        const removeHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp");
            num = Math.min(num, nowMaxHp - 1);
            this.changeData("maxHp", nowMaxHp - num);
            maxHpInputManager.changeValue(nowMaxHp - num);
            if (nowMaxHp - num <= 6) {
                if (!moreShowContainer.classList.contains("hidden")) {
                    moreShowContainer.classList.add("hidden");
                }
                const toRemoves = Array.from(this.getDataAreaDom("hp").querySelectorAll(`.hp`)).slice(0, nowMaxHp <= 6 ? num : num - nowMaxHp + 6);
                toRemoves.forEach(remove => {
                    remove.remove();
                })
                hpManager.remove(...toRemoves);
                if (nowMaxHp - num < nowHp) {
                    hpManager.choose(this.getDataAreaDom("hp").querySelector(".hp"));
                }
            } else if (nowMaxHp - num < nowHp) {
                hpInputManager.changeValue(nowHp - num);
                this.changeData("hp", nowHp - num);
            }
        }
        maxHpInputManager.inputNumber({
            min: 1, max: Infinity, value: 4, supportInfinity: true, isInteger: true,
            commonCallback: (e, val, last) => {
                const d = val - last;
                if (d < 0) removeHp(Math.abs(d));
                else if (d > 0) prependHp(d, true);
            }
        });
        hpInputManager.inputNumber({
            min: 1, max: Infinity, value: 4, supportInfinity: true, isInteger: true,
            commonCallback: (e, i) => {
                const d = i - this.getData("maxHp");
                if (d > 0) {
                    prependHp(d);
                } else {
                    hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-last-child(${i})`));
                }
            }
        });
        hpManager.listenSiblings("pointerdown").setCallback((pre, now, funcMap) => {
            funcMap.forClass("chosen");
            const hps = Array.from(this.getDataAreaDom("hp").querySelectorAll(".hp"));
            const i = hps.indexOf(now);
            const hpValue = hps.length - i;
            this.changeData("hp", hpValue);
            hpInputManager.changeValue(hpValue);
        }).chooseFirst()
        hpPlus.addEventListener("pointerdown", () => prependHp());
        hpMinus.addEventListener("pointerdown", () => removeHp());
        //
        const hujias = Array.from(this.getDataAreaDom("hujia").querySelectorAll(".hujia"));
        const hujiaManager = new UniqueChoiceManager(...hujias);
        const hujiaInputManager = new EditableElementManager(this.getDataAreaDom("hujia").querySelector(".hujia-operation [contenteditable]"))
            .inputNumber({
                min: 0, max: 5, value: 0, isInteger: true,
                commonCallback: (e, i) => {
                    hujiaManager.choose(hujias[5 - i]);
                }
            })
        hujiaManager.listenSiblings("pointerdown")
            .setCallback((last, now, funcMap) => {
                funcMap.forClass("chosen");
                const i = hujias.indexOf(now);
                const hujiaValue = 5 - i;
                this.changeData("hujia", hujiaValue);
                hujiaInputManager.changeValue(hujiaValue);
            })
        new MutationObserver(() => {
            console.log()
            toggleMultiClass(hpContainer, "healthy", "damaged", "dangerous")
                .single(NonameEditorData.getHpStatus(this.getData("hp"), this.getData("maxHp")))
        }).observe(hpContainer, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }
    listenExpanable() {
        this.shadowRoot.querySelectorAll("[class^=expandable]").forEach(node => {
            const linkedNodes = this.shadowRoot.querySelectorAll(`[data-by=${node.dataset.for}]`)
            node.addEventListener("pointerdown", () => {
                if (node.classList.contains("expandable-expanded")) {
                    node.classList.remove("expandable-expanded");
                    node.classList.add("expandable-collapsed");
                    linkedNodes.forEach(linkedNode => {
                        if (!linkedNode.classList.contains("hidden")) linkedNode.classList.add("hidden");
                    })
                } else if (node.classList.contains("expandable-collapsed")) {
                    node.classList.remove("expandable-collapsed");
                    node.classList.add("expandable-expanded");
                    linkedNodes.forEach(linkedNode => {
                        if (linkedNode.classList.contains("hidden")) linkedNode.classList.remove("hidden");
                    })
                }
            })
        })
    }
    /**
     * @typedef {"avatar"|"hp"|"maxHp"|"hujia"|"pinyin"|"name"|"sex"|"group"|"id"} dataType
     */
    /**
     * @param {dataType} type 
     * @returns {HTMLElement}
     */
    getDataAreaDom(type) {
        return this.shadowRoot.querySelector(`[data-${NonameEditorData.camelKebabSwitch(type, "kebab")}]`)
    }
    /**
     * @param {dataType} type 
     * @param {any} val 
     */
    changeData(type, val) {
        switch (type) {
            case "id": {
                this.getDataAreaDom(type).dataset[type] = val;
                return NonameEditorData.checkId("character", val);
            }
            case "hp": case "maxHp": case "hujia": {
                if (typeof val !== "number") return false;
                this.getDataAreaDom(type).dataset[type] = val;
                return true;
            }
            default: {
                this.getDataAreaDom(type).dataset[type] = val;
                return true;
            }
        }
    }
    /**
     * @param {dataType} type 
     * @param {any} val 
     */
    getData(type) {
        const CamelizedType = NonameEditorData.camelKebabSwitch(type, "camel")
        let result = this.getDataAreaDom(type).dataset[CamelizedType];
        switch (CamelizedType) {
            case "hp": case "maxHp": case "hujia": return Number(result);
            default: return result;
        }
    }
    setData(data) {
        if (typeof data !== "object") return;
        const { } = data;
    }
}
customElements.define("xy-character-card", HTMLCharacterCardElement);