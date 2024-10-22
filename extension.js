import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../noname.js";
import { XJB_CONTENT } from "./content.js";
import { XJB_PRECONTENT } from "./precontent.js";
game.import("extension", function () {
    return {
        name: "新将包",
        content: XJB_CONTENT,
        precontent: XJB_PRECONTENT,
        editable: false,
        help: {},
        config: {},
        package: {
            intro: "<a href=https://gitee.com/xinyuanwm/new-jiang class=xjb_hunTitle>扩展已上传至gitee！</a>",
            author: "<a href=https://b23.tv/RHn9COW class=xjb_hunTitle>新元noname</a>",
            diskURL: "",
            forumURL: "",
            version: "1.2.1",
        },
        files: { "character": [], "card": [], "skill": [], "audio": [] }
    }
});