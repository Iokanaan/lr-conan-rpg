
import { DamageDiceResultWrapper } from "../wrapper/damageDiceResultWrapper"
import { DiceResultPopup } from "./diceResultPopup"

export interface DamageDiceResultPopup extends DiceResultPopup<DamageDiceResultWrapper> {
    sourceSheet: Sheet<CharData>
    renderEffects: (result: DamageDiceResultWrapper) => void
    renderTotalLabel: (result: DamageDiceResultWrapper) => void
}

export const DamageDiceResultPopup = function(this: DamageDiceResultPopup, sourceSheet: Sheet<CharData>) {
        // Super
        DiceResultPopup.call(this as any as DiceResultPopup, sourceSheet) 
        this.render = function(result: DamageDiceResultWrapper) {
            this.renderTotalLabel(result)

            if(result.rawResult.allTags.some(function(e) { /^d_/g.test(e) })) {
                this.renderDamageButton(result)
            }
            
            if(result.rerollable) {
                this.renderRerollButton(result)
            }
            
            if(result.effects.length > 0) {
                this.renderEffects(result)
            }

            if(result.badEffects.length > 0) {
                this.renderFumbles(result)
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

        this.renderTotalLabel = function(result: DamageDiceResultWrapper) {
            if(result.nonLetal) {
                this.get('total').text("Non létal")
            } else {
                this.get('total').text(result.success + " dégât(s)")
            }
        }
    
        this.renderFumbles = function(result: DamageDiceResultWrapper) {
            this.get('fumble').text(result.badEffects.join("\n"))
            this.get('fumble').show()
        }
    
        this.renderEffects = function(result: DamageDiceResultWrapper) {
            this.get('effect').text(result.effects.join("\n"))
            this.get('effect').show()
        }

        return this 
} as any as { (sourceSheet: Sheet<CharData>): DamageDiceResultPopup }
