
import { DamageDiceResultWrapper } from "../wrapper/damageDiceResultWrapper"
import { DiceResultPopup } from "./diceResultPopup"

export interface DamageDiceResultPopup extends DiceResultPopup<DamageDiceResultWrapper> {
    renderEffects: (result: DamageDiceResultWrapper) => void
    renderTotalLabel: (result: DamageDiceResultWrapper) => void
}

export const DamageDiceResultPopup = function(this: DamageDiceResultPopup, sheet: Sheet<unknown>) {
        // Super
        DiceResultPopup.call(this as any as DiceResultPopup, sheet) 
        this.render = function(result: DamageDiceResultWrapper) {
            this.renderTotalLabel(result)

            if(result.rawResult.allTags.includes("attack")) {
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
                this.sheet.get('info_Container').removeClass("border")
                this.sheet.get('info_Container').removeClass("border-secondary")
                this.sheet.get('info_Container').removeClass("m-2")
                this.sheet.get('info_Container').removeClass("p-2")
            }   
        }

        this.renderTotalLabel = function(result: DamageDiceResultWrapper) {
            if(result.nonLetal) {
                this.sheet.get('total').text("Non létal")
            } else {
                this.sheet.get('total').text(result.success + " dégât(s)")
            }
        }
    
        this.renderFumbles = function(result: DamageDiceResultWrapper) {
            this.sheet.get('fumble').text(result.getBadEffects().join("\n"))
            this.sheet.get('fumble').show()
        }
    
        this.renderEffects = function(result: DamageDiceResultWrapper) {
            this.sheet.get('effect').text(result.getEffects().join("\n"))
            this.sheet.get('effect').show()
        }
} as any as { new (result: Sheet<unknown>): DamageDiceResultPopup }


// export class DamageDiceResultPopup extends DiceResultPopup {
//     constructor(sheet: Sheet<unknown>) {
//         super(sheet)
//     }
    
//     override render(result: DamageDiceResultWrapper) {

//         this.renderTotalLabel(result)

//         if(result.getRawResult().allTags.includes("attack")) {
//             this.renderDamageButton(result)
//         }
//         if(result.isRerollable()) {
//             this.renderRerollButton(result)
//         }
//         if(result.getEffects().length > 0) {
//             this.renderEffects(result)
//         }
//         if(result.getBadEffects().length > 0) {
//             this.renderFumbles(result)
//         }
//         if(result.getPertinentTalents().length !== 0) {
//             this.renderInfos(result)
//         } else {
//             this.sheet.get('info_Container').removeClass("border")
//             this.sheet.get('info_Container').removeClass("border-secondary")
//             this.sheet.get('info_Container').removeClass("m-2")
//             this.sheet.get('info_Container').removeClass("p-2")
//         }
//     }

//     override renderTotalLabel(metadata: DamageDiceResultWrapper) {
//         if(metadata.isNonLetal()) {
//             this.sheet.get('total').text("Non létal")
//         } else {
//             this.sheet.get('total').text(metadata.getSuccess() + " dégât(s)")
//         }
//     }

//     override renderFumbles(metadata: DamageDiceResultWrapper) {
//         this.sheet.get('fumble').text(metadata.getBadEffects().join("\n"))
//         this.sheet.get('fumble').show()
//     }

//     renderEffects(metadata: DamageDiceResultWrapper) {
//         this.sheet.get('effect').text(metadata.getEffects().join("\n"))
//         this.sheet.get('effect').show()
//     }
// }