import { findPrefix } from "../tool/string.js";

export class EditorOrganize {
    static testSentenceIsOk(str) {
        try {
            new Function(str);
        } catch (err) {
            if (err) return false;
        }
        return true;
    }
    static skillTag(back) {
        const { marktext, markName, markContent,
            prompt, prompt2,
            type, kind, filterTarget, filterCard,
            uniqueList } = back.skill
        let result = ''
        if (marktext && marktext.length) {
            result += `marktext:"${marktext}",\n`
        };
        if (markName && markContent) {
            result += 'intro:{\n';
            result += `name:"${markName}",\n`
            result += `content:"${markContent}",\n`
            result += '},\n';
        }
        if (prompt) {
            result += `prompt:"${prompt}",\n`
        }
        if (prompt2) {
            result += `prompt2:"${prompt2}",\n`
        }
        //遍历技能类别
        type.forEach(tagItem => {
            if (tagItem === 'filterTarget'
                && (kind != 'enable:"phaseUse"' || filterTarget.length > 0)) return;
            else if (tagItem === 'filterCard'
                && (kind != 'enable:"phaseUse"' || filterCard.length > 0)) return;
            else if (tagItem === 'groupSkill') {
                const group = findPrefix(uniqueList, "group").map(k => k.slice(6))
                if (group.length > 0) {
                    result += `groupSkill:"${group[0]}",\n`;
                    return;
                }
            }
            else if (tagItem.endsWith("-n")) {
                result += `${tagItem.replace("-", ":")},\n`
                return;
            }
            else if (["lose-false", "discard-false", "delay-false"].includes(tagItem)) {
                result += `${tagItem.replace('-false', '')}:false,\n`
                return;
            }
            result += `${tagItem}:true,\n`;
        })
        if (type.includes("locked-false")) {
            result = result.replaceAll('locked-false:true', "locked:false")
            result = result.replaceAll('locked:true,\n', "")
        }
        if (uniqueList.some(tag => tag.includes("animation-"))) {
            const animation = findPrefix(uniqueList, "animation").map(k => k.slice(10))
            result += `animationColor:"${animation}",\n`
        }
        return result;
    }
}
