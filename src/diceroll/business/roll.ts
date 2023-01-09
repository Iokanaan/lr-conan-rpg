
import { globalSheets } from "../../globals"
import { getAttrInputName, getConcInputName, getExpInputName } from "../../skill/listener/skill"
import { Skill } from "../../skill/types/skillTypes"
import { intToWord, wordToInt } from "../../util/utils"
import { DamageDiceResultPopup } from "../prompt/damageDiceResultPopup"
import { DiceResultPopup } from "../prompt/diceResultPopup"
import { DamageDiceResultWrapper } from "../wrapper/damageDiceResultWrapper"
import { DiceResultWrapper } from "../wrapper/diceResultWrapper"


export const rollSkill = function(sheet: Sheet<CharData>, skill: Skill, tags: string[]) {
    log('roll init')
    log(sheet.getSheetId())
    log(intToWord(sheet.getSheetId()))
    tags.push('sheet_' + intToWord(sheet.getSheetId()))
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
        tags.push("ns")
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
        log('rolling')
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
export const rollResultHandler = function(result: DiceResult, callback: DiceResultCallback) {
    callback('diceResult', function(sheet) {
        log('cb')
        const sheetId = wordToInt(result.allTags.filter(function(e) { return /^sheet_/g.test(e) })[0].split('_')[1])
        log(sheetId)
        log(globalSheets[sheetId].getData())
        if(result.allTags.includes('dm')) {
            DamageDiceResultPopup
                .call(sheet)
                .render(DamageDiceResultWrapper.call({}, result));
        } else {
            DiceResultPopup
                .call(sheet)
                .render(DiceResultWrapper.call({}, result));
        }
    })
}

