import { getAttrInputName, getConcInputName, getExpInputName } from "../../skill/listener/skill"
import { Skill, SkillId } from "../../skill/types/skillData"


export const rollSkill = function(sheet: Sheet<CharData>, skill: Skill, tags: string[]) {

    each(sheet.get("talents").value(), function(talent) {
        tags.push("t_" + talent.talents_Choice)
    })
    tags.push("s_" + skill.id)
    const compvalue = sheet.get(getExpInputName(skill.id)).value() + sheet.get(getAttrInputName(skill.attribute)).value()
    const concValue = sheet.get(getConcInputName(skill.id)).value()
    const crits: string[] = []

    // Faire compter les critiques double sur la base de la concentration
    if(concValue > 0) {
        for(let i = 1; i <= concValue; i++) {
            crits.push(i + ":2")
        }
    } 
    
    // Ajouter un tag au lancer si on a 0 dans la compétence
    if(sheet.get(getExpInputName(skill.id)).value() + concValue === 0) {
        tags.push("noskill")
    }

    // Prendre l'intensité définie sur la feuille (par défaut 2)
    let intensity = (sheet.getData().roll_intensity !== undefined) ? parseInt(sheet.getData().roll_intensity) : 2
    const voleeTag = tags.filter(function(e) { return /v_*/g.test(e) })[0]
    if(voleeTag !== undefined) {
        intensity =  intensity + parseInt(voleeTag.split("_")[1])
    }

    // Construction de l'expression
    let diceExpression = intensity + "d20 <="
    diceExpression += (crits.length !== 0) ? "{" + crits.join() + "} " : " "
    diceExpression += compvalue
    diceExpression += (tags.length !== 0) ? "[" + tags.join() + "]" : ""
    const roll = new RollBuilder(sheet)
    roll.expression(diceExpression)
        .visibility("visible")
        .title(skill.name)
    roll.roll();
}

/**
 * Code des tags
 * s = skill
 * d = damage
 * t = talent
 * v = charges de volee
 * q = qualité
 */
export const roll = function(result: DiceResult, callback: DiceResultCallback) {
    callback('diceResult', function(sheet) {
        const skillTag = result.allTags.filter(function(e) { return /s_*/g.test(e) })[0]
        let skill: Skill | undefined = undefined
        if(skillTag != undefined) {
            const skillId = skillTag.split("_")[1]
            skill = { 
                id: skillId as SkillId,
                name: Tables.get('skills').get(skillId).name,
                attribute: Tables.get('skills').get(skillId).attribute
            }
        } 
        if(result.allTags.includes('damage')) {
            handleDamageRoll(sheet, result, skill)
        } else {
            handleRoll(sheet, result, skill)
        }
    })
}