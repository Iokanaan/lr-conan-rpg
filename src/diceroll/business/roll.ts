import { getAttrInputName, getConcInputName, getExpInputName } from "../../skill/listener/skill"
import { Skill, SkillId } from "../../skill/types/skillData"
import { letterToInt } from "../../util/utils"
import { WeaponQualityId } from "../../weapons/types/weaponData"


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
        const skillId = skillTag.split("_")[1]
        const skill: Skill = { 
            id: skillId as SkillId,
            name: Tables.get('skills').get(skillId).name,
            attribute: Tables.get('skills').get(skillId).attribute
        }
        if(result.allTags.includes('damage')) {
            handleDamageRoll(sheet, result, skill)
        } else {
            handleRoll(sheet, result, skill)
        }
    })
}

const handleRoll = function(sheet: Sheet<DiceResultData>, result: DiceResult, skill: Skill) {
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
    sheet.get('total').text(result.success + " succès")
    // Gestion des fumbles
    let fumbleCount = 0
    result.all.forEach(function(roll) {
        if(roll.value === 20 || (roll.value === 19 && result.containsTag('noskill'))) {
            fumbleCount++
        }
    })
    if(fumbleCount > 0) {
        sheet.get('fumble').text(fumbleCount + " complication(s)")
        sheet.get('fumble').show()
    }
    if(result.allTags.includes("attack")) {
        switch (skill.id) {
            case 'GUE':
                if(result.allTags.includes('t_BALLI')) { log("damage +1") }
                break
            default:
        }
        setDamageButton(sheet, result)
    } else {
        sheet.get("damage_Btn").hide()
    }
    setRerollButton(sheet, result, rerollable)
}

const handleDamageRoll = function(sheet: Sheet<DiceResultData>, result: DiceResult, skill: Skill) {
    log("handle damage roll")
    sheet.get("damage_Btn").hide()
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
        sheet.get("infos").value("Talents pertinents:\n" + pertinentTalents.map(function(t) { return Tables.get("talents").get(t).name}).join("\n* "))
    } else {
        sheet.get("infos").hide()
    }

    class DamageMetadata {
        constructor(result: DiceResult) {
            this.damage = result.success
            this.nbEffects = result.all.filter(function(roll) { return roll.value === 5 || roll.value === 6 }).length
            this.rawResult = result
        }
        damage: number
        selfDamage: number = 0
        mentalDamage: number = 0
        wounds: number = 0
        nbLocalisation: number = 1
        effects: string[] = []
        badEffects: string[] = []
        readonly nbEffects: number
        readonly rawResult: DiceResult
    }

    type QualityEffect = Record<WeaponQualityId, (damageMetadata: DamageMetadata, level: number) => void>


    let damageMetadata: DamageMetadata = new DamageMetadata(result)   
    const qualityTags = result.allTags.filter(function(e) { return /q_*/g.test(e) })

    const qualityTests: QualityEffect = {
        "AVE" : function(damageMetadata) { damageMetadata.effects.push("Avenglant") },
        "CRU": function(damageMetadata, level) { damageMetadata.damage += damageMetadata.nbEffects * level },
        "BOU": function() {},
        "JET": function() {},
        "CAV": function(damageMetadata, level) { 
            if(damageMetadata.rawResult.containsTag('mounted')) {
                damageMetadata.damage += damageMetadata.nbEffects * level        
            }
        },
        'PERF': function(damageMetadata, level) { 
            if(damageMetadata.nbEffects > 0) { 
                damageMetadata.effects.push("-" + (damageMetadata.nbEffects * level) + " à l'encaissement") 
            }
        },
        'CON': function(damageMetadata, level) { damageMetadata.selfDamage += damageMetadata.nbEffects * level },
        'ETEN': function(damageMetadata, level) { damageMetadata.nbLocalisation += damageMetadata.nbEffects * level },
        'ETOU': function(damageMetadata) { 
            if(damageMetadata.nbEffects > 0) { 
                damageMetadata.effects.push("Désorienté (" + damageMetadata.nbEffects + ")") 
            } 
        },
        'CACH': function() {},
        'ETRE': function(damageMetadata) { if(damageMetadata.nbEffects > 0) { damageMetadata.effects.push("Immobilisé") }},
        'FRA': function(damageMetadata) { if(damageMetadata.nbEffects > 0) { damageMetadata.badEffects.push("L'arme perd " + damageMetadata.nbEffects + " dégât(s)")}}
    }

    qualityTags.forEach(function(tag) {
        qualityTests[tag.split('_')[1] as WeaponQualityId](damageMetadata, letterToInt(tag.split('_')[2]))     
    })

    // Gestion de IMPROVISE
    if(result.allTags.includes("q_IMP")) {
        damage -= nbEffects
    }

    // Gestion de INCENDIAIRE
    const incendiaireTag = result.allTags.filter(function(e) { return /q_INC_*/g.test(e) })[0]
    if(incendiaireTag !== undefined && nbEffects > 0) {
        effets.push("Enflammé: " + letterToInt(incendiaireTag.split("_")[2]) + "d6/" + nbEffects)
    }
            
    // Gestion de LETALITE
    const letaliteTag = result.allTags.filter(function(e) { return /q_LET_*/g.test(e) })[0]
    if(letaliteTag !== undefined && result.allTags.includes("exploitation") && nbEffects > 0) {
        result.allTags.push("q_INT")
        damage += nbEffects * 2
    }

    // Gestion de INTENSE
    if(result.allTags.includes("q_INT")) {
        wounds++
    }

    // Gestion de MISE A TERRE
    if(result.allTags.includes("q_MAT") && nbEffects > 0) {
        effets.push("Mise à terre (" + nbEffects + ")")
    }
            
    // Gestion de PERSISTANT
    const persistantTag = result.allTags.filter(function(e) { return /q_PERS*/g.test(e) })[0]
    if(persistantTag !== undefined && nbEffects > 0) {
        effets.push("Persistant: " + letterToInt(persistantTag.split("_")[2]) + "d6/" + nbEffects)
    }

    // Gestion de REDOUTABLE
    const redoutableTag = result.allTags.filter(function(e) { return /q_RED*/g.test(e) })[0]
    if(redoutableTag !== undefined && nbEffects > 0) {
        mentalDamage += nbEffects * letterToInt(redoutableTag.split("_")[2])
    }

    // Gestion de ZONE
    if(result.allTags.includes("q_ZON") && nbEffects > 0) {
        effets.push(nbEffects + " cibles supplémentaires")
    }

    // Gestion de NON-LETAL
    if(result.allTags.includes('q_NLET')) {
        damage = 0
        if(nbEffects > 0 && 
        !result.allTags.includes('q_EMP') &&
        !result.allTags.includes('q_AVE') &&
        !result.allTags.includes('q_MAT') &&
        !incendiaireTag !== undefined &&
        !result.allTags.includes("q_ETRE") &&
        !result.allTags.includes("q_ETOU")) {
            effets.push("Sonné")
        }
    }

    if(wounds > 0) {
        effets.push("+" + wounds + " dommage(s)")
    }

    if(mentalDamage > 0) {
        effets.push(mentalDamage + " dégâts mentaux")
    }

    if(selfDamage > 0) {
        badEffects.push(selfDamage + " dégât(s) subis")
    }

    if(result.allTags.includes('q_NLET')) {
        sheet.get('total').text("Non létal")
    } else {
        sheet.get('total').text(damage + " dégât(s)")
    }

    if(effets.length !== 0) {
        sheet.get('effect').text(effets.join("\n"))
        sheet.get('effect').show()
    } else {
        sheet.get('effect').hide()
    }
    
    if(badEffects.length > 0) {
        sheet.get('fumble').text(badEffects.join("\n"))
        sheet.get('fumble').show()
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
    setRerollButton(sheet, result, rerollable)
}

