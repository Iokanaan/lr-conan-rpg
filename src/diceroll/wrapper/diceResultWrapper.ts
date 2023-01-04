import { SkillId } from "../../skill/types/skillTypes"
import { TalentId } from "../../talents/types/talentTypes"
import { charToInt } from "../../util/utils"

/**
 * Code des tags
 * s = skill
 * d = damage
 * t = talent
 * v = charges de volee
 * q = qualité
 * ns = no skill
 * dm = damage roll
 */
export type TagCategory = 's' | 'd' | 'v' | 't' | 'q' | 'ns' | 'dm'

export interface DiceResultWrapper {
    success: number
    skillId: SkillId
    fumbles: number
    nbAttackDice: number
    talentActions: Record<TalentId, (lvl: number) => void> 
    tagActions: Record<TagCategory, (lvl: number, label: string) => void>
    rerollable: boolean
    rawResult: DiceResult
    pertinentTalents: TalentId[]
}

export const DiceResultWrapper = function (this: DiceResultWrapper, result: DiceResult) {
    // Default Values    
    this.success = result.success
    this.skillId = result.allTags.filter(function(e) { return /^s_/g.test(e) })[0] as SkillId
    this.rerollable = false
    this.fumbles = 0
    this.nbAttackDice = 0
    this.pertinentTalents = []
    this.rawResult = result
    this.talentActions = {
        'AGI': function(this: DiceResultWrapper) { this.rerollable = true },
        'AGIFEL': function(this: DiceResultWrapper) { this.pertinentTalents.push('AGIFEL') },
        'MESS': function(this: DiceResultWrapper) { this.pertinentTalents.push('MESS') },
        'PREC': function(this: DiceResultWrapper) {}
    }
    this.tagActions = {
        's': function() {},
        'd': function(this: DiceResultWrapper, lvl) { this.nbAttackDice  += lvl },
        'v': function(this: DiceResultWrapper, lvl) { this.nbAttackDice  += lvl },
        't': function(this: DiceResultWrapper, lvl, label) {
            if(Tables.get("talents").get(label as TalentId).skill === this.skillId) {
                this.talentActions[label as TalentId].call(this, lvl)
            }
        },
        'q': function() {},
        'ns': function(this: DiceResultWrapper) {
            for(var idx in this.rawResult.all) {
                if(this.rawResult.all[idx].value === 19) {
                    this.fumbles++
                }
            }
        },
        'dm': function() {}
    }
    // Constructor
    for(var idx in this.rawResult.all) {
        if(this.rawResult.all[idx].value === 20) {
            this.fumbles++
        }
    }
    for(var idx in result.allTags) {
        let tagInfo = result.allTags[idx].split("_")
        this.tagActions[tagInfo[0] as TagCategory].call(this, charToInt(tagInfo[2]), tagInfo[1])
    }

    return this
} as any as { (result: DiceResult): DiceResultWrapper }
