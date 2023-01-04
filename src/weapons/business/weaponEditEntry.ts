import { WeaponEditEntry } from "../component/weaponEditEntry"
import { WeaponQualityId, WeaponSizeId, weaponSizesInt, WeaponTypeId, weaponTypesInt, WeaponWieldingId, weaponWieldingsInt } from "../types/weaponTypes"
import { processQualitiesLabel } from "../utils/qualityUtils"


export const qualityHandler = function(entry: WeaponEditEntry): (target: LrEvent<WeaponQualityId[]>) => void {
    return function(target) {
        entry.setQualityInputs(target.value())
        entry.find('qualities_Input').value(processQualitiesLabel(entry.value()).join(", "))
        if(target.value().includes("JET")) {
            entry.find("throwable_as_Int").value(1)
        } else {
            entry.find("throwable_as_Int").value(0)
        }
    }
}

export const qualityLevelHandler = function(entry: WeaponEditEntry): () => void {
    return function() {
        entry.find('qualities_Input').value(processQualitiesLabel(entry.value()).join(", "))
    }
}

export const chargesHandler = function(entry: WeaponEditEntry): (target: LrEvent<WeaponTypeId>) => void {
    return function(target) {
        handleCharges(entry, target.value())
    }
}

export const handleCharges = function(entry: WeaponEditEntry, type: WeaponTypeId) {
    entry.find('type_Choice_as_Int').value(weaponTypesInt[type])
    if(type === "ranged") {
        // Alimentation du champ integer pour les champs calculés
        entry.find("charges_Input").show()
        entry.find("charges_Label").show()
    } else {
        // Alimentation du champ integer pour les champs calculés
        entry.find("charges_Input").hide()
        entry.find("charges_Label").hide()
    }
}

export const weaponChoiceHandler = function(entry: WeaponEditEntry): (target: LrEvent<WeaponSizeId>) => void {
    return function(target) {
        entry.find('size_Choice_as_Int').value(weaponSizesInt[target.value()])
        let wielding_Choice: WeaponWieldingId = "deuxMains"
        if(target.value() === "uneMain" || target.value() === "desequilibree") {
            wielding_Choice = "uneMain"
        }
        entry.find('wielding_Choice').value(wielding_Choice)
        entry.find('wielding_Choice_as_Int').value(weaponWieldingsInt[wielding_Choice])
    }
}