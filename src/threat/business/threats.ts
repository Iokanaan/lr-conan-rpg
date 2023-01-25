import { rollSkill } from "../../diceroll/business/roll";
import { SkillId } from "../../skill/types/skillTypes";
import { intToChar } from "../../util/utils";
import { WeaponQualityId } from "../../weapons/types/weaponTypes";

export interface QualityHolder {
    id: WeaponQualityId,
    lvl?: number
}

export const threatHandler = function(sheet: Sheet<CharData>, skillIds: SkillId[], damage: number, qualities: QualityHolder[]): () => void {
    return function() { 
        handleThreat(sheet, skillIds, damage, qualities)
    }
}

export const redouteThreatHandler = function(sheet: Sheet<CharData>, skillIds: SkillId[], qualities: QualityHolder[]): () => void {
    return function() { 
        handleThreat(sheet, skillIds, sheet.get('renomee').value(), qualities)  
    }
}

export const solRougeThreatHandler = function(sheet: Sheet<CharData>, skillIds: SkillId[], qualities: QualityHolder[]): () => void {
    return function() {
        sheet.prompt('Ennemis tués', 'NumberPrompt', function(result) {
            handleThreat(sheet, skillIds, result.number_input, qualities)
        })
    }
}

const handleThreat = function(sheet: Sheet<CharData>, skillIds: SkillId[], damage: number, qualities: QualityHolder[]) {
    // Initialiser les metadonnees de l'attaque
    const tags = processQualitiesTag(qualities)
    tags.push("d__" + intToChar(damage + sheet.get('mental_bonus').value()))

    if(skillIds.length === 1) {
        rollSkill(sheet, Tables.get('skills').get(skillIds[0]), tags)
    } else {
        sheet.prompt('Compétence à utiliser', 'ChargePrompt', function(result) {
            log(result)
            rollSkill(sheet, Tables.get('skills').get(result.yesno), tags)
        }, function(promptSheet: Sheet<YesNoData>) {
            const skillChoices: Partial<Record<SkillId, string>> = {}
            for(var idx in skillIds) {
                const skill = Tables.get('skills').get(skillIds[idx])
                skillChoices[skill.id as SkillId] = skill.name 
            }
            (promptSheet.get("yesno") as ChoiceComponent).setChoices(skillChoices)
        })
    }
}


const processQualitiesTag = function(qualities: QualityHolder[]) {
    return qualities.map(function(quality) {
        if(quality.lvl !== undefined) {
            // Sale, les tags ne peuvent pas contenir de chiffre, on doit compter avec des lettres
            return "q_" + quality.id + "_" + intToChar(quality.lvl)
        }
        return "q_" + quality.id
    })
}
