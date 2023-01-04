import { ArmorData } from "../types/ArmorTypes"
import { ArmorEditEntry } from "./armorEditEntry"

export interface ArmorRepeater extends Component<Record<string, ArmorData>> {
    setListeners: () => ArmorRepeater
}

export const ArmorRepeater = function (this: ArmorRepeater) {
    this.setListeners = function() {
        // setupRepeater(this, function(entry: Component<ArmorData>) {
        //     ArmorEditEntry
        //         .call(entry)
        //         .setDefaultData()
        //         .setListeners()
        // })
        return this
    }
} as any as { (): ArmorRepeater }