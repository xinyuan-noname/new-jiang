import { NonameEditorView } from "./view.mjs";

export class NonameEditor {
    view;
    constructor() {
        const view = new NonameEditorView();
        this.view = view;
    }
}