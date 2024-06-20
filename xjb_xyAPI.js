const xjb_xyAPI = {
    extensionList: {},
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
    getDirectory(url) {
        if (!url) url = this.fileURL;
        const List = {
            _files: [],
            directories: []
        };
        return new Promise((res, rej) => {
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
    },
    async getAllDirectories(url) {
        if (!url) url = this.fileURL;
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
    async directoryDownload(url) {
        if (!url) url = this.fileURL;
        const _this = this;
        const List = await this.getAllDirectories(url);
        let BLOB = new Blob([`window["xjb_xyAPI_Directory_${_this.extensionName}"]=${JSON.stringify(List, null, 4)} `], {
            type: "application/javascript;charset=utf-8"
        })
        var reader = new FileReader()
        reader.readAsDataURL(BLOB, "UTF-8")
        reader.onload = function () {
            var fileTransfer = new FileTransfer();
            fileTransfer.download(this.result, url + 'Directory.js', function () {
                _this.game.print('目录文件生成成功')
                _this.game.print(List)
                if(_this.directoryDownloadSHook)_this.directoryDownloadSHook()
            }, function (e) {
                _this.game.print('目录文件生成失败;错误码:' + e.code)
                _this.game.print(List)
                if(_this.directoryDownloadFHook)_this.directoryDownloadFHook(e)
            });
        }
    },
    async getGitDirectory(url, extensionName) {
        if (!url) url = this.gitURL;
        if (!extensionName) extensionName = this.extensionName;
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
    async objToUrlArray(url, extensionName) {
        if (!url) url = this.gitURL;
        if (!extensionName) extensionName = this.extensionName;
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
    async updateOnline(gitURL, extensionName, urlHead) {
        if (!gitURL) gitURL = this.gitURL;
        if (!extensionName) extensionName = this.extensionName;
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
                cancelAnimationFrame(testEnd);
                if(_this.updateDownloadHook)_this.updateDownloadHook(unloadFileList)
            } else {
                requestAnimationFrame(testEnd);
            }
        }
        requestAnimationFrame(testEnd);
    }
}
window.xjb_xyAPI = xjb_xyAPI;