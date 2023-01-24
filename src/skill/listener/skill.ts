import { rollSkill } from "../../diceroll/business/roll"
import { getCombatBonus } from "../../util/utils"
import { AttributeId, AttributeInputName, SkillConcInputName, SkillExpInputName, SkillId } from '../types/skillTypes'

export const setSkillListeners = function(sheet: Sheet<CharData>) {
    Tables.get('skills').each(function(skill) {
        sheet.get(skill.id + '_btn').on('click', function() {
            rollSkill(sheet, skill, [])
        })
    })
    sheet.get(getAttrInputName('CON')).on('update', combatAttrHandler(sheet.get('melee_bonus'), sheet.get('melee_bonus_label')))
    sheet.get(getAttrInputName('PERC')).on('update', combatAttrHandler(sheet.get('ranged_bonus'), sheet.get('ranged_bonus_label')))
    sheet.get(getAttrInputName('PERS')).on('update', combatAttrHandler(sheet.get('mental_bonus'), sheet.get('mental_bonus_label')))
}

export const getExpInputName = function(id: SkillId) {
    return id + '_Exp_Inpt' as SkillExpInputName
}

export const getConcInputName = function(id: SkillId) {
    return id + '_Conc_Inpt' as SkillConcInputName
}

export const getAttrInputName = function(id: AttributeId) {
    return id + '_Inpt' as AttributeInputName
}

const combatAttrHandler = function(bonusCmp: Component<number>, bonusLabelCmp: Component<string>) {
    return function(event: LrEvent<number>) {
        const bonus = getCombatBonus(event.value())
        bonusCmp.value(bonus)
        bonusLabelCmp.value('+' + bonus)
    }
}