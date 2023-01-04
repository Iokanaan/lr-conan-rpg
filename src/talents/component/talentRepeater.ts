import { setupRepeater } from "../../util/utils"
import { TalentEditEntry } from "./talentEditEntry"

export interface TalentRepeater extends Component<Record<string, TalentData>> {
    setListeners: () => TalentRepeater
}

export const TalentRepeater = function (this: TalentRepeater) {
    this.setListeners = function() {
        setupRepeater(this, function(entry: Component<TalentData>) {
            TalentEditEntry
                .call(entry)
                .setDefaultData()
                .setListeners()
        })
        return this
    }
    return this
} as any as { (): TalentRepeater }