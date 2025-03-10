"use script";
import { NonameEditorData } from "./data.mjs";
import { NonameEditorView } from "./view.mjs";

export class NonameEditor {
    view;
    data;
    constructor() {
        const view = new NonameEditorView();
        const data = new NonameEditorData();
        this.view = view;
        this.data = data;
    }
    init(parentNode) {
        this.view.init(parentNode);
        this.data.link(this.view);
    }
}