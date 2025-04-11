import { HTMLNonameFocusUIElement } from "./component-base.mjs";
const groupDiyFragment = (() => {
    const fragment = new DocumentFragment();

    const diyGroupDiv = document.createElement('div');
    diyGroupDiv.className = 'diyGroup';

    const canvas = document.createElement('canvas');
    canvas.width = 68;
    canvas.height = 68;
    const text = document.createElement("p");
    const form = document.createElement('form');

    const groupDiv = document.createElement('div');
    groupDiv.innerHTML = `<label for="group">势力名称</label><input id="group" name="group" type="text" max-length="2">`;

    const groupIdDiv = document.createElement('div');
    groupIdDiv.innerHTML = `<label for="group-id">势力id</label><input id="group-id" name="group-id" type="text">`;

    const colorDiv = document.createElement('div');
    colorDiv.innerHTML = `<label for="color">设置阴影颜色</label><input id="color" name="color" type="color">`;

    const blurDiv = document.createElement('div');
    blurDiv.innerHTML = `<label for="blur">设置阴影模糊程度</label><input id="blur" type="range" name="blur" value="10" max="25">`;

    const fontListDiv = document.createElement('div');
    fontListDiv.className = 'font-list';
    [
        ["minifanzhuanshu", "迷你繁篆书"],
        ['xiaozhuan', "方正小篆体"],
        ["xinwei", "华文新魏_GBK"],
        ['huangcao', "方正黄草_GBK"],
        ['yuanli', "方正北魏楷书_GBK"],
        ['xingkai', "方正行楷_GBK"],
        ['shousha', "方正隶变_GBK"],
    ].forEach(function ([fontName, fontCnName], index) {
        const fontItemDiv = document.createElement('div');
        fontListDiv.appendChild(fontItemDiv);
        const label = document.createElement('label');
        label.setAttribute('for', fontName);
        label.style.fontFamily = fontName;
        label.textContent = fontCnName;
        label.title = fontCnName;
        fontItemDiv.appendChild(label);
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'font-family';
        radio.value = fontName;
        radio.id = fontName;
        if (index === 0) radio.setAttribute("checked", "true");
        fontItemDiv.appendChild(radio);
    });
    form.append(groupDiv, groupIdDiv, colorDiv, blurDiv, fontListDiv);
    diyGroupDiv.append(canvas, text, form);
    fragment.appendChild(diyGroupDiv);
    return fragment;
})();
const groupDiyStyle = (() => {
    const style = document.createElement("style");
    style.textContent =
        `.diyGroup { height: 100%; width: 100%; font-size:24px; display: flex; flex-direction: column; align-item: center; justify-content: center; }

        p{ display:flex; align-item: center; justify-content: center; margin: 0; font-size: 16px; color: #fff; }

        canvas{  margin: 10px auto; }

        .font-list{ margin-top: 10px; flex-wrap: wrap; font-size: 16px; }

        .font-list>div{ display: flex; align-item: center; flex-direction: column; line-height:16px; margin: 0 5px; }`
    return style;
})();
const textFragment = (() => {
    const fragment = new DocumentFragment();
    const textEditorWrapper = document.createElement("div");
    const textEditorToolBar = document.createElement("div");
    const textEditorContainer = document.createElement("div");
    textEditorToolBar.setAttribute("id", "text-editor-toolbar-container");
    textEditorContainer.setAttribute("id", "text-editor-container");
    textEditorWrapper.style.cssText = `display:flex;flex-direction:column;height:100%;width:100%;background:#e0e0e0`
    textEditorContainer.style.cssText = `margin-top:5px;flex:1;max-height:100%;width:100%;overflow:auto;`
    textEditorWrapper.append(textEditorToolBar, textEditorContainer);
    fragment.append(textEditorWrapper);
    return fragment;
})();
const extensionSettringFragment = (() => {
    const fragment = new DocumentFragment();

    const form = document.createElement("form");

    const extensionChoiceContainer = document.createElement("div");
    extensionChoiceContainer.innerHTML = `<label for="extension">扩展名称</label><input name="extension" id="extension" list="extension-list" required><datalist id="extension-list"></datalist>`

    const extensionCharacterImage = document.createElement("div");
    extensionCharacterImage.innerHTML = `<label for="extension-character-image">扩展武将图片文件夹</label><input name="extension-character-image" id="extension-character-image" list="extension-folder-list">`

    const extensionCharacterJs = document.createElement("div");
    extensionCharacterJs.innerHTML = `<label for="extension-character-js">扩展武将脚本文件</label><input name="extension-character-js" id="extension-character-js" list="extension-file-list">`

    const extensionCardImage = document.createElement("div");
    extensionCardImage.innerHTML = `<label for="extension-card-image">扩展卡牌图片文件夹</label><input name="extension-card-image" id="extension-card-image" list="extension-folder-list">`

    const extensionCardJs = document.createElement("div");
    extensionCardJs.innerHTML = `<label for="extension-card-js">扩展卡牌脚本文件</label><input name="extension-card-js" id="extension-card-js" list="extension-file-list">`

    const extensionSkillAudio = document.createElement("div");
    extensionSkillAudio.innerHTML = `<label for="extension-skill-audio">扩展技能语音文件夹</label><input name="extension-skill-audio" id="extension-skill-audio" list="extension-folder-list">`

    const extensionDieAudio = document.createElement("div");
    extensionDieAudio.innerHTML = `<label for="extension-die-audio">扩展阵亡语音文件夹</label><input name="extension-die-audio" id="extension-die-audio" list="extension-folder-list">`

    const dirDataList = document.createElement("datalist");
    dirDataList.id = "extension-folder-list";

    const fileDataList = document.createElement("datalist");
    fileDataList.id = "extension-file-list";
    form.append(extensionChoiceContainer, extensionCharacterImage, extensionCharacterJs, extensionCardImage, extensionCardJs, extensionSkillAudio, extensionDieAudio, dirDataList, fileDataList);
    fragment.append(form);
    return fragment;
})();
const extensionSettingStyle = (() => {
    const style = document.createElement("style");
    //第一行样式不生效也没关系,本来也不重要,本来设置了disabled就可以防止输入 :has() chorme 105
    style.textContent =
        `.content div:has(#extension:invalid) ~ div{ display: none; }
        .content input{ width:50% }`
    return style;
})();
const extensionFolderListRecord = {}
class HTMLNonameDialogHTML extends HTMLNonameFocusUIElement {
    static dialogStack = [];
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        //$: shadow , html/dialog.html//
shadow.innerHTML=`
<style>
    :host {
        height: 100%;
        width: 100%;
        z-index: 1024;
        position: absolute !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    p {
        margin: 0;
        font-weight: 900;
        font-size: 1.5em;
    }

    .curtain {
        display: block;
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.4);
        z-index: -1;
    }

    .remove {
        cursor: pointer;
        width: 1em;
    }

    .dialog {
        height: var(--dialog-height, 315px);
        width: var(--dialog-width, 560px);
        border-radius: 13px;
        background: #e0e0e0;
        box-shadow: 0 0 10px #bebebe, 0 0 10px #ffffff, 0 0 5px black;
        padding: 5px;
        display: flex;
        flex-direction: column;
        color: #000;
        text-shadow: 1px 1px #fff;
    }

    .dialog form>div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .content {
        height: 95%;
    }

    .actions {
        display: flex;
        justify-content: center;
        margin-top: 25px;
    }

    .actions>div {
        background: #e6e6e6;
        box-shadow: 0px 0px 3px #272727;
        border-radius: 5px;
        margin: 0 10px;
        padding: 5px;
        font-size: 28px;
        color: rgb(200, 200, 200);
        cursor: pointer;
    }

    .actions.invalid .confirm {
        display: none;
    }

    .actions.forced .cancel {
        display: none;
    }
</style>
<div class="curtain"></div>
<div class="dialog">
    <header>
        <p></p>
    </header>
    <section class="content"></section>
</div>
<div class="actions">
    <div class="confirm">确认</div>
    <div class="cancel">取消</div>
</div>`
//#: shadow , html/dialog.html//
        this.#listenLoad();
    }
    dialogendListener = [];
    dialogcancelListener = [];
    connectedCallback() {
        if (HTMLNonameDialogHTML.dialogStack.length) {
            HTMLNonameDialogHTML.dialogStack.forEach(dialog => dialog.close());
        }
        HTMLNonameDialogHTML.dialogStack.push(this);
    }
    static observedAttributes = ["type", "headline", "message", "placeholder", "height", "width", "forced"];
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case "type": {
                const tempStyle = this.shadowRoot.querySelector("style#temp");
                if (tempStyle) tempStyle.remove();
                if (this.hasAttribute("forced")) this.removeAttribute("forced");
                if (this.hasAttribute("headline")) this.removeAttribute("headline");
                if (this.hasAttribute("message")) this.removeAttribute("message");
                if (this.dialogendListener.length) {
                    const dialog = this.shadowRoot.querySelector(".dialog");
                    this.dialogendListener.forEach(listener => {
                        dialog.removeEventListener("dialogend", listener);
                    })
                }
                if (this.dialogcancelListener.length) {
                    const dialog = this.shadowRoot.querySelector(".dialog");
                    this.dialogcancelListener.forEach(listener => {
                        dialog.removeEventListener("dialogcancel", listener);
                    })
                }
                this.querySelectorAll(":scope>*").forEach((node) => {
                    node.remove();
                });
                switch (newValue) {
                    case "alert": {
                        this.setAttribute("forced", true);
                    }; break;
                    case "confirm": ; break;
                    case "prompt": {
                        const content = this.shadowRoot.querySelector(".content");
                        const form = document.createElement("form");
                        const div = document.createElement('div');
                        const label = document.createElement("label");
                        const input = document.createElement("input");
                        if (this.hasAttribute("placeholder")) {
                            label.textContent = this.getAttribute("placeholder")
                        }
                        div.append(label, input);
                        form.append(div);
                        content.append(form);
                        this.whenEnd(() => {
                            this.#finishReslove(input.value);
                        });
                        form.addEventListener("submit", e => e.preventDefault());
                        this.whenCancel(() => this.#finishReslove(false));
                    }; break;
                    case "diygroup": {
                        this.appendTempStyle(groupDiyStyle.cloneNode(true))
                        const content = this.shadowRoot.querySelector(".content");
                        content.append(groupDiyFragment.cloneNode(true));
                        const form = content.querySelector("form");
                        const group = content.querySelector("input#group");
                        const groupId = content.querySelector("input#group-id");
                        const canvas = content.querySelector("canvas");
                        const text = content.querySelector("p");
                        const context = canvas.getContext('2d');
                        group.addEventListener("change", () => {
                            groupId.value = this.textQuery("pinyin", { text: group.value, withTone: false }).join("");
                        });
                        form.addEventListener("change", () => {
                            const map = new Map(new FormData(form));
                            const groupText = map.get("group");
                            const color = map.get("color");
                            const fontFamily = map.get("font-family")
                            const blur = map.get("blur");
                            if (!groupText.length) return;
                            if (groupText.length === 1) {
                                this.canvasQuery("drawLineText", { context, text: groupText, canvas, shadowBlur: blur, fontFamily, shadowColor: color });
                            } else if (groupText.length === 2) {
                                this.canvasQuery("drawLineText", { context, text: groupText[0], canvas, offsetX: -9, offsetY: -9, fontSize: "36px", shadowBlur: blur, fontFamily, shadowColor: color });
                                this.canvasQuery("drawLineText", { context, text: groupText[1], clear: false, canvas, offsetX: 9, offsetY: 9, fontSize: "36px", shadowBlur: blur, fontFamily, shadowColor: color });
                            }
                            text.textContent = groupText;
                            text.style.cssText = `text-shadow: ${color} 0 0 2px, ${color} 0 0 2px, ${color} 0 0 2px, #000 0 0 1px;`
                        });
                        this.whenEnd(async (e) => {
                            e.preventDefault();
                            const map = new Map(new FormData(form));
                            const color = map.get("color")
                            const imageData = await this.canvasQuery("exportAsStaticImage", { canvas, height: 41, dataForm: "blobURL" });
                            this.#finishReslove({
                                imageData,
                                id: map.get("group-id"),
                                name: map.get("group"),
                                textShadow: `${color} 0 0 2px, ${color} 0 0 2px, ${color} 0 0 2px, #000 0 0 1px`
                            });
                            this.remove();
                        });
                    }; break;
                    //以下引用wangDditor
                    case "text": {
                        let editor;
                        const content = this.shadowRoot.querySelector(".content");
                        const slot = this.appendChildViaSlot(textFragment.cloneNode(true), "text", content);
                        const loadEditor = () => {
                            const { createEditor, createToolbar } = window.wangEditor;
                            editor = createEditor({
                                selector: '#text-editor-container',
                                config: {},
                                html: this.getAttribute("message") || void 0,
                                mode: 'default'
                            });
                            createToolbar({
                                editor,
                                selector: '#text-editor-toolbar-container',
                                config: {
                                    excludeKeys: ["headerSelect", "blockquote", "insertTable", 'group-image', 'group-video', 'group-justify', 'group-indent', "fontFamily"]
                                },
                                mode: 'default'
                            })
                            this.setAttribute("height", 475);
                        }
                        //因为不确定多久能够检测到id 这里0.1s检测1次
                        new Promise(reslove => {
                            const timer = setInterval(() => {
                                if (document.querySelector('#text-editor-container') && document.querySelector('#text-editor-toolbar-container')) {
                                    clearInterval(timer);
                                    reslove();
                                }
                            }, 100);
                        }).then(() => {
                            "wangEditor" in window ? loadEditor() : (() => {
                                this.loadCss(`../libs/wangeditor/style`, { root: document.head });
                                import("./libs/wangeditor/index.min.js").then(loadEditor);
                            })();
                        })
                        this.whenEnd(async (e) => {
                            const sourceHTML = editor?.getHtml();
                            if (sourceHTML) {
                                const parser = new DOMParser();
                                const tempDoc = parser.parseFromString(sourceHTML, "text/html");
                                const ps = tempDoc.body.querySelectorAll(":scope>p")
                                ps.forEach((p) => {
                                    const nodes = [], flag = tempDoc.body.lastElementChild === p;
                                    nodes.push(...p.childNodes);
                                    if (!flag) nodes.push(document.createElement("br"));
                                    p.replaceWith(...nodes);
                                })
                                const noPElementHTML = tempDoc.body.innerHTML;
                                this.#finishReslove({
                                    sourceHTML,
                                    noPElementHTML
                                });
                            } else {
                                this.#finishReslove({
                                    sourceHTML: "<p></p>",
                                    noPElementHTML: ""
                                })
                            }

                        });
                    }; break;
                    case "extension-setting": {
                        this.appendTempStyle(extensionSettingStyle.cloneNode(true))
                        const content = this.shadowRoot.querySelector(".content");
                        content.append(extensionSettringFragment.cloneNode(true));
                        const [extension, ...extensionConcerning] = content.querySelectorAll("input");
                        const [characterImage, characterJs, cardImage, cardJs, skillAudio, dieAudio] = extensionConcerning;
                        const extensionList = content.querySelector("datalist#extension-list");
                        const dirDataList = content.querySelector("datalist#extension-folder-list");
                        const fileDataList = content.querySelector("datalist#extension-file-list");
                        const form = content.querySelector("form");
                        const characterJsRegx = /\bcharacter\.m?js$/;
                        const cardJsRegx = /\bcard\.m?js$/;
                        const extensionChange = async () => {
                            const disabled = !extension.checkValidity();
                            extensionConcerning.forEach(node => {
                                node.disabled = disabled;
                                node.value = "";
                            });
                            if (disabled) return;
                            const map = new Map(new FormData(form));
                            const extensionName = map.get("extension");
                            if (!extensionFolderListRecord[extensionName]) {
                                const [folderList, fileList] = await this.fileQuery("getAllFolderAndFileList", { path: "extension/" + extensionName });
                                const folderDatalistContent = `<option value="${extensionName}">${extensionName}<option>` + folderList.map(folder => `<option value="${extensionName + "/" + folder}">${extensionName + "/" + folder}<option>`).join("");
                                const fileDatalistContent = fileList.map(file => `<option value="${extensionName + "/" + file}">${extensionName + "/" + file}<option>`).join("");
                                extensionFolderListRecord[extensionName] = {
                                    folderList,
                                    fileList,
                                    folderDatalistContent,
                                    fileDatalistContent
                                }
                            }
                            const { folderDatalistContent, folderList, fileList, fileDatalistContent } = extensionFolderListRecord[extensionName]
                            dirDataList.innerHTML = folderDatalistContent;
                            fileDataList.innerHTML = fileDatalistContent;
                            if (folderList.includes("image/character")) {
                                characterImage.value = extensionName + "/image/character";
                            } else if (folderList.includes("image")) {
                                characterImage.value = extensionName + "/image";
                            } else {
                                characterImage.value = extensionName;
                            }
                            characterJs.value = extensionName + "/" + (fileList.find(file => characterJsRegx.test(file)) || "extension.js");
                            if (folderList.includes("image/card")) {
                                cardImage.value = extensionName + "/image/card";
                            } else if (folderList.includes("image")) {
                                cardImage.value = extensionName + "/image";
                            } else {
                                cardImage.value = extensionName;
                            }
                            cardJs.value = extensionName + "/" + (fileList.find(file => cardJsRegx.test(file)) || "extension.js");
                            if (folderList.includes("audio/skill")) {
                                skillAudio.value = extensionName + "/audio/skill";
                            } else if (folderList.includes("audio")) {
                                skillAudio.value = extensionName + "/audio";
                            } else {
                                skillAudio.value = extensionName;
                            }
                            if (folderList.includes("audio/die")) {
                                dieAudio.value = extensionName + "/audio/die";
                            } else if (folderList.includes("audio")) {
                                dieAudio.value = extensionName + "/audio";
                            } else {
                                dieAudio.value = extensionName;
                            }
                        }
                        extension.addEventListener("change", extensionChange);
                        extensionList.innerHTML = this.infoQuery("extensionList").map(name => {
                            return `<option value="${name}">${name}<option>`
                        }).join("");
                        this.setAttribute("headline", "扩展设置");
                        this.whenEnd((e) => {
                            e.preventDefault();
                            const map = new Map(new FormData(form));
                            this.#finishReslove({
                                ...Object.fromEntries(map),
                                extensionName: map.get("extension")
                            });
                            this.remove();
                        });
                    }; break;
                    default: break;
                }
                this.updateWithValidity();
            }; break;
            case "headline": {
                const p = this.shadowRoot.querySelector("header p");
                p.textContent = newValue;
            }; break;
            case "message": {
                if (["alert", "confirm"].includes(this.getAttribute("type"))) {
                    const content = this.shadowRoot.querySelector(".content");
                    content.textContent = newValue;
                } else if (this.getAttribute("type") === "prompt") {
                    const label = this.shadowRoot.querySelector("label");
                    label.textContent = newValue;
                } else if (this.getAttribute("type") === "text") {
                    const editor = this.querySelector("#text-editor-container");
                    if (typeof editor.getHtml === "function" && editor.getHtml() !== newValue) editor.setHtml(newValue);
                } else if (this.getAttribute("type") === "extension-setting") {
                    const content = this.shadowRoot.querySelector(".content");
                    const extensionNameInput = content.querySelector("input#extension");
                    extensionNameInput.value = newValue;
                    this.sendEvent("change", extensionNameInput);
                }
            }; break;
            case "placeholder": {
                if (this.getAttribute("type") === "prompt") {
                    const input = this.shadowRoot.querySelector("input");
                    input.placeholder = newValue;
                }
            }; break;
            case "height": {
                this.style.setProperty("--dialog-height", parseFloat(newValue) + "px")
            }; break;
            case "width": {
                this.style.setProperty("--dialog-width", parseFloat(newValue) + "px")
            }; break;
            case "forced": {
                const actions = this.shadowRoot.querySelector(".actions");
                if (newValue) {
                    actions.classList.add("forced");
                } else {
                    actions.classList.remove("forced");
                }
            }; break;
        }
    }
    disconnectedCallback() {
        HTMLNonameDialogHTML.dialogStack.pop();
        const length = HTMLNonameDialogHTML.dialogStack.length;
        if (length) HTMLNonameDialogHTML.dialogStack[length - 1].show();
    }
    #listenLoad() {
        const confirm = this.shadowRoot.querySelector(".confirm");
        const cancel = this.shadowRoot.querySelector(".cancel");
        const dialog = this.shadowRoot.querySelector(".dialog");
        confirm.addEventListener("pointerup", () => {
            this.sendEvent("dialogend", dialog, void 0, { cancelable: true });
        });
        cancel.addEventListener("pointerup", () => {
            this.sendEvent("dialogcancel", dialog, void 0, { cancelable: true });
        });
        dialog.addEventListener("dialogend", (e) => {
            setTimeout(() => {
                if (!e.defaultPrevented) {
                    this.remove();
                    this.#finishReslove(true);
                }
            }, 0)
        });
        dialog.addEventListener("dialogcancel", (e) => {
            setTimeout(() => {
                if (!e.defaultPrevented) {
                    this.remove();
                    this.#finishReslove(false);
                }
            }, 0)
        });
        dialog.addEventListener("change", (e) => {
            this.updateWithValidity();
        });
    }
    close() {
        this.setAttribute("hidden", true);
    }
    show() {
        this.removeAttribute("hidden");
    }
    wait() {
        return new Promise((resolve) => {
            this.tempResolve = resolve;
        })
    }
    #finishReslove(data) {
        if (typeof this.tempResolve === "function") {
            this.tempResolve(data);
            this.tempResolve = null;
        }
    }
    whenEnd(listener, options) {
        const dialog = this.shadowRoot.querySelector(".dialog");
        dialog.addEventListener("dialogend", listener, options);
        this.dialogendListener.push(listener);
    }
    whenCancel(listener, options) {
        const dialog = this.shadowRoot.querySelector(".dialog");
        dialog.addEventListener("dialogcancel", listener, options);
        this.dialogcancelListener.push(listener);
    }
    appendTempStyle(style) {
        if (style instanceof HTMLStyleElement) {
            style.setAttribute("id", "temp");
            this.shadowRoot.prepend(style);
        }
    }
    updateWithValidity() {
        const form = this.shadowRoot.querySelector("form");
        const actions = this.shadowRoot.querySelector(".actions");
        if (form && form.checkValidity() === false) actions.classList.add("invalid");
        else actions.classList.remove("invalid");
    }
}
customElements.define("noname-dialog", HTMLNonameDialogHTML);