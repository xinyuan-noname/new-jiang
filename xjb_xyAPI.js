const xjb_xyAPI = {
    extensionList: {
    },
    autoAddExtension(extensionName, gitURL) {
        const RootUrl = location.origin;
        const DirUrl = location.pathname;
        const initWay = localStorage.getItem("noname_inited")
        let gameURL, fileURL
        if (RootUrl.startsWith("https://")) {
            gameURL = `${RootUrl}/extension/${extensionName}/`;
            fileURL = `${initWay}extension/${extensionName}/`;
        }
        else if (RootUrl.startsWith("file://") && initWay === "nodejs") {
            gameURL = fileURL = `${RootUrl}${DirUrl.replace('index.html', '')}extension/${extensionName}/`;
        }
        this.extensionListAdd({ extensionName, fileURL, gameURL, gitURL })
    },
    extensionListAdd({ fileURL, gitURL, gameURL, extensionName }) {
        this.extensionList[extensionName] = {
            fileURL,
            gitURL,
            gameURL,
            extensionName
        };
        this.updateServiceTarget(extensionName)
    },
    extensionListAddBasedOnShijianVersionAndroid(extensionName, gitURL) {
        this.extensionListAdd({
            extensionName,
            fileURL: `file:///storage/emulated/0/Android/data/com.noname.shijian/extension/${extensionName}/`,
            gameURL: `https://localhost/extension/${extensionName}/`,
            gitURL
        })
    },
    updateServiceTarget(extensionName) {
        const target = this.extensionList[extensionName];
        if (target) {
            this.setExtensionName(target.extensionName);
            this.setFileURL(target.fileURL);
            this.setGameURL(target.gameURL);
            this.setGitURL(target.gitURL);
        };
        this.updateDownloadHook = undefined;
        this.directoryDownloadSHook = undefined;
        this.directoryDownloadFHook = undefined;
        if (localStorage.getItem("noname_inited") === "nodejs" && !this.file_node) {
            const fs = this.lib.node.fs.promises;
            const pathModule = this.lib.node.path;
            this.node_file = class fsPromise {
                static transFileURL(url) {
                    if (typeof url === 'string') url = new URL(url);
                    return window.decodeURIComponent(url.pathname).substring(1);
                }
                /**
                 * 异步读取指定目录下的所有文件和文件夹名
                 * 
                 * 本函数使用了Node.js的文件系统模块(fs)来读取指定路径下的内容
                 * 它可以接受一个可选的log参数，用于控制是否在控制台打印读取的结果
                 * 
                 * @param {string} path - 要读取的目录路径
                 * @param {boolean} [log=true] - 是否在控制台打印读取结果，默认为true
                 * @returns {Promise<Array>} - 返回一个Promise对象，该对象在解析后会提供目录下的文件和文件夹名数组
                 */
                static async readDir(path, log = true) {
                    // 使用fs.readdir异步读取指定路径下的文件和文件夹名
                    const main = await fs.readdir(path)
                    // 如果log参数为true，则在控制台打印读取的结果
                    log && console.log(main)
                    // 返回读取的结果
                    return main;
                }
                /**
                 * 异步获取指定路径下的文件和子目录列表
                 * 
                 * 该方法首先读取给定路径下的所有条目，然后通过fs.stat检查每个条目的是文件还是目录，
                 * 分别将文件名和目录名收集到两个不同的数组中最后，它可以选择性地打印这些结果到控制台，
                 * 并返回包含文件和目录列表的对象
                 * 
                 * @param {string} path - 要分类的目录路径
                 * @param {boolean} log - 是否在控制台打印分类结果，默认为true
                 * @returns {Promise<{_file: string[], _dir: string[]}>} 返回一个包含文件和目录列表的对象的Promise
                 */
                static async classifyFileDir(path, log = true) {
                    // 读取指定路径下的所有文件和目录名
                    const all = await this.readDir(path, false);
                    // 初始化两个空数组，分别用于存储文件名和目录名
                    const _file = [];
                    const _dir = [];
                    // 遍历读取的所有文件和目录名
                    for (const fileName of all) {
                        // 获取每个文件或目录的详细信息
                        const entry = await fs.stat(pathModule.join(path, fileName));
                        // 如果是文件，则将其文件名添加到_file数组中
                        entry.isFile() && _file.push(fileName);
                        // 如果是目录，则将其文件名添加到_dir数组中
                        entry.isDirectory() && _dir.push(fileName);
                    }
                    // 将文件和目录列表封装成一个对象
                    const result = { _file, _dir };
                    // 如果log参数为true，则在控制台打印分类结果
                    log && console.log(result);
                    // 返回包含文件和目录列表的对象
                    return result;
                }
                static async showDir(path, log = true) {
                    const map = await this.classifyFileDir(path, false);
                    map.main = map._file;
                    delete map._file;
                    for (let i = 0; i < 10; i++) {
                        map.directories = []
                        for (const dirName of map._dir) {
                            map[dirName] = [];
                            const next = await this.classifyFileDir(
                                pathModule.join(path, dirName),
                                false
                            );
                            map[dirName] = [...next._file]
                            map.directories = map.directories.concat(next._dir.map(each => {
                                return pathModule.join(dirName, each)
                            }))
                        }
                        map._dir = [...map.directories];
                    }
                    delete map._dir;
                    delete map.directories;
                    log && console.log(map);
                    return map;
                }
                static async showPathes(path, log = true) {
                    const map = await this.showDir(path, false);
                    const result = [];
                    map.main.forEach(file => {
                        result.push(
                            pathModule.join(path, file)
                        )
                    })
                    delete map.main;
                    for (const [dirName, files] of Object.entries(map)) {
                        files.forEach(file => {
                            result.push(
                                pathModule.join(path, dirName, file)
                            )
                        })
                    }
                    log && console.log(result);
                    return result;
                }
                /**
                 * 
                 * @param {string} path 
                 * @param {function} filterDir 
                 * @param {function} filterFile 
                 * @param {boolean} log 
                 * @returns {object}
                 */
                static async showDirFilter(path, filterDir, filterFile, log = true) {
                    const map = await this.showDir(path, false);
                    const result = {}
                    for (const [dirName, files] of Object.entries(map)) {
                        if (!filterDir(dirName)) continue;
                        result[dirName] = files.filter(filterFile);
                    }
                    log && console.log(result)
                    return result;
                }
                static async generateText(path, content, sourcePath) {
                    if (content == 'pathes' && sourcePath) {
                        content = (await this.showPathes(sourcePath, false)).join('\n')
                    }
                    await fs.writeFile(path, content)
                }
                static async clearContent(path) {
                    await fs.writeFile(path, '')
                }
                static async unlinkFiles(path, judge) {
                    const map = await this.showPathes(path, false)
                    map.forEach(file => {
                        judge(file) && fs.unlink(file)
                    })
                }
            }
        }
    },
    setGameData(lib, game, ui, get, ai, _status) {
        this.lib = lib;
        this.game = game;
        this.ai = ai;
        this.ui = ui;
        this.get = get;
        this._status = _status;
    },
    setFileURL(fileURL) {
        this.fileURL = fileURL
    },
    setGitURL(gitURL) {
        this.gitURL = gitURL
    },
    setGameURL(gameURL) {
        this.gameURL = gameURL
    },
    setExtensionName(extensionName) {
        this.extensionName = extensionName;
    },
    getDirectory(url = this.fileURL) {
        const List = {
            _files: [],
            directories: []
        };
        const CordovaPromise = new Promise((res, rej) => {
            resolveLocalFileSystemURL(url, function (entry) {
                let mainURL = entry.nativeURL;
                function readDirectory(DirectoryObject) {
                    DirectoryObject.createReader().readEntries(subEntrys => {
                        subEntrys.forEach(subEntry => {
                            if (subEntry.isFile) {
                                List["_files"].push(subEntry.name);
                            };
                            if (subEntry.isDirectory) {
                                List["directories"].push(subEntry.name)
                            };
                        });
                        res(List);
                    })
                };
                readDirectory(entry);
            }, function (err) {
                rej(err);
            });
        })
        return CordovaPromise;
    },
    async getAllDirectories(url = this.fileURL) {
        const _this = this
        let List = await _this.getDirectory(url);
        List['main'] = [...List._files];
        delete List['_files'];
        for (let i = 0; i < List.directories.length; i++) {
            const key = List.directories[i];
            List[key] = await _this.getDirectory(url + key + '/');
        };
        delete List['directories'];
        async function HandlingFolders() {
            for (let k in List) {
                if (!List[k].directories) continue;
                else if (List[k].directories.length == 0) List[k] = [...List[k]._files];
                else {
                    for (let i = 0; i < List[k].directories.length; i++) {
                        List[k + '/' + List[k].directories[i]] = await _this.getDirectory(url + k + '/' + List[k].directories[i])
                    };
                    List[k].directories.length = 0;
                }
            };
        };
        for (let t = 0; t < 100; t++) {
            await HandlingFolders();
            if ((Object.values(List).every(k => Array.isArray(k)))) break;
        };
        return List;
    },
    /**
     * 
     * @param {URL} url fileURL
     */
    async directoryDownload(url = this.fileURL) {
        const _this = this;
        const initWay = localStorage.getItem("noname_inited");
        let fsPromise;
        let List = {};
        let filePath;
        if (initWay === "nodejs") {
            fsPromise = this.node_file;
            filePath = fsPromise.transFileURL(url);
            const dirTree = await fsPromise.showDirFilter(
                filePath,
                dirName => {
                    return !dirName.startsWith('.git') && !dirName.startsWith('.vscode')
                },
                (file, index) => {
                    if (file === 'Thumbs.db') return false;
                    return true;
                },
                false
            )
            for (let [dirName, files] of Object.entries(dirTree)) {
                List[dirName.replace(/\\/g, '/')] = files
            }
        } else List = await this.getAllDirectories(url);
        let BLOB = new Blob([`window["xjb_xyAPI_Directory_${_this.extensionName}"]=${JSON.stringify(List, null, 4)} `], {
            type: "application/javascript;charset=utf-8"
        })
        var reader = new FileReader();
        const sucCallback = function () {
            _this.game.print('目录文件生成成功')
            _this.game.print(List)
            if (_this.directoryDownloadSHook) _this.directoryDownloadSHook()
        }
        const failCallback = function () {
            _this.game.print('目录文件生成失败;错误码:' + e.code)
            _this.game.print(List)
            if (_this.directoryDownloadFHook) _this.directoryDownloadFHook(e)
        }
        if ("FileTransfer" in window) {
            reader.readAsDataURL(BLOB, "UTF-8")
            var fileTransfer = new FileTransfer();
            reader.onload = function () {
                fileTransfer.download(this.result, url + 'Directory.js', sucCallback, failCallback);
            }
        }
        if (initWay === "nodejs") {
            reader.readAsArrayBuffer(BLOB)
            reader.onload = function () {
                const fs = lib.node.fs;
                fs.writeFile(
                    filePath + 'Directory.js',
                    Buffer.from(new Uint8Array(this.result)),
                    err => {
                        if (err) return failCallback();
                        sucCallback()
                    }
                )
            }
        }
        reader.onerror = failCallback;

    },
    async getGitDirectory(url = this.gitURL, extensionName = this.extensionName) {
        const _this = this;
        return new Promise((res, rej) => {
            _this.game.download(url + 'Directory.js', `extension/${extensionName}/Directory.js`, () => {
                _this.lib.init.js(_this.gameURL, 'Directory', () => {
                    _this.game.print('目录文件获取完成', window[`xjb_xyAPI_Directory_${extensionName}`]);
                    res(window[`xjb_xyAPI_Directory_${extensionName}`]);
                }, err => {
                    _this.game.print('目录文件获取失败,错误码' + err.code);
                    rej(err)
                });
            }, err => {
                _this.game.print('目录文件获取失败,错误码' + err.code);
                rej(err)
            });
        })
    },
    /**
     * 
     * @param {URL} url gitURL
     * @param {String} extensionName 
     * @param {URL} urlHead 
     */
    async objToUrlArray(url = this.gitURL, extensionName = this.extensionName) {
        const _this = this;
        const directory = await _this.getGitDirectory(url, extensionName);
        let urlList = [];
        if (directory) {
            for (let k in directory) {
                let info = directory[k]
                if (!info.length) continue;
                if (k == 'main') {
                    info.forEach(i => {
                        urlList.push(i)
                    })
                } else {
                    info.forEach(i => {
                        urlList.push(k + '/' + i)
                    })
                }
            }
        }
        _this.game.print(urlList)
        return urlList
    },
    async updateOnline(gitURL, extensionName, urlHead, fileURL) {
        if (!gitURL) gitURL = this.gitURL;
        if (!extensionName) extensionName = this.extensionName;
        if (!fileURL) fileURL = this.extensionName;
        if (!urlHead) urlHead = `extension/${extensionName}/`;
        const _this = this;
        const urlList = await _this.objToUrlArray(gitURL, extensionName);
        const gitUrlList = urlList.map(file => {
            return gitURL + file
        });
        const downloadUrlList = urlList.map(file => {
            return urlHead + file
        });
        const unloadFileList = [];
        let count = 0;
        for (let i = 0; i < urlList.length; i++) {
            const onlineFile = gitUrlList[i], downloadFile = downloadUrlList[i], file = urlList[i]
            _this.game.download(onlineFile, downloadFile, () => {
                _this.game.print('下载成功，文件：' + file);
                count++
            }, (err) => {
                unloadFileList.push(file);
                _this.game.print('下载文件失败,错误码' + err.code);
                count++
            })
        };
        function testEnd() {
            if (count >= urlList.length) {
                _this.game.print('下载完成，下载失败的文件：', unloadFileList);
                if (unloadFileList.length) _this.game.print("请确保扩展文件夹下以下目录存在", Object.keys(window[`xjb_xyAPI_Directory_${extensionName}`]).filter(k => k != "main"))
                cancelAnimationFrame(testEnd);
                if (_this.updateDownloadHook) _this.updateDownloadHook(unloadFileList)
            } else {
                requestAnimationFrame(testEnd);
            }
        }
        requestAnimationFrame(testEnd);
    }
}
window.xjb_xyAPI = xjb_xyAPI;

