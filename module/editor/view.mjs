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
                            <span data-search-mode="character">武将</span>
                            <span data-search-mode="skill">技能</span>
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
    createCharacterCard(data) {
        const characterCard = document.createElement("xy-character-card");
        characterCard.setData(data);
        this.mainArea.appendChild(characterCard);
    }
    loadSideBarCharacter() {
        this.serveFor.getData("character", "all", 100);
    }
    listenSideBarCharacter() {
        const { sideBarCharacter } = this;
        const noneCharacterCardButton = sideBarCharacter.querySelector("button");
        noneCharacterCardButton.addEventListener("pointerdown", () => {
            this.createCharacterCard();
        });
    }
    //
    /**
     * 
     * @param {{audios:string[],id:string,name:string,description:string}} searchResult 
     * @param {{notLike:boolean,highlight:string[]}} config
     * @returns 
     */
    createSearchSkillListItem(searchResult, config) {
        let mainContent = searchResult.info;
        if (config.highlight) mainContent.replace(new RegExp(`${config.highlight.map(word => word.replace(/[.^$*+?{}\[\]\\|()]/g, "\\$&")).join("|")}`, "g"), "<mark>$&</mark>")

        const li = document.createElement("li");
        li.dataset.skillInfo = JSON.stringify(searchResult);
        li.dataset.skill = searchResult.id;
        li.innerHTML =
            `<div draggable="true">
                <div>${mainContent}</div>
                <ul>${searchResult.audios.map(audio => `<li data-audio-list-item>${audio}</li>`).join("")}</ul>
            </div>
            <div>
                <span class="xy-ED-use">⬅️</span>
                ${config.notLike === true ? '' : '<span class="xy-ED-like">❤️</span>'}
                <span class="xy-ED-remove">🗑️</span>
            </div>`
        return li.outerHTML;
    }
    listenSideBarSearch() {
        const { sideBarSearch } = this;
        const input = sideBarSearch.querySelector("input");
        const clearIcon = sideBarSearch.querySelector(".xy-ED-input-clear");
        const searchIcon = sideBarSearch.querySelector(".xy-ED-input-search");
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
        resultUl.addEventListener("pointerdown", e => {
            /**
             * @type {HTMLElement}
             */
            const node = e.target;
            if (node.classList.contains("xy-ED-remove")) node.parentElement.parentElement.remove();
            if (node.classList.contains("xy-ED-like")) {
                if (node.classList.contains("xy-ED-liked")) {
                    node.classList.remove("xy-ED-liked");
                    likedUl.querySelector(`[data-skill="${node.parentElement.parentElement.dataset.skill}"]`)?.remove?.();
                } else if (!node.classList.contains("xy-ED-liked")) {
                    node.classList.add("xy-ED-liked");
                    likedUl.innerHTML += this.createSearchSkillListItem(JSON.parse(node.parentElement.parentElement.dataset.skillInfo), { notLike: true });
                }
            }
        })
        likedUl.addEventListener("pointerdown", e => {
            const node = e.target;
            if (node.classList.contains("xy-ED-remove")) {
                node.parentElement.parentElement.remove();
                resultUl.querySelector(`[data-skill="${node.parentElement.parentElement.dataset.skill}"] .xy-ED-liked`)?.classList?.remove("xy-ED-liked");
            }
        })
        const config = {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        }
        const observer = new MutationObserver((mutationList) => {
            mutationList.forEach(() => {
                searchConcerningUls.forEach(ul => {
                    ul.parentElement.style.setProperty("--xy-ED-flex-index", getComputedStyle(ul).display === "none" ? "none" : 1)
                })
            });
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
            case "search": this.navsController.choose(this.sideBarSearch); break;
            case "card": this.navsController.choose(this.sideBarCard); break;
            case "setting": this.navsController.choose(this.sideBarSetting); break;
            case "character": this.navsController.choose(this.sideBarCharacter); break;
        }
        return this;
    }
    search(keyWords, type = "skill", { limit = 10 } = {}) {
        const ul = this.sideBarSearch.querySelector("ul");
        ul.scrollTo({ top: 0 });
        ul.innerHTML = "";
        let intersectionObserver;
        switch (type) {
            case "skill": {
                const appendItem = (searchResults) => {
                    ul.innerHTML += searchResults.map(result => {
                        return this.createSearchSkillListItem(result, { highlight: keyWords });
                    }).join("");
                    intersectionObserver?.disconnect?.()
                    intersectionObserver = new IntersectionObserver((entries) => {
                        if (entries[0].intersectionRatio <= 0) return;
                        const newSearchResults = this.serveFor.data.continueSearch("skill", limit);
                        if (newSearchResults.length) {
                            appendItem(newSearchResults);
                        } else {
                            intersectionObserver.disconnect();
                        }
                    }, { root: ul });
                    if (ul.lastElementChild) intersectionObserver.observe(ul.lastElementChild);
                    else intersectionObserver.disconnect();
                }
                appendItem(this.serveFor.data.search(keyWords, "skill", limit));
                return;
            }
        }
    }
    //
    send() {
    }
    receive() {
    }
}