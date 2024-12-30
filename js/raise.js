import { _status, lib, game, ui, get, ai } from "../../../noname.js"
lib.xjb_raiseCharSkinFolder = `${lib.xjb_src}/skin/image/xjb_newCharacter/`
lib.xjb_hunList.skill = {
    first: ["xjb_juanqu", "xjb_lunhui", "xjb_hanhua", "xjb_bingdi"],
    second: ["xjb_leijue", "xjb_bingjue", "xjb_jinghua",
        "xjb_wei_fengtian", "xjb_wei_fayi", "xjb_wu_yushou", "xjb_shu_nufa",
        "xjb_tianfa"],
    third: ["xjb_pomie", "xjb_huojue"],
}
get.xjb_raiseCharSkills = function () {
    if (!lib.config.xjb_newcharacter && !lib.config.xjb_newcharacter.skill) return [];
    return lib.config.xjb_newcharacter.skill.slice(0);
}
get.xjb_allHunSkills = function () {
    return [].concat(...Object.values(lib.xjb_hunList.skill));
}
get.xjb_firstHunSkills = function () {
    return lib.xjb_hunList.skill.first.slice(0);
}
get.xjb_secondHunSkills = function () {
    return lib.xjb_hunList.skill.second.slice(0);
}
get.xjb_thirdHunSkills = function () {
    return lib.xjb_hunList.skill.third.slice(0);
}
get.xjb_raiseCharNonHunSkills = function () {
    return get.xjb_allHunSkills().filter(skill => !get.xjb_raiseCharSkills().includes(skill))
}
get.xjb_hunSkillRank = function (skillName) {
    for (const rank of ["first", "second", "third"]) {
        if (lib.xjb_hunList.skill[rank].includes(skillName)) return rank
    }
}
get.xjb_hunSkillCost = function (skillName) {
    const map = {
        first: 15,
        second: 25,
        third: 50
    }
    return map[get.xjb_hunSkillRank(skillName)]
}
get.xjb_canAddSkills = function (skillList) {
    if (!Array.isArray(skillList)) skillList = [skillList];
    if (!game.xjb_condition('jnc', skillList.length)) return false;
    return true;
}

game.xjb_raiseCharChangeSkin = function (name) {
    const bg = `ext:新将包/skin/image/xjb_newCharacter/${name}`
    lib.config.xjb_newcharacter.selectedSkin = bg;
    if (lib.character.xjb_newCharacter) {
        lib.character.xjb_newCharacter[4] = [bg];
    }
    game.xjb_saveRaise();
}
game.xjb_raiseCharGainSkill = function (skillList, free = false, connectDia) {
    if (!Array.isArray(skillList)) skillList = [skillList];
    if (!get.xjb_canAddSkills(skillList)) {
        game.xjb_create.alert('你的技能槽数量不足!').insertDialog(connectDia);
        return false;
    }
    lib.config.xjb_newcharacter.skill.add(...skillList)
    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
    if (!free) game.xjb_systemEnergyChange(-20 * skillList.length);
    return true;
}
game.xjb_findUpdatableSkills = function (skillName) {
    if (!skillName) return [];
    if (!skillName.length) return [];
    let result = [];
    for (let skill of lib.xjb_skillsStore) {
        if (skill === skillName) continue;
        if (get.xjb_allHunSkills().includes(skill)) continue;
        if (get.translation(skillName) === get.translation(skill)) result.push(skill);
    }
    return result;
}
game.xjb_removeSkills = function (skillList) {
    if (!Array.isArray(skillList)) skillList = [skillList];
    lib.config.xjb_newcharacter.skill.remove(...skillList);
    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
}


