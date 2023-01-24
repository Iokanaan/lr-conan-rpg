import { SkillId } from "../../skill/types/skillTypes";
import { Quality, WeaponQualityId } from "../../weapons/types/weaponTypes";

export interface QualityHolder {
    id: WeaponQualityId,
    lvl?: number
}

export const threatHandler = function(sheet: Sheet<CharData>, skillId: SkillId, damage: number, qualities: QualityHolder[]): (elem: Component<unknown>) => void {
    return function(elem: Component<unknown>) { 
        const talentIds: string[] = []
        each<TalentData>(sheet.get('talents').value(), function(talent) {
            talentIds.push(talent.talents_Choice)
        }) 
        // Initialiser les metadonnees de l'attaque
        const tags = processQualitiesTag(qualities)
        tags.push("d__" + intToChar(damage))
        rollSkill(sheet, Tables.get("skills").get("MEL"), tags)
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