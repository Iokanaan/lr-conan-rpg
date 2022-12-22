import { getAttrInputName, getConcInputName, getExpInputName } from "../../skill/listener/skill"
import { Skill, SkillId } from "../../skill/types/skillData"
import { letterToInt } from "../../util/utils"
import { WeaponQualityId } from "../../weapons/types/weaponData"
import { DamageMetadata, DiceResultPopup, RollMetadata } from "../model/damageMetadata"


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
        const popup = new DiceResultPopup(sheet)
        const skillTag = result.allTags.filter(function(e) { return /s_*/g.test(e) })[0]
        const skillId = skillTag.split("_")[1]
        const skill: Skill = { 
            id: skillId as SkillId,
            name: Tables.get('skills').get(skillId).name,
            attribute: Tables.get('skills').get(skillId).attribute
        }
        if(result.allTags.includes('damage')) {
            handleDamageRoll(popup, new DamageMetadata(result), skill)
        } else {
            handleRoll(popup, new RollMetadata(result), skill)
        }
    })
}

const handleRoll = function(sheet: Sheet<DiceResultData>, rollMetadata: RollMetadata, skill: Skill) {
    let rerollable = false
    const pertinentTalents = []
    
    switch (skill.id) {
        case "ACR":
            if(result.allTags.includes('t_AGI')) { rerollable = true }
            if(result.allTags.includes('t_AGIFEL')) { pertinentTalents.push("AGIFEL") }
            if(result.allTags.includes('t_MESS')) { pertinentTalents.push("MESS") }
            break
        case "ALC":
            if(result.allTags.includes('t_ALC')) { rerollable = true }
            break
        case "DIST":
            if(result.allTags.includes('t_PREC') && result.allTags.includes('damage')) { rerollable = true }
            if(result.allTags.includes('t_VISHORI')) { pertinentTalents.push("VISHORI") }
            break
        case "GUE":
            if(result.allTags.includes('t_ARTI') && result.allTags.includes('siege')) { rerollable = true }
        default:
    }

    if(pertinentTalents.length !== 0) {
        sheet.get("infos").value("Talents pertinents:\n" + pertinentTalents.map(function(t) { return Tables.get("talents").get(t).name}).join("\n "))
        if(!sheet.get("infos").value().includes('¹')) {
            sheet.get('info_notes_1').hide()
        }
    } else {
        sheet.get("infos").hide()
        sheet.get('info_notes_1').hide()
        sheet.get('info_Container').removeClass("border")
        sheet.get('info_Container').removeClass("border-secondary")
        sheet.get('info_Container').removeClass("m-2")
        sheet.get('info_Container').removeClass("p-2")
    }

    // Affichage des succès
    sheet.get('total').text(rollMetadata.success + " succès")

    // Gestion des fumbles
    if(rollMetadata.fumbles > 0) {
        sheet.get('fumble').text(rollMetadata.fumbles + " complication(s)")
        sheet.get('fumble').show()
    }
    if(rollMetadata.getRawResult().allTags.includes("attack")) {
        switch (skill.id) {
            case 'GUE':
                if(result.allTags.includes('t_BALLI')) { log("damage +1") }
                break
            default:
        }
        if(rollMetadata.nbAttackDice !== undefined) {
            setDamageButton(sheet, rollMetadata)
        }
    } else {
        sheet.get("damage_Btn").hide()
    }
    setRerollButton(sheet, rollMetadata, rerollable)
}

const handleDamageRoll = function(popup: DiceResultPopup, damageMetadata: DamageMetadata, skill: Skill) {
    log("handle damage roll")
    popup.sheet.get("damage_Btn").hide()
    let rerollable = false
    const pertinentTalents: string[] = []
    switch (skill.id) {
        case "DIST":
            if(result.allTags.includes('t_PREC')) { rerollable = true }
            break
        case "GUE":
            if(result.allTags.includes('t_ARTI') && result.allTags.includes('siege')) { rerollable = true }
            break
        default:
    }
    if(pertinentTalents.length !== 0) {
        popup.sheet.get("infos").value("Talents pertinents:\n" + pertinentTalents.map(function(t) { return Tables.get("talents").get(t).name}).join("\n* "))
    } else {
        popup.sheet.get("infos").hide()
    }

    const qualityTags = result.allTags.filter(function(e) { return /q_*/g.test(e) })

    qualityTags.forEach(function(tag) {
        damageMetadata.applyQuality(tag.split('_')[1] as WeaponQualityId, letterToInt(tag.split('_')[2]))
    })

    if(damageMetadata.getNonLetal()) {
        sheet.get('total').text("Non létal")
    } else {
        sheet.get('total').text(damageMetadata.getDamage() + " dégât(s)")
    }

    const effects = damageMetadata.getEffects()
    if(effects.length !== 0) {
        sheet.get('effect').text(effects.join("\n"))
        sheet.get('effect').show()
    } else {
        sheet.get('effect').hide()
    }
    
    const badEffects = damageMetadata.getBadEffects()
    if(badEffects.length > 0) {
        sheet.get('fumble').text(badEffects.join("\n"))
        sheet.get('fumble').show()
    } else {
        sheet.get('fumble').hide()
    }
    
    if(pertinentTalents.length !== 0) {
        sheet.get("infos").value("Talents pertinents:\n" + pertinentTalents.map(function(t) { return Tables.get("talents").get(t).name}).join("\n "))
        if(!sheet.get("infos").value().includes('¹')) {
            sheet.get('info_notes_1').hide()
        }
    } else {
        sheet.get("infos").hide()
        sheet.get('info_notes_1').hide()
        sheet.get('info_Container').removeClass("border")
        sheet.get('info_Container').removeClass("border-secondary")
        sheet.get('info_Container').removeClass("m-2")
        sheet.get('info_Container').removeClass("p-2")
    }

    setRerollButton(sheet, damageMetadata, rerollable)
}

