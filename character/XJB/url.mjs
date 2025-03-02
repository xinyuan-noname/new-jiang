const urlObject = new URL(import.meta.url);
const dirPath = urlObject.pathname.replace("url.mjs", "");
const extPath = dirPath.replace("/extension", "ext:");
export default dirPath;
export { extPath };