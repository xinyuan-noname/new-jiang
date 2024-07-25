const fs = require('fs').promises
const pathModule = require('path')
class fsPromise {
    static async readDir(path, log = true) {
        const main = await fs.readdir(path)
        log && console.log(main)
        return main;
    }
    static async classifyFileDir(path, log = true) {
        const all = await this.readDir(path, false);
        const _file = [];
        const _dir = [];
        for (const fileName of all) {
            const entry = await fs.stat(pathModule.join(path, fileName))
            entry.isFile() && _file.push(fileName);
            entry.isDirectory() && _dir.push(fileName);
        }
        const result = { _file, _dir }
        log && console.log(result)
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
fsPromise.unlinkFiles('../', file => file.includes('Thumbs.db'))
fsPromise.clearContent('../json/1.json')
fsPromise.clearContent('../log/log.txt')
fsPromise.showDirFilter(
    '../',
    dirName => {
        return !dirName.startsWith('.git') && !dirName.startsWith('.vscode')
    },
    (file, index) => {
        if (file === 'Thumbs.db') return false;
        return true;
    },
    false
).then(data => {
    let result = {};
    for (let [dirName, files] of Object.entries(data)) {
        result[dirName.replace(/\\/g, '/')] = files
    }
    fs.writeFile(
        '../Directory.js',
        `window["xjb_xyAPI_Directory_新将包"]=${JSON.stringify(result, null, 4)}`
    )
})
