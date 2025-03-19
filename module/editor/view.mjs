"use script";
import "./component.mjs";
import { UniqueChoiceManager, DragManager, toggleMultiClass } from "./encapsulated.mjs";
/**
 * @typedef {import("./nonameEditor.mjs").NonameEditor NonameEditor}
 */
export class NonameEditorView {
    /**
     * @type {HTMLDivElement}
     */
    mainPage;

    /**
     * @type {NonameEditor}
     */
    serveFor;
    /**
     * @type {UniqueChoiceManager}
     */
    navsController;
    /**
     * @type {HTMLDivElement}
     */
    get minimizeControl() {
        return this.mainPage.querySelector(".xy-ED-minimizeControl");
    }
    /**
     * @type {HTMLDivElement}
     */
    get operationPage() {
        return this.mainPage.querySelector(".xy-ED-operationPage");
    }
    /**
     * @type {HTMLDivElement}
     */
    get h_minimize() {
        return this.mainPage.querySelector(".xy-ED-control-minize");
    }
    /**
     * @type {HTMLDivElement}
    */
    get h_close() {
        return this.mainPage.querySelector(".xy-ED-control-close");
    }
    /**
     * @type {HTMLDivElement}
    */
    get viewArea() {
        return this.mainPage.querySelector(".xy-ED-viewArea");
    }
    /**
     * @type {HTMLDivElement}
    */
    get sideBar() {
        return this.mainPage.querySelector(".xy-ED-viewArea>sideBar");
    }
    /**
     * @type {HTMLDivElement}
    */
    get mainArea() {
        return this.mainPage.querySelector(".xy-ED-mainArea");
    }
    /**
     * @type {HTMLHRElement}
    */
    get resizeLine() {
        return this.mainPage.querySelector(".xy-ED-viewArea>.xy-ED-sideBar>hr");
    }
    /**
     * @type {HTMLElement}
    */
    get nav() {
        return this.mainPage.querySelector(".xy-ED-viewArea>.xy-ED-sideBar>nav");
    }
    get navSearch() {
        return this.nav.querySelector(".xy-ED-nav-search")
    }
    get navCharacter() {
        return this.nav.querySelector(".xy-ED-nav-character")
    }
    get navSetting() {
        return this.nav.querySelector(".xy-ED-nav-setting")
    }
    get navCard() {
        return this.nav.querySelector(".xy-ED-nav-card")
    }
    /**
     * @type {NodeListOf<HTMLElement>}
    */
    get navs() {
        return this.mainPage.querySelectorAll(".xy-ED-viewArea>.xy-ED-sideBar>nav>*");
    }
    /**
     * @type {HTMLElement}
    */
    get sideBarContent() {
        return this.mainPage.querySelector(".xy-ED-sideBar>.xy-ED-sideBar-content");
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarSetting() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-setting")
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarCharacter() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-character")
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarCard() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-card")
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarSearch() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-search")
    }
    /**
     * @type {NodeListOf<HTMLElement>}
    */
    get sideBarContents() {
        return this.mainPage.querySelectorAll(".xy-ED-sideBar>.xy-ED-sideBar-content>*");
    }
    /**
     * @type {NodeListOf<HTMLElement>}
     */
    get expanables() {
        return this.viewArea.querySelectorAll("[class^=xy-ED-expandable]");
    }
    constructor() {
        const mainPage = document.createElement("div");
        mainPage.classList.add("xy-ED-nonameEditor")
        this.mainPage = mainPage;
    }
    /**
     * @param {HTMLElement} parentNode 
     */
    init(parentNode) {
        const mainPage = this.mainPage;
        //$: mainPage , html/index.html//
mainPage.innerHTML=`
<div class="xy-ED-minimizeControl" draggable>魂</div>
<div class="xy-ED-operationPage">
    <header>
        <div class="xy-ED-header-left">
            <div class="xy-ED-title">魂氏编辑器</div>
        </div>
        <div class="xy-ED-header-right">
            <div class="xy-ED-control-minize"></div>
            <div class="xy-ED-control-close"></div>
        </div>
    </header>
    <div class="xy-ED-viewArea">
        <div class="xy-ED-mainArea">
        </div>
        <div class="xy-ED-sideBar">
            <hr>
            <div class="xy-ED-sideBar-content">
                <div class="xy-ED-sideBar-setting" data-by="setting"></div>
                <div class="xy-ED-sideBar-character" data-by="character">
                    <div class="xy-ED-nocharacterCard">
                        <div>暂未创建过武将!</div>
                        <button>点击创建</button>
                    </div>
                    <div class="xy-ED-characte-show">
                        <header></header>
                        <ul></ul>
                    </div>
                </div>
                <div class="xy-ED-sideBar-card" data-by="card"></div>
                <div class="xy-ED-sideBar-search" data-by="search">
                    <div class="xy-ED-input-container">
                        <div>
                            <input spellcheck="false" placeholder="这里输入搜索的资源">
                            <span class="xy-ED-input-clear"></span>
                            <span class="xy-ED-input-search"></span>
                        </div>
                        <div class="xy-ED-search-mode-controller">
                            <span data-search-mode="skill">技能</span>
                            <span data-search-mode="character">武将</span>
                        </div>
                    </div>
                    <hr>
                    <div class="xy-ED-search-concerning">
                        <div class="xy-ED-searchResult">
                            <header>
                                <div class="xy-ED-expandable-expanded" data-for=search-result></div>
                                <div>搜索结果</div>
                            </header>
                            <ul data-by=search-result></ul>
                        </div>
                        <div class="xy-ED-searchLiked">
                            <header>
                                <div class="xy-ED-expandable-expanded" data-for=search-like></div>
                                <div>已收藏</div>
                            </header>
                            <ul data-by=search-like></ul>
                        </div>
                    </div>
                </div>
            </div>
            <nav>
                <div class="xy-ED-nav-setting" data-for="setting" draggable="true"></div>
                <div class="xy-ED-nav-character" data-for="character" draggable="true"></div>
                <div class="xy-ED-nav-card" data-for="card" draggable="true"></div>
                <div class="xy-ED-nav-search" data-for="search" draggable="true"></div>
            </nav>
        </div>
    </div>
</div>`
//#: mainPage , html/index.html//
        parentNode.appendChild(mainPage);
        this.listenPageClose();
        this.listenPageMinize();
        //
        this.listenSideBarResize();
        //
        this.listenMainAreaChange()
        //
        this.listenSideBarCharacter();
        this.listenSideBarSearch();
        //
        this.listenNavsReOrder();
        this.listenNavChoose();
        //
        this.listenSearchEvent()
        //
        this.listenExpanable();
    }
    //
    listenPageClose() {
        this.h_close.addEventListener("pointerup", () => {
            this.mainPage.remove();
        })
    }
    listenPageMinize() {
        const { h_minimize, minimizeControl, operationPage, mainPage } = this;
        const dragManager = new DragManager(mainPage, minimizeControl)
            .beDraggable();
        const nodeMap = new WeakMap([
            [h_minimize, operationPage],
            [minimizeControl, minimizeControl]
        ])
        new UniqueChoiceManager(h_minimize, minimizeControl)
            .forClassByNodeMap(nodeMap, "xy-ED-hidden")
            .listenAllNodes("pointerup", () => !dragManager.dragStatus.isDragging)
            .choose(minimizeControl);
    }
    //
    listenMainAreaChange() {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    this.mainArea.className = this.mainArea.className.replace(/xy-ED-grid-(one|two|three|four)item/, "");
                    switch (this.mainArea.children.length) {
                        case 1:
                            this.mainArea.classList.add('xy-ED-grid-oneitem');
                            break;
                        case 2:
                            this.mainArea.classList.add('xy-ED-grid-twoitem');
                            break;
                        case 3:
                            this.mainArea.classList.add('xy-ED-grid-threeitem');
                            break;
                        default:
                            this.mainArea.classList.add('xy-ED-grid-fouritem');
                            break;
                    }
                }
            }
        });
        observer.observe(this.mainArea, { attributes: false, childList: true, subtree: false });
    }
    //
    listenSideBarResize() {
        const { viewArea, resizeLine } = this;
        const resizeStatus = {
            isResizing: false,
            frame: null
        }
        viewArea.addEventListener("pointerdown", e => {
            if (e.target !== resizeLine) return;
            resizeStatus.isResizing = true;
        })
        viewArea.addEventListener("pointermove", e => {
            if (!resizeStatus.isResizing) return;
            if (this.frame) cancelAnimationFrame(this.frame);
            this.frame = requestAnimationFrame(() => {
                let r = e.clientX / devicePixelRatio / viewArea.clientWidth;
                viewArea.style.setProperty("--xy-ED-WidthRatio", (1 - r) / r);
                this.frame = null;
            })
        });
        viewArea.addEventListener("pointerup", () => {
            if (!resizeStatus.isResizing) return;
            resizeStatus.isResizing = false;
        });
    }
    //
    createCharacterEditor(data) {
        const characterEditor = document.createElement("character-editor");
        this.mainArea.appendChild(characterEditor);
    }
    loadSideBarCharacter() {
        this.serveFor.getData("character", "all", 100);
    }
    listenSideBarCharacter() {
        const { sideBarCharacter } = this;
        const noneCharacterCardButton = sideBarCharacter.querySelector("button");
        noneCharacterCardButton.addEventListener("pointerdown", () => {
            this.createCharacterEditor();
        });
    }
    //
    /**
     * @typedef {{
     *      noLike:boolean,
     *      noDelete:boolean,
     *      highlight:string[],
     *      useFor:HTMLElement
     * }}  searchResultItemConfig
     */
    /**
     * @param {{id:string}} searchResult 
     * @param {searchResultItemConfig} config
     * @returns 
     */
    createSearchSkillListItem(searchResult, config = {}) {
        const skillCard = document.createElement("skill-card");
        const { noLike, noDelete, highlight, useFor } = config;
        skillCard.setAttribute("skill-id", searchResult.id);
        skillCard.setAttribute("skill-info", JSON.stringify(searchResult));
        if (!noLike) skillCard.setAttribute("likable", true);
        if (!noDelete) skillCard.setAttribute("removable", true);
        skillCard.setAttribute("usable", true);
        skillCard.markTextNode(".main-content", highlight, { root: "shadowRoot" });
        if (useFor) {
            skillCard.useForNode = useFor;
            skillCard.setAttribute("useFor", useFor.id);
        }
        return skillCard;
    }
    /**
     * @param {{id:string}} searchResult 
     * @param {searchResultItemConfig} config 
     * @returns 
     */
    createSearchCharacterListItem(searchResult, config = {}) {
        const characterCard = document.createElement("character-card");
        const { noLike, noDelete, highlight, useFor } = config;
        characterCard.setAttribute("character-id", searchResult.id);
        characterCard.setAttribute("character-info", JSON.stringify(searchResult));
        if (!noLike) characterCard.setAttribute("likable", true);
        if (!noDelete) characterCard.setAttribute("removable", true);
        characterCard.setAttribute("skill-likable", true);
        characterCard.setAttribute("skill-usable", true);
        characterCard.setAttribute("usable", true);
        characterCard.markTextNode(".main-content", highlight, { root: "shadowRoot" });
        if (useFor) {
            skillCard.useForNode = useFor;
            skillCard.setAttribute("useFor", useFor.id);
        }
        return characterCard;
    }
    listenSideBarSearch() {
        const { sideBarSearch } = this;
        const input = sideBarSearch.querySelector("input");
        const clearIcon = sideBarSearch.querySelector(".xy-ED-input-clear");
        const searchIcon = sideBarSearch.querySelector(".xy-ED-input-search");
        const searchModeControllerButtons = sideBarSearch.querySelectorAll("[data-search-mode]");
        const searchConcerning = sideBarSearch.querySelector(".xy-ED-search-concerning");
        const searchConcerningUls = Array.from(searchConcerning.querySelectorAll(":scope>div>ul"));
        const [resultUl, likedUl] = searchConcerningUls;
        let type = "skill";
        input.addEventListener("keydown", async e => {
            if (e.key !== "Enter") return;
            this.search(input.value.split(/[ +]/g), type);
        });
        searchIcon.addEventListener("pointerdown", async e => {
            this.search(input.value.split(/[ +]/g), type);
        });
        clearIcon.addEventListener("pointerdown", () => (input.value = ""));
        new UniqueChoiceManager(...searchModeControllerButtons)
            .setCallback((last, now, funMap) => {
                funMap.forClass("xy-ED-chosen");
                type = now.dataset.searchMode;
            })
            .listenSiblings("pointerdown")
            .choose(searchModeControllerButtons[0])
        //
        resultUl.addEventListener("like", e => {
            const node = e.detail?.from;
            if (node?.tagName === "SKILL-CARD") {
                const appendNode = node.cloneNode();
                appendNode.setAttribute("likable", false);
                appendNode.setAttribute("removable", true);
                likedUl.prepend(appendNode);
            } else if (node.tagName === "") {

            }
        });
        resultUl.addEventListener("likeCancel", e => {
            const node = e.detail?.from;
            if (node?.tagName === "SKILL-CARD") {
                likedUl.querySelector(`[skill-id="${node.getAttribute("skill-id")}"]`)?.remove();
            } else if (node.tagName === "") {

            }
        });
        likedUl.addEventListener("remove", e => {
            const node = e.detail?.from;
            if (node?.tagName === "SKILL-CARD") {
                resultUl.querySelector(`[skill-id="${node.getAttribute("skill-id")}"]`)?.triggerInteractEvent("like");
            }
        });
        const config = {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        }
        const observer = new MutationObserver(() => {
            requestAnimationFrame(() => {
                searchConcerningUls.forEach(ul => {
                    ul.parentElement.style.setProperty("--xy-ED-flex-index", getComputedStyle(ul).display === "none" ? 0 : 1);
                })
            })
        })
        searchConcerningUls.forEach(ul => {
            observer.observe(ul, config);
        })
    }
    //
    listenNavsReOrder() {
        let draggingNode = null;
        this.navs.forEach(node => {
            node.addEventListener("dragstart", e => (draggingNode = e.target));
            node.addEventListener("dragover", e => {
                e.preventDefault()
                const navArray = Array.from(this.navs)
                let i = navArray.indexOf(draggingNode),
                    j = navArray.indexOf(e.target);
                i < j ?
                    this.nav.insertBefore(e.target, draggingNode) : this.nav.insertBefore(draggingNode, e.target);
            });
        })
    }
    listenNavChoose() {
        const navsArray = Array.from(this.navs).map(node => [node, new Map([
            [node, ["xy-ED-nav-chosen"]],
            [this.sideBarContent.querySelector(`[data-by=${node.dataset.for}]`), ["xy-ED-shown-flex"]]
        ])]);
        this.navsController = new UniqueChoiceManager(...this.navs)
            .listenSiblings("pointerup")
            .forClassByNodeClassMap(new WeakMap(navsArray))
    }
    //
    listenSearchEvent() {
        const viewArea = this.viewArea;
        viewArea.addEventListener("searchSkill", (e) => {
            const { from, keyWords, toggleNav } = e.detail;
            if (toggleNav === true) {
                this.toggleNav("search");
                this.search(keyWords, "skill", { requestFrom: from });
            }
        })
    }
    //
    listenExpanable() {
        this.expanables.forEach(node => {
            const linkedNodes = this.operationPage.querySelectorAll(`[data-by= ${node.dataset.for}]`)
            const manager = toggleMultiClass(node, "xy-ED-expandable-expanded", "xy-ED-expandable-collapsed");
            node.addEventListener("pointerdown", (e) => {
                linkedNodes.forEach(linkedNode => {
                    linkedNode.classList.toggle("xy-ED-hidden");
                })
                if (node.classList.contains("xy-ED-expandable-expanded")) {
                    manager.single("xy-ED-expandable-collapsed");
                } else if (node.classList.contains("xy-ED-expandable-collapsed")) {
                    manager.single("xy-ED-expandable-expanded");
                }
            })
        })
    }
    /**
     * @param {"search"|"card"|"setting"|"character"} navName 
     * @returns 
     */
    toggleNav(navName) {
        switch (navName) {
            case "search": this.navsController.choose(this.navSearch); break;
            case "card": this.navsController.choose(this.navCard); break;
            case "setting": this.navsController.choose(this.navSetting); break;
            case "character": this.navsController.choose(this.navCharacter); break;
        }
        return this;
    }
    /**
     * 
     * @param {string[]} keyWords 
     * @param {"skill"|"character"} type 
     * @returns 
     */
    search(keyWords, type = "skill", { limit = 10, requestFrom } = {}) {
        const ul = this.sideBarSearch.querySelector("ul");
        ul.scrollTo({ top: 0 });
        ul.innerHTML = "";
        if (keyWords.every(word => word == "")) return;
        let intersectionObserver;
        const appendChildrenMethod = (() => {
            const config = { highlight: keyWords, useFor: requestFrom }
            switch (type) {
                case "skill": {
                    return (searchResults) => {
                        return searchResults.map(result => this.createSearchSkillListItem(result, config));
                    }
                }
                case "character": {
                    return (searchResults) => {
                        return searchResults.map(result => this.createSearchCharacterListItem(result, config));
                    }
                }
            }
        })()
        const appendItem = (searchResults) => {
            ul.append(...appendChildrenMethod(searchResults));
            intersectionObserver?.disconnect?.()
            intersectionObserver = new IntersectionObserver((entries) => {
                if (entries[0].intersectionRatio <= 0) return;
                const newSearchResults = this.serveFor.data.continueSearch(type, limit);
                if (newSearchResults.length) {
                    appendItem(newSearchResults);
                } else {
                    intersectionObserver.disconnect();
                }
            }, { root: ul });
            if (ul.lastElementChild) intersectionObserver.observe(ul.lastElementChild);
            else intersectionObserver.disconnect();
        }
        appendItem(this.serveFor.data.search(keyWords, type, limit));
        return;
    }
}