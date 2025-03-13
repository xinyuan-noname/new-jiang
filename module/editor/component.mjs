import { NonameEditorData } from "./data.mjs";

class HTMLCharacterCardElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        //$: shadow , html/character-card.html//
shadow.innerHTML=`
<style>
    :host {
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 10px;
        border: 5px solid black;
    }

    :host>div {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
    }

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

    [data-setting="avatar"]>div::after {
        position: absolute;
        background: inherit;
        width: 100%;
        height: 100%;
        z-index: 100;
    }
</style>

<header></header>
<div>
    <div data-setting="avatar" data-required="true">
        <input type="file" accept="image/*"></input>
        <div>请选择或拖入文件</div>
    </div>
    <div>
        <div data-setting="name" data-name="" data-required="true"></div>
        <div data-setting="id" data-id=""></div>
        <div data-setting="sex" data-sex=""></div>
        <div data-setting="group" data-group=""></div>
        <div data-setting="hp" data-hp="" data-maxHp=""></div>
        <div data-setting="hujia" data-hujia=""></div>
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
        this.update();
    }
    listenAvatar() {
        /**
         * @type {HTMLDivElement}
         */
        const avatar = this.shadowRoot.querySelector('[data-setting="avatar"]>div');
        /**
         * @type {HTMLInputElement}
         */
        const input = this.shadowRoot.querySelector('[data-setting="avatar"]>input');
        const showFile = async (file) => {
            const imgData = await NonameEditorData.readFile(file, "url");
            avatar.style.backgroundImage = `url(${imgData})`;
        }
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => avatar.addEventListener(event, e => (e.preventDefault(), e.stopPropagation()), false));
        avatar.addEventListener("pointerdown", () => input.click());
        avatar.addEventListener("drop", e => {
            if (e?.dataTransfer?.files?.[0]) {
                showFile(e.dataTransfer.files[0]);
            }
        });
        input.addEventListener("change", () => {
            if (input.files[0] instanceof File) showFile(input.files[0]);
        })
    }
    update() {
    }
    getData() {
    }
    setData(data) {
        if (typeof data !== "object") return;
        const { } = data;
    }
}
customElements.define("xy-character-card", HTMLCharacterCardElement);