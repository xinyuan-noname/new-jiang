const TEXT_EXT = [
    "LICENSE",
    ".txt",
    ".js",
    ".mjs",
    ".cjs",
    ".ts",
    ".vue",
    ".css",
    ".html",
    ".htm",
    ".json",
    ".md"
];
const IMAGE_EXT = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.svg',
    '.webp',
    '.ico'
];
const AUDIO_EXT = [
    '.mp3',
    '.weba',
    '.wav',
    '.ogg',
    '.m4a'
];
const VIDEO_EXT = [
    '.mp4',
    '.webm',
    '.mov'
];
const EXT_LIST = {
    text: TEXT_EXT,
    image: IMAGE_EXT,
    audio: AUDIO_EXT,
    video: VIDEO_EXT,
    all: "all"
}
const DECODER = new TextDecoder('utf-8');
const ENCODER = new TextEncoder();
const matchLastSlash = /\/(?=[^/]*$)/;
const matchCR = /\r(?=\n)/g;
const matchLF = /(?<!\r)\n/g;
class Manager {
    init(target) {
        this.target = target;
        this.eventMap = {
            start: [],
            end: [],
            error: [],
            progressErr: [],
            phaseBegin: [],
            phaseEnd: []
        };
        if (!this.options) this.options = {};
        if (!this.options.cancel) this.options.cancel = []
        if (!this.options.skip) this.options.skip = []
        this.errorRecord = [];
        this.phaseList = ["start", "end"];
        this.status = "prepare";
        this.phase = "";
        this.finished = [];
        this.data = {};
    }
    registerEvents(...names) {
        for (const name of names) {
            if (!(name in this.eventMap)) this.eventMap[name] = [];
            if (name === "recover") {
                this.eventMap.recoverSuc = [];
                this.eventMap.recoverErr = [];
            } else if (name === "makeSureDir") {
                this.eventMap.makeSureDirSuc = [];
                this.eventMap.makeSureDirErr = [];
            } else if (name === "fixFile") {
                this.eventMap.fixFileSuc = [];
                this.eventMap.fixFileErr = [];
            }
        }
    }
    appendPhases(...phases) {
        this.phaseList.splice(-1, 0, ...phases);
        this.registerEvents(...phases);
    }
    on(eventName, callback, options = {}) {
        if (!(eventName in this.eventMap)) return;
        const { firstDo } = options;
        if (typeof callback === "function") {
            if (firstDo) {
                this.eventMap[eventName].unshift(callback);
            } else {
                this.eventMap[eventName].push(callback);
            }
        }
    }
    remove(eventName, callback) {
        if (eventName in this.eventMap) {
            const index = this.eventMap[eventName].indexOf(callback);
            if (index !== -1) {
                this.eventMap[eventName].splice(index, 1);
            }
        }
    }
    trigger(eventName, output, ...args) {
        if (eventName in this.eventMap && this.eventMap[eventName].length) {
            if (!output) output = this.data;
            let promiseChain = Promise.resolve();
            for (const func of this.eventMap[eventName]) {
                promiseChain = promiseChain.then(async () => {
                    await func(output, ...args);
                });
            }
            return promiseChain;
        }
    }
    cancel(...args) {
        for (const phaseName of args) {
            if (this.phaseList.includes(phaseName)) this.options.cancel.push(phaseName);
        }
    }
    skip(...args) {
        for (const phaseName of args) {
            if (this.phaseList.includes(phaseName)) this.options.skip.push(phaseName);
        }
    }
    skipFromTo(from, to) {
        const fromIndex = this.phaseList.indexOf(from);
        if (fromIndex === -1) return;
        const toIndex = this.phaseList.indexOf(to);
        toIndex <= fromIndex ?
            this.skip(this.phaseList.slice(fromIndex, toIndex + 1)) :
            this.skip(this.phaseList.slice(fromIndex));
    }
    skipped(phaseName) {
        if (this.phaseList.includes(phaseName)) {
            const index = this.options.skip.indexOf(phaseName);
            if (index !== -1) {
                this.options.skip.splice(index, 1);
            }
        }
    }
    start() {
        this.status = "progress";
    }
    end() {
        this.status = "finish";
    }
    async launchPhase(phaseName) {
        if (this.phaseList.includes(phaseName)) {
            if (this.options.cancel.includes(phaseName) || this.finished.includes(phaseName)) return;
            if (this.options.skip.includes(phaseName)) {
                this.skipped(phaseName);
                return;
            }
            await this.trigger("phaseBegin");
            this.phase = phaseName;
            await this[phaseName]();
            if (phaseName !== "start" && phaseName !== "end") {
                this.finished.push(phaseName);
            }
            await this.trigger(phaseName);
            await this.trigger("phaseEnd");
        }
    }
    async executeLine() {
        try {
            for (const phaseName of this.phaseList) {
                await this.launchPhase(phaseName);
            }
        } catch (err) {
            this.status = "error";
            this.errorRecord.push({ phase: this.phase, status: this.status, error: err, time: new Date() });
            await this.trigger("progressErr", err, this.data);
            await this.trigger("error", err, this.data);
        }
    }
    reExecuteLine(from = "start", before) {
        const index = this.phaseList.indexOf(from);
        if (index === -1) return;
        const mayFinished = this.phaseList.slice(0, index);
        this.finished = this.finished.filter(phase => {
            return mayFinished.includes(phase);
        });
        before?.(this);
        return this.executeLine();
    }
}
class UpdateManager extends Manager {
    init(target) {
        super.init(target);
        this.appendPhases("getCache");
    }
    async getCache() {
        const { rmCR } = this.options;
        const cacheMap = await this.target.cache();
        const cacheHashMap = await this.target.getHashMap(cacheMap, rmCR);
        this.data.cacheMap = cacheMap;
        this.data.cacheHashMap = cacheHashMap;
    }
    async makeSureDir() {
        const { dirList } = this.data;
        await this.target.makeSureDir(
            dirList,
            async dir => {
                this.data.processingDir = dir;
                this.trigger("makeSureDirSuc");
            },
            async (err, dir) => {
                this.data.processingDir = dir;
                await this.trigger("makeSureDirErr", err, this.data);
                await this.trigger("error", err, this.data);
            }
        )
    }

