window.XJB_LOAD_RAISE = function (_status, lib, game, ui, get, ai) {
    lib.xjb_hunList.skill = {
        first: ["xjb_juanqu", "xjb_lunhui","xjb_hanhua","xjb_bingdi"],
        second: ["xjb_leijue", "xjb_bingjue","xjb_jinghua","xjb_wei_fengtian"],
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
        if (typeof skillList === "string") skillList = [skillList];
        if (!game.xjb_condition('jnc', skillList.length)) return false;
        return true;
    }
    game.xjb_raiseCharGainSkill = function (skillList, free = false, connectDia) {
        if (typeof skillList === "string") skillList = [skillList];
        if (!get.xjb_canAddSkills(skillList)) {
            if (connectDia) connectDia.classList.add('xjb_hidden')
            game.xjb_create.alert('你的技能槽数量不足!', () => {
                if (connectDia) connectDia.classList.remove('xjb_hidden')
            });
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
        if (typeof skillList === "string") skillList = [skillList];
        lib.config.xjb_newcharacter.skill.remove(...skillList);
        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
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
                    this.dialog.classList.add("xjb_hidden")
                    game.xjb_create.alert('你的魂币数量不足!', () => {
                        this.dialog.classList.remove("xjb_hidden")
                    })
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

    game.xjb_updateSkillsDia = function (skillName, cost = 5, connectDia) {
        const map = {};
        for (const skill of game.xjb_findUpdatableSkills(skillName)) {
            map[skill] = `【${get.translation(skill)}】(${skill})`
        }
        if (connectDia) connectDia.classList.add("xjb_hidden")
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
                game.xjb_removeSkills(skillName);
                if (!game.xjb_raiseCharGainSkill(id, void 0, this.dialog)) {
                    this.notAllowRemove = true;
                    return;
                }
                this.yesButton.activate();
            },
            function () {
                if (this.result.length) {
                    const id = this.result[0];
                    game.xjb_costHunbi(cost, '更换技能')
                    game.xjb_create.alert(`已将${get.translation(skillName)}(${skillName})替换成${get.translation(id)}(${id})`, () => {
                        connectDia.classList.remove("xjb_hidden")
                    })
                    return;
                }
                if (connectDia) connectDia.classList.remove("xjb_hidden")
            },
            `你可以花费${cost}魂币,从以下技能列表中选择一个技能,将${get.translation(skillName)}(${skillName})替换之`
        )
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
                    this.dialog.classList.add("xjb_hidden")
                    game.xjb_create.alert('你的魂币数量不足!', () => {
                        this.dialog.classList.remove("xjb_hidden")
                    })
                    this.notAllowRemove = true;
                    return;
                }
                if (!game.xjb_findUpdatableSkills(id).length) {
                    this.dialog.classList.add("xjb_hidden")
                    game.xjb_create.alert('此技能没有可替换的技能!', () => {
                        this.dialog.classList.remove("xjb_hidden")
                    })
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
}