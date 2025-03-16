import url from "./url.mjs";
import { NonameEditorData } from "./data.mjs";
import { EditableElementManager, preventEnter, toggleMultiClass, UniqueChoiceManager } from "./encapsulated.mjs";
class HTMLCharacterCardElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        //$: shadow , html/character-card.html//
shadow.innerHTML=`
<link rel="stylesheet" href="./${url}/style/character-card.css">
<div>
    <div data-setting="avatar" data-avatar="" data-required="true">
        <input type="file" accept="image/*"></input>
        <div>请选择或拖入文件</div>
    </div>
    <div>
        <div data-setting="name pinyin" data-name="" data-pinyin="" data-required="true">
            <span>
                <span>姓名</span>
                <span class="expandable-expanded" data-for="name"></span>
                <span></span>
            </span>
            <ruby data-by="name">
                <div contenteditable="true" spellcheck="false"></div>
                <rp>(</rp>
                <rt contenteditable="true" spellcheck="false"></rt>
                <rp>)</rp>
            </ruby>
        </div>
        <div data-setting="id" data-id="">
            <span>
                <span>武将标识符(id)</span>
                <span class="expandable-expanded" data-for="id"></span>
                <span></span>
            </span>
            <ruby data-by="id">
                <div contenteditable="true" spellcheck="false"></div>
            </ruby>
        </div>
        <div data-setting="sex" data-sex="">
            <span>
                <span>性别</span>
                <span class="expandable-expanded" data-for="sex"></span>
                <span></span>
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
                <span></span>
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
                <span></span>
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
                            <span data-hp-adjust-mode="hp">体力值</span>
                            <span data-hp-adjust-mode="maxHp">体力上限</span>
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
                <span class="expandable-expanded" data-for="skills"></span>
                <span></span>
            </span>
            <div data-by="skills">
                <ul></ul>
                <div>
                    <div class="xy-ED-input-container">
                        <input spellcheck="false" placeholder="点击搜索资源">
                        <span class="xy-ED-input-clear"></span>
                        <span class="xy-ED-input-search"></span>
                    </div>
                </div>
            </div>
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
            this.changeData("name", name.innerText);
            const pinyinText = NonameEditorData.getPinyin(name.innerText);
            pinyin.innerHTML = pinyinText;
            this.changeData("pinyin", pinyinText);
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
        let hpAdjustMode, hpAdjustUnitOffset = 1;
        const hpDataArea = this.getDataAreaDom("hp");
        const hpContainer = hpDataArea.querySelector(".hpContainer");
        const moreShowContainer = hpDataArea.querySelector(".hp-more-show");
        const unitOffsetInput = hpDataArea.querySelector(".hp-adjust [contenteditable]")
        const [hpInput, maxHpInput] = hpDataArea.querySelectorAll(".hp-operation [contenteditable]");
        const [hpPlus, hpMinus] = hpDataArea.querySelectorAll(".hp-adjust>div>div");
        const hpManager = new UniqueChoiceManager(...hpDataArea.querySelectorAll(".hp"));
        const adjustOptionManager = new UniqueChoiceManager(...hpDataArea.querySelectorAll(".hp-more-show span"));
        const unitOffsetInputManager = new EditableElementManager(unitOffsetInput)
        const hpInputManager = new EditableElementManager(hpInput);
        const maxHpInputManager = new EditableElementManager(maxHpInput);
        const adjustHpDivsTo = (num) => {
            if (num < 1 || num > 6) return;
            const hps = Array.from(hpDataArea.querySelectorAll(`.hp`));
            const d = num - hps.length;
            if (d > 0) {
                for (let i = 0; i < d; i++) {
                    const hp = document.createElement("div");
                    hp.className = "hp lost";
                    hpContainer.prepend(hp);
                    hpManager.append(hp);
                }
            } else if (d < 0) {
                hps.slice(0, Math.abs(d)).forEach(node => {
                    node.remove();
                    hpManager.remove(node);
                })
            }
        }
        const prependMaxHp = (num = 1, onlyMaxHp = false) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp");
            const changedMaxHp = nowMaxHp + num
            maxHpInputManager.changeValue(changedMaxHp);
            this.changeData("maxHp", changedMaxHp);
            if (changedMaxHp <= 6) {
                adjustHpDivsTo(changedMaxHp);
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
        const removeMaxHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp"); num = Math.min(num, nowMaxHp - 1);
            const changedMaxHp = num === Infinity ? 1 : nowMaxHp - num;
            this.changeData("maxHp", changedMaxHp);
            maxHpInputManager.changeValue(changedMaxHp);
            if (changedMaxHp <= 6) {
                adjustHpDivsTo(changedMaxHp);
                if (!moreShowContainer.classList.contains("hidden")) moreShowContainer.classList.add("hidden");
                if (changedMaxHp < nowHp) {
                    hpManager.choose(hpDataArea.querySelector(".hp"));
                } else {
                    hpManager.choose(hpDataArea.querySelector(`.hp:nth-last-child(${nowHp})`));
                }
            } else if (changedMaxHp < nowHp) {
                hpInputManager.changeValue(nowHp - num);
                this.changeData("hp", nowHp - num);
            }
        }
        const addHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp");
            const d = nowHp + num - nowMaxHp;
            hpInputManager.changeValue(nowHp + num);
            this.changeData("hp", nowHp + num);
            if (d > 0) {
                prependMaxHp(d, true);
            }
            if (d < 0 && nowMaxHp <= 6 || d > 0 && nowMaxHp + d <= 6) {
                hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-last-child(${nowHp + num})`));
            }
        }
        const removeHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp"); num = Math.min(num, nowHp - 1);
            const changedHp = num === Infinity ? 1 : nowHp - num;
            hpInputManager.changeValue(changedHp);
            this.changeData("hp", changedHp);
            if (nowMaxHp < 6) hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-child(${changedHp})`));
        }
        maxHpInputManager.inputNumber({
            min: 1, max: Infinity, value: 4, supportInfinity: true, isInteger: true,
            commonCallback: (e, val, last) => {
                const d = val - last;
                if (d < 0) removeMaxHp(Math.abs(d));
                else if (d > 0) prependMaxHp(d, true);
            }
        });
        hpInputManager.inputNumber({
            min: 1, max: Infinity, value: 4, supportInfinity: true, isInteger: true,
            commonCallback: (e, val, last) => {
                const d = val - last;
                if (d > 0) addHp(d)
                else if (d < 0) removeHp(Math.abs(d))
            }
        });
        unitOffsetInputManager.inputNumber({
            min: 1, max: Infinity, value: 1, supportInfinity: true, isInteger: true,
            commonCallback: (e, i) => {
                hpAdjustUnitOffset = i;
            }
        })
        hpManager.listenSiblings("pointerdown").setCallback((pre, now, funcMap) => {
            funcMap.forClass("chosen");
            const hps = Array.from(this.getDataAreaDom("hp").querySelectorAll(".hp"));
            const i = hps.indexOf(now);
            const hpValue = hps.length - i;
            this.changeData("hp", hpValue);
            hpInputManager.changeValue(hpValue);
        }).chooseFirst()
        adjustOptionManager.listenSiblings("pointerdown").setCallback((pre, now, funcMap) => {
            funcMap.forClass("chosen");
            hpAdjustMode = now.dataset.hpAdjustMode;
        }).chooseFirst()
        hpPlus.addEventListener("pointerdown", () => {
            const maxHp = this.getData("maxHp"), hp = this.getData("hp");
            if (maxHp > 6) {
                if (hpAdjustMode === "maxHp") prependMaxHp(hpAdjustUnitOffset, true);
                else addHp(hpAdjustUnitOffset);
            } else if (hp === maxHp) {
                prependMaxHp(1, false);
            } else {
                prependMaxHp(1, true);
            }
        });
        hpMinus.addEventListener("pointerdown", () => {
            if (this.getData("maxHp") > 6) {
                if (hpAdjustMode === "maxHp") removeMaxHp(hpAdjustUnitOffset);
                else removeHp(hpAdjustUnitOffset);
            } else removeMaxHp();
        });
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
                if (document.contains(this)) this.style.setProperty("--data-id", `'${val}'`);
                return NonameEditorData.checkId("character", val);
            }
            case "pinyin": {
                this.getDataAreaDom(type).dataset[type] = val;
                if (document.contains(this)) {
                    this.style.setProperty("--data-pinyin", val == "" ? "" : `'(${val})'`);
                }
                return true;
            }
            case "group": {
                this.getDataAreaDom(type).dataset[type] = val;
                if (document.contains(this)) {
                    this.style.setProperty("--data-group", `'${NonameEditorData.getTranslation("character", type, val)}'`);
                    this.style.setProperty("--data-group-textShadow", NonameEditorData.getTranslation("character", "textShadow", val))
                }
                return true;
            }
            case "sex": {
                this.getDataAreaDom(type).dataset[type] = val;
                if (document.contains(this)) this.style.setProperty("--data-" + type, `'${NonameEditorData.getTranslation("character", type, val)}'`);
                return true;
            }
            case "hp": case "maxHp": case "hujia": {
                if (typeof val !== "number") return false;
                this.getDataAreaDom(type).dataset[type] = val;
                if (document.contains(this)) this.style.setProperty("--data-" + type, val == Infinity ? "'∞'" : `'${val}'`);
                return true;
            }
            default: {
                this.getDataAreaDom(type).dataset[type] = val;
                if (document.contains(this)) this.style.setProperty("--data-" + type, `'${val}'`);
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