import { SkillId } from "../../skill/types/skillData"
import { TalentId } from "../../talent/types/talentTypes"
import { letterToInt } from "../../util/utils"

// export type DiceResultWrapper = {
//     success: number
//     skillId: SkillId
//     fumbles: number
//     nbAttackDice: number
//     talentEffects: Record<TalentId, (metadata: DiceResultWrapper, lvl: number) => void> 
//     rerollable: boolean
//     rawResult: DiceResult
//     pertinentTalents: TalentId[]
// }

// export const DiceResultWrapper = function (this: DiceResultWrapper, result: DiceResult) {
//     // Default Values    
//     this.success = result.success
//     this.skillId = result.allTags.filter(function(e) { return /s_*/g.test(e) })[0] as SkillId
//     this.rerollable = false
//     this.fumbles = 0
//     this.nbAttackDice = 0
//     this.pertinentTalents = []
//     this.rawResult = result
//     this.talentEffects = {
//         'AGI': function(r: DiceResultWrapper) { r.rerollable = true },
//         'AGIFEL' : function(r: DiceResultWrapper) { r.pertinentTalents.push('AGIFEL') },
//         'MESS' : function(r: DiceResultWrapper) { r.pertinentTalents.push('MESS') }
//     }

//     // Constructor
//     let fumbleCount = 0
//     result.all.forEach(function(roll) {
//         if(roll.value === 20 || (roll.value === 19 && result.allTags.includes('noskill'))) {
//             fumbleCount++
//         }
//     })
//     this.fumbles = fumbleCount
//     const weaponAttackTag = result.allTags.filter(function(e) { return /d_*/g.test(e) })[0]
//     if(weaponAttackTag !== undefined) {
//         this.nbAttackDice = letterToInt(weaponAttackTag.split('_')[1])
//         const voleeTag = result.allTags.filter(function(e) { return /v_*/g.test(e) })[0]
//         if(voleeTag !== undefined) {
//             this.nbAttackDice += letterToInt(voleeTag.split('_')[1])
//         }
//     } else {
//         this.nbAttackDice = 0
//     }
//     const that = this
//     result.allTags.filter(function(e) { return /t_*/g.test(e) }).forEach(function(tag) {
//         const talentId = tag.split('_')[1] as TalentId
//         if(Tables.get('talents').get(talentId).skill === that.skillId) {
//             const talentLvl = tag.split('_')[2]
//             if(talentLvl !== undefined) {
//                 that.talentEffects[talentId](that, letterToInt(talentLvl))
//             } else {
//                 that.talentEffects[talentId](that, 1)
//             }
//         }
//     })
// } as any as { new (result: DiceResult): DiceResultWrapper }


export class DiceResultWrapper {

    protected success: number
    protected readonly skillId: SkillId
    protected readonly pertinentTalents: TalentId[] = []
    private readonly fumbles: number
    protected readonly rawResult: DiceResult
    protected rerollable: boolean = false
    private readonly nbAttackDice: number
    protected readonly talentEffects: Record<TalentId, (metadata: DiceResultWrapper, lvl: number) => void> = {
       'AGI': function(r) { r.rerollable = true },
       'AGIFEL' : function(r) { r.pertinentTalents.push('AGIFEL') },
       'MESS' : function(r) { r.pertinentTalents.push('MESS') }
    }

    constructor(result: DiceResult) {
        this.success = result.success
        this.skillId = result.allTags.filter(function(e) { return /s_*/g.test(e) })[0] as SkillId
        let fumbleCount = 0
        result.all.forEach(function(roll) {
            if(roll.value === 20 || (roll.value === 19 && result.allTags.includes('noskill'))) {
                fumbleCount++
            }
        })
        this.fumbles = fumbleCount
        const weaponAttackTag = result.allTags.filter(function(e) { return /d_*/g.test(e) })[0]
        if(weaponAttackTag !== undefined) {
            this.nbAttackDice = letterToInt(weaponAttackTag.split('_')[1])
            const voleeTag = result.allTags.filter(function(e) { return /v_*/g.test(e) })[0]
            if(voleeTag !== undefined) {
                this.nbAttackDice += letterToInt(voleeTag.split('_')[1])
            }
        } else {
            this.nbAttackDice = 0
        }
        const that = this
        result.allTags.filter(function(e) { return /t_*/g.test(e) }).forEach(function(tag) {
            const talentId = tag.split('_')[1] as TalentId
            if(Tables.get('talents').get(talentId).skill === that.skillId) {
                const talentLvl = tag.split('_')[2]
                if(talentLvl !== undefined) {
                    that.talentEffects[talentId](that, letterToInt(talentLvl))
                } else {
                    that.talentEffects[talentId](that, 1)
                }
            }
        })
        this.rawResult = result
    }

    getRawResult() {
        return this.rawResult
    }

    getFumbles() {
        return this.fumbles
    }

    isRerollable() {
        return this.rerollable
    }

    setRerollable(rerollable: boolean) {
        this.rerollable = rerollable
    }

    getSuccess() {
        return this.success
    }

    getNbAttackDice() {
        return this.nbAttackDice
    }

    getPertinentTalents() {
        return this.pertinentTalents
    }

}