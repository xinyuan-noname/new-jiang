export const EXTENSION_NAME = import.meta.url.split("/").find((_, index, list) => {
    return list[index - 1] === "extension"
});
console.log(EXTENSION_NAME);
export const EXTENSION_PATH =  `./extension/${EXTENSION_NAME}/`;