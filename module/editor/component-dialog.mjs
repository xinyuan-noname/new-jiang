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
    const groupLabel = document.createElement('label');
    const groupInput = document.createElement('input');
    groupLabel.setAttribute('for', "group");
    groupLabel.textContent = "势力名称";
    groupInput.id = "group";
    groupInput.name = "group";
    groupInput.type = "text";
    groupInput.maxLength = 2;
    groupDiv.append(groupLabel, groupInput);

    const groupIdDiv = document.createElement('div');
    const groupIdLabel = document.createElement('label');
    const groupIdInput = document.createElement('input');
    groupIdLabel.setAttribute('for', "group-id");
    groupIdLabel.textContent = "势力id";
    groupIdInput.id = "group-id";
    groupIdInput.name = "group-id"
    groupIdInput.type = "text";
    groupIdDiv.append(groupIdLabel, groupIdInput);

    const colorDiv = document.createElement('div');
    const colorLabel = document.createElement('label');
    const colorInput = document.createElement('input');
    colorLabel.setAttribute('for', "color");
    colorLabel.textContent = "设置阴影颜色";
    colorInput.id = "color";
    colorInput.type = "color";
    colorInput.name = "color";
    colorDiv.append(colorLabel, colorInput);

    const blurDiv = document.createElement('div');
    const blurLabel = document.createElement('label');
    const blurInput = document.createElement('input');
    blurLabel.setAttribute('for', "blur");
    blurLabel.textContent = "设置阴影模糊程度";
    blurInput.id = "blur";
    blurInput.type = "range";
    blurInput.name = "blur";
    blurInput.value = 10;
    blurInput.max = 25;
    blurDiv.append(blurLabel, blurInput);
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
        ['SmileySans', "得意黑"]
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
        `.diyGroup {
            height: 100%;
            width: 100%;
            font-size:24px;
            display: flex;
            flex-direction: column;
            align-item: center;
            justify-content: center;
        }

        p{
            display:flex;
            align-item: center;
            justify-content: center;
            margin: 0;
            font-size: 16px;
            color: #fff;
        }

        canvas{
            margin: 10px auto;
        }

        .font-list{
            margin-top: 10px;
            flex-wrap: wrap;
            font-size: 16px;
        }

        .font-list>div{
            display: flex;
            align-item: center;
            flex-direction: column;
            line-height:16px;
            margin: 0 5px;
        }
        `
    return style
})();
const textFragment = (() => {
    const fragment = new DocumentFragment();
    const textEditorWrapper = document.createElement("div");
    const textEditorToolBar = document.createElement("div");
    const textEditorContainer = document.createElement("div");
    textEditorToolBar.setAttribute("id", "text-editor-toolbar-container");
    textEditorContainer.setAttribute("id", "text-editor-container");
    textEditorWrapper.style.cssText = `display:flex;flex-direction:column;height:100%;width:100%;`
    textEditorContainer.style.cssText = `margin-top:5px;flex:1;max-height:100%;width:100%;overflow:auto;`
    textEditorWrapper.append(textEditorToolBar, textEditorContainer);
    fragment.append(textEditorWrapper);
    return fragment;
})();
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
        box-shadow: 20px 20px 20px #bebebe, -20px -20px 20px #ffffff, 0 0 10px black;
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
</style>
<div class="curtain"></div>
<div class="dialog">
    <span class="remove">×</span>
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
    }
    dialogendListener = [];
    dialogcancelListener = [];
    static observedAttributes = ["type", "headline", "message", "placeholder", "height", "width"];
    connectedCallback() {
        const remove = this.shadowRoot.querySelector(".remove");
        remove.addEventListener("pointerup", () => {
            this.remove();
        });
        const confirm = this.shadowRoot.querySelector(".confirm");
        const cancel = this.shadowRoot.querySelector(".cancel");
        const dialog = this.shadowRoot.querySelector(".dialog");
        confirm.addEventListener("pointerup", () => {
            this.sendEvent("dialogend", dialog, void 0, { cancelable: true });
        })
        cancel.addEventListener("pointerup", () => {
            this.sendEvent("dialogcancel", dialog, void 0, { cancelable: true });
        })
        dialog.addEventListener("dialogend", (e) => {
            setTimeout(() => {
                if (!e.defaultPrevented) {
                    this.remove();
                    this.#finishReslove(true);
                }
            }, 0)
        })
        dialog.addEventListener("dialogcancel", (e) => {
            setTimeout(() => {
                if (!e.defaultPrevented) {
                    this.remove();
                    this.#finishReslove(false);
                }
            }, 0)
        })
        if (HTMLNonameDialogHTML.dialogStack.length) {
            HTMLNonameDialogHTML.dialogStack.forEach(dialog => dialog.close());
        }
        HTMLNonameDialogHTML.dialogStack.push(this);
    }
    close() {
        this.setAttribute("hidden", true);
    }
    show() {
        this.removeAttribute("hidden");
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        switch (name) {
            case "type": {
                const tempStyle = this.shadowRoot.querySelector("style#temp");
                if (tempStyle) {
                    tempStyle.remove();
                }
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
                })
                switch (newValue) {
                    case "alert": {
                        const content = this.shadowRoot.querySelector(".content");
                        if (this.hasAttribute("message")) {
                            content.textContent = this.getAttribute("message");
                        }
                        const cancel = this.shadowRoot.querySelector(".cancel");
                        cancel.setAttribute("hidden", true);
                    }; break;
                    case "confirm": break;
                    case "prompt": {
                        const content = this.shadowRoot.querySelector(".content");
                        const form = document.createElement("form");
                        const div = document.createElement('div');
                        const label = document.createElement("label");
                        if (this.hasAttribute("message")) {
                            label.textContent = this.getAttribute("message")
                        }
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
                        const style = groupDiyStyle.cloneNode(true);
                        style.setAttribute("id", "temp");
                        this.shadowRoot.prepend(style);
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
                        let editor
                        const content = this.shadowRoot.querySelector(".content");
                        const slot = this.appendChildViaSlot(textFragment.cloneNode(true), "text", content);
                        const loadEditor = () => {
                            const { createEditor, createToolbar } = window.wangEditor;
                            const editorConfig = {}
                            editor = createEditor({
                                selector: '#text-editor-container',
                                config: editorConfig,
                                html: this.getAttribute("message") || void 0,
                                mode: 'default'
                            })
                            const toolbarConfig = {
                                excludeKeys: ["blockquote", "insertTable", 'group-image', 'group-video', 'group-justify', 'group-indent', "fontFamily"]
                            }
                            const toolbar = createToolbar({
                                editor,
                                selector: '#text-editor-toolbar-container',
                                config: toolbarConfig,
                                mode: 'default'
                            })
                            this.setAttribute("height", 475);
                            console.log(toolbar.getConfig())
                        }
                        slot.addEventListener("slotchange", e => {
                            "wangEditor" in window ? loadEditor() : (() => {
                                this.loadCss(`../libs/wangeditor/style`, { root: document.head });
                                import("./libs/wangeditor/index.js").then(loadEditor);
                            })();
                        });
                        this.whenEnd(async (e) => {
                            const sourceHTML = editor.getHtml();
                            const parser = new DOMParser();
                            const tempDoc = parser.parseFromString(sourceHTML, "text/html");
                            const ps = tempDoc.body.querySelectorAll(":scope>p")
                            ps.forEach((p, index) => {
                                const nodes = [], flag = tempDoc.body.lastElementChild === p;
                                nodes.push(this.createFragmentFromChildren(p));
                                if (!flag) nodes.push(document.createElement("br"));
                                p.replaceWith(...nodes);
                            })
                            const noPElementHTML = tempDoc.body.innerHTML;
                            this.#finishReslove({
                                sourceHTML,
                                noPElementHTML
                            });
                        });
                    }; break;
                }
                if (this.type !== newValue) this.type = newValue;
            }; break;
            case "headline": {
                const p = this.shadowRoot.querySelector("header p");
                p.textContent = newValue;
                if (this.headline !== newValue) this.headline = newValue;
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
                }
                if (this.message !== newValue) this.message = newValue;
            }; break;
            case "placeholder": {
                if (this.getAttribute("type") === "prompt") {
                    const input = this.shadowRoot.querySelector("input");
                    input.placeholder = newValue;
                }
                if (this.placeholder !== newValue) this.placeholder = newValue;
            }; break;
            case "height": {
                this.style.setProperty("--dialog-height", parseFloat(newValue) + "px")
            }; break;
            case "width": {
                this.style.setProperty("--dialog-width", parseFloat(newValue) + "px")
            }; break;
        }
    }
    disconnectedCallback() {
        HTMLNonameDialogHTML.dialogStack.pop();
        const length = HTMLNonameDialogHTML.dialogStack.length;
        if (length) HTMLNonameDialogHTML.dialogStack[length - 1].show();
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
    /**
     * @param {string} value
     */
    set message(value) {
        this.setAttribute("message", value);
    }
    /**
     * @param {string} value
     */
    set headline(value) {
        this.setAttribute('headline', value);
    }
    /**
     * @param {string} value
     */
    set placeholder(value) {
        this.setAttribute("placeholder", value);
    }
    /**
     * @param {string} value 
     */
    set type(value) {
        this.setAttribute("type", value);
    }
}
customElements.define("noname-dialog", HTMLNonameDialogHTML);