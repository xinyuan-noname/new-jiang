import url from "./url.mjs";
import { NonameData } from "./data.mjs";
import { EditableElementManager, preventEnter, toggleMultiClass, UniqueChoiceManager } from "./encapsulated.mjs";
class HTMLNonameFocusUIElement extends HTMLElement {
    #server;
    #uniqueChoiceManagerMap = new Map();
    #editableElementManagerMap = new Map();
    constructor() {
        super();
        this.#server = new NonameData();
    }
    fileQuery(mode, query) {
        switch (mode) {
            case "read": {
                const { format, encoding, file } = query;
                return this.#server.readFile(file, format, encoding);
            }
        }
    }
    /**
     * @param {'pinyin'| 'characterTranslation'|'formatTransfer'} mode 
     * @param {{
     *      withTone: boolean
     *      text: string
     *      attr: "sex"|"group"
     * }} query
     * @returns {any}
     */
    textQuery(mode, query) {
        switch (mode) {
            case "pinyin": {
                const { text, withTone } = query;
                return this.#server.getPinyin(text, withTone);
            }
            case "characterTranslation": {
                const { text, attr } = query;
                return this.#server.getTranslation("character", attr, text);
            }
            case "formatTransfer": {
                const { text, to } = query;
                if (to === "kebab") return this.#server.camelKebabSwitch(text, "kebab");
                if (to === "camel") return this.#server.camelKebabSwitch(text, "camel");
                return text;
            }
        }
    }
    playerQuery(mode, query) {
        if (mode === "hpStatus") {
            const { hp, maxHp } = query;
            return this.#server.getHpStatus(hp, maxHp)
        }
    }
    /**
     * @param {"characterId"} mode 
     * @param {id} query 
     * @returns 
     */
    checkQuery(mode, query) {
        switch (mode) {
            case "characterId": {
                const { id } = query
                return this.#server.checkId(id, "character");
            }
        }
    }
    /**
     * 
     * @param {"textShadow"} mode 
     * @param {{
     *      nature:string
     * }} query 
     * @returns 
     */
    styleQuery(mode, query) {
        switch (mode) {
            case "textShadow": {
                const { nature } = query;
                return this.#server.getTextShadowStyle(nature);
            }
        }
    }
    multiMediaQuery(mode, query) {
        switch (mode) {
            case "audio": {
                const { src, volume } = query;
                this.#server.requestMultiMedia(src, "audio", { volume });
            }
        }
    }
    createUniqueChoiceManager(label, ...nodes) {
        const manager = new UniqueChoiceManager(...nodes);
        this.#uniqueChoiceManagerMap.set(label, manager);
        return manager;
    }
    /**
     * @param {string} label 
     * @returns {UniqueChoiceManager}
     */
    getUniqueChoiceManager(label) {
        return this.#uniqueChoiceManagerMap.get(label);
    }
    createEditableElementManager(label, ...nodes) {
        const manager = new EditableElementManager(...nodes);
        if (label != null) this.#editableElementManagerMap.set(label, manager);
        return manager;
    }
    /**
     * @param {string} label 
     * @returns {EditableElementManager}
     */
    getEditableElementManager(label) {
        return this.#editableElementManagerMap.get(label);
    }
    markTextNode(selector, keyWords, config) {
        const nodes = (config.root === "shadowRoot" ? this.shadowRoot : this).querySelectorAll(selector);
        const patternMainbody = keyWords.map(word => word.replace(/[.^$*+?{}\[\]\\|()]/g, "\\$&")).join("|")
        const pattern = new RegExp(`${patternMainbody}`, "ig");
        const replaceMap = new Map();
        for (const node of nodes) {
            const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            while (treeWalker.nextNode()) {
                pattern.lastIndex = 0;
                const currentNode = treeWalker.currentNode;
                const text = currentNode.nodeValue;
                const fragment = document.createDocumentFragment();
                let match, index = 0, flag;
                while (match = pattern.exec(text)) {
                    if (!flag) { flag = true; replaceMap.set(currentNode, fragment); }
                    fragment.append(text.slice(index, match.index));
                    const mark = document.createElement("mark")
                    mark.textContent = text.slice(match.index, index = pattern.lastIndex)
                    fragment.append(mark);
                }
                if (flag && index !== text.length) {
                    fragment.append(text.slice(index));
                }
            }
        }
        replaceMap.forEach((fragment, initilaNode) => {
            initilaNode.replaceWith(fragment);
        })
    }
    triggerEvent(name, load, config = {}) {
        const defaultConfig = {
            detail: {
                from: this,
                ...load
            },
            bubbles: true,
            composed: true
        };
        const eventConfig = { ...defaultConfig, ...config };
        const customEvent = new CustomEvent(name, eventConfig);
        this.dispatchEvent(customEvent);
    }
    sendEvent(name, target, load, config = {}) {
        const defaultConfig = {
            detail: {
                from: this,
                ...load
            },
            bubbles: true,
            composed: true
        };
        const eventConfig = { ...defaultConfig, ...config };
        const customEvent = new CustomEvent(name, eventConfig);
        target.dispatchEvent(customEvent);
    }
}
class HTMLNonameCharacterEditorElement extends HTMLNonameFocusUIElement {
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
                <button>使用拼音</button>
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
        <div data-setting="skills" data-skills="" id="noname-skill-editor-skills-setting">
            <span>
                <span>技能</span>
                <span class="expandable-expanded" data-for="skills"></span>
                <span></span>
            </span>
            <div data-by="skills">
                <ruby>
                    <div contenteditable="true" spellcheck="false"></div>
                    <span></span>
                </ruby>
                <p>搜索技能，将侧边栏技能拖入该区域，或选择技能卡片中的⬅️以添加技能</p>
                <ul></ul>
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
    }
    connectedCallback() {
        this.listenAvatar();
        this.listenName();
        this.listenId();
        this.listenSex();
        this.listenGroup();
        this.listenHp();
        this.listenSkills();
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
            const imgData = await this.fileQuery("read", { file, format: "url" });
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
        const nameDataArea = this.getDataAreaDom("name")
        const nameInput = nameDataArea.querySelector('div');
        const pinyinInput = nameDataArea.querySelector('rt');
        preventEnter(nameInput, pinyinInput);
        new MutationObserver(() => {
            this.changeData("name", nameInput.innerText);
            pinyinInput.innerText = this.textQuery("pinyin", { text: nameInput.innerText, withTone: true });
        }).observe(nameInput, { characterData: true, subtree: true, childList: true });
        new MutationObserver(() => {
            this.changeData("pinyin", pinyinInput.innerText);
        }).observe(pinyinInput, { characterData: true, subtree: true, childList: true });
    }
    listenId() {
        const idDataArea = this.getDataAreaDom("id");
        const idInput = idDataArea.querySelector("div");
        const button = idDataArea.querySelector("button");
        const title = idDataArea.querySelector("span>span");
        preventEnter(idInput);
        button.addEventListener("pointerdown", () => {
            const pinyin = this.textQuery("pinyin", { text: this.getData("name"), withTone: false }).join("");
            idInput.innerText = pinyin;
        });
        new MutationObserver(() => {
            this.changeData("id", idInput.innerText)
            if (this.checkQuery("characterId", { id: idInput.innerText })) {
                if (title.classList.contains("wrong")) title.classList.remove("wrong");
            } else {
                if (!title.classList.contains("wrong")) title.classList.add("wrong");
            }
        }).observe(idInput, { characterData: true, subtree: true, childList: true });
    }
    listenSex() {
        const sexOptions = this.getDataAreaDom("sex").querySelectorAll("[data-sex-option]");
        this.createUniqueChoiceManager("sex", ...sexOptions)
            .listenSiblings("pointerdown")
            .setCallback((pre, now, funcMap) => {
                funcMap.forClass("chosen");
                this.changeData("sex", now.dataset.sexOption);
            })
            .choose(sexOptions[0]);
    }
    listenGroup() {
        const groupOptions = this.getDataAreaDom("group").querySelectorAll("[data-group-option]");
        this.createUniqueChoiceManager("group", ...groupOptions)
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
        const hpManager = this.createUniqueChoiceManager("hp", ...hpDataArea.querySelectorAll(".hp"));
        const adjustOptionManager = this.createUniqueChoiceManager(null, ...hpDataArea.querySelectorAll(".hp-more-show span"));
        const unitOffsetInputManager = this.createEditableElementManager(null, unitOffsetInput)
        const hpInputManager = this.createEditableElementManager("hp", hpInput);
        const maxHpInputManager = this.createEditableElementManager("maxHp", maxHpInput);
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
        const hujiaManager = this.createUniqueChoiceManager("hujia", ...hujias);
        const hujiaInputManager = this.createEditableElementManager("hujia", this.getDataAreaDom("hujia").querySelector(".hujia-operation [contenteditable]"))
        hujiaInputManager.inputNumber({
            min: 0, max: 5, value: 0, isInteger: true,
            commonCallback: (e, i) => {
                hujiaManager.choose(hujias[5 - i])
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
                .single(this.playerQuery("hpStatus", { hp: this.getData("hp"), maxHp: this.getData("maxHp") }));
        }).observe(hpContainer, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }
    listenSkills() {
        const skillsDataArea = this.getDataAreaDom("skills");
        const searchInput = skillsDataArea.querySelector("ruby>[contenteditable]");
        const search = skillsDataArea.querySelector("ruby>span");
        const ul = skillsDataArea.querySelector("ul")
        search.addEventListener("pointerdown", () => {
            this.triggerEvent("searchSkill", { from: skillsDataArea, toggleNav: true, keyWords: searchInput.textContent.split(/[ \+]/g) });
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
     * @typedef {"avatar"|"hp"|"maxHp"|"hujia"|"pinyin"|"name"|"sex"|"group"|"id"|"skills"} dataType
     */
    /**
     * @param {dataType} type 
     * @returns {HTMLElement}
     */
    getDataAreaDom(type) {
        return this.shadowRoot.querySelector(`[data-${this.textQuery("formatTransfer", { to: "kebab", text: type })}]`)
    }
    /**
     * @param {dataType} type 
     * @param {any} val 
     */
    changeData(type, val) {
        switch (type) {
            case "id": {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-id", `'${val}'`);
            }; break;
            case "pinyin": {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-pinyin", val == "" ? "" : `'(${val})'`);
            }; break;
            case "group": {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-group", `'${this.textQuery("characterTranslation", { attr: type, text: val })}'`);
                this.style.setProperty("--data-group-textShadow", this.styleQuery("textShadow", { nature: val }));
            }; break;
            case "sex": {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-" + type, `'${this.textQuery("characterTranslation", { attr: type, text: val })}'`);
            }; break;
            case "hp": case "maxHp": case "hujia": {
                if (typeof val !== "number") return false;
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-" + type, val == Infinity ? "'∞'" : `'${val}'`);
            }; break;
            default: {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-" + type, `'${val}'`);
            }; break;
        }
    }
    /**
     * @param {dataType} type 
     * @param {any} val 
     */
    getData(type) {
        const camelizedType = this.textQuery("formatTransfer", { to: "camel", text: type });
        let result = this.getDataAreaDom(type).dataset[camelizedType];
        switch (camelizedType) {
            case "hp": case "maxHp": case "hujia": return Number(result);
            case "skills": return result.split(",");
            default: return result;
        }
    }
}
const nonameCardFragment = (() => {
    const fragment = document.createDocumentFragment();
    const style = document.createElement("style");
    style.textContent = `:host {
        width: 100%;
        color: wheat;
        display: flex;
        flex-direction: column;
        background-color: #000;
    }

    :host>*{
        width: 100%;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .main-content[draggable] {
        cursor: grab;
    }

    [data-audio-list-item] {
        color: gold;
        margin: 1px 0;
        filter: contrast(1.2);
    }

    .interact-bar {
        display: flex;
        justify-content: flex-end;
        background-color: #1e1e1e;
    }

    .interact-bar>* {
        font-size: 20px;
        cursor: pointer;
    }

    .interact-bar>.use {
        cursor: not-allowed;
    }

    .interact-bar>.use.allowed{
        cursor: pointer;
    }

    .interact-bar>.use,
    .interact-bar>.like {
        filter: grayscale(80%);
    }

    .interact-bar>.like.liked {
        filter: grayscale(0%);
    }

    [data-audio-src]::after{
        content: "🔈";
    }`
    const showInfo = document.createElement("div");
    showInfo.className = "show-info";
    const interactBar = document.createElement("div");
    interactBar.className = "interact-bar"
    fragment.append(style, showInfo, interactBar);
    return fragment;
})();
class HTMLNonameCardElement extends HTMLNonameFocusUIElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(nonameCardFragment.cloneNode(true));
    }
    static observedAttributes = ["likable", "removable", "usable", "usefor"];
    connectedCallback() {
        this.shadowRoot.addEventListener("pointerdown", (e) => {
            const node = e.target;
            if (!node.dataset.audioSrc) return;
            this.multiMediaQuery("audio", { src: node.dataset.audioSrc, volume: 1 })
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        const interactBar = this.shadowRoot.querySelector(".interact-bar");
        switch (name) {
            case "usable": {
                if (newValue === "true") {
                    const useSpan = document.createElement("span");
                    useSpan.className = "use";
                    useSpan.textContent = "⬅️";
                    useSpan.addEventListener("pointerdown", () => {
                        this.triggerEvent("useCardData");
                    });
                    interactBar.prepend(useSpan);
                } else {
                    interactBar.querySelector(":scope>.use")?.remove?.();
                }
            }; break;
            case "likable": {
                if (newValue === "true") {
                    const likeSpan = document.createElement("span");
                    likeSpan.className = "like";
                    likeSpan.textContent = "❤️"
                    likeSpan.addEventListener("pointerdown", () => {
                        if (!likeSpan.classList.contains("liked")) {
                            likeSpan.classList.add("liked");
                            this.triggerEvent("like");
                        } else if (likeSpan.classList.contains("like")) {
                            likeSpan.classList.remove("liked")
                            this.triggerEvent("likeCancel");
                        }
                    })
                    interactBar.insertBefore(likeSpan, interactBar.children[2]);
                } else {
                    interactBar.querySelector(":scope>.like")?.remove?.();
                }
            }; break;
            case "removable": {
                if (newValue === "true") {
                    const removeSpan = document.createElement("span");
                    removeSpan.className = "remove";
                    removeSpan.textContent = "🗑️"
                    removeSpan.addEventListener("pointerdown", () => {
                        this.triggerEvent("remove");
                        this.remove();
                    })
                    interactBar.insertBefore(removeSpan, interactBar.children[1]);
                } else {
                    interactBar.querySelector(":scope>.remove")?.remove?.();
                }
            }; break;
            case "usefor": {
                const mainContentDiv = this.shadowRoot.querySelector(".main-content");
                const use = interactBar.querySelector(":scope>.use");
                if (this.useForNode && this.useForNode.id == newValue || (this.useForNode = document.getElementById(newValue))) {
                    mainContentDiv.setAttribute("draggable", "true");
                    use?.classList?.add?.("allowed");
                    use.onpointerdown = (e) => {
                        this.sendEvent("requestUseSkill", this.useForNode);
                    };
                } else {
                    mainContentDiv.removeAttribute("draggable");
                    use?.classList?.remove?.("allowed");
                    use.onpointerdown = null;
                    this.useForNode = null;
                }
            }
        }
    }
    /**
     * @param {"like"|"use"|"remove"} type 
     */
    triggerInteractEvent(type) {
        const event = new Event("pointerdown")
        switch (type) {
            case "like": {
                this.shadowRoot.querySelector(".interact-bar>.like")?.dispatchEvent?.(event);
            }; break;
            case "use": {
                this.shadowRoot.querySelector(".interact-bar>.use")?.dispatchEvent?.(event);
            }; break;
            case "remove": {
                this.shadowRoot.querySelector(".interact-bar>.remove")?.dispatchEvent?.(event);
            }; break;
        }
    }
}
class HTMLNonameSkillCardElement extends HTMLNonameCardElement {
    static observedAttributes = super.observedAttributes.concat("skill-info")
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "skill-info") {
            const showInfo = this.shadowRoot.querySelector(".show-info");
            showInfo.replaceChildren();
            const skillInfo = JSON.parse(this.getAttribute("skill-info"));
            const fragment = document.createDocumentFragment();
            if (skillInfo) {
                const mainContentDiv = document.createElement('div');
                mainContentDiv.className = 'main-content';
                mainContentDiv.innerHTML =
                    `${skillInfo.name}(${skillInfo.id})</br>
                    ${skillInfo.description}`
                fragment.appendChild(mainContentDiv);
                if (skillInfo.audios?.length) {
                    const audioUl = document.createElement('ul');
                    skillInfo.audios.forEach(audio => {
                        const li = document.createElement('li');
                        li.dataset.audioListItem = true;
                        const span = document.createElement('span');
                        span.dataset.audioSrc = audio.file
                        li.append(audio.text, span);
                        audioUl.appendChild(li);
                    });
                    mainContentDiv.appendChild(audioUl);
                }
                showInfo.replaceChildren(fragment);
            }
        }
        else super.attributeChangedCallback(name, oldValue, newValue);
    }
}
class HTMLNonameCharacterCardElement extends HTMLNonameCardElement {
    static observedAttributes = super.observedAttributes.concat("character-info", "skill-likable", "skill-usable")
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "character-info") {
            const showInfo = this.shadowRoot.querySelector(".show-info");
            showInfo.replaceChildren();
            const characterInfo = JSON.parse(this.getAttribute("character-info"));
            if (characterInfo) {
                const fragment = document.createDocumentFragment();
                const mainContentDiv = document.createElement('div');
                mainContentDiv.className = 'main-content';
                mainContentDiv.innerHTML =
                    `${characterInfo.name}(${characterInfo.id})</br>
                    武将包：${characterInfo.packageName}</br>
                    分包：${characterInfo.characterSortName}</br>
                    性别：${characterInfo.sex}</br>
                    势力：${characterInfo.group}</br>
                    体力：${characterInfo.hp}/${characterInfo.maxHp}</br>
                    护甲：${characterInfo.hujia}</br>
                    宗族：${characterInfo.clans}</br>
                    技能：</br>${characterInfo.skillList.join("</br>")}`
                mainContentDiv.setBackground(characterInfo.id, "character");
                if (characterInfo.dieAudios?.length) {
                    const audioUl = document.createElement('ul');
                    characterInfo.dieAudios.forEach(audio => {
                        const li = document.createElement('li');
                        li.dataset.audioListItem = true;
                        const span = document.createElement('span');
                        span.dataset.audioSrc = audio.file
                        li.append(audio.text, span);
                        audioUl.appendChild(li);
                    });
                    mainContentDiv.appendChild(audioUl);
                }
                fragment.appendChild(mainContentDiv);
                if (characterInfo.skills) {
                    const skillsUl = document.createElement('ul');
                    characterInfo.skills.forEach(skillInfoItem => {
                        const skillCard = document.createElement('skill-card');
                        skillCard.setAttribute('skill-info', JSON.stringify(skillInfoItem));
                        skillCard.setAttribute('skill-id', skillInfoItem.id);
                        skillsUl.appendChild(skillCard);
                    });
                    fragment.appendChild(skillsUl);
                }
                showInfo.appendChild(fragment);
            }
        } else if (name === "skill-likable") {
            if (newValue === "true") {
                this.shadowRoot.querySelectorAll("skill-card").forEach(skillCard => {
                    skillCard.setAttribute("likable", "true");
                })
            } else {
                this.shadowRoot.querySelectorAll("skill-card").forEach(skillCard => {
                    skillCard.setAttribute("likable", "false");
                })
            }
        } else if (name === "skill-usable") {
            if (newValue === "true") {
                this.shadowRoot.querySelectorAll("skill-card").forEach(skillCard => {
                    skillCard.setAttribute("usable", "true");
                })
            } else {
                this.shadowRoot.querySelectorAll("skill-card").forEach(skillCard => {
                    skillCard.setAttribute("usable", "false");
                })
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }

    }
}
customElements.define("skill-card", HTMLNonameSkillCardElement);
customElements.define("character-card", HTMLNonameCharacterCardElement);
customElements.define("character-editor", HTMLNonameCharacterEditorElement);