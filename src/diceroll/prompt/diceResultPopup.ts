import { DiceResultWrapper } from "../wrapper/diceResultWrapper"

export interface DiceResultPopup<T = DiceResultWrapper> {
    sheet: Sheet<unknown>
    render: (result: T) => void
    renderTotalLabel: (result: T) => void
    renderFumbles: (result: T) => void
    renderDamageButton: (result: T) => void
    renderRerollButton: (result: T) => void
    renderInfos: (result: T) => void
}

export const DiceResultPopup = function(this: DiceResultPopup, sheet: Sheet<unknown>) {
    this.sheet = sheet
    this.render = function(result) {
        log("render total")
        this.renderTotalLabel(result)
        log("done")
        if(result.fumbles > 0) {
            this.renderFumbles(result)
        }
        if(result.rawResult.allTags.includes("attack")) {
            this.renderDamageButton(result)
        }
        if(result.rerollable) {
            this.renderRerollButton(result)
        }

        if(result.pertinentTalents.length !== 0) {
            this.renderInfos(result)
        } else {
            this.sheet.get('info_Container').removeClass("border")
            this.sheet.get('info_Container').removeClass("border-secondary")
            this.sheet.get('info_Container').removeClass("m-2")
            this.sheet.get('info_Container').removeClass("p-2")
        }
    }

    this.renderTotalLabel = function(result: DiceResultWrapper) {
        this.sheet.get('total').text(result.success + " succès")
    }

    this.renderFumbles = function(result: DiceResultWrapper) {
        // Gestion des fumbles
       this.sheet.get('fumble').text(result.fumbles + " complication(s)")
       this.sheet.get('fumble').show()
    }
    
    this.renderDamageButton = function(result) {
        const damageRoll = new RollBuilder(this.sheet)
        this.sheet.get("damage_Btn").on("click", function() { 
            // Expression pour convertir le d6 au format CONAN (1=1,2=2,3=0,4=0,5=1+effet,6=1+effet)
            let damageExpression = result.nbAttackDice + "d6 <{2:2,3:0,4:0,5:1,6:1} 7"
            const damageTags = result.rawResult.allTags.filter(function(e){return e !== "attack"})
            damageTags.push("damage")
            // Ajout des qualités
            damageExpression += "[" + damageTags.join() + "]"
            damageRoll.expression(damageExpression)
                .visibility("visible")
                .title("Dégâts")
            damageRoll.roll() 
        })
    }
        
    this.renderRerollButton = function(result) {
        const rerollChoices:Record<string, string> = {}
        result.rawResult.all.forEach(function(roll, index) {
            rerollChoices[index.toString()] = roll.value.toString()
        });
        (this.sheet.get("reroll") as ChoiceComponent).setChoices(rerollChoices)
        const that = this
        this.sheet.get("reroll_Btn").on("click", function() {
            // Construction de l'expression
            const rerollDice = Dice.create(result.rawResult.expression.replace(/[0-9]+d/i, that.sheet.get("reroll").value().length + "d")).tag("reroll")
            Dice.roll(that.sheet, rerollDice, result.rawResult.title)
        })
    }

    this.renderInfos = function(result) {
        this.sheet.get("infos").value("Talents pertinents:\n" + result.pertinentTalents.map(function(t) { return Tables.get("talents").get(t).name}).join("\n "))
        if(!this.sheet.get("infos").value().includes('¹')) {
            this.sheet.get('info_notes_1').hide()
        }
    }

} as any as { new (sheet: Sheet<unknown>): DiceResultPopup}


// export class DiceResultPopup {

//     protected readonly sheet: Sheet<unknown>

//     constructor(sheet: Sheet<unknown>) {
//         this.sheet = sheet
//     }

//     render(metadata: DiceResultWrapper) {

//         this.renderTotalLabel(metadata)

//         if(metadata.getFumbles() > 0) {
//             this.renderFumbles(metadata)
//         }
//         if(metadata.getRawResult().allTags.includes("attack")) {
//             this.renderDamageButton(metadata)
//         }
//         if(metadata.isRerollable()) {
//             this.renderRerollButton(metadata)
//         }

//         if(metadata.getPertinentTalents().length !== 0) {
//             this.renderInfos(metadata)
//         } else {
//             this.sheet.get('info_Container').removeClass("border")
//             this.sheet.get('info_Container').removeClass("border-secondary")
//             this.sheet.get('info_Container').removeClass("m-2")
//             this.sheet.get('info_Container').removeClass("p-2")
//         }
//     }

//     renderTotalLabel(metadata: DiceResultWrapper) {
//         this.sheet.get('total').text(metadata.getSuccess() + " succès")
//     }

//     renderDamageButton(metadata: DiceResultWrapper) {
//         const damageRoll = new RollBuilder(this.sheet)
//         this.sheet.get("damage_Btn").on("click", function() { 
//             // Expression pour convertir le d6 au format CONAN (1=1,2=2,3=0,4=0,5=1+effet,6=1+effet)
//             let damageExpression = metadata.getNbAttackDice() + "d6 <{2:2,3:0,4:0,5:1,6:1} 7"
//             const damageTags = metadata.getRawResult().allTags.filter(function(e){return e !== "attack"})
//             damageTags.push("damage")
//             // Ajout des qualités
//             damageExpression += "[" + damageTags.join() + "]"
//             damageRoll.expression(damageExpression)
//                 .visibility("visible")
//                 .title("Dégâts")
//             damageRoll.roll() 
//         })
//     }
    
//     renderRerollButton(metadata: DiceResultWrapper) {
//         const rerollChoices:Record<string, string> = {}
//         metadata.getRawResult().all.forEach(function(roll, index) {
//             rerollChoices[index.toString()] = roll.value.toString()
//         });
//         (this.sheet.get("reroll") as ChoiceComponent).setChoices(rerollChoices)
//         const that = this
//         this.sheet.get("reroll_Btn").on("click", function() {
//             // Construction de l'expression
//             const rerollDice = Dice.create(metadata.getRawResult().expression.replace(/[0-9]+d/i, that.sheet.get("reroll").value().length + "d")).tag("reroll")
//             Dice.roll(that.sheet, rerollDice, metadata.getRawResult().title)
//         })
//     }

//     renderInfos(metadata: DiceResultWrapper) {
//         this.sheet.get("infos").value("Talents pertinents:\n" + metadata.getPertinentTalents().map(function(t) { return Tables.get("talents").get(t).name}).join("\n "))
//         if(!this.sheet.get("infos").value().includes('¹')) {
//             this.sheet.get('info_notes_1').hide()
//         }
//     }

//     renderFumbles(metadata: DiceResultWrapper) {
//          // Gestion des fumbles
//         this.sheet.get('fumble').text(metadata.getFumbles() + " complication(s)")
//         this.sheet.get('fumble').show()
//     }

// }