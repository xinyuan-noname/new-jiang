const fs = require('fs').promises
const pathModule = require('path')
class fsPromise {
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
fsPromise.unlinkFiles('../', file => file.includes('Thumbs.db'));
fsPromise.clearContent('../json/1.json');
fsPromise.clearContent('../log/log.txt');
fsPromise.clearContent('../xjb_xyAPI.js');
fsPromise.showDirFilter(
    '../',
    dirName => {
        return !dirName.startsWith('.git') && !dirName.startsWith('.vscode')
    },
    (file, index) => {
        if (file === 'Thumbs.db') return false;
        if (file === 'xjb_xyAPI.js') return false;
        if (file === 'Directory.js') return false;
        return true;
    },
    false
).then(data => {
    let result = {};
    for (let [dirName, files] of Object.entries(data)) {
        result[dirName.replace(/\\/g, '/')] = files
    }
    console.log(result);
    fs.writeFile(
        '../Directory.js',
        `window["xjb_xyAPI_Directory_新将包"]=${JSON.stringify(result, null, 4)}`
    )
})
