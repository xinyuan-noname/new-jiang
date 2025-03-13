export class NonameEditorData {
    view;
    constructor() {
    }
    getData() { }
    static async readFile(file, type = "text", encoding) {
        if (!(file instanceof File)) throw new Error(file + "is not a file.");
        return new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.addEventListener("loadend", e => {
                resolve(e.target.result);
            })
            switch (type) {
                case "text": fileReader.readAsText(file, encoding); break;
                case "arrayBuffer": fileReader.readAsArrayBuffer(file); break;
                case "URL": case "url": fileReader.readAsDataURL(file); break;
            }
        })
    }
}