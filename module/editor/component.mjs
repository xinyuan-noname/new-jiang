class HTMLCharacterCardElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        //$: shadow , html/character-card.html//
        shadow.innerHTML = `
`
        //#: shadow , html/character-card.html//
    }
}
customElements.define("xy-character-card", HTMLCharacterCardElement);