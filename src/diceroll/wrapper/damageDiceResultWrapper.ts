import { TalentId } from "../../talent/types/talentTypes"
import { letterToInt } from "../../util/utils"
import { WeaponQualityId } from "../../weapons/types/weaponData"
import { DiceResultWrapper } from "./diceResultWrapper"

// export type DamageDiceResultWrapper = DiceResultWrapper & {
//     selfDamage: number
//     mentalDamage: number
//     intense: boolean
//     nonLetal: boolean
//     additionalLocalisations: number
//     effects: string[]
//     badEffects: string[]
//     nbEffects: number
//     qualityEffects: Record<WeaponQualityId, (damageMetadata: DamageDiceResultWrapper, level: number) => void>
//     getEffects: () => string[]
//     getBadEffects: () => string[]
// }

// export const DamageDiceResultWrapper = function(this: DamageDiceResultWrapper, result: DiceResult) {
//     // Super
//     DiceResultWrapper.call(this, result) 
//     // Default values
//     this.selfDamage = 0
//     this.mentalDamage = 0
//     this.intense = false
//     this.nonLetal = false
//     this.additionalLocalisations = 0
//     this.effects = []
//     this.badEffects = []
//     this.nbEffects = result.all.filter(function(roll) { return roll.value === 5 || roll.value === 6 }).length
//     this.qualityEffects = {
//         'AVE' : function(d) { d.effects.push("Aveuglant") },
//         'CRU': function(d, lvl) { d.success += d.nbEffects * lvl },
//         'BOU': function() {},
//         'JET': function() {},
//         'CAV': function(d, lvl) { if(d.rawResult.allTags.includes('mounted')) { d.success += d.nbEffects * lvl } },
//         'PERF': function(d, lvl) { d.effects.push("-" + (d.nbEffects * lvl) + " à l'encaissement") },
//         'CON': function(d, lvl) { d.selfDamage += d.nbEffects * lvl },
//         'ETEN': function(d, lvl) { d.additionalLocalisations += d.nbEffects * lvl },
//         'ETOU': function(d) { d.effects.push("Désorienté (" + d.nbEffects + ")") },
//         'CACH': function() {},
//         'ETRE': function(d) { d.effects.push("Immobilisé") },
//         'FRA': function(d) { d.badEffects.push("L'arme perd " + d.nbEffects + " dégât(s)")},
//         'IMP': function(d) { d.success -= d.nbEffects},
//         'INC': function(d, lvl) { d.effects.push("Enflammé: " + lvl + "d6/" + d.nbEffects)},
//         'INT': function(d) { d.intense = true },
//         'LET': function(d) { 
//             if(d.rawResult.allTags.includes('exploitation')) {
//                  d.success += d.nbEffects * 2 
//                  d.intense = true
//             }
//         },
//         'MAT': function(d) { d.effects.push("Mise à terre (" + d.nbEffects + ")") },
//         'NLET': function(d) { if(
//             !d.rawResult.allTags.includes('q_EMP') &&
//             !d.rawResult.allTags.includes('q_AVE') &&
//             !d.rawResult.allTags.includes('q_MAT') &&
//             d.rawResult.allTags.filter(function(e) { return /q_INC_*/g.test(e) })[0] === undefined &&
//             !d.rawResult.allTags.includes('q_ETRE') &&
//             !d.rawResult.allTags.includes("q_ETOU")) {
//                 d.effects.push("Sonné")
//             }
//             d.nonLetal = true
//         },
//         'PAR': function() {},
//         'PERS': function(d, lvl) { d.effects.push("Persistant: " + lvl + "d6/" + d.nbEffects) },
//         'RED': function(d, lvl) { d.mentalDamage += d.nbEffects * lvl },
//         'SUB': function() {},
//         'VOL': function() {},
//         'ZON': function(d) { d.effects.push(d.nbEffects + " cibles supplémentaires") }
//     }

//     // Constructor
//     const that = this
//     result.allTags.filter(function(e) { return /q_*/g.test(e) }).forEach(function(tag) {
//         const qualityId = tag.split('_')[1]
//         const lvl = tag.split('_')[2]
//         if(that.nbEffects > 0 || qualityId === 'INT') {
//             if(lvl === undefined) {
//                 that.qualityEffects[qualityId as WeaponQualityId](that, letterToInt(lvl))
//             } else {
//                 that.qualityEffects[qualityId as WeaponQualityId](that, 1)
//             }
//         }
//     })

//     this.getEffects = function() {
//         const effects = this.effects
//         if(this.intense) {
//             effects.push("+1 dommage")
//         }
//         if(this.mentalDamage > 0) {
//             effects.push(this.mentalDamage + " dégâts mentaux")
//         }
//         if(this.additionalLocalisations > 0) {
//             effects.push(this.additionalLocalisations + " localisations supplémentaires")
//         }
//         return effects
//     }
    
