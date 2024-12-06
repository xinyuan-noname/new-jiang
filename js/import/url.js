const RootUrl = location.origin;
const DirUrl = location.pathname;
const initWay = localStorage.getItem("noname_inited");
export const getURL = (extensionName) => {
    let gameURL, fileURL
    if (RootUrl.startsWith("https://")) {
        gameURL = `${RootUrl}/extension/${extensionName}/`;
        fileURL = `${initWay}extension/${extensionName}/`;
    } else if (RootUrl.startsWith("file://") && initWay === "nodejs") {
        gameURL = fileURL = `${RootUrl}${DirUrl.replace('index.html', '')}extension/${extensionName}/`;
    }
    return [gameURL, fileURL];
}
export const getGameURL = (extensionName) => {
    let gameURL = "";
    if (RootUrl.startsWith("https://")) {
        gameURL = `${RootUrl}/extension/${extensionName}/`;
    } else if (RootUrl.startsWith("file://") && initWay === "nodejs") {
        gameURL = `${RootUrl}${DirUrl.replace('index.html', '')}extension/${extensionName}/`;
    }
    return gameURL
}
export const getFileURL = (extensionName) => {
    let fileURL = "";
    if (RootUrl.startsWith("https://")) {
        fileURL = `${initWay}extension/${extensionName}/`;
    } else if (RootUrl.startsWith("file://") && initWay === "nodejs") {
        fileURL = `${RootUrl}${DirUrl.replace('index.html', '')}extension/${extensionName}/`;
    }
    return fileURL
}
export const EXTENSION_NAME_URL = import.meta.url.split("/").find((_, index, list) => {
    return list[index - 1] === "extension"
});
export const EXTENSION_NAME = decodeURIComponent(EXTENSION_NAME_URL);
export const EXTENSION_GAME_URL = getGameURL(EXTENSION_NAME);
export const EXTENSION_FILE_URL = getGameURL(EXTENSION_NAME);