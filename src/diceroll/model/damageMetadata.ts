import { letterToInt } from "../../util/utils"
import { WeaponQualityId } from "../../weapons/types/weaponData"

export class RollMetadata {
    constructor(result: DiceResult) {
        this.success = result.success
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
        this.rawResult = result
    }
    success: number
    private readonly fumbles: number
    protected readonly rawResult: DiceResult
    getRawResult() {
        return this.rawResult
    }
    getFumbles() {
        return this.fumbles
    }
    nbAttackDice: number
}


type QualityEffect = Record<WeaponQualityId, (damageMetadata: DamageMetadata, level: number) => void>
export class DamageMetadata extends RollMetadata {
    constructor(result: DiceResult) {
        super(result)
        this.success = result.success
        this.nbEffects = result.all.filter(function(roll) { return roll.value === 5 || roll.value === 6 }).length
        //this.rawResult = result
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
    private selfDamage: number = 0
    private mentalDamage: number = 0
    private intense: boolean = false
    private nonletal: boolean = true
    private additionalLocalisations: number = 0
    private effects: string[] = []
    private badEffects: string[] = []
    private nbEffects: number
    //private readonly rawResult: DiceResult
    private qualityEffect: QualityEffect = {
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
            !d.rawResult.allTags.includes("q_ETRE") &&
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
    getEffects() {
        const effects = this.effects
        if(this.intense) {
            effects.push("+1 dommage")
        }
        if(this.mentalDamage > 0) {
            effects.push(this.mentalDamage + " dégâts mentaux")
        }
        if(this.additionalLocalisations > 0) {
            effects.push(this.additionalLocalisations + " localisations supplémentaires")
        }
        return effects
    }
    getBadEffects() {
        const badEffects = this.badEffects
        if(this.selfDamage > 0) {
            badEffects.push(this.selfDamage + " dégât(s) subis")
        }
        return badEffects
    }
    getNonLetal() { return this.nonletal }
}


export class DiceResultPopup {
    constructor(sheet: Sheet<DiceResultData>) {
        this.sheet = sheet
    }
    readonly sheet: Sheet<DiceResultData>

    setDamageButton(metadata: RollMetadata) {
        const damageRoll = new RollBuilder(this.sheet)
        this.sheet.get("damage_Btn").on("click", function() { 
            // Expression pour convertir le d6 au format CONAN (1=1,2=2,3=0,4=0,5=1+effet,6=1+effet)
            let damageExpression = metadata.nbAttackDice + "d6 <{2:2,3:0,4:0,5:1,6:1} 7"
            const damageTags = metadata.getRawResult().allTags.filter(function(e){return e !== "attack"})
            damageTags.push("damage")
            // Ajout des qualités
            damageExpression += "[" + damageTags.join() + "]"
            damageRoll.expression(damageExpression)
                .visibility("visible")
                .title("Dégâts")
            damageRoll.roll() 
        })
    }
    
    setRerollButton(metadata: RollMetadata | DamageMetadata, rerollable: boolean) {
        if(rerollable) {
            const rerollChoices:Record<string, string> = {}
            metadata.getRawResult().all.forEach(function(roll, index) {
                rerollChoices[index.toString()] = roll.value.toString()
            });
            (this.sheet.get("reroll") as ChoiceComponent).setChoices(rerollChoices)
            const that = this
            this.sheet.get("reroll_Btn").on("click", function() {
                // Construction de l'expression
                const rerollDice = Dice.create(metadata.getRawResult().expression.replace(/[0-9]+d/i, that.sheet.get("reroll").value().length + "d")).tag("reroll")
                Dice.roll(that.sheet, rerollDice, metadata.getRawResult().title)
            })
        } else {
            this.sheet.get("reroll").hide()
            this.sheet.get("reroll_Btn").hide()
        }
    }

    setTotalLabel(rollMetadata: RollMetadata) {
        this.sheet.get('total').text(rollMetadata.success + " succès")
    }
}

export class DamageResultPopup extends DiceResultPopup {
    override setTotalLabel(damageMetadata: DamageMetadata) {
        if(damageMetadata.getNonLetal()) {
            this.sheet.get('total').text("Non létal")
        } else {
            this.sheet.get('total').text(damageMetadata.getDamage() + " dégât(s)")
        }
    }
}