import { getLabel, variableQualities } from "../utils/qualityUtils";
import { chargesHandler, handleCharges, qualityHandler, qualityLevelHandler, weaponChoiceHandler } from "../business/weaponEditEntry";
import { WeaponData, WeaponQualityId, WeaponTypeId, WeaponWielding, WeaponWieldingId, weaponWieldingsInt } from "../types/weaponTypes";

export interface WeaponEditEntry extends Component<WeaponData> {
    setDefaultData: () => WeaponEditEntry
    setListeners: () => WeaponEditEntry
    setQualityInputs: (qualityIds: WeaponQualityId[]) => WeaponEditEntry
    setCharges: (typeId: WeaponTypeId) => WeaponEditEntry
}

export const WeaponEditEntry = function (this: WeaponEditEntry) {

    this.setDefaultData = function() {
        this.setQualityInputs(this.value().qualities_Choice)
        this.setCharges(this.value().type_Choice)
        this.find('wielding_Choice_as_Int').value(weaponWieldingsInt[this.value().wielding_Choice as WeaponWieldingId])
        return this
    }

    this.setListeners = function() {
        // Afficher les valeurs de qualités nécessaires et mettre à jour la liste des qualités à l'update sur les checkbox
        this.find("qualities_Choice").on("update", qualityHandler(this))
        // Update la iste des qualités à l'update des valeurs sur les qualités
        for(var idx in variableQualities) {
            this.find(getLabel(variableQualities[idx].id)).on('update', qualityLevelHandler(this))
        }
        // Toggle l'affichage des munitions
        this.find("type_Choice").on("update", chargesHandler(this))
        // Set size choice as int
        // Update wielding choice accordingly
        this.find("size_Choice").on("update", weaponChoiceHandler(this) )
        return this
    }

    this.setQualityInputs = function(qualityIds) {
        for(var idx in variableQualities) {
            let quality = variableQualities[idx]
            if (qualityIds.includes(quality.id)) {
                this.find(quality.id + "_Label").show();
                this.find(getLabel(quality.id)).show();
            } else {
                this.find(quality.id + "_Label").hide();
                this.find(getLabel(quality.id)).hide();
            }
        }
        return this
    }

    this.setCharges = function(typeId: WeaponTypeId) {
        handleCharges(this, typeId)
        return this
    }

    return this

} as any as { (): WeaponEditEntry }