    async recover() {
        const { toRecoverFileMap } = this.data;
        if (!toRecoverFileMap?.size) return;
        this.status = "recover";
        await this.target.recover(
            toRecoverFileMap,
            async file => {
                this.trigger("recoverSuc", file);
            },
            async err => {
                this.status = "recoverError";
                await this.trigger("recoverErr", err, this.data);
                await this.trigger("error", err, this.data);
            }
        );
        await this.trigger("recover", toRecoverFileMap);
        this.status = "recoverEnd";
    }

    async fixFile() {
        const { updateInfo } = this.data;
        const { replacee, replacer } = this.options;
        const toFixFileList = updateInfo?.succeededFiles?.filter?.(file => TEXT_EXT.some(ext => file.endsWith(ext)));
        if (!toFixFileList?.length) return;
        this.data.toFixFileList = toFixFileList;
        await this.target.fixFile(
            toFixFileList,
            replacee,
            replacer,
            async info => {
                this.data.fixingFileInfo = info;
                await this.trigger("fixFileSuc");
            },
            async err => {
                await this.trigger("fixFileErr", err, this.data);
                await this.trigger("error", err, this.data);
            }
        );
    }
    static updateUI(parent, titleText = "") {
        const back = document.createElement("div");
        back.style.cssText =
            `background-color: rgba(0, 0, 0, 0.3);
            box-shadow: 10px 5px 5px rgba(0,0,0,0.3);
            height: 25%;
            width: 50%;
            margin: auto auto;
            top: 20%;
            bottom: 0;
            left: 0;
            right: 0;
            position: absolute;
            z-index: 10;
            border-radius: 5%;
            display:flex;
            flex-direction: column;
            text-align:center;
            padding:10px;`;
        const title = document.createElement("h4");
        title.innerHTML = titleText;
        const statusText = document.createElement("div");
        statusText.innerHTML = "更新准备中";
        statusText.style.cssText =
            `position:relative;
            font-size:calc(1em + 5px);`
        const progress = document.createElement("div");
        progress.style.cssText = "position:relative;";
        const progressBar = document.createElement("progress");
        progressBar.value = 0;
        progressBar.max = 100;
        progressBar.style.cssText =
            `position: relative;
            margin: 20px auto;
            height: calc( 1em + 5px);`;
        const progressPercentage = document.createElement("div");
        progressPercentage.innerHTML = "-0%-";
        progressPercentage.style.cssText = "position:relative;";
        progress.append(progressBar, progressPercentage);
        back.append(title, statusText, progressBar);
        if (parent) parent.appendChild(back);
        return {
            back,
            title,
            statusText,
            progress,
            changeProgress: (percentage) => {
                if (percentage > 1) percentage = 1;
                percentage *= 100;
                progressBar.value = percentage;
                progressPercentage = percentage.toFixed(2) + "%";
            },
            animate: (callback) => {
                if (typeof callback !== "function") throw new Error("Callback should be a function.");
                let animation, anmiationRunning;
                const animationLoop = () => {
                    if (!anmiationRunning) return;
                    animation = requestAnimationFrame(() => {
                        callback();
                        animationLoop();
                    })
                }
                return {
                    start: () => {
                        anmiationRunning = true;
                        animationLoop();
                    },
                    end: () => {
                        anmiationRunning = false;
                        cancelAnimationFrame(animation)
                    }
                }
            }
        }
    }
}
export class Updater {
    globalVar;
    extensionName;
    extensionPath;
    constructor(extensionName) {
        if (!extensionName) throw new Error("传入参数不全！缺少extensionName");
        this.extensionName = extensionName;
        this.extensionPath = `extension/${this.extensionName}`;
    }
    setData(lib, game, ui, get, ai, _status) {
        this.globalVar = { lib, game, ui, get, ai, _status };
        return this;
    }
    //
    linkPath(...parts) {
        return parts.filter(Boolean).join("/");
    }
    getExtsInOrder(arr) {
        let i = 0;
        return () => {
            return EXT_LIST[arr[i++]];
        }
    }
    async readDir(path, fileTree = [], ignoreFile, ignoreDir, ignoreExt) {
        const { game } = this.globalVar;
        await new Promise(res => {
            game.getFileList(this.linkPath(this.extensionPath, path), async (folders, files) => {
                if (files.length) files.forEach(file => {
                    if (ignoreFile && (ignoreFile.includes(file) || ignoreFile.includes(this.linkPath(path, file)))) return;
                    if (ignoreExt && ignoreExt.some(ext => file.endsWith("." + ext))) return;
                    fileTree.push(this.linkPath(path, file));
                });
                if (folders.length) {
                    await Promise.all(folders.map(folder => {
                        if (ignoreDir && (ignoreDir.includes(folder) || ignoreDir.includes(this.linkPath(path, folder)))) return;
                        return this.readDir(this.linkPath(path, folder), fileTree, ignoreFile, ignoreDir);
                    }))
                }
                res();
            })
        }).catch(error => {
            throw error
        });
        return fileTree.sort((a, b) => a - b);
    }
    async readDirDefault(ignoreFile, ignoreDir, ignoreExt) {
        return this.readDir(void 0, void 0, ignoreFile, ignoreDir, ignoreExt);
    }
    async cache(fileList) {
        if (!fileList) fileList = await this.readDirDefault();
        const { game } = this.globalVar;
        return new Map(await Promise.all(
            fileList.map(file => {
                return Promise.all([
                    file,
                    new Promise((res, rej) => {
                        game.readFile(this.linkPath(this.extensionPath, file), res, rej)
                    }).catch(error => {
                        console.error(`Failed to read file ${file}`);
                        throw error;
                    })
                ])
            })
        ));
    }
    async getHash(path, data, rmCR, type = "SHA-256") {
        const hashBuffer = await new Promise(async (res) => {
            if (rmCR && TEXT_EXT.some(ext => path.endsWith(ext))) {
                data = ENCODER.encode(DECODER.decode(new Uint8Array(data)).replace(matchCR, ""));
            }
            res(crypto.subtle.digest(type, data));
        });
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    async getFileHash(path, rmCR, type) {
        let data = await game.promises.readFile(path);
        await this.getHash(path, data, rmCR, type);
    }
    async getHashMap(bufferMap, rmCR, type) {
        if (!bufferMap) throw new Error("未传入bufferMap！")
        return new Map(
            await Promise.all(
                Array.from(bufferMap).map(([name, data]) => {
                    return Promise.all([
                        name,
                        this.getHash(name, data, rmCR, type)
                    ])
                })
            )
        );
    }
    async getCacheHashMap(rmCR, type, fileList) {
        const cacheMap = await this.cache(fileList);
        return await this.getHashMap(cacheMap, rmCR, type);
    }
    async makeSureDir(dirList, onsuc, onerr) {
        if (!dirList) return;
        const { game } = this.globalVar;
        const filteredDirList = []
        await Promise.all(
            dirList.map(async dir => {
                try {
                    const code = await game.promises.checkDir(this.linkPath(this.extensionPath, dir));
                    if (code === -1) filteredDirList.add(dir)
                } catch (err) {
                    onerr?.(err, dir)
                }
            })
        )
        await Promise.all(
            Array.from(filteredDirList).map(async dir => {
                try {
                    await game.promises.createDir(this.linkPath(this.extensionPath, dir));
                    onsuc?.(dir);
                } catch (err) {
                    onerr?.(err, dir);
                }
            })
        )
    }
    async fixFile(fileList, replacee, replacer, onsuc, onerr) {
        const { game } = this.globalVar;
        await Promise.all(fileList.map(async file => {
            const [dir, fileName] = file.includes("/") ? file.split(matchLastSlash) : ["", file];
            const textData = await game.promises.readFileAsText(this.linkPath(this.extensionPath, file));
            const replacedTextData = textData.replace(replacee, replacer);
            const data = ENCODER.encode(replacedTextData).buffer;
            await game.promises.writeFile(data,
                this.linkPath(this.extensionPath, dir),
                fileName,
                err => {
                    (err instanceof Error) ? rej(err) : res();
                })
            onsuc?.({ file, data, textData, replacedTextData });
        })).catch(err => {
            onerr?.(err);
        });
    }
    async recover(cacheMap, onsuc, onerr) {
        if (!cacheMap && !(cacheMap instanceof Map)) return;
        const { game } = this.globalVar;
        await Promise.all(
            Array.from(cacheMap).map(async ([name, data]) => {
                const path = this.linkPath(this.extensionPath, name)
                const [dir, file] = path.split(matchLastSlash);
                try {
                    await game.promises.writeFile(
                        data,
                        dir,
                        file,
                        err => {
                            (err instanceof Error) ? rej(err) : res();
                        }
                    );
                    onsuc?.(path);
                } catch (err) {
                    onerr?.(err);
                }
            })
        )
    }
}
export class RawUpdater extends Updater {
    mainResName;
    mainURL;
    dirPath;
    resUrlList = {};
    resDirList = {};
    constructor(extensionName, mainURL, mainResName = "main", dirPath = "Directory.js") {
        if (typeof mainURL !== "string" && typeof mainURL !== "object") {
            throw new Error("传入参数不全！缺少mainURL")
        }
        super(extensionName);
        if (typeof mainURL === "object") {
            if ("host" in mainURL && "owner" in mainURL && "repo" in mainURL && "branch" in mainURL) {
                mainURL = `https://${host}/${owner}/${repo}/raw/${branch}`;
            } else {
                throw Error("mainURL缺少参数，无法生成对应url");
            }
        }
        this.mainResName = mainResName;
        this.mainURL = mainURL;
        this.resUrlList[mainResName] = mainURL;
        this.dirPath = dirPath;
        this.resDirList[mainResName] = dirPath;
    }
    addResUrl(name, url, dirPath = "Directory.js") {
        if (!name) throw new Error("传入参数不全！缺少资源库的名称")
        if (!url) throw new Error("传入参数不全！缺少资源库的url")
        this.resUrlList[name] = url;
        this.resDirList[name] = dirPath;
        return this;
    }
    changeMainRes(name) {
        if (!this.resUrlList[name]) {
            throw new Error("没有该仓库的url！");
        }
        this.mainResName = name;
        this.mainURL = this.resUrlList[name];
        this.dirPath = this.resDirList[name] || "Directory.js";
        return this;
    }
    changeResInOrder() {
        const resNameList = Object.keys(this.resUrlList).filter(name => name != this.mainResName);
        let i = 0;
        return () => {
            const resName = resNameList[i++]
            if (resName != void 0) this.changeMainRes(resName);
            return resName;
        }
    }
    async genDir(hashMap, contentChange) {
        const { game } = this.globalVar;
        const [downloadPath, name] = this.linkPath(this.extensionPath, this.dirPath).split(matchLastSlash);
        let content = `export default ${JSON.stringify(Array.from(hashMap), null, 4)}\n`;
        if (typeof contentChange === "function") {
            content = contentChange(content);
        }
        await game.promises.writeFile(
            new File(
                [content],
                name,
                { type: "application/javascript;charset=utf-8" }
            ),
            downloadPath,
            name
        )
    }
    genDirLine({
        ignoreFile = [],
        ignoreDir = [],
        ignoreExt = [],
        path,
        rmCR = true,
        autoRun = true,
    } = {}) {
        const manager = {
            options: {
                ignoreDir,
                ignoreFile,
                ignoreExt,
                path,
                rmCR,
                changeContents: new Map(),
            },
            setAddContents: async (moduleName, data) => {
                if (data && moduleName) {
                    manager.options.addContents.set("add", [moduleName, data]);
                }
                return manager;
            },
            setRemoveContents: async (remove, global) => {
                if (typeof remove === "string") {
                    manager.options.removeContents.set("remove", [remove, global]);
                }
                return manager;
            },
            setReplaceContents: async (replacee, replacer) => {
                manager.options.replaceContents.set("replace", [replacee, replacer]);
                return manager;
            },
            getFileList: async () => {
                const { path, ignoreDir, ignoreFile, ignoreExt } = manager.options;
                const fileList = await this.readDir(path, void 0, ignoreFile.concat(this.dirPath), ignoreDir, ignoreExt);
                manager.data.fileList = fileList;
            },
            getHashMap: async () => {
                const { rmCR } = manager.options;
                const { fileList } = manager.data;
                const bufferMap = await this.cache(fileList);
                const hashMap = await this.getHashMap(bufferMap, rmCR);
                manager.data.hashMap = hashMap;
            },
            genDir: async () => {
                const { hashMap } = manager.data;
                await this.genDir(hashMap, (content) => {
                    const { changeContents } = manager.options;
                    Array.from(changeContents).forEach(([type, args]) => {
                        switch (type) {
                            case "add": {
                                const [moduleName, data] = args
                                content = content + `const ${moduleName} = ${JSON.stringify(data, null, 4)}\n`;
                            }; break;
                            case "remove": {
                                const [remove, global] = args;
                                do {
                                    content = content.replace(remove, "");
                                }
                                while (global && content.includes(remove));
                            }; break;
                            case "replace": {
                                const [replacee, replacer] = args;
                                content = content.replace(replacee, replacer)
                            }; break;
                        }
                    })
                    return content;
                });
            },
            run: async () => {
                manager.appendPhases("getFileList", "getHashMap", "genDir");
                await manager.executeLine();
            }
        };
        Object.setPrototypeOf(manager, Manager.prototype);
        manager.init();
        autoRun && manager.run();
        return manager;
    }
    async getToUpdateHashMap(moduleName = "default") {
        await game.promises.download(this.linkPath(this.mainURL, this.dirPath), this.linkPath(this.extensionPath, this.dirPath));
        const map = await import(this.linkPath(location.origin, this.extensionPath, this.dirPath)).then(module => {
            const moduleNeeded = module[moduleName];
            if (!moduleNeeded) throw new Error("未找到对应module！");
            return new Map(moduleNeeded);
        }).catch(err => {
            throw err;
        });
        return map;
    }
    filterSameHash(hashMap, toUpdateHashMap) {
        const fileList = [];
        for (const [name, hash] of toUpdateHashMap.entries()) {
            if (hashMap.has(name) && hashMap.get(name) === hash) continue;
            fileList.push(name);
        }
        return fileList;
    }
    async update(fileList, onsuc, onerr) {
        if (!fileList) {
            throw new error("未提供下载路径数组！");
        }
        const { game } = this.globalVar;
        await Promise.all(fileList.map(async file => {
            try {
                await game.promises.download(
                    this.linkPath(this.mainURL, file),
                    this.linkPath(this.extensionPath, file)
                )
                onsuc?.(file);
            } catch (err) {
                onerr?.(err, file);
            }
        }))
    }
    updateLine({
        rmCR = true,
        replacee, replacer,
        timeoutMinutes = 2,
        reCalHash,
        autoRun = true,
        useOtherRes,
        downloadOrder = ['text', 'image', 'audio', "video", 'all']
    } = {}) {
        const manager = {
            options: {
                rmCR,
                replacee: replacee || navigator.userAgent.includes("Windows") ? matchLF : matchCR,
                replacer: replacer || navigator.userAgent.includes("Windows") ? "\r\n" : "",
                timeoutMinutes,
                reCalHash,
                useOtherRes,
                downloadOrder
            },
            getUpdateList: async () => {
                const toUpdateHashMap = await this.getToUpdateHashMap();
                manager.data.toUpdateHashMap = toUpdateHashMap;
            },
            filterHash: async () => {
                const { cacheHashMap, toUpdateHashMap } = manager.data;
                const { reCalHash, rmCR } = manager.options;
                const fileHashMap = reCalHash ? await this.getCacheHashMap(rmCR) : cacheHashMap;
                const updateFileList = this.filterSameHash(fileHashMap, toUpdateHashMap);
                manager.data.updateFileList = updateFileList
                manager.data.fileHashMap = fileHashMap;
                manager.data.dirList = updateFileList.map(file => file.includes("/") ? file.split(matchLastSlash)[0] : "");
            },
            update: async () => {
                const { timeoutMinutes } = manager.options;
                let timer;
                const { updateFileList, toUpdateHashMap } = manager.data;
                const toUpdateFiles = updateFileList.slice(0) || Array.from(toUpdateHashMap.keys());
                manager.data.updateInfo = {
                    toUpdateFiles,
                    succeededFiles: [],
                    failedFiles: []
                }
                await Promise.race(
                    [new Promise((res, rej) => {
                        manager.data.processingStartTime = new Date();
                        timer = setInterval(() => {
                            if (manager.data.processingStartTime && new Date() - manager.data.processingStartTime > timeoutMinutes * 60000) {
                                clearInterval(timer);
                                rej(new Error("下载超时"));
                            }
                        }, 100);
                    }),
                    this.update(
                        updateFileList,
                        async file => {
                            manager.data.processingStartTime = new Date();
                            manager.data.processingFile = file;
                            manager.data.updateInfo.succeededFiles.push(file);
                            manager.trigger("updateSuc");
                        },
                        async (err, file) => {
                            manager.data.processingStartTime = new Date();
                            manager.data.processingFile = file;
                            manager.data.updateInfo.failedFiles.push(file);
                            await manager.trigger("updateErr", err, manager.data);
                            await manager.trigger("error", err, manager.data);
                        }
                    )]
                );
                clearInterval(timer);
            },
            testFile: async () => {
                manager.status = "testFile"
                const { cacheMap, cacheHashMap, toUpdateHashMap } = manager.data;
                const { rmCR } = manager.options;
                const nowFileHashMap = await this.getCacheHashMap(rmCR);
                const updateFailFile = [];
                const toRecoverFileMap = new Map();
                for (const [path, hash] of toUpdateHashMap) {
                    if (path === this.dirPath) continue;
                    if (nowFileHashMap?.get?.(path) !== hash) {
                        updateFailFile.push(path);
                        if (cacheHashMap?.has?.(path) && nowFileHashMap?.get?.(path) !== cacheHashMap?.get?.(path)) {
                            toRecoverFileMap.set(path, cacheMap.get(path));
                        }
                    }
                };
                manager.data.updateFailFile = updateFailFile;
                manager.data.toRecoverFileMap = toRecoverFileMap;
                await manager.trigger("testFile");
                manager.status = "testFileEnd";
                if (updateFailFile.length) {
                    await manager.trigger("fileException", updateFailFile);
                } else {
                    await manager.trigger("fileAllOk");
                }
            },
            run: async () => {
                manager.appendPhases("getUpdateList", "filterHash", "makeSureDir", "update", "fixFile");
                manager.registerEvents(
                    "updateSuc", "updateErr",
                    "testFile", "fileAllOk", "fileException",
                )
                const { useOtherRes, downloadOrder } = manager.options;
                const extsGetter = this.getExtsInOrder(downloadOrder);
                const resChanger = this.changeResInOrder();
                let nowExts;
                manager.on("filterHash", async () => {
                    do {
                        nowExts = extsGetter();
                        manager.data.updateFileList = manager.data.updateFileList.filter(path => {
                            return nowExts === "all" || nowExts?.some?.(ext => path.endsWith(ext));
                        });
                    }
                    while (!manager.data.updateFileList.length && nowExts)
                })
                manager.on("progressErr", async () => {
                    if (manager.phase === "update" && !manager.finished.includes("update")) {
                        manager.skip("update");
                        manager.reExecuteLine("fixFile");
                    }
                });
                manager.on("end", async () => {
                    if (nowExts) {
                        await manager.reExecuteLine("filterHash");
                    } else {
                        manager.testFile();
                    }
                });
                manager.on("fileException", async () => {
                    if (useOtherRes && resChanger()) {
                        await manager.reExecuteLine("start");
                    } else {
                        await manager.recover();
                    }
                })
                await manager.executeLine();
            },
            ui: async () => {
                UpdateManager.updateUI(`${this.extensionName}正在更新`)
            }
        }
        Object.setPrototypeOf(manager, UpdateManager.prototype);
        manager.init(this);
        autoRun && manager.run();
        return manager;
    }
}
export class ZipUpdater extends Updater {
    zipUrl;
    constructor(extensionName, url) {
        super(extensionName);
        this.zipUrl = url
    }
    async unzip(buffer) {
        const { get } = this.globalVar;
        const zip = await get.promises.zip();
        zip.load(buffer);
        const zipObjs = Object.values(zip.files);
        const root = zipObjs[0].dir ? zipObjs[0].name : "";
        const dirList = [];
        const bufferMap = new Map(
            zipObjs.filter(zipObj => {
                if (!zipObj.dir) return true;
                let dir = zipObj.name.replace(root, "").slice(0, -1);
                dirList.push(dir);
            }).map(zipObj => {
                return [zipObj.name.replace(root, ""), zipObj.asArrayBuffer()];
            })
        );
        return {
            zip,
            dirList,
            bufferMap
        }
    }
    async update(bufferMap, onsuc, onerr) {
        const { game } = this.globalVar;
        await Promise.all(Array.from(bufferMap).map(async ([path, data]) => {
            try {
                const [dir, file] = this.linkPath(this.extensionPath, path).split(matchLastSlash);
                await game.promises.writeFile(
                    data,
                    dir,
                    file
                )
                onsuc?.(path);
            } catch (err) {
                onerr?.(err, path);
            }
        }))
    }
    updateLine({
        autoRun = true,
        replacee, replacer,
    } = {}) {
        const manager = {
            options: {
                replacee: replacee || navigator.userAgent.includes("Windows") ? matchLF : matchCR,
                replacer: replacer || navigator.userAgent.includes("Windows") ? "\r\n" : "",
            },
            fetchZip: async () => {
                const response = await fetch(this.zipUrl);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const zipData = await response.arrayBuffer();
                manager.data.zipData = zipData;
            },
            unzip: async () => {
                const { zipData } = manager.data;
                const { bufferMap, dirList, zip } = await this.unzip(zipData);
                manager.data.zip = zip;
                manager.data.bufferMap = bufferMap;
                manager.data.dirList = dirList;
            },
            update: async () => {
                const { bufferMap } = manager.data;
                manager.data.updateInfo = {
                    succeededFiles: [],
                    failedFiles: []
                };
                await this.update(
                    bufferMap,
                    async file => {
                        manager.data.processingStartTime = new Date();
                        manager.data.processingFile = file;
                        manager.data.updateInfo.succeededFiles.push(file);
                        manager.trigger("updateSuc");
                    },
                    async (err, file) => {
                        manager.data.processingStartTime = new Date();
                        manager.data.processingFile = file;
                        manager.data.updateInfo.failedFiles.push(file);
                        await manager.trigger("updateErr", err, manager.data);
                        await manager.trigger("error", err, manager.data);
                    }
                );
            },
            run: async () => {
                manager.appendPhases("getCache", "fetchZip", "unzip", "makeSureDir", "update", "fixFile");
                manager.executeLine();
            }
        }
        Object.setPrototypeOf(manager, UpdateManager.prototype);
        manager.init(this);
        autoRun && manager.run();
        return manager;
    }
}