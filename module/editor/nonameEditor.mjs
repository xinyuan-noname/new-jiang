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
        view.serveFor = this;
        data.serveFor = this;
    }
    init(parentNode) {
        this.view.init(parentNode);
    }
    getData(){
        this.data.getData();
    }
}