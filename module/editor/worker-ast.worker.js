import { AST } from "./data-ast.mjs";
const ROOT_PATH = new URL(import.meta.url).origin;
const resolvePath = (basePath, ...paths) => {
    try {
        basePath = new URL(basePath).href;
    } catch (err) {
        paths.unshift(basePath);
        basePath = ROOT_PATH;
    }
    const resultPath = paths.reduce((acc, path) => {
        return acc.endsWith("/") ? acc + path : acc + "/" + path;
    }, basePath);
    return new URL(resultPath).href;
}
const astObject = new AST();
const createNewCharacterExpressionParamNode = (info, pattern = "object") => {
    switch (pattern) {
        case "object": {
            return astObject.$createNode(info);
        }
        case "array": {
            //因为lib中有worker环境不支持的函数 而且Character类的定义文件中也有对lib的引用 只能强行迁移
            const character = {
                ...info,
                get 0() {
                    return this.sex;
                },
                get 1() {
                    return this.group;
                },
                get 2() {
                    if (this.hujia > 0) return `${this.hp}/${this.maxHp}/${this.hujia}`;
                    if (this.hp !== this.maxHp) return `${this.hp}/${this.maxHp}`;
                    return this.hp;
                },
                get 3() {
                    return this.skills;
                },
                get 4() {
                    const trashes = [],
                        character = this;
                    if (character.groupInGuozhan) {
                        trashes.push(`gzgroup:${character.groupInGuozhan}`);
                    }
                    if (character.isZhugong) {
                        trashes.push("zhu");
                    }
                    if (character.isUnseen) {
                        trashes.push("unseen");
                    }
                    if (character.isMinskin) {
                        trashes.push("minskin");
                    }
                    if (character.hasSkinInGuozhan) {
                        trashes.push("gzskin");
                    }
                    if (character.isBoss) {
                        trashes.push("boss");
                    }
                    if (character.isChessBoss) {
                        trashes.push("chessboss");
                    }
                    if (character.isJiangeBoss) {
                        trashes.push("jiangeboss");
                    }
                    if (character.isJiangeMech) {
                        trashes.push("jiangemech");
                    }
                    if (character.isBossAllowed) {
                        trashes.push("bossallowed");
                    }
                    if (character.isHiddenBoss) {
                        trashes.push("hiddenboss");
                    }
                    if (character.isAiForbidden) {
                        trashes.push("forbidai");
                    }
                    if (character.isFellowInStoneMode) {
                        trashes.push("stone");
                    }
                    if (character.isHiddenInStoneMode) {
                        trashes.push("stonehidden");
                    }
                    if (character.isSpecialInStoneMode) {
                        trashes.push("stonespecial");
                    }
                    if (character.hasHiddenSkill) {
                        trashes.push("hiddenSkill");
                    }
                    if (character.groupBorder) {
                        trashes.push(`border:${character.groupBorder}`);
                    }
                    if (character.dualSideCharacter) {
                        trashes.push(`duaslside:${character.dualSideCharacter}`);
                    }
                    if (character.doubleGroup.length > 0) {
                        trashes.push(`doublegroup:${character.doubleGroup.join(":")}`);
                    }
                    if (character.clans.length > 0) {
                        character.clans.forEach(item => trashes.push(`clan:${item}`));
                    }
                    if (character.initFilters.length > 0) {
                        trashes.push(`InitFilters:${character.initFilters.join(":")}`);
                    }
                    if (character.img) {
                        trashes.push(`img:${character.img}`);
                    }
                    if (character.dieAudios.length > 0) {
                        character.dieAudios.forEach(item => trashes.push(`die:${item}`));
                    }
                    if (character.tempname.length > 0) {
                        trashes.push(`tempname:${character.tempname.join(":")}`);
                    }
                    return trashes.concat(character.trashBin);
                },
                get 5() {
                    return this.extraModeData;
                }
            };
            const { "0": $0, "1": $1, "2": $2, "3": $3, "4": $4, "5": $5 } = character;
            return astObject.$createNode([$0, $1, $2, $3, $4, $5]);
        }
    }
}
const createTranslateAssignmentExpression = (astObject, en, cn) => {
    return astObject.template("%%left%% = %%cn%%;")({
        left: astObject.$createMemberExpression("lib", "translate", en),
        cn: astObject.$createNode(cn)
    });
}
const genCharacterCode = (characterInfo, pattern) => {
    const { extension, packageName, id, intro, pinyin, dieAudioText, name, ...basicInfo } = characterInfo;
    const statements = [];
    if (packageName) {
        const createCharacter = astObject.template("%%left%% = new lib.element.Character(%%basicInfo%%);")({
            left: astObject.$createMemberExpression("lib", "characterPack", packageName, id),
            basicInfo: createNewCharacterExpressionParamNode(basicInfo, pattern)
        });
        const pushCharacter = astObject.createIfStatement(
            astObject.$createCallMethodExpression(["lib", "config", "characters", "includes"], [packageName]),
            [astObject.createLeftRightExpressionStatement(
                astObject.$createMemberExpression("lib", "character", id),
                "=",
                astObject.$createMemberExpression("lib", "characterPack", packageName, id)
            )]
        );
        statements.push(createCharacter, pushCharacter);
    } else {
        const createCharacter = astObject.template("%%left%% = new lib.element.Character(%%basicInfo%%);")({
            left: astObject.$createMemberExpression("lib", "character", id),
            basicInfo: createNewCharacterExpressionParamNode(basicInfo, pattern)
        });
        statements.push(createCharacter)
    }
    statements.push(createTranslateAssignmentExpression(astObject, id, name));
    if (intro) statements.push(astObject.createLeftRightExpressionStatement(
        astObject.$createMemberExpression("lib", "characterIntro", id),
        "=",
        astObject.$createNode(intro)
    ));
    if (pinyin) statements.push(astObject.createLeftRightExpressionStatement(
        astObject.$createMemberExpression("lib", "pinyins", id),
        "=",
        astObject.$createNode(pinyin)
    ))
    const ast = astObject.packStatementAsProgram(...statements);
    return astObject.generateCode(ast).code;
}
const getExtensionAllPackage = async (extensionName) => {
    const astCaputured = {
        extension: [],
        character: [],
        card: []
    }
    const moduleList = [];
    const importInfoMap = new Map();
    try {
        const rootFilePath = resolvePath("extension", extensionName, "extension.js")
        const rootFileDirPath = resolvePath(`extension/${extensionName}/`);
        const extensionAst = await astObject.parseFile(rootFilePath);
        let currentFilePath = rootFilePath;
        let currentDirPath = rootFileDirPath;
        let currentAST = extensionAst;
        const pathCheck = (path) => {
            return !moduleList.includes(path) && path.includes(rootFileDirPath);
        }
        const setImportInfo = (path) => {
            const importedList = {}
            importInfoMap.set(path, importedList);
            return importedList
        }
        const CallExpression = (path) => {
            const callee = path.get('callee')
            if (callee.matchesPattern('game.import')) {
                const type = path.get("arguments.0");
                const content = path.get("arguments.1");
                const returnValuePaths = astObject.getReturnValues(content);
                returnValuePaths.forEach((returnValuePath) => {
                    let configObjectExpressionPath;
                    if (returnValuePath.isObjectExpression()) {
                        configObjectExpressionPath = returnValuePath;
                    } else if (returnValuePath.isIdentifier()) {
                        const binding = returnValuePath.scope.getBinding(returnValuePath.node.name);
                        if (!binding) return;
                        configObjectExpressionPath = binding.path.get("init");
                    }
                    if (!configObjectExpressionPath) return;
                    let packageID;
                    const valuePath = astObject.getValueOfObject(configObjectExpressionPath, "name")
                    if (valuePath?.isStringLiteral()) {
                        packageID = valuePath.node.value;
                    }
                    astCaputured[type.node.value].push({
                        packageID,
                        file: currentFilePath,
                        currentAST
                    });
                })
            } else if (callee.matchesPattern("lib.init.js") || callee.matchesPattern("lib.init.promises.js")) {
                const requestJSDirPath = path.get("arguments.0");
                const requestJSFileNamePath = path.get("arguments.1");
                let jsDir, jsName;
                //这里暂时只分析字符串 如果是标识符 其情况则比较复杂
                if (requestJSDirPath.isStringLiteral()) {
                    jsDir = requestJSDirPath.node.value;
                }
                if (jsDir.startsWith("http")) return;
                if (requestJSFileNamePath.isStringLiteral()) {
                    jsName = requestJSDirPath.node.value;
                }
                if (jsDir && jsName) {
                    const absolutePath = resolvePath(requestJSDirPath.node.value, requestJSFileNamePath.node.value + ".js");
                    if (pathCheck(absolutePath)) {
                        moduleList.push(absolutePath);
                    }
                }
            }
        }
        const ImportDeclaration = (path) => {
            const infoList = astObject.getImportInfoList(path);
            const currentImportInfoList = setImportInfo(currentFilePath);
            const absolutePath = resolvePath(currentDirPath, path.node.source.value);
            if (pathCheck(absolutePath)) moduleList.push(absolutePath);
            infoList.forEach(info => {
                currentImportInfoList[info.local] = info;
            });
        }
        astObject.traverseAST(extensionAst, {
            ImportDeclaration,
            CallExpression,
            ExportDefaultDeclaration(path) {
                const exportTypePath = [].concat(path.getAllPrevSiblings(), path.getAllNextSiblings()).find((sibling) => {
                    if (!sibling.isExportNamedDeclaration()) return false;
                    const declaration = sibling.get("declaration");
                    if (!declaration?.isVariableDeclaration?.()) return false;
                    const { init, id } = declaration.get("declarations.0").node;
                    if (id.name !== "type" || init.value !== "extension") return false;
                    return true;
                });
                if (!exportTypePath) return;
                const content = path.get("declaration");
                const returnValuePaths = astObject.getReturnValues(content);
                returnValuePaths.forEach((returnValuePath) => {
                    let configObjectExpressionPath;
                    if (returnValuePath.isObjectExpression()) {
                        configObjectExpressionPath = returnValuePath;
                    } else if (returnValuePath.isIdentifier()) {
                        const binding = returnValuePath.scope.getBinding(returnValuePath.node.name);
                        if (!binding) return;
                        configObjectExpressionPath = binding.path.get("init");
                    }
                    if (!configObjectExpressionPath) return;
                    let packageID;
                    const valuePath = astObject.getValueOfObject(configObjectExpressionPath, "name")
                    if (valuePath?.isStringLiteral()) {
                        packageID = valuePath.node.value;
                    }
                    astCaputured.extension.push({
                        packageID,
                        file: currentFilePath,
                        currentAST
                    });
                })
            }
        });
        //实际上 这个set会随着遍历不断变长 我们可以依次遍历完 全部的module
        for (const filePath of moduleList) {
            const fileDirPath = resolvePath(filePath, "..");
            const ast = await astObject.parseFile(filePath);
            currentFilePath = filePath; currentDirPath = fileDirPath; currentAST = ast;
            astObject.traverseAST(ast, {
                ImportDeclaration,
                CallExpression,
            });
        }
        return {
            ok: true,
            moduleList,
            astCaputured,
            importInfoMap: Array.from(importInfoMap)
        };
    } catch (err) {
        console.error(err);
        return {
            ok: false,
            moduleList,
            astCaputured,
            importInfoMap: Array.from(importInfoMap)
        }
    }
}
addEventListener("message", async ({ data: { order, data } }) => {
    switch (order) {
        case "getExtensionAllPackage": {
            const [extensionName] = data;
            const result = await getExtensionAllPackage(extensionName);
            postMessage(JSON.parse(JSON.stringify(result)));
        }; break;
        case "genCharacterCode": {
            const [characterInfo, pattern] = data;
            postMessage(genCharacterCode(characterInfo, pattern));
        }; break;
        default: {
            postMessage(null);
        }
    }
})