import { NonameData } from "./data.mjs";
import { EditableElementManager, UniqueChoiceManager } from "./encapsulated.mjs";
export class HTMLNonameFocusUIElement extends HTMLElement {
    #server;
    #uniqueChoiceAnonymousManagerSymbol = Symbol(null);
    #uniqueChoiceManagerMap = new Map([[this.#uniqueChoiceAnonymousManagerSymbol, []]]);
    #editableElementAnonymousManagerSymbol = Symbol(null);
    #editableElementManagerMap = new Map([[this.#editableElementAnonymousManagerSymbol, []]]);
    constructor() {
        super();
        this.#server = new NonameData();
    }
    /**
     * @param {"read"} mode 
     * @param {{
     *      fromat:string,
     *      encoding:string,
     *      file:Blob
     * }} query 
     */
    fileQuery(mode, query) {
        switch (mode) {
            case "read": {
                const { format, encoding, file } = query;
                return this.#server.readFile(file, format, encoding);
            }
        }
    }
    datebaseQuery(mode, query) {
    }
    /**
     * @template {'pinyin'| 'characterTranslation'|'formatTransfer'|'skillTranslation'} T
     * @param {T} mode 
     * @param {{
     *      text: string
     *      withTone: T extends 'pinyin' ? boolean : undefined
     *      attr: T extends 'characterTranslation' ? "sex"|"group" : T extends 'skillTranslation' ? "name"|"info":undefined
     *      to: T extends 'formatTransfer' ? "kebab"|"camel" : undefined
     * }} query
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
            case "skillTranslation": {
                const { text, attr } = query;
                return this.#server.getTranslation("skill", attr, text);
            };
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
    cardQuery(mode, query) {
        switch (mode) {
            case "": {
            }
        }
    }
    /**
     * @param {"characterId"} mode 
     * @param {id} query 
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
     * @param {"textShadow"} mode 
     * @param {{
     *      nature:string
     * }} query 
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
            }; break;
        }
    }
    /**
     * @template {"exportAsStaticImage"|""} T
     * @param {T} mode 
     * @param {{
     *      canvas: HTMLCanvasElement
     *      height: number
     *      width: number
     *      quality: number
     *      dataForm: T extends "exportAsStaticImage"?("url"|"blob") : undefined
     *      type: T extends "exportAsStaticImage"?("jpeg"|"webp"|"png"|"jpeg") : undefined
     * }} query 
     * @returns 
     */
    canvasQuery(mode, query) {
        const { canvas } = query;
        if (!(canvas instanceof HTMLCanvasElement)) throw Error("query.canvas必须是HTMLCanvasELement对象!")
        switch (mode) {
            case "exportAsStaticImage": {
                const { dataForm = "url" } = query;
                let { type, height, width, quality } = query;
                if (!height && !width) {
                    height = canvas.height;
                    width = canvas.width;
                } else if (!height && width) {
                    height = canvas.height * width / canvas.width;
                } else if (height && !width) {
                    width = canvas.width * height / canvas.height;
                }
                if (["jpg", "jpeg", "webp", "png"].includes(type)) {
                    type = "image/" + type;
                }
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext("2d");
                tempCanvas.height = height;
                tempCanvas.width = width;
                tempCtx.drawImage(canvas,
                    0, 0, canvas.width, canvas.height,
                    0, 0, width, height
                );
                return new Promise((resolve) => {
                    tempCanvas.toBlob(resolve, type, quality);
                }).then((data) => {
                    if (dataForm.toLowerCase() === "blob") return data;
                    return URL.createObjectURL(data);
                })
            };
            case "": {

            }
        }
    }
    createUniqueChoiceManager(label, ...nodes) {
        const manager = new UniqueChoiceManager(...nodes);
        if (label !== null && label !== void 0) {
            this.#uniqueChoiceManagerMap.set(label, manager);
        }
        else {
            this.#uniqueChoiceManagerMap.get(this.#uniqueChoiceAnonymousManagerSymbol).push(manager);
        }
        return manager;
    }
    /**
     * @param {string} label 
     * @returns {UniqueChoiceManager}
     */
    getUniqueChoiceManager(label) {
        return this.#uniqueChoiceManagerMap.get(label);
    }
    createEditableElementManager(label, node) {
        const manager = new EditableElementManager(node);
        if (label !== null && label !== void 0) this.#editableElementManagerMap.set(label, manager);
        else this.#editableElementManagerMap.get(this.#editableElementAnonymousManagerSymbol).push(manager);
        return manager;
    }
    /**
     * @param {string} label 
     * @returns {EditableElementManager}
     */
    getEditableElementManager(label) {
        return this.#editableElementManagerMap.get(label);
    }
    /**
     * @param {string} selector 
     * @param {string[]} keyWords
     * @param {{root?:"shadowRoot"}} config 
     */
    markTextNode(selector, keyWords, config) {
        const nodes = (config?.root === "shadowRoot" ? this.shadowRoot : this).querySelectorAll(selector);
        if (!nodes) return;
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
    /**
     * @param {string} selector 
     * @param {{root?:"shadowRoot"}} config 
     */
    unmarkTextNode(selector, config) {
        const nodes = (config?.root === "shadowRoot" ? this.shadowRoot : this).querySelectorAll(selector);
        if (!nodes) return;
        nodes.forEach(node => {
            node.querySelectorAll("mark")?.forEach?.(markNode => {
                markNode.replaceWith(markNode.textContent);
            })
        });
    }
    /**
     * @param {string} name 
     * @param {HTMLElement} load 
     * @param {CustomEventInit} config 
     */
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
    /**
     * @param {string} name 
     * @param {HTMLElement} target 
     * @param {Object<string,any>} load 
     * @param {CustomEventInit} config 
     */
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
    appendChildViaSlot(node, label) {
        node.setAttribute("slot", label)
        this.appendChild(node);
        let slot = this.shadowRoot.querySelector(`slot[name="${label}"]`)
        if (slot === null) {
            slot = document.createElement("slot");
            slot.setAttribute("name", label);
        }
        this.shadowRoot.appendChild(slot);
    }
}