//     this.getBadEffects = function() {
//         const badEffects = this.badEffects
//         if(this.selfDamage > 0) {
//             badEffects.push(this.selfDamage + " dégât(s) subis")
//         }
//         return badEffects
//     }
// } as any as { new (result: DiceResult): DamageDiceResultWrapper }

// DamageDiceResultWrapper.prototype = Object.create(DiceResultWrapper.prototype);


export class DamageDiceResultWrapper extends DiceResultWrapper {

    private selfDamage: number = 0
    private mentalDamage: number = 0
    private intense: boolean = false
    private nonletal: boolean = true
    private additionalLocalisations: number = 0
    private effects: string[] = []
    private badEffects: string[] = []
    private nbEffects: number = 0
    private qualityEffect: Record<WeaponQualityId, (damageMetadata: DamageDiceResultWrapper, level: number) => void> = {
        'AVE' : function(d) { d.effects.push("Aveuglant") },
        'CRU': function(d, lvl) { d.success += d.nbEffects * lvl },
        'BOU': function() {},
        'JET': function() {},
        'CAV': function(d, lvl) { if(d.rawResult.allTags.includes('mounted')) { d.success += d.nbEffects * lvl } },
        'PERF': function(d, lvl) { d.effects.push("-" + (d.nbEffects * lvl) + " à l'encaissement") },
        'CON': function(d, lvl) { d.selfDamage += d.nbEffects * lvl },
        'ETEN': function(d, lvl) { d.additionalLocalisations += d.nbEffects * lvl },
        'ETOU': function(d) { d.effects.push("Désorienté (" + d.nbEffects + ")") },
        'CACH': function() {},
        'ETRE': function(d) { d.effects.push("Immobilisé") },
        'FRA': function(d) { d.badEffects.push("L'arme perd " + d.nbEffects + " dégât(s)")},
        'IMP': function(d) { d.success -= d.nbEffects},
        'INC': function(d, lvl) { d.effects.push("Enflammé: " + lvl + "d6/" + d.nbEffects)},
        'INT': function(d) { d.intense = true },
        'LET': function(d) { 
            if(d.rawResult.allTags.includes('exploitation')) {
                 d.success += d.nbEffects * 2 
                 d.intense = true
            }
        },
        'MAT': function(d) { d.effects.push("Mise à terre (" + d.nbEffects + ")") },
        'NLET': function(d) { if(
            !d.rawResult.allTags.includes('q_EMP') &&
            !d.rawResult.allTags.includes('q_AVE') &&
            !d.rawResult.allTags.includes('q_MAT') &&
            d.rawResult.allTags.filter(function(e) { return /q_INC_*/g.test(e) })[0] === undefined &&
            !d.rawResult.allTags.includes('q_ETRE') &&
            !d.rawResult.allTags.includes("q_ETOU")) {
                d.effects.push("Sonné")
            }
            d.nonletal = true
        },
        'PAR': function() {},
        'PERS': function(d, lvl) { d.effects.push("Persistant: " + lvl + "d6/" + d.nbEffects) },
        'RED': function(d, lvl) { d.mentalDamage += d.nbEffects * lvl },
        'SUB': function() {},
        'VOL': function() {},
        'ZON': function(d) { d.effects.push(d.nbEffects + " cibles supplémentaires") }
    }
    private readonly talentDamageEffects: Record<TalentId, (result: DamageDiceResultWrapper, lvl: number) => void> = {
        'AGI': function(r) { r.rerollable = true },
        'AGIFEL' : function(r) { r.pertinentTalents.push('AGIFEL') },
        'MESS' : function(r) { r.pertinentTalents.push('MESS') }
    }

    constructor(result: DiceResult) {
        super(result)
        this.nbEffects = result.all.filter(function(roll) { return roll.value === 5 || roll.value === 6 }).length
        const that = this
        result.allTags.filter(function(e) { return /q_*/g.test(e) }).forEach(function(tag) {
            const qualityId = tag.split('_')[1]
            const lvl = tag.split('_')[2]
            if(that.nbEffects > 0 || qualityId === 'INT') {
                if(lvl === undefined) {
                    that.qualityEffect[qualityId as WeaponQualityId](that, letterToInt(lvl))
                } else {
                    that.qualityEffect[qualityId as WeaponQualityId](that, 1)
                }
            }
        })
    }

    isNonLetal() { return this.nonletal }

    getBadEffects() {
        return this.badEffects
    }

    getEffects() {
        return this.effects
    }
}