const setDamageButton = function(sheet: Sheet<DiceResultData>, result: DiceResult) {
    const damageTag = result.allTags.filter(function(e) { return /d_*/g.test(e) })[0]
    let damage = letterToInt(damageTag.split("_")[1])
    const voleeTag = result.allTags.filter(function(e) { return /v_*/g.test(e) })[0]
    if(voleeTag !== undefined) {
        const voleeWithCharge = letterToInt(voleeTag.split("_")[1])
        damage += voleeWithCharge
    }
    
    // Expression pour convertir le d6 au format CONAN (1=1,2=2,3=0,4=0,5=1+effet,6=1+effet)
    let damageExpression = damage + "d6 <{2:2,3:0,4:0,5:1,6:1} 7"
    const idx = result.allTags.indexOf("attack")
    const damageTags = result.allTags.filter(function(e){return e !== "attack"})
    damageTags.push("damage")
    // Ajout des qualités
    damageExpression += "[" + damageTags.join() + "]"
    const damageRoll = new RollBuilder(sheet)
    damageRoll.expression(damageExpression)
        .visibility("visible")
        .title("Dégâts")
    sheet.get("damage_Btn").on("click", function() {
        damageRoll.roll()
    })
}

const setRerollButton = function(sheet: Sheet<DiceResultData>, result: DiceResult, rerollable: boolean) {
    if(rerollable) {
        const rerollChoices:Record<string, string> = {}
        result.all.forEach(function(roll, index) {
            rerollChoices[index.toString()] = roll.value.toString()
        });
        (sheet.get("reroll") as ChoiceComponent).setChoices(rerollChoices)
        sheet.get("reroll_Btn").on("click", function() {
            // Construction de l'expression
            const rerollDice = Dice.create(result.expression.replace(/[0-9]+d/i, sheet.get("reroll").value().length + "d")).tag("reroll")
            //log(result.expression.replace(/[0-9]+d/i, sheet.get("reroll").value().length + "d"))
            Dice.roll(sheet, rerollDice, result.title)
        })
    } else {
        sheet.get("reroll").hide()
        sheet.get("reroll_Btn").hide()
    }
}