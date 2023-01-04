import { TalentId } from "../../talents/types/talentTypes"
import { charToInt } from "../../util/utils"
import { WeaponQualityId } from "../../weapons/types/weaponTypes"
import { DiceResultWrapper, TagCategory } from "./diceResultWrapper"

export interface DamageDiceResultWrapper extends DiceResultWrapper {
    selfDamage: number
    mentalDamage: number
    intense: boolean
    nonLetal: boolean
    additionalLocalisations: number
    effects: string[]
    badEffects: string[]
    nbEffects: number
    qualityActions: Record<WeaponQualityId, (level: number) => void>
    allEffects: string[]
    allBadEffects: string[]
}

export const DamageDiceResultWrapper = function(this: DamageDiceResultWrapper, result: DiceResult) {
    // Super
    DiceResultWrapper.call(this, result) 
    // Default values
    this.selfDamage = 0
    this.mentalDamage = 0
    this.intense = false
    this.nonLetal = false
    this.additionalLocalisations = 0
    this.effects = []
    this.badEffects = []
    this.nbEffects = result.all.filter(function(roll) { return roll.value === 5 || roll.value === 6 }).length
    this.qualityActions = {
        'AVE' : function(this: DamageDiceResultWrapper) { 
            if(this.nbEffects > 0) {
                this.effects.push("Aveuglant") 
            }
        },
        'CRU': function(this: DamageDiceResultWrapper, lvl) { this.success += this.nbEffects * lvl },
        'BOU': function() {},
        'JET': function() {},
        'CAV': function(this: DamageDiceResultWrapper, lvl) { 
            if(this.rawResult.allTags.includes('mounted')) { 
                this.success += this.nbEffects * lvl 
            } 
        },
        'PERF': function(this: DamageDiceResultWrapper, lvl) {
            if(this.nbEffects > 0) {
                this.effects.push("-" + (this.nbEffects * lvl) + " à l'encaissement")
            } 
         },
        'CON': function(this: DamageDiceResultWrapper, lvl) { this.selfDamage += this.nbEffects * lvl },
        'ETEN': function(this: DamageDiceResultWrapper, lvl) { this.additionalLocalisations += this.nbEffects * lvl },
        'ETOU': function(this: DamageDiceResultWrapper) { 
            if(this.nbEffects > 0) {
                this.effects.push("Désorienté (" + this.nbEffects + ")") 
            }
        },
        'CACH': function() {},
        'ETRE': function(this: DamageDiceResultWrapper) { 
            if(this.nbEffects > 0) {
                this.effects.push("Immobilisé") 
            }
        },
        'FRA': function(this: DamageDiceResultWrapper) { 
            if(this.nbEffects > 0) {
                this.badEffects.push("L'arme perd " + this.nbEffects + " dégât(s)")
            }
        },
        'IMP': function(this: DamageDiceResultWrapper) { this.success -= this.nbEffects},
        'INC': function(this: DamageDiceResultWrapper, lvl) { 
            if(this.nbEffects > 0) {
                this.effects.push("Enflammé: " + lvl + "d6/" + this.nbEffects)
            }
        },
        'INT': function(this: DamageDiceResultWrapper) { this.intense = true },
        'LET': function(this: DamageDiceResultWrapper) { 
            if(this.rawResult.allTags.includes('exploitation')) {
                this.success += this.nbEffects * 2 
                this.intense = true
            }
        },
        'MAT': function(this: DamageDiceResultWrapper) { 
            if(this.nbEffects > 0) {
                this.effects.push("Mise à terre (" + this.nbEffects + ")") 
            }
        },
        'NLET': function(this: DamageDiceResultWrapper) { if(
            this.nbEffects > 0 &&
            !this.rawResult.allTags.includes('q_EMP') &&
            !this.rawResult.allTags.includes('q_AVE') &&
            !this.rawResult.allTags.includes('q_MAT') &&
            this.rawResult.allTags.filter(function(e) { return /^q_INC/g.test(e) })[0] === undefined &&
            !this.rawResult.allTags.includes('q_ETRE') &&
            !this.rawResult.allTags.includes("q_ETOU")) {
                this.effects.push("Sonné")
            }
            this.nonLetal = true
        },
        'PAR': function() {},
        'PERS': function(this: DamageDiceResultWrapper, lvl) { 
            if(this.nbEffects) {
                this.effects.push("Persistant: " + lvl + "d6/" + this.nbEffects) 
            }
        },
        'RED': function(this: DamageDiceResultWrapper, lvl) { this.mentalDamage += this.nbEffects * lvl },
        'SUB': function() {},
        'VOL': function() {},
        'ZON': function(this: DamageDiceResultWrapper) { 
            if(this.nbEffects > 0) {
                this.effects.push(this.nbEffects + " cibles supplémentaires") 
            }
        }
    }
    this.tagActions = {
        's': function() {},
        'd': function() {},
        'v': function() {},
        't': function(this: DamageDiceResultWrapper, lvl, label) {
            if(Tables.get("talents").get(label as TalentId).skill === this.skillId) {
                this.talentActions[label as TalentId].call(this, lvl)
            }
        },
        'q': function(this: DamageDiceResultWrapper, lvl, label) { this.qualityActions[label as WeaponQualityId].call(this, lvl) },
        'ns': function() {},
        'dm': function() {}
    }
    
    // Constructor
    for(var idx in result.allTags) {
        const tagInfos = result.allTags[idx].split('_')
        this.tagActions[tagInfos[0] as TagCategory].call(this, charToInt(tagInfos[2]), tagInfos[1])
    }

    if(this.intense) {
        this.effects.push("+1 dommage")
    }
    
    if(this.mentalDamage > 0) {
        this.effects.push("+" + this.mentalDamage + " dégâts mentaux")
    }

    if(this.additionalLocalisations > 0) {
        this.effects.push(this.additionalLocalisations + " localisations supplémentaires")
    }
    
    if(this.selfDamage > 0) {
        this.badEffects.push(this.selfDamage + " dégât(s) subis")
    }

    return this

} as any as { (result: DiceResult): DamageDiceResultWrapper }