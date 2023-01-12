import { rollSkill } from "../../diceroll/business/roll"
import { AttributeId, AttributeInputName, SkillConcInputName, SkillExpInputName, SkillId } from '../types/skillTypes'

export const setSkillListeners = function(sheet: Sheet<CharData>) {
    Tables.get('skills').each(function(skill) {
        sheet.get(skill.id + '_btn').on('click', function() {
            rollSkill(sheet, skill, [])
        })
    })
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