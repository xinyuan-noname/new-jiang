import "./libs/babel/standalone/babel.min.js";
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
class AST {
    static #ast = {
        Babel,
    }
    get babel() {
        return AST.#ast.Babel;
    }
    get Babel() {
        return AST.#ast.Babel;
    }
    get parser() {
        return this.Babel?.packages?.parser;
    }
    get generator() {
        return this.Babel?.packages?.generator;
    }
    get traverse() {
        return this.Babel?.packages?.traverse?.default;
    }
    get types() {
        return this.Babel?.packages?.types;
    }
    get template() {
        return this.Babel?.packages?.template.default;
    }
    parseCode(code, configs = {}) {
        return this.parser.parse(code, {
            sourceType: 'module',
            ...configs
        });
    }
    async parseFile(path, configs) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(response.status + ' ' + response.statusText);
        }
        const code = await response.text();
        return this.parseCode(code, configs);
    }

    traverseAST(ast, config) {
        this.traverse(ast, config);
    }
    //get系列语句 返回值为path/pathList/带path的object 以方便操作
    getReturnValues(fucntionPath) {
        if (!fucntionPath.isFunction()) {
            return [];
        }
        const container = [];
        const body = fucntionPath.get("body");
        if (body.isBlockStatement()) {
            fucntionPath.traverse({
                ReturnStatement: (path) => {
                    if (path.scope === fucntionPath.scope) {
                        container.push(path.get("argument"));
                    }
                }
            });
        } else {
            container.push(body);
        }
        return container;
    }
    getValueOfObject(objectExpressionPath, key) {
        if (!objectExpressionPath.isObjectExpression()) {
            throw new Error('Expected an ObjectExpression path');
        }
        let result = null;
        objectExpressionPath.get('properties').forEach(propertyPath => {
            if (propertyPath.isObjectProperty() || propertyPath.isObjectMethod()) {
                const keyPath = propertyPath.get('key');
                if (keyPath.isIdentifier() && keyPath.node.name === key) {
                    result = propertyPath.get('value');
                }
                else if (keyPath.isStringLiteral() && keyPath.node.value === key) {
                    result = propertyPath.get('value');
                }
            }
        });
        return result;
    }
    getImportInfoList(importDeclarationPath) {
        const results = [];
        const source = importDeclarationPath.node.source.value;
        importDeclarationPath.node.specifiers.forEach(specifier => {
            if (specifier.type === 'ImportDefaultSpecifier') {
                results.push({
                    type: 'default',
                    imported: 'default',
                    local: specifier.local.name,
                    source,
                    specifier
                });
            }
            if (specifier.type === 'ImportSpecifier') {
                const importedName = specifier.imported.name;
                const localName = specifier.local.name;
                results.push({
                    type: importedName === localName ? 'original' : 'renamed',
                    imported: importedName,
                    local: localName,
                    renamed: importedName !== localName,
                    source,
                    specifier
                });
            }
        });
        return results;
    }
    packStatementAsProgram(...statements) {
        return this.types.Program(statements);
    }
    //$is系列函数 通过给定的值来判断当前path是否满足条件
    $isLiteral(path, literal) {
        switch (true) {
            case (literal instanceof RegExp):
                return path.isRegExpLiteral({
                    pattern: literal.source,
                    flags: literal.flags
                });
            case (typeof literal === "bigint"):
                return path.isBigIntLiteral({
                    value: literal.toString()
                });
            case (typeof literal === "string"):
                return path.isStringLiteral({
                    value: literal
                });
            case (typeof literal === "number"):
                return path.isNumericLiteral({
                    value: literal
                });
            case (typeof literal === "boolean"):
                return path.isBooleanLiteral({
                    value: literal
                });
            case (literal === null):
                return path.isNullLiteral();
            default:
                return false;
        }
    }
    //$create系列函数 从给定的值中创建对应的AST节点
    $createNode(val) {
        let node;
        if (Array.isArray(val)) {
            node = this.$createArrayExpression(val);
        } else if (typeof val === "object" && val !== null) {
            node = this.$createObjectExpression(val);
        } else {
            node = this.$createLiteral(val);
        }
        return node;
    }
    $createLiteral(literal) {
        let literalPath;
        const { types } = this;
        switch (true) {
            case (literal instanceof RegExp): {
                literalPath = types.RegExpLiteral(literal.source, literal.flags);
            }; break;
            case (typeof literal === "bigint"): {
                literalPath = types.BigIntLiteral(literal.toString());
            }; break;
            case (typeof literal === "string"): {
                literalPath = types.StringLiteral(literal);
            }; break;
            case (typeof literal === "number"): {
                literalPath = types.NumericLiteral(literal);
            }; break;
            case (typeof literal === "boolean"): {
                literalPath = types.BooleanLiteral(literal);
            }; break;
            case (literal === null): {
                literalPath = types.NullLiteral();
            }; break;
        }
        return literalPath;
    }
    $createArrayExpression(array) {
        const { types } = this;
        return types.ArrayExpression(array.map(element => this.$createNode(element)).filter(Boolean));
    }
    $createFunction(func) {
        return this.parser.parseExpression(func.toString());
    }
    $createObjectProperty(key, val) {
        const { types } = this;
        let keyPath, valuePath;
        if (typeof key === "string") {
            valuePath = this.$createNode(val);
            if (valuePath) {
                keyPath = this.checkIdentifierValid(key) ? types.identifier(key) : types.StringLiteral(key);
                return this.types.ObjectProperty(keyPath, valuePath);
            }
        }
    }
    $createObjectMethod(name, func) {
        const { types } = this;
        let namePath, funcPath;
        if (typeof name === "string") {
            funcPath = this.$createFunction(func);
            if (funcPath) {
                namePath = this.checkIdentifierValid(name) ? types.identifier(name) : types.StringLiteral(name);
                return this.types.ObjectMethod("method", namePath, funcPath);
            }
        }
    }
    $createObjectExpression(object) {
        const { types } = this;
        const objectExpression = types.ObjectExpression([])
        for (const k in object) {
            if (object.hasOwnProperty(k)) {
                if (typeof object[k] !== "function") {
                    const property = this.$createObjectProperty(k, object[k]);
                    if (property) objectExpression.properties.push(property);
                } else {
                    const method = this.$createObjectMethod(k, object[k]);
                    if (method) objectExpression.properties.push(method);
                }
            }
        }
        return objectExpression;
    }
    $createMemberExpression(...propertiesOrOptionalOperations) {
        const { types } = this;
        const container = [];
        let flag;
        for (let i = 0; i < propertiesOrOptionalOperations.length; i++) {
            const now = propertiesOrOptionalOperations[i];
            if (now === "?.") {
                flag = true;
            } else {
                container.push(this.checkIdentifierValid(now) ? types.identifier(now) : types.StringLiteral(now));
            }
            if (container.length === 2) {
                container.splice(0, 2,
                    flag ? types.OptionalMemberExpression(container[0], container[1], container[1].type === "StringLiteral", true) :
                        types.MemberExpression(container[0], container[1], container[1].type === "StringLiteral")
                )
                flag = false;
            }
        }
        return container[0];

    }
    $createCallMethodExpression(propertiesOrOptionalOperations, args) {
        return this.types.CallExpression(
            this.$createMemberExpression(...propertiesOrOptionalOperations),
            args.map(arg => this.$createNode(arg))
        )
    }
    $createExpression(expression) {
        return this.parser.parseExpression(String(expression));
    }
    //create系列函数 表示直接从node创建语句 是一个简单的封装
    createIfStatement(condition, consequent) {
        const { types } = this;
        return Array.isArray(consequent) ?
            types.ifStatement(condition, types.BlockStatement(consequent)) :
            types.ifStatement(condition, consequent)
    }
    createLeftRightExpressionStatement(leftNode, operator, rightNode) {
        const { types } = this;
        operator = operator.trim();
        if (['=', '+=', '-=', '*=', '/=', '%=', '**=', '<<=', '>>=', '>>>=', '|=', '^=', '&='].includes(operator)) {
            return types.ExpressionStatement(types.AssignmentExpression(operator, leftNode, rightNode));
        } else if (['==', '===', '!=', '!==', '<', '<=', '>', '>=', '<<', '>>', '>>>', '+', '-', '*', '/', '%', '**', '|', '^', '&', 'in', 'instanceof'].includes(operator)) {
            return types.ExpressionStatement(types.BinaryExpression(operator, leftNode, rightNode));
        } else if (['&&', '||', '??'].includes(operator)) {
            return types.ExpressionStatement(types.LogicalExpression(operator, leftNode, rightNode));
        }
        return null;
    }
    //
    checkIdentifierValid(identifier) {
        try {
            this.parseCode(`var ${identifier};`);
            return true;
        } catch (err) {
            return false;
        }
    }
    replaceWithLiteral(path, literal) {
        let literalPath = this.$createLiteral(literal);
        if (literalPath) path.replaceWith(literalPath);
    }
    generateCode(ast, configs) {
        const { generator } = this;
        const code = generator.generate(ast, {
            //在中文环境中 为了确保不转为unicode 这个选项通常是必要的
            jsescOption: {
                minimal: true,
                escapeOnly: false,
            },
            ...configs
        });
        return code;
    }
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
const genCharacterCode = async (characterInfo, pattern) => {
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
            CallExpression
        });
        //实际上 这个set会随着遍历不断变长 我们可以依次遍历完 全部的module
        for (const filePath of moduleList) {
            const fileDirPath = resolvePath(filePath, "..");
            const ast = await astObject.parseFile(filePath);
            currentFilePath = filePath; currentDirPath = fileDirPath; currentAST = ast;
            astObject.traverseAST(ast, {
                ImportDeclaration,
                CallExpression
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
addEventListener("message", async ({ data: { workerSessionId, order, data } }) => {
    switch (order) {
        case "getExtensionAllPackage": {
            const [extensionName] = data;
            const result = await getExtensionAllPackage(extensionName);
            postMessage({ workerSessionId, data: JSON.parse(JSON.stringify(result)) });
        }; break;
        case "genCharacterCode": {
            const [characterInfo, pattern] = data;
            postMessage({ workerSessionId, data: genCharacterCode(characterInfo, pattern) });
        }; break;
        default: {
            postMessage({workerSessionId});
        }
    }
})