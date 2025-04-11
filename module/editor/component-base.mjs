"use script";
import { NonameData } from "./data.mjs";
import { EditableElementManager, loadCss, MultipleChoiceManager, ObjectURLManager, UniqueChoiceManager } from "./encapsulated.mjs";
export class HTMLNonameFocusUIElement extends HTMLElement {
    #server;
    #uniqueChoiceAnonymousManagerSymbol = Symbol(null);
    #uniqueChoiceManagerMap = new Map([[this.#uniqueChoiceAnonymousManagerSymbol, []]]);
    #multipleChoiceAnonymousManagerSymbol = Symbol(null);
    #multipleChoiceManagerMap = new Map([[this.#multipleChoiceAnonymousManagerSymbol, []]])
    #editableElementAnonymousManagerSymbol = Symbol(null);
    #editableElementManagerMap = new Map([[this.#editableElementAnonymousManagerSymbol, []]]);
    #objectURLManager = new ObjectURLManager();
    #fragmentStorageMap = new Map();
    constructor() {
        super();
        this.#server = new NonameData();
    }
    /**
     * @template {"readFile"|"readFolder"|"getAllFolderList"|"getAllFileList"|"getAllFolderAndFileList"|"submitFile"} T
     * @param {T} mode 
     * @param { T extends "readFile"?{format: ("url"|"arrayBuffer"|"text"),file: Blob|URL}:
     *          T extends "submitFile"?{format: (string|string[]),multiple?:boolean}:
     *          T extends "readFolder"|"readDir"?{path:string}
     *          T extends "getAllFileList"|"getAllFileAndFolderList"?{path:string,folderFilter:function,fileFilter:function}
     *          T extends "getAllFolderList"?{path:string,folderFilter:function}
     *          Object<string,any>
     * } query 
     * @returns {Promise<any>}
     */
    fileQuery(mode, query) {
        switch (mode) {
            case "readFile": {
                const { format, file } = query;
                return this.#server.readFile(file, format);
            }
            case "readFolder": case "readDir": {
                const { path } = query;
                return this.#server.readFolder(path)
            }
            case "getAllFolderList": {
                const { path, folderFilter } = query;
                return this.#server.getAllFolderList(path);
            }
            case "getAllFileList": {
                const { path, fileFilter, folderFilter } = query;
                return this.#server.getAllFolderList(path);
            }
            case "getAllFolderAndFileList": {
                const { path, fileFilter, folderFilter } = query;
                return this.#server.getAllFolderFileList(path);
            }
            case "submitFile": {
                const { format, multiple } = query;
                return this.#server.submitFile(format, multiple);
            }
        }
    }
    /**
     * @template {'pinyin'| 'characterTranslation'|'formatTransfer'|'skillTranslation'} T
     * @param {T} mode 
     * @param {T extends 'pinyin' ?{text:string,withTone:boolean}
     *         T extends 'characterTranslation' ?{text:string,attr:"sex"|"group"}
     *         T extends 'skillTranslation' ?{text:string,attr:"name"|"info"}
     *         T extends 'formatTransfer' ?{text:string,to:"kebab"|"camel"|"escapedHTML"}
     * } query
     * @returns {string|undefined}
     */
    textQuery(mode, query = {}) {
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
                if (to === "escapedHTML") return this.#server.toEscapedHTML(text);
                return text;
            }
        }
    }
    /**
     * @template {"hpStatus"|"clanSkillId"|"translation"|"intro"} T
     * @param {T} mode
     * @param { T extends "hpStatus"?{hp:number,maxHp:number}:
     *          T extends "clanSkillId"?{clan:string}
     *          T extends "translation"?{id:string}
     *          T extends "intro"?{id:string}
     *          Object<string,any>
     * } query 
    */
    playerQuery(mode, query = {}) {
        switch (mode) {
            case "hpStatus": {
                const { hp, maxHp } = query;
                return this.#server.getHpStatus(hp, maxHp)
            };
            case "clanSkillId": {
                const { clan } = query;
                return this.#server.getClanSkillId(clan)
            }
            case "translation": {
                const { id } = query;
                return this.#server.getTranslation("character", "name", id);
            }
            case "intro": {
                const { id } = query;
                return this.#server.getCharacterIntro(id);
            }
        }
    }
    cardQuery(mode, query) {
        switch (mode) {
            case "": {
            }
        }
    }
    /**
     * @template {"characterId"|"skillTags"} T
     * @param {T} mode 
     * @param {T extends "characterId"?{id:string}:
     *         T extends "skillTags"?{id:string,tags:string[]}
     * } query 
     */
    checkQuery(mode, query = {}) {
        switch (mode) {
            case "characterId": {
                const { id } = query
                return this.#server.checkId(id, "character");
            }
            case "skillTags": {
                const { id, tags } = query;
                return this.#server.checkSkillTags(id, tags);
            }
        }
    }
    /**
     * @template {"skill"|"extensionList"} T
     * @param {T} mode 
     * @param {T extends "skill"?{skillId:string,characterId:string}   
     *         T extends "extension"?{filter:function}
     * } query 
     * @returns 
     */
    infoQuery(mode, query = {}) {
        switch (mode) {
            case "skill": {
                const { skillId, characterId } = query;
                return this.#server.parseSkill(skillId, characterId);
            };
            case "extensionList": {
                const { filter } = query;
                return this.#server.getExtensionList(filter);
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
    /**
     * @template {"audioPlay"|"staticImgClip"|"gifClip"} T
     * @param {T} mode
     * @param { T extends "audioPlay"?{src:string|URL,volume:number}
     *          T extends "staticImgClip"?{
     *          img:HTMLImageElement,
     *          x:number,y:number,
     *          width:number,
     *          height:number,
     *          quality:number,
     *          dataForm:"blob"|"url"|"blobURL",
     *          type:string
     *          useClientData:boolean}:
     *          T extends "gifClip"?{
     *          img:HTMLImageElement,
     *          x:number,y:number,
     *          width:number,
     *          height:number,
     *          quality:number,
     *          dataForm:"blob"|"url"|"blobURL",
     *          minDelay:number
     *          }:Object<string,any>
     * } query 
     */
    multiMediaQuery(mode, query) {
        switch (mode) {
            case "audioPlay": {
                const { src, volume } = query;
                return this.#server.playAudio(src, { volume });
            }
            case "staticImgClip": {
                const { img, ...config } = query;
                return this.#server.clipStaticImg(img, config);
            }
            case "gifClip": {
                const { img, ...config } = query;
                return this.#server.clipGif(img, config);
            }
        }
    }
    /**
     * @typedef {{
     *      canvas: HTMLCanvasElement
     * }} canvasBaseQuery
     */
    /**
     * @typedef {canvasBaseQuery&{
     *     height: number
     *     width: number
     *     quality: number
     *     dataForm:("url"|"blob"|"blobURL")
     *     type:("jpeg"|"webp"|"png"|"jpeg")
     * }} exportAsStaticImageQuery
     */
    /**
     * @typedef {canvasBaseQuery&{
     *     text:string
     *     fontFamily: string
    *      fontSize: string
    *      fontColor: string
    *      shadowColor: string
    *      shadowBlur: number
    *      offsetX?: number
    *      offsetY?: number
    *      clear?: boolean
    *      
     * }} drawLineTextQuery
     */
    /**
     * @template {"exportAsStaticImage"|"drawLineText"} T
     * @param {T} mode 
     * @param { T extends "exportAsStaticImage"?exportAsStaticImageQuery:
     *          T extends "drawLineText"?drawLineTextQuery:
     *          Object<string,any>
     * } query 
     * @returns 
     */
    canvasQuery(mode, query) {
        const { canvas } = query;
        if (!(canvas instanceof HTMLCanvasElement)) throw Error("query.canvas必须是HTMLCanvasELement对象!");
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
                    if (dataForm.toLocaleLowerCase() === "url") {
                        tempCanvas.toDataURL(resolve, type, quality);
                    } else if (dataForm.toLocaleLowerCase() === "blob" || dataForm === "blobURL") {
                        tempCanvas.toBlob(resolve, type, quality);
                    } else {
                        resolve(null)
                    }
                }).then((data) => {
                    if (dataForm === "blobURL") return URL.createObjectURL(data);
                    return data;
                })
            };
            case "drawLineText": {
                const { context: ctx } = query;
                if (!(ctx instanceof CanvasRenderingContext2D)) throw new Error("query.ctx必须为CanvasRenderingContext2D对象!")
                const {
                    text = '',
                    fontFamily = 'Arial',
                    fontSize = '48px',
                    shadowColor = '#000',
                    shadowBlur = 10,
                    shadowOffsetX = 0,
                    shadowOffsetY = 0,
                    fontColor = "#fff",
                    clear = true,
                    offsetX = 0,
                    offsetY = 0,
                    mode = "center"
                } = query;
                if (clear) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
                ctx.save();
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.shadowColor = shadowColor; ctx.shadowOffsetX = shadowOffsetX; ctx.shadowOffsetY = shadowOffsetY;
                ctx.shadowBlur = shadowBlur;
                ctx.fillStyle = fontColor;
                ctx.font = fontSize + " " + fontFamily;
                if (mode === "center") {
                    ctx.fillText(text, canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
                } else {
                    ctx.fillText(text, offsetX, offsetY);
                }
                ctx.restore();
            }
        }
    }
    /**
     * @template {"generateCharacterCode"|"getFileAllModules"|"getExtensionAllPackage"|"getAST"} T
     * @param {T} mode 
     * @param {T extends "generateCharacterCode"?{info:Object,pattern:"object"|"array"}
     *         T extends "getFileAllModule"?{path}
     *         T extends "getExtensionAllPackage"?{extensionName}
     * } query 
     * @returns {T extends "getAST"?}
     */
    codeQuery(mode, query) {
        switch (mode) {
            case "getAST": {
                return this.#server.getAST();
            }
            case "getFileAllModules": {
                const { path } = query;
                return this.#server.getFileAllModules(path);
            }
            case "getExtensionAllPackage": {
                const { extensionName } = query;
                return this.#server.getExtensionAllPackage(extensionName);
            }
            case "generateCharacterCode": {
                const { info, pattern } = query
                return this.#server.genCharacterCode(info, pattern);
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
    createMultipleChoiceManager(label, ...nodes) {
        const manager = new MultipleChoiceManager(...nodes);
        if (label !== null && label !== void 0) {
            this.#multipleChoiceManagerMap.set(label, manager);
        }
        else {
            this.#multipleChoiceManagerMap.get(this.#multipleChoiceAnonymousManagerSymbol).push(manager);
        }
        return manager;
    }
    /**
     * @param {string} label 
     * @returns {MultipleChoiceManager|MultipleChoiceManager[]}
     */
    getMultipleChocieManager(label) {
        return this.#multipleChoiceManagerMap.get(label);
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
     * @param {any} label 
     * @param {Blob|URL} url 
     */
    recordObjectURL(label, url) {
        this.#objectURLManager.add(label, url);
    }
    /**
     * @param {any} label 
     * @param {Blob|URL} url 
     */
    createAndRecordObjectURL(label, url) {
        this.#objectURLManager.addFromBlob(label, url);
    }
    /**
     * @param {any} label 
     */
    clearObjectURLRecords(label) {
        this.#objectURLManager.clear(label);
    }
    getLastestURLRecord(label) {
        return this.#objectURLManager.getLastest(label);
    }
    getURLRecordGroup(label) {
        return this.#objectURLManager.getURLGroup(label);
    }
    /**
     * @param {string} label 
     * @param {DocumentFragment|Node|NodeList|Array|string} fragmentSource 
     * @returns 
     */
    storeFragment(label, fragmentSource) {
        if (typeof label !== "string") return;
        const fragment = fragmentSource instanceof DocumentFragment ?
            fragmentSource : this.createFragmentAuto(fragmentSource);
        this.#fragmentStorageMap.set(label, fragment);
    }
    /**
     * @param {string} label 
     * @returns {DocumentFragment|null}
     */
    getStoredFragment(label) {
        const fragment = this.#fragmentStorageMap.get(label);
        return fragment?.cloneNode(true) || null;
    }
    destoryStoredFragment(label) {
        this.#fragmentStorageMap.delete(label);
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
     * @param {Object<string,any>} load 
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
    /**
     * @param {HTMLElement|DocumentFragment} node 
     * @param {string} label 
     * @param {HTMLElement} parentNode 
     * @returns {HTMLSlotElement}
     */
    appendChildViaSlot(node, label, parentNode = this.shadowRoot) {
        if (!this.shadowRoot.contains(parentNode)) throw new Error(`${parentNode}必须是阴影根节点或其子节点!`);
        if (node instanceof DocumentFragment) {
            node.childNodes.forEach(item => {
                item.setAttribute("slot", label);
            })
        } else if (node instanceof HTMLElement) {
            node.setAttribute("slot", label);
        }
        this.appendChild(node);
        let slot = this.shadowRoot.querySelector(`slot[name="${label}"]`);
        if (slot === null) {
            slot = document.createElement("slot");
            slot.setAttribute("name", label);
        }
        parentNode.appendChild(slot);
        return slot;
    }
    createFragmentAuto(fragmentSource) {
        if (fragmentSource instanceof Node) {
            const fragment = document.createDocumentFragment();
            fragment.appendChild(fragmentSource);
            return fragment
        } else if (typeof fragmentSource === "string") {
            const fragment = document.createDocumentFragment();
            try {
                if (typeof fragmentSource === "string") {
                    const parser = new DOMParser();
                    fragment.append(...parser.parseFromString(fragmentSource, "text/html").body.childNodes);
                };
            } finally {
                return fragment;
            }
        } else if (typeof fragmentSource[Symbol.iterator] === "function") {
            const fragment = document.createDocumentFragment();
            fragment.append(...[...fragmentSource].filter(source => source instanceof Node));
            return fragment;
        } else {
            return document.createDocumentFragment();
        }
    }
    loadCss(path, config = { root: this.shadowRoot || document.head }) {
        return loadCss(path, config);
    }
    //以下为hljs部分
    static #$hljs = {
        hljs: null,
        hljs_js: null
    };
    static async #$getHLJS() {
        if (!this.#$hljs.hljs && !this.#$hljs.hljs_js) {
            const [hljs, js] = await Promise.all([
                import("./libs/highlight/highlight.min.js").then(module => {
                    HTMLNonameFocusUIElement.#$hljs.hljs = module.default;
                    return module.default;
                }),
                import("./libs/highlight/javascript.min.js").then(module_1 => {
                    HTMLNonameFocusUIElement.#$hljs.hljs_js = module_1.default;
                    return module_1.default;
                })
            ]);
            hljs.registerLanguage("javascript", js);
        } else {
            return Promise.resolve();
        }
    }
    get #hljs() {
        return HTMLNonameFocusUIElement.#$hljs.hljs;
    }
    async #getHLJS() {
        await HTMLNonameFocusUIElement.#$getHLJS();
        return this.#hljs;
    }
    async highlightCode(node) {
        const hljs = await this.#getHLJS();
        this.loadCss("../libs/highlight/default.min", { root: this.shadowRoot.contains(node) ? this.shadowRoot : document.head });
        hljs.highlightElement(node);
    }
}