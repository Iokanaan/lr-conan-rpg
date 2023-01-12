import { DiceResultWrapper } from "../wrapper/diceResultWrapper"

export interface DiceResultPopup<T = DiceResultWrapper> extends Sheet<unknown> {
    sourceSheet: Sheet<CharData>
    render: (result: T) => void
    renderTotalLabel: (result: T) => void
    renderFumbles: (result: T) => void
    renderDamageButton: (result: T) => void
    renderRerollButton: (result: T) => void
    renderInfos: (result: T) => void
}

export const DiceResultPopup = function(this: DiceResultPopup, sourceSheet: Sheet<CharData>) {
    this.sourceSheet = sourceSheet
    this.render = function(result) {
        this.renderTotalLabel(result)
        if(result.fumbles > 0) {
            this.renderFumbles(result)
        }
        if(result.nbAttackDice > 0) {
            this.renderDamageButton(result)
        }
        if(result.rerollable) {
            this.renderRerollButton(result)
        }

        if(result.pertinentTalents.length !== 0) {
            this.renderInfos(result)
        } else {
            this.get('info_Container').removeClass("border")
            this.get('info_Container').removeClass("border-secondary")
            this.get('info_Container').removeClass("m-2")
            this.get('info_Container').removeClass("p-2")
        }
    }

    this.renderTotalLabel = function(result: DiceResultWrapper) {
        this.get('total').text(result.success + " succès")
    }

    this.renderFumbles = function(result: DiceResultWrapper) {
        // Gestion des fumbles
       this.get('fumble').text(result.fumbles + " complication(s)")
       this.get('fumble').show()
    }
    this.renderDamageButton = function(result) {
        const damageRoll = new RollBuilder(sourceSheet)
        this.get("damage_Btn").on("click", function() { 
            // Expression pour convertir le d6 au format CONAN (1=1,2=2,3=0,4=0,5=1+effet,6=1+effet)
            let damageExpression = result.nbAttackDice + "d6 <{2:2,3:0,4:0,5:1,6:1} 7"
            result.rawResult.allTags.push('dm')
            // Ajout des qualités
            damageExpression += "[" + result.rawResult.allTags.join() + "]"
            damageRoll.expression(damageExpression)
                .visibility("visible")
                .title("Dégâts")
            damageRoll.roll() 
        })
        this.get("damage_Btn").show()
    }
        
    this.renderRerollButton = function(result) {
        const rerollChoices: Record<string, string> = {}
        result.rawResult.all.forEach(function(roll, index) {
            rerollChoices[index.toString()] = roll.value.toString()
        });
        (this.get("reroll") as ChoiceComponent).setChoices(rerollChoices)
        const that = this
        this.get("reroll_Btn").on("click", function() {
            // Construction de l'expression
            const rerollDice = Dice.create(result.rawResult.expression.replace(/[0-9]+d/i, that.get("reroll").value().length + "d")).tag("reroll")
            Dice.roll(sourceSheet, rerollDice, result.rawResult.title)
        })
        this.get("reroll_Btn").show()
    }

    this.renderInfos = function(result) {
        this.get("infos").value("Talents pertinents:\n" + result.pertinentTalents.map(function(t) { return Tables.get("talents").get(t).name}).join("\n "))
        if(this.get("infos").value().includes('¹')) {
            this.get('info_notes_1').show()
        }
        this.get("infos").show()
    }

    return this

} as any as { (sourceSheet: Sheet<CharData>): DiceResultPopup}