game.xjb_changePreSkinDia = async () => {
    const { result, bool } = await game.xjb_create.promise.chooseImage(
        "",
        lib.xjb_raiseCharSkinFolder,
        lib.config.xjb_newcharacter.skin,
        function () {
            game.removeFile('extension/新将包/skin/image/xjb_newCharacter/' + this.name)
        }
    );
    if (bool) {
        game.xjb_raiseCharChangeSkin(result);
        await game.xjb_create.promise.alert('更改皮肤为' + result + '，重启即生效');
    }
}
game.xjb_changeToInitialSkinDia = async () => {
    lib.config.xjb_newcharacter.selectedSkin = "ext:新将包/xin_newCharacter.jpg";
    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
    game.xjb_create.alert('已恢复至原皮，重启即生效');
    if (lib.character.xjb_newCharacter) {
        lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSkin];
    }
}
game.xjb_importSkinDia = async () => {
    if (!lib.config.xjb_newcharacter.skin) lib.config.xjb_newcharacter.skin = []
    const { fileData, result, bool } = await game.xjb_create.promise.readImg("请输入你的皮肤名，并选定图片，待确定出现后按确定即可。");
    if (bool === false) return;
    if (lib.config.xjb_newcharacter.skin.includes(result)) {
        const { bool } = await game.xjb_create.promise.confirm("你已有该同名的皮肤，是否覆盖？");
        if (!bool) return game.xjb_importSkinDia()
    }
    await game.xjb_create.promise.download(fileData, lib.config.xjb_fileURL + "skin/image/xjb_newCharacter/" + result);
    lib.config.xjb_newcharacter.skin.add(result);
    game.xjb_saveRaise();
}
game.xjb_addHunSkillsDia = function () {
    const map = {}
    for (const skill of get.xjb_raiseCharNonHunSkills()) {
        map[skill] = `【${get.translation(skill)}】(${skill}，${get.xjb_hunSkillCost(skill)}魂币)`
    }
    const dialog = game.xjb_create.seeDelete(
        map,
        '查看',
        '获得',
        function () {
            if (this.innerText === "查看") {
                const id = this.container.dataset.xjb_id
                this.descEle.innerHTML += `<span>${lib.translate[id + '_info']}</span>`
                this.innerText = "收起"
                this.seeExpanding = true;
            } else if (this.innerText === "收起") {
                const descEle = this.descEle
                const span = descEle.querySelector('span')
                span && span.remove();
                this.innerText = '查看'
            }
        },
        function () {
            this.notAllowRemove = false;
            const id = this.container.dataset.xjb_id;
            const cost = get.xjb_hunSkillCost(id)
            if (!game.xjb_condition('hunbi', cost)) {
                game.xjb_create.alert('你的魂币数量不足!').insertDialog(this.dialog);
                this.notAllowRemove = true;
                return;
            }
            if (!game.xjb_raiseCharGainSkill(id, void 0, this.dialog)) {
                this.notAllowRemove = true;
            }
        },
        function () {
            if (this.result.length) game.xjb_create.alert(`恭喜你获得技能:${this.result}!`)
        }
    )
    return dialog
}
game.xjb_updateSkillsDia = async (skillName, cost = 5, connectDia) => {
    const map = {};
    for (const skill of game.xjb_findUpdatableSkills(skillName)) {
        map[skill] = get.xjb_skillDescription(skill);
    }
    const promise = game.xjb_create.promise.searchChoose(
        `你可以花费${cost}魂币,从以下列表中选择一个技能,将${get.translation(skillName)}(${skillName})替换之`,
        map,
        true
    ).coverDialog(connectDia);
    const dialog = promise.dialog;
    const { result, bool } = await promise;
    if (bool && result !== undefined) {
        const id = result;
        game.xjb_removeSkills(skillName);
        if (game.xjb_raiseCharGainSkill(skillName, void 0, connectDia)) {
            if (connectDia.consturctArgs[0]) {
                delete connectDia.consturctArgs[0][skillName];
                connectDia.consturctArgs[0][id] = get.xjb_skillDescription(id);
            }
            game.xjb_costHunbi(cost, '更换技能');
            game.xjb_create.alert(`已将${get.translation(skillName)}(${skillName})替换成${get.translation(id)}(${id})`)
                .insertDialog(connectDia.reconstruct())
        }
    }
    return dialog
}
game.xjb_raiseCharRemoveUpdateSkillsDia = function () {
    const map = {}
    for (const skill of get.xjb_raiseCharSkills()) {
        map[skill] = `【${get.translation(skill)}】${lib.translate[skill + "_info"]}`
    }
    const feedback = 7;
    const cost = 5;
    const dialog = game.xjb_create.seeDelete(
        map,
        '升级',
        '回收',
        function () {
            this.notAllowRemove = false;
            const id = this.container.dataset.xjb_id;
            if (!game.xjb_condition('hunbi', cost)) {
                game.xjb_create.alert('你的魂币数量不足!').insertDialog(this.dialog)
                this.notAllowRemove = true;
                return;
            }
            if (!game.xjb_findUpdatableSkills(id).length) {
                game.xjb_create.alert('此技能没有可替换的技能!').insertDialog(this.dialog)
                this.notAllowRemove = true;
                return;
            }
            game.xjb_updateSkillsDia(id, cost, this.dialog)
        },
        function () {
            const id = this.container.dataset.xjb_id;
            game.xjb_removeSkills(id);
            game.xjb_getHunbi(feedback, 1, true, true, '回收技能');
        },
        () => { },
        `<div class=xjb-dialog-prompt>回收技能:每个技能回收${feedback}个魂币,点击升级可寻找相似技能替换,花费${5}个魂币。</div>`
    )
    return dialog
}
game.xjb_setInfoDia = async () => {
    const promise = game.xjb_create.promise.prompt('请输入该角色的背景信息', lib.config.xjb_newcharacter.intro)
    const { dialog } = promise;
    dialog.higher();
    const { result } = await promise;
    lib.config.xjb_newcharacter.intro = result;
    game.xjb_saveRaise();
    game.xjb_systemEnergyChange(-1);
}
game.xjb_newCharacterGetTitle = function (num = 1) {
    let list2 = new Array()
    for (let b = 0; b < num; b++) {
        list2.push(Math.round(Math.random() * (lib.config.xjb_title.length - 1)))
    }
    let str = '恭喜' + get.translation('xjb_newCharacter') + '解锁了称号:<br>'
    for (let c = 0; c < list2.length; c++) {
        str += lib.config.xjb_title[list2[c]][0]
        if (!lib.config.xjb_title[list2[c]][1].includes('xjb_newCharacter')) {
            game.xjb_getHunbi(50, void 0, void 0, void 0, '抽奖获取称号')
            lib.config.xjb_title[list2[c]][1].push('xjb_newCharacter')
            game.saveConfig('xjb_title', lib.config.xjb_title);
        }
    }
    game.xjb_create.alert(str)
    game.xjb_systemEnergyChange(-5 * num)
}
game.xjb_newCharacterChangeName = function (num = 1, free) {
    game.xjb_create.prompt("请输入你更改后的姓名:", lib.config.xjb_newcharacter.name2, function () {
        if (this.result !== "") {
            lib.config.xjb_newcharacter.name2 = this.result
            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
            game.xjb_create.alert("你已更名为:<br>" + lib.config.xjb_newcharacter.name2 + "。<br>重启即更新数据");
            game.xjb_systemEnergyChange(-5)
        }
    }).inputOneLine()
}
game.xjb_newCharacterChangeSex = function (num = 1, free) {
    const informationList = {
        object: "changeSexCard",
        num: num,
        free: free,
        list: ['male', 'female', 'none', 'unknown', 'double'],
        previousPrice: 5,
        objectName: '性转卡',
        changeFunc: function (newAttribute) {
            lib.config.xjb_newcharacter.sex = newAttribute
            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
            game.xjb_create.alert("已更改为:" + get.xjb_translation(lib.config.xjb_newcharacter.sex) + "，<br>重启即更新数据");
        }
    }
    game.xjb_create.UABobjectsToChange(informationList)
}
game.xjb_newCharacterChangeGroup = function (num = 1, free) {
    const informationList = {
        object: "changeGroupCard",
        num: num,
        free: free,
        list: ["key", "western"].concat(lib.group),
        previousPrice: 4,
        objectName: '择木卡',
        changeFunc: function (newAttribute) {
            lib.config.xjb_newcharacter.group = newAttribute
            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
            game.xjb_create.alert("已更改为:" + get.xjb_translation(lib.config.xjb_newcharacter.group) + "，<br>重启即更新数据");
        }
    }
    game.xjb_create.UABobjectsToChange(informationList)
}
game.xjb_newCharacterAddJnc = function (num = 1) {
    lib.config.xjb_jnc += num
    game.saveConfig('xjb_jnc', lib.config.xjb_jnc);
    game.xjb_create.alert('你当前技能槽数量为:<br>' + lib.config.xjb_jnc)
    game.xjb_systemEnergyChange(-50 * num)
}
game.xjb_newCharacterAddHp = function (num = 1, free) {
    var hp = lib.config.xjb_newcharacter.hp
    var countCost = function () {
        let count = 0, i = 0
        while (i < num) {
            count += (hp + i) * (hp + i) * 2
            i++
        }
        return count
    }
    function addHp(func) {
        lib.config.xjb_newcharacter.hp += num
        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
        var hp_str = '你现在体力值为:<br>' + lib.config.xjb_newcharacter.hp + '<br>重启即更新数据'
        game.xjb_create.alert(hp_str, func)
        game.xjb_systemEnergyChange(-countCost())
    }
    if (free === false) {
        game.cost_xjb_cost("B", countCost())
        game.xjb_systemEnergyChange(-countCost() - 100)
    }
    addHp()
}
game.xjb_newCharacterGetSkill = function (skillName) {
    if (Object.keys(lib.skill).includes(skillName)) {
        if (game.xjb_condition(3, 1)) { }
        if (game.xjb_condition(3, 1)) {
            game.xjb_create.alert(`你获得了技能${get.translation(skillName)} `)
            lib.config.xjb_newcharacter.skill.add(skillName)
            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
            game.xjb_systemEnergyChange(-20)
        }
    }
}

game.xjb_saveRaise = () => {
    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